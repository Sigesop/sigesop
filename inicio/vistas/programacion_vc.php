<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>PROGRAMACION DE VIDEOCONFERENCIA</title>

        <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="../assets/js/formValidation/formValidation.min.css">
        <link rel="stylesheet" href="../assets/js/datepicker/jquery.datetimepicker.css">
        <link rel="stylesheet" href="../assets/css/estilo_cfe.css">
        <link rel="stylesheet" href="../assets/js/bootstrap-dialog/bootstrap-dialog.min.css">
        <link rel="stylesheet" href="../assets/js/dhtmlxscheduler/dhtmlxscheduler.css" type="text/css" media="screen" title="no title" charset="utf-8">
        <!-- <link rel="stylesheet" href="../assets/js/bootstrap-calendar/css/calendar.css"> -->
		
		<style type="text/css" media="screen">
			html, body{
				margin:0px;
				padding:0px;
				height:100%;
				overflow:hidden;
			}	
		</style>
    </head>

    <body>
    	<div class="row">
    		<div class="col-sm-5">
				<a href="http://www.google.com/">
					<h1 class="title"></h1>
				</a>    			
    		</div>

			<div style="margin-top: 40px" class="col-sm-3 pull-right">
				<div class="navbar-header">
					<a href="#" class="navbar-brand">PROGRAMACION DE VC</a>
				</div>
				<div id="bs-example-navbar-collapse-3" class="collapse navbar-collapse">
					<button id="btn-programacion-vc" class="btn btn-info navbar-btn" type="button"> <span class="glyphicon glyphicon-calendar"></span> </button>
				</div>
			</div>
    	</div>

    	<br>
		<div id="calendario" class="dhx_cal_container" style='width:100%; height:100%;'>
			<div class="dhx_cal_navline">
				<div class="dhx_cal_prev_button">&nbsp;</div>
				<div class="dhx_cal_next_button">&nbsp;</div>
				<div class="dhx_cal_today_button"></div>
				<div class="dhx_cal_date"></div>
				<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>
				<div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>
				<div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>
			</div>
			<div class="dhx_cal_header"></div>
			<div class="dhx_cal_data"></div>
		</div>
    	
    	<br>

    	<script src="../assets/js/jquery.min.js" ></script>
        <script src="../assets/js/formValidation/formValidation.min.js"></script>
        <script src="../assets/js/datepicker/jquery.datetimepicker.js"></script>
        <script src="../assets/js/formValidation/bootstrap.min.js"></script>
        <script src="../assets/js/momentjs/moment.js"></script>
        <script src="../assets/bootstrap/js/bootstrap.min.js"></script>
        <script src="../assets/js/bootstrap-dialog/bootstrap-dialog.min.js"></script>        
		<script src="../assets/js/dhtmlxscheduler/dhtmlxscheduler.js" type="text/javascript" charset="utf-8"></script>
		<script src="../assets/js/dhtmlxscheduler/locale/locale_es.js" type="text/javascript" charset="utf-8"></script>	

    	<script src="../assets/js/programacion.js" ></script>
    </body>
</html>