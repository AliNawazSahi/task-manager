<?php
include '../db-connection/db_connection.php';

$tasks = array();

if (isset($_POST['assign_task_user_email'])) {
    // Retrieve task details from the form submission
    $taskTitle = $_POST['task_title'];
    $dueDate = $_POST['due_date'];
    $reminder = $_POST["notification_date"];
    $flag = $_POST["flag"];
    $note = $_POST["note_name"];
    $task_status = 'assigned task';
    $assignEmail = $_POST['assign_task_user_email'];

    // Insert the task into the database
    $query = "INSERT INTO tasks (title, due_date, reminder, task_status, flag, assigned, note) VALUES ('$taskTitle', '$dueDate', '$reminder', '$task_status', '$flag', '$assignEmail', '$note')";
    $query_run = mysqli_query($conn, $query);

    if (!$query_run) {
        echo '<p>Failed to assign the task. Please try again</p>';
        exit; // Stop further execution if task insertion fails
    }

    // Retrieve the last inserted task ID
    $task_id = mysqli_insert_id($conn);

    // Construct the URL for viewing the task in Task Manager
    $view_task_url = "https://etechlogics.com/projects/sobi/task-manager/email-redirect/?task_id=$task_id";

    // Email details
    $name = "Task-manager";
    $email = "ahsansahi6061@gmail.com";
    $subject = "Assigned Task";
    $to = $assignEmail;
    $headers = "From: Task-manager.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";

    // HTML template for the email content
    $email_content = '
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            h2 {
                color: #ef8f2c;
                margin-bottom: 20px;
                text-align: center;
            }
    
            p {
                font-size: 16px;
                line-height: 1.5;
                margin-bottom: 10px;
            }
    
            .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #ef8f2c;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin-top: 20px;
            }
    
            .footer {
                max-width: 600px;
                margin: 20px auto;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
    
            .footer a {
                color: #ef8f2c;
                text-decoration: none;
            }
    
            .logo {
                max-width: 100px;
                display: block;
                margin: 0 auto;
                margin-bottom: 20px;
            }
    
            #task_due_date {
                color: #666666d8;
            }
    
            #task_title a {
                color: #ef8f2c;
                font-weight: 800;
                text-decoration: none;
            }
    
            #bottom {
                text-align: center;
                margin: 4% 0;
            }
    
            hr {
                margin: 6% 0;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <!-- Email content -->
                <h2>Assigned Task</h2>
                <div class="task-details">
                    <p id="task_title">
                        <a href="' . $view_task_url . '"> ' . $taskTitle . '</a>
                    </p>
                    <p id="task_due_date">Due on ' . $dueDate . '</p>
                </div>
                <a href="' . $view_task_url . '" class="button">View in Task Manager</a>
                <hr>
                <div id="bottom">
                    <strong>Tasks in Task Manager make it easier to stay on top of it all.</strong>
                    <br>
                    <span>Notes are actionable and to-dos have the context you need.</span>
                </div>
            </div>
            <div class="footer">
                <p>For support requests, please contact us by visiting our <a href="https://etechlogics.com/projects/sobi/task-manager/">support page</a>.</p>
                <p>This email has been sent to you by Task Manager. If you believe you received this email by mistake, please <a href="https://etechlogics.com/projects/sobi/task-manager/">unsubscribe</a> or see our <a href="https://etechlogics.com/projects/sobi/task-manager/">privacy policy</a>.</p>
            </div>
        </body>
        </html>';
    
        // Send the email
        if (mail($to, $subject, $email_content, $headers)) {
            echo "<p>Task successfully assigned to $assignEmail</p>";
        } else {
            echo "<p>Failed to send the email. Please try again</p>";
        }
    } else if(isset($_GET['search_query']) && !empty($_GET['search_query'])) {
    // Sanitize the search query to prevent SQL injection
    $search_query = mysqli_real_escape_string($conn, $_GET['search_query']);
    
    $query = "SELECT * FROM tasks WHERE title LIKE '%$search_query%' AND assigned NOT LIKE 'unassigned'";
  
    $result = mysqli_query($conn, $query);

    if(mysqli_num_rows($result) > 0) {

        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
    echo json_encode($tasks);

} else if(empty($_GET['search_query'])){
    // If search query is provided empty, fetch all assigned tasks
    $query = "SELECT * FROM tasks WHERE assigned NOT LIKE 'unassigned'";
    $result = mysqli_query($conn, $query);

    // Check if there are any rows returned
    if(mysqli_num_rows($result) > 0) {
        // Loop through each row and store task information in the $tasks array
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
    echo json_encode($tasks);

} else {
   
    $query = "SELECT * FROM tasks WHERE assigned NOT LIKE 'unassigned'";

    $result = mysqli_query($conn, $query);

    // Check if there are any rows returned
    if(mysqli_num_rows($result) > 0) {
        $tasks = array();
        
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    } else {
        echo json_encode(array());
    }
    echo json_encode($tasks);
}

mysqli_close($conn);
?>
