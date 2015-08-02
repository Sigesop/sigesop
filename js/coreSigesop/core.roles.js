sigesop.roles = {
	document: function ( opt ) {
		/* obj
		 * suf
		 * arr_areaAcceso
		 * arr_permisoAcceso
		 * success
		 * error
		 */ 

		var 
		suf = opt.suf || '',
		obj = opt.obj || {
				clave_rol: '',
				descripcion_areaTrabajo: '',
				areaAcceso: [],
				permisoAcceso: []
			};

		var 
			html =
				'<form id="formCatalogoRoles' + suf + '" class="form-horizontal" role="form">' +
					'<div class="form-group">' +
						'<label class="col-sm-2 col-md-2 control-label">Nombre del Rol:</label>' +
						'<div class="col-sm-9 col-md-9">' +
							'<input name="nombreRol" id="nombreRol' + suf + '" class="form-control input-md eventoCambioMayuscula ' +
							'placeholder="Ingrese tipo de usuario por ejemplo (admin, operador, etc.)" value="' + 
							obj.clave_rol + '">' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-2 col-md-2 control-label">Áreas de Acceso:</label>' +
						'<div class="col-sm-9 col-md-9" id="areasAcceso' + suf + '"></div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-2 col-md-2 control-label">Permisos:</label>' +
						'<div class="col-sm-9 col-md-9" id="permisoAcceso' + suf + '"></div>' +
					'</div>' +

					'<div class="form-group">' +
						'<label class="col-sm-2 col-md-2 control-label">Descripción Rol:</label>' +
						'<div class="col-sm-9 col-md-9">' +
							'<textarea name="descripcionRol" id="descripcionRol' + suf + '" class="form-control eventoCambioMayuscula' +
							'" rows="3" placeholder="Descripción área de trabajo" >' + obj.descripcion_areaTrabajo + '</textarea>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-2 col-md-2 control-label"></div>' +
						'<p class="col-sm-9 col-md-9">' +
							'<button id="btnNuevoPermiso' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
							'<button id="botonLimpiar' + suf + '" type="reset" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>',

			struct_areaAcceso = function ( arr_areaAcceso ) {
				if ( jQuery.isEmptyObject( arr_areaAcceso ) ) {
					console.log( '[arr_areaAcceso] es nula' );
					this.IDS.mtz_areaAcceso.length = 0
					return '';
				};

				var 
					i = 0,
					lon = arr_areaAcceso.length,
					mtz = [],
					html = '<div class="form-group">';
				
				for( i ; i < lon; i++ )
				{
					var id = arr_areaAcceso[ i ].idAcceso + suf;
					mtz.push({
						idHTML: '#' + id,
						valor: arr_areaAcceso[ i ].paginaAcceso
					});

					html += 
						'<div class="col-sm-6 col-md-6">'+
						    '<div class="input-group checkbox-inline">'+
						      '<span class="input-group-addon">'+
						        '<input name="areaAcceso[]" id="' + id + '" value="' + 
						        arr_areaAcceso[ i ].paginaAcceso + '" type="checkbox">' + 
						        arr_areaAcceso[ i ].nombrePagina +
						      '</span>'+
						    '</div>'+
					  	'</div>';
				}

				this.IDS.mtz_areaAcceso = mtz; // enlazar vista publica
				return html + '</div>';
			},

			update_areaAcceso = function ( arr_areaAcceso ) {
				document.getElementById( this.IDS.divAreaAcceso.flushChar( '#' ) )
				.innerHTML = struct_areaAcceso.call( this, arr_areaAcceso );

				/* ejecutamos evento de validacion para los checks
				 */ 
				if ( this.IDS.$form != null )
				$( this.IDS.form ).data( 'formValidation' ).addField( 'areaAcceso[]' );
			},

			struct_permisoAcceso = function ( arr_permisoAcceso ) {
				var 
					i = 0,
					lon = arr_permisoAcceso.length,
					mtz = [],
					html = '<div class="form-group">';

				for ( i ; i < lon ; i++ ) 
				{
					var claseEvento = '',
						id = arr_permisoAcceso[ i ].idPermiso.split(' ').join('_') + suf;

					mtz.push({
						idHTML: '#' + id,
						valor: arr_permisoAcceso[ i ].idPermiso
					});

					claseEvento = arr_permisoAcceso[ i ].idPermiso != 'all' ? 
						'checkNormal' : 'checkSuperUsuario';

					html += 
					'<div class="col-sm-6 col-md-6">' +
						'<div class="input-group checkbox-inline">' +
							'<span class="input-group-addon">' +
								'<input name="permisoAcceso[]" id="' + id + '" value="' + 
								arr_permisoAcceso[ i ].idPermiso + 
								'" type="checkbox" class="' + claseEvento + 
								'">' + arr_permisoAcceso[ i ].descripcion +
							'</span>' +
						'</div>' +
					'</div>';
				}

				this.IDS.mtz_permisoAcceso = mtz; // enlazar vista publica
				return html + '</div>';
			},

			evento_check = function () {
				var 
				$checkNormal = $( '.checkNormal' ),
				$checkSuperUsuario = $( '.checkSuperUsuario' );

				$checkNormal.change( function ( event )
				{
					$( this ).prop( 'checked' ) ?
						$checkSuperUsuario.prop( 'checked', false ) : null;						
				});

				$checkSuperUsuario.change( function ( event )
				{
					$( this ).prop( 'checked' ) ?
						$checkNormal.prop( 'checked', false ) : null;
				});	
			},

			update_permisoAcceso = function ( arr_permisoAcceso ) {
				/* la verificacion de matriz nula se hace antes para
				 * evitar que se ejecuten varias veces la funcion evento_check
				 * y evitar dupicidad de eventos
				 */ 
				if ( jQuery.isEmptyObject( arr_permisoAcceso ) ) {
					console.log( '[arr_permisoAcceso] es nula' );
					this.IDS.mtz_permisoAcceso.length = 0
					return -1;
				} 
				else {
					document.getElementById( this.IDS.divPermisoAcceso.flushChar( '#' ) ).
					innerHTML = struct_permisoAcceso.call( this, arr_permisoAcceso );
					evento_check(); // creamos eventos check para seleccionar superusuario
					
					/* ejecutamos evento de validacion para los checks
					 */ 
					if ( this.IDS.$form != null )
					$( this.IDS.form ).data( 'formValidation' ).addField( 'permisoAcceso[]' );
				}
			},

			fill_check_rol = function ( areaAcceso, permisoAcceso ) {
				/* Rellena los datos de las areas de acceso, asi como los
				 * permisos de acceso, del objeto rol pasado como parámetro
				 */ 
				if ( !jQuery.isEmptyObject( areaAcceso ) &&
					 !jQuery.isEmptyObject( this.IDS.mtz_areaAcceso ) )
				{
					var 
						i = 0,						
						mtz_areaAcceso = this.IDS.mtz_areaAcceso,
						lon = mtz_areaAcceso.length;

					for ( i ; i < lon ; i++ ) 
					{ 
						var index = sigesop.indexOfObjeto( mtz_areaAcceso, 'valor', areaAcceso[ i ] );
						if ( index != -1 )
							$( mtz_areaAcceso[ index ].idHTML ).prop( 'checked', true );
					}
				}

				/* Rellenando los permisos				 
				 */ 
				if ( !jQuery.isEmptyObject( permisoAcceso ) &&
					 !jQuery.isEmptyObject( this.IDS.mtz_permisoAcceso ) )
				{
					var 
						i = 0,						
						mtz_permisoAcceso = this.IDS.mtz_permisoAcceso,
						lon = mtz_permisoAcceso.length;

					for ( i ; i < lon ; i++ ) 
					{ 
						var index = sigesop.indexOfObjeto( mtz_permisoAcceso, 'valor', permisoAcceso[ i ] );
						if ( index != -1 )
							$( mtz_permisoAcceso[ index ].idHTML ).prop( 'checked', true );
					}
				}
			},

			limpiarCampos = function ()
			{
				$( doc.datos.nombreRol.idHTML ).val( '' );
				$( doc.datos.descripcionRol.idHTML ).val( '' );

				vaciarDatos();
			},

			vaciarDatos = function ()
			{
				doc.datos.nombreRol.valor = null;
				doc.datos.nombreRolUpdate.valor = null;
				doc.datos.descripcionRol.valor = null;
				doc.datos.matrizAreaAcceso.length = 0;
				doc.datos.matrizPermisoAcceso.length = 0;
	
				doc.IDS.$form.formValidation( 'resetForm' );		
			},

			javascript = function () {
				$( '.eventoCambioMayuscula' ).eventoCambioMayuscula();
				this.update_areaAcceso( opt.arr_areaAcceso );
				this.update_permisoAcceso( opt.arr_permisoAcceso );				
				fill_check_rol.call( this, obj.areaAcceso, obj.permisoAcceso ); // rellenamos los check de areas de acceso y permisos de acuedo al rol				
			
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
			        },

			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },

			        fields: {			            
			            nombreRol: {
			                validators: {
			                    notEmpty: {
			                        message: 'Ingrese Nombre del Rol de Usuario'
			                    },
			                    stringLength: {
			                    	min: 1,
			                    	max: 25,
			                    	message: 'Número de caracteres inválido'
			                    },
			                    regexp: {
			                    	regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]*$/i,
			                    	message: '[A-Z] [0-9] sin caracteres especiales, ni acentos'
			                    }
			                }
			            },
			            'areaAcceso[]': {
			            	validators: {
			            		notEmpty: {
			            			message: 'No se han seleccionado areas de acceso'
			            		}
			            	}
			            },
			            'permisoAcceso[]': {
			            	validators: {
			            		notEmpty: {
			            			message: 'No se han seleccionado permisos de usuario'
			            		}
			            	}
			            },
			            descripcionRol: {
			                validators: {
			                    notEmpty: {
			                        message: 'Es necesaria la descripción del rol'
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

				$( this.IDS.botonLimpiar ).on( 'click', function ( event ) { vaciarDatos(); });
			},

			datos = {
				nombreRol: {
					valor: null,
					idHTML: '#nombreRol' + suf				
				},
				nombreRolUpdate: { valor: null },
				descripcionRol: 
				{ 
					valor: null,
					idHTML: '#descripcionRol' + suf
				},					
				matrizAreaAcceso: [],
				matrizPermisoAcceso: []
			},

			IDS = {
				botonGuardar: '#btnNuevoPermiso' + suf,
				botonLimpiar: '#botonLimpiar' + suf,
				divAreaAcceso: '#areasAcceso' + suf, // no es necesario para los datos hacia el servidor
				divPermisoAcceso: '#permisoAcceso' + suf, // no es necesario para los datos hacia el servidor
				form: '#formCatalogoRoles' + suf,
				$form: null,
				mtz_areaAcceso: [],
				mtz_permisoAcceso: []
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: IDS,
				update_areaAcceso: update_areaAcceso,
				update_permisoAcceso: update_permisoAcceso
			};

		return doc; 
	},	
	
	documentoRegistro: function ( opt ) {
		var suf = opt.suf || '';

		var 
			html =
				'<form id="formRegistroRoles' + suf + '">' +
					'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
						'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
							'<span aria-hidden="true">×</span>' +
						'</button>' +
						'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
					'</div>' +

					'<div class="form-group">'+
						'<div class="col-sm-5 control-label"></div>'+
						'<p class="col-sm-7">'+
							'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" > <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir Reporte de roles</button>'+					
						'</p>'+
					'</div>'+

					'<div class="form-group">' +					
						'<div class="col-sm-12 col-md-12" id="tabla_registro_roles' + suf + '"></div>' +
					'</div>' +
				'</form>',

			javascript = function () {
				var
				tabla_roles = sigesop.tablaRegistro({
					head: 'CLAVE ROL, DESCRICION ROL',
					campo: 'clave_rol, descripcion_areaTrabajo'
				}),
				$botonImprimir = $( doc.IDS.botonImprimir );
				
				this.table.update_table = tabla_roles.update_table; // enlazamos a vista publica
				this.table.body = tabla_roles.IDS.body;
				document.getElementById( this.IDS.idTabla.flushChar('#') )
				.innerHTML = '<br>' + tabla_roles.html

				$( tabla_roles.IDS.body ).contextMenu({
					selector: 'tr',
					items: {
			            editar: 
			            {
			            	name: 'Editar', 
			            	icon: 'edit',
			        		callback: function ( key, _opt ) {
			        			var index = $( this ).attr( 'table-index' );
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
			        			var index = $( this ).attr( 'table-index' );
			        			typeof opt.table.actions.eliminar == 'function' ?
			        				opt.table.actions.eliminar( index ):
			        				console.log( 'function eliminar is null' );
			        		}
			            }
					}
				});

				$botonImprimir.on( 'click', function ( event ) { 
					var 
					url = sigesop.raizServidor + 'ajax.php?class=usuarios' +
						'&action=imprimirR',
						win = window.open( url );

					win.focus();
				});
			},

			IDS = {
				idTabla: '#tabla_registro_roles' + suf,
				form: '#formRegistroRoles' + suf,
				botonImprimir: '#btn-imprimir-reporte-' + suf
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