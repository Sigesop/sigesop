$( document ).on( 'ready', main );

function main ()  {
	doc = sigesop.unidadMedida.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Registro de datos	
	 */
	docR = sigesop.unidadMedida.registro({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	});
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/*Descargar datos del servidor*/
	$( 'header' ).barraHerramientas();
	getData();	
}

function getData() {
	sigesop.query({
		class: 'listaVerificacion',
		query: 'obtenerUnidadMedida',
		success: function ( data ) 
		{
			window.sesion.matrizUnidadMedida = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_unidadMedida' ).innerHTML =
				!$.isEmptyObject( data ) ? data.length : '0';					
		}
	});
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'listaVerificacion',
		query: 'nuevaUnidadMedida',
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

	var elem = window.sesion.matrizUnidadMedida[ index ];
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
			query: 'actualizarUnidadMedida',
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
	},

	_doc = sigesop.unidadMedida.document ({
		obj: elem, 
		suf: 'update',
		error: sigesop.completeCampos,
		success: success
	}),

    win = BootstrapDialog.show({
        title: 'Edicion de Unidad de Medida',
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

	var elem = window.sesion.matrizUnidadMedida[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function ( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { unidad_medida: elem.unidad_medida },
			class: 'listaVerificacion',
			query: 'eliminarUnidadMedida',
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
	// 	idDiv: 'win-confirmar-eliminacion',
	// 	titulo: 'Autorización requerida',
	// 	clickAceptar: function( event ) {
	// 		event.preventDefault();
	// 		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	// 		$( win.idDiv ).modal( 'hide' );
	// 		sigesop.query({
	// 			data: { unidad_medida: elem.unidad_medida },
	// 			class: 'listaVerificacion',
	// 			query: 'eliminarUnidadMedida',
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