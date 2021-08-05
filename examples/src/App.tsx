import React, {useState} from "react";
import "./styles.css";
import Greeting from "./examples/Greeting";
import UserContainer from "./examples/UserContainer";
import MessagePipe from "./examples/MessagePipe";
import {fakeApiFail} from "./api/fakeApi";
import FormSubmit from "./examples/FormSubmit";
import LazyRender from "./examples/LazyRender";
import IPAddress from "./examples/AsyncIpAddress";
import Timer from "./examples/Timer";
import RandomDogApp from "./examples/DogApp";
import AuthContainer from "./auth/AuthContainer";

export default function App() {
	const [timerKey, setTimerKey] = useState(0);

	return (
		<div className="App">
			<h1>Login</h1>
			<AuthContainer />

			<h1>Dog App</h1>
			<RandomDogApp />

			<h1>Simple Greeting</h1>
			<p>Rendering a normal component using the GeneratorComponent wrapper</p>
			<Greeting />

			<h1>Render a Promise</h1>
			<p>Rendering a Promise using the GeneratorComponent wrapper</p>
			<LazyRender message="I render after my promise resolves" />

			<h1>User Tests</h1>
			<p>Rendering using an async generator</p>
			<UserContainer id={1} />
			<UserContainer id={2} />
			<UserContainer id={3} />
			<UserContainer id={4} injectApi={fakeApiFail} />

			<h1>Message Pipe</h1>
			<p>Rendering using an async generator that accumulates values</p>
			<MessagePipe />

			<h1>Submit Form</h1>
			<FormSubmit />

			<h1>IPAddress</h1>
			<IPAddress />

			<h1>Timer</h1>
			<Timer key={timerKey} />

			<button onClick={() => setTimerKey(Date.now())}>Reset Timer</button>
		</div>
	);
}
