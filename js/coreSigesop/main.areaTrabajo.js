$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.areaTrabajo.documentoAreaTrabajo( null, '' );
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -------------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		head: 'CLAVE DE ÁREA DE TRABAJO, DESCRIPCIÓN',
		campo: 'clave_areaTrabajo, descripcion_areaTrabajo'
	});
	document.getElementById( 'areasRegistradas' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items:{
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

	// -------------------------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );
		
	getData();

	// -------------------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on('click', function(event) {
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function(event)
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function procesoElemento ( doc, btn, callback )
{
	doc.datos.claveAreaTrabajo.valor = $( doc.datos.claveAreaTrabajo.idHTML ).val().trim();
	doc.datos.descripcionAreaTrabajo.valor = $( doc.datos.descripcionAreaTrabajo.idHTML ).val().trim();

	var arregloComprobacion = [
		doc.datos.claveAreaTrabajo,
		doc.datos.descripcionAreaTrabajo
	];

	var flagValidacion = true;
	flagValidacion = $.sigesop.validacion( arregloComprobacion, { tipoValidacion: 'error' } );

	if (flagValidacion) callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button('loading');
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'nuevaAreaTrabajo',
		type: 'POST',
		OK: function () 
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
		DEFAULT: function ( data ) 
		{
			$.sigesop.msgBlockUI( data, 'error' );
			boton.button('reset');
		},
		errorRespuesta: function() { boton.button( 'reset' ) }
	}) ;
}

function limpiarCampos( doc )
{
	doc.datos = $.sigesop.vaciarCampos ( doc.datos );
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizAreaTrabajo[ index ];

	if( elemento )
	{
		var win = $.sigesop.ventanaEmergente({								
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function(event) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );

				$.sigesop.insertarDatosSistema({
					Datos: { clave_areaTrabajo: elemento.clave_areaTrabajo },
					clase: 'ajaxUsuarios',
					solicitud: 'eliminarAreaTrabajo',
					OK: function ()
					{
						getData();
						$.sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );
					},
					NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ); },
					DEFAULT: function ( data ) { $.sigesop.msgBlockUI( data, 'error' ); }
				});					
			},
			showBsModal: function () {
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>' );
			}
		});		
	} 
	else $.sigesop.msgBlockUI( 'Seleccione un elemento para continuar'	, 'error' ); 
}

function editarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizAreaTrabajo[ index ];

	if ( elemento )
	{
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		_doc = $.sigesop.areaTrabajo.documentoAreaTrabajo( elemento, '_edicion' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.claveAreaTrabajoUpdate.valor = elemento.clave_areaTrabajo;

		// ---------- insertamos los datos del equipo seleccionado en la ventana emergente de edicion
		
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'divEdicionArea',
			titulo: 'Edicion de Area de Trabajo',
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

				// ---------- creamos el evento del boton GUARDAR 

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
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#divEdicionArea_modal' );

	$.sigesop.insertarDatosSistema({										
		Datos: doc.datos,
		clase: 'ajaxUsuarios',
		solicitud: 'actualizarAreaTrabajo',
		type: 'POST',
		OK: function () 
		{
			$( '#divEdicionArea' ).modal( 'hide' );
			getData();
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );
		},

		NA: function () 
		{
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicionArea_modal' );
			boton.button('reset');
		},

		DEFAULT: function (data) 
		{
			$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicionArea_modal' );
			boton.button( 'reset' );
		},
		errorRespuesta: function()
		{ 
			boton.button( 'reset' ); 
			$.sigesop.msgBlockUI( 'error de comunicación al servidor', 'error', 'msgBlock', '#divEdicionArea_modal' );
		}
	}) ;
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxUsuarios',
		solicitud: 'obtenerAreaTrabajo',		
		respuesta: function( data )
		{
			window.sesion.matrizAreaTrabajo = data;
			data != null ?
				document.getElementById( 'badge_areaTrabajo' ).innerHTML = data.length:
				document.getElementById( 'badge_areaTrabajo' ).innerHTML = '0';
			docR.update_table( data );
		}
	});
}