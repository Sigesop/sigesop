$( document ).on( 'ready', main );

function main ()
{
	doc = sigesop.sistemaGenerador.documentoSistemaGenerador();
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// ----------------------------------------------------------------------

	docR = sigesop.tablaRegistro({
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
	
	$( 'header' ).barraHerramientas();
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

	if ( sigesop.validacion( array, { tipoValidacion: 'error' } ) ) 
		callback( doc, btn );
	else sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	sigesop.query({
		data: doc.datos,
		class: 'sistemasGenerador',
		query: 'nuevoSistema',
		queryType: 'sendData',
		type: 'POST',
		OK: function()
		{
			limpiarCampos( doc );
			getData();
			sigesop.msgBlockUI( 'Elemento ingresado satisfactoriamente', 'success' );
		},
		NA: function()
		{
			sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' );						
		},
		DEFAULT: function( data )
		{
			sigesop.msgBlockUI( data, 'error' );
		}
	});
}

function getData()
{
	sigesop.query({
		class: 'sistemasGenerador',
		query: 'obtenerSistemas',
		success: function( data )
		{
			window.sesion.matrizSistemas = data;
			docR.update_table( data );
			document.getElementById( 'badge_sistemas' ).innerHTML = 
				!$.isEmptyObject( data ) ? data.length : '0';
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

			sigesop.query({
				data: { id_sistema_aero: elemento.id_sistema_aero },
				class: 'sistemasGenerador',
				query: 'eliminarSistema',
				queryType: 'sendData',
				OK: function()
				{
					getData();
					sigesop.msgBlockUI( 'Elemento eliminado satisfactoriamente', 'success' );	
				},
				NA: function () { sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ) },
				DEFAULT: function ( data ) { sigesop.msgBlockUI( data, 'error' ) }
			});	
		};

	if ( elemento )
	{
		var win = sigesop.ventanaEmergente({										
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
		docU = sigesop.sistemaGenerador.documentoSistemaGenerador( elemento, 'edicion' );

	if ( elemento )
	{
		// guardamos el ID del sistema original antes de actualizar
		docU.datos.idSistemaUpdate.valor = elemento.id_sistema_aero;

		var win = sigesop.ventanaEmergente({
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
	sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#ventanaEdicionSistema_modal' );
	sigesop.query({
		data: doc.datos,
		class: 'sistemasGenerador',
		query: 'actualizarSistema',
		queryType: 'sendData',
		type: 'POST',
		OK: function()
		{
			getData();
			$( '#ventanaEdicionSistema' ).modal( 'hide' );
			sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},
		NA: function()
		{
			sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#ventanaEdicionSistema_modal' );							
		},
		DEFAULT: function( data )
		{
			sigesop.msgBlockUI( data, 'error', 'msgBlock', '#ventanaEdicionSistema_modal' );
		}
	});
}