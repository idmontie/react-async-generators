import React, {PureComponent} from "react";
import PropTypes from "prop-types";

import PrettyError from "./PrettyError";
import {normalizeError} from "../utilities/utils";

interface ErrorBoundaryProps {
	children: React.ReactNode;
	error?: Error | null;
	lastUpdated: number;
}

interface ErrorBoundaryState {
	error: Error | null;
	lastUpdated: number;
}

export default class ErrorBoundary extends PureComponent<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	static propTypes = {
		children: PropTypes.node.isRequired,
	};

	static getDerivedStateFromError(error: Error) {
		return {
			error: normalizeError(error),
		};
	}

	static getDerivedStateFromProps(
		props: ErrorBoundaryProps,
		state: ErrorBoundaryState,
	) {
		return {
			error:
				props.error ||
				(props.lastUpdated === state.lastUpdated ? state.error : null),
			lastUpdated: props.lastUpdated,
		};
	}

	state: ErrorBoundaryState = {
		error: null,
		// eslint-disable-next-line react/no-unused-state
		lastUpdated: 0,
	};

	render() {
		const {error} = this.state;
		const {children} = this.props;

		if (error) return <PrettyError error={error} />;

		return children;
	}
}
