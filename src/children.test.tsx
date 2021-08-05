import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import {asyncGen} from "./AsyncGenerator";

describe("children", () => {
	it("passes through children", async () => {
		const Parent = asyncGen(function* Parent({
			children,
		}: {
			children: React.ReactNode;
		}) {
			yield <div>{children}</div>;
		});

		const Child = asyncGen(function* Child({message}: {message: string}) {
			yield <div>{message}</div>;
		});

		const {rerender} = render(
			<Parent>
				<div>
					<Child message="Hello" />
				</div>
			</Parent>,
		);

		await waitFor(() => expect(screen.getAllByText("Hello")).toHaveLength(1));
		expect(screen.getAllByText("Hello")).toHaveLength(1);

		rerender(
			<Parent>
				<div>
					<Child message="Hello 2" />
				</div>
			</Parent>,
		);

		await waitFor(() => expect(screen.getAllByText("Hello 2")).toHaveLength(1));
		expect(screen.getAllByText("Hello 2")).toHaveLength(1);
	});

	it("passes through rendered components", async () => {
		const SubComponent = ({message}: {message: string}) => <div>{message}</div>;
		const Parent = asyncGen(function* Parent({
			items,
		}: {
			items: React.ReactNode[];
		}) {
			yield <div>{items}</div>;
		});

		render(
			<Parent
				items={[
					<SubComponent key="1" message="Hello" />,
					<SubComponent key="2" message="Hello 2" />,
				]}
			/>,
		);

		await waitFor(() => expect(screen.getAllByText("Hello")).toHaveLength(1));
		expect(screen.getAllByText("Hello")).toHaveLength(1);
		expect(screen.getAllByText("Hello 2")).toHaveLength(1);
	});
});
