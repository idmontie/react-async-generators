export function safeStringify(value: any, indent: number = 2): string {
	try {
		return JSON.stringify(value);
	} catch (e) {
		try {
			let cache: any[] = [];
			const retVal = JSON.stringify(
				value,
				(key, value) =>
					typeof value === "object" && value !== null
						? cache.includes(value)
							? undefined // Duplicate reference found, discard key
							: cache.push(value) && value // Store value in our collection
						: value,
				indent,
			);
			return retVal;
		} catch (e2) {
			return "";
		}
	}
}
