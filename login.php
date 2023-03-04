<?php
    include("header.php");
    include('queries.php');
    
    if (isset($_SESSION['username']))
    {
        header("Location: index.php");
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST')
    {
        $inputUsername = $_POST["username"];
        $inputPassword = $_POST["password"];

        $result = getFromUsersByUsername($inputUsername);

        if($result)
        {
            if (isset($_SESSION['username'])) {
                echo '<script>alert("You are already logged in!")</script>';
            }
            // else if ($inputPassword === $result[0][2])
            else if (password_verify($inputPassword, $result[0][2]))
            {
                $_SESSION['username'] = $inputUsername;
                $_SESSION['user_id'] = $result[0][0];
                header("Location: index.php");
                die;
            }
            else
            {
                echo '<script>alert("Wrong password!")</script>';
            }
        }
        else
        {
            echo '<script>alert("There is no user with this username!")</script>';

        }		
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link rel="stylesheet" href="css/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200&display=swap" rel="stylesheet">

    <title>TeTris</title>
</head>
<body>
    <div class="site-wrapper">
            <form action="login.php" method="POST">
            <ul>
                <li>
                    <label for="username">Username</label> <br>
                    <input type="text" name="username">
                </li>
                <li>
                    <label for="password">Password</label> <br>
                    <input type="password" name="password">
                </li>
                <li>
                    <button type="submit">Login</button>
                </li>
                <li>
                    <a href="signup.php">Signup</a>
                </li>
            </ul>
        </form>
    </div>

</body>
</html>