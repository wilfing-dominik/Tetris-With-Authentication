<?php
    include("header.php");
    include("queries.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./css/leaderboards.css">
    <title>TeTris</title>
</head>
<body>      

    <table id='leaderboard'>
        <tr>
            <th>User</th>
            <th>Score</th>
        </tr>

        <?php
            $result = getAllForLeaderBoards();
            if ($result) {
                for ($i=0; $i < count($result); $i++) { 
                    echo "<tr> <td>{$result[$i][1]}</td> <td>{$result[$i][5]}</td> </tr>";  
                }
            }
        ?>   
    </table>
</body>
</html>

