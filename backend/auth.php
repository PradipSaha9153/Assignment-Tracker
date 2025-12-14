<?php
    if (!isset($_SESSION)) {
        session_start();
    }

    if (!isset($_SESSION['user_id'])) {
        echo "not_logged_in";
        exit;
    }
?>
