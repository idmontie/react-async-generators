import React from "react";
import {asyncGen} from "react-async-generators";
import fakeApi from "../api/fakeApi";

async function* UserContainer({id, injectApi}) {
	yield <div>Loading</div>;

	try {
		const user = await (injectApi ? injectApi(id) : fakeApi(id));

		yield (
			<div>
				{user.id}: {user.name}
			</div>
		);
	} catch (e) {
		yield <div>{e.message}</div>;
	}
}

export default asyncGen(UserContainer);
