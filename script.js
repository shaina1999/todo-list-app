'use strict';

const addButton = document.querySelector('.btn-add');
const deleteAllButton = document.querySelector('.todo__btn-delete-all');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo__list');
const todoModalOverlay = document.querySelector('.overlay');
const todoModal = document.querySelector('.modal');
const todoModalInput = document.querySelector('.modal__input');
const todoModalUpdateButton = document.querySelector('.modal__update-btn');
const todoModalDeleteAll = document.querySelector('.modal__delete-all');
const todoError = document.querySelector('.todo__error-message');
const todoModalClose = document.querySelector('.modal__close-btn');
const todoModalConfirm = document.querySelector('.modal__delete-all-btn');

function openEditModal() {
  todoModalOverlay.classList.remove('hidden');
  todoModal.classList.remove('hidden');
}

function openConfirmToDeleteAllModal() {
  todoModalDeleteAll.classList.remove('hidden');
  todoModalOverlay.classList.remove('hidden');
}

function closeEditModal() {
  todoModalOverlay.classList.add('hidden');
  todoModal.classList.add('hidden');
}

function closeConfirmToDeleteAllModal() {
  todoModalDeleteAll.classList.add('hidden');
  todoModalOverlay.classList.add('hidden');
}

// Check if there is an existing todo items on local storage
let todoArray;
if (localStorage.getItem('todos') == null) {
  todoArray = [];
} else {
  const retrievedTodos = localStorage.getItem('todos');
  todoArray = JSON.parse(retrievedTodos);

  // Accesing all elements in the array and displaying to the ui
  let i = 0;
  while (i < todoArray.length) {
    const newElement = document.createElement('li');
    newElement.classList = 'todo__list-item';
    newElement.innerHTML = `<p>${todoArray[i]}</p>
         <div>
         <button class="todo__btn-edit">
            <i class="fas fa-edit" title="edit"></i>
           </button>
           <button class="todo__btn-delete">
             <i class="fas fa-trash" title="delete"></i>
           </button>
         </div>`;
    todoList.appendChild(newElement);
    i++;
  }
}

// ADD BUTTON
addButton.addEventListener('click', function () {
  if (todoInput.value === '' || todoInput.value == null) {
    todoError.classList.remove('hidden');
    setTimeout(() => {
      todoError.classList.add('hidden');
    }, 2000);
  } else {
    const newElement = document.createElement('li');
    newElement.classList = 'todo__list-item';
    newElement.innerHTML = `<p>${todoInput.value}</p>
         <div>
         <button class="todo__btn-edit">
            <i class="fas fa-edit" title="edit"></i>
           </button>
           <button class="todo__btn-delete">
             <i class="fas fa-trash" title="delete"></i>
           </button>
         </div>`;
    todoList.appendChild(newElement);
    todoArray.push(todoInput.value);
    localStorage.setItem('todos', JSON.stringify(todoArray));
    todoInput.value = '';
    toggleDeleteAllButton();
  }
});

// DELETE AND EDIT BUTTON
let currListItem;
let currListItemFirstChildValue;
todoList.addEventListener('click', function (e) {
  let targetElement = e.target;

  if (targetElement.classList[0] === 'todo__btn-delete') {
    const targetItem = targetElement.parentElement.parentElement.firstChild;
    const indexOfItem = todoArray.indexOf(targetItem.textContent);
    targetItem.parentElement.remove();
    todoArray.splice(indexOfItem, 1);
    localStorage.setItem('todos', JSON.stringify(todoArray));
    if (todoArray.length === 0) {
      localStorage.removeItem('todos');
    }
    toggleDeleteAllButton();
  }

  if (targetElement.classList[0] === 'todo__btn-edit') {
    currListItem = e.target.parentElement.parentElement;
    currListItemFirstChildValue = currListItem.firstChild.textContent;
    openEditModal();
    todoModalInput.value = currListItemFirstChildValue;
  }
});

// UPDATE BUTTON
todoModalUpdateButton.addEventListener('click', function () {
  if (todoArray.includes(`${currListItemFirstChildValue}`)) {
    const indexToUpdate = todoArray.indexOf(currListItemFirstChildValue);
    currListItemFirstChildValue = todoModalInput.value;
    todoArray[indexToUpdate] = currListItemFirstChildValue;
    currListItem.firstChild.textContent = currListItemFirstChildValue;
    localStorage.setItem(`todos`, JSON.stringify(todoArray));
  }
  closeEditModal();
});

// DELETE ALL BUTTON
function toggleDeleteAllButton() {
  if (todoArray.length >= 2) {
    deleteAllButton.classList.remove('hidden');
    deleteAllButton.addEventListener('click', function () {
      openConfirmToDeleteAllModal();
      todoModalClose.addEventListener('click', function () {
        closeConfirmToDeleteAllModal();
      });
      todoModalConfirm.addEventListener('click', function () {
        todoArray = [];
        todoList.innerHTML = '';
        localStorage.removeItem('todos');
        deleteAllButton.classList.add('hidden');
        closeConfirmToDeleteAllModal();
      });
    });
  } else {
    deleteAllButton.classList.add('hidden');
  }
}
toggleDeleteAllButton();

todoModalOverlay.addEventListener('click', function () {
  todoModalOverlay.classList.add('hidden');
  todoModal.classList.add('hidden');
  todoModalDeleteAll.classList.add('hidden');
});
