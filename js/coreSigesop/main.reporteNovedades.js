$( document ).on( 'ready', main );

function main()
{
	doc = $.sigesop.reporteNovedades.document();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// ----------

	// docR = $.sigesop.tablaRegistro({
	// 		head: 'AÑOS REGISTRADOS',
	// 		campo: 'anio_licencia'
	// 	});

	// document.getElementById( 'main_registro' ).innerHTML = docR.html;

	// $( docR.IDS.body ).contextMenu({
	// 	selector: 'tr',
	// 	items: {
 //            eliminar: 
 //            {
 //            	name: 'Eliminar', 
 //            	icon: 'delete',
 //        		callback: eliminarElemento
 //            }
	// 	}
	// });

	// ----------

	eventos( doc );
	$.sigesop.barraHerramientas( 'header' );
	getData();

	// ----------

	$( doc.IDS.botonGuardar ).on( 'click', function ( event ) 
	{
		event.preventDefault();		
		// procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		// limpiarCampos( doc );
	});
}

function eventos( doc )
{
	$( doc.datos.fecha_inicio_evento.idHTML ).datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 3,
		dateFormat: 'dd-mm-yy',
		showAnim: 'slide',
		onClose: function( selectedDate ) {
			// $( doc.datos.fecha_final.idHTML ).datepicker( "option", "dateFormat", 'dd-mm-yy' );
		}
	});

	// ---------- spinner de HORA

	Globalize.culture( 'de-DE' );

	$.widget( "ui.timespinner", $.ui.spinner, {
		options: {
			// segundos
			step: 60 * 1000,
			// horas
			page: 60
		},

		_parse: function( value ) {
			if ( typeof value === "string" ) {
				// already a timestamp
				if ( Number( value ) == value ) {
					return Number( value );
				}
				return + Globalize.parseDate( value );
			}

			return value;
		},

		_format: function( value ) {
			return Globalize.format( new Date(value), "t" );
		}
	});

	$( doc.datos.hora_inicio_evento.idHTML ).timespinner();

	// ---------- boton trabajador solicitó

	$( doc.datos.trabajador_solicito.boton ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		seleccionarUsuario( doc.datos.trabajador_solicito );
	});

	$( doc.datos.trabajador_autorizo.boton ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		seleccionarUsuario( doc.datos.trabajador_autorizo );
	});

	// $( doc.datos.trabajador_devolvio.boton ).on( 'click', function ( event ) 
	// {
	// 	event.preventDefault();
	// 	seleccionarUsuario( doc.datos.trabajador_devolvio );
	// });

	// ---------- boton trabajador autorizó

	// ---------- boton trabajador devolvió
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUnidades',
		solicitud: 'obtenerUnidades',
		respuesta: function ( data ) 
		{
			window.sesion.matrizUnidades = data;
			$.sigesop.combo({
				arr: data,
				elem: doc.datos.numero_unidad.idHTML,
				campo: 'numero_unidad'
			});
		}
	});

	// $.sigesop.solicitarDatosSistema({
	// 	clase: 'ajaxGeneradores',
	// 	solicitud: 'obtenerGeneradores',
	// 	respuesta: function ( data ) 
	// 	{
	// 		window.sesion.matrizGeneradores = data;
	// 		$.sigesop.combo({
	// 			arr: data,
	// 			elem: doc.datos.numero_aero.idHTML,
	// 			campo: 'numero_aero'
	// 		});
	// 	}
	// });

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxGeneradores',
		solicitud: 'obtenerEstadoLicencia',
		respuesta: function ( data ) 
		{
			window.sesion.matrizEstadoLicencia = data;
			$.sigesop.combo({
				arr: data,
				elem: doc.datos.condicion_operativa.idHTML
			});
		}
	});

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxOperacion',
		solicitud: 'obtener_libro_licencia',
		respuesta: function ( data ) 
		{
			window.sesion.matrizLicencia = data;
			$.sigesop.combo({
				arr: data,
				elem: doc.datos.id_libro_licencia.idHTML,
				campo: 'anio_licencia',
				campoValor: 'id_libro_licencia'
			});
		}
	});
}

function seleccionarUsuario( elem )
{
	var
		docT = $.sigesop.tablaSeleccion({
				color_select: 'success',
				head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
				campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol',						
			}),

		clickAceptar = function( event ) 
		{
			// ---------- Guardamos el id del sistema y ponenos el nombre del sistema en la caja
			
			if ( !jQuery.isEmptyObject( docT.matrizInput ) )
			{
				var index = $.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
					$.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) : -1;

				if ( index >= 0 ) 
				{
					// doc.datos.solicito.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];
					elem.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];

					var full_name = window.sesion.matrizUsuario[ index ]['nombre_trabajador'] + ' ' + window.sesion.matrizUsuario[ index ]['apellidos_trabajador'];
					$( elem.idHTML ).val( full_name );
					$( win.idDiv ).modal( 'hide' );
				}

				else $.sigesop.msgBlockUI( 'Trabajador no seleccionado', 'error', 'msgBlock', '#seleccionTrabajador_modal' );
			}

			else console.log( '[docT.matrizInput] es nula' );			
		},

		showBsModal = function () 
		{
			document.getElementById( this.idBody ).innerHTML = docT.html;					

			if( !jQuery.isEmptyObject( window.sesion.matrizUsuario ) )
				docT.update_table( window.sesion.matrizUsuario );

			else 
			{
				$.sigesop.solicitarDatosSistema({
					clase: 'ajaxUsuarios',
					solicitud: 'obtenerUsuarios',
					respuesta: function ( data ) 
					{
						window.sesion.matrizUsuario = data;
						docT.update_table( data );
					}
				});
			}
		},

		win = $.sigesop.ventanaEmergente({
			idDiv: 'seleccionTrabajador',
			titulo: 'Selección de trabajador solicitante',
			clickAceptar: clickAceptar,
			showBsModal: showBsModal
		});
}

// function procesoElemento ( doc, btn, callback )
// {
// 	// ----------------- capturamos los datos del HTML

//     doc.datos.anio_licencia.valor = $( doc.datos.anio_licencia.idHTML ).val().trim();

// 	// ----------------- comprobamos banderas y ejecutamos ajax al sistema

// 	if ( $.sigesop.validacion( [ doc.datos.anio_licencia ], {tipoValidacion: 'error'} ) ) 
// 		callback( doc, btn )
// 	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
// }

// function nuevoElemento( doc, btn )
// {
// 	var boton = $( btn );
// 	boton.button( 'loading' );
// 	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');		

// 	$.sigesop.insertarDatosSistema({
// 		Datos: doc.datos,
// 		clase: 'ajaxOperacion',
// 		solicitud: 'nuevo_libro_licencia',
// 		type: 'POST',
// 		OK: function()
// 		{
// 			limpiarCampos( doc );
// 			getData();
// 			$.sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
// 			boton.button('reset');		
// 		},
// 		NA: function () 
// 		{
// 			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );
// 			boton.button('reset');
// 		},

// 		DEFAULT: function (data) 
// 		{
// 			$.sigesop.msgBlockUI( data, 'error' );
// 			boton.button( 'reset' );
// 		},
// 		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ); boton.button( 'reset' ) }
// 	});
// }

// function limpiarCampos( doc )
// {	
// 	doc.datos.anio_licencia.valor = null;
// 	$( doc.datos.anio_licencia.idHTML ).val( '' );
// }

// function eliminarElemento( key, opt )
// {
// 	var 
// 		index = $( this ).index(),
// 		elemento = window.sesion.matrizLicencia[ index ];

// 	if ( elemento )
// 	{
// 		var win = $.sigesop.ventanaEmergente({
// 			idDiv: 'confirmarSolicitud',
// 			titulo: 'Autorización requerida',
// 			clickAceptar: function( event ) 
// 			{
// 				event.preventDefault();
// 				$( win.idDiv ).modal( 'hide' );

// 				$.sigesop.insertarDatosSistema({
// 					Datos: { id_libro_licencia: elemento.id_libro_licencia },
// 					clase: 'ajaxOperacion',
// 					solicitud: 'eliminar_libro_licencia',
// 					OK: function ()
// 					{
// 						getData();
// 						$.sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );
// 					},
// 					NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
// 					DEFAULT: function ( data ) { $.sigesop.msgBlockUI( data, 'error' ) },
// 					errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ) }
// 				});					
// 			},
// 			showBsModal: function () 
// 			{
// 				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>' );
// 			}
// 		});
// 	}
// }