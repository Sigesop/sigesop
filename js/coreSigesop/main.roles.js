$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.roles.documentoCatalagoRoles( null, null, null, '' );
	$( '#main' ).html( '<br>' + doc.html );
	doc.javascript();

	// ------------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		head: 'CLAVE ROL, DESCRICION ROL',
		campo: 'clave_rol, descripcion_areaTrabajo'
	});
	document.getElementById( 'rolesRegistrados' ).innerHTML = '<br>' + docR.html;

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

	// ------------------------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerAreasAcceso',
		respuesta: function (data) 
		{
			window.sesion.matrizAreaAcceso = data;
			if (data != null) 
			{				
				var docAreaAcceso = $.sigesop.roles.documentoAreaAcceso( data );
				$( doc.IDS.divAreaAcceso ).html( docAreaAcceso.html );
				doc.IDS.matrizIDareaAcceso = docAreaAcceso.matrizID;
			} 
			else $( doc.IDS.divAreaAcceso ).html( '<h4>Error de comunicación</h4>' );
		}
	});

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerPermisoAcceso',
		respuesta: function ( data ) 
		{
			window.sesion.matrizPermisoAcceso = data;
			if (data != null) 
			{
				var docPermisoAcceso = $.sigesop.roles.documentoPermisoAcceso( data );
				$( doc.IDS.divPermisoAcceso ).html( docPermisoAcceso.html );
				doc.IDS.matrizIDpermisoAcceso = docPermisoAcceso.matrizID;
				docPermisoAcceso.javascript();
			} 
			else $( doc.IDS.divPermisoAcceso ).html( '<h4>Error de comunicación</h4>' );
		}
	});	

	getData();

	// -----------------------------------------------------------------------		

	$( doc.IDS.botonGuardar ).on('click', function ( event ) {
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

// ---------- funcion que servira tanto para un nuevo elemento como para actualizar un elemento

function getData ()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerTipoRolUsuario',
		respuesta: function( data )
		{
			window.sesion.matrizTipoRol = data;
			
			data != null ?
				document.getElementById( 'badge_roles' ).innerHTML = data.length:
				document.getElementById( 'badge_roles' ).innerHTML = '0';

			docR.update_table( data )
		}										
	});
}

function procesoElemento ( doc, btn, callback )
{	
	// --------------capturamos los accesos seleccionados
	
	doc.datos.matrizAreaAcceso = []; // vaciamos el arreglo para evitar repetidos

	var matriz = doc.IDS.matrizIDareaAcceso;
	for( var i in matriz )
	{
		$( matriz[ i ] ).prop( 'checked' ) ? 
			doc.datos.matrizAreaAcceso.push( $( matriz[ i ] ).val() ) : null;
	}


	// --------------capturamos los permisos seleccionados
	
	doc.datos.matrizPermisoAcceso = []; // vaciamos el arreglo para evitar repetidos

	var matriz = doc.IDS.matrizIDpermisoAcceso;	
	for( var i in matriz ) 
	{
		$( matriz[ i ] ).prop( 'checked' ) ?
			doc.datos.matrizPermisoAcceso.push( $( matriz[ i ] ).val() ) : null;
	}
	
	// -------------- capturamos las cajas de datos restantes							

	doc.datos.nombreRol.valor = $( doc.datos.nombreRol.idHTML ).val().trim();
	doc.datos.descripcionRol.valor = $( doc.datos.descripcionRol.idHTML ).val().trim();

	// --------------validamos los campos

	var flagValidacionPermisos = true;
	jQuery.isEmptyObject( doc.datos.matrizPermisoAcceso ) ? flagValidacionPermisos = false : null;

	var flagValidacionAreaAcceso = true;
	jQuery.isEmptyObject( doc.datos.matrizAreaAcceso ) ? flagValidacionAreaAcceso = false : null;

	var arregloComprobacion = [ doc.datos.nombreRol, doc.datos.descripcionRol ];
	
	var flagValidacion = false;
	flagValidacion = $.sigesop.validacion( arregloComprobacion, { tipoValidacion: 'error' } );

	// -------------- enviamos insercion a la base de datos

	if ( flagValidacion ) 
	{
		if ( flagValidacionAreaAcceso ) 
		{
			if ( flagValidacionPermisos ) callback( doc, btn );
			else 
			{
				$.sigesop.msgBlockUI( 'No se han seleccionado permisos de usuario', 'error' );
				var permiso = {
					idHTML: doc.IDS.divPermisoAcceso,
					popover: {
						content: 'Seleccione Permisos para el rol de usuario',
						placement: 'top'
					}
				}
				$.sigesop.validacion( [ permiso ], { tipoValidacion: 'error' } );
			}
		} 
		else 
		{
			$.sigesop.msgBlockUI( 'No se han seleccionado areas de acceso', 'error' );
			
			var acceso = {
				idHTML: doc.IDS.divAreaAcceso,
				popover: {
					content: 'Seleccione areas de acceso visibles para el rol de usuario',
					placement: 'top'
				}
			}
			$.sigesop.validacion( [ acceso ], { tipoValidacion: 'error' } );
		}			
	} 
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );	
}

function nuevoElemento( doc, btn )
{
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({										
		Datos: doc.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'nuevoRolUsuario',
		type: 'POST',
		OK: function () 
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
	}) ;
}

function limpiarCampos( doc )
{
	doc.datos = $.sigesop.vaciarCampos ( doc.datos );

	// ---------- limpiar los checkbox seleccionados

	var check = doc.IDS.matrizIDareaAcceso;
	for( var i in check )
	{
		$( check[ i ] ).prop( 'checked', false )
	}

	var check = doc.IDS.matrizIDpermisoAcceso;
	for( var i in check )
	{
		$( check[ i ] ).prop( 'checked', false )
	}	
}

function eliminarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizTipoRol[ index ];

	if( elemento )
	{
		var win = $.sigesop.ventanaEmergente({										
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
				$.sigesop.insertarDatosSistema({
					Datos: { clave_rol: elemento.clave_rol },
					clase: 'ajaxUsuarios',
					solicitud: 'eliminarRolUsuario',
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
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>' );
			}
		});		
	}
	 
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar'	, 'error' );
}

function editarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizTipoRol[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		_doc = $.sigesop.roles.documentoCatalagoRoles( elemento, 
			window.sesion.matrizAreaAcceso, window.sesion.matrizPermisoAcceso, '_' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.nombreRolUpdate.valor = elemento.clave_rol;

		// ---------- insertamos los datos del equipo seleccionado en la ventana emergente de edicion
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicionRol',
			titulo: 'Edicion de Rol',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idBody ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				// ---------- ejecutamos el HTML y el Javascript del formulario

				document.getElementById( this.idBody ).innerHTML = _doc.html;
				_doc.javascript();

				// ---------- creamos el evento del boton GUARDAR 

				$( _doc.IDS.botonGuardar ).on('click', function ( event ) 
				{
					event.preventDefault();
					procesoElemento( _doc, _doc.IDS.botonGuardar, actualizarElemento );
				});

				$( _doc.IDS.botonLimpiar ).on('click', function ( event )
				{
					event.preventDefault();
					limpiarCampos( _doc );
				});
			}
		});
	} 
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function actualizarElemento( doc, btn )
{
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicionRol_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'actualizarRolUsuario',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicionRol' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicionRol_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicionRol_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicionRol_modal' ); boton.button( 'reset' ) }
	}) ;
}