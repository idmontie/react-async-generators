import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import PrettyError from "./PrettyError";
import {normalizeError} from "../utilities/utils";

export default class ErrorBoundary extends PureComponent {
	static propTypes = {
		children: PropTypes.node.isRequired,
	};

	static getDerivedStateFromError(error) {
		return {
			error: normalizeError(error),
		};
	}

	static getDerivedStateFromProps(props, state) {
		return {
			error:
				props.error ||
				(props.lastUpdated === state.lastUpdated ? state.error : null),
			lastUpdated: props.lastUpdated,
		};
	}

	state = {
		error: null,
		// eslint-disable-next-line react/no-unused-state
		lastUpdated: null,
	};

	render() {
		const {error} = this.state;
		const {children} = this.props;

		if (error) return <PrettyError error={error} />;

		return children;
	}
}
