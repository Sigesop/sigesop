<?php

$user = $_GET[ 'user' ];
$pass = $_GET[ 'pass' ];
$host = '127.10.47.2';

new mysqli( $host, $user, $pass, 'mysql');

if ( !mysqli_connect_errno() )
    echo "Conexion mysql: OK<br>";
else
    echo "Conexion mysql: ERROR<br>";

// ---------------------------------------------

new mysqli( $host, $user, $pass, 'laventa_cfe');

if ( !mysqli_connect_errno() )
    echo "Conexion laventa_cfe: OK";
else 
    echo "Conexion laventa_cfe: ERROR";