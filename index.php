<?php
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://smplcards.com/wp-json/smplcards/v1/login',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('username' => 'tester2', 'password' => 'CPPKc5el5YtZL'),
    CURLOPT_HTTPHEADER => array(
        'Authorization: Bearer M2IzMTQyMzgzMmYwNDBkZmFjYjg0YmE2YjIwZmIwYmU4MGVmMWM5MDcyOGI3Njg0OGFiMWY0NDgxMWFmZDcwYzExYWI2NThiYmZlYzkwOTJiOWUxZmRkNGU2Y2E0ZWYzZjJjNGQ1NWYxMjg4NWQ3ZmE5OGUzYmJhZDA4MWI5OGU='
    ),
));
$response = curl_exec($curl);
curl_close($curl);
$response = json_decode($response);

// Check if JSON decoding was successful
if (isset($response->token) && isset($response->id)) {
    $token = $response->token;
    $user_id = $response->id;

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://smplcards.com/wp-json/smplcards/v1/notebooks?token=' . $token,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_HTTPHEADER => array(
            'Authorization: Bearer M2IzMTQyMzgzMmYwNDBkZmFjYjg0YmE2YjIwZmIwYmU4MGVmMWM5MDcyOGI3Njg0OGFiMWY0NDgxMWFmZDcwYzExYWI2NThiYmZlYzkwOTJiOWUxZmRkNGU2Y2E0ZWYzZjJjNGQ1NWYxMjg4NWQ3ZmE5OGUzYmJhZDA4MWI5OGU='
        ),
    ));
    $response = curl_exec($curl);
    curl_close($curl);
} else {
    // Error handling if decoding fails
    echo "Error: Unable to retrieve token and user ID.";
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Task Management</title>
    <link rel="stylesheet" href="style.css?v=1.3">
    <link rel="icon" href="https://etechlogics.com/projects/sobi/task-manager/assets/stopwatch.png">

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</head>

<body>

    <div class="container">

        <div class="navbar" id="navbar">
            <ul>
                <li><a href="#" id="add_task_button">
                        <div class="plus-image"><img src="assets/plus-icon3.png"><span class="add-span"> Add </span>
                        </div>
                    </a></li>
                <li><a href="#" id="expand_button">
                        <div class="plus-image"><img src="assets/eye-show.svg"><span class="view-span"> View </span>
                        </div>
                    </a></li>
            </ul>
        </div>
        <div id="task_manager_heading_div">
            <h1>Task Manager</h1>
            <div id="task_manager_heading_img">
                <img src="assets/stopwatch.png">
            </div>
        </div>

        <div class="sidebar" id="sidebar">
            <div id="task_container">
                <h1>Tasks</h1>
                <div id="task_img">
                    <img src="assets/stopwatch.png">
                </div>
            </div>
            <form class="search-form">
                <button>
                    <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img"
                        aria-labelledby="search">
                        <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                            stroke="currentColor" stroke-width="1.333" stroke-linecap="round" stroke-linejoin="round">
                        </path>
                    </svg>
                </button>
                <input class="search-input" placeholder="Search task..." required="" type="text" autocomplete="off">
                <button class="search-reset" type="reset">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </form>
            <ul id="expanded_menu_titles">
                <li id="view_all_task">My Tasks <span class="total-tasks" id="view_all_task_total">0</span></li>
                <li id="view_completed_task">Completed Tasks <span class="total-tasks" id="view_completed_task_total">0</span></li>
                <li id="view_assigned_task">Assigned Tasks <span class="total-tasks" id="view_assigned_task_total">0</span></li>
            </ul>
            <!-- All Tasks List -->
            <ul id="expanded_menu"></ul>

            <!-- Completed Tasks List -->
            <ul id="expanded_menu_completed_tasks"></ul>

            <!-- Assigned Tasks List -->
            <ul id="expanded_menu_assigned_tasks"></ul>

        </div>
    </div>

    <!-- remove confirm modal -->

    <div id="confirm_modal" class="confirm-mdl">
       <div class="confirm-modal-content">
         <p>Are you sure you want to remove this task?</p>
         <div class="confirm-modal-buttons">
           <button id="confirm_Yes">Yes</button>
           <button id="confirm_No">No</button>
         </div>
       </div>
    </div>

    <div id="notification_div">
        <p>Your task has been added successfully!</p>
    </div>

    <div class="popup-container" id="popup_container">
        <div class="popup">
            <span class="close-btn" id="close_btn">&times;</span>
            <form id="task_form" method="post" action="">

                <div id="note_link_with_task">
                    <h2>Add Task</h2>
                    <div>
                        <label><img src="assets/note.svg" class="note-icon"></label>
                        <select name="note_name">
                            <option value="Default Task">Default Task</option>
                            <?php
                    $response_decoded = json_decode($response);

                    // Check if decoding was successful
                    if ($response_decoded !== null && isset($response_decoded->books)) {
                        $books = $response_decoded->books;
                        
                        foreach ($books as $book) {
                            // Escape HTML characters for safety
                            $node_name = htmlspecialchars($book->node_name);
                            echo '<option value="' . $node_name . '">' . $node_name . '</option>';
                        }
                    }
                    ?>
                        </select>
                    </div>

                </div>
                <input type="text" id="task_title" name="task_title" placeholder="Enter Task" autocomplete="off" required>

                <label><img src="assets/calendar.svg" class="calender-icon"></i> Set due date:</label>
                <input type="text" placeholder="Select Date" id="due_date" name="due_date" autocomplete="off" required>
                <span id="fill_due_date_reminder">please set the due date of task</span>

                <label><span class="bell-button">
                        <svg viewBox="0 0 448 512" class="bell">
                            <path
                                d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z">
                            </path>
                        </svg>
                    </span> Set Reminder:
                </label>
                <input type="text" placeholder="Select Reminder Time" id="notification_date" name="notification_date" autocomplete="off" required>
                <span id="fill_notification_date_reminder">please set the reminder of task</span>

                <label class="flag-input-container">
                    <input type="checkbox" name="flag" id="flag_checkbox">
                    <svg viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="flag-regular">
                        <path
                            d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24V64 350.5 400v88c0 13.3 10.7 24 24 24s24-10.7 24-24V388l80.3-20.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L48 52V24zm0 77.5l96.6-24.2c27-6.7 55.5-3.6 80.4 8.8c54.9 27.4 118.7 29.7 175 6.8V334.7l-24.4 9.1c-33.7 12.6-71.2 10.7-103.4-5.4c-48.2-24.1-103.3-30.1-155.6-17.1L48 338.5v-237z">
                        </path>
                    </svg>
                    <svg viewBox="0 0 448 512" height="1em" xmlns="http://www.w3.org/2000/svg" class="flag-solid">
                        <path
                            d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z">
                        </path>
                    </svg>

                    <span id="unflag">Flag</span>
                    <span id="flagged">Flagged</span>

                </label>

                <div class="assign-task-container">
                    <input type="hidden" id="assign_task_user_email" name="assign_task_user_email">
                    <div class="assign-user">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="#ef8f2c">
                            <path
                                d="M224 256c70.7 0 128-57.31 128-128s-57.3-128-128-128C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3C77.61 304 0 381.6 0 477.3c0 19.14 15.52 34.67 34.66 34.67h378.7C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z">
                            </path>
                        </svg>
                    </div>
                    <span class="assign-task">Assign</span>
                </div>

                <div id="assign_task_modal" class="modal">
                    <div class="modal-content">
                        <span id="close_model" class="close">&times;</span>
                        <h2>Assign</h2>
                        <p>Choose a contact or enter an email address. You can also assign a task to yourself.</p>
                        <input type="email" id="assign_task_modal_email" name="assign_task_modal_email"
                            placeholder="Enter email" autocomplete="off">
                        <div class="assign-button-container">

                            <button class="assign-button" id="assign_button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"></path>
                                </svg>
                                <div class="assign-text">
                                    Assign
                                </div>
                            </button>

                        </div>
                    </div>
                </div>


                <div class="submit-container">
                    <input type="submit" name="add_task" value="Add Task">
                </div>
            </form>
        </div>
    </div>

    <script src="script.js?v=1.3"></script>

</body>

</html>