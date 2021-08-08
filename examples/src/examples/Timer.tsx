import {asyncGen} from "react-async-generators";

function* Timer(_: {}, refresh: () => void) {
	let seconds = 0;

	const interval = setInterval(() => {
		seconds++;
		refresh();
	}, 1000);

	try {
		while (true) {
			yield <div>Seconds: {seconds}</div>;
		}
	} finally {
		clearInterval(interval);
	}
}

export default asyncGen(Timer);
