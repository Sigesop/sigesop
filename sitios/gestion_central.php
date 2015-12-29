<?php
require ( '../ajax/sistema/sigesop.class.php' );
require ( '../ajax/sistema/session.class.php' );
$session = new session();
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host']; 

$obj = new sigesop( $user, $pass );

if ( !$obj->accesoPagina( 'gestion_central.php' ) ) {
    session_destroy();
    header('Location: ../error.php');
}
?>

<!doctype html>
<html lang="es">
	<head>
		<title>Gestión de la central</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="../css/bootstrap.min.css">
		<link rel="stylesheet" href="../css/style.css">		
		<link rel="stylesheet" href="../css/cfe/jquery.ui.all.css">	
		<link rel="stylesheet" href="../js/pnotify/pnotify.custom.min.css">
		<link rel="stylesheet" href="../js/formValidation/formValidation.min.css">
		<link rel="stylesheet" href="../js/bootstrap-dialog/bootstrap-dialog.min.css">
	</head>

	<body>
		<header class="navbar navbar-static-top" role="banner"></header>
		<div class="panel container-fluid">				
			
			<div class="alert alert-success"><h4 class="text-center">Gestión de la central</h4></div>
		  	<div id="main" class="panel panel-success">		  		
		  		<br>
				<h4 class="text-center">CARGANDO DATOS...</h4>
				<br>
			</div>
		</div>

		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/bootstrap.min.js"></script>
		<script type="text/javascript" src="../js/bootstrap-dialog/bootstrap-dialog.min.js"></script>
		<!-- // <script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script> -->
		<script type="text/javascript" src="../js/pnotify/pnotify.custom.min.js"></script>

		<script type="text/javascript" src="../js/formValidation/formValidation.min.js"></script>
		<script type="text/javascript" src="../js/formValidation/bootstrap.min.js"></script>

		<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
		<script type="text/javascript" src="../js/jquery.blockUI.js"></script>	
		
		<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.status.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.roles.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.areaTrabajo.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.usuarios.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.gestionCentral.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/main.gestionCentral.js"></script>
	</body>
</html>