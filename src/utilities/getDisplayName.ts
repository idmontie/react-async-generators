import {Render} from "../types";

export function getDisplayName(render: Render) {
	return `AsyncGenerator(${render.displayName || render.name})`;
}
