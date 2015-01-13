$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.unidades.documentoUnidad();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
			head: 'NUMERO DE UNIDAD, CAPACIDAD INSTALADA, CAPACIDAD EFECTIVA',
			campo: 'numero_unidad, capacidad_instalada, capacidad_efectiva_unidad'
		});

	document.getElementById( 'unidadesRegistradas' ).innerHTML = '<br>' + docR.html;

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

	// -------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );
	
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxGestionCentral',
		solicitud: 'obtenerDatosCentral',
		respuesta: function( data )
		{
			window.sesion.matrizCentral = data;

			if ( data !== null ) 
			{
				doc.datos.clave_20.valor = data[ 0 ][ 'clave_20' ];
				$( doc.datos.clave_20.idHTML ).val( data[ 0 ][ 'clave_20' ] );
			}
		}
	});

	getData();

	// -------------------------------------------------------

	$( doc.IDS.botonGuardar ).on('click', function ( event )
	{
		event.preventDefault();		
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).click( function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUnidades',
		solicitud: 'obtenerUnidades',
		respuesta: function ( data )
		{
			if (data !== null) 
			{
				window.sesion.matrizUnidades = data;
				
				docR.update_table( data );	
				data != null ?
					document.getElementById( 'badge_unidad' ).innerHTML = data.length:
					document.getElementById( 'badge_unidad' ).innerHTML = '0';			
			}
		}
	});	
}

function limpiarCampos( doc )
{	
	doc.datos.numero_unidad.valor = null;
	$( doc.datos.numero_unidad.idHTML ).val( '' );
}

function procesoElemento( doc, btn, callback )
{	
	//------------------------- guardamos los datos seleccionados a la estructura de datos
	
	doc.datos.numero_unidad.valor = $( doc.datos.numero_unidad.idHTML ).val().trim();

	// ------------------------ validamos los datos capturados y marcamos los datos nulos
	
	var arr = [
		doc.datos.clave_20,
		doc.datos.numero_unidad
	];

	if ( $.sigesop.validacion( arr, { tipoValidacion: 'error' } ) ) callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' )
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxUnidades',
		solicitud: 'nuevaUnidad',
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

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizUnidades[ index ];

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
					Datos: { numero_unidad: elemento.numero_unidad },
					clase: 'ajaxUnidades',
					solicitud: 'eliminarUnidad',
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
		elemento = window.sesion.matrizUnidades[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = $.sigesop.unidades.documentoUnidad ( elemento,  '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.numero_unidad_update.valor = elemento.numero_unidad;
		_doc.datos.clave_20.valor = window.sesion.matrizCentral[ 0 ].clave_20;

		// ---------- insertamos los datos del equipo seleccionado en la ventana emergente de edicion
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicion_unidades',
			titulo: 'Edicion de Unidad',
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
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_unidades_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxUnidades',
		solicitud: 'actualizarUnidad',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_unidades' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_unidades_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_unidades_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicion_unidades_modal' ); boton.button( 'reset' ) }
	}) ;
}