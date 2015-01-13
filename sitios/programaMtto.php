<?php include("conexion/conexionProgramaMtto.php");?>
<!doctype html>
<html lang=es>
<head>
	<title>Creación de Orden de Trabajo</title>
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
	
	<div class="panel container-fluid">
		<div class="alert alert-success"><h4 class="text-center">Creación de Orden de Trabajo</h4></div>

		<ul id="pestanas" class="nav nav-tabs">
			<li class="active"><a href="#main" data-toggle="tab"> Programación de Mantenimiento </a></li>
			<li><a href="#pestanaProgramasRegistrados" data-toggle="tab">Mantenimientos Programados <span id="badge_RM" class="badge"></span></a></li>
		</ul>

		<div class="tab-content">				
			<div class="tab-pane fade in active" id="main"></div>
			<div class="tab-pane fade" id="pestanaProgramasRegistrados"><center> <h4> <br> CARGANDO DATOS... </h4> </center></div>
		</div>
	</div>

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script>
	<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
	<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="../js/Highcharts/highcharts.js"></script>
	<script type="text/javascript" src="../js/Highcharts/themes/grid-light.js"></script>
	<script type="text/javascript" src="../js/moment/moment.min.js"></script>	
	<!-- // <script type="text/javascript" src="../js/jsPDF/jspdf.min.js"></script> -->
	<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/core.mantenimiento.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/main.mantenimiento.js"></script>		
</body>
</html>