import React from "react";

export default async function* FormSubmit(_, refresh) {
	let status = "";

	const handleSubmit = (e) => {
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
