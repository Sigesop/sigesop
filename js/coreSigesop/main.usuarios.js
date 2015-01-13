$( document ).on('ready', main );

function main ()
{
	doc = $.sigesop.usuarios.documentoCatalogoUsuarios( null, null, null, '' );
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// --------------------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
		campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol'
	});

	document.getElementById( 'usuariosRegistrados' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            editar: 
            {
            	name: 'Editar', 
            	icon: 'edit',
        		callback: editarElemento
            },
            eliminar: 
            {
            	name: 'Eliminar', 
            	icon: 'delete',
        		callback: eliminarElemento
            }
		}
	});

	// --------------------------------------------------------------------------------	

	$.sigesop.barraHerramientas( 'header' );

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerAreaTrabajo',		
		respuesta: function( data )
		{			
			window.sesion.matrizAreaTrabajo = data;
			$.sigesop.insertaCombo( data, doc.datos.areaTrabajo.idHTML, 'clave_areaTrabajo, descripcion_areaTrabajo', 'clave_areaTrabajo' );
		}
	});	
		
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerTipoRolUsuario',
		respuesta: function( data )
		{
			window.sesion.matrizTipoRol = data;			
			$.sigesop.insertaCombo( data, doc.datos.rolUsuario.idHTML, 'clave_rol, descripcion_areaTrabajo', 'clave_rol' );
		}										
	});

	getData();

	// -----------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on('click', function ( event ) 
	{
		event.preventDefault();
		procesoElemento ( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function limpiarCampos ( doc )
{
	doc.datos = $.sigesop.vaciarCampos( doc.datos );

	$( doc.datos.claveUsuario.idValidacion ).removeClass('has-success');
	$( doc.datos.claveUsuario.idValidacion ).removeClass('has-error');
	$( doc.datos.claveUsuarioConfirmacion.idValidacion ).removeClass('has-success');
	$( doc.datos.claveUsuarioConfirmacion.idValidacion ).removeClass('has-error');	
}

function procesoElemento ( doc, btn, callback )
{	
	// ----------------- capturamos los datos del HTML

    doc.datos.nombreUsuario.valor = $( doc.datos.nombreUsuario.idHTML ).val().trim();
	doc.datos.apellidosUsuario.valor = $( doc.datos.apellidosUsuario.idHTML ).val().trim();
	doc.datos.RPEusuario.valor = $( doc.datos.RPEusuario.idHTML ).val().trim();
	doc.datos.usuario.valor = $( doc.datos.usuario.idHTML ).val().trim();
	doc.datos.areaTrabajo.valor = $( doc.datos.areaTrabajo.idHTML ).val().trim();
	doc.datos.rolUsuario.valor = $( doc.datos.rolUsuario.idHTML ).val().trim();

	doc.datos.claveUsuario.valor = !jQuery.isEmptyObject( $( doc.datos.claveUsuario.idHTML ).val() ) ?
		$.sigesop.SHA1( $( doc.datos.claveUsuario.idHTML ).val() ) : null;
		
	// ----------------- validamos las cadenas de los campos
	var arr = [
		doc.datos.nombreUsuario,
		doc.datos.apellidosUsuario,
		doc.datos.RPEusuario,
		doc.datos.usuario,
		doc.datos.claveUsuario,
		doc.datos.areaTrabajo,
		doc.datos.rolUsuario
	]

	// ----------------- comprobamos banderas y ejecutamos ajax al sistema

	if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) 
	{
		if ( window.sesion.flagClave ) callback( doc, btn )
		else $.sigesop.msgBlockUI( 'error en la coincidencia de las contraseñas', 'error' );
	} 

	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');		

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'nuevoUsuario',
		type: 'POST',
		OK: function()
		{
			limpiarCampos( doc );
			getData();
			$.sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
			boton.button('reset');		
		},
		NA: function () 
		{
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );
			boton.button('reset');
		},

		DEFAULT: function (data) 
		{
			$.sigesop.msgBlockUI( data, 'error' );
			boton.button( 'reset' );
		},
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ); boton.button( 'reset' ) }
	});
}

function eliminarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizUsuario[ index ];

	if ( elemento )
	{
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );

				$.sigesop.insertarDatosSistema({
					Datos: { nombre_usuario: elemento.nombre_usuario },
					clase: 'ajaxUsuarios',
					solicitud: 'eliminarUsuario',
					OK: function ()
					{
						getData();
						$.sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );
					},
					NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
					DEFAULT: function ( data ) { $.sigesop.msgBlockUI( data, 'error' ) },
					errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ) }
				});					
			},
			showBsModal: function () 
			{
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>' );
			}
		});
	}
}

function editarElemento( key, opt )
{
	var 
		index = $( this ).index();
		elemento = window.sesion.matrizUsuario[ index ];

	if ( elemento )
	{
		// --------------- creamos la estructura para la edicion de el usuario en la ventana
		
		docU = $.sigesop.usuarios.documentoCatalogoUsuarios( elemento, 
			window.sesion.matrizTipoRol, window.sesion.matrizAreaTrabajo, '_edicion' );

		// --------------- capturamos el ID de la actualizacion
		
		docU.datos.RPEusuarioUpdate.valor = elemento.RDE_trabajador;
		docU.datos.usuarioUpdate.valor = elemento.nombre_usuario;

		// insertamos los datos del equipo seleccionado en la ventana emergente de edicion
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicionUsuario',
			titulo: 'Edicion de usuario',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				// ---------------- ejecutamos el HTML y el Javascript del formulario de edicion
				
				$( '#' + this.idBody ).html( docU.html );
				docU.javascript();

				// ---------------- agregando el evento de comparcion de contraseñas

				var flagClaveEdicion = false;

				$( docU.datos.claveUsuario.idHTML ).addClass( 'validacionClave_' );
				$( docU.datos.claveUsuarioConfirmacion.idHTML ).addClass( 'validacionClave_' );

				$( '.validacionClave_' ).bind( 'keyup', function() 
				{
					var cadena =  $.sigesop.SHA1( $( docU.datos.claveUsuario.idHTML ).val() ),
						cadenaVerificar = $.sigesop.SHA1( $( docU.datos.claveUsuarioConfirmacion.idHTML ).val() );
					
					// ------------ comparamos las cadenas y agregamos los efectos de validacion

					if ( cadena === cadenaVerificar ) 
					{
						flagClaveEdicion = true;

						$( docU.datos.claveUsuarioConfirmacion.idValidacion ).addClass( 'has-success' );
						$( docU.datos.claveUsuario.idValidacion ).addClass( 'has-success' );
						$( docU.datos.claveUsuarioConfirmacion.idValidacion ).removeClass( 'has-error' );
						$( docU.datos.claveUsuario.idValidacion ).removeClass( 'has-error' );					
					} 
					else 
					{
						flagClaveEdicion = false;

						$( docU.datos.claveUsuarioConfirmacion.idValidacion ).addClass( 'has-error' );
						$( docU.datos.claveUsuario.idValidacion ).addClass( 'has-error' );
						$( docU.datos.claveUsuarioConfirmacion.idValidacion ).removeClass( 'has-success' );
						$( docU.datos.claveUsuario.idValidacion ).removeClass( 'has-success' );
					}
				});	

				$( docU.IDS.botonGuardar ).on( 'click', function ( event )
				{
					event.preventDefault();
					procesoElemento( docU, docU.IDS.botonGuardar, actualizarElemento );
				});
			}
		});
	}
}

function actualizarElemento( doc, btn )
{
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicionUsuario_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: docU.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'actualizarUsuario',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicionUsuario' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicionUsuario_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicionUsuario_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicionUsuario_modal' ); boton.button( 'reset' ) }								
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerUsuarios',
		respuesta: function( data ) 
		{
			window.sesion.matrizUsuario = data;
			data != null ?
				document.getElementById( 'badge_usuarios' ).innerHTML = data.length:
				document.getElementById( 'badge_usuarios' ).innerHTML = '0';

			docR.update_table( data );
		}
	});
}