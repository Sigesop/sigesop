$( document ).on( 'ready', main );

function main () {
	/* Documento principal
	 */
	doc = sigesop.tipoMantenimiento.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registro
	 */
	docR = sigesop.tipoMantenimiento.registro({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	});

	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* Descarga de datos
	 */
	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query({
		class: 'listaVerificacion',
		query: 'obtenerTipoMantenimiento',
		success: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_tipoMantto' ).innerHTML =
				!$.isEmptyObject( data ) ? data.length : '0';
		}
	});
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'listaVerificacion',
		query: 'nuevoTipoMantenimiento',
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

function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizTipoMantto[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}


	var 

	success = function ( datos, IDS, limpiarCampos ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'listaVerificacion',
			query: 'actualizarTipoMantto',
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
		}) ;
	}

	_doc = sigesop.tipoMantenimiento.document ({
		obj: elem, 
		suf: 'update',
		error: sigesop.completeCampos,
		success: success
	}),

    win = BootstrapDialog.show({
        title: 'Edicion de tipo de mantenimiento',
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
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizTipoMantto[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function ( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_mantenimiento: elem.id_mantenimiento },
			class: 'listaVerificacion',
			query: 'eliminarTipoMantto',
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
	// 	idDiv: 'confifirmar-eliminacion',
	// 	titulo: 'Autorización requerida',
	// 	clickAceptar: function( event ) {
	// 		event.preventDefault();
	// 		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	// 		$( win.idDiv ).modal( 'hide' );
	// 		sigesop.query({
	// 			data: { id_mantenimiento: elem.id_mantenimiento },
	// 			class: 'listaVerificacion',
	// 			query: 'eliminarTipoMantto',
	// 			queryType: 'sendData',
	// 			OK: function ( msj, eventos ) {
	// 				$.unblockUI();
	// 				getData();
	// 				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
	// 			},
	// 			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
	// 			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
	// 		});					
	// 	},
	// 	showBsModal: function () {
	// 		document.getElementById( this.idBody ).innerHTML = 
	// 		'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>';
	// 	}
	// });
}