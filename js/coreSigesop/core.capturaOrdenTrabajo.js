sigesop.capturaOrdenTrabajo = {
	document: function( opt )
	{
		var suf = opt.suf || '';

		var 
			html =
				'<form id="formCapturaOrdenes' + suf + '">' +
					'<div class="form-group">' +					
						'<div class="col-sm-12 col-md-12" id="tabla_captura_ordenes' + suf + '"></div>' +
					'</div>' +
				'</form>',

			javascript = function () {
				var
				tabla = sigesop.tablaRegistro ({
					suf: 	'_ordenTrabajo',
					head: 	'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, ' +
							'SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, ' +
							'FECHA REPROGRAMADA',
					campo: 	'numero_orden, trabajo_solicitado, nombre_mantenimiento, ' +
							'orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada'
				});
				
				this.table.update_table = tabla.update_table; // enlazamos a vista publica
				this.table.body = tabla.IDS.body;
				document.getElementById( this.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + tabla.html

				$( tabla.IDS.body ).contextMenu({
					selector: 'tr',
					items: {
			            insertData: {
			            	name: 'Insertar datos', 
			            	icon: 'user',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.insertData == 'function' ?
			        				opt.table.actions.insertData( index ):
			        				console.log( 'function insertData is null' );
			        		}
			            },
			            readData: {
			            	name: 'Leer datos capturados',
			            	icon: 'copy',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.readData == 'function' ?
			        				opt.table.actions.readData( index ):
			        				console.log( 'function readData is null' );
			        		}
			            }
					}
				});
			},

			IDS = {
				idTabla: '#tabla_captura_ordenes' + suf,
				form: '#formCapturaOrdenes' + suf
			},

			doc = {
				html: html,
				javascript: javascript,
				IDS: IDS,
				table: {
					body: null,
					update_table: null
				}
			};

		return doc;
	},

	documentInsertData: function ( opt )
	{
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
			if ( $.isEmptyObject( arr ) )
			{
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

			for( var i = 0, lon = arr.length; i < lon; i++ )
			{
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
				beforeActivate: function( event, ui ) 
				{
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
			}
		};

		return doc;
	},

	documentActivity: function ( opt )
	{
		/*
		 * obj
		 * suf
		 * success
		 * error
		 */ 

		if ( jQuery.isEmptyObject( opt.obj.actividades ) )
		{
			sigesop.msg( 'Info', 'Se requiere de los datos de la orden de trabajo', 'info' );
			return null;
		}

		var 
		obj = opt.obj,
		
		suf = opt.suf || '',

		html = 
			'<form id="formActividadesEquipo_' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
            		'<div class="panel panel-default table-responsive">' +
            			'<div class="panel-heading">LISTA DE VERIFICACION</div>' +
            			'<table class="table table-bordered">' +
            				'<thead><tr><th><center>Actividad</center></th><th><center>Parámetro de aceptación</center></th><th><center>Lectura Actual</center></th>' +
            					'<th><center>Lectura Posterior</center></th><th><center>Observaciones</center></th></tr>' +
            				'</thead>' +
            				'<tbody id="idBodyActividad_' + suf + '"></tbody>' +
        				'</table>' +		            
            		'</div>' +         
            	'</div>' +

				'<div class="form-group">' +					
					'<p class="col-sm-9">' +
						'<button id="btnGuardarLista_' + obj.id_orden_trabajo + suf + '" class="btn btn-success" type="submit"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
						'<button id="btnLimpiarLista_' + obj.id_orden_trabajo + suf + '" class="btn btn-success" type="reset"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>' +
				'</div>' +	            
            '</form>',
		
		struct_tabla_captura = function ( obj ) {
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
			for( j ; j < lon_j ; j++ )
			{
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
	            		'<td class="active col-lg-2 col-sm-2 text-justify">' + fila.actividad_verificar + '</td>';

	            /* iteracion de parametros
	             */
	            tabla += '<td class="success col-lg-2 col-sm-2 text-justify">';

	            var 
	            	k = 0,
	            	lon_k = fila.parametro_actividad.length;

	            for( k ; k < lon_k; k++ )
	            {
	            	var mtz = fila.parametro_actividad[ k ];

	            	switch ( mtz.tipo_dato )
	            	{
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

	            for( k ; k < lon_k; k++ )
	            {
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

						if ( opt.con_datos === true && fila.lectura_actual[ k ].dato == 'si' ) {
							checked_si = ' checked="true" ';
							checked_no = '';
						} 
						else if ( opt.con_datos === true && fila.lectura_actual[ k ].dato == 'no' ) {
							checked_si = '';
							checked_no = ' checked="true" ';
						}
 
						tabla += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" name="' + 
								secuencia + '" value="si" ' + disabled + 
								'> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" name="' + 
								secuencia + '" value="no" ' + disabled + 
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

	            for( k ; k < lon_k; k++ )
	            {
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

						if ( opt.con_datos === true && fila.lectura_posterior[ k ].dato == 'si' ) {
							checked_si = ' checked="true" ';
							checked_no = '';
						} 
						else if ( opt.con_datos === true && fila.lectura_posterior[ k ].dato == 'no' ) {
							checked_si = '';
							checked_no = ' checked="true" ';
						}

						tabla += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" name="' + 
								secuencia + '" value="si" ' + disabled + 
								'> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" name="' + 
								secuencia + '" value="no" ' + disabled + 
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
	            			'" class="form-control eventoCambioMayuscula" ' +
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
		},
		
		struct_tabla_con_datos = function ( obj ) {
			var 
				tabla = '',
				j = 0,
				lon_j = obj.actividades.length;

		    /* iteracion del objeto para estructurar las propiedades
		     */
			for( j ; j < lon_j ; j++ )
			{
				var fila = obj.actividades[ j ];

	            tabla += 
	            	'<tr>' +     
	            		'<td class="active col-lg-2 col-sm-2 text-justify">' + fila.actividad_verificar + '</td>';

	            /* iteracion de parametros
	             */
	            tabla += '<td class="success col-lg-2 col-sm-2 text-justify">';

	            var 
	            	k = 0,
	            	lon_k = fila.parametro_actividad.length;

	            for( k ; k < lon_k; k++ )
	            {
	            	var parametro = fila.parametro_actividad[ k ];

	            	switch ( parametro.tipo_dato )
	            	{
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

	            for( k ; k < lon_k; k++ )
	            {
	            	var lectura_actual = fila.lectura_actual[ k ];
	            	
	            	html += 
	            		'<label class="control-label">' + 
	            			lectura_actual.parametro + 
	            		'</label>';

					/* definimos tipo de [input] ( radio || text )
					 */
					if( lectura_actual.tipo_dato == 'Binario' ) 
					{
						/* rellenamos de datos si la bandera [con_datos]
						 * es activada						
						 */

						if ( lectura_actual.dato == 'si' ) {
							var checked_si = ' checked="true" ',
								checked_no = '';
						} 
						else if ( lectura_actual.dato == 'no' ) {
							var checked_si = '',
								checked_no = ' checked="true" ';
						}
 
						html += 
							'<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" value="si" disabled > SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" value="no" disabled > NO' +
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
						if ( lectura_posterior.dato == 'si' ) {
							var checked_si = ' checked="true" ';
								checked_no = '';
						} 
						else if ( lectura_posterior.dato == 'no' ) {
							var checked_si = '';
								checked_no = ' checked="true" ';
						}

						html += '<br>' +
							'<label class="radio-inline">' +
								'<input ' + checked_si + ' type="radio" value="si" disabled> SI' +
							'</label>' +

							'<label class="radio-inline"> ' +
								'<input ' + checked_no + ' type="radio" value="no" disabled> NO' +
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
            			'<textarea class="form-control eventoCambioMayuscula" readonly >' +
            				fila.observaciones +
            			'</textarea>' +
            		'</td>' +
            	'</tr>';
			}

            return {
            	html: tabla
            };
		},

		vaciarDatos = function () { this.IDS.$form.formValidation( 'resetForm' ); },

        javascript = function () {
    		var 
			doc = this,
			table = null;

    		var
			form = doc.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$botonGuardar = $( doc.IDS.botonGuardar );

			/* Verificar bandera [con_datos] para deshabilitar los 
			 * elementos necesario para esta modalidad asi como la 
			 * validacion del formulario
			 */ 
			if ( opt.con_datos !== true ) 
			{
				table = struct_tabla_captura( obj );
				document.getElementById( doc.IDS.idTabla.flushChar('#') )
				.innerHTML = table.html;
				doc.datos.datos_actividad = table.actividades;

				$( '.eventoCambioMayuscula' ).eventoCambioMayuscula();

				var
				$form = $( form ).formValidation({
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },
			        row: {
			            selector: 'td'
			        },
			        onSuccess: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, doc.IDS ) :
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
			            }
			        }
				})
				.on( 'success.field.fv', function( e, data ) {
					data.fv.disableSubmitButtons( false );
				});

				doc.IDS.$form = $form;				

				/* enlazar la validacion de los radiobuttons
				 */
				if ( !jQuery.isEmptyObject( table.radio_validation ) )
				{
					var 
						i = 0,
						arr = table.radio_validation,
						lon = arr.length;

					for ( i ; i < lon ; i++ )
					{
						$form.data( 'formValidation' ).addField( arr[i], 
							{
				                validators: {
				                    notEmpty: {
				                        message: 'Campo requerido'
				                    }
				                }
							}
						);
					}
				}

				/* enlazar la validacion de los radiobuttons
				 */
				if ( !jQuery.isEmptyObject( table.input_validation ) )
				{
					var 
						i = 0,
						arr = table.input_validation,
						lon = arr.length;

					for ( i ; i < lon ; i++ )
					{
						$form.data( 'formValidation' ).addField( arr[i], 
							{
				                validators: {
				                    notEmpty: {
				                        message: 'Campo requerido'
				                    },
				                    numeric: {
				                        message: 'Formato inválido'
				                    }
				                }
							}
						);
					}
				}

	    		$botonLimpiar.on( 'click', function ( event ) { vaciarDatos.call( doc ); });
			}
			else {
				table = struct_tabla_con_datos( obj );
				document.getElementById( doc.IDS.idTabla.flushChar('#') )
				.innerHTML = table.html;

				$botonLimpiar.prop( 'disabled', true );
				$botonGuardar.prop( 'disabled', true );
			}
    	},

    	datos = {
			// id_lista_verificacion: obj.id_lista_verificacion,
			id_orden_trabajo: obj.id_orden_trabajo,
			// id_orden_lista: obj.id_orden_lista,
			datos_actividad: null
		},

		IDS = {
			idTabla: '#idBodyActividad_' + suf,
			botonGuardar: '#btnGuardarLista_' + obj.id_orden_trabajo + suf,
			botonLimpiar: '#btnLimpiarLista_' + obj.id_orden_trabajo + suf,
			form: '#formActividadesEquipo_' + suf,
			$form: null
		},

    	doc = {
	    	html: html,
	    	javascript: javascript,
	    	datos: datos,
			IDS: IDS
    	};

	    return doc;
	}
};