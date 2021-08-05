import {mutable} from "react-async-generators";
import {User} from "../types";

// TODO refactor to react-async-generators
interface Cache<T> {
	value: {
		set(newValue: T): void;
		get(): T;
	};
}

function createCache<T>(initialValue: T) {
	const listeners: (() => void)[] = [];
	const triggerCascadeUpdate = () => {
		listeners.forEach((listener) => listener());
	};

	const cache: Cache<T> = {
		value: mutable<T>(initialValue, triggerCascadeUpdate),
	};

	const addListener = (cb: () => void) => {
		return listeners.push(cb);
	};

	const removeListener = (cbOrIndex: number | (() => void)) => {
		if (typeof cbOrIndex === "number") {
			listeners.splice(cbOrIndex, 1);
		} else {
			const index = listeners.indexOf(cbOrIndex);
			if (index !== -1) {
				listeners.splice(index, 1);
			}
		}
	};

	async function* getValue(onChange: () => void): AsyncGenerator<T> {
		const index = addListener(onChange);

		try {
			while (true) {
				yield cache.value.get();
			}
		} finally {
			removeListener(index);
		}
	}

	return {cache, getValue, addListener, removeListener};
}

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
