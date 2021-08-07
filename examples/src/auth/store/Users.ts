import {createCache} from "react-async-generators";
import {User} from "../types";

/**
 * Use a basic cache to store the current user and trigger updates
 */
const {cache, getValue} = createCache<User | null>(null);

export {getValue as getCurrentUser};

export async function loginAsUser(username: string, _: string): Promise<User> {
	return new Promise<User>((resolve) => {
		setTimeout(() => {
			const user = {
				username,
				id: 1,
				name: "John Doe",
			};

			cache.value.set(user);

			resolve(user);
		}, 1000);
	});
}

export async function logout(): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			cache.value.set(null);
			resolve();
		}, 1000);
	});
}
