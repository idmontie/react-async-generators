import React, {Fragment} from "react";
import Async from "react-async-generators";

function LoadingIndicator() {
	return <div>Fetching a good boy...</div>;
}

async function* RandomDog({throttle = false}) {
	yield <LoadingIndicator />;
	const res = await fetch("https://dog.ceo/api/breeds/image/random");
	const data = await res.json();

	if (throttle) {
		await new Promise((resolve) => setTimeout(resolve, 2000));
	}

	yield (
		<a href={data.message}>
			<img src={data.message} alt="A Random Dog" width="300" />
		</a>
	);
}

export default function* RandomDogApp(_, refresh) {
	let throttle = false;

	const handleClick = () => {
		throttle = !throttle;
		refresh();
	};

	while (true) {
		yield (
			<Fragment>
				<div>
					<button onClick={handleClick}>Show me another dog.</button>
				</div>
				<Async render={RandomDog} throttle={throttle} />
			</Fragment>
		);
	}
}
