$( document ).on( 'ready', main );

function main () 
{
	doc = $.sigesop.unidadMedida.documentoCatalogoUnidadMedida();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -----------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		head: 'UNIDAD DE MEDIDA, DESCRIPCIÓN',
		campo: 'unidad_medida, descripcion_unidad_medida'
	});

	document.getElementById( 'unidadesRegistradas' ).innerHTML = '<br>' + docR.html;
	
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

	// -----------------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );
	
	getData();	

	// -----------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on( 'click', function ( event )
	{
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});

	$( docR.IDS.botonEditar ).on('click', function(event) {
		event.preventDefault();
		editarElemento();
	});

	$( docR.IDS.botonEliminar ).on('click', function(event) 
	{
		event.preventDefault();	
		eliminarElemento( docR );
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxListaVerificacion',
		solicitud: 'obtenerUnidadMedida',
		respuesta: function ( data ) 
		{
			window.sesion.matrizUnidadMedida = data;

			docR.update_table( data );
			
			data != null ?
				document.getElementById( 'badge_unidadMedida' ).innerHTML = data.length:
				document.getElementById( 'badge_unidadMedida' ).innerHTML = '0';
		}
	});
}

function procesoElemento( doc, btn, callback )
{
	doc.datos.unidad_medida.valor = $( doc.datos.unidad_medida.idHTML ).val().trim();
	doc.datos.descripcion_unidad_medida.valor = $( doc.datos.descripcion_unidad_medida.idHTML ).val().trim();

	var arr = [
		doc.datos.unidad_medida,
		doc.datos.descripcion_unidad_medida
	];

	if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxListaVerificacion',
		solicitud: 'nuevaUnidadMedida',
		type: 'POST',
		OK: function()
		{
			limpiarCampos( doc );
			getData();
			$.sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
			boton.button('reset');
		},
		NA: function () 
		{
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );
			boton.button('reset');
		},

		DEFAULT: function (data) 
		{
			$.sigesop.msgBlockUI( data, 'error' );
			boton.button( 'reset' );
		},
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ); boton.button( 'reset' ) }
	});
}

function limpiarCampos( doc )
{
	doc.datos.unidad_medida.valor = null;
	doc.datos.descripcion_unidad_medida.valor = null;

	$( doc.datos.unidad_medida.idHTML ).val('');
	$( doc.datos.descripcion_unidad_medida.idHTML ).val('');
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizUnidadMedida[ index ];

	if( elemento )
	{
		var win = $.sigesop.ventanaEmergente({										
			idDiv: 'confirmar_eliminacion',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
				$.sigesop.insertarDatosSistema({
					Datos: { unidad_medida: elemento.unidad_medida },
					clase: 'ajaxListaVerificacion',
					solicitud: 'eliminarUnidadMedida',
					OK: function ()
					{
						getData();
						$.sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );
					},
					NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
					DEFAULT: function ( data ) { $.sigesop.msgBlockUI( data, 'error' ) },
					errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ) }
				});					
			},
			showBsModal: function () 
			{
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>' );
			}
		});		
	}
	 
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar'	, 'error' );
}

function editarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizUnidadMedida[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = $.sigesop.unidadMedida.documentoCatalogoUnidadMedida ( elemento, '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.unidad_medida_update.valor = elemento.unidad_medida;

		// ---------- 
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicion_unidadMedida',
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
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function actualizarElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_unidadMedida_modal' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxListaVerificacion',
		solicitud: 'actualizarUnidadMedida',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_unidadMedida' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_unidadMedida_modal' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_unidadMedida_modal' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error', 'msgBlock', '#divEdicion_unidadMedida_modal' ); boton.button( 'reset' ) }
	}) ;
}