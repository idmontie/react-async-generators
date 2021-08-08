import {createCache} from "./cache";

export function createCacheWithStorage<T>(
	storageKey: string,
	defaultValue: T,
	storage: Storage = localStorage,
) {
	const possibleValue = storage.getItem(storageKey) || "{}";
	let initialValue = defaultValue;

	try {
		initialValue = JSON.parse(possibleValue);

		if (!(Array.isArray(initialValue) && initialValue.length)) {
			initialValue = defaultValue;
		}
	} catch (e) {
		initialValue = defaultValue;
	}

	const {cache, addListener, ...rest} = createCache<T>(initialValue);

	addListener(() => {
		storage.setItem(storageKey, JSON.stringify(cache.value.get()));
	});

	return {cache, addListener, ...rest};
}
