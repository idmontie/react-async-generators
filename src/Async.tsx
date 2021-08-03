import React, {
	useCallback,
	useState,
	useEffect,
	useRef,
	ReactElement,
} from "react";

function testIsGenerator(f: any) {
	return Boolean(f.next);
}

function isPromise(obj: any) {
	return Boolean(
		!!obj &&
			(typeof obj === "object" || typeof obj === "function") &&
			typeof obj.then === "function",
	);
}

export type AnyGenerator<T> =
	| Promise<T>
	| AsyncIterable<T>
	| IterableIterator<T>
	| React.FC<T>
	| JSX.Element;

export interface Props {}

export type Render = {
	(props: any, refresh: () => void): AnyGenerator<any>;
	displayName?: string;
};

// interface extends react props
export interface AsyncProps {
	render: Render;

	// Allow all other prop types to be passed through
	[x: string]: any;
}

type MountState = "beforemount" | "unmounted" | "mounted";

type ReturnType = ReactElement | JSX.Element;

const Async: React.FC<AsyncProps> = ({render, ...props}: AsyncProps) => {
	const genRef = useRef<AnyGenerator<ReturnType> | null>(null);
	const [comp, setComp] = useState<ReturnType | null>(null);
	const hasMounted = useRef<MountState>("beforemount");

	const iterate = useCallback(async () => {
		let generator: AnyGenerator<ReturnType>;

		const step = (result: IteratorResult<any>) => {
			// Support both { val, done } and value.
			if (result.value) {
				setComp(result.value);
			} else {
				setComp(result as unknown as ReturnType);
			}

			if (result.done) {
				return true;
			}
		};

		const refresh = async () => {
			if (hasMounted.current === "beforemount") {
				console.error("Called refresh before component mounted");
				return;
			}

			if (hasMounted.current === "unmounted") {
				console.error("Called refresh after component unmounted");
				return;
			}

			if (testIsGenerator(generator)) {
				const g = generator as IterableIterator<any>;
				let result = await g.next();
				step(result);
			}
		};
		// Get the number of arguments of render
		const arity = render.length;

		generator = render({...props}, refresh);

		// Handle promise components
		if (isPromise(generator)) {
			setComp(await (generator as Promise<ReturnType>));
			return;
		}

		// Handle normal functional components
		if (!testIsGenerator(generator)) {
			setComp(generator as React.FC<any>);
			return;
		}

		// At this point, we know that the generator is a generator
		const gen = generator as IterableIterator<any>;

		// Handle generator components
		if (arity <= 1) {
			for await (let result of gen) {
				if (step(result)) {
					break;
				}
			}
		} else {
			// Iterate once to get the first value
			let result = await gen.next();
			step(result);
		}

		genRef.current = generator;
	}, [render, JSON.stringify(props)]);

	useEffect(() => {
		iterate();

		return () => {
			hasMounted.current = "unmounted";

			if (genRef.current) {
				const g = genRef.current as IterableIterator<any>;

				if (g && g.return) {
					g.return();
				}
			}
		};
	}, [iterate]);

	if (comp) {
		hasMounted.current = "mounted";
		return comp;
	} else {
		return null;
	}
};

const AsyncWrapper = ({render, ...props}: AsyncProps) => {
	const NamedAsync = Async.bind({});
	NamedAsync.displayName = `Async(${render.displayName || render.name})`;
	return <NamedAsync render={render} {...props} />;
};

(AsyncWrapper as React.FC).displayName = "AsyncWrapper";

export default AsyncWrapper;
