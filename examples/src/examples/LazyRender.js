import React from "react";
import wait from "../utilities/wait";

const LazyRender = async ({message}) => {
	await wait(3000);

	return <div>{message}</div>;
};

export default LazyRender;
