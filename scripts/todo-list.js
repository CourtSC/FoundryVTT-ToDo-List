/**
 * A single ToDo in our list of Todos.
 * @typedef {Object} ToDo
 * @property {string} id - A unique ID to identify this todo.
 * @property {string} label - the text of the todo.
 * @property {boolean} isDone - Marks whether the todo is done.
 * @property {string} userID - The user who owns this todo.
 */

class ToDoList {
	static ID = 'FoundryVTT-ToDo-List';

	static FLAGS = {
		TODOS: 'todos',
	};

	static TEMPLATES = {
		TODOLIST: `modules/${this.ID}/templates/todo-list.hbs`,
	};
}

class ToDoListData {
	static getToDosForUser(userID) {
		return game.users.get(userID)?.getFlag(ToDoList.ID, ToDoList.FLAGS.TODOS);
	}

	static createToDo(userID, toDoData) {
		//generate a random ID for this todo and populate the userID
		const newToDo = {
			isDone: false,
			...toDoData,
			id: foundry.utils.randomID(16),
			userID,
		};

		// construct the update to insert the new ToDo
		const newToDos = {
			[newToDo.id]: newToDo,
		};

		//update the database with the new ToDos
		return game.users
			.get(userID)
			?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, newToDos);
	}

	static get allToDos() {
		const allToDos = game.users.reduce((accumulator, user) => {
			const userTodos = this.getToDosForUser(user.id);

			return {
				...accumulator,
				...userTodos,
			};
		}, {});

		return allToDos;
	}

	static updateToDo(toDoID, updateData) {
		const relevantToDo = this.allToDos[toDoID];

		//construct the update to send
		const update = {
			[toDoID]: updateData,
		};

		// update the database with the updated ToDo list
		return game.users
			.get(relevantToDo.userID)
			?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, update);
	}

	static deleteToDo(toDoID) {
		const relevantToDo = this.allToDos[toDoID];

		// Foundry specific syntax required to delete a key from a persisted object in the database
		const keyDeletion = {
			[`-=${toDoID}`]: null,
		};

		//update the database with the updated ToDo list
		return game.users
			.get(relevantToDo.userID)
			?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, keyDeletion);
	}

	static updateUserToDos(userID, updateData) {
		return game.users
			.get(userID)
			?.setFlag(ToDoList.ID, ToDoList.FLAGS.TODOS, updateData);
	}
}

class ToDoListConfig extends FormApplication {
	static get defaultOptions() {
		const defaults = super.defaultOptions;

		const overrides = {
			height: 'auto',
			id: 'todo-list',
			template: ToDoList.TEMPLATES.TODOLIST,
			title: 'To Do List',
			userId: game.userId,
		};

		const mergedOptions = foundry.utils.mergeObject(defaults, overrides);

		return mergedOptions;
	}

	getData(options) {
		return {
			todos: ToDoListData.getToDosForUser(options.userId),
		};
	}
}

Hooks.on('renderPlayerList', (playerList, html) => {
	// find the element which has our logged in user's id
	const loggedInUserListItem = html.find(`[data-user-id="${game.userId}"]`);
	console.log(loggedInUserListItem);

	// create localized tooltip
	const tooltip = game.i18n.localize('TODO-LIST.button-title');

	// insert a button at the end of this element
	loggedInUserListItem.append(
		`<button type='button' class='todo-list-icon-button flex0' title='${tooltip}'><i class='fas fa-tasks'></i></button>`
	);

	html.on('click', '.todo-list-icon-button', (event) => {
		console.log(
			`${ToDoList.ID} | You hear a clicking sound and remember what you meant to do...`
		);
	});
});
