export function isIterator(f: any) {
	return Boolean(f?.next);
}
