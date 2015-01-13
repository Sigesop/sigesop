<?php include("conexion/conexionStatus.php");?>
<!doctype html>
<html lang="es">
	<head>
		<title>Estatus</title>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<link rel="stylesheet" href="../css/bootstrap.css">
		<link rel="stylesheet" href="../css/base/jquery.ui.all.css">
		<link rel="stylesheet" href="../css/style.css">
	</head>

	<body>
		<header class="navbar navbar-static-top" role="banner"></header>
		
		<div class="panel container-fluid">
			<br>
			<div class="panel panel-danger">
				<div class="row">
					<div class="col-sm-1"></div>
					<div class="col-sm-10">
						<h4 id="infoCapInstalada"></h4>
						<div id="barraCentralInstal" class="progress progress-striped active">
							<div class="progress-bar progress-bar-success">
							    <span id="spanBarraCentralInstal"></span>
							</div>
						</div>
					</div>
					<div class="col-sm-1"></div>
				</div>				

				<div class="row">
					<div class="col-sm-1"></div>
					<div class="col-sm-10">
						<h4 id="infoCapEfec">Capacidad Efectiva central: </h4>
						<div id="barraCentralEfectiva" class="progress progress-striped active">						
							<div id="barDisponible" class="progress-bar progress-bar-success">
								<span></span>
							</div>
							<div id="barMantto" class="progress-bar progress-bar-info">
								<span></span>
							</div>									
							<div id="barCausaAjena" class="progress-bar progress-bar-warning">
								<span></span>
							</div>
							<div id="barFalla" class="progress-bar progress-bar-danger">
								<span></span>
							</div>
						</div>
					</div>
					<div class="col-sm-1"></div>
				</div>			
			</div> <!-- termina de barras -->

			<div class= "panel panel-success">
				<div class="row" id="resumenUnidades"></div>
			</div>	<!-- termina seccion de grafica Resumen -->
			
			<div id="tablaDesglosada" class="panel panel-warning"></div> <!-- termina seccion de acordeon -->	
		</div>

		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/bootstrap.min.js"></script>
		<script type="text/javascript" src="../js/Highcharts/highcharts.js"></script>
		<script type="text/javascript" src="../js/modules/exporting.js"></script>	
		<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.status.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.roles.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.areaTrabajo.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.usuarios.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.gestionCentral.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/main.status.js"></script>	
	</body>
</html>