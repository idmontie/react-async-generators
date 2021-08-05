import {mutable} from "./mutable";

export interface Cache<T> {
	value: {
		set(newValue: T): void;
		get(): T;
	};
}

export function createCache<T>(initialValue: T) {
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
