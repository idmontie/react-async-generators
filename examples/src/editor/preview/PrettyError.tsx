import React from "react";
import PropTypes from "prop-types";

import classes from "./PrettyError.module.css";

const PrettyError = ({error}: {error: Error}) => {
	const cutIndex = error.message.indexOf("\n");
	const heading = error.name;
	const reason =
		cutIndex > -1 ? error.message.slice(0, cutIndex) : error.message;
	const stack = cutIndex > -1 ? error.message.slice(cutIndex + 1) : "";

	return (
		<div className={classes.wrapper}>
			<div className={classes.heading}>{heading}</div>
			<div className={classes.reason}>{reason}</div>
			<div className={classes.stack}>{stack}</div>
		</div>
	);
};

PrettyError.propTypes = {
	error: PropTypes.shape({
		message: PropTypes.string,
		name: PropTypes.string,
	}).isRequired,
};

export default PrettyError;
