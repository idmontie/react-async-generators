import React from "react";
import {asyncGen, mutable} from "react-async-generators";
import Login from "./Login";
import {User} from "./types";

async function* AuthContainer(_: {}, refresh: () => void) {
	let user = mutable<User | null>(null, refresh);

	const onLogin = (u: User) => {
		user.set(u);
	};

	while (true) {
		const u = user.get();
		if (!u) {
			yield <Login onLogin={onLogin} />;
		} else {
			yield (
				<div>
					<div>Email: {u.username}</div>
					<div>Name: {u.name}</div>
				</div>
			);
		}
	}
}

export default asyncGen(AuthContainer);
