$( document ).on( 'ready', main );

function main () {
	doc = sigesop.gestionCentral.document({
		error: error,
		success: actualizarElemento
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();
		
	$( 'header' ).barraHerramientas();
	getData();
}

function getData () {
	sigesop.query({
		class: 'gestionCentral',
		query: 'obtenerDatosCentral',
		success: function( data ) {
			window.sesion.matrizCentral = data;
			doc.update_data( data );
		}
	});
}

function error() { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

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

	if ( sigesop.validacion( arr, {tipoValidacion: 'error'} ) ) 
	{
		if ( !jQuery.isEmptyObject( doc.datos.claveCentralUpdate.valor ) ) callback( doc, btn );
		else sigesop.msgBlockUI( 'La clave anterior de la central se encuentra nula' );
	} 

	else sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function actualizarElemento( datos, IDS, vaciarDatos )
{
	datos.clave_20.valor = $( datos.clave_20.idHTML ).val().trim();	
	datos.clave_sap.valor = $( datos.clave_sap.idHTML ).val().trim();
	datos.centro_costo.valor = $( datos.centro_costo.idHTML ).val().trim();
	datos.nombre_central.valor = $( datos.nombre_central.idHTML ).val().trim();
	datos.direccion.valor = $( datos.direccion.idHTML ).val().trim();
	datos.telefono.valor = $( datos.telefono.idHTML ).val().trim();
	datos.cp.valor = $( datos.cp.idHTML ).val().trim();
	datos.superintendente.valor = $( datos.superintendente.idHTML ).val().trim();

	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'gestionCentral',
		query: 'actualizarDatosCentral',
		queryType: 'sendData',
		type: 'POST',
		OK: function( msj, eventos )
		{
			vaciarDatos();
			doc.disable();			
			$.unblockUI();			
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );

			/* reingresar datos actualizados			
			 */
			sigesop.query({
				class: 'gestionCentral',
				query: 'obtenerDatosCentral',
				success: function( data )
				{
					window.sesion.matrizCentral = data;
					doc.update_data( data );
				}
			});
		},
		NA: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
		},
		DEFAULT: function ( msj, eventos ) {
			$.unblockUI();
			sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
		}
	});
}