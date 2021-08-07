export const normalizeError = (error: Error) => {
	if (error.name) return error;

	const cutIndex = error.stack?.indexOf(":") ?? -1;

	return {
		name: error.stack?.slice(0, cutIndex),
		message: error.stack?.slice(cutIndex + 1),
	} as Error;
};
