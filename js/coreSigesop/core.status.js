sigesop.status = {
	comprobarDatosPrincipalesNulos: function () {
		sigesop.query({
			class: 'status',
			query: 'comprobarDatosPrincipalesNulos',
			success: sigesop.status.__datosPrincipalesNulos
		});			
	},

	__datosPrincipalesNulos: function ( data ) {
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
			matrizAcciones.push( sigesop.status.__roles );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Rol de superintendente<br>';
		} 

		if ( data.areaTrabajo === null ) 
		{
			flag = true;
			matrizAcciones.push( sigesop.status.__areaTrabajo );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Area de Trabajo del superintendente<br>';
		} 

		if ( data.personal === null ) 
		{						
			flag = true;
			matrizAcciones.push( sigesop.status.__personal );			
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Información del superintendente<br>';
		}		

		if ( data.central === null ) 
		{
			flag = true;
			matrizAcciones.push( sigesop.status.__central );
			camposError += '    <span class="glyphicon glyphicon-remove"></span> Datos de la central<br>';
		}

		// ---------------- existe algún elemento nulo?

		if ( flag ) {
			// ---------------- creacion y ejecucion de la ventana

			var alerta =
				'<div id="datosPrioridad" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
					'<div class="modal-dialog modal-lg">'+
						'<div id="datosPrioridad_modal" class="modal-content">'+
							'<div class="modal-header">'	+
								'<h4 class="modal-title" >Información importante</h4>'+
							'</div>' +

							'<div id="bodyDatosPrioridad" class="modal-body">'+
								'<div class="alert alert-danger">'+
									'<p>' +
										'<h5 class="">'+
											'Se ha detectado falta de datos importantes para el funcionamiento del sistema. ' + camposError +
											'<br>Haga click al boton continuar para ingresar los datos correspondientes.'+
										'</h5>' +
									'</p>'+
								'</div>'+
							'</div>'+

							'<div class="modal-footer">'+
								'<button id="btnDatosNuevosCancelar" type="button" class="btn btn-danger">Cancelar</button> '+
								'<button id="btnDatosNuevosSiguiente" type="button" class="btn btn-success">Siguiente</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
			$( 'body' ).append( alerta );

			// -------------- cargar rutina antes de abrir la ventana
			
			$( '#datosPrioridad' ).on( 'show.bs.modal', function ( e ) 
			{
				$( '#btnDatosNuevosCancelar' ).on( 'click', function( event ) 
				{
					event.preventDefault();
					sigesop.cerrarSesion();
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
						sigesop.alerta({
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

	__roles: function () {
		var 		
		leerDatos = function ( datos, IDS ) {
			/* capturamos los accesos seleccionados
			 */
			datos.matrizAreaAcceso.length = 0; // vaciamos el arreglo para evitar repetidos
			var 
				i = 0,
				lon = IDS.mtz_areaAcceso.length,
				matriz = IDS.mtz_areaAcceso;
			
			for( i ; i < lon; i++ )
				if ( $( matriz[ i ].idHTML ).prop( 'checked' ) ) 
				datos.matrizAreaAcceso.push( $( matriz[ i ].idHTML ).val() );	


			/* capturamos los permisos seleccionados
			 */ 
			datos.matrizPermisoAcceso.length = 0; // vaciamos el arreglo para evitar repetidos	
			var 
				i = 0,
				lon = IDS.mtz_permisoAcceso.length,
				matriz = IDS.mtz_permisoAcceso;
			
			for( i ; i < lon; i++ )
				if ( $( matriz[ i ].idHTML ).prop( 'checked' ) ) 
				datos.matrizPermisoAcceso.push( $( matriz[ i ].idHTML ).val() );

			/* capturamos cajas de texto
			 */ 
			datos.nombreRol.valor = $( datos.nombreRol.idHTML ).val().trim();
			datos.descripcionRol.valor = $( datos.descripcionRol.idHTML ).val().trim();	
		},
		
		nuevoElemento = function ( datos, IDS, limpiarCampos ) {
			/* capturamos todos los datos del formulario
			 */
			leerDatos ( datos, IDS );

			/* Enviamos a servidor
			 */ 
			sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
			sigesop.query({										
				data: datos,
				class: 'usuarios',
				query: 'nuevoRolUsuario',
				queryType: 'sendData',
				type: 'POST',
				OK: function ( msj, eventos ) 
				{
					$.unblockUI();
					window.sesion.verificaSiguiente = true;
					$('#bodyDatosPrioridad').html('<div class="alert alert-success"><h4 class="text-center">Rol agregado correctamente</h4></div>');
				},
				NA: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
				},
				DEFAULT: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
				},
				error: function () { 
					$.unblockUI(); 
					sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
				}	
			}) ;
		},

		rol = sigesop.roles.document({
			success: nuevoElemento
		});

		document.getElementById( 'bodyDatosPrioridad' ).innerHTML = '<br>' + rol.html;
		rol.javascript();

		sigesop.query({
			class: 'usuarios',
			query: 'obtenerAreasAcceso',
			success: function ( data ) 
			{
				window.sesion.matrizAreaAcceso = data;		
				rol.update_areaAcceso( data );
			}
		});

		sigesop.query({
			class: 'usuarios',
			query: 'obtenerPermisoAcceso',
			success: function ( data ) 
			{
				window.sesion.matrizPermisoAcceso = data;
				rol.update_permisoAcceso( data );
			}
		});
	},

	__areaTrabajo: function() {
		var 
		nuevoElemento = function ( datos, IDS ) {
			datos.claveAreaTrabajo.valor = $( datos.claveAreaTrabajo.idHTML ).val().trim();
			datos.descripcionAreaTrabajo.valor = $( datos.descripcionAreaTrabajo.idHTML ).val().trim();

			sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
			sigesop.query({
				data: datos,
				class: 'usuarios',
				query: 'nuevaAreaTrabajo',
				queryType: 'sendData',
				type: 'POST',
				OK: function ( msj, eventos ) 
				{
					$.unblockUI();
					window.sesion.verificaSiguiente = true;
					$( '#bodyDatosPrioridad' ).html( '<div class="alert alert-success"><h4 class="text-center">Área de trabajo agregado correctamente</h4></div>' );
				},
				NA: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
				},
				DEFAULT: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
				},
				error: function () { 
					$.unblockUI(); 
					sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
				}
			}) ;
		},

		area = sigesop.areaTrabajo.document({
			success: nuevoElemento
		});

		document.getElementById( 'bodyDatosPrioridad' ).innerHTML = '<br>' + area.html;
		area.javascript();
	},

	__personal: function() {
		var	
		nuevoElemento = function ( datos, IDS ) {
			/* Leemos los datos del formulario
			 */ 
		    datos.nombreUsuario.valor = $( datos.nombreUsuario.idHTML ).val().trim();
			datos.apellidosUsuario.valor = $( datos.apellidosUsuario.idHTML ).val().trim();	
			datos.RPEusuario.valor = $( datos.RPEusuario.idHTML ).val().trim();
			datos.usuario.valor = $( datos.usuario.idHTML ).val().trim();
			datos.claveUsuario.valor = $( datos.claveUsuario.idHTML ).val().trim().SHA1();
			datos.areaTrabajo.valor = $( datos.areaTrabajo.idHTML ).val();
			datos.rolUsuario.valor = $( datos.rolUsuario.idHTML ).val();

			/* Enviamos al servidor
			 */ 
			sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
			sigesop.query({
				data: datos,
				class: 'usuarios',
				query: 'nuevoUsuario',
				queryType: 'sendData',
				type: 'POST',
				OK: function ( msj, eventos ) 
				{
					$.unblockUI();
					window.sesion.verificaSiguiente = true;
					$( '#bodyDatosPrioridad' ).html( '<div class="alert alert-success"><h4 class="text-center">Usuario agregado correctamente</h4></div>' );
				},
				NA: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
				},
				DEFAULT: function ( msj, eventos ) 
				{
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
				},
				error: function () { 
					$.unblockUI(); 
					sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
				}
			});
		},

		usr = sigesop.usuarios.document({
				success: nuevoElemento
			});

		document.getElementById( 'bodyDatosPrioridad' ).innerHTML = usr.html;
		usr.javascript();

		sigesop.query({
			class: 'usuarios',
			query: 'obtenerAreaTrabajo',		
			success: function( data )
			{			
				window.sesion.matrizAreaTrabajo = data;
				sigesop.combo({
					arr: data, 
					elem: usr.datos.areaTrabajo.idHTML, 
					campo: 'clave_areaTrabajo, descripcion_areaTrabajo', 
					campoValor: 'clave_areaTrabajo'
				});			
			}
		});	
			
		sigesop.query({
			class: 'usuarios',
			query: 'obtenerTipoRolUsuario',
			success: function( data )
			{
				window.sesion.matrizTipoRol = data;
				sigesop.combo({
					arr: data, 
					elem: usr.datos.rolUsuario.idHTML, 
					campo: 'clave_rol, descripcion_areaTrabajo', 
					campoValor: 'clave_rol'
				});			
			}										
		});	
	},

	__central: function() {

		var 

		error = function () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); },

		nuevaCentral = function ( datos, IDS ) {
			datos.clave_20.valor = $( datos.clave_20.idHTML ).val().trim();	
			datos.clave_sap.valor = $( datos.clave_sap.idHTML ).val().trim();
			datos.centro_costo.valor = $( datos.centro_costo.idHTML ).val().trim();
			datos.nombre_central.valor = $( datos.nombre_central.idHTML ).val().trim();
			datos.direccion.valor = $( datos.direccion.idHTML ).val().trim();
			datos.telefono.valor = $( datos.telefono.idHTML ).val().trim();
			datos.cp.valor = $( datos.cp.idHTML ).val().trim();
			datos.superintendente.valor = $( datos.superintendente.idHTML ).val().trim();

			sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
			sigesop.query({
				data: datos,
				class: 'gestionCentral',
				query: 'nuevaCentral',
				queryType: 'sendData',
				type: 'POST',
				OK: function( msj, eventos ) {
					$.unblockUI();
					window.sesion.verificaSiguiente = true;
					document.getElementById( '#bodyDatosPrioridad'.flushChar('#') )
					.innerHTML = '<div class="alert alert-success"><h4 class="text-center">Datos de central correctamente</h4></div>';
				},
				NA: function ( msj, eventos ) {
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
				},
				DEFAULT: function ( msj, eventos ) {
					$.unblockUI();
					sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
				}
			});
		},

		central = sigesop.gestionCentral.document({
			error: error,
			success: nuevaCentral
		});

		document.getElementById( 'bodyDatosPrioridad' )
		.innerHTML = central.html;
		central.javascript();
		central.enable();

		// $( central.IDS.botonGuardar ).on( 'click', function ( event ) 
		// {
		// 	event.preventDefault();
		// 	var boton = $( this );

		// 	central.datos.claveCentral.valor = $( central.datos.claveCentral.idHTML ).val().trim();
		// 	// !$.isEmptyObject(globalDatosCentral) ? envioDatos.claveCentralUpdate.valor = globalDatosCentral[0]["clave_20"] : envioDatos.claveCentralUpdate.valor = null;
		// 	central.datos.claveSAP.valor = $( central.datos.claveSAP.idHTML ).val().trim();
		// 	central.datos.centroCosto.valor = $( central.datos.centroCosto.idHTML ).val().trim();
		// 	central.datos.nombreCentral.valor = $( central.datos.nombreCentral.idHTML ).val().trim();
		// 	central.datos.direccion.valor = $( central.datos.direccion.idHTML ).val().trim();
		// 	central.datos.telefono.valor = $( central.datos.telefono.idHTML ).val().trim();
		// 	central.datos.codigoPostal.valor = $( central.datos.codigoPostal.idHTML ).val().trim();
		// 	// central.datos.superintendente.valor = $( central.datos.superintendente.idHTML ).val().trim();		

		// 	var arregloValidacion = [
		// 		central.datos.claveCentral,			
		// 		central.datos.claveSAP,
		// 		central.datos.centroCosto,
		// 		central.datos.nombreCentral,
		// 		central.datos.direccion,
		// 		central.datos.telefono,
		// 		central.datos.codigoPostal,
		// 		central.datos.superintendente
		// 	];

		// 	var flagValidacion = false;
		// 	flagValidacion = sigesop.validacion(arregloValidacion, {tipoValidacion: 'error'});

		// 	if ( flagValidacion ) 
		// 	{
		// 		boton.button( 'loading' );
		// 		sigesop.msgBlockUI( 'Enviando...', 'loading', 'block', '#datosPrioridad_modal');

		// 		sigesop.query({
		// 			data: central.datos,
		// 			class: 'gestionCentral',
		// 			query: 'nuevaCentral',
		// 			queryType: 'sendData',
		// 			type: 'POST',
		// 			OK: function()
		// 			{	
		// 				$( '#datosPrioridad_modal' ).unblock();
		// 				window.sesion.verificaSiguiente = true;
		// 				$('#bodyDatosPrioridad').html('<div class="alert alert-success"><h4 class="text-center">Datos de central correctamente</h4></div>');
		// 			},

		// 			NA: function()
		// 			{
		// 				sigesop.msgBlockUI( 'Un campo necesario se encuentra nulo o no es válido', 'error', 'msgBlock', '#datosPrioridad_modal' );
		// 				boton.button( 'reset' );
		// 			},

		// 			DEFAULT: function( data )
		// 			{
		// 				sigesop.msgBlockUI( data, 'error', 'msgBlock', '#datosPrioridad_modal' );
		// 				boton.button( 'reset' );
		// 			}
		// 		});
		// 	} 
		// 	else sigesop.msgBlockUI( 'Complete los campos', 'error', 'msgBlock', '#datosPrioridad_modal' );
		// } );
	},

	barraCapacidad: function ( opt ) {
		/* arr
		 * elem
		 */ 
		
		var 

		update_barra = function ( data ) {
			if ( $.isEmptyObject( data ) ||
			 	 $.isEmptyObject( data.capacidad_instalada_central ) ) {				
				return -1;
			} 

			var 
			IDS = this.IDS,
			instalado = $.isEmptyObject( data.capacidad_instalada_central ) ? 0 : 100,
			c_efectiva = data.capacidad_efectiva_central || 0,
			c_instalada = data.capacidad_instalada_central || 0,
			p_falta_aire = data.falta_aire.mw || 0,
			p_disponible = ( ( parseFloat( data.disponible.mw ) + parseFloat( p_falta_aire ) ) * 100 ) / c_instalada || 0,
			p_falla = ( data.falla.mw * 100 ) / c_instalada || 0,
			p_mantto = ( data.mtto.mw * 100 ) / c_instalada || 0,
			p_ca = ( data.causa_ajena.mw * 100 ) / c_instalada || 0,
			html =			
				'<h4>Capacidad instalada central: ' + parseFloat( c_instalada ).toFixed(2) + ' MW</h4>' +
				'<div class="progress">' +
					'<div class="progress-bar progress-bar-success progress-bar-striped active" ' +
					'role="progressbar" aria-valuenow="45" aria-valuemin="0" ' +
					'style="width:' + instalado + '%" aria-valuemax="100">' +
						'<span>' + instalado.toFixed( 2 ) + '%</span>' +
					'</div>' +
				'</div>' +


				'<h4>Capacidad efectiva central: ' + parseFloat( c_efectiva ).toFixed(2) + ' MW</h4>' +
				'<div class="progress">' +
					'<div class="progress-bar progress-bar-success progress-bar-striped active" ' +
					'role="progressbar" aria-valuenow="45" aria-valuemin="0" ' +
					'style="width:' + p_disponible + '%" aria-valuemax="100">' +
						'<span>' + p_disponible.toFixed( 2 ) + '%</span>' +
					'</div>' +

					'<div class="progress-bar progress-bar-info progress-bar-striped active" ' +
					'role="progressbar" aria-valuenow="45" aria-valuemin="0" ' +
					'style="width:' + p_mantto + '%" aria-valuemax="100">' +
						'<span>' + p_mantto.toFixed( 2 ) + '%</span>' +
					'</div>' +

					'<div class="progress-bar progress-bar-warning progress-bar-striped active" ' +
					'role="progressbar" aria-valuenow="45" aria-valuemin="0" ' +
					'style="width:' + p_ca + '%" aria-valuemax="100">' +
						'<span>' + p_ca.toFixed( 2 ) + '%</span>' +
					'</div>' +

					'<div class="progress-bar progress-bar-danger progress-bar-striped active" ' +
					'role="progressbar" aria-valuenow="45" aria-valuemin="0" ' +
					'style="width:' + p_falla + '%" aria-valuemax="100">' +
						'<span>' + p_falla.toFixed( 2 ) + '%</span>' +
					'</div>' +
				'</div>';

			return html;
		};

		document.getElementById( opt.elem.flushChar('#') )
		.innerHTML = update_barra( opt.arr );
	},

	graficaPastel: function ( opt ) {
		if ( typeof Highcharts === 'undefined' )
		throw new Error( 'Libreria Highcharts es indefinida' );

		/* data
		 * elem
		 */ 
    	if ( $.isEmptyObject( opt.arr ) ) {
    		console.log( 'function: graficaPastel, [data] es nulo' );
    		return -1;
    	}

    	var data = opt.arr;

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

		document.getElementById( opt.elem.flushChar('#') )
		.innerHTML = html;
		// $( elem ).html( html );		

		for ( var i = 0, lon = data.length; i < lon; i++ ) {
			var 
			capacidad_instalada = data[ i ].capacidad_instalada,
			mw_disp = parseFloat( data[ i ].disponible.mw ) || 0,
			mw_fa = parseFloat( data[ i ].falta_aire.mw ) || 0,
			mw_mtto = parseFloat( data[ i ].mtto.mw ) || 0,
			mw_ca = parseFloat( data[ i ].causa_ajena.mw ) || 0,
			mw_falla = parseFloat( data[ i ].falla.mw ) || 0,			
			
			capacidad_efectiva_unidad = mw_disp + mw_fa,
			p_disponible = ( capacidad_efectiva_unidad * 100 ) / capacidad_instalada || 0,
			p_mantto = ( mw_mtto * 100 ) / capacidad_instalada || 0,
			p_ca = ( mw_ca * 100 ) / capacidad_instalada || 0,
			p_falla = ( mw_falla * 100 ) / capacidad_instalada || 0;


		    $( '#unidad_' + i ).highcharts({
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
		            	size: '100%',
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
		                    y: parseFloat(p_disponible.toFixed(2)),
		                    sliced: true,
		                    selected: true,
		                    color: '#5CB85C',
		                    MG: capacidad_efectiva_unidad
		                },
		                {
		                    name: 'Mantenimiento',
		                    y: parseFloat( p_mantto.toFixed(2) ),
		                    color: '#5bc0de',
		                    MG: mw_mtto
		                },
		                {
		                    name: 'Causa ajena',
		                    y: parseFloat( p_ca.toFixed(2) ),
		                    color: '#f0ad4e',
		                    MG: mw_ca
		                },
		                {
		                    name: 'Falla',
		                    y: parseFloat( p_falla.toFixed(2) ),
		                    color: '#d9534f',
		                    MG: mw_falla
		                }
		            ]
		        }]
		    });
		}
	},

	tablaCapacidades: function ( opt ) {
		/* data
		 * suf
		 */ 
		
		if ( $.isEmptyObject( opt.data ) ) {
			console.log( 'function: tablaCapacidades, [data] es nulo ' );
			return null
		}
		
		var 

		suf = opt.suf || '',

		struct_seccion = function( arr ) {
			var 
			html = '<div class="row"><div class="col-sm-1"></div><div id="acordEstadoCapac' + 
					suf + '" class="col-sm-10">',
			i = 0,
			lon = arr.length;

			for( i ; i < lon; i++ ) {
				var 
				obj = arr[ i ],
				capacidad_instalada = parseFloat( obj.capacidad_instalada ) || 0,				
				mw_disp = parseFloat( obj.disponible.mw ) || 0,
				mw_fa = parseFloat( obj.falta_aire.mw ) || 0,
				mw_mtto = parseFloat( obj.mtto.mw ) || 0,
				mw_ca = parseFloat( obj.causa_ajena.mw ) || 0,
				mw_falla = parseFloat( obj.falla.mw ) || 0,

				capacidad_efectiva_unidad = mw_disp + mw_fa,
				p_instalado = capacidad_instalada ? 100 : 0,
				p_disponible = ( capacidad_efectiva_unidad * 100 ) / capacidad_instalada || 0,
				p_mantto = ( mw_mtto * 100) / capacidad_instalada || 0,
				p_ca = ( mw_ca * 100 ) / capacidad_instalada || 0,
				p_falla = ( mw_falla * 100 ) / capacidad_instalada || 0;
		
				html += 
					'<h2>Unidad ' + obj.numero_unidad + '</h2>'+
					'<div>'+
						'<h4>Capacidad instalada Unidad: ' + capacidad_instalada.toFixed( 2 ) + ' MW</h4>'+
						'<div class="progress progress-striped active">' +
							'<div class="progress-bar progress-bar-success" style="width:' + p_instalado + '%">'+
								'<span>' + p_instalado.toFixed( 2 ) + '%</span>' +
							'</div>'+
						'</div>'+

					'<h4>Capacidad Efectiva Unidad: ' + capacidad_efectiva_unidad.toFixed( 2 ) + ' MW</h4>'+
					'<div class="progress progress-striped active">'+
						'<div class="progress-bar progress-bar-success" style="width:' + p_disponible + '%">' +
							'<span>' + p_disponible.toFixed( 2 ) + '%</span>'+
						'</div>'+
						'<div class="progress-bar progress-bar-info" style="width:' + p_mantto + '%">' +
							'<span>' + p_mantto.toFixed( 2 ) + '%</span>'+
						'</div>'+
						'<div class="progress-bar progress-bar-warning" style="width:' + p_ca + '%">' +
							'<span>' + p_ca.toFixed( 2 ) + '%</span>'+
						'</div>'+
						'<div class="progress-bar progress-bar-danger" style="width:' + p_falla + '%">'+
							'<span>' + p_falla.toFixed( 2 ) + '%</span>'+
						'</div>'+
					'</div>'+

					'<label>Nomenclatura:</label> &nbsp;'+
					'<span class="label label-success">Disponibles</span>&nbsp;' +
					'<span class="label label-info">Mantenimiento</span>&nbsp;' +
					'<span class="label label-warning">Causas ajenas</span>&nbsp;' +
					'<span class="label label-danger">Falla</span><br><br>' +

					'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">' +
						'Aerogeneradores instalados: ' + obj.numero_generadores_unidad + 
					'</span><br>' +

					'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">' +
						'Aerogeneradores en disponibilidad: ' + 
						( parseInt( obj.disponible.generadores ) + parseInt( obj.falta_aire.generadores ) ) + 
					'</span><br>' +

					'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">' +
						'Aerogeneradores en mantenimiento: ' + obj.mtto.generadores + 
					'</span><br>' +

					'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">' +
						'Aerogeneradores en causa ajena: ' + obj.causa_ajena.generadores + 
					'</span><br>' +

					'<span style="font-weight:bold; padding-top: 12px; padding-bottom: 12px; color: #f00">' +
						'Aerogeneradores en falla: ' + obj.falla.generadores + 
					'</span><br><br>' +

					'<div class="panel panel-success">' + struct_tabla( obj.generadores ) + '</div>'+
					'</div>';
			}

			html += '</div><div class="col-sm-1"></div></div><br>';

			return html;
		},

		struct_tabla = function ( arr ) {
			if ( jQuery.isEmptyObject( arr ) )	return '';
							
			var
				html =
				'<div class="panel-heading">Tabla desglosada</div>' +
				'<div class="table-responsive"><table class="table table-hover">' +												
					'<thead><tr><th>Aerogenerador</th><th>Capacidad efectiva</th><th>' +
					'Fecha de operación</th><th>Estado</th></tr></thead>' +
					'<tbody>';

				// iteramos las filas de la tabla
				for ( var i = 0, lon = arr.length; i < lon; i++ ) {
					// verificamos el estado en que se encuentra el aerogenerador para definir el color y la descripcion adecuada
					var mensajeEstado, estadoColor;
					switch( arr[ i ].estado_licencia ) {
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
						case 'F.A.':							
							mensajeEstado = 'Falta de Aire';
							estadoColor = 'success';
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
				
				html += '</tbody></table></div>'
				return html;					
		},

		javascript = function () {
			$( this.IDS.acordion ).accordion({
				collapsible: true,
				heightStyle: "content"
			});
		},

		doc = {
			html: struct_seccion( opt.data ),
			javascript: javascript,
			IDS: {
				acordion: '#acordEstadoCapac' + suf
			}
		};

		return doc;
	}
};