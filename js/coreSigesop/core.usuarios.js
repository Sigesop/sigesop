sigesop.usuarios = {
	document: function ( opt )
	{
		/* obj
		 * suf
		 * error
		 * success
		 * arr_areaTrabajo
		 * arr_roles
		 */
		var 
			suf = opt.suf || '',
			usr = opt.obj || {
				RDE_trabajador: '',
				apellidos_trabajador: '',
				clave_areaTrabajo: '',
				clave_rol: '',
				nombre_trabajador: '',
				nombre_usuario: ''
			};

		var 
			html = 
				'<form id="formUsuario' + suf + '" class="form-horizontal" role="form" method="post">'+
					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Nombre:</label>'+
						'<div class="col-sm-7">'+
							'<input name="nombreUsuario" id="nombreUsuario' + suf + '" class="form-control input-md MAYUS" placeholder="Ingrese nombre del trabajador ( 1-50 caracteres, signos aceptados [A-Z])" value="' + usr.nombre_trabajador + '">'+
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Apellidos:</label>'+
						'<div class="col-sm-7">'+
							'<input name="apellidosUsuario" id="apellidosUsuario' + suf + '" class="form-control input-md MAYUS" placeholder="Ingrese apellido del trabajador ( 1-50 caracteres, signos aceptados [A-Z])" value="' + usr.apellidos_trabajador +'">' +
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">RPE:</label>'+
						'<div class="col-sm-7">'+
							'<input name="RPEusuario" id="RPEusuario' + suf + '" class="form-control input-md MAYUS" placeholder="Ingrese RPE ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])" value="'+ usr.RDE_trabajador + '">' +
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Usuario:</label>'+
						'<div class="col-sm-7">'+
							'<input name="usuario" id="usuario' + suf + '" class="form-control input-md" placeholder="Ingrese nombre de usuario ( 1-30 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])" value="' + usr.nombre_usuario + '">' +
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Contraseña:</label>'+
						'<div class="col-sm-7">'+
							'<input name="claveUsuario" id="claveUsuario' + suf + '" type="password" class="form-control input-md" placeholder="Ingrese nueva contraseña de identificación">'+
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Confirmar contraseña:</label>'+
						'<div class="col-sm-7">'+
							'<input name="claveUsuarioConfirmacion" id="claveUsuarioConfirmacion' + suf + '" type="password"  class="form-control input-md" placeholder="Confirme contraseña de identificación">'+
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Area de Trabajo:</label>'+
						'<div class="col-sm-7">'+
							'<select name="areaTrabajo" id="areaTrabajo' + suf + '" class="form-control input-md" ></select>' +
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-3 control-label">Rol de Usuario:</label>'+
						'<div class="col-sm-7">'+
							'<select name="rolUsuario" id="rolUsuario' + suf + '" class="form-control input-md" ></select>' +
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<div class="col-sm-3"></div>'+
						'<div class="col-sm-7">'+
	        				'<button id="botonGuardarUser' + suf + '" type="submit" class="btn btn-success"><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
	        				'<button id="botonLimpiarUser' + suf + '" type="reset" class="btn btn-success"> <span class="glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
	        			'</div>'+
					'</div>'+
				'</form>',

			limpiarCampos = function ()
			{
    			$( doc.datos.nombreUsuario.idHTML ).val('');
				$( doc.datos.apellidosUsuario.idHTML ).val('');
				$( doc.datos.RPEusuario.idHTML ).val('');
				$( doc.datos.usuario.idHTML ).val('');				
				$( doc.datos.claveUsuario.idHTML ).val('');
				$( '#claveUsuarioConfirmacion' + suf ).val('');
				$( doc.datos.areaTrabajo.idHTML ).val('');
				$( doc.datos.rolUsuario.idHTML ).val('');

				vaciarDatos();
			},

			vaciarDatos = function ()
			{
			    doc.datos.nombreUsuario.valor = null;
				doc.datos.apellidosUsuario.valor = null;
				doc.datos.RPEusuario.valor = null;
				doc.datos.usuario.valor = null;
				doc.datos.claveUsuario.valor = null;
				doc.datos.areaTrabajo.valor = null;
				doc.datos.rolUsuario.valor = null;
	
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			javascript = function () {
				var
				form = this.IDS.form,
				$claveUsuario = $( this.datos.claveUsuario.idHTML ),
				$form = $( form ).formValidation({
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
			        },

			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },

			        fields: {			            
			            nombreUsuario: {
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
			                validators: {
			                    notEmpty: {
			                        message: 'Campo requerido'
			                    },
			                    stringLength: {
			                    	min: 1,
			                    	max: 30,
			                    	message: 'Número de caracteres inválido'
			                    },
			                    regexp: {
			                    	regexp: /^[-_.\w\s]*$/i,
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
			            				var val_1 = $claveUsuario.val();			            				
			            				if ( val_1 === value )
			            					return true;
			            				else return {
			            					valid: false,
											message: 'La contraseña no coincide'
			            				};
			            			}
			            		}
			            	}
			            },	
			            areaTrabajo: {
			            	validators: {
			            		notEmpty: {
			            			message: 'Campo requerido'
			            		}
			            	}
			            },	
			            rolUsuario: {
			            	validators: {
			            		notEmpty: {
			            			message: 'Campo requerido'
			            		}
			            	}
			            },	
			        }
				})
				.on( 'success.field.fv', function( e, data ) {
					data.fv.disableSubmitButtons( false );
				});

				this.IDS.$form = $form;

				$( '.MAYUS' ).eventoCambioMayuscula();

				$claveUsuario.on( 'success.field.fv', function ( event ) {
					$form.formValidation( 'revalidateField', 'claveUsuarioConfirmacion' );
				});

				$( this.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });

				/* inserta los datos en los combos 
				 * y selecciona los los datos actuales del usuario
				 */
				if ( opt.obj )
				{
					sigesop.combo({
						arr: opt.arr_areaTrabajo, 
						elem: this.datos.areaTrabajo.idHTML, 
						campo: 'clave_areaTrabajo, descripcion_areaTrabajo', 
						campoValor: 'clave_areaTrabajo'
					});
					sigesop.combo({
						arr: opt.arr_roles, 
						elem: this.datos.rolUsuario.idHTML, 
						campo: 'clave_rol, descripcion_areaTrabajo', 
						campoValor: 'clave_rol'
					});	
					$( this.datos.areaTrabajo.idHTML ).val( usr.clave_areaTrabajo );
					$( this.datos.rolUsuario.idHTML ).val( usr.clave_rol );
				}
			},

			datos = {
				nombreUsuario:{
					valor: null,
					idHTML: '#nombreUsuario' + suf
				},	
				apellidosUsuario: {
					valor: null,
					idHTML: '#apellidosUsuario' + suf
				},
				RPEusuarioUpdate: {	valor: null	},
				RPEusuario: {
					valor: null,
					idHTML: '#RPEusuario' + suf
				},
				usuarioUpdate: { valor: null },
				usuario: {
					valor: null,
					idHTML: '#usuario' + suf
				},
				claveUsuario: {
					valor: null,
					idHTML: '#claveUsuario' + suf
				},
				areaTrabajo: {
					valor: null,
					idHTML: '#areaTrabajo' + suf
				},
				rolUsuario: {
					valor: null,
					idHTML: '#rolUsuario' + suf
				}					
			},

			IDS = {
				botonGuardar: '#botonGuardarUser' + suf,
				botonLimpiar: '#botonLimpiarUser' + suf,
				form: '#formUsuario' + suf,
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

	documentoRegistro: function ( opt )
	{
		var suf = opt.suf || '';

		var 
			html =
				'<form id="formRegistroUsuarios' + suf + '">' +
					'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
						'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
							'<span aria-hidden="true">×</span>' +
						'</button>' +
						'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
					'</div>' +

					'<div class="form-group">' +					
						'<div class="col-sm-12 col-md-12" id="tabla_registro_usuarios' + suf + '"></div>' +
					'</div>' +
				'</form>',

			javascript = function () {
				var
				tabla_usuarios = sigesop.tablaRegistro({
					head: 	'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO,' +
							'ROL DE USUARIO',
					campo: 	'RDE_trabajador, nombre_usuario, nombre_trabajador, ' +
							'apellidos_trabajador, clave_areaTrabajo, clave_rol'
				});
				
				this.table.update_table = tabla_usuarios.update_table; // enlazamos a vista publica
				this.table.body = tabla_usuarios.IDS.body;
				document.getElementById( this.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + tabla_usuarios.html

				$( tabla_usuarios.IDS.body ).contextMenu({
					selector: 'tr',
					items: {
			            editar: 
			            {
			            	name: 'Editar', 
			            	icon: 'edit',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.editar == 'function' ?
			        				opt.table.actions.editar( index ):
			        				console.log( 'function editar is null' );
			        		}
			            },
			            eliminar: 
			            {
			            	name: 'Eliminar', 
			            	icon: 'delete',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.eliminar == 'function' ?
			        				opt.table.actions.eliminar( index ):
			        				console.log( 'function eliminar is null' );
			        		}
			            }
					}
				});
			},

			IDS = {
				idTabla: '#tabla_registro_usuarios' + suf,
				form: '#formRegistroUsuarios' + suf
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
}