import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import AsyncGenerator from "./AsyncGenerator";

describe("sync function component", () => {
	test("basic", () => {
		function Component({message}: {message: string}) {
			return <span>{message}</span>;
		}

		const {rerender} = render(
			<div>
				<AsyncGenerator render={Component} message="Hello" />
			</div>,
		);

		expect(screen.getAllByText("Hello")).toHaveLength(1);

		rerender(
			<div>
				<AsyncGenerator render={Component} message="Goodbye" />
			</div>,
		);
		expect(screen.getAllByText("Goodbye")).toHaveLength(1);
	});

	test("rerender different return value", () => {
		function Component({ChildTag}: {ChildTag: keyof JSX.IntrinsicElements}) {
			return <ChildTag>Hello world</ChildTag>;
		}

		let {container} = render(
			<AsyncGenerator render={Component} ChildTag="div" />,
		);
		expect(container.innerHTML).toEqual("<div>Hello world</div>");
		({container} = render(
			<AsyncGenerator render={Component} ChildTag="span" />,
		));
		expect(container.innerHTML).toEqual("<span>Hello world</span>");
	});

	test("renders Async function children", async () => {
		function Child({message}: {message: string}) {
			return <div>{message}</div>;
		}

		function Parent({message}: {message: string}) {
			return <AsyncGenerator render={Child} message={message} />;
		}

		const p1 = render(<AsyncGenerator render={Parent} message="Hello 1" />);

		expect(p1.container.innerHTML).toEqual("<div>Hello 1</div>");
	});

	test("async children", async () => {
		const fn = jest.fn();
		async function Child({message}: {message: string}) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			fn();
			return <div>{message}</div>;
		}

		function Parent({message}: {message: string}) {
			return <AsyncGenerator render={Child} message={message} />;
		}

		const {container} = render(
			<AsyncGenerator render={Parent} message="Hello 1" />,
		);

		expect(container.innerHTML).toEqual("");
		await waitFor(() => new Promise((resolve) => setTimeout(resolve, 100)));
		expect(fn).toHaveBeenCalledTimes(1);
		expect(container.innerHTML).toEqual("<div>Hello 1</div>");
	});

	test("call refresh after unmount", async () => {
		const Component = ({message}: {message: string}, refresh: () => void) => {
			setTimeout(() => {
				refresh();
			}, 100);
			return <div>{message}</div>;
		};

		const mock = jest.spyOn(console, "error").mockImplementation();
		try {
			const {unmount} = render(
				<AsyncGenerator render={Component} message="Hello" />,
			);

			expect(mock).toHaveBeenCalledTimes(0);
			expect(screen.getAllByText("Hello")).toHaveLength(1);

			unmount();

			await waitFor(() => new Promise((resolve) => setTimeout(resolve, 100)));
			expect(mock).toHaveBeenCalledTimes(1);
			expect(mock).toHaveBeenCalledWith(
				"Called refresh after component unmounted",
			);
		} finally {
			mock.mockRestore();
		}
	});
});
