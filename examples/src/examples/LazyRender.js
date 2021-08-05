import React from "react";
import {asyncGen} from "react-async-generators";
import wait from "../utilities/wait";

const LazyRender = async ({message}) => {
	await wait(3000);

	return <div>{message}</div>;
};

export default asyncGen(LazyRender);
