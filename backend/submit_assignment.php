<?php
include "db.php";
include "auth.php";

$user_id = $_SESSION['user_id'];

$title = $_POST["title"];
$subject = $_POST["subject"];
$description = $_POST["description"];
$priority = $_POST["priority"];
$dueDate = $_POST["dueDate"];

$sql = "INSERT INTO assignments 
(user_id, title, subject, description, priority, status, dueDate)
VALUES ('$user_id', '$title', '$subject', '$description', '$priority', 'pending', '$dueDate')";

if ($conn->query($sql)) {
    echo "success";
} else {
    echo "error";
}
?>
