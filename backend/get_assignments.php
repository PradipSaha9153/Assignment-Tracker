<?php
include "db.php";
include "auth.php";

$user_id = $_SESSION["user_id"];

$sql = "SELECT * FROM assignments WHERE user_id=$user_id ORDER BY dueDate ASC";
$result = $conn->query($sql);

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);
?>
