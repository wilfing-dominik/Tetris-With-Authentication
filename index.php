<?php 
	include("header.php");
	
	if (!isset($_SESSION['username']))
	{
		header("Location: login.php");
	}
?>

<!DOCTYPE html>
<html>
<head>
	<link rel="stylesheet" href="css/index.css">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200@400@600&display=swap" rel="stylesheet">

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200@800&display=swap" rel="stylesheet">

	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Smooch&display=swap" rel="stylesheet">


	<title>TeTris</title>
</head>
<body>

	<div class="index-wrapper">
		<p class="title">TeTris</p>
		<a href="logout.php">Logout</a>
		<a href="game/game.php">Play game</a>
		<a href="leaderboards.php">Leaderboards</a>
	</div>
	
</body>
</html>