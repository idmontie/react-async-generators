import wait from "../utilities/wait";

const data = {
	id: "1",
	name: "Ivan",
};

export default async function fakeApi(n: string) {
	await wait(3000);

	return {
		...data,
		id: n,
	};
}

export async function fakeApiFail() {
	await wait(5000);

	throw new Error("failed to load user");
}
