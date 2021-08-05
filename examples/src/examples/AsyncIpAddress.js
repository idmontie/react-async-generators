import React from "react";

export default async function IPAddress() {
	const res = await fetch("https://api.ipify.org");
	const address = await res.text();
	return <div>Your IP Address: {address}</div>;
}
