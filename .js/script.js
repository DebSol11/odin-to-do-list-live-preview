// The code is highly influenced by the video on YouTube from Web Dev Simplified - How to Code A Better To-Do List - Tutorial
// https://www.youtube.com/watch?v=W7FaYfuwu70 (visited on 2025-09-04)
// Thank you Kyle
// As well as the video
// Creating a better todo app - the HTML and CSS
// https://www.youtube.com/watch?v=IhmSidOJSeE
// by Kevin Powell

// Selectors
const projectsArrayContainer = document.querySelector("[data-projectsArray]");
const newProjectForm = document.querySelector("[data-new-project-form");
const newProjectInput = document.querySelector("[data-new-project-input");
const deleteProjectButton = document.querySelector(
  "[data-delete-project-button]"
);

const projectDisplayContainer = document.querySelector(
  "[data-project-display-container]"
);
const projectTitleElement = document.querySelector("[data-project-title]");
const projectCountElement = document.querySelector("[data-project-count]");
const tasksContainer = document.querySelector("[data-tasks]");
const taskTemplate = document.getElementById("task-template");

const displayNewToDoModal = document.getElementById("addToDoIcon");
const closeNewToDoModal = document.getElementById("closeModal");
const addToDoFormModal = document.getElementById("addToDoFormModal");

const newTaskForm = document.querySelector("[data-new-task-form]");
const newTaskSelectedProject = document.querySelector(
  "[data-new-task-selected-project]"
);
const newTaskTitleInput = document.querySelector("[data-new-task-title-input]");
const newTaskPriorityInput = document.querySelector(
  "[data-new-task-priority-input]"
);
const newTaskDescriptionInput = document.querySelector(
  "[data-new-task-description-input]"
);
const newTaskDueDateInput = document.querySelector(
  "[data-new-task-dueDate-input]"
);
const newTaskNotesInput = document.querySelector("[data-new-task-notes-input]");

const htmlBody = document.querySelector("body");
const detailsTemplate = document.getElementById("details-template");

const clearCompleteTasksButton = document.querySelector(
  "[data-clear-complete-tasks-button]"
);


const LOCAL_STORAGE_PROJECT_KEY = "task.projectsArray";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedProjectId";


let projectsArray =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_PROJECT_KEY)) || [];
let selectedProjectId = localStorage.getItem(
  LOCAL_STORAGE_SELECTED_LIST_ID_KEY
);

// When you dynamically add an element to the page in this case a project you need to always add an event listener to it, but there is a way around it. By adding an event Listener to the container that contains all the projects you are dynamically adding. This way you can also get around the nodeList/ querySelectorAll usage. What this does is essentially adding an event Listener to all the elements inside the container

// Event Listeners
projectsArrayContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedProjectId = e.target.dataset.projectId;
    saveAndRender();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedProject = projectsArray.find(
      (project) => project.id === selectedProjectId
    );
    console.log(selectedProject.tasks);
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    selectedTask.complete = e.target.checked;
    saveAndRender();
  } else if (e.target.tagName.toLowerCase() === "button") {
    const selectedProject = projectsArray.find(
      (project) => project.id === selectedProjectId
    );
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    displayDetails(selectedTask);
    listenForCloseDetailsClick();
  } else if (e.target.tagName.toLowerCase() === "img") {
    const selectedProject = projectsArray.find(
      (project) => project.id === selectedProjectId
    );
    console.log(selectedProject.tasks);
    const selectedTask = selectedProject.tasks.find(
      (task) => task.id === e.target.id
    );
    editTask(selectedTask);
  }
});

newProjectForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const projectName = newProjectInput.value;
  // check if an actual name was passed in
  if (projectName == null || projectName === "") return;
  const project = createProject(projectName);
  // now we clear out the input field for a better user experience
  newProjectInput.value = null;
  projectsArray.push(project);
  saveAndRender();
});

clearCompleteTasksButton.addEventListener("click", (e) => {
  const selectedProject = projectsArray.find(
    (project) => project.id === selectedProjectId
  );
  // Overwrite the tasks array
  selectedProject.tasks = selectedProject.tasks.filter(
    (task) => !task.complete
  );
  saveAndRender();
});

deleteProjectButton.addEventListener("click", () => {
  projectsArray = projectsArray.filter(
    (project) => project.id !== selectedProjectId
  );
  // since the selectedProject is taken out of the List set it to null
  selectedProjectId = null;
  saveAndRender();
});

displayNewToDoModal.addEventListener("click", () => {
  const selectedProject = projectsArray.find(
    (project) => project.id === selectedProjectId
  );
  newTaskSelectedProject.innerText = selectedProject.name;
  addToDoFormModal.classList.add("active");
  addToDoFormModal.classList.add("open");
  addToDoFormModal.style.display = "block";
});

closeNewToDoModal.addEventListener("click", () => {
  addToDoFormModal.classList.add("slideOut");
  setTimeout(() => {
    addToDoFormModal.classList.remove("active", "slideOut");
    addToDoFormModal.style.display = "none";
  }, 500); // Wait for the animation to complete (500ms)
});

newTaskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedProject = projectsArray.find(
    (project) => project.id === selectedProjectId
  );
  const taskSelectedProjectName = selectedProject.name;
  const taskPriority = newTaskPriorityInput.value;
  const taskTitle = newTaskTitleInput.value;
  const taskDescription = newTaskDescriptionInput.value;
  const taskDueDate = newTaskDueDateInput.value;
  const taskNotes = newTaskNotesInput.value;
  // check if an actual name was passed in
  if (taskTitle == null || taskTitle === "") return;
  const task = createTask(
    taskSelectedProjectName,
    taskPriority,
    taskTitle,
    taskDescription,
    taskDueDate,
    taskNotes
  );
  // now we clear out the input field for a better user experience
  newTaskPriorityInput.value = "A";
  newTaskTitleInput.value = null;
  newTaskDescriptionInput.value = null;
  newTaskDueDateInput.value = null;
  newTaskNotesInput.value = null;

  selectedProject.tasks.push(task);
  console.log(selectedProject);
  saveAndRender();
});

// Function definitions
function createProject(name) {
  // make a unique id very easily using the current date and time
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(project, priority, name, description, dueDate, notes) {
  return {
    id: Date.now().toString(),
    project: project,
    priority: priority,
    name: name,
    description: description,
    dueDate: dueDate,
    notes: notes,
    complete: false,
  };
}

function saveAndRender() {
  save();
  render();
}

function save() {
  localStorage.setItem(
    LOCAL_STORAGE_PROJECT_KEY,
    JSON.stringify(projectsArray)
  );
  localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY, selectedProjectId);
}

function render() {
  clearElement(projectsArrayContainer);
  renderProjects();

  const selectedProject = projectsArray.find(
    (project) => project.id === selectedProjectId
  );

  if (selectedProjectId == null) {
    projectDisplayContainer.style.display = "none";
  } else {
    projectDisplayContainer.style.display = "";
    projectTitleElement.innerText = selectedProject.name;
    renderTaskCount(selectedProject);
    clearElement(tasksContainer);
    renderTasks(selectedProject);
  }
}

function renderTasks(selectedProject) {
  selectedProject.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplate.content, true);

    const prioritySpan = taskElement.querySelector(".task-priority");
    colorTasks(prioritySpan, task);

    const checkbox = taskElement.querySelector("input");
    checkbox.id = task.id;
    checkbox.checked = task.complete;

    const title = taskElement.querySelector(".taskTitle");
    title.htmlFor = task.id;
    title.append(task.name);

    const detailsButton = taskElement.querySelector(".detailsBtn");
    detailsButton.id = task.id;

    const editPen = taskElement.querySelector(".edit-pen");
    editPen.id = task.id;

    tasksContainer.appendChild(taskElement);
  });
}

function colorTasks(element, task) {
  if (task.complete === true) {
    element.classList.add("colorGrey");
  }
  if (task.priority === "AAA") {
    element.classList.add("colorAAA");
  } else if (task.priority === "AA") {
    element.classList.add("colorAA");
  } else if (task.priority === "A") {
    element.classList.add("colorA");
  } else if (task.priority === "B") {
    element.classList.add("colorB");
  } else if (task.priority === "C") {
    element.classList.add("colorC");
  } else {
    alert("Shit happened!");
  }
}

function renderTaskCount(selectedProject) {
  const incompleteTaskCount = selectedProject.tasks.filter(
    (task) => !task.complete
  ).length;
  const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
  projectCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`;
}

function renderProjects() {
  projectsArray.forEach((project) => {
    const projectElement = document.createElement("li");
    projectElement.dataset.projectId = project.id; // This creates a data-project-id and property for the current list element and assigns the id of the project to it
    projectElement.classList.add("project-name");
    projectElement.innerText = project.name;
    if (project.id === selectedProjectId) {
      projectElement.classList.add("active-project");
    }
    projectsArrayContainer.appendChild(projectElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function displayDetails(task) {
  const taskDetails = document.importNode(detailsTemplate.content, true);

  const displayDetailsId = taskDetails.querySelector("#displayDetailsId");

  const detailsProject = taskDetails.querySelector("[data-details-project]");
  detailsProject.innerText = task.project;

  const detailsPriority = taskDetails.querySelector("[data-details-priority]");
  detailsPriority.innerText = task.priority;
  if (task.priority === "AAA") {
    displayDetailsId.classList.add("colorAAA");
  } else if (task.priority === "AA") {
    displayDetailsId.classList.add("colorAA");
  } else if (task.priority === "A") {
    displayDetailsId.classList.add("colorA");
  } else if (task.priority === "B") {
    displayDetailsId.classList.add("colorB");
  } else if (task.priority === "C") {
    displayDetailsId.classList.add("colorC");
  } else {
    alert = "Shit happened! NoNoNo!";
  }

  const detailsTitle = taskDetails.querySelector("[data-details-title]");
  detailsTitle.innerText = task.name;

  const detailsDescription = taskDetails.querySelector(
    "[data-details-description]"
  );
  detailsDescription.innerText = task.description;

  const detailsDueDate = taskDetails.querySelector("[data-details-dueDate]");
  detailsDueDate.innerText = task.dueDate;

  const detailsNotes = taskDetails.querySelector("[data-details-notes]");
  detailsNotes.innerText = task.notes;

  const displayDetailsModal = taskDetails.getElementById("displayDetailsModal");
  displayDetailsModal.classList.add("active");
  displayDetailsModal.classList.add("open");
  displayDetailsModal.style.display = "block";

  htmlBody.appendChild(taskDetails);
}

function listenForCloseDetailsClick() {
  const closeDetailsModal = document.getElementById("closeDetailsModal");
  const displayDetailsModal = document.getElementById("displayDetailsModal");
  closeDetailsModal.addEventListener("click", () => {
    console.log("close button works");
    displayDetailsModal.classList.add("slideOut");
    setTimeout(() => {
      displayDetailsModal.remove();
    }, 500);
  });
}

function editTask(task) {
  const projectText = document.querySelector(".selectedProjectDisplayPara");
  const priority = document.getElementById("priority");
  const title = document.getElementById("title");
  const description = document.getElementById("description");
  const dueDate = document.getElementById("dueDate");
  const notes = document.getElementById("notes");
  projectText.innerText = task.project;
  priority.value = task.priority;
  title.value = task.name;
  description.value = task.description;
  dueDate.value = task.dueDate;
  notes.value = task.notes;
  addToDoFormModal.classList.add("active");
  addToDoFormModal.classList.add("open");
  addToDoFormModal.style.display = "block";
}

// Feel free to code this function
// function removeEditedTask() {
// }

// Function calls
render();