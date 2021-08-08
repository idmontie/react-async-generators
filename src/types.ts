export type AnyGenerator<T> =
	| Promise<T>
	| AsyncIterable<T>
	| IterableIterator<T>
	| React.FC<T>
	| JSX.Element
	| null;

export type Render = {
	(props: any, refresh: () => void): AnyGenerator<any>;
	displayName?: string;
};

export type RefreshType = () => void;
