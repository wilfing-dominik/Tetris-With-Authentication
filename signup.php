<?php
    include("header.php");
    include("queries.php");

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $inputUsername = $_POST["username"];
        $inputPassword = $_POST["password"];
        $inputReenterPassword = $_POST["reenter-pw"];

        if (isUsernameAlreadyUsed($inputUsername)) {
            echo '<script>alert("Username is already in use!")</script>';
        }
        else if ($inputPassword !== $inputReenterPassword) {
            echo '<script>alert("The two passwords doesn\'t match!")</script>';
        }
        else {
           
            $hashed_pass = password_hash($inputPassword, PASSWORD_DEFAULT);
            signupNewUser($inputUsername, $hashed_pass);
            header("Location: login.php");
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="stylesheet" href="css/signup.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200&display=swap" rel="stylesheet">

    <title>TeTris</title>
</head>
<body>
    <div class="site-wrapper">
        <form action="signup.php" method="POST">
            <ul>
                <li>
                    <label for="username">Enter a username</label> <br>
                    <input name="username" type="text">
                </li>
                <li>
                    <label for="password">Enter your password</label> <br>
                    <input name="password" type="password">
                </li>
                <li>
                    <label for="reenter-pw">Reenter your password</label> <br>
                    <input name="reenter-pw" type="password">
                </li>
                <li>
                    <button type="submit">signup</button>
                </li>
            </ul>
        </form>
        <a href="../login.php">back to login</a>
    </div>
</body>
</html>


        

        
