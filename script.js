const TaskManager = (function () {
  'use strict';

  /**
   * Module description...
   * @module TaskManager
  */

  const baseURL = 'http://localhost';
  // const baseURL = 'https://etechlogics.com/projects/sobi';

  // Cache DOM

  const addTaskButton = document.getElementById('add_task_button');
  const popupContainer = document.getElementById('popup_container');
  const closeBtn = document.getElementById('close_btn');
  const cancelBtn = document.getElementById('close_task_modal');
  const notificationDiv = document.getElementById('notification_div');
  const expandButton = document.getElementById("expand_button");
  const sidebar = document.getElementById("sidebar");
  const mainHeadingDiv = document.getElementById("task_manager_heading_div");
  const taskForm = document.getElementById('task_form');
  const taskTitleInput = document.getElementById('task_title');
  const dueDateInput = document.getElementById('due_date');
  const notificationDateInput = document.getElementById('notification_date');
  const taskListItems = document.querySelectorAll('#expanded_menu_titles li');
  const viewAllTasks = document.getElementById('view_all_task');
  const expandedMenu = document.getElementById('expanded_menu');
  const viewCompletedTasks = document.getElementById('view_completed_task');
  const viewAssignedTasks = document.getElementById('view_assigned_task');
  const expandedMenuCompletedTasks = document.getElementById('expanded_menu_completed_tasks');
  const expandedMenuAssignedTasks = document.getElementById('expanded_menu_assigned_tasks');
  const fillDueDateReminder = document.getElementById('fill_due_date_reminder');
  const fillNotificationDateReminder = document.getElementById('fill_notification_date_reminder');
  const searchInput = document.querySelector('.search-input');
  const searchReset = document.querySelector('.search-reset');
  const assignTaskModal = document.getElementById('assign_task_modal');
  const assignTaskButton = document.querySelector('.assign-task');
  const closeModalButton = document.getElementById('close_model');
  const assignButton = document.getElementById('assign_button');
  const assignTaskUserEmail = document.getElementById('assign_task_user_email');
  const assignTaskModalEmail = document.getElementById('assign_task_modal_email');
  const viewAllTaskTotal = document.getElementById('view_all_task_total');
  const viewCompletedTaskTotal = document.getElementById('view_completed_task_total');
  const viewAssignedTaskTotal = document.getElementById('view_assigned_task_total');
  let sentNotificationIds = [];        // Maintain a list of task IDs for notifications that have been sent

  flatpickr(dueDateInput, {
    dateFormat: "Y-m-d",
    altInput: true,
    altFormat: "F j, Y",
    disableMobile: "true",
    onChange: function () {
      // Hide the message when a date is selected
      $('#fill_due_date_reminder').hide();
    }
  });
  flatpickr(notificationDateInput, {
    enableTime: true, // Enable time selection
    dateFormat: "Y-m-d H:i",
    altInput: true,
    altFormat: "F j, Y H:i",
    disableMobile: "true",
    onChange: function () {
      // Hide the message when a date is selected
      $('#fill_notification_date_reminder').hide();
    }
  });

  // Send AJAX request to fetch tasks reminder time for the sake of notifications
  function triggerReminder() {
    $.ajax({
      type: 'GET',
      url: `${baseURL}/task-manager/api/fetch_tasks.php`,
      dataType: 'json',
      success: function (tasks) {
        scheduleReminder(tasks);
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }

  // Function to schedule push notifications for tasks with reminders
  function scheduleReminder(tasks) {
    tasks.forEach(task => {
      const reminderTime = new Date(task.reminder).getTime();
      const currentTime = new Date().getTime();
      const timeDifference = reminderTime - currentTime;

      if (timeDifference > 0) {
        setTimeout(() => {
          const taskId = task.id;

          // Check if the task ID is not in the sentNotificationIds list
          if (!sentNotificationIds.includes(taskId)) {
            const notificationTitle = 'Task Manager';
            const notificationBody = `Don't forget to complete task: ${task.title}`;
            const notificationOptions = {
              body: notificationBody,
              icon: 'assets/stopwatch.png',
              data: { url: `${baseURL}/task-manager/` }
            };

            // Check if the browser supports notifications
            if (Notification.permission === 'granted') {
              // If permission is granted, show the notification
              const notification = new Notification(notificationTitle, notificationOptions);
              sentNotificationIds.push(taskId); // Add the ID to the sentNotificationIds list

              // Handle click event of the notification
              notification.onclick = function (event) {
                event.preventDefault(); // Prevent the browser from focusing the Notification's tab
                window.open(notificationOptions.data.url, '_blank'); // Open the URL in a new tab
              };
            } else if (Notification.permission !== 'denied') {
              // If permission is not denied, request permission from the user
              Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                  // If permission is granted, show the notification
                  const notification = new Notification(notificationTitle, notificationOptions);
                  sentNotificationIds.push(taskId); // Add the ID to the sentNotificationIds list

                  // Handle click event of the notification
                  notification.onclick = function (event) {
                    event.preventDefault(); // Prevent the browser from focusing the Notification's tab
                    window.open(notificationOptions.data.url, '_blank'); // Open the URL in a new tab
                  };
                }
              });
            }
          }
        }, timeDifference);
      }
    });
  }

  searchInput.addEventListener('input', function () {
    const searchQuery = this.value.trim();

    // Check if expandedMenu is visible
    if (window.getComputedStyle(expandedMenu).display === 'block') {

      // Send AJAX request to fetch filtered tasks .......Search
      $.ajax({
        type: 'GET',
        url: `${baseURL}/task-manager/api/fetch_tasks.php`,
        dataType: 'json',
        data: { search_query: searchQuery }, // Pass the search query as data
        success: function (tasks) {
          // Clear existing task list
          expandedMenu.innerHTML = '';

          if (tasks.length > 0) {
            tasks.forEach(task => {
              const taskId = task.id;
                const completeBtnId = `task_complete_${taskId}`;
                const removeBtnId = `task_remove_${taskId}`;
                // Truncate the title to 50 characters
                const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;
                // Bold the matched text by wrapping it in <strong> tags
                const boldedTitle = truncatedTitle.replace(new RegExp(searchQuery, 'ig'), '<strong style="color:#ef8f2c;">$&</strong>');
                // Format the due date and time
                const formattedDateTime = formatDateTime(task.due_date);
                expandedMenu.innerHTML += `<li><a href="#"><span class="view-task-title">${boldedTitle}</span><span class="view-task-due-date">Due on ${formattedDateTime}</span>${task.note !== "Default Task" ? `
              <span class="note-span">
                  <span note-svg><img src="assets/note.svg"></span>
                  <span class="notes">${task.note}</span>
              </span>
          ` : ''}
        </a>
              ${task.flag === 'true' ? '<svg style="fill: #ef8f2c;" viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="flag-solid"><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"></path></svg>' : ''}
              <button id="${completeBtnId}" class="complete-btn">completed</button>
              <button id="${removeBtnId}" class="remove-btn">remove</button>
              </li>`;
                // Add event listener for complete button
                expandedMenu.querySelectorAll('.complete-btn').forEach(button => {
                  button.addEventListener('click', function () {
                    const taskId = this.id.split('_')[2];
                    updateTaskStatus(taskId, 'complete');
                  });
                });
                // Add event listener for remove button
                expandedMenu.querySelectorAll('.remove-btn').forEach(button => {
                  button.addEventListener('click', function () {
                    const taskId = this.id.split('_')[2];
                    removeFromModel(taskId);
                  });
                });
            });
          } else {
            // If no tasks are found, display "No task found" message
            expandedMenu.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: red;"> No tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please try using different keyword </span>';
          }
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText);
        }
      });
    } else if (window.getComputedStyle(expandedMenuCompletedTasks).display === 'block') {

      $.ajax({
        type: 'GET',
        url: `${baseURL}/task-manager/api/fetch_completed_tasks.php`,
        dataType: 'json',
        data: { search_query: searchQuery }, // Pass the search query as data
        success: function (tasks) {
          // Clear existing task list
          expandedMenuCompletedTasks.innerHTML = '';
          if (tasks.length > 0) {
            tasks.forEach(task => {
              // Truncate the title to 50 characters
              const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;
              const boldedTitle = truncatedTitle.replace(new RegExp(searchQuery, 'ig'), '<strong style="color:#ef8f2c;">$&</strong>');

              // Append a cross button at the right end of each <li> element
              const liElement = document.createElement('li');
              liElement.classList.add('completed-task-item');
              liElement.innerHTML = `<div class="complete-task-div"><span class="completed-task-title">${boldedTitle}</span><span class="completed-date"> Completed </span>
            ${task.note !== "Default Task" ? `
                <span class="note-span" style="margin:1%">
                    <span note-svg><img src="assets/note.svg"></span>
                    <span class="notes">${task.note}</span>
                </span>
            ` : ''}
            </div>
            <div class="remove-complete-task-btn" id="remove_complete_${task.id}">&times;</div>`;

              // Add event listener for remove button
              liElement.querySelector('.remove-complete-task-btn').addEventListener('click', function () {
                const taskId = this.id.split('_')[2];
                removeFromModel(taskId);
              });

              expandedMenuCompletedTasks.appendChild(liElement);
            });
          } else {
            // If no tasks are found, display "No task found" message
            expandedMenuCompletedTasks.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: red;"> No tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please try using different keyword </span>';
          }
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText);
        }
      });
    } else if (window.getComputedStyle(expandedMenuAssignedTasks).display === 'block') {

      $.ajax({
        type: 'GET',
        url: `${baseURL}/task-manager/api/assigned_task.php`,
        dataType: 'json',
        data: { search_query: searchQuery }, // Pass the search query as data
        success: function (tasks) {
          // Clear existing task list
          expandedMenuAssignedTasks.innerHTML = '';
          if (tasks.length > 0) {
            tasks.forEach(task => {

              const formattedDateTime = formatDateTime(task.due_date);

              // Convert due date string to a Date object
              const dueDate = new Date(task.due_date);

              // Get today's date without time
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              // Apply styling based on due date comparison
              let dueDateStyle = '';
              if (dueDate >= today) {
                // If due date is today or in the future, make it green
                dueDateStyle = 'color: green;';
              } else {
                // If due date is in the past, make it red
                dueDateStyle = 'color: red;';
              }
              // Truncate the title to 50 characters
              const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;
              const boldedTitle = truncatedTitle.replace(new RegExp(searchQuery, 'ig'), '<strong style="color:#ef8f2c;">$&</strong>');

              expandedMenuAssignedTasks.innerHTML += `<li class="assign-task-list"> <div style="display:flex;flex-direction:column; width:95%; padding:1.5%;"><span class="assign-task-title">${boldedTitle}</span><span class="assign-email"> ${task.assigned} </span>
        <span class="view-task-due-date" id="assign_task_due_date">Due on ${formattedDateTime}</span>
        ${task.note !== "Default Task" ? `
    <span class="note-span" style="margin-top:1%">
        <span note-svg><img src="assets/note.svg"></span>
        <span class="notes">${task.note}</span>
    </span>
` : ''} </div>
         <div class="remove-assigned-task-btn" id="remove_assigned_${task.id}">&times;</div>
        </li>`;

              expandedMenuAssignedTasks.querySelectorAll('.remove-assigned-task-btn').forEach(button => {
                button.addEventListener('click', function () {
                  const taskId = this.id.split('_')[2];
                  removeFromModel(taskId);
                });
              });
            });
          } else {
            // If no tasks are found, display "No task found" message
            expandedMenuAssignedTasks.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: red;"> No tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please try using different keyword </span>';
          }
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText);
        }
      });
    }
  });

  // Function to fetch tasks from the server
  function fetchTasks() {
    $.ajax({
      type: 'GET',
      url: `${baseURL}/task-manager/api/fetch_tasks.php`,
      dataType: 'json',
      success: function (tasks) {
        viewAllTaskTotal.innerHTML = '';
        viewAllTaskTotal.innerHTML = tasks.length;
        expandedMenu.innerHTML = ''; // Clear existing task list
        if (tasks.length>0) {
        tasks.forEach(task => {
            
          // Generate unique IDs for the complete and remove buttons
          const taskId = task.id;
          const completeBtnId = `task_complete_${taskId}`;
          const removeBtnId = `task_remove_${taskId}`;

          // Truncate the title to 20 characters
          const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;

          const formattedDateTime = formatDateTime(task.due_date);

          // Convert due date string to a Date object
          const dueDate = new Date(task.due_date);

          // Get today's date without time
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Apply styling based on due date comparison
          let dueDateStyle = '';
          if (dueDate >= today) {
            // If due date is today or in the future, make it green
            dueDateStyle = 'color: green;';
          } else {
            // If due date is in the past, make it red
            dueDateStyle = 'color: red;';
          }
          expandedMenu.innerHTML += `
  <li>
  <a href="#">
  <span class="view-task-title">${truncatedTitle}</span>
  <span class="view-task-due-date" style="${dueDateStyle}">Due on ${formattedDateTime}</span>
  ${task.note !== "Default Task" ? `
      <span class="note-span">
          <span note-svg><img src="assets/note.svg"></span>
          <span class="notes">${task.note}</span>
      </span>
  ` : ''}
</a>
    ${task.flag === 'true' ? '<svg style="fill: #ef8f2c;" viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="flag-solid"><path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z"></path></svg>' : ''}
    <button id="${completeBtnId}" class="complete-btn">completed</button>
    <button id="${removeBtnId}" class="remove-btn">remove</button>
  </li>
`;


          // Add event listener for complete button
          expandedMenu.querySelectorAll('.complete-btn').forEach(button => {
            button.addEventListener('click', function () {
              const taskId = this.id.split('_')[2];
              updateTaskStatus(taskId, 'complete');
            });
          });

          // Add event listener for remove button
          expandedMenu.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', function () {
              const taskId = this.id.split('_')[2];
              removeFromModel(taskId);
            });
          });
        });
      }else {
        // If no tasks are found, display "No task found" message
        expandedMenu.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: Black;"> No tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please create tasks to view here </span>';
      }
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }


  // Function to format date and time
  function formatDateTime(dateTimeString) {
    const dueDate = new Date(dateTimeString);
    const options = { month: 'short', day: 'numeric' };
    return dueDate.toLocaleString('en-US', options);
  }

  fetchTasks(); // Call fetchTasks() to fetch tasks when the page loads


  // Function to update task status
  function updateTaskStatus(taskId, status) {
    $.ajax({
      type: 'POST',
      url: `${baseURL}/task-manager/api/update_task_status.php`,
      data: { id: taskId, status: status },
      success: function (response) {
        notificationDiv.innerHTML = '<p>' + response + '</p>';
        notificationDiv.classList.add('show');
        popupContainer.style.display = 'none';
        setTimeout(function () {
          notificationDiv.classList.remove('show');
        }, 3500);
        // Refresh the task list after updating status
        fetchTasks();
        fetchCompletedTasks();
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }

  function removeFromModel(taskId) {
    // Show the custom modal
    const modal = document.getElementById('confirm_modal');
    modal.style.display = 'block';
    
    // Set data attribute in the modal to store the task ID
    modal.setAttribute('data-task-id', taskId);
    
    // Add event listener for "Yes" button in the modal
    const confirmYesButton = modal.querySelector('#confirm_Yes');
    confirmYesButton.addEventListener('click', function() {
        // Retrieve the task ID from the data attribute
        const taskId = modal.getAttribute('data-task-id');
        // Hide the modal
        modal.style.display = 'none';
        // Remove the task
        removeTask(taskId);
    });
    
    // Add event listener for "No" button in the modal
    const confirmNoButton = modal.querySelector('#confirm_No');
    confirmNoButton.addEventListener('click', function() {
        // Hide the modal
        modal.style.display = 'none';
    });
    }


  // Function to remove task
  function removeTask(taskId) {
    $.ajax({
      type: 'POST',
      url: `${baseURL}/task-manager/api/remove_task.php`,
      data: { id: taskId },
      success: function (response) {
        notificationDiv.innerHTML = '<p>' + response + '</p>';
        notificationDiv.classList.add('show');
        popupContainer.style.display = 'none';
        setTimeout(function () {
          notificationDiv.classList.remove('show');
        }, 2000);
        // Refresh the task list after removing task
        fetchTasks();
        fetchCompletedTasks();
        fetchAssignedTasks();
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }


  function fetchCompletedTasks() {
    $.ajax({
      type: 'GET',
      url: `${baseURL}/task-manager/api/fetch_completed_tasks.php`,
      dataType: 'json',
      success: function (tasks) {
        viewCompletedTaskTotal.innerHTML = '';
        viewCompletedTaskTotal.innerHTML = tasks.length;
        expandedMenuCompletedTasks.innerHTML = '';
        if (tasks.length>0) {
          
        tasks.forEach(task => {
          // Truncate the title to 50 characters
          const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;

          // Append a cross button at the right end of each <li> element
          const liElement = document.createElement('li');
          liElement.classList.add('completed-task-item');
          liElement.innerHTML = `<div class="complete-task-div"><span class="completed-task-title">${truncatedTitle}</span><span class="completed-date"> Completed </span>
                ${task.note !== "Default Task" ? `
                    <span class="note-span" style="margin:1%">
                        <span note-svg><img src="assets/note.svg"></span>
                        <span class="notes">${task.note}</span>
                    </span>
                ` : ''}
                </div>
                <div class="remove-complete-task-btn" id="remove_complete_${task.id}">&times;</div>`;

          // Add event listener for remove button
          liElement.querySelector('.remove-complete-task-btn').addEventListener('click', function () {
            const taskId = this.id.split('_')[2];
            removeFromModel(taskId);
          });

          expandedMenuCompletedTasks.appendChild(liElement);
        });
      }else {
        // If no tasks are found, display "No task found" message
        expandedMenuCompletedTasks.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: Black;"> No completed tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please create tasks to view here </span>';
      }
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }

  fetchCompletedTasks();




  // Function to fetch assigned tasks from the db
  function fetchAssignedTasks() {
    $.ajax({
      type: 'GET',
      url: `${baseURL}/task-manager/api/assigned_task.php`,
      dataType: 'json',
      success: function (tasks) {
        viewAssignedTaskTotal.innerHTML = '';
        viewAssignedTaskTotal.innerHTML = tasks.length;
        expandedMenuAssignedTasks.innerHTML = '';
        if (tasks.length>0) {
          
        tasks.forEach(task => {

          const formattedDateTime = formatDateTime(task.due_date);

          // Convert due date string to a Date object
          const dueDate = new Date(task.due_date);

          // Get today's date without time
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Apply styling based on due date comparison
          let dueDateStyle = '';
          if (dueDate >= today) {
            // If due date is today or in the future, make it green
            dueDateStyle = 'color: green;';
          } else {
            // If due date is in the past, make it red
            dueDateStyle = 'color: red;';
          }
          // Truncate the title to 50 characters
          const truncatedTitle = task.title.length > 50 ? task.title.substring(0, 50) + '...' : task.title;

          expandedMenuAssignedTasks.innerHTML += `<li class="assign-task-list"> <div style="display:flex;flex-direction:column; width:95%; padding:1.5%;"><span class="assign-task-title">${truncatedTitle}</span><span class="assign-email"> ${task.assigned} </span>
          <span class="view-task-due-date" id="assign_task_due_date">Due on ${formattedDateTime}</span>
          ${task.note !== "Default Task" ? `
      <span class="note-span" style="margin-top:1%">
          <span note-svg><img src="assets/note.svg"></span>
          <span class="notes">${task.note}</span>
      </span>
  ` : ''} </div>
           <div class="remove-assigned-task-btn" id="remove_assigned_${task.id}">&times;</div>
          </li>`;

          expandedMenuAssignedTasks.querySelectorAll('.remove-assigned-task-btn').forEach(button => {
            button.addEventListener('click', function () {
              const taskId = this.id.split('_')[2];
              removeFromModel(taskId);
            });
          });
        });
      }else {
        // If no tasks are found, display "No task found" message
        expandedMenuAssignedTasks.innerHTML = '<span style="text-align: center;display: block;padding: 3%;font-size: larger;color: Black;"> No assigned tasks found </span> <br> <span style="text-align: center;display: block;padding: 3%; color:#5f5252d6;"> Please create tasks to view here </span>';
      }
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      }
    });
  }
  fetchAssignedTasks();


  // Event Handlers
  const _events = {
    addTaskButtonClick() {
      popupContainer.style.display = 'flex';
      $('#task_title').val('');
      $('#due_date').val('');
      $('#notification_date').val('');
      $('#assign_task_user_email').val('');
      $('#assign_task_modal_email').val('');
      $('#flag_checkbox').prop('checked', false);
      assignTaskButton.innerText = "";
      assignTaskButton.innerText = "Assign";
    },
    searchResetButtonClick() {
      fetchTasks();
      fetchCompletedTasks();
      fetchAssignedTasks();
    },
    closeBtnClick() {
      popupContainer.style.display = 'none';
      taskForm.reset();
      assignTaskButton.innerText = "";
      assignTaskButton.innerText = "Assign";
      notificationDiv.classList.remove('show');
      $('#assign_task_user_email').val('');
      $('#assign_task_modal_email').val('');
      assignTaskButton.innerText = "";
      assignTaskButton.innerText = "Assign";
    },
    taskFormSubmit(event) {
      event.preventDefault();

      // Get input values
      const taskTitleInput = $('#task_title').val();
      const dueDateInput = $('#due_date').val();
      const notificationDateInput = $('#notification_date').val();
      const assignedUserEmail = $('#assign_task_user_email').val();

      // Ensure all inputs are filled before submitting
      if (taskTitleInput && dueDateInput && notificationDateInput) {
        // Serialize form data including checkbox state
        const formData = $(taskForm).serializeArray();
        formData.push({ name: 'flag', value: $('#flag_checkbox').is(':checked') ? 'true' : 'false' });

        // Determine the URL endpoint based on the assignedUserEmail value
        const urlEndpoint = assignedUserEmail ? `${baseURL}/task-manager/api/assigned_task.php` : `${baseURL}/task-manager/api/submit_task.php`;

        $.ajax({
          type: 'POST',
          url: urlEndpoint,
          data: formData,
          success: function (response) {
            notificationDiv.innerHTML = '<p>' + response + '</p>';
            notificationDiv.classList.add('show');
            popupContainer.style.display = 'none';
            setTimeout(function () {
              notificationDiv.classList.remove('show');
            }, 3500);
            fetchTasks();
            triggerReminder();
            fetchAssignedTasks();
            event.target.reset();
          },
          error: function (xhr, status, error) {
            console.error(xhr.responseText);
          }
        });
      } else {
        // If any input is empty, display an error message or handle it accordingly
        if (!dueDateInput) {
          fillDueDateReminder.style.display = "block";
        }
        if (!notificationDateInput) {
          fillNotificationDateReminder.style.display = "block";
        }
      }
    }
  };

  // Direct Event Binding
  addTaskButton.addEventListener('click', _events.addTaskButtonClick, false);
  searchReset.addEventListener('click', _events.searchResetButtonClick, false);

  closeBtn.addEventListener('click', _events.closeBtnClick, false);
  taskForm.addEventListener('submit', _events.taskFormSubmit, false);

  // Add click event listener to the expand button
  expandButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior
    sidebar.classList.toggle('show');

    if (sidebar.classList.contains('show')) {
      mainHeadingDiv.style.display = "none";
    } else {
      mainHeadingDiv.style.display = "flex";
    }


  });



  viewAllTasks.addEventListener("click", function (event) {
    event.preventDefault();
    expandedMenu.style.display = "block";
    expandedMenuCompletedTasks.style.display = "none";
    expandedMenuAssignedTasks.style.display = "none";
    searchInput.value='';
    fetchTasks();

  });

  viewCompletedTasks.addEventListener("click", function (event) {
    event.preventDefault();
    expandedMenuCompletedTasks.style.display = "block";
    expandedMenuAssignedTasks.style.display = "none";
    expandedMenu.style.display = "none"
    searchInput.value='';
    fetchCompletedTasks();
  });

  viewAssignedTasks.addEventListener("click", function (event) {
    event.preventDefault();
    expandedMenuAssignedTasks.style.display = "block";
    expandedMenu.style.display = "none";
    expandedMenuCompletedTasks.style.display = "none";
    searchInput.value='';
    fetchAssignedTasks();
  });

  taskListItems.forEach(item => {
    item.addEventListener('click', function () {
      taskListItems.forEach(item => {
        item.classList.remove('active');
      });
      this.classList.add('active');
      taskListItems.forEach(item => {
        item.style.borderBottom = 'none';
        item.style.color = '#4e4e4e';
      });
      this.style.borderBottom = '4px solid #4e4e4e';
      item.style.color = 'black';
    });
  });


  // Function to handle the click event outside the modal
  function handleOutsideClick(event) {
    event.preventDefault();
    if (event.target == assignTaskModal) {
      assignTaskModal.style.display = 'none';
      window.removeEventListener('click', handleOutsideClick);
    }
  }

  // Open the modal when the "Assign" button is clicked
  assignTaskButton.addEventListener('click', function (e) {
    e.preventDefault();
    assignTaskModal.style.display = 'block';
    window.addEventListener('click', handleOutsideClick);
  });

  // Close the modal when the close button is clicked
  closeModalButton.addEventListener('click', function (e) {
    e.preventDefault();
    assignTaskButton.innerText = "";
    assignTaskButton.innerText = "Assign";
    assignTaskModal.style.display = 'none';
    assignTaskModalEmail.value = '';
    $('#assign_task_user_email').val('');
    window.removeEventListener('click', handleOutsideClick);
  });

  assignButton.addEventListener('click', function (e) {
    e.preventDefault();
    const storedValue = assignTaskModalEmail.value
    assignTaskUserEmail.value = storedValue;
    assignTaskButton.innerText = "";
    assignTaskButton.innerText = storedValue;
    assignTaskModal.style.display = 'none';
    window.removeEventListener('click', handleOutsideClick);
  });


  return {
    fetchTasks: fetchTasks // Expose fetchTasks function
  };
})();
