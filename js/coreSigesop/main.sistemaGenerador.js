$( document ).on( 'ready', main );

function main () {
	doc = sigesop.sistemaGenerador.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Registro de datos
	 */
	docR = sigesop.sistemaGenerador.registro({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	});	
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* documento de impresion de reportes
	 */
	docRR = sigesop.sistemaGenerador.registroReporte({ 
		success: consultaReporteI,
		error: function () {
			sigesop.msg( 'Info', 'existe campo vacio', 'info' )
		}
	});
	document.getElementById( 'main3' ).innerHTML = '<br>' + docRR.html;
	docRR.javascript();

	/* Descarga de datos
	 */
	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query({
		class: 'sistemasGenerador',
		query: 'obtenerSistemas',
		success: function( data ) {
			window.sesion.matrizSistemas = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_sistemas' ).innerHTML = 
				!$.isEmptyObject( data ) ? data.length : '0';

			data.push({
				nombre_sistema_aero: 'TODOS LOS SISTEMAS' 
			});
			
			sigesop.combo({
				arr: data,
				elem: docRR.datos.sistema.idHTML,
				campo: 'nombre_sistema_aero'
			});
		}
	});	
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'sistemasGenerador',
		query: 'nuevoSistema',
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
	});
}

function editarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizSistemas[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}	

	var 

	success = function ( datos, IDS, limpiarCampos ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'sistemasGenerador',
			query: 'actualizarSistema',
			queryType: 'sendData',
			type: 'POST',
			OK: function( msj, eventos ) {
				$.unblockUI();
				win.close();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		});
	},

	_doc = sigesop.sistemaGenerador.document({
		suf: 'edicion',
		obj: elem,
		error: sigesop.completeCampos,
		success: success
	}),

    win = BootstrapDialog.show({
        title: 'Edición de sistema',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: _doc.html,
        onshown: function ( dialog ) {
			_doc.javascript();
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

	// win = sigesop.ventanaEmergente({
	// 	idDiv: 'win-edicion-sistema-',
	// 	titulo: 'Edición de sistema',
	// 	clickAceptar: function( event ) {
	// 		event.preventDefault();
	// 		$( win.idDiv ).modal( 'hide' );
	// 	},
	// 	showBsModal: function () {
	// 		document.getElementById( this.idBody )
	// 		.innerHTML = _doc.html;
	// 		_doc.javascript();
	// 	}
	// });
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizSistemas[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}	
	
	var 

	action = function( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_sistema_aero: elem.id_sistema_aero },
			class: 'sistemasGenerador',
			query: 'eliminarSistema',
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

	// win = sigesop.ventanaEmergente({										
	// 	idDiv: 'confirmar-solicitud',
	// 	titulo: 'Autorización requerida',			
	// 	clickAceptar: clickAceptar,
	// 	showBsModal: function () {
	// 		document.getElementById( this.idBody ).innerHTML =
	// 		'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>';
	// 	}
	// });
}

function consultaReporteI ( datos ) {
	$( docRR.table.body ).empty();
	var
	sistema = $( datos.sistema.idHTML ).val();

	sigesop.query({
		data: { 		
			option: 'nombre_sistema',
			sistema: sistema,
		},
		class: 'sistemasGenerador',
		query: 'obtenerSistemas',
		queryType: 'sendGetData',
		success: function ( data ) 
		{ 
			data.length > 0 ?
				docRR.table.update_table( data ):
				sigesop.msg( 'Advertencia', 'No hay registros...', 'warning' );
		}
	});
}