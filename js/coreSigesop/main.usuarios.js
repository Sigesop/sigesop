$( document ).on('ready', main );

function main () {
	/* Documento principal
	 */ 
	doc = $( '#main' ).newUserDocument({
		error: sigesop.completeCampos,
		success: nuevoElemento
	})
	.factory();

	/* Tabla de registros
	 */
	docR = $( '#main2' ).registeredUsersDocument({
		table: {
			actions: {
				editar: editarElemento,
				eliminar: eliminarElemento
			}
		}
	})
	.factory();
	
	/* Descarga de datos
	 */ 
	$( 'header' ).barraHerramientas();
	getData();
}

function nuevoElemento( datos, IDS, limpiarCampos ) {
	/* Enviamos al servidor
	 */ 
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'usuarios',
		query: 'nuevoUsuario',
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
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) 
		{
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
		},
		error: function () { 
			$.unblockUI(); 
			sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
		}
	});
}

function eliminarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizUsuario[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}
	
	var 

	action = function ( dialog ) {
		dialog.close();
		sigesop.query({
			data: { nombre_usuario: elem.nombre_usuario },
			class: 'usuarios',
			query: 'eliminarUsuario',
			queryType: 'sendData',
			OK: function ( msj, eventos )
			{
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) {	sigesop.msg( msj, sigesop.parseMsj( eventos ),'warning' ) },
			DEFAULT: function ( msj, eventos ) { sigesop.msg( msj, sigesop.parseMsj( eventos ),'error' ) },
			error: function () { sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ) }
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

function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.matrizUsuario[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}

	/* creamos la estructura para la edicion de el usuario en la ventana
	 */
	var

	success = function ( datos, IDS ) {
		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'usuarios',
			query: 'actualizarUsuario',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				getData();
				$.unblockUI();
				win.close();			
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
		});
	},

	_doc = $.fn.newUserDocument({
		error  : sigesop.completeCampos,
		success: success,
		action : 'update',
		obj    : elem
	})
	.factory();

	var

    win = BootstrapDialog.show({
        title: 'Edicion de usuario',
        type: BootstrapDialog.TYPE_DEFAULT,
        onshown: function ( dialog ) {
        	dialog.$modalBody.html( _doc.IDS.$form );
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
		query: 'obtenerUsuarios',
		success: function( data ) 
		{
			window.sesion.matrizUsuario = data;
			document.getElementById( 'badge_usuarios' ).innerHTML = data != null ?
				 data.length : '0';

			docR.table.update_table( data );
		}
	});

	sigesop.query({
		class: 'usuarios',
		query: 'obtenerAreaTrabajo',		
		success: function( data )
		{			
			window.sesion.matrizAreaTrabajo = data;
			doc.IDS.$areaTrabajo.combo({
				arr: data,
				campo: 'clave_areaTrabajo, descripcion_areaTrabajo', 
				campoValor: 'clave_areaTrabajo'
			});			
		}
	});	
		
	sigesop.query({
		class: 'usuarios',
		query: 'obtenerTipoRolUsuario',
		success: function( data )
		{
			window.sesion.matrizTipoRol = data;
			doc.IDS.$rolUsuario.combo({
				arr: data,
				campo: 'clave_rol, descripcion_areaTrabajo', 
				campoValor: 'clave_rol'
			});			
		}										
	});	
}