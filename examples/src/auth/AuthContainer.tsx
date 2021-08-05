import React from "react";
import {asyncGen} from "react-async-generators";
import Login from "./Login";
import {getCurrentUser} from "./store/Users";

async function* AuthContainer(_: {}, refresh: () => void) {
	const currentUser = getCurrentUser(refresh);

	while (true) {
		const user = await currentUser.next();

		if (!user.value) {
			yield <Login />;
		} else {
			yield (
				<div>
					<div>Email: {user.value?.username}</div>
					<div>Name: {user.value?.name}</div>
				</div>
			);
		}
	}
}

export default asyncGen(AuthContainer);
