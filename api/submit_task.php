<?php
// Include database connection
include '../db-connection/db_connection.php';

// Set parameters from form data
$title = $_POST["task_title"];
$due_date = $_POST["due_date"];
$reminder = $_POST["notification_date"];
$flag = $_POST["flag"];
$note = $_POST["note_name"];
$task_status = 'incomplete';
$assigned = 'unassigned';

// Prepare and bind the SQL statement
$query = "INSERT INTO tasks (title, due_date, reminder, task_status, flag, assigned, note) VALUES ('$title', '$due_date', '$reminder', '$task_status', '$flag', '$assigned', '$note')";

$query_run = mysqli_query($conn, $query);

if ($query_run) {
    echo '<p>Your task has been added successfully!</p>';
} else {
    echo "Error: " . $query_run->error;
}

// Close database connection
mysqli_close($conn);
?>
