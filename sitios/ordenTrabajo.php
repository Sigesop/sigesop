<?php include("conexion/conexionOrdenTrabajo.php");?>
<!DOCTYPE html>
<html>
<head>
	<title>Captura Orden de trabajo</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<link rel="stylesheet" href="../css/bootstrap.css">
	<link rel="stylesheet" href="../css/base/jquery.ui.all.css">
	<link rel="stylesheet" href="../css/style.css">
	<link rel="stylesheet" href="../js/contextMenu/jquery.contextMenu.css">
</head>

<body>
	<header class="navbar navbar-static-top" role="banner"></header>
	
	<div class="panel container-fluid">
		<div class="alert alert-success"><h4 class="text-center">Captura Orden de trabajo</h4></div>

		<ul id="pestanas" class="nav nav-tabs">
			<li class="active"><a href="#main" data-toggle="tab"> Ordenes de trabajo <span id="badge_OT" class="badge"></span> </a></li>
		</ul>

		<div class="tab-content">				
			<div class="tab-pane fade in active" id="main"></div>
		</div>
	</div>

	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script>
	<script type="text/javascript" src="../js/bootstrap.min.js"></script>	
	<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
	<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>
	<script type="text/javascript" src="../js/coreSigesop/core.mantenimiento.js"></script>	
	<script type="text/javascript" src="../js/coreSigesop/main.capturaOrdenTrabajo.js"></script>
</body>
</html>