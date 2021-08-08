import {asyncGen} from "react-async-generators";

function Greeting({name = "World"}) {
	return <div>Hello {name}</div>;
}

export default asyncGen(Greeting);
