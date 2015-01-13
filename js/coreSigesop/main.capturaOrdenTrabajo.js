$( document ).on( 'ready', main );

function main ( event )
{
	// -----------------------------------------------------------------------------------

	// docOT = $.sigesop.mantenimiento.documentoOrdenTrabajo( '' );
	// document.getElementById( 'main' ).innerHTML = '<br>' + docOT.html;			 
	// docOT.javascript();

	// docOT.callback.menuInsertar = function ( index, data )
	// {
	// 	if( data != null ) var elemento = data[ index ];
	// 		else var elemento = null;
	// 	insertarDatos( elemento );
	// }

	// -----------------------------------------------------------------------------------	

	docR = $.sigesop.tablaRegistro ({
		suf: '_ordenTrabajo',
		head: 'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, FECHA REPROGRAMADA',
		campo: 'numero_orden, trabajo_solicitado, nombre_mantenimiento, orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada'
	});

	document.getElementById( 'main' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            editar: 
            {
            	name: 'Insertar datos', 
            	icon: 'add',
        		callback: insertarDatos
            }
          //   eliminar: 
          //   {
          //   	name: 'Eliminar', 
          //   	icon: 'ok',
        		// // callback: eliminarElemento
          //   }
		}
	});

	// -----------------------------------------------------------------------------------	

	$.sigesop.barraHerramientas( 'header' );

	getData();
}

function getData()
{
	$.sigesop.insertarDatosRespuestaSistema ({
		Datos: { usuario: window.localStorage.usuario },
		clase: 'ajaxMantenimiento',
		solicitud: 'obtenerOrdenTrabajo',
		respuesta: function ( data )
		{
			window.sesion.matrizOrdenTrabajo = data;
			document.getElementById( 'badge_OT' ).innerHTML = data != null ? data.length : 0 ;
			
			docR.update_table( data );
		},
		errorRespuesta: function() { $.sigesop.msgBlockUI( 'Respuesta incorrecta del servidor', 'error' ) }
	});	
}

function insertarDatos( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizOrdenTrabajo[ index ];

	if( elemento )
	{
		var 
			activate_equipos = function ( id, value )
			{
				// alert( 'id: ' + id + ' value: ' + value );
				$.sigesop.insertarDatosRespuestaSistema({
					Datos: { 
						id_mantenimiento: elemento.id_mantenimiento, 
						id_sistema_aero: value,
						id_orden_trabajo: elemento.id_orden_trabajo
					},
					clase: 'ajaxMantenimiento',
					solicitud: 'equipo_into_systems_mantto',
					respuesta: function ( data )
					{	
						if ( data != null )					
						{
							// ---------- creamos la estructura para la edicion de el usuario en la ventana

							docEM = $.sigesop.mantenimiento.documentoInsertarDatos({
								arr: data,
								suf: '_' + value,		
								name: 'equipos',
								campo: 'nombre_equipo_aero',
								dataValue: 'id_equipo_aero',
								activate: activate_actividades
							});						

							document.getElementById( id ).innerHTML = docEM.html;
							docEM.javascript();
						}

						else document.getElementById( id ).innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>';
					},
					errorRespuesta: function () 
					{						
						$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
						boton.button('reset');
					}
				});
			},

			activate_actividades = function ( id, value )
			{
				// alert( 'id: ' + id + ' value: ' + value );
				$.sigesop.insertarDatosRespuestaSistema({
					Datos: { 
						id_mantenimiento: elemento.id_mantenimiento, 
						id_equipo_aero: value,
						id_orden_trabajo: elemento.id_orden_trabajo
					},
					clase: 'ajaxMantenimiento',
					solicitud: 'actividades_into_equipo',
					respuesta: function ( data )
					{	
						if ( data != null )					
						{
							// ---------- creamos la estructura para la edicion de el usuario en la ventana

							var 
								actividades = {
									id_orden_trabajo: elemento.id_orden_trabajo,
									actividades: data
								};

								docAC = $.sigesop.mantenimiento.documentoActividades({
									obj: actividades,
									suf: '_' + value,
									submit: procesoElemento
								});

							document.getElementById( id ).innerHTML = docAC.html;
							docAC.javascript();
						}

						else document.getElementById( id ).innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>';
					},
					errorRespuesta: function () 
					{						
						$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
						boton.button('reset');
					}
				});
			},

			showBsModal = function ()			
			{
				$.sigesop.insertarDatosRespuestaSistema({
					Datos: { 
						id_mantenimiento: elemento.id_mantenimiento,
						id_orden_trabajo: elemento.id_orden_trabajo
					},
					clase: 'ajaxMantenimiento',
					solicitud: 'systems_into_mantto',
					respuesta: function ( data )
					{						
						if ( data != null )
						{
							// ---------- creamos la estructura para la edicion de el usuario en la ventana

							docSM = $.sigesop.mantenimiento.documentoInsertarDatos({
								arr: data, 
								name: 'sistemas',
								campo: 'nombre_sistema_aero',
								dataValue: 'id_sistema_aero',
								activate: activate_equipos
							});
							
							// ---------- ejecutamos el HTML y el Javascript del formulario

							$( win.idBody ).html( docSM.html );
							docSM.javascript();
						}

						else $( win.idBody ).html( '<h3 class=" text-center ">SIN LISTAS DE VERIFICACION POR CAPTURAR...</h3>' );
					},
					errorRespuesta: function () 
					{						
						$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
						boton.button('reset');
					}
				});
			},

			win = $.sigesop.ventanaEmergente({
				idDiv: '__divInsertarDatosListaV',
				titulo: 'Insertar datos a lista de verificación',
				clickAceptar: function ( event )
				{
					event.preventDefault();
					$( win.idDiv ).modal( 'hide' );
				},
				showBsModal: showBsModal
			});
	}

	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

// --------------------------------------------------------------------------------------

function procesoElemento ( doc, btn )
{
	var boton = $( btn ),
		m = doc.datos.datos_actividad; // matriz de actividades
	
	for( var i = 0, lon_i = m.length; i < lon_i; i++ )
	{
		// -------------- capturar datos de lectura actual

		for( var j = 0, lon_j = m[ i ].datos_lectura_actual.length; j < lon_j; j++ )
		{
			var elemento = m[ i ].datos_lectura_actual[ j ].dato;

			m[ i ].datos_lectura_actual[ j ].tipo_dato === 'Binario' ?
				elemento.valor = $.sigesop.getDataRadio( elemento.name ):
				elemento.valor = $( elemento.idHTML ).val().trim();
		}

		// -------------- capturar datos de lectura posterior

		for( var j = 0, lon_j = m[ i ].datos_lectura_posterior.length; j < lon_j; j++ )
		{
			var elemento = m[ i ].datos_lectura_posterior[ j ].dato;					

			m[ i ].datos_lectura_posterior[ j ].tipo_dato === 'Binario' ?
				elemento.valor = $.sigesop.getDataRadio( elemento.name ):
				elemento.valor = $( elemento.idHTML ).val().trim();

		}

		// -------------- capturar el dato observaciones de la actividad

		m[ i ].observaciones.valor = $( m[ i ].observaciones.idHTML ).val().trim();
		// alert( 'valor: ' + m[ i ].observaciones.valor );
		// alert( 'idHTML: ' + m[ i ].observaciones.idHTML )					
	}						

	// doc.datos.duracion.valor = $( doc.datos.duracion.idHTML ).val().trim();
	// doc.datos.fechaProgramada.valor = $( doc.datos.fechaProgramada.idHTML ).val().trim();
	// doc.datos.fechaFinalProgramada.valor = $( doc.datos.fechaFinalProgramada.idHTML ).val().trim();
	// doc.datos.trabajoSolicitado.valor = $( doc.datos.trabajoSolicitado.idHTML ).val().trim();

	if ( $.sigesop.mantenimiento.validacion( doc.datos ) ) nuevoElemento( doc, btn );
		else $.sigesop.msgBlockUI( 'Campos no validos', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
}

function nuevoElemento ( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#__divInsertarDatosListaV_modal');

	$.sigesop.insertarDatosSistema({
		clase: 'ajaxMantenimiento',
		solicitud: 'insertarDatosListaVerificacion',
		Datos: doc.datos,
		type: 'POST',
		OK: function () 
		{
			$.sigesop.msgBlockUI( 'Datos guardados satisfactoriamente', 'success', 'msgBlock', '#__divInsertarDatosListaV_modal' );

			// ---------- impedir enviar de nuevo
			
			$( doc.IDS.botonLimpiar ).prop( 'disabled', true );

		},
		NA: function () 
		{						
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
			boton.button('reset');
		},
		DEFAULT: function( data ) 
		{						
			$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
			boton.button('reset');
		},	
		errorRespuesta: function () 
		{						
			$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#__divInsertarDatosListaV_modal' );
			boton.button('reset');
		}						
	});
}