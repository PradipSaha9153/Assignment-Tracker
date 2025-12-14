<?php
    session_start();

    $host = "localhost";
    $user = "root";
    $pass = "";
    $dbname = "assignment_tracker";

    $conn = new mysqli($host, $user, $pass, $dbname);

    if ($conn->connect_error) {
        die("Database connection failed: " . $conn->connect_error);
    }
?>