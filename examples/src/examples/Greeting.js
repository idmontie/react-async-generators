import React from "react";

export default function Greeting({name = "World"}) {
	return <div>Hello {name}</div>;
}
