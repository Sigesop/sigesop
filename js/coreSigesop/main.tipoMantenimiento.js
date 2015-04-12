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

function procesoElemento ( doc, btn, callback ) {
	// ---------- capturar los datos restantes del formulario
	
	doc.datos.nombre_mantenimiento.valor = $( doc.datos.nombre_mantenimiento.idHTML ).val().trim();
	doc.datos.id_mantenimiento.valor = $( doc.datos.id_mantenimiento.idHTML ).val().trim();
	doc.datos.numero_frecuencia.valor = $( doc.datos.numero_frecuencia.idHTML ).val().trim();
	doc.datos.tipo_frecuencia.valor = $( doc.datos.tipo_frecuencia.idHTML ).val().trim();

	// ---------- validar los datos almacenados

	var arr = [
		doc.datos.nombre_mantenimiento,
		doc.datos.id_mantenimiento,
		doc.datos.numero_frecuencia,
		doc.datos.tipo_frecuencia
	];
	
	if ( sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) callback( doc, btn );
	else sigesop.msgBlockUI( 'Complete los campos', 'error' );
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


	var _doc = sigesop.tipoMantenimiento.document ({
		obj: elem, 
		suf: 'update',
		error: sigesop.completeCampos,
		success: actualizarElemento
	}),

	win = sigesop.ventanaEmergente({
		idDiv: 'win-edicion-tipo-mantenimiento',
		titulo: 'Edicion de tipo de mantenimiento',
		clickAceptar: function ( event ) {
			event.preventDefault();
			$( win.idDiv ).modal( 'hide' );
		},
		showBsModal: function () {
			document.getElementById( this.idBody ).innerHTML = _doc.html;
			_doc.javascript();
		}
	});
}

function actualizarElemento( datos, IDS, limpiarCampos ) {
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'listaVerificacion',
		query: 'actualizarTipoMantto',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos ) {
			$.unblockUI();
			$( '#win-edicion-tipo-mantenimiento' ).modal( 'hide' );
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

	var elem = window.sesion.matrizTipoMantto[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 
	win = sigesop.ventanaEmergente({
		idDiv: 'confifirmar-eliminacion',
		titulo: 'Autorización requerida',
		clickAceptar: function( event ) {
			event.preventDefault();
			sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
			$( win.idDiv ).modal( 'hide' );
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
		showBsModal: function () {
			document.getElementById( this.idBody ).innerHTML = 
			'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>';
		}
	});
}