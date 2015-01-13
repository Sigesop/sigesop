$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.generadores.documentoGeneradores( null, null, null, '' );
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -------------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		head: 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
		campo: 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion'
	});

	document.getElementById( 'pestanaAerosRegistrados' ).innerHTML = '<br>' + docR.html;

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

	// -------------------------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUnidades',
		solicitud: 'obtenerUnidades',
		respuesta: function(data) 
		{
			window.sesion.matrizUnidades = data;
			$.sigesop.insertaCombo( data, doc.datos.numero_unidad.idHTML, 'numero_unidad' );
		}
	});

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxGeneradores',
		solicitud: 'obtenerEstadoLicencia',
		respuesta: function( data )
		{
			window.sesion.matrizEstadoLicencia = data;
			$.sigesop.insertaCombo( data, doc.datos.estado_licencia.idHTML );
		}
	});	

	getData();

	// -------------------------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on( 'click', function(event)
	{
		event.preventDefault();
		procesoElemento ( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function(event)
	{
		event.preventDefault();
		limpiarCampos( doc )
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxGeneradores',
		solicitud: 'obtenerGeneradores',
		respuesta: function( data )
		{
			window.sesion.matrizGeneradores = data;
			docR.update_table( data );

			data != null ?
				document.getElementById( 'badge_generadores' ).innerHTML = data.length:
				document.getElementById( 'badge_generadores' ).innerHTML = '0';
		}
	});	
}

function procesoElemento ( doc, btn, callback )
{
	// ---------- capturar los datos restantes del formulario
	
	doc.datos.numero_unidad.valor = $( doc.datos.numero_unidad.idHTML ).val().trim();
	doc.datos.numero_aero.valor = $( doc.datos.numero_aero.idHTML ).val().trim();
	doc.datos.capacidad_efectiva_aero.valor = $( doc.datos.capacidad_efectiva_aero.idHTML ).val().trim();
	doc.datos.estado_licencia.valor = $( doc.datos.estado_licencia.idHTML ).val().trim();

	// ---------- validar los datos almacenados

	var arr = [
		doc.datos.numero_unidad,
		doc.datos.numero_aero,
		doc.datos.capacidad_efectiva_aero,
		doc.datos.estado_licencia
	];
	
	if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxGeneradores',
		solicitud: 'nuevoGenerador',
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

function limpiarCampos( doc )
{
	doc.datos.numero_unidad.valor = null;
	doc.datos.numero_aero.valor = null;
	doc.datos.numero_aero_update.valor = null;
	doc.datos.capacidad_efectiva_aero.valor = null;
	doc.datos.estado_licencia.valor = null;

	$( doc.datos.numero_unidad.idHTML ).val( '' );
	$( doc.datos.numero_aero.idHTML ).val( '' );
	$( doc.datos.capacidad_efectiva_aero.idHTML ).val( '' );
	$( doc.datos.estado_licencia.idHTML ).val( '' );
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizGeneradores[ index ];

	if( elemento )
	{
		var win = $.sigesop.ventanaEmergente({										
			idDiv: 'confirmar_eliminacion',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
				$.sigesop.insertarDatosSistema({
					Datos: { numero_aero: elemento.numero_aero },
					clase: 'ajaxGeneradores',
					solicitud: 'eliminarGenerador',
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
		elemento = window.sesion.matrizGeneradores[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = $.sigesop.generadores.documentoGeneradores ( elemento,  
				window.sesion.matrizUnidades, window.sesion.matrizEstadoLicencia, '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.numero_aero_update.valor = elemento.numero_aero;

		// ---------- 
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicion_generador',
			titulo: 'Edicion de equipo',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				// ---------- ejecutamos el HTML y el Javascript del formulario

				document.getElementById( this.idBody ).innerHTML = _doc.html;
				_doc.javascript();

				// ----------

				$( _doc.IDS.botonGuardar ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					procesoElemento( _doc, _doc.IDS.botonGuardar, actualizarElemento );
				});

				$( _doc.IDS.botonLimpiar ).on( 'click', function ( event )
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
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_generador_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxGeneradores',
		solicitud: 'actualizarGenerador',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_generador' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_generador_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_generador_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicion_generador_modal' ); boton.button( 'reset' ) }
	}) ;
}