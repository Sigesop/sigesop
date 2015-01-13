<?php
include '../ajax/funcionesPrimarias.php';
    session_start();
    $user = $_SESSION['user'];
    $pass = $_SESSION['pass'];
    $host = $_SESSION['host']; 

    $obj = new funcionesPrimarias( $host, $user, $pass, 'laventa_cfe' );

    if ( !$obj->accesoPagina( 'catalogoTipoMantenimiento.php' ) ) 
    {
        session_destroy();
        header('Location: ../error.php');
    }
?>