export function mutable<T>(initialValue: T, cb: () => void) {
	let value = initialValue;
	return {
		set(newValue: T) {
			value = newValue;
			cb();
		},
		get() {
			return value;
		},
	};
}
