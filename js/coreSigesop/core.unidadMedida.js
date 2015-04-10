/* Cache de datos para manipulacion local
 *
 * [window.session.matrizUnidadMedida]
 * 
 */
sigesop.unidadMedida = {
	document: function ( opt )
	{		
		var 
		suf = opt.suf || '',

		html = 
			'<form id="form-unidad-medida-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Unidad de Medida:</label>' +
					'<div class="col-sm-7">' +
						'<input name="unidad_medida" id="unidad-medida-' + suf + '" class="form-control input-md evtCambioMay" placeholder="Ingrese descripcion de la actividad"> ' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Descripcion Unidad de Medida:</label>' +
					'<div class="col-sm-7">' +
						'<textarea name="descripcion_unidad_medida" id="desc-unidad-medida-' + suf + '" class="form-control input-md evtCambioMay" placeholder="Ingrese descripcion de la actividad"></textarea>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-3 control-label"></div>' +
					'<p class="col-sm-7">' +
						'<button type="submit" id="btn-guardar-unidad-medida-' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
						'<button type="reset"  id="btn-limpiar-unidad-medida-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>' +
				'</div>' +
			'</form>',

		limpiarCampos = function () {
			var datos = this.datos;
			$( datos.unidad_medida.idHTML ).val( '' );
			$( datos.descripcion_unidad_medida.idHTML ).val( '' );			

			vaciarDatos.call( this );
		},

		vaciarDatos = function () {
			var datos = this.datos;
			datos.unidad_medida.valor = null;			
			datos.descripcion_unidad_medida.valor = null;
			if( this.IDS.$form !== null )
				this.IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc = this,
			form = doc.IDS.form,
			datos = doc.datos,
			$botonGuardar = $( doc.IDS.botonLimpiar ),
			$unidad_medida = $( doc.datos.unidad_medida.idHTML ),
			$descripcion_unidad_medida = $( doc.datos.descripcion_unidad_medida.idHTML ),
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
		            unidad_medida: {
	                	onError: function ( e, data ) {
	                		datos.unidad_medida.valor = null;
	                	},
	                	onSuccess: function ( e, data ) {
	                		datos.unidad_medida.valor = 
	                		data.element.val().trim().toUpperCase();
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {		                    	
		                    	max: 20,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            descripcion_unidad_medida: {
	                	onError: function ( e, data ) {
	                		datos.descripcion_unidad_medida.valor = null;
	                	},
	                	onSuccess: function ( e, data ) {
	                		datos.descripcion_unidad_medida.valor = 
	                		data.element.val().trim().toUpperCase();
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {	                    	
		                    	max: 50,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]*$/i,
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
			doc.IDS.$botonGuardar = $botonGuardar;
			doc.IDS.$unidad_medida = $unidad_medida;
			doc.IDS.$descripcion_unidad_medida = $descripcion_unidad_medida;

			$botonGuardar.on( 'click', function ( event ) {
				vaciarDatos.call( doc );
			});

			$( '.evtCambioMay' ).eventoCambioMayuscula();

			/* Si el documento es para edicion, rellenar los datos
			 * pasados en la variable [opt.obj]
			 */
			
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;

				$unidad_medida.val( obj.unidad_medida );
				$descripcion_unidad_medida.val( obj.descripcion_unidad_medida );

				/* Guardamos el ID del equipo que se actualizará				
				 */
				doc.datos.unidad_medida_update.valor = obj.unidad_medida;
			}
		},

		datos = {
			unidad_medida: {
				valor: null,
				idHTML: '#unidad-medida-' + suf
			},
			unidad_medida_update: { valor: null },
			descripcion_unidad_medida: {
				valor: null,
				idHTML: '#desc-unidad-medida-' + suf
			}
		},

		IDS = {
			botonGuardar              : '#btn-guardar-unidad-medida-' + suf,
			botonLimpiar              : '#btn-limpiar-unidad-medida-' + suf,
			form                      : '#form-unidad-medida-' + suf,
			$form                     : null,
			$botonGuardar             : null,
			$unidad_medida            : null,
			$descripcion_unidad_medida: null
		},

		doc = {
			html      : html,
			javascript: javascript,
			datos     : datos,
			IDS       : IDS
		};

		return doc;
	},

	registro: function ( opt ) {
		var 

		suf = opt.suf || '',

		html = 
			'<form id="form-registro-unidad-medida-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-unidad-medida-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			table = 
				sigesop.tablaRegistro({
					head: 'UNIDAD DE MEDIDA, DESCRIPCIÓN',
					campo: 'unidad_medida, descripcion_unidad_medida'
				});

				doc.table.update_table = table.update_table; // enlazamos a vista publica
				doc.table.body = table.IDS.body;
				document.getElementById( doc.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + table.html;

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: {
		            editar: {
		            	name: 'Editar', 
		            	icon: 'edit',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).index();
		        			typeof opt.table.actions.editar == 'function' ?
		        				opt.table.actions.editar( index ):
		        				console.log( 'function editar is null' );
		        		}
		            },
		            eliminar: {
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
			idTabla: '#tabla-registro-unidad-medida-' + suf,
			form: '#form-registro-unidad-medida-' + suf
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
	}	
}