$( document ).on( 'ready', main );

function main() {
	doc = sigesop.reporteNovedades.document({
		success: nuevoElemento,
		error: sigesop.completeCampos
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* documento de reportes activos
	 */
	docR = sigesop.reporteNovedades.registro({
		badge: 'badge_RR',
		table: {			
			actions: {
				nuevo_evento: agregarEvento,
				historial: historialEvento,
				// cerrar_evento: cerrar_evento,
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	});
	document.getElementById( 'main_registro' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* documento de reportes finalizados
	 */
	docRF = sigesop.reporteNovedades.registroFinalizados({ 
		error: function () {
			sigesop.msg( 'Info', 'Las fechas son inválidas', 'info' )
		},
		badge: 'badge_RT',
		table: {
			actions: {
				historial: historialEventosFinalizados
			}
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

	/* documento de impresion de reportes por periodos	
	 */ 
	docRP = sigesop.reporteNovedades.registroReportePeriodo({
		suf: '-reporte-periodos',
		success: consultaReporteII,
		error: function () {
			sigesop.msg( 'Info', 'Completar informacion', 'info' );
		}
	});
	document.getElementById( 'main_registro_periodo' ).innerHTML = '<br>' + docRP.html;
	docRP.javascript();

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
		class: 'operacion',
		query: 'obtener_tipo_reporte',
		success: function ( data ) {
			window.sesion.matrizTipoReporte = data;
			doc.IDS.$reporte_por.combo({
				arr: data
			});
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
			if( index != -1 ) {
				var val = data[ index ].id_libro_licencia;
				$( id_libro_licencia ).val( val )
			}
		}
	});

	sigesop.query({
		class: 'generadores',
		query: 'obtenerEstadoLicencia',
		success: function ( data ) {
			window.sesion.matrizEstadoLicencia = data;
			sigesop.combo({
				arr: data,
				elem: doc.datos.condicion_operativa.idHTML
			});
		}
	});
}

function nuevoElemento ( datos, IDS, limpiarCampos ) {
	// datos.reporte_por.valor = $( datos.reporte_por.idHTML ).val();
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
    // datos.consecutivo_licencia.valor = IDS.$consecutivo_licencia.val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({		
		class: 'operacion',
		query: 'nuevo_relatorio',
		queryType: 'sendData',
		data: datos,
		type: 'POST',
		OK: function( msj, eventos ) {
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
	if ( index < 0 ) 
		throw new Error( 'function materiales: index fuera de rango' );

	var elem = window.sesion.matrizLibroRelatorio[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function materiales: elem es indefinido');
	}

	var

	__nuevoEvento = function ( datos, IDS, limpiarCampos ) {
		datos.id_libro_relatorio = { valor: elem.id_libro_relatorio };
		datos.numero_aero.valor = elem.numero_aero;

		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );	
		sigesop.query({
			data: datos,
			class: 'operacion',
			query: 'nuevo_evento_relatorio',
			queryType: 'sendData',
			type: 'POST',
			OK: function( msj, eventos ) {
				$.unblockUI();
				getData();
				win.close();
				sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); },
			error: function () { $.unblockUI(); sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
		});
	},

	docN = sigesop.reporteNovedades.documentEvento({
		success: __nuevoEvento,
		error: sigesop.completeCampos,
		condicion_operativa: elem.condicion_operativa
	}),

    win = BootstrapDialog.show({
        title: 'Agregar evento',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: docN.html,
        onshown: function ( dialog ) {
        	docN.javascript();
        },
        size: BootstrapDialog.SIZE_WIDE,
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            cssClass: 'btn-danger',
            action: function( dialog ) {
                dialog.close();
            }
        }]
    });
}

function historialEvento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function materiales: index fuera de rango' );

	var elem = window.sesion.matrizLibroRelatorio[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function materiales: elem es indefinido');
	}

	var

	_getData = function () {
		sigesop.query({
			data: { id_libro_relatorio: elem.id_libro_relatorio },
			class: 'operacion',
			query: 'obtener_historial_eventos',
			queryType: 'sendGetData',
			success: function ( data ) {
				window.sesion.matrizHistorialEventos = data;
				_doc.table.update_table( data )
				if ( data.length == 0 )
					sigesop.msg( 'Info', 'Sin registros...' );
			}
		});
	},

	eliminarEventoAdicional = function ( index ) {
		if ( index < 0 ) 
			throw new Error( 'function eliminarEventoAdicional: index fuera de rango' );

		var elem = window.sesion.matrizHistorialEventos[ index ];
		if( !elem ) {
			sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
			throw new Error('function eliminarEventoAdicional: elem es indefinido');
		}

		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: { id_libro_relatorio_historial: elem.id_libro_relatorio_historial },
			class: 'operacion',
			query: 'eliminar_libro_relatorio_historial',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				_getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
		});	
	},

	editarEventoAdicional = function ( index ) {
		if ( index < 0 ) 
			throw new Error( 'function editarEventoAdicional: index fuera de rango' );

		var elem = window.sesion.matrizHistorialEventos[ index ];
		if( !elem ) {
			sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
			throw new Error('function editarEventoAdicional: elem es indefinido');
		}

		var 

		success = function ( datos, IDS, limpiarCampos ) {
			// añadir llave primaria
			datos.id_libro_relatorio_historial = 
			{ valor: elem.id_libro_relatorio_historial };

			sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );	
			sigesop.query({
				data: datos,
				class: 'operacion',
				query: 'actualizar_evento_relatorio',
				queryType: 'sendData',
				type: 'POST',
				OK: function( msj, eventos ) {
					$.unblockUI();
					_getData();
					win.close();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
				},
				NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' ); },
				DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); },
				error: function () { $.unblockUI(); sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
			});
		},

		_doc = sigesop.reporteNovedades.documentEvento({
			suf: 'edicion',
			vista: 'actualizar_evento_relatorio',
			condicion_operativa: elem.condicion_operativa,
			obj: elem,
			error: sigesop.completeCampos,
			success: success
		}),

	    win = BootstrapDialog.show({
	        title: 'Edicion de Historial',
	        type: BootstrapDialog.TYPE_DEFAULT,
	        message: _doc.html,
	        onshown: function ( dialog ) {
	        	_doc.javascript();
	        },
	        size: BootstrapDialog.SIZE_WIDE,
	        closable: false,
	        draggable: true,
	        buttons: [{
	            label: 'Cancelar',
	            cssClass: 'btn-danger',
	            action: function( dialog ) {
	                dialog.close();
	            }
	        }]
	    });
	},

	_doc = sigesop.reporteNovedades.registroHistorial({
		table: {
			actions: {
				editar: editarEventoAdicional,
				eliminar: eliminarEventoAdicional
			}
		}
	}),

    win = BootstrapDialog.show({
        title: 'Historial de eventos',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: _doc.html,
        onshown: function ( dialog ) {
        	_doc.javascript();
			_getData();
        },
        size: BootstrapDialog.SIZE_WIDE,
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            cssClass: 'btn-danger',
            action: function( dialog ) {
                dialog.close();
            }
        }]
    });
}

function historialEventosFinalizados( index ) {
	if ( index < 0 ) 
		throw new Error( 'function historialEventosFinalizados: index fuera de rango' );

	var elem = window.sesion.matrizLibroRelatorioFinalizados[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function historialEventosFinalizados: elem es indefinido');
	}

	var

	docH = sigesop.tablaRegistro({
		suf: '_historial',
		color_fila: 'warning',
		head: 	'FECHA INICIO, HORA INICIO, ' +
				'FECHA TERMINO ESTIMADO, HORA TERMINO ESTIMADO, ' +
				'FECHA TERMINO, HORA TERMINO, ' +
				'CONDICION OPERATIVA, DESCRIPCION',
		campo: 	'fecha_inicio_evento, hora_inicio_evento, ' +
				'fecha_termino_estimado_evento, hora_termino_estimado_evento, ' +
				'fecha_termino_evento, hora_termino_evento, ' +
				'condicion_operativa, descripcion_evento',
		addClass: {
			body: {
				class: 'warning, danger, info, success, success',
				campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
				valor: 'C.A., FALLA, MTTO, F.A., DISPONIBLE'
			}
		}
	}),			

	showBsModal = function () {
		document.getElementById( this.idBody  ).innerHTML = docH.html;
		sigesop.query({
			data: { id_libro_relatorio: elem.id_libro_relatorio },
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

// function cerrar_evento ( index ) {
// 	if ( index < 0 ) 
// 		throw new Error( 'function cerrar_evento: index fuera de rango' );

// 	var elem = window.sesion.matrizLibroRelatorio [ index ];
// 	if( !elem ) {
// 		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
// 		throw new Error('function cerrar_evento: elem es indefinido');
// 	}

// 	var

// 	showBsModal = function () {
// 		document.getElementById( this.idBody )
// 		.innerHTML = 
// 			'<div class="alert alert-danger text-center">' +
// 				'<h4>¿Está seguro de cerrar el evento?</h4>' +
// 			'</div>';
// 	},

// 	clickAceptar = function( event ) {
// 		event.preventDefault();
// 		sigesop.query({
// 			data: { 
// 				condicion_operativa: elem.condicion_operativa,
// 				id_libro_relatorio: elem.id_libro_relatorio,
// 				numero_aero: elem.numero_aero
// 			},
// 			class: 'operacion',
// 			query: 'cerrar_evento',
// 			queryType: 'sendData',
// 			OK: function ( msj, eventos ) {
// 				getData();
// 				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
				
// 			},
// 			NA: function ( msj, eventos ) {
// 				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' );
// 			},
// 			DEFAULT: function ( msj, eventos ) {
// 				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' );
// 			}
// 		});

// 		$( win.idDiv ).modal( 'hide' );		
// 	},

// 	win = sigesop.ventanaEmergente({
// 		idDiv: 'cerrar-evento',
// 		titulo: 'Cerrar evento',
// 		clickAceptar: clickAceptar,
// 		showBsModal: showBsModal
// 	});
// }

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

//------------------------------------------------------------------------------------------------------------------------
// 2015-09-08 Julioe
//------------------------------------------------------------------------------------------------------------------------
function consultaReporteII ( datos ) {
	$( docRP.table.body ).empty();
	var
	condicion_operativa = $( datos.condicion_operativa.idHTML ).val(),
	fecha_inf = $( datos.fecha_inf.idHTML ).val(),
	fecha_sup = $( datos.fecha_sup.idHTML ).val();

	sigesop.query({
		data: { 
			option: 'rango_fechas',
			estado_evento: 'all',			
			fecha_inf: fecha_inf,
			fecha_sup: fecha_sup,
			option2: 'condicion_operativa',
			condicion_operativa: condicion_operativa
		},
		class: 'operacion',
		query: 'obtener_libro_relatorio',
		queryType: 'sendGetData',
		success: function ( data ) { 
			data.length > 0 ?
				docRP.table.update_table( data ):
				sigesop.msg( 'Advertencia', 'No hay registros...', 'warning' );
		}
	});
}
//------------------------------------------------------------------------------------------------------------------------
// 2015-09-08 Julioe
//------------------------------------------------------------------------------------------------------------------------

function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizLibroRelatorio [ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}
	
	var 

	actualizarElemento = function ( datos, IDS, limpiarCampos ) {
	    datos.id_libro_licencia.valor = $( datos.id_libro_licencia.idHTML ).val();
	    datos.hora_inicio_evento.valor = $( datos.hora_inicio_evento.idHTML ).val().trim();
	    datos.fecha_inicio_evento.valor = $( datos.fecha_inicio_evento.idHTML ).val().trim();
	    datos.fecha_termino_estimado.valor = $( datos.fecha_termino_estimado.idHTML ).val().trim();
	    datos.condicion_operativa.valor = $( datos.condicion_operativa.idHTML ).val();
	    datos.trabajador_solicito.valor = $( datos.trabajador_solicito.idHTML ).val().trim();
	    datos.trabajador_autorizo.valor = localStorage.rpe;
	    datos.descripcion_evento.valor = $( datos.descripcion_evento.idHTML ).val().trim();

		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'operacion',
			query: 'actualizar_relatorio',
			queryType: 'sendData',
			type: 'POST',
			OK: function( msj, eventos ) {
				win.close();
				$.unblockUI();				
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	_doc = sigesop.reporteNovedades.document({
		suf: 'update',
		obj: elem,
		error: sigesop.completeCampos,
		success: actualizarElemento
	}),

	win = BootstrapDialog.show({
	    title: 'Edicion de evento',
	    type: BootstrapDialog.TYPE_DEFAULT,
	    message: _doc.html,
	    onshown: function ( dialog ) {
	    	_doc.javascript();
	    },
	    size: BootstrapDialog.SIZE_WIDE,
	    closable: false,
	    draggable: true,
	    buttons: [{
	        label: 'Cancelar',
	        cssClass: 'btn-danger',
	        action: function( dialog ) {
	            dialog.close();
	        }
	    }]
	});
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizLibroRelatorio[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_libro_relatorio: elem.id_libro_relatorio },
			class: 'operacion',
			query: 'eliminar_libro_relatorio',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
		});					
	},

	win = BootstrapDialog.show({
        title: 'Autorización requerida',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>',        
        size: BootstrapDialog.SIZE_NORMAL,
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            action: function( dialog ) {
                dialog.close();
            }
        },{
            label: 'Aceptar',
            cssClass: 'btn-danger',
            action: action
        }]
    });
}
