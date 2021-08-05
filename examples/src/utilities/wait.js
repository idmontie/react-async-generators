export default function wait(n) {
	return new Promise((resolve) => {
		setTimeout(() => resolve(), n);
	});
}
