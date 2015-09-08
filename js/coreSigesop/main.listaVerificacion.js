$( document ).on( 'ready', main );

function main () {
	/* documento de creacion de listas de verificacion
	 */
	doc = sigesop.listaVerificacion.document({
		success: nuevoElemento,
		error: error
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* documento de registro de listas de verificacion
	 */
	docR = sigesop.listaVerificacion.registro({
		table: {
			actions: {
				actividades: _verActividades,
				// actividades: verActividades,
				agregar: agregarActividades,
				editar: editarElemento,
				eliminar: eliminarElemento				
			}
		}
	});
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* Documento impresion reporte	
	 */
	docRF = sigesop.listaVerificacion.documentFiltro({
		success: imprimirLista,
		error: sigesop.completeCampos
	});
	document.getElementById( 'main3' ).innerHTML = '<br>' + docRF.html;
	docRF.javascript();

	// ----------------------------------------------------------

	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query ({
		class: 'listaVerificacion',
		query: 'obtenerTipoMantenimiento',
		success: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			
			sigesop.combo({
				arr: data, 
				elem: doc.datos.id_mantenimiento.idHTML,
				campo: 'nombre_mantenimiento',
				campoValor: 'id_mantenimiento'
			});
		}
	});

	sigesop.query ({
		class: 'listaVerificacion',
		query: 'obtener_lista_verificacion',
		success: function ( data ) {
			window.sesion.lista_verificacion = data;
			document.getElementById( 'badge_listaVerificacion' ).innerHTML = data !== null ?
				data.length : 0;

			docRF.update_table( data );
			docR.table.update_table( data );
		}
	});
}

function error() { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function nuevoElemento( datos, IDS, limpiarCampos ) {
	datos.id_mantenimiento.valor = IDS.$id_mantenimiento.val().trim();
	datos.lista_verificacion.valor = IDS.$lista_verificacion.val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'listaVerificacion',
		query: 'nueva_lista_verificacion',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) {
			$.unblockUI();
			limpiarCampos();
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
	}) ;
}

function editarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.lista_verificacion[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarElemento: elemento es indefinido');
	}

	var

	success = function ( datos, IDS, limpiarCampos ) {
		datos.id_mantenimiento.valor = IDS.$id_mantenimiento.val();
		datos.lista_verificacion.valor = IDS.$lista_verificacion.val().trim();

		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: datos,
			class: 'listaVerificacion',
			query: 'actualizar_lista_verificacion',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				win.close();
				$.unblockUI();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	_doc = sigesop.listaVerificacion.document({
		suf: 'edit',
		vista: 'editar_lista_verificacion',
		obj: elem,
		success: success,
		error: sigesop.completeCampos
	}),

	win = BootstrapDialog.show({
        title: 'Editar lista de verificación',
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
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.lista_verificacion[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarElemento: elemento es indefinido');
	}

	var 

	action = function ( dialog ) {		
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_lista_verificacion: elem.id_lista_verificacion },
			class: 'listaVerificacion',
			query: 'eliminar_lista_verificacion',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
		});	
	};

	BootstrapDialog.show({
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

function agregarActividades ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.lista_verificacion[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarElemento: elemento es indefinido');
	}

	var

	success = function ( datos, IDS, limpiarCampos ) {
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: {
				id_lista_verificacion: elem.id_lista_verificacion,
				actividad_verificar: datos.actividad_verificar
			},
			class: 'listaVerificacion',
			query: 'agregar_actividad_lista_verificacion',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				win.close();
				$.unblockUI();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	activity = sigesop.listaVerificacion.document({
		suf: 'nueva-actividad',
		vista: 'agregar_actividad',
		error: sigesop.completeCampos,
		success: success
	}),

	win = BootstrapDialog.show({
        title: 'Editar lista de verificación',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: activity.html,
        onshown: function ( dialog ) {
        	activity.javascript();
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

function editarActividadVerificar ( index, update_table ) {
	if ( index < 0 ) 
		throw new Error( 'function editarActividad: index fuera de rango' );

	var elem = window.sesion.actividades_into_lista[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarActividad: elem es indefinido');
	}

	var

	success = function ( datos, IDS ) {
		datos.actividad_verificar.valor = 
			$( datos.actividad_verificar.idHTML ).val().trim();

		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: datos,
			class: 'listaVerificacion',
			query: 'actualizar_actividad_verificar',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) 
			{
				update_table();
				$.unblockUI();
				win.close();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	actividadVerificar = sigesop.listaVerificacion.actividadVerificar({
		obj: elem,
		suf: 'win-editar',
		success: success
	}),

	win = BootstrapDialog.show({
	    title: 'Editar actividad',
	    type: BootstrapDialog.TYPE_DEFAULT,
	    message: actividadVerificar.html,
	    onshown: function ( dialog ) {
	    	actividadVerificar.javascript();
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

function editarParametroAceptacion ( index, update_table ) {
	if ( index < 0 ) 
		throw new Error( 'function editarParametroAceptacion: index fuera de rango' );

	var elem = window.sesion.actividades_into_lista[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarParametroAceptacion: elemento es indefinido');
	}

	var 

	success = function ( datos, IDS ) {		
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: {
				id_actividad_verificar_update: elem.id_actividad_verificar,
				parametro_actividad: datos.parametro_actividad,
				lectura_actual: datos.lectura_actual,
				lectura_posterior: datos.lectura_posterior
			},
			class: 'listaVerificacion',
			query: 'actualizar_parametro_actividad',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				update_table();
				$.unblockUI();
				win.close();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	_doc = sigesop.listaVerificacion.activity({
		suf: 'edicion',
		vista: 'editar_parametros',
		error: sigesop.completeCampos,
		success: success
	}),

	win = BootstrapDialog.show({
	    title: 'Editar parámetro',
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

function imprimirLista ( datos, IDS, limpiarCampos ) {
	/* capturar nombre de listas de verificacion
	 */
	datos.id_lista_verificacion.length = 0; // vaciar matriz
	var 
		i = 0,
		lon = IDS.mtz_auxiliar.length,
		url = sigesop.raizServidor + 'ajax.php?class=listaVerificacion' +
				'&action=imprimirLV&';

	for ( i ; i < lon ; i++ ) {
		if ( IDS.mtz_auxiliar[ i ].valor !== null ) {
			var win = window.open( url + 'id_lista_verificacion=' + IDS.mtz_auxiliar[ i ].valor );
			// url += $.param( { 'id_lista_verificacion[]': IDS.mtz_auxiliar[ i ].valor} ) + '&';;
		}
	}
				
	win.focus();
}

function verActividades ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function verActividades: index fuera de rango' );

	var elem = window.sesion.lista_verificacion[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function verActividades: elemento es indefinido');
	}

	var 

	activate_actividades = function ( id, value ) {
		var 

		actividades = sigesop.tablaRegistro({
			head: 	'ACTIVIDAD, PARAMETRO DE ACEPTACION, LECTURA ACTUAL,' +
					'LECTURA POSTERIOR',
			campo:  'actividad_verificar, parametro_aceptacion.texto, ' +
					'lectura_actual.texto, lectura_posterior.texto',
			suf: 	'tabla-actividades-'
		}),

		getLista = function () {
			sigesop.query({
				data: {
					id_equipo_aero: value,
					id_lista_verificacion: elem.id_lista_verificacion
				},
				class: 'listaVerificacion',
				query: 'actividades_into_equipo',
				success: function ( data ) {	
					if ( !$.isEmptyObject( data ) )	{
						window.sesion.actividades_into_lista = data;
						actividades.update_table( data );
					} 
					else 
						elem
						.innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES...</h3>';
				}
			});
		};

		document.getElementById( id )
		.innerHTML = actividades.html;

		$( actividades.IDS.body ).contextMenu({
			selector: 'tr',
			items: {
	            actividad: {
	            	name: 'Editar Actividad', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			editarActividadVerificar( index, getLista );
	        		}
	            },
	            parametro_aceptacion: {
	            	name: 'Editar Paramentro, lectura actual y posterior', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        		}
	            }
			}
		});

		getLista();
	},

	activate_equipos = function ( id, value ) {
		sigesop.query({
			data: {
				id_sistema_aero: value,
				id_lista_verificacion: elem.id_lista_verificacion
			},
			class: 'listaVerificacion',
			query: 'equipo_into_systems_mantto',
			success: function ( data ) {	
				if ( !$.isEmptyObject( data ) )	{
					var
					docEM = sigesop.listaVerificacion.documentAcordion({
						arr: data,
						suf: 'equipos',
						name: 'equipos',
						campo: 'nombre_equipo_aero',
						dataValue: 'id_equipo_aero',
						activate: activate_actividades
					});						

					document.getElementById( id ).innerHTML = docEM.html;
					docEM.javascript();
				}

				else document.getElementById( id ).innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES...</h3>';
			}
		});
	},

	docSM = sigesop.listaVerificacion.documentAcordion({
		// arr: data,
		suf: 'sistemas',
		name: 'sistemas',
		campo: 'nombre_sistema_aero',
		dataValue: 'id_sistema_aero',
		activate: activate_equipos
	}),

	onshown = function ( dialog ) {
		sigesop.query({
			data: {
				id_lista_verificacion: elem.id_lista_verificacion
			},
			class: 'listaVerificacion',
			query: 'systems_into_mantto',
			success: function ( data ) {
				if ( !$.isEmptyObject( data ) ) {
					docSM.update_accordion( data );
				}

				else $( win.idBody ).html( '<h3 class=" text-center ">SIN ACTIVIDADES...</h3>' );
			}
		});
	},

	win = BootstrapDialog.show({
	    title: 'Actividades',
	    type: BootstrapDialog.TYPE_DEFAULT,
	    message: docSM.html,
	    onshown: onshown,
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

function _verActividades( index ) {
	if ( index < 0 ) 
		throw new Error( 'function verActividades: index fuera de rango' );

	var elem = window.sesion.lista_verificacion[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function verActividades: elem es indefinido');
	}

	var

	actividades = sigesop.tablaRegistro({
		head: 	'ACTIVIDAD, PARAMETRO DE ACEPTACION, LECTURA ACTUAL,' +
				'LECTURA POSTERIOR',
		campo:  'actividad_verificar, parametro_aceptacion.texto, ' +
				'lectura_actual.texto, lectura_posterior.texto',
		suf: 	'tabla-actividades'
	}),

	getLista = function () {
		sigesop.query({
			data: {	id_lista_verificacion: elem.id_lista_verificacion },
			class: 'listaVerificacion',
			query: 'actividades_into_lista',
			success: function ( data ) { 
				window.sesion.actividades_into_lista = data;
				actividades.update_table( data ); 
			}
		});
	},

	onshown = function ( dialog ) {
		$( actividades.IDS.body ).contextMenu({
			selector: 'tr',
			items: {
	            actividad: {
	            	name: 'Editar Actividad', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			editarActividadVerificar( index, getLista );
	        		}
	            },
	            parametro_aceptacion: {
	            	name: 'Editar Parametro, lectura actual y posterior', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			editarParametroAceptacion( index, getLista );
	        		}
	            }
			}
		});

		getLista();
    },

	win = BootstrapDialog.show({
        title: 'Actividades',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: actividades.html,
        onshown: onshown,
        size: BootstrapDialog.SIZE_WIDE,
        closable: true,
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

