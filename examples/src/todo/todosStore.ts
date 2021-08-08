import {createCacheWithStorage} from "react-async-generators";
import {Todo} from "./types";

export const {cache: todoCache, getValue: getTodosCache} =
	createCacheWithStorage<Todo[]>("todo-mvc", []);

export const todoActions = {
	create(title: string) {
		const todo: Todo = {
			id: Date.now(),
			title,
			completed: false,
		};

		todoCache.value.set([...todoCache.value.get(), todo]);
	},
	toggle(todo: Todo) {
		const todos = todoCache.value.get();
		const nextTodos = todos.map((t: Todo) => {
			if (t.id === todo.id) {
				return {
					...t,
					completed: !todo.completed,
				};
			}

			return t;
		});

		todoCache.value.set(nextTodos);
	},
	toggleAll(completed: boolean) {
		todoCache.value.set(
			todoCache.value.get().map((t: Todo) => ({
				...t,
				completed,
			})),
		);
	},
	edit(todo: Todo, title: string) {
		const todos = todoCache.value.get();
		const nextTodos = todos.map((t: Todo) => {
			if (t.id === todo.id) {
				return {
					...t,
					title,
				};
			}

			return t;
		});
		todoCache.value.set(nextTodos);
	},
	destroy(todo: Todo) {
		const todos = todoCache.value.get();
		const nextTodos = todos.filter((t: Todo) => t.id !== todo.id);

		todoCache.value.set(nextTodos);
	},
	clearCompleted() {
		const todos = todoCache.value.get();
		const nextTodos = todos.filter((t: Todo) => !t.completed);

		todoCache.value.set(nextTodos);
	},
};
