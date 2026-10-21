const TASKS_KEY = "nexora-tasks";
const SESSIONS_KEY = "nexora-sessions";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyTasks = document.querySelector("#empty-tasks");
const taskCount = document.querySelector("#task-count");
const taskError = document.querySelector("#task-error");
const sessionCount = document.querySelector("#session-count");
const completeSessionButton = document.querySelector("#complete-session");
const resetSessionsButton = document.querySelector("#reset-sessions");
const quoteText = document.querySelector("#quote-text");
const quoteAuthor = document.querySelector("#quote-author");
const quoteButton = document.querySelector("#new-quote");
const quoteError = document.querySelector("#quote-error");

function readStorage(key, fallback) {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

function saveStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Could not save ${key} to local storage.`, error);
    return false;
  }
}

let tasks = readStorage(TASKS_KEY, []);
if (!Array.isArray(tasks)) tasks = [];

let sessions = Number(readStorage(SESSIONS_KEY, 0));
if (!Number.isFinite(sessions) || sessions < 0) sessions = 0;

function showTaskError(message = "") {
  taskError.textContent = message;
  taskError.hidden = !message;
}

function renderTasks() {
  taskList.innerHTML = "";
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remaining} ${remaining === 1 ? "task" : "tasks"} left`;
  emptyTasks.hidden = tasks.length !== 0;

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "incomplete" : "complete"}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    item.append(checkbox, text, deleteButton);
    taskList.append(item);
  });
}

function persistTasks() {
  if (!saveStorage(TASKS_KEY, tasks)) {
    showTaskError("Your browser could not save changes locally.");
  }
}

function addTask(text) {
  tasks.unshift({ id: Date.now(), text, completed: false });
  persistTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  persistTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  persistTasks();
  renderTasks();
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    showTaskError("Please enter a task before adding it.");
    taskInput.focus();
    return;
  }

  showTaskError();
  addTask(text);
  taskForm.reset();
  taskInput.focus();
});

function renderSessions() {
  sessionCount.textContent = sessions;
}

completeSessionButton.addEventListener("click", () => {
  sessions += 1;
  saveStorage(SESSIONS_KEY, sessions);
  renderSessions();
});

resetSessionsButton.addEventListener("click", () => {
  sessions = 0;
  saveStorage(SESSIONS_KEY, sessions);
  renderSessions();
});

async function loadQuote() {
  quoteButton.disabled = true;
  quoteError.hidden = true;

  try {
    const response = await fetch("/api/quote");
    if (!response.ok) throw new Error("The quote service returned an error.");

    const quote = await response.json();
    if (!quote.text || !quote.author) throw new Error("The quote response was incomplete.");

    quoteText.textContent = `“${quote.text}”`;
    quoteAuthor.textContent = `— ${quote.author}`;
  } catch (error) {
    console.error("Could not load quote.", error);
    quoteError.textContent = "Could not load a new quote. Please try again.";
    quoteError.hidden = false;
  } finally {
    quoteButton.disabled = false;
  }
}

quoteButton.addEventListener("click", loadQuote);

function updateClock() {
  const now = new Date();
  const clock = document.querySelector("#live-clock");
  const date = document.querySelector("#current-date");
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  clock.dateTime = now.toISOString();
  date.textContent = now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

renderTasks();
renderSessions();
updateClock();
setInterval(updateClock, 1000);
loadQuote();
