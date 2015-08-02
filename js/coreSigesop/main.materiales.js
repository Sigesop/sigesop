$( document ).on( 'ready', main );

function main () {
	$( 'header' ).barraHerramientas();

	/* Documento principal
	 */ 
	doc = sigesop.materiales.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML =  '<br>' + doc.html;
	doc.javascript();

	/* Registro de datos
	 */ 
	docR = sigesop.materiales.registro({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	});
	document.getElementById( 'main2' ).innerHTML =  '<br>' + docR.html;
	docR.javascript();

	/* Descarga de datos
	 */
	getData();
}

function getData() {
	sigesop.query({
		class: 'materiales',
		query: 'obtener_tipo_materiales',
		queryType: 'sendGetData',
		success: function ( data ) {
			window.sesion.matrizTipoMateriales = data;
			doc.IDS.$tipo_material.combo({ arr: data });
		}
	});

	sigesop.query({
		class: 'materiales',
		query: 'obtener_materiales',
		queryType: 'sendGetData',
		success: function ( data ) {
			window.sesion.matrizMateriales = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_materiales' ).innerHTML = data != null ?
				data.length : '0';
		}
	});
}

function nuevoElemento ( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({		
		class: 'materiales',
		query: 'nuevoMaterial',
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

function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizMateriales[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}
	
	var 

	success = function ( datos, IDS, limpiarCampos ) {
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'materiales',
			query: 'actualizar_materiales',
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

	_doc = sigesop.materiales.document({
		suf: 'update',
		obj: elem,
		error: sigesop.completeCampos,
		success: success
	}),

    win = BootstrapDialog.show({
        title: 'Edicion de Materiales',
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

	var elem = window.sesion.matrizMateriales[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function () {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		win.close();
		sigesop.query({
			data: { codigo_material: elem.codigo_material },
			class: 'materiales',
			query: 'eliminar_material',
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