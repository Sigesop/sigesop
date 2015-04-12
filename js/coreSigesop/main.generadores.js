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
	docR = sigesop.generadores.registro({
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
		class: 'unidades',
		query: 'obtenerUnidades',
		success: function(data) 
		{
			window.sesion.matrizUnidades = data;
			sigesop.combo({
				arr: data, 
				elem: doc.datos.numero_unidad.idHTML, 
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

	_doc = sigesop.generadores.document({
		suf: 'update',
		obj: elem,
		error: sigesop.completeCampos,
		success: actualizarElemento
	}),

	win = sigesop.ventanaEmergente({
		idDiv: 'win-edicion-generador',
		titulo: 'Edicion de Aerogenerador',
		clickAceptar: function ( event ) {
			event.preventDefault();
			$( win.idDiv ).modal( 'hide' );
		},
		showBsModal: function ()  {
			document.getElementById( this.idBody ).innerHTML = _doc.html;
			_doc.javascript();
		}
	});
}

function actualizarElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'generadores',
		query: 'actualizarGenerador',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos ) {
			$.unblockUI();
			$( '#win-edicion-generador' ).modal( 'hide' );
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
	}) ;
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizGeneradores[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var win = sigesop.ventanaEmergente({
		idDiv: 'confirmar-eliminacion',
		titulo: 'Autorización requerida',
		clickAceptar: function( event ) {
			event.preventDefault();
			sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
			$( win.idDiv ).modal( 'hide' );
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
		showBsModal: function () {
			document.getElementById( this.idBody ).innerHTML = 
			'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>';
		}
	});
}