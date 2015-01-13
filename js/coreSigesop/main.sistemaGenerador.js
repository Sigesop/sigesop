$( document ).on( 'ready', main );

function main ()
{
	doc = $.sigesop.sistemaGenerador.documentoSistemaGenerador();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// ----------------------------------------------------------------------

	docR = $.sigesop.tablaRegistro({
		suf: '_',
		head: 'ID DEL SISTEMA, NOMBRE DEL SISTEMA',
		// body: data,
		campo: 'id_sistema_aero, nombre_sistema_aero'
	});	
	document.getElementById( 'sistemasRegistrados' ).innerHTML = '<br>' + docR.html;

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

	// ----------------------------------------------------------------------
	
	$.sigesop.barraHerramientas( 'header' );
		
	getData();

	$( doc.IDS.botonGuardar ).click( function ( event ) 
	{
		event.preventDefault();		
		procesoElemento ( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).click( function ( event ) 
	{
		event.preventDefault();
		limpiarCampos( doc );
	});
}

function procesoElemento ( doc, btn, callback )
{	
	// -------------- capturamos las cajas de datos restantes

	doc.datos.idSistema.valor = $( doc.datos.idSistema.idHTML ).val().trim();
	doc.datos.nombreSistema.valor = $( doc.datos.nombreSistema.idHTML ).val().trim();

	// -------------- validamos los campos

	var array = [ 
		doc.datos.idSistema,
		doc.datos.nombreSistema
	]; 

	// -------------- enviamos insercion a la base de datos

	if ( $.sigesop.validacion( array, { tipoValidacion: 'error' } ) ) 
		callback( doc, btn );
	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	boton = $( btn );
	boton.button( 'loading' );
	 
	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxSistemasGenerador',
		solicitud: 'nuevoSistema',
		type: 'POST',
		OK: function()
		{
			limpiarCampos( doc );
			getData();
			$.sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
			boton.button('reset');							
		},
		NA: function()
		{
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );
			boton.button('reset');								
		},
		DEFAULT: function( data )
		{
			$.sigesop.msgBlockUI( data, 'error' );
			boton.button( 'reset' );
		},
		errorRespuesta: function () 
		{ 
			$.sigesop.msgBlockUI( 'Error de comunicación al servidor', 'error' );
			boton.button( 'reset' ) 
		}
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxSistemasGenerador',
		solicitud: 'obtenerSistemas',
		respuesta: function( data )
		{
			window.sesion.matrizSistemas = data;

			if ( data != null )
			{
				document.getElementById( 'badge_sistemas' ).innerHTML = data.length;
				docR.update_table( data );
			}

			else document.getElementById( 'badge_sistemas' ).innerHTML = '0';
		}
	});	
}

function limpiarCampos ( doc )
{
	doc.datos.idSistema.valor = null;
	doc.datos.nombreSistema.valor = null;

	$( doc.datos.idSistema.idHTML ).val('');
	$( doc.datos.nombreSistema.idHTML ).val('');
}

function eliminarElemento ( key, option )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizSistemas[ index ],
		clickAceptar = function( event ) 
		{
			event.preventDefault();
			$( win.idDiv ).modal( 'hide' );

			$.sigesop.insertarDatosSistema({
				Datos: { id_sistema_aero: elemento.id_sistema_aero },
				clase: 'ajaxSistemasGenerador',
				solicitud: 'eliminarSistema',
				OK: function()
				{
					getData();
					$.sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );	
				},
				NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
				DEFAULT: function ( data ) { $.sigesop.msgBlockUI( data, 'error' ) },
				errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ) }
			});	
		};

	if ( elemento )
	{
		var win = $.sigesop.ventanaEmergente({										
			idDiv: 'confirmarSolicitud',
			titulo: 'Autorización requerida',			
			clickAceptar: clickAceptar,
			showBsModal: function () 
			{
				$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento?</h4></div>' );
			}
		});						
	} 
}

function editarElemento ( key, option )
{
	var
		index = $( this ).index(),
		elemento = window.sesion.matrizSistemas[ index ],
		docU = $.sigesop.sistemaGenerador.documentoSistemaGenerador( elemento, 'edicion' );

	if ( elemento )
	{
		// guardamos el ID del sistema original antes de actualizar
		docU.datos.idSistemaUpdate.valor = elemento.id_sistema_aero;

		var win = $.sigesop.ventanaEmergente({
			idDiv: 'ventanaEdicionSistema',
			titulo: 'Edición de sistema de generador',
			clickAceptar: function( event ) 
			{
				event.preventDefault();
				$( win.idDiv ).modal( 'hide' );
			},
			showBsModal: function () 
			{
				$( '#' + this.idBody ).html( docU.html );
				docU.javascript();
				
				$( docU.IDS.botonGuardar ).on( 'click', function ( event )
				{
					event.preventDefault();
					procesoElemento ( docU, docU.IDS.botonGuardar, actualizarElemento );
				});
			}
		});			
	} 
	else console.log( '[elemento] es nulo, funcion editarElemento' );
}

function actualizarElemento( doc, btn )
{
	boton = $( btn );
	boton.button( 'loading' );
	$.sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#ventanaEdicionSistema_modal' );
	 
	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxSistemasGenerador',
		solicitud: 'actualizarSistema',
		type: 'POST',
		OK: function()
		{
			getData();
			$( '#ventanaEdicionSistema' ).modal( 'hide' );
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},
		NA: function()
		{
			$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#ventanaEdicionSistema_modal' );
			boton.button('reset');								
		},
		DEFAULT: function( data )
		{
			$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#ventanaEdicionSistema_modal' );
			boton.button( 'reset' );
		},
		errorRespuesta: function () 
		{ 
			$.sigesop.msgBlockUI( 'Error de comunicación al servidor', 'error', 'msgBlock', '#ventanaEdicionSistema_modal' );
			boton.button( 'reset' ) 
		}
	});
}