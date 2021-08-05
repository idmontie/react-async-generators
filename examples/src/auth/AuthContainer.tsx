import React from "react";
import {asyncGen} from "react-async-generators";
import Login from "./Login";
import {User} from "./types";

async function* AuthContainer(_: {}, refresh: () => void) {
	let user = null;

	const onLogin = (u: User) => {
		user = u;

		refresh();
	};

	while (true) {
		if (!user) {
			yield <Login onLogin={onLogin} />;
		} else {
			yield <div>Logged in!</div>;
		}
	}
}

export default asyncGen(AuthContainer);
