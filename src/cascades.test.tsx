import React from "react";
import {render, screen} from "@testing-library/react";
import AsyncGenerator from "./AsyncGenerator";

describe("cascades", () => {
	test("sync function calls refresh directly", async () => {
		function Component(props: any, refresh: () => void) {
			refresh();
			return <div>Hello</div>;
		}

		const mock = jest.spyOn(console, "error").mockImplementation();
		try {
			render(<AsyncGenerator render={Component} />);
			expect(await screen.findAllByText("Hello")).toHaveLength(1);
			expect(mock).toHaveBeenCalled();
			expect(mock).toHaveBeenCalledWith(
				"Called refresh before component mounted",
			);
		} finally {
			mock.mockRestore();
		}
	});

	test("async function calls refresh directly", async () => {
		async function Component(props: any, refresh: () => void) {
			refresh();
			return <div>Hello</div>;
		}

		const mock = jest.spyOn(console, "error").mockImplementation();
		try {
			render(<AsyncGenerator render={Component} />);
			expect(await screen.findAllByText("Hello")).toHaveLength(1);
			expect(mock).toHaveBeenCalled();
		} finally {
			mock.mockRestore();
		}
	});

	test("sync generator calls refresh directly", async () => {
		function* Component(props: any, refresh: () => void) {
			while (true) {
				refresh();
				yield <div>Hello</div>;
			}
		}

		const mock = jest.spyOn(console, "error").mockImplementation();
		try {
			render(<AsyncGenerator render={Component} />);
			expect(await screen.findAllByText("Hello")).toHaveLength(1);
			expect(mock).toHaveBeenCalled();
		} finally {
			mock.mockRestore();
		}
	});

	test("async generator calls refresh directly, gets stuck after yield", async () => {
		async function* Component(
			props: any,
			refresh: () => void,
		): AsyncIterable<React.ReactNode> {
			yield <span>Hello</span>;
			refresh();
			yield <span>Hello again</span>;
		}

		const mock = jest.spyOn(console, "error").mockImplementation();
		try {
			render(<AsyncGenerator render={Component} />);
			expect(await screen.findAllByText("Hello")).toHaveLength(1);
			await new Promise((resolve) => setTimeout(resolve, 0));
			expect(await screen.findAllByText("Hello")).toHaveLength(1);

			// No error becasue refresh means the component controls its own
			// lifecycle.
			expect(mock).not.toHaveBeenCalled();
		} finally {
			mock.mockRestore();
		}
	});
});
