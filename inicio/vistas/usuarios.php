<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ALTA DE USUARIO</title>

        <link rel="stylesheet" href="../assets/bootstrap/css/bootstrap.min.css">
        <link rel="stylesheet" href="../assets/js/formValidation/formValidation.min.css">

    </head>

    <body>
    	<br>
    	<div class="panel container-fluid">
    		<div class="panel panel-success">
    			<div class="panel-heading">ALTA DE USUARIOS</div>

				<div class="panel-body">
					<form id="form-usuarios" class="form-horizontal" role="form">
						<div class="form-group">
							<label class="control-label col-sm-3">NOMBRE: </label>
							<div class="col-sm-6">
								<input id="input-nombre" name="nombre" class="form-control"/>
							</div>		    				
						</div>

						<div class="form-group">
							<label class="control-label col-sm-3">APELLIDO: </label>
							<div class="col-sm-6">
								<input id="input-apellido" name="apellido" class="form-control"/>
							</div>		    				
						</div>

						<div class="form-group">
							<label class="control-label col-sm-3">USUARIO: </label>
							<div class="col-sm-6">
								<input id="input-usuario" name="usuario" class="form-control"/>
							</div>		    				
						</div>

						<div class="form-group">
							<label class="control-label col-sm-3">CONTRASEÑA: </label>
							<div class="col-sm-6">
								<input type="password" id="input-password" name="password" class="form-control"/>
							</div>		    				
						</div>

						<div class="form-group">
							<label class="control-label col-sm-3">ESPECIALIDAD: </label>
							<div class="col-sm-6">
								<select id="select-especialidad" name="especialidad" class="form-control">
									<option value="" >SELECCIONE OPCION...</option>
									<option value="SL" >SUBESTACIONES Y LINEAS</option>
									<option value="PT" >PROTECCIONES</option>
									<option value="CM" >COMUNICACIONES</option>
									<option value="CI" >CONTROL E INFORMATICA</option>
									<option value="AD" >ADMINISTRACION</option>
								</select>
							</div>		    				
						</div>

						<div class="form-group">
							<label class="control-label col-sm-3"></label>
							<div class="col-sm-6">
								<p>
									<button type="submit" class="btn btn-success">Guardar</button>
									<button id="limpiar-campos" type="reset" class="btn btn-success">Limpiar</button>
								</p>
							</div>
						</div>
					</form>
				</div>

	    	</div>
    	</div>

    	<script src="../assets/js/jquery.min.js" ></script>
        <script src="../assets/js/formValidation/formValidation.min.js"></script>
        <script src="../assets/js/formValidation/bootstrap.min.js"></script>

    	<script src="../assets/js/usuarios.js" ></script>
    </body>
</html>