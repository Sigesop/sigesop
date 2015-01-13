$.sigesop.login = {
	documentoLogin: function ( suf )
	{
		var html = 			
			'<header>' +
			'	<div class="row">' +
			'		<div class="col-sm-6 col-sm-offset-3">' +
			'			<h1 class="text-center">Sistema de gestión operativa y mantenimiento</h1>' +
			'			<span class="text-center">Comisión Federal de Electricidad</span>' +
			'		</div>' +
			'		<div class="col-sm-3"></div>' +
			'	</div>' +

			'	<div class="row botonInicio">' +
			'		<div class="col-sm-1 col-md-1"></div>' +
			'		<div class="col-sm-11 col-md-11">' +
			'			<p class="pull-center">' +
			'				<button id="accesoSystem' + suf + '" class="btn btn-success">Acceso al Sistema</button>' +
			'			</p>' +
			'		</div>' +
			'	</div>' +

			'</header>' +
			
			'<div class="container-fluid" id="formularioLogin' + suf + '" title="Acceso al sistema" >' +		
			'	<form id="formLogin" class="form-singin" role="form" method="post">' +
			'		<br>' +
			'		<div class="form-group"><img src="css/images/logohome1.png" class="img-responsive"></img></div> <br>'+
			
			'		<div id="formH6" class="form-group">' +
			'			<h6 class="form-singin-heading text-center" id="tips"><b>Ingrese todos los campos</b></h6>' +
			'		</div>' +
			
			'		<div id="formUsuario' + suf + '" class="form-group">' +
			'			<input type="text" id="usuario' + suf + '" class="form-control text-center" required autofocus mouseev="true" autocomplete="off" keyev="true" clickev="true" placeholder="Usuario"/>' +
			'		</div>' +
			
			'		<div id="formClave' + suf + '" class="form-group" >' +
			'			<input type="password" id="clave' + suf + '" class="form-control text-center" required autofocus mouseev="true" autocomplete="off" keyev="true" clickev="true" placeholder="Contraseña"/>' +
			'		</div> <br>' +				
			
			'		<div class="form-group">' +
			'			<div class="col-md-2"></div>' +
			'			<div class="col-md-8">' +
			'				<button id="btnLogin' + suf + '" class="btn btn-lg btn-success btn-block" data-loading-text="Enviando..." type="submit">Ingresar</button>' +
			'			</div>' +
			'			<div class="col-md-2"></div>' +
			'		</div>' +
			'	</form>' +
			'</div>';

		var obj = {
			html: html,
			javascript: function()
			{
				$( obj.IDS.formularioLogin ).dialog({
					dialogClass: "no-close",
					autoOpen: true,
					resizable: false,
					height: 390,
					width: 350,
					modal: true,
					show: {
						effect: "blind",
						duration: 1000
					},
					hide: {
						effect: "explode",
						duration: 1000
					}
				});
			},

			datos: {
				usuario: {
					valor: null,
					idHTML: '#usuario' + suf,
					idValidacion: '#formUsuario' + suf,
					popover: {
						content: 'Usuario no valido',
						placement: 'top'
					}
				},

				clave: {
					valor: null,
					idHTML: '#clave' + suf,
					idValidacion: '#formClave' + suf,
					popover: {
						content: 'Contraseña no válida',						
						placement: 'bottom'
					}
				}
			},

			IDS: {
				botonAcceso: '#accesoSystem' + suf,
				botonLogin: '#btnLogin' + suf,
				formularioLogin: '#formularioLogin' + suf
			}
		}

		return obj;	
	}
}