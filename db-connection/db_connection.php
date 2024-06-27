<?php

$server   = "localhost";
$username = "root";
$password = "";
$database = "task_manager_db"; 


// $server   = "localhost";
// $username = "findkgar_smplevent";
// $password = "Z?qA%%y{{W]q";
// $database = "findkgar_smplevent"; 

$conn = mysqli_connect($server, $username, $password, $database);

if(!$conn){
    die("Error: " . mysqli_connect_error());
}

?>