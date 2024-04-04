// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Function to create a task card
function createTaskCard(task) {
  let cardHtml = `
    <div id="task-${task.id}" class="task-card draggable ui-widget-content">
      <h3>${task.title}</h3>
      <p>Description: ${task.description}</p>
      <p>Deadline: ${task.deadline}</p>
      <button class="btn btn-danger delete-task" data-task-id="${task.id}">Delete</button>
    </div>
  `;
  return cardHtml;
}



// Function to render the task list and make cards draggable
function renderTaskList() {
  $("#todo-cards").empty();
  taskList.forEach(task => {
    $("#todo-cards").append(createTaskCard(task));
  });
  $(".draggable").draggable({
    revert: "invalid",
    cursor: "move"
  });
}

// Function to handle adding a new task
function handleAddTask(event){
    $("#formModal").dialog("open"); // Open the modal dialog when clicking Add Task button
  }
  
// Function to handle deleting a task
function handleDeleteTask(event){
  let taskId = $(this).data("task-id");
  taskList = taskList.filter(task => task.id !== taskId);
  renderTaskList();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event, ui, targetLane) {
  let taskId = ui.draggable.attr("id").split("-")[1]; // Extract task ID from draggable element
  let task = taskList.find(task => task.id == taskId); // Find the task object in the taskList
  
  // Update task progress based on the target lane
  if (targetLane.attr("id") === "in-progress") {
    task.progress = "In Progress";
  } else if (targetLane.attr("id") === "done") {
    task.progress = "Done";
  }
  
  renderTaskList(); // Re-render the task list to reflect the changes
}

// When the page loads, render the task list, add event listeners, make lanes droppable
$(document).ready(function () {
    renderTaskList(); // Render the initial task list
  
    // Add event listener to the button to handle adding a new task
    $("#addTaskBtn").off("click").on("click", handleAddTask);
  
    // Add event listener to handle task deletion
    $(".delete-task").on("click", handleDeleteTask);
  
    // Initialize modal dialog
    $("#formModal").dialog({
      autoOpen: false, // Ensure it's not opened by default
      modal: true,
      buttons: [
        {
          text: "Save",
          class: "btn btn-primary",
          click: function() {
            let title = $("#task-title").val();
            let description = $("#task-description").val();
            let deadline = $("#task-deadline").val();
            let task = {
              id: generateTaskId(),
              title: title,
              description: description,
              deadline: deadline,
              progress: "To Do" // Default progress is set to "To Do"
            };
            taskList.push(task);
            localStorage.setItem("tasks", JSON.stringify(taskList));
            localStorage.setItem("nextId", nextId);
            renderTaskList();
            $(this).dialog("close");
          }
        },
        {
          text: "Cancel",
          class: "btn btn-secondary",
          click: function() {
            $(this).dialog("close");
          }
        }
      ]
    });
  
    // Make all lanes droppable
    $(".col-12.col-lg-4.d-flex").droppable({
      accept: ".draggable",
      drop: function(event, ui) {
        handleDrop(event, ui, $(this));
      }
    });
});