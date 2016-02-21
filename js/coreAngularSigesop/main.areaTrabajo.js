$( document ).on( 'ready', main );

function main () {
	/* Documento principal
	 */ 
	doc = sigesop.areaTrabajo.document({
		error: error,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registros
	 */
	docR = sigesop.areaTrabajo.documentRegistro({
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

function error () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function nuevoElemento( datos, IDS, limpiarCampos ) {
	datos.claveAreaTrabajo.valor = $( doc.datos.claveAreaTrabajo.idHTML ).val().trim();
	datos.descripcionAreaTrabajo.valor = $( doc.datos.descripcionAreaTrabajo.idHTML ).val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: doc.datos,
		class: 'usuarios',
		query: 'nuevaAreaTrabajo',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) 
		{
			$.unblockUI();
			limpiarCampos();
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) 
		{
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, doc.IDS.$form ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) 
		{
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, doc.IDS.$form ),'error' );
		},
		error: function () { 
			$.unblockUI(); 
			sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
		}
	}) ;
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizAreaTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function () {
		win.close();
		sigesop.query({
			data: { clave_areaTrabajo: elem.clave_areaTrabajo },
			class: 'usuarios',
			query: 'eliminarAreaTrabajo',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) {
				sigesop.msg( msj, sigesop.parseMsj( eventos, doc.IDS.$form ),'warning' );
			},
			DEFAULT: function ( msj, eventos ) {
				sigesop.msg( msj, sigesop.parseMsj( eventos, doc.IDS.$form ),'error' );
			},
			error: function () { 
				sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
			}
		});	
	},

    win = BootstrapDialog.show({
        title: 'Autorización requerida',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>',        
        size: BootstrapDialog.SIZE_NORMAL,
        draggable: true,
        closable: false,
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

function editarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizAreaTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}

	var

	success = function ( datos, IDS ) {
		datos.claveAreaTrabajo.valor = $( datos.claveAreaTrabajo.idHTML ).val().trim();
		datos.descripcionAreaTrabajo.valor = $( datos.descripcionAreaTrabajo.idHTML ).val().trim();

		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({										
			data: datos,
			class: 'usuarios',
			query: 'actualizarAreaTrabajo',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				win.close();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) {
				$.unblockUI();
				sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
			},
			DEFAULT: function ( msj, eventos ) {
				$.unblockUI();
				sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
			},
			error: function () { 
				$.unblockUI(); 
				sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
			}
		}) ;
	},

	_doc = 	sigesop.areaTrabajo.document({
				obj: elem, 
				suf: '_edicion',
				error: error,
				success: success
			});

	/* guardamos la llave primaria para la actualizacion de datos
	 */
	_doc.datos.claveAreaTrabajoUpdate.valor = elem.clave_areaTrabajo;
	
	var 

    win = BootstrapDialog.show({
        title: 'Edicion de Area de Trabajo',
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

function getData() {
	sigesop.query({
		class: 'usuarios',
		query: 'obtenerAreaTrabajo',		
		success: function( data )
		{
			window.sesion.matrizAreaTrabajo = data;
			document.getElementById( 'badge_areaTrabajo' ).innerHTML = data != null ?
				data.length : '0';
			docR.table.update_table( data );
		}
	});
}