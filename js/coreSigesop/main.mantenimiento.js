$( document ).on( 'ready', main );

function main()
{
	doc = $.sigesop.mantenimiento.documentoProgramaMantenimiento();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -----------------------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro ({
		suf: '_Rmtto',
		head: 'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, FECHA REPROGRAMADA',
		campo: 'numero_orden, trabajo_solicitado, nombre_mantenimiento, orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada'
	});

	document.getElementById( 'pestanaProgramasRegistrados' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            editar: 
            {
            	name: 'Asignar orden de trabajo', 
            	icon: 'user',
        		callback: insertarUsuarios
            },
            
            programacion: 
            {
            	name: 'Ver programación de mantenimiento', 
            	icon: 'copy'
        		// callback: eliminarElemento
            }
		}
	});

	// -----------------------------------------------------------------------------------	

	eventos( doc );

	// -----------------------------------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );

	getData();
	
	// -------------------------------------------------------------------------------------

	$( doc.IDS.botonResponsable ).on( 'click', function ( event ) {
		event.preventDefault();
		seleccionarResponsable( doc )
	} );	

	$( doc.IDS.botonAuxiliar ).on( 'click', function ( event ) {
		event.preventDefault();
		seleccionarAuxiliar( doc )
	} );

	$( doc.IDS.botonSupervisor ).on( 'click', function ( event ) {
		event.preventDefault();
		seleccionarSuper ( doc );
	} )	

	// -------------------------------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, generarElementos );
	});

	// -------------------------------------------------------------------------------------

	$( doc.IDS.botonLimpiar ).on('click', function (event) 
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function procesoElemento ( doc, btn, callback )
{
	var boton = $( btn );

	// -------------- capturar los datos restantes del formulario
	
	doc.datos.duracion.valor = $( doc.datos.duracion.idHTML ).val().trim();
	doc.datos.fecha_inicial.valor = $( doc.datos.fecha_inicial.idHTML ).val().trim();
	doc.datos.fecha_final.valor = $( doc.datos.fecha_final.idHTML ).val().trim();
	doc.datos.trabajo_solicitado.valor = $( doc.datos.trabajo_solicitado.idHTML ).val().trim();

	// ------------------------------------- generar el numero de orden

	// var numeroOrden = doc.datos.numeroUnidad.valor + 
	// 	doc.datos.numeroGenerador.valor + doc.datos.tipoMantto.valor + 
	// 	doc.datos.idSistema.valor + doc.datos.idEquipo.valor;

	// doc.datos.numeroOrden.valor = numeroOrden;

	// ------------------------------------- validar los datos almacenados
	var arr = [
		doc.datos.numero_unidad,
		doc.datos.numero_aero,
		doc.datos.id_mantenimiento,
		doc.datos.magnitud_duracion,
		doc.datos.duracion,			
		doc.datos.fecha_inicial,
		doc.datos.fecha_final,
		doc.datos.trabajo_solicitado
	];
	
	if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'}) ) 
	{
		// -------------- validar fechas correctas
		var inicio = moment( doc.datos.fecha_inicial.valor, 'DD-MM-YYYY' ),
			fin = moment( doc.datos.fecha_final.valor, 'DD-MM-YYYY' );
		
		if ( fin.isAfter( inicio ) ) callback( doc, btn )
		else 
		{
			doc.datos.fecha_final.valor = null;
			doc.datos.fecha_inicial.valor = null;
			$( doc.datos.fecha_final.idHTML ).empty();
			$( doc.datos.fecha_inicial.idHTML ).empty();

			var arr = [doc.datos.fecha_final, doc.datos.fecha_inicial];
			$.sigesop.validacion( arr, {tipoValidacion: 'error'});

			$.sigesop.msgBlockUI( 'Las fechas son inválidas', 'error' );			
		}
	} 
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function generarElementos ( doc, btn )
{
	// -------------- buscamos la frecuencia y la magnitud de la frecuencia en el arreglo de tipos de mantenimiento

	// var posicion = $.sigesop.indexOfObjeto( window.sesion.matrizTipoMantto, 'nombre_mantenimiento', doc.datos.tipoMantto.valor );
	var posicion = $.sigesop.indexOfObjeto( window.sesion.matrizTipoMantto, 'id_mantenimiento', doc.datos.id_mantenimiento.valor );
	
	if ( posicion !== -1 ) 
	{
		// -------------- calculamos los periodos

		var 
			fechaInicial = doc.datos.fecha_inicial.valor,
			fechaFinal = doc.datos.fecha_final.valor,
			duracion = doc.datos.duracion.valor,
			magnitudDuracion = doc.datos.magnitud_duracion.valor,
			frecuencia = window.sesion.matrizTipoMantto[ posicion ].numero_frecuencia,
			mangnitudFrecuencia = window.sesion.matrizTipoMantto[ posicion ].tipo_frecuencia;						

		var 
			fechaLocal = $.sigesop.mantenimiento.calculaPeriodoMantenimiento({
				fechaInicial: fechaInicial,
				fechaFinal: fechaFinal,
				duracion: duracion,
				magnitudDuracion: magnitudDuracion,
				frecuencia: frecuencia,
				magnitudFrecuencia: mangnitudFrecuencia
			});		

		// ---------- objeto con los datos para graficar

		var obj = {
			nombre: doc.datos.numero_aero.valor + ' - ' + doc.datos.id_mantenimiento.valor ,
			colorGrafica: '#5bc0de',
			intervalos: fechaLocal
		}

		// ---------- creacion del documento para la ventana emergente

		var _doc = $.sigesop.mantenimiento.documentoVistaPreliminar( '_' );

		$.sigesop.ventanaEmergente({
			idDiv: '_vg',
			titulo: 'Vista preliminar',
			idBody: '_vgBody',
			idBtnOK: '_vgOK',
			clickAceptar: function ( event )
			{
				$( '#_vg' ).modal( 'hide' );
			},
			showBsModal: function (  )
			{
				$( '#' + this.idBody ).html( _doc.html );

				$( _doc.IDS.botonGuardar ).on('click', function ( event )
				{
					event.preventDefault();
					nuevoElemento( doc, _doc.IDS.botonGuardar, fechaLocal );
				});	
			},							
			shownBsModal: function ( )
			{								
				$.sigesop.mantenimiento.graficaMantenimiento( [ obj ], _doc.IDS.grafica );
			}
		})	
	}
	else console.log( 'ID Mantenimiento: ' + doc.datos.id_mantenimiento.valor + ' no encontrado' );
}

function nuevoElemento( doc, btn, fechaLocal )
{
	var boton = $( btn );	
	// boton.button( 'loading' );

	// ---------- cambiamos los formatos de fechas para insertar en el servidor

	var 
		fechaServer =  $.sigesop.mantenimiento.formatoFechaServidor( fechaLocal ),
		mtzOrdenTrabajo = [];

	// -------------- creamos las ordenes de trabajo cambiando las fechas programas 

	for( var i = 0, lon = fechaServer.length; i < lon; i++ )
	{
		doc.datos.fecha_inicial.valor = fechaServer[ i ].from;
		var obj = jQuery.extend( true, {}, doc.datos );

		delete obj.duracion.idHTML;
		delete obj.duracion.idValidacion;
		delete obj.duracion.popover;

		delete obj.fecha_final.idHTML;
		delete obj.fecha_final.idValidacion;
		delete obj.fecha_final.popover;

		delete obj.fecha_inicial.idHTML;
		delete obj.fecha_inicial.idValidacion;
		delete obj.fecha_inicial.popover;

		delete obj.id_mantenimiento.idHTML;
		delete obj.id_mantenimiento.idValidacion;
		delete obj.id_mantenimiento.popover;

		delete obj.magnitud_duracion.idHTML;
		delete obj.magnitud_duracion.idValidacion;
		delete obj.magnitud_duracion.popover;

		delete obj.numero_aero.idHTML;
		delete obj.numero_aero.idValidacion;
		delete obj.numero_aero.popover;

		delete obj.numero_unidad.idHTML;
		delete obj.numero_unidad.idValidacion;
		delete obj.numero_unidad.popover;

		delete obj.trabajo_solicitado.idHTML;
		delete obj.trabajo_solicitado.idValidacion;
		delete obj.trabajo_solicitado.popover;

		mtzOrdenTrabajo.push( obj );
	}
		

	// ---------- insertamos los datos al servidor
	
	$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#_vg_modal' );
	$.sigesop.insertarDatosSistema({
		Datos: { ordenTrabajo: mtzOrdenTrabajo },
		clase: 'ajaxMantenimiento',
		solicitud: 'nuevaOrdenTrabajo',
		type: 'POST',
		OK: function () 
		{			
			getData();
			limpiarCampos( doc )
			$( '#_vg' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Orden de trabajo agregada satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#_vg_modal' ); /*boton.button('reset');*/ },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#_vg_modal' ); /*boton.button( 'reset' );*/ },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#_vg_modal' ); /*boton.button( 'reset' )*/ }
	});		
}

function limpiarCampos( doc )
{
	doc.datos.numero_unidad.valor = null;
	doc.datos.numero_aero.valor = null;
	doc.datos.id_mantenimiento.valor = null;
	doc.datos.duracion.valor = null;
	doc.datos.magnitud_duracion.valor = null;
	doc.datos.fecha_inicial.valor = null;
	doc.datos.fecha_final.valor = null;
	doc.datos.trabajo_solicitado.valor = null;

	$( doc.datos.numero_unidad.idHTML ).val( '' );
	$( doc.datos.numero_aero.idHTML ).val( '' );
	$( doc.datos.id_mantenimiento.idHTML ).val( '' );
	$( doc.datos.duracion.idHTML ).val( '' );
	$( doc.datos.magnitud_duracion.idHTML ).val( '' );
	$( doc.datos.fecha_inicial.idHTML ).val( '' );
	$( doc.datos.fecha_final.idHTML ).val( '' );
	$( doc.datos.trabajo_solicitado.idHTML ).val( '' );
}

// ---------------------------------------------

function eventos ( doc )
{
	$( doc.datos.numero_unidad.idHTML ).change( function ()
	{
		$( doc.datos.numero_aero.idHTML ).prop('disabled', true);
		$( doc.datos.numero_aero.idHTML ).empty();

		var valorUnidad = $( this ).val();
		if ( valorUnidad )
		{
			doc.datos.numero_unidad.valor = valorUnidad;
		
			$.sigesop.insertarDatosRespuestaSistema({
				Datos: { unidad: valorUnidad },
				clase: 'ajaxGeneradores',
				solicitud: 'obtenerGeneradoresPorUnidad',
				respuesta: function ( data ) 
				{
					window.sesion.matrizGeneradorPorUnidad = data;
					$.sigesop.insertaCombo(data, doc.datos.numero_aero.idHTML, 'numero_aero');
					data != null ? $( doc.datos.numero_aero.idHTML ).prop('disabled', false) : null;
				}
			});
		}

		else doc.datos.numero_unidad.valor = null;
	});

	$( doc.datos.numero_aero.idHTML ).change( function ( event ) 
	{
		var valorAero = $( this ).val().trim(),
			tipoMantto = $( doc.datos.id_mantenimiento.idHTML ),
			fechaInicial = $( doc.datos.fecha_inicial.idHTML );

		if ( valorAero ) 
		{
			$.sigesop.insertarDatosRespuestaSistema({
				Datos: { Generador: valorAero },
				clase: 'ajaxMantenimiento',
				solicitud: 'obtenerOrdenesPorGenerador',
				respuesta: function ( data ) 
				{
					window.sesion.matrizOrdenesPorGenerador = data;
					tipoMantto.prop( 'disabled', false );
					tipoMantto.val( '' );

					// ----------

					fechaInicial.prop( 'disabled', false );
					fechaInicial.val( '' );
					// data != null ? $( doc.datos.numero_aero.idHTML ).prop('disabled', false) : null;
				}
			});

			doc.datos.numero_aero.valor = valorAero;						
		}
		else 
		{
			doc.datos.numero_aero.valor = null;
			tipoMantto.val( '' );
			tipoMantto.prop('disabled', true);
			
			// ----------

			fechaInicial.prop( 'disabled', false );
			fechaInicial.val( '' );
		}
	});

	$( doc.datos.id_mantenimiento.idHTML ).change( function ( event )
	{
		var valor = $( this ).val();
		if ( valor ) 
		{
			doc.datos.id_mantenimiento.valor = valor;

			// ---------- buscamos la fecha de la ultima orden del id_mantenimiento seleccionado

			if ( window.sesion.matrizTipoMantto != null && window.sesion.matrizOrdenesPorGenerador != null ) 
			{
				var indice = null,
					fechaInicial = $( doc.datos.fecha_inicial.idHTML );

				indice = $.sigesop.indexOfObjeto( window.sesion.matrizOrdenesPorGenerador, 'id_mantenimiento', valor );
				if( indice != -1 )
				{
					var fechaServidor = window.sesion.matrizOrdenesPorGenerador[ indice ].fecha_programada,
						fechaLocal = moment( fechaServidor ).format( 'DD-MM-YYYY' );									
					
					// --------- ponemos la fecha en la caja, los datos y la deshabilitamos

					doc.datos.fecha_inicial.valor = fechaLocal;
					fechaInicial.val( fechaLocal );
					fechaInicial.prop( 'disabled', true );

				}
				else
				{
					doc.datos.fecha_inicial.valor = null;
					fechaInicial.val('');
					fechaInicial.prop( 'disabled', false );
				}
			}
			else console.log( 'matrizTipoMantto o matrizOrdenesPorGenerador se encuentra nulo' );
		}					
		else
		{ 
			doc.datos.id_mantenimiento.valor = null;
		}
	});

	$( doc.datos.duracion.idHTML ).spinner({
		spin: function (event, ui) 
		{
			if ( $.isNumeric( ui.value ) ) 
			{
				if (ui.value <= 0) {
					$( this ).spinner('value', 1);
					return false;
				}
			}
		}
	});

	$( doc.datos.magnitud_duracion.idHTML ).change( function ( event )
	{
		var valor = $( this ).val();
		if ( valor ) doc.datos.magnitud_duracion.valor = valor;
		else doc.datos.magnitud_duracion.valor = null;
	});

	$( doc.datos.fecha_inicial.idHTML ).datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 3,
		dateFormat: 'dd-mm-yy',
		// showAnim: 'clip',
		onClose: function( selectedDate ) {
			// $( doc.datos.fecha_final.idHTML ).datepicker( "option", "dateFormat", 'dd-mm-yy' );
		}
	});

	$( doc.datos.fecha_final.idHTML ).datepicker({
		defaultDate: "+1w",
		changeMonth: true,
		changeYear: true,
		numberOfMonths: 3,
		dateFormat: 'dd-mm-yy',
		// showAnim: 'clip',
		onClose: function( selectedDate ) {
			// $( doc.datos.fecha_inicial.idHTML ).datepicker( "option", "dateFormat", 'dd-mm-yy' );
		}
	});	
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxMantenimiento',
		solicitud: 'obtenerOrdenTrabajo',
		// Datos: { usuario: window.localStorage.usuario, tipo_usuario: 'SUPERVISOR' },
		respuesta: function ( data ) 
		{
			window.sesion.matrizOrdenTrabajo = data;
			docR.update_table( data );
			document.getElementById( 'badge_RM' ).innerHTML = data != null ? data.length : 0 ;
		}
	});

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUnidades',
		solicitud: 'obtenerUnidades',
		respuesta: function ( data ) 
		{
			window.sesion.matrizUnidades = data;
			$.sigesop.insertaCombo( data, doc.datos.numero_unidad.idHTML, 'numero_unidad' );
		}
	});

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxListaVerificacion',
		solicitud: 'obtenerTipoMantenimiento',
		respuesta: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			$.sigesop.insertaCombo( data, doc.datos.id_mantenimiento.idHTML, 'nombre_mantenimiento', 'id_mantenimiento' );
		}
	});	
}

function verDetalles ( elem, data )
{
	if ( data == null ) 
	{
		$.sigesop.msgBlockUI( 'Sin elementos registrados', 'error' ); 
		return null;
	}

	if( elem )
	{			
		$.sigesop.ventanaEmergente({
			idDiv: '__divVerDetallesOrdenT',
			titulo: 'Detalles de Orden de trabajo',
			idBody: '__bodyVDOT',
			idBtnCerrar: '__btnCerrarVDOT',
			idBtnOK: '__btnOKVDOT',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( '#__divVerDetallesOrdenT' ).modal( 'hide' );
			},
			showBsModal: function () 				
			{
				$.sigesop.insertarDatosRespuestaSistema({
					Datos: { idOrdenTrabajo: elem.id_orden_trabajo, con_todo: 'barrido_validacion' },
					clase: 'ajaxMantenimiento',
					solicitud: 'obtenerOrdenTrabajoLista',
					respuesta: function ( data )
					{
						window.sesion.matrizOrdenTrabajoLista = data;
						if ( data != null )
						{
							// ---------- creamos la estructura para la edicion de el usuario en la ventana

							docOT = $.sigesop.mantenimiento.documentoInsertarDatos({
										arr: data,
										submit: procesoValidacionLista, 
										suf: '_'
									});
							
							// ---------- ejecutamos el HTML y el Javascript del formulario

							document.getElementById( '__bodyVDOT' ).innerHTML = docOT.html;
							docOT.javascript();
						}
						else $( '#__bodyVDOT' ).html( '<h3 class=" text-center ">SIN LISTAS DE VERIFICACION POR VALIDAR...</h3>' );
					},
					errorRespuesta: function ()
					{

					}
				});
			}
		});
	} 
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function insertarUsuarios( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizOrdenTrabajo[ index ];

	if( elemento )
	{
		// docU = $.sigesop.mantenimiento.documentoAgregarUsuario();

		if ( elemento.orden_trabajo_personal.supervisor )
		{
			$.sigesop.msgBlockUI( 'Los usuarios ya han sido asignados previamente', 'error' );
			return null;
		}

		var 
			docU = $.sigesop.mantenimiento.documentoAgregarUsuario(),

			procesoUsuario = function ( doc, btn, callback )
			{
				// var boton = $( btn );

				// -------------- capturar los datos restantes del formulario
				
				// doc.datos.supervisor.valor = $( doc.datos.supervisor.idHTML ).val().trim();
				doc.datos.supervisor.valor = window.localStorage.usuario;
				doc.datos.responsable.valor = $( doc.datos.responsable.idHTML ).val().trim();

				doc.datos.id_orden_trabajo = {};
				doc.datos.id_orden_trabajo.valor = elemento.id_orden_trabajo;

				// -------------- capturar usuarios auxiliares

				doc.IDS.checkAuxiliar != null ?
					doc.datos.auxiliar = $.sigesop.getDataChecks( doc.IDS.checkAuxiliar ): null;

				// ------------------------------------- validar los datos almacenados
				
				var arr = [
					doc.datos.supervisor,
					doc.datos.responsable
				];
				
				if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'}) ) 
				{
					// ---------- buscamos que no se repitan los usuarios supervisor, responsable y auxiliar

					if ( usuario_unico( 
							doc.datos.supervisor, 
							doc.datos.responsable,
						 	doc.datos.auxiliar 
						) ) callback( doc, btn );
					else 
					{
						$.sigesop.msgBlockUI( 'Los usuarios supervisor, responsable y auxiliar deben ser diferentes', 
											  'error', 'msgBlock', '#__divInsertarUsuarios_modal' );
					}
				}

				else $.sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#__divInsertarUsuarios_modal' );
			},

			usuario_unico = function ( user_1, user_2, arr_user )
			{
				if ( user_1.valor == user_2.valor )
				{
					return false;
				}

				// ---------- verificamos los usuarios anteriores en usuarios auxiliares

				else
				{
					if ( arr_user.indexOf( user_1.valor ) != -1 )
					{
						return false;
					}

					else
					{
						if ( arr_user.indexOf( user_2.valor ) != -1 )
						{
							return false;
						}

						else return true;
					}
				}				
			},

			nuevoUsuario = function ( doc, btn )
			{
				// var boton = $( btn );
				// boton.button( 'loading' );
				$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#__divInsertarUsuarios_modal' );

				$.sigesop.insertarDatosSistema({
					Datos: doc.datos,
					clase: 'ajaxMantenimiento',
					solicitud: 'asignarUsuariosOrdenTrabajo',
					type: 'POST',
					OK: function () 
					{
						getData();
						$( '#__divInsertarUsuarios' ).modal( 'hide' );
						$.sigesop.msgBlockUI( 'Usuarios asignados satisfactoriamente', 'success' );			
					},

					NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#__divInsertarUsuarios_modal' ); /*boton.button('reset');*/ },
					DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#__divInsertarUsuarios_modal' ); /*boton.button( 'reset' );*/ },
					errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#__divInsertarUsuarios_modal' ); /*boton.button( 'reset' )*/ }
				}) ;
			},

			limpiarCamposUsuario = function ( doc )
			{

			},

			showBsModal = function () 				
			{
				document.getElementById( this.idBody ).innerHTML = '<br>' + docU.html;
				docU.javascript();

				$( docU.IDS.botonGuardar ).on( 'click', function ( event )
				{
					event.preventDefault();
					procesoUsuario( docU, docU.IDS.botonGuardar, nuevoUsuario );
				});

				$( docU.IDS.botonLimpiar ).on( 'click', function ( event )
				{
					event.preventDefault();
					limpiarCamposUsuario( docU );
				});

				$.sigesop.solicitarDatosSistema({
					clase: 'ajaxUsuarios',
					solicitud: 'obtenerUsuarios',
					respuesta: function ( data ) 
					{
						docU.update_user( data );
					}
				});
			},

			win = $.sigesop.ventanaEmergente({
				idDiv: '__divInsertarUsuarios',
				titulo: 'Insertar Usuarios',
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