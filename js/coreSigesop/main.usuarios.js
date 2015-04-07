$( document ).on('ready', main );

function main ()
{
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

function nuevoElemento( datos, IDS, limpiarCampos )
{
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

function eliminarElemento( index )
{
	var elemento = window.sesion.matrizUsuario[ index ];

	if ( elemento )
	{
		var 
		win = sigesop.ventanaEmergente({
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );

				sigesop.query({
					data: { nombre_usuario: elemento.nombre_usuario },
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
			showBsModal: function () 
			{
				document.getElementById ( this.idBody ).innerHTML =
				'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>';
			}
		});
	}
}

function editarElemento( index )
{
	var elemento = window.sesion.matrizUsuario[ index ];

	if ( elemento )
	{
		/* creamos la estructura para la edicion de el usuario en la ventana
		 */
		var
		docU = sigesop.usuarios.document({
			obj: elemento, 
			suf: '_edicion',
			arr_areaTrabajo: window.sesion.matrizAreaTrabajo,
			arr_roles: window.sesion.matrizTipoRol,
			error: error,
			success: actualizarElemento
		});

		/* capturamos el ID de la actualizacion
		 */
		docU.datos.RPEusuarioUpdate.valor = elemento.RDE_trabajador;
		docU.datos.usuarioUpdate.valor = elemento.nombre_usuario;

		var 
		win = sigesop.ventanaEmergente({
			idDiv: 'divEdicionUsuario',
			titulo: 'Edicion de usuario',
			keyboard: true,
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				/* ejecutamos el HTML y el Javascript del formulario de edicion
				 */
				document.getElementById( this.idBody ).innerHTML = '<br>' + docU.html;
				docU.javascript();
			}
		});
	}
}

function actualizarElemento( datos, IDS )
{
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
		OK: function ( msj, eventos ) 
		{
			getData();
			$.unblockUI();
			$( '#divEdicionUsuario' ).modal( 'hide' );			
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
}

function getData()
{
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