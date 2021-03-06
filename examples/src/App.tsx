// import React from "react";
import React, {useState} from "react";
import {Menu} from "antd";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import {
	HomeOutlined,
	PictureOutlined,
	UserOutlined,
	CheckSquareOutlined,
	OrderedListOutlined,
} from "@ant-design/icons";
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
import AppLayout from "./app/AppLayout";
import TagLifecycle from "./examples/TagLifecycle";
import DynamicList from "./examples/DynamicList";
import Home from "./home/Home";
import {Preview} from "./editor";
import TodoMVC from "./todo/TodoMVC";

export default function App() {
	const [timerKey, setTimerKey] = useState(0);

	if (window.location.pathname === "/preview") {
		return <Preview />;
	}

	return (
		<Router>
			<AppLayout
				menuItems={[
					<Menu.Item key="home" icon={<HomeOutlined />}>
						<Link to="/">Home</Link>
					</Menu.Item>,
					<Menu.Item key="auth" icon={<UserOutlined />}>
						<Link to="/auth">Auth Example</Link>
					</Menu.Item>,
					<Menu.Item key="dog-app" icon={<PictureOutlined />}>
						<Link to="/dog-app">Dog App</Link>
					</Menu.Item>,
					<Menu.Item key="todo-mvc" icon={<CheckSquareOutlined />}>
						<Link to="/todo">TodoMVC</Link>
					</Menu.Item>,
					<Menu.Item key="other" icon={<OrderedListOutlined />}>
						<Link to="/other">Other Examples</Link>
					</Menu.Item>,
				]}
			>
				<Switch>
					<Route path="/" exact component={Home} />
					<Route path="/auth" component={AuthContainer} />
					<Route path="/dog-app" component={RandomDogApp} />
					<Route path="/todo" component={TodoMVC} />
					<Route
						path="/other"
						render={() => {
							return (
								<>
									<h1>Simple Greeting</h1>
									<p>
										Rendering a normal component using the GeneratorComponent
										wrapper
									</p>
									<Greeting />

									<h1>Mouse Events</h1>
									<TagLifecycle />

									<h1>Scroll to top</h1>
									<DynamicList />

									<h1>Render a Promise</h1>
									<p>
										Rendering a Promise using the GeneratorComponent wrapper
									</p>
									<LazyRender message="I render after my promise resolves" />

									<h1>User Tests</h1>
									<p>Rendering using an async generator</p>
									<UserContainer id="1" />
									<UserContainer id="2" />
									<UserContainer id="3" />
									<UserContainer id="4" injectApi={fakeApiFail} />

									<h1>Message Pipe</h1>
									<p>
										Rendering using an async generator that accumulates values
									</p>
									<MessagePipe />

									<h1>Submit Form</h1>
									<FormSubmit />

									<h1>IPAddress</h1>
									<IPAddress />

									<h1>Timer</h1>
									<Timer key={timerKey} />

									<button onClick={() => setTimerKey(Date.now())}>
										Reset Timer
									</button>
								</>
							);
						}}
					/>
				</Switch>
			</AppLayout>
		</Router>
	);
}
