import React from "react";
import {func} from "prop-types";
import styles from "./CodeTarget.module.css";

class CodeTarget extends React.Component {
	static propTypes = {
		targetRef: func,
	};

	static defaultProps = {
		targetRef: () => {},
	};

	state = {
		height: 64,
		width: "auto",
	};

	componentDidMount() {
		window.addEventListener("message", this.handleMessage);
	}

	componentWillUnmount() {
		window.removeEventListener("message", this.handleMessage);
	}

	handleMessage = (msg) => {
		try {
			const {type, height} = JSON.parse(msg.data);
			const paddingsAndBorders = 48;

			if (type === "CODE_PREVIEW_HEIGHT") {
				this.setState({
					height: height + paddingsAndBorders,
				});
			}
		} catch (e) {
			// ignore
		}
	};

	render() {
		const {targetRef} = this.props;

		return (
			<iframe
				className={styles.frame}
				ref={targetRef}
				title="Preview"
				src="/preview"
			/>
		);
	}
}

export default CodeTarget;
