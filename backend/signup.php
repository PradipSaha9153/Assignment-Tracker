<?php
include "db.php";

$fullName = $_POST['fullName'];
$phoneNo = $_POST['phoneNo'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$check = $conn->query("SELECT * FROM users WHERE email='$email'");
if ($check->num_rows > 0) {
    echo "exists";
    exit;
}

$sql = "INSERT INTO users (fullName, phoneNo, email, password)
        VALUES ('$fullName', '$phoneNo', '$email', '$password')";

if ($conn->query($sql)) {
    echo "success";
} else {
    echo "error";
}
?>
