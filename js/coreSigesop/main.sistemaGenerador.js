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

	_doc = sigesop.sistemaGenerador.document({
		suf: 'edicion',
		obj: elem,
		error: sigesop.completeCampos,
		success: actualizarElemento
	}),

	win = sigesop.ventanaEmergente({
		idDiv: 'win-edicion-sistema-',
		titulo: 'Edición de sistema',
		clickAceptar: function( event ) {
			event.preventDefault();
			$( win.idDiv ).modal( 'hide' );
		},
		showBsModal: function () {
			document.getElementById( this.idBody )
			.innerHTML = _doc.html;
			_doc.javascript();
		}
	});
}

function actualizarElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'sistemasGenerador',
		query: 'actualizarSistema',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos ) {
			$.unblockUI();
			$( '#win-edicion-sistema-' ).modal( 'hide' );
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

	var elem = window.sesion.matrizSistemas[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}	
	
	var 

	clickAceptar = function( event ) {
		event.preventDefault();
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		$( win.idDiv ).modal( 'hide' );
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

	win = sigesop.ventanaEmergente({										
		idDiv: 'confirmar-solicitud',
		titulo: 'Autorización requerida',			
		clickAceptar: clickAceptar,
		showBsModal: function () {
			document.getElementById( this.idBody ).innerHTML =
			'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>';
		}
	});
}