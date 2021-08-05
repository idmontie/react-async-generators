export function safeStringify(value: any): string {
	try {
		return JSON.stringify(value);
	} catch (e) {
		return value;
	}
}
