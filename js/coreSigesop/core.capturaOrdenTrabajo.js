sigesop.capturaOrdenTrabajo = {
	documentInsertData: function ( opt ){
		/*
		 * name
		 * suf
		 * arr
		 * sortable
		 * activate
		 * campo
		 * dataValue
		 */

		opt.suf = opt.suf || '';
		opt.name = opt.name + opt.suf || 'accordion' + opt.suf;
		opt.activate = opt.activate || function () {};

		var
		update_accordion = function ( arr ) {
			if ( $.isEmptyObject( arr ) ) {
				console.log( '[arr] es nulo' );
				return null;
			}

			var
				html = '<div id="' + opt.name + '">';

			// if ( opt.sortable ) // con el efecto sortable
			// {
			// 	for( var i = 0, lon = arr.length; i < lon; i++ )
			// 	{
			// 		html +=
			// 		'<div class="group">' +
			// 		'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
			// 		'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' +
			// 		'</div>';
			// 	}
			// }

			// else
			// {
			// 	for( var i = 0, lon = arr.length; i < lon; i++ )
			// 	{
			// 		html +=
			// 		'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
			// 		'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' ;
			// 	}
			// }

			for( var i = 0, lon = arr.length; i < lon; i++ ) {
				html +=
				'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
				'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' ;
			}

			html += '</div>'

			return html;
		},

		javascript = function () {
			// if ( opt.sortable )
			// {
			// 	$( '#' + opt.name ).accordion({
			// 		collapsible: true,
			// 		active: false,
			// 		heightStyle: 'content',
			// 		header: "> div > h3",
			// 		icons: {
			// 			header: "ui-icon-circle-arrow-e",
			// 			activeHeader: "ui-icon-circle-arrow-s"
			// 		},
			// 		beforeActivate: function( event, ui )
			// 		{
			// 			_ui = ui;
			// 			// _event = event;

			// 			var
			// 				id = ui.newPanel[0].id,
			// 				value = document.getElementById( ui.newPanel[0].id ).getAttribute('data-value');

			// 			typeof opt.activate === 'function' ?
			// 				opt.activate( id, value ): null;
			// 		}
			// 	})
			// 	.sortable({
			// 		axis: "y",
			// 		handle: "h3",
			// 		stop: function( event, ui )
			// 		{
			// 			// IE doesn't register the blur when sorting
			// 			// so trigger focusout handlers to remove .ui-state-focus
			// 			ui.item.children( "h3" ).triggerHandler( "focusout" );
			// 			// Refresh accordion to handle new order
			// 			$( this ).accordion( "refresh" );
			// 		}
			// 	});
			// }

			// else
			// {
			// 	$( '#' + opt.name ).accordion({
			// 		collapsible: true,
			// 		active: false,
			// 		heightStyle: 'content',
			// 		icons: {
			// 			header: "ui-icon-circle-arrow-e",
			// 			activeHeader: "ui-icon-circle-arrow-s"
			// 		},
			// 		beforeActivate: function( event, ui )
			// 		{
			// 			_ui = ui;
			// 			// _event = event;

			// 			var
			// 				id = ui.newPanel[0].id,
			// 				value = document.getElementById( ui.newPanel[0].id ).getAttribute('data-value');

			// 			typeof opt.activate === 'function' ?
			// 				opt.activate( id, value ): null;
			// 		}
			// 	});
			// }

			$( '#' + opt.name ).accordion({
				collapsible: true,
				active: false,
				heightStyle: 'content',
				icons: {
					header: "ui-icon-circle-arrow-e",
					activeHeader: "ui-icon-circle-arrow-s"
				},
				beforeActivate: function( event, ui ) {
					// _ui = ui;
					// _event = event;
					var elem = typeof ui.newPanel[0] !== 'undefined' ?
						document.getElementById( ui.newPanel[0].id ) : null;

					if ( elem ) {
						elem.innerHTML = '';
						var
							id = ui.newPanel[0].id,
							value = elem.getAttribute('data-value');

						typeof opt.activate === 'function' ?
							opt.activate( id, value ): null;
					}
				}
			});
		},

		doc = {
			html: update_accordion( opt.arr ),
			javascript: javascript,
			activate: opt.activate,
			datos: {},
			IDS: {
				id_accordion: '#' + opt.name
			},
			update_table: function ( arr ) {

			}
		};

		return doc;
	},

	documentActivity: function ( opt ) {
		/*
		 * obj
		 * suf
		 * success
		 * error
		 */

		if ( !$.isPlainObject( opt.obj ) || $.isEmptyObject( opt.obj ) ) {
			sigesop.msg( 'Info', 'Se requiere de los datos de la orden de trabajo', 'info' );
			return;
		}

		var that = this;

		/* verificamos si requerimos las actividades con datos
		 * en caso de que el documento sea para la revision de
		 * actividades
		 */
		opt.withData = opt.withData === true ? true : false;

		/* Vista de la seccion de sistemas
		 */
		var sistemasView = function ( view ) {
    		var that = this, IDS = this.IDS;
			var data = {
				id_mantenimiento: opt.obj.id_mantenimiento,
				id_orden_trabajo: opt.obj.id_orden_trabajo
			};

			/* verificamos si requerimos las actividades con datos
			 * en caso de que el documento sea para la revision de
			 * actividades
			 */
			if( opt.withData === true ) data.con_datos = true;

			var success = function ( data ) {
				if ( $.isEmptyObject( data ) ) {
					IDS.$sistemasView.append('<h3 class=" text-center ">SIN LISTAS DE VERIFICACION POR CAPTURAR...</h3>');
					return;
				}

				$.each( data, function( i, sistema ) {
					IDS.$sistemasView
					.append(
						$('<h3></h3>').text( sistema.nombre_sistema_aero )
					)
					.append(
						$('<div></div>').attr('data-value', sistema.id_sistema_aero )
					)
				});

				IDS.$sistemasView.accordion({
					collapsible: true,
					active: false,
					heightStyle: 'content',
					icons: {
						header: "ui-icon-circle-arrow-e",
						activeHeader: "ui-icon-circle-arrow-s"
					},
					beforeActivate: function( event, ui ) {
						var elem = typeof ui.newPanel[0] !== 'undefined' ?
							document.getElementById( ui.newPanel[0].id ) : null;

						if ( elem ) {
							elem.innerHTML = '';
							var id              = ui.newPanel[0].id;
							var $elem           = $('#'+id);
							var id_sistema_aero = $elem.attr('data-value');

							/* Lanzamos el controlador para generar las
							 * vistas de equipos
							 */
							equiposView.call( that, $elem, id_sistema_aero );
						}

						// else {
						// 	sigesop.logError( 'sistemasController', {
						// 		message: '[elem] en beforeActivate es nulo',
						// 		stack: '[elem] en beforeActivate es nulo'
						// 	})
						// }
					}
				});
			};

			/* Lanzamos ajax en busqueda de los equipos pertenecientes al
			 * tipo de mantenimiento y la orden de trabajo
			 */
			sigesop.query({
				data: data,
				class: 'mantenimiento',
				query: 'systems_into_mantto',
				success: success
			});
		}

		/* Vista de la seccion de equipos
		 */
    	var equiposView = function ( $elem, id_sistema_aero, view ) {
    		var IDS = this.IDS, that = this;

			var data = {
				id_mantenimiento: opt.obj.id_mantenimiento,
				id_sistema_aero : id_sistema_aero,
				id_orden_trabajo: opt.obj.id_orden_trabajo
			};

			/* verificamos si requerimos las actividades con datos
			 * en caso de que el documento sea para la revision de
			 * actividades
			 */
			if( opt.withData === true ) data.con_datos = true;

			var success = function ( data ) {
				IDS.$equiposView = $('<div></div>'); // reiniciamos nueva instancia de vista

				if ( $.isEmptyObject( data ) ) {
					IDS.$equiposView.append('<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>');
					return;
				}

				$.each( data, function( i, equipo ) {
					IDS.$equiposView
					.append(
						$('<h3></h3>').text( equipo.nombre_equipo_aero )
					)
					.append(
						$('<div></div>').attr('data-value', equipo.id_equipo_aero )
					)
				});

				IDS.$equiposView.accordion({
					collapsible: true,
					active: false,
					heightStyle: 'content',
					icons: {
						header: "ui-icon-circle-arrow-e",
						activeHeader: "ui-icon-circle-arrow-s"
					},
					beforeActivate: function( event, ui ) {
						var elem = typeof ui.newPanel[0] !== 'undefined' ?
							document.getElementById( ui.newPanel[0].id ) : null;

						if ( elem ) {
							elem.innerHTML = '';
							var id             = ui.newPanel[0].id;
							var $elem          = $('#'+id);
							var id_equipo_aero = $elem.attr('data-value');

							/* Lanzamos el controlador para generar las
							 * vistas de equipos
							 */
							actividadesView.call( that, $elem, id_equipo_aero );
						}

						// else {
						// 	sigesop.logError( 'sistemasController', {
						// 		message: '[elem] en beforeActivate es nulo',
						// 		stack: '[elem] en beforeActivate es nulo'
						// 	})
						// }
					}
				});

				$elem.html( IDS.$equiposView );
			}

			sigesop.query({
				data: data,
				class: 'mantenimiento',
				query: 'equipo_into_systems_mantto',
				success: success
			});
    	}

    	/* Vista y controlador del formulario
    	 */
		var actividadesView = function ( $elem, id_equipo_aero, view ) {
			var that = this, IDS = this.IDS, dataModel = this.dataModel;
			var datos = this.datos;

			var data = {
				id_mantenimiento: opt.obj.id_mantenimiento,
				id_equipo_aero  : id_equipo_aero,
				id_orden_trabajo: opt.obj.id_orden_trabajo,
				con_datos       : opt.withData
			};

			var struct_document = function ( data ) {
				/* actualizando modelo de datos
				 */
				if ( !$.isEmptyObject( data ) ) {
					dataModel.actividadesView.datos_rastreo_actividad = data.datos_rastreo_actividad;
					dataModel.actividadesView.actividades = data.actividades;
				}

				else {
					dataModel.actividadesView.datos_rastreo_actividad = [];
					dataModel.actividadesView.actividades = [];
				}

				if ( $.isEmptyObject( data.actividades ) )	{
					$elem.html('<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>');
					return;
				}

				/*********************************
				 ** JQuery objects
				 ********************************/
				IDS.$rastreo_actividad = $('<a href="#"></a>')
					.addClass('pull-right')
					.text('Rastreo de actividad ')


				IDS.$thead = $( '<thead></thead>' ).append(
					$('<tr></tr>')
					.append('<th><center>Actividad</center></th>')
					.append('<th><center>Parámetro de aceptación</center></th>')
					.append('<th><center>Lectura Actual</center></th>')
					.append('<th><center>Lectura Posterior</center></th>')
					.append('<th><center>Observaciones</center></th>')
				);

				var struct = struct_body( data.actividades );
				datos.datos_actividad = struct.actividades

				IDS.$tbody = struct.$tbody;

				var $botonGuardar = $( '<button>Guardar</button>' )
					.prop({
						'type': 'submit',
						disabled: opt.withData
					})
					.addClass( 'btn btn-success' )
					.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

				IDS.$botonLimpiar = $( '<button>Limpiar Campos</button>' )
					.prop({
						'type': 'reset',
						disabled: opt.withData
					})
					.addClass( 'btn btn-success' )
					.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

				/* Estructuring document form
				 */
				IDS.$form = $( '<form></form>' )
					.attr( 'role', 'form' )
					.addClass( 'form-horizontal' );

				IDS.$form.append(
					$( '<div class="form-group"></div>' )
					.append(
						$( '<div class="table-responsive"></div>' )
						.append(
							$( '<table class="table table-bordered"></table>' )
							.append( IDS.$thead )
							.append( IDS.$tbody )
						)
					)
				)
				.append(
					$( '<div class="form-group"></div>' )
					.append(
						$( '<p class="col-sm-9"></p>' )
						.append( $botonGuardar )
						.append( '&nbsp;' )
						.append( IDS.$botonLimpiar )
					)
				);

				/* Renderizando elementos a vista
				 */
				$elem.html('<br>');

				if ( !$.isEmptyObject( data.datos_rastreo_actividad ) ) {
					$elem.append(
						$('<div class="panel"></div>')
						.append(
							IDS.$rastreo_actividad
							.append('<span class="glyphicon glyphicon-map-marker"></span>')
						)
					)
					.append('<br><br>')
				}

				$elem.append( IDS.$form );

				// alcance publico del panel contenedor de actividades
				IDS.$actividadesView = $elem;

				// ejecutamos el controlador de la vista
				actividadesController.call( that )
			}

			sigesop.query({
				data: data,
				class: 'mantenimiento',
				query: 'actividades_into_equipo',
				success: struct_document
			});

			// IDS.$equiposView = $('<div class="panel panel-success"></div>').append( IDS.$form );
		};

		var struct_carousel = function ( data ) {
			if ( $.isEmptyObject( data ) ) {
				return null;
			}

			/* Contenedor principal
			 */
			var $carousel = $('<div></div>')
				.prop('id', 'carousel-example-generic')
				.attr('data-ride', 'carousel')
				.addClass('carousel slide');

			/* Indicadores
			 */
			var $indicators = $('<ol></ol>').addClass('carousel-indicators')
				// ponemos el indicador activo
				.append(
					'<li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>'
				)

			var lon = data.length;

			for ( var i = 1; i < lon; i++ ) {
				$indicators.append(
					$('<li data-target="#carousel-example-generic"></li>')
					.attr('data-slide-to', i)
				)
			}

			/* Slide
			 */
			var $slide = $('<div></div>').addClass('carousel-inner').attr('role', 'listbox');
			$.each(data, function(i, row) {
				var $item = $('<div></div>').addClass('item')
				if ( i == 0 ) $item.addClass('active');

				$slide.append(
					$item.append(
						$('<img>').prop('src', '../' + row.media_url)
					)
					.append(
						$('<div></div>').addClass('carousel-caption')
						.text( 'IMAGEN ' + (i+1) )
					)
				)
			});

			/* Controls
			 */
			var $left = $('<a></a>').addClass('left carousel-control')
				.prop('href', '#carousel-example-generic')
				.attr({
					'role': 'button',
					'data-slide': 'prev'
				})
				.append(
					$('<span></span>').attr('aria-hidden', 'true')
					.addClass('glyphicon glyphicon-chevron-left')

				)
				.append(
					$('<span></span>').addClass('sr-only')
					.text('Anterior')
				)

			var $right = $('<a></a>').addClass('right carousel-control')
				.prop('href', '#carousel-example-generic')
				.attr({
					'role': 'button',
					'data-slide': 'next'
				})
				.append(
					$('<span></span>').attr('aria-hidden', 'true')
					.addClass('glyphicon glyphicon-chevron-right')

				)
				.append(
					$('<span></span>').addClass('sr-only')
					.text('Siguiente')
				)

			return 	$carousel.append( $indicators ).append( $slide )
					.append( $left )
					.append( $right );
		}

		var struct_body = function ( data ) {
			var datos = [],
				radio_validation = [], // guarda los name para agregar validacion a input tipo [radio]
				input_validation = [], // guarda los name para agregar validacion a input tipo [text]
				disabled = opt.withData;

		    /* iteracion del objeto para estructurar las propiedades
		     */
		    var $tbody = $('<tbody></tbody>');
		    $.each( data, function( i, actividad ) {
				var datosAct = {
					id_actividad: actividad.id_actividad_verificar,
					observaciones: {
						valor: null,
						idHTML: null
					},
					datos_lectura_actual: [],
					datos_lectura_posterior: []
				};

		    	var $row = 	$('<tr></tr>');

		    	/* Descripcion de la actividad a
		    	 * realizar
		    	 */
		    	var $actividad_verificar = $('<td></td>')
		    		.addClass('active col-lg-2 col-sm-2')
		    		.text( actividad.actividad_verificar );

	            /* iteracion de parametros
	             */
	            var $parametro = $('<td></td>')
	            	.addClass('success col-lg-2 col-sm-2');

	            $.each( actividad.parametro_actividad, function( j, param ) {
	            	switch ( param.tipo_dato ) {
	            		case 'BINARIO':
	            			$parametro.append( param.parametro + '&nbsp;' + param.dato + '<br><br>' );
	            			break;

	            		case 'TEXTO':
	            			$parametro.append( param.parametro + '&nbsp;' + param.dato + '<br><br>' );
	            			break;

	            		case 'COMPARACION':
	            			$parametro.append( param.parametro + '&nbsp;' + param.dato + '&nbsp;' + param.unidad_medida + '<br><br>' );
	            			break;

	            		case 'RANGO' :
							var values = param.dato.splitParametros( ',' );
							var html = 	param.parametro + '&nbsp;' + values[0] +
										'&nbsp; <span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] +
										'&nbsp;' + param.unidad_medida + '<br><br>';

							$parametro.append( html );
	            			break;

	            		case 'TOLERANCIA' :
        					var values = param.dato.splitParametros( ',' ),
								target = parseInt( values[ 0 ] ),
								tol    = parseInt( values[ 1 ] );

	            			var html = 	param.parametro + '&nbsp;' + values[0] +
	            						'&nbsp; <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] +
	            						'&nbsp;' + param.unidad_medida + '<br><br>';

	            			$parametro.append( html )
	            			break;

	            		default:
	            			$parametro.append( param.parametro + '&nbsp;' + param.dato + '&nbsp;' + param.unidad_medida + '<br><br>' );
	            			break;
	            	}
	            });

				/* iteracion de lectura actual
				 */
				var $lectura_actual = $('<td></td>')
					.addClass('warning col-lg-2 col-sm-2');

				$.each( actividad.lectura_actual, function( j, lectura_actual ) {
	            	// estructura de datos para lectura actual
	            	var datos_lectura_actual = {
						id_lectura     : lectura_actual.id,
						dato : {
							valor : null,
							idHTML: null,
							name  : null
						},
						tipo_dato      : lectura_actual.tipo_dato,
						tipo_validacion: lectura_actual.tipo_validacion,
						dato_validacion: lectura_actual.dato_validacion
	            	}

	            	$lectura_actual.append(
	            		$( '<label class="control-label"></label>' )
	            		.text( lectura_actual.parametro )
	            	)
	            	.append('<br>');

					/* definimos tipo de [input] ( radio || text )
					 */
					if( lectura_actual.tipo_dato == 'Binario' ) {
						var name = 'lectura_actual_' + lectura_actual.id;

						var $si = $('<input>')
							.prop({
								type: 'radio',
								value: 'SI',
								name: name
							});

						var $no = $('<input>')
							.prop({
								type: 'radio',
								value: 'NO',
								name: name
							});

						if ( opt.withData === true ) {
							if ( lectura_actual.dato == 'SI' ) {
								$si.prop({
									checked : true,
									disabled: true
								});
								$no.prop({
									checked : false,
									disabled: true
								});
							}

							else if ( lectura_actual.dato == 'NO' ) {
								$si.prop({
									checked : false,
									disabled: true
								});
								$no.prop({
									checked : true,
									disabled: true
								});
							}
						}

						$lectura_actual.append('<div class="col-xs-3"></div>')
						.append(
							$('<div class="col-xs-9"></div>')
							.append(
								$('<div class="radio"></div>').append(
									$('<label></label>').append( $si ).append('SI')
								)
							)
							.append(
								$('<div class="radio"></div>').append(
									$('<label></label>').append( $no ).append('NO')
								)
							)
						)
						.append('<br><br><br>');

						datos_lectura_actual.dato.name = name;
					}
					else if( lectura_actual.tipo_dato == 'Datos' ) {
						var id = sigesop.newId();
						var $input = $('<input/>')
							.prop({
								id  : id,
								type: 'text',
								name: 'input_numeric'
							})
							.addClass('form-control');

						/* Refill boxes with data
						 */
						if ( opt.withData === true ) {
							$input.val( lectura_actual.dato ).prop( 'readonly', true )

							/* Verificamos si los datos cumplen el parametro sino
							 * activamos contorno de error
							 */
							if ( lectura_actual.prioridad == 'U' ) {
								$lectura_actual.addClass('has-error');
							}

							else {
								$lectura_actual.addClass('has-success');
							}
						}

						$lectura_actual.append( $input )
						.append(
							$('<label class="control-label"></label>')
							.text( lectura_actual.unidad_medida )
						)
						.append('<br><br>')

						datos_lectura_actual.dato.idHTML = '#' + id;
					}

					datosAct.datos_lectura_actual.push( datos_lectura_actual );
				});

				/* iteracion de lectura posterior
				 */
				var $lectura_posterior = $('<td></td>')
					.addClass('warning col-lg-2 col-sm-2');

				$.each( actividad.lectura_posterior, function( j, lectura_posterior ) {
	            	// estructura de datos para lectura actual
	            	var datos_lectura_posterior = {
						id_lectura     : lectura_posterior.id,
						dato : {
							valor : null,
							idHTML: null,
							name  : null
						},
						tipo_dato      : lectura_posterior.tipo_dato,
						tipo_validacion: lectura_posterior.tipo_validacion,
						dato_validacion: lectura_posterior.dato_validacion
	            	}

	            	$lectura_posterior.append(
	            		$( '<label class="control-label"></label>' )
	            		.text( lectura_posterior.parametro )
	            	)
	            	.append('<br>');

					/* definimos tipo de [input] ( radio || text )
					 */
					if( lectura_posterior.tipo_dato == 'Binario' ) {
						var name = 'lectura_posterior_' + lectura_posterior.id;

						var $si = $('<input>')
							.prop({
								type: 'radio',
								value: 'SI',
								name: name
							});

						var $no = $('<input>')
							.prop({
								type: 'radio',
								value: 'NO',
								name: name
							});

						if ( opt.withData === true ) {
							if ( lectura_posterior.dato == 'SI' ) {
								$si.prop({
									'checked': true,
									disabled : true
								});
								$no.prop({
									'checked': false,
									disabled : true
								});
							}

							else if ( lectura_posterior.dato == 'NO' ) {
								$si.prop({
									'checked': false,
									disabled : true
								});
								$no.prop({
									'checked': true,
									disabled : true
								});
							}
						}

						$lectura_posterior.append('<div class="col-xs-3"></div>')
						.append(
							$('<div class="col-xs-9"></div>')
							.append(
								$('<div class="radio"></div>').append(
									$('<label></label>').append( $si ).append('SI')
								)
							)
							.append(
								$('<div class="radio"></div>').append(
									$('<label></label>').append( $no ).append('NO')
								)
							)
						)
						.append('<br><br><br>');

						datos_lectura_posterior.dato.name = name;
					}
					else if( lectura_posterior.tipo_dato == 'Datos' ) {
						var id = sigesop.newId();
						var $input = $('<input/>')
							.prop({
								id      : id,
								name    : 'input_numeric',
								type    : 'text',
								readonly: disabled
							})
							.addClass('form-control');

						if ( opt.withData === true ) {
							$input.val( lectura_posterior.dato );

							/* Verificamos si los datos cumplen el parametro sino
							 * activamos contorno de error
							 */
							if ( lectura_posterior.prioridad == 'U' ) {
								$lectura_posterior.addClass('has-error');
							}

							else {
								$lectura_posterior.addClass('has-success');
							}
						}

						$lectura_posterior.append( $input )
						.append(
							$('<label class="control-label"></label>')
							.text( lectura_posterior.unidad_medida )
						)
						.append('<br><br>')

						datos_lectura_posterior.dato.idHTML = '#' + id;
					}

					datosAct.datos_lectura_posterior.push( datos_lectura_posterior );
				});

	            /* campo observaciones
	             */
	            var id = sigesop.newId();
	            var $textarea = $('<textarea></textarea>')
					.prop({
						id  : id,
						name: 'observaciones'
					})
					.addClass('form-control');
				datosAct.observaciones.idHTML = '#' + id;

				var $observaciones = $('<td></td>')
					.addClass('info col-lg-2 col-sm-2')
					.append( $textarea )
					.append('<br>');

				/* seteamos datos capturados y agregamos contorno de error
				 * para marcarlo como de prioridad
				 */
				if ( opt.withData === true ) {
					var val = actividad.observaciones;
					if ( val != null ) {
						$textarea.val( val ).prop( 'readonly', true );
						$observaciones.addClass('has-error');
					}

					/* si existen imagenes en la actividad agregamos el boton
					 * para ver galeria
					 */
					if ( !$.isEmptyObject( actividad.datos_imagen_actividad_verificar ) ) {
						$observaciones.append(
							$('<button></button>')
							.prop({
								type: 'button'
							})
							.attr({
								'id-actividad-verificar': actividad.id_actividad_verificar
							})
							.addClass('btn btn-info btn-lg btn-block')
							.text('GALERIA DE IMAGENES')
							.on( 'click', function(event) {
							    var win = BootstrapDialog.show({
							        title: 'Galeria de imagenes',
							        type: BootstrapDialog.TYPE_DEFAULT,
							        onshown: function ( dialog ) {
							        	var $carousel = struct_carousel( actividad.datos_imagen_actividad_verificar );
							        	dialog.$modalBody.html( $carousel );
							        	$carousel.carousel({
							        		interval: 0
							        	});
							        },
							        size: BootstrapDialog.SIZE_WIDE,
							        draggable: true,
							        buttons: [{
							            label: 'Cancelar',
							            cssClass: 'btn-danger',
							            action: function( dialog ) {
							                dialog.close();
							            }
							        }]
							    })
							})
						);
					}
				}

				var $row = $('<tr></tr>')
					.append( $actividad_verificar )
					.append( $parametro )
					.append( $lectura_actual )
					.append( $lectura_posterior )
					.append( $observaciones );

				// Marcamos actividad como de prioridad dandole un fondo rojo
				if ( opt.withData === false && actividad.prioridad == 'U' ) {
					$row.addClass('danger')
				}

				datos.push( datosAct );
				$tbody.append( $row );
		    });

			return {
				$tbody: $tbody,
				actividades: datos
			};
		};

        var actividadesController = function () {
    		var that = this, IDS = this.IDS, dataModel = this.dataModel;
    		var datos = this.datos;

			var onshown = function ( dialog ) {
				var id = sigesop.newId();
				dialog.$modalBody.html(
					$('<div style="width: 100%; height: 600px;"></div>')
					.prop({
						id: id,
					})
					.addClass('panel')
				);

				// var path = [
				// 	[16.743302, -93.027694], [16.744293, -93.026171],
				// 	[16.742156, -93.025839], [16.741324, -93.029776],
				// 	[16.743132, -93.029862], [16.742700, -93.028306],
				// 	[16.743122, -93.027287], [16.743553, -93.028167],
				// 	[16.743302, -93.027694], [16.744293, -93.029218]
				// ]
				var path = dataModel.actividadesView.datos_rastreo_actividad;
				var firstPoint = {
					lat: path[0][0],
					lng: path[0][1]
				};

				var map = new GMaps({
					el: '#' + id,
					lat: firstPoint.lat,
					lng: firstPoint.lng,
					zoom: 17
				});

				/* Marcador del primer punto
				 */
				map.addMarker({
					lat: firstPoint.lat,
					lng: firstPoint.lng,
					infoWindow: {
						content: '<h3>Punto inicial de captura.</h3>'
					}
				});

				/* añadiendo marcadores de las imagenes tomadas
				 */
				// var images = dataModel.actividadesView.rastreo_actividad.datos_imagen_actividad_verificar;
				// $.each( images, function( i, img ) {
				// 	console.log(img);
				// 	map.addMarker({
				// 	    lat: img.altitud,
				// 	    lng: img.longitud,
				// 		infoWindow: {
				// 			content: '<img style="width: 150px; height: 100%" src="../'+ img.media_url +'"></img>'
				// 		}
				// 	});
				// });

				/* Delimitando area de captura
				 */
				map.drawPolygon({
					paths: path, // pre-defined polygon shape
					// useGeoJSON: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1,
					strokeWeight: 3,
					fillColor: '#FF0000',
					fillOpacity: 0.6
				});
			}

    		// verificamos que se descargo la libreria de internet
    		IDS.$rastreo_actividad.on( 'click', function ( event ) {
    			if ( typeof google !== 'undefined' ) {
				    var win = BootstrapDialog.show({
				        title: 'Rastreo de actividad',
				        type: BootstrapDialog.TYPE_DEFAULT,
				        onshown: onshown,
				        size: BootstrapDialog.SIZE_WIDE,
				        draggable: true,
				        buttons: [{
				            label: 'Cancelar',
				            cssClass: 'btn-danger',
				            action: function( dialog ) {
				                dialog.close();
				            }
				        }]
				    })
				}

				else {
					sigesop.msg('Advertencia', 'Esta funcionalidad requiere conexión a  internet', 'warning');
				}
    		});

			if ( opt.withData === true ) return;

			IDS.$form.formValidation({
		        row: {
		            selector: 'td'
		        },
		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.success == 'function' ?
		        		opt.success( datos, IDS ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            observaciones: {
		                validators: {
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                        message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            input_numeric: {
						validators: {
						    notEmpty: {
						        message: 'Campo requerido'
						    },
						    numeric: {
						    	message: 'Formato inválido'
						    }
						}
		            }
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});


			/* activar validacion de los radiobuttons
			 */	
			IDS.$tbody.find(':radio').each(function () {
				var $elem = $(this);

				IDS.$form.data( 'formValidation' )
				.addField( $elem, {
			        validators: {
			            notEmpty: {
			                message: 'Campo requerido'
			            }
			        }
				});
			});

			IDS.$botonLimpiar.on( 'click', function ( event ) { vaciarDatos.call( doc ); });
    	};

    	/*****************************************************************/

		var struct_tabla_captura = function ( obj ) {
			var
				datos = [],
				radio_validation = [], // guarda los name para agregar validacion a input tipo [radio]
				input_validation = [], // guarda los name para agregar validacion a input tipo [text]
				tabla = '',
				disabled = opt.con_datos === true ? 'disabled' : '',
				j = 0,
				lon_j = obj.actividades.length;

		    /* iteracion del objeto para estructurar las propiedades
		     */
			for( j ; j < lon_j ; j++ ) {
				/* creacion del objeto datosAct
				 */
				var
					fila = obj.actividades[ j ],
					datosAct = {
						id_actividad: fila.id_actividad_verificar,
						observaciones: {
							valor: null,
							idHTML: '#obser_' + obj.id_orden_trabajo + '_' + j + suf
						},
						datos_lectura_actual: [],
						datos_lectura_posterior: []
					};

	            tabla += '<tr>' +
	            		'<td class="active col-lg-2 col-sm-2">' + fila.actividad_verificar + '</td>';

	            /* iteracion de parametros
	             */
	            tabla += '<td class="success col-lg-2 col-sm-2">';

	            var
	            	k = 0,
	            	lon_k = fila.parametro_actividad.length;

	            for( k ; k < lon_k; k++ ) {
	            	var mtz = fila.parametro_actividad[ k ];

	            	switch ( mtz.tipo_dato ) {
	            		case 'BINARIO':
	            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '<br><br>';
	            			break;

	            		case 'TEXTO':
	            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '<br><br>';
	            			break;

	            		case 'COMPARACION':
	            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '&nbsp;' + mtz.unidad_medida + '<br><br>';
	            			break;

	            		case 'RANGO' :
							var values = mtz.dato.splitParametros( ',' );

	            			tabla += mtz.parametro + '&nbsp;' + values[0] +
	            				'&nbsp; <span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] +
	            				'&nbsp;' + mtz.unidad_medida + '<br><br>';
	            			break;

	            		case 'TOLERANCIA' :
        					var
	            				values = mtz.dato.splitParametros( ',' ),
	            				target = parseInt( values[ 0 ] ),
	            				tol = parseInt( values[ 1 ] );

	            			tabla += mtz.parametro + '&nbsp;' + values[0] +
	            				'&nbsp; <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] +
	            				'&nbsp;' + mtz.unidad_medida + '<br><br>';
	            			break;

	            		default:
	            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '&nbsp;' + mtz.unidad_medida + '<br><br>';
	            			break;
	            	}
	            }

	            tabla += '</td>';

				/* iteracion de lectura actual
				 */
	            tabla += '<td class="success col-lg-2 col-sm-2">';

	            var
	            	k = 0,
	            	lon_k = fila.lectura_actual.length;

	            for( k ; k < lon_k; k++ ) {
	            	var mtz = fila.lectura_actual[ k ],
	            		secuencia = 'actual_' + obj.id_orden_trabajo + '_' + fila.id_actividad_verificar +
	            			mtz.secuencia_datos + '_' + k + suf,
	            		tipoDato = mtz.tipo_dato;

	            	// creacion del objeto datosLecAct

	            	var datosLecAct = {
	            		id_lectura: mtz.id,
	            		dato: {
	            			valor: null,
	            			name: secuencia
	            		},
	            		tipo_dato: mtz.tipo_dato,
	            		tipo_validacion: mtz.tipo_validacion,
	            		dato_validacion: mtz.dato_validacion
	            	}

	            	tabla += '<label class="control-label">' + mtz.parametro + '</label>';

					/* definimos tipo de [input] ( radio || text )
					 */
					if( tipoDato == 'Binario' )
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */
						var checked_si = null,
							checked_no = null;

						if ( opt.con_datos === true && fila.lectura_actual[ k ].dato == 'SI' ) {
							checked_si = ' checked="true" ';
							checked_no = '';
						}
						else if ( opt.con_datos === true && fila.lectura_actual[ k ].dato == 'NO' ) {
							checked_si = '';
							checked_no = ' checked="true" ';
						}

						tabla += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" name="' +
								secuencia + '" value="SI" ' + disabled +
								'> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" name="' +
								secuencia + '" value="NO" ' + disabled +
								'> NO' +
							'</label><br>';

						radio_validation.push( secuencia );
					}
					else if( tipoDato == 'Datos' )
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */
						var val = opt.con_datos === true ? fila.lectura_actual[ k ].dato : '';

						tabla +=
							'<input name="' + secuencia + '" class="form-control" type="text" id="' +
								secuencia + '" ' + disabled + ' value="' + val + '">' +
							'<label class="control-label">' + mtz.unidad_medida + '</label><br><br>';

						datosLecAct.dato.idHTML = '#' + secuencia;
						input_validation.push( secuencia );
					}

					datosAct.datos_lectura_actual.push( datosLecAct );
	            }

	            tabla += '</td>';

	            /* iteracion de lectura posterior
	             */
	            tabla += '<td class="success col-lg-2 col-sm-2">';

	            var
	            	k = 0,
	            	lon_k = fila.lectura_posterior.length;

	            for( k ; k < lon_k; k++ ) {
	            	var mtz = fila.lectura_posterior[ k ],
	            		secuencia = 'post_' + obj.id_orden_trabajo + '_' + fila.id_actividad_verificar +
	            			fila.lectura_posterior[ k ].secuencia_datos + '_' + k + suf,
	            		tipoDato = mtz.tipo_dato;

	            	// ---------- creacion del objeto datosLecPost

	            	var datosLecPost = {
	            		id_lectura: mtz.id,
	            		dato: {
	            			valor: null,
	            			name: secuencia
	            		},
	            		tipo_dato: mtz.tipo_dato,
	            		tipo_validacion: mtz.tipo_validacion,
	            		dato_validacion: mtz.dato_validacion
	            	}

	            	tabla += '<label class="control-label">' + mtz.parametro + '</label>';

					if( tipoDato == 'Binario' )
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */
						var checked_si = null,
							checked_no = null;

						if ( opt.con_datos === true && fila.lectura_posterior[ k ].dato == 'SI' ) {
							checked_si = ' checked="true" ';
							checked_no = '';
						}
						else if ( opt.con_datos === true && fila.lectura_posterior[ k ].dato == 'NO' ) {
							checked_si = '';
							checked_no = ' checked="true" ';
						}

						tabla += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" name="' +
								secuencia + '" value="SI" ' + disabled +
								'> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" name="' +
								secuencia + '" value="NO" ' + disabled +
								'> NO' +
							'</label><br>';

						radio_validation.push( secuencia );
					}
					else if( tipoDato == 'Datos' )
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */
						var val = opt.con_datos === true ? fila.lectura_posterior[ k ].dato : '';

						tabla +=
							'<input name="' + secuencia + '" class="form-control" type="text" id="' +
								secuencia + '" value="' + val + '" ' + disabled + '>' +
							'<label class="control-label">' + mtz.unidad_medida + '</label><br><br>';

						datosLecPost.dato.idHTML = '#' + secuencia;
						input_validation.push( secuencia );
					}

					datosAct.datos_lectura_posterior.push( datosLecPost );
	            }

	            datos.push( datosAct );

	            /* campo observaciones
	             */
	            tabla +=
	            	'</td>' +
	            		'<td class="info col-lg-2 col-sm-2">' +
	            			'<textarea name="observaciones" id="obser_' +
	            			obj.id_orden_trabajo + '_' + j + suf +
	            			'" class="form-control" ' +
	            			disabled + ' ></textarea>' +
	            		'</td>' +
	            	'</tr>';
			}

            return {
            	html: tabla,
            	actividades: datos,
            	radio_validation: radio_validation,
            	input_validation: input_validation
            };
		};

		var struct_tabla_con_datos = function ( obj ) {
			var
				tabla = '',
				j = 0,
				lon_j = obj.actividades.length;

		    /* iteracion del objeto para estructurar las propiedades
		     */
			for( j ; j < lon_j ; j++ ) {
				var fila = obj.actividades[ j ];

	            tabla +=
	            	'<tr>' +
	            		'<td class="active col-lg-2 col-sm-2">' + fila.actividad_verificar + '</td>';

	            /* iteracion de parametros
	             */
	            tabla += '<td class="success col-lg-2 col-sm-2">';

	            var
	            	k = 0,
	            	lon_k = fila.parametro_actividad.length;

	            for( k ; k < lon_k; k++ ) {
	            	var parametro = fila.parametro_actividad[ k ];

	            	switch ( parametro.tipo_dato ) {
	            		case 'BINARIO':
	            			tabla += parametro.parametro + '&nbsp;' +
	            			parametro.dato + '<br><br>';
	            			break;

	            		case 'TEXTO':
	            			tabla += parametro.parametro + '&nbsp;' +
	            			parametro.dato + '<br><br>';
	            			break;

	            		case 'COMPARACION':
	            			tabla += parametro.parametro + '&nbsp;' +
	            			parametro.dato + '&nbsp;' + parametro.unidad_medida + '<br><br>';
	            			break;

	            		case 'RANGO' :
							var values = parametro.dato.splitParametros( ',' );

	            			tabla +=
	            				parametro.parametro + '&nbsp;' +
            					values[0] + '&nbsp; <span class="glyphicon glyphicon-minus"></span> &nbsp;' +
            					values[1] + '&nbsp;' + parametro.unidad_medida + '<br><br>';
	            			break;

	            		case 'TOLERANCIA' :
        					var
	            				values = parametro.dato.splitParametros( ',' ),
	            				target = parseInt( values[ 0 ] ),
	            				tol = parseInt( values[ 1 ] );

	            			tabla +=
	            				parametro.parametro + '&nbsp;' +
	            				values[0] + '&nbsp; <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span> &nbsp;' +
	            				values[1] + '&nbsp;' + parametro.unidad_medida + '<br><br>';
	            			break;

	            		default:
	            			tabla += parametro.parametro + '&nbsp;' + parametro.dato + '&nbsp;' + parametro.unidad_medida + '<br><br>';
	            			break;
	            	}
	            }

	            tabla += '</td>';

				/* iteracion de lectura actual
				 */
	            var
	            	html = '',
	            	validacion = false,
	            	k = 0,
	            	lon_k = fila.lectura_actual.length;

	            for( k ; k < lon_k; k++ ) {
	            	var lectura_actual = fila.lectura_actual[ k ];

	            	html +=
	            		'<label class="control-label">' +
	            			lectura_actual.parametro +
	            		'</label>';

					/* definimos tipo de [input] ( radio || text )
					 */
					if( lectura_actual.tipo_dato == 'Binario' ) {
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */

						if ( lectura_actual.dato == 'SI' ) {
							var checked_si = ' checked="true" ',
								checked_no = '';
						}
						else if ( lectura_actual.dato == 'NO' ) {
							var checked_si = '',
								checked_no = ' checked="true" ';
						}

						html +=
							'<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" value="SI" disabled > SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" value="NO" disabled > NO' +
							'</label><br>';
					}
					else if( lectura_actual.tipo_dato == 'Datos' )
					{
						/* activamos la bandera para dar la vista de error
						 */
						if ( lectura_actual.prioridad == 'U' ) validacion = true;

						html +=
							'<input class="form-control" type="text" value="' + lectura_actual.dato + '" disabled> ' +
							'<label class="control-label">' +
								lectura_actual.unidad_medida +
							'</label><br><br>';
					}
	            }

				tabla += validacion === false ?
					'<td class="info col-lg-2 col-sm-2 has-success">':
					'<td class="info col-lg-2 col-sm-2 has-error">';

				tabla +=
						html +
					'</td>' ;

	            /* iteracion de lectura posterior
	             */
	            var
	            	html = '',
	            	validacion = false,
	            	k = 0,
	            	lon_k = fila.lectura_posterior.length;

	            for( k ; k < lon_k; k++ )
	            {
	            	var lectura_posterior = fila.lectura_posterior[ k ];

	            	html +=
	            		'<label class="control-label">' +
	            			lectura_posterior.parametro +
	            		'</label>';

					if( lectura_posterior.tipo_dato == 'Binario' )
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada
						 */
						if ( lectura_posterior.dato == 'SI' ) {
							var checked_si = ' checked="true" ';
								checked_no = '';
						}
						else if ( lectura_posterior.dato == 'NO' ) {
							var checked_si = '';
								checked_no = ' checked="true" ';
						}

						html += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" value="SI" disabled> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" value="NO" disabled> NO' +
							'</label><br>';
					}
					else if( lectura_posterior.tipo_dato == 'Datos' )
					{
						/* activamos la bandera para dar la vista de error
						 */
						if ( lectura_posterior.prioridad == 'U' ) validacion = true;

						html +=
							'<input class="form-control" type="text" value="' + lectura_posterior.dato + '" disabled>' +
							'<label class="control-label">' +
								lectura_posterior.unidad_medida +
							'</label><br><br>';
					}
	            }

				tabla += validacion === false ?
					'<td class="info col-lg-2 col-sm-2 has-success">':
					'<td class="info col-lg-2 col-sm-2 has-error">';

				tabla +=
						html +
					'</td>' ;
	            /* campo observaciones
	             */
	            tabla += $.isEmptyObject( fila.observaciones ) ?
            		'<td class="info col-lg-2 col-sm-2">':
            		'<td class="info col-lg-2 col-sm-2 has-error">';

            	tabla +=
            			'<textarea class="form-control" readonly >' +
            				fila.observaciones +
            			'</textarea>' +
            		'</td>' +
            	'</tr>';
			}

            return {
            	html: tabla
            };
		};

		var vaciarDatos = function () { this.IDS.$form.formValidation( 'resetForm' ); };

		/*****************************************************************/

    	/* Inicializacion del documento
    	 */
		var factory = function () {
			var IDS = this.IDS;

			if ( typeof this !== 'undefined' ) {
				sistemasView.call( this );
				$( that ).append( IDS.$sistemasView );
			}

			return this;
		};

    	var datos = {
			id_orden_trabajo: opt.obj.id_orden_trabajo,
			datos_actividad: null
		};

		var IDS = {
			$botonLimpiar   : null,
			$sistemasView   : $('<div></div>'), // contenedor principal del documento
			$equiposView    : null,
			$actividadesView: null,

			$rastreo_actividad: null,
			$form             : null,
			$tbody            : null,
			$thead            : null
		};

		var dataModel = {
			actividadesView: {
				datos_rastreo_actividad: [],
				actividades: []
			}
		}

		var doc = {
			datos    : datos,
			IDS      : IDS,
			dataModel: dataModel
		};

		doc.factory = factory.bind( doc );

		return doc;
	}
};

$.extend( jQuery.fn, {
	'newCheckList': sigesop.capturaOrdenTrabajo.documentActivity
});
