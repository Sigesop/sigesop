<?php include("conexion/conexionRolUsuario.php");?>
<!doctype html>
<html lang="es">
	<head>
		<title>Roles Usuario</title>
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
			<div class="alert alert-success"><h4 class="text-center">Catálogo de Roles de Usuarios</h4></div>
			
			<ul id="pestanas" class="nav nav-tabs">
				<li class="active"><a href="#main" data-toggle="tab">Roles de Usuario</a></li>
				<li><a href="#main2" data-toggle="tab">Roles Registrados <span id="badge_roles" class="badge"></span></a></li>					
			</ul>
			
			<div class="tab-content">
				<div class="tab-pane fade in active" id="main"></div>
				<div class="tab-pane fade" id="main2"> <br>
					<div class="alert alert-danger alert-dismissible fade in" role="alert">
						<button class="close" aria-label="Close" data-dismiss="alert" type="button">
							<span aria-hidden="true">×</span>
						</button>
						<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>				
					</div>

					<div id="rolesRegistrados"></div>
				</div>
			</div>	        
		</div>

		<script type="text/javascript" src="../js/jquery.js"></script>
		<script type="text/javascript" src="../js/bootstrap.min.js"></script>
		<script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script>
		<script type="text/javascript" src="../js/jquery.blockUI.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/core.sigesop.cfe.js"></script>	
		<script type="text/javascript" src="../js/coreSigesop/core.roles.js"></script>
		<script type="text/javascript" src="../js/coreSigesop/main.roles.js"></script>
	</body>
</html>