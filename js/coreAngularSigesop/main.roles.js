$( document ).on( 'ready', main );

function main () {
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

function getData () {
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

function nuevoElemento( datos, IDS, limpiarCampos ) {
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

function leerDatos ( datos, IDS ) {
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

function eliminarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizTipoRol[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var 

	action = function ( dialog ) {
		dialog.close();
		sigesop.query({
			data: { clave_rol: elem.clave_rol },
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

    win = BootstrapDialog.show({
        title: 'Autorización requerida',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>',        
        size: BootstrapDialog.SIZE_NORMAL,
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            action: function ( dialog ) {
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

	var elem = window.sesion.matrizTipoRol[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}

	var

	success = function( datos, IDS ) {
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
			OK: function ( msj, eventos ) {
				$( 'header' ).barraHerramientas();
				getData();
				$.unblockUI();
				win.close();
				// $( '#divEdicionRol' ).modal( 'hide' );			
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
	},

	_doc = sigesop.roles.document({
		obj: elem,
		arr_areaAcceso: window.sesion.matrizAreaAcceso, 
		arr_permisoAcceso: window.sesion.matrizPermisoAcceso, 
		suf: '_',
		error: error,
		success: success
	});

	/* guardamos la llave primaria para la actualizacion de datos
	 */

	_doc.datos.nombreRolUpdate.valor = elem.clave_rol;

	var

    win = BootstrapDialog.show({
        title: 'Edicion de Rol',
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