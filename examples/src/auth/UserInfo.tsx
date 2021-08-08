import React from "react";
import {Button, Card} from "antd";
import {asyncGen, mutable} from "react-async-generators";
import {logout} from "./store/Users";
import {User} from "./types";

interface UserInfoProps {
	user: User;
}

// TODO potentially move this as another helper in core
interface Mutable<T> {
	set(newValue: T): void;
	get(): T;
}

function asyncAction<T>(
	cb: (...args: any[]) => T,
	refresh: () => void,
): [Mutable<boolean>, Mutable<Error | null>, () => void] {
	const loading = mutable<boolean>(false, refresh);
	const error = mutable<Error | null>(null, refresh);

	const action = async (...args: any[]) => {
		loading.set(true);
		error.set(null);
		let result;
		try {
			result = await cb(...args);
		} catch (e) {
			error.set(e as Error);
		} finally {
			loading.set(false);
		}
		return result;
	};

	return [loading, error, action];
}

async function* UserInfo({user}: UserInfoProps, refresh: () => void) {
	const [loading, , onLogout] = asyncAction<void>(logout, refresh);

	while (true) {
		yield (
			<Card
				title={user.name}
				extra={
					<Button loading={loading.get()} onClick={onLogout}>
						Logout
					</Button>
				}
			>
				<p>Username: {user.username}</p>
			</Card>
		);
	}
}

export default asyncGen(UserInfo);
