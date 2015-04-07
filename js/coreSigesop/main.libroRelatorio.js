$( document ).on( 'ready', main );

function main() {
	doc = sigesop.reporteNovedades.document({
		success: nuevoElemento,
		error: error
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* documento de reportes activos
	 */
	docR = sigesop.reporteNovedades.registroActivos({
		badge: 'badge_RR',
		table: {			
			actions: {
				nuevo_evento: agregarEvento,
				historial: historialEvento,
				cerrar_evento: cerrar_evento
			}
		}
	});
	document.getElementById( 'main_registro' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* documento de reportes finalizados
	 */
	docRF = sigesop.reporteNovedades.registroFinalizados({ 
		success: consultaReportes,
		error: function () {
			sigesop.msg( 'Info', 'Las fechas son inválidas', 'info' )
		}
	});
	document.getElementById( 'main_registro_terminados' ).innerHTML = '<br>' + docRF.html;
	docRF.javascript();

	/* documento de impresion de reportes
	 */
	docRR = sigesop.reporteNovedades.registroReporte({ 
		success: consultaReporteI,
		error: function () {
			sigesop.msg( 'Info', 'existe campo vacio', 'info' )
		}
	});
	document.getElementById( 'main_registro_reporte' ).innerHTML = '<br>' + docRR.html;
	docRR.javascript();

	/* descarga de datos
	 */	
	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query({
		data: { option: 'activos' },
		class: 'operacion',
		query: 'obtener_libro_relatorio',
		queryType: 'sendGetData',
		success: function ( data ) 
		{
			window.sesion.matrizLibroRelatorio = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_RR' ).innerHTML = data != null ?
				data.length : '0';
		}
	});

	sigesop.query({
		class: 'unidades',
		query: 'obtenerUnidades',
		success: function ( data ) 
		{
			window.sesion.matrizUnidades = data;
			sigesop.combo({
				arr: data,
				elem: doc.datos.numero_unidad.idHTML,
				campo: 'numero_unidad'
			});
			sigesop.combo({
				arr: data,
				elem: docRR.datos.numero_unidad.idHTML,
				campo: 'numero_unidad'
			});
		}
	});

	sigesop.query({
		class: 'operacion',
		query: 'obtener_libro_licencia',
		success: function ( data ) 
		{
			window.sesion.matrizLicencia = data;
			var 
				now = moment(),
				id_libro_licencia = doc.datos.id_libro_licencia.idHTML;

			sigesop.combo({
				arr: data,
				elem: id_libro_licencia,
				campo: 'anio_licencia',
				campoValor: 'id_libro_licencia'
			});

			// seteamos al año actual.
			var index = sigesop.indexOfObjeto( data, 'anio_licencia', now.year() );
			index != -1 ?
				$( id_libro_licencia ).val( data[ index ].id_libro_licencia ) : null;
		}
	});

	sigesop.query({
		class: 'generadores',
		query: 'obtenerEstadoLicencia',
		success: function ( data ) 
		{
			window.sesion.matrizEstadoLicencia = data;
			sigesop.combo({
				arr: data,
				elem: doc.datos.condicion_operativa.idHTML
			});
		}
	});
}

function error () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function nuevoElemento( datos, IDS, limpiarCampos ) {
	datos.reporte_por.valor = $( datos.reporte_por.idHTML ).val();
	datos.numero_unidad.valor = $( datos.numero_unidad.idHTML ).val();
    datos.numero_aero.valor = $( datos.numero_aero.idHTML ).val();    
    datos.id_libro_licencia.valor = $( datos.id_libro_licencia.idHTML ).val();
    datos.hora_inicio_evento.valor = $( datos.hora_inicio_evento.idHTML ).val().trim();
    datos.fecha_inicio_evento.valor = $( datos.fecha_inicio_evento.idHTML ).val().trim();
    datos.fecha_termino_estimado.valor = $( datos.fecha_termino_estimado.idHTML ).val().trim();
    datos.condicion_operativa.valor = $( datos.condicion_operativa.idHTML ).val();
    datos.trabajador_solicito.valor = $( datos.trabajador_solicito.idHTML ).val().trim();
    datos.trabajador_autorizo.valor = localStorage.rpe;
    datos.descripcion_evento.valor = $( datos.descripcion_evento.idHTML ).val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({		
		class: 'operacion',
		query: 'nuevo_relatorio',
		queryType: 'sendData',
		data: datos,
		type: 'POST',
		OK: function( msj, eventos )
		{
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
			limpiarCampos();
			getData();
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' );	},
		error: function () { $.unblockUI(); sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
	});
}

function agregarEvento( index ) {
	var elemento = window.sesion.matrizLibroRelatorio[ index ];
	if ( elemento )
	{
		var			
			__nuevoEvento = function ( datos, IDS )
			{				
				datos.id_libro_relatorio.valor = elemento.id_libro_relatorio;
			    datos.fecha_evento.valor = $( datos.fecha_evento.idHTML ).val().trim();
			    datos.hora.valor = $( datos.hora.idHTML ).val().trim();
			    datos.descripcion_evento.valor = $( datos.descripcion_evento.idHTML ).val().trim();

				sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );	
				sigesop.query({
					data: datos,
					class: 'operacion',
					query: 'nuevo_evento_relatorio',
					queryType: 'sendData',
					type: 'POST',
					OK: function( msj, eventos )
					{
						$.unblockUI();
						$( win.idDiv ).modal( 'hide' );	
						sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
					},
					NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' ); },
					DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); },
					error: function () { $.unblockUI(); sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
				});
			},

			showBsModal = function () 
			{
				document.getElementById( this.idBody  ).innerHTML = docN.html;
				docN.javascript();
			},

			docN = sigesop.reporteNovedades.agregarEvento({				
				success: __nuevoEvento,
				error: error
			}),

			win = sigesop.ventanaEmergente({
				idDiv: 'nuevo_evento',
				titulo: 'Agregar evento',
				keyboard: true,
				clickAceptar: function( event ) 
				{
					event.preventDefault();
					$( win.idDiv ).modal( 'hide' );				
				},
				showBsModal: showBsModal
			});
	}
}

function historialEvento( index ) {
	elemento = window.sesion.matrizLibroRelatorio[ index ];
	if ( elemento )
	{
		var
			docH = sigesop.tablaRegistro({
				suf: '_historial',
				color_fila: 'warning',
				head: 	'FECHA, HORA, DESCRIPCION',
				campo: 	'fecha_evento, hora, descripcion_evento'
			}),			

			showBsModal = function () 
			{
				document.getElementById( this.idBody  ).innerHTML = docH.html;
				sigesop.query({
					data: { id_libro_relatorio: elemento.id_libro_relatorio },
					class: 'operacion',
					query: 'obtener_historial_eventos',
					queryType: 'sendGetData',
					success: function ( data ) 
					{
						data.length > 0 ?
							docH.update_table( data ) :
							sigesop.msg( 'Info', 'Sin registros...' );
					}
				});
			},

			win = sigesop.ventanaEmergente({
				idDiv: 'historial_eventos',
				titulo: 'Historial de eventos',
				clickAceptar: function( event ) 
				{
					event.preventDefault();
					$( win.idDiv ).modal( 'hide' );				
				},
				showBsModal: showBsModal
			});
	}
}

function consultaReportes ( datos ) {
	$( docRF.table.body ).empty();
	var
	fecha_inf = $( datos.fecha_inf.idHTML ).val(),
	fecha_sup = $( datos.fecha_sup.idHTML ).val();

	sigesop.query({
		data: { 
			option: 'rango_fechas',
			fecha_inf: fecha_inf,
			fecha_sup: fecha_sup,
			estado_evento: false
		},
		class: 'operacion',
		query: 'obtener_libro_relatorio',
		queryType: 'sendGetData',
		success: function ( data ) 
		{ 
			data.length > 0 ?
				docRF.table.update_table( data ):
				sigesop.msg( 'Advertencia', 'Sin registros...', 'warning' );
		}
	});
}

function cerrar_evento ( index ) {
	var elem = window.sesion.matrizLibroRelatorio[ index ];
	if ( elem )
	{
		var

		showBsModal = function () {
			document.getElementById( this.idBody )
			.innerHTML = 
				'<div class="alert alert-danger text-center">' +
					'<h4>¿Está seguro de cerrar el evento?</h4>' +
				'</div>';
		},

		clickAceptar = function( event ) {
			event.preventDefault();
			sigesop.query({
				data: { 
					id_libro_relatorio: elem.id_libro_relatorio,
					numero_aero: elem.numero_aero
				},
				class: 'operacion',
				query: 'cerrar_evento',
				queryType: 'sendData',
				OK: function ( msj, eventos ) {
					getData();
					sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
					
				},
				NA: function ( msj, eventos ) {
					sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' );
				},
				DEFAULT: function ( msj, eventos ) {
					sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' );
				}
			});

			$( win.idDiv ).modal( 'hide' );		
		},

		win = sigesop.ventanaEmergente({
			idDiv: 'cerrar-evento',
			titulo: 'Cerrar evento',
			clickAceptar: clickAceptar,
			showBsModal: showBsModal
		});
	}
}

function consultaReporteI ( datos ) {
	$( docRR.table.body ).empty();
	var
	numero_unidad = $( datos.numero_unidad.idHTML ).val(),
	fecha_inf = $( datos.fecha_inf.idHTML ).val(),
	fecha_sup = $( datos.fecha_sup.idHTML ).val();

	sigesop.query({
		data: { 
			option: 'rango_fechas',
			estado_evento: 'all',			
			fecha_inf: fecha_inf,
			fecha_sup: fecha_sup,
			option2: 'numero_unidad',
			numero_unidad: numero_unidad
		},
		class: 'operacion',
		query: 'obtener_libro_relatorio',
		queryType: 'sendGetData',
		success: function ( data ) 
		{ 
			data.length > 0 ?
				docRR.table.update_table( data ):
				sigesop.msg( 'Advertencia', 'No hay registros...', 'warning' );
		}
	});
}