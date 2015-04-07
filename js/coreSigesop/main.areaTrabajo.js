$( document ).on( 'ready', main );

function main ()
{
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

function nuevoElemento( datos, IDS, limpiarCampos )
{
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

function eliminarElemento ( index )
{
	var 
		elemento = window.sesion.matrizAreaTrabajo[ index ];

	if( elemento )
	{
		var 
		win = sigesop.ventanaEmergente({								
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function ( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );

				sigesop.query({
					data: { clave_areaTrabajo: elemento.clave_areaTrabajo },
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
			showBsModal: function () {
				document.getElementById( this.idBody ).innerHTML =
				'<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>';
			}
		});		
	} 
	else sigesop.msgBlockUI( 'Seleccione un elemento para continuar'	, 'error' ); 
}

function editarElemento ( index )
{
	var 
		elemento = window.sesion.matrizAreaTrabajo[ index ];

	if ( elemento )
	{
		var
		_doc = 	sigesop.areaTrabajo.document({
					obj: elemento, 
					suf: '_edicion',
					error: error,
					success: actualizarElemento
				});

		/* guardamos la llave primaria para la actualizacion de datos
		 */
		_doc.datos.claveAreaTrabajoUpdate.valor = elemento.clave_areaTrabajo;
		
		var 
		win = sigesop.ventanaEmergente({
			idDiv: 'divEdicionArea',
			titulo: 'Edicion de Area de Trabajo',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				document.getElementById( this.idBody ).innerHTML = _doc.html;
				_doc.javascript();
			}
		});
	}
	else sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function actualizarElemento( datos, IDS )
{
	datos.claveAreaTrabajo.valor = $( datos.claveAreaTrabajo.idHTML ).val().trim();
	datos.descripcionAreaTrabajo.valor = $( datos.descripcionAreaTrabajo.idHTML ).val().trim();

	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({										
		data: datos,
		class: 'usuarios',
		query: 'actualizarAreaTrabajo',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) 
		{
			$.unblockUI();
			$( '#divEdicionArea' ).modal( 'hide' );
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

function getData()
{
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