<?php
require ( '../ajax/sistema/sigesop.class.php' );
require ( '../ajax/sistema/session.class.php' );
$session = new session();
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host']; 

$obj = new sigesop( $user, $pass );

if ( !$obj->accesoPagina( 'libro_relatorio.php' ) ) {
    session_destroy();
    header('Location: ../error.php');
}
?>
<!doctype html>
<html lang=es>
<head>
	<title>Libro Relatorio</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	
	<link rel="stylesheet" href="../css/bootstrap.min.css">
	<link rel="stylesheet" href="../css/cfe/jquery.ui.all.css">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../js/pnotify/pnotify.custom.min.css">
	<link rel="stylesheet" href="../js/formValidation/formValidation.min.css">
	<link rel="stylesheet" href="../js/contextMenu/jquery.contextMenu.css">	
	<link rel="stylesheet" href="../js/bootstrap-dialog/bootstrap-dialog.min.css">
</head>

<body>
	<header class="navbar navbar-static-top" role="banner"></header>
	
	<div class="panel container-fluid">
		<div class="alert alert-success"><h4 class="text-center">Libro Relatorio</h4></div>

		<ul id="pestanas" class="nav nav-tabs">
			<li class="active"><a href="#main" data-toggle="tab"> Crear relatorio </a></li>
			<li><a href="#main-2" data-toggle="tab">Eventos activos <span id="badge_RR" class="badge"></span></a></li>
			<li><a href="#main-3" data-toggle="tab">Eventos finalizados <span id="badge_RT" class="badge"></span></a></li>
			<li><a href="#main-4" data-toggle="tab">Unidades <span id="badge_RU" class="badge"></span></a></li>
			<li><a href="#main-5" data-toggle="tab">Periodos <span id="badge_RP" class="badge"></span></a></li>
			<li><a href="#main-6" data-toggle="tab">Ordenes de trabajo<span id="badge_ROT" class="badge"></span></a></li>
			<li><a href="#main-7" data-toggle="tab">Ordenes de trabajo programados <span id="badge_ROTP" class="badge"></span></a></li>
		</ul>

		<div class="tab-content">				
			<div class="tab-pane fade in active" id="main"></div>
			<div class="tab-pane fade" id="main-2"></div>
			<div class="tab-pane fade" id="main-3"></div>
			<div class="tab-pane fade" id="main-4"></div>
			<div class="tab-pane fade" id="main-5"></div>
			<div class="tab-pane fade" id="main-6"></div>
			<div class="tab-pane fade" id="main-7"></div>
		</div>	
	</div>

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/bootstrap-dialog/bootstrap-dialog.min.js"></script>
	<script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script>
	<script type="text/javascript" src="../js/pnotify/pnotify.custom.min.js"></script>

	<script type="text/javascript" src="../js/globalize/globalize.js"></script>
	<script type="text/javascript" src="../js/globalize/globalize.culture.de-DE.js"></script>

	<script type="text/javascript" src="../js/formValidation/formValidation.min.js"></script>
	<script type="text/javascript" src="../js/formValidation/bootstrap.min.js"></script>

	<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
	<script type="text/javascript" src="../js/dynamitable/dynamitable.jquery.min.js"></script>
	<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="../js/moment/moment.min.js"></script>

	<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/core.libroRelatorio.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/main.libroRelatorio.js"></script>
</body>
</html>