import React from "react";
import {asyncGen} from "react-async-generators";
import wait from "../utilities/wait";

export interface LazyRenderProps {
	message: string;
}

const LazyRender = async ({message}: LazyRenderProps) => {
	await wait(3000);

	return <div>{message}</div>;
};

export default asyncGen<LazyRenderProps>(LazyRender);
