import React, {useEffect, useState} from "react";
import {render, screen, waitFor} from "@testing-library/react";

import {useDeepEqualProps} from "./AsyncGenerator";

describe("dependencies", () => {
	describe("deep equals", () => {
		const Component = function (props: {messages: string[]}) {
			const [propsUpdatedRef] = useDeepEqualProps(props);
			const [str, setStr] = useState("");

			useEffect(() => {
				setStr(props.messages.join(" "));
			}, [propsUpdatedRef.current]);

			return (
				<div>
					<span>{str}</span>
				</div>
			);
		};

		test("updates when props change", async () => {
			let messages = ["Hello"];
			const {rerender} = render(<Component messages={messages} />);

			await waitFor(() => expect(screen.getAllByText("Hello")).toHaveLength(1));
			expect(screen.getAllByText("Hello")).toHaveLength(1);

			messages = ["Hello", "Goodbye"];
			rerender(<Component messages={messages} />);

			await waitFor(() =>
				expect(screen.getAllByText("Hello Goodbye")).toHaveLength(1),
			);
			expect(screen.getAllByText("Hello Goodbye")).toHaveLength(1);
		});
	});
});
