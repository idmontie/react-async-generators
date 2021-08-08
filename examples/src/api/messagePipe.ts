import wait from "../utilities/wait";

export default async function* messagePipe() {
	yield "Message 1";
	await wait(1000);
	yield "Message 2";
	await wait(1000);
	yield "Message 3";
	await wait(1000);
	yield "Message 4";
	await wait(1000);
	yield "Message 5";
	await wait(1000);
	yield "Message 6";
	await wait(1000);
	yield "Message 7";
	await wait(1000);
	yield "Message 8";
	await wait(1000);
	yield "Message 9";
	await wait(1000);
	yield "Message 10";
}
