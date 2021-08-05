export function isPromise(obj: any) {
	return Boolean(
		!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function",
	);
}
