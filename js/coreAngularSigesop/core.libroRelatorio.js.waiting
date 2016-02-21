/* caché de datos
 * window.sesion.matrizLibroRelatorio
 * window.sesion.matrizTipoReporte
 * window.sesion.matrizUnidades
 * window.sesion.matrizLicencia
 * window.sesion.matrizEstadoLicencia
 * window.sesion.matrizLibroRelatorioFinalizados
 */

if ( !BootstrapDialog )
throw new Error('dependencia [BootstrapDialog] es indefinida');

sigesop.reporteNovedades = {
	document : function ( opt ) {
		/*
		 * obj
		 * suf
		 * success
		 * error
		 */

		var

		suf = sigesop.newId(),

		html =
			'<form id="form-relatorio-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Tipo de reporte: </label>'+
					'<div class="col-sm-7">'+
						'<select name="reporte_por" id="reporte-por-' + suf + '" class="form-control input-md">'+
							// '<option value="">' + sigesop.seleccioneOpcion + '</option>' +
							// '<option value="AEROGENERADOR">AEROGENERADOR</option>' +
							// '<option value="UNIDAD">UNIDAD</option>' +
						'</select>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">No. de Unidad: </label>'+
					'<div class="col-sm-7">'+
						'<select name="numero_unidad" id="numero-unidad-' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">No. de Aerogenerador: </label>'+
					'<div class="col-sm-7">'+
						'<select name="numero_aero" id="numero-aero-' + suf + '" class="form-control input-md" disabled></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Año de Licencia: </label>'+
					'<div class="col-sm-7">'+
						'<select name="id_libro_licencia" id="id-libro-licencia-' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Hora Inicio Evento (HH:SS): </label>' +
					'<div class="col-sm-7">' +
						'<input name="hora_inicio_evento" id="hora-inicio-evento-' + suf + '" class="form-control input-md" type="text">' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Fecha Inicio Evento: </label>' +
					'<div class="col-sm-7">' +
						'<input name="fecha_inicio_evento" id="fecha-inicio-evento-' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Fecha estimada de termino: </label>' +
					'<div class="col-sm-7">' +
						'<input name="fecha_termino_estimado" id="fecha-termino-estimado-' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Condicion Operativa: </label>'+
					'<div class="col-sm-7">'+
						'<select name="condicion_operativa" id="condicion-operativa-' + suf + '" class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Trabajador que solicitó:</label>' +
					'<div class="col-sm-5">' +
						'<input name="solicito" id="solicito-' + suf + '" class="form-control input-md" placeholder="Seleccione trabajador">' +
					'</div>' +
					'<div class="col-sm-2">' +
						'<button type="button" id="boton-solicito-' + suf + '" class="btn btn-primary">Seleccione Trabajador</button>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Causa de salida: </label>' +
					'<div class="col-sm-7">' +
						'<textarea name="descripcion_evento" id="descripcion-evento-' + suf + '" class="form-control input-md" type="text"></textarea>' +
					'</div>' +
				'</div>';

				if ( localStorage.usuario === sigesop.root ) {
					html +=
					'<div class="form-group">' +
						'<label class="control-label col-sm-3" for="">Consecutivo: </label>' +
						'<div class="col-sm-7">' +
							'<div class="input-group">' +
								'<span class="input-group-addon">' +
									'<input id="toggle-consecutivo-licencia-' + suf + '" type="checkbox" >' +
								'</span>' +
								'<input name="consecutivo_licencia" id="consecutivo-licencia-' + suf + '" type="text" class="form-control" disabled>' +
							'</div>' +
						'</div>' +
					'</div>';
				}

				html +=
				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btn-guardar-reporte-' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button type="reset"  id="btn-limpiar-reporte-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>'+
				'</div>'+
			'</form>';

		var

		javascript = function () {
			var
			doc   = this,
			IDS   = this.IDS,
			datos = this.datos,
			now   = moment().format( 'DD-MM-YYYY' ),
			form  = doc.IDS.form;

			// JQuery objects
			var
			$hora_inicio_evento     = $( datos.hora_inicio_evento.idHTML ),
			$fecha_inicio_evento    = $( datos.fecha_inicio_evento.idHTML ),
			$fecha_termino_estimado = $( datos.fecha_termino_estimado.idHTML ),
			$reporte_por            = $( datos.reporte_por.idHTML ),
			$numero_unidad          = $( datos.numero_unidad.idHTML ),
			$numero_aero            = $( datos.numero_aero.idHTML ),
			$condicion_operativa    = $( datos.condicion_operativa.idHTML ),
			$id_libro_licencia      = $( datos.id_libro_licencia.idHTML ),
			$trabajador_solicito    = $( datos.trabajador_solicito.idHTML ).toUpperCase(),
			$descripcion_evento     = $( datos.descripcion_evento.idHTML ).toUpperCase(),
			$form                   = $( form ).formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.success == 'function' ?
		        		opt.success( doc.datos, doc.IDS, limpiarCampos = limpiarCampos.bind( doc ) ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            reporte_por: {
		            	onSuccess: function ( e, data ) {
		            		datos.reporte_por.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.reporte_por.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.reporte_por.valor = null;
	                	},
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
		            	onSuccess: function ( e, data ) {
		            		datos.trabajador_solicito.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.trabajador_solicito.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.trabajador_solicito.valor = null;
	                	},
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
		            	onSuccess: function ( e, data ) {
		            		datos.descripcion_evento.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.descripcion_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.descripcion_evento.valor = null;
	                	},
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

		            consecutivo_licencia: {
		            	onSuccess: function ( e, data ) {
		            		datos.consecutivo_licencia.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.consecutivo_licencia.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.consecutivo_licencia.valor = null;
	                	},
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

			/* Bind jQuery objects to external public view
			 */
			IDS.$form                   = $form;
			IDS.$hora_inicio_evento     = $hora_inicio_evento;
			IDS.$fecha_inicio_evento    = $fecha_inicio_evento;
			IDS.$fecha_termino_estimado = $fecha_termino_estimado;
			IDS.$reporte_por            = $reporte_por;
			IDS.$numero_unidad          = $numero_unidad;
			IDS.$numero_aero            = $numero_aero;
			IDS.$trabajador_solicito    = $trabajador_solicito
			IDS.$descripcion_evento     = $descripcion_evento;
			IDS.$condicion_operativa    = $condicion_operativa;
			IDS.$id_libro_licencia      = $id_libro_licencia;

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
					IDS.$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
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

			$reporte_por.change( function ( event ) {
				var
					estado = $( this ).val(),
					elemento = doc.datos.numero_aero.idHTML;

				switch ( estado ) {
					case 'AEROGENERADOR':
						/* habilitar vistas de consecutivo
						 */
						$form.data( 'formValidation' ).resetField( 'consecutivo_licencia' );
						if ( localStorage.usuario === sigesop.root ) {
							$toggleConsecutivo.prop( 'checked', false ).prop( 'disabled', false );
							$consecutivo_licencia.val('').prop( 'disabled', true );
						}

						byAero( elemento );
						break;
					case 'UNIDAD':
						/* desabilitar vistas de consecutivo
						 */
						$form.data( 'formValidation' ).resetField( 'consecutivo_licencia' );
						if ( localStorage.usuario === sigesop.root ) {
							$toggleConsecutivo.prop( 'checked', false ).prop( 'disabled', true );
							$consecutivo_licencia.val('').prop( 'disabled', true );
						}

						byUnidad( elemento, doc.datos.numero_aero.valor );
						break;
					default: $( doc.IDS.form ).data( 'formValidation' ).resetField( 'numero_aero' ); break;
				}
			});

			$numero_unidad.change( function ( event ) {
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

			$numero_aero.change( function ( event ) { change_condicion_operativa.call( doc ); });

			$condicion_operativa.change( function ( event ) {
				var
					value = $( this ).val();

				if ( value === 'MTTO' ) {
					var
						unidad = $numero_unidad.val(),
						aero = $numero_aero.val(),
						reporte_por = $reporte_por.val();

					if ( reporte_por === 'AEROGENERADOR' ) run_mantenimiento( unidad, aero, reporte_por );
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

			$trabajador_solicito.on( 'success.field.fv', function ( e, data ) {
				var elem = $( e.target );
				if( localStorage.rpe === elem.val().toUpperCase() ) // verificamos que no sea el mismo usuario
				{
					elem.val( '' );
					$form.formValidation( 'revalidateField', 'solicito' ); // revalidar
					sigesop.msg( 'Info', 'El usuario seleccionado no puede ser el mismo que el actual', 'info' );
				}
			});

			$( doc.datos.trabajador_solicito.boton ).on( 'click', function ( event ) {
				event.preventDefault();
				seleccionarUsuario( doc.datos.trabajador_solicito, 'solicito' );
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) {
				vaciarDatos.call( doc );
			});

			/* Elementos vistos solo por el administrador
			 */
			if ( localStorage.usuario === sigesop.root ) {
				var
				$consecutivo_licencia = $( doc.datos.consecutivo_licencia.idHTML ),
				$toggleConsecutivo = $( doc.IDS.toggleConsecutivo );

				doc.IDS.$consecutivo_licencia = $consecutivo_licencia;
				doc.IDS.$toggleConsecutivo = $toggleConsecutivo;

				$toggleConsecutivo.change (function ( event ) {
					var val = $toggleConsecutivo.prop( 'checked' );
					if ( val ) $consecutivo_licencia.prop( 'disabled', false );
					else {
						$form.data( 'formValidation' ).resetField( 'consecutivo_licencia' );
						$consecutivo_licencia.prop( 'disabled', true );
					}
				});
			}

			/* Run diferents actions for document
			 */
			switch ( typeof opt.action !== 'undefined' ? opt.action : null ) {
				case 'update': // Update evento relatorio data
					if ( typeof opt.obj === 'undefined' && $.isEmptyObject( opt.obj ) )
						throw new Error( 'Error update function: property [obj] is required' );

					updateObj.call( this, opt.obj );
					break;
			};
		},

		/* Function for enable functional form, and fill fields
		 * for form
		 */
		updateObj = function ( obj ) {
			var
			IDS   = this.IDS,
			datos = this.datos;

			sigesop.query({
				class: 'unidades',
				query: 'obtenerUnidades',
				success: function ( data ) {
					IDS.$numero_unidad.combo({
						arr: data,
						campo: 'numero_unidad'
					})
					.val( obj.numero_unidad ).
					prop( 'disabled', true );
				}
			});

			sigesop.query({
				data: { numero_unidad: obj.numero_unidad },
				class: 'generadores',
				query: 'obtenerGeneradores',
				queryType: 'sendGetData',
				success: function ( data ) {
					IDS.$numero_aero
					.combo({
						arr: data,
						campo: 'numero_aero'
					})
					.val( obj.numero_aero );
				}
			});

			sigesop.query({
				class: 'operacion',
				query: 'obtener_libro_licencia',
				success: function ( data ) {
					IDS.$id_libro_licencia.combo({
						arr: data,
						campo: 'anio_licencia',
						campoValor: 'id_libro_licencia'
					})
					.val( obj.id_libro_licencia );
				}
			});

			sigesop.query({
				class: 'generadores',
				query: 'obtenerEstadoLicencia',
				success: function ( data ) {
					IDS.$condicion_operativa.combo({
						arr: data
					})
					.val( obj.condicion_operativa );
				}
			});

			/* Guardamos el ID que se actualizará
			 */
			datos.id_libro_relatorio_update = {
				valor: obj.id_libro_relatorio
			};

			/* Aunque el evento se haya creado por [UNIDADES] inicializaremos
			 * como [AEROGENERADOR] para activar la secuencia de eventos
			 * del formulario de forma correcta ya que la edicion unicamente
			 * aplica para un aerogenerador
			 */
			IDS.$reporte_por.combo({
				arr: [ 'AEROGENERADOR' ]
			})
			.val( 'AEROGENERADOR' )
			.prop( 'disabled', true );

			IDS.$hora_inicio_evento.val( moment( obj.hora_inicio_evento, 'HH:mm:ss' ).format( 'HH:mm' ) );
			IDS.$fecha_inicio_evento.val( obj.fecha_inicio_evento );
			IDS.$fecha_termino_estimado.val( obj.fecha_termino_estimado );
			IDS.$trabajador_solicito.val( obj.trabajador_solicito );
			IDS.$descripcion_evento.val( obj.descripcion_evento );

			if ( obj.consecutivo_licencia ) {
				IDS.$toggleConsecutivo.prop({
					disabled: false,
					checked: true
				});
				IDS.$consecutivo_licencia.prop( 'disabled', false )
				.val( obj.consecutivo_licencia );
			}

			/* Guardamos variables [id_orden_trabajo, sin_licencia]
			 * del elemento que editaremos
			 */
			var
			id_orden_trabajo = obj.id_orden_trabajo || null,
			sin_licencia = id_orden_trabajo ? false : true;

			datos.condicion_operativa.mantenimiento.push({
				id_orden_trabajo: id_orden_trabajo,
				sin_licencia: sin_licencia
			});
		},

		verificaConsecutivo = function ( id_libro_licencia ) {
			// doc_consec = sigesop.reporteNovedades.documentConsecutivo({
			// 	success: success,
			// 	error: sigesop.completeCampos
			// });

			var doc = this;

			sigesop.query({
				class: 'operacion',
				query: 'verifica_consecutivo_licencia',
				queryType: 'sendGetData',
				data: {
					id_libro_licencia: id_libro_licencia
				},
				success: function ( data ) {
					if ( data == null ) {
						var

						showBsModal = function () {
							document.getElementById( this.idBody ).
							innerHTML = doc_consec.html;

							doc_consec.javascript();
						},

						success = function () {
							// Enlazamos datos entre los 2 formularios
							doc.datos.consecutivo_licencia.valor =
							doc_consec.datos.consecutivo_licencia.valor
							$( win.idDiv ).modal( 'hide' );
						},

						doc_consec = sigesop.reporteNovedades.documentConsecutivo({
							success: success,
							error: sigesop.completeCampos,
							valor: id_libro_licencia
						}),

						win = sigesop.ventanaEmergente({
							idDiv: 'agregar_consecutivo',
							titulo: 'Agregar consecutivo',
							keyboard: true,
							clickAceptar: function( event ) {
								event.preventDefault();
								doc.IDS.$id_libro_licencia.val(''); // resetear el campo
								doc.IDS.$form.formValidation( 'revalidateField', 'id_libro_licencia' );
								$( win.idDiv ).modal( 'hide' );
							},
							clickCerrar: function( event ) {
								event.preventDefault();
								doc.IDS.$id_libro_licencia.val(''); // resetear el campo
								doc.IDS.$form.formValidation( 'revalidateField', 'id_libro_licencia' );
							},
							showBsModal: showBsModal
						});
					}
				},
				error: function () { sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
			});
		},

		byAero = function ( elemento ) {
			$( elemento ).prop( 'disabled', false );
			$( elemento ).val( '' );
		},

		byUnidad = function ( elemento, valor ) {
			$( doc.IDS.form ).data( 'formValidation' ).resetField( 'numero_aero' );
			$( elemento ).prop( 'disabled', true );
			$( elemento ).val( '' );
		},

		change_condicion_operativa = function () {
			var co = $( doc.datos.condicion_operativa.idHTML );

			if ( co.val() === 'MTTO' ) // reiniciamos valores de mantenimiento
			{
				co.val('');
				doc.datos.condicion_operativa.mantenimiento.length = 0;
				$( doc.IDS.form ).data( 'formValidation' ).resetField( 'condicion_operativa' );
			}
		},

		run_mantenimiento = function ( unidad, aero, reporte_por ) {
			var query = { libro_relatorio: true };

			switch ( reporte_por )
			{
				case 'AEROGENERADOR':
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

				case 'UNIDAD':
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

		asignar_mantenimiento = function ( arr_gen ) {
			// docG = documento_asignar_mantenimiento( arr_gen );

			var

			asignarMantenimiento = function ( datos ) {
				var
					i = 0,
					lon = _doc.struct.length;

				for( i ; i < lon; i++ ) {
					datos.condicion_operativa.mantenimiento.length = 0; // borramos datos anteriores

					datos.condicion_operativa.mantenimiento.push({
						id_orden_trabajo: $( _doc.struct[ i ].idHTML ).val(),
						sin_licencia: $( _doc.struct[ i ].licencia ).prop( 'checked' )
					});
				}

				win.close();
			},

			_doc = documento_asignar_mantenimiento({
				arr: arr_gen,
				success: asignarMantenimiento,
				error: function () { sigesop.msg( 'Advertencia', 'seleccione número de orden', 'warning' ); }
			}),

			action = function( dialog ) {
				// eliminar datos y reiniciar estado
				doc.datos.condicion_operativa.mantenimiento.length = 0;
				$( doc.datos.condicion_operativa.idHTML ).val( '' );
				doc.IDS.$form.formValidation( 'revalidateField', 'condicion_operativa' );
				dialog.close();
			},

		    win = BootstrapDialog.show({
		        title: 'Asignar Mantenimiento',
		        type: BootstrapDialog.TYPE_DEFAULT,
		        message: _doc.html,
		        onshown: function ( dialog ) {
		        	_doc.javascript();
		        },
		        size: BootstrapDialog.SIZE_WIDE,
		        draggable: true,
		        closable: false,
		        buttons: [{
		            label: 'Cancelar',
		            cssClass: 'btn-danger',
		            action: action
		        }]
		    });

			// click = function( event ) {
			// 	// eliminar datos y reiniciar estado
			// 	doc.datos.condicion_operativa.mantenimiento.length = 0;
			// 	$( doc.datos.condicion_operativa.idHTML ).val( '' );
			// 	doc.IDS.$form.formValidation( 'revalidateField', 'condicion_operativa' );
			// 	$( win.idDiv ).modal( 'hide' );
			// },

			// win = sigesop.ventanaEmergente({
			// 	idDiv: 'asignarMantenimiento',
			// 	titulo: 'Asignar Mantenimiento',
			// 	clickAceptar: click,
			// 	clickCerrar: click,
			// 	showBsModal: function () {
			// 		document.getElementById( this.idBody ).innerHTML = _doc.html;
			// 		_doc.javascript();
			// 	}
			// });
		},

		documento_asignar_mantenimiento = function ( opt ) {
			/*
			 * arr
			 * success
			 * error
			 */

			if ( jQuery.isEmptyObject( opt.arr ) ) {
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
								i +'" /> AUTORIZADO SIN ORDEN DE TRABAJO' + '</label>' +
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

			javascript = function () {
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

				if ( !jQuery.isEmptyObject( this.struct ) ) {
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

		seleccionarUsuario = function ( elem, campo_validar ) {
			var
			docT = sigesop.tablaSeleccion({
					color_select: 'success',
					head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
					campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol',
				}),

			action = function( dialog ) {
				/* Guardamos el id del sistema y ponenos
				 * el nombre del sistema en la caja
				 */
				if ( !$.isEmptyObject( docT.matrizInput ) ) {
					var index = sigesop.getDataRadio( docT.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
						sigesop.getDataRadio( docT.matrizInput[ 0 ] ) : -1;

					if ( index >= 0 ) {
						var rpe = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];
						if( localStorage.rpe !== rpe ) { // verificamos que no sea el mismo usuario
							elem.valor = rpe;
							$( elem.idHTML ).val( elem.valor );
							doc.IDS.$form.formValidation( 'revalidateField', campo_validar ); // revalidar

							dialog.close();
						}

						else sigesop.msg( 'Info', 'El usuario seleccionado no puede ser el mismo que el actual', 'info' );
					}

					else sigesop.msg( 'Advertencia', 'Trabajador no seleccionado', 'warning' );
				}

				else console.log( '[docT.matrizInput] es nula' );
			},

		    win = BootstrapDialog.show({
		        title: 'Selección de trabajador solicitante',
		        type: BootstrapDialog.TYPE_DEFAULT,
		        message: docT.html,
		        onshown: function ( dialog ) {
					if( !$.isEmptyObject( window.sesion.matrizUsuario ) )
						docT.update_table( window.sesion.matrizUsuario );

					else {
						sigesop.query({
							class: 'usuarios',
							query: 'obtenerUsuarios',
							success: function ( data ) {
								window.sesion.matrizUsuario = data;
								docT.update_table( data );
							}
						});
					}
		        },
		        size: BootstrapDialog.SIZE_WIDE,
		        draggable: true,
		        buttons: [{
		            label: 'Cancelar',
		            action: function( dialog ) {
		                dialog.close();
		            }
		        },{
		            label: 'Aceptar',
		            cssClass: 'btn-success',
		            action: action
		        }]
		    });
		},

		limpiarCampos = function () {
			var
			datos = this.datos,
			IDS = this.IDS;

			IDS.$reporte_por.val( '' );
			IDS.$numero_unidad.val( '' );
			IDS.$numero_aero.val( '' );
			IDS.$id_libro_licencia.val( '' );
			IDS.$hora_inicio_evento.val( moment().format( 'HH:mm' ) );
			IDS.$fecha_inicio_evento.val( moment().format( 'DD-MM-YYYY' ) );
			IDS.$fecha_termino_estimado.val('');
			IDS.$condicion_operativa.val( '' );
			IDS.$trabajador_solicito.val( '' );
			IDS.$descripcion_evento.val( '' );

			if ( localStorage.usuario === sigesop.root ) {
				IDS.$consecutivo_licencia.val( '' );
				IDS.$toggleConsecutivo.prop( 'checked', false );
			}

			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			var
			datos = this.datos,
			IDS = this.IDS;

			datos.reporte_por.valor = null;
			datos.numero_unidad.valor = null;
			datos.numero_aero.valor = null;
			datos.id_libro_licencia.valor = null;
			datos.fecha_inicio_evento.valor = null;
			datos.hora_inicio_evento.valor = null;
			datos.fecha_termino_estimado.valor = null;
			datos.condicion_operativa.valor = null;
			datos.condicion_operativa.mantenimiento.length = 0;
			datos.trabajador_solicito.valor = null;
			datos.trabajador_autorizo.valor = null;
			datos.descripcion_evento.valor = null;
			datos.consecutivo_licencia.valor = null;

			doc.IDS.$form.formValidation( 'resetForm' );

			if ( localStorage.usuario === sigesop.root )
				IDS.$consecutivo_licencia.prop( 'disabled', true );
		},

		datos = {
			// id_libro_relatorio_update: { valor: null },

			reporte_por: {
				valor: null,
				idHTML: '#reporte-por-' + suf
			},

			numero_unidad: {
				valor: null,
				idHTML: '#numero-unidad-' + suf
			},

			numero_aero: {
				valor: null,
				idHTML: '#numero-aero-' + suf
			},

			id_libro_licencia: {
				valor: null,
				idHTML: '#id-libro-licencia-' + suf
			},

			fecha_inicio_evento: {
				valor: null,
				idHTML: '#fecha-inicio-evento-' + suf
			},

			hora_inicio_evento: {
				valor: null,
				idHTML: '#hora-inicio-evento-' + suf
			},

			fecha_termino_estimado: {
				valor: null,
				idHTML: '#fecha-termino-estimado-' + suf
			},

			condicion_operativa: {
				valor: null,
				mantenimiento: [], // matriz que guarda mantenimientos en el caso que lo sea
				idHTML: '#condicion-operativa-' + suf
			},

			trabajador_solicito: {
				valor: null,
				idHTML: '#solicito-' + suf,
				boton: '#boton-solicito-' + suf
			},

			trabajador_autorizo: { valor: null },

			descripcion_evento: {
				valor: null,
				idHTML: '#descripcion-evento-' + suf
			},

			consecutivo_licencia: {
				valor: null,
				idHTML: '#consecutivo-licencia-' + suf
			}
		},

		IDS = {
			form             : '#form-relatorio-' + suf,
			botonGuardar     : '#btn-guardar-reporte-' + suf,
			botonLimpiar     : '#btn-limpiar-reporte-' + suf,
			toggleConsecutivo: '#toggle-consecutivo-licencia-' + suf,

			$form                  : null,
			$hora_inicio_evento    : null,
			$fecha_inicio_evento   : null,
			$fecha_termino_estimado: null,
			$reporte_por           : null,
			$numero_unidad         : null,
			$numero_aero           : null,
			$condicion_operativa   : null,
			$trabajador_solicito   : null,
			$descripcion_evento    : null,
			$id_libro_licencia     : null,
			$consecutivo_licencia  : null,
			$toggleConsecutivo     : null
		},

		doc = {
			html      : html,
			javascript: javascript,
			datos     : datos,
			IDS       : IDS
		};

		return doc;
	},

	documentEvento : function ( opt ) {
		/* obj
		 * suf
		 * success
		 * error
		 * condicion_operativa
		 */

		var eventoPrincipal = null;

		if ( opt.eventoPrincipal &&
			 typeof opt.eventoPrincipal !== 'undefined' &&
			 typeof opt.eventoPrincipal === 'object' )
		{
			eventoPrincipal = opt.eventoPrincipal;
		} else {
			throw new Error( 'Objeto eventoPrincipal indefinido' );
		}

		// {
		// 	id_libro_relatorio: elem.id_libro_relatorio
		// 	fecha_inicio_evento: elem.fecha_inicio_evento,
		// 	hora_inicio_evento: elem.hora_inicio_evento
		// },

		var

		vista = opt.vista || null,

		suf = opt.suf || '',

		html =
			'<form id="form-agregar-evento-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-1"></div>' +
					'<div class="col-sm-10">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">NUEVO SUBEVENTO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Fecha de inicio: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_inicio_evento" id="fecha-inicio-evento-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label">Hora de inicio (HH:mm): </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="hora_inicio_evento" id="hora-inicio-evento-' + suf + '" class="form-control input-md" type="text">' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Fecha termino estimado: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_termino_estimado_evento" id="fecha-termino-estimado-evento-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Hora termino estimado (HH:mm): </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="hora_termino_estimado_evento" id="hora-termino-estimado-evento-' + suf + '" class="form-control input-md" type="text">' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Fecha de termino: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_termino_evento" id="fecha-termino-evento-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Hora de termino(HH:mm): </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="hora_termino_evento" id="hora-termino-evento-' + suf + '" class="form-control input-md" type="text">' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label">Condicion operativa: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<select name="condicion_operativa" id="condicion-operativa-' + suf + '" type="text" class="form-control"></select>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Descripción de evento: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<textarea name="descripcion_evento" id="descripcion-evento-' + suf + '" class="form-control input-md" type="text"></textarea>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td colspan="2"></td>' +
				    						'<td colspan="2" class="text-left">' +
				    							'<p>'+
													'<button type="submit" id="btn-guardar-evento-' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
													'<button type="reset"  id="btn-limpiar-evento-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-1"></div>' +
				'</div>' +				
			'</form>',

		/* descargamos las fechas para el
		 * nuevo evento y no hayan incongruencias
		 */
		_resolveFechaHora = function ( callback ) {
			var
				doc = this,
				IDS = this.IDS;

			sigesop.query({
				data: { id_libro_relatorio: eventoPrincipal.id_libro_relatorio },
				class: 'operacion',
				query: 'obtener_historial_eventos',
				queryType: 'sendGetData',
				success: function ( data ) {
					doc.historialEventos = data;


					/* Si no existe historial de eventos
					 * secundarios configuramos la hora y
					 * fecha del evento principal
					 */
					if ( $.isEmptyObject( data ) ) {
						var
							fecha = eventoPrincipal.fecha_inicio_evento,
							hora = moment( eventoPrincipal.hora_inicio_evento, 'HH:mm:ss' )
								.add( 1, 'm').format( 'HH:mm' );
					}

					else {
						var
							row = data[ data.length - 1 ],
							fecha = row.fecha_termino_evento,
							hora = moment( row.hora_termino_evento, 'HH:mm:ss' )
								.add( 1, 'm').format( 'HH:mm' );
					}

					// guardamos en objeto controlador
					doc.controlFecha.fechaMinimoInicio = fecha;
					doc.controlFecha.horaMinimaInicio = hora;

					// configuramos la hora y fecha en la interfaz
					IDS.$fecha_inicio_evento.val( fecha );
					IDS.$hora_inicio_evento.val( hora );

					// revalidamos los campos
					IDS.$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
					IDS.$form.formValidation( 'revalidateField', 'hora_inicio_evento' );
				}
			});
		},

		javascript = function() {
			var
			doc = this,
			IDS = this.IDS,
			form = doc.IDS.form,
			datos = doc.datos,
			$fecha_inicio_evento = $( datos.fecha_inicio_evento.idHTML ),
			$hora_inicio_evento = $( datos.hora_inicio_evento.idHTML ),
			$fecha_termino_estimado_evento = $( datos.fecha_termino_estimado_evento.idHTML ),
			$hora_termino_estimado_evento = $( datos.hora_termino_estimado_evento.idHTML ),
			$fecha_termino_evento = $( datos.fecha_termino_evento.idHTML ),
			$hora_termino_evento = $( datos.hora_termino_evento.idHTML ),
			$condicion_operativa = $( datos.condicion_operativa.idHTML ),
			$descripcion_evento = $( datos.descripcion_evento.idHTML ),
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
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
					/* verificamos el campo valor de fecha_inicio_evento para
					 * crear un candado que bloquee el success
					 * del formulario y garantice la respuesta ajax
					 * y asi evitar que los datos vayan con una
					 * fecha inicial incongruente
					 */
		        	typeof opt.success == 'function' ?
		        		opt.success( doc.datos, doc.IDS, limpiarCampos = limpiarCampos.bind( doc ) ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            fecha_inicio_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.fecha_inicio_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_inicio_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_inicio_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    date: {
		                    	format: 'DD-MM-YYYY',
		                    	message: 'Escriba un formato de fecha válido'
		                    }
		                }
		            },

		            hora_inicio_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.hora_inicio_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.hora_inicio_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.hora_inicio_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                    	regexp: /^([0-9]{2})\:([0-9]{2})$/,
		                    	message: 'Formato inválido (HH:mm)'
		                    }
		                }
		            },

		            fecha_termino_estimado_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.fecha_termino_estimado_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_termino_estimado_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_termino_estimado_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    date: {
		                    	format: 'DD-MM-YYYY',
		                    	message: 'Escriba un formato de fecha válido'
		                    }
		                }
		            },

		            hora_termino_estimado_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.hora_termino_estimado_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.hora_termino_estimado_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.hora_termino_estimado_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                    	regexp: /^([0-9]{2})\:([0-9]{2})$/,
		                    	message: 'Formato inválido (HH:mm)'
		                    }
		                }
		            },

		            fecha_termino_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.fecha_termino_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_termino_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_termino_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    date: {
		                    	format: 'DD-MM-YYYY',
		                    	message: 'Escriba un formato de fecha válido'
		                    }
		                }
		            },

		            hora_termino_evento: {
		            	onSuccess: function ( e, data ) {
		            		datos.hora_termino_evento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.hora_termino_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.hora_termino_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                    	regexp: /^([0-9]{2})\:([0-9]{2})$/,
		                    	message: 'Formato inválido (HH:mm)'
		                    }
		                }
		            },

		            condicion_operativa: {
		            	onSuccess: function ( e, data ) {
		            		datos.condicion_operativa.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.condicion_operativa.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.condicion_operativa.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },

		            descripcion_evento: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val().toUpperCase();
		            		datos.descripcion_evento.valor = val;
		            		data.element.val( val );
		            	},
		            	onError: function ( e, data ) {
		            		datos.descripcion_evento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.descripcion_evento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                        message: 'Caracteres inválidos'
		                    }
		                }
		            }
		        }
			})
			// .on( 'success.field.fv', function( e, data ) {
			// 	data.fv.disableSubmitButtons( false );
			// });

			IDS.$form = $form;
			IDS.$fecha_inicio_evento = $fecha_inicio_evento;
			IDS.$hora_inicio_evento = $hora_inicio_evento;
			IDS.$fecha_termino_estimado_evento = $fecha_termino_estimado_evento;
			IDS.$hora_termino_estimado_evento = $hora_termino_estimado_evento;
			IDS.$fecha_termino_evento = $fecha_termino_evento;
			IDS.$hora_termino_evento = $hora_termino_evento;
			IDS.$condicion_operativa = $condicion_operativa;
			IDS.$descripcion_evento = $descripcion_evento;

			/* Configuracion de fields y eventos
			 */
			Globalize.culture( 'de-DE' );
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

			$fecha_inicio_evento.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onSelect: function( date, inst ) {
					$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				if ( doc.controlFecha.fechaMinimoInicio &&
					 doc.controlFecha.horaMinimaInicio )
				{
					var
					date_1 = doc.controlFecha.fechaMinimoInicio + ' ' + doc.controlFecha.horaMinimaInicio,
					date_2 = $fecha_inicio_evento.val() + ' ' + $hora_inicio_evento.val(),
					fecha_1 = moment( date_1, 'DD-MM-YYYY HH:mm' ),
					fecha_2 = moment( date_2, 'DD-MM-YYYY HH:mm' );

					/* Si la fecha puesta en el campo [fecha_inicio_evento]
					 * es menor a la fecha del evento anterior, entonces
					 * se pone en el campo [fecha_inicio_evento] la fecha
					 * del evento anterior
					 */
					if ( fecha_2.isBefore( fecha_1 ) ) {
						$fecha_inicio_evento.val( fecha_1.format( 'DD-MM-YYYY' ) );

						// añadimos la fecha a controlFechas
						doc.controlFecha.fechaMinimoTermino =
							fecha_1.format( 'DD-MM-YYYY' );
					}
					else {
						doc.controlFecha.fechaMinimoTermino =
							fecha_2.format( 'DD-MM-YYYY' );
					}

					// revalidar por si existe hora capturada previamente
					$form.formValidation( 'revalidateField', 'hora_inicio_evento' );
				}
				else {
					$fecha_inicio_evento.val('');
					data.fv.disableSubmitButtons( false );
					$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
					console.log('Fecha y hora minimas están vacias');
				}
			})
			.on( 'err.field.fv', function ( e, data ) {
				doc.controlFecha.fechaMinimoTermino = null;
			});

			$hora_inicio_evento.timespinner()
			.spinner({ // evento para revalidar los campos
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'hora_inicio_evento' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				if ( doc.controlFecha.fechaMinimoInicio &&
					 doc.controlFecha.horaMinimaInicio ) {
					var
					date_1 = doc.controlFecha.fechaMinimoInicio + ' ' + doc.controlFecha.horaMinimaInicio,
					date_2 = $fecha_inicio_evento.val() + ' ' + $hora_inicio_evento.val(),
					fecha_1 = moment( date_1, 'DD-MM-YYYY HH:mm' ),
					fecha_2 = moment( date_2, 'DD-MM-YYYY HH:mm' );

					/* Si la fecha puesta en el campo [fecha_inicio_evento]
					 * es menor a la fecha del evento anterior, entonces
					 * se pone en el campo [fecha_inicio_evento] la fecha
					 * del evento anterior
					 */
					if ( fecha_2.isBefore( fecha_1 ) ) {
						$hora_inicio_evento.val( fecha_1.format( 'HH:mm' ) );

						// añadimos la fecha a controlFechas
						doc.controlFecha.horaMinimaTermino =
							fecha_1.add( 1, 'm').format( 'HH:mm' );
					}
					else {
						doc.controlFecha.horaMinimaTermino =
							fecha_2.add( 1, 'm' ).format( 'HH:mm' );
					}
				}
				else {
					$fecha_inicio_evento.val('');
					data.fv.disableSubmitButtons( false );
					$form.formValidation( 'revalidateField', 'hora_inicio_evento' );
					console.log('Fecha y hora minimas están vacias');
				}
			})
			.on( 'err.field.fv', function ( e, data ) {
				doc.controlFecha.horaMinimaTermino = null;
			});

			$fecha_termino_estimado_evento.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onSelect: function( date, inst ) {
					$form.formValidation( 'revalidateField', 'fecha_termino_estimado_evento' );
				}
			});

			$hora_termino_estimado_evento.timespinner().spinner({
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'hora_termino_estimado_evento' );
				}
			});

			$fecha_termino_evento.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onSelect: function( date, inst ) {
					$form.formValidation( 'revalidateField', 'fecha_termino_evento' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				if ( doc.controlFecha.fechaMinimoTermino &&
					 doc.controlFecha.horaMinimaTermino ) {
					var
					date_1 = doc.controlFecha.fechaMinimoTermino + ' ' + doc.controlFecha.horaMinimaTermino,
					date_2 = $fecha_termino_evento.val() + ' ' + $hora_termino_evento.val(),
					fecha_1 = moment( date_1, 'DD-MM-YYYY HH:mm' ),
					fecha_2 = moment( date_2, 'DD-MM-YYYY HH:mm' );

					/* Si la fecha puesta en el campo [fecha_inicio_evento]
					 * es menor a la fecha del evento anterior, entonces
					 * se pone en el campo [fecha_inicio_evento] la fecha
					 * del evento anterior
					 */
					if ( fecha_2.isBefore( fecha_1 ) ) {
						$fecha_termino_evento.val( fecha_1.format( 'DD-MM-YYYY' ) );

						// añadimos la fecha a controlFechas
						// doc.controlFecha.fechaMinimoTermino =
						// 	fecha_1.format( 'DD-MM-YYYY' );
					}
					else {

					}

					// revalidar por si existe hora capturada previamente
					$form.formValidation( 'revalidateField', 'hora_termino_evento' );
				}
				else {
					$fecha_termino_evento.val('');
					data.fv.disableSubmitButtons( false );
					$form.formValidation( 'revalidateField', 'fecha_termino_evento' );
					console.log('Fecha y hora minimas están vacias');
				}
			});

			$hora_termino_evento.timespinner()
			.spinner({ // evento para revalidar los campos
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'hora_termino_evento' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				if ( doc.controlFecha.fechaMinimoTermino &&
					 doc.controlFecha.horaMinimaTermino ) {
					var
					date_1 = doc.controlFecha.fechaMinimoTermino + ' ' + doc.controlFecha.horaMinimaTermino,
					date_2 = $fecha_termino_evento.val() + ' ' + $hora_termino_evento.val(),
					fecha_1 = moment( date_1, 'DD-MM-YYYY HH:mm' ),
					fecha_2 = moment( date_2, 'DD-MM-YYYY HH:mm' );

					/* Si la fecha puesta en el campo [fecha_inicio_evento]
					 * es menor a la fecha del evento anterior, entonces
					 * se pone en el campo [fecha_inicio_evento] la fecha
					 * del evento anterior
					 */
					if ( fecha_2.isBefore( fecha_1 ) ) {
						$hora_termino_evento.val( fecha_1.format( 'HH:mm' ) );

						// añadimos la fecha a controlFechas
						// doc.controlFecha.horaMinimaTermino =
						// 	fecha_1.add( 1, 'm').format( 'HH:mm' );
					}
					else {
						// doc.controlFecha.horaMinimaTermino =
						// 	fecha_2.add( 1, 'm' ).format( 'HH:mm' );
					}
				}
				else {
					// $fecha_inicio_evento.val('');
					// data.fv.disableSubmitButtons( false );
					// $form.formValidation( 'revalidateField', 'hora_inicio_evento' );
					// console.log('Fecha y hora minimas están vacias');
				}
			})

			$botonLimpiar.on( 'click', function ( event ) {
				vaciarDatos.call( doc );
			});

			/* ejecucion cuando la vista es por defecto
			 */
			if ( !vista ) {
				if ( !opt.condicion_operativa )
				throw new Error( 'variable [condicion_operativa] es requerida' );

				_resolveFechaHora.call( this );

				sigesop.query({
					class: 'generadores',
					query: 'obtenerEstadoLicencia',
					success: function ( data ) {
						data.push( 'DISPONIBLE' );
						$condicion_operativa.combo({
							arr: data
						})
						.val( opt.condicion_operativa );
					}
				});
			} else

			/* vista para editar un evento
			 */
			if ( vista === 'actualizar_evento_relatorio' ) {
				if ( typeof opt.obj == 'undefined' )
				throw new Error( '[obj] es indefinido' );

				/* Si no existe historial de eventos
				 * secundarios configuramos la hora y
				 * fecha del evento principal
				 */
				var
					obj = opt.obj,
					fecha = obj.fecha_inicio_evento,
					hora = moment( obj.hora_inicio_evento, 'HH:mm:ss' ).format( 'HH:mm' );

				// guardamos en objeto controlador
				doc.controlFecha.fechaMinimoInicio = fecha;
				doc.controlFecha.horaMinimaInicio = hora;

				// configuramos la hora y fecha en la interfaz
				$fecha_inicio_evento.val( fecha );
				$hora_inicio_evento.val( hora );

				/****************************************************/

				$fecha_inicio_evento.val( obj.fecha_inicio_evento );
				$hora_inicio_evento.val( moment( obj.hora_inicio_evento, 'HH:mm:ss' ).format( 'HH:mm' ) );
				$fecha_termino_estimado_evento.val( obj.fecha_termino_estimado_evento );
				$hora_termino_estimado_evento.val( moment( obj.hora_termino_estimado_evento, 'HH:mm:ss' ).format( 'HH:mm' ) );
				$fecha_termino_evento.val( obj.fecha_termino_evento );
				$hora_termino_evento.val( moment( obj.hora_termino_evento, 'HH:mm:ss' ).format( 'HH:mm' ) );
				$descripcion_evento.val( obj.descripcion_evento );

				sigesop.query({
					class: 'generadores',
					query: 'obtenerEstadoLicencia',
					success: function ( data ) {
						$condicion_operativa.combo({
							arr: data
						})
						.val( obj.condicion_operativa )
						.prop( 'disabled', true );
					}
				});

				// revalidamos los campos
				IDS.$form.formValidation( 'revalidateField', 'fecha_inicio_evento' );
				IDS.$form.formValidation( 'revalidateField', 'hora_inicio_evento' );
			}
		},

		vaciarDatos = function () {
			var
			$form = this.IDS.$form,
			datos = this.datos;

			// datos.id_libro_relatorio.valor = null;
			datos.fecha_inicio_evento.valor = null;
			datos.hora_inicio_evento.valor = null;
			datos.fecha_termino_evento.valor = null;
			datos.hora_termino_evento.valor = null;
			datos.condicion_operativa.valor = null;
			datos.descripcion_evento.valor = null;

			$form.formValidation( 'resetForm' );
		},

		limpiarCampos = function () {
			var
			doc = this,
			IDS = this.IDS;

			IDS.$fecha_inicio_evento.val('');
			IDS.$hora_inicio_evento.val('');
			IDS.$fecha_termino_evento.val('');
			IDS.$hora_termino_evento.val('');
			IDS.$condicion_operativa.val('');
			IDS.$descripcion_evento.val('');

			vaciarDatos.call( doc );
		},

		datos = {
			// id_libro_relatorio: { valor: null },

			numero_aero: { valor: null },

			fecha_inicio_evento: {
				valor: null,
				idHTML: '#fecha-inicio-evento-' + suf
			},

			hora_inicio_evento: {
				valor: null,
				idHTML: '#hora-inicio-evento-' + suf
			},

			fecha_termino_estimado_evento: {
				valor: null,
				idHTML: '#fecha-termino-estimado-evento-' + suf
			},

			hora_termino_estimado_evento: {
				valor: null,
				idHTML: '#hora-termino-estimado-evento-' + suf
			},

			fecha_termino_evento: {
				valor: null,
				idHTML: '#fecha-termino-evento-' + suf
			},

			hora_termino_evento: {
				valor: null,
				idHTML: '#hora-termino-evento-' + suf
			},

			condicion_operativa: {
				valor: null,
				idHTML: '#condicion-operativa-' + suf
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
			IDS: IDS,
			controlFecha: {
				fechaMinimoInicio: null,
				horaMinimaInicio: null,
				fechaMinimoTermino: null,
				horaMinimaTermino: null
			},
			historialEventos: []
		};

		return doc;
	},

	registroHistorial : function ( opt ) {
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
			'<form id="form-historial-eventos-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-12 col-md-12" id="tabla-historial-eventos-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			tabla = sigesop.tablaRegistro({
				suf: 'historial',
				color_fila: 'warning',
				head: 	'FECHA INICIO, HORA INICIO, ' +
						'FECHA TERMINO ESTIMADO, HORA TERMINO ESTIMADO, ' +
						'FECHA TERMINO, HORA TERMINO, ' +
						'CONDICION OPERATIVA, DESCRIPCION',
				campo: 	'fecha_inicio_evento, hora_inicio_evento, ' +
						'fecha_termino_estimado_evento, hora_termino_estimado_evento, ' +
						'fecha_termino_evento, hora_termino_evento, ' +
						'condicion_operativa, descripcion_evento',
				addClass: {
					body: {
						class: 'warning, danger, info, success, success',
						campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
						valor: 'C.A., FALLA, MTTO, F.A., DISPONIBLE'
					}
				}
			});

			doc.table.update_table = tabla.update_table; // enlazamos a vista publica
			doc.table.body = tabla.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + tabla.html;

			if ( localStorage.usuario === sigesop.root ) {
				var items = {
					editar: {
		            	name: 'Editar evento',
		            	icon: 'edit',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).attr( 'table-index' );
		        			typeof opt.table.actions.editar == 'function' ?
		        				opt.table.actions.editar( index ):
		        				console.log( 'function editar is null' );
		        		}
					},
					eliminar: {
		            	name: 'Eliminar evento',
		            	icon: 'delete',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).attr( 'table-index' );
		        			typeof opt.table.actions.eliminar == 'function' ?
		        				opt.table.actions.eliminar( index ):
		        				console.log( 'function eliminar is null' );
		        		}
					}
				}

				$( tabla.IDS.body ).contextMenu({
					selector: 'tr',
					items: items
				});
			}
		},

		IDS = {
			idTabla: '#tabla-historial-eventos-' + suf,
			form: '#form-historial-eventos-' + suf
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

	activeEvents : function ( opt ) {
		/*
		 * obj
		 * suf
		 * table { actions:{} }
		 * badge
		 *
		 */

		if ( typeof opt.badge === 'undefined' )
			throw new Error( 'badge is undefined' );

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
			'</form>' +
			'<div id="tabla_registro_activos' + suf + '" class="form-group"></div>',

		javascript = function () {
			var
			doc = this,
			IDS = this.IDS,
			$hora_corte = $( this.datos.hora_corte.idHTML ),
			$badge = $( '#' + opt.badge ),
			tabla_activos = sigesop.tablaRegistro({
				suf: 	'_activos',
				head: 	'UNIDAD, AERO, CONDICION OPERATIVA, EVENTO, NUMERO LICENCIA,' +
						'FECHA INICIO, HORA INICIO, FECHA ESTIMADA TERMINO,' +
						'HORA DIA DEL REPORTE, HORAS ACUMULADAS',
				campo: 	'numero_unidad, numero_aero, condicion_operativa, descripcion_evento,' +
						'numero_licencia, fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado,' +
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
			IDS.$badge = $badge;

			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + tabla_activos.html;

			var items = {
				nuevo_evento: {
	            	name: 'Agregar evento',
	            	icon: 'add',
	        		callback: function ( key, _opt )
	        		{
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.nuevo_evento == 'function' ?
	        				opt.table.actions.nuevo_evento( index ):
	        				console.log( 'function nuevo_evento is null' );
	        		}
				},

	            historial: {
	            	name: 'Historial de eventos',
	            	icon: 'paste',
	        		callback: function ( key, _opt )
	        		{
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.historial == 'function' ?
	        				opt.table.actions.historial( index ):
	        				console.log( 'function historial is null' );
	        		}
	            }

	          //   cerrar_evento: {
	          //   	name: 'Cerrar evento',
	          //   	icon: 'delete',
	        		// callback: function ( key, _opt )
	        		// {
	        		// 	var index = $( this ).attr( 'table-index' );
	        		// 	typeof opt.table.actions.cerrar_evento == 'function' ?
	        		// 		opt.table.actions.cerrar_evento( index ):
	        		// 		console.log( 'function cerrar_evento is null' );
	        		// }
	          //   }
			}

			if ( localStorage.usuario === sigesop.root ) {
				items.editar = {
	            	name: 'Editar reporte',
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.editar == 'function' ?
	        				opt.table.actions.editar( index ):
	        				console.log( 'function editar is null' );
	        		}
	            }

				items.eliminar = {
	            	name: 'Eliminar reporte',
	            	icon: 'delete',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.eliminar == 'function' ?
	        				opt.table.actions.eliminar( index ):
	        				console.log( 'function eliminar is null' );
	        		}
	            }
			}

			$( tabla_activos.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});

			$hora_corte.change( function ( event ) {
				$badge.empty();
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
					success: function ( data ) {
						window.sesion.matrizLibroRelatorio = data;
						$badge.html( data.length );
						data.length > 0 ?
							tabla_activos.update_table( data ) :
							sigesop.msg( 'Advertencia', 'No hay registros...', 'warning' );
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
			form: '#formReportesActivos' + suf,
			$badge: null
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

	finalyEvents : function ( opt ) {
		if ( typeof opt.badge === 'undefined' )
			throw new Error( 'badge is undefined' );

		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var

		html =
			'<form id="formReportesFinalizados' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-2"></div>' +
					'<div class="col-sm-8">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">OPCIONES DE FILTRADO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">De fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
												'<input name="fecha_inf" id="fecha_inf' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td>' +
				    							'<label class="control-label">A fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_sup" id="fecha_sup' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td colspan="3"></td>' +
				    						'<td>' +
												'<p>'+
													'<button type="submit" id="btnConsultaReporte' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button>'+
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-2"></div>' +
				'</div>' +

				// '<div class="form-group">' +
				// 	'<label class="control-label col-sm-5" for="">De fecha: </label>' +
				// 	'<div class="col-sm-2">' +
				// 		'<input name="fecha_inf" id="fecha_inf' + suf + '" class="form-control" type="text"/>' +
				// 	'</div>' +
				// '</div>' +

				// '<div class="form-group">' +
				// 	'<label class="control-label col-sm-5" for="">A fecha: </label>' +
				// 	'<div class="col-sm-2">' +
				// 		'<input name="fecha_sup" id="fecha_sup' + suf + '" class="form-control" type="text"/>' +
				// 	'</div>' +
				// '</div>' +

				// '<div class="form-group">'+
				// 	'<div class="col-sm-5 control-label"></div>'+
				// 	'<p class="col-sm-2">'+
				// 		'<button type="submit" id="btnConsultaReporte' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button>'+
				// 	'</p>'+
				// '</div>'+
			'</form>' +
			'<div id="tabla_registro_terminado' + suf + '" class="form-group"></div>',

		javascript = function () {
			var
			doc = this,
			form = this.IDS.form,
			datos = this.datos,
			$badge = $( '#' + opt.badge ),
			$form = $( form ).formValidation({
				// live: 'submit',

				row: {
					selector: 'td'
				},

		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
	        		success.call( doc );
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
			this.IDS.$badge = $badge;

			var
				$fecha_inf = $( this.datos.fecha_inf.idHTML ),
				$fecha_sup = $( this.datos.fecha_sup.idHTML ),
				$idTabla = $( this.IDS.idTabla );

			// ----------

			var
			tabla_finalizados = sigesop.tablaRegistro({
				suf: '_terminados',
				head: 	'UNIDAD, AERO, CONDICION OPERATIVA, EVENTO, FECHA INICIO EVENTO, ' +
						'HORA INICIO EVENTO, FECHA ESTIMADA TERMINO, FECHA TERMINO, HORA TERMINO,' +
						'HORAS ACUMULADAS',
				campo: 	'numero_unidad, numero_aero, condicion_operativa, descripcion_evento, ' +
						'fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, fecha_termino_evento, ' +
						'hora_termino_evento, horas_acumuladas_evento',
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
			// this.table.$body = $( this.table.body );
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

			var items = {
	            historial: {
	            	name: 'Historial de eventos',
	            	icon: 'paste',
	        		callback: function ( key, _opt )
	        		{
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.historial == 'function' ?
	        				opt.table.actions.historial( index ):
	        				console.log( 'function historial is null' );
	        		}
	            }
			};

			$( tabla_finalizados.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		success = function () {
			var
			datos = this.datos,
			IDS = this.IDS,
			tabla = this.table;

			$( this.table.body ).empty();
			IDS.$badge.empty();

			var
			fecha_inf = $( datos.fecha_inf.idHTML ).val(),
			fecha_sup = $( datos.fecha_sup.idHTML ).val();

			sigesop.query({
				data: {
					option: 'rango_fechas',
					fecha_inf: fecha_inf,
					fecha_sup: fecha_sup,
					estado_evento: false
				},
				class: 'operacion',
				query: 'obtener_libro_relatorio',
				queryType: 'sendGetData',
				success: function ( data ) {
					window.sesion.matrizLibroRelatorioFinalizados = data;
					IDS.$badge.html( data.length );
					data.length > 0 ?
						tabla.update_table( data ):
						sigesop.msg( 'Advertencia', 'Sin registros...', 'warning' );
				}
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
				form: '#formReportesFinalizados' + suf,
				$badge: null
			},
			table: {
				body: null,
				$body: null,
				update_table: null
			}
		}

		return doc;
	},

	eventsByUnity : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var
		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">' +
					'<div class="col-sm-1"></div>' +
					'<div class="col-sm-10">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">OPCIONES DE FILTRADO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">De fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">A fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label">No. de Unidad: </label>'+
				    						'</td>' +
				    						'<td>' +
				    							'<select name="numero_unidad" id="numero-unidad-impresion-reporte-' + suf + '"class="form-control input-md"></select>' +
				    						'</td>' +

				    						'<td></td>' +

				    						'<td class="text-left">' +
												'<p>'+
													'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success"  data-loading-text="Buscando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button> ' +
													'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir</button>'+
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-1"></div>' +
				'</div>' +

			'</form>' +
			'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>',

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

		        row: {
		        	selector: 'td'
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
	},

	registroReportePeriodo : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var

		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-1"></div>' +
					'<div class="col-sm-10">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">OPCIONES DE FILTRADO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label">De fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label">A fecha: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label">Condición operativa: </label>'+
				    						'</td>' +
				    						'<td>' +
				    							'<select name="condicion_operativa" id="condicion-operativa-impresion-reporte-periodo-' + suf + '"class="form-control input-md"></select>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label">Historial de eventos: </label>'+
				    						'</td>' +
				    						'<td>' +
												'<select name="historial" id="historial-' + suf + '"class="form-control input-md">' +
													'<option value="SI">INCLUIR EN IMPRESION</option>' +
													'<option value="NO">NO INCLUIR EN IMPRESION</option>' +
												'</select>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td colspan="2">' +
				    						'</td>' +
				    						'<td colspan="2">' +
												'<p class="col-sm-9">'+
													'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success" > <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button> ' +
													'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir</button> ' +
													'<button type="button" id="btn-exportar-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-export"></span> MS Excel</button>' +
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-1"></div>' +
				'</div>' +
			'</form>' +
			'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>',

		javascript = function () {
			var
			doc = this,
			form = doc.IDS.form,
			IDS = this.IDS,
			$condicion_operativa = $( doc.datos.condicion_operativa.idHTML ),
			$historial = $( doc.datos.historial.idHTML ),
			$fecha_inf = $( doc.datos.fecha_inf.idHTML ),
			$fecha_sup = $( doc.datos.fecha_sup.idHTML ),
			$botonImprimir = $( doc.IDS.botonImprimir ),
			$botonExportar = $( doc.IDS.botonExportar ),
			$form = $( form )
			.formValidation({
				// live: 'submit',
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
		            },

		        	condicion_operativa: {
		                validators: {
		                    notEmpty: {
		                        message: 'Seleccione unidad de generador'
	                    	}
	                	}
		            }
		        }
			})
			.on( 'success.form.fv', function( e ) { $botonImprimir.prop( 'disabled', false ); $botonExportar.prop( 'disabled', false ); })
			.on( 'err.field.fv', function( e ) { $botonImprimir.prop( 'disabled', true ); $botonExportar.prop( 'disabled', true ); })
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });

			/* Enlace de objetos a vista publica
			 */
			IDS.$form = $form;
			IDS.$condicion_operativa = $condicion_operativa;
			IDS.$fecha_inf = $fecha_inf;
			IDS.$fecha_sup = $fecha_sup;
			IDS.$botonImprimir = $botonImprimir;
			IDS.$botonExportar = $botonExportar;

			sigesop.query({
				class: 'generadores',
				query: 'obtenerEstadoLicencia',
				success: function ( data ) {
					data.push( 'TODAS' );
					window.sesion.matrizEstadoLicencia = data;
					$condicion_operativa.combo({
						arr: data
					})
				}
			});

			var tabla_reporte =
			sigesop.tablaRegistro({
				suf: '-reporte-periodo',
				head: 	'AERO, CONDICION OPERATIVA, FECHA INICIAL, FECHA TERMINO, HORA INICIO, ' +
						'HORA TERMINO, TIEMPO TOTAL, NUM. SUBEVENTOS, TIEMPO TOTAL SUBEVENTOS, ' +
						'TIEMPO MUERTO',
				campo: 	'numero_aero, condicion_operativa, fecha_inicio_evento, ' +
					'fecha_termino_evento, hora_inicio_evento, hora_termino_evento, ' +
					'horas_acumuladas_evento, num_subeventos, sum_subeventos, tiempo_muerto',

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
				var url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=imprimir_reporte_periodo&option=rango_fechas&estado_evento=all' +
					'&fecha_inf=' + $fecha_inf.val() + '&fecha_sup=' + $fecha_sup.val() +
					'&option2=condicion_operativa' + '&condicion_operativa=' + $condicion_operativa.val() +
					'&historial=' + $historial.val(),

					win = window.open( url );

				win.focus();
			 });

			$botonExportar.on( 'click', function ( event ) {
				var url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=exportar_reporte_periodo&option=rango_fechas&estado_evento=all' +
					'&fecha_inf=' + $fecha_inf.val() + '&fecha_sup=' + $fecha_sup.val() +
					'&option2=condicion_operativa' + '&condicion_operativa=' + $condicion_operativa.val() +
					'&historial=' + $historial.val(),

					win = window.open( url );
				win.focus();
			});
		},

		datos = {
			historial:{
				idHTML: '#historial-' + suf,
				valor: null
			} ,

			condicion_operativa:{
				idHTML: '#condicion-operativa-impresion-reporte-periodo-' + suf,
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
			botonExportar: '#btn-exportar-reporte-' + suf,
			form: '#form-imprimir-reporte-' + suf,
			$condicion_operativa: null
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
	},

	reporteOrdenTrabajo : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var

		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-1"></div>' +
					'<div class="col-sm-10">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">OPCIONES DE FILTRADO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Fecha Inicial: </label>' +
				    						'</td>' +
				    						'<td >' +
				    							'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Fecha Final: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Ordenes: </label>' +
				    						'</td>' +
				    						'<td >' +
												'<select name="tipo_orden_trabajo" id="tipo-orden-trabajo-' + suf + '" class="form-control">' +
													'<option>PROGRAMADAS</option>' +
													'<option>REPROGRAMADAS</option>' +
													'<option>TERMINADAS</option>' +
													'<option>TODAS</option>' +
												'</select>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label" for="">Historial: </label>' +
				    						'</td>' +
				    						'<td>' +
												'<select name="historial" id="historial-' + suf + '" class="form-control input-md">' +
													'<option value="SI">INCLUIR EN IMPRESION</option>' +
													'<option value="NO">NO INCLUIR EN IMPRESION</option>' +
												'</select>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label">Unidades: </label>'+
				    						'</td>' +
				    						'<td >' +
				    							'<div id="div-unidades' + suf + '"></div>'+
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label">Aerogeneradores: </label>'+
				    						'</td>' +
				    						'<td>' +
				    							'<div id="div-aerogeneradores-' + suf + '"></div>'+
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						// '<td></td>' +
				    						// '<td></td>' +
				    						'<td colspan="3"></td>' +
				    						'<td colspan="2" class="text-left">' +
												'<p>'+
													'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success" > <span class="glyphicon glyphicon-search"></span> Consultar</button> ' +
													'<button type="reset" id="btn-limpiar-campos-reporte-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button> '+
													'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-print"></span> Imprimir</button>'+
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-1"></div>' +
				'</div>' +

				// '<div class="form-group">' +
				// 	'<label class="control-label col-sm-3" for="">Fecha Inicial: </label>' +
				// 	'<div class="col-sm-3">' +
				// 		'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
				// 	'</div>' +

				// 	'<label class="control-label col-sm-2" for="">Fecha Final: </label>' +
				// 	'<div class="col-sm-3">' +
				// 		'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
				// 	'</div>' +
				// '</div>' +

				// '<div class="form-group">' +
				// 	'<label class="control-label col-sm-3" for="">Ordenes: </label>' +
				// 	'<div class="col-sm-3">' +
				// 		'<select name="tipo_orden_trabajo" id="tipo-orden-trabajo-' + suf + '" class="form-control">' +
				// 			'<option>PROGRAMADAS</option>' +
				// 			'<option>REPROGRAMADAS</option>' +
				// 			'<option>TERMINADAS</option>' +
				// 			'<option>TODAS</option>' +
				// 		'</select>' +
				// 	'</div>' +

				// 	'<label class="control-label col-sm-2" for="">Historial: </label>'+
				// 	'<div class="col-sm-3">'+
				// 		'<select name="historial" id="historial-' + suf + '" class="form-control input-md">' +
				// 			'<option value="SI">INCLUIR EN IMPRESION</option>' +
				// 			'<option value="NO">NO INCLUIR EN IMPRESION</option>' +
				// 		'</select>' +
				// 	'</div>'+
				// '</div>' +

				// '<div class="form-group">'+
				// 	'<label class="control-label col-sm-3 ">Unidades: </label>'+
				// 	'<div id="div-unidades' + suf + '" class="col-sm-3"></div>'+
				// 	'<label class="control-label col-sm-2 ">Aerogeneradores: </label>'+
				// 	'<div id="div-aerogeneradores-' + suf + '" class="col-sm-3"></div>'+
				// '</div>'+

				// '<div class="form-group">'+
				// 	'<div class="col-sm-8 control-label"></div>'+
				// 	'<p class="col-sm-4">'+
				// 		'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success"  data-loading-text="Buscando..."> <span class="glyphicon glyphicon-search"></span> Consultar</button> ' +
				// 		'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-print"></span> Imprimir</button>'+
				// 	'</p>'+
				// '</div>'+
			'</form>' +
			'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>',

		limpiarCampos = function () {
			var doc = this;

			doc.table.reset_unidades();
			doc.table.update_aero( [] );
			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			var
			datos = this.datos,
			IDS   = this.IDS;

			datos.fecha_inf.valor    = null;
			datos.fecha_sup.valor    = null;
			// datos.sin_licencia.valor = null;

			IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc   = this,
			datos = this.datos,
			form  = doc.IDS.form,
			IDS   = this.IDS,

			$historial          = $( datos.historial.idHTML ),
			$tipo_orden_trabajo = $( datos.tipo_orden_trabajo.idHTML ),
			$fecha_inf          = $( datos.fecha_inf.idHTML ),
			$fecha_sup          = $( datos.fecha_sup.idHTML ),
			$botonImprimir      = $( IDS.botonImprimir ),
			$botonLimpiar       = $( IDS.botonLimpiar ),
			$form               = $( form )
			.formValidation({
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

		        	/* verificamos que el se haya seleccionado por lo menos una unidad
		        	 */
		        	if ( $.isEmptyObject( datos.unidades ) ){
		        		sigesop.msg( 'Info', 'Seleccione unidad', 'warning' );
		        		return;
		        	}

		        	/* verificamos que el se haya seleccionado
		        	 * por lo menos un aero
		        	 */
		        	if ( !$.isEmptyObject( datos.aeros ) )
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, doc.IDS, limpiarCampos.bind( doc ) ) :
			        		console.log( 'success is null' );

			        else sigesop.msg( 'Info', 'Seleccione aerogenerador', 'warning' );

		        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		      		fecha_inf: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.fecha_inf.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_inf.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_inf.valor = null;
	                	},
		                validators: {
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            },

		            fecha_sup: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.fecha_sup.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_sup.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_sup.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Fecha necesaria.'
		                    },
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            },

		        	tipo_orden_trabajo: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.tipo_orden_trabajo.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.tipo_orden_trabajo.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.tipo_orden_trabajo.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
	                    	}
	                	}
		            },

					historial: {
						onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.historial.valor = val;
		            	},
		                validators: {
		                    notEmpty: {
		                        message: 'Seleccione'
	                    	}
	                	}
					}
		        }
			})
			.on( 'success.form.fv', function( e ) { $botonImprimir.prop( 'disabled', false ); })
	        .on( 'err.field.fv', function( e ) { $botonImprimir.prop( 'disabled', true ); })
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });

			/* Enlace de objetos a vista publica
			 */
			IDS.$form          = $form;
			IDS.$fecha_inf     = $fecha_inf;
			IDS.$fecha_sup     = $fecha_sup;
			IDS.$botonImprimir = $botonImprimir;
			IDS.$botonLimpiar  = $botonLimpiar;

			/* Tabla de tablas de seleccion
			 */
			var

			tabla_aero = sigesop.tabla({
				suf: '-aerogeneradores',
				head: {
					campo: 'AEROGENERADOR, UNIDAD',
					checkAll: {
						callback: function ( state, val, $elem, arr ) {
							/* agregar elementos validos a la
							 * matriz con vista publica
							 */
							var
								i = 0,
								lon = arr.length,
								row = null;

							datos.aeros.length = 0; // borramos datos anteriores
							for ( i ; i < lon ; i++ ) {
								row = arr[ i ];
								if ( row.valor ) datos.aeros.push( row.valor );
							}
						}
					}
				},
				body: {
					campo: 'numero_aero, numero_unidad',
					callback: function ( state, val, $elem, arr ) {
						/* agregar elementos validos a la
						 * matriz con vista publica
						 */
						var
							i = 0,
							lon = arr.length,
							row = null;

						datos.aeros.length = 0; // borramos datos anteriores
						for ( i ; i < lon ; i++ ) {
							row = arr[ i ];
							if ( row.valor ) datos.aeros.push( row.valor );
						}
					}
				},
				tipo: 'checkbox'
			}),

			tabla_unidades = sigesop.tabla({
				suf: '-unidades',
				head: {
					campo: 'NUMERO DE UNIDAD',
					checkAll: {
						callback: function ( state, val, $elem, arr ) {
							/* agregar elementos validos a la
							 * matriz con vista publica
							 */
							var
								i = 0,
								lon = arr.length,
								row = null;

							datos.unidades.length = 0; // borramos datos anteriores
							for ( i ; i < lon ; i++ ) {
								row = arr[ i ];
								if ( row.valor ) datos.unidades.push( row.valor );
							}

							if ( !$.isEmptyObject( datos.unidades ) ) {
								sigesop.query({
									data: { numero_unidad: datos.unidades, option: 'unidad' },
									class: 'generadores',
									query: 'obtenerGeneradores',
									queryType: 'sendGetData',
									success: function ( data ) {
										tabla_aero.update_table( data );
									}
								});
							}

							// Vaciamos las filas de aeros anteriores
							else tabla_aero.update_table( [] );

							/* Borramos datos anteriores de los aeros seleccionados */
							datos.aeros.length = 0;
						}
					}
				},
				body: {
					campo: 'numero_unidad',
					callback: function ( state, val, $elem, arr ) {
						/* agregar elementos validos a la
						 * matriz con vista publica
						 */
						var
							i = 0,
							lon = arr.length,
							row = null;

						datos.unidades.length = 0; // borramos datos anteriores
						for ( i ; i < lon ; i++ ) {
							row = arr[ i ];
							if ( row.valor ) datos.unidades.push( row.valor );
						}

						if ( !$.isEmptyObject( datos.unidades ) ) {
							sigesop.query({
								data: { numero_unidad: datos.unidades, option: 'unidad' },
								class: 'generadores',
								query: 'obtenerGeneradores',
								queryType: 'sendGetData',
								success: function ( data ) {
									tabla_aero.update_table( data );
								}
							});
						}

						// vaciamos las filas de aeros anteriores
						else tabla_aero.update_table( [] );

						/* borramos datos anteriores
						 * de los aeros seleccionados
						 */
						datos.aeros.length = 0;
					}
				},
				tipo: 'checkbox'
			}),

			update_registro = sigesop.tablaRegistro({
				suf: '-orden-trabajo',
				head: 	'UNIDAD, AERO, No. ORDEN, FECHA PROG., FECHA REAL, HORAS PROG., HORAS REALES',
				campo: 	'numero_unidad, id_aero, numero_orden, fecha_prog, fecha_inicio_evento, horas_prog, horas_reales',

				addClass: {
					body: {
						class: 'warning, danger, info, success',
						campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
						valor: 'C.A., FALLA, MTTO, F.A.'
					}
				}
			});


			/* Imprimiendo en documentos */
			document.getElementById( IDS.tablaUnidades.flushChar('#') )
				.innerHTML = tabla_unidades.html;
			this.table.update_unidades = tabla_unidades.update_table; // enlace a vista publica
			this.table.reset_unidades  = tabla_unidades.reset;

			document.getElementById( IDS.tablaAero.flushChar('#') )
				.innerHTML = tabla_aero.html;
			this.table.update_aero = tabla_aero.update_table; // enlace a vista publica
			this.table.reset_aero  = tabla_aero.reset;

			document.getElementById( IDS.tablaRegistro.flushChar('#') )
				.innerHTML = '<br>' + update_registro.html
			this.table.update_registro = update_registro.update_table; // enlazamos a vista publica

			/* Configuracion de fields y clicks	*/
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
				var url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=imprimir_reporte_orden_trabajo&option=rango_fechas' +
					'&fecha_inf=' + $fecha_inf.val() + '&fecha_sup=' + $fecha_sup.val() +
					'&tipo_orden_trabajo=' + $tipo_orden_trabajo.val() +
					'&historial=' + $historial.val() +
					'&aeros=' + datos.aeros,

					win = window.open( url );

				win.focus();
			 });

			$botonLimpiar.on( 'click', function (e ){
				limpiarCampos.call( doc );
			});
		},

		datos = {
			fecha_inf: {
				idHTML: '#fecha-inferior-impresion-' + suf,
				valor: null
			},

			fecha_sup: {
				idHTML: '#fecha-superior-impresion-' + suf,
				valor: null
			},

			tipo_orden_trabajo: {
				idHTML: '#tipo-orden-trabajo-' + suf,
				valor: null
			},

			historial: {
				idHTML: '#historial-' + suf,
				valor: null
			},

			unidades:[],

			aeros:[]
		},

		IDS = {
			tablaUnidades: '#div-unidades' + suf,
			tablaAero: '#div-aerogeneradores-' + suf,
			tablaRegistro: '#tabla-impresion-reporte-' + suf,
			botonConsultar: '#btn-consulta-reporte-' + suf,
			botonImprimir: '#btn-imprimir-reporte-' + suf,
			botonLimpiar: '#btn-limpiar-campos-reporte-' + suf,
			form: '#form-imprimir-reporte-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			table: {
				update_unidades: null,
				update_aero    : null,
				update_registro: null,

				reset_unidades : null,
				reset_aero     : null
			}
		}
		return doc;
	},

	reporteOrdenTrabajoProgramado : function ( opt ) {
		if ( typeof opt.badge === 'undefined' )
			throw new Error( 'badge is undefined' );

		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var

		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<div class="col-sm-2"></div>' +
					'<div class="col-sm-8">' +
						'<div class="panel-success">' +
							'<div class="panel-heading">OPCIONES DE FILTRADO</div>' +
							'<div class="table-responsive">' +
				    			'<table class="table table-bordered">' +
				    				'<thead></thead>' +
				    				'<tbody>' +
				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label for="">Estado de Licencia: </label>' +
				    						'</td>' +
				    						'<td colspan="3">' +
												'<select name="sin_licencia" id="tipo-filtro-licencia-' + suf + '" class="form-control">' +
													'<option value="">' + sigesop.seleccioneOpcion + '</option>' +
													'<option value="mtto_con_licencia">SOLO MTTO CON LICENCIA</option>' +
													'<option value="mtto_sin_licencia">SOLO MTTO SIN LICENCIA</option>' +
													'<option value="mtto_con_sin_licencia">MTTO CON/SIN LICENCIA</option>' +
												'</select>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td class="text-right">' +
				    							'<label class="control-label for="">Fecha Inicial: </label>' +
				    						'</td>' +
				    						'<td >' +
				    							'<input name="fecha_inf" id="fecha-inferior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +

				    						'<td class="text-right">' +
				    							'<label class="control-label for="">Fecha Final: </label>' +
				    						'</td>' +
				    						'<td>' +
				    							'<input name="fecha_sup" id="fecha-superior-impresion-' + suf + '" class="form-control" type="text"/>' +
				    						'</td>' +
				    					'</tr>' +

				    					'<tr>' +
				    						'<td></td>' +
				    						'<td colspan="3">' +
												'<p>'+
													'<button type="submit" id="btn-consulta-reporte-orden-trabajo-' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-search"></span> Consultar</button> ' +
													'<button type="reset" id="btn-limpiar-campos-reporte-orden-trabajo-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button> '+
													'<button type="button" id="btn-imprimir-reporte-orden-trabajo-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-print"></span> Imprimir</button> '+
													'<button type="button" id="btn-exportar-reporte-orden-trabajo-prog-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-export"></span> MS Excel</button>' +
												'</p>'+
				    						'</td>' +
				    					'</tr>' +
				    				'</tbody>' +
								'</table>' +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div class="col-sm-2"></div>' +
				'</div>' +
			'</form>' +

			'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>',

		limpiarCampos = function () {
			var
				doc = this;

			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			var
			datos = this.datos,
			IDS   = this.IDS;

			datos.fecha_inf.valor = null;
			datos.fecha_sup.valor = null;

			IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc   = this,
			datos = this.datos,
			form  = doc.IDS.form,
			IDS   = this.IDS,

			$fecha_inf     = $( datos.fecha_inf.idHTML ),
			$fecha_sup     = $( datos.fecha_sup.idHTML ),
			$sin_licencia  = $( datos.sin_licencia.idHTML ),
			$botonImprimir = $( IDS.botonImprimir ),
			$botonExportar = $( IDS.botonExportar ),
			$botonLimpiar  = $( IDS.botonLimpiar ),
			$badge         = $( '#' + opt.badge ),
			$form          = $( form )
			.formValidation({
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
		        		opt.success( doc.datos, doc.IDS, limpiarCampos.bind( doc ) ) :
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
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.fecha_inf.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_inf.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_inf.valor = null;
	                	},
		                validators: {
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            },

		            fecha_sup: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.fecha_sup.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_sup.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_sup.valor = null;
	                	},
		                validators: {
                            date: {
                            	format: 'DD-MM-YYYY',
                            	message: 'Fecha inválida'
                            }
		                }
		            },

		            sin_licencia: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val();
		            		datos.sin_licencia.valor = val;
		            	},
		            	onError: function ( e, data ) {
		            		datos.sin_licencia.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.sin_licencia.valor = null;
	                	},
		                validators: {
                            notEmpty: {
                            	message: 'Complete campos'
                            }
		                }
		            }
		        }
			})
			.on( 'success.form.fv', function( e ) { $botonImprimir.prop( 'disabled', false ); $botonExportar.prop( 'disabled', false );})
	        .on( 'err.field.fv', function( e ) { $botonImprimir.prop( 'disabled', true ); $botonExportar.prop( 'disabled', true );})
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });

			/* Enlace de objetos a vista publica
			 */
			IDS.$form          = $form;
			IDS.$fecha_inf     = $fecha_inf;
			IDS.$fecha_sup     = $fecha_sup;
			IDS.$sin_licencia  = $sin_licencia
			IDS.$botonImprimir = $botonImprimir;
			IDS.$botonExportar = $botonExportar;
			IDS.$badge         = $badge;

			/* Tabla de tablas de seleccion
			 */
			var

			update_registro = sigesop.tablaRegistro({
				suf  : '-orden-trabajo-programacion' + suf,
				head : 	'UNIDAD, AERO, No. ORDEN, DESCRIPCION EVENTO, '+
						'FECHA PROG., FECHA REPROG., HORAS PROG., '+
						'HORAS REALES, ACTIVIDADES FALTANTES',
				campo: 	'numero_unidad, numero_aero, numero_orden, descripcion_evento,'+
						'fecha_programada, fecha_reprogramada, horas_programadas, '+
						'horas_reales, actividades_faltantes',

				addClass: {
					body: {
						class: 'warning, danger, info, success',
						campo: 'condicion_operativa, condicion_operativa, condicion_operativa, condicion_operativa',
						valor: 'C.A., FALLA, MTTO, F.A.'
					}
				}
			});

			this.table.body = update_registro.IDS.body;

			document.getElementById( IDS.tablaRegistro.flushChar('#') )
				.innerHTML = '<br>' + update_registro.html
			this.table.update_registro = update_registro.update_table; // enlazamos a vista publica

			/* Configuracion de fields y clicks	*/
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
					fecha_inf = moment( datos.fecha_inf.valor, 'DD-MM-YYYY' ),
					fecha_sup = moment( datos.fecha_sup.valor, 'DD-MM-YYYY' );

				if( $fecha_inf.val() )
					if ( fecha_sup.isBefore( fecha_inf ) )
						doc.IDS.$form.data( 'formValidation' ).updateStatus( 'fecha_inf', 'INVALID' );
			});

			$botonLimpiar.on( 'click', function ( event ){
				// alert( 'test' );
				limpiarCampos.call( doc );
			});

			$botonImprimir.on( 'click', function ( event ) {
				var
					param = {
						option: 'obtener_libro_relatorio_orden_trabajo_programado',
						fecha_inf: datos.fecha_inf.valor,
						fecha_sup: datos.fecha_sup.valor,
						sin_licencia: datos.sin_licencia.valor
					},

					url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=imprimir_reporte_orden_trabajo_programado&' + $.param( param );

				win = window.open( url );
				win.focus();
			});

			$botonExportar.on( 'click', function (){
				var
					param = {
						option: 'obtener_libro_relatorio_orden_trabajo_programado',
						fecha_inf: datos.fecha_inf.valor,
						fecha_sup: datos.fecha_sup.valor,
						sin_licencia: datos.sin_licencia.valor
					},

					url = sigesop.raizServidor + 'ajax.php?class=operacion' +
					'&action=exportar_reporte_orden_trabajo_programado&' + $.param( param );

				win = window.open( url );
				win.focus();
			});
		},

		datos = {
			fecha_inf: {
				idHTML: '#fecha-inferior-impresion-' + suf,
				valor: null
			},

			fecha_sup: {
				idHTML: '#fecha-superior-impresion-' + suf,
				valor: null
			},

			sin_licencia: {
				valor: null,
				idHTML: '#mtto-sin-licencia-' + suf
			}
		},

		IDS = {
			tablaRegistro : '#tabla-impresion-reporte-' + suf,
			botonConsultar: '#btn-consulta-reporte-orden-trabajo-' + suf,
			botonImprimir : '#btn-imprimir-reporte-orden-trabajo-' + suf,
			botonExportar : '#btn-exportar-reporte-orden-trabajo-prog-' + suf,
			botonLimpiar  : '#btn-limpiar-campos-reporte-orden-trabajo-' + suf,
			form          : '#form-imprimir-reporte-' + suf,
			$fecha_inf    : null,
			$fecha_sup    : null,
			$sin_licencia : null,
			$badge        : null
		};

		return {
			html      : html,
			javascript: javascript,
			datos     : datos,
			IDS       : IDS,
			table     : {
				body: null,
				update_registro: null
			}
		}
	}
};