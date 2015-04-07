<?php
$host = $_GET[ 'host' ];
$db = $_GET[ 'db' ];
$user = $_GET[ 'user' ];
$pass = $_GET[ 'pass' ];

error_reporting( E_ALL ^ E_NOTICE ^ E_WARNING );
$con = new mysqli( $host, $user, $pass, $db );
if( mysqli_connect_errno() ) die('Error : ('. $con->connect_errno .') '. $con->connect_error);
else echo 'Connection: OK';