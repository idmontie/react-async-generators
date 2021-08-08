import React from "react";
import {asyncGen} from "react-async-generators";

async function IPAddress() {
	const res = await fetch("https://api.ipify.org");
	const address = await res.text();
	return <div>Your IP Address: {address}</div>;
}

export default asyncGen(IPAddress);
