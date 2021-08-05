import React from "react";
import {asyncGen} from "react-async-generators";
import messagePipe from "../api/messagePipe";

async function* MessagePipe() {
	const acc = [];
	const generator = messagePipe();

	for await (const value of generator) {
		acc.push(value);

		yield (
			<div>
				{acc.map((message) => {
					return <div key={message}>{message}</div>;
				})}
			</div>
		);
	}
}

export default asyncGen(MessagePipe);
