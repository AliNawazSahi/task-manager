<?php
// Include database connection
include '../db-connection/db_connection.php';

// Check if the ID and status are set in the POST request
if (isset($_POST['id']) && isset($_POST['status'])) {
    // Sanitize input to prevent SQL injection
    $id = mysqli_real_escape_string($conn, $_POST['id']);
    $status = mysqli_real_escape_string($conn, $_POST['status']);

    // Update task status in the database
    $query = "UPDATE tasks SET task_status = '$status' WHERE id = '$id'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo "Congrats! you have completed a task";
    } else {
        echo "Error while updating task status please try again";
    }
} else {
    // If ID or status is not set in the POST request
    echo "Error while updating task status please try again";
}

// Close database connection
mysqli_close($conn);
?>
