sigesop.areaTrabajo = {
	document: function ( opt ) 
	{
		/* suf
		 * obj
		 * success
		 * error
		 */
		var 
			suf = opt.suf || '',
			obj = opt.obj || {
				clave_areaTrabajo: '',
				descripcion_areaTrabajo: ''
			}

		var 
			html = 
				'<form id="formAreaTrabajo' + suf + '" class="form-horizontal" role="form">'+
					'<div class="form-group">'+
						'<label class="col-sm-2 control-label">Clave del área de trabajo: </label>'+
						'<div class="col-sm-9">'+
							'<input name="claveAreaTrabajo" id="claveAreaTrabajo' + suf + 
							'" class="form-control input-md MAYUS" placeholder="Ingrese clave del área de trabajo (10 caracteres)" value="' + obj.clave_areaTrabajo + '">'+
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<label class="col-sm-2 control-label">Descripción:</label>'+
						'<div class="col-sm-9">'+
							'<textarea name="descripcionAreaTrabajo" id="descripcionAreaTrabajo' + suf + 
							'" class="form-control input-md MAYUS" placeholder="Descripción del área de trabajo (50 caractéres)">' + obj.descripcion_areaTrabajo + '</textarea>'+
						'</div>'+
					'</div>'+

					'<div class="form-group">'+
						'<div class="col-sm-2 control-label"></div>'+
						'<p class="col-sm-9">'+
							'<button id="btnGuardarAreaTrabajo' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
							'<button id="botonLimpiar' + suf + '" type="reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
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
			            claveAreaTrabajo: {
			                validators: {
			                    notEmpty: {
			                        message: 'Campo requerido'
			                    },
			                    stringLength: {
			                    	min: 1,
			                    	max: 10,
			                    	message: 'Número de caracteres inválido'
			                    },
			                    regexp: {
			                    	regexp: /^[\-\]!"#\/()=?¡*[_{+}¿'|\w\s]*$/i,
			                    	message: 'Caracteres inválidos'
			                    }
			                }
			            },

			            descripcionAreaTrabajo: {
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
			        }
				});

				this.IDS.$form = $form;

				$( '.MAYUS' ).eventoCambioMayuscula();
				$( this.IDS.botonLimpiar ).on('click', function ( event ) {	vaciarDatos(); });
			},

			limpiarCampos = function ()
			{
				$( doc.datos.claveAreaTrabajo.idHTML ).val( '' );
				$( doc.datos.descripcionAreaTrabajo.idHTML ).val( '' );

				vaciarDatos();
			},

			vaciarDatos = function ()
			{
				doc.datos.claveAreaTrabajo.valor = null;
				doc.datos.claveAreaTrabajoUpdate.valor = null;
				doc.datos.descripcionAreaTrabajo.valor = null;
	
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			datos = {
				claveAreaTrabajo: {
					valor: null,
					idHTML: '#claveAreaTrabajo' + suf
				},
				claveAreaTrabajoUpdate: { valor: null },
				descripcionAreaTrabajo: {
					valor: null,
					idHTML: '#descripcionAreaTrabajo' + suf,
				}					
			},

			IDS = {
				botonGuardar: '#btnGuardarAreaTrabajo' + suf,
				botonLimpiar: '#botonLimpiar' + suf,
				form: '#formAreaTrabajo' + suf,
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

	documentRegistro: function ( opt ) 
	{
		/* suf
		 * obj
		 * success
		 * error
		 */
		var 
			suf = opt.suf || '',
			obj = opt.obj || {
				clave_areaTrabajo: '',
				descripcion_areaTrabajo: ''
			}

		var 
			html = 
				'<form id="formRegistroAreas' + suf + '" class="form-horizontal" role="form">'+
					'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
						'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
							'<span aria-hidden="true">×</span>' +
						'</button>' +
						'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
					'</div>' +

					'<div class="form-group">' +					
						'<div class="col-sm-12 col-md-12" id="tabla_registro_areas' + suf + '"></div>' +
					'</div>' +
				'</form>',

			javascript = function () {
				var
				tabla_areas = sigesop.tablaRegistro({
					head: 'CLAVE DE ÁREA DE TRABAJO, DESCRIPCIÓN',
					campo: 'clave_areaTrabajo, descripcion_areaTrabajo'
				});
				
				this.table.update_table = tabla_areas.update_table; // enlazamos a vista publica
				this.table.body = tabla_areas.IDS.body;
				document.getElementById( this.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + tabla_areas.html

				$( tabla_areas.IDS.body ).contextMenu({
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
				idTabla: '#tabla_registro_areas' + suf,
				form: '#formRegistroAreas' + suf
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
