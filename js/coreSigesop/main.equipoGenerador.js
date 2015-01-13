$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.equipoGenerador.documentoEquipoGenerador();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -----------------------------------------------------

	docR = $.sigesop.tablaRegistro({
			head: 'ID EQUIPO, NOMBRE EQUIPO, SISTEMA ASOCIADO',
			campo: 'id_equipo_aero, nombre_equipo_aero, nombre_sistema_aero'
		});

	document.getElementById( 'equiposRegistrados' ).innerHTML = '<br>' + docR.html;

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

	// -----------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );
		
	getData();

	// -----------------------------------------------------

	// boton "SELECCIONE SISTEMA" lanza la ventana emergente y la rellena de una lista de los sistemas
	// almacenados en la base de datos
	$( doc.IDS.botonSistema ).on( 'click', function ( event )
	{
		event.preventDefault();
		seleccionSistema( doc );
	});

	// boton "GUARDAR" el nuevo equipo en la base de datos
	$( doc.IDS.botonGuardar ).on( 'click', function ( event )
	{
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	// boton para LIMPIAR los campos
	$( doc.IDS.botonLimpiar ).on( 'click', function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxEquiposGenerador',
		solicitud: 'obtenerEquipoGenerador',
		respuesta: function( data )
		{
			window.sesion.matrizEquipos = data;	

			data != null ?
			document.getElementById( 'badge_equipoGenerador' ).innerHTML = data.length:
			document.getElementById( 'badge_equipoGenerador' ).innerHTML = '0';

			docR.update_table( data );
		}
	})
}

function procesoElemento ( doc, btn, callback )
{
	//------------------------- guardamos los datos seleccionados a la estructura de datos
	
	doc.datos.idEquipo.valor = $( doc.datos.idEquipo.idHTML ).val().trim();
	doc.datos.nombreEquipo.valor = $( doc.datos.nombreEquipo.idHTML ).val().trim();

	// ------------------------ validamos los datos capturados y marcamos los datos nulos
	
	var arr = [
		doc.datos.idEquipo,
		doc.datos.idSistema,
		doc.datos.nombreEquipo
	];

	if ( $.sigesop.validacion( arr, { tipoValidacion: 'error' } ) ) callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' )
}

function nuevoElemento ( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxEquiposGenerador',
		solicitud: 'nuevoEquipoGenerador',
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

function seleccionSistema( doc )
{
	var 
		docS = $.sigesop.tablaSeleccion({
				// tipo: 'checkbox',
				// color_fila: 'success',
				color_select: 'success',
				head: 'ID SISTEMA, NOMBRE SISTEMA',
				campo: 'id_sistema_aero, nombre_sistema_aero'				
			}),

		clickAceptar = function ()
		{
			// ---------- Guardamos el id del sistema y ponenos el nombre del sistema en la caja
			
			if ( !jQuery.isEmptyObject( docS.matrizInput ) )
			{
				var index = $.sigesop.getDataRadio( docS.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
					$.sigesop.getDataRadio( docS.matrizInput[ 0 ] ) : -1;

				if ( index >= 0 ) 
				{
					doc.datos.idSistema.valor = window.sesion.matrizSistemas[ index ]['id_sistema_aero'];
					$( doc.datos.idSistema.idHTML ).val( window.sesion.matrizSistemas[ index ]['nombre_sistema_aero'] );
					$( win.idDiv ).modal( 'hide' );
				}

				else $.sigesop.msgBlockUI( 'Sistema no seleccionado', 'error', 'msgBlock', '#ventanaSeleccionSistema_modal' );
			}

			else console.log( '[docS.matrizInput] es nula' );
		},

		showBsModal = function ()
		{
			// ------------------------------------------------------

			document.getElementById( this.idBody ).innerHTML = docS.html;			

			// ------------------------------------------------------

			if ( !jQuery.isEmptyObject( window.sesion.matrizSistemas ) )
				docS.update_table( window.sesion.matrizSistemas );

			else
			{
				$.sigesop.solicitarDatosSistema({
					clase: 'ajaxSistemasGenerador',
					solicitud: 'obtenerSistemas',
					respuesta: function( data )
					{
						window.sesion.matrizSistemas = data;
						docS.update_table( data );
					}
				});
			}
		},

		win = $.sigesop.ventanaEmergente({
			idDiv: 'ventanaSeleccionSistema',
			titulo: 'Seleccione Sistema',
			clickAceptar: clickAceptar,
			showBsModal: showBsModal
		});
}

function limpiarCampos( doc )
{	
	doc.datos.idEquipo.valor = null;
	doc.datos.idSistema.valor = null;
	doc.datos.nombreEquipo.valor = null;

	$( doc.datos.idEquipo.idHTML ).val( '' );
	$( doc.datos.idSistema.idHTML ).val( '' );
	$( doc.datos.nombreEquipo.idHTML ).val( '' );
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizEquipos[ index ];

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
					Datos: { id_equipo_aero: elemento.id_equipo_aero },
					clase: 'ajaxEquiposGenerador',
					solicitud: 'eliminarEquipoGenerador',
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
		elemento = window.sesion.matrizEquipos[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = $.sigesop.equipoGenerador.documentoEquipoGenerador ( elemento,  '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.idEquipo_update.valor = elemento.id_equipo_aero;

		// ---------- insertamos los datos del equipo seleccionado en la ventana emergente de edicion
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicion_equipos',
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

				// ---------- creamos el evento del boton GUARDAR 

				$( _doc.IDS.botonSistema ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					seleccionSistema( _doc );
				});				

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
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_equipos_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxEquiposGenerador',
		solicitud: 'actualizarEquipoGenerador',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_equipos' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_equipos_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_equipos_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicion_equipos_modal' ); boton.button( 'reset' ) }
	}) ;
}