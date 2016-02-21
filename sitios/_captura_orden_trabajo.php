<?php
require ( '../ajax/sistema/sigesop.class.php' );
require ( '../ajax/sistema/session.class.php' );
$session = new session();
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host']; 

$obj = new sigesop( $user, $pass );

if ( !$obj->accesoPagina( 'captura_orden_trabajo.php' ) ) {
    session_destroy();
    header('Location: ../error.php');
}
?>
<!DOCTYPE html>
<html ng-app="sigesop">
<head>
	<title>Captura Orden de trabajo</title>
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

<body ng-controller="capturaOrdenTrabajoController">
	<header class="navbar navbar-static-top" role="banner"></header>
	
	<div  class="panel container-fluid">
		<div class="alert alert-success"><h4 class="text-center">Captura Orden de trabajo</h4></div>

		<ul id="pestanas" class="nav nav-tabs">
			<li class="active"><a href="captura_orden_trabajo/main.html" data-toggle="tab"> Ordenes de trabajo <span id="badge_OT" class="badge"></span> </a></li>
			<li><a href="#main2" data-toggle="tab">OTRA PESTAÑA <span id="badge_areaTrabajo" class="badge"></a></li>
		</ul>

		<div class="tab-content">
			<div class="tab-pane fade in active" id="main">
				<div class="panel panel-default">
					<div ng-if="ordenesTrabajo" class="table-responsive">
						<table class="js-dynamitable table table-bordered table-hover">
							<thead>
								<th> NÚMERO DE ORDEN
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> TRABAJO SOLICITADO
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> MANTENIMIENTO
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> SUPERVISOR
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> RESPONSABLE
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> AUXILIAR
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> FECHA PROGRAMADA
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>

								<th> FECHA REPROGRAMADA
									<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>
									<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>
								</th>
							</thead>
							
							<tbody ng-if="ordenesTrabajo">
								<tr ng-repeat="orden in ordenesTrabajo">
									<td>{{orden.numero_orden}}</td>
									<td>{{orden.trabajo_solicitado}}</td>
									<td>{{orden.nombre_mantenimiento}}</td>
									<td>{{orden.orden_trabajo_personal.supervisor}}</td>
									<td>{{orden.orden_trabajo_personal.responsable}}</td>
									<td>{{orden.orden_trabajo_personal.auxiliar}}</td>
									<td>{{orden.fecha_programada}}</td>
									<td>{{orden.fecha_reprogramada}}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="tab-pane fade" id="main2"></div>
		</div>
	</div>
	
	<script type="text/javascript" src="../js/jquery.js"></script>
	<script type="text/javascript" src="../js/angular.js"></script>

	<script type="text/javascript" src="../js/bootstrap.min.js"></script>
	<script type="text/javascript" src="../js/bootstrap-dialog/bootstrap-dialog.min.js"></script>
	<script type="text/javascript" src="../js/ui/jquery-ui.custom.min.js"></script>
	<script type="text/javascript" src="../js/pnotify/pnotify.custom.min.js"></script>

	<!-- // <script type="text/javascript" src="../js/formValidation/formValidation.min.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/formValidation/bootstrap.min.js"></script> -->

	<!-- // <script type="text/javascript" src="../js/contextMenu/jquery.contextMenu.js"></script> -->
	<!-- // <script type="text/javascript" src="../js/dynamitable/dynamitable.jquery.min.js"></script> -->
	<script type="text/javascript" src="../js/jquery.blockUI.js"></script>

	<script type="text/javascript" src="../js/coreAngularSigesop/sigesop.cfe.js"></script>
	<script type="text/javascript" src="../js/coreAngularSigesop/capturaOrdenTrabajoController.js"></script>	
	<!-- // <script type="text/javascript" src="../js/coreSigesop/main.capturaOrdenTrabajo.js"></script> -->
</body>
</html>