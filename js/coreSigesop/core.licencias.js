sigesop.licencias = {
	document: function ( opt ) {
		var 

		obj = opt.obj || {},

		suf = opt.suf || '',

		html =
			'<form id="form-licencias-' + suf + '" class="form-horizontal" role="form">'+
				'<div id="formAnioLicencia' + suf + '" class="form-group">'+
					'<label class="col-sm-3 control-label">Año de licencia: </label>'+
					'<div class="col-sm-7">'+
						'<input name="anio_licencia" id="anio-licencia-' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese año de licencia (4 caracteres exactos, signos aceptados [0-9])" value="">'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button id="btn-guardar-licencia-' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button id="btn-limpiar-licencia-' + suf + '" type="reset"  class="btn btn-success"> <span class="glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>'+
				'</div>'+
			'</form>',

		limpiarCampos = function () {
			var IDS = this.IDS;
			IDS.$anio_licencia.val( '' );
			IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc = this,
			datos = this.datos,
			form = this.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$anio_licencia = $( datos.anio_licencia.idHTML ),
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
		            anio_licencia: {
		            	onSuccess: function ( e, data ) {
		            		datos.anio_licencia.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.anio_licencia.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.anio_licencia.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                        message: 'Número de caracteres inválido (4 caracteres)',
		                        min: 4
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

			/* Enlazar publicamente instancias jQuery de los campos
			 */		
			doc.IDS.$form = $form;
			doc.IDS.$anio_licencia = $anio_licencia;
			doc.IDS.$botonLimpiar = $botonLimpiar;

			$botonLimpiar.on( 'click', function ( event ) {
				$form.formValidation( 'resetForm' );
			});
		},

		datos = {
			anio_licencia: {
				valor: null,
				idHTML: '#anio-licencia-' + suf
			}
		},

		IDS = {
			botonGuardar: '#btn-guardar-licencia-' + suf,
			botonLimpiar: '#btn-limpiar-licencia-' + suf,
			form: '#form-licencias-' + suf,
			$form: null,
			$anio_licencia: null
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
			'<form id="form-registro-licencias-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-licencia-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			table = 
				sigesop.tablaRegistro({
					head: 'AÑOS REGISTRADOS, INICIALIZADOR DE SECUENCIA',
					campo: 'anio_licencia, inicializador'
				});			

			doc.table.update_table = table.update_table; // enlazamos a vista publica
			doc.table.body = table.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + table.html;

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

			if ( localStorage.usuario === 'root' )
				items.consecutivo = {
	            	name: 'Agregar consecutivo inicializador', 
	            	icon: 'add',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			typeof opt.table.actions.consecutivo == 'function' ?
	        				opt.table.actions.consecutivo( index ):
	        				console.log( 'function consecutivo is null' );
	        		}
				}

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: items
			});
		},

		IDS = {
			idTabla: '#tabla-registro-licencia-' + suf,
			form: '#form-registro-licencias-' + suf
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

	documentConsecutivo : function ( opt ) {
		/* 
		 * id_libro_licencia
		 * success
		 * error
		 * anio		
		 */
		 
		if ( !opt.id_libro_licencia ) {
			throw new Error( '[id_libro_licencia] es requerido' );
		}

		var

		suf = opt.suf || '',

		anio = opt.anio ? ' (' + opt.anio + ')' : '',

		// index = 
		// 	!$.isEmptyObject( sesion.matrizLicencia ) && opt.valor ?
		// 		sigesop.indexOfObjeto( sesion.matrizLicencia, 'id_libro_licencia', opt.valor ) : -1,

		// anio = 	index != -1  ? 
		// 		' (' + sesion.matrizLicencia[ index ].anio_licencia + ')' : '',

		html = 
			'<form id="form-consecutivo-licencia-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">' +
					'<label class="control-label col-sm-3" for="">Consecutivo inicializador' + anio + ': </label>' +
					'<div class="col-sm-7">' +
						'<input name="consecutivo_licencia" id="consecutivo-licencia-' + suf + '" class="form-control" type="text"/>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btn-guardar-consecutivo-' + suf + '" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button type="reset"  id="btn-limpiar-consecutivo-' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>'+
				'</div>'+
			'</form>',

		javascript = function () {
			var 
			doc = this,
			datos = doc.datos,
			form = doc.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$consecutivo_licencia = $( datos.consecutivo_licencia.idHTML ),
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

		        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
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
			});

			/* Enlazar publicamente instancias jQuery de los campos
			 */	
			doc.IDS.$form = $form;
			doc.IDS.$consecutivo_licencia = $consecutivo_licencia;
			doc.IDS.$botonLimpiar = $botonLimpiar;

			$botonLimpiar.on( 'click', function( event ) {
				$form.formValidation( 'resetForm' );	
			});
		},

		datos = {
			consecutivo_licencia: {
				idHTML: '#consecutivo-licencia-' + suf,
				valor: null
			},
			id_libro_licencia: { valor: opt.id_libro_licencia }
		},

		IDS = {
			form: '#form-consecutivo-licencia-' + suf,
			botonGuardar: '#btn-guardar-consecutivo-' + suf,
			botonLimpiar: '#btn-limpiar-consecutivo-' + suf,			

			$form: null,
			$consecutivo_licencia: null,
			$botonLimpiar: null
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS
		};

		return doc;
	}
};