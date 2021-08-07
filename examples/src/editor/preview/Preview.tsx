import React from "react";

import CodeRender from "./CodeRender";
import styles from "./Preview.module.css";

const PreviewPage = () => (
	<div className={styles.wrapper}>
		<CodeRender />
		{/* hide native error report of react dev tools within this page only */}
		<style>{"iframe { display: none; }"}</style>
	</div>
);

export default PreviewPage;
