sigesop.materiales = {
	document: function ( opt ) {
		var

		suf = opt.suf || '',

		html =
			'<form id="form-materiales-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Código Material: </label>' +
					'<div class="col-sm-7">' +
						'<input name="codigo_material" id="codigo-material-' + suf + 
						'" placeholder="Numérico (Entero)" class="form-control input-md" type="text">' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Descripción: </label>' +
					'<div class="col-sm-7">' +
						'<input name="descripcion_material" id="descripcion-material-' + suf + 
						'" placeholder="De 1 – 100 caracteres" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Tipo: </label>'+
					'<div class="col-sm-7">'+
						'<select name="tipo_material" id="tipo-material-' + suf + '" class="form-control input-md">'+
						'</select>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btn-guardar-material-' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button type="reset"  id="btn-limpiar-material-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>'+
				'</div>'+
			'</form>',

		javascript = function () {
			var
			doc = this,
			datos = this.datos,
			form = this.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$codigo_material = $( datos.codigo_material.idHTML ),
			$descripcion_material = $( datos.descripcion_material.idHTML ),
			$tipo_material = $( datos.tipo_material.idHTML ),
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
		            		var val = data.element.val().toUpperCase();
		            		datos.codigo_material.valor = val;
		            		data.element.val( val );
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
		                    },
		                    integer: {
		                    	message: 'Sólo números enteros'
		                    }
		                }
		            },

		            descripcion_material: {
		            	onSuccess: function ( e, data ) {
		            		var val = data.element.val().toUpperCase();
		            		datos.descripcion_material.valor = val;
		            		data.element.val( val );
		            	},
		            	onError: function ( e, data ) {
		            		datos.descripcion_material.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.descripcion_material.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	max: 100,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            tipo_material: {
		            	onSuccess: function ( e, data ) {
		            		datos.tipo_material.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.tipo_material.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.tipo_material.valor = null;
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

			/* Enlazar publicamente instancias jQuery de los campos
			 */		
			doc.IDS.$form = $form;
			doc.IDS.$botonLimpiar = $botonLimpiar;
			doc.IDS.$codigo_material = $codigo_material;
			doc.IDS.$descripcion_material = $descripcion_material;
			doc.IDS.$tipo_material = $tipo_material;

			$botonLimpiar.on( 'click', function ( event ) {
				vaciarDatos.call( doc );
			});

			/* Si el documento es para edicion, rellenar los datos
			 * pasados en la variable [opt.obj]
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;

				sigesop.query({
					class: 'materiales',
					query: 'obtener_tipo_materiales',
					queryType: 'sendGetData',
					success: function ( data ) {
						window.sesion.matrizTipoMateriales = data;
						$tipo_material.combo({ arr: data })
						.val( obj.tipo_material );
					}
				});
			
				$codigo_material.val( obj.codigo_material );
				$descripcion_material.val( obj.descripcion_material );				

				/* Guardamos el ID que se actualizará				
				 */
				datos.codigo_material_update.valor = obj.codigo_material;
			}
		},

		vaciarDatos = function () {
			var 
			datos = this.datos,
			IDS = this.IDS;

			datos.codigo_material.valor = null;
			datos.descripcion_material.valor = null;
			datos.tipo_material.valor = null;

			doc.IDS.$form.formValidation( 'resetForm' );
		},

		limpiarCampos = function () {
			var 
			doc = this,
			IDS = this.IDS;

			IDS.$codigo_material.val('');
			IDS.$descripcion_material.val('');
			IDS.$tipo_material.val('');

			vaciarDatos.call( doc );
		},

		IDS = {
			botonGuardar: '#btn-guardar-material-' + suf,
			botonLimpiar: '#btn-limpiar-material-' + suf,
			form: '#form-materiales-' + suf,

			$form: null,
			$codigo_material: null,
			$descripcion_material: null,
			$tipo_material: null
		},

		datos = {
			codigo_material: {
				valor: null,
				idHTML: '#codigo-material-' + suf
			},

			codigo_material_update: { valor: null },

			descripcion_material: {
				valor: null,
				idHTML: '#descripcion-material-' + suf
			},

			tipo_material: {
				valor: null,
				idHTML: '#tipo-material-' + suf
			}
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
		var 

		suf = opt.suf || '',

		html = 
			'<form id="form-registro-materiales-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-materiales-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			table = 
				sigesop.tablaRegistro({
					head: 'CÓDIGO MATERIAL, DESCRIPCIÓN, TIPO',
					campo: 'codigo_material, descripcion_material, tipo_material'
				});			

			doc.table.update_table = table.update_table; // enlazamos a vista publica
			doc.table.body = table.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + table.html;

			var
			items = {
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
			};

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		IDS = {
			idTabla: '#tabla-registro-materiales-' + suf,
			form: '#form-registro-materiales-' + suf
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