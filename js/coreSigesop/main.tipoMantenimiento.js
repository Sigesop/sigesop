$( document ).on( 'ready', main );

function main () 
{
	doc = sigesop.tipoMantenimiento.documentoTipoMantenimiento();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// --------------------------------------------------------------------------

	docR = sigesop.tablaRegistro({
		head: 'ID, NOMBRE MANTENIMIENTO, FRECUENCIA, TIPO FRECUENCIA',
		campo: 'id_mantenimiento, nombre_mantenimiento, numero_frecuencia, tipo_frecuencia'
	});

	document.getElementById( 'tipoMantenimientoRegistrados' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            editar: 
            {
            	name: 'Editar', 
            	icon: 'edit',
        		callback: editarElemento
            },
            eliminar: 
            {
            	name: 'Eliminar', 
            	icon: 'delete',
        		callback: eliminarElemento
            }
		}
	});

	// --------------------------------------------------------------------------

	$( 'header' ).barraHerramientas();
	getData();

	// -------------------------------------- REGISTRO DE TIPOS DE MANTENIMIENTO

	$( doc.IDS.botonGuardar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		limpiarCampos();
	});
}

function getData()
{
	sigesop.query({
		class: 'listaVerificacion',
		query: 'obtenerTipoMantenimiento',
		success: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			docR.update_table( data );
			document.getElementById( 'badge_tipoMantto' ).innerHTML =
				!$.isEmptyObject( data ) ? data.length : '0';
		}
	});
}

function procesoElemento ( doc, btn, callback )
{
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

function nuevoElemento( doc, btn )
{
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: doc.datos,
		class: 'listaVerificacion',
		query: 'nuevoTipoMantenimiento',
		queryType: 'sendData',
		type: 'POST',
		OK: function()
		{
			limpiarCampos( doc );
			getData();
			sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
		},
		NA: function () 
		{
			sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );
		},

		DEFAULT: function (data) 
		{
			sigesop.msgBlockUI( data, 'error' );
		}
	});
}

function limpiarCampos( doc )
{
	doc.datos.nombre_mantenimiento.valor = null;
	doc.datos.id_mantenimiento.valor = null;
	doc.datos.numero_frecuencia.valor = null;
	doc.datos.tipo_frecuencia.valor = null;

	$( doc.datos.nombre_mantenimiento.idHTML ).val( '' );
	$( doc.datos.id_mantenimiento.idHTML ).val( '' );
	$( doc.datos.numero_frecuencia.idHTML ).val( '' );
	$( doc.datos.tipo_frecuencia.idHTML ).val( '' );
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizTipoMantto[ index ];

	if( elemento )
	{
		var win = sigesop.ventanaEmergente({										
			idDiv: 'confirmar_eliminacion',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
				sigesop.query({
					data: { id_mantenimiento: elemento.id_mantenimiento },
					class: 'listaVerificacion',
					query: 'eliminarTipoMantto',
					queryType: 'sendData',
					OK: function ()
					{
						getData();
						sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );
					},
					NA: function () { sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
					DEFAULT: function ( data ) { sigesop.msgBlockUI( data, 'error' ) }				
				});					
			},
			showBsModal: function () 
			{
				document.getElementById( this.idBody )
				.innerHTML = '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>';
			}
		});		
	}
	 
	else sigesop.msgBlockUI( 'Seleccione un elemento para continuar'	, 'error' );
}

function editarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizTipoMantto[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = sigesop.tipoMantenimiento.documentoTipoMantenimiento ( elemento, '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.id_mantenimiento_update.valor = elemento.id_mantenimiento;

		// ---------- 
		
		var win = sigesop.ventanaEmergente({
			idDiv: 'divEdicion_tipoMantto',
			titulo: 'Edicion de equipo',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				// ---------- ejecutamos el HTML y el Javascript del formulario

				document.getElementById( this.idBody ).innerHTML = _doc.html;
				_doc.javascript();

				// ----------

				$( _doc.IDS.botonGuardar ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					procesoElemento( _doc, _doc.IDS.botonGuardar, actualizarElemento );
				});

				$( _doc.IDS.botonLimpiar ).on( 'click', function ( event )
				{
					event.preventDefault();
					limpiarCampos( _doc );
				});
			}
		});
	} 
	else sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function actualizarElemento( doc, btn )
{
	sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_tipoMantto_modal' );
	sigesop.query({
		data: doc.datos,
		class: 'listaVerificacion',
		query: 'actualizarTipoMantto',
		queryType: 'sendData',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_tipoMantto' ).modal( 'hide' );
			sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );	
		},

		NA: function () { sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_tipoMantto_modal' ); },
		DEFAULT: function (data) { sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_tipoMantto_modal' ); }
	}) ;
}