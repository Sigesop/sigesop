sigesop.usuarios = {
	newUserDocument: function ( opt ) {
		/* obj
		 * suf
		 * error
		 * success
		 * arr_areaTrabajo
		 * arr_roles
		 */
		var

		that = this,

		suf = sigesop.newId(),

		struct_document = function () {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/
			IDS.$nombreUsuario = $( '<input/>' )
				.prop({
					'id': 'nombre-usuario-' + suf,
					'name': 'nombreUsuario',
					'placeholder': 'De 1 – 50 caracteres. [A-Z][espacio en blanco]',
				})
				.addClass( 'form-control input-md' );

			IDS.$apellidosUsuario = $( '<input/>' )
				.prop({
					'id': 'apellido-usuario-' + suf,
					'name': 'apellidosUsuario',
					'placeholder': 'De 1 – 50 caracteres. [A-Z][espacio en blanco]',
				})
				.addClass( 'form-control input-md' );

			IDS.$RPEusuario = $( '<input/>' )
				.prop({
					'id': 'RPE-usuario-' + suf,
					'name': 'RPEusuario',
					'placeholder': '5 caracteres exactos. [0-9] [A-Z]',
				})
				.addClass( 'form-control input-md' );

			IDS.$usuario = $( '<input/>' )
				.prop({
					'id': 'usuario-' + suf,
					'name': 'usuario',
					'placeholder': 'De 1 – 16 caracteres. [- _ .] [0-9] [A-Z]',
				})
				.addClass( 'form-control input-md' );

			IDS.$claveUsuario = $( '<input/>' )
				.prop({
					'id'         : 'clave-usuario-' + suf,
					'name'       : 'claveUsuario',
					'placeholder': '8 caracteres mínimo.',
					'type'       : 'password'
				})
				.addClass( 'form-control input-md' );

			IDS.$claveUsuarioConfirmacion = $( '<input/>' )
				.prop({
					'id'         : 'clave-usuario-confirmacion-' + suf,
					'name'       : 'claveUsuarioConfirmacion',
					'placeholder': '8 caracteres mínimo.',
					'type'       : 'password'
				})
				.addClass( 'form-control input-md' );

			IDS.$areaTrabajo = $( '<select></select>' )
				.prop({
					'id'         : 'area-trabajo-' + suf,
					'name'       : 'areaTrabajo'
				})
				.addClass( 'form-control input-md' );

			IDS.$rolUsuario = $( '<select></select>' )
				.prop({
					'id'         : 'rol-usuario-' + suf,
					'name'       : 'rolUsuario'
				})
				.addClass( 'form-control input-md' );

			var $botonGuardar = $( '<button>Guardar</button>' )
				.prop({
					// 'id': 'btn-guardar-user-' + suf,
					'type': 'submit'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonLimpiar = $( '<button>Limpiar Campos</button>' )
				.prop({
					'id': 'btn-limpiar-user-' + suf,
					'type': 'reset'
				})
				.addClass( 'btn btn-success' )
				.append( '&nbsp;<span class="glyphicon glyphicon-repeat"></span>' )

			/* Estructuring document form
			 */
			IDS.$form = $( '<form></form>' )
				.prop( 'id', 'form-usuario-' + suf	)
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' )

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Nombre:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$nombreUsuario )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Apellidos:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$apellidosUsuario )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">RPE:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$RPEusuario )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Usuario:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$usuario )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Contraseña:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$claveUsuario )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Confirmar contraseña:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$claveUsuarioConfirmacion )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Área de Trabajo:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$areaTrabajo )
						)
				)

				.append(
					$( '<div class="form-group"></div>' )
						.append( '<label class="col-sm-3 control-label">Rol de Usuario:</label>' )
						.append(
							$( '<div class="col-sm-7"></div>' ).append( IDS.$rolUsuario )
						)
				)

				.append(
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
			var
			datos = this.datos,
			IDS   = this.IDS;

			IDS.$nombreUsuario.val('');
			IDS.$apellidosUsuario.val('');
			IDS.$RPEusuario.val('');
			IDS.$usuario.val('');
			IDS.$claveUsuario.val('');
			$( '#clave-usuario-confirmacion-' + suf ).val('');
			IDS.$areaTrabajo.val('');
			IDS.$rolUsuario.val('');

			emptyData.call( this );
		},

		emptyData = function () {
			var datos = this.datos;

			datos.nombreUsuario.valor    = null;
			datos.apellidosUsuario.valor = null;
			datos.RPEusuario.valor       = null;
			datos.usuario.valor          = null;
			datos.claveUsuario.valor     = null;
			datos.areaTrabajo.valor      = null;
			datos.rolUsuario.valor       = null;

			IDS.$form.formValidation( 'resetForm' );
		},

		/* Function for enable functional form, and fill fields
		 * for form
		 */
		updateObj = function ( obj ) {
			var
			doc   = this,
			datos = this.datos,
			IDS   = this.IDS;

			/* catching update's ID
			 */
			datos.RPEusuarioUpdate = {
				valor: obj.RDE_trabajador
			};

			datos.usuarioUpdate = {
				valor: obj.nombre_usuario
			}

			/* fill comboboxes with data server and set data fields
			 * from current user
			 */
			sigesop.query({
				class: 'usuarios',
				query: 'obtenerAreaTrabajo',
				success: function( data ) {
					IDS.$areaTrabajo.combo({
						arr: data,
						campo: 'clave_areaTrabajo, descripcion_areaTrabajo',
						campoValor: 'clave_areaTrabajo'
					})
					.val( obj.clave_areaTrabajo );
				}
			});

			sigesop.query({
				class: 'usuarios',
				query: 'obtenerTipoRolUsuario',
				success: function( data ) {
					IDS.$rolUsuario.combo({
						arr: data,
						campo: 'clave_rol, descripcion_areaTrabajo',
						campoValor: 'clave_rol'
					})
					.val( obj.clave_rol );
				}
			});

			IDS.$nombreUsuario.val( obj.nombre_trabajador );
			IDS.$apellidosUsuario.val( obj.apellidos_trabajador );
			IDS.$RPEusuario.val( obj.RDE_trabajador );
			IDS.$usuario.val( obj.nombre_usuario );
		},

		javascript = function () {
			var
			doc   = this,
			datos = this.datos,
			IDS   = this.IDS;

			IDS.$form.formValidation({
		        icon: {
					valid     : 'glyphicon glyphicon-ok',
					invalid   : 'glyphicon glyphicon-remove',
					validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.success == 'function' ?
		        		opt.success( datos, IDS, cleanFields = cleanFields.bind( doc ) ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.error === 'function' ?
		        		opt.error() : console.log( 'error is null' );
		        },

		        fields: {
		            nombreUsuario: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val().toUpperCase();
		            		datos.nombreUsuario.valor = val;
		            		data.element.val( val );
		            	},
		            	onError: function ( e, data ) {
		            		datos.nombreUsuario.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.nombreUsuario.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 50,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\sA-Z]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },
		            apellidosUsuario: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val().toUpperCase();
		            		datos.apellidosUsuario.valor = val;
		            		data.element.val( val );
		            	},
		            	onError: function ( e, data ) {
		            		datos.apellidosUsuario.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.apellidosUsuario.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 50,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\sA-Z]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },
		            RPEusuario: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val().toUpperCase();
		            		datos.RPEusuario.valor = val;
		            		data.element.val( val );
		            	},
		            	onError: function ( e, data ) {
		            		datos.RPEusuario.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.RPEusuario.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 5,
		                    	max: 5,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\dA-Z]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },
		            usuario: {
		            	onSuccess: function ( e, data ) {
		            		datos.usuario.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.usuario.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.usuario.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 16,
		                    	message: 'Número de caracteres inválido (16 max.)'
		                    },
		                    regexp: {
		                    	regexp: /^[-_.\w]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },
		            claveUsuario: {
		            	validators: {
		            		notEmpty: {
		            			message: 'Campo requerido'
		            		},
		            		stringLength: {
		            			message: 'Mínimo 8 caracteres',
		            			min: 8
		            		}
		            	}
		            },
		            claveUsuarioConfirmacion: {
		            	validators: {
		            		notEmpty: {
		            			message: 'Campo requerido'
		            		},
		            		callback: {
		            			message: 'La contraseña no coincide',
		            			callback: function ( value, validator ) {
		            				var val_1 = IDS.$claveUsuario.val().SHA1();
		            				if ( val_1 === value.SHA1() ){
		            					datos.claveUsuario.valor = val_1
		            					return true;
		            				}

		            				else {
		            					datos.claveUsuario.valor = null;
		            					return {
		            						valid: false,
											message: 'La contraseña no coincide'
		            					}
		            				};
		            			}
		            		}
		            	}
		            },
		            areaTrabajo: {
		            	onSuccess: function ( e, data ) {
		            		datos.areaTrabajo.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.areaTrabajo.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.areaTrabajo.valor = null;
	                	},
		            	validators: {
		            		notEmpty: {
		            			message: 'Campo requerido'
		            		}
		            	}
		            },
		            rolUsuario: {
		            	onSuccess: function ( e, data ) {
		            		datos.rolUsuario.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.rolUsuario.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.rolUsuario.valor = null;
	                	},
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

			IDS.$claveUsuario.on( 'success.field.fv', function ( event ) {
				IDS.$form.formValidation( 'revalidateField', 'claveUsuarioConfirmacion' );
			});

			IDS.$botonLimpiar.on( 'click', function ( event ) { emptyData.call( doc ); });

			/* Run diferents actions for document
			 */
			switch ( typeof opt.action !== 'undefined' ? opt.action : null ) {
				case 'update': // Update user data
					if ( typeof opt.obj === 'undefined' && $.isEmptyObject( opt.obj ) )
						throw new Error( 'Error update function: property [obj] is required' );

					updateObj.call( doc, opt.obj );
					break;
			};
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			// else {
			// 	this.javascript = javascript.bind( this )
			// 	console.log( 'newUserDocument: [this] is undefined' );
			// }

			return this;
		},

		datos = {
			nombreUsuario   : { valor: null },
			apellidosUsuario: { valor: null },
			RPEusuario      : { valor: null },
			usuario         : { valor: null },
			claveUsuario    : { valor: null },
			areaTrabajo     : { valor: null },
			rolUsuario      : { valor: null }
		},

		IDS = {
			$form                    : null,
			$nombreUsuario           : null,
			$apellidosUsuario        : null,
			$RPEusuario              : null,
			$usuario                 : null,
			$claveUsuario            : null,
			$claveUsuarioConfirmacion: null,
			$areaTrabajo             : null,
			$rolUsuario              : null,
			$botonLimpiar            : null
		},

		doc = {
			datos: datos,
			IDS: IDS
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	registeredUsersDocument: function ( opt ) {
		var

		that = this,

		struct_document = function () {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/

			IDS.$botonImprimir = $('<button></button>')
				.prop( 'type', 'button' )
				.addClass( 'btn btn-success' )
				.html( 'Imprimir Reporte de Usuarios' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );


			IDS.$tableContent = $('<div></div>')
				.addClass( 'col-sm-12 col-md-12' );

			/* Estructuring document form
			 */

			IDS.$content = $( '<form></form>' )

			.append(
				$( '<div role="alert"></div>' )
				.addClass( 'alert alert-danger alert-dismissible fade in' )
				.append(
					$( '<button aria-label="Close" data-dismiss="alert" type="button"></button>' )
					.addClass( 'close' )
					.append( '<span aria-hidden="true">×</span>' )
				)
				.append( '<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' )
			)

			.append(
				$('<div class="form-group"></div>')
				.append(
					$('<p class="col-sm-offset-5 col-sm-7"></p>')
					.append( IDS.$botonImprimir )
				)
			)

			.append(
				$('<div class="form-group"></div>' )
				.append( IDS.$tableContent )
			)
		},

		javascript = function () {
			var IDS   = this.IDS;
			var table = IDS.$tableContent.dataTable({
				head: 	'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO,' +
						'ROL DE USUARIO',

				campo: 	'RDE_trabajador, nombre_usuario, nombre_trabajador, ' +
						'apellidos_trabajador, clave_areaTrabajo, clave_rol',

				contextMenu: {
					selector: 'tr',
					items: {
			            editar: {
			            	name: 'Editar',
			            	icon: 'edit',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).attr( 'table-index' );
			        			typeof opt.table.actions.editar == 'function' ?
			        				opt.table.actions.editar( index ):
			        				console.log( 'function editar is null' );
			        		}
			            },
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
					}
				}
			})
			.factory();

			this.table.update_table = table.update_table; // enlazamos a vista publica

			IDS.$botonImprimir.on( 'click', function ( event ) {
				var
				url = sigesop.raizServidor + 'ajax.php?class=usuarios' +
					'&action=imprimir',
					win = window.open( url );

				win.focus();
			});
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$content );
				javascript.call( this );
			}

			return this;
		},

		doc = {
			IDS: {
				$botonImprimir: null,
				$content      : null,
				$tableContent : null
			},
			table: {
				update_table: null
			}
		};

		doc.factory = factory.bind( doc );

		return doc;
	}
}

$.extend( jQuery.fn, {
	newUserDocument        : sigesop.usuarios.newUserDocument,
	registeredUsersDocument: sigesop.usuarios.registeredUsersDocument
});