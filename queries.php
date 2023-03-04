<?php
	include("header.php");

	function connection($dsn, $username = "", $password = "") {
		try {
			$pdo = new PDO($dsn, $username, $password);
			return $pdo;
		}
		catch (PDOException $e) {
			echo '<script>alert("Unable to connect to database")</script>';
		}
	}

	function getAllFromUsers() {
		$con = connection("sqlite:./tetris.sqlite");
		$smt = $con->query("SELECT * FROM 'users'");
		$smt->execute();
		return $smt->fetchAll(); 
	}

	function getFromUsersByUsername($username) {
		$con = connection("sqlite:./tetris.sqlite");
		$stmt = $con->query("SELECT * FROM users WHERE username = :username");
		$stmt->execute([ 'username' => $username ]);

		$result = $stmt->fetchAll();

		return $result ;
	}

	function isUsernameAlreadyUsed ($username) {
		$con = connection("sqlite:./tetris.sqlite");
		$stmt = $con->query("SELECT * FROM users WHERE username = :username");
		$stmt->execute([ 'username' => $username ]);
		
		$result = $stmt->fetchAll();
		
		if ($result === false || $result === null || count($result) === 0) { return false; }
		return true;
	}

	function signupNewUser($inputUsername, $inputPassword) {
		$con = connection("sqlite:./tetris.sqlite");
		$stmt = $con->prepare("INSERT INTO 'users' ('username', 'password') VALUES (:inputUsername, :inputPassword)");
		$stmt->execute([ 'inputUsername' => $inputUsername,
						 'inputPassword' => $inputPassword]);
		}

	function addScore($userid, $score) {
		$con = connection("sqlite:../tetris.sqlite");
		$stmt = $con->prepare("INSERT INTO 'scores' ('user_id','score') VALUES (:userid, :score)");
		$stmt->execute([ 'userid' => $userid,
						 'score' => $score]);
	}

	function getAllFromScores() {
		$con = connection("sqlite:../tetris.sqlite");
		$smt = $con->query("SELECT * FROM 'scores'");
		$smt->execute();
		return $smt->fetchAll(); 
	}

	function getAllForLeaderBoards() {
		$con = connection("sqlite:./tetris.sqlite");
		$smt = $con->query("SELECT * FROM 'users' LEFT OUTER JOIN 'scores' ON USERS.USER_ID = SCORES.USER_ID");
		$smt->execute();
		return $smt->fetchAll(); 
	}

?>
