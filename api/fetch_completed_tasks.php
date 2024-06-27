<?php
// Include database connection
include '../db-connection/db_connection.php';

// Initialize an empty array to store the search results
$tasks = array();

if(isset($_GET['search_query']) && !empty($_GET['search_query'])) {
    // Sanitize the search query to prevent SQL injection
    $search_query = mysqli_real_escape_string($conn, $_GET['search_query']);
    
    // Modify the SQL query to include the search filter condition
    $query = "SELECT * FROM tasks WHERE title LIKE '%$search_query%' AND task_status = 'complete'";
    // Match any occurrence of the word
    
    // Execute the modified query
    $result = mysqli_query($conn, $query);

    // Check if there are any rows returned
    if(mysqli_num_rows($result) > 0) {
        // Loop through each row and store task information in the $tasks array
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
} else if(empty($_GET['search_query'])){
    // If search query is provided empty, fetch all complete tasks
    $query = "SELECT * FROM tasks WHERE task_status LIKE 'complete'";
    $result = mysqli_query($conn, $query);

    // Check if there are any rows returned
    if(mysqli_num_rows($result) > 0) {
        // Loop through each row and store task information in the $tasks array
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
}else{
    // If no search query is provided, fetch all tasks
    $query = "SELECT * FROM tasks WHERE task_status LIKE 'complete'";
    $result = mysqli_query($conn, $query);

    // Check if there are any rows returned
    if(mysqli_num_rows($result) > 0) {
        // Loop through each row and store task information in the $tasks array
        while($row = mysqli_fetch_assoc($result)) {
            $tasks[] = $row;
        }
    }
}
    // Output tasks as JSON
    echo json_encode($tasks);

    // Close database connection
    mysqli_close($conn);
?>
