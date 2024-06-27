<?php
// Include database connection
include '../db-connection/db_connection.php';

// Check if the ID is set in the POST request
if (isset($_POST['id'])) {
    // Sanitize input to prevent SQL injection
    $id = mysqli_real_escape_string($conn, $_POST['id']);

    // Delete task from the database
    $query = "DELETE FROM tasks WHERE id = '$id'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        echo "Task removed successfully!";
    } else {
        echo "Error while removing task please try agian";
    }
} else {
    // If ID is not set in the POST request
    echo "Error while removing task please try agian";
}

// Close database connection
mysqli_close($conn);
?>
