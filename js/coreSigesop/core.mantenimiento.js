sigesop.mantenimiento = {
	document: function ( opt )
	{
		/* suf
		 * obj
		 * success
		 * error
		 */

		var
			obj = opt.obj || {},
			suf = opt.suf || '';
				
		// -------------------- Estructura HTML del documento

		var 
			html =
				'<div class="panel panel-success">' +
					'<div class="panel-heading">Datos de la orden de trabajo</div>' +
					'<br>' +

					'<form id="formCrearMantto' + suf + '" class="form-horizontal" role="form">' +				
						'<div class="form-group">' +
						'	<label class="control-label col-sm-3">Unidad: </label>' +
						'	<div class="col-sm-7">' +
						'		<select name="numero_unidad" id="numero_unidad' + suf + '" class="form-control"></select>' +
						'	</div>' +
						'</div>' +

						'<div class="form-group">' +
						'	<label class="control-label col-sm-3">Aerogenerador: </label>' +
						'	<div class="col-sm-7">' +
						'		<select name="numero_aero" id="numero_aero' + suf + '" class="form-control"></select>' +
						'	</div>' +
						'</div>' +
							
						'<div class="form-group">' +
						'	<label for="" class="control-label col-sm-3">Tipo Mantenimiento: </label>' +
						'	<div class="col-sm-7">' +
						'		<select name="id_mantenimiento" id="id_mantenimiento' + suf + '" class="form-control"></select>' +
						'	</div>' +
						'</div>' +

						'<div class="form-group">' +
						'	<label for="" class="control-label col-sm-3">Duración: </label>' +
						'	<div class="col-sm-3">' +
						'		<input name="duracion" id="duracion' + suf + '" class="form-control" >' +
						'	</div>' +
						'	<div class="col-sm-4">' +
						'		<select name="magnitud_duracion" id="magnitud_duracion' + suf + '" class="form-control" >' +
						'			<option value="">' + sigesop.seleccioneOpcion + '</option>' +
						'			<option value="d">DIAS</option>' +
						'			<option value="M">MESES</option>' +
						'			<option value="y">AÑOS</option>' +
						'		</select>' +
						'	</div>' +
						'</div>' +

						'<div class="form-group">' +
						'	<label for="" class="control-label col-sm-3">Periodo de Programación Inicial: </label>' +
						'	<div class="col-sm-4">' +
						'			<input name="fecha_inicial" id="fecha_inicial' + suf + '" type="text" class="form-control">' +
						'	</div>' +
						'</div>' +

						'<div class="form-group">' +
						'	<label for="" class="control-label col-sm-3">Periodo de Programación Final: </label>' +
						'	<div class="col-sm-4">' +
						'			<input name="fecha_final" id="fecha_final' + suf + '" type="text" class="form-control">' +
						'	</div>' +
						'</div>' +				

						'<div class="form-group">' +
						'	<label class="control-label col-sm-3">Trabajo solicitado: </label>' +
						'	<div class="col-sm-7">' +
						'		<textarea name="trabajo_solicitado" id="trabajo_solicitado' + suf + '" class="form-control eventoCambioMayuscula' + suf + '" ></textarea>' +
						'	</div>' +
						'</div>' +
								
						'<div class="form-group">' +
						'	<div class="col-sm-3 control-label"></div>' +
						'	<p class="col-sm-9">' +
						'		<button type="submit" id="btnGenerarOrdenes' + suf + '" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Generar</button>' +
						'		<button type="reset" id="btnLimpiarFormOrdenes' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'	</p>' +
						'</div>' +

					'</form>' +
				'</div>',

			javascript = function ()
			{
				sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

				var 
				form = this.IDS.form,
				$numero_unidad = $( this.datos.numero_unidad.idHTML ),
				$numero_aero = $( this.datos.numero_aero.idHTML ),
				$id_mantenimiento = $( this.datos.id_mantenimiento.idHTML ),
				$duracion = $( this.datos.duracion.idHTML ),
				$fecha_inicial = $( this.datos.fecha_inicial.idHTML ),
				$fecha_final = $( this.datos.fecha_final.idHTML ),
				$form = $( form ).formValidation({
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },

			        onSuccess: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, limpiarCampos ) :
			        		console.log( 'success is null' );
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
			                        message: 'Seleccione número de unidad'
			                    }
			                }
			            },
			            numero_aero: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione número de aerogenerador'
			                    }
			                }
			            },
			            id_mantenimiento: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione un tipo de Mantenimiento'
			                    }
			                }
			            },
			            duracion: {
			                validators: {
			                    notEmpty: {
			                        message: 'Agregue duracion de mantenimiento'
			                    },
			                    integer: {
			                        message: 'Sólo números enteros'
			                    }
			                }
			            },
			            magnitud_duracion: {
			                validators: {
			                    notEmpty: {
			                        message: 'Seleccione magnitud de duración'
			                    }
			                }
			            },
			            fecha_inicial: {
			                validators: {
			                    notEmpty: {
			                        message: 'Es necesaria la fecha de inicio de periodo'
			                    },
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Escriba un formato de fecha válido'
                                }
			                }
			            },
			            fecha_final: {
			                validators: {
			                    notEmpty: {
			                        message: 'Es necesaria la fecha de fin de periodo'
			                    },
                                date: {
                                	format: 'DD-MM-YYYY',
                                	message: 'Escriba un formato de fecha válido'
                                }
			                }
			            },
			            trabajo_solicitado: {
			                validators: {
			                    notEmpty: {
			                        message: 'Agregue la descripcion del trabajo solicitado'
			                    },
			                    regexp: {
			                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
			                        message: 'Caracteres inválidos'
			                    }
			                }
			            },				            
			        }
				})
				.on( 'success.field.fv', function( e, data ) {
					data.fv.disableSubmitButtons( false );
				});

				this.IDS.$form = $form;

				$numero_unidad.change( function ()
				{
					$numero_aero.empty();

					var valorUnidad = $( this ).val();
					if ( valorUnidad )
					{
						sigesop.query({
							data: { numero_unidad: valorUnidad },
							class: 'generadores',
							query: 'obtenerGeneradores',
							queryType: 'sendGetData',
							success: function ( data ) 
							{
								$numero_aero.combo({
									arr: data, 
									campo: 'numero_aero'
								});	

								$form.formValidation( 'revalidateField', 'numero_aero' );							
							}
						});
					}

					else doc.datos.numero_unidad.valor = null;
				});

				$numero_aero.change( function ( event ) 
				{
					var val = $numero_aero.val().trim();						

					if ( val ) 
					{
						sigesop.query({
							data: { numero_aero: val, option: 'ultima_orden' },
							class: 'mantenimiento',
							query: 'obtenerOrdenTrabajo',
							queryType: 'sendGetData',
							success: function ( data ) 
							{
								window.sesion.matrizOrdenesPorGenerador = data;
								$id_mantenimiento.val( '' );
								$form.formValidation( 'revalidateField', 'id_mantenimiento' );
								
								// ----------

								// $fecha_inicial.prop( 'disabled', false );
								// $fecha_inicial.val( '' );
								// data != null ? $( doc.datos.numero_aero.idHTML ).prop('disabled', false) : null;
							}
						});					
					}
					else 
					{
						// doc.datos.numero_aero.valor = null;
						$id_mantenimiento.val( '' );
						$form.formValidation( 'revalidateField', 'id_mantenimiento' );
						// $id_mantenimiento.prop('disabled', true);
						
						// ----------

						// $fecha_inicial.prop( 'disabled', false );
						// $fecha_inicial.val( '' );
					}
				});

				$id_mantenimiento.change( function ( event ) { change_id_mantenimiento.call( $id_mantenimiento, $fecha_inicial ); });

				$duracion.spinner({
					spin: function (event, ui) 
					{
						if ( $.isNumeric( ui.value ) ) 
						{
							if (ui.value <= 0) {
								$( this ).spinner('value', 1);
								return false;
							}
						}
					},
					change: function ( event, ui ) {
						$form.formValidation( 'revalidateField', 'duracion' );
					}
				});

				$fecha_inicial.val( moment().format( 'DD-MM-YYYY' ) );
				$fecha_inicial.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						$form.formValidation( 'revalidateField', 'fecha_inicial' );
					}
				})
				.on( 'success.field.fv', function ( e, data ) {
					var 
						fecha_1 = moment( $fecha_inicial.val(), 'DD-MM-YYYY' ),
						fecha_2 = moment( $fecha_final.val(), 'DD-MM-YYYY' );

					if( $fecha_inicial.val() && $fecha_final.val() )
						if ( fecha_2.isBefore( fecha_1 ) )
						{			
							$form.data( 'formValidation' ).updateStatus( 'fecha_inicial', 'INVALID' );
							$fecha_inicial.val('');
							sigesop.msg( 'Advertencia', 'Fecha fuera de rango', 'warning' );
						}
				});

				$fecha_final.datepicker({
					defaultDate: "+1w",
					changeMonth: true,
					changeYear: true,
					numberOfMonths: 3,
					dateFormat: 'dd-mm-yy',
					showAnim: 'slide',
					onClose: function( selectedDate ) {
						$form.formValidation( 'revalidateField', 'fecha_final' );
					}
				})
				.on( 'success.field.fv', function ( e, data ) {
					var 
						fecha_1 = moment( $fecha_inicial.val(), 'DD-MM-YYYY' ),
						fecha_2 = moment( $fecha_final.val(), 'DD-MM-YYYY' );

					if( $fecha_inicial.val() && $fecha_final.val() )
						if ( fecha_2.isBefore( fecha_1 ) )
						{			
							$form.data( 'formValidation' ).updateStatus( 'fecha_final', 'INVALID' );
							$fecha_final.val('');
							sigesop.msg( 'Advertencia', 'Fecha fuera de rango', 'warning' );
						}
				});

				$( this.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
			},

			change_id_mantenimiento = function ( $fecha_inicial )
			{
				var valor = this.val();
				if ( valor ) 
				{
					/* buscamos la fecha de la ultima orden 
					 * del id_mantenimiento seleccionado
					 */
					
					if ( !$.isEmptyObject ( window.sesion.matrizTipoMantto ) && 
						 !$.isEmptyObject ( window.sesion.matrizOrdenesPorGenerador ) ) 
					{
						var indice = sigesop.indexOfObjeto( window.sesion.matrizOrdenesPorGenerador, 'id_mantenimiento', valor );
						if( indice != -1 )
						{
							var fechaServidor = window.sesion.matrizOrdenesPorGenerador[ indice ].fecha_programada,
								fechaLocal = moment( fechaServidor ).format( 'DD-MM-YYYY' );									
							
							/* ponemos la fecha en la caja, los datos y la deshabilitamos
							 */
							// doc.datos.fecha_inicial.valor = fechaLocal;
							$fecha_inicial.val( fechaLocal );
							$fecha_inicial.prop( 'disabled', true );
						}
						else
						{
							// doc.datos.fecha_inicial.valor = null;
							$fecha_inicial.val('');
							$fecha_inicial.prop( 'disabled', false );
						}
					}

					else 
					{
						$fecha_inicial.val('');
						$fecha_inicial.prop( 'disabled', false );
						console.log( 'matrizTipoMantto o matrizOrdenesPorGenerador se encuentra nulo' );
					}
				}
			},

			limpiarCampos = function ()
			{
				$( doc.datos.numero_unidad.idHTML ).val( '' );
				$( doc.datos.numero_aero.idHTML ).val( '' );
				$( doc.datos.id_mantenimiento.idHTML ).val( '' );    
				$( doc.datos.duracion.idHTML ).val( '' );
				$( doc.datos.magnitud_duracion.idHTML ).val('');
				$( doc.datos.fecha_inicial.idHTML ).val( moment().format( 'DD-MM-YYYY' ) );
				$( doc.datos.fecha_final.idHTML ).val( '' );
				$( doc.datos.trabajo_solicitado.idHTML ).val( '' );				
				vaciarDatos();
			},

			vaciarDatos = function ()
			{
				$( doc.datos.fecha_inicial.idHTML ).prop( 'disabled', false );
				doc.datos.numero_unidad.valor = null;
				doc.datos.numero_aero.valor = null;
				doc.datos.id_mantenimiento.valor = null;
				doc.datos.duracion.valor = null;
				doc.datos.magnitud_duracion.valor = null;
				doc.datos.fecha_inicial.valor = null;
				doc.datos.fecha_final.valor = null;
				doc.datos.trabajo_solicitado.valor = null;
	
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			datos = {
				numero_unidad: {
					valor: null,
					idHTML: '#numero_unidad' + suf
				},

				numero_aero: {
					valor: null,
					idHTML: '#numero_aero' + suf
				},

				id_mantenimiento: {
					valor: null,
					idHTML: '#id_mantenimiento' + suf
				},

				duracion: {
					valor: null,
					idHTML: '#duracion' + suf
				},

				magnitud_duracion: {
					valor: null,
					idHTML: '#magnitud_duracion' + suf
				},

				fecha_inicial: {
					valor: null,
					idHTML: '#fecha_inicial' + suf
				},

				fecha_final: {
					valor: null,
					idHTML: '#fecha_final' + suf
				},

				trabajo_solicitado: {
					valor: null,
					idHTML: '#trabajo_solicitado' + suf
				}
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: {
					$form: null,
					form: '#formCrearMantto' + suf,					
					botonGuardar: '#btnGenerarOrdenes' + suf,
					botonLimpiar: '#btnLimpiarFormOrdenes' + suf
				}
			};

		return doc;
	},

	documentoRegistro: function ( opt )
	{
		var suf = opt.suf || '';

		var 
			html =
				'<form id="formRegistroMantto' + suf + '">' +
					'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
						'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
							'<span aria-hidden="true">×</span>' +
						'</button>' +
						'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
					'</div>' +

					'<div class="form-group">' +					
						'<div class="col-sm-12 col-md-12" id="tabla_registro_mantto' + suf + '"></div>' +
					'</div>' +
				'</form>',

			javascript = function () {
				var
				tabla = sigesop.tablaRegistro({
					suf: 	'_Rmtto',
					head: 	'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, ' +
							'SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, ' +
							'FECHA REPROGRAMADA',
					campo: 	'numero_orden, trabajo_solicitado, nombre_mantenimiento, ' +
							'orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, ' +
							'orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada'
				});
				
				this.table.update_table = tabla.update_table; // enlazamos a vista publica
				this.table.body = tabla.IDS.body;
				document.getElementById( this.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + tabla.html

				$( tabla.IDS.body ).contextMenu({
					selector: 'tr',
					items: {
			            insertar: 
			            {
			            	name: 'Asignar orden de trabajo', 
			            	icon: 'user',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.insertar == 'function' ?
			        				opt.table.actions.insertar( index ):
			        				console.log( 'function insertar is null' );
			        		}
			            },
			            programacion: 
			            {
			            	name: 'Ver programación de mantenimiento', 
			            	icon: 'copy',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).index();
			        			typeof opt.table.actions.programacion == 'function' ?
			        				opt.table.actions.programacion( index ):
			        				console.log( 'function programacion is null' );
			        		}
			            }
					}
				});
			},

			IDS = {
				idTabla: '#tabla_registro_mantto' + suf,
				form: '#formRegistroMantto' + suf
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

	documentoVistaPreliminar: function ( suf )
	{
		// ---------- ID de los botones

		var botonGuardar = 'btnGuardarOrdenes' + suf,
			grafica = 'graf' + suf;

		html = '' +
			'<form class="form-horizontal" role="form">' +
			'	<div id="' + grafica + '" class="text-center" > <h4> CARGANDO DATOS... </h4></div> <br><br>' +

			'	<div class="form-group">' +
			'		<div class="col-sm-2 control-label"></div>' +
			'		<p class="col-sm-9">' +
			'			<button id="' + botonGuardar + '" type="submit" class="btn btn-success" data-loading-text="Cargando Ordenes..."> <span class="glyphicon glyphicon-floppy-disk"></span> Autorizar Ordenes</button>' +
			'		</p>' +
			'	</div>' +
			
			'</form>';
		
		var objetoRetorno = {			
			html: html,

			IDS: {
				botonGuardar: '#' + botonGuardar,
				grafica: '#' + grafica
			}
		}

		return objetoRetorno;
	},

	documentAddUser: function( opt )
	{
		/* obj
		 * suf
		 * arr_user
		 */

		var  
			obj = opt.obj || {},
			suf = opt.suf || '';

		var 
			html = 
				'<form id="formAgregarUsuarios" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="control-label col-sm-3">Trabajador Responsable: </label>' +
						'<div class="col-sm-7">' +
							'<select name="responsable" id="usuarioResponsable' + suf + '" type="text" class="form-control"></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label for="" class="control-label col-sm-3">Trabajador Auxiliar: </label>' +				
						'<div id="divUsuarioAuxiliar' + suf + '" class="col-sm-7"></div>'+
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 control-label"></div>' +
						'<p class="col-sm-9">' +
							'<button id="btnAgregarUsuarios' + suf + '" type = "submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Agregar</button> ' +
							'<button id="btnLimpiarUsuarios' + suf + '" type = "reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>',

			change_check = function ( state, value, $elem )
			{
				if ( value == $( doc.datos.responsable.idHTML ).val() ) 
				{
					if ( state === true ) 
					{
						doc.IDS.$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
						sigesop.msg( 'Info', 'El usuario auxiliar debe ser distinto al usuario responsable', 'info' );
					}

					else
						doc.IDS.$form.formValidation( 'revalidateField', 'responsable' );
				}
			},

			tabla = sigesop.tabla({
				head: {
					campo: 'RPE, NOMBRE, APELLIDOS'
				},
				body: {
					campo: 'RDE_trabajador, nombre_trabajador, apellidos_trabajador',
					campoValor: 'nombre_usuario',
					callback: change_check,
					disabled: {
						campo: 'nombre_usuario',
						campoValor: window.localStorage.usuario
					}
				},
				tipo: 'checkbox'
			}),

			update_user = function ( arr ) {
				var doc = this;
				sigesop.combo({
					arr: arr, 
					elem: doc.datos.responsable.idHTML, 
					campo: 'nombre_trabajador, apellidos_trabajador', 
					campoValor: 'nombre_usuario',
					del: ' '
				});
	
				tabla.update_table( arr );
				// update_auxiliar.call( doc, arr );
			},

			check_arr = function ( arr ) {
				var 
					i = 0,
					lon = arr.length;

				for ( i ; i < lon ; i++ )
					if ( arr[ i ].valor !== null ) return true;

				return false;
			},

			javascript = function () {
				var
				doc = this,
				form = doc.IDS.form,
				$responsable = $( doc.datos.responsable.idHTML ),
				$form = $( form ).formValidation({
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },

			        onSuccess: function ( e ) {
			        	e.preventDefault();

			        	/* verificamos que la matriz [mtz_auxiliar] tenga seleccionado
			        	 * por lo menos a un elemento
			        	 */ 
			        	if ( check_arr( doc.IDS.mtz_auxiliar ) )
			        	{
				        	typeof opt.success == 'function' ?
				        		opt.success( doc.datos, doc.IDS, limpiarCampos ) :
				        		console.log( 'success is null' );
				        }

				        else 
				        sigesop.msg( 'Advertencia', 'Seleccione usuario auxiliar', 'warning' );
			        },

			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },

			        fields: {			            
			            responsable: {
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
				
				doc.IDS.$form = $form;

				document.getElementById( doc.IDS.divUsuarioAuxiliar.flushChar('#') )
				.innerHTML = tabla.html;
				doc.IDS.mtz_auxiliar = tabla.matrizInput;

				$responsable.on( 'success.field.fv', function ( event ) {
					var val_this = $responsable.val();

					if ( val_this == window.localStorage.usuario )
					{
						$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
						sigesop.msg( 'Info', 'El usuario responsable debe ser distinto al usuario supervisor', 'info' );
					}
					else
					{
						/* si seleccionamos a un usuario responsable valido entonces
						 * buscamos si el usuario responsable no ha sido seleccionado
						 * como usuario auxiliar
						 */

						var
							i = 0,
							lon = doc.IDS.mtz_auxiliar.length;

						for ( i ; i < lon ; i++ )
						{
							var
								// val_this = $responsable.val(),
								val_mtz = doc.IDS.mtz_auxiliar[ i ].valor;

	 						if ( val_this == val_mtz )
							{
								$form.data( 'formValidation' ).updateStatus( 'responsable', 'INVALID' );
								sigesop.msg( 'Info', 'El usuario responsable debe ser distinto al usuario auxiliar', 'info' );
							}
						}
					}
				});

				$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
			},

			limpiarCampos = function ()
			{
				$( doc.datos.responsable.idHTML ).val( '' );
				vaciarDatos();
			},

			vaciarDatos = function ()
			{
				doc.datos.supervisor.valor = null;
				doc.datos.responsable.valor = null;
				doc.datos.auxiliar.length = 0;
				tabla.reset();
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			datos = {
				supervisor:{ valor: null },
				responsable: {
					valor: null,
					idHTML: '#usuarioResponsable' + suf
				},
				auxiliar: []
			},

			IDS = {
				botonGuardar: '#btnAgregarUsuarios' + suf,
				botonLimpiar: '#btnLimpiarUsuarios' + suf,
				form: '#formAgregarUsuarios' + suf,
				$form: null,
				divUsuarioAuxiliar: '#divUsuarioAuxiliar' + suf,
				mtz_auxiliar: []
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: IDS,
				update_user: update_user
			};

		return doc;
	},	

	// --------------------------------------------------------------

	/**
	 * Json como parametro con las siguientes propiedades
	 * @param {String} fechaInicial
	 * @param {String} fechaFinal
	 * @param {Int} duracion
	 * @param {String} mangnitudDuracion
	 * @param {Int} frecuencia
	 * @param {String} mangnitudFrecuencia
	 */ 		
	calculaPeriodoMantenimiento: function ( opt )
	{
		var 
			inicio = moment( opt.fechaInicial, 'DD-MM-YYYY' ),
			fin = moment( opt.fechaFinal, 'DD-MM-YYYY' );

		if ( inicio.isValid && fin.isValid )
		{
			var 
				ff = fin, // fecha final del periodo
				fr_i = moment( opt.fechaInicial, 'DD-MM-YYYY' ), // fecha recorrido inicial
				fr_f = moment( opt.fechaInicial, 'DD-MM-YYYY' ); // fecha recorrido final
				
			var fechas = [];
			
			do 
			{
				fr_f.add( opt.duracion, opt.magnitudDuracion );
				// console.log( 'fr_i: ' + fr_i.format( 'DD-MM-YYYY' ) );
				// console.log( 'fr_f: ' + fr_f.format( 'DD-MM-YYYY' ) );
				// console.log( 'ff: ' + ff.format( 'DD-MM-YYYY' ) );
				
				if ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) ) 
				{
					fechas.push( {
						from: fr_i.utc().valueOf(),
						to: fr_f.utc().valueOf()
					} ) ;

					fr_f.add( opt.frecuencia, opt.magnitudFrecuencia );
					fr_i.add( opt.duracion, opt.magnitudDuracion ).add( opt.frecuencia, opt.magnitudFrecuencia );
				}
								
				// console.log( 'fr_i recorrido: ' + fr_i.format( 'DD-MM-YYYY' ) );
				// console.log( '\n' );
			}
			while ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) );

			return fechas;
		}
	},

	estructuraDatosOrdenTrabajo: function ( array )
	{
		if ( !jQuery.isEmptyObject( array ) )
		{
			jQuery.each( data, function( i, unidad ) 
			{
				var numeroUnidad = unidad.numeroUnidad,
					matrizAeros = unidad.matrizAeros;

				jQuery.each( matrizAeros, function( j, aero )
				{
					var numeroAero = aero.numeroAero,
					 	seriesTipoMantto = aero.seriesTipoMantto;

				 	jQuery.each( seriesTipoMantto, function( k, tipoMantto )
				 	{
				 		var nombreTipoMantto = tipoMantto.tipoMantto,
				 			matrizDatosOrden = tipoMantto.datos;
							frecuencia = tipoMantto.frecuencia,
				 			magnitudFrecuencia = tipoMantto.magnitudFrecuencia;

				 		jQuery.each( matrizDatosOrden, function( l, datos )
				 		{
				 			var numeroOrden = datos.numero_orden,
				 				duracion = datos.duracion,
				 				magnitudDuracion = datos.magnitud_duracion,	
				 				fechaProgramada = datos.fecha_programada,
				 				fechaReprogramada = datos.fecha_reprogramada,
				 				fechaRelizada = datos.fecha_realizada;

								var objFechaInicio = moment(fechaProgramada);
									diaFechaInicio = moment(fechaProgramada).date();
									mesFechaInicio = objFechaInicio.month(),
									anioFechaInicio = objFechaInicio.year();

								// var	objFechaFinal = sigesop.mantenimiento.propiedadesFecha( fechaFinal ),
								// 	diaFechaFinal = objFechaFinal.numeroDia,
								// 	mesFechaFinal = objFechaFinal.numeroMes,
								// 	anioFechaFinal = objFechaFinal.numeroAnio;

								// var ordenTrabajo = {
								// 	name: nombre,
								// 	color: color,
								// 	intervals: [{ // From-To pairs
								// 	    from: Date.UTC(anioFechaInicio, (mesFechaInicio-1), diaFechaInicio),
								// 	    to: Date.UTC(anioFechaFinal, ( mesFechaFinal-1 ), diaFechaFinal),
								// 	    label: label
								// 	}]
								// }

				 		});
				 	});
				});

				// tasks.push( ordenTrabajo );
			});
		}
		else console.log( 'Matriz Orden de trabajo vacia' );
	},

	formatoFechaServidor: function ( arr )
	{
		var r = [];
		for( var i in arr )
		{
			var from = moment( parseInt( arr[ i ].from ) ).format( 'DD-MM-YYYY' ),
				to = moment( parseInt( arr[ i ].to ) ).format( 'DD-MM-YYYY' );
				
			r.push({
				from: from,
				to: to
			});
		}

		return r;
	},

	graficaMantenimiento: function ( data, idHTML )
	{
		// try {
			if ( data !== null ) {
				// var tareas = [];
				
                // Define tasks
                var tasks = data

                // re-structure the tasks into line seriesvar series = [];
                series = [];
                jQuery.each( tasks.reverse(), function ( i, task ) 
                {
                    var item = {
                        color: task.colorGrafica,
                        name: task.nombre,                            
                        data: []
                    };
                    
                    jQuery.each( task.intervalos, function ( j, interval ) 
                    {
                        item.data.push({
                            x: interval.from,
                            y: i,
                            label: interval.label,
                            from: interval.from,
                            to: interval.to
                        }, 
                        {
                            x: interval.to,
                            y: i,
                            from: interval.from,
                            to: interval.to
                        });
                        
                        // add a null value between intervalos
                        if ( task.intervalos[ j + 1 ] ) 
                        {
                            item.data.push(
                                [ ( interval.to + task.intervalos[ j + 1 ].from ) / 2, null ]
                            );
                        }

                    });

                    series.push( item );
                });

                // creamos la grafica
                $( idHTML ).highcharts({

                    chart: {
                        // renderTo: idHTML
                        // width: null
                    },
                    
                    title: {
                        text: 'Programa de Mantenimiento'
                    },

                    subtitle: {
                        text: 'Central eoloeléctrica La Venta'
                    },

                    xAxis: {
                        type: 'datetime'
                    },

                    yAxis: {
                        tickInterval: 1,
                        labels: {
                            formatter: function() {
                                if (tasks[this.value]) {
                                    return tasks[this.value].nombre;
                                }
                            }
                        },
                        startOnTick: false,
                        endOnTick: false,
                        title: {
                            text: 'Aerogeneradores - Tipo Mantenimiento'
                        },
                        minPadding: 0.2,
                        maxPadding: 0.2
                    },

                    legend: {
                        enabled: false
                    },

                    tooltip: {
                        formatter: function() {
                            return '<b>'+ tasks[this.y].nombre + '</b><br/>' +
                                Highcharts.dateFormat('%d %B %Y', this.point.options.from)  +
                                ' - ' + Highcharts.dateFormat('%d %B %Y', this.point.options.to); 
                        }
                    },

                    plotOptions: {
                        line: {
                            lineWidth: 9,
                            marker: {
                                enabled: false
                            },
                            dataLabels: {
                                enabled: true,
                                align: 'left',
                                formatter: function() {
                                    return this.point.options && this.point.options.label;
                                }
                            }
                        },

                        series: {
                            animation: {
                                duration: 3000
                            },
                            turboThreshold: 10000
                        } 
                    },

                    series: series
                });
			} 
			else $(idHTML).html('<h4 text-center>' + sigesop.sinRegistros + '</h4>');
        // } catch (e) {
        // 	alert('Es necesario importar la libreria de graficación');
        // } 
	}
};