$( document ).on( 'ready', main );

function main () {
	/* Documento principal
	 */
	doc = sigesop.generadores.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registro
	 */
	docR = $( '#main-2' ).registeredGeneratorDocument({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	})
	.factory();

	/* documento de impresion de reportes
	 */
	docRR = $( '#main-3' ).generatorReport({
		success: consultaReporteI,
		error: sigesop.completeCampos
	})
	.factory();
	
	/* Descarga de datos
	 */
	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query({
		class: 'unidades',
		query: 'obtenerUnidades',
		success: function(data) {
			window.sesion.matrizUnidades = data;
			sigesop.combo({
				arr: data, 
				elem: doc.datos.numero_unidad.idHTML, 
				campo: 'numero_unidad'
			});

			data.push({
				numero_unidad: 'TODAS'
			});

			docRR.IDS.$numero_unidad.combo({
				arr: data,
				campo: 'numero_unidad'
			});
		}
	});

	sigesop.query({
		class: 'generadores',
		query: 'obtenerGeneradores',
		success: function( data )
		{
			window.sesion.matrizGeneradores = data;
			docR.table.update_table( data );

			document.getElementById( 'badge_generadores' ).innerHTML = 
				!$.isEmptyObject( data ) ? data.length : '0';
		}
	});	
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'generadores',
		query: 'nuevoGenerador',
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

	var elem = window.sesion.matrizGeneradores[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}
	
	var

	success = function ( datos, IDS, limpiarCampos ) {
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'generadores',
			query: 'actualizarGenerador',
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

	_doc = sigesop.generadores.document({
		suf: 'update',
		obj: elem,
		error: sigesop.completeCampos,
		success: success
	}),

    win = BootstrapDialog.show({
        title: 'Edicion de Aerogenerador',
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

	var elem = window.sesion.matrizGeneradores[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function ( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { numero_aero: elem.numero_aero },
			class: 'generadores',
			query: 'eliminarGenerador',
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

function consultaReporteI ( datos ) {
	sigesop.query({
		data: { 		
			option: 'unidad',
			numero_unidad: datos.numero_unidad.valor,
		},
		class: 'generadores',
		query: 'obtenerGeneradores',
		queryType: 'sendGetData',
		success: function ( data ) 
		{ 
			data.length > 0 ?
				docRR.table.update_table( data ):
				sigesop.msg( 'Advertencia', 'No hay registros...', 'warning' );
		}
	});
}