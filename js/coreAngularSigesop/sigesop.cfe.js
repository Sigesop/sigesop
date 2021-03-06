(function () {
	sigesop = {
		barraHerramientas: function () {
			// elem = elem || this;
			var elem = this;
			var

			struct_barra = function( data ) {
				if ( data == null ) {
					console.log( 'function: barraHerramientas --> [data] es nulo' )
					return null;
				}

				/* configuramos al usuario root en el navegador
				 * preguntando al servidor
				 */
				sigesop.root = data.root;

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

					htmlUserManual =
						'<li>' +
							'<a id="btn-user-manual" href="#">' +
								'Guia de usuario' +
							'</a>' +
						'</li>',

					nivelActivo1 = false,
					nivelActivo2 = false,
					nivelActivo3 = false,
					nivelActivo4 = false,
					nivelActivo_usuario = false;

				for( var i = 0, lon = data.data.length; i < lon; i++ ) {

					var row = data.data[ i ];
					switch( row.nivelBarra ) {
						case 1:
							n1 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
							nivelActivo1 = true;
							break;
						case 2:
							n2 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
							nivelActivo2 = true;
							break;
						case 3:
							n3 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
							nivelActivo3 = true;
							break;
						case 4:
							n4 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
							nivelActivo4 = true;
							break;
						case 0:
							n_usuario += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
							nivelActivo_usuario = true;
							break;
					}
				}

				n2 += '</ul></li>';
				n3 += '</ul></li>';
				n4 += '</ul></li>';

				html +=
					'<nav class="navbar navbar-cfe navbar-static-top navbar-fixed-top" role="navigation">'+
						'<div class="container-fluid">'+
							'<div class="navbar-header">'+
								'<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#barraNavegacion">'+
									'<span class="glyphicon glyphicon-home"></span>'+
								'</button>'+
							'</div>'+
							'<div id="barraNavegacion" class="collapse navbar-collapse bs-navbar-collapse">'+
								'<ul class="nav navbar-nav">';

					nivelActivo1 ? 	html +=	n1 : null;
					nivelActivo2 ? 	html +=	n2 : null;
					nivelActivo3 ? 	html +=	n3 : null;
					nivelActivo4 ? 	html +=	n4 : null;
					nivelActivo_usuario ? 	html +=	n_usuario : null;
					html += data.userManual ? htmlUserManual : '';

					html += '</ul>'+
								'<ul class="nav navbar-nav navbar-right">'+
									'<li><a href="javascript: sigesop.cerrarSesion()"> Cerrar Sesión  <span class="glyphicon glyphicon-off"></span> </a></li>'+
								'</ul>'+
							'</div>'+
						'</div>'+
					'</nav>';

				$( elem ).html( html );
				$( '#btn-user-manual' ).on( 'click', function( e ){
					var win = window.open( data.userManual );
					win.focus();
				})
			};

			// ejecutamos ajax de peticion de datos
			sigesop.query({
				class: 'sistema',
				query: 'insertaBarraHerramientasRolUsuario',
				success: struct_barra
			});

			return this;
		},

		_barraHerramientas: function () {
			// elem = elem || this;
			var elem = this;
			var

			struct_barra = function( data ) {
				if ( data == null ) {
					console.log( 'function: barraHerramientas --> [data] es nulo' )
					return null;
				}

				/* configuramos al usuario root en el navegador
				 * preguntando al servidor
				 */
				// sigesop.root = data.root;

				var $menu = $('<div></div>')
					.addClass('collapse navbar-collapse bs-navbar-collapse');

				var $listElements = $('<ul></ul>')
					.addClass('nav navbar-nav');

				var $listElementsRight = $('<ul></ul>')
					.addClass('nav navbar-nav navbar-right')
					.append('<li><a href="javascript: sigesop.cerrarSesion()"> Cerrar Sesión  <span class="glyphicon glyphicon-off"></span> </a></li>')

				$.each( data.data, function ( i, row ) {					
					if ( row.nivelBarra != 1 ) {
						var $ul = $( '<ul></ul>' )
							.addClass( 'dropdown-menu' );

						$.each( row.data, function ( j, _row ) {
							$ul.append(
								$( '<li></li>' )
								.append(
									$( '<a></a>' ).prop( 'href', _row.paginaAcceso )
									.html( _row.nombrePagina )
								)
							)
						});

						var $li = $('<li></li>')
							.addClass('dropdown')
							.append(
								$( '<a href="#">Catálogos</a>' )
								.attr({
									'data-toggle': 'value2'
								})
								.addClass( 'dropdown-toggle' )
								.html( row.title )
								.append( '<b class="caret"></b>' )
							)
							.append( $ul );

						$listElements.append( $li );
					}

					else {
						$.each( row.data, function ( j, _row ) {
							$listElements.append(
								$( '<li></li>' ).append(
									$( '<a></a>' ).prop( 'href', _row.paginaAcceso )
									.html( _row.nombrePagina )
								)
							)
						});
					}
				});



				var $nav = $('<nav></nav>')
					.attr({
						'role': 'navigation',
					})
					.addClass('navbar navbar-cfe navbar-static-top navbar-fixed-top')
					.append(
						$('<div class="container-fluid"></div>')
						.append(
							$('<div class="navbar-header"></div>')
							.append(
								$('<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#barraNavegacion"></button>')
								.append('<span class="glyphicon glyphicon-home"></span>')
							)
						)
						.append(
							$menu.append( $listElements	)
							.append( $listElementsRight )
						)
					);

				$( elem ).html( $nav );
				// $( '#btn-user-manual' ).on( 'click', function( e ){
				// 	var win = window.open( data.userManual );
				// 	win.focus();
				// })

				// switch( row.nivelBarra ) {
				// 	case 1:

				// 		n1 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 		nivelActivo1 = true;
				// 		break;
				// 	case 2:
				// 		n2 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 		nivelActivo2 = true;
				// 		break;
				// 	case 3:
				// 		n3 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 		nivelActivo3 = true;
				// 		break;
				// 	case 4:
				// 		n4 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 		nivelActivo4 = true;
				// 		break;
				// 	case 0:
				// 		n_usuario += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 		nivelActivo_usuario = true;
				// 		break;
				// }

				// var
				// 	html = '',

				// 	n1 = '',

				// 	n2 = '<li class="dropdown">' +
				// 			 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Catálogos<b class="caret"></b></a>'+
				// 			 '<ul class="dropdown-menu">',

				// 	n3 = '<li class="dropdown">'+
				// 			 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Mantenimiento<b class="caret"></b></a>'+
				// 			 '<ul class="dropdown-menu">',

				// 	n4 = '<li class="dropdown">'+
				// 			 '<a href="#" class="dropdown-toggle" data-toggle="dropdown">Operación<b class="caret"></b></a>'+
				// 			 '<ul class="dropdown-menu">',

				// 	n_usuario = '',

				// 	htmlUserManual =
				// 		'<li>' +
				// 			'<a id="btn-user-manual" href="#">' +
				// 				'Guia de usuario' +
				// 			'</a>' +
				// 		'</li>',

				// 	nivelActivo1 = false,
				// 	nivelActivo2 = false,
				// 	nivelActivo3 = false,
				// 	nivelActivo4 = false,
				// 	nivelActivo_usuario = false;

				// for( var i = 0, lon = data.data.length; i < lon; i++ ) {

				// 	var row = data.data[ i ];
				// 	switch( row.nivelBarra ) {
				// 		case 1:
				// 			n1 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 			nivelActivo1 = true;
				// 			break;
				// 		case 2:
				// 			n2 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 			nivelActivo2 = true;
				// 			break;
				// 		case 3:
				// 			n3 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 			nivelActivo3 = true;
				// 			break;
				// 		case 4:
				// 			n4 += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 			nivelActivo4 = true;
				// 			break;
				// 		case 0:
				// 			n_usuario += '<li><a href="' + row.paginaAcceso + '">' + row.nombrePagina + '</a></li>';
				// 			nivelActivo_usuario = true;
				// 			break;
				// 	}
				// }

				// n2 += '</ul></li>';
				// n3 += '</ul></li>';
				// n4 += '</ul></li>';

				// html +=
				// 	''+
				// 		''+
				// 			''+
				// 				''+
				// 					''+
				// 				''+
				// 			''+
				// 			''+
				// 				'';

				// 		nivelActivo1 ? 	html +=	n1 : null;
				// 		nivelActivo2 ? 	html +=	n2 : null;
				// 		nivelActivo3 ? 	html +=	n3 : null;
				// 		nivelActivo4 ? 	html +=	n4 : null;
				// 		nivelActivo_usuario ? 	html +=	n_usuario : null;
				// 		html += data.userManual ? htmlUserManual : '';

				// 		html += ''+

				// 				''+
				// 					''+
				// 				''+
				// 			''+
				// 		''+
				// 	'';
			};

			// ejecutamos ajax de peticion de datos
			sigesop.query({
				class: 'sistema',
				query: 'insertaBarraHerramientasRolUsuario',
				success: struct_barra
			});

			return this;
		},

		cargandoDatos: 'CARGANDO DATOS...',

		cerrarSesion: function () {
			var

			action = function ( dialog ){
		 		sigesop.msgBlockUI( 'Cerrando sesion...', 'loading', 'blockUI' );
				sigesop.query({
					class: 'sistema',
					query: 'requestCloseSesion',
					success: function( data ) {
						if ( data == 'OK' ) {
							window.localStorage.removeItem( 'rpe' );
							window.localStorage.removeItem( 'usuario' );
							window.localStorage.removeItem( 'indexUsuario' );
							document.location.href = "../index.php"
						}
					}
				});
		 	},

		    win = BootstrapDialog.show({
		        title: 'Cierre de sesión',
		        type: BootstrapDialog.TYPE_DEFAULT,
		        message: '<div class="alert alert-warning text-center"><p><h4>¿Está seguro de cerrar sesión?</h4></p></div>',
		        size: BootstrapDialog.SIZE_NORMAL,
		        closable: true,
		        draggable: true,
		        buttons: [{
		            label: 'Cancelar',
		            action: function( dialog ) {
		                dialog.close();
		            }
		        },{
		            label: 'Aceptar',
		            cssClass: 'btn-danger',
		            action: action
		        }]
		    });
		},

		completeCampos: function () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); },

		toUpperCase: function ( elem, callback ) {
			elem = elem || this;
			$( elem ).change( function(event)
			{
				var valor = $( this ).val();
				$( this ).val( valor.toUpperCase() );
				if ( typeof callback === 'function' ) callback();
			});

			return this;
		},

		flushData: function ( data ) {
			var datos = jQuery.extend( true, {}, data );
			this.__flushData( datos );
			return datos;
		},

		__flushData: function ( data ) {
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

		/* verifica que exista al menos un elemento valido
		 * dentro de un arreglo de datos
		 */
		isNotEmpty: function ( arr, field ) {
			var
				i = 0,
				lon = arr.length,
				row = null;

			for ( i ; i < lon ; i++ ) {
				row = this.lecturaDeep( arr[ i ], field );
				if ( row ) return true;
			}

			return false;
		},
		
	    /**
	     * RFC4122 version 4 compliant unique id creator.
	     *
	     * Added by https://github.com/tufanbarisyildirim/
	     *
	     *  @returns {String}
	     */
	    newId: function() {
	        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
	            return v.toString(16);
	        });
	    },

		getDataChecks: function ( arr ) {
			/* Obtiene el valor de los checks seleccionados
			 * @param {Array} array - Arreglo de ids html en formato [#idHTML]
			 * @return {Array} select - retorna un arreglo de datos [dato1, dato2, ...]
			 */
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

		getDataRadio: function ( elem ) {
			var m = document.getElementsByName( elem ),
				i = 0,
				lon = m.length;

			for( i ; i < lon; i++ )
				if ( m[ i ].checked ) return m[ i ].value;

			return null;
		},

		imgError: '<img src="../css/images/error.png"  height="40" width="40" />',
		imgLoading: '<img src="../css/images/loader.gif"  height="40" width="40" />',
		imgSuccess: '<img src="../css/images/check.png" height="40" width="40" />',
		imgWarning: '<img src="../css/images/warning.png"  height="40" width="40" />',

		indexOfObjeto: function ( data, campo, val ) {
			for ( var i in data )
			{
				if ( data[ i ][ campo ] == val ) return i;
			}

			return -1;
		},

		combo: function ( opt ) {
			/*
			 * arr
			 * elem
			 * campo
			 * campoValor
			 * del
			 *
			 */

			opt.campo = opt.campo || null; // activamos bandera
			opt.del = opt.del || ' - ';
			opt.elem = opt.elem || this;

			if ( !jQuery.isEmptyObject( opt.arr ) )
			{
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
					var m = opt.campo.splitParametros( ',' );

					if ( !opt.campoValor ) opt.campoValor = m[ 0 ]; // si [campoValor] es nulo se toma al primer elemento de [campo] como propiedad

					for( var i = 0, lon = opt.arr.length; i < lon; i++ )
					{
						var
							val = sigesop.lecturaDeep( opt.arr[ i ], opt.campoValor ),
							data = null;

							data = m.length > 1 ? // verificamos si tenemos que concatenar
								sigesop.concatData( opt.arr[ i ], opt.campo, opt.del ):
								sigesop.lecturaDeep( opt.arr[ i ], opt.campo );

						combo += '<option value="' + val + '" >' + data + '</option>';
					}
				}

				// ---------- insertamos html en elem o retornamos el html

				if ( opt.elem === false ) return combo;
				else {
					$( opt.elem ).html( combo );
					return this;
				}
			}
			else
			{
				// ---------- insertamos html en opt.elem o retornamos el html

				if ( opt.elem === false )
					return '<option value="">' + this.sinRegistros + '</option>';
				else {
					$( opt.elem ).html( '<option value="">' + this.sinRegistros + '</option>' );
					return this;
				}
			}
		},

		lecturaDeep: function ( obj, campo ) {
			/*
			 * Retorna el valor o matriz de valores de la propiedad de un objeto
			 * permite obtener los valores de propiedades recursivas campo1.subcam1.subcam2.subcamN...
			 * Ejemplo 1: data = lecturaDeep( { campo1: 'valor' }, 'campo1' )
			 * Retorno 1: 'valor'
			 * Ejemplo 2: data = lecturaDeep( { cam1: { sub1: 'valor' } }, 'cam1' );
			 * Retorno 2: { sub1: 'valor' }
			 * Ejemplo 3: data = lecturaDeep( { cam1: { sub1: 'valor' } }, 'cam1.sub1' );
			 * Retorno 3: 'valor'
			 * Ejemplo 4: data = lecturaDeep( { cam1: { sub1: 'valor1' }, cam2: { sub1: { sub2: 'valor2' } } }, 'cam1.sub1, cam2.sub1.sub2' );
			 * Retorno 4: [ 'valor1', 'valor2' ]
			 */

			if ( !obj )
			{
				console.log( 'function: lecturaDeep, [obj] is null' );
				return null;
			}

			var
				m = campo.splitParametros( ',' );

			if ( m.length == 1 )
			{
				var n = m[ 0 ].splitParametros( '.' ), // filtramos los subcampos
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

				else return obj[ m[ 0 ] ];
			}

			else if ( m.length > 1 )
			{
				var mtz = [];

				for ( var i = 0, lon_i = m.length; i < lon_i; i++ ) // recorremos los campos
				{
					var n = m[ i ].splitParametros( '.' ), // filtramos los subcampos
						temp = null;

					if ( n.length > 1 )
					{
						temp = obj[ n[ 0 ] ];

						for ( var j = 1, lon_j = n.length; j < lon_j; j++ ) // recorremos los subcampos
						{
							temp = temp[ n[ j ] ];
						}

						mtz.push( temp );
					}

					else mtz.push( obj[ m[ i ] ] );
				}

				return mtz;
			}

			else console.log( 'function: lecturaDeep, [m] is empty' );
		},

		concatData: function ( obj, campo, del ) {
			/*
			 * Remplaza a la funcion [retornaValCampo]
			 * Retorna una cadena con los datos concatenados de los campos pasados como parametros,
			 * de un mismo objeto.
			 * Ejemplo 1: cadena = concatData( { valor: 'texto' }, 'valor' )
			 * Retorna 1: 'texto texto'
			 * Ejemplo 2: cadena = concatData( { valor: 'texto' }, 'valor', ' - ' )
			 * Retorna 2: 'texto - texto'
			 * Ejemplo 3: cadena = concatData( { campo1: { valor: 'texto1' }, campo2: 'texto2' }, 'campo1.valor, campo2', ' - ' )
			 * Retorna 3: 'texto1 - texto2'
			 */

			if ( !obj ) { console.log( 'function: concatData, [obj] is null' ); return null; }
			if ( !campo ) { console.log( 'function: concatData, [campo] is null' ); return null; }

			var m = this.lecturaDeep( obj, campo );

			del = del || ' ';

			if( jQuery.isArray( m ) )
			{
				var
					i = 0,
					lon = m.length,
					cad = '';

				for ( i; i < lon; i++ ) // concatenamos los valores de la matriz [m]
					i != ( lon - 1 ) ? cad += m [ i ] + del :
						cad += m [ i ];

				return cad;
			}

			else return m + del + m;
		},

		msgBlockUI: function ( msg, tipo, blockElement, elem ) {
			switch( tipo )
			{
				case 'error': var img = sigesop.imgError;	break;
				case 'success': var img = sigesop.imgSuccess; break;
				case 'loading':	var img = sigesop.imgLoading;	break;
				case 'warning':	var img = sigesop.imgWarning;	break;
				default: var img = ''; break;
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
						var elem = $( elem );
						elem.block({
						    message: '<center><h4>' + img + '&nbsp;' + msg + '</h4></center>',
						    fadeIn: 200,
						    fadeOut: 200,
						    timeout: 3000,
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
						})
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
					    baseZ: 5000,
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
					    // onOverlayClick: $.unblockUI,
					    baseZ: 5001,
					    centerY: false,
					    css: {
					        width: '50%',
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

		msg: function ( titulo, msg, tipo ) {
			titulo = titulo || '';
			msg = msg || '';
			tipo = tipo || 'undefined';
			var
				icon = '',
				ui_type = /^success|warning|error|info$/;

			switch( tipo.match( ui_type ) !== null ? tipo.match( ui_type )[0] : null ) {
				case 'error': icon = 'picon picon-32 picon-dialog-error';	break;
				// case 'error': icon = 'picon picon-32 picon-dialog-error';	break;
				case 'success': icon = 'picon picon-32 picon-custom-check'; break;
				// case 'success': icon = 'picon picon-32 picon-dialog-ok-apply'; break;
				case 'info':	icon = 'picon picon-32 picon-dialog-information';	break;
				case 'warning':	icon = 'picon picon-32 picon-dialog-warning';	break;
				default: tipo = 'info'; icon = 'picon picon-32 picon-dialog-information'; break;
			}

			var options = {
				type: tipo,
				title: titulo,
				text: msg,
				addclass: 'custom',
				icon: icon,
				// opacity: .8,
				nonblock: {
					nonblock: true
				}
			}

			new PNotify( options );
		},

		parseMsj: function ( arr, $form ) {
			if ( jQuery.isEmptyObject( arr ) ) return '';
			var
				msj = '',
				i = 0,
				lon = arr.length;

			for ( i; i < lon; i++ )
			{
				/* Convierte el arreglo de objetos de excepciones provinientes
				 * del servidor a un formato de cadena para usarlo en mensajes.
				 */
				msj += arr[ i ].elem ?
					arr[ i ].elem + ': ' + arr[ i ].msj + '<br>':
					arr[ i ].msj + '<br>';

				/* revalida los elementos del formulario rechazados por
				 * el servidor
				 */
				if( typeof $form !== 'undefined' )
					if ( typeof arr[ i ].key === 'string' )
						$form.data( 'formValidation' ).updateStatus( arr[ i ].key, 'INVALID' );;
			}

			return msj;
		},

		path_user_manual: '../../docs/sistema de_gestion_operativa_manual_usuario.pdf',

		query: function ( opt ) {
			/* type
			 * data
			 * class
			 * queryType
			 * query
			 * async
			 * beforeSend
			 * error
			 */

			opt.file = opt.file || 'ajax';
			opt.queryType = opt.queryType || 'getData';

			var
				url = this.raizServidor + opt.file + '.php?class=' + opt.class +
				'&action=' + opt.query,

				sendData = function( data )
				{
					if ( !jQuery.isEmptyObject( data ) )
					{
						var
							std = null,
							msj = '';

						if ( typeof data == 'string' )
						{
							std = data;
							msj = data;
						}
						else if ( typeof data == 'object' )
						{
							std = data.status.transaccion;
							msj = data.status.msj;
						}

						switch( std )
						{
							case 'OK':
								typeof opt.OK === 'function' ? opt.OK( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, OK is null' );
								break;
							case 'NA':
								typeof opt.NA === 'function' ? opt.NA( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, NA is null' );
								break;
							default:
								typeof opt.DEFAULT === 'function' ? opt.DEFAULT( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, DEFAULT is null' );
								break;
						}
					}

					else {
						console.log( 'Function query, [data] is null' );
						return -1;
					}
				};

			$.ajax({
				type: opt.type || 'GET',
				data: opt.data,
				dataType: "json",
				async: opt.async,
				url: url,
				beforeSend: opt.beforeSend,
				success: function ( data )
				{
					switch ( opt.queryType )
					{
						case 'getData': opt.success( data ); break;
						case 'sendData': sendData( data ); break;
						case 'sendGetData': opt.success( data ); break;
						default: console.log( 'Function: query, [queryType] is undefined' ); break;
					}
				},
				error: function( jpXHR, estado, error )
				{
					sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error' );
					console.log( "Funcion: " + opt.query + "()\n" + "Estado: " + estado + "\nError: " + error);
					typeof opt.error !== 'undefined' ? opt.error() : null;
				}

			});
		},

		seleccioneOpcion: 'SELECCIONE OPCION...',

		sinRegistros: 'SIN REGISTROS...',

		raizServidor: '../ajax/sistema/',

		retornaPosicionSplit: function ( data, posicion, delimitador ) {
			var arregloValor = data.split( delimitador ),
				valor = arregloValor[ posicion ];
			return valor.trim();
		},

		root: 'root',

		tabla: function ( opt ) {
			if ( typeof opt.body.campo !== 'string' ) {
				console.log( '[body.campo] is not valid' );
				return null;
			}

			// default settings
			var
			tipo = 			opt.tipo || 'radio',
			suf = 			opt.suf || '-',
			color_fila = 	opt.color_fila || '',
			color_select = 	opt.color_select || 'success',
			campo =			opt.body.campo,
			campoValor = 	opt.body.campoValor ||
							campo.splitParametros( ',' )[0],
			addName =		opt.body.addName || '',

			id_tbody = 'tablaBody_seleccion_' + suf;

			var
			matriz_input = 	[],

			checkAll = 	typeof opt.head.checkAll === 'boolean' ?
						( opt.head.checkAll || false ) :
						( opt.head.checkAll || {} ) ,

			elem_anterior = null,

			IDS = {
				head: '#tablaHead_seleccion_' + suf,
				body: '#tablaBody_seleccion_' + suf,
				checkAll: '#check-all-' + suf,
				$checkAll: null
			},

			tipo_input = function ( tipo, secuencia, full ) {
				if ( typeof full == 'undefined' ) full = true; // bandera para retornar sólo ID o cadena completa.

				switch ( tipo ) {
					case 'radio':
						return full ?
							'name="name_seleccion_' + suf +'"' :
							'name_seleccion_' + suf;

					case 'checkbox':
						return full ?
							'id="id_seleccion_' + secuencia + suf + '"' :
							'id_seleccion_' + secuencia + suf;

					default: // si es un valor invalido retorna un "radio" por defecto
						return full ?
							'name="name_seleccion_' + suf +'"' :
							'name_seleccion_' + suf;
				}
			},

			__disabled = function ( obj, campo, campoValor ) {
				var valor = sigesop.lecturaDeep( obj, campo );
				return valor == campoValor ?
					'disabled' : '';
			},

			struct_head = function ( campo_head ) {
				if ( !jQuery.isEmptyObject( campo_head ) ) {
					var
						m = campo_head.splitParametros( ',' ),
						i = 0,
						lon = m.length,
						check_all = tipo == 'checkbox' && checkAll !== false ? // agregarmos un check para seleccionar todas
							'<center><input id="check-all-' + suf + '" type="checkbox" ></center>' : '',
						head = '<tr><th>' + check_all + '</th>';

					for( i; i < lon; i++ )
						head += '<th>' + m[ i ] + '</th>';

					head += '</th>';

					return head;
				}

				else {
					console.log( '[campo_head] es nulo' );
					return '';
				}
			},

			struct_body = function ( arr, campo ) {
				if ( !$.isEmptyObject( arr ) && campo ) {
					matriz_input.length = 0; // vaciar la matriz

					var
						m = campo.splitParametros( ',' ),
						body = '',
						i = 0,
						lon_i = arr.length;

					for( i ; i < lon_i ; i++ ) {
						var
							fila = arr[ i ],
							disabled = 	typeof opt.body.disabled === 'object' ?
								( typeof opt.body.disabled.campo === 'string' &&
								typeof opt.body.disabled.campoValor === 'string' ?
								__disabled( fila, opt.body.disabled.campo, opt.body.disabled.campoValor ) : '' ) : '';

						/* creamos la estructura del input
						 */
						body += '<tr table-index="' + i + '" class="' + color_fila + '"><td><center><input type="' + tipo +
								'" ' + tipo_input( tipo, i ) + ' value="' + sigesop.lecturaDeep( fila, campoValor ) +
								'" ' + disabled + '/></center></td>';

						/* guardamos los ID'S o NAME en matriz pública
						 */
						matriz_input.push({
							index: tipo_input( tipo, i, false ),
							valor: null
						}); //

						/* rellenamos los datos de las celdas restantes
						 */
						var
							j = 0,
							lon_j = m.length;

						for ( j ; j < lon_j ; j++ )
							body += '<td>' + sigesop.lecturaDeep( fila, m[ j ] ) + '</td>';

						body += '</tr>';
					}

					return body;
				}

				else {
					console.log( '[arr || campo] es nulo' );
					return '';
				}
			},

			update_table = function ( arr ) {
				var body = struct_body( arr, campo )
				$( '#tablaBody_seleccion_' + suf ).html( body );
				run_javascript( matriz_input );
			},

			change_radio = function ( event ) {
				if ( elem_anterior )
				{
					// console.log( 'OK [change_radio]' );
					elem_anterior.removeClass();
					elem_anterior.addClass( color_fila );
				}

				// else console.log( '[elem_anterior] es nulo' );

				$( this ).parents( '#' + id_tbody + ' tr' ).addClass( color_select );
				elem_anterior = $( this ).parents( '#' + id_tbody + ' tr' );
			},

			change_checkbox = function ( event ) {
				var $this = $( this );

				if ( $this.prop( 'checked' ) ) {
					$this.parents( '#' + id_tbody + ' tr' )
					.addClass( color_select ); // cambia color

					/* Añade valor a matriz publica
					 */
					var index = sigesop.indexOfObjeto( matriz_input, 'index', $this[0].id );
					if ( index != -1 ) matriz_input[ index ].valor = $this.val();
				}

				else {
					/* quita color
					 */
					$this.parents( '#' + id_tbody + ' tr' ).removeClass();
					$this.parents( '#' + id_tbody + ' tr' ).addClass( color_fila );

					/* Elimina valor a matriz publica
					 */
					var index = sigesop.indexOfObjeto( matriz_input, 'index', $this[0].id );
					if ( index != -1 ) matriz_input[ index ].valor = null;
				}

				/* Llamada a funcion por cada evento de seleccion
				 */
				if ( typeof opt.body.callback === 'function' )
					opt.body.callback( $this.prop( 'checked' ), $this.val(), $this, matriz_input );
			},

			selectAll = function () {
				if ( tipo !== 'checkbox' ) return;
				if ( $.isEmptyObject( this.matrizInput ) ) return null;

				var
					i = 0,
					lon = this.matrizInput.length;

				for ( i ; i < lon ; i++ ) {
					var $elem = $( '#' + this.matrizInput[ i ].index );
					$elem.prop( 'checked', true )
						.parents( '#' + id_tbody + ' tr' )
						.addClass( color_select );

					/* Añade valor a matriz publica
					 */
					var index = !$.isEmptyObject( $elem[0] ) ?
						sigesop.indexOfObjeto( matriz_input, 'index', $elem[0].id ) : -1;
					if ( index != -1 ) matriz_input[ index ].valor = $elem.val();
				}
			},

			reset = function () {
				if ( tipo == 'radio' ) {
					// var $elem = $( '#' + this.matrizInput[ i ].index );
					// $elem.val('');
					// $elem.parents( '#' + id_tbody + ' tr' ).removeClass();
				}
				else if ( tipo == 'checkbox' ) {
					if ( jQuery.isEmptyObject( this.matrizInput ) ) return null;
					var
						i = 0,
						lon = this.matrizInput.length;

					for ( i ; i < lon ; i++ ) {
						this.matrizInput[ i ].valor = null;
						var $elem = $( '#' + this.matrizInput[ i ].index );
						$elem.prop( 'checked', false )
						.parents( '#' + id_tbody + ' tr' )
						.removeClass();

						/* Elimina valor a matriz publica
						 */
						var index = !$.isEmptyObject( $elem[0] ) ?
							sigesop.indexOfObjeto( matriz_input, 'index', $elem[0].id ) : -1;
						if ( index != -1 ) matriz_input[ index ].valor = null;
					}
				}
			},

			run_javascript = function ( mtz ) {
				if ( !jQuery.isEmptyObject( mtz ) ) {
					if ( tipo === 'radio' )
						$( 'input[name="' + mtz[ 0 ].index + '"]' ).change( change_radio );

					else if ( tipo === 'checkbox' ) {
						for( var i = 0, lon = mtz.length; i < lon; i++ )
							$( '#' + mtz[ i ].index ).change( change_checkbox );
					}

					else console.log( 'tipo de elemento no válido para efecto [change]' );
				}

				else console.log( 'Matriz [matrizInput] es nula' );

				/* Agregamos el evento de cambio
				 * para seleccionar todos los campos
				 */
				var $checkAll = $( IDS.checkAll );
				IDS.$checkAll = $checkAll;

				$checkAll.change(function( e ) {
					var state = $checkAll.prop( 'checked' );
					if ( state )
						selectAll.call( doc );
					else reset.call( doc );

					/* Llamada a funcion por cada evento de seleccion
					 */
					if ( typeof checkAll.callback === 'function' )
						checkAll.callback( $checkAll.prop( 'checked' ), $checkAll.val(), $checkAll, matriz_input );
				});
			};

			var
			head = struct_head ( opt.head.campo ),

			body = struct_body ( opt.body.arr, campo ),

			html =
				'<div class="panel panel-default">' +
				'<div class="table-responsive">' +
					'<table class="table  table-bordered table-hover">' +
						'<thead id="tablaHead_seleccion_' + suf + '" >' + head + '</thead>' +
						'<tbody id="' + id_tbody + '" >' + body + '</tbody>' +
					'</table>' +
				'</div></div><br>',

			doc = {
				html: html,
				update_table: update_table,
				IDS: IDS,
				reset: reset,
				matrizInput: matriz_input
			};

			return doc;
		},

		tablaRegistro: function ( opt ) {
			/*
			 * head
			 * body
			 * campo
			 * val_campo
			 * color_fila
			 */

			opt.suf = opt.suf || '';
			opt.color_fila = opt.color_fila || 'success'
			opt.addClass = opt.addClass || {};

			var
			struct_head = function ( arr ) {
				if ( !jQuery.isEmptyObject( arr ) ) {
					var
						m = arr.splitParametros( ',' ),
						i = 0,
						lon = m.length,
						head = '',
						filter = ''

					for( i; i < lon; i++ ) {
						head +=
							'<th >' + m[ i ] +
								'<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>' +
								'<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>' +
							'</th>';

						filter +=
							'<th>' +
								'<input class="js-filter form-control" type="text" value="">' +
							'</th>';
					}

					return '<tr>' + head + '</tr>' + '<tr>' + filter + '</tr>';
				}

				else {
					// console.log( '[arr] es nulo' );
					return '';
				}
			},

			struct_body = function ( arr, campo, addClass ) {
				if ( !jQuery.isEmptyObject( arr ) && campo ) {
					/*
					 *
					 */
					var
						color_fila = opt.color_fila || 'success',

						flag_ = true,

						returnClass = function ( mtz_class, mtz_campo, mtz_valor, fila ) {
							for ( var i = 0, lon = mtz_campo.length; i < lon; i++ )
							{
								var
								index = mtz_valor.indexOf(
									sigesop.lecturaDeep( fila, mtz_campo[ i ] ) );

								if ( eval != -1 )
									return mtz_class[ index ];
							}

							return '';
						};

					if ( typeof addClass.body == 'object' ) {
						var
							mtz_class = addClass.body.class.splitParametros( ',' ),
							mtz_campo = addClass.body.campo.splitParametros( ',' ),
							mtz_valor = addClass.body.valor.splitParametros( ',' );

						// console.log( 'mtz_class: ' + mtz_class.length + ' campo: ' + mtz_campo.length + ' valor: ' + mtz_valor.length );

						if ( mtz_class.length == mtz_campo.length && // silogismo hipotético
						 	 mtz_campo.length == mtz_valor.length ) flag_ = false;
						else console.log( 'Matrices [mtz_class], [mtz_campo], [mtz_valor] no son de la misma longitud' );
					}

					/*
					 * estructurar los tokens de los campos, las cadenas validas para su lectura
					 * son del formato:
					 * 'campo_1, campo_2, campo_3' y 'campo_1.sub_1, campo_2.sub_1, campo_3.sub_1'
					 */

					var
						m = campo.splitParametros( ',' ), // filtramos los campos
						body = '';

					// ----------------------------------------------------

					for ( var k = 0, lon_k = arr.length; k < lon_k; k++ ) {
						color_fila = flag_ ? // si es false es por que existe un addClass
							opt.color_fila :
							returnClass( mtz_class, mtz_campo, mtz_valor, arr[ k ] );

						// -------------------

						body += '<tr table-index="' + k + '" class="' + color_fila + '">';

						for ( var i = 0, lon_i = m.length; i < lon_i; i++ ) // recorremos los campos
							body += '<td>' + sigesop.lecturaDeep( arr[ k ], m[ i ] ) + '</td>';

						body += '</tr>';
					}

					return body;
				}

				else {
					// console.log( '[arr || campo] es nulo' );
					return '';
				}
			},

			update_table = function ( arr ) {
				var body = struct_body( arr, opt.campo, opt.addClass )
				$( '#id-body-table-registro-' + opt.suf ).html( body );

				/* Se inicializa el plugin de ordenacion y
				 * filtracion
				 */
			    $(document).find('.js-dynamitable').each(function(){
			        $(this).dynamitable()
			            .addFilter('.js-filter')
			            .addSorter('.js-sorter-asc', 'asc')
			            .addSorter('.js-sorter-desc', 'desc')
			        ;
			    });
			},

			html =
				'<div class="panel panel-default">' +
				'<div class="table-responsive">' +
					'<table id="id-tabla-registro-' + opt.suf + '" class="js-dynamitable table table-bordered table-hover">' +
						'<thead id="id-head-table-registro-' + opt.suf + '" >' +
							struct_head ( opt.head ) + '</thead>' +
						'<tbody id="id-body-table-registro-' + opt.suf + '" >' +
							struct_body ( opt.body, opt.campo, opt.addClass ) + '</tbody>' +
					'</table>' +
				'</div></div><br>',

			table = {
				html: html,
				IDS: {
					table: '#id-tabla-registro-' + opt.suf,
					$table: null,
					head: '#id-head-table-registro-' + opt.suf,
					body: '#id-body-table-registro-' + opt.suf
				}
			};

			table.update_table = update_table.bind( table );
			return table;
		},

		tablaSeleccion: function ( opt ) {
			/*
			 * head  	 - {string} cadena de campos
			 * ---------------------------------------------------------
			 * body  	 - {array}  datos de los campos
			 * campo 	 - {string} cadena de campos
			 * val_campo - {string} cadena de campo que adquirirá
			 * 			   el value del input.
			 * ---------------------------------------------------------
			 * tipo		 	- {string}[checkbox | radio] tipo de caja
			 *			   	- que adquiere el input.
			 * color_fila	- {string}[success | warning | danger]
			 *				  color de las filas
			 * color_select - {string}[success | warning | danger]
			 *				  color de la fila que ha sido seleccionada
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

				struct_head = function ( campo_head )
				{
					if ( !jQuery.isEmptyObject( campo_head ) )
					{
						var
							m = campo_head.splitParametros( ',' ),
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
						// console.log( '[campo_head] es nulo' );
						return '';
					}
				},

				struct_body = function ( arr, campo )
				{
					if ( !jQuery.isEmptyObject( arr ) && campo )
					{
						var
							m = campo.splitParametros( ',' ),
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
						// console.log( '[arr || campo] es nulo' );
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
					var $this = $( this );

					if ( $this.prop( 'checked' ) )
					{
						$this.parents( 'tr' ).addClass( opt.color_select );
						// data.push( $this.val() );
					}

					else
					{
						$this.parents( 'tr' ).removeClass();
						$this.parents( 'tr' ).addClass( opt.color_fila );
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

		dataTable: function ( opt ) {
			/*
			 * head
			 * body
			 * campo
			 * val_campo
			 * color_fila
			 */

			opt.color_fila = opt.color_fila || ''
			opt.addClass = opt.addClass || {};

			var

			that = this,

			struct_head = function ( arr ) {
				if ( $.isEmptyObject( arr ) ) {
					return;
				}

				var IDS    = this.IDS,
					m      = arr.splitParametros( ',' ),
					i      = 0,
					lon    = m.length,
					head   = '',
					filter = '';

				var $headerContent = $('<tr></tr>');
				var $filterContent = $('<tr></tr>');

				for( i; i < lon; i++ ) {
					$headerContent.append(
						$( '<th></th>' ).append( m[ i ] )
						.append( '<span class="js-sorter-desc glyphicon glyphicon-chevron-down pull-right"></span>' )
						.append( '<span class="js-sorter-asc  glyphicon glyphicon-chevron-up pull-right"></span>' )
					)

					$filterContent.append(
						$( '<th></th>' )
						.append( '<input class="js-filter form-control" type="text" value="">' )
					)
				}

				if ( IDS.$tableHeader ) {
					IDS.$tableHeader.append( $headerContent )
						.append( $filterContent )
				};
			},

			struct_body = function ( arr, campo, addClass ) {
				if ( $.isEmptyObject( arr ) || !campo || !this.IDS.$tableBody ) {
					return;
				}

				var color_fila = opt.color_fila || '',
					flag_      = true;

				var returnClass = function ( mtz_class, mtz_campo, mtz_valor, fila ) {
						for ( var i = 0, lon = mtz_campo.length; i < lon; i++ )
						{
							var
							index = mtz_valor.indexOf(
								sigesop.lecturaDeep( fila, mtz_campo[ i ] ) );

							if ( eval != -1 )
								return mtz_class[ index ];
						}

						return '';
					};

				if ( typeof addClass.body == 'object' ) {
					var
						mtz_class = addClass.body.class.splitParametros( ',' ),
						mtz_campo = addClass.body.campo.splitParametros( ',' ),
						mtz_valor = addClass.body.valor.splitParametros( ',' );

					// console.log( 'mtz_class: ' + mtz_class.length + ' campo: ' + mtz_campo.length + ' valor: ' + mtz_valor.length );

					if ( mtz_class.length == mtz_campo.length && // silogismo hipotético
					 	 mtz_campo.length == mtz_valor.length ) flag_ = false;
					else console.log( 'Matrices [mtz_class], [mtz_campo], [mtz_valor] no son de la misma longitud' );
				}

				/*
				 * estructurar los tokens de los campos, las cadenas validas para su lectura
				 * son del formato:
				 * 'campo_1, campo_2, campo_3' y 'campo_1.sub_1, campo_2.sub_1, campo_3.sub_1'
				 */
				var m      = campo.splitParametros( ',' ), // filtramos los campos
					k      = 0,
					lon_k  = arr.length,
					$tableBody = this.IDS.$tableBody;

				$tableBody.empty();

				for ( k; k < lon_k; k++ ) {
					color_fila = flag_ ? // si es false es por que existe un addClass
						opt.color_fila :
						returnClass( mtz_class, mtz_campo, mtz_valor, arr[ k ] );

					// -------------------

					var $row = $( '<tr></tr>' )
						.addClass( color_fila )
						.attr( 'table-index', k );

					for ( var i = 0, lon_i = m.length; i < lon_i; i++ ) // recorremos los campos
						$row.append(
							$( '<td></td>' ).html( sigesop.lecturaDeep( arr[ k ], m[ i ] ) )
						);

					$tableBody.append( $row );
				}
			},

			update_table = function ( arr ) {
				this.IDS.$tableBody.empty();
				struct_body.call( this, arr, opt.campo, opt.addClass )
				/* Se inicializa el plugin de ordenacion y
				 * filtracion
				 */
			    this.IDS.$content.find('.js-dynamitable').each(function(){
			        $(this).dynamitable()
			            .addFilter('.js-filter')
			            .addSorter('.js-sorter-asc', 'asc')
			            .addSorter('.js-sorter-desc', 'desc');
			    });
			},

			reset_table = function () {
				this.IDS.$tableBody.empty();
			},

			struct_document = function () {
				var IDS = this.IDS;

				IDS.$tableHeader = $( '<thead></thead>' );
				IDS.$tableBody   = $( '<tbody></tbody>' );

				IDS.$table = $( '<table></table>' )
					.addClass( 'js-dynamitable table table-bordered table-hover' )
					.append( IDS.$tableHeader )
					.append( IDS.$tableBody );

				IDS.$content = $( '<div></div>' )
					.addClass( 'panel panel-default' )

					.append(
						$( '<div></div>' )
						.addClass( 'table-responsive' )
						.append( IDS.$table )
					)
			},

			factory = function () {
				var IDS = this.IDS;

				struct_document.call( this );
				struct_head.call( this, opt.head );
				struct_body.call( this, opt.arr, opt.campo, opt.addClass );

				if ( typeof this !== 'undefined' ) {
					$( that ).append( IDS.$content );
					IDS.$tableBody.contextMenu( opt.contextMenu );
				}

				return this;
			},

			IDS = {
				$content    : null,
				$table      : null,
				$tableBody  : null,
				$tableHeader: null
			},

			table = {
				IDS: IDS
			};

			table.factory = factory.bind( table );
			table.update_table = update_table.bind( table );
			table.reset_table = reset_table.bind( table );
			return table;
		},

		utf8_encode: function ( argString ) {
			/* discuss at: http://phpjs.org/functions/utf8_encode/
			 * original by: Webtoolkit.info (http://www.webtoolkit.info/)
			 * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			 * improved by: sowberry
			 * improved by: Jack
			 * improved by: Yves Sucaet
			 * improved by: kirilloid
			 * bugfixed by: Onno Marsman
			 * bugfixed by: Onno Marsman
			 * bugfixed by: Ulrich
			 * bugfixed by: Rafal Kukawski
			 * bugfixed by: kirilloid
			 * example 1: utf8_encode('Kevin van Zonneveld');
			 * returns 1: 'Kevin van Zonneveld'
			 */

			argString = argString || this;

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

		utf8_decode: function ( str_data ) {
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

			if( str_data === null ) return '';
			if ( typeof str_data === 'undefined')
				str_data = this;

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

		ventanaEmergente: function ( opt ) {
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

			 // opt.suf = opt.suf || '_suf';
			 opt.idDiv = opt.idDiv || '__win_idDiv_';
			 opt.idBtnCerrar = opt.idBtnCerrar || opt.idDiv + '__btnCerrar';
			 opt.idBtnOK = opt.idBtnOK || opt.idDiv + '__btnOK';
			 opt.idModal = opt.idModal || opt.idDiv + '_modal';
			 opt.titulo = opt.titulo || 'Mensaje del Sistema';
			 opt.idBody = opt.idBody || opt.idDiv + '__divBoby';
			 opt.keyboard = opt.keyboard || false;

			var
			ventana =
				'<div class="modal fade" id="' + opt.idDiv + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
					'<div class="modal-dialog modal-lg">'+
						'<div id="' + opt.idModal + '" class="modal-content">'+
							'<div class="modal-header">'+
				// '        		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
								'<h4 class="modal-title" >' + opt.titulo + '</h4>'+
							'</div>'	+

							'<div id="' + opt.idBody + '" class="modal-body"></div>'+

							'<div class="modal-footer">'+
								'<button id="' + opt.idBtnCerrar + '" type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>'+
								'<button id="' + opt.idBtnOK + '" type="button" class="btn btn-success">Aceptar</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
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
				// backdrop: true
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

		verificaRoot: function ( data, jsonFunctions ) {
			var rutaSolicitud = sigesop.rutaServidor + 'verificaRoot';
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
		},

		view: {}
	}
})();

/**********************************************************************/ 

window.sesion = {
	// indexActividadRegistrada      : null,
	// indexOrdenTrabajoPorUsuario   : null,
	// matrizAreaAcceso              : null,
	// matrizAreaTrabajo             : null,
	// matrizCentral                 : null,
	// matrizEquipos                 : null,
	// matrizEstadoLicencia          : null,
	// matrizGeneradores             : null,
	// matrizLibroRelatorio          : null,
	// matrizListaVerificacion       : null,
	// matrizOrdenTrabajo            : null,
	// matrizLicencia                : null,
	// matrizOrdenTrabajoPorUsuario  : null,
	// matrizOrdenesPorGenerador     : null,
	// matrizPermisoAcceso           : null,
	// matrizReporteMantto           : null,
	// matrizSistemas                : null,
	// matrizTipoMantto              : null,
	// matrizTipoParamentroAceptacion: null,
	// matrizTipoRol                 : null,
	// matrizUnidadMedida            : null,
	// matrizUnidades                : null,
	// matrizUsuario                 : null

	// matrizMateriales
	// matrizOrdenTrabajoMaterial
};

// extend javascript native functions for [String]
angular.extend( String.prototype,
    {
        flushChar: function ( character ) {
            return this && character ?
                this.replace( character, '' ) : '';
        },

        utf8_encode: function ( argString ) {
            /* discuss at: http://phpjs.org/functions/utf8_encode/
             * original by: Webtoolkit.info (http://www.webtoolkit.info/)
             * improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
             * improved by: sowberry
             * improved by: Jack
             * improved by: Yves Sucaet
             * improved by: kirilloid
             * bugfixed by: Onno Marsman
             * bugfixed by: Onno Marsman
             * bugfixed by: Ulrich
             * bugfixed by: Rafal Kukawski
             * bugfixed by: kirilloid
             * example 1: utf8_encode('Kevin van Zonneveld');
             * returns 1: 'Kevin van Zonneveld'
             */

            argString = argString || this;

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

        utf8_decode: function ( str_data ) {
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

            if( str_data === null ) return '';
            if ( typeof str_data === 'undefined')
                str_data = this;

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

        SHA1: function ( str ) {
            str = str || this;
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

        splitParametros: function ( del ) {
            if ( !this ) return [];

            var array = [],
                m = this.split( del );

            for( var i = 0, lon = m.length; i < lon; i++ ) array.push( m[ i ].trim() );
            return array;
        }
    }
);

var sigesop = angular.module( 'sigesop', [])
.service( '$sigesop', function ( $http, $timeout, $q ) {
    return ({
        platform: ionic.Platform.platform(),

        ipServidor: '',

        isEmptyObject: function( obj ) {
            var name;
            for ( name in obj ) {
                return false;
            }
            return true;
        },

        raizServidor: '',

        sesion: {
            usuario: null,
            password: null
        },

        /**
        * The workhorse; converts an object to x-www-form-urlencoded serialization.
        * @param {Object} obj
        * @return {String}
        */
        param: function ( obj ) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += this.param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += this.param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        },

        query: function ( opt ) {
            /* type
             * data
             * class
             * queryType
             * query
             * async
             * beforeSend
             * error
             */

            // alert( 'networkState: ' + this.networkState );
            // alert( 'raizServidor: ' + this.raizServidor );

            var error = function( response ) {
                console.log( "Funcion: " + opt.query + "()\n" + "\nError: " + response );
                if( typeof opt.error !== 'undefined' ) opt.error( response.message, response.stack );
            };

            if ( !this.networkState ) {
                error({
                    message: 'Error de conectividad',
                    stack: 'fuera de linea.'
                });
                return;
            }

            if ( !this.raizServidor ) {
                error({
                    message: 'Error de conectividad',
                    stack: 'Servidor no definido'
                });
                return;
            }

            if ( !this.keepAlive ) {
                error({
                    message: 'Error de conectividad',
                    stack: 'El sistema es inalcanzable en la red [' + this.ipServidor + ']'
                });
                return;
            }

            opt.file = opt.file || 'ajax';
            opt.queryType = opt.queryType || 'getData';

            var

            type = opt.type || 'GET',

            data = opt.data || {},

            url = this.raizServidor + opt.file + '.php?class=' + opt.class +
            '&action=' + opt.query,

            sendData = function( data ) {
                if ( !jQuery.isEmptyObject( data ) ) {
                    var
                        std = null,
                        msj = '';

                    if ( typeof data == 'string' ) {
                        std = data;
                        msj = data;
                    }
                    else if ( typeof data == 'object' ) {
                        std = data.status.transaccion;
                        msj = data.status.msj;
                    }

                    switch( std ) {
                        case 'OK':
                            typeof opt.OK === 'function' ? opt.OK( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, OK is null' );
                            break;
                        case 'NA':
                            typeof opt.NA === 'function' ? opt.NA( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, NA is null' );
                            break;
                        default:
                            typeof opt.DEFAULT === 'function' ? opt.DEFAULT( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, DEFAULT is null' );
                            break;
                    }
                }

                else {
                    console.log( 'Function query, [data] is null' );
                    return -1;
                }
            },

            success = function ( response ) {
                switch ( opt.queryType ) {
                    case 'getData': opt.success( response.data ); break;
                    case 'sendData': sendData( response.data ); break;
                    case 'sendGetData': opt.success( response.data ); break;
                    default: console.log( 'Function: query, [queryType] is undefined' ); break;
                }
            };

            /* Concatenamos los datos al query string si se trata de
             * una solicitud tipo GET
             */
            if ( type === 'GET' ) {
                url += '&' + this.param( opt.data );
                data = {};
            }

            // alert( url );

            /* Ejecutamos solicitud
             */
            $http({
                // timeout: 1000,
                method: type,
                data: data,
                url: url
            })
            .then( success, error );
        },

        getOwnPropertyNames: function ( obj ) {
            return Object.getOwnPropertyNames( obj ).sort();
        },

        splitParametros: function ( del ) {
            if ( !this ) return [];

            var array = [],
                m = this.split( del );

            for( var i = 0, lon = m.length; i < lon; i++ ) array.push( m[ i ].trim() );
            return array;
        }
    })
})
.config(function ( $httpProvider ) {
    /* Configuracion de QueryString para comunicacion ajax con PHP
    */
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var param = function ( obj ) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function ( data ) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
})