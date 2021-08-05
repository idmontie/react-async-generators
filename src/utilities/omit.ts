export function omit(obj: {[key: string]: any}, ...keys: string[]) {
	const result: any = {};
	Object.entries(obj).forEach(([key, value]: [string, any]) => {
		if (keys.indexOf(key) === -1) {
			result[key] = value;
		}
	});

	return result;
}
