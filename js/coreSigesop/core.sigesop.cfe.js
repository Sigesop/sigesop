try {
(function ($) 
{

window.sesion = {
	// ---------------------- Constantes del sistema

	indexActividadRegistrada: null,
	indexOrdenTrabajoPorUsuario: null,
	
	matrizAreaAcceso: null,
	matrizAreaTrabajo: null,
	matrizCentral: null,
	matrizEquipos: null,
	matrizEstadoLicencia: null,
	matrizGeneradores: null,
	matrizListaVerificacion: null,
	matrizOrdenTrabajo: null,
	matrizLicencia: null,
	matrizOrdenTrabajoPorUsuario: null,
	matrizOrdenesPorGenerador: null,
	matrizPermisoAcceso: null,
	matrizReporteMantto: null,
	matrizSistemas: null,
	matrizTipoMantto: null,
	matrizTipoParamentroAceptacion: null,
	matrizTipoRol: null,
	matrizUnidadMedida: null,
	matrizUnidades: null,
	matrizUsuario: null    	
};

$.sigesop = {

// ---------------------- Rutinas comunes del sistema

alerta: function ( opt ) 
{
	// --- PROPIEDADES DEL opt ---
	// titulo
	// colorEstado
	// mensajeAlerta
	// idInsercion
	// hiddenBsModal
	// ----------------------------
	var alerta = '' +
		'<div id="alerta" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
		'	<div class="modal-dialog">'+
		'		<div class="modal-content">'+
		'			<div class="modal-header">'+
		'				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
		'        		<h4 class="modal-title" >'+ opt.titulo + '</h4>'+
		'	    </div>'+
		'	    	<div class="modal-body">'+
		'	    		<div class="alert alert-'+ opt.colorEstado + '">'+
		'	    			<p > <h5 class="text-center">' + opt.mensajeAlerta + '</h5>'+
		'	    			</p>'+
		'	    		</div>'+
		'			</div>'+
		'		    <div class="modal-footer">'+
		'		        <button type="button" class="btn btn-success" data-dismiss="modal">Cerrar</button>'+
		'		    </div>'+
		'    	</div>'+
		'	</div>'+
		'</div>';

	// $( opt.idInsercion ).html( alerta );
	$( 'body' ).append( alerta );	
	$( '#alerta' ).on( 'hidden.bs.modal', function ()
	{
		$( '#alerta' ).remove();
		jQuery.isFunction( opt.hiddenBsModal ) ? opt.hiddenBsModal() : null;
	});

	$( '#alerta' ).modal( { keyboard: true } );
},

alertaRoot: function ( opt ) 
{
	// --- PROPIEDADES DEL JSON ---
	// idDiv
	// titulo
	// idForm
	// colorEstado
	// mensajeAlerta
	// idInsercion
	// clickCerrar
	// clickAceptar
	// showBsModal
	// hiddenBsModal			
	// shownBsModal
	// hideBsModal
	// ----------------------------

	var ventana = '' +
		'<div class="modal fade" id="' + opt.idDiv +'" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
		'	<div class="modal-dialog">'+
		'    	<div class="modal-content">'+
		'	    	<form id="' + opt.idForm + '" role="form" method="post">'+
		'    			<div class="modal-header">'+
		'        			<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
		'        			<h4 class="modal-title" >' + opt.titulo + '</h4>'+
		'	    		</div>'+
		'	    		<div class="modal-body">'+
		'		    			<div class="alert alert-' + opt.colorEstado + '">'+
		'		    				<p > <h5 class="text-center">' + opt.mensajeAlerta + '</h5></p>'+
		'		    			</div>'+
		'		    			<div class="col-md-2"></div>'+
		'		    			<div class="col-md-8">'+
		'		    				<input type="password" id="password" class="form-control input-sm text-center">'+
		'		    			</div>'+
		'		    			<div class="col-md-2"></div>'+
		'				</div>'+
		'		    	<div class="modal-footer">'+
		'		        	<button id="btnCerrarVentana" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>'+
		'		        	<button id="btnEnviarCheckRoot" type="submit" class="btn btn-success">Aceptar</button>'+
		'		    	</div>'+
		'	    	</form>'+
		'    	</div>'+
		'	</div>'+
		'</div>';

	$( '#' + opt.idInsercion ).html( ventana );

	$( '#' + opt.idDiv ).on( 'show.bs.modal', function(e) {
		jQuery.isFunction( opt.clickCerrar ) ? $( '#btnCerrarVentana' ).on( 'click', opt.clickCerrar ) : null;
		$( '#btnEnviarCheckRoot' ).on( 'click', opt.clickAceptar );

		jQuery.isFunction( opt.showBsModal ) ? opt.showBsModal() : null;
	});

	$( '#' + opt.idDiv ).on( 'hidden.bs.modal', function(e) {
		$( '#btnCerrarVentana' ).off( 'click' );
		$( '#btnEnviarCheckRoot' ).off( 'click' );
		$( '#' + opt.idDiv ).remove();

		jQuery.isFunction( opt.hiddenBsModal ) ? opt.hiddenBsModal() : null;
	});	

	$( '#' + opt.idDiv ).on( 'shown.bs.modal', opt.shownBsModal );
	$( '#' + opt.idDiv ).on( 'hide.bs.modal', opt.hideBsModal );

	$( '#' + opt.idDiv ).modal({ 
		keyboard: true,
		backdrop: 'static'
	});
},

array_key_exists: function ( key, search ) 
{
  //  discuss at: http://phpjs.org/functions/array_key_exists/
  // original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // improved by: Felix Geisendoerfer (http://www.debuggable.com/felix)
  //   example 1: array_key_exists('kevin', {'kevin': 'van Zonneveld'});
  //   returns 1: true

	if (!search || (search.constructor !== Array && search.constructor !== Object)) {
		return false;
	}

	return key in search;
},

array_merge: function () 
{
	//  discuss at: http://phpjs.org/functions/array_merge/
	// original by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Nate
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	//    input by: josh
	//   example 1: arr1 = {"color": "red", 0: 2, 1: 4}
	//   example 1: arr2 = {0: "a", 1: "b", "color": "green", "shape": "trapezoid", 2: 4}
	//   example 1: array_merge(arr1, arr2)
	//   returns 1: {"color": "green", 0: 2, 1: 4, 2: "a", 3: "b", "shape": "trapezoid", 4: 4}
	//   example 2: arr1 = []
	//   example 2: arr2 = {1: "data"}
	//   example 2: array_merge(arr1, arr2)
	//   returns 2: {0: "data"}

	var 
		args = Array.prototype.slice.call(arguments),
		argl = args.length,
		arg,
		retObj = {},
		k = '',
		argil = 0,
		j = 0,
		i = 0,
		ct = 0,
		toStr = Object.prototype.toString,
		retArr = true;

	for (i = 0; i < argl; i++) 
	{
		if (toStr.call(args[i]) !== '[object Array]') 
		{
			retArr = false;
			break;
		}
	}

	if (retArr) 
	{
		retArr = [];
		for (i = 0; i < argl; i++) 
		{
			retArr = retArr.concat(args[i]);
		}		
		return retArr;
	}

	for (i = 0, ct = 0; i < argl; i++) 
	{
		arg = args[i];
		if (toStr.call(arg) === '[object Array]') 
		{
			for (j = 0, argil = arg.length; j < argil; j++) {
				retObj[ct++] = arg[j];
			}
		} else {
			for (k in arg) {
				if (arg.hasOwnProperty(k)) {
					if (parseInt(k, 10) + '' === k) {
						retObj[ct++] = arg[k];
					} else {
						retObj[k] = arg[k];
					}
				}
			}
		}
	}
	return retObj;
},

array_search: function (needle, haystack, argStrict) 
{
	//  discuss at: http://phpjs.org/functions/array_search/
	// original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//  depends on: array
	//        test: skip
	//   example 1: array_search('zonneveld', {firstname: 'kevin', middle: 'van', surname: 'zonneveld'});
	//   returns 1: 'surname'
	//   example 2: ini_set('phpjs.return_phpjs_arrays', 'on');
	//   example 2: var ordered_arr = array({3:'value'}, {2:'value'}, {'a':'value'}, {'b':'value'});
	//   example 2: var key = array_search(/val/g, ordered_arr); // or var key = ordered_arr.search(/val/g);
	//   returns 2: '3'

	var strict = !! argStrict,
	key = '';

	if (haystack && typeof haystack === 'object' && haystack.change_key_case) { // Duck-type check for our own array()-created PHPJS_Array
		return haystack.search(needle, argStrict);
	}
	if (typeof needle === 'object' && needle.exec) { // Duck-type for RegExp
		if (!strict) { // Let's consider case sensitive searches as strict
			var flags = 'i' + (needle.global ? 'g' : '') +
			(needle.multiline ? 'm' : '') +
			(needle.sticky ? 'y' : ''); // sticky is FF only
			needle = new RegExp(needle.source, flags);
		}
		for (key in haystack) {
			if (needle.test(haystack[key])) {
				return key;
			}
		}
		return false;
	}

	for (key in haystack) {
		if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)) {
			return key;
		}
	}

	return false;
},

array_unique: function ( inputArr )
{
	//  discuss at: http://phpjs.org/functions/array_unique/
	// original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	//    input by: duncan
	//    input by: Brett Zamir (http://brett-zamir.me)
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Nate
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: Brett Zamir (http://brett-zamir.me)
	// improved by: Michael Grier
	//        note: The second argument, sort_flags is not implemented;
	//        note: also should be sorted (asort?) first according to docs
	//   example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
	//   returns 1: {0: 'Kevin', 2: 'van', 3: 'Zonneveld'}
	//   example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
	//   returns 2: {a: 'green', 0: 'red', 1: 'blue'}

	var 
		key = '',
		tmp_arr2 = {},
		val = '';

	var __array_search = function(needle, haystack) {
		var fkey = '';
		for (fkey in haystack) {
			if (haystack.hasOwnProperty(fkey)) {
				if ((haystack[fkey] + '') === (needle + '')) {
					return fkey;
				}
			}
		}
		return false;
	};

	for (key in inputArr) {
		if (inputArr.hasOwnProperty(key)) {
			val = inputArr[key];
			if (false === __array_search(val, tmp_arr2)) {
				tmp_arr2[key] = val;
			}
		}
	}

	return tmp_arr2;
},

barraHerramientas: function ( elem ) 
{
	var 
		struct_barra = function( data )
		{
			if ( data == null ) {
				console.log( 'function: barraHerramientas --> [data] es nulo' )
				return null;
			}
			
			var 
				html = '',

				n1 = '',

				n2 = '<li class="dropdown">' +
						 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Catálogos<b class="caret"></b></a>'+
						 '<ul class="dropdown-menu">',

				n3 = '<li class="dropdown">'+
						 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Mantenimiento<b class="caret"></b></a>'+
						 '<ul class="dropdown-menu">',

				n4 = '<li class="dropdown">'+
						 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Operación<b class="caret"></b></a>'+
						 '<ul class="dropdown-menu">',

				n_usuario = '',

				nivelActivo1 = false,
				nivelActivo2 = false,
				nivelActivo3 = false,
				nivelActivo4 = false,
				nivelActivo_usuario = false;

			for( var i = 0, lon = data.length; i < lon; i++ )
			{									
				 switch( data[ i ].nivelBarra ) 
				 {
				 	case 1:
				 		n1 += '<li><a href="' + data[ i ].paginaAcceso + '">' + data[ i ].nombrePagina + '</a></li>';
				 		nivelActivo1 = true;
				 		break;
				 	case 2:
				 		n2 += '<li><a href="' + data[ i ].paginaAcceso + '">' + data[ i ].nombrePagina + '</a></li>';
				 		nivelActivo2 = true;
				 		break;
				 	case 3:
				 		n3 += '<li><a href="' + data[ i ].paginaAcceso + '">' + data[ i ].nombrePagina + '</a></li>';
				 		nivelActivo3 = true;
				 		break;
				 	case 4:
				 		n4 += '<li><a href="' + data[ i ].paginaAcceso + '">' + data[ i ].nombrePagina + '</a></li>';
				 		nivelActivo4 = true;
				 		break;
				 	case 0:
				 		n_usuario += '<li><a href="' + data[ i ].paginaAcceso + '">' + data[ i ].nombrePagina + '</a></li>';
				 		nivelActivo_usuario = true;
				 		break;					 		
				 }
			}

			n2 += '</ul></li>';
			n3 += '</ul></li>';
			n4 += '</ul></li>';

			html +=
				'<nav class="navbar navbar-cfe navbar-static-top navbar-fixed-top" role="navigation">'+
				'	<div class="container-fluid">'+
				'		<div class="navbar-header">'+
				'			<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#barraNavegacion">'+
				'				<span class="glyphicon glyphicon-home"></span>'+
				'			</button>'+
				'		</div>'+
				'		<div id="barraNavegacion" class="collapse navbar-collapse bs-navbar-collapse">'+
				'			<ul class="nav navbar-nav">';

				nivelActivo1 ? 	html +=	n1 : null;
				nivelActivo2 ? 	html +=	n2 : null;
				nivelActivo3 ? 	html +=	n3 : null;
				nivelActivo4 ? 	html +=	n4 : null;
				nivelActivo_usuario ? 	html +=	n_usuario : null;

				html += '</ul>'+
				'			<ul class="nav navbar-nav navbar-right">'+
				'				<li><a href="javascript: $.sigesop.cerrarSesion()"> Cerrar Sesión  <span class="glyphicon glyphicon-off"></span> </a></li>'+
				'			</ul>'+
				'		</div>'+
				'	</div>'+
				'</nav>';

			$( elem ).html( html );	
		};

	// ejecutamos ajax de peticion de datos

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxSistema',
		solicitud: 'insertaBarraHerramientasRolUsuario',
		respuesta: struct_barra
	});
},


cargandoDatos: 'CARGANDO DATOS...',

cerrarSesion: function () 
{
	// $( '#insertMsj' ).modal( { keyboard: true } );
	// $( '#confirmarCierre' ).on('click', function( event )
	// {
	// 	event.preventDefault();
	// 	$.sigesop.requestCloseSesion()
	// });

	this.ventanaEmergente({
	 	idDiv: '_cs',
	 	titulo: 'Cierre de sesión',
	 	idBody: 'bodyCierreSesion',
	 	idBtnOK: 'btnCierreSesion',
	 	clickAceptar: function ( event )
	 	{
	 		event.preventDefault();
 			$.sigesop.requestCloseSesion();
	 	},
	 	showBsModal: function ()
	 	{
	 		$( '#' + this.idBody ).html( '<div class="alert alert-warning text-center"><p><h4>¿Está seguro de cerrar sesión?</h4></p></div>' );
	 	}			 	
	});
},

eventoCambioEsNumero: function ( elem )
{
	$( elem ).change( function ( event ) 
	{
		var valor = $( this ).val();
		$.isNumeric( valor ) ? null : $( this ).val( '' );
	});
},

eventoCambioMayuscula: function ( elem, callback ) 
{
	$( elem ).change( function(event)
	{
		var valor = $( this ).val();
		$( this ).val( valor.toUpperCase() );
		if ( typeof callback === 'function' ) callback();
	});
},

eventoKeyupComparaCadena: function ( opt )
{
	$( opt.elementoKeyup ).bind( 'keyup', function() 
	{
		// ------------ verificamos si es una cadena SHA1

		if ( opt.tipoCadena == 'SHA1' ) 
		{
			var cadena = $.sigesop.SHA1( $( opt.elemento ).val() ),
				cadenaVerificar = $.sigesop.SHA1( $( opt.elementoKeyup ).val() );
		} 
		else
		{
			var cadena =  $( opt.elemento ).val(),
				cadenaVerificar = $( opt.elementoKeyup ).val();
		}

		// ------------ comparamos las cadenas y agregamos los efectos de validacion

		if ( cadena === cadenaVerificar ) 
		{
			// opt.variableRetorno = true;

			$( opt.formElementoKeyup ).addClass( 'has-success' );
			$( opt.formElemento ).addClass( 'has-success' );
			$( opt.formElementoKeyup ).removeClass( 'has-error' );
			$( opt.formElemento ).removeClass( 'has-error' );					
		} 
		else 
		{
			// opt.variableRetorno = false;

			$( opt.formElementoKeyup ).addClass( 'has-error' );
			$( opt.formElemento ).addClass( 'has-error' );
			$( opt.formElementoKeyup ).removeClass( 'has-success' );
			$( opt.formElemento ).removeClass( 'has-success' );
		}
	});	
},

flushData: function ( data )
{
	var datos = jQuery.extend( true, {}, data );
	this.__flushData( datos );
	return datos;
},

__flushData: function ( data )
{
	if ( jQuery.isPlainObject( data ) )
	{
		var prop = Object.getOwnPropertyNames( data ),
			index = prop.indexOf( 'valor' );

			// alert( prop );

		// ---------- si encuentra la propiedad "valor" es un objeto terminal
	
		if ( index !== -1 )
		{			
			for( var i = 0, lon = prop.length; i < lon; i++)
				if ( index !== i )
				{
					// alert( 'terminal: ' + prop[i] );
					delete data[ prop[ i ] ];
				};
		}

		// ---------- iniciamos recursividad en busqueda de objeto terminal

		else
		{
			for( var i = 0, lon = prop.length; i < lon; i++)
			{
				// alert('recursivo: ' + prop[i])	;
				this.flushData( data[ prop[ i ] ] );
			}			
		}
	}
	else if ( jQuery.isArray( data ) )
	{
		for( var i = 0, lon = data.length; i < lon; i++ )		
			this.flushData( data[ i ] );
	}
},

// --------------------------------------------------------------------------

/**
 * crea la estructura HTML de elementos checks en funcion de los siguientes datos:
 * @param {Object} data - objeto de datos que se estructuraran en los check
 * @param {} campo - 
 * @param {} val - 
 */ 
generaArregloCheck: function ( data, campo, val )
{
	if ( !jQuery.isEmptyObject( data ) )
	{	
		var array = [];

		var html = '<div class="form-group">';

		for ( var i in data )
		{
			var nombreUsuario = this.retornaValCampo( [ data[ i ] ], campo, ' ' ),
				id = 'check_' + i + '_';
				// id = 'check_' + i + '_' + data[ i ][ val ];

			html += '' +
			'<div class="col-md-6">' +
			'	<div class="input-group checkbox-inline">'+
			'		<span class="input-group-addon">'+						
			'			<input id="' + id + '" type="checkbox" value="' + 
						data[ i ][ val ] + '" type="checkbox" />' + nombreUsuario +
			'		</span>'+
			'	</div>' +
			'</div>' ;

			array.push( '#' + id );
		}

		html += '</div>';

		var obj = {
			html: html,
			matrizCheck: array
		}
		return obj;
	}
	else
	{
		return '<h4 class=" text-center " > ' + this.sinRegistros + ' </h4>'
	}
},

/**
 * busca los indices de los elementos propuestos y retorna su posicion
 * @param {Object} data - objeto de datos donde se buscarán los elementos
 * @param {Array} array - arreglo donde se encuentran los elementos por buscar
 * @param {String} campo - campo de data con el cual se comparará la busqueda
 * @return {Array} ind - arreglo con los indices localizados en [data]
 */ 
matrizIndexOfObjeto: function ( data, campo, arr )
{
	if( typeof campo !== 'undefined' )
	{
		var i = 0,
			ind = [],
			indice = null;

		for( i in arr )
		{
			indice = this.indexOfObjeto( data, campo, arr[ i ] );
			indice != -1 ? ind.push( indice ) : null;
		}

		return ind;
	}
	else console.log( 'El parametro [campo] es indefinido' );
},

mtzValidacion: function ( arr )
{
	if ( jQuery.isArray( arr ) && !jQuery.isEmptyObject( arr ) )
	{
		var i = 0,
			lon = arr.length;

		for( i; i < lon; i++ ) 
			if( arr[ i ] === false ) return false;

		return true;
	}

	else
	{
		console.log( 'function [mtzValidacion]: matriz invalida' );
		return false
	}
},

// --------------------------------------------------------------------------

/**
 * Obtiene el valor de los checks seleccionados
 * @param {Array} array - Arreglo de ids html en formato [#idHTML]
 * @return {Array} select - retorna un arreglo de datos [dato1, dato2, ...]
 */ 
getDataChecks: function ( arr )
{
	var i = 0,
		val = null,
		select = [];

	for( i in arr )
	{
		if ( $( arr[ i ] ).prop('checked') )
		{
			val = $( arr[ i ] ).val();
			select.push( val )
		}
	}

	return select;
},

getDataRadio: function ( elem )
{
	var m = document.getElementsByName( elem ),
		i = 0,
		lon = m.length;
	
	for( i ; i < lon; i++ ) 
		if ( m[ i ].checked ) return m[ i ].value;

	return null;
},

habilitarElementos: function ( arr, estado )
{
	for( var i in arr )
	{
		!jQuery.isEmptyObject( arr[ i ].idHTML ) ?
			$( arr[ i ].idHTML ).prop('disabled', estado) : null;
	}
},

habilitarElementoSimple: function ( arr, estado )
{
	for( var i in arr )
	{
		!jQuery.isEmptyObject( arr[ i ] ) ?
			$( arr[ i ] ).prop( 'disabled', estado ) : null;
	}
},

imgError: '<img src="../css/images/error.png"  height="40" width="40" />',
imgLoading: '<img src="../css/images/loader.gif"  height="40" width="40" />',
imgSuccess: '<img src="../css/images/check.png" height="40" width="40" />',

indexOfObjeto: function ( data, campo, val )	
{
	for ( var i in data )
	{
		if ( data[ i ][ campo ] == val ) return i;
	}

	return -1;
},

insertaCombo: function ( data, elem, campo, campoValor, del )
{
	if ( data !== null )
	{
		del = del || ' - '
		var combo = '<option value="">' + this.seleccioneOpcion + '</option>';
		
		/* si el campo es nulo entonces se trata de un array numerico
		 * ascendente de lo contrario los datos se trataran como un
		 * array con campos asociados a nombres
		*/

	
		if( typeof campo === 'undefined' || campo === null )
		{						
			for( var i = 0, lon = data.length; i < lon; i++ )
				combo += '<option value="' + data[ i ] + '" >' + data[ i ] + '</option>';
		} 
		else if ( typeof campo === 'string' )
		{
			var 
				mCampo = this.splitParametros( campo, ',' ),
				mValor = this.retornaValCampo( data, mCampo, del ),
				valor = campoValor || mCampo[ 0 ]; // si hay varios campos como parametro por defecto se asigna el primero

			for( var i = 0, lon = data.length; i < lon; i++ )
				combo += '<option value="' + data[ i ][ valor.trim() ] + '" >' + mValor[ i ] + '</option>';
		}

		// ---------- insertamos html en elem o retornamos el html

		return typeof elem === 'string' ? 
			$( elem ).html( combo ) :
			( elem === false  ? combo : null );
	} 
	else
	{
		// ---------- insertamos html en elem o retornamos el html

		return typeof elem === 'string' ? 
			$( elem ).html( '<option value="">' + this.sinRegistros + '</option>' ) :
			( elem === false  ? '<option value="">' + this.sinRegistros + '</option>' : null );
	}
},

combo: function ( opt )
{
	/*
	 * arr
	 * elem
	 * campo
	 * campoValor
	 * del
	 *
	 */ 

	if ( opt.arr !== null )
	{		
		opt.campo = opt.campo || null;
		opt.del = opt.del || ' - ';
		opt.elem = opt.elem || false;

		var combo = '<option value="">' + this.seleccioneOpcion + '</option>';
		
		/* si el campo es nulo entonces se trata de un array numerico
		 * ascendente de lo contrario los datos se trataran como un
		 * array con campos asociados a nombres
		*/
	
		if( !opt.campo )
		{						
			for( var i = 0, lon = opt.arr.length; i < lon; i++ )
				combo += '<option value="' + opt.arr[ i ] + '" >' + opt.arr[ i ] + '</option>';
		} 

		else
		{
			if ( !opt.campoValor ) opt.campoValor = opt.campo; // si [campoValor] es nulo se toma a [campo] como propiedad
			for( var i = 0, lon = opt.arr.length; i < lon; i++ )
				combo += '<option value="' + $.sigesop.lecturaDeep( opt.arr[ i ], opt.campoValor ) + 
				'" >' + $.sigesop.lecturaDeep( opt.arr[ i ], opt.campo ) + '</option>';		
		}

		// ---------- insertamos html en elem o retornamos el html

		return typeof opt.elem === 'string' ? 
			$( opt.elem ).html( combo ) :
			( opt.elem === false  ? combo : null );
	} 
	else
	{
		// ---------- insertamos html en opt.elem o retornamos el html

		return typeof opt.elem === 'string' ? 
			$( opt.elem ).html( '<option value="">' + this.sinRegistros + '</option>' ) :
			( opt.elem === false  ? '<option value="">' + this.sinRegistros + '</option>' : null );
	}
},

// --------------------------------------------------------------------------

insertaListaSelectable: function ( data, id, campo ) 
{
	if ( data != null && typeof data != 'undefined' )
	{
		var html = '';
		if ( typeof campo == 'undefined' )
		{
			jQuery.each( data, function( i, fila )
			{
				html += '<li class="ui-widget-content">' + fila + '</li>';
			});

			$( id ).html( html );
		} 
		else
		{
			var array = null;

			if ( typeof campo === 'string' )
			{
				array = this.retornaValCampo( data, [campo] );
			} 
			else if ( jQuery.isArray( campo ) ) 
			{
				array = this.retornaValCampo( data, campo, ' ' );
			}
			else
			{
				console.log( 'parametro [campo] no valido en funcion insertaListaSelectable' );	
				return -1;	
			} 
			
			for( var i in array )
			{
				html += '<li class="ui-widget-content">' + array[ i ] + '</li>';
			}

			$( id ).html( html );
		}			
	} 
	else
	{
		$( id ).html( '<h4>' + this.sinRegistros + '</h4>' );
	}
},

lecturaDeep: function ( obj, campo )
{
	var
		m = $.sigesop.splitParametros( campo, ',' );

	for ( var i = 0, lon_i = m.length; i < lon_i; i++ ) // recorremos los campos
	{
		var n = $.sigesop.splitParametros( m[ i ], '.' ), // filtramos los subcampos
			temp = null;

		if ( n.length > 1 )
		{
			temp = obj[ n[ 0 ] ];

			for ( var j = 1, lon_j = n.length; j < lon_j; j++ ) // recorremos los subcampos
			{
				temp = temp[ n[ j ] ];
			}

			return temp;
		}

		else return obj[ m[ i ] ];						
	}
},

retornaValCampo: function ( data, arr, del )
{
	var i = 0,
		j = 0,
		obj = [];

	del = del || '';

	for ( i in data )
	{
		var	val = '',
			campo = null;

		for ( j in arr )
		{
			campo = arr [ j ];
			j != (arr.length - 1) ? val += data [ i ] [ campo ] + del : 
				val += data [ i ] [ campo ];
		}

		obj.push( val );
	}

	return obj;
},

// --------------------------------------------------------------------------	

insertaListaSelectableInfo: function ( data, clasePanelEdicion, campo ) 
{
	if ( data !== null )
	{
		var html = '';
		$.each( data, function( i, item )
		{
			html += '<li class="ui-widget-content">' + data[ i ][ campo ] + '</li>';
		});

		$( clasePanelEdicion + ' ol' ).html( html );
	} 
	else
	{
		$( clasePanelEdicion + ' ol' ).html( '<h4>' + this.sinRegistros + '</h4>' );
	}
	
	$( clasePanelEdicion + ' .well p' ).text( '' ); // borrar la informacion de la caja
},

insertarDatosRespuestaSistema: function ( opt ) 
{
	// Datos
	// clase
	// solicitud
	// sincrono			
	
	// errorRespuesta
	// ________________
	var rutaSolicitud = this.raizServidor + opt.clase + '.php?action=' + opt.solicitud;

	$.ajax({
		data: opt.Datos,
		type: opt.type || 'GET',
		dataType: "json",
		async: opt.sincrono,
		url: rutaSolicitud,
		success: opt.respuesta,
		beforeSend: opt.antesEnviar,
		error: function( jpXHR, estado, error )
		{
			console.log( "Funcion: " + opt.solicitud + "()\n" + "Estado: " + estado + "\nError: " + error);
			$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error' );
			jQuery.isFunction( opt.errorRespuesta ) ? opt.errorRespuesta() : null;
		}
	});
},

insertarDatosSistema: function ( opt )
{
	// Datos
	// clase
	// solicitud
	// sincrono			
	
	// errorRespuesta
	// ________________
	var rutaSolicitud = this.raizServidor+opt.clase+'.php?action='+opt.solicitud;

	$.ajax({
		data: opt.Datos,
		type: opt.type || 'GET',
		dataType: "json",
		async: opt.sincrono,
		url: rutaSolicitud,
		beforeSend: opt.antesEnviar,
		success: function ( data )
		{
			switch( data )
			{
				case 'OK':
					jQuery.isFunction( opt.OK ) ? opt.OK() : null;
					break;
				case 'NA':
					jQuery.isFunction( opt.NA ) ? opt.NA() : null;
					break;
				default:
					jQuery.isFunction( opt.DEFAULT ) ? opt.DEFAULT( data ) : null;
					break;
			}
		},
		error: function( jpXHR, estado, error )
		{
			$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error' );
			console.log( "Funcion: " + opt.solicitud + "()\n" + "Estado: " + estado + "\nError: " + error);			
			jQuery.isFunction( opt.errorRespuesta ) ? opt.errorRespuesta() : null;
		}

	});
},

msgBlockUI: function ( msg, tipo, blockElement, elem )
{
	switch( tipo )
	{
		case 'error':
			var img = $.sigesop.imgError;
			break;
		case 'success':
			var img = $.sigesop.imgSuccess;
			break;
		case 'loading':
			var img = $.sigesop.imgLoading;
			break;

		default:
			var img = '';
			break;
	}

	switch ( blockElement )
	{
		case 'block':
			if ( typeof elem !== 'undefined' && elem !== null ) 
			{
				$( elem ).block({ 
				    message: '<center><h4>' + img + '&nbsp;' + msg + '</h4></center>', 
				    fadeIn: 200, 
				    fadeOut: 200,  
				    showOverlay: true, 
				    centerY: false,
				    css: { 						            	
				        // width: '33%', 
				        // top: '10px', 
				        // left: '', 
				        // right: '10px', 
				        border: 'none',
				        borderRadius: '10px',
				        padding: '5px', 
				        backgroundColor: '#fff', 
				        '-webkit-border-radius': '10px', 
				        '-moz-border-radius': '10px', 
				        // opacity: .6, 
				        color: '#000' 
				    } 
				});	
			}
			else console.log( 'Elemento a bloquear no definido' );
			break;

		case 'msgBlock':
			if ( typeof elem !== 'undefined' && elem !== null ) 
			{
				$( elem ).block({ 
				    message: '<center><h4>' + img + '&nbsp;' + msg + '</h4></center>', 
				    fadeIn: 200, 
				    fadeOut: 200,
				    timeout: 3000, 
				    // showOverlay: false,
				    showOverlay: true,
				    centerY: false,
				    css: { 						            	
				        // width: '33%', 
				        // top: '10px', 
				        // left: '', 
				        // right: '10px', 
				        border: 'none',
				        borderRadius: '10px',
				        padding: '5px', 
				        backgroundColor: '#000', 
				        '-webkit-border-radius': '10px', 
				        '-moz-border-radius': '10px', 
				        // opacity: .6, 
				        color: '#fff' 
				    } 
				});	
			}
			else console.log( 'Elemento a bloquear no definido' );
			break;

		case 'blockUI':
			$.blockUI({ 
			    message: '<center><h4>' + img + '&nbsp;' + msg + '</h4></center>', 
			    fadeIn: 200, 
			    fadeOut: 200,  
			    showOverlay: true, 
			    centerY: false,
			    css: {
			        border: 'none',
			        borderRadius: '10px',
			        padding: '5px', 
			        backgroundColor: '#fff', 
			        '-webkit-border-radius': '10px', 
			        '-moz-border-radius': '10px', 
			        // opacity: .6, 
			        color: '#000' 
			    } 
			});
			break;

		default:
			$.blockUI({ 
			    message: '<center><h4>' + img + '&nbsp;' + msg + '</h4></center>', 
			    fadeIn: 700, 
			    fadeOut: 700, 
			    timeout: 5000, 
			    showOverlay: false, 
			    centerY: false, 
			    css: { 						            	
			        width: '33%', 
			        top: '10px', 
			        left: '', 
			        right: '10px', 
			        border: 'none',
			        borderRadius: '10px',
			        padding: '5px', 
			        backgroundColor: '#000', 
			        '-webkit-border-radius': '10px', 
			        '-moz-border-radius': '10px', 
			        // opacity: .6, 
			        color: '#fff' 
			    } 
			});
			break;
	}
},

requestCloseSesion: function () 
{
	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxSistema',
		solicitud: 'requestCloseSesion',
		respuesta: function( data )
		{
			if ( data == 'OK' ) 
			{
				window.localStorage.removeItem( 'usuario' );
				document.location.href = "../index.php"
			} 
			else console.log( data );
		}
	});
},

seleccioneOpcion: 'SELECCIONE OPCION...',

sinRegistros: 'SIN REGISTROS...',		

// SHA1: function ( cadena ) 
// {
// 	try 
// 	{
// 		var md = forge.md.sha1.create();
// 		md.update( cadena );
// 		return md.digest().toHex();
// 	} 
// 	catch ( e ) 
// 	{
// 		alert( 'Es necesario importar librerias de encriptación para su correcto funcionamiento' );
// 	}
// },

SHA1: function ( str )
{
	//  discuss at: http://phpjs.org/functions/sha1/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Michael White (http://getsprink.com)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	//    input by: Brett Zamir (http://brett-zamir.me)
	//  depends on: utf8_encode
	//   example 1: sha1('Kevin van Zonneveld');
	//   returns 1: '54916d2e62f65b3afa6e192e6a601cdbe5cb5897'

	var rotate_left = function(n, s) {
		var t4 = (n << s) | (n >>> (32 - s));
		return t4;
	};

	/*var lsb_hex = function (val) { // Not in use; needed?
		var str="";
		var i;
		var vh;
		var vl;

		for ( i=0; i<=6; i+=2 ) {
			vh = (val>>>(i*4+4))&0x0f;
			vl = (val>>>(i*4))&0x0f;
			str += vh.toString(16) + vl.toString(16);
		}
		return str;
	};*/

	var cvt_hex = function(val) {
		var str = '';
		var i;
		var v;

		for (i = 7; i >= 0; i--) {
			v = (val >>> (i * 4)) & 0x0f;
			str += v.toString(16);
		}
		return str;
	};

	var blockstart;
	var i, j;
	var W = new Array(80);
	var H0 = 0x67452301;
	var H1 = 0xEFCDAB89;
	var H2 = 0x98BADCFE;
	var H3 = 0x10325476;
	var H4 = 0xC3D2E1F0;
	var A, B, C, D, E;
	var temp;

	str = this.utf8_encode(str);
	var str_len = str.length;

	var word_array = [];
	for (i = 0; i < str_len - 3; i += 4) {
		j = str.charCodeAt(i) << 24 | str.charCodeAt(i + 1) << 16 | str.charCodeAt(i + 2) << 8 | str.charCodeAt(i + 3);
		word_array.push(j);
	}

	switch (str_len % 4) {
		case 0:
			i = 0x080000000;
			break;
		case 1:
			i = str.charCodeAt(str_len - 1) << 24 | 0x0800000;
			break;
		case 2:
			i = str.charCodeAt(str_len - 2) << 24 | str.charCodeAt(str_len - 1) << 16 | 0x08000;
			break;
		case 3:
			i = str.charCodeAt(str_len - 3) << 24 | str.charCodeAt(str_len - 2) << 16 | str.charCodeAt(str_len - 1) <<
			8 | 0x80;
			break;
	}

	word_array.push(i);

	while ((word_array.length % 16) != 14) {
		word_array.push(0);
	}

	word_array.push(str_len >>> 29);
	word_array.push((str_len << 3) & 0x0ffffffff);

	for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
		for (i = 0; i < 16; i++) {
			W[i] = word_array[blockstart + i];
		}
		for (i = 16; i <= 79; i++) {
			W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
		}

		A = H0;
		B = H1;
		C = H2;
		D = H3;
		E = H4;

		for (i = 0; i <= 19; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 20; i <= 39; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 40; i <= 59; i++) {
			temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		for (i = 60; i <= 79; i++) {
			temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
			E = D;
			D = C;
			C = rotate_left(B, 30);
			B = A;
			A = temp;
		}

		H0 = (H0 + A) & 0x0ffffffff;
		H1 = (H1 + B) & 0x0ffffffff;
		H2 = (H2 + C) & 0x0ffffffff;
		H3 = (H3 + D) & 0x0ffffffff;
		H4 = (H4 + E) & 0x0ffffffff;
	}

	temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);
	return temp.toLowerCase();
},

splitParametros: function ( param, del )
{
	var array = [],
		m = param.split( del );

	for( var i = 0, lon = m.length; i < lon; i++ ) array.push( m[ i ].trim() );
	return array;
},

raizServidor: '../ajax/sistema/',	

retornaPosicionSplit: function ( data, posicion, delimitador ) 
{
	var arregloValor = data.split( delimitador ),
		valor = arregloValor[ posicion ];
	return valor.trim();
},

solicitarDatosSistema: function ( opt ) 
{
	// clase
	// solicitud
	// sincrono
	// respuesta
	// errorRespuesta
	// ________________
	var rutaSolicitud = this.raizServidor + opt.clase + '.php?action=' + opt.solicitud;

	$.ajax({
		type: opt.type || 'GET',
		dataType: "json",
		async: opt.sincrono,
		url: rutaSolicitud,
		success: opt.respuesta,
		error: function(jpXHR, estado, error)
		{
			console.log( "Funcion: " + opt.solicitud +"()\n" + "Estado: " + estado + "\nError: " + error);
			$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error' );
			jQuery.isFunction( opt.errorRespuesta ) ? opt.errorRespuesta() : null;
		}

	});
},

tablaRegistro: function ( opt )
{
	/*
	 * head
	 * body
	 * campo
	 * val_campo
	 * color_fila
	 */

	 opt.suf = opt.suf || '_';
	 opt.color_fila = opt.color_fila || 'success';

	var 
		struct_head = function ( arr )
		{
			if ( !jQuery.isEmptyObject( arr ) )
			{
				var 
					m = $.sigesop.splitParametros( arr, ',' ),
					i = 0,
					lon = m.length,
					head = '<tr>';

				for( i; i < lon; i++ )
					head += '<th>' + m[ i ] + '</th>';

				head += '</th>';

				return head;
			}

			else 
			{
				console.log( '[arr] es nulo' );
				return '';
			}
		},

		struct_body = function ( arr, campo )
		{
			if ( !jQuery.isEmptyObject( arr ) && campo )
			{
				/*
				 * estructurar los tokens de los campos, las cadenas validas para su lectura
				 * son del formato: 
				 * 'campo_1, campo_2, campo_3' y 'campo_1.sub_1, campo_2.sub_1, campo_3.sub_1'
				 */ 
				
				var 					
					m = $.sigesop.splitParametros( campo, ',' ), // filtramos los campos
					body = '';

				// ----------------------------------------------------				

				for ( var k = 0, lon_k = arr.length; k < lon_k; k++ )
				{
					body += '<tr class="' + opt.color_fila + '">';

					for ( var i = 0, lon_i = m.length; i < lon_i; i++ ) // recorremos los campos
					{
						var n = $.sigesop.splitParametros( m[ i ], '.' ), // filtramos los subcampos
							temp = null;

						if ( n.length > 1 )
						{
							temp = arr[ k ][ n[ 0 ] ];

							for ( var j = 1, lon_j = n.length; j < lon_j; j++ ) // recorremos los subcampos
							{
								temp = temp[ n[ j ] ];
							}
						}

						else temp = arr[ k ][ m[ i ] ];

						body += '<td>' + temp + '</td>';
					}

					body += '</tr>';
				}				

				// ----------------------------------------------------

				// var 
				// 	i = 0,
				// 	lon_i = arr.length;

				// for( i ; i < lon_i; i++ )
				// {
				// 	body += '<tr class="' + opt.color_fila + '">';					
				// 	for ( var j = 0, lon_j = m.length; j < lon_j; j++ )
				// 	{
				// 		body += '<td>' + arr[ i ][ m[j] ] + '</td>';
				// 	}					
				// 	body += '</tr>';
				// }

				return body;
			}

			else 
			{
				console.log( '[arr || campo] es nulo' );
				return '';
			}
		},

		update_table = function ( arr )
		{
			var body = struct_body( arr, opt.campo )
			$( '#tablaBody_registro_' + opt.suf ).html( body );
		};

	var 
		head = struct_head ( opt.head ),

		body = struct_body ( opt.body, opt.campo ),

		html =
			'<div class="panel panel-default">' +
			'<div class="table-responsive">' +
			'	<table class="table  table-bordered table-hover">' +
			'		<thead id="tablaHead_registro_' + opt.suf + '" >' + head + '</thead>' +
			'		<tbody id="tablaBody_registro_' + opt.suf + '" >' + body + '</tbody>' +
			'	</table>' +
			'</div></div><br>',

		doc = {
			html: html,

			// javascript: function ()
			// {

			// },

			update_table: update_table,

			IDS:
			{
				head: '#tablaHead_registro_' + opt.suf,
				body: '#tablaBody_registro_' + opt.suf
			}
		};

	return doc;
},

tablaSeleccion: function ( opt )
{
	/*
	 * head
	 * body
	 * tipo
	 * campo
	 * val_campo
	 * color_fila
	 * color_select
	 */

	 opt.tipo = opt.tipo || 'radio';
	 opt.suf = opt.suf || '_';
	 opt.color_fila = opt.color_fila || '';
	 opt.color_select = opt.color_select || 'success';

	var 
		matriz_input = [],

		elem_anterior = null,

		tipo_input = function ( tipo, secuencia, full )
		{
			if ( typeof full == 'undefined' ) full = true; // bandera para retornar sólo ID o cadena completa.

			switch ( tipo )
			{
				case 'radio':
					return full ? 
						'name="name_seleccion_' + opt.suf +'" value="' + secuencia + '"':
						'name_seleccion_' + opt.suf;

				case 'checkbox':
					return full ?
						'id="id_seleccion_' + secuencia + '" value="' + secuencia + '"':
						'id_seleccion_' + secuencia;

				default: // si es un valor invalido retorna un "radio" por defecto
					return full ? 
						'name="name_seleccion_' + opt.suf +'" value="' + secuencia + '"':
						'name_seleccion_' + opt.suf;
			}
		},

		struct_head = function ( arr )
		{
			if ( !jQuery.isEmptyObject( arr ) )
			{
				var 
					m = $.sigesop.splitParametros( arr, ',' ),
					i = 0,
					lon = m.length,
					head = '<tr><th></th>';

				for( i; i < lon; i++ )
					head += '<th>' + m[ i ] + '</th>';

				head += '</th>';

				return head;
			}

			else 
			{
				console.log( '[arr] es nulo' );
				return '';
			}
		},

		struct_body = function ( arr, campo )
		{
			if ( !jQuery.isEmptyObject( arr ) && campo )
			{
				var 					
					m = $.sigesop.splitParametros( campo, ',' ),				
					body = '';

				for( var i = 0, lon_i = arr.length; i < lon_i; i++ )
				{
					body += '<tr class="' + opt.color_fila + '"><td><center><input type="' + opt.tipo + 
							'" ' + tipo_input( opt.tipo, i ) + ' /></center></td>';	

					matriz_input.push( tipo_input( opt.tipo, i, false ) ); // guardamos los ID'S o NAME en matriz pública
					
					for ( var j = 0, lon_j = m.length; j < lon_j; j++ )
					{
						body += '<td>' + arr[ i ][ m[j] ] + '</td>';
					}

					body += '</tr>';
				}

				return body;
			}

			else 
			{
				console.log( '[arr || campo] es nulo' );
				return '';
			}
		},

		update_table = function ( arr )
		{
			var body = struct_body( arr, opt.campo )
			$( '#tablaBody_seleccion_' + opt.suf ).html( body );
			run_javascript( matriz_input );
		}, 

		change_radio = function ( event )
		{
			if ( elem_anterior ) 
			{
				// console.log( 'OK [change_radio]' );
				elem_anterior.removeClass();
				elem_anterior.addClass( opt.color_fila );
			} 

			// else console.log( '[elem_anterior] es nulo' );

			$( this ).parents( 'tr' ).addClass( opt.color_select );
			elem_anterior = $( this ).parents( 'tr' );
		},

		change_checkbox = function ( event )
		{
			if ( $( this ).prop( 'checked' ) )
				$( this ).parents( 'tr' ).addClass( opt.color_select );

			else
			{
				$( this ).parents( 'tr' ).removeClass();
				$( this ).parents( 'tr' ).addClass( opt.color_fila );
			}
		},

		run_javascript = function ( mtz )
		{
			if ( !jQuery.isEmptyObject( mtz ) )
			{
				if ( opt.tipo === 'radio' )
					$( 'input[name="' + mtz[ 0 ] + '"]' ).change( change_radio );
				
				else if ( opt.tipo === 'checkbox' )
				{
						for( var i = 0, lon = mtz.length; i < lon; i++ )
							$( '#' + mtz[ i ] ).change( change_checkbox );					
				}

				else console.log( 'tipo de elemento no válido para efecto [change]' );
			}

			else console.log( 'Matriz [matrizInput] es nula' );
		};

	var 
		head = struct_head ( opt.head ),

		body = struct_body ( opt.body, opt.campo ),

		html =
			'<div class="panel panel-default">' +
			'<div class="table-responsive">' +
			'	<table class="table  table-bordered table-hover">' +
			'		<thead id="tablaHead_seleccion_' + opt.suf + '" >' + head + '</thead>' +
			'		<tbody id="tablaBody_seleccion_' + opt.suf + '" >' + body + '</tbody>' +
			'	</table>' +
			'</div></div><br>',

		doc = {
			html: html,

			// javascript: function ()
			// {				
			// 	if ( opt.tipo === 'radio' )
			// 		$( 'input[name="' + this.matrizInput[ 0 ] + '"]' ).change( change_radio );
				
			// 	else if ( opt.tipo === 'checkbox' )
			// 	{
			// 		if ( !jQuery.isEmptyObject( this.matrizInput ) )
			// 		{
			// 			for( var i = 0, lon = this.matrizInput.length; i < lon; i++ )
			// 				$( '#' + this.matrizInput[ i ] ).change( change_checkbox );
			// 		}

			// 		else console.log( 'Matriz [matrizInput] es nula' );
			// 	}

			// 	else console.log( 'tipo de elemento no válido para efecto [change]' );
			// },

			// javascript: function ()
			// {				
			// 	if ( opt.tipo === 'radio' )
			// 		$( 'input[name="' + this.matrizInput[ 0 ] + '"]' ).change( change_radio );
				
			// 	else if ( opt.tipo === 'checkbox' )
			// 	{
			// 		if ( !jQuery.isEmptyObject( this.matrizInput ) )
			// 		{
			// 			for( var i = 0, lon = this.matrizInput.length; i < lon; i++ )
			// 				$( '#' + this.matrizInput[ i ] ).change( change_checkbox );
			// 		}

			// 		else console.log( 'Matriz [matrizInput] es nula' );
			// 	}

			// 	else console.log( 'tipo de elemento no válido para efecto [change]' );
			// },

			update_table: update_table,

			IDS:
			{
				head: '#tablaHead_seleccion_' + opt.suf,
				body: '#tablaBody_seleccion_' + opt.suf
			},

			matrizInput: matriz_input
		};

	return doc;
},

utf8_decode: function ( str_data ) 
{
	//  discuss at: http://phpjs.org/functions/utf8_decode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	//    input by: Aman Gupta
	//    input by: Brett Zamir (http://brett-zamir.me)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: Norman "zEh" Fuchs
	// bugfixed by: hitwork
	// bugfixed by: Onno Marsman
	// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// bugfixed by: kirilloid
	//   example 1: utf8_decode('Kevin van Zonneveld');
	//   returns 1: 'Kevin van Zonneveld'

	var tmp_arr = [],
	i = 0,
	ac = 0,
	c1 = 0,
	c2 = 0,
	c3 = 0,
	c4 = 0;

	str_data += '';

	while (i < str_data.length) 
	{
		c1 = str_data.charCodeAt(i);
		if (c1 <= 191) {
		  tmp_arr[ac++] = String.fromCharCode(c1);
		  i++;
		} else if (c1 <= 223) {
		  c2 = str_data.charCodeAt(i + 1);
		  tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
		  i += 2;
		} else if (c1 <= 239) {
		  // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
		  c2 = str_data.charCodeAt(i + 1);
		  c3 = str_data.charCodeAt(i + 2);
		  tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
		  i += 3;
		} else {
		  c2 = str_data.charCodeAt(i + 1);
		  c3 = str_data.charCodeAt(i + 2);
		  c4 = str_data.charCodeAt(i + 3);
		  c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
		  c1 -= 0x10000;
		  tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
		  tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
		  i += 4;
		}
	}

	return tmp_arr.join('');
},

utf8_encode: function ( argString ) 
{
	//  discuss at: http://phpjs.org/functions/utf8_encode/
	// original by: Webtoolkit.info (http://www.webtoolkit.info/)
	// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// improved by: sowberry
	// improved by: Jack
	// improved by: Yves Sucaet
	// improved by: kirilloid
	// bugfixed by: Onno Marsman
	// bugfixed by: Onno Marsman
	// bugfixed by: Ulrich
	// bugfixed by: Rafal Kukawski
	// bugfixed by: kirilloid
	//   example 1: utf8_encode('Kevin van Zonneveld');
	//   returns 1: 'Kevin van Zonneveld'

	if (argString === null || typeof argString === 'undefined') {
		return '';
	}

	var string = (argString + ''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");
	var utftext = '',
	start, end, stringl = 0;

	start = end = 0;
	stringl = string.length;
	for (var n = 0; n < stringl; n++) 
	{
		var c1 = string.charCodeAt(n);
		var enc = null;

		if (c1 < 128) {
		  end++;
		} else if (c1 > 127 && c1 < 2048) {
		  enc = String.fromCharCode(
		    (c1 >> 6) | 192, (c1 & 63) | 128
		  );
		} else if ((c1 & 0xF800) != 0xD800) {
		  enc = String.fromCharCode(
		    (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
		  );
		} else { // surrogate pairs
		  if ((c1 & 0xFC00) != 0xD800) {
		    throw new RangeError('Unmatched trail surrogate at ' + n);
		  }
		  var c2 = string.charCodeAt(++n);
		  if ((c2 & 0xFC00) != 0xDC00) {
		    throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
		  }
		  c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
		  enc = String.fromCharCode(
		    (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
		  );
		}
		if (enc !== null) {
		  if (end > start) {
		    utftext += string.slice(start, end);
		  }
		  utftext += enc;
		  start = end = n + 1;
		}
	}

	if (end > start) {
		utftext += string.slice(start, stringl);
	}

	return utftext;
},

vaciarCampos: function ( array )
{
	for( var i in array )
	{
		if ( jQuery.isArray( array[ i ] ) ) 
		{
			array[ i ] = [];
		}
		else if ( !jQuery.isEmptyObject( array[ i ].idHTML ) )
		{
			$( array[ i ].idHTML ).val( '' );
			!jQuery.isEmptyObject ( array[ i ].valor ) ? array[ i ].valor = null : null;
		}
		
	}

	return array;
},

vaciarParrafoStatus: function ( array )
{
	for( var i in array )
	{
		if ( !jQuery.isEmptyObject( array[ i ] ) ) $( array[ i ] ).empty();
	}
},

// ---------- validacion ---------------------------------------------------------------------------------------------

validacion: function ( array, opt )
{
	if ( !jQuery.isEmptyObject( array ) )
	{
		var mtz = [],
			i = 0,
			lon = array.length;

		for( i; i < lon; i++ )
		{
			var fila = array[ i ];		

			// ---------- validacion cuando se trata de un objeto con propiedades

			if ( jQuery.isPlainObject( fila ) )
			{			
				var propObj = Object.getOwnPropertyNames( fila );

				// ---------- verificar que sea un objeto terminal

				if 	( propObj.indexOf( 'valor' ) !== -1 )
				{
					if ( fila.valor ) 
					{
						if ( typeof fila.regexp !== 'undefined' )
						{
							// var regexp = fila.regexp;
							if ( fila.regexp.test( fila.valor ) ) 
							{
								$( fila.idValidacion ).removeClass( 'has-' + opt.tipoValidacion );
								$.sigesop.vaciarPopover( [ fila ] );
								mtz [ i ] = true;
							}
							else
							{
								fila.idValidacion ? $( fila.idValidacion ).addClass( 'has-' + opt.tipoValidacion ) : null;
								mtz[ i ] = false;

								// ---------- agrega un popover a la validacion

								$.sigesop.agregarPopover( [ fila ] );
								console.log( 'Expresion Regular no valida: ' + fila.idHTML );
							}
						}
						else
						{	
							$( fila.idValidacion ).removeClass( 'has-' + opt.tipoValidacion );
							$.sigesop.vaciarPopover( [ fila ] );
							mtz [ i ] = true;
						}
					}
					else
					{
						typeof opt.tipoValidacion !== 'undefined' ?
							$( fila.idValidacion ).addClass( 'has-' + opt.tipoValidacion ): null;

						mtz[ i ] = false;

						// ---------- agrega un popover a la validacion

						$.sigesop.agregarPopover( [ fila ] );

						console.log( 'Elemento no valido: ' + fila.idHTML );
					} 					
				}

				// --------- inicia recursividad del objeto

				else if ( fila ) // descartamos un objeto vacio
				{				
					// ---------- capturamos los objetos que contiene el objeto superior
						
					var m = [],
						j = 0,
						lon_j = propObj.length;

					for ( j; j < lon_j; j++ ) m.push( fila[ propObj[ j ] ] ); 

					mtz [ i ] = this.validacion( m , opt );					
				} else console.log( 'Objeto [' + fila + '] esta vacio');
			}

			// ---------- validacion cuando se trata de un array

			else if( jQuery.isArray( fila ) )
			{
				var estado = jQuery.isEmptyObject( fila );				
				if ( estado ) 
				{						
					mtz[ i ] = false;
					console.log( 'Matriz [' + fila + '] no valida' );
				} 
				else mtz [ i ] = true;
			}

			// ---------- si no corresponde a un objeto o a una matriz; es un elemento no valido y se descarta

			// else
			// {
			// 	console.log( 'Elemento: [' + fila + '] ignorado' );
			// 	mtz[ i ] = true;
			// }
		}

		// ----------- si no verificó ningun elemento es falso

		if ( jQuery.isEmptyObject( mtz ) ) return false;

		// ----------------- verifica si el arreglo tiene algun false
	
		for ( var i = 0; i < mtz.length; i++ ) 
			if ( mtz[ i ] === false ) return false;

		return true;
	}	

	console.log( 'matriz por validar es nula' );
	return false;
},

/*
 * Agrega un arreglo de popovers al elemento indicado
 */ 
agregarPopover: function( array )
{
	for ( var i = 0, lon = array.length; i < lon; i++ )
	{
		if ( typeof array[ i ].popover != 'undefined' ) 
		{
			$( array[ i ].idHTML ).popover({
				title: array [ i ].popover.title,
				content: array [ i ].popover.content,
				placement: array [ i ].popover.placement,
				html: true,
				// template: '<div bgcolor="#FF0000" class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title">test</h3><div class="popover-content" ></div></div>'
			});

			$( array[ i ].idHTML ).popover( 'show' );
		}
	}
},

/*
 * vacia un arreglo de popovers 
 */ 
vaciarPopover: function( array )
{
	for( var i in array )
	{
		if ( typeof array [ i ].popover != 'undefined' ) 
		{
			$( array [ i ].idHTML ).popover( 'destroy' );
		}
	}
},

// -------------------------------------------------------------------------------------------------------------------

/**
 * crea la estructura HTML y javascript correspondiente el cierre de sesion
 * @param {Object} opt - objeto con propiedades	 
 */ 	
ventanaEmergente: function ( opt ) 
{
	/*
	 * 	OPCIONES POSIBLES:
	 *
	 * 	idDiv {String} : 			identificador HTML de la ventana emergente
	 *
	 * 	titulo {String} : 			titulo de la ventana emergente	
	 *
	 * 	idBody {String} : 			identificador HTML del cuerpo de la ventana emergente
	 *
	 *	idModal {String} : 			identificador HTML del cuerpo "modal" de la ventana
	 *								emergente. Permite manipular los efectos de ventana
	 *								bloqueda, si salir del margen de la ventana emergente
	 *
	 * 	idBtnCerrar {String} : 		identificador HTML del boton "Cerrar"
	 *
	 * 	idBtnOK {String} : 			identificador HTML del boton "Aceptar"
	 *
	 * 	clickCerrar {function} : 	callback de evento click del boton "Cerrar"
	 *
	 * 	clickAceptar {function} : 	callback de evento click del boton "Aceptar"
	 *
	 * 	showBsModal {function} : 	callback invocado antes de la ejecucion y visualizacion de
	 *								ventana emergente
	 *
	 * 	hiddenBsModal {function} : 	callback invocado despues de cerrar la ventana emergente
	 *
	 * 	shownBsModal {function} : 	callback invocado cuando la ventana es visible
	 *
	 * 	hideBsModal {function} :  	callback invocado cuando la ventana es visible pero esta por cerrarse
	 *
	 *	keyboard {Boolean} : 		bandera de configuracion que permite a la ventana
	 *								emergente cerrar con el boton [esc]
	 */

	 // --------- valores por defecto

	 // opt.suf = opt.suf || '_suf';
	 opt.idDiv = opt.idDiv || '__win_idDiv_';
	 opt.idBtnCerrar = opt.idBtnCerrar || opt.idDiv + '__btnCerrar';
	 opt.idBtnOK = opt.idBtnOK || opt.idDiv + '__btnOK';
	 opt.idModal = opt.idModal || opt.idDiv + '_modal';
	 opt.titulo = opt.titulo || 'Mensaje del Sistema';
	 opt.idBody = opt.idBody || opt.idDiv + '__divBoby';
	 opt.keyboard = opt.keyboard || true;

	var 
		ventana =
			'<div class="modal fade" id="' + opt.idDiv + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
			'	<div class="modal-dialog modal-lg">'+
			'    	<div id="' + opt.idModal + '" class="modal-content">'+

			'    		<div class="modal-header">'+
			'        		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
			'        		<h4 class="modal-title" >' + opt.titulo + '</h4>'+
			'	    	</div>'	+

			'	    	<div id="' + opt.idBody + '" class="modal-body"></div>'+

			'		    <div class="modal-footer">'+
			'		        <button id="' + opt.idBtnCerrar + '" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>'+
			'		        <button id="' + opt.idBtnOK + '" type="button" class="btn btn-success">Aceptar</button>'+
			'		    </div>'+

			'    	</div>'+
			'	</div>'+
			'</div>';

	$( 'body' ).append( ventana );

	$( '#' + opt.idDiv ).on( 'show.bs.modal', function( e )
	{				
		$( '#' + opt.idBtnCerrar ).on( 'click', opt.clickCerrar );
		$( '#' + opt.idBtnOK ).on( 'click', opt.clickAceptar );
		jQuery.isFunction( opt.showBsModal ) ? opt.showBsModal() : null;
	});				

	$( '#' + opt.idDiv ).on( 'hidden.bs.modal', function( e ) 
	{
		$( '#' + opt.idBtnCerrar ).off( 'click' );
		$( '#' + opt.idBtnOK ).off( 'click' );
		$( '#' + opt.idDiv ).remove();

		jQuery.isFunction( opt.hiddenBsModal ) ? opt.hiddenBsModal() : null;				
	});

	$( '#' + opt.idDiv ).on( 'shown.bs.modal', opt.shownBsModal );
	$( '#' + opt.idDiv ).on( 'hide.bs.modal', opt.hideBsModal );
	
	// lanzamos la ventana
	$( '#' + opt.idDiv ).modal({ 
		keyboard: opt.keyboard,
		backdrop: 'static'
	});

	return ventana = {
		idDiv: '#' + opt.idDiv,
		idBtnCerrar: '#' + opt.idBtnCerrar,
		idBtnOK: '#' + opt.idBtnOK,
		idModal: '#' + opt.idModal,
		// titulo: opt.titulo,
		idBody: '#' + opt.idBody,
		keyboard: opt.keyboard
	}
},

verificaRoot: function ( data, jsonFunctions ) 
{
	var rutaSolicitud = $.sigesop.rutaServidor + 'verificaRoot';
	$.ajax({
		data: data,
		type: "POST",
		async: false,
		dataType: "json",
		url: rutaSolicitud,
		success: function( data ){
				switch (data)
				{
					case 'OK':
						jsonFunctions.OK();
						break;
					case 'NA':
						jsonFunctions.NA();
						break;
					default:
						jsonFunctions.DEFAULT(data);
						break;
				}
		},
		error: function(jpXHR, estado, error){
			console.log( "Funcion: verificaRoot()\n" + "Estado: " + estado + "\nError: " + error );	
		}
	});	
}

}

})(jQuery);

} catch (e) {	
	alert(e + '. La libreria jQuery es requerida para el correcto funcionamiento de la webapp');
}