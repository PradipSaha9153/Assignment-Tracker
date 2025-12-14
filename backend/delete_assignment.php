<?php
    include "db.php";
    include "auth.php";

    $id = $_GET["id"];
    $user_id = $_SESSION["user_id"];

    $sql = "DELETE FROM assignments WHERE id=$id AND user_id=$user_id";

    echo $conn->query($sql) ? "success" : "error";
?>