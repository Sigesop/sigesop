/* Cache de datos para manipulacion local
 *
 * [window.session.matrizGeneradores]
 * [window.session.matrizUnidades]
 * 
 */
sigesop.generadores = {
	document: function( opt ) 
	{
		var 

		suf = opt.suf || '',

		html =
			'<form id="form-generador-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Número de unidad:</label>'+
					'<div class="col-sm-7">'+
						'<select name="numero_unidad" id="numero-unidad-' + suf + 
						'" class="form-control input-md" ></select>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Numero aerogenerador:</label>'+
					'<div class="col-sm-7">'+
						'<input name="numero_aero" id="numero-generador-' + suf + 
						'" class="form-control input-md" placeholder="Ingrese nombre del generador ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])">'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Capacidad efectiva</label>'+
					'<div class="col-sm-7">'+
						'<input name="capacidad_efectiva_aero" id="capacidad-efectiva-' + suf + '" class="form-control input-md eventoCambioEsNumero" placeholder="Defina capacidad efectiva del Aerogenerador (Números enteros y decimales)">'+
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<div class="col-sm-3 control-label"></div>' +
					'<p class="col-sm-7">' +
						'<button type="submit" id="btn-guardar-generador-' + suf + 
						'" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
						'<button type="reset"  id="btn-limpiar-generador-' + suf + 
						'" class="btn btn-success "><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
					'</p>' +
				'</div>' +
			'</form>',

		limpiarCampos = function () {
			var IDS = this.IDS;
			IDS.$numero_unidad.val( '' );
			IDS.$numero_aero.val( '' );
			IDS.$capacidad_efectiva_aero.val( '' );
			IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc = this,
			datos = this.datos,
			form = this.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$numero_unidad = $( datos.numero_unidad.idHTML ),
			$numero_aero = $( datos.numero_aero.idHTML ),
			$capacidad_efectiva_aero = $( datos.capacidad_efectiva_aero.idHTML ),
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
		            		var val = data.element.val().toUpperCase();
		            		datos.numero_aero.valor = val;
		            		data.element.val( val );
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
		                    },
		                    stringLength: {
		                    	max: 4,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[-_.\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            capacidad_efectiva_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.capacidad_efectiva_aero.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.capacidad_efectiva_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.capacidad_efectiva_aero.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-+]?[0-9]*\.?[0-9]+\b$/,
		                    	message: 'Caracteres inválidos'
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
			doc.IDS.$numero_unidad = $numero_unidad;
			doc.IDS.$numero_aero = $numero_aero;
			doc.IDS.$capacidad_efectiva_aero = $capacidad_efectiva_aero;

			$botonLimpiar.on( 'click', function ( event ) {
				$form.formValidation( 'resetForm' );
			});

			/* Si el documento es para edicion, rellenar los datos
			 * pasados en la variable [opt.obj]
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;

				sigesop.query({
					class: 'unidades',
					query: 'obtenerUnidades',
					success: function(data) {
						window.sesion.matrizUnidades = data;
						sigesop.combo({
							arr: data, 
							elem: datos.numero_unidad.idHTML, 
							campo: 'numero_unidad'
						});

						$numero_unidad.val( obj.numero_unidad );
					}
				});
				
				$numero_aero.val( obj.numero_aero );
				$capacidad_efectiva_aero.val( obj.capacidad_efectiva_aero );

				/* Guardamos el ID del equipo que se actualizará				
				 */
				datos.numero_aero_update.valor = obj.numero_aero;
			}
		},

		datos = {
			numero_unidad: {
				valor: null,				
				idHTML: '#numero-unidad-' + suf
			},
			numero_aero_update: { valor: null },
			numero_aero: {
				valor: null,
				idHTML: '#numero-generador-' + suf
			},
			capacidad_efectiva_aero: {
				valor: null,
				idHTML: '#capacidad-efectiva-' + suf
			}					
		},

		IDS = {
			botonGuardar: '#btn-guardar-generador-' + suf,
			botonLimpiar: '#btn-limpiar-generador-' + suf,
			form: '#form-generador-' + suf,
			$form: null,
			$botonLimpiar: null,
			$numero_unidad: null,
			$numero_aero: null,
			$capacidad_efectiva_aero: null
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
			'<form id="form-registro-generador-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-generador-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			table = 
				sigesop.tablaRegistro({
					head: 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
					campo: 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion',
					addClass: {
						body: {
							class: 'warning, danger, info, success, success',
							campo: 'estado_licencia, estado_licencia, estado_licencia, estado_licencia, estado_licencia',
							valor: 'C.A., FALLA, MTTO, F.A., DISPONIBLE'
						}
					}
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
			idTabla: '#tabla-registro-generador-' + suf,
			form: '#form-registro-generador-' + suf
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