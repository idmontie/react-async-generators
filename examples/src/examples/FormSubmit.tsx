import React from "react";
import {asyncGen} from "react-async-generators";

async function* FormSubmit(_: {}, refresh: () => void) {
	let status = "";

	const handleSubmit = (e: React.SyntheticEvent) => {
		e.preventDefault();

		status = "Submitting";
		refresh();

		setTimeout(() => {
			status = "Submitted";
			refresh();
		}, 1000);
	};

	while (true) {
		yield (
			<form onSubmit={handleSubmit}>
				<div>{status}</div>
				<input type="text" name="username" />
				<input type="submit" value="Submit" />
			</form>
		);
	}
}

export default asyncGen(FormSubmit);
