<?php
require ( '../ajax/sistema/sigesop.class.php' );
require ( '../ajax/sistema/session.class.php' );
$session = new session();
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host']; 

$obj = new sigesop( $user, $pass );

if ( !$obj->accesoPagina( 'autorizacionMtto.php' ) ) {
    session_destroy();
    header('Location: ../error.php');
}
?>
<!doctype html>
<html lang=es>
<head>
	<title>Autorización de Mantenimiento</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="../css/bootstrap.css">
	<link rel="stylesheet" href="../css/cfe/jquery.ui.all.css">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../js/contextMenu/jquery.contextMenu.css">
</head>

<body>
	<header class="navbar navbar-static-top" role="banner"></header>

	<div class="container-fluid">
		<div class="alert alert-success"><h4 class="text-center">Autorización de Mantenimiento</h4></div>
		
		<ul id="pestanas" class="nav nav-tabs">
			<li class="active"><a href="#main" data-toggle="tab"> Autorización </a></li>
			<!-- <li><a href="#pestanaProgramasRegistrados" data-toggle="tab">Reporte de Mantenimiento <span id="badge_RM" class="badge"></span></a></li> -->
		</ul>

		<div class="tab-content">				
			<div class="tab-pane fade in active" id="main"></div>
			<!-- <div class="tab-pane fade" id="pestanaProgramasRegistrados"><center> <h4> <br> CARGANDO DATOS... </h4> </center></div> -->
		</div>
	</div>

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.core.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.position.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.mouse.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.draggable.js"></script>
	<script type="text/javascript" src="../js/ui/jquery.ui.tooltip.js"></script>
	<!-- // <script type="text/javascript" src="../js/ui/jquery.ui.selectable.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/ui/jquery.ui.spinner.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/ui/jquery.ui.datepicker.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/piecon.min.js"></script> -->
	<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
	<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
	<!-- // <script type="text/javascript" src="../js/Highcharts/highcharts.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/Highcharts/themes/grid-light.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/moment.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/forge/forge.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/forge/util.js"></script>		 -->
	<!-- // <script type="text/javascript" src="../js/forge/sha1.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/jsPDF/jspdf.min.js"></script> -->
	<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/core.autorizacion.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/main.autorizacion.js"></script>
</body>
</html>