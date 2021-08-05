import React from "react";
import {render, waitFor} from "@testing-library/react";
import AsyncGenerator from "./AsyncGenerator";

describe("sync function component", () => {
	test("basic", async () => {
		async function Component({message}: {message: string}) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			return <span>{message}</span>;
		}

		const {container} = render(<AsyncGenerator render={Component} message="Hello" />);
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
			<AsyncGenerator render={Component} message="Hello" />,
		);
		expect(container.innerHTML).toEqual("");
		await waitFor(
			() => container.querySelector("span")!.textContent === "Hello",
		);
		expect(container.innerHTML).toEqual("<span>Hello</span>");
		rerender(<AsyncGenerator render={Component} message="World" />);
		await waitFor(
			() => container.querySelector("span")!.textContent === "World",
		);
		expect(container.innerHTML).toEqual("<span>World</span>");
	});
});
