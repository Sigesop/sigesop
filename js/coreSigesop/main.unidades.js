$( document ).on( 'ready', main );

function main () {
	doc = sigesop.unidades.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	docR = sigesop.unidades.registro({
		suf: 'tabla',
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
		success: function ( data ) {
			if ( !$.isEmptyObject( data ) ) 
			{
				window.sesion.matrizUnidades = data;
				
				docR.table.update_table( data );	
				document.getElementById( 'badge_unidad' ).innerHTML = data != null ?
					data.length : '0';		
			}
		}
	});	
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	datos.numero_unidad.valor = $( datos.numero_unidad.idHTML ).val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'unidades',
		query: 'nuevaUnidad',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos )
		{
			$.unblockUI();
			limpiarCampos();
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
		},
		NA: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
		}
	});
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elemento = window.sesion.matrizUnidades[ index ];
	if( !elemento ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function eliminarElemento: elemento es indefinido');
	}

	var 

	clickAceptar = function( event ) {
		event.preventDefault();
		$( win.idDiv ).modal( 'hide' );
		sigesop.query({
			data: { numero_unidad: elemento.numero_unidad },
			class: 'unidades',
			query: 'eliminarUnidad',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) {
				sigesop.msg( msj, sigesop.parseMsj( eventos ),'warning' );
			},
			DEFAULT: function ( msj, eventos ) {
				sigesop.msg( msj, sigesop.parseMsj( eventos ),'error' );
			}
		});					
	},

	win = sigesop.ventanaEmergente({
		idDiv: 'confirmar_eliminacion',
		titulo: 'Autorización requerida',
		clickAceptar: clickAceptar,
		showBsModal: function () {
			document.getElementById( this.idBody ).innerHTML = 
			'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>'
		}
	});	
}

function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elemento = window.sesion.matrizUnidades[ index ];
	if( !elemento ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarElemento: elemento es indefinido');
	}

	/* creamos la estructura para la edicion de el usuario en la ventana	
	 */
	var _doc = sigesop.unidades.document ({
		obj: elemento,  
		suf: '-update',
		success: actualizarElemento,
		error: sigesop.completeCampos
	});

	/* guardamos la llave primaria para la actualizacion de datos	
	 */
	_doc.datos.numero_unidad_update.valor = elemento.numero_unidad;

	/* insertamos los datos del equipo seleccionado en la ventana emergente de edicion	
	 */
	var 

	win = sigesop.ventanaEmergente({
		idDiv: 'div-edicion-unidades',
		titulo: 'Edicion de Unidad',
		clickAceptar: function ( event ) {
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
	datos.numero_unidad.valor = $( datos.numero_unidad.idHTML ).val();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'unidades',
		query: 'actualizarUnidad',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) {
			getData();
			$.unblockUI();
			$( '#div-edicion-unidades' ).modal( 'hide' );
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'success' );
		},
		NA: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
		}
	}) ;
}