import {createRef, SyntheticEvent} from "react";
import {asyncGen, mutable} from "react-async-generators";
import {Todo} from "./types";

import "./TodoMVC.css";

import {getTodosCache, todoActions} from "./todosStore";

// TODO use from next version of react-async-generators
type RefreshType = () => void;

const Header = asyncGen(function* Header() {
	const handleKeyDown = (
		e: SyntheticEvent<HTMLInputElement, KeyboardEvent>,
	) => {
		if (e.nativeEvent.key === "Enter") {
			const value = e.currentTarget.value ?? "";
			const title = value.trim();

			if (title) {
				e.preventDefault();
				e.currentTarget.value = "";
				todoActions.create(title);
			}
		}
	};
	yield (
		<header className="header">
			<h1>todos</h1>
			<input
				className="new-todo"
				placeholder="What needs to be done?"
				autoFocus
				onKeyDown={handleKeyDown}
			/>
		</header>
	);
});

const TodoItem = asyncGen<{todo: Todo}>(function* TodoItem(
	{todo}: {todo: Todo},
	refresh: RefreshType,
) {
	const inputRef = createRef<HTMLInputElement>();
	let active = mutable<boolean>(false, refresh);
	let title = mutable<string>(todo.title, refresh);

	const handleToggle = async () => {
		todoActions.toggle(todo);
	};

	const handleDoubleClick = () => {
		active.set(true);
		// Focus once the component is rendered
		setTimeout(() => {
			inputRef.current?.focus();
		}, 0);
	};

	const handleDestroy = () => {
		todoActions.destroy(todo);
	};

	const handleInput = (e: SyntheticEvent<HTMLInputElement, KeyboardEvent>) => {
		title.set(e.currentTarget.value);
	};

	const handleFinish = (nextTitle: string) => {
		active.set(false);
		if (nextTitle) {
			todoActions.edit(todo, nextTitle);
		} else {
			todoActions.destroy(todo);
		}
	};

	const handleKeyDown = (
		e: SyntheticEvent<HTMLInputElement, KeyboardEvent>,
	) => {
		if (e.nativeEvent.key === "Enter") {
			handleFinish(e.currentTarget.value.trim());
		}
	};

	const handleBlur = () => {
		handleFinish(title.get());
	};

	while (true) {
		const classes = [];
		if (active.get()) {
			classes.push("editing");
		}
		if (todo.completed) {
			classes.push("completed");
		}

		yield (
			<li className={classes.join(" ")}>
				<div className="view">
					<input
						className="toggle"
						type="checkbox"
						checked={todo.completed}
						onChange={handleToggle}
					/>
					<label onDoubleClick={handleDoubleClick}>{todo.title}</label>
					<button className="destroy" onClick={handleDestroy} />
				</div>
				<input
					className="edit"
					value={title.get()}
					onInput={handleInput}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					ref={inputRef}
				/>
			</li>
		);
	}
});

function Main({todos, filter}: {todos: Todo[]; filter: string}) {
	const completed = todos.every((todo) => todo.completed);

	const handleToggleAll = () => {
		todoActions.toggleAll(!completed);
	};

	let filteredTodos = todos;

	if (filter === "active") {
		filteredTodos = todos.filter((todo) => !todo.completed);
	} else if (filter === "completed") {
		filteredTodos = todos.filter((todo) => todo.completed);
	}

	return (
		<section className="main">
			<input
				id="toggle-all"
				className="toggle-all"
				type="checkbox"
				checked={completed}
				onChange={handleToggleAll}
			/>
			<label htmlFor="toggle-all">Mark all as complete</label>
			<ul className="todo-list">
				{filteredTodos.map((todo) => (
					<TodoItem todo={todo} key={todo.id} />
				))}
			</ul>
		</section>
	);
}

function Filters({filter}: {filter: string}) {
	return (
		<ul className="filters">
			<li>
				<a className={filter === "" ? "selected" : ""} href="#/">
					All
				</a>
			</li>
			<li>
				<a className={filter === "active" ? "selected" : ""} href="#/active">
					Active
				</a>
			</li>
			<li>
				<a
					className={filter === "completed" ? "selected" : ""}
					href="#/completed"
				>
					Completed
				</a>
			</li>
		</ul>
	);
}

function Footer({todos, filter}: {todos: Todo[]; filter: string}) {
	const completed = todos.filter((todo) => todo.completed).length;
	const remaining = todos.length - completed;

	const handleClearCompleted = () => {
		todoActions.clearCompleted();
	};

	return (
		<footer className="footer">
			<span className="todo-count">
				<strong>{remaining}</strong> item{remaining === 1 ? "" : "s"} left
			</span>
			<Filters filter={filter} />
			{!!completed && (
				<button onClick={handleClearCompleted}>Clear completed</button>
			)}
		</footer>
	);
}

function getFilterFromHash(hash: string) {
	switch (hash) {
		case "#/active": {
			return "active";
		}
		case "#/completed": {
			return "completed";
		}
		default:
			return "";
	}
}

async function* TodoMVC(_: {}, refresh: RefreshType) {
	const todoGenerator = getTodosCache(refresh);
	let initialFilter = getFilterFromHash(window.location.hash);

	const filter = mutable<string>(initialFilter, refresh);

	const handleHashChange = () => {
		filter.set(getFilterFromHash(window.location.hash));
	};

	window.addEventListener("hashchange", handleHashChange);

	try {
		while (true) {
			const todos = await todoGenerator.next();
			yield (
				<div className="todo-wrapper">
					<Header />
					{!!todos.value.length && (
						<Main todos={todos.value} filter={filter.get()} />
					)}
					{!!todos.value.length && (
						<Footer todos={todos.value} filter={filter.get()} />
					)}
				</div>
			);
		}
	} finally {
		window.removeEventListener("hashchange", handleHashChange);
	}
}

export default asyncGen(TodoMVC);
