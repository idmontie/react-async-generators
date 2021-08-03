import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import Async from "./Async";

describe("generator components", () => {
	test("basic", async () => {
		function* Component({message}: {message: string}) {
			yield <span>{message} 1</span>;
			yield <span>{message} 2</span>;
			yield <span>{message} 3</span>;
		}

		const {container} = render(<Async render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 3")).toHaveLength(1));
		expect(screen.getAllByText("Hello 3")).toHaveLength(1);
	});

	test("with delay", async () => {
		async function* Component({ message }: { message: string }) {
			yield <span>{message} 1</span>;
			await new Promise(resolve => setTimeout(resolve, 10));
			yield <span>{message} 2</span>;
			await new Promise(resolve => setTimeout(resolve, 10));
			yield <span>{message} 3</span>;
		}

		const { container } = render(<Async render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 1")).toHaveLength(1));
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
		await waitFor(() => expect(screen.getAllByText("Hello 2")).toHaveLength(1));
		expect(screen.getAllByText("Hello 2")).toHaveLength(1);
		await waitFor(() => expect(screen.getAllByText("Hello 3")).toHaveLength(1));
		expect(screen.getAllByText("Hello 3")).toHaveLength(1);
	});

	test('with refresh', async () => {
		// Having a refresh as the second argument means the component will
		// take care of its own lifecycle.
		function* Component({ message }: { message: string }, _: () => void) {
			yield <span>{message} 1</span>;
			yield <span>{message} 2</span>;
			yield <span>{message} 3</span>;
		}

		const { container } = render(<Async render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 1")).toHaveLength(1));
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
		await new Promise(resolve => setTimeout(resolve, 10));
		// The second yield will never be called
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
	});
});
