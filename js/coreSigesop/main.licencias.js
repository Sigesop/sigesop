$( document ).on( 'ready', main );

function main() {
	/* Documento principal
	 */
	doc = sigesop.licencias.document({
		success: nuevoElemento,
		error: sigesop.completeCampos
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registro
	 */
	docR = sigesop.licencias.registro({
		table: {
			actions: {
				eliminar: eliminarElemento,
				consecutivo: agregarConsecutivo
			}
		}
	});
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* descarga de datos
	 */	
	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query({
		class: 'operacion',
		query: 'obtener_libro_licencia',
		success: function ( data ) 
		{
			window.sesion.matrizLicencia = data;

			docR.table.update_table( data );
			document.getElementById( 'badge_AR' ).innerHTML = data != null ?
				data.length : '0';
		}
	});
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'operacion',
		query: 'nuevo_libro_licencia',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos ) {
			$.unblockUI();
			limpiarCampos();
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );		
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
	});
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizLicencia[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function ( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_libro_licencia: elem.id_libro_licencia },
			class: 'operacion',
			query: 'eliminar_libro_licencia',
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

function agregarConsecutivo ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function agregarConsecutivo: index fuera de rango' );

	var elem = window.sesion.matrizLicencia[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function agregarConsecutivo: elem es indefinido');
	}

	var 
	
	success = function ( datos, IDS ) {
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: datos,
			class: 'operacion',
			query: 'agregar_consecutivo_inicializador',
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
		});
	},

	_doc = sigesop.licencias.documentConsecutivo({
		id_libro_licencia: elem.id_libro_licencia,
		anio: elem.anio_licencia,
		success: success,
		error: sigesop.completeCampos
	}),

    win = BootstrapDialog.show({
        title: 'Agregar consecutivo Inicializador',
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
	// 	idDiv: 'win-consecutivo',
	// 	titulo: 'Agregar consecutivo Inicializador',
	// 	clickAceptar: function ( event ) {
	// 		event.preventDefault();
	// 		$( win.idDiv ).modal( 'hide' );
	// 	},
	// 	showBsModal: function ()  {
	// 		document.getElementById( this.idBody ).innerHTML = _doc.html;
	// 		_doc.javascript();
	// 	}
	// });
}