<?php
    session_start();
    include("../queries.php");

    if (!isset($_SESSION['username']))
    {
        header("Location: index.php");
    }

    if(isset($_POST['score']))
    {
        var_dump($_POST);
        addScore($_SESSION['user_id'], $_POST['score']+1);
    }
        
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=0.4, maximum-scale=0.4, user-scalable=no" />
    <title>TeTris</title>
    <script type="text/javascript" src="https://code.jquery.com/jquery-1.7.1.min.js"></script>
    <link rel="stylesheet" href="game.css">
    <script src="game.js" defer></script>
</head>
<body>

<div id="container">
    <div id="game-container">
        <div id="player-container">
            <div>Player</div>
            <div id="player-name" class="value"><?php echo  $_SESSION['username']; ?></div>
            <div>Score</div>
            <div id="player-score" class="value"></div>
        </div>

        <div id="board-container">
            <div id="board"></div>
        </div>

        <div id="next-container">
            <div>Next</div>
            <div id="next0" class="next"></div>
            <div id="next1" class="next"></div>
            <div id="next2" class="next"></div>
        </div>

    </div>
    
    <div id="control-container">
        <div id="left" class="control">LEFT</div>
        <div id="rotate" class="control">ROTATE</div>
        <div id="down" class="control">DOWN</div>
        <div id="right" class="control">RIGHT</div>
    </div>
</div>


</body>
</html>