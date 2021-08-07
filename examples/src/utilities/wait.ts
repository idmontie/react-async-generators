export default function wait(n: number): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), n);
	});
}
