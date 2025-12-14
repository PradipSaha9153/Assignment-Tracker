<?php
include "db.php";

if (!isset($_SESSION['user_id'])) {
    echo "not_logged_in";
    exit;
}

echo $_SESSION['fullName'];
?>
