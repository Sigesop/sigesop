/* Cache de datos para manipulacion local
 *
 * [window.session.matrizEquipos]
 *
 */
sigesop.equipoGenerador = {
	document: function ( opt ) {
		/* obj
		 * suf
		 *
		 * ------
		 * window.sesion.matrizSistemas
		 */
		var
		suf = opt.suf || '',

		html =
			'<form id="form-equipo-generador-' + suf + '" class="form-horizontal" role="form" method="post">' +
				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Nombre Equipo:</label>' +
					'<div class="col-sm-7">' +
						'<input name="nombre_equipo_aero" id="nombre-equipo-' + suf + '" class="form-control input-md" placeholder="De 1 – 50 caracteres">' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">ID del Equipo:</label>' +
					'<div class="col-sm-7">' +
						'<input name="id_equipo_aero" id="id-equipo-' + suf + '" type="text" class="form-control input-md" placeholder="De 1 – 4 caracteres [- _ .] [0-9] [A-Z]" />' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<label class="col-sm-3 control-label">Sistema:</label>' +
					'<div class="col-sm-5">' +
						'<input name="id_sistema_aero" id="id-sistema-' + suf + '" class="form-control input-md" placeholder="De 1 – 2 caracteres [- _ .] [0-9] [A-Z]">' +
					'</div>' +
					'<div class="col-sm-2">' +
						'<button type="button" id="btn-sistema-' + suf + '" class="btn btn-primary">Seleccione sistema</button>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-3"></div>' +
					'<div class="col-sm-7">' +
						'<p>' +
							'<button type="submit" id="btn-guardar-nuevo-equipo-' + suf +
							'" class="btn btn-success"><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
							'<button type="reset"  id="btn-limpiar-nuevo-equipo-' + suf +
							'" class="btn btn-success"><span class="glyphicon glyphicon-repeat"></span> Limpiar</button>' +
						'</p>' +
					'</div>' +
				'</div>' +
			'</form>',

		dialog_sistema = function ( doc ) {
			var

			docS = sigesop.tablaSeleccion({
				// tipo: 'checkbox',
				// color_fila: 'success',
				color_select: 'success',
				head: 'ID SISTEMA, NOMBRE SISTEMA',
				campo: 'id_sistema_aero, nombre_sistema_aero'
			}),

			action = function () {
				/* Guardamos el id del sistema y ponenos el
				 * nombre del sistema en la caja
				 */
				if ( !$.isEmptyObject( docS.matrizInput ) ) {
					var
					index = sigesop.getDataRadio( docS.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
					sigesop.getDataRadio( docS.matrizInput[ 0 ] ) : -1;

					if ( index >= 0 ) {
						// doc.datos.id_sistema_aero.valor = window.sesion.matrizSistemas[ index ]['id_sistema_aero'];
						$( doc.datos.id_sistema_aero.idHTML ).val( window.sesion.matrizSistemas[ index ]['id_sistema_aero'] );
						doc.IDS.$form.formValidation( 'revalidateField', 'id_sistema_aero' );
						win.close();
						// $( win.idDiv ).modal( 'hide' );
					}

					else
						sigesop.msg( 'Info', 'Sistema no seleccionado' );
				}

				else
					console.log( '[docS.matrizInput] es nula' );
			},

		    win = BootstrapDialog.show({
		        title: 'Seleccione Sistema',
		        type: BootstrapDialog.TYPE_DEFAULT,
		        message: docS.html,
		        onshown: function ( dialog ) {
					sigesop.query({
						class: 'sistemasGenerador',
						query: 'obtenerSistemas',
						success: function( data ) {
							window.sesion.matrizSistemas = data;
							docS.update_table( data );
						}
					});
		        },
		        size: BootstrapDialog.SIZE_WIDE,
		        draggable: true,
		        buttons: [{
		            label: 'Cancelar',
		            cssClass: 'btn-danger',
		            action: function( dialog ) {
		                dialog.close();
		                doc.IDS.$form.formValidation( 'revalidateField', 'id_sistema_aero' );
		            }
		        }, {
		        	label: 'Aceptar',
		        	cssClass: 'btn-success',
		        	action: action
		        }]
		    });
		},

		limpiarCampos = function () {
			var datos = this.datos;
			$( datos.nombre_equipo_aero.idHTML ).val( '' );
			$( datos.id_equipo_aero.idHTML ).val( '' );
			$( datos.id_sistema_aero.idHTML ).val( '' );

			if( this.IDS.$form !== null )
				this.IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function () {
			var
			doc = this,
			datos = this.datos,
			form = doc.IDS.form,
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$nombre_equipo_aero = $( doc.datos.nombre_equipo_aero.idHTML ).toUpperCase(),
			$id_equipo_aero = $( doc.datos.id_equipo_aero.idHTML ).toUpperCase(),
			$id_sistema_aero = $( doc.datos.id_sistema_aero.idHTML ).toUpperCase(),
			$botonSistema = $( doc.datos.id_sistema_aero.boton ),
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
		            nombre_equipo_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.nombre_equipo_aero.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.nombre_equipo_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.nombre_equipo_aero.valor = null;
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
		                    	regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]*$/i,
		                    	message: 'Caracteres inválidos'
		                    }
		                }
		            },

		            id_equipo_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_equipo_aero.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.id_equipo_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.id_equipo_aero.valor = null;
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

		            id_sistema_aero: {
		            	onSuccess: function ( e, data ) {
		            		datos.id_sistema_aero.valor = data.element.val().toUpperCase();
		            	},
		            	onError: function ( e, data ) {
		            		datos.id_sistema_aero.valor = null;
		            	},
	                	onStatus: function ( e, data ) {
	                		if ( data.status === 'NOT_VALIDATED' )
	                			datos.id_sistema_aero.valor = null;
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
		                    	regexp: /^[-_.\w\s]*$/i,
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
			doc.IDS.$nombre_equipo_aero = $nombre_equipo_aero;
			doc.IDS.$id_equipo_aero = $id_equipo_aero;
			doc.IDS.$id_sistema_aero = $id_sistema_aero;
			doc.IDS.$botonSistema = $botonSistema;

			$botonSistema.on( 'click', function(event) {
				event.preventDefault();
				dialog_sistema( doc );
			});

			$botonLimpiar.on( 'click', function(event) {
				if( doc.IDS.$form !== null )
					doc.IDS.$form.formValidation( 'resetForm' );
			});

			/* Si el documento es para edicion, rellenar los datos
			 * pasados en la variable [opt.obj]
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;

				$nombre_equipo_aero.val( obj.nombre_equipo_aero );
				$id_equipo_aero.val( obj.id_equipo_aero );
				$id_sistema_aero.val( obj.id_sistema_aero );

				/* Guardamos el ID del equipo que se actualizará
				 */
				doc.datos.id_equipo_aero_update.valor = obj.id_equipo_aero;
			}
		},

		datos = {
			nombre_equipo_aero: {
				valor: null,
				idHTML: '#nombre-equipo-' + suf
			},
			id_equipo_aero: {
				valor : null,
				idHTML: '#id-equipo-' + suf
			},
			id_equipo_aero_update: { valor: null },
			id_sistema_aero: {
				valor : null,
				idHTML: '#id-sistema-' + suf,
				boton : '#btn-sistema-' + suf
			}
		},

		IDS = {
			botonGuardar: '#btn-guardar-nuevo-equipo-' + suf,
			botonLimpiar: '#btn-limpiar-nuevo-equipo-' + suf,
			form: '#form-equipo-generador-' + suf,
			$form: null,
			$botonLimpiar: null,
			$nombre_equipo_aero: null,
			$id_equipo_aero: null,
			$id_sistema_aero: null,
			$botonSistema: null
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
			'<form id="form-registro-equipos-generador-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-12 col-md-12" id="tabla-registro-equipos-generador-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			table =
				sigesop.tablaRegistro({
					head: 'ID EQUIPO, NOMBRE EQUIPO, SISTEMA ASOCIADO',
					campo: 'id_equipo_aero, nombre_equipo_aero, nombre_sistema_aero'
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
		},

		IDS = {
			idTabla: '#tabla-registro-equipos-generador-' + suf,
			form: '#form-registro-equipos-generador-' + suf
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

	registroReporte : function ( opt ) {
		var
			obj = opt.obj || {},
			suf = opt.suf || '';

		var
		html =
			'<form id="form-imprimir-reporte-' + suf + '" class="form-horizontal" role="form">'+

				'<div class="form-group">'+
					'<label class="control-label col-sm-5 ">Nombre del sistema: </label>'+
					'<div class="col-sm-2">'+
						'<select name="sistema" id="sistema-impresion-reporte-' + suf + '"class="form-control input-md"></select>' +
					'</div>'+
				'</div>'+
				'<div class="form-group">'+
					'<div class="col-sm-5 control-label"></div>'+
					'<p class="col-sm-7">'+
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
			$sistema = $( doc.datos.sistema.idHTML ),
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
		        	sistema: {
		                validators: {
		                    notEmpty: {
		                        message: 'Seleccione un nombre'
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
				head: 'ID EQUIPO, NOMBRE EQUIPO, SISTEMA ASOCIADO',
					campo: 'id_equipo_aero,nombre_equipo_aero,nombre_sistema_aero'
			});


			doc.table.update_table = tabla_reporte.update_table; // enlazamos a vista publica
			doc.table.body = tabla_reporte.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') ).innerHTML = '<br>' + tabla_reporte.html


			$botonImprimir.on( 'click', function ( event ) {
				var url = sigesop.raizServidor + 'ajax.php?class=equiposGenerador' +
					'&action=imprimir&id_sistema_aero=' + $sistema.val(),

					win = window.open( url );

				win.focus();
			 });
		},

		datos = {
			sistema:{
				idHTML: '#sistema-impresion-reporte-' + suf,
				valor: null
			} ,


		},

		IDS = {
			idTabla: '#tabla-impresion-reporte-' + suf,
			botonConsultar: '#btn-consulta-reporte-' + suf,
			botonImprimir: '#btn-imprimir-reporte-' + suf,
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
	}
}