let filterValue = "all";
// selecting
const todoInput = document.querySelector(".todo-input");
const todoForm = document.querySelector(".todo-form");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");
const editTodoInput = document.getElementById("edit-todo");
const updateTodoBtn = document.getElementById("update-todo");

// Events
updateTodoBtn.addEventListener("click", updateTodo);
todoForm.addEventListener("submit", addNewTodo);
selectFilter.addEventListener("change", (e) => {
  filterValue = e.target.value;
  filterTodos();
});
document.addEventListener("DOMContentLoaded", (e) => {
  const todos = getAllTodos();
  createTodos(todos);
});
// Functions
function addNewTodo(e) {
  e.preventDefault();
  if (!todoInput.value) return null;
  const newTodo = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    title: todoInput.value,
    isCompleted: false,
  };
  saveTodo(newTodo);
  filterTodos();
}
function createTodos(todos) {
  // create todos on DOM
  let result = "";
  todos.forEach((todo) => {
    result += `<li class="todo">
            <p class="todo__title ${todo.isCompleted && "completed"}">${
      todo.title
    }</p>
            <span class="todo__createdAt">${new Date(
              todo.createdAt
            ).toLocaleDateString("fa-IR")}</span>
            <button class="todo__remove" data-todo-id=${
              todo.id
            }><i class="far fa-trash-alt"></i></button>
            <button onclick="openEditForm(event)" id="open-modal" class="todo__edit" data-todo-id=${
              todo.id
            }><i class="far fa-edit"></i></button>
               <button class="todo__check" data-todo-id=${
                 todo.id
               }><i class="far fa-check-square"></i></button>
          </li>`;
  });
  todoList.innerHTML = result;
  todoInput.value = "";
  const removeBtns = [...document.querySelectorAll(".todo__remove")];
  removeBtns.forEach((btn) => btn.addEventListener("click", removeTodo));

  const checkBtns = [...document.querySelectorAll(".todo__check")];
  checkBtns.forEach((btn) => btn.addEventListener("click", checkTodo));
}
function filterTodos() {
  const todos = getAllTodos();
  switch (filterValue) {
    case "all": {
      createTodos(todos);
      break;
    }
    case "completed": {
      const filteredTodos = todos.filter((t) => t.isCompleted);
      createTodos(filteredTodos);
      break;
    }
    case "uncompleted": {
      const filteredTodos = todos.filter((t) => !t.isCompleted);
      createTodos(filteredTodos);
      break;
    }

    default:
      createTodos(todos);
  }
}
function removeTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  todos = todos.filter((t) => t.id !== todoId);
  saveAllTodos(todos);
  filterTodos();
}
function checkTodo(e) {
  let todos = getAllTodos();
  const todoId = Number(e.target.dataset.todoId);
  const todo = todos.find((t) => t.id === todoId);
  todo.isCompleted = !todo.isCompleted;
  saveAllTodos(todos);
  filterTodos();
}

function getAllTodos() {
  const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
  return savedTodos;
}
function saveTodo(todo) {
  const savedTodos = getAllTodos();
  savedTodos.push(todo);
  localStorage.setItem("todos", JSON.stringify(savedTodos));
  return savedTodos;
}
function saveAllTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

//edit todo

function findOneTodo(id) {
  const todos = getAllTodos();
  const todo = todos.find((todo) => todo.id === id);
  return todo;
}

let todoEditId;
function openEditForm(e) {
  todoEditId = Number(e.target.dataset.todoId);
  const todoToEdit = findOneTodo(todoEditId);
  editTodoInput.value = todoToEdit.title;
  openModal();
}

function updateTodo(e) {
  const todos = getAllTodos();
  const todo = todos.find((todo) => todo.id === todoEditId);
  todo.title = editTodoInput.value;
  saveAllTodos(todos);
  filterTodos();
}
