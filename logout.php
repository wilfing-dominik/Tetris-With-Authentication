<?php
    include("header.php");  
    if (isset($_SESSION['username']) && isset($_SESSION['user_id'])) {
        session_destroy();
        unset($_SESSION['username']);
        unset($_SESSION['user_id']);   
        header("Location: login.php");
    }    

?>