const STORAGE_KEY = "daily_focus_board_v1";

const focusInput = document.getElementById("focusInput");
const saveFocusBtn = document.getElementById("saveFocusBtn");
const focusDisplay = document.getElementById("focusDisplay");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearDoneBtn = document.getElementById("clearDoneBtn");
const resetBoardBtn = document.getElementById("resetBoardBtn");

function loadBoard() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { focus: "", tasks: [] };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      focus: parsed.focus || "",
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
    };
  } catch (error) {
    return { focus: "", tasks: [] };
  }
}

function saveBoard(board) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

function renderFocus(board) {
  focusDisplay.textContent = board.focus || "No focus saved yet.";
}

function renderTasks(board) {
  taskList.innerHTML = "";

  if (board.tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "task-item";
    emptyItem.innerHTML = "<span class='task-text'>No tasks added yet.</span>";
    taskList.appendChild(emptyItem);
    return;
  }

  board.tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.done ? " done" : ""}`;

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "task-toggle";
    toggleBtn.textContent = task.done ? "Undo" : "Done";
    toggleBtn.addEventListener("click", () => {
      task.done = !task.done;
      saveBoard(board);
      render(board);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "task-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => {
      board.tasks = board.tasks.filter((currentTask) => currentTask.id !== task.id);
      saveBoard(board);
      render(board);
    });

    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(text);
    item.appendChild(actions);
    taskList.appendChild(item);
  });
}

function render(board) {
  renderFocus(board);
  renderTasks(board);
}

const board = loadBoard();
render(board);

saveFocusBtn.addEventListener("click", () => {
  board.focus = focusInput.value.trim();
  saveBoard(board);
  render(board);
  focusInput.value = "";
});

addTaskBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  if (!taskText) {
    return;
  }

  board.tasks.unshift({
    id: Date.now(),
    text: taskText,
    done: false,
  });
  saveBoard(board);
  render(board);
  taskInput.value = "";
});

clearDoneBtn.addEventListener("click", () => {
  board.tasks = board.tasks.filter((task) => !task.done);
  saveBoard(board);
  render(board);
});

resetBoardBtn.addEventListener("click", () => {
  board.focus = "";
  board.tasks = [];
  saveBoard(board);
  render(board);
});
