sigesop.mantenimiento = {
	document: function ( opt ) {
		/* suf
		 * obj
		 * success
		 * error
		 */

		var

		suf = opt.suf || '',

		html =
			'<div class="panel panel-success">' +
				'<div class="panel-heading">Datos de la orden de trabajo</div>' +
				'<br>' +

				'<form id="formCrearMantto' + suf + '" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Unidad: </label>' +
						'<div class="col-sm-7">' +
							'<select name="numero_unidad" id="numero_unidad' + suf + '" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Aerogenerador: </label>' +
						'<div class="col-sm-7">' +
							'<select name="numero_aero" id="numero_aero' + suf + '" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Tipo Mantenimiento: </label>' +
						'<div class="col-sm-7">' +
							'<select name="id_mantenimiento" id="id_mantenimiento' + suf + '" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Duración: </label>' +
						'<div class="col-sm-3">' +
							'<input name="duracion" id="duracion' + suf + '" class="form-control" >' +
						'</div>' +
						'<div class="col-sm-4">' +
							'<select name="magnitud_duracion" id="magnitud_duracion' + suf + '" class="form-control" >' +
								'<option value="">' + sigesop.seleccioneOpcion + '</option>' +
								'<option value="d">DIAS</option>' +
								'<option value="M">MESES</option>' +
								'<option value="y">AÑOS</option>' +
							'</select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Periodo de Programación Inicial: </label>' +
						'<div class="col-sm-4">' +
							'<input name="fecha_inicial" id="fecha_inicial' + suf + '" type="text" class="form-control">' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Periodo de Programación Final: </label>' +
						'<div class="col-sm-4">' +
							'<input name="fecha_final" id="fecha_final' + suf + '" type="text" class="form-control">' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Trabajo solicitado: </label>' +
						'<div class="col-sm-7">' +
							'<textarea name="trabajo_solicitado" id="trabajo_solicitado' + suf + '" class="form-control' + suf + '" ></textarea>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 control-label"></div>' +
						'<p class="col-sm-9">' +
							'<button type="submit" id="btnGenerarOrdenes' + suf + '" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Generar</button> ' +
							'<button type="reset" id="btnLimpiarFormOrdenes' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>' +
			'</div>',

		javascript = function () {
			var
			doc                 = this,
			datos               = this.datos,
			IDS                 = this.IDS,
			form                = this.IDS.form,
			$botonLimpiar       = $( this.IDS.botonLimpiar ),
			$numero_unidad      = $( datos.numero_unidad.idHTML ),
			$numero_aero        = $( datos.numero_aero.idHTML ),
			$id_mantenimiento   = $( datos.id_mantenimiento.idHTML ),
			$duracion           = $( datos.duracion.idHTML ),
			$magnitud_duracion  = $( datos.magnitud_duracion.idHTML ),
			$fecha_inicial      = $( datos.fecha_inicial.idHTML ),
			$fecha_final        = $( datos.fecha_final.idHTML ),
			$trabajo_solicitado = $( datos.trabajo_solicitado.idHTML ).toUpperCase(),
			$form               = $( form ).formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.success == 'function' ?
		        		generar_elementos.call( doc, opt.success ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            numero_unidad: {
		            	onSuccess: function ( e, data ) {
		            		datos.numero_unidad.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.numero_unidad.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.numero_unidad.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            numero_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.numero_aero.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.numero_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.numero_aero.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            id_mantenimiento: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_mantenimiento.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.id_mantenimiento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.id_mantenimiento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            duracion: {
		            	onSuccess: function ( e, data ) {
		            		datos.duracion.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.duracion.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.duracion.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            },
		            magnitud_duracion: {
		            	onSuccess: function ( e, data ) {
		            		datos.magnitud_duracion.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.magnitud_duracion.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.magnitud_duracion.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            fecha_inicial: {
		            	onSuccess: function ( e, data ) {
		            		datos.fecha_inicial.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_inicial.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_inicial.valor = null;
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
		            fecha_final: {
		            	onSuccess: function ( e, data ) {
		            		datos.fecha_final.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.fecha_final.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.fecha_final.valor = null;
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
		            trabajo_solicitado: {
		            	onSuccess: function ( e, data ) {
		            		datos.trabajo_solicitado.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.trabajo_solicitado.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.trabajo_solicitado.valor = null;
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
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			/* Enlazar vista publica
			 */
			IDS.$form               = $form;
			IDS.$numero_unidad      = $numero_unidad;
			IDS.$numero_aero        = $numero_aero;
			IDS.$id_mantenimiento   = $id_mantenimiento;
			IDS.$duracion           = $duracion;
			IDS.$magnitud_duracion  = $magnitud_duracion;
			IDS.$fecha_inicial      = $fecha_inicial;
			IDS.$fecha_final        = $fecha_final;
			IDS.$trabajo_solicitado = $trabajo_solicitado;
			IDS.$botonLimpiar       = $botonLimpiar;

			$numero_unidad.change( function () {
				$numero_aero.empty();

				var valorUnidad = $( this ).val();
				if ( valorUnidad )
				{
					sigesop.query({
						data: { numero_unidad: valorUnidad },
						class: 'generadores',
						query: 'obtenerGeneradores',
						queryType: 'sendGetData',
						success: function ( data )
						{
							$numero_aero.combo({
								arr: data,
								campo: 'numero_aero'
							});

							$form.formValidation( 'revalidateField', 'numero_aero' );
						}
					});
				}

				else doc.datos.numero_unidad.valor = null;
			});

			$numero_aero.change( function ( event ) {
				$id_mantenimiento.val('');
				$form.formValidation( 'revalidateField', 'id_mantenimiento' );
			});

			$id_mantenimiento.change(function ( e ) {
				var
				numero_aero = datos.numero_aero.valor,
				id_mantenimiento = datos.id_mantenimiento.valor;

				if ( !numero_aero ) {
					sigesop.msg( 'info', 'Seleccione número de aerogenerador' );
					$id_mantenimiento.val( '' );
					$form.formValidation( 'revalidateField', 'id_mantenimiento' );
					$form.formValidation( 'revalidateField', 'numero_aero' );
					return null;
				}

				if ( !id_mantenimiento ) return null;

				sigesop.query({
					data: {
						option: 'ultima_orden',
						numero_aero: numero_aero,
						id_mantenimiento: id_mantenimiento
					},
					class: 'mantenimiento',
					query: 'obtenerOrdenTrabajo',
					queryType: 'sendGetData',
					success: function ( ultimaFecha ) {
						/* seteamos la fecha proviniente del servidor
						 */
						if ( ultimaFecha ) {
							$form.formValidation( 'resetField', 'fecha_inicial' );
							$fecha_inicial.val( ultimaFecha )
							.prop( 'disabled', true );

							datos.fecha_inicial.valor = ultimaFecha;

							$form.formValidation( 'revalidateField', 'fecha_final' );
						}
						/* limpiamos los campos de fecha
						 */
						else {
							// datos.fecha_inicial.valor = null;
							$fecha_inicial.prop( 'disabled', false );
							$form.formValidation( 'revalidateField', 'fecha_inicial' );
							$form.formValidation( 'revalidateField', 'fecha_final' );
						}
					}
				});
			})
			.on( 'err.field.fv', function ( e, data ) {
				$fecha_inicial.prop( 'disabled', false );
				$form.formValidation( 'revalidateField', 'fecha_inicial' );
				$form.formValidation( 'revalidateField', 'fecha_final' );
			});

			$duracion.spinner({
				spin: function (event, ui)
				{
					if ( $.isNumeric( ui.value ) )
					{
						if (ui.value <= 0) {
							$( this ).spinner('value', 1);
							return false;
						}
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'duracion' );
				}
			});

			$fecha_inicial.val( moment().format( 'DD-MM-YYYY' ) );
			$fecha_inicial.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onSelect: function( selectedDate ) {
					$form.formValidation( 'revalidateField', 'fecha_inicial' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				var
					fecha_1 = moment( $fecha_inicial.val(), 'DD-MM-YYYY' ),
					fecha_2 = moment( $fecha_final.val(), 'DD-MM-YYYY' );

				if( $fecha_inicial.val() && $fecha_final.val() )
					if ( fecha_2.isBefore( fecha_1 ) )
					{
						$form.data( 'formValidation' ).updateStatus( 'fecha_inicial', 'INVALID' );
						$fecha_inicial.val('');
						sigesop.msg( 'Advertencia', 'Fecha fuera de rango', 'warning' );
					}
			});

			$fecha_final.datepicker({
				defaultDate: "+1w",
				changeMonth: true,
				changeYear: true,
				numberOfMonths: 3,
				dateFormat: 'dd-mm-yy',
				showAnim: 'slide',
				onSelect: function( selectedDate ) {
					$form.formValidation( 'revalidateField', 'fecha_final' );
				}
			})
			.on( 'success.field.fv', function ( e, data ) {
				var
					fecha_1 = moment( $fecha_inicial.val(), 'DD-MM-YYYY' ),
					fecha_2 = moment( $fecha_final.val(), 'DD-MM-YYYY' );

				if( $fecha_inicial.val() && $fecha_final.val() )
					if ( fecha_2.isBefore( fecha_1 ) )
					{
						$form.data( 'formValidation' ).updateStatus( 'fecha_final', 'INVALID' );
						$fecha_final.val('');
						sigesop.msg( 'Advertencia', 'Fecha fuera de rango', 'warning' );
					}
			});

			$botonLimpiar.on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		limpiarCampos = function () {
			var
			doc = this,
			IDS = this.IDS;

			IDS.$numero_unidad.val( '' );
			IDS.$numero_aero.val( '' );
			IDS.$id_mantenimiento.val( '' );
			IDS.$duracion.val( '' );
			IDS.$magnitud_duracion.val('');
			IDS.$fecha_inicial.val( moment().format( 'DD-MM-YYYY' ) );
			IDS.$fecha_final.val( '' );
			IDS.$trabajo_solicitado.val( '' );
			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			var
			IDS = this.IDS,
			datos = this.datos;
			IDS.$fecha_inicial.prop( 'disabled', false );
			datos.numero_unidad.valor = null;
			datos.numero_aero.valor = null;
			datos.id_mantenimiento.valor = null;
			datos.duracion.valor = null;
			datos.magnitud_duracion.valor = null;
			datos.fecha_inicial.valor = null;
			datos.fecha_final.valor = null;
			datos.trabajo_solicitado.valor = null;
			datos.programacion_mtto.length = 0;

			IDS.$form.formValidation( 'resetForm' );
		},

		generar_elementos = function ( success ) {
			var
			doc = this,
			datos = this.datos;

			/* buscamos la frecuencia y la magnitud
			 * de la frecuencia en el arreglo de tipos de mantenimiento
			 */
			var posicion =
				sigesop.indexOfObjeto( 	window.sesion.matrizTipoMantto,
										'id_mantenimiento',
										datos.id_mantenimiento.valor );

			if ( posicion === -1 )
			throw new Error( 'ID Mantenimiento: ' + datos.id_mantenimiento.valor + ' no encontrado' );

			/* calculamos los periodos
			 */
			var
			fechaLocal = sigesop.mantenimiento.calculaPeriodoMantenimiento({
				fechaInicial: datos.fecha_inicial.valor,
				fechaFinal: datos.fecha_final.valor,
				duracion: datos.duracion.valor,
				magnitudDuracion: datos.magnitud_duracion.valor,
				frecuencia: window.sesion.matrizTipoMantto[ posicion ].numero_frecuencia,
				magnitudFrecuencia: window.sesion.matrizTipoMantto[ posicion ].tipo_frecuencia
			}),

			/* objeto con los datos para graficar
			 */
			obj = {
				nombre: datos.numero_aero.valor + ' - ' + datos.id_mantenimiento.valor ,
				colorGrafica: '#5bc0de',
				intervalos: fechaLocal
			},

			/* creacion del documento para la ventana emergente
			 */
			_doc = sigesop.mantenimiento.documentoVistaPreliminar( '_' ),

		    win = BootstrapDialog.show({
		        title: 'Vista preliminar',
		        type: BootstrapDialog.TYPE_DEFAULT,
		        message: _doc.html,
		        onshown: function ( dialog ) {
					datos.programacion_mtto = sigesop.mantenimiento.formatoFechaServidor( fechaLocal );
					$( _doc.IDS.botonGuardar ).on( 'click', function ( event ) {
						event.preventDefault();
						success( datos, fechaLocal, limpiarCampos = limpiarCampos.bind( doc ), dialog );
					});

					sigesop.mantenimiento.graficaMantenimiento( [ obj ], _doc.IDS.grafica );
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
		    });
		},

		datos = {
			numero_unidad: {
				valor: null,
				idHTML: '#numero_unidad' + suf
			},

			numero_aero: {
				valor: null,
				idHTML: '#numero_aero' + suf
			},

			id_mantenimiento: {
				valor: null,
				idHTML: '#id_mantenimiento' + suf
			},

			duracion: {
				valor: null,
				idHTML: '#duracion' + suf
			},

			magnitud_duracion: {
				valor: null,
				idHTML: '#magnitud_duracion' + suf
			},

			fecha_inicial: {
				valor: null,
				idHTML: '#fecha_inicial' + suf
			},

			fecha_final: {
				valor: null,
				idHTML: '#fecha_final' + suf
			},

			programacion_mtto: [],

			trabajo_solicitado: {
				valor: null,
				idHTML: '#trabajo_solicitado' + suf
			}
		},

		IDS = {
			botonGuardar: '#btnGenerarOrdenes' + suf,
			botonLimpiar: '#btnLimpiarFormOrdenes' + suf,
			form: '#formCrearMantto' + suf,
			$form: null,
			$numero_unidad: null,
			$numero_aero: null,
			$id_mantenimiento: null,
			$duracion: null,
			$fecha_inicial: null,
			$fecha_final: null,
			$botonLimpiar: null
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS
		};

		return doc;
	},

	registro: function ( opt ) {
		var suf = opt.suf || '';

		var
		html =
			'<form id="formRegistroMantto' + suf + '">' +
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-12 col-md-12" id="tabla_registro_mantto' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			tabla = sigesop.tablaRegistro({
				suf: 	'_Rmtto',
				head: 	'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, ' +
						'SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, ' +
						'FECHA REPROGRAMADA',
				campo: 	'numero_orden, trabajo_solicitado, nombre_mantenimiento, ' +
						'orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, ' +
						'orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada'
			});

			this.table.update_table = tabla.update_table; // enlazamos a vista publica
			this.table.body = tabla.IDS.body;
			document.getElementById( this.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + tabla.html;

			var items = {
	            insertar: {
	            	name: 'Asignar orden de trabajo',
	            	icon: 'user',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.insertar == 'function' ?
	        				opt.table.actions.insertar( index ):
	        				console.log( 'function insertar is null' );
	        		}
	            },

	            materiales: {
	            	name: 'Materiales',
	            	icon: 'add',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.materiales == 'function' ?
	        				opt.table.actions.materiales( index ):
	        				console.log( 'function materiales is null' );
	        		}
	            },

	            eliminar: {
	            	name: 'Eliminar programación',
	            	icon: 'delete',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.eliminar == 'function' ?
	        				opt.table.actions.eliminar( index ):
	        				console.log( 'function eliminar is null' );
	        		}
	            }

	          //   programacion: {
	          //   	name: 'Ver programación de mantenimiento',
	          //   	icon: 'copy',
	        		// callback: function ( key, _opt ) {
	        		// 	var index = $( this ).attr( 'table-index' );
	        		// 	typeof opt.table.actions.programacion == 'function' ?
	        		// 		opt.table.actions.programacion( index ):
	        		// 		console.log( 'function programacion is null' );
	        		// }
	          //   }
			};

			$( tabla.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		IDS = {
			idTabla: '#tabla_registro_mantto' + suf,
			form: '#formRegistroMantto' + suf
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

	documentoVistaPreliminar: function ( suf ) {
		// ---------- ID de los botones

		var

		suf = suf || '',

		html =
			'<form class="form-horizontal" role="form">' +
				'<div id="div-grafica-' + suf + '" class="text-center" > <h4> CARGANDO DATOS... </h4></div> <br><br>' +
				'<div class="form-group">' +
					'<div class="col-sm-2 control-label"></div>' +
					'<p class="col-sm-9">' +
							'<button id="btn-guardar-programacion-mtto-' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Autorizar Ordenes</button>' +
					'</p>' +
				'</div>' +
			'</form>',

		doc = {
			html: html,
			IDS: {
				botonGuardar: '#btn-guardar-programacion-mtto-' + suf,
				grafica: '#div-grafica-' + suf
			}
		};

		return doc;
	},

	documentAddUser: function( opt ) {
		/* obj
		 * suf
		 * arr_user
		 */

		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var
			html =
				'<form id="formAgregarUsuarios" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Trabajador Responsable: </label>' +
						'<div class="col-sm-7">' +
							'<select name="responsable" id="usuarioResponsable' + suf + '" type="text" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Trabajador Auxiliar: </label>' +
						'<div id="divUsuarioAuxiliar' + suf + '" class="col-sm-7"></div>'+
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 control-label"></div>' +
						'<p class="col-sm-9">' +
							'<button id="btnAgregarUsuarios' + suf + '" type = "submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Agregar</button> ' +
							'<button id="btnLimpiarUsuarios' + suf + '" type = "reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>',

			change_check = function ( state, value, $elem )
			{
				if ( value == $( doc.datos.responsable.idHTML ).val() )
				{
					if ( state === true )
					{
						doc.IDS.$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
						sigesop.msg( 'Info', 'El usuario auxiliar debe ser distinto al usuario responsable', 'info' );
					}

					else
						doc.IDS.$form.formValidation( 'revalidateField', 'responsable' );
				}
			},

			tabla = sigesop.tabla({
				head: {
					campo: 'RPE, NOMBRE, APELLIDOS',
					checkAll: false
				},
				body: {
					campo: 'RDE_trabajador, nombre_trabajador, apellidos_trabajador',
					campoValor: 'nombre_usuario',
					callback: change_check,
					disabled: {
						campo: 'nombre_usuario',
						campoValor: window.localStorage.usuario
					}
				},
				tipo: 'checkbox'
			}),

			update_user = function ( arr ) {
				var doc = this;
				sigesop.combo({
					arr: arr,
					elem: doc.datos.responsable.idHTML,
					campo: 'nombre_trabajador, apellidos_trabajador',
					campoValor: 'nombre_usuario',
					del: ' '
				});

				tabla.update_table( arr );
				// update_auxiliar.call( doc, arr );
			},

			/* verifica que exista al menos un elemento valido
			 * dentro de un arreglo de datos
			 */
			check_arr = function ( arr ) {
				var
					i = 0,
					lon = arr.length;

				for ( i ; i < lon ; i++ )
					if ( arr[ i ].valor !== null ) return true;

				return false;
			},

			javascript = function () {
				var
				doc = this,
				form = doc.IDS.form,
				$responsable = $( doc.datos.responsable.idHTML ),
				$form = $( form ).formValidation({
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },

			        onSuccess: function ( e ) {
			        	e.preventDefault();

			        	/* verificamos que la matriz [mtz_auxiliar] tenga seleccionado
			        	 * por lo menos a un elemento
			        	 */
			        	if ( check_arr( doc.IDS.mtz_auxiliar ) )
			        	{
				        	typeof opt.success == 'function' ?
				        		opt.success( doc.datos, doc.IDS, limpiarCampos ) :
				        		console.log( 'success is null' );
				        }

				        else
				        sigesop.msg( 'Advertencia', 'Seleccione usuario auxiliar', 'warning' );
			        },

			        onError: function ( e ) {
			        	e.preventDefault();
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );
			        },

			        fields: {
			            responsable: {
			                validators: {
			                    notEmpty: {
			                        message: 'Campo requerido'
			                    }
			                }
			            }
			        }
				})
				.on( 'success.field.fv', function( e, data ) {
					data.fv.disableSubmitButtons( false );
				});

				doc.IDS.$form = $form;

				document.getElementById( doc.IDS.divUsuarioAuxiliar.flushChar('#') )
				.innerHTML = tabla.html;
				doc.IDS.mtz_auxiliar = tabla.matrizInput;

				$responsable.on( 'success.field.fv', function ( event ) {
					var val_this = $responsable.val();

					if ( val_this == window.localStorage.usuario )
					{
						$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
						sigesop.msg( 'Info', 'El usuario responsable debe ser distinto al usuario supervisor', 'info' );
					}
					else
					{
						/* si seleccionamos a un usuario responsable valido entonces
						 * buscamos si el usuario responsable no ha sido seleccionado
						 * como usuario auxiliar
						 */

						var
							i = 0,
							lon = doc.IDS.mtz_auxiliar.length;

						for ( i ; i < lon ; i++ )
						{
							var
								// val_this = $responsable.val(),
								val_mtz = doc.IDS.mtz_auxiliar[ i ].valor;

	 						if ( val_this == val_mtz )
							{
								$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
								sigesop.msg( 'Info', 'El usuario responsable debe ser distinto al usuario auxiliar', 'info' );
							}
						}
					}
				});

				$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
			},

			limpiarCampos = function ()
			{
				$( doc.datos.responsable.idHTML ).val( '' );
				vaciarDatos();
			},

			vaciarDatos = function ()
			{
				doc.datos.supervisor.valor = null;
				doc.datos.responsable.valor = null;
				doc.datos.auxiliar.length = 0;
				tabla.reset();
				doc.IDS.$form.formValidation( 'resetForm' );
			},

			datos = {
				supervisor:{ valor: null },
				responsable: {
					valor: null,
					idHTML: '#usuarioResponsable' + suf
				},
				auxiliar: []
			},

			IDS = {
				botonGuardar: '#btnAgregarUsuarios' + suf,
				botonLimpiar: '#btnLimpiarUsuarios' + suf,
				form: '#formAgregarUsuarios' + suf,
				$form: null,
				divUsuarioAuxiliar: '#divUsuarioAuxiliar' + suf,
				mtz_auxiliar: []
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: IDS,
				update_user: update_user
			};

		return doc;
	},

	documentMateriales: function ( opt ) {
		var

		suf = opt.suf || '',

		table = sigesop.tablaRegistro({
			suf: 'materiales-actuales',
			head: 'CÓDIGO MATERIAL, DESCRIPCIÓN, TIPO, CANTIDAD',
			campo: 'codigo_material, descripcion_material, tipo_material, cantidad'
		}),

		html =
			'<form id="form-agregar-materiales-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="panel panel-success">' +
					'<div class="panel-heading">Agregar Materiales</div><br>' +

					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Material: </label>' +
						'<div class="col-sm-7">' +
							'<select name="codigo_material" id="agregar-codigo-material-' + suf + '" type="text" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Cantidad: </label>' +
						'<div class="col-sm-3">' +
							'<input name="cantidad" id="cantiad-materiales-' + suf + '" class="form-control" >' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 control-label"></div>' +
						'<p class="col-sm-9">' +
							'<button id="btn-guardar-materiales-' + suf + '" type = "submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span>Guardar</button> ' +
							'<button id="btn-limpiar-materiales-' + suf + '" type = "reset"  class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label for="" class="control-label col-sm-3">Materiales Registrados: </label>' +
					'<div class="col-sm-7">' + table.html + '</div>'+
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			datos = this.datos,
			form = this.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$codigo_material = $( datos.codigo_material.idHTML ),
			$cantidad = $( datos.cantidad.idHTML ),
			$form = $( form )
			.formValidation({
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
		        	codigo_material: {
		            	onSuccess: function ( e, data ) {
		            		datos.codigo_material.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.codigo_material.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.codigo_material.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },

		            cantidad: {
		            	onSuccess: function ( e, data ) {
		            		datos.cantidad.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.cantidad.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.cantidad.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                    	message: 'Sólo números enteros'
		                    }
		                }
		            }
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			/* Enlazar publicamente instancias jQuery de los campos
			 */
			doc.IDS.$form = $form;
			doc.IDS.$botonLimpiar = $botonLimpiar;
			doc.IDS.$codigo_material = $codigo_material;
			doc.IDS.$cantidad = $cantidad;

			$cantidad.spinner({
				spin: function (event, ui) {
					if ( $.isNumeric( ui.value ) ) {
						if ( ui.value <= 0 ) {
							$cantidad.spinner( 'value' , 1 );
							return false;
						}
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad' );
				}
			});

			$botonLimpiar.on( 'click', function ( e ) {
				vaciarDatos.call( doc );
			});

			/* Añadir menú contextual a la tabla de materiales
			 * registrados
			 */
			var
			items = {
	            eliminar: {
	            	name: 'Eliminar',
	            	icon: 'delete',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.eliminar == 'function' ?
	        				opt.table.actions.eliminar( index ):
	        				console.log( 'function eliminar is null' );
	        		}
	            }
			};

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		vaciarDatos = function () {
			var
			datos = this.datos,
			$form = this.IDS.$form;

			datos.codigo_material.valor = null;
			datos.cantidad.valor = null;

			$form.formValidation( 'resetForm' );
		},

		limpiarCampos = function () {
			var
			IDS = this.IDS,
			doc = this;

			IDS.$codigo_material.val('');
			IDS.$cantidad.val('');

			vaciarDatos.call( doc );
		},

		datos = {
			id_orden_trabajo: { valor: null },

			codigo_material: {
				valor: null,
				idHTML: '#agregar-codigo-material-' + suf
			},

			cantidad: {
				valor: null,
				idHTML: '#cantiad-materiales-' + suf
			}
		},

		IDS = {
			botonGuardar: '#btn-guardar-materiales-' + suf,
			botonLimpiar: '#btn-limpiar-materiales-' + suf,
			form: '#form-agregar-materiales-' + suf,

			$form: null,
			$codigo_material: null,
			$cantidad: null
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			update_table: table.update_table
		};

		return doc;
	},

	// --------------------------------------------------------------

	/**
	 * Json como parametro con las siguientes propiedades
	 * @param {String} fechaInicial
	 * @param {String} fechaFinal
	 * @param {Int} duracion
	 * @param {String} mangnitudDuracion
	 * @param {Int} frecuencia
	 * @param {String} mangnitudFrecuencia
	 */
	calculaPeriodoMantenimiento: function ( opt ) {
		var
		inicio = moment( opt.fechaInicial, 'DD-MM-YYYY' ),
		fin = moment( opt.fechaFinal, 'DD-MM-YYYY' );

		if ( !inicio.isValid || !fin.isValid )
		throw new Error( '[calculaPeriodoMantenimiento] fechas invalidas' );

		var
		ff = fin, // fecha final del periodo
		fr_i = moment( opt.fechaInicial, 'DD-MM-YYYY' ), // fecha recorrido inicial
		fr_f = moment( opt.fechaInicial, 'DD-MM-YYYY' ), // fecha recorrido final
		fechas = [];

		do {
			fr_f.add( opt.duracion, opt.magnitudDuracion );
			// console.log( 'fr_i: ' + fr_i.format( 'DD-MM-YYYY' ) );
			// console.log( 'fr_f: ' + fr_f.format( 'DD-MM-YYYY' ) );
			// console.log( 'ff: ' + ff.format( 'DD-MM-YYYY' ) );

			if ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) ) {
				fechas.push( {
					from: fr_i.utc().valueOf(),
					to: fr_f.utc().valueOf()
				} ) ;

				fr_f.add( opt.frecuencia, opt.magnitudFrecuencia );
				fr_i.add( opt.duracion, opt.magnitudDuracion ).add( opt.frecuencia, opt.magnitudFrecuencia );
			}

			// console.log( 'fr_i recorrido: ' + fr_i.format( 'DD-MM-YYYY' ) );
			// console.log( '\n' );
		}
		while ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) );

		return fechas;
	},

	estructuraDatosOrdenTrabajo: function ( array ) {
		if ( !jQuery.isEmptyObject( array ) )
		{
			jQuery.each( data, function( i, unidad )
			{
				var numeroUnidad = unidad.numeroUnidad,
					matrizAeros = unidad.matrizAeros;

				jQuery.each( matrizAeros, function( j, aero )
				{
					var numeroAero = aero.numeroAero,
					 	seriesTipoMantto = aero.seriesTipoMantto;

				 	jQuery.each( seriesTipoMantto, function( k, tipoMantto )
				 	{
				 		var nombreTipoMantto = tipoMantto.tipoMantto,
				 			matrizDatosOrden = tipoMantto.datos;
							frecuencia = tipoMantto.frecuencia,
				 			magnitudFrecuencia = tipoMantto.magnitudFrecuencia;

				 		jQuery.each( matrizDatosOrden, function( l, datos )
				 		{
				 			var numeroOrden = datos.numero_orden,
				 				duracion = datos.duracion,
				 				magnitudDuracion = datos.magnitud_duracion,
				 				fechaProgramada = datos.fecha_programada,
				 				fechaReprogramada = datos.fecha_reprogramada,
				 				fechaRelizada = datos.fecha_realizada;

								var objFechaInicio = moment(fechaProgramada);
									diaFechaInicio = moment(fechaProgramada).date();
									mesFechaInicio = objFechaInicio.month(),
									anioFechaInicio = objFechaInicio.year();

								// var	objFechaFinal = sigesop.mantenimiento.propiedadesFecha( fechaFinal ),
								// 	diaFechaFinal = objFechaFinal.numeroDia,
								// 	mesFechaFinal = objFechaFinal.numeroMes,
								// 	anioFechaFinal = objFechaFinal.numeroAnio;

								// var ordenTrabajo = {
								// 	name: nombre,
								// 	color: color,
								// 	intervals: [{ // From-To pairs
								// 	    from: Date.UTC(anioFechaInicio, (mesFechaInicio-1), diaFechaInicio),
								// 	    to: Date.UTC(anioFechaFinal, ( mesFechaFinal-1 ), diaFechaFinal),
								// 	    label: label
								// 	}]
								// }

				 		});
				 	});
				});

				// tasks.push( ordenTrabajo );
			});
		}
		else console.log( 'Matriz Orden de trabajo vacia' );
	},

	formatoFechaServidor: function ( arr ) {
		var r = [];
		for( var i in arr )
		{
			var from = moment( parseInt( arr[ i ].from ) ).format( 'DD-MM-YYYY' ),
				to = moment( parseInt( arr[ i ].to ) ).format( 'DD-MM-YYYY' );

			r.push({
				from: from,
				to: to
			});
		}

		return r;
	},

	graficaMantenimiento: function ( data, idHTML ) {
		if ( $.isEmptyObject( data ) )
		throw new Error( 'datos de grafica nulos' );

		if ( !Highcharts ) throw new Error('Libreria Highcharts es indefinida');

        var
        tasks = data,
        // re-structure the tasks into line seriesvar series = [];
        series = [];

        jQuery.each( tasks.reverse(), function ( i, task ) {
            var item = {
                color: task.colorGrafica,
                name: task.nombre,
                data: []
            };

            jQuery.each( task.intervalos, function ( j, interval ) {
                item.data.push({
                    x: interval.from,
                    y: i,
                    label: interval.label,
                    from: interval.from,
                    to: interval.to
                }, {
                    x: interval.to,
                    y: i,
                    from: interval.from,
                    to: interval.to
                });

                // add a null value between intervalos
                if ( task.intervalos[ j + 1 ] ) {
                    item.data.push(
                        [ ( interval.to + task.intervalos[ j + 1 ].from ) / 2, null ]
                    );
                }
            });

            series.push( item );
        });

        // creamos la grafica
        $( idHTML ).highcharts({

            chart: {
                // renderTo: idHTML
                // width: null
            },

            title: {
                text: 'Programa de Mantenimiento'
            },

            subtitle: {
                text: 'Central eoloeléctrica La Venta'
            },

            xAxis: {
                type: 'datetime'
            },

            yAxis: {
                tickInterval: 1,
                labels: {
                    formatter: function() {
                        if (tasks[this.value]) {
                            return tasks[this.value].nombre;
                        }
                    }
                },
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: 'Aerogeneradores - Tipo Mantenimiento'
                },
                minPadding: 0.2,
                maxPadding: 0.2
            },

            legend: {
                enabled: false
            },

            tooltip: {
                formatter: function() {
                    return '<b>'+ tasks[this.y].nombre + '</b><br/>' +
                        Highcharts.dateFormat('%d %B %Y', this.point.options.from)  +
                        ' - ' + Highcharts.dateFormat('%d %B %Y', this.point.options.to);
                }
            },

            plotOptions: {
                line: {
                    lineWidth: 9,
                    marker: {
                        enabled: false
                    },
                    dataLabels: {
                        enabled: true,
                        align: 'left',
                        formatter: function() {
                            return this.point.options && this.point.options.label;
                        }
                    }
                },

                series: {
                    animation: {
                        duration: 3000
                    },
                    turboThreshold: 10000
                }
            },

            series: series
        });
	}
};