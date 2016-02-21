/* Cache de datos
 * window.sesion.lista_verificacion
 */

/* Verificando dependencias
 */
if ( !BootstrapDialog )
throw new Error('dependencia [BootstrapDialog] es indefinida');

sigesop.listaVerificacion = {
	document: function ( opt ) {
		/*
		 * suf
		 * obj
		 * view -> [ undefined || update || addActivity ]
		 */

		var

		that = this,

		struct_document = function ( view ) {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/
			IDS.$id_mantenimiento = $( '<select></select>' )
				.prop({
					'name'       : 'id_mantenimiento'
				})
				.addClass( 'form-control input-md' );

			IDS.$lista_verificacion = $( '<textarea></textarea>' )
				.prop({
					'name': 'lista_verificacion',
					'placeholder': 'Ingrese descripcion de la lista de verificación',
				})
				.addClass( 'form-control input-md' )
				.toUpperCase();

			IDS.$tableContainer = $( '<div></div>' )
				.addClass( 'col-sm-offset-3 col-sm-7' );

			IDS.$botonActividad = $( '<button></button>' )
				.prop({
					'type': 'button'
				})
				.addClass( 'btn btn-info' )
				.append( '&nbsp;<span class="glyphicon glyphicon-plus"></span>' )

			var $botonGuardar = $( '<button>Guardar</button>' )
				.prop({
					// 'id': 'btn-guardar-user-' + suf,
					'type': 'submit'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonLimpiar = $( '<button>Limpiar Campos</button>' )
				.prop({
					'type': 'reset'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

			/* Estructuring document form
			 */
			IDS.$form = $( '<form></form>' )
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' );

			switch( view ) {
				case 'update':
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Tipo Mantenimiento:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$id_mantenimiento )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Descripción:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$lista_verificacion )
							)
					)
					break;

				case 'addActivity':
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( IDS.$tableContainer )
							.append(
								$( '<p class="col-sm-2"></p>' ).append( IDS.$botonActividad )
							)
					);
					break;

				default:
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Tipo Mantenimiento:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$id_mantenimiento )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Descripción:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$lista_verificacion )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( IDS.$tableContainer )
							.append(
								$( '<p class="col-sm-2"></p>' ).append( IDS.$botonActividad )
							)
					);
					break;
			}

			IDS.$form.append(
				$( '<div class="form-group"></div>' )
					.append(
						$( '<div class="col-sm-offset-3 col-sm-7"></div>' )
							.append( $botonGuardar )
							.append( '&nbsp;' )
							.append( IDS.$botonLimpiar )
					)
			)
		},

		cleanFields = function () {
			var doc = this, IDS = this.IDS;

			IDS.$id_mantenimiento.val( '' );
			IDS.$lista_verificacion.val( '' );

			emptyData.call( doc );
		},

		emptyData = function () {
			this.datos.id_mantenimiento.valor = null;
			this.datos.lista_verificacion.valor = null;
			this.datos.actividad_verificar.length = 0;

			this.table.reset_table();
			this.IDS.$form.formValidation( 'resetForm' );
		},

		drop_activity = function ( index, update_table ) {
			this.splice( index, 1 );
			update_table( this );
		},

		edit_activity = function ( index ) {
			var
			activity = $.extend( true, {}, this[ index ] ),

			success = function ( data ) {
				doc.datos.actividad_verificar.splice( index, 1, data );
				doc.table.update_table( doc.datos.actividad_verificar );
				win.close();
			},

			edit = $.fn.newActivity({
				obj: activity,
				view: 'update',
				success: success
			})
			.factory(),

			win = BootstrapDialog.show({
			    title: 'Editar actividad',
			    type: BootstrapDialog.TYPE_DEFAULT,
			    onshown: function ( dialog ) {
			    	dialog.$modalBody.html( edit.IDS.$form )
			    },
			    size: BootstrapDialog.SIZE_WIDE,
			    closable: false,
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

		javascript = function() {
			var doc   = this,
				datos = this.datos,
				IDS   = this.IDS;

			IDS.$form.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e, data ) {
		        	e.preventDefault();
		        	/* Si no es edicion de lista
		        	 * de verificacion no validamos las actividades
		        	 */

					switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
						case 'update':
				        	typeof opt.success == 'function' ?
				        		opt.success( datos, IDS, cleanFields = cleanFields.bind( doc ) ) :
				        		console.log( 'success is null' );
							break;

						case 'addActivity':
						default:
			        		// verificamos que existan actividades agregadas

				        	if ( !$.isEmptyObject( doc.datos.actividad_verificar ) ) {
					        	typeof opt.success == 'function' ?
					        		opt.success( doc.datos, doc.IDS, cleanFields = cleanFields.bind( doc ) ) :
					        		console.log( 'success is null' );
					        }
					        else
					        	sigesop.msg( 'Info', 'No se han agregado actividades' );
							break;
					};
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
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
		            lista_verificacion: {
		            	onSuccess: function ( e, data ) {		            		
		            		datos.lista_verificacion.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.lista_verificacion.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.lista_verificacion.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	max: 100,
		                    	message: 'Máximo 100 caracteres'
		                    },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                        message: 'Caracteres inválidos'
		                    }
		                }
		            },
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			})
			.on( 'err.fields.fv', function ( event ) {
				data.fv.disableSubmitButtons( false );
			});

			IDS.$botonLimpiar.on( 'click', function ( event ) { emptyData.call( doc ); });

			/* Run diferents actions for document
			 */
			switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
				case 'update': // Update data
					if ( typeof opt.obj === 'undefined' && $.isEmptyObject( opt.obj ) )
						throw new Error( 'Error update function: property [obj] is required' );

					updateObj.call( doc, opt.obj );
					break;

				case 'addActivity':
				default:
					addActivity.call( doc );
					break;
			};
		},

		addActivity = function () {
			var doc   = this,
				IDS   = this.IDS,
				datos = this.datos;

			/* tabla de registro de las actividades
			 */
			var	table = IDS.$tableContainer.dataTable({
				head       : 'ACTIVIDAD',
				campo      : "actividad_verificar.valor",
				color_fila : 'success',
				contextMenu: {
					selector: 'tr',
					items: {
			            editar: {
			            	name: 'Editar',
			            	icon: 'edit',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).attr( 'table-index' );
			        			edit_activity.call( datos.actividad_verificar, index )
			        		}
			            },
			            eliminar: {
			            	name: 'Eliminar',
			            	icon: 'delete',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).attr( 'table-index' );
			        			drop_activity.call( datos.actividad_verificar, index, table.update_table );
			        		}
			            }
					}
				}
			})
			.factory();

			this.table.update_table = table.update_table; // enlazamos el enlace de actualizar tabla de actividades
			this.table.reset_table  = table.reset_table;

			IDS.$botonActividad.on( 'click', function ( event ) {
				event.preventDefault();
				new_activity.call( doc );
			});
		},

		new_activity = function () {
			var

			datos = this.datos,
			IDS   = this.IDS,
			doc   = this,

			success = function ( data ) {
				datos.actividad_verificar.push( data );
				doc.table.update_table( datos.actividad_verificar );
				IDS.$form.formValidation( 'resetForm' ); // habilitamos boton success al agregar una nueva actividad
				win.close();
			},

			activity = $.fn.newActivity({
				error: sigesop.completeCampos,
				success: success
			})
			.factory(),

			win = BootstrapDialog.show({
			    title: 'Nueva actividad',
			    type: BootstrapDialog.TYPE_DEFAULT,
			    onshown: function ( dialog ) {
			    	dialog.$modalBody.html( activity.IDS.$form );
			    },
			    size: BootstrapDialog.SIZE_WIDE,
			    closable: false,
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

		updateObj = function ( obj ){
			var IDS = this.IDS;

			this.datos.id_lista_verificacion_update = {
				valor: obj.id_lista_verificacion
			};

			sigesop.query ({
				class: 'listaVerificacion',
				query: 'obtenerTipoMantenimiento',
				success: function ( data ) {
					window.sesion.matrizTipoMantto = data;
					IDS.$id_mantenimiento.combo({
						arr: data,
						campo: 'nombre_mantenimiento',
						campoValor: 'id_mantenimiento'
					})
					.val( obj.id_mantenimiento );
				}
			});

			IDS.$lista_verificacion
			.val( obj.lista_verificacion );
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this, opt.view );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			return this;
		},

		datos = {
			id_mantenimiento            : { valor: null	},
			lista_verificacion          : { valor: null },
			// id_lista_verificacion_update: { valor: null },
			actividad_verificar         : []
		},

		IDS = {
			$form              : null,
			$id_mantenimiento  : null,
			$lista_verificacion: null,
			$tableContainer    : null,
			$botonActividad    : null,
			$botonLimpiar      : null
		},

		doc = {
			datos: datos,
			IDS  : IDS,
			table: {
				update_table: null,
				reset_table : null
			}
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	activity: function ( opt ) {
		var

		that = this,

		struct_document = function ( view ) {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/
			IDS.$id_sistema_aero = $( '<select></select>' )
				.prop({
					'name'       : 'id_sistema_aero'
				})
				.addClass( 'form-control input-md' );

			IDS.$id_equipo_aero = $( '<select></select>' )
				.prop({
					'name'       : 'id_equipo_aero'
				})
				.addClass( 'form-control input-md' );

			IDS.$actividad_verificar = $( '<textarea></textarea>' )
				.prop({
					'name': 'actividad_verificar',
					'placeholder': 'Ingrese descripción de la actividad',
				})
				.addClass( 'form-control input-md' )
				.toUpperCase();

			IDS.$tipo_actividad = $( '<input/>' )
				.prop({
					'name': 'tipo_actividad',
					'type': 'checkbox'
				});

			IDS.$tipo_parametro_aceptacion = $( '<select></select>' )
				.prop({
					'name': 'tipo_parametro_aceptacion'
				})
				.addClass( 'form-control input-md' )
				.append( '<option value="">' + sigesop.seleccioneOpcion + '</option>' )
				.append( '<option value="TEXTO">TEXTO</option>' )
				.append( '<option value="COMPARACION">COMPARACION</option>' )
				.append( '<option value="RANGO">RANGO</option>' )
				.append( '<option value="TOLERANCIA">TOLERANCIA</option>' );

			IDS.$tipo_lectura_actual = $( '<select></select>' )
				.prop({
					'name'    : 'tipo_lectura_actual',
					'disabled': true
				})
				.addClass( 'form-control input-md' );

			IDS.$tipo_lectura_posterior = $( '<select></select>' )
				.prop({
					'name'    : 'tipo_lectura_posterior',
					'disabled': true
				})
				.addClass( 'form-control input-md' );

			IDS.$botonGuardar = $( '<button></button>' )
				.html( 'Guardar' )
				.prop({
					'type': 'submit'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonLimpiar = $( '<button></button>' )
				.html( 'Reiniciar Actividad' )
				.prop({
					'type': 'reset'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

			/* Estructuring document form
			 */
			IDS.$form = $( '<form></form>' )
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' );

			switch( view ) {
				case 'editar_parametros':
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Parámetro de Aceptación:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_parametro_aceptacion )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Lectura actual:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_lectura_actual )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Lectura posterior:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_lectura_posterior )
							)
					)
					break;

				case 'update_activity':
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Actividad:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$actividad_verificar )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Actividad crítica:</label>' )
						.append(
							$( '<div class="col-sm-1"></div>' )
							.append(
								$( '<label class="radio-inline"></label>' )
								.append( IDS.$tipo_actividad )
							)
						)
					)
					break;

				default:
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Sistema:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$id_sistema_aero )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Equipo:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$id_equipo_aero )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Actividad:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$actividad_verificar )
						)
					)
					.append(
						$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Actividad crítica:</label>' )
						.append(
							$( '<div class="col-sm-1"></div>' )
							.append(
								$( '<label class="radio-inline"></label>' )
								.append( IDS.$tipo_actividad )
							)
						)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Parámetro de Aceptación:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_parametro_aceptacion )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Lectura actual:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_lectura_actual )
							)
					)
					.append(
						$( '<div class="form-group"></div>' )
							.append( '<label class="col-sm-3 control-label">Lectura posterior:</label>' )
							.append(
								$( '<div class="col-sm-7"></div>' ).append( IDS.$tipo_lectura_posterior )
							)
					)
					break;
			}

			IDS.$form.append(
				$( '<div class="form-group"></div>' )
					.append(
						$( '<div class="col-sm-offset-3 col-sm-7"></div>' )
							.append( IDS.$botonGuardar )
							.append( '&nbsp;' )
							.append( IDS.$botonLimpiar )
					)
			)
		},

		drop_activity = function ( index, arr, update_table ) {
			arr.splice( index, 1 );
			update_table( arr );
		},

		error = function() { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); },

		combo_tipo_parametro = function ( tipo ) {
			switch ( tipo ) {
				case 'COMPARACION':
				case 'RANGO':
				case 'TOLERANCIA':
					return [ { string: 'DATOS', val: 'Datos' } ];
				break;
				case 'TEXTO':
					return [ { string: 'BINARIO', val: 'Binario' } ];
				break;
				default:
					throw ( 'function combo_tipo_parametro: variable [tipo], sin coincidencias' );
					return null;
				break;
			}
		},

		emptyData = function () {
			this.IDS.$form.formValidation( 'resetForm' );

			var datos = this.datos,
				IDS   = this.IDS;

			datos.id_sistema_aero.valor      = null;
			datos.id_equipo_aero.valor       = null;
			datos.actividad_verificar.valor  = null;

			datos.parametro_actividad.length = 0;
			datos.lectura_actual.length      = 0;
			datos.lectura_posterior.length   = 0;

			IDS.idsParametro.length          = 0;
			IDS.idsLecturaActual.length      = 0;
			IDS.idsLecturaPosterior.length   = 0;

			IDS.$tipo_lectura_actual.empty().prop( 'disabled' , true );
			IDS.$tipo_lectura_posterior.empty().prop( 'disabled' , true );
			IDS.$botonGuardar.prop( 'disabled' , true );
		},

		javascript = function () {
			var doc   = this,
				datos = this.datos,
				IDS   = this.IDS;

			IDS.$form.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
						case 'update': // Update data
						default:
				        	if ( $.isEmptyObject( doc.datos.parametro_actividad ) ) {
				        		sigesop.msg( 'Info', 'No se ha ingresado parametro de aceptación' );
				        		return false;
				        	}

				        	if ( $.isEmptyObject( doc.datos.lectura_actual ) ) {
				        		sigesop.msg( 'Info', 'No se ha ingresado lectura actual' );
				        		return false;
				        	}

				        	if ( $.isEmptyObject( doc.datos.lectura_posterior ) ) {
				        		sigesop.msg( 'Info', 'No se ha ingresado lectura posterior' );
				        		return false;
				        	}
							break;
						case 'update_activity':
					};

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
		            id_sistema_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_sistema_aero.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.id_sistema_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.id_sistema_aero.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            id_equipo_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_equipo_aero.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.id_equipo_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.id_equipo_aero.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            actividad_verificar: {
		            	onSuccess: function ( e, data ) {		            		
		            		datos.actividad_verificar.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.actividad_verificar.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.actividad_verificar.valor = null;
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
		            },
		            tipo_actividad: {
		            	validators: {
		            		callback: {
		            			callback: function ( value, validator ) {
		            				datos.tipo_actividad.valor =
		            					IDS.$tipo_actividad.prop('checked') === true ?
		            					'REQUERIDO' : 'N_REQUERIDO';

		            				return true;
		            			}
		            		}
		            	}
		            },
		            tipo_parametro_aceptacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            tipo_lectura_actual: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            tipo_lectura_posterior: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            }
		        }
			})
			.on( 'err.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			/* eventos
			 */
			IDS.$id_sistema_aero.change( function ( event ) {
				IDS.$id_equipo_aero.empty();
				IDS.$form.formValidation( 'revalidateField', 'id_equipo_aero' );

				var query = IDS.$id_sistema_aero.val();
				if( query ) {
					sigesop.query ({
						data: { valor: query },
						class: 'equiposGenerador',
						query: 'obtenerEquipoGeneradorPorSistema',
						success: function ( data ) {
							IDS.$id_equipo_aero.combo({
								arr: data,
								campo: 'nombre_equipo_aero',
								campoValor: 'id_equipo_aero'
							});
							IDS.$form.formValidation( 'revalidateField', 'id_equipo_aero' );
						}
					});
				}
			});

			IDS.$tipo_parametro_aceptacion.change( function ( event ) {
				/* removemos la validaciones previas
				 */
				IDS.$form.formValidation( 'resetField', 'tipo_lectura_actual' );
				IDS.$form.formValidation( 'resetField', 'tipo_lectura_posterior' );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * paramentro de aceptacion
				 */
				datos.parametro_actividad.length = 0;

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura actual
				 */
				datos.lectura_actual.length = 0;
				IDS.$tipo_lectura_actual.val( '' )
					.prop( 'disabled', true );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				datos.lectura_posterior.length = 0;
				IDS.$tipo_lectura_posterior.val( '' )
					.prop( 'disabled', true );

				IDS.$botonGuardar.prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = IDS.$tipo_parametro_aceptacion.val().toLowerCase();
				if ( !val ) return null;

				var

				success = function ( data ) {
					/* secuencia grafica del documento y reinicio de datos de la seccion
					 * paramentro de aceptacion
					 */
					datos.parametro_actividad.length = 0;
					datos.parametro_actividad        = data; // enlazamos datos con el documento actividad

					IDS.$tipo_lectura_actual.combo({
						arr       : combo_tipo_parametro( IDS.$tipo_parametro_aceptacion.val() ),
						campo     : 'string',
						campoValor: 'val'
					});

					IDS.$tipo_lectura_posterior.combo({
						arr       : combo_tipo_parametro( IDS.$tipo_parametro_aceptacion.val() ),
						campo     : 'string',
						campoValor: 'val'
					});

					IDS.$tipo_lectura_actual.prop( 'disabled', false );
					win.close();
				},

				obj = $.fn.parametroDocument({
					view   : val,
					error  : error,
					success: success
				})
				.factory(),

				win = BootstrapDialog.show({
				    title: 'Agregar parámetro de aceptación',
				    type: BootstrapDialog.TYPE_DEFAULT,
				    onshown: function ( dialog ) {
				    	dialog.$modalBody.html( obj.IDS.$content )
				    },
				    size: BootstrapDialog.SIZE_WIDE,
				    closable: false,
				    draggable: true,
				    buttons: [{
				        label: 'Cancelar',
				        cssClass: 'btn-danger',
				        action: function( dialog ) {
							IDS.$tipo_parametro_aceptacion.val('');
							IDS.$form.formValidation( 'revalidateField', 'tipo_parametro_aceptacion' );
				            dialog.close();
				        }
				    }]
				});
			});

			IDS.$tipo_lectura_actual.change( function ( event ) {
				/* removemos la validaciones previas
				 */
				IDS.$form.formValidation( 'resetField', 'tipo_lectura_posterior' );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura actual
				 */
				datos.lectura_actual.length = 0;

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				datos.lectura_posterior.length = 0;
				IDS.$tipo_lectura_posterior.val( '' )
					.prop( 'disabled', true );

				IDS.$botonGuardar.prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = IDS.$tipo_lectura_actual.val().toLowerCase();
				if ( !val ) return null;

				var

				success = function ( data ) {
					/* secuencia grafica del documento y reinicio de datos de la seccion
					 * paramentro de aceptacion
					 */
					datos.lectura_actual.length = 0;
					datos.lectura_actual = data; // enlazamos datos con el documento actividad
					IDS.$tipo_lectura_posterior.val('')
						.prop( 'disabled', false );
					win.close();
				},

				tipo_parametro = datos.parametro_actividad[ 0 ].tipo_dato,

				obj = $.fn.lecturaDocument({
					view          : val,
					success       : success,
					error         : error,
					tipo_parametro: tipo_parametro,
					numero_filas  : val == 'binario' ? null : datos.parametro_actividad.length
				})
				.factory(),

				win = BootstrapDialog.show({
				    title: 'Agregar lectura actual',
				    type: BootstrapDialog.TYPE_DEFAULT,
				    onshown: function ( dialog ) {
				    	dialog.$modalBody.html( obj.IDS.$form )
				    },
				    size: BootstrapDialog.SIZE_WIDE,
				    closable: false,
				    draggable: true,
				    buttons: [{
				        label: 'Cancelar',
				        cssClass: 'btn-danger',
				        action: function( dialog ) {
				        	IDS.$tipo_lectura_actual.val('');
							IDS.$form.formValidation( 'revalidateField', 'tipo_lectura_actual' );
				            dialog.close();
				        }
				    }]
				});
			});

			IDS.$tipo_lectura_posterior.change( function ( event ) {
				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				datos.lectura_posterior.length = 0;
				IDS.$botonGuardar.prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = IDS.$tipo_lectura_posterior.val().toLowerCase();
				if ( !val ) return null;

				var

				success = function ( data ) {
					/* secuencia grafica del documento y reinicio de datos de la seccion
					 * paramentro de aceptacion
					 */
					datos.lectura_posterior.length = 0;
					datos.lectura_posterior = data; // enlazamos datos con el documento actividad
					IDS.$botonGuardar.prop( 'disabled', false );
					win.close();
				},

				// obj = sigesop.listaVerificacion.__retornaFuncion( val,
				// 	{
				// 		suf           : 'post',
				// 		success       : success,
				// 		error         : error,
				// 		tipo_parametro: datos.lectura_actual[ 0 ].tipo_dato,
				// 		numero_filas  : datos.lectura_actual.length
				// 	}
				// ),

				obj = $.fn.lecturaDocument({
					view          : val,
					success       : success,
					error         : error,
					tipo_parametro: datos.lectura_actual[ 0 ].tipo_dato,
					numero_filas  : datos.lectura_actual.length
				})
				.factory(),

				win = BootstrapDialog.show({
				    title: 'Agregar lectura actual',
				    type: BootstrapDialog.TYPE_DEFAULT,
				    onshown: function ( dialog ) {
				    	dialog.$modalBody.html( obj.IDS.$form );
				    },
				    size: BootstrapDialog.SIZE_WIDE,
				    closable: false,
				    draggable: true,
				    buttons: [{
				        label: 'Cancelar',
				        cssClass: 'btn-danger',
				        action: function( dialog ) {
				        	IDS.$tipo_lectura_posterior.val('');
							IDS.$form.formValidation( 'revalidateField', 'tipo_lectura_posterior' );
				            dialog.close();
				        }
				    }]
				});
			});

			IDS.$botonLimpiar.on( 'click', function ( event ) { emptyData.call( doc ); });

			/* Run diferents actions for document
			 */
			switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
				case 'update': // Update data
					if ( typeof opt.obj === 'undefined' && $.isEmptyObject( opt.obj ) )
						throw new Error( 'Error update function: property [obj] is required' );

					updateObj.call( doc, opt.obj );
					break;

				case 'update_activity':
					if ( typeof opt.obj === 'undefined' && $.isEmptyObject( opt.obj ) )
						throw new Error( 'Error update function: property [obj] is required' );

					updateActivityObj.call( doc, opt.obj );
					break;

				default:
					sigesop.query ({
						class: 'sistemasGenerador',
						query: 'obtenerSistemas',
						success: function ( data ) {
							window.sesion.matrizSistemas = data;
							IDS.$id_sistema_aero.combo({
								arr: data,
								campo: 'nombre_sistema_aero',
								campoValor: 'id_sistema_aero'
							});
						}
					});
					break;
			};
		},

		updateObj = function ( obj ) {
			var datos = this.datos,
				IDS   = this.IDS;

			sigesop.query ({
				class: 'sistemasGenerador',
				query: 'obtenerSistemas',
				success: function ( data ) {
					window.sesion.matrizSistemas = data;
					IDS.$id_sistema_aero.combo({
						arr: data,
						campo: 'nombre_sistema_aero',
						campoValor: 'id_sistema_aero'
					});
					IDS.$id_sistema_aero.val( obj.id_sistema_aero.valor );
				}
			});

			sigesop.query ({
				data: { valor: obj.id_sistema_aero.valor },
				class: 'equiposGenerador',
				query: 'obtenerEquipoGeneradorPorSistema',
				success: function ( data ) {
					IDS.$id_equipo_aero.combo({
						arr: data,
						campo: 'nombre_equipo_aero',
						campoValor: 'id_equipo_aero'
					});
					IDS.$id_equipo_aero.val( obj.id_equipo_aero.valor );
				}
			});

			IDS.$actividad_verificar.val( obj.actividad_verificar.valor );

			IDS.$tipo_actividad.prop( 'checked', obj.tipo_actividad.valor == 'REQUERIDO' ? true : false );

			datos.parametro_actividad = obj.parametro_actividad;
			IDS.$tipo_parametro_aceptacion.val( datos.parametro_actividad[ 0 ].tipo_dato );

			datos.lectura_actual = obj.lectura_actual;
			IDS.$tipo_lectura_actual.combo({
				arr: combo_tipo_parametro( datos.parametro_actividad[ 0 ].tipo_dato ),
				campo: 'string',
				campoValor: 'val'
			})
			.val( datos.lectura_actual[ 0 ].tipo_dato )
			.prop( 'disabled', false );

			datos.lectura_posterior = obj.lectura_posterior;
			IDS.$tipo_lectura_posterior.combo({
				arr: combo_tipo_parametro( datos.parametro_actividad[ 0 ].tipo_dato ),
				campo: 'string',
				campoValor: 'val'
			})
			.val( datos.lectura_posterior[ 0 ].tipo_dato )
			.prop( 'disabled', false );
		},

		updateActivityObj = function ( obj ) {
			// copiamos ID para la actualizacion
			this.datos.id_actividad_verificar = {
				valor: obj.id_actividad_verificar
			};

			var IDS = this.IDS, datos = this.datos;

			IDS.$actividad_verificar.val( obj.actividad_verificar );

			IDS.$tipo_actividad.prop( 'checked', obj.tipo_actividad == 'REQUERIDO' ? true : false );
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this, opt.view );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			return this;
		},

		datos = {
			id_sistema_aero    : { valor: null },
			id_equipo_aero     : { valor: null },
			actividad_verificar: { valor: null },
			tipo_actividad     : { valor: null },

			parametro_actividad: [],
			lectura_actual     : [],
			lectura_posterior  : []
		},

		IDS = {
			$form              : null,

			idsParametro       : [],
			idsLecturaActual   : [],
			idsLecturaPosterior: []
		},

		doc = {
			datos: datos,
			IDS  : IDS
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	registro: function ( opt ) {
		var
		suf = opt.suf || '',

		html =
			'<form id="form-registro-lista-verificacion-' + suf + '">' +
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-12 col-md-12" id="tabla-registro-lista-verificacion-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			table = sigesop.tablaRegistro({
				head: 'LISTA DE VERIFICACION, TIPO MANTENIMIENTO, ACTIVIDADES REGISTRADAS',
				campo: "lista_verificacion, nombre_mantenimiento, num_actividades",
				suf: 'lista-verificacion'
			});

			doc.table.update_table = table.update_table; // enlazamos a vista publica
			doc.table.body = table.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + table.html;

			var items = {
	            actividades: {
	            	name: 'Ver actividades',
	            	icon: 'ok',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.actividades == 'function' ?
	        				opt.table.actions.actividades( index ):
	        				console.log('function actividades is null' );
	        		}
	            },

	            agregar: {
	            	name: 'Agregar actividades',
	            	icon: 'add',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.agregar == 'function' ?
	        				opt.table.actions.agregar( index ):
	        				console.log('function agregar is null' );
	        		}
	            },

	            editar: {
	            	name: 'Editar',
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.editar == 'function' ?
	        				opt.table.actions.editar( index ):
	        				console.log('function editar is null' );
	        		}
	            },

	            eliminar: {
	            	name: 'Eliminar',
	            	icon: 'delete',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.eliminar == 'function' ?
	        				opt.table.actions.eliminar( index ):
	        				console.log('function eliminar is null' );
	        		}
	            }
			}

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		IDS = {
			idTabla: '#tabla-registro-lista-verificacion-' + suf,
			form: '#form-registro-lista-verificacion-' + suf
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

	documentFiltro: function ( opt ) {
		/* obj
		 * suf
		 * arr_areaAcceso
		 * arr_permisoAcceso
		 * success
		 * error
		 */

		var
		suf = opt.suf || '',
		obj = opt.obj || {

			};

		var

		html =
			'<form id="form-filtro-lista-verificacion-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label for="" class="control-label col-sm-3">Listra de verificación: </label>' +
					'<div id="divListaVerificacion' + suf + '" class="col-sm-7"></div>'+
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-2 col-md-2 control-label"></div>' +
					'<p class="col-sm-9 col-md-9">' +
						'<button id="btn-consulta-reporte-' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir Reporte</button> ' +
						'<button id="botonLimpiar' + suf + '" type="reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button> ' +
						'</p>' +
				'</div>' +
			'</form>',


		tabla = sigesop.tabla({
			head: {
				campo: 'Lista verificación'
			},
			body: {
				campo: 'lista_verificacion',
				campoValor: 'id_lista_verificacion',
			},
			tipo: 'checkbox'
		}),

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
		        	if ( check_arr( doc.IDS.mtz_auxiliar ) ) {
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, doc.IDS, limpiarCampos ) :
			        		console.log( 'success is null' );
			        }

			        else
			        sigesop.msg( 'Advertencia', 'Seleccione una lista', 'warning' );
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

			document.getElementById( doc.IDS.divListaVerificacion.flushChar('#') )
			.innerHTML = tabla.html;
			doc.IDS.mtz_auxiliar = tabla.matrizInput;

			doc.update_table = tabla.update_table;

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
		},

		datos = {
			id_lista_verificacion: []
		},

		limpiarCampos = function () {
			$( doc.datos.responsable.idHTML ).val( '' );
			vaciarDatos();
		},

		vaciarDatos = function () {
			tabla.reset();
			doc.IDS.$form.formValidation( 'resetForm' );
		},

		IDS = {
			botonImprimir: '#btn-consulta-reporte-' + suf,
			botonLimpiar: '#botonLimpiar' + suf,
			form: '#form-filtro-lista-verificacion-' + suf,
			$form: null,
			divListaVerificacion: '#divListaVerificacion' + suf,
			mtz_auxiliar: []
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS
		};

		return doc;
	},

	/* parametro de aceptacion
	 */
	parametroDocument: function ( opt ) {
		/*
		 * view - by default [texto]
		 * error - optional
		 * success - optional
		 */

		var

		view = typeof opt.view !== 'undefined' ? opt.view : 'texto',

		that = this,

		numeroFilas = opt.numeroFilas,

		struct_document = function ( view ) {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/
			switch ( view ) {
				case 'comparacion':
				case 'rango':
				case 'tolerancia':
					IDS.$cantidad_binario = $( '<input/>' )
						.addClass( 'form-control input-md' )
						.prop({
							'name': 'cantidad_binario'
						});

					IDS.$botonAgregarCelda = $( '<button></button>' )
						.html( 'Crear campos' )
						.prop({
							'type': 'button'
						})
						.addClass( 'btn btn-primary' );

					IDS.$thead = $( '<thead></thead>' );

					// adding haeder for table
					switch ( view ) {
						case 'comparacion':
							IDS.$thead.html( '<tr><th>Descripción</th><th>Dato</th><th>Tipo de Dato</th></tr>' );
							break;
						case 'rango':
							IDS.$thead.html( '<tr><th>Descripción</th><th>Dato inferior</th><th>Dato superior</th><th>Tipo de Dato</th></tr>' );
							break;
						case 'tolerancia':
							IDS	.$thead.html(
								'<tr><th>Descripción</th><th>Dato</th>' +
								'<th>Tolerancia <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span></th>' +
								'<th>Tipo de Dato</th></tr>'
							);
							break;
					}

					IDS.$tbody = $( '<tbody></tbody>' );

					IDS.$table = $( '<table></table>' )
						.addClass( 'table table-bordered' )
						.html( IDS.$thead )
						.append( IDS.$tbody );
					break;

				default: // by default [texto]
					var $parametro_aceptacion = $( '<textarea></textarea>' )
						.prop({
							'name'       : 'parametro_aceptacion',
							'placeholder': 'VISUAL/AUDITIVO/TÁCTIL'
						})
						.addClass( 'form-control input-sm' )
						.toUpperCase();

					IDS.ids.push({
						$parametro: $parametro_aceptacion
					});
					break;
			};

			IDS.$botonGuardar = $( '<button></button>' )
				.html( 'Guardar' )
				.prop({
					'type': 'submit'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonLimpiar = $( '<button></button>' )
				.html( 'Reiniciar Campos' )
				.prop({
					'type': 'reset'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

			/* Estructuring document form
			 */
			IDS.$content = $( '<div></div>' )
				.addClass( 'panel container-fluid' );

			IDS.$form = $( '<form></form>' )
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' );

			/* Run diferents view for document
			 */
			switch ( view ) {
				case 'comparacion':
				case 'rango':
				case 'tolerancia':
					IDS.$content.append(
						$( '<div class="row"></div>' )
						.append( '<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>' )
						.append(
							$( '<div class="col-sm-2 col-md-2"></div>' )
							.append( IDS.$cantidad_binario )
						)
						.append(
							$( '<div class="col-sm-5 col-md-5"></div>' )
							.append( IDS.$botonAgregarCelda )
						)
					);

					IDS.$form.append(
						$( '<div class="form-group"></div>' )
						.append(
							$( '<div class="col-sm-offset-2 col-sm-9"></div>' )
							.append(
								$( '<div class="table-responsive"></div>' )
								.append( IDS.$table )
							)
						)
					)
					break;

				default: // by default [texto]
					IDS.$form.append(
						$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-2 control-label">Descripción:</label>' )
						.append(
							$( '<div class="col-sm-8"></div>' )
							.append( $parametro_aceptacion )
						)
					);
					break;
			};

			IDS.$form.append(
				$( '<div class="form-group"></div>' )
				.append(
					$( '<div class="col-sm-offset-2 col-sm-10"></div>' )
					.append( IDS.$botonGuardar )
					.append( '&nbsp;' )
					.append( IDS.$botonLimpiar )
				)
			);

			IDS.$content.append( '<br>' ).append( IDS.$form );
		},

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;

			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */
			var
				html   = '',
				i      = 0,
				lon    = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids
			IDS.$tbody.empty(); // vaciar tabla

			for ( i ; i < lon ; i++ ) {
				var $row       = $( '<tr></tr>' );

				var	$parametro = $( '<textarea></textarea>' )
					.prop({
						'name'       : 'parametro',
						'placeholder': 'Parámetro',
					})
					.addClass( 'form-control input-sm' )
					.toUpperCase();

				var	$unidad_medida = $( '<select></select>' )
					.addClass( 'form-control' )
					.prop({
						'name': 'unidad_medida',
					});

				$row.append(
					$( '<td class="col-sm-6"></td>' ).append( $parametro )
				)

				/* Run diferents view for document
				 */
				switch ( view ) {
					case 'comparacion':
						var $dato = $( '<textarea></textarea>' )
							.prop({
								'name'       : 'dato_comparacion',
								'placeholder': 'Dato comparativo',
							})
							.addClass( 'form-control input-sm' );

						$row.append(
							$( '<td class="col-sm-4"></td>' )
							.append( $dato )
						);

						IDS.ids.push({
							$parametro    : $parametro,
							$unidad_medida: $unidad_medida,
							$dato         : $dato
						});
						break;

					case 'rango':
						var $dato_inferior = $( '<input/>' )
							.prop({
								'name'       : 'dato_inferior',
								'placeholder': 'Dato inferior',
							})
							.addClass( 'form-control' );

						var	$dato_superior = $( '<input/>' )
							.prop({
								'name'       : 'dato_superior',
								'placeholder': 'Dato superior',
							})
							.addClass( 'form-control' );

						$row.append(
							$( '<td class="col-sm-2"></td>' )
							.append( $dato_inferior )
						)
						.append(
							$( '<td class="col-sm-2"></td>' )
							.append( $dato_superior )
						);

						IDS.ids.push({
							$parametro    : $parametro,
							$unidad_medida: $unidad_medida,
							$dato_inferior: $dato_inferior,
							$dato_superior: $dato_superior
						});
						break;

					case 'tolerancia':
						var $dato = $( '<input/>' )
							.prop({
								'name'       : 'dato',
								'placeholder': 'Dato',
							})
							.addClass( 'form-control' );

						var	$tolerancia_dato = $( '<input/>' )
							.prop({
								'name'       : 'tolerancia_dato',
								'placeholder': 'Tolerancia',
							})
							.addClass( 'form-control' );

						$row.append(
							$( '<td class="col-sm-2"></td>' )
							.append( $dato )
						)
						.append(
							$( '<td class="col-sm-2"></td>' )
							.append( $tolerancia_dato )
						);

						IDS.ids.push({
							$parametro      : $parametro,
							$unidad_medida  : $unidad_medida,
							$dato           : $dato,
							$tolerancia_dato: $tolerancia_dato
						});
						break;
				};

				$row.append(
					$( '<td class="col-sm-2"></td>' )
					.append( $unidad_medida )
				);

				IDS.$tbody.append( $row );
			}

			/* add validations
			 */
			IDS.$form.data( 'formValidation' )
			.addField( 'parametro', {
				row: 'td',
                validators: {
                    notEmpty: {
                        message: 'Campo requerido'
                    },
                    regexp: {
                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
                        message: 'Caracteres inválidos'
                    }
                }
			})
			.addField( 'unidad_medida', {
				row: 'td',
                validators: {
                    notEmpty: {
                        message: 'Campo requerido'
                    }
                }
			});

			var quant = {
				row: 'td',
                validators: {
                    notEmpty: {
                        message: 'Campo requerido'
                    },
                    numeric: {
                        message: 'Sólo números'
                    }
                }
			};

			switch ( view ) {
				case 'comparacion':
					IDS.$form.data( 'formValidation' )
					.addField( 'dato_comparacion', quant )
					break;

				case 'rango':
					IDS.$form.data( 'formValidation' )
					.addField( 'dato_inferior', quant )
					.addField( 'dato_superior', quant );
					break;

				case 'tolerancia':
					IDS.$form.data( 'formValidation' )
					.addField( 'dato', quant )
					.addField( 'tolerancia_dato', quant );
					break;
			}

			/* descargar los datos de tipo de unidad de medida
			 */
			sigesop.query({
				class: 'listaVerificacion',
				query: 'obtenerUnidadMedida',
				success: function ( data ) {
					window.sesion.matrizUnidadMedida = data;
					$.each( IDS.ids, function( index, row ) {
						row.$unidad_medida.combo({
							arr: data,
							campo: 'unidad_medida'
						});
					});
				}
			});
		},

		readData = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica
			var datos = this.datos;

			$.each( this.IDS.ids, function ( index, row ) {
				/* Run diferents view for document
				 */
				switch ( view ) {
					case 'comparacion':
						datos.push({
							tipo_dato    : 'COMPARACION',
							dato         : { valor: row.$dato.val().trim() },
							parametro    : { valor: row.$parametro.val().trim().toUpperCase() },
							unidad_medida: { valor: row.$unidad_medida.val().trim() }
						});
						break;

					case 'rango':
						datos.push({
							tipo_dato: 'RANGO',
							dato: {
								valor: 	row.$dato_inferior.val().trim()	+ ',' +
										row.$dato_superior.val().trim()
							},
							parametro    : { valor: row.$parametro.val().trim().toUpperCase() },
							unidad_medida: { valor: row.$unidad_medida.val().trim() }
						});
						break;

					case 'tolerancia':
						datos.push({
							tipo_dato: 'TOLERANCIA',
							dato: {
								valor: 	row.$dato.val().trim()	+ ',' +
										row.$tolerancia_dato.val().trim()
							},
							parametro    : { valor: row.$parametro.val().trim().toUpperCase() },
							unidad_medida: { valor: row.$unidad_medida.val().trim() }
						});
						break;

					default: // by default [texto]
						datos.push({
							tipo_dato    : 'TEXTO',
							parametro    : { valor: row.$parametro.val().trim().toUpperCase() },
							unidad_medida: { valor: 'N/A' }
						});
						break;
				};
			});
		},

		javascript = function () {
			var doc   = this,
				IDS   = this.IDS,
				datos = this.datos;

			IDS.$form.formValidation({
		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	readData.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin elementos de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        }
			})
			.on( 'success.field.fv', function ( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			IDS.$botonLimpiar.on( 'click', function ( e ) {
				datos.length = 0;
				IDS.$form.formValidation( 'resetForm' );
			});

			/* Adding validators and events if is necesary
			 */
			switch ( view ) {
				case 'comparacion':
				case 'rango':
				case 'tolerancia':
					IDS.$cantidad_binario.spinner({
						spin: function ( event, ui ) {
							if ( ui.value <= 0 ) {
								$( this ).spinner( 'value' , 1 );
								return false;
							}
						},
						change: function ( event, ui ) {
							IDS.$form.formValidation( 'revalidateField', 'cantidad_binario' );
						}
					});

					IDS.$botonAgregarCelda.on( 'click', function ( event ) {
						event.preventDefault();
						var valor = IDS.$cantidad_binario.val().trim();
						crearCeldas.call( doc, valor );
					});
					break;
				default: // by default [texto]
					IDS.$form.data( 'formValidation' )
					.addField( 'parametro_aceptacion', {
						selector: 'td',
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                        message: 'Caracteres inválidos'
		                    }
		                }
					});
					break;
			}
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this, view );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			return this;
		},

		IDS = {
			ids               : [],
			$form             : null,
			$cantidad_binario : null,
			$botonAgregarCelda: null,
			$tbody            : null,
			$table            : null,
			$botonGuardar     : null,
			$botonLimpiar     : null
		},

		doc = {
			datos: [],
			IDS: IDS
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	/* lectura actual y posterior
	 */
	lecturaDocument: function ( opt ) {
		/*
		 * view - by default [binario]
		 * error - optional
		 * success - optional
		 * tipo_parametro - requiere
		 */
		if( typeof opt.tipo_parametro === 'undefined' ) {
			throw ( 'function lecturaDocument: variable [opt.tipo_parametro] es indefinido' );
			return null;
		}

		var

		view = opt.view || 'binario',

		that = this,

		numero_filas = opt.numero_filas,

		struct_document = function ( view ) {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/

			IDS.$cantidad_binario = $( '<input/>' )
				.addClass( 'form-control input-md' )
				.prop({
					'name': 'cantidad_binario'
				});

			IDS.$botonAgregarCelda = $( '<button></button>' )
				.html( 'Guardar' )
				.prop({
					'type': 'button'
				})
				.addClass( 'btn btn-primary' );

			IDS.$tbody = $( '<tbody></tbody>' );

			IDS.$table = $( '<table></table>' )
				.addClass( 'table table-bordered' )

			IDS.$botonGuardar = $( '<button></button>' )
				.html( 'Guardar' )
				.prop({
					'type': 'submit'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonLimpiar = $( '<button></button>' )
				.html( 'Reiniciar Campos' )
				.prop({
					'type': 'button'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

			/* Estructuring document form
			 */
			IDS.$form = $( '<form></form>' )
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' )

				.append(
					$( '<div class="form-group"></div>' )
					.append( '<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>' )
					.append(
						$( '<div class="col-sm-2 col-md-2"></div>' )
						.append( IDS.$cantidad_binario )
					)
					.append(
						$( '<div class="col-sm-5 col-md-5"></div>' )
						.append( IDS.$botonAgregarCelda )
					)
				);

			/* Run diferents view for document
			 */
			switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
				case 'datos':
					IDS.$thead = $( '<thead></thead>' )
					.html( '<tr><th>Descripción</th><th>Dato</th><th>Tipo de Dato</th></tr>' );
					break;

				default: // by default [binario]
					IDS.$thead = $( '<thead></thead>' )
					.html( '<tr><th>Descripción</th><th>Dato</th></tr>' );
					break;
			};

			IDS.$form.append(
				$( '<div class="form-group"></div>' )
				.append(
					$( '<div class="col-sm-offset-2 col-sm-9"></div>' )
					.append(
						$( '<div class="table-responsive"></div>' )
						.append(
							IDS.$table
							.append( IDS.$thead )
							.append( IDS.$tbody )
						)

					)
				)
			)
			.append(
				$( '<div class="form-group"></div>' )
				.append(
					$( '<div class="col-sm-offset-2 col-sm-10"></div>' )
					.append( IDS.$botonGuardar )
					.append( '&nbsp;' )
					.append( IDS.$botonLimpiar )
				)
			)
		},

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;

			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */
			var
				html   = '',
				i      = 0,
				lon    = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids
			IDS.$tbody.empty(); // vaciar tabla

			for ( i ; i < lon ; i++ ) {
				var $row       = $( '<tr></tr>' ),
					$parametro = $( '<textarea></textarea>' )
					.prop({
						'name'       : 'parametro',
						'placeholder': 'Parámetro',
					})
					.addClass( 'form-control input-sm' )
					.toUpperCase();


				/* Run diferents view for document
				 */
				switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
					case 'datos':
						var $unidad_medida = $( '<select></select>' )
							.addClass( 'form-control' )
							.prop({
								'name': 'unidad_medida',
							})

						$row.append(
							$( '<td class="col-sm-6"></td>' ).append( $parametro )
						)
						.append(
							$( '<td class="col-sm-3"></td>' )
							.append( '<center><label class="control-label">Dato '+ ( parseInt( i ) + 1 ) +'</label></center>' )
						)
						.append(
							$( '<td class="col-sm-3"></td>' )
							.append( $unidad_medida )
						)

						IDS.ids.push({
							$parametro    : $parametro,
							$unidad_medida: $unidad_medida
						});
						break;

					default: // by default [binario]
						$row.append(
							$( '<td class="col-sm-6"></td>' ).append( $parametro )
						)
						.append(
							$( '<td class="col-sm-6"></td>' )
							.append(
								$( '<label class="radio-inline"></label>' )
								.append( '<input type="radio" class="input-sm" disabled /> SI' )
							)
							.append(
								$( '<label class="radio-inline"></label>' )
								.append( '<input type="radio" class="input-sm" disabled /> NO' )
							)
						);

						IDS.ids.push({
							$parametro: $parametro
						});
						break;
				};

				IDS.$tbody.append( $row );
			}

			/* add validations
			 */
			IDS.$form.data( 'formValidation' ).addField( 'parametro', {
				row: 'td',
                validators: {
                    notEmpty: {
                        message: 'Campo requerido'
                    },
                    regexp: {
                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
                        message: 'Caracteres inválidos'
                    }
                }
			});

			switch ( view ) {
				case 'datos':
					IDS.$form.data( 'formValidation' ).addField( 'unidad_medida', {
						row: 'td',
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
					});

					/* descargar los datos de tipo de unidad de medida
					 */
					sigesop.query({
						class: 'listaVerificacion',
						query: 'obtenerUnidadMedida',
						success: function ( data ) {
							window.sesion.matrizUnidadMedida = data;
							$.each( IDS.ids, function( index, row ) {
								row.$unidad_medida.combo({
									arr: data,
									campo: 'unidad_medida'
								});
							});
						}
					});
					break;
			};
		},

		cleanFields = function () {
			$.each( this.IDS.ids, function( index, row ) {
				/* Run diferents view for document
				 */
				switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
					case 'datos':
						row.$parametro.val('');
						row.$unidad_medida.val('');
						break;

					default: // by default [binario]
						row.$parametro.val('');
						break;
				};
			});

			this.datos.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );
		},

		readData = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var j   = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) {
				var row = this.IDS.ids[ j ];

				/* Run diferents view for document
				 */
				switch ( typeof opt.view !== 'undefined' ? opt.view : null ) {
					case 'datos':
						this.datos.push({
							tipo_dato: 'Datos',
							parametro: {
								valor: row.$parametro.val().trim().toUpperCase()
							},
							unidad_medida: {
								valor: row.$unidad_medida.val().trim()
							}
						});
						break;

					default: // by default [binario]
						this.datos.push({
							tipo_dato: 'Binario',
							parametro: {
								valor: row.$parametro.val().trim().toUpperCase()
							},
							unidad_medida: { valor: 'N/A' }
						});
						break;
				};
			}
		},

		javascript = function () {
			var doc   = this,
				IDS   = this.IDS,
				datos = this.datos;

			IDS.$form.formValidation({
		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	readData.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin elementos de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            cantidad_binario: {
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

			IDS.$cantidad_binario.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 )
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					IDS.$form.formValidation( 'revalidateField', 'cantidad_binario' );
				}
			});

			IDS.$botonAgregarCelda.on( 'click', function ( event ) {
				event.preventDefault();
				var valor = IDS.$cantidad_binario.val().trim();
				crearCeldas.call( doc, valor );
			});

			IDS.$botonLimpiar.on( 'click', function ( event ) { cleanFields.call( doc ); });

			/* asignamos el numero de filas provenientes de la cantidad de filas
			 * existentes en el parametro de aceptacion, en caso que sea indefinido
			 * o menor que 1, la variable toma el valor por defecto de la caja
			 */

			 var rows = parseInt( numero_filas );

			if ( (typeof numero_filas !== 'undefined')
				 && ( rows >= 1 ) )
			{
				/* si el tipo_parametro es [Datos] forzamos a que la lectura actual
				 * tenga el mismo numero de filas que la lectura posterior
				 * aunque solamente sea una fila
				 */
				switch ( view ) {
					case 'binario':
					case 'datos':
						IDS.$cantidad_binario.val( rows ).spinner( 'disable' );
						IDS.$botonAgregarCelda.prop( 'disabled', true );
						crearCeldas.call( doc, rows );
						break;
				}
			}
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this, view );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			return this;
		},

		IDS = {
			ids               : [],
			$form             : null,
			$cantidad_binario : null,
			$botonAgregarCelda: null,
			$tbody            : null,
			$table            : null,
			$botonGuardar     : null,
			$botonLimpiar     : null
		},

		doc = {
			datos: [],
			IDS: IDS
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	/* Objetos para edicion de listas de verificacion
	 */
	documentAcordion: function ( opt ){
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
		opt.arr = !$.isEmptyObject( opt.arr ) ? opt.arr : [];

		var

		struct_html = function ( arr ) {
			var
			html = '<div id="' + opt.name + '">' +  struct_accordion( arr ) +
			'</div>'

			return html;
		},

		struct_accordion = function ( arr ) {
			var html = '';
			if ( !$.isEmptyObject( arr ) ) {
				for( var i = 0, lon = arr.length; i < lon; i++ ) {
					html +=
					'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
					'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' ;
				}
			}

			return html;
		},

		javascript = function () {
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
						/* vaciar div
						 */
						// elem.innerHTML = '';
						ui.oldPanel.empty();

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
			html: struct_html( opt.arr ),
			javascript: javascript,
			update_accordion: function ( data ) {
				if ( !$.isEmptyObject( data ) ) {
					document.getElementById( opt.name )
					.innerHTML = struct_accordion( data );

					javascript();
				}
			},
			activate: opt.activate,
			datos: {},
			IDS: {
				id_accordion: '#' + opt.name
			}
		};

		return doc;
	}
}

$.extend( jQuery.fn, {
	'newListDocument'  : sigesop.listaVerificacion.document,
	'newActivity'      : sigesop.listaVerificacion.activity,
	'parametroDocument': sigesop.listaVerificacion.parametroDocument,
	'lecturaDocument'  : sigesop.listaVerificacion.lecturaDocument
});
