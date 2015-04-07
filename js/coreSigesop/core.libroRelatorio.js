sigesop.reporteNovedades = {
	document : function ( opt ) {
		/*
		 * obj
		 * suf
		 * success
		 * error
		 */ 

		var
			obj = 	opt.obj || {

					},

			suf = opt.suf || '',

			html =
				'<form id="formRelatorio' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Tipo de reporte: </label>'+
					'<div class="col-sm-7">'+
						'<select name="reporte_por" id="reporte_por' + suf + '" class="form-control input-md">'+
							'<option value="">' + sigesop.seleccioneOpcion + '</option>' +
							'<option value="byAero">AEROGENERADOR</option>' +
							'<option value="byUnidad">UNIDAD</option>' +				
						'</select>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">No. de Unidad: </label>'+
					'<div class="col-sm-7">'+
						'<select name="numero_unidad" id="numero_unidad' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">No. de Aerogenerador: </label>'+
					'<div class="col-sm-7">'+
						'<select name="numero_aero" id="numero_aero' + suf + '" class="form-control input-md" disabled></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Año de Licencia: </label>'+
					'<div class="col-sm-7">'+
						'<select name="id_libro_licencia" id="id_libro_licencia' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Hora Inicio Evento (HH:SS): </label>' +
					'<div class="col-sm-7">' +
						'<input name="hora_inicio_evento" id="hora_inicio_evento' + suf + '" class="form-control input-md" type="text">' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Fecha Inicio Evento: </label>' +
					'<div class="col-sm-7">' +
						'<input name="fecha_inicio_evento" id="fecha_inicio_evento' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Fecha estimada de termino: </label>' +
					'<div class="col-sm-7">' +
						'<input name="fecha_termino_estimado" id="fecha_termino_estimado' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Condicion Operativa: </label>'+
					'<div class="col-sm-7">'+
						'<select name="condicion_operativa" id="condicion_operativa' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Trabajador que solicitó:</label>' +
					'<div class="col-sm-5">' +
						'<input name="solicito" id="solicito' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Seleccione trabajador">' +
					'</div>' +
					'<div class="col-sm-2">' +
						'<button type="button" id="botonSolicito' + suf + '" class="btn btn-primary">Seleccione Trabajador</button>' +
					'</div>' +
				'</div>' +

				// '<div class="form-group">' +
				// '	<label class="col-sm-3 control-label">Trabajador que autorizó:</label>' +
				// '	<div class="col-sm-5">' +
				// '		<input name="autorizo" id="autorizo' + suf + '" class="form-control input-md" placeholder="Seleccione trabajador">' +
				// '	</div>' +
				// '	<div class="col-sm-2">' +
				// '		<button type="button" id="botonAutorizo' + suf + '" class="btn btn-primary">Seleccione Trabajador</button>' +
				// '	</div>' +
				// '</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Causa de salida: </label>' +
					'<div class="col-sm-7">' +
						'<textarea name="descripcion_evento" id="descripcion_evento' + suf + '" class="form-control input-md eventoCambioMayuscula" type="text"></textarea>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btnGuardarReporte' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button type="reset" id="botonLimpiarReporte' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>'+
				'</div>'+

				'</form>',

			javascript = function () 
			{
				var
				doc = this,
				now = moment().format( 'DD-MM-YYYY' ),
				form = doc.IDS.form,
				$hora_inicio_evento = $( doc.datos.hora_inicio_evento.idHTML ),
				$fecha_inicio_evento = $( doc.datos.fecha_inicio_evento.idHTML ),
				$fecha_termino_estimado = $( doc.datos.fecha_termino_estimado.idHTML ),
				$reporte_por = $( doc.datos.reporte_por.idHTML ),
				$numero_unidad = $( doc.datos.numero_unidad.idHTML ),
				$numero_aero = $( doc.datos.numero_aero.idHTML ),
				$condicion_operativa = $( doc.datos.condicion_operativa.idHTML ),
				$form = $( form ).formValidation({
					// live: 'submit',
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },

			        onSuccess: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, doc.IDS, limpiarCampos ) :
			        		console.log( 'success is null' );

			        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
			        },

			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },

			        fields: {
			            reporte_por: {
			                validators: {
			                    notEmpty: {
			                        message: 'Campo necesario'
			                    }
			                }
			            },
			            numero_unidad: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione unidad de generador'
			                    }
			                }
			            },
			            numero_aero: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione numero de generador'
			                    }
			                }
			            },
			            id_libro_licencia: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione año de licencia'
			                    }
			                }
			            },
			            hora_inicio_evento: {
			                validators: {
			                    notEmpty: {
			                        message: 'Escriba la hora del evento'
			                    },
								regexp : {
									regexp : /^([0-9]{2})\:([0-9]{2})$/,
									message: 'Escriba la hora en formaro 24 hrs.'
								}
			                }
			            },
			            fecha_inicio_evento: {
			                validators: {
			                    notEmpty: {
			                        message: 'Es necesaria la fecha de inicio'
			                    },
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Escriba un formato de fecha válido'
                                }
			                }
			            },
			            fecha_termino_estimado: {
			                validators: {
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Escriba un formato de fecha válido'
                                }
			                }
			            },
			            condicion_operativa: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione condicion operativa'
			                    }
			                }
			            },
			            solicito: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione trabajador que solicita'
			                    },
			                    stringLength: {
			                    	min: 5,
			                    	max: 5,
			                    	message: 'Número de caracteres inválido'
			                    },
			                    regexp: {
			                    	regexp: /^[\dA-Z]*$/i,
			                    	message: 'El formato de usuario es inválido'
			                    }
			                }
			            },
			            descripcion_evento: {
			                validators: {
			                    notEmpty: {
			                        message: 'Es necesaria la descripción del evento'
			                    },
			                    regexp: {
			                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
			                        message: 'Caracteres inválidos'
			                    }
			                }
			            },				            
			        }
				});

				doc.IDS.$form = $form;

				sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );				

				Globalize.culture( 'de-DE' );
				$hora_inicio_evento.val( moment().format( 'HH:mm' ) );
				$.widget( "ui.timespinner", $.ui.spinner, {
					options: {
						// segundos
						step: 60 * 1000,
						// horas
						page: 60
					},

					_parse: function( value ) {
						if ( typeof value === "string" ) {
							// already a timestamp
							if ( Number( value ) == value ) {
								return Number( value );
							}
							return + Globalize.parseDate( value );
						}

						return value;
					},

					_format: function( value ) {
						return Globalize.format( new Date(value), "t" );
					}
				});
				$hora_inicio_evento.timespinner();
				$hora_inicio_evento.spinner({ // evento para revalidar los campos
					change: function ( event, ui ) {
						$form.formValidation( 'revalidateField', 'hora_inicio_evento' );						
					}
				});

				$fecha_inicio_evento.val( moment().format( 'DD-MM-YYYY' ) );
				$fecha_inicio_evento.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						doc.IDS.$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
					}
				});

				$fecha_termino_estimado.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						doc.IDS.$form.formValidation( 'revalidateField', 'fecha_termino_estimado' );
					}
				})
				.on( 'success.field.fv', function ( e, data ) {
					var 
						fecha_1 = moment( $fecha_inicio_evento.val(), 'DD-MM-YYYY' ),
						fecha_2 = moment( $fecha_termino_estimado.val(), 'DD-MM-YYYY' );

					if( $fecha_termino_estimado.val() )
						if ( fecha_2.isBefore( fecha_1 ) )
						{			
							$form.data( 'formValidation' ).updateStatus( 'fecha_termino_estimado', 'INVALID' );
							$fecha_termino_estimado.val('');
							sigesop.msg( 'Advertencia', 'Fecha fuera de rango', 'warning' );
						}
				});

				$reporte_por.change( function ( event ) 
				{
					var 
						estado = $( this ).val(),
						elemento = doc.datos.numero_aero.idHTML;

					switch ( estado )
					{
						case 'byAero': byAero( elemento ); break;
						case 'byUnidad': byUnidad( elemento, doc.datos.numero_aero.valor ); break;
						default: $( doc.IDS.form ).data( 'formValidation' ).resetField( 'numero_aero' ); break;
					}
				});

				$numero_unidad.change( function ( event ) 
				{
					change_condicion_operativa();

					var unidad = $( this ).val();
					if( unidad )
					{
						sigesop.query({
							data: { numero_unidad: unidad, option: 'libro_relatorio' },
							class: 'generadores',
							query: 'obtenerGeneradores',
							queryType: 'sendGetData',
							success: function ( data ) 
							{
								window.sesion.matrizGeneradores = data;
								sigesop.combo({
									arr: data,
									elem: doc.datos.numero_aero.idHTML,
									campo: 'numero_aero'
								});
								doc.IDS.$form.formValidation( 'revalidateField', 'numero_aero' );
							}
						});
					}
				})

				$numero_aero.change( function ( event ) { change_condicion_operativa();	});

				$condicion_operativa.change( function ( event ) 
				{
					var 
						value = $( this ).val();

					if ( value === 'MTTO' ) 
					{
						var 
							unidad = $numero_unidad.val(),
							aero = $numero_aero.val(),
							reporte_por = $reporte_por.val();

						if ( reporte_por === 'byAero' ) run_mantenimiento( unidad, aero, reporte_por );
						else
						{							
							sigesop.msg( 'Info', 'La salida por MTTO es únicamente por Aerogenerador', 'info' );

							$reporte_por.val('');
							$form.formValidation( 'revalidateField', 'reporte_por' );

							$condicion_operativa.val('');
							$form.formValidation( 'revalidateField', 'condicion_operativa' );
						}
					}

					else doc.datos.condicion_operativa.mantenimiento.length = 0; // vaciamos los datos
				});

				$( doc.datos.trabajador_solicito.idHTML ).on( 'success.field.fv', function ( e, data ) 
				{
					var elem = $( e.target );
					if( localStorage.rpe === elem.val().toUpperCase() ) // verificamos que no sea el mismo usuario					
					{						
						elem.val( '' );
						$form.formValidation( 'revalidateField', 'solicito' ); // revalidar
						sigesop.msg( 'Info', 'El usuario seleccionado no puede ser el mismo que el actual', 'info' );
					}
				});

				$( doc.datos.trabajador_solicito.boton ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					seleccionarUsuario( doc.datos.trabajador_solicito, 'solicito' );
				});

				$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
			},

			byAero = function ( elemento )
			{			
				$( elemento ).prop( 'disabled', false );
				$( elemento ).val( '' );
			},

			byUnidad = function ( elemento, valor )
			{				
				$( doc.IDS.form ).data( 'formValidation' ).resetField( 'numero_aero' );				
				$( elemento ).prop( 'disabled', true );
				$( elemento ).val( '' );
			},

			change_condicion_operativa = function ()
			{
				var co = $( doc.datos.condicion_operativa.idHTML );

				if ( co.val() === 'MTTO' ) // reiniciamos valores de mantenimiento
				{
					co.val('');
					doc.datos.condicion_operativa.mantenimiento.length = 0;
					$( doc.IDS.form ).data( 'formValidation' ).resetField( 'condicion_operativa' );
				}
			},

			run_mantenimiento = function ( unidad, aero, reporte_por )
			{
				var query = { libro_relatorio: true };

				switch ( reporte_por )
				{
					case 'byAero': 
						if ( aero ) query.numero_aero = aero;
						else 
						{
							doc.IDS.$form.formValidation( 'revalidateField', 'numero_aero' );
							sigesop.msg( 'Advertencia', 'Complete el campo: No. de Aerogenerador', 'warning' );

							// ---------

							$( doc.datos.condicion_operativa.idHTML ).val('');
							doc.IDS.$form.formValidation( 'revalidateField', 'condicion_operativa' );

							// ---------

							return null;
						}
						break;

					case 'byUnidad': 						
						if ( unidad ) query.numero_unidad = unidad;
						else 
						{					
							doc.IDS.$form.formValidation( 'revalidateField', 'numero_unidad' );
							sigesop.msg( 'Advertencia', 'Complete el campo: No. de Unidad', 'warning' );

							// ---------

							$( doc.datos.condicion_operativa.idHTML ).val('');
							doc.IDS.$form.formValidation( 'revalidateField', 'condicion_operativa' );

							// --------

							return null;
						}
						break;
				}

				sigesop.query({
					data: query,
					class: 'generadores',
					query: 'obtenerGeneradores',
					queryType: 'sendGetData',
					success: function ( data ) { asignar_mantenimiento( data ); }
				});
			},

			asignar_mantenimiento = function ( arr_gen )
			{
				// docG = documento_asignar_mantenimiento( arr_gen );

				var
					asignarMantenimiento = function ( datos )
					{
						for( var i = 0, lon = docG.struct.length; i < lon; i++ )
						{
							datos.condicion_operativa.mantenimiento.length = 0; // borramos datos anteriores

							datos.condicion_operativa.mantenimiento.push({
								id_orden_trabajo: $( docG.struct[ i ].idHTML ).val(),
								sin_licencia: $( docG.struct[ i ].licencia ).prop( 'checked' )
							});
						}

						$( win.idDiv ).modal( 'hide' );
					},

					docG = documento_asignar_mantenimiento({
						arr: arr_gen,
						success: asignarMantenimiento,
						error: function () { sigesop.msg( 'Advertencia', 'seleccione número de orden', 'warning' ); }
					}),

					click = function( event ) 
					{						
						// eliminar datos y reiniciar estado
						doc.datos.condicion_operativa.mantenimiento.length = 0;
						$( doc.datos.condicion_operativa.idHTML ).val( '' );
						doc.IDS.$form.formValidation( 'revalidateField', 'condicion_operativa' );
						$( win.idDiv ).modal( 'hide' );
					},

					win = sigesop.ventanaEmergente({
						idDiv: 'asignarMantenimiento',
						titulo: 'Asignar Mantenimiento',
						clickAceptar: click,
						clickCerrar: click,
						showBsModal: function () 
						{ 
							document.getElementById( this.idBody ).innerHTML = docG.html; 
							docG.javascript();
						}
					});
			},

			documento_asignar_mantenimiento = function ( opt )
			{
				/*
				 * arr
				 * success
				 * error
				 */ 

				if ( jQuery.isEmptyObject( opt.arr ) )
				{
					return {
						html: '',
						javascript: function(){}
					}
				};

				var
					struct_body = function ( arr )
					{
						var 
							html = '',
							struct = [];

						for( var i = 0, lon = arr.length; i < lon; i++ )
						{
							html +=
								'<div class="form-group">' +
								'	<label class="control-label col-md-2" for="">' + arr[ i ].numero_aero + '</label>' +
								'	<div class="col-md-6">' +
								'		<select name="numero_orden" id="numero_orden_' + i + 
										'" class="form-control input-md eventoCambioMayuscula"></select>' +								
								'	</div>' +
								'	<div class="col-md-3">' +
								'		<label class="checkbox-inline"><input type="checkbox" id="sin_autori_' + 
										i +'" /> AUTORIZADO SIN LICENCIA' + '</label>' +
								'	</div>' +
								'</div>';

							struct.push({
								idHTML: '#numero_orden_' + i,
								valor: null,
								licencia: '#sin_autori_' + i,
								numero_aero: arr[ i ].numero_aero
							});
						}

						return {
							html: html,
							struct: struct
						};
					},

					body = struct_body( opt.arr ),

					html =
						'<form id="formAsignarMantto' + suf + '" class="form-horizontal" role="form">' + 

							body.html +

							'<div class="form-group">'+
							'	<p class="col-sm-3 col-sm-offset-2">'+
							'		<button id="btnComprobar' + suf + '" type="submit" class="btn btn-success" ' +
									'"> <span class="glyphicon glyphicon-transfer">' +
									'</span> Asignar</button>'+
							'	</p>'+							
							'</div>'+

						'</form>',

					javascript = function ()
					{
						var 
							form = this.IDS.form,
							$form = $( form ).formValidation({
						        icon: {
						            valid: 'glyphicon glyphicon-ok',
						            invalid: 'glyphicon glyphicon-remove',
						            validating: 'glyphicon glyphicon-refresh'
						        },

						        onSuccess: function ( e ) {
						        	e.preventDefault();
						        	typeof opt.success == 'function' ?
						        		opt.success( doc.datos ) :
						        		console.log( 'success is null' );

						        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
						        },

						        onError: function ( e ) {
						        	e.preventDefault();			        	
						        	typeof opt.error == 'function' ?
						        		opt.error() : console.log( 'error is null' );			        	
						        },

						        fields: {
						            numero_orden: {
						                validators: {
						                    notEmpty: {
						                        message: 'Seleccione numero de órden para mantenimiento.'
						                    }
						                }
						            }			            
						        }
							});

						// ---------- buscar todos los numero de orden registrados para cada aero

						if ( !jQuery.isEmptyObject( this.struct ) )
						{
							for( var i = 0, lon = this.struct.length; i < lon; i++ )
							{
								var 
									numero_aero = this.struct[ i ].numero_aero,
									idHTML = this.struct[ i ].idHTML,
									idLicencia = this.struct[ i ].licencia;

								( function ( idHTML, idLicencia ) {
									$( idLicencia ).change( function ( event ) {
										var 
											val = $( this ).prop( 'checked' ),
											$idHTML = $( idHTML );

										val ? $idHTML.prop( 'disabled', true ) : $idHTML.prop( 'disabled', false );
										$form.formValidation( 'resetForm' );
									});

									sigesop.query({
										data: { numero_aero: numero_aero },
										class: 'mantenimiento',
										query: 'obtenerOrdenTrabajo',										
										queryType: 'sendGetData',
										success: function ( data ) 
										{
											sigesop.combo({
												arr: data,
												elem: idHTML,
												campoValor: 'id_orden_trabajo',
												campo: 'numero_orden, trabajo_solicitado'
											});
										}
									});
								} )( idHTML, idLicencia )
							}
						}

						else console.log( '[struct] is null' );
					},

					doc_am = {
						html: html,
						javascript: javascript,
						struct: body.struct,
						IDS: {
							form: '#formAsignarMantto' + suf,
							botonComprobar: '#btnComprobar' + suf
						}
					};

				return doc_am;
			},

			seleccionarUsuario = function ( elem, campo_validar )
			{
				var
					docT = sigesop.tablaSeleccion({
							color_select: 'success',
							head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
							campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol',						
						}),

					clickAceptar = function( event ) 
					{
						// ---------- Guardamos el id del sistema y ponenos el nombre del sistema en la caja
						
						if ( !jQuery.isEmptyObject( docT.matrizInput ) )
						{
							var index = sigesop.getDataRadio( docT.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
								sigesop.getDataRadio( docT.matrizInput[ 0 ] ) : -1;

							if ( index >= 0 ) 
							{
								var rpe = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];
								if( localStorage.rpe !== rpe ) // verificamos que no sea el mismo usuario
								{
									elem.valor = rpe;
									$( elem.idHTML ).val( elem.valor );
									doc.IDS.$form.formValidation( 'revalidateField', campo_validar ); // revalidar

									$( win.idDiv ).modal( 'hide' );
								}
																
								else sigesop.msg( 'Info', 'El usuario seleccionado no puede ser el mismo que el actual', 'info' );
							}

							else sigesop.msg( 'Advertencia', 'Trabajador no seleccionado', 'warning' );
						}

						else console.log( '[docT.matrizInput] es nula' );			
					},

					showBsModal = function () 
					{
						document.getElementById( this.idBody ).innerHTML = docT.html;					

						if( !jQuery.isEmptyObject( window.sesion.matrizUsuario ) )
							docT.update_table( window.sesion.matrizUsuario );

						else 
						{
							sigesop.query({
								class: 'usuarios',
								query: 'obtenerUsuarios',
								success: function ( data ) 
								{
									window.sesion.matrizUsuario = data;
									docT.update_table( data );
								}
							});
						}
					},

					win = sigesop.ventanaEmergente({
						idDiv: 'seleccionTrabajador',
						titulo: 'Selección de trabajador solicitante',
						clickAceptar: clickAceptar,
						showBsModal: showBsModal
					});
			},

			limpiarCampos = function ()
			{
				$( doc.datos.reporte_por.idHTML ).val( '' );
				$( doc.datos.numero_unidad.idHTML ).val( '' );
				$( doc.datos.numero_aero.idHTML ).val( '' );    
				$( doc.datos.id_libro_licencia.idHTML ).val( '' );
				$( doc.datos.hora_inicio_evento.idHTML ).val( moment().format( 'HH:mm' ) );
				$( doc.datos.fecha_inicio_evento.idHTML ).val( moment().format( 'DD-MM-YYYY' ) );
				$( doc.datos.fecha_termino_estimado.idHTML ).val('');
				$( doc.datos.condicion_operativa.idHTML ).val( '' );
				$( doc.datos.trabajador_solicito.idHTML ).val( '' );
				// $( doc.datos.trabajador_autorizo.idHTML ).val( '' );
				$( doc.datos.descripcion_evento.idHTML ).val( '' );

				vaciarDatos();
			},

			vaciarDatos = function ()
			{				
				doc.datos.reporte_por.valor = null;
				doc.datos.numero_unidad.valor = null;
				doc.datos.numero_aero.valor = null;
				doc.datos.id_libro_licencia.valor = null;
				doc.datos.fecha_inicio_evento.valor = null;
				doc.datos.hora_inicio_evento.valor = null;
				doc.datos.fecha_termino_estimado.valor = null;
				doc.datos.condicion_operativa.valor = null;
				doc.datos.condicion_operativa.mantenimiento.length = 0;
				doc.datos.trabajador_solicito.valor = null;
				doc.datos.trabajador_autorizo.valor = null;
				doc.datos.descripcion_evento.valor = null;	
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			datos = {
				reporte_por: {
					valor: null,
					idHTML: '#reporte_por' + suf
				},

				numero_unidad: {
					valor: null,
					idHTML: '#numero_unidad' + suf
				},

				numero_aero: {
					valor: null,
					idHTML: '#numero_aero' + suf
				},

				id_libro_licencia: {
					valor: null,
					idHTML: '#id_libro_licencia' + suf
				},

				fecha_inicio_evento: {
					valor: null,
					idHTML: '#fecha_inicio_evento' + suf
				},

				hora_inicio_evento: {
					valor: null,
					idHTML: '#hora_inicio_evento' + suf
				},

				fecha_termino_estimado: {
					valor: null,
					idHTML: '#fecha_termino_estimado' + suf
				},

				condicion_operativa: {
					valor: null,
					mantenimiento: [], // matriz que guarda mantenimientos en el caso que lo sea
					idHTML: '#condicion_operativa' + suf
				},

				trabajador_solicito: { 
					valor: null,
					idHTML: '#solicito' + suf,
					boton: '#botonSolicito' + suf
				},

				trabajador_autorizo: { valor: null },

				descripcion_evento: { 
					valor: null,
					idHTML: '#descripcion_evento' + suf
				}
			},

			IDS = {
				$form: null,
				form: '#formRelatorio' + suf,
				botonGuardar: '#btnGuardarReporte' + suf,
				botonLimpiar: '#botonLimpiarReporte' + suf
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: IDS
			}

		return doc;
	},

	agregarEvento : function ( opt ) {
		/* obj
		 * suf
		 * success
		 * error
		 */

		var
		obj = opt.obj || {

		},

		suf = opt.suf || '',

		html =
			'<form id="form-agregar-evento-' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Fecha de Evento: </label>' +
				'	<div class="col-sm-7">' +
				'		<input name="fecha_evento" id="fecha-evento-' + suf + '" class="form-control" type="text"/>' +
				'	</div>' +
				'</div>' +

				'<div class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Hora de Evento (HH:SS): </label>' +
				'	<div class="col-sm-7">' +
				'		<input name="hora" id="hora-evento-' + suf + '" class="form-control input-md" type="text">' +
				'	</div>' +
				'</div>' +

				'<div class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Evento: </label>' +
				'	<div class="col-sm-7">' +
				'		<textarea name="descripcion_evento" id="descripcion-evento-' + suf + '" class="form-control input-md eventoCambioMayuscula" type="text"></textarea>' +
				'	</div>' +
				'</div>' +

				'<div class="form-group">'+
				'	<div class="col-sm-3 control-label"></div>'+
				'	<p class="col-sm-7">'+
				'		<button type="submit" id="btn-guardar-evento-' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
				'		<button type="reset" id="btn-limpiar-evento-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'	</p>'+
				'</div>'+

			'</form>',

		javascript = function()
		{
			var
			doc = this,
			form = doc.IDS.form,
			$fecha_evento = $( doc.datos.fecha_evento.idHTML ),
			$hora = $( doc.datos.hora.idHTML ),
			$form = $( form ).formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
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
		            fecha_evento: {
		                validators: {
		                    notEmpty: {
		                        message: 'Es necesaria la fecha del evento'
		                    },
		                    date: {
		                    	format: 'DD-MM-YYYY',
		                    	message: 'Escriba un formato de fecha válido'
		                    }
		                }
		            },
		            hora: {
		                validators: {
		                    notEmpty: {
		                        message: 'Es necesaria la hora del evento'
		                    },
		                    regexp: {
		                    	regexp: /^([0-9]{2})\:([0-9]{2})$/,
		                    	message: 'Escriba la hora en formaro 24 hrs.'
		                    }
		                }
		            },
		            descripcion_evento: {
		                validators: {
		                    notEmpty: {
		                        message: 'Es necesaria la descripción del evento'
		                    },
                      //       stringLength: {
		                    //     max: 30,
		                    //     message: 'Max. 30 caracteres'
		                    // },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                        // regexp: /^[a-zA-Z0-9]+$/i,
		                        message: 'Caracteres inválidos'
		                    }
		                }
		            }
		        }
			});

			doc.IDS.$form = $form;

			// ----------

			sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

			// ---------

			$fecha_evento.val( moment().format( 'DD-MM-YYYY' ) );			
			$fecha_evento.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onClose: function ( selectedDate ) {
					$form.formValidation( 'revalidateField', 'fecha_evento' );
				}
			});

			// ---------

			Globalize.culture( 'de-DE' );
			$hora.val( moment().format( 'HH:mm' ) );
			$.widget( "ui.timespinner", $.ui.spinner, {
				options: {
					// segundos
					step: 60 * 1000,
					// horas
					page: 60
				},

				_parse: function( value ) {
					if ( typeof value === "string" ) {
						// already a timestamp
						if ( Number( value ) == value ) {
							return Number( value );
						}
						return + Globalize.parseDate( value );
					}

					return value;
				},

				_format: function( value ) {
					return Globalize.format( new Date(value), "t" );
				}
			});
			$hora.timespinner();
			$hora.spinner({ // evento para revalidar los campos
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'hora' );
				}
			});

			// ----------

			$( this.IDS.botonLimpiar ).on( 'click', function ( event ) { 
				$( form ).data( 'formValidation' ).resetForm();
			});
		},

		datos = {
			id_libro_relatorio: { valor: null },

			fecha_evento: {
				valor: null,
				idHTML: '#fecha-evento-' + suf
			},

			hora: {
				valor: null,
				idHTML: '#hora-evento-' + suf
			},

			descripcion_evento: { 
				valor: null,
				idHTML: '#descripcion-evento-' + suf
			}
		},

		IDS = {			
			botonGuardar: '#btn-guardar-evento-' + suf,
			botonLimpiar: '#btn-limpiar-evento-' + suf,
			form: '#form-agregar-evento-' + suf,
			$form: null
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS
		};

		return doc;
	},

	registroActivos : function ( opt ) {
		/*
		 * obj
		 * suf
		 * table { actions:{} }
		 * badge
		 *
		 */ 

		var 
		obj = opt.obj || {},
		
		suf = opt.suf || '',

		html = 
			'<form id="formReportesActivos' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">' +
					'<label class="control-label col-sm-5" for="">Hora de corte: </label>' +
					'<div class="col-sm-2">' +
						'<select name="hora_corte" id="hora_corte' + suf + '" class="form-control" type="text"/>' +
							'<option value="" >Hora actual</option>' +
							'<option value="7AM" >7 A.M.</option>' +
						'</select>' +
					'</div>' +
				'</div>' +

				'<div id="tabla_registro_activos' + suf + '" class="form-group"></div>'+

			'</form>',

		javascript = function ()
		{
			var
			doc = this,
			$hora_corte = $( this.datos.hora_corte.idHTML ),
			tabla_activos = sigesop.tablaRegistro({
				suf: 	'_activos',
				head: 	'UNIDAD, AERO, CONDICION OPERATIVA, EVENTO, FECHA INICIO EVENTO,' +
						'HORA INICIO EVENTO, FECHA ESTIMADA TERMINO,' +
						'HORA DEL DIA DEL REPORTE, HORAS ACUMULADAS',
				campo: 	'numero_unidad, numero_aero, condicion_operativa, descripcion_evento,' +
						'fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado,' +
						'horas_dia_reporte, horas_acumuladas_evento',
				addClass: {
					body: {
						class: 'warning, danger, info, success',
						campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
						valor: 'C.A., FALLA, MTTO, F.A.'
					}
				}
			});

			doc.table.update_table = tabla_activos.update_table; // enlazamos a vista publica
			doc.table.body = tabla_activos.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + tabla_activos.html;

			$( tabla_activos.IDS.body ).contextMenu({
				selector: 'tr',
				items: {
					nuevo_evento:
					{
		            	name: 'Agregar evento',
		            	icon: 'add',
		        		callback: function ( key, _opt )
		        		{
		        			var index = $( this ).index();
		        			typeof opt.table.actions.nuevo_evento == 'function' ?
		        				opt.table.actions.nuevo_evento( index ):
		        				console.log( 'function nuevo_evento is null' );
		        		}
					},

		            historial:
		            {
		            	name: 'Historial de eventos',
		            	icon: 'paste',
		        		callback: function ( key, _opt )
		        		{
		        			var index = $( this ).index();
		        			typeof opt.table.actions.historial == 'function' ?
		        				opt.table.actions.historial( index ):
		        				console.log( 'function historial is null' );
		        		}
		            },

		            cerrar_evento:
		            {
		            	name: 'Cerrar evento',
		            	icon: 'delete',
		        		callback: function ( key, _opt )
		        		{
		        			var index = $( this ).index();
		        			typeof opt.table.actions.cerrar_evento == 'function' ?
		        				opt.table.actions.cerrar_evento( index ):
		        				console.log( 'function cerrar_evento is null' );
		        		}
		            }
				}
			}); 

			$hora_corte.change( function ( event )
			{
				$( tabla_activos.IDS.body ).empty(); // vaciar body de la tabla para actualizar nuevos datos
				var val = $hora_corte.val()
				doc.datos.hora_corte.valor = val;

				var query = { 
						option: 'activos',
						dia_reporte: val
					};

				sigesop.query({
					data: query,
					class: 'operacion',
					query: 'obtener_libro_relatorio',
					queryType: 'sendGetData',
					success: function ( data ) 
					{
						window.sesion.matrizLibroRelatorio = data;
						tabla_activos.update_table( data );
						document.getElementById( opt.badge ).innerHTML = data != null ?
							data.length : '0';
					}
				});
			});
		},

		datos = {
			hora_corte : {
				idHTML: '#hora_corte' + suf,
				valor: null
			}
		},

		IDS = {
			idTabla: '#tabla_registro_activos' + suf,					
			form: '#formReportesActivos' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			table: {
				body: null,
				update_table: null
			}
		};

		return doc;
	},

	registroFinalizados : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var 
			html = 
				'<form id="formReportesFinalizados' + suf + '" class="form-horizontal" role="form">'+

					'<div class="form-group">' +
					'	<label class="control-label col-sm-5" for="">De fecha: </label>' +
					'	<div class="col-sm-2">' +
					'		<input name="fecha_inf" id="fecha_inf' + suf + '" class="form-control" type="text"/>' +
					'	</div>' +
					'</div>' +

					'<div class="form-group">' +
					'	<label class="control-label col-sm-5" for="">A fecha: </label>' +
					'	<div class="col-sm-2">' +
					'		<input name="fecha_sup" id="fecha_sup' + suf + '" class="form-control" type="text"/>' +
					'	</div>' +
					'</div>' +

					'<div class="form-group">'+
					'	<div class="col-sm-5 control-label"></div>'+
					'	<p class="col-sm-2">'+
					'		<button type="submit" id="btnConsultaReporte' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button>'+					
					'	</p>'+
					'</div>'+

					'<div id="tabla_registro_terminado' + suf + '" class="form-group"></div>'+

				'</form>',

			javascript = function ()
			{
				var 
				form = this.IDS.form,
				$form = $( form ).formValidation({
					// live: 'submit',
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },

			        onSuccess: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );

			        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
			        },

			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },

			        fields: {
			            fecha_inf: {
			                validators: {
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Fecha inválida'
                                }
			                }
			            },

			            fecha_sup: {
			                validators: {
			                    notEmpty: {
			                        message: 'Fecha necesaria.'
			                    },
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Fecha inválida'
                                }
			                }
			            }				            
			        }
				});

				this.IDS.$form = $form;

				var 
					$fecha_inf = $( this.datos.fecha_inf.idHTML ),
					$fecha_sup = $( this.datos.fecha_sup.idHTML ),
					$idTabla = $( this.IDS.idTabla );

				// ----------

				var tabla_finalizados = sigesop.tablaRegistro({
						suf: '_terminados',
						head: 	'UNIDAD, AERO, CONDICION OPERATIVA, EVENTO, FECHA INICIO EVENTO, ' +
								'HORA INICIO EVENTO, FECHA ESTIMADA TERMINO, FECHA TERMINO, HORA TERMINO,' +
								'HORAS DEL DIA DEL REPORTE, HORAS ACUMULADAS',
						campo: 	'numero_unidad, numero_aero, condicion_operativa, descripcion_evento, ' +
								'fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, fecha_termino_evento, ' +
								'hora_termino_evento, horas_dia_reporte, horas_acumuladas_evento',
						addClass: {
							body: {
								class: 'warning, danger, info, success',
								campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
								valor: 'C.A., FALLA, MTTO, F.A.'
							}
						}
				});

				this.table.update_table = tabla_finalizados.update_table; // enlazamos a vista publica
				this.table.body = tabla_finalizados.IDS.body;
				$idTabla.html ( '<br>' + tabla_finalizados.html );

				// ----------
				
				$fecha_inf.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						doc.IDS.$form.formValidation( 'revalidateField', 'fecha_inf' );
					}
				});

				$fecha_sup.val( moment().format( 'DD-MM-YYYY' ) );
				$fecha_sup.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						doc.IDS.$form.formValidation( 'revalidateField', 'fecha_sup' );
					}
				})
				.on( 'success.field.fv', function ( e, data ) {
					var 
						fecha_inf = moment( $fecha_inf.val(), 'DD-MM-YYYY' ),
						fecha_sup = moment( $fecha_sup.val(), 'DD-MM-YYYY' );

					if( $fecha_inf.val() )
						if ( fecha_sup.isBefore( fecha_inf ) )			
							doc.IDS.$form.data( 'formValidation' ).updateStatus( 'fecha_inf', 'INVALID' );;
				});
			},

			datos = {
				fecha_inf: {
					idHTML: '#fecha_inf' + suf,
					valor: null
				},

				fecha_sup: {
					idHTML: '#fecha_sup' + suf,
					valor: null
				}
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: {
					idTabla: '#tabla_registro_terminado' + suf,
					botonConsultar: '#btnConsultaReporte' + suf,
					form: '#formReportesFinalizados' + suf
				},
				table: {
					body: null,
					update_table: null
				}
			}

		return doc;
	},

	registroReporte : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var 
		html = 
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+
			
				'<div class="form-group">'+
					'<label class="control-label col-sm-5 ">No. de Unidad: </label>'+
					'<div class="col-sm-2">'+
						'<select name="numero_unidad" id="numero-unidad-impresion-reporte-' + suf + '"class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="control-label col-sm-5" for="">De fecha: </label>' +
					'<div class="col-sm-2">' +
						'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-5" for="">A fecha: </label>' +
					'<div class="col-sm-2">' +
						'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +


				'<div class="form-group">'+
					'<div class="col-sm-5 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success"  data-loading-text="Buscando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button> ' +
						'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir</button>'+					
					'</p>'+
				'</div>'+

				'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>'+

				'</form>',

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$numero_unidad = $( doc.datos.numero_unidad.idHTML ),
			$fecha_inf = $( doc.datos.fecha_inf.idHTML ),
			$fecha_sup = $( doc.datos.fecha_sup.idHTML ),
			$botonImprimir = $( doc.IDS.botonImprimir ),
			$form = $( form )
			.formValidation({
				// live: 'submit',
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.success == 'function' ?
		        		opt.success( doc.datos, doc.IDS ) :
		        		console.log( 'success is null' );

		        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		        	numero_unidad: {
		                validators: {
		                    notEmpty: {
		                        message: 'Seleccione unidad de generador'
		                    	}
		                	}
		                },

		      		fecha_inf: {
		                validators: {
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            },

		            fecha_sup: {
		                validators: {
		                    notEmpty: {
		                        message: 'Fecha necesaria.'
		                    },
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            }				            
		        }
			})			
			.on( 'success.form.fv', function( e ) { $botonImprimir.prop( 'disabled', false ); })
	        .on( 'err.field.fv', function( e ) { $botonImprimir.prop( 'disabled', true ); })
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });
	
			doc.IDS.$form = $form;

			var tabla_reporte = 
			sigesop.tablaRegistro({
				suf: '_reporte',
				head: 	'UNIDAD, AERO, CONDICION OPERATIVA, EVENTO, FECHA INICIO EVENTO, ' +
					'HORA INICIO EVENTO, FECHA ESTIMADA TERMINO, FECHA TERMINO, HORA TERMINO,' +
					'HORAS DEL DIA DEL REPORTE, HORAS ACUMULADAS',
				campo: 	'numero_unidad, numero_aero, condicion_operativa, descripcion_evento, ' +
					'fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, fecha_termino_evento, ' +
					'hora_termino_evento, horas_dia_reporte, horas_acumuladas_evento',

				addClass: {
						body: {
							class: 'warning, danger, info, success',
							campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
							valor: 'C.A., FALLA, MTTO, F.A.'
						}
					}
			});


			doc.table.update_table = tabla_reporte.update_table; // enlazamos a vista publica
			doc.table.body = tabla_reporte.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') ).innerHTML = '<br>' + tabla_reporte.html

			$fecha_inf.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onClose: function( selectedDate ) {
					doc.IDS.$form.formValidation( 'revalidateField', 'fecha_inf' );
				}
			});
			
			$fecha_sup.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onClose: function( selectedDate ) {
					doc.IDS.$form.formValidation( 'revalidateField', 'fecha_sup' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				var 
					fecha_inf = moment( $fecha_inf.val(), 'DD-MM-YYYY' ),
					fecha_sup = moment( $fecha_sup.val(), 'DD-MM-YYYY' );

				if( $fecha_inf.val() )
					if ( fecha_sup.isBefore( fecha_inf ) )			
						doc.IDS.$form.data( 'formValidation' ).updateStatus( 'fecha_inf', 'INVALID' );
			});
			
			$botonImprimir.on( 'click', function ( event ) { 
				// sigesop.query({
				// 	class:"operacion",
				// 	query:"imprimir",
				// 	data:{
				// 		option: 'rango_fechas',
				// 		estado_evento: 'all',			
				// 		fecha_inf: $fecha_inf.val(),
				// 		fecha_sup: $fecha_sup.val(),
				// 		option2: 'numero_unidad',
				// 		numero_unidad: $numero_unidad.val()
				// 	},
				// 	success: function(data)
				// 	{
				// 		var ventana = window.open(data);
				//         	ventana.focus();
				// 	}
				// });

				var url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=imprimir&option=rango_fechas&estado_evento=all' +
					'&fecha_inf=' + $fecha_inf.val() + '&fecha_sup=' + $fecha_sup.val() +
					'&option2=numero_unidad' + '&numero_unidad=' + $numero_unidad.val(),

					win = window.open( url );

				win.focus();

			 });
		},
					
		datos = {
			numero_unidad:{
				idHTML: '#numero-unidad-impresion-reporte-' + suf,
				valor: null
			} ,

			fecha_inf: {
				idHTML: '#fecha-inferior-impresion-' + suf,
				valor: null
			},

			fecha_sup: {
				idHTML: '#fecha-superior-impresion-' + suf,
				valor: null
			}
		},

		IDS = {
			idTabla: '#tabla-impresion-reporte-' + suf,
			botonConsultar: '#btn-consulta-reporte-' + suf,
			botonImprimir: '#btn-imprimir-reporte-' + suf,
			form: '#form-imprimir-reporte-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			table: {
				body: null,
				update_table: null
			}
		}

		return doc;
	}
};