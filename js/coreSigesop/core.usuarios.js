$.sigesop.usuarios = {
	documentoCatalogoUsuarios: function ( usr, rol, areaTrabajo, suf )
	{
		usr = usr || 	{
			RDE_trabajador: '',
			apellidos_trabajador: '',
			clave_areaTrabajo: '',
			clave_rol: '',
			nombre_trabajador: '',
			nombre_usuario: ''
		};				
		
		suf = suf || '';

		// --------------- creamos la estructura HTML

		var 
			htmlRol = $.sigesop.insertaCombo( rol, false, 'clave_rol, descripcion_areaTrabajo', 'clave_rol' ),

			htmlArea = $.sigesop.insertaCombo( areaTrabajo, false, 'clave_areaTrabajo, descripcion_areaTrabajo', 'clave_areaTrabajo' ),

			html = 
				'<form class="form-horizontal" role="form" method="post">'+
				'	<div id="formNombreUsuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Nombre:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="nombreUsuario' + suf + '" class="form-control input-md eventoCambioMayuscula' + suf + '" placeholder="Ingrese nombre del trabajador ( 1-50 caracteres, signos aceptados [A-Z])" value="' + usr.nombre_trabajador + '">'+
				'		</div>'+
				'	</div>'+

				'	<div id="formApellidosUsuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Apellidos:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="apellidosUsuario' + suf + '" class="form-control input-md eventoCambioMayuscula' + suf + '" placeholder="Ingrese apellido del trabajador ( 1-50 caracteres, signos aceptados [A-Z])" value="' + usr.apellidos_trabajador +'">' +
				'		</div>'+
				'	</div>'+

				'	<div id="formRPEusuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">RPE:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="RPEusuario' + suf + '" class="form-control input-md eventoCambioMayuscula' + suf + '" placeholder="Ingrese RPE ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])" value="'+ usr.RDE_trabajador + '">' +
				'		</div>'+
				'	</div>'+

				'	<div id="formUsuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Usuario:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="usuario' + suf + '" class="form-control input-md" placeholder="Ingrese nombre de usuario ( 1-30 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])" value="' + usr.nombre_usuario + '">' +
				'		</div>'+
				'	</div>'+

				'	<div id="formClaveUsuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Contraseña:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="claveUsuario' + suf + '" type="password" class="form-control input-md" placeholder="Ingrese nueva contraseña de identificación">'+
				'		</div>'+
				'	</div>'+

				'<div id="formClaveConfirmacion' + suf + '" class="form-group">'+
					'<label class="col-sm-3 control-label">Confirmar contraseña:</label>'+
					'<div class="col-sm-7">'+
						'<input id="claveUsuarioConfirmacion' + suf + '" type="password"  class="form-control input-md" placeholder="Confirme contraseña de identificación">'+
					'</div>'+
				'</div>'+

				'	<div id="formAreaTrabajo' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Area de Trabajo:</label>'+
				'		<div class="col-sm-7">'+
				'			<select id="areaTrabajo' + suf + '" class="form-control input-md" >' + htmlArea + '</select>' +
				'		</div>'+
				'	</div>'+

				'	<div id="formRolUsuario' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Rol de Usuario:</label>'+
				'		<div class="col-sm-7">'+
				'			<select id="rolUsuario' + suf + '" class="form-control input-md" >' + htmlRol + '</select>' +
				'		</div>'+
				'	</div>'+

				'	<div class="form-group">'+
				'		 <div class="col-sm-3"></div>'+
				'		 <div class="col-sm-7">'+
	        	'        	<button id="botonGuardarUser' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
	        	'			<button id="botonLimpiarUser' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>'
	        	'		 </div>'+
				'	</div>'+
				'</form>',
		
			doc = {
				html: html,
				javascript: function () 
				{
					// ---------------- agregando el evento de comparcion de contraseñas

					window.sesion.flagClave = false;

					$( doc.datos.claveUsuario.idHTML ).addClass( 'validacionClave' );
					$( doc.datos.claveUsuarioConfirmacion.idHTML ).addClass( 'validacionClave' );

					$( '.validacionClave' ).bind( 'keyup', function() 
					{
						var cadena =  $.sigesop.SHA1( $( doc.datos.claveUsuario.idHTML ).val() ),
							cadenaVerificar = $.sigesop.SHA1( $( doc.datos.claveUsuarioConfirmacion.idHTML ).val() );
						
						// ------------ comparamos las cadenas y agregamos los efectos de validacion

						if ( cadena === cadenaVerificar ) 
						{
							window.sesion.flagClave = true;

							$( doc.datos.claveUsuarioConfirmacion.idValidacion ).addClass( 'has-success' );
							$( doc.datos.claveUsuario.idValidacion ).addClass( 'has-success' );
							$( doc.datos.claveUsuarioConfirmacion.idValidacion ).removeClass( 'has-error' );
							$( doc.datos.claveUsuario.idValidacion ).removeClass( 'has-error' );					
						} 
						else 
						{
							window.sesion.flagClave = false;

							$( doc.datos.claveUsuarioConfirmacion.idValidacion ).addClass( 'has-error' );
							$( doc.datos.claveUsuario.idValidacion ).addClass( 'has-error' );
							$( doc.datos.claveUsuarioConfirmacion.idValidacion ).removeClass( 'has-success' );
							$( doc.datos.claveUsuario.idValidacion ).removeClass( 'has-success' );
						}
					});

					// ----------- selecciona los combos a los datos actuales del usuario

					$( doc.datos.areaTrabajo.idHTML ).val( usr.clave_areaTrabajo );
					$( doc.datos.rolUsuario.idHTML ).val( usr.clave_rol );

					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' + suf );
				},

				datos:  
				{
					nombreUsuario: 
					{
						valor: null,
						idHTML: '#nombreUsuario' + suf,
						idValidacion: '#formNombreUsuario' + suf,
						regexp: /^[\sA-Z]{1,50}$/i,
						popover: {
							content: 'Ingrese nombre del trabajador ( 1-50 caracteres, signos aceptados [A-Z])',
							placement: 'top'
						}
					},	
					apellidosUsuario: 
					{
						valor: null,
						idHTML: '#apellidosUsuario' + suf,
						idValidacion: '#formApellidosUsuario' + suf,
						regexp: /^[\sA-Z]{1,50}$/i,
						popover: {
							content: 'Ingrese apellido del trabajador ( 1-50 caracteres, signos aceptados [A-Z])',
							placement: 'left'
						}
					},
					RPEusuarioUpdate: {	valor: null	},
					RPEusuario: 
					{
						valor: null,
						idHTML: '#RPEusuario' + suf,
						idValidacion: '#formRPEusuario' + suf,
						regexp: /^[\dA-Z]{5}$/i,
						popover: {
							content: 'Ingrese RPE ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])',
							placement: 'top'
						}
					},
					usuarioUpdate: { valor: null },
					usuario: 
					{
						valor: null,
						idHTML: '#usuario' + suf,
						idValidacion: '#formUsuario' + suf,
						regexp: /^[-_.\w\s]{1,30}$/i,
						popover: {
							content: 'Ingrese nombre de usuario ( 1-30 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])',
							placement: 'left'
						}
					},
					claveUsuario: 
					{
						valor: null,
						idHTML: '#claveUsuario' + suf,
						idValidacion: '#formClaveUsuario' + suf
					},
					claveUsuarioConfirmacion: 
					{
						idHTML: '#claveUsuarioConfirmacion' + suf,
						idValidacion: '#formClaveConfirmacion' + suf
					},
					areaTrabajo: 
					{
						valor: null,
						idHTML: '#areaTrabajo' + suf,
						idValidacion: '#formAreaTrabajo' + suf,
						popover: {
							content: 'Seleccione Área de trabajo',
							placement: 'top'
						}
					},
					rolUsuario: 
					{
						valor: null,
						idHTML: '#rolUsuario' + suf,
						idValidacion: '#formRolUsuario' + suf,
						popover: {
							content: 'Seleccione Rol de Usuario',
							placement: 'left'
						}
					}					
				},

				IDS: 
				{
					botonGuardar: '#botonGuardarUser' + suf,
					botonLimpiar: '#botonLimpiarUser' + suf
				}
			};

		return doc;
	}
}