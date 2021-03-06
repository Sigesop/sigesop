/* Cache de datos para manipulacion local
 *
 * [window.session.matrizTipoMantto]
 *
 */
sigesop.tipoMantenimiento = {
	document: function ( opt ) {
		var
		suf = opt.suf || '',

		html =
			'<form id="form-tipo-mantenimiento-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">Nombre Mantenimiento:</label>'+
					'<div class="col-sm-7">'+
						'<input name="nombre_mantenimiento" id="nombre-mantenimiento-' + suf +
						'" class="form-control input-md" ' +
						'placeholder="Ingrese nombre del nuevo tipo de mantenimiento"></input>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<label class="col-sm-3 control-label">ID Mantenimiento:</label>'+
					'<div class="col-sm-7">'+
						'<input name="id_mantenimiento" id="id-mantenimiento-' + suf +
						'" class="form-control input-md" ' +
						'placeholder="Ingrese ID del mantenimiento (2 Caracteres)"></input>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Frecuencia:</label>' +
					'<div class="col-sm-3">' +
						'<input name="numero_frecuencia" id="numero-frecuencia-' + suf + '" class="form-control input-md" ' +
						'placeholder="Frecuencia"></input>' +
					'</div>' +
					'<div class="col-sm-4">' +
						'<select name="tipo_frecuencia" id="tipo-frecuencia-' + suf + '" class="form-control">' +
							'<option value="">' + sigesop.seleccioneOpcion + '</option>' +
							'<option value="d">DIAS</option>' +
							'<option value="M">MESES</option>' +
							'<option value="y">AÑOS</option>' +
						'</select>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-3 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="submit" id="btn-guardar-tipo-mantenimiento-' + suf +
						'" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> '+
						'<button type="reset"  id="btn-limpiar-tipo-mantenimiento-' + suf +
						'" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>'+
					'</p>'+
				'</div>'+
			'</form>',

		limpiarCampos = function () {
			var IDS = this.IDS;
			IDS.$nombre_mantenimiento.val('');
			IDS.$id_mantenimiento.val('');
			IDS.$numero_frecuencia.val('');
			IDS.$tipo_frecuencia.val('');

			if( IDS.$form !== null )
				IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc                   = this,
			datos                 = this.datos,
			form                  = this.IDS.form,
			$botonLimpiar         = $( doc.IDS.botonLimpiar ),
			$nombre_mantenimiento = $( datos.nombre_mantenimiento.idHTML ).toUpperCase(),
			$id_mantenimiento     = $( datos.id_mantenimiento.idHTML ).toUpperCase(),
			$numero_frecuencia    = $( datos.numero_frecuencia.idHTML ),
			$tipo_frecuencia      = $( datos.tipo_frecuencia.idHTML ),
			$form                 = $( form )
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
		            nombre_mantenimiento: {
		            	onSuccess: function ( e, data ) {
		            		datos.nombre_mantenimiento.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.nombre_mantenimiento.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.nombre_mantenimiento.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	max: 30,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            id_mantenimiento: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_mantenimiento.valor = data.element.val().toUpperCase();
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
		                    },
		                    stringLength: {
		                    	max: 2,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            numero_frecuencia: {
		            	onSuccess: function ( e, data ) {
		            		datos.numero_frecuencia.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.numero_frecuencia.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.numero_frecuencia.valor = null;
	                	},
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                    	message: 'Caracteres inválidos, sólo números'
		                    }
		                }
		            },

		            tipo_frecuencia: {
		            	onSuccess: function ( e, data ) {
		            		datos.tipo_frecuencia.valor = data.element.val();
		            	},
		            	onError: function ( e, data ) {
		            		datos.tipo_frecuencia.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.tipo_frecuencia.valor = null;
	                	},
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

			/* Enlazar publicamente instancias jQuery de los campos
			 */
			doc.IDS.$form = $form;
			doc.IDS.$botonLimpiar = $botonLimpiar;
			doc.IDS.$nombre_mantenimiento = $nombre_mantenimiento;
			doc.IDS.$id_mantenimiento = $id_mantenimiento;
			doc.IDS.$numero_frecuencia = $numero_frecuencia;
			doc.IDS.$tipo_frecuencia = $tipo_frecuencia;

			$botonLimpiar.on( 'click', function ( event ) {
				$form.formValidation( 'resetForm' );
			});

			$numero_frecuencia.spinner({
				spin: function ( event, ui )
				{
					if ( $.isNumeric( ui.value ) ) {
						if (ui.value <= 0) {
							$( this ).spinner('value', 1);
							return false;
						}
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'numero_frecuencia' );
				}
			});

			/* Si el documento es para edicion, rellenar los datos
			 * pasados en la variable [opt.obj]
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;

				$nombre_mantenimiento.val( obj.nombre_mantenimiento );
				$id_mantenimiento.val( obj.id_mantenimiento );
				$numero_frecuencia.val( obj.numero_frecuencia );
				$tipo_frecuencia.val( obj.tipo_frecuencia );

				/* Guardamos el ID del equipo que se actualizará
				 */
				datos.id_mantenimiento_update.valor = obj.id_mantenimiento;
			}
		},

		datos = {
			nombre_mantenimiento: {
				valor: null,
				idHTML: '#nombre-mantenimiento-' + suf
			},
			id_mantenimiento: {
				valor: null,
				idHTML: '#id-mantenimiento-' + suf
			},
			id_mantenimiento_update: { valor: null },
			numero_frecuencia: {
				valor: null,
				idHTML: '#numero-frecuencia-' + suf
			},
			tipo_frecuencia: {
				valor: null,
				idHTML: '#tipo-frecuencia-' + suf
			}
		},

		IDS = {
			botonGuardar         : '#btn-guardar-tipo-mantenimiento-' + suf,
			botonLimpiar         : '#btn-limpiar-tipo-mantenimiento-' + suf,
			form                 : '#form-tipo-mantenimiento-' + suf,
			$form                : null,
			$nombre_mantenimiento: null,
			$id_mantenimiento    : null,
			$numero_frecuencia   : null,
			$tipo_frecuencia     : null
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
			'<form id="form-registro-tipo-mantenimiento-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-5 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" > <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir Reporte de los tipos de mantenimiento</button>'+
					'</p>'+
				'</div>'+

				'<div class="form-group">' +
					'<div class="col-sm-12 col-md-12" id="tabla-registro-tipo-mantenimiento-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			$botonImprimir = $( doc.IDS.botonImprimir ),
			table =
				sigesop.tablaRegistro({
					head: 'ID, NOMBRE MANTENIMIENTO, FRECUENCIA, TIPO FRECUENCIA',
					campo: 'id_mantenimiento, nombre_mantenimiento, numero_frecuencia, tipo_frecuencia'
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
			});

			$botonImprimir.on( 'click', function ( event ) {
				var url = sigesop.raizServidor + 'ajax.php?class=listaVerificacion' +
					'&action=imprimirTipoMtto',
					win = window.open( url );
				win.focus();
			});
		},

		IDS = {
			botonImprimir: '#btn-imprimir-reporte-' + suf,
			idTabla: '#tabla-registro-tipo-mantenimiento-' + suf,
			form: '#form-registro-tipo-mantenimiento-' + suf
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
};