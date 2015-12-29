/* Cache de datos para manipulacion local
 *
 * [window.session.matrizGeneradores]
 * [window.session.matrizUnidades]
 *
 */
sigesop.generadores = {
	document: function( opt ) {
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
						'<input name="capacidad_efectiva_aero" id="capacidad-efectiva-' + suf + '" class="form-control input-md" placeholder="Defina capacidad efectiva del Aerogenerador (Números enteros y decimales)">'+
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
			doc                      = this,
			datos                    = this.datos,
			form                     = this.IDS.form,
			$botonLimpiar            = $( doc.IDS.botonLimpiar ),
			$numero_unidad           = $( datos.numero_unidad.idHTML ),
			$numero_aero             = $( datos.numero_aero.idHTML ).toUpperCase(),
			$capacidad_efectiva_aero = $( datos.capacidad_efectiva_aero.idHTML ),
			$form                    = $( form )
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
		            		datos.numero_aero.valor = data.element.val().toUpperCase();
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
		                    	max: 50,
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

				/* Guardamos el ID que se actualizará
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

	registeredGeneratorDocument: function ( opt ) {
		var

		that = this,

		struct_document = function () {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/

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
				$('<div class="form-group"></div>' )
				.append( IDS.$tableContent )
			)
		},

		javascript = function () {
			var IDS   = this.IDS,
				table = IDS.$tableContent.dataTable({
					head    : 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
					campo   : 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion',
					addClass: {
						body: {
							class: 'warning, danger, info, success, success',
							campo: 'estado_licencia, estado_licencia, estado_licencia, estado_licencia, estado_licencia',
							valor: 'C.A., FALLA, MTTO, F.A., DISPONIBLE'
						}
					},
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
				$content     : null,
				$tableContent: null
			},
			table: {
				update_table: null
			}
		};

		doc.factory = factory.bind( doc );

		return doc;
	},

	registroReporte : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var
		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">'+
					'<label class="control-label col-sm-5 ">No. de Unidad: </label>'+
					'<div class="col-sm-2">'+
						'<select name="numero_unidad" id="numero-unidad-impresion-reporte-' + suf + '"class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+
				'<div class="form-group">'+
					'<div class="col-sm-5 control-label"></div>'+
					'<p class="col-sm-7">'+
						//'<button type="button" id="btn-imprimir-reporte-2' + suf + '" class="btn btn-success" > <span></span> Reporte general</button>  '+
						'<button type="submit" id="btn-consulta-reporte-' + suf + '" class="btn btn-success"  data-loading-text="Buscando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Consultar</button> ' +
						'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" disabled> <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir</button>'+
					'</p>'+
				'</div>'+

				'<div id="tabla-impresion-reporte-' + suf + '" class="form-group"> </div>'+

				'</form>',

		javascript = function () {
			var
			doc = this,
			form = doc.IDS.form,
			$numero_unidad = $( doc.datos.numero_unidad.idHTML ),
			$botonConsultar = $( doc.IDS.botonConsultar ),
			$botonImprimir = $( doc.IDS.botonImprimir ),
			$form = $( form )
			.formValidation({
				// live: 'submit',
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
		        	numero_unidad: {
		                validators: {
		                    notEmpty: {
		                        message: 'Seleccione unidad de generador'
		                    	}
		                	}
		                },
		        }
			})
			.on( 'success.form.fv', function( e ) { $botonImprimir.prop( 'disabled', false ); })
	        .on( 'err.field.fv', function( e ) { $botonImprimir.prop( 'disabled', true ); })
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });

			doc.IDS.$form = $form;

			var tabla_reporte =
			sigesop.tablaRegistro({
				suf: '_reporte',
				head: 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
					campo: 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion',
			});


			doc.table.update_table = tabla_reporte.update_table; // enlazamos a vista publica
			doc.table.body = tabla_reporte.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') ).innerHTML = '<br>' + tabla_reporte.html


			$botonImprimir.on( 'click', function ( event ) {

				var url = sigesop.raizServidor + 'ajax.php?class=generadores' +
					'&action=imprimir'+'&option=unidad' + '&numero_unidad=' + $numero_unidad.val(),
					//console.log(url);
				 	win = window.open( url );

				 win.focus();

			 });

			// $botonConsultar.on( 'click', function ( event ) {

			// 	var url = sigesop.raizServidor + 'ajax.php?class=generadores' +
			// 		'&action=imprimir&option=general',

			// 		win = window.open( url );

			// 	win.focus();

			//  });
		},

		datos = {
			numero_unidad:{
				idHTML: '#numero-unidad-impresion-reporte-' + suf,
				valor: null
			}
		},

		IDS = {
			idTabla: '#tabla-impresion-reporte-' + suf,
			botonConsultar: '#btn-consulta-reporte-' + suf,
			botonImprimir: '#btn-imprimir-reporte-' + suf,
			// botonImp2: '#btn-imprimir-reporte-2' + suf,
			form: '#form-imprimir-reporte-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			table: {
				body: null,
				update_table: null
			}
		}

		return doc;
	},

	generatorReport : function ( opt ) {
		var

		that = this,

		struct_document = function () {
			var IDS = this.IDS;

			/*********************************
			 ** JQuery objects
			 ********************************/
			IDS.$tableContent = $('<div></div>')
				.addClass( 'col-sm-12 col-md-12' );

			 IDS.$numero_unidad = $('<select></select>')
			 	.addClass('form-control input-md')
			 	.prop( 'name', 'numero_unidad' );

			var $botonConsultar = $('<button></button>')
				.prop( 'type', 'submit' )
				.addClass( 'btn btn-success' )
				.html( 'Consultar' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' );

			IDS.$botonImprimir = $( '<button></button>' )
				.prop( 'type', 'button' )
				.addClass( 'btn btn-success' )
				.html( 'Imprimir' )
				.append( '&nbsp;<span class="glyphicon glyphicon-floppy-disk"></span>' )

			/* Estructuring document form
			 */

			IDS.$form = $( '<form></form>' )
				.attr( 'role', 'form' )
				.addClass( 'form-horizontal' )

			.append(
				$('<div class="form-group"></div>')
				.append(
					$('<label class="control-label col-sm-5"></label>')
					.html( 'No. de Unidad: ' )
				)
				.append(
					$('<div class="col-sm-2"></div>')
					.append( IDS.$numero_unidad )
				)
			)

			.append(
				$('<div class="form-group"></div>' )
				.append(
					$('<p class="col-sm-offset-5 col-sm-7"></p>')
					.append( $botonConsultar )
					.append('&nbsp;')
					.append( IDS.$botonImprimir )
				)
			)

			.append(
				$('<div class="form-group"></div>' )
				.append( IDS.$tableContent )
			)
		},

		javascript = function () {
			var IDS   = this.IDS,
				datos = this.datos;

			IDS.$form.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	typeof opt.success == 'function' ?
		        		opt.success( datos, IDS ) :
		        		console.log( 'success is null' );

		        	IDS.$form.data( 'formValidation' ).disableSubmitButtons( false );
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
		                        message: 'Seleccione unidad de generador'
		                    	}
		                	}
		                },
		        }
			})
			.on( 'success.form.fv', function( e ) { IDS.$botonImprimir.prop( 'disabled', false ); })
	        .on( 'err.field.fv', function( e ) { IDS.$botonImprimir.prop( 'disabled', true ); })
			.on( 'success.field.fv', function( e, data ) { data.fv.disableSubmitButtons( false ); });

			var table = IDS.$tableContent.dataTable({
				head: 'NUMERO DE AEROGENERADOR, NUMERO DE UNIDAD, ESTADO LICENCIA, CAPACIDAD EFECTIVA, FECHA DE OPERACION',
				campo: 'numero_aero, numero_unidad, estado_licencia, capacidad_efectiva_aero, fecha_operacion',
				addClass: {
					body: {
						class: 'warning, danger, info, success, success',
						campo: 'estado_licencia, estado_licencia, estado_licencia, estado_licencia, estado_licencia',
						valor: 'C.A., FALLA, MTTO, F.A., DISPONIBLE'
					}
				}
			})
			.factory();

			doc.table.update_table = table.update_table; // enlazamos a vista publica

			IDS.$botonImprimir.on( 'click', function ( event ) {
				var url = sigesop.raizServidor + 'ajax.php?class=generadores' +
					'&action=imprimir'+'&option=unidad' + '&numero_unidad=' + datos.numero_unidad.valor,
					//console.log(url);
				 	win = window.open( url );

				 win.focus();
			 });
		},

		datos = {
			numero_unidad: { valor: null }
		},

		factory = function () {
			var IDS = this.IDS;

			struct_document.call( this );
			if ( typeof this !== 'undefined' ) {
				$( that ).append( IDS.$form );
				javascript.call( this );
			}

			return this;
		},

		doc = {
			datos: datos,
			IDS: {
				$form          : null,
				$tableContent  : null,

				$form          : null,
				$numero_unidad : null,
				$botonConsultar: null,
				$botonImprimir : null
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
	registeredGeneratorDocument: sigesop.generadores.registeredGeneratorDocument,
	generatorReport            : sigesop.generadores.generatorReport
});
