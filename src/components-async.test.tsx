import React from "react";
import {render, waitFor} from "@testing-library/react";
import Async from "./Async";

describe("sync function component", () => {
	test("basic", async () => {
		async function Component({message}: {message: string}) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return <span>{message}</span>;
		}

		const {container} = render(<Async render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");

		await waitFor(
			() => container.querySelector("span")!.textContent === "Hello",
		);

		expect(container.innerHTML).toEqual("<span>Hello</span>");
	});

	test("updates props", async () => {
		async function Component({message}: {message: string}) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return <span>{message}</span>;
		}

		const {container, rerender} = render(
			<Async render={Component} message="Hello" />,
		);
		expect(container.innerHTML).toEqual("");
		await waitFor(
			() => container.querySelector("span")!.textContent === "Hello",
		);
		expect(container.innerHTML).toEqual("<span>Hello</span>");
		rerender(<Async render={Component} message="World" />);
		await waitFor(
			() => container.querySelector("span")!.textContent === "World",
		);
		expect(container.innerHTML).toEqual("<span>World</span>");
	});
});
