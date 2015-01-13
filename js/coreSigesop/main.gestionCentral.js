$( document ).on( 'ready', main );

function main ()
{
	// ------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );
		
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxGestionCentral',
		solicitud: 'obtenerDatosCentral',
		respuesta: function(data)
		{
			window.sesion.matrizCentral = data;

			if ( data !== null ) 
			{
				doc = $.sigesop.gestionCentral.documentoCatalogoGestionCentral( data[0], '', true );
				document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
				doc.javascript();

				// ----------------------------------------------------------------------

				$( doc.IDS.botonGuardar ).click(function ( event )
				{
					event.preventDefault();
					procesoElemento( doc, doc.IDS.botonGuardar, actualizarElemento );
				});		
			}
			else
			{
				$( '#main' ).html( '<br> <h4 class="text-center" >' + $.sigesop.sinRegistros + '</h4> <br>' );
				$.sigesop.status.comprobarDatosPrincipalesNulos();
			}
		},
		errorRespuesta: function ()
		{
			document.getElementById( 'main' ).innerHTML = '<br> <h4 class="text-center" >ERROR DE COMUNICACIÓN AL SERVIDOR</h4> <br>'
		}
	});
}

function procesoElemento( doc, btn, callback )
{
	doc.datos.claveCentral.valor = $( doc.datos.claveCentral.idHTML ).val().trim();	
	doc.datos.claveSAP.valor = $( doc.datos.claveSAP.idHTML ).val().trim();
	doc.datos.centroCosto.valor = $( doc.datos.centroCosto.idHTML ).val().trim();
	doc.datos.nombreCentral.valor = $( doc.datos.nombreCentral.idHTML ).val().trim();
	doc.datos.direccion.valor = $( doc.datos.direccion.idHTML ).val().trim();
	doc.datos.telefono.valor = $( doc.datos.telefono.idHTML ).val().trim();
	doc.datos.codigoPostal.valor = $( doc.datos.codigoPostal.idHTML ).val().trim();
	// doc.datos.superintendente.valor = $( doc.datos.superintendente.idHTML ).val().trim();

	var arr = [
		doc.datos.claveCentral,			
		doc.datos.claveSAP,
		doc.datos.centroCosto,
		doc.datos.nombreCentral,
		doc.datos.direccion,
		doc.datos.telefono,
		doc.datos.codigoPostal,
		doc.datos.superintendente
	];

	if ( $.sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) 
	{
		if ( !jQuery.isEmptyObject( doc.datos.claveCentralUpdate.valor ) ) callback( doc, btn );
		else $.sigesop.msgBlockUI( 'La clave anterior de la central se encuentra nula' );
	} 

	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function actualizarElemento( doc, btn )
{
	boton = $( btn );
	// boton.button( 'loading' );
	$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );

	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxGestionCentral',
		solicitud: 'actualizarDatosCentral',
		type: 'POST',
		OK: function()
		{				
			$.sigesop.msgBlockUI( 'Elemento actualizado satisfactoriamente', 'success' );
			boton.button( 'reset' );

			// ----------- limpiar campos

			doc.datos = $.sigesop.vaciarCampos( doc.datos );
			doc.datos.claveCentralUpdate.valor = null;

			// ----------- reingresar datos actualizados

			$.sigesop.solicitarDatosSistema({
				clase: 'ajaxGestionCentral',
				solicitud: 'obtenerDatosCentral',
				respuesta: function( data )
				{
					window.sesion.matrizCentral = data;
					if (data !== null) 
					{
						// ----------- rellenar con los nuevos datos

						$( doc.datos.claveCentral.idHTML ).val( data[ 0 ][ "clave_20" ] );
						$( doc.datos.claveSAP.idHTML ).val( data[ 0 ][ "clave_sap" ] );
						$( doc.datos.centroCosto.idHTML ).val( data[ 0 ][ "centro_costo" ] );
						$( doc.datos.nombreCentral.idHTML ).val( data[ 0 ][ "nombre_central" ] );
						$( doc.datos.direccion.idHTML ).val( data[ 0 ][ "direccion" ] );
						$( doc.datos.telefono.idHTML ).val( data[ 0 ][ "telefono" ] );
						$( doc.datos.codigoPostal.idHTML ).val( data[ 0 ][ "cp" ] );
						$( doc.datos.superintendente.idHTML ).val( data[ 0 ][ 'superintendente' ] );
						$( doc.datos.capacidadInstalada.idHTML ).val( data[ 0] [ "capacidad_instalada" ] );
					}
				}
			});

			// ----------- desabilitar los campos

			$.sigesop.habilitarElementos( doc.datos, true );

			// ----------- deshabilitamos los botones no necesario

			// $.sigesop.habilitarElementoSimple( [
			// 	doc.IDS.botonGuardar,
			// 	doc.IDS.botonSuperintendente
			// ], true );

			$( doc.IDS.botonGuardar ).prop('disabled', true);
			$( doc.IDS.botonSuperintendente ).prop('disabled', true);

			// ----------- habilitamos el boton editar
			
			$( doc.IDS.botonEditar ).prop('disabled', false);
			// $.sigesop.habilitarElementoSimple( [ doc.IDS.botonEditar ], false );
		},

		NA: function () { $.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error' ); boton.button('reset'); },
		DEFAULT: function (data) { $.sigesop.msgBlockUI( data, 'error' ); boton.button( 'reset' ); },
		errorRespuesta: function () { $.sigesop.msgBlockUI( 'Error de conexion al servidor', 'error' ); boton.button( 'reset' ) }
	});
}