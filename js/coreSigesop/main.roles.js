$( document ).on( 'ready', main );

function main ()
{
	/* Documento principal
	 */ 
	doc = sigesop.roles.document({
		success: nuevoElemento,
		error: error
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registros
	 */
	docR = sigesop.roles.documentoRegistro({
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

// ---------- funcion que servira tanto para un nuevo elemento como para actualizar un elemento

function getData ()
{
	sigesop.query({
		class: 'usuarios',
		query: 'obtenerAreasAcceso',
		success: function ( data ) 
		{
			window.sesion.matrizAreaAcceso = data;		
			doc.update_areaAcceso( data );
		}
	});

	sigesop.query({
		class: 'usuarios',
		query: 'obtenerPermisoAcceso',
		success: function ( data ) 
		{
			window.sesion.matrizPermisoAcceso = data;
			doc.update_permisoAcceso( data );
		}
	});	

	sigesop.query({
		class: 'usuarios',
		query: 'obtenerTipoRolUsuario',
		success: function( data )
		{
			window.sesion.matrizTipoRol = data;
			
			document.getElementById( 'badge_roles' ).innerHTML = data != null ?
				data.length : '0';

			docR.table.update_table( data )
		}										
	});
}

function error () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function nuevoElemento( datos, IDS, limpiarCampos )
{
	/* capturamos todos los datos del formulario
	 */
	leerDatos ( datos, IDS );

	/* Enviamos a servidor
	 */ 
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({										
		data: datos,
		class: 'usuarios',
		query: 'nuevoRolUsuario',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) 
		{
			$.unblockUI();
			$( 'header' ).barraHerramientas();
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
	}) ;
}

function leerDatos ( datos, IDS )
{
	/* capturamos los accesos seleccionados
	 */
	datos.matrizAreaAcceso.length = 0; // vaciamos el arreglo para evitar repetidos
	var 
		i = 0,
		lon = IDS.mtz_areaAcceso.length,
		matriz = IDS.mtz_areaAcceso;
	
	for( i ; i < lon; i++ )
		if ( $( matriz[ i ].idHTML ).prop( 'checked' ) ) 
		datos.matrizAreaAcceso.push( $( matriz[ i ].idHTML ).val() );	


	/* capturamos los permisos seleccionados
	 */ 
	datos.matrizPermisoAcceso.length = 0; // vaciamos el arreglo para evitar repetidos	
	var 
		i = 0,
		lon = IDS.mtz_permisoAcceso.length,
		matriz = IDS.mtz_permisoAcceso;
	
	for( i ; i < lon; i++ )
		if ( $( matriz[ i ].idHTML ).prop( 'checked' ) ) 
		datos.matrizPermisoAcceso.push( $( matriz[ i ].idHTML ).val() );

	/* capturamos cajas de texto
	 */ 
	datos.nombreRol.valor = $( datos.nombreRol.idHTML ).val().trim();
	datos.descripcionRol.valor = $( datos.descripcionRol.idHTML ).val().trim();	
}

function eliminarElemento( index )
{
	var 
		elemento = window.sesion.matrizTipoRol[ index ];

	if( elemento )
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
					data: { clave_rol: elemento.clave_rol },
					class: 'usuarios',
					query: 'eliminarRolUsuario',
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
				document.getElementById( this.idBody ).innerHTML =
				'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>';
			}
		});		
	}
	 
	else 
		sigesop.msg( 'info', 'Seleccione un elemento para continuar', 'info' );
}

function editarElemento( index )
{
	var elemento = window.sesion.matrizTipoRol[ index ];

	if( elemento )
	{	
		var
		_doc = sigesop.roles.document({
			obj: elemento,
			arr_areaAcceso: window.sesion.matrizAreaAcceso, 
			arr_permisoAcceso: window.sesion.matrizPermisoAcceso, 
			suf: '_',
			error: error,
			success: actualizarElemento
		});

		/* guardamos la llave primaria para la actualizacion de datos
		 */

		_doc.datos.nombreRolUpdate.valor = elemento.clave_rol;

		var

		showBsModal = function() 
		{
			document.getElementById( this.idBody ).innerHTML = _doc.html;
			_doc.javascript();
		},

		win = sigesop.ventanaEmergente({
			idDiv: 'divEdicionRol',
			titulo: 'Edicion de Rol',
			keyboard: true,
			clickAceptar: function ( event ){ event.preventDefault(); $( win.idBody ).modal( 'hide' ); },
			showBsModal: showBsModal
		});
	} 
	else 
		sigesop.msg( 'info', 'Seleccione un elemento para continuar', 'info' );
}

function actualizarElemento( datos, IDS )
{
	/* capturamos todos los datos del formulario
	 */
	leerDatos ( datos, IDS );

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'usuarios',
		query: 'actualizarRolUsuario',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) 
		{
			$( 'header' ).barraHerramientas();
			getData();
			$.unblockUI();
			$( '#divEdicionRol' ).modal( 'hide' );			
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},

		NA: function ( msj, eventos ) { 
			$.unblockUI(); 
			sigesop.msg( msj, sigesop.parseMsj( eventos ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) { 
			$.unblockUI(); 
			sigesop.msg( msj, sigesop.parseMsj( eventos ),'error' );
		},
		error: function () { 
			$.unblockUI(); 
			sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
		}
	}) ;
}