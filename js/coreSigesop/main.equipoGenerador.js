$( document ).on( 'ready', main );

function main () {
	/* Documento principal
	 */
	doc = sigesop.equipoGenerador.document({
		error: sigesop.completeCampos,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registro	
	 */
	docR = sigesop.equipoGenerador.registro({
		table: {
			actions: {
				eliminar: eliminarElemento,
				editar: editarElemento
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
		class: 'equiposGenerador',
		query: 'obtenerEquipoGenerador',
		success: function( data )
		{
			window.sesion.matrizEquipos = data;				
			document.getElementById( 'badge_equipoGenerador' ).innerHTML =
				!$.isEmptyObject( data ) ? data.length : '0';
			docR.table.update_table( data );
		}
	})
}

function nuevoElemento ( datos, IDS, limpiarCampos ) {
	datos.nombre_equipo_aero.valor = $( datos.nombre_equipo_aero.idHTML ).val().trim();
	datos.id_equipo_aero.valor = $( datos.id_equipo_aero.idHTML ).val().trim();
	datos.id_sistema_aero.valor = $( datos.id_sistema_aero.idHTML ).val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'equiposGenerador',
		query: 'nuevoEquipoGenerador',
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

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizEquipos[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	clickAceptar = function ( event ) {
		event.preventDefault();
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		$( win.idDiv ).modal( 'hide' );
		sigesop.query({
			data: { id_equipo_aero: elem.id_equipo_aero },
			class: 'equiposGenerador',
			query: 'eliminarEquipoGenerador',
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
		idDiv: 'confirmar-eliminacion-',
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

	var elem = window.sesion.matrizEquipos[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}

	/* creamos documento para la edicion de el usuario en la ventana	
	 */
	var 
		_doc = sigesop.equipoGenerador.document ({
			obj: elem,  
			suf: '_update',
			error: sigesop.completeCampos,
			success: actualizarElemento
		});

	/* guardamos la llave primaria para la actualizacion de datos	
	 */

	_doc.datos.id_equipo_aero_update.valor = elem.id_equipo_aero;

	/* insertamos los datos del equipo seleccionado en la
	 * ventana emergente de edicion	
	 */
	var 

	win = sigesop.ventanaEmergente({
		idDiv: 'win-edicion-equipos-aero-',
		titulo: 'Edicion de equipo',
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
	datos.nombre_equipo_aero.valor = $( datos.nombre_equipo_aero.idHTML ).val().trim();
	datos.id_equipo_aero.valor = $( datos.id_equipo_aero.idHTML ).val().trim();
	datos.id_sistema_aero.valor = $( datos.id_sistema_aero.idHTML ).val().trim();

	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'equiposGenerador',
		query: 'actualizarEquipoGenerador',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) {
			$.unblockUI();
			$( '#win-edicion-equipos-aero-' ).modal( 'hide' );
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
	}) ;
}