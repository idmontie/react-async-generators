import React from "react";
import {Tag} from "antd";
import {asyncGen, mutable} from "react-async-generators";

function* TagLifecycle(_: any, refresh: () => void) {
	let mouseState = mutable<string>("Mouse Left", refresh);

	const onMouseEnter = () => {
		mouseState.set("Mouse Enter");
	};

	const onMouseLeave = () => {
		mouseState.set("Mouse Left");
	};

	while (true) {
		yield (
			<div
				style={{display: "inline-block"}}
				onMouseEnter={onMouseEnter}
				onMouseLeave={onMouseLeave}
			>
				<Tag>My Tag: {mouseState.get()}</Tag>
			</div>
		);
	}
}

export default asyncGen(TagLifecycle);
