import React from "react";
import {Card, Space} from "antd";
import {Editor} from "../editor";

const simpleExample = `const MyComponent = asyncGen(function* () {
	yield (
		<div>
			<h1>Home</h1>
			<p>This JSX was yielded from a generator.</p>
		</div>
	);
})`;

const promiseExample = `const MyPromise = asyncGen(async function () {
	const data = await new Promise(resolve => setTimeout(resolve, 10000));

	return (
		<div>
			This JSX takes 10 seconds to render.
		</div>
	);
});`;

const asyncGeneratorExample = `const MyPromise = asyncGen(async function* () {
	yield (<div>Loading</div>);

	const data = await new Promise(resolve => setTimeout(resolve, 10000));

	yield (
		<div>
			This JSX takes 10 seconds to render.
		</div>
	);
});`;

const Home = () => {
	return (
		<div>
			<h1>Home</h1>

			<Space direction="vertical">
				<Card title="Simple Example">
					<p>
						Simple example showing how to wrap a generator to make a component
						usable in React.
					</p>
					<Editor defaultCode={simpleExample} />
				</Card>

				<Card title="Promise Example">
					<p>
						You can also wrap promises in <code>asyncGen</code> to have a
						component lazily render when the promise resolves.
					</p>
					<Editor defaultCode={promiseExample} />
				</Card>

				<Card title="Async Generator Example">
					<p>
						To simulate loading with a promise, we use a promise to delay the
						rendering of the component. But we can yield a Loading message first
						then show another component once the promise resolves.
					</p>
					<Editor defaultCode={asyncGeneratorExample} />
				</Card>
			</Space>
		</div>
	);
};

export default Home;
