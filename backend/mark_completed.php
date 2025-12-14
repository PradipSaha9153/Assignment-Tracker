<?php
include "db.php";
include "auth.php";

$id = $_POST["id"];
$user_id = $_SESSION["user_id"];

$sql = "UPDATE assignments 
        SET status='completed', updateAt=CURRENT_TIMESTAMP
        WHERE id=$id AND user_id=$user_id";

echo $conn->query($sql) ? "success" : "error";
?>
