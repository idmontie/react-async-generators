import React, {
	useCallback,
	useState,
	useEffect,
	useRef,
	ReactElement,
} from "react";
import isDeepEqual from "fast-deep-equal/react";
import {isIterator} from "./utilities/isIterator";
import {isPromise} from "./utilities/isPromise";
import {getDisplayName} from "./utilities/getDisplayName";
import {Render, AnyGenerator} from "./types";

export interface AsyncProps {
	render: Render;

	// Allow all other prop types to be passed through
	[x: string]: any;
}

type MountState = "beforemount" | "unmounted" | "mounted";

type ReturnType = ReactElement | JSX.Element;

// Exported for testing purposes
export function useDeepEqualProps(props: {[x: string]: any}) {
	const propsRef = useRef(props);
	const propsUpdatedRef = useRef(Date.now());

	if (!isDeepEqual(propsRef.current, props)) {
		propsRef.current = props;
		propsUpdatedRef.current = Date.now();
	}

	return [propsUpdatedRef, propsRef];
}

const Async: React.FC<AsyncProps> = ({render, ...props}: AsyncProps) => {
	const maybeIteratorRef = useRef<AnyGenerator<ReturnType> | null>(null);
	const [comp, setComp] = useState<ReturnType | null>(null);
	const hasMounted = useRef<MountState>("beforemount");
	const [propsUpdatedRef] = useDeepEqualProps(props);

	const step = useCallback((result: IteratorResult<any>) => {
		// Support both { val, done } and value.
		if ("value" in result) {
			setComp(result.value);
		} else {
			setComp(result as unknown as ReturnType);
		}

		// TODO test this
		if (result.done) {
			return true;
		}
	}, []);

	const refresh = useCallback(async () => {
		if (hasMounted.current === "beforemount") {
			console.error("Called refresh before component mounted");
			return;
		}

		if (hasMounted.current === "unmounted") {
			console.error("Called refresh after component unmounted");
			return;
		}

		if (isIterator(maybeIteratorRef.current)) {
			const iterator = maybeIteratorRef.current as IterableIterator<any>;
			let result = await iterator.next();
			step(result);
		}
	}, [step]);

	const iterate = useCallback(async () => {
		// Get the number of arguments of render
		const arity = render.length;

		const maybeIterator = render({...props}, refresh);
		maybeIteratorRef.current = maybeIterator;

		// Handle promise components
		if (isPromise(maybeIterator)) {
			setComp(await (maybeIterator as Promise<ReturnType>));
			return;
		}

		// Handle normal functional components
		if (!isIterator(maybeIterator)) {
			setComp(maybeIterator as React.FC<any>);
			return;
		}

		// At this point, we know that the generator is a generator
		const iterator = maybeIterator as IterableIterator<any>;

		// Handle generator components
		if (arity <= 1) {
			for await (let result of iterator) {
				// Iterate until done while not unmounted
				if (hasMounted.current === "unmounted") {
					break;
				}

				if (step(result)) {
					break;
				}
			}
		} else {
			// Iterate once to get the first value
			let result = await iterator.next();
			step(result);
		}
	}, [render, step, refresh, propsUpdatedRef.current]);

	useEffect(() => {
		iterate();

		return () => {
			// Attempt to call any `finally` clauses in the iterator
			if (maybeIteratorRef.current) {
				const g = maybeIteratorRef.current as IterableIterator<any>;

				if (g && g.return) {
					g.return();
				}
			}
		};
	}, [iterate]);

	useEffect(() => {
		return () => {
			hasMounted.current = "unmounted";
		};
	}, []);

	if (comp) {
		hasMounted.current = "mounted";
		return comp;
	} else {
		return null;
	}
};

const AsyncGenerator = ({render, ...props}: AsyncProps) => {
	const NamedAsync = Async.bind({});
	NamedAsync.displayName = getDisplayName(render);
	return <NamedAsync render={render} {...props} />;
};

(AsyncGenerator as React.FC).displayName = "AsyncGenerator";

export function asyncGen<T = any>(render: Render) {
	const NamedAsync = Async.bind({});
	NamedAsync.displayName = getDisplayName(render);
	const Comp = (props: T) => <NamedAsync render={render} {...props} />;
	(Comp as React.FC).displayName = "AsyncGenerator";
	return Comp;
}

export default AsyncGenerator;
