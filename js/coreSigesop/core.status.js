$.sigesop.status = {
	// ---------- comprobarDatosPrincipalesNulos --------------------

	comprobarDatosPrincipalesNulos: function () 
	{
		$.sigesop.solicitarDatosSistema({
			clase: 'ajaxStatus',
			solicitud: 'comprobarDatosPrincipalesNulos',
			sincrono: false,
			respuesta: $.sigesop.status.__datosPrincipalesNulos
		});			
	},

	__datosPrincipalesNulos: function ( data )
	{		
		// ---------- Declaracion de estructuras y variables					

		window.sesion.recorridoArray = 0,									
		window.sesion.verificaSiguiente = true; // bloquea la ventana de captura hasta que se haya completado la transaccion
			
		matrizAcciones = []; // matriz que guarda los objetos para su posterior invocacion

		// ---------- verificacion de los elementos faltantes

		var camposError = 'Los siguientes campos no han sido completados:<br><br>',
			flag = false;

		if ( data.roles === null ) 
		{
			flag = true;
			matrizAcciones.push( $.sigesop.status.__roles );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Rol de superintendente<br>';
		} 

		if ( data.areaTrabajo === null ) 
		{
			flag = true;
			matrizAcciones.push( $.sigesop.status.__areaTrabajo );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Area de Trabajo del superintendente<br>';
		} 

		if ( data.personal === null ) 
		{						
			flag = true;
			matrizAcciones.push( $.sigesop.status.__personal );			
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Información del superintendente<br>';
		}		

		if ( data.central === null ) 
		{
			flag = true;
			matrizAcciones.push( $.sigesop.status.__central );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Datos de la central<br>';
		}

		// ---------------- existe algún elemento nulo?

		if ( flag ) 
		{
			// ---------------- creacion y ejecucion de la ventana

			var alerta = '' +
				'<div id="datosPrioridad" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
				'	<div class="modal-dialog modal-lg">'+
				'		<div id="datosPrioridad_modal" class="modal-content">'+
				'			<div class="modal-header">'	+
				'        		<h4 class="modal-title" >Información importante</h4>'+
				'	    	</div>' +

				'	    	<div id="bodyDatosPrioridad" class="modal-body">'+
				'	    		<div class="alert alert-danger">'+
				'	    			<p > <h5 class="">'+
				'						Se ha detectado falta de datos importantes para el funcionamiento del sistema. ' + camposError +
				'						<br>Haga click al boton continuar para ingresar los datos correspondientes.'+
				'	    			</h5></p>'+
				'	    		</div>'+
				'			</div>'+

				'		    <div class="modal-footer">'+
				'		        <button id="btnDatosNuevosCancelar" type="button" class="btn btn-danger">Cancelar</button>'+
				'		        <button id="btnDatosNuevosSiguiente" type="button" class="btn btn-success">Siguiente</button>'+
				'		    </div>'+
				'    	</div>'+
				'	</div>'+
				'</div>';
			$( 'body' ).append( alerta );

			// -------------- cargar rutina antes de abrir la ventana
			
			$( '#datosPrioridad' ).on( 'show.bs.modal', function ( e ) 
			{
				$( '#btnDatosNuevosCancelar' ).on( 'click', function( event ) 
				{
					event.preventDefault();
					$.sigesop.requestCloseSesion();
				});
				
				// -----------------------click del boton SIGUIENTE
				
				$( '#btnDatosNuevosSiguiente' ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					var i = window.sesion.recorridoArray;
					console.log( i );

					// -------------- interaccion de interfaces de formularios dentro de la ventana

					if ( window.sesion.verificaSiguiente ) 
					{
						if ( i < matrizAcciones.length ) 
						{
							// ---------- creamos las interfaces
							
							matrizAcciones[ i ]();

						 	// ---------- cambio de estado de banderas											

						 	window.sesion.recorridoArray++; // recorremos a la siguiete vista de ventana										 	
						 	window.sesion.verificaSiguiente = false; // bloqueamos el pase a la siguiente vista de ventana hasta que la primera sea completada								
						} 
						else 
						{
							$('#datosPrioridad').modal('hide');
							
						}
					} 
					else 
					{
						$.sigesop.alerta({
							colorEstado: 'danger',
							titulo: 'Error',
							mensajeAlerta: 'Debe completar el registro actual para continuar',							
						});										
					}
				})
			});

			$( '#datosPrioridad' ).on('hidden.bs.modal', function ( e ) { $(this).remove(); delete matrizAcciones });

			// ----------- abrimos la ventana informativa

			$.unblockUI;
			
			$( '#datosPrioridad' ).modal({ 
				keyboard: false,
				backdrop: 'static'
			});
		}
	},

	__roles: function ()
	{	
		// -------------- descargamos las areas de acceso y los roles del servidor

		var rol = null,
			matrizAreaAcceso = null,
			matrizPermisoAcceso = null;
		
		$.sigesop.solicitarDatosSistema({
			clase: 'ajaxUsuarios',
			solicitud: 'obtenerAreasAcceso',
			sincrono: false,
			respuesta: function ( data ) { matrizAreaAcceso = data }
		});

		$.sigesop.solicitarDatosSistema({
			clase: 'ajaxUsuarios',
			solicitud: 'obtenerPermisoAcceso',
			sincrono: false,
			respuesta: function ( data ) { matrizPermisoAcceso = data }
		});	

		if ( matrizAreaAcceso !== null && matrizPermisoAcceso !== null )
		{
			rol = $.sigesop.roles.documentoCatalagoRoles( null, matrizAreaAcceso, matrizPermisoAcceso, '_prioridad');
			document.getElementById( 'bodyDatosPrioridad' ).innerHTML = '<br>' + rol.html;
			rol.javascript();

			$( rol.IDS.botonGuardar ).on( 'click', function ( event )
			{
				event.preventDefault();
				boton = $( this );
				
				// --------------capturamos los accesos seleccionados
				
				rol.datos.matrizAreaAcceso = []; // vaciamos el arreglo para evitar repetidos

				var matriz = rol.IDS.matrizIDareaAcceso;
				for( var i in matriz )
				{
					$( matriz[ i ] ).prop( 'checked' ) ? 
						rol.datos.matrizAreaAcceso.push( $( matriz[ i ] ).val() ) : null;
				}

				// --------------capturamos los permisos seleccionados
				
				rol.datos.matrizPermisoAcceso = []; // vaciamos el arreglo para evitar repetidos

				var matriz = rol.IDS.matrizIDpermisoAcceso;	
				for( var i in matriz ) 
				{
					$( matriz[ i ] ).prop( 'checked' ) ?
						rol.datos.matrizPermisoAcceso.push( $( matriz[ i ] ).val() ) : null;
				}

				// -------------- capturamos las cajas de datos restantes							

				rol.datos.nombreRol.valor = $( rol.datos.nombreRol.idHTML ).val().trim();
				rol.datos.descripcionRol.valor = $( rol.datos.descripcionRol.idHTML ).val().trim();

				// --------------validamos los campos

				var flagValidacionPermisos = true;
				$.isEmptyObject( rol.datos.matrizPermisoAcceso ) ? flagValidacionPermisos = false : null;

				var flagValidacionAreaAcceso = true;
				$.isEmptyObject( rol.datos.matrizAreaAcceso ) ? flagValidacionAreaAcceso = false : null;

				var arregloComprobacion = [ rol.datos.nombreRol, rol.datos.descripcionRol ];
				
				var flagValidacion = false;
				flagValidacion = $.sigesop.validacion( arregloComprobacion, { tipoValidacion: 'error' } );

				// -------------- enviamos insercion a la base de datos

				if ( flagValidacion ) 
				{
					if ( flagValidacionAreaAcceso ) 
					{
						if ( flagValidacionPermisos ) 
						{
							boton.button( 'loading' );
							$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#datosPrioridad_modal');
							
							$.sigesop.insertarDatosSistema({										
								Datos: rol.datos,
								clase: 'ajaxUsuarios',
								solicitud: 'nuevoRolUsuario',
								type: 'POST',
								OK: function () 
								{
									$( '#datosPrioridad_modal' ).unblock();
									window.sesion.verificaSiguiente = true;
									$('#bodyDatosPrioridad').html('<div class="alert alert-success"><h4 class="text-center">Rol agregado correctamente</h4></div>');
								},

								NA: function () 
								{
									$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#datosPrioridad_modal' );
									boton.button('reset');
								},

								DEFAULT: function (data) 
								{
									$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#datosPrioridad_modal' );
									boton.button( 'reset' );
								},

								errorRespuesta: function ()
								{ 
									$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#datosPrioridad_modal' ); 
									boton.button( 'reset' );
								}
							}) ;
						} else 
						{
							$.sigesop.msgBlockUI( 'No se han seleccionado permisos de usuario', 'error', 'msgBlock', '#datosPrioridad_modal' );
							var permiso = {
								idHTML: rol.IDS.divPermisoAcceso,
								popover: {
									content: 'Seleccione Permisos para el rol de usuario',
									placement: 'top'
								}
							}
							$.sigesop.validacion( [ permiso ], { tipoValidacion: 'error' } );
						}
					} else 
					{
						$.sigesop.msgBlockUI( 'No se han seleccionado areas de acceso', 'error', 'msgBlock', '#datosPrioridad_modal' );
						
						var acceso = {
							idHTML: rol.IDS.divAreaAcceso,
							popover: {
								content: 'Seleccione areas de acceso visibles para el rol de usuario',
								placement: 'top'
							}
						}
						$.sigesop.validacion( [ acceso ], { tipoValidacion: 'error' } );										
					}
				} 
				// else $.sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#datosPrioridad_modal' );
			});
		}		
	},

	__areaTrabajo: function()
	{
		var area = $.sigesop.areaTrabajo.documentoAreaTrabajo( null, 'Prioridad' );
		document.getElementById( 'bodyDatosPrioridad' ).innerHTML = '<br>' + area.html;
		area.javascript();

		$( area.IDS.botonGuardar ).on( 'click', function ( event )
		{
			event.preventDefault();
			var boton = $(this);

			// -------------- capturamos los datos de las cajas

			area.datos.claveAreaTrabajo.valor = $( area.datos.claveAreaTrabajo.idHTML ).val().trim();
			area.datos.descripcionAreaTrabajo.valor = $( area.datos.descripcionAreaTrabajo.idHTML ).val().trim();

			var arregloComprobacion = [
				area.datos.claveAreaTrabajo,
				area.datos.descripcionAreaTrabajo
			];

			var flagValidacion = true;
			flagValidacion = $.sigesop.validacion( arregloComprobacion, { tipoValidacion: 'error' } );

			if ( flagValidacion ) 
			{
				boton.button('loading');
				$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#datosPrioridad_modal');

				$.sigesop.insertarDatosSistema({
					Datos: area.datos,
					clase: 'ajaxUsuarios',
					solicitud: 'nuevaAreaTrabajo',
					type: 'POST',
					OK: function () 
					{
						$( '#datosPrioridad_modal' ).unblock();
						window.sesion.verificaSiguiente = true;
						$( '#bodyDatosPrioridad' ).html( '<div class="alert alert-success"><h4 class="text-center">Área de trabajo agregado correctamente</h4></div>' );
						boton.button( 'reset' );
					},

					NA: function () 
					{
						$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );
					},

					DEFAULT: function (data) 
					{
						$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );
					},
					errorRespuesta: function ()
					{
						$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );
					}
				}) ;
			} 
			// else $.sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#datosPrioridad_modal' );
		});
	},

	__personal: function()
	{
		var	usr = null,
			matrizTipoRol = null,
			matrizAreaTrabajo = null;

		$.sigesop.solicitarDatosSistema({
			clase: 'ajaxUsuarios',
			solicitud: 'obtenerTipoRolUsuario',
			sincrono: false,
			respuesta: function ( data ) { matrizTipoRol = data	}
		});

		$.sigesop.solicitarDatosSistema({
			clase: 'ajaxUsuarios',
			solicitud: 'obtenerAreaTrabajo',
			sincrono: false,
			respuesta: function ( data ) { matrizAreaTrabajo = data }
		});

		if ( matrizTipoRol != null && matrizAreaTrabajo != null ) 
		{			
			usr = $.sigesop.usuarios.documentoCatalogoUsuarios( null, matrizTipoRol, matrizAreaTrabajo, '_prioridad' );
			document.getElementById( 'bodyDatosPrioridad' ).innerHTML = usr.html;
			usr.javascript()

			$( usr.IDS.botonGuardar ).on( 'click', function ( event ) 
			{
				event.preventDefault();
				var boton = $(this);

				// ----------------- capturamos los datos del HTML

			    usr.datos.nombreUsuario.valor = $( usr.datos.nombreUsuario.idHTML ).val().trim();
				usr.datos.apellidosUsuario.valor = $( usr.datos.apellidosUsuario.idHTML ).val().trim();
				usr.datos.RPEusuario.valor = $( usr.datos.RPEusuario.idHTML ).val().trim();
				usr.datos.usuario.valor = $( usr.datos.usuario.idHTML ).val().trim();
				usr.datos.areaTrabajo.valor = $( usr.datos.areaTrabajo.idHTML ).val().trim(),
				usr.datos.rolUsuario.valor = $( usr.datos.rolUsuario.idHTML ).val().trim();
					
				var	claveUsuario = null;
				!jQuery.isEmptyObject( $( usr.datos.claveUsuario.idHTML ).val() ) ?
					claveUsuario = $.sigesop.SHA1( $( usr.datos.claveUsuario.idHTML ).val() ) : claveUsuario = null ;
				 
				usr.datos.claveUsuario.valor = claveUsuario;
				
				// ----------------- validamos las cadenas de los campos
				var arregloComprobacion = [
					usr.datos.nombreUsuario,
					usr.datos.apellidosUsuario,
					usr.datos.RPEusuario,
					usr.datos.usuario,
					usr.datos.claveUsuario,
					usr.datos.areaTrabajo,
					usr.datos.rolUsuario
				]

				var flagValidacion = true;
				flagValidacion = $.sigesop.validacion(arregloComprobacion, {tipoValidacion: 'error'});


				// ----------------- comprobamos banderas y ejecutamos ajax al sistema

				if ( flagValidacion ) 
				{
					if ( window.sesion.flagClave )
					{
						boton.button( 'loading' );
						$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#datosPrioridad_modal');

						$.sigesop.insertarDatosSistema({
							Datos: usr.datos,
							clase: 'ajaxUsuarios',
							solicitud: 'nuevoUsuario',
							type: 'POST',
							OK: function()
							{
								$( '#datosPrioridad_modal' ).unblock();
								window.sesion.verificaSiguiente = true;
								$( '#bodyDatosPrioridad' ).html( '<div class="alert alert-success"><h4 class="text-center">Usuario agregado correctamente</h4></div>' );
								boton.button( 'reset' );
							},
							NA: function()
							{
								$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#datosPrioridad_modal' );
								boton.button('reset');
							},
							DEFAULT: function( data )
							{
								$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#datosPrioridad_modal' );
								boton.button( 'reset' );
							},
							errorRespuesta: function()
							{
								$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#datosPrioridad_modal' );
								boton.button( 'reset' );
							}
						});
					} 
					else $.sigesop.msgBlockUI( 'error en la coincidencia de las contraseñas', 'error', 'msgBlock', '#datosPrioridad_modal' );
				} 
				else $.sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#datosPrioridad_modal' );
			} );
		}
	},

	__central: function()
	{
		var central = $.sigesop.gestionCentral.documentoCatalogoGestionCentral( null, '_prioridad', false );
		document.getElementById( 'bodyDatosPrioridad' ).innerHTML = central.html;
		central.javascript();

		$( central.IDS.botonGuardar ).on( 'click', function ( event ) 
		{
			event.preventDefault();
			var boton = $( this );

			central.datos.claveCentral.valor = $( central.datos.claveCentral.idHTML ).val().trim();
			// !$.isEmptyObject(globalDatosCentral) ? envioDatos.claveCentralUpdate.valor = globalDatosCentral[0]["clave_20"] : envioDatos.claveCentralUpdate.valor = null;
			central.datos.claveSAP.valor = $( central.datos.claveSAP.idHTML ).val().trim();
			central.datos.centroCosto.valor = $( central.datos.centroCosto.idHTML ).val().trim();
			central.datos.nombreCentral.valor = $( central.datos.nombreCentral.idHTML ).val().trim();
			central.datos.direccion.valor = $( central.datos.direccion.idHTML ).val().trim();
			central.datos.telefono.valor = $( central.datos.telefono.idHTML ).val().trim();
			central.datos.codigoPostal.valor = $( central.datos.codigoPostal.idHTML ).val().trim();
			// central.datos.superintendente.valor = $( central.datos.superintendente.idHTML ).val().trim();		

			var arregloValidacion = [
				central.datos.claveCentral,			
				central.datos.claveSAP,
				central.datos.centroCosto,
				central.datos.nombreCentral,
				central.datos.direccion,
				central.datos.telefono,
				central.datos.codigoPostal,
				central.datos.superintendente
			];

			var flagValidacion = false;
			flagValidacion = $.sigesop.validacion(arregloValidacion, {tipoValidacion: 'error'});

			if ( flagValidacion ) 
			{
				boton.button( 'loading' );
				$.sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#datosPrioridad_modal');

				$.sigesop.insertarDatosSistema({
					Datos: central.datos,
					clase: 'ajaxGestionCentral',
					solicitud: 'nuevaCentral',
					type: 'POST',
					OK: function()
					{	
						$( '#datosPrioridad_modal' ).unblock();
						window.sesion.verificaSiguiente = true;
						$('#bodyDatosPrioridad').html('<div class="alert alert-success"><h4 class="text-center">Datos de central correctamente</h4></div>');
					},

					NA: function()
					{
						$.sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );
					},

					DEFAULT: function( data )
					{
						$.sigesop.msgBlockUI( data, 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );
					},

					errorRespuesta: function()
					{
						$.sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error', 'msgBlock', '#datosPrioridad_modal' );
						boton.button( 'reset' );	
					}
				});
			} 
			else $.sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#datosPrioridad_modal' );
		} );
	},

	// --------------------------------------------------------------

	graficaPastel: function ( data, elem ) 
	{
    	if ( data !== null ) 
    	{
    		try 
    		{
		    	// Radialize the colors
				Highcharts.getOptions().colors = Highcharts.map(Highcharts.getOptions().colors, function(color) {
				    return {
				        radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
				        stops: [
				            [0, color],
				            [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
				        ]
				    };
				});

				var	html = '';
				for ( var i = 0, lon = data.length; i < lon; i++ )
					html += '<div id="unidad_' + i + '" class="graficaPastel"></div>';

				$( elem ).html( html );			

				for ( var i = 0, lon = data.length; i < lon; i++ )
				{
					if ( data[ i ].capacidad_instalada != 0 )
					{	
						// si la capacidad instala no es nula realizamos los calculos adecuados para determinar los porcentajes, asi como
						// guardar datos para graficar en la barra
						var 								
							porcentDisponible = ( data[ i ].capacidad_efectiva_unidad * 100 ) / data[ i ].capacidad_instalada,
							porcentMantto = ( data[ i ].MWMantto * 100 ) / data[ i ].capacidad_instalada,
							porcentCA = ( data[ i ].MWca * 100 ) / data[ i ].capacidad_instalada,
							porcentFalla = (data[ i ].MWFalla * 100 ) / data[ i ].capacidad_instalada,

							generadoresDispo = data[ i ].numGenAct,
							generadoresMantto = data[ i ].numGenMantto,
							generadoresCausaAjen = data[ i ].numGenCA,
							generadoresFalla = data[ i ].numGenFalla;
					} 

					else
					{
						// definimos todos los valores a 0 pues no hay datos, de esta manera dejara la barras vacias y sin errores
						var 
							porcentDisponible = 0,
							generadoresDispo = 0, 
							generadoresMantto = 0, 
							porcentMantto = 0,

							generadoresCausaAjen = 0, 
							generadoresFalla = 0, 
							porcentCA = 0, 
							porcentFalla = 0;
					}	

				    $( '#unidad_' + i ).highcharts(
				    {
				        chart: {
				            plotBackgroundColor: null,
				            plotBorderWidth: null,
				            plotShadow: false
				        },
				        title: {
				            text: 'Unidad ' + data[ i ].numero_unidad
				        },
				        tooltip: {
				    	    pointFormat: '<b>Megawatts: </b>{point.MG:.2f} <br> <b>{point.name}:</b> {point.percentage:.1f} %'
				        },
				        plotOptions: {
				            pie: {
				                allowPointSelect: true,
				                cursor: 'pointer',
				                dataLabels: {
				                    enabled: false,
				                    color: '#000000',
				                    connectorColor: '#000000',
				                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
				                },
				                showInLegend: true
				            }
				        },
				        series: [{
				            type: 'pie',
				            name: 'Porcentaje',			            
				            data: [
				                {
				                    name: 'Disponible',
				                    y: parseFloat(porcentDisponible.toFixed(2)),
				                    sliced: true,
				                    selected: true,
				                    color: '#5CB85C',
				                    MG: data[ i ].capacidad_efectiva_unidad
				                },
				                {
				                    name: 'Mantenimiento',
				                    y: parseFloat( porcentMantto.toFixed(2) ),
				                    color: '#5bc0de',
				                    MG: data[ i ].MWMantto
				                },
				                {
				                    name: 'Causa ajena',
				                    y: parseFloat( porcentCA.toFixed(2) ),
				                    color: '#f0ad4e',
				                    MG: data[ i ].MWca
				                },
				                {
				                    name: 'Falla',
				                    y: parseFloat( porcentFalla.toFixed(2) ),
				                    color: '#d9534f',
				                    MG: data[ i ].MWFalla
				                }
				            ]
				        }]
				    });
				}
			} 

			catch (e) 
			{
				alert('Es necesario importar la libreria de graficación');
			}
		}

		else console.log( 'function: graficaPastel, [data] es nulo' );
	},

	tablaCapacidades: function ( data, suf ) 
	{
		if ( jQuery.isEmptyObject( data ) )
		{
			console.log( 'function: tablaCapacidades, [data] es nulo ' );
			return null
		}

		suf = suf || '';
		
		var 
			struct_seccion = function( arr )
			{
				var 
					html = '<div class="row"><div class="col-sm-1"></div><div id="acordEstadoCapac' + 
							suf + '" class="col-sm-10">',
					i = 0,
					lon = arr.length;

				for( i ; i < lon; i++ )
				{
					var obj = arr[ i ];

					obj.capacidad_instalada = obj.capacidad_instalada || 0;
					obj.capacidad_efectiva_unidad = obj.capacidad_efectiva_unidad || 0;

					obj.numGen = obj.numGen || 0;
					obj.numGenAct = obj.numGenAct || 0;
					obj.numGenMantto = obj.numGenMantto || 0;
					obj.numGenCA = obj.numGenCA || 0;
					obj.numGenFalla = obj.numGenFalla || 0;

					if( obj.capacidad_instalada != 0 )
					{
						var
							porcentDisponible = ( obj.capacidad_efectiva_unidad * 100 ) / obj.capacidad_instalada,
							porcentMantto = ( obj.MWMantto * 100) / obj.capacidad_instalada,
							porcentCA = ( obj.MWca * 100 ) / obj.capacidad_instalada,
							porcentFalla = ( obj.MWFalla * 100 ) / obj.capacidad_instalada,
							instalado = 100;
					}

					else
					{
						var
							porcentDisponible = 0,
							porcentMantto = 0,
							porcentCA = 0,
							porcentFalla = 0,
							instalado = 0;
					}
			
					html += 
						'<h2>Unidad ' + obj.numero_unidad + '</h2>'+
						'<div>'+
						'	<h4>Capacidad instalada Unidad: ' + parseFloat( obj.capacidad_instalada ).toFixed( 2 ) + ' MW</h4>'+
						'	<div class="progress progress-striped active">' +
						'		<div class="progress-bar progress-bar-success" style="width:' + instalado + '%">'+
						'	  	  <span>' + instalado.toFixed( 2 ) + '%</span>' +
						'		</div>'+
						'	</div>'+

						'	<h4>Capacidad Efectiva Unidad: ' + parseFloat( obj.capacidad_efectiva_unidad ).toFixed( 2 ) + ' MW</h4>'+
						'	<div class="progress progress-striped active">'+
						'		<div class="progress-bar progress-bar-success" style="width:' + porcentDisponible + '%">' +
						'			<span>' + porcentDisponible.toFixed( 2 ) + '%</span>'+
						'		</div>'+
						'		<div class="progress-bar progress-bar-info" style="width:' + porcentMantto + '%">' +
						'			<span>' + porcentMantto.toFixed( 2 ) + '%</span>'+
						'		</div>'+
						'		<div class="progress-bar progress-bar-warning" style="width:' + porcentCA + '%">' +
						'			<span>' + porcentCA.toFixed( 2 ) + '%</span>'+
						'		</div>'+
						'		<div class="progress-bar progress-bar-danger" style="width:' + porcentFalla + '%">'+
						'			<span>' + porcentFalla.toFixed( 2 ) + '%</span>'+
						'		</div>'+
						'	</div>'+

						'<label>Nomenclatura:</label> &nbsp;'+
						'<span class="label label-success">Disponibles</span>&nbsp;' +
						'<span class="label label-info">Mantenimiento</span>&nbsp;' +
						'<span class="label label-warning">Causas ajenas</span>&nbsp;' +
						'<span class="label label-danger">Falla</span><br><br>' +

						'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">Aerogeneradores instalados: ' + obj.numGen + '</span><br>' +
						'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">Aerogeneradores en disponibilidad: ' + obj.numGenAct + '</span><br>' +
						'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">Aerogeneradores en mantenimiento: ' + obj.numGenMantto + '</span><br>' +
						'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">Aerogeneradores en causa ajena: ' + obj.numGenCA + '</span><br>' +
						'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">Aerogeneradores en falla: ' + obj.numGenFalla + '</span><br><br>' +

						'<div class="panel panel-success">' + struct_tabla( obj.generadores ) + '</div>'+
						'</div>';
				}

				html += '</div><div class="col-sm-1"></div></div><br>';

				return html;
			},

			struct_tabla = function ( arr )
			{
				if ( jQuery.isEmptyObject( arr ) )	return '';
								
				var
					html =
					'<div class="panel-heading">Tabla desglosada</div>' +
					'<table class="table table-hover">' +												
						'<thead><tr><th>Aerogenerador</th><th>Capacidad efectiva</th><th>' +
						'Fecha de operación</th><th>Estado</th></tr></thead>' +
						'<tbody>';

					// iteramos las filas de la tabla
					for ( var i = 0, lon = arr.length; i < lon; i++ ) 
					{
						// verificamos el estado en que se encuentra el aerogenerador para definir el color y la descripcion adecuada
						var mensajeEstado, estadoColor;
						switch( arr[ i ].estado_licencia )
						{
							case 'DISPONIBLE':							
								mensajeEstado = 'Disponible';
								estadoColor = 'success';
								break;
							case 'FALLA':
								mensajeEstado = 'Falla';
								estadoColor = 'danger';
								break;
							case 'MTTO':
								mensajeEstado = 'Mantenimiento';
								estadoColor = 'info';
								break;
							case 'C.A.':
								mensajeEstado = 'Causa ajena';
								estadoColor = 'warning';
								break;
						}

						// insertamos las filas de la tabla
						html +=
						'<tr class="'+ estadoColor +'">' +
							'<td>' + arr[ i ].numero_aero + '</td>' +
							'<td>' + arr[ i ].capacidad_efectiva_aero + '</td>' +
							'<td>' + arr[ i ].fecha_operacion + '</td>' +
							'<td>' + mensajeEstado + '</td>' +
						'</tr>';
					}
					
					html += '</tbody></table>'
					return html;					
			},

			javascript = function ()
			{
				$( this.IDS.acordion ).accordion({
					collapsible: true,
					heightStyle: "content"
				});
			},

			doc = {
				html: struct_seccion( data ),
				javascript: javascript,
				IDS:
				{
					acordion: '#acordEstadoCapac' + suf
				}
			};

		return doc;
	}	
};