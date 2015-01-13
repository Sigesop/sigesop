$( document ).on( 'ready', main );

function main ()
{
	// ---------- documento de creacion de listas de verificacion

	doc = $.sigesop.listaVerificacion.documentoListaVerificacion( null, '' );
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	// ---------- documento de registro de listas de verificacion

	docR = $.sigesop.tablaRegistro({
		head: 'SISTEMA, ACTIVIDADES REGISTRADAS',
		campo: "nombre_sistema_aero, elementos",
		suf: '_lista_verificacion'
	});

	document.getElementById( 'listasRegistradas' ).innerHTML = '<br>' + docR.html;

	$( docR.IDS.body ).contextMenu({
		selector: 'tr',
		items: {
            editar: 
            {
            	name: 'Editar', 
            	icon: 'edit',
        		callback: editarElemento
            }
		}
	});

	// docR.callback.menuPDF = function ( index, data )
	// {
	// 	var doc = new jsPDF(),
	// 		nombre = window.sesion.matrizListaVerificacion[ index ]['descripcion_lista_verificacion'];

	// 	doc.setFont("courier");
	// 	doc.setFontType("bolditalic");
	// 	doc.text(20, 60, nombre );
	// 	doc.save( nombre + '.pdf' );
	// }

	// ----------------------------------------------------------

	$.sigesop.barraHerramientas( 'header' );

	getData();

	$( doc.IDS.botonGuardar ).on('click', function(event) {
		event.preventDefault();
	
		// var m = [ 'IDS', 'botonGuardar' ];

		// var temp = doc[ m[0] ];
		// temp = temp[ m[1] ];
		// alert( temp );
		procesoElemento ( doc, doc.IDS.botonGuardar, nuevoElemento )
	});

	$( doc.IDS.botonLimpiar ).on( 'click', function ( event )
	{
		event.preventDefault();
		limpiarCampos( doc );
	});

	$( doc.IDS.botonActividad ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		procesarActividad( doc );
	});

	$( doc.IDS.botonReiniciarAct ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		reiniciarActividad( doc );
	});
}

function getData()
{
	$.sigesop.solicitarDatosSistema ({
		clase: 'ajaxListaVerificacion',
		solicitud: 'obtenerTipoMantenimiento',
		respuesta: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			
			$.sigesop.combo({
				arr: data, 
				elem: doc.datos.id_mantenimiento.idHTML,
				campo: 'nombre_mantenimiento',
				campoValor: 'id_mantenimiento'
			});
		}
	});

	$.sigesop.solicitarDatosSistema ({
		clase: 'ajaxSistemasGenerador',
		solicitud: 'obtenerSistemas',
		respuesta: function ( data )
		{
			window.sesion.matrizSistemas = data;
			
			$.sigesop.combo({
				arr: data, 
				elem: doc.actividad_verificar.id_sistema_aero.idHTML,
				campo: 'nombre_sistema_aero',
				campoValor: 'id_sistema_aero'
			});
		}
	});

	$.sigesop.solicitarDatosSistema ({
		clase: 'ajaxListaVerificacion',
		solicitud: 'systems_into_mantto',
		respuesta: function ( data )
		{
			document.getElementById( 'badge_listaVerificacion' ).innerHTML = data !== null ?
				data.length : 0;

			docR.update_table( data );
		}
	});
}

function procesoElemento ( doc, btn, callback )
{	
	// -------------- capturamos las cajas de datos restantes						
	
	doc.datos.id_mantenimiento.valor = $( doc.datos.id_mantenimiento.idHTML ).val().trim();
	doc.datos.descripcion_lista_verificacion.valor = $( doc.datos.descripcion_lista_verificacion.idHTML ).val().trim();

	// doc.actividad_verificar.id_equipo_aero.valor = $( doc.actividad_verificar.id_equipo_aero.idHTML ).val().trim();
	// doc.actividad_verificar.id_sistema_aero.valor = $( doc.actividad_verificar.id_sistema_aero.idHTML ).val().trim();	

	// -------------- validamos los campos

	var arr = [
		doc.datos.id_mantenimiento,	
		// doc.actividad_verificar.id_equipo_aero,
		// doc.actividad_verificar.id_sistema_aero,
		doc.datos.descripcion_lista_verificacion
	]; 

	// -------------- enviamos insercion a la base de datos

	if ( $.sigesop.validacion( arr, { tipoValidacion: 'error' } ) ) 
	{
		if ( !jQuery.isEmptyObject( doc.datos.actividad_verificar ) ) callback( doc, btn );
		else
		{			
			$.sigesop.validacion( [ doc.actividad_verificar.actividad_verificar ], { tipoValidacion: 'error' } );
			$.sigesop.msgBlockUI( 'No existen actividades agregadas', 'error' );	
		} 
	}

	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function nuevoElemento( doc, btn )
{
	var boton = $( btn );
	boton.button( 'loading' );
	 
	$.sigesop.insertarDatosSistema({
		Datos: doc.datos,
		clase: 'ajaxListaVerificacion',
		solicitud: 'nuevaListaVerificacion',
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

		DEFAULT: function (data) 
		{ 
			$.sigesop.msgBlockUI( data, 'error' );
			boton.button( 'reset' );
		},
		errorRespuesta: function () 
		{ 
			$.sigesop.msgBlockUI( 'Error de comunicación al servidor', 'error' );
			boton.button( 'reset' ) 
		}
	}) ;
}

function limpiarCampos( doc )
{
	// doc.datos = $.sigesop.vaciarCampos( doc.datos );

	// ---------- vaciar datos
	
	doc.datos.id_mantenimiento.valor = null;	
	doc.datos.actividad_verificar = [];
	doc.datos.descripcion_lista_verificacion.valor = null;

	// ----------

	$( doc.datos.id_mantenimiento.idHTML ).val( '' );
	$( doc.datos.descripcion_lista_verificacion.idHTML ).val( '' );

	// ---------- limpiar actividades

	reiniciarActividad( doc )
	$( doc.IDS.listaActividades ).empty();
}

function procesarActividad( doc )
{
	// -------------- capturamos las cajas de datos restantes
	
	doc.actividad_verificar.id_sistema_aero.valor = $( doc.actividad_verificar.id_sistema_aero.idHTML ).val().trim();
	doc.actividad_verificar.id_equipo_aero.valor = $( doc.actividad_verificar.id_equipo_aero.idHTML ).val().trim();	
	doc.actividad_verificar.actividad_verificar.valor = $( doc.actividad_verificar.actividad_verificar.idHTML ).val().trim();

	var arr = [
		doc.actividad_verificar.id_equipo_aero,
		doc.actividad_verificar.id_sistema_aero,
		doc.actividad_verificar.actividad_verificar
	];

	if ( $.sigesop.validacion( arr, { tipoValidacion: 'error' } ) )
	{
	
		doc.datos.actividad_verificar.push( copy_actividad( doc.actividad_verificar ) );

		doc.IDS.update_table_actividad ( doc.datos.actividad_verificar );

		reiniciarActividad( doc ); // reiniciamos la actividad
	}

	else $.sigesop.msgBlockUI( 'Complete los campos', 'error' );
}

function copy_actividad( data )
{
	// ---------- copiamos doc.actividad_verificar a [doc.datos] principal
	
	var act = jQuery.extend( true, {}, data );

	// ---------- eliminar datos innecesarios

	delete act.id_sistema_aero.idHTML;
	delete act.id_sistema_aero.idValidacion;
	delete act.id_sistema_aero.popover;

	delete act.id_equipo_aero.idHTML;
	delete act.id_equipo_aero.idValidacion;
	delete act.id_equipo_aero.popover;

	delete act.actividad_verificar.idHTML;
	delete act.actividad_verificar.idValidacion;
	delete act.actividad_verificar.regexp;
	delete act.actividad_verificar.popover;

	return act;
}

function reiniciarActividad( doc )
{
	// ---------- reiniciar datos
	
	doc.actividad_verificar.id_equipo_aero.valor = null;
	doc.actividad_verificar.id_sistema_aero.valor = null;
	doc.actividad_verificar.actividad_verificar.valor = null;
	doc.actividad_verificar.parametro_actividad = [];
	doc.actividad_verificar.lectura_actual = [];
	doc.actividad_verificar.lectura_posterior = [];	

	// ----------

	$( doc.actividad_verificar.id_equipo_aero.idHTML ).val( '' );
	$( doc.actividad_verificar.id_equipo_aero.idHTML ).prop( 'disabled', true );

	$( doc.actividad_verificar.id_sistema_aero.idHTML ).val( '' );
	$( doc.actividad_verificar.actividad_verificar.idHTML ).val( '' );

	$( doc.IDS.parametroAceptacion ).val('');	
	$( doc.IDS.divParametroAceptacion ).empty();			

	$( doc.IDS.lecturaActual ).val('');
	$( doc.IDS.lecturaActual ).prop( 'disabled', false );
	$( doc.IDS.divLecturaActual ).empty();		
	
	$( doc.IDS.lecturaPost ).val( '' );
	$( doc.IDS.lecturaPost ).prop( 'disabled', true );
	$( doc.IDS.divLecturaPost ).empty();

	$( doc.IDS.botonActividad ).prop( 'disabled', true );
}

function editarElemento( key, opt )
{

}