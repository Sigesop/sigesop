$( document ).on('ready', main );

function main () {
	/* Documento principal
	 */ 
	doc = sigesop.usuarios.document({
		error: error,
		success: nuevoElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registros
	 */
	docR = sigesop.usuarios.documentoRegistro({
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
	/* Leemos los datos del formulario
	 */ 
    datos.nombreUsuario.valor = $( datos.nombreUsuario.idHTML ).val().trim();
	datos.apellidosUsuario.valor = $( datos.apellidosUsuario.idHTML ).val().trim();	
	datos.RPEusuario.valor = $( datos.RPEusuario.idHTML ).val().trim();
	datos.usuario.valor = $( datos.usuario.idHTML ).val().trim();
	datos.claveUsuario.valor = $( datos.claveUsuario.idHTML ).val().trim().SHA1();
	datos.areaTrabajo.valor = $( datos.areaTrabajo.idHTML ).val();
	datos.rolUsuario.valor = $( datos.rolUsuario.idHTML ).val();

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
		/* Leemos los datos del formulario
		 */ 
	    datos.nombreUsuario.valor = $( datos.nombreUsuario.idHTML ).val().trim();
		datos.apellidosUsuario.valor = $( datos.apellidosUsuario.idHTML ).val().trim();	
		datos.RPEusuario.valor = $( datos.RPEusuario.idHTML ).val().trim();
		datos.usuario.valor = $( datos.usuario.idHTML ).val().trim();
		datos.claveUsuario.valor = $( datos.claveUsuario.idHTML ).val().trim().SHA1();
		datos.areaTrabajo.valor = $( datos.areaTrabajo.idHTML ).val();
		datos.rolUsuario.valor = $( datos.rolUsuario.idHTML ).val();

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

	_doc = sigesop.usuarios.document({
		obj: elem, 
		suf: 'edicion',
		arr_areaTrabajo: window.sesion.matrizAreaTrabajo,
		arr_roles: window.sesion.matrizTipoRol,
		error: error,
		success: success
	});

	/* capturamos el ID de la actualizacion
	 */
	_doc.datos.RPEusuarioUpdate.valor = elem.RDE_trabajador;
	_doc.datos.usuarioUpdate.valor = elem.nombre_usuario;

	var 

    win = BootstrapDialog.show({
        title: 'Edicion de usuario',
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
			sigesop.combo({
				arr: data, 
				elem: doc.datos.areaTrabajo.idHTML, 
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
			sigesop.combo({
				arr: data, 
				elem: doc.datos.rolUsuario.idHTML, 
				campo: 'clave_rol, descripcion_areaTrabajo', 
				campoValor: 'clave_rol'
			});			
		}										
	});	
}