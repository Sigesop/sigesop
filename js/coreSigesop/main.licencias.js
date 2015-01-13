$( document ).on( 'ready', main );

function main()
{
	doc = $.sigesop.licencias.document();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// ----------

	docR = $.sigesop.tablaRegistro({
			head: 'AÑOS REGISTRADOS',
			campo: 'anio_licencia'
		});

	document.getElementById( 'anioRegistro' ).innerHTML = docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            eliminar: 
            {
            	name: 'Eliminar', 
            	icon: 'delete',
        		callback: eliminarElemento
            }
		}
	});

	// ----------

	$.sigesop.barraHerramientas( 'header' );
	getData();

	// ----------

	$( doc.IDS.botonGuardar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		procesoElemento( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxOperacion',
		solicitud: 'obtener_libro_licencia',
		respuesta: function ( data ) 
		{
			window.sesion.matrizLicencia = data;

			docR.update_table( data );
			document.getElementById( 'badge_AR' ).innerHTML = data != null ?
				data.length : '0';
		}
	});
}

function procesoElemento ( doc, btn, callback )
{
	// ----------------- capturamos los datos del HTML

    doc.datos.anio_licencia.valor = $( doc.datos.anio_licencia.idHTML ).val().trim();

	// ----------------- comprobamos banderas y ejecutamos ajax al sistema

	if ( $.sigesop.validacion( [ doc.datos.anio_licencia ], {tipoValidacion: 'error'} ) ) 
		callback( doc, btn )
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');		

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxOperacion',
		solicitud: 'nuevo_libro_licencia',
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
	doc.datos.anio_licencia.valor = null;
	$( doc.datos.anio_licencia.idHTML ).val( '' );
}

function eliminarElemento( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizLicencia[ index ];

	if ( elemento )
	{
		var win = $.sigesop.ventanaEmergente({
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );

				$.sigesop.insertarDatosSistema({
					Datos: { id_libro_licencia: elemento.id_libro_licencia },
					clase: 'ajaxOperacion',
					solicitud: 'eliminar_libro_licencia',
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
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>' );
			}
		});
	}
}