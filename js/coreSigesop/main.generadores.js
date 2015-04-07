$( document ).on( 'ready', main );

function main ()
{
	doc = sigesop.generadores.documentoGeneradores( null, null, null, '' );
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// -------------------------------------------------------------------------

	docR = sigesop.tablaRegistro({
		head: 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
		campo: 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion',
		addClass: {
			body: {
				class: 'warning, danger, info, success',
				campo: 'estado_licencia, estado_licencia, estado_licencia, estado_licencia',
				valor: 'C.A., FALLA, MTTO, F.A.'
			}
		}
	});

	document.getElementById( 'pestanaAerosRegistrados' ).innerHTML = '<br>' + docR.html;

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

	// -------------------------------------------------------------------------

	$( 'header' ).barraHerramientas();

	getData();

	// -------------------------------------------------------------------------------

	$( doc.IDS.botonGuardar ).on( 'click', function(event)
	{
		event.preventDefault();
		procesoElemento ( doc, doc.IDS.botonGuardar, nuevoElemento );
	});

	$( doc.IDS.botonLimpiar ).on('click', function(event)
	{
		event.preventDefault();
		limpiarCampos( doc )
	});
}

function getData()
{
	sigesop.query({
		class: 'unidades',
		query: 'obtenerUnidades',
		success: function(data) 
		{
			window.sesion.matrizUnidades = data;
			sigesop.combo({
				arr: data, 
				elem: doc.datos.numero_unidad.idHTML, 
				campo: 'numero_unidad'
			});
		}
	});

	sigesop.query({
		class: 'generadores',
		query: 'obtenerGeneradores',
		success: function( data )
		{
			window.sesion.matrizGeneradores = data;
			docR.update_table( data );

			!$.isEmptyObject( data ) ?
				document.getElementById( 'badge_generadores' ).innerHTML = data.length:
				document.getElementById( 'badge_generadores' ).innerHTML = '0';
		}
	});	
}

function procesoElemento ( doc, btn, callback )
{
	// ---------- capturar los datos restantes del formulario
	
	doc.datos.numero_unidad.valor = $( doc.datos.numero_unidad.idHTML ).val();
	doc.datos.numero_aero.valor = $( doc.datos.numero_aero.idHTML ).val().trim();
	doc.datos.capacidad_efectiva_aero.valor = $( doc.datos.capacidad_efectiva_aero.idHTML ).val().trim();
	// doc.datos.estado_licencia.valor = $( doc.datos.estado_licencia.idHTML ).val().trim();

	// ---------- validar los datos almacenados

	var arr = [
		doc.datos.numero_unidad,
		doc.datos.numero_aero,
		doc.datos.capacidad_efectiva_aero
		// doc.datos.estado_licencia
	];
	
	if ( sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) callback( doc, btn );
	else sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: doc.datos,
		class: 'generadores',
		query: 'nuevoGenerador',
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
	doc.datos.numero_unidad.valor = null;
	doc.datos.numero_aero.valor = null;
	doc.datos.numero_aero_update.valor = null;
	doc.datos.capacidad_efectiva_aero.valor = null;
	// doc.datos.estado_licencia.valor = null;

	$( doc.datos.numero_unidad.idHTML ).val( '' );
	$( doc.datos.numero_aero.idHTML ).val( '' );
	$( doc.datos.capacidad_efectiva_aero.idHTML ).val( '' );
	// $( doc.datos.estado_licencia.idHTML ).val( '' );
}

function eliminarElemento ( key, opt )
{
	var 
		index = $( this ).index(),
		elemento = window.sesion.matrizGeneradores[ index ];

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
					data: { numero_aero: elemento.numero_aero },
					class: 'generadores',
					query: 'eliminarGenerador',
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
		elemento = window.sesion.matrizGeneradores[ index ];

	if( elemento )
	{	
		// ---------- creamos la estructura para la edicion de el usuario en la ventana

		var _doc = sigesop.generadores.documentoGeneradores ( elemento,  
				window.sesion.matrizUnidades, window.sesion.matrizEstadoLicencia, '_update' );

		// ---------- guardamos la llave primaria para la actualizacion de datos

		_doc.datos.numero_aero_update.valor = elemento.numero_aero;

		// ---------- 
		
		var win = sigesop.ventanaEmergente({
			idDiv: 'divEdicion_generador',
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
	sigesop.msgBlockUI('Enviando...', 'loading', 'block', '#divEdicion_generador_modal' );
	sigesop.query({
		data: doc.datos,
		class: 'generadores',
		query: 'actualizarGenerador',
		queryType: 'sendData',
		type: 'POST',
		OK: function () 
		{
			getData();
			$( '#divEdicion_generador' ).modal( 'hide' );
			sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );			
		},
		NA: function () { sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#divEdicion_generador_modal' ); },
		DEFAULT: function (data) { sigesop.msgBlockUI( data, 'error', 'msgBlock', '#divEdicion_generador_modal' ); }
	}) ;
}