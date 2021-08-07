import React, {Component} from "react";
import axe from "axe-core";
import getScope from "../utilities/scope";
import {
	ast,
	generate,
	clean,
	fixUnicode,
	wrap,
	transform,
	evaluate,
} from "../utilities/compiling";
import {normalizeError} from "../utilities/utils";
import ErrorBoundary from "./ErrorBoundary";
import {Message} from "../utilities/types";

axe.configure({
	checks: [
		{
			id: "color-contrast",
			options: {
				noScroll: true,
			},
		},
	],
});

export interface CodeRenderProps {}
export interface CodeRenderState {
	Body: any; // TODO type
	error: Error | null;
	lastUpdated: number;
}

export default class CodeRender extends Component<
	CodeRenderProps,
	CodeRenderState
> {
	resizeNeeded = true;
	ref: HTMLDivElement | null = null;

	constructor(props: CodeRenderProps) {
		super(props);

		this.state = {
			Body: this.renderInitial,
			error: null,
			lastUpdated: +new Date(),
		};
	}

	componentDidMount() {
		window.addEventListener("message", this.handleMessage);

		this.sendMessage({type: "CODE_PREVIEW_READY"});
	}

	componentWillUnmount() {
		window.removeEventListener("message", this.handleMessage);
	}

	handleMessage = (message: Message) => {
		// ignore empty data, weird test message from setImmediate
		if (!message.data) return;

		try {
			const raw = JSON.parse(message.data);

			// message is invalid
			if (!raw) {
				this.setState({
					Body: this.renderEmpty,
					lastUpdated: +new Date(),
				});

				return;
			}

			// message with settings
			if (typeof raw === "object") {
				if (raw.type === "SNIPPET_CHANGED") {
					this.resizeNeeded = true;
				}

				return;
			}

			// message with code
			if (typeof raw === "string") {
				const scope = getScope(raw, true);

				try {
					const result = [
						ast,
						generate,
						clean,
						fixUnicode,
						wrap(scope),
						transform,
						evaluate(scope),
					].reduce((v, f) => f(v), raw);

					this.setState({
						Body: result,
						error: null,
						lastUpdated: +new Date(),
					});
				} catch (e) {
					console.error(e);
					this.setState({
						Body: this.renderInitial,
						error: e as Error,
						lastUpdated: +new Date(),
					});
				}
			}

			// clean up
			if (this.ref && this.resizeNeeded) {
				const {height} = this.ref.getBoundingClientRect();

				this.resizeNeeded = false;
				this.sendMessage({type: "CODE_PREVIEW_HEIGHT", height});
			}
		} catch (error) {
			this.setState({
				error: normalizeError(error as Error),
				lastUpdated: +new Date(),
			});
		}
	};

	sendMessage = (data: any) => {
		window.parent.postMessage(JSON.stringify(data), "*");
	};

	renderInitial = () => "Loading...";

	renderEmpty = () => "Nothing to show.";

	render() {
		const {Body, lastUpdated, error} = this.state;

		return (
			<div
				ref={(r) => (this.ref = r)}
				style={{contain: "content", overflow: "scroll"}}
			>
				<ErrorBoundary lastUpdated={lastUpdated} error={error}>
					<Body />
				</ErrorBoundary>
			</div>
		);
	}
}
