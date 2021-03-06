<?php
require ( '../ajax/sistema/sigesop.class.php' );
require ( '../ajax/sistema/session.class.php' );
$session = new session();
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host']; 

$obj = new sigesop( $user, $pass );

if ( !$obj->accesoPagina( 'tipo_mtto.php' ) ) {
    session_destroy();
    header('Location: ../error.php');
}
?>
<!doctype html>
<html lang="es">
	<head>
		<title>Tipo Mantenimiento</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="../css/bootstrap.min.css">
		<link rel="stylesheet" href="../css/cfe/jquery.ui.all.css">
		<link rel="stylesheet" href="../css/style.css">
		<link rel="stylesheet" href="../js/pnotify/pnotify.custom.min.css">
		<link rel="stylesheet" href="../js/formValidation/formValidation.min.css">
		<link rel="stylesheet" href="../js/contextMenu/jquery.contextMenu.css" />
		<link rel="stylesheet" href="../js/bootstrap-dialog/bootstrap-dialog.min.css">
	</head>

	<body>
		<header class="navbar navbar-static-top" role="banner"></header>		
		<div class="panel container-fluid">			
			<div class="alert alert-success"><h4 class="text-center">Catálogo de Tipo de Mantenimiento</h4></div>

			<ul class="nav nav-tabs">
				<li class="active"><a href="#main" data-toggle="tab">Nuevo Tipo de Mantenimiento</a></li>
				<li ><a href="#main2" data-toggle="tab">Tipo de Mantenimiento Registrados <span id="badge_tipoMantto" class="badge"></span></a></li>
			</ul>

			<div class="tab-content">			
				<div class="tab-pane fade in active" id="main"></div>
				<div class="tab-pane fade" id = "main2"></div>
			</div>
		</div>

		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/bootstrap.min.js"></script>
		<script type="text/javascript" src="../js/bootstrap-dialog/bootstrap-dialog.min.js"></script>
		<script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script>
		<script type="text/javascript" src="../js/pnotify/pnotify.custom.min.js"></script>

		<script type="text/javascript" src="../js/formValidation/formValidation.min.js"></script>
		<script type="text/javascript" src="../js/formValidation/bootstrap.min.js"></script>

		<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
		<script type="text/javascript" src="../js/dynamitable/dynamitable.jquery.min.js"></script>
		<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
		
		<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.tipoMantenimiento.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/main.tipoMantenimiento.js"></script>
	</body>
</html>