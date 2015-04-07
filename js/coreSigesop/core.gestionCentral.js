sigesop.gestionCentral = {
	document: function ( opt )
	{
		var
		suf = opt.suf || '',

		html = 
		'<form id="form-gestion-central-' + suf + '" class="form-horizontal" role="form" method="post">'+
			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Clave:</label>'+
				'<div class="col-sm-7">'+
					'<input name="clave_20" id="clave-central-' + suf +
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Ingrese clave de la central ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])">'+
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Clave SAP:</label>'+
				'<div class="col-sm-7">'+
					'<input name="clave_sap" id="clave-SAP-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Ingrese clave SAP ( 4 caracteres exactos, signos aceptados [A-Z] [0-9])" >'+
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Centro Costo:</label>'+
				'<div class="col-sm-7">'+
					'<input name="centro_costo" id="centro-costo-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Ingrese centro costo ( 1-6 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])">'+
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Nombre de la Central:</label>'+
				'<div class="col-sm-7">'+
					'<input name="nombre_central" id="nombre-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Nombre de la central"  >' +
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Dirección de la Central:</label>'+
				'<div class="col-sm-7">'+
					'<textarea name="direccion" id="direccion-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Dirección de la central" ></textarea>' +
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Teléfono de la Central:</label>'+
				'<div class="col-sm-7">'+
					'<input name="telefono" id="telefono-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled ' +
					'placeholder="Teléfono de la central" >' +
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Código Postal de la Central:</label>'+
				'<div class="col-sm-7">'+
					'<input name="cp" id="codigo-postal-central-' + suf + 
					'" class="form-control input-md" disabled ' +
					'placeholder="Código Postal de la central" >'+
				'</div>'+
			'</div>'+

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Superintendente de la Central</label>'+
				'<div class="col-sm-4">'+
					'<input name="superintendente" id="superintendente-central-' + suf + 
					'" class="form-control input-md MAYUS" disabled >' +
				'</div>'+

				'<div class="col-sm-4">'+
					'<p>'+
						'<button id="btn-superintendente-central-' + suf + 
						'" class="btn btn-primary" disabled> ' +
						'<span class="glyphicon glyphicon-user"></span> ' +
						'Seleccione superintendente</button>'+
					'</p>'+
				'</div>'+
			'</div>' +

			'<div class="form-group">'+
				'<label class="col-sm-3 control-label">Capacidad Instalada de la Central</label>'+
				'<div class="col-sm-7">'+
					'<input id="capacidad-instalada-central-' + suf + 
					'" class="form-control input-md" disabled>'+
				'</div>'+
			'</div>' +

			'<div class="form-group">'+
				'<div class="col-sm-3"></div>'+
				'<div class="col-sm-8">'+
					'<p>'+
						'<button id="btn-guardar-central-' + suf + '" type="submit" class="btn btn-success" disabled> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
						'<button id="btn-limpiar-campos-central-' + suf +  '" type="reset" class="btn btn-success" disabled> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button> ' +
						'<button id="btn-editar-central-' + suf +  '" type="" class="btn btn-danger"><span class="glyphicon glyphicon-list"></span> Editar</button> ' +
					'</p>'+
				'</div>'+
				'<div class="col-sm-1"></div>'+
			'</div>'+
		'</form>',

		/**
		 * [dialog_anable]
		 * @return {void} genera ventana emergente para solicitar
		 * la habilitacion de los elementos
		 */
		dialog_anable = function () {
			var

			doc = this,
			
			clickAceptar = function( event ) {
				event.preventDefault();
				enable.call( doc );
				$( win.idDiv ).modal( 'hide' );
			},

			win = sigesop.ventanaEmergente({
				idDiv: 'confirmarSolicitud' + suf,
				titulo: 'Autorización requerida',
				clickAceptar: clickAceptar,
				showBsModal: function () {
					document.getElementById( this.idBody )
					.innerHTML = '<div class="alert alert-danger text-center"><h4>¿Está seguro de editar datos de la central?</h4></div>';
				}
			});	
		},

		/**
		 * [enable]
		 * @return {void} desabilita los elementos del formulario, funcion
		 * con vista publica
		 */
		enable = function () {
			var doc = this;

			/* habilitamos los elementos					 
			 */
			$( doc.datos.clave_20.idHTML ).prop( 'disabled', false );
			$( doc.datos.clave_sap.idHTML ).prop( 'disabled', false );
			$( doc.datos.centro_costo.idHTML ).prop( 'disabled', false );
			$( doc.datos.nombre_central.idHTML ).prop( 'disabled', false );
			$( doc.datos.direccion.idHTML ).prop( 'disabled', false );
			$( doc.datos.telefono.idHTML ).prop( 'disabled', false );
			$( doc.datos.cp.idHTML ).prop( 'disabled', false );
			$( doc.datos.superintendente.idHTML ).prop( 'disabled', false );
			
			$( doc.IDS.botonGuardar ).prop( 'disabled',false );
			$( doc.IDS.botonLimpiar ).prop( 'disabled',false );
			$( doc.IDS.botonSuperintendente ).prop( 'disabled', false );
			$( doc.IDS.botonEditar ).prop( 'disabled', true );

			/*guardamos la clave original para tener una referencia
			*/			
			doc.datos.clave_20_update.valor = $( doc.datos.clave_20.idHTML ).val();
		},

		/**
		 * [disable]
		 * @return {void} desabilita los elementos del formulario, funcion
		 * con vista pública
		 */
		disable = function () {
			var doc = this;

			/* desabilitar los elementos					 
			 */
			$( doc.datos.clave_20.idHTML ).prop( 'disabled', true );
			$( doc.datos.clave_sap.idHTML ).prop( 'disabled', true );
			$( doc.datos.centro_costo.idHTML ).prop( 'disabled', true );
			$( doc.datos.nombre_central.idHTML ).prop( 'disabled', true );
			$( doc.datos.direccion.idHTML ).prop( 'disabled', true );
			$( doc.datos.telefono.idHTML ).prop( 'disabled', true );
			$( doc.datos.cp.idHTML ).prop( 'disabled', true );
			$( doc.datos.superintendente.idHTML ).prop( 'disabled', true );
			
			$( doc.IDS.botonGuardar ).prop( 'disabled',true );
			$( doc.IDS.botonLimpiar ).prop( 'disabled',true );
			$( doc.IDS.botonSuperintendente ).prop( 'disabled', true );
			$( doc.IDS.botonEditar ).prop( 'disabled', false );
		},

		/**
		 * [update_data]
		 * @param  {object} {obj} objeto de datos provenientes del servidor
		 * @return {void}     	  setea los datos provenientes al servidor
		 * dentro de los elementos del formulario
		 */
		update_data = function ( obj ) {
			if ( $.isEmptyObject( obj ) )
				return null;

			var datos = this.datos;
			$( datos.clave_20.idHTML ).val( obj.clave_20 );
			$( datos.clave_sap.idHTML ).val( obj.clave_sap );
			$( datos.centro_costo.idHTML ).val( obj.centro_costo );
			$( datos.nombre_central.idHTML ).val( obj.nombre_central );
			$( datos.direccion.idHTML ).val( obj.direccion );
			$( datos.telefono.idHTML ).val( obj.telefono );
			$( datos.cp.idHTML ).val( obj.cp );
			$( datos.superintendente.idHTML ).val( obj.superintendente );
			$( datos.capacidad_instalada.idHTML ).val( obj.capacidad_instalada );
		},

		/**
		 * [limpiarCampos]
		 * @return {void} limpia los campos de cualquier dato, tanto
		 * en los elementos como en la estructura de datos principal
		 */
		limpiarCampos = function () {
			var datos = this.datos;
			$( datos.clave_20.idHTML ).val( '' );
			$( datos.clave_sap.idHTML ).val( '' );
			$( datos.centro_costo.idHTML ).val( '' );
			$( datos.nombre_central.idHTML ).val( '' );
			$( datos.direccion.idHTML ).val( '' );
			$( datos.telefono.idHTML ).val( '' );
			$( datos.cp.idHTML ).val( '' );
			$( datos.superintendente.idHTML ).val( '' );

			vaciarDatos.call( this );
		},

		/**
		 * [vaciarDatos]
		 * @return {void} resetea los datos de la estructura de datos
		 * principal y la validacion del formulario
		 */
		vaciarDatos = function ()
		{
			var doc = this;
			doc.datos.clave_20_update.valor = null;			
			doc.datos.clave_20.valor = null;
			doc.datos.clave_sap.valor = null;
			doc.datos.centro_costo.valor = null;
			doc.datos.nombre_central.valor = null;
			doc.datos.direccion.valor = null;
			doc.datos.telefono.valor = null;
			doc.datos.cp.valor = null;
			doc.datos.superintendente.valor = null;	
			if( doc.IDS.$form !== null )
				doc.IDS.$form.formValidation( 'resetForm' );		
		},

		dialog_superintendente = function () {
			var

			tabla = 
				sigesop.tablaSeleccion({
					color_select: 'success',
					head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
					campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol',						
				}),
			
			doc = this, 

			clickAceptar = function( event ) {
				/* Guardamos el id del sistema y ponenos el nombre del sistema en la caja
				 */
											
				if ( jQuery.isEmptyObject( tabla.matrizInput ) ) {
					console.log( '[tabla.matrizInput] es nula' );
					return null;
				};
				
				var index = sigesop.getDataRadio( tabla.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
					sigesop.getDataRadio( tabla.matrizInput[ 0 ] ) : -1;

				if ( index < 0 ) {
					sigesop.msg( 'Advertencia', 'Trabajador no seleccionado', 'warning' );
					return null;
				}

				doc.datos.superintendente.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];

				var val = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];
				$( doc.datos.superintendente.idHTML ).val( val );
				doc.IDS.$form.formValidation( 'revalidateField', 'superintendente' );
				$( win.idDiv ).modal( 'hide' );				
			},

			clickCerrar = function( event ) {
				doc.IDS.$form.formValidation( 'revalidateField', 'superintendente' );
				$( win.idDiv ).modal( 'hide' );
			},

			showBsModal = function () {
				document.getElementById( this.idBody )
				.innerHTML = tabla.html;					

				sigesop.query({
					class: 'usuarios',
					query: 'obtenerUsuarios',
					success: function ( data ) 
					{
						window.sesion.matrizUsuario = data;
						tabla.update_table( data );
					}
				});
			},

			win = sigesop.ventanaEmergente({
				idDiv: 'seleccionTrabajador',
				titulo: 'Selección de superintendente',
				clickAceptar: clickAceptar,
				clickCerrar: clickCerrar,
				showBsModal: showBsModal
			});
		},

		javascript = function () { 
			var
			doc = this,
			form = doc.IDS.form,
			$botonEditar = $( doc.IDS.botonEditar ),
			$botonSuperintendente = $( doc.IDS.botonSuperintendente ),
			$botonLimpiar = $( doc.IDS.botonLimpiar ),		
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
		        		opt.success( doc.datos, doc.IDS, vaciarDatos = vaciarDatos.bind( doc ) ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		            clave_20: {
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

		            clave_sap: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 4,
		                    	max: 4,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\dA-Z]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            centro_costo: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 6,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[-_.\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            nombre_central: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 100,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            direccion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 100,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            telefono: {
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
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },	

		            cp: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    
		                    integer: {		                    	
		                    	message: 'Caracteres inválidos, sólo números'
		                    }
		                }
		            },

		            superintendente: {
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
		            }
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;			

			$botonSuperintendente.on('click', function ( event ) {
				event.preventDefault();
				dialog_superintendente.call( doc );
			});

			$botonLimpiar.on('click', function ( event ) {
				limpiarCampos.call( doc );
			});

			$botonEditar.on( 'click', function ( event ) {
				event.preventDefault();
				dialog_anable.call( doc );
			});

			$( '.MAYUS' ).eventoCambioMayuscula();
		},

		datos = {
			clave_20_update: { valor: null },
			clave_20: {
				valor: null,
				idHTML: '#clave-central-' + suf,
			},
			clave_sap: {
				valor: null,
				idHTML: '#clave-SAP-central-' + suf
			},
			centro_costo: {
				valor: null,
				idHTML: '#centro-costo-central-' + suf
			},
			nombre_central: {
				valor: null,
				idHTML: '#nombre-central-' + suf
			},
			direccion: {
				valor: null,
				idHTML: '#direccion-central-' + suf
			},
			telefono: {
				valor: null,
				idHTML: '#telefono-central-' + suf
			},
			cp: {
				valor: null,
				idHTML: '#codigo-postal-central-' + suf
			},
			superintendente: {
				valor: null,
				idHTML: '#superintendente-central-' + suf
			},
			capacidad_instalada: { idHTML: '#capacidad-instalada-central-' + suf	}
		},

		IDS = {
			botonGuardar        : '#btn-guardar-central-' + suf,
			botonEditar         : '#btn-editar-central-' + suf,
			botonLimpiar        : '#btn-limpiar-campos-central-' + suf,
			botonSuperintendente: '#btn-superintendente-central-' + suf,
			form                : '#form-gestion-central-' + suf,
			$form               : null
		},

		doc = {
			html       : html,
			javascript : javascript,
			datos      : datos,
			disable    : disable,
			IDS        : IDS,
			update_data: update_data,
			enable     : enable
		};

		return doc;	
	}
}