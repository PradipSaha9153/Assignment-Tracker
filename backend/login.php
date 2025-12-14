<?php
include "db.php";

$email = $_POST["email"];
$password = $_POST["password"];

$sql = "SELECT * FROM users WHERE email='$email'";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    echo "invalid";
    exit;
}

$user = $result->fetch_assoc();

if (password_verify($password, $user["password"])) {

    $_SESSION["user_id"] = $user["id"];
    $_SESSION["fullName"] = $user["fullName"];

    echo "success";
} else {
    echo "invalid";
}
?>
