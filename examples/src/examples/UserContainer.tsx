import React from "react";
import {asyncGen} from "react-async-generators";
import fakeApi from "../api/fakeApi";
import {User} from "../auth/types";

interface UserContainerProps {
	id: string;
	injectApi: (id: string) => Promise<User>;
}

async function* UserContainer({id, injectApi}: UserContainerProps) {
	yield <div>Loading</div>;

	try {
		const user = await (injectApi ? injectApi(id) : fakeApi(id));

		yield (
			<div>
				{user.id}: {user.name}
			</div>
		);
	} catch (e) {
		const error = e as Error;
		yield <div>{error.message}</div>;
	}
}

export default asyncGen(UserContainer);
