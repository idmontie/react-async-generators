import React, {Component} from "react";
import Editor from "react-ace";
import {Message, AceEditor} from "../utilities/types";

require("brace/mode/javascript");
require("brace/theme/cobalt");
require("brace/ext/language_tools");

const noop = () => {};

export interface CodeEditorProps {
	defaultCode: string;
	onSendMessage: (message: string) => void;
	onUpdate: (message: string) => void;
}

export interface CodeEditorState {
	value: string;
}

export default class CodeEditor extends Component<
	CodeEditorProps,
	CodeEditorState
> {
	static defaultProps = {
		defaultCode: "",
		onSendMessage: noop,
		onUpdate: noop,
	};

	debounce: number | null;

	constructor(props: CodeEditorProps) {
		super(props);

		this.debounce = null;
		this.state = {
			value: props.defaultCode,
		};
	}

	componentDidMount() {
		const {value} = this.state;
		const {onSendMessage} = this.props;

		onSendMessage(value);
		window.addEventListener("message", this.handleMessage);
	}

	componentWillReceiveProps(nextProps: CodeEditorProps) {
		const {defaultCode, onSendMessage, onUpdate} = this.props;

		if (nextProps.defaultCode !== defaultCode) {
			this.setState({
				value: nextProps.defaultCode,
			});
			onSendMessage(nextProps.defaultCode);
			onUpdate(nextProps.defaultCode);
		}
	}

	componentWillUnmount() {
		this.clearDebounceTimeout();
		window.removeEventListener("message", this.handleMessage);
	}

	clearDebounceTimeout = () => {
		if (this.debounce !== null) {
			clearTimeout(this.debounce);
		}
	};

	handleMessage = (message: Message) => {
		if (!message.data) return;

		try {
			const {onSendMessage} = this.props;
			const {value} = this.state;
			const data = JSON.parse(message.data);

			// code renderer has loaded after the code editor
			// re-send the code to render
			if (typeof data === "object" && data.type === "CODE_PREVIEW_READY") {
				onSendMessage(value);
			}
		} catch (e) {
			/* do nothing */
		}
	};

	handleChange = (value: string) => {
		const {onSendMessage, onUpdate} = this.props;

		this.clearDebounceTimeout();
		this.debounce = setTimeout(() => {
			onSendMessage(value);
			onUpdate(value);
		}, 2000) as unknown as number;

		this.setState({value});
	};

	handleEditorLoad = (editor: AceEditor) => {
		editor.getSession().setUseWorker(false); // disables built-in code checker
	};

	render() {
		const {value} = this.state;

		if (!Editor) return <span />;

		return (
			<Editor
				name="unique-name" // TODO
				height="300px"
				mode="javascript"
				theme="cobalt"
				width="100%"
				fontSize={14}
				value={value}
				onChange={this.handleChange}
				enableLiveAutocompletion
				enableBasicAutocompletion
				highlightActiveLine
				wrapEnabled
				tabSize={2}
				onLoad={this.handleEditorLoad}
				editorProps={{$blockScrolling: Infinity, $scrollPastEnd: true}}
			/>
		);
	}
}
