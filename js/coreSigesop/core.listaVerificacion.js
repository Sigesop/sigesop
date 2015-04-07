sigesop.listaVerificacion = {
	document: function ( opt )
	{
		var
		suf = opt.suf || '',

		obj = opt.obj || {},

		html =
			'<div class="panel panel-success">' +
				'<div class="panel-heading">ASOCIACIÓN</div><br>' +
				
				'<form id="form-lista-verificacion-' + suf + '" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Tipo Mantenimiento:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="id_mantenimiento" id="tipoMantto' + suf + '" class="form-control" ><option value="" >' + sigesop.sinRegistros + '</option></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-3 control-label">Descripción:</label>' +
						'<div class="col-sm-7">' +
							'<textarea name="descripcion_lista_verificacion" id="descripcion_lista' + suf + '" class="form-control input-sm eventoCambioMayuscula" placeholder="Ingrese descripcion de la lista de verificación"></textarea>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div id="lista-actividades-' + suf + '" class="col-sm-offset-3 col-sm-7"></div>' +
						'<p class="col-sm-2">' +
							'<button id="btn-nueva-actividad-' + suf + '" class="btn btn-info"> <span class="glyphicon glyphicon-plus"></span></button> ' +
						'</p>' +
					'</div>' +

					'<div class="form-group">' +
						'<p class="col-sm-offset-3 col-sm-8">' +
							'<button id="btn-guardar-lista-' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lista-' + suf + '" type="reset"  class="btn btn-success"> <span class="glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>' +
			'</div>',		

		nueva_actividad = function () {
			var
			doc = this,

			success = function ( datos ) {
				doc.datos.actividad_verificar.push( datos );
				doc.update_table( doc.datos.actividad_verificar );
				$( win.idDiv ).modal( 'hide' );
			},

			activity = sigesop.listaVerificacion.activity({
				suf: 'win1',
				error: error,
				success: success
			}),

			showBsModal = function () {
				document.getElementById( this.idBody )
				.innerHTML = activity.html;
				activity.javascript();
			},

			win = sigesop.ventanaEmergente({
				idDiv: 'win-nueva-actividad',
				titulo: 'Nueva actividad',
				keyboard: false,
				clickAceptar: function ( event ){ event.preventDefault(); $( win.idBody ).modal( 'hide' ); },
				showBsModal: showBsModal
			});
		},

		limpiarCampos = function ()
		{
			$( doc.datos.id_mantenimiento.idHTML ).val( '' );
			$( doc.datos.descripcion_lista_verificacion.idHTML ).val( '' );
			
			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			this.datos.id_mantenimiento.valor = null;
			this.datos.descripcion_lista_verificacion.valor = null;
			this.datos.actividad_verificar.length = 0;

			$( this.IDS.idBody ).empty();
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		drop_activity = function ( index, update_table ) {
			this.splice( index, 1 );
			update_table( this );
		},

		edit_activity = function ( index ) {
			var
			activity = $.extend( true, {}, this[ index ] ),

			success = function ( datos ) {
				doc.datos.actividad_verificar.splice( index, 1, datos );
				doc.update_table( doc.datos.actividad_verificar );
				$( win.idDiv ).modal( 'hide' );
			},

			edit = sigesop.listaVerificacion.activity({
				obj: activity,
				suf: 'edit',
				success: success
			}),

			showBsModal = function () {
				document.getElementById( this.idBody )
				.innerHTML = edit.html;
				edit.javascript();
			},

			win = sigesop.ventanaEmergente({
				idDiv: 'win-edicion-actividad',
				titulo: 'Edicion actividad',
				keyboard: false,
				clickAceptar: function ( event ){ event.preventDefault(); $( win.idBody ).modal( 'hide' ); },
				showBsModal: showBsModal
			});
		},

		javascript = function() {
			var
			doc = this,
			form = doc.IDS.form,
			$botonActividad = $( doc.IDS.botonActividad ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	if ( !$.isEmptyObject( doc.datos.actividad_verificar ) )
		        	{
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos, doc.IDS, limpiarCampos ) :
			        		console.log( 'success is null' );
			        }
			        else
			        	sigesop.msg( 'Info', 'No se han agregado actividades' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		            id_mantenimiento: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            descripcion_lista_verificacion: {
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
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			/* tabla de registro de las actividades
			 */
			var 
			table = sigesop.tablaRegistro({
				head: 'ACTIVIDAD',
				campo: "actividad_verificar.valor",
				suf: '_actividades'
			});

			doc.update_table = table.update_table; // enlazamos el enlace de actualizar tabla de actividades
			document.getElementById( doc.IDS.listaActividades.flushChar( '#' ) )
			.innerHTML = table.html;
			doc.IDS.idBody = table.IDS.body;

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: {
		            editar: 
		            {
		            	name: 'Editar', 
		            	icon: 'edit',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).index();
		        			edit_activity.call( doc.datos.actividad_verificar, index )
		        		}
		            },
		            eliminar: 
		            {
		            	name: 'Eliminar', 
		            	icon: 'delete',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).index();
		        			drop_activity.call( doc.datos.actividad_verificar, index, table.update_table );
		        		}
		            }
				}
			});

			$botonActividad.on( 'click', function ( event ) { 
				event.preventDefault();
				nueva_actividad.call( doc ); 
			});
			$( this.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });

			$( '.eventoCambioMayuscula' ).eventoCambioMayuscula();
		},

		datos = {
			id_mantenimiento: {
				valor: null,
				idHTML: '#tipoMantto' + suf
			},

			descripcion_lista_verificacion: {
				valor: null,
				idHTML: '#descripcion_lista' + suf					
			},

			actividad_verificar: []
		},

		IDS = {
			botonGuardar: '#btn-guardar-lista-' + suf,
			botonLimpiar: '#btn-limpiar-lista-' + suf,
			botonActividad: '#btn-nueva-actividad-' + suf,
			listaActividades: '#lista-actividades-' + suf,				
			form: '#form-lista-verificacion-' + suf,
			$form: null			
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: datos,
			IDS: IDS,
			update_table: null
		};

		return doc;
	},

	activity: function ( opt ) {
		var

		suf = opt.suf || '',

		html =
			'<div class="panel panel-success">' +
				'<div class="panel-heading"></div><br>' +
				
				'<form id="form-nueva-actividad-' + suf + '" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Sistema:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="id_sistema_aero" id="sistema-' + suf + '" class="form-control" ><option value="" >' + sigesop.sinRegistros + '</option></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Equipo:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="id_equipo_aero" id="equipo-' + suf + '" class="form-control"></select>' +
						'</div>' +
					'</div>' +
			
					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Actividad:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<textarea name="actividad_verificar" id="actividad-verificar-' + suf + 
							'" class="form-control input-sm MAYUS" placeholder="Ingrese descripcion de la actividad"></textarea>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Parámetro de Aceptación:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="tipo_parametro_aceptacion" id="parametro-aceptacion-' + suf + '" class="form-control">' +
								'<option value="">' + sigesop.seleccioneOpcion + '</option>' +
								'<option value="TEXTO">TEXTO</option>' +
								'<option value="COMPARACION">COMPARACION</option>' +
								'<option value="RANGO">RANGO</option>' +
								'<option value="TOLERANCIA">TOLERANCIA</option>' +
							'</select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Lectura actual:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="tipo_lectura_actual" id="tipo-dato-lectura-actual-' + suf + '" class="form-control" disabled></select>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-3 col-md-3 control-label">Lectura posterior:</label>' +
						'<div class="col-sm-7 col-md-7">' +
							'<select name="tipo_lectura_posterior" id="tipo-dato-lectura-posterior-' + suf + '" class="form-control" disabled></select>' +							
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 col-md-3"></div>' +
						'<div class="col-sm-9">' +
							'<p>' +
								'<button id="btn-agregar-actividad-' + suf + '" type="submit" class="btn btn-success" disabled><span class="glyphicon glyphicon-plus"></span> Agregar actividad</button> ' +
								'<button id="btn-limpiar-actividad-' + suf + '" type="reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Reiniciar Actividad</button>' +
							'</p>' +
						'</div>' +
					'</div><br>' +
				'</form>' +
			'</div>',

		leerDatos = function () {
			var doc = this;
			doc.datos.id_sistema_aero.valor = $( doc.datos.id_sistema_aero.idHTML ).val();
			doc.datos.id_equipo_aero.valor = $( doc.datos.id_equipo_aero.idHTML ).val();
			doc.datos.actividad_verificar.valor = $( doc.datos.actividad_verificar.idHTML ).val().trim();
		},

		lecturaActual = function ( obj ) {
			var doc = this;

			doc.IDS.idsLecturaActual = [];
			doc.actividad_verificar.lectura_actual = [];
			$( doc.IDS.divLecturaActual ).empty();

			doc.IDS.idsLecturaPosterior = [];
			doc.actividad_verificar.lectura_posterior = [];
			$( doc.IDS.lecturaPost ).val( '' );
			$( doc.IDS.lecturaPost ).prop( 'disabled', true );
			$( doc.IDS.divLecturaPost ).empty();

			$( doc.IDS.botonActividad ).prop( 'disabled', true );

			if ( typeof obj !== 'undefined' )
			{
				// --------- enlazar comunicacion entre objetos

				doc.IDS.idsLecturaActual = obj.IDS.matrizID;						
				doc.actividad_verificar.lectura_actual = obj.datos.matrizLectura;

				// ---------- Ejecucion del documento

				$( doc.IDS.divLecturaActual ).html( obj.html );
				obj.javascript();
				obj.success = function() // llamada a callback si los datos son creados correctamente
				{ 						
					// ---------- secuencias graficas del documento
					
					// $( doc.IDS.divLecturaActual ).empty();
					// $( doc.IDS.lecturaActual ).prop( 'disabled', true );						
					// $( doc.IDS.botonActividad ).prop( 'disabled', false );
					$( obj.IDS.botonAgregarCelda ).prop( 'disabled', true ); // desabilitamos boton [Agregar]
					$( obj.IDS.botonAgregarLectura ).prop( 'disabled', true ); // desabilitamos boton [Agregar Paramentro]
					$( doc.IDS.lecturaPost ).prop( 'disabled', false );
				}		
			}
			else 
			{
				console.log( 'obj lecturaActual es indefinido' );
				$( doc.IDS.divLecturaActual ).empty(); // limpiar area de trabajo
			}
		},

		lecturaPost = function ( obj ) {
			var doc = this;

			doc.IDS.idsLecturaPosterior = [];
			doc.actividad_verificar.lectura_posterior = [];
			$( doc.IDS.divLecturaPost ).empty();

			$( doc.IDS.botonActividad ).prop( 'disabled', true );

			if ( typeof obj !== 'undefined' )
			{
				// --------- enlazar comunicacion entre objetos

				doc.IDS.idsLecturaPosterior = obj.IDS.matrizID;						
				doc.actividad_verificar.lectura_posterior = obj.datos.matrizLectura;

				// ---------- Ejecucion del documento

				$( doc.IDS.divLecturaPost ).html( obj.html );
				obj.javascript();
				obj.success = function() // llamada a callback si los datos son creados correctamente
				{ 						
					// ---------- secuencias graficas del documento
					
					// $( doc.IDS.divLecturaPost ).empty();
					// $( doc.IDS.lecturaPost ).prop( 'disabled', true );
					$( obj.IDS.botonAgregarCelda ).prop( 'disabled', true ); // desabilitamos boton [Agregar]
					$( obj.IDS.botonAgregarLectura ).prop( 'disabled', true ); // desabilitamos boton [Agregar Paramentro]
					$( doc.IDS.botonActividad ).prop( 'disabled', false );
				}			
			}
			else $( doc.IDS.divLecturaPost ).empty(); // limpiar area de trabajo
		},

		drop_activity = function ( index, arr, update_table ) {
			arr.splice( index, 1 );
			update_table( arr );
		},

		error = function() { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); },

		combo_tipo_parametro = function ( tipo ) {
			switch ( tipo )
			{				
				case 'COMPARACION':
				case 'RANGO':
				case 'TOLERANCIA':
					return [ { string: 'DATOS', val: 'Datos' } ];
				break;
				case 'TEXTO':
					return [ { string: 'BINARIO', val: 'Binario' } ];
				break;
				default: 
					throw ( 'function combo_tipo_parametro: variable [tipo], sin coincidencias' ); 
					return null;
				break;
			}
		},

		vaciarDatos = function () {
			this.IDS.$form.formValidation( 'resetForm' );

			var 
				datos = this.datos,
				IDS = this.IDS;

			datos.id_sistema_aero.valor = null;
			datos.id_equipo_aero.valor = null;
			datos.actividad_verificar.valor = null;

			datos.parametro_actividad.length = 0;
			datos.lectura_actual.length = 0;
			datos.lectura_posterior.length = 0;

			IDS.idsParametro.length = 0;
			IDS.idsLecturaActual.length = 0;
			IDS.idsLecturaPosterior.length = 0;

			$( datos.tipo_lectura_actual.idHTML ).empty().prop( 'disabled' , true );
			$( datos.tipo_lectura_posterior.idHTML ).empty().prop( 'disabled' , true );
			$( IDS.botonGuardar ).prop( 'disabled' , true );
		},

		javascript = function () {
			var
			doc = this,
			form = doc.IDS.form,
			$id_sistema_aero = $( doc.datos.id_sistema_aero.idHTML ),
			$id_equipo_aero = $( doc.datos.id_equipo_aero.idHTML ),
			$actividad_verificar = $( doc.datos.actividad_verificar.idHTML ),
			$tipo_parametro_aceptacion = $( doc.datos.tipo_parametro_aceptacion.idHTML ),
			$tipo_lectura_actual = $( doc.datos.tipo_lectura_actual.idHTML ),
			$tipo_lectura_posterior = $( doc.datos.tipo_lectura_posterior.idHTML ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
		        	leerDatos.call( doc );

		        	/* verificamos que los arreglos de datos no esten
		        	 * vacios [parametro_actividad, lectura_actual, lectura_posterior]
		        	 */
		        	if ( $.isEmptyObject( doc.datos.parametro_actividad ) ) {
		        		sigesop.msg( 'Info', 'No se ha ingresado parametro de aceptación' );
		        		return false;
		        	}

		        	if ( $.isEmptyObject( doc.datos.lectura_actual ) ) {
		        		sigesop.msg( 'Info', 'No se ha ingresado lectura actual' );
		        		return false;
		        	}

		        	if ( $.isEmptyObject( doc.datos.lectura_posterior ) ) {
		        		sigesop.msg( 'Info', 'No se ha ingresado lectura posterior' );
		        		return false;
		        	}

		        	typeof opt.success == 'function' ?
		        		opt.success( doc.datos ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		            id_sistema_aero: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            id_equipo_aero: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            actividad_verificar: {
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
		            tipo_parametro_aceptacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },			            
		            tipo_lectura_actual: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    }
		                }
		            },
		            tipo_lectura_posterior: {
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

			/* rellenamos campos si se pasas un objeto de edicion			
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var 
					obj = opt.obj,
					datos = doc.datos;

				sigesop.query ({
					class: 'sistemasGenerador',
					query: 'obtenerSistemas',
					success: function ( data )
					{
						window.sesion.matrizSistemas = data;						
						sigesop.combo({
							arr: data, 
							elem: datos.id_sistema_aero.idHTML,
							campo: 'nombre_sistema_aero',
							campoValor: 'id_sistema_aero'
						});
						$id_sistema_aero.val( obj.id_sistema_aero.valor );
					}
				});

				sigesop.query ({
					data: { valor: obj.id_sistema_aero.valor },
					class: 'equiposGenerador',
					query: 'obtenerEquipoGeneradorPorSistema',					
					success: function ( data ) 
					{
						sigesop.combo({
							arr: data, 
							elem: datos.id_equipo_aero.idHTML, 
							campo: 'nombre_equipo_aero', 
							campoValor: 'id_equipo_aero'
						});
						$id_equipo_aero.val( obj.id_equipo_aero.valor );
					}
				});

				$actividad_verificar.val( obj.actividad_verificar.valor );

				datos.parametro_actividad = obj.parametro_actividad;
				$tipo_parametro_aceptacion.val( datos.parametro_actividad[ 0 ].tipo_dato );
				
				datos.lectura_actual = obj.lectura_actual;
				$tipo_lectura_actual.combo({
					arr: combo_tipo_parametro( datos.parametro_actividad[ 0 ].tipo_dato ),
					campo: 'string',
					campoValor: 'val'
				})
				.val( datos.lectura_actual[ 0 ].tipo_dato )
				.prop( 'disabled', false );				

				datos.lectura_posterior = obj.lectura_posterior;
				$tipo_lectura_posterior.combo({
					arr: combo_tipo_parametro( datos.parametro_actividad[ 0 ].tipo_dato ),
					campo: 'string',
					campoValor: 'val'
				})
				.val( datos.lectura_posterior[ 0 ].tipo_dato )
				.prop( 'disabled', false );
			}
			else {
				sigesop.query ({
					class: 'sistemasGenerador',
					query: 'obtenerSistemas',
					success: function ( data )
					{
						window.sesion.matrizSistemas = data;						
						sigesop.combo({
							arr: data, 
							elem: doc.datos.id_sistema_aero.idHTML,
							campo: 'nombre_sistema_aero',
							campoValor: 'id_sistema_aero'
						});
					}
				});
			}

			/* eventos			
			 */
			$id_sistema_aero.change( function ( event )
			{
				$id_equipo_aero.empty();
				$form.formValidation( 'revalidateField', 'id_equipo_aero' );

				var query = $id_sistema_aero.val();
				if( query )
				{
					sigesop.query ({
						data: { valor: query },
						class: 'equiposGenerador',
						query: 'obtenerEquipoGeneradorPorSistema',					
						success: function ( data ) 
						{
							sigesop.combo({
								arr: data, 
								elem: doc.datos.id_equipo_aero.idHTML, 
								campo: 'nombre_equipo_aero', 
								campoValor: 'id_equipo_aero'
							});
							$form.formValidation( 'revalidateField', 'id_equipo_aero' );
						}
					});
				}				
			});

			$tipo_parametro_aceptacion.change( function ( event ) 
			{
				/* removemos la validaciones previas
				 */ 
				$form.formValidation( 'resetField', 'tipo_lectura_actual' );
				$form.formValidation( 'resetField', 'tipo_lectura_posterior' );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * paramentro de aceptacion
				 */
				doc.datos.parametro_actividad.length = 0;					

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura actual
				 */
				doc.datos.lectura_actual.length = 0;
				$tipo_lectura_actual.val( '' ).prop( 'disabled', true );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				doc.datos.lectura_posterior.length = 0;
				$tipo_lectura_posterior.val( '' ).prop( 'disabled', true );

				$( doc.IDS.botonGuardar ).prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = $tipo_parametro_aceptacion.val().toLowerCase();
				if ( !val ) return null;
					
				var
					success = function ( datos ) {
						/* secuencia grafica del documento y reinicio de datos de la seccion
						 * paramentro de aceptacion
						 */
						doc.datos.parametro_actividad.length = 0;
						doc.datos.parametro_actividad = datos; // enlazamos datos con el documento actividad
						
						sigesop.combo({
							arr: combo_tipo_parametro( $tipo_parametro_aceptacion.val() ),
							elem: doc.datos.tipo_lectura_actual.idHTML,
							campo: 'string',
							campoValor: 'val'
						});

						sigesop.combo({
							arr: combo_tipo_parametro( $tipo_parametro_aceptacion.val() ),
							elem: doc.datos.tipo_lectura_posterior.idHTML,
							campo: 'string',
							campoValor: 'val'
						});

						$tipo_lectura_actual.prop( 'disabled', false );
						$( win.idDiv ).modal( 'hide' );
					},

					obj = sigesop.listaVerificacion.__retornaFuncion( val,
						{
							suf: 'param',
							error: error,
							success: success							
						}
					),
					
					showBsModal = function () {
						document.getElementById( this.idBody )
						.innerHTML = obj.html;
						obj.javascript();
					},

					cancelar = function ( event ) { 
						event.preventDefault(); $( win.idDiv ).modal( 'hide' );
						$tipo_parametro_aceptacion.val('');
						$form.formValidation( 'revalidateField', 'tipo_parametro_aceptacion' );
					},

					win = sigesop.ventanaEmergente({
						idDiv: 'win-parametro-aceptacion',
						titulo: 'Agregar parámetro de aceptación',
						clickAceptar: cancelar,
						clickCerrar: cancelar,
						showBsModal: showBsModal
					});
			});

			$tipo_lectura_actual.change( function ( event )
			{
				/* removemos la validaciones previas
				 */ 					
				$form.formValidation( 'resetField', 'tipo_lectura_posterior' );

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura actual
				 */
				doc.datos.lectura_actual.length = 0;

				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				doc.datos.lectura_posterior.length = 0;
				$tipo_lectura_posterior.val( '' );
				$tipo_lectura_posterior.prop( 'disabled', true );

				$( doc.IDS.botonGuardar ).prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = $tipo_lectura_actual.val().toLowerCase();
				if ( !val ) return null;
					
				var
					success = function ( datos ) {
						/* secuencia grafica del documento y reinicio de datos de la seccion
						 * paramentro de aceptacion
						 */
						doc.datos.lectura_actual.length = 0;
						doc.datos.lectura_actual = datos; // enlazamos datos con el documento actividad
						$tipo_lectura_posterior.val('');
						$tipo_lectura_posterior.prop( 'disabled', false );
						$( win.idDiv ).modal( 'hide' );
					},

					obj = sigesop.listaVerificacion.__retornaFuncion( val,
						{
							suf: 'act',
							success: success,
							error: error,
							tipo_parametro: doc.datos.parametro_actividad[ 0 ].tipo_dato,
							numero_filas: doc.datos.parametro_actividad.length								
						}
					),
					
					showBsModal = function () {
						document.getElementById( this.idBody )
						.innerHTML = obj.html;
						obj.javascript();
					},

					cancelar = function ( event ) { 
						event.preventDefault(); $( win.idDiv ).modal( 'hide' );
						$tipo_lectura_actual.val('');
						$form.formValidation( 'revalidateField', 'tipo_lectura_actual' );
					},

					win = sigesop.ventanaEmergente({
						idDiv: 'win-lectura-actual',
						titulo: 'Agregar lectura actual',
						clickAceptar: cancelar,
						clickCerrar: cancelar,
						showBsModal: showBsModal
					});
			});

			$tipo_lectura_posterior.change( function ( event )
			{
				/* secuencia grafica del documento y reinicio de datos de la seccion
				 * lectura posterior
				 */
				doc.datos.lectura_posterior.length = 0;

				$( doc.IDS.botonGuardar ).prop( 'disabled', true );

				/* creamos el documento para el tipo de parametro seleccionado
				 * dentro de una ventana emergente
				 */
				var val = $tipo_lectura_posterior.val().toLowerCase();
				if ( !val ) return null;
					
				var
					success = function ( datos ) {
						/* secuencia grafica del documento y reinicio de datos de la seccion
						 * paramentro de aceptacion
						 */
						doc.datos.lectura_posterior.length = 0;
						doc.datos.lectura_posterior = datos; // enlazamos datos con el documento actividad
						$( doc.IDS.botonGuardar ).prop( 'disabled', false );
						$( win.idDiv ).modal( 'hide' );
					},

					obj = sigesop.listaVerificacion.__retornaFuncion( val,
						{
							suf: 'post',
							success: success,
							error: error,
							tipo_parametro: doc.datos.lectura_actual[ 0 ].tipo_dato,
							numero_filas: doc.datos.lectura_actual.length								
						}
					),
					
					showBsModal = function () {
						document.getElementById( this.idBody )
						.innerHTML = obj.html;
						obj.javascript();
					},

					cancelar = function ( event ) { 
						event.preventDefault(); $( win.idDiv ).modal( 'hide' );
						$tipo_lectura_posterior.val('');
						$form.formValidation( 'revalidateField', 'tipo_lectura_posterior' );
					},

					win = sigesop.ventanaEmergente({
						idDiv: 'win-lectura-posterior',
						titulo: 'Agregar lectura posterior',
						clickAceptar: cancelar,
						clickCerrar: cancelar,
						showBsModal: showBsModal
					});
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });

			$( '.MAYUS' ).eventoCambioMayuscula();
		},

		datos = {
			id_sistema_aero: {
				valor: null,
				idHTML: '#sistema-' + suf
			},
			id_equipo_aero: {
				valor: null,
				idHTML: '#equipo-' + suf				
			},
			actividad_verificar: {
				valor: null,
				idHTML: '#actividad-verificar-' + suf
			},
			tipo_parametro_aceptacion: { idHTML: '#parametro-aceptacion-' + suf	},
			tipo_lectura_actual: { idHTML: '#tipo-dato-lectura-actual-' + suf },
			tipo_lectura_posterior: { idHTML: '#tipo-dato-lectura-posterior-' + suf },
			parametro_actividad: [],
			lectura_actual: [],
			lectura_posterior: []
		},

		IDS = {
			botonGuardar: '#btn-agregar-actividad-' + suf,
			botonLimpiar: '#btn-limpiar-actividad-' + suf,
			form: '#form-nueva-actividad-' + suf,
			$form: null,
			idsParametro: [],
			idsLecturaActual: [],
			idsLecturaPosterior: []
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
			'<form id="form-registro-lista-verificacion-' + suf + '">' +
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-lista-verificacion-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			table = sigesop.tablaRegistro({
				head: 'LISTA DE VERIFICACION, ACTIVIDADES REGISTRADAS',
				campo: "lista_verificacion, num_actividades",
				suf: 'lista-verificacion'
			});

			doc.table.update_table = table.update_table; // enlazamos a vista publica
			doc.table.body = table.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + table.html;

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: {
		            actividades: {
		            	name: 'Ver actividades', 
		            	icon: 'edit',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).index();
		        			typeof opt.table.actions.actividades == 'function' ?
		        				opt.table.actions.actividades( index ):
		        				console.log('function actividades is null' );
		        		}
		            }
				}
			});
		},

		IDS = {
			idTabla: '#tabla-registro-lista-verificacion-' + suf,
			form: '#form-registro-lista-verificacion-' + suf
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

	__retornaFuncion: function ( val, opt ) {
		if ( val )
		{
			var accion = '__' + val,
				obj = null;

			if ( typeof sigesop.listaVerificacion[ accion ] === 'function' )
				return obj = sigesop.listaVerificacion[ accion ]( opt );
				else $.error( 'Funcion: ' + accion + ' no definida' );
		}
	},

	/* parametro de aceptacion
	 */
	__texto: function ( opt ) {		
		var 
		suf = opt.suf || '',

		html = 
			'<form id="form-parametro-texto-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-3 col-md-3 control-label"> Parámetro de aceptación:</label>'+
					'<div class="col-sm-7 col-md-7">'+
						'<textarea name="parametro_aceptacion" id="textarea-parametro-aceptacion-texto-' + suf +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
					'</div>'+
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-3 col-md-3"></div>'+
					'<div class="col-sm-7 col-md-7">' +
						'<p>' +
							'<button id="btn-guardar-parametro-texto-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-parametro-texto-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',

		leerDatos = function ()
		{
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			this.datos.push({
				tipo_dato: 'TEXTO',
				parametro: { valor: $( this.IDS.ids[ 0 ].idHTML ).val().trim() },
				unidad_medida: { valor: 'N/A' }
			});				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$form = $( form ).formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		            parametro_aceptacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
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

			$( '.eventoCambioMayuscula' ).eventoCambioMayuscula();
		},			

		IDS = {
			botonGuardar: '#btn-guardar-parametro-texto-' + suf,
			botonLimpiar: '#btn-limpiar-parametro-texto-' + suf,
			form: '#form-parametro-texto-' + suf,
			$form: null,
			ids: [ { idHTML: '#textarea-parametro-aceptacion-texto-' + suf } ] // donde se guardaran los ids html de las cajas de texto
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	__comparacion: function ( opt ) {
		/*
		 * suf - optional
		 * error - optional
		 * success - optional
		 */ 
		var 
		suf = opt.suf || '',

		html =
			'<form id="form-lectura-actual-comparacion-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
					'<div class="col-sm-2 col-md-2">'+
						'<input name="cantidad_comparacion" id="cantidad-comparacion-'+ suf +'" class="form-control input-md">'+
					'</div>'+
					'<div class="col-sm-5 col-md-5">'+
						'<button id="btn-cantidad-comparacion-' + suf + '" class="btn btn-primary">Agregar</button>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">'+
						'<div class="table-responsive">'+
							'<table class="table table-bordered">'+
								'<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>'+
								'<tbody id="tabla-comparacion-' + suf + '"></tbody>'+
							'</table>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">' +
						'<p>' +
							'<button id="btn-guardar-lectura-actual-comparacion-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lectura-actual-comparacion-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',			

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;
		
			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */ 
			var 
				html = '',
				i = 0,
				lon = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids

			for ( i ; i < lon ; i++ ) 
			{
				var secuencia = i + '-' + suf;

				html += 
					'<tr>'	+							
						'<td class="col-sm-6 col-md-6">'+
							'<textarea name="validacion_parametro_verificar_tipo_comparacion" ' +
							'id="parametro-verificar-tipo-comparacion-' + secuencia + 
							'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
						'</td>'+
						'<td class="col-sm-3 col-md-3">'+
							'<textarea name="validacion_dato_verificar_tipo_comparacion" ' +
							'id="dato-verificar-tipo-comparacion-' + secuencia + 
							'" class="form-control input-sm eventoCambioMayuscula" placeholder="Dato comparativo"></textarea>'+
						'</td>'+	
						'<td class="col-sm-3 col-md-3">'+
							'<select name="validacion_unidad_medida_verificar_tipo_comparacion" ' +
							'id="unidad-medida-verificar-tipo-comparacion-' + secuencia + 
							'" class="form-control" ><option></option></select>'+
						'</td>'+	
					'</tr>';

				IDS.ids.push({
					parametro: '#parametro-verificar-tipo-comparacion-' + secuencia,
					dato: '#dato-verificar-tipo-comparacion-' + secuencia,
					unidad_medida: '#unidad-medida-verificar-tipo-comparacion-' + secuencia
				});
			}
			
			document.getElementById( IDS.tabla.flushChar('#') ).innerHTML = html;
			sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

			/* añadir las validaciones
			 */ 
			IDS.$form.data( 'formValidation' ).addField( 'validacion_parametro_verificar_tipo_comparacion', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    regexp: {
	                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
	                        message: 'Caracteres inválidos'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_dato_verificar_tipo_comparacion', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    numeric: {
	                        message: 'Sólo números'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_unidad_medida_verificar_tipo_comparacion', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    }
	                }
				}
			);

			/* descargar los datos de tipo de unidad de medida
			 */ 
			if ( !$.isEmptyObject( window.sesion.matrizUnidadMedida ) )
			{
				var
					i = 0,
					lon = IDS.ids.length;

				for ( i ; i < lon ; i++ ) 
					sigesop.combo({
						arr: window.sesion.matrizUnidadMedida, 
						elem: IDS.ids[ i ].unidad_medida, 
						campo: 'unidad_medida'
					});
			}
			else
				sigesop.query({
					class: 'listaVerificacion',
					query: 'obtenerUnidadMedida',
					success: function ( data ) 
					{
						window.sesion.matrizUnidadMedida = data;
						var
							i = 0,
							lon = IDS.ids.length;

						for ( i ; i < lon ; i++ ) 
							sigesop.combo({
								arr: window.sesion.matrizUnidadMedida, 
								elem: IDS.ids[ i ].unidad_medida, 
								campo: 'unidad_medida'
							});
					}
				});
		},

		vaciarDatos = function () {
			$( this.IDS.tabla ).empty();
			this.datos.length = 0;
			this.IDS.ids.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		leerDatos = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var
				j = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) 
			{
				this.datos.push({
					tipo_dato: 'COMPARACION',
					dato: { valor: $( this.IDS.ids[ j ].dato ).val().trim()	},
					parametro: { valor: $( this.IDS.ids[ j ].parametro ).val().trim() },
					unidad_medida: { valor: $( this.IDS.ids[ j ].unidad_medida ).val().trim() }
				});
			}				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$spinerCantidad = $( doc.IDS.cantidadDatos ),
			$botonAgregarCelda = $( doc.IDS.botonAgregarCelda ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {				            
		            cantidad_comparacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            }				            
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			$spinerCantidad.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 ) 
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad_celdas' );
				}
			});

			$botonAgregarCelda.on( 'click', function ( event ) 
			{
				event.preventDefault();
				var valor = $spinerCantidad.val();
				crearCeldas.call( doc, valor );
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		IDS = {
			cantidadDatos: '#cantidad-comparacion-' + suf,
			botonAgregarCelda: '#btn-cantidad-comparacion-' + suf,
			botonGuardar: '#btn-guardar-lectura-actual-comparacion-' + suf,
			botonLimpiar: '#btn-limpiar-lectura-actual-comparacion-' + suf,
			ids: [],
			form: '#form-lectura-actual-comparacion-' + suf,
			$form: null,
			tabla: '#tabla-comparacion-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	__rango: function ( opt ) {
		/*
		 * suf - optional
		 * error - optional
		 * success - optional
		 */ 
		var 
		suf = opt.suf || '',

		html =
			'<form id="form-lectura-actual-comparacion-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
					'<div class="col-sm-2 col-md-2">'+
						'<input name="cantidad_comparacion" id="cantidad-comparacion-'+ suf +'" class="form-control input-md">'+
					'</div>'+
					'<div class="col-sm-5 col-md-5">'+
						'<button id="btn-cantidad-comparacion-' + suf + '" class="btn btn-primary">Agregar</button>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">'+
						'<div class="table-responsive">'+
							'<table class="table table-bordered">'+
								'<thead><tr><th>Parámetro</th><th>Dato inferior</th><th>Dato superior</th><th>Tipo de Dato</th></tr></thead>'+
								'<tbody id="tabla-comparacion-' + suf + '"></tbody>'+
							'</table>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">' +
						'<p>' +
							'<button id="btn-guardar-lectura-actual-comparacion-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lectura-actual-comparacion-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',			

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;
		
			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */ 
			var 
				html = '',
				i = 0,
				lon = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids

			for ( i ; i < lon ; i++ ) 
			{
				var secuencia = i + '-' + suf;

				html += 
					'<tr>'	+					
						'<td class="col-sm-4 col-md-4">'+
							'<textarea name="validacion_parametro_verificar_tipo_rango" ' +
							'id="parametro-verificar-tipo-rango-' + secuencia +
							'" class="form-control input-sm MAYUS" placeholder="Parámetro"></textarea>'+
						'</td>'+
						'<td class="col-sm-3 col-md-3">'+
							'<input name="validacion_dato_verificar_tipo_rango"' +
							' id="dato-inferior-verificar-tipo-rango-' + secuencia +
							'" class="form-control" placeholder="Dato inferior">'+
						'</td>' +
						'<td class="col-sm-3 col-md-3">'+
							'<input name="validacion_dato_verificar_tipo_rango"' +
							' id="dato-superior-verificar-tipo-rango-' + secuencia +
							'" class="form-control" placeholder="Dato superior">' +
						'</td>'+	
						'<td class="col-sm-2 col-md-2">'+
							'<select name="validacion_unidad_medida_verificar_tipo_rango"' +
							' id="unidad-medida-verificar-tipo-rango-' + secuencia +
							'" class="form-control" ></select>' +
						'</td>'+	
					'</tr>';

				IDS.ids.push({
					parametro   : '#parametro-verificar-tipo-rango-' + secuencia,
					datoInf     : '#dato-inferior-verificar-tipo-rango-' + secuencia,
					datoSup     : '#dato-superior-verificar-tipo-rango-' + secuencia,
					unidad_medida: '#unidad-medida-verificar-tipo-rango-'+ secuencia
				});
			}
			
			document.getElementById( IDS.tabla.flushChar('#') ).innerHTML = html;
			$( '.MAYUS' ).eventoCambioMayuscula();

			/* añadir las validaciones
			 */ 
			IDS.$form.data( 'formValidation' ).addField( 'validacion_parametro_verificar_tipo_rango', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    regexp: {
	                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
	                        message: 'Caracteres inválidos'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_dato_verificar_tipo_rango', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    numeric: {
	                        message: 'Sólo números'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_unidad_medida_verificar_tipo_rango', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    }
	                }
				}
			);

			/* descargar los datos de tipo de unidad de medida
			 */ 
			if ( !$.isEmptyObject( window.sesion.matrizUnidadMedida ) )
			{
				var
					i = 0,
					lon = IDS.ids.length;

				for ( i ; i < lon ; i++ ) 
					sigesop.combo({
						arr: window.sesion.matrizUnidadMedida, 
						elem: IDS.ids[ i ].unidad_medida, 
						campo: 'unidad_medida'
					});
			}
			else
				sigesop.query({
					class: 'listaVerificacion',
					query: 'obtenerUnidadMedida',
					success: function ( data ) 
					{
						window.sesion.matrizUnidadMedida = data;
						var
							i = 0,
							lon = IDS.ids.length;

						for ( i ; i < lon ; i++ ) 
							sigesop.combo({
								arr: window.sesion.matrizUnidadMedida, 
								elem: IDS.ids[ i ].unidad_medida, 
								campo: 'unidad_medida'
							});
					}
				});
		},

		vaciarDatos = function () {
			$( this.IDS.tabla ).empty();
			this.datos.length = 0;
			this.IDS.ids.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		leerDatos = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var
				j = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) 
			{
				this.datos.push({
					tipo_dato: 'RANGO',
					dato: { 
						valor: 	$( this.IDS.ids[ j ].datoInf ).val().trim()	+ ',' +
								$( this.IDS.ids[ j ].datoSup ).val().trim()
					},
					parametro: { valor: $( this.IDS.ids[ j ].parametro ).val().trim() },
					unidad_medida: { valor: $( this.IDS.ids[ j ].unidad_medida ).val().trim() }
				});
			}				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$spinerCantidad = $( doc.IDS.cantidadDatos ),
			$botonAgregarCelda = $( doc.IDS.botonAgregarCelda ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {				            
		            cantidad_comparacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            }				            
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			$spinerCantidad.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 ) 
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad_celdas' );
				}
			});

			$botonAgregarCelda.on( 'click', function ( event ) 
			{
				event.preventDefault();
				var valor = $spinerCantidad.val();
				crearCeldas.call( doc, valor );
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		IDS = {
			cantidadDatos: '#cantidad-comparacion-' + suf,
			botonAgregarCelda: '#btn-cantidad-comparacion-' + suf,
			botonGuardar: '#btn-guardar-lectura-actual-comparacion-' + suf,
			botonLimpiar: '#btn-limpiar-lectura-actual-comparacion-' + suf,
			ids: [],
			form: '#form-lectura-actual-comparacion-' + suf,
			$form: null,
			tabla: '#tabla-comparacion-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	__tolerancia: function ( opt ) {
		/*
		 * suf - optional
		 * error - optional
		 * success - optional
		 */ 
		var 
		suf = opt.suf || '',

		html =
			'<form id="form-lectura-actual-comparacion-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
					'<div class="col-sm-2 col-md-2">'+
						'<input name="cantidad_comparacion" id="cantidad-comparacion-'+ suf +'" class="form-control input-md">'+
					'</div>'+
					'<div class="col-sm-5 col-md-5">'+
						'<button id="btn-cantidad-comparacion-' + suf + '" class="btn btn-primary">Agregar</button>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">'+
						'<div class="table-responsive">'+
							'<table class="table table-bordered">'+
								'<thead><tr>' +
									'<th>Parámetro</th><th>Dato</th>' +
									'<th>Tolerancia <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span></th>' +
									'<th>Tipo de Dato</th>' +
								'</tr></thead>'+
								'<tbody id="tabla-comparacion-' + suf + '"></tbody>'+
							'</table>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">' +
						'<p>' +
							'<button id="btn-guardar-lectura-actual-comparacion-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lectura-actual-comparacion-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',			

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;
		
			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */ 
			var 
				html = '',
				i = 0,
				lon = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids

			for ( i ; i < lon ; i++ ) 
			{
				var secuencia = i + '-' + suf;

				html += 
					'<tr>'	+					
						'<td class="col-sm-4 col-md-4">'+
							'<textarea name="validacion_parametro_verificar_tipo_tolerancia" ' +
							'id="parametro-verificar-tipo-tolerancia-' + secuencia +
							'" class="form-control input-sm MAYUS" placeholder="Parámetro"></textarea>'+
						'</td>'+
						'<td class="col-sm-2 col-md-2">'+
							'<input name="validacion_dato_verificar_tipo_tolerancia"' +
							' id="dato-verificar-tipo-tolerancia-' + secuencia +
							'" class="form-control" placeholder="Dato">'+
						'</td>' +
						'<td class="col-sm-2 col-md-2">'+
							'<input name="validacion_dato_verificar_tipo_tolerancia"' +
							' id="tolerancia-verificar-tipo-tolerancia-' + secuencia +
							'" class="form-control" placeholder="Tolerancia">' +
						'</td>'+	
						'<td class="col-sm-4 col-md-4">'+
							'<select name="validacion_unidad_medida_verificar_tipo_tolerancia"' +
							' id="unidad-medida-verificar-tipo-tolerancia-' + secuencia +
							'" class="form-control" ></select>' +
						'</td>'+	
					'</tr>';

				IDS.ids.push({
					parametro    : '#parametro-verificar-tipo-tolerancia-' + secuencia,
					dato         : '#dato-verificar-tipo-tolerancia-' + secuencia,
					tolerancia   : '#tolerancia-verificar-tipo-tolerancia-' + secuencia,
					unidad_medida: '#unidad-medida-verificar-tipo-tolerancia-'+ secuencia
				});
			}
			
			document.getElementById( IDS.tabla.flushChar('#') ).innerHTML = html;
			$( '.MAYUS' ).eventoCambioMayuscula();

			/* añadir las validaciones
			 */ 
			IDS.$form.data( 'formValidation' ).addField( 'validacion_parametro_verificar_tipo_tolerancia', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    regexp: {
	                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
	                        message: 'Caracteres inválidos'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_dato_verificar_tipo_tolerancia', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    numeric: {
	                        message: 'Sólo números'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_unidad_medida_verificar_tipo_tolerancia', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    }
	                }
				}
			);

			/* descargar los datos de tipo de unidad de medida
			 */ 
			if ( !$.isEmptyObject( window.sesion.matrizUnidadMedida ) )
			{
				var
					i = 0,
					lon = IDS.ids.length;

				for ( i ; i < lon ; i++ ) 
					sigesop.combo({
						arr: window.sesion.matrizUnidadMedida, 
						elem: IDS.ids[ i ].unidad_medida, 
						campo: 'unidad_medida'
					});
			}
			else
				sigesop.query({
					class: 'listaVerificacion',
					query: 'obtenerUnidadMedida',
					success: function ( data ) 
					{
						window.sesion.matrizUnidadMedida = data;
						var
							i = 0,
							lon = IDS.ids.length;

						for ( i ; i < lon ; i++ ) 
							sigesop.combo({
								arr: window.sesion.matrizUnidadMedida, 
								elem: IDS.ids[ i ].unidad_medida, 
								campo: 'unidad_medida'
							});
					}
				});
		},

		vaciarDatos = function () {
			$( this.IDS.tabla ).empty();
			this.datos.length = 0;
			this.IDS.ids.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		leerDatos = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var
				j = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) 
			{
				this.datos.push({
					tipo_dato: 'TOLERANCIA',
					dato: { 
						valor: 	$( this.IDS.ids[ j ].dato ).val().trim()	+ ',' +
								$( this.IDS.ids[ j ].tolerancia ).val().trim()
					},
					parametro: { valor: $( this.IDS.ids[ j ].parametro ).val().trim() },
					unidad_medida: { valor: $( this.IDS.ids[ j ].unidad_medida ).val().trim() }
				});
			}				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$spinerCantidad = $( doc.IDS.cantidadDatos ),
			$botonAgregarCelda = $( doc.IDS.botonAgregarCelda ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {				            
		            cantidad_comparacion: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            }				            
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			$spinerCantidad.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 ) 
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad_celdas' );
				}
			});

			$botonAgregarCelda.on( 'click', function ( event ) 
			{
				event.preventDefault();
				var valor = $spinerCantidad.val();
				crearCeldas.call( doc, valor );
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		IDS = {
			cantidadDatos: '#cantidad-comparacion-' + suf,
			botonAgregarCelda: '#btn-cantidad-comparacion-' + suf,
			botonGuardar: '#btn-guardar-lectura-actual-comparacion-' + suf,
			botonLimpiar: '#btn-limpiar-lectura-actual-comparacion-' + suf,
			ids: [],
			form: '#form-lectura-actual-comparacion-' + suf,
			$form: null,
			tabla: '#tabla-comparacion-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	/* lectura actual y posterior
	 */
	__binario: function ( opt ) {
		/*
		 * suf - optional
		 * error - optional
		 * success - optional
		 * tipo_parametro - requiere
		 */ 
		if( typeof opt.tipo_parametro === 'undefined' ) {
			throw ( 'function __binario: variable [opt.tipo_parametro] es indefinido' );
			return null;
		} else if ( opt.tipo_parametro != 'TEXTO' && opt.tipo_parametro != 'Binario' ) {
			throw ( 'function __binario: variable [opt.tipo_parametro] = ' + opt.tipo_parametro + 
					', no corresponde al tipo de dato' );
			return null;
		}

		var 
		suf = opt.suf || '',

		numeroFilas = opt.numeroFilas,

		html =
			'<form id="form-lectura-actual-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
					'<div class="col-sm-2 col-md-2">'+
						'<input name="cantidad_binario" id="cantidad-binario-'+ suf +'" class="form-control input-md">'+
					'</div>'+
					'<div class="col-sm-5 col-md-5">'+
						'<button id="btn-cantidad-binario-' + suf + '" class="btn btn-primary">Agregar</button>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">'+
						'<div class="table-responsive">'+
							'<table class="table table-bordered">'+
								'<thead><tr><th>Parámetro</th><th>Dato</th></tr></thead>'+
								'<tbody id="tabla-binario-' + suf + '"></tbody>'+
							'</table>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">' +
						'<p>' +
							'<button id="btn-guardar-lectura-actual-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lectura-actual-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',			

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;
		
			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */ 
			var 
				html = '',
				i = 0,
				lon = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids

			for ( i ; i < lon ; i++ ) 
			{
				var secuencia = i + '-' + suf;

				html += 
				'<tr>'	+							
					'<td class="col-sm-6">'+
						'<textarea name="parametro_verificar_tipo_binario" id="parametro-verificar-tipo-binario-' + secuencia +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
					'</td>'+

					'<td class="col-sm-6">'+
						'<label class="radio-inline">' +
							'<input type="radio" name="tipo-binario-' + secuencia + 
							'" class="input-sm" disabled> SI'+
						'</label>'+

						'<label class="radio-inline">' +
							'<input type="radio" name="tipo-binario-' + secuencia + 
							'" class="input-sm" disabled> NO' +
						'</label>'+
					'</td>'+
				'</tr>';

				IDS.ids.push({
					idHTML: '#parametro-verificar-tipo-binario-' + secuencia,								
				});
			}
			
			document.getElementById( IDS.tabla.flushChar('#') ).innerHTML = html;
			sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

			/* añadir las validaciones
			 */ 
			IDS.$form.data( 'formValidation' ).addField( 'parametro_verificar_tipo_binario', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    regexp: {
	                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
	                        message: 'Caracteres inválidos'
	                    }
	                }
				}
			);
		},

		vaciarDatos = function () {
			$( this.IDS.tabla ).empty();
			this.datos.length = 0;
			this.IDS.ids.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		leerDatos = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var
				j = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) 
			{
				var $target = $( this.IDS.ids[ j ].idHTML );

				this.datos.push({
					tipo_dato: 'Binario',
					parametro: {
						valor: $target.val().trim(),
						idHTML: this.IDS.ids[ j ].idHTML,
					},
					unidad_medida: { valor: 'N/A' }
				});
			}				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$spinerCantidad = $( doc.IDS.cantidadDatos ),
			$botonAgregarCelda = $( doc.IDS.botonAgregarCelda ),
			$form = $( form )
			.formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {				            
		            cantidad_binario: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            }				            
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			$spinerCantidad.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 ) 
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad_binario' );
				}
			});

			$botonAgregarCelda.on( 'click', function ( event ) 
			{
				event.preventDefault();
				var valor = $spinerCantidad.val();
				crearCeldas.call( doc, valor );
			});

			$( doc.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		IDS = {
			cantidadDatos: '#cantidad-binario-' + suf,
			botonAgregarCelda: '#btn-cantidad-binario-' + suf,
			botonGuardar: '#btn-guardar-lectura-actual-' + suf,
			botonLimpiar: '#btn-limpiar-lectura-actual-' + suf,
			ids: [],
			form: '#form-lectura-actual-' + suf,
			$form: null,
			tabla: '#tabla-binario-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	__datos: function ( opt ) {
		/*
		 * suf - optional
		 * error - optional
		 * success - optional
		 * numero_filas - optional
		 * tipo_parametro - requiere
		 */ 
		if( typeof opt.tipo_parametro === 'undefined' ) {
			throw ( 'function __datos: variable [opt.tipo_parametro] es indefinido' );
			return null;
		} else if ( opt.tipo_parametro == 'TEXTO' && opt.tipo_parametro == 'Binario' ) {
			throw ( 'function __datos: variable [opt.tipo_parametro] = ' + opt.tipo_parametro + 
					', no corresponde al tipo de dato' );
			return null;
		}

		var 
		suf = opt.suf || '',

		html =
			'<form id="form-lectura-tipo-dato-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-offset-2 col-md-offset-2 col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
					'<div class="col-sm-2 col-md-2">'+
						'<input name="cantidad_datos" id="cantidad-comparacion-'+ suf +'" class="form-control input-md">'+
					'</div>'+
					'<div class="col-sm-5 col-md-5">'+
						'<button id="btn-cantidad-lectura-tipo-dato-' + suf + '" class="btn btn-primary">Agregar</button>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">'+
						'<div class="table-responsive">'+
							'<table class="table table-bordered">'+
								'<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>'+
								'<tbody id="tabla-comparacion-' + suf + '"></tbody>'+
							'</table>'+
						'</div>'+
					'</div>'+
				'</div>'+

				'<div class="form-group">'+
					'<div class="col-sm-2 col-md-2"></div>'+
					'<div class="col-sm-9 col-md-9">' +
						'<p>' +
							'<button id="btn-guardar-lectura-tipo-dato-' + suf + '" type="submit" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-limpiar-lectura-tipo-dato-' + suf + '" type="reset"  class="btn btn-primary"><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>'+
				'</div>' +
			'</form>',			

		crearCeldas = function ( filas ) {
			if ( filas <= 0 ) {
				sigesop.msg( 'Info', 'Especifique una cantidad de datos válida', 'info' )
				return null;
			}

			var IDS = this.IDS;
		
			/* Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
			 */ 
			var 
				html = '',
				i = 0,
				lon = parseInt( filas );

			IDS.ids.length = 0; // vaciar arreglo de ids

			for ( i ; i < lon ; i++ ) 
			{
				var secuencia = i + '-' + suf;

				html += 
					'<tr>'	+							
						'<td class="col-sm-6 col-md-6">'+
							'<textarea name="validacion_parametro_verificar_tipo_dato" ' +
							'id="parametro-verificar-tipo-dato-' + secuencia + 
							'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
						'</td>'+
						'<td class="col-sm-3 col-md-3">'+
							'<label class="control-label">Dato '+ ( parseInt( i ) + 1 ) +'</label>'+
						'</td>'+	
						'<td class="col-sm-3 col-md-3">'+
							'<select name="validacion_unidad_medida_verificar_tipo_dato" ' +
							'id="unidad-medida-verificar-tipo-dato-' + secuencia + 
							'" class="form-control" ><option></option></select>'+
						'</td>'+	
					'</tr>';

				IDS.ids.push({
					parametro: '#parametro-verificar-tipo-dato-' + secuencia,
					unidad_medida: '#unidad-medida-verificar-tipo-dato-' + secuencia
				});
			}
			
			document.getElementById( IDS.tabla.flushChar('#') ).innerHTML = html;
			sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

			/* añadir las validaciones
			 */ 
			IDS.$form.data( 'formValidation' ).addField( 'validacion_parametro_verificar_tipo_dato', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    },
	                    regexp: {
	                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]*$/i,
	                        message: 'Caracteres inválidos'
	                    }
	                }
				}
			);
			IDS.$form.data( 'formValidation' ).addField( 'validacion_unidad_medida_verificar_tipo_dato', 
				{
					row: 'td',
	                validators: {
	                    notEmpty: {
	                        message: 'Campo requerido'
	                    }
	                }
				}
			);

			/* descargar los datos de tipo de unidad de medida
			 */ 
			if ( !$.isEmptyObject( window.sesion.matrizUnidadMedida ) )
			{
				var
					i = 0,
					lon = IDS.ids.length;

				for ( i ; i < lon ; i++ ) 
					sigesop.combo({
						arr: window.sesion.matrizUnidadMedida, 
						elem: IDS.ids[ i ].unidad_medida, 
						campo: 'unidad_medida'
					});
			}
			else
				sigesop.query({
					class: 'listaVerificacion',
					query: 'obtenerUnidadMedida',
					success: function ( data ) 
					{
						window.sesion.matrizUnidadMedida = data;
						var
							i = 0,
							lon = IDS.ids.length;

						for ( i ; i < lon ; i++ ) 
							sigesop.combo({
								arr: window.sesion.matrizUnidadMedida, 
								elem: IDS.ids[ i ].unidad_medida, 
								campo: 'unidad_medida'
							});
					}
				});
		},

		vaciarDatos = function () {
			$( this.IDS.tabla ).empty();
			this.datos.length = 0;
			this.IDS.ids.length = 0;
			this.IDS.$form.formValidation( 'resetForm' );		
		},

		leerDatos = function () {
			this.datos.length = 0; // vaciar los campos anteriores de la propiedad publica

			var
				j = 0,
				lon = this.IDS.ids.length;

			for ( j ; j < lon; j++ ) 
			{
				this.datos.push({
					tipo_dato: 'Datos',
					parametro: { valor: $( this.IDS.ids[ j ].parametro ).val().trim() },
					unidad_medida: { valor: $( this.IDS.ids[ j ].unidad_medida ).val().trim() }
				});
			}				
		},

		javascript = function () {
			var 
			doc = this,
			form = doc.IDS.form,
			$spinerCantidad = $( doc.IDS.cantidadDatos ),
			$botonAgregarCelda = $( doc.IDS.botonAgregarCelda ),
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
					if ( !$.isEmptyObject( doc.IDS.ids ) ) {
			        	leerDatos.call( doc );
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );
					}

					else {
						sigesop.msg( 'Advertencia', 'Sin ids de parametro', 'error' );
						return null;
					}
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {				            
		            cantidad_datos: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    integer: {
		                        message: 'Sólo números enteros'
		                    }
		                }
		            }				            
		        }
			})
			.on( 'success.field.fv', function( e, data ) {
				data.fv.disableSubmitButtons( false );
			});

			doc.IDS.$form = $form;

			$spinerCantidad.spinner({
				spin: function ( event, ui ) {
					if ( ui.value <= 0 ) 
					{
						$( this ).spinner( 'value' , 1 );
						return false;
					}
				},
				change: function ( event, ui ) {
					$form.formValidation( 'revalidateField', 'cantidad_celdas' );
				}
			});

			/* asignamos el numero de filas provenientes de la cantidad de filas
			 * existentes en el parametro de aceptacion, en caso que sea indefinido
			 * o menor que 1, la variable toma el valor por defecto de la caja
			 */
			if ( 
					(typeof opt.numero_filas !== 'undefined') &&
					( (parseInt( opt.numero_filas ) == 1 && opt.tipo_parametro == 'Datos') ||
					 	(parseInt( opt.numero_filas ) > 1) )
			   )
			{
				/* si el tipo_parametro es [Datos] forzamos a que la lectura actual
				 * tenga el mismo numero de filas que la lectura posterior
				 * aunque solamente sea una fila
				 */ 
				// console.log( 'numero_filas: ' + opt.numero_filas + '\ntipo_parametro: ' + opt.tipo_parametro );
				var valor = parseInt( opt.numero_filas );
				$spinerCantidad.val( valor ).spinner( 'disable' );
				$botonAgregarCelda.prop( 'disabled', true );
				$botonLimpiar.prop( 'disabled', true );
				crearCeldas.call( doc, valor );				
			}
			else {
				$botonAgregarCelda.on( 'click', function ( event ) 
				{
					event.preventDefault(); 
					var valor = $spinerCantidad.val().trim();				
					crearCeldas.call( doc, valor );
				});
			}

			$botonLimpiar.on( 'click', function ( event ) { vaciarDatos.call( doc ); });
		},

		IDS = {
			cantidadDatos: '#cantidad-comparacion-' + suf,
			botonAgregarCelda: '#btn-cantidad-lectura-tipo-dato-' + suf,
			botonGuardar: '#btn-guardar-lectura-tipo-dato-' + suf,
			botonLimpiar: '#btn-limpiar-lectura-tipo-dato-' + suf,
			ids: [],
			form: '#form-lectura-tipo-dato-' + suf,
			$form: null,
			tabla: '#tabla-comparacion-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			datos: [],
			IDS: IDS
		};

		return doc;
	},

	/* Objetos para edicion de listas de verificacion
	 */
	
	actividadVerificar: function ( opt ) {
		var

		suf = opt.suf || '',

		html = 
			'<form id="form-obj-actividad-verificar-' + suf + '" class="form-horizontal" role="form">' +
				'<div class="form-group">' +
					'<label class="col-sm-3 col-md-3 control-label">Actividad:</label>' +
					'<div class="col-sm-7 col-md-7">' +
						'<textarea name="actividad_verificar" id="obj-actividad-verificar-' + suf + 
						'" class="form-control input-sm MAYUS" placeholder="Ingrese descripcion de la actividad"></textarea>' +
					'</div>' +
				'</div>' +

				'<div class="form-group">' +
					'<div class="col-sm-3 col-md-3"></div>' +
					'<div class="col-sm-9">' +
						'<p>' +
							'<button id="btn-boton-guardar-obj-actividad-' + suf + '" type="submit" class="btn btn-success" disabled><span class="glyphicon glyphicon-plus"></span> Guardar</button> ' +
							'<button id="btn-boton-limpiar-obj-actividad-' + suf + '" type="reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campo</button>' +
						'</p>' +
					'</div>' +
				'</div><br>' +
			'</form>',

		javascript = function () {
			var
			doc = this,
			form = doc.IDS.form,
			$actividad_verificar = $( doc.datos.actividad_verificar.idHTML );
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
		        		opt.success( doc.datos, doc.IDS ) :
		        		console.log( 'success is null' );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {
		            actividad_verificar: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    regexp: {
		                        regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'°<>|^~\w\sáéíóúñ]*$/i,
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

			/* Llenamos los campos con los datos actuales			
			 */
			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj;
				$actividad_verificar.val( obj.actividad_verificar );

				// copiamos ID para la actualizacion
				doc.datos.id_actividad_verificar.valor = obj.id_actividad_verificar;
			}

			$( '.MAYUS' ).eventoCambioMayuscula();
		},

		datos = {
			id_actividad_verificar: { valor: null },
			actividad_verificar: {
				valor: null,
				idHTML: '#obj-actividad-verificar-' + suf
			}
		},

		IDS = {
			botonGuardar: '#btn-boton-guardar-obj-actividad-' + suf,
			botonLimpiar: '#btn-boton-limpiar-obj-actividad-' + suf,
			form: '#form-obj-actividad-verificar-' + suf,
			$form: null
		},

		doc = {
			html      : html,
			javascript: javascript,
			datos     : datos,
			IDS       : IDS
		};

		return doc;
	}
}