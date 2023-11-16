/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - the text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userId - The user who owns this todo.
 */

class toDoList {
	static ID = 'todo-list';

	static FLAGS = {
		TODOS: 'todos',
	};

	static TEMPLATES = {
		TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`,
	};
}
