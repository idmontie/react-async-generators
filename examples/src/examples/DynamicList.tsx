import React from "react";
import {asyncGen, mutable} from "react-async-generators";

function List({numberOfItems}: {numberOfItems: number}) {
	// Create a n array of items equal to the numberOfItems
	return (
		<>
			{Array.from({length: numberOfItems}, (_, index) => index).map((index) => {
				return <li key={index}>Item {index}</li>;
			})}
		</>
	);
}

function ListForm({onChange}: {onChange: (arg: number) => void}) {
	return (
		<form>
			<input
				type="number"
				defaultValue={100}
				onChange={(e) => onChange(parseInt(e.target.value, 10))}
			/>
		</form>
	);
}

function* FullList(_: any, refresh: () => void) {
	const listRef = React.createRef<HTMLDivElement>();
	const numberOfItems = mutable<number>(100, refresh);

	const onChange = (num: number) => {
		if (numberOfItems.get() !== num) {
			numberOfItems.set(num);

			// Scroll to top of page
			if (listRef.current) {
				listRef.current.scrollTop = 0;
			}
		}
	};

	while (true) {
		yield (
			<div>
				<ListForm onChange={onChange} />
				{/* Scrollable list */}
				<div style={{height: "200px", overflow: "auto"}} ref={listRef}>
					<ul>
						<List numberOfItems={numberOfItems.get()} />
					</ul>
				</div>
			</div>
		);
	}
}

export default asyncGen(FullList);
