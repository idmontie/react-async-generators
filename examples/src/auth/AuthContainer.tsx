import React from "react";
import {asyncGen} from "react-async-generators";
import Login from "./Login";
import {getCurrentUser} from "./store/Users";
import UserInfo from "./UserInfo";

async function* AuthContainer(_: {}, refresh: () => void) {
	const currentUser = getCurrentUser(refresh);

	while (true) {
		const user = await currentUser.next();

		if (!user.value) {
			yield <Login />;
		} else {
			yield <UserInfo user={user.value} />;
		}
	}
}

export default asyncGen(AuthContainer);
