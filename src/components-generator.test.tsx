import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import AsyncGenerator from "./AsyncGenerator";

describe("generator components", () => {
	test("basic", async () => {
		function* Component({message}: {message: string}) {
			yield <span>{message} 1</span>;
			yield <span>{message} 2</span>;
			yield <span>{message} 3</span>;
		}

		const {container} = render(<AsyncGenerator render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 3")).toHaveLength(1));
		expect(screen.getAllByText("Hello 3")).toHaveLength(1);
	});

	test("with delay", async () => {
		async function* Component({message}: {message: string}) {
			yield <span>{message} 1</span>;
			await new Promise((resolve) => setTimeout(resolve, 10));
			yield <span>{message} 2</span>;
			await new Promise((resolve) => setTimeout(resolve, 10));
			yield <span>{message} 3</span>;
		}

		const {container} = render(<AsyncGenerator render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 1")).toHaveLength(1));
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
		await waitFor(() => expect(screen.getAllByText("Hello 2")).toHaveLength(1));
		expect(screen.getAllByText("Hello 2")).toHaveLength(1);
		await waitFor(() => expect(screen.getAllByText("Hello 3")).toHaveLength(1));
		expect(screen.getAllByText("Hello 3")).toHaveLength(1);
	});

	test("with refresh", async () => {
		// Having a refresh as the second argument means the component will
		// take care of its own lifecycle.
		function* Component({message}: {message: string}, _: () => void) {
			yield <span>{message} 1</span>;
			yield <span>{message} 2</span>;
			yield <span>{message} 3</span>;
		}

		const {container} = render(<AsyncGenerator render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");
		await waitFor(() => expect(screen.getAllByText("Hello 1")).toHaveLength(1));
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
		await new Promise((resolve) => setTimeout(resolve, 10));
		// The second yield will never be called
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
	});

	test("yield from callback", async () => {
		function* Component({message}: {message: string}, refresh: () => void) {
			let count = 0;

			const handleClick = () => {
				count++;
				refresh();
			};

			while (true) {
				yield (
					<button onClick={handleClick}>
						{message} {count}
					</button>
				);
			}
		}

		const {container} = render(<AsyncGenerator render={Component} message="Hello" />);
		expect(container.innerHTML).toEqual("");

		await waitFor(() => expect(screen.getAllByText("Hello 0")).toHaveLength(1));
		expect(screen.getAllByText("Hello 0")).toHaveLength(1);

		// Find the button and click it
		await waitFor(() => {
			const button = screen.getByRole("button") as HTMLButtonElement;
			button.click();
		});

		await waitFor(() => expect(screen.getAllByText("Hello 1")).toHaveLength(1));
		expect(screen.getAllByText("Hello 1")).toHaveLength(1);
	});
});
