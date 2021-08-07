import React, {useEffect, useState, useLayoutEffect, useRef} from "react";

import CodeEditor from "./CodeEditor";
import CodeTarget from "./CodeTarget";
import styles from "./Editor.module.css";

const Editor = ({defaultCode}) => {
	const targetRef = useRef();
	const queuedMessageRef = useRef();
	const [targetLoaded, setTargetLoaded] = useState(false);

	const handleUpdate = () => {
		// no op for now
	};

	const handleSendMessage = (msg) => {
		const target = targetRef.current;

		if (target && targetLoaded) {
			target.contentWindow.postMessage(JSON.stringify(msg), "*");
		} else {
			queuedMessageRef.current = msg;
		}
	};

	useLayoutEffect(() => {
		const target = targetRef.current;
		if (target) {
			target.onload = () => {
				setTargetLoaded(true);
			};
		}
	}, [targetRef.current]);

	useEffect(() => {
		const msg = queuedMessageRef.current;
		if (msg && targetLoaded) {
			setTimeout(() => {
				handleSendMessage(msg);
				queuedMessageRef.current = null;
			}, 1000);
		}
	}, [targetLoaded]);

	return (
		<div className={styles.editorWrapper}>
			<CodeTarget targetRef={targetRef} />
			<CodeEditor
				defaultCode={defaultCode}
				onUpdate={handleUpdate}
				onSendMessage={handleSendMessage}
			/>
		</div>
	);
};

export default Editor;
