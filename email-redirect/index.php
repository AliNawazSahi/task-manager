<?php
include '../db-connection/db_connection.php';

// Check if task_id is set in the URL
if (isset($_GET['task_id'])) {
    $task_id = $_GET['task_id'];

    $query = "SELECT * FROM tasks WHERE id = ?";
    
    // Prepare the statement
    $stmt = mysqli_prepare($conn, $query);
    mysqli_stmt_bind_param($stmt, "i", $task_id);
    mysqli_stmt_execute($stmt);
    
    // Get result
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        $taskTitle = $row['title'];
        $dueDate = $row['due_date'];
    } else {
        echo "No task found for the provided task ID or may be this task has been removed";
        exit; 
    }
} else {
    echo "No task found for the provided task ID or may be this task has been removed";
    exit; 
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.1">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="https://etechlogics.com/projects/sobi/task-manager/assets/stopwatch.png">
    <title>Task Manager</title>
</head>
<body>
<div id="body_container">
    <nav class="navbar">
        <div class="logo">
            <img src="https://etechlogics.com/projects/sobi/task-manager/assets/stopwatch.png" alt="Logo">
        </div>
        <div class="task-manager-h1">
            <h1>Task Manager</h1>
        </div>
    </nav>

<div class="container">
    
    <div class="main-content">
        <div class="content-paragraph">
        <p>Here's your task from <strong>Task Manager</strong>.</p>
        <p>Check it off below when you're ready.</p>
        </div>
     <div class="task-title-cont">
        <div class="task-container">
            <div class="task-container-content">
                <p class="task-container-content-title"><strong><?php echo $taskTitle; ?></strong></p>
                <p class="date-to-complete">Due date 
                    <?php 
                         $timestamp = strtotime($dueDate); 
                         $formattedDueDate = date("d M Y", $timestamp); 
                         echo $formattedDueDate;
                    ?>
                </p>
            </div>
            <!-- <div class="cmplt-btn">
            <button class="complete-btn">Complete</button>
           </div> -->
        </div>
        
    </div>
        
        <p class="worries">No worries, come back when you're done.</p>
        <div class="hr-div">
        
        <p>Task Manager is the one workplace you need. Collect ideas and work on projects together.</p>
        <a class="try-link" href="#">Try Task Manager.</a>
       </div>
    </div>
    
</div>
<footer>
    <div class="footer-links">
        <a href="#">Terms of Service</a>
        <a href="#">Privacy Policy</a>
        <a href="#">Report Spam</a>
    </div>
</footer>

</div>
</body>
</html>
