$( document ).on( 'ready', main );

function main()
{
	/* Documento principal
	 */ 
	doc = sigesop.mantenimiento.document({
		success: generarElementos,
		error: error
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registros
	 */
	docR = sigesop.mantenimiento.documentoRegistro ({
		table: {
			actions: {
				insertar: insertarUsuarios
				// programacion
			}
		}		
	});
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	/* Descarga de datos
	 */ 
	$( 'header' ).barraHerramientas();
	getData();
}

function error () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ) }

function generarElementos ( datos, limpiarCampos )
{
	/* capturar los datos restantes del formulario
	 */

	datos.numero_unidad.valor = $( datos.numero_unidad.idHTML ).val();
	datos.numero_aero.valor = $( datos.numero_aero.idHTML ).val();
	datos.id_mantenimiento.valor = $( datos.id_mantenimiento.idHTML ).val();
	datos.duracion.valor = $( datos.duracion.idHTML ).val().trim();
	
	datos.magnitud_duracion.valor = $( datos.magnitud_duracion.idHTML ).val();
	datos.fecha_inicial.valor = $( datos.fecha_inicial.idHTML ).val().trim();
	datos.fecha_final.valor = $( datos.fecha_final.idHTML ).val().trim();
	datos.trabajo_solicitado.valor = $( datos.trabajo_solicitado.idHTML ).val().trim();

	/* buscamos la frecuencia y la magnitud 
	 * de la frecuencia en el arreglo de tipos de mantenimiento
	 */ 

	var posicion = 
		sigesop.indexOfObjeto( 	window.sesion.matrizTipoMantto, 
								'id_mantenimiento', datos.id_mantenimiento.valor );
	
	if ( posicion !== -1 ) 
	{
		/* calculamos los periodos
		 */ 
		var 
		fechaLocal = sigesop.mantenimiento.calculaPeriodoMantenimiento({
			fechaInicial: datos.fecha_inicial.valor,
			fechaFinal: datos.fecha_final.valor,
			duracion: datos.duracion.valor,
			magnitudDuracion: datos.magnitud_duracion.valor,
			frecuencia: window.sesion.matrizTipoMantto[ posicion ].numero_frecuencia,
			magnitudFrecuencia: window.sesion.matrizTipoMantto[ posicion ].tipo_frecuencia
		}),	

		/* objeto con los datos para graficar
		 */ 
		obj = {
			nombre: datos.numero_aero.valor + ' - ' + datos.id_mantenimiento.valor ,
			colorGrafica: '#5bc0de',
			intervalos: fechaLocal
		},

		/* creacion del documento para la ventana emergente
		 */

		_doc = sigesop.mantenimiento.documentoVistaPreliminar( '_' ),

		win = sigesop.ventanaEmergente({
			idDiv: '_vg',
			titulo: 'Vista preliminar',
			clickAceptar: function ( event ) { $( '#' + this.idDiv ).modal( 'hide' ); },
			showBsModal: function (  )
			{
				document.getElementById( this.idBody ).innerHTML = _doc.html;
				$( _doc.IDS.botonGuardar ).on( 'click', function ( event )
				{
					event.preventDefault();
					nuevoElemento( datos, fechaLocal, limpiarCampos );
				});	
			},							
			shownBsModal: function ( ) { sigesop.mantenimiento.graficaMantenimiento( [ obj ], _doc.IDS.grafica ); }
		});
	}
	else console.log( 'ID Mantenimiento: ' + datos.id_mantenimiento.valor + ' no encontrado' );
}

function nuevoElemento( datos, fechaLocal, limpiarCampos )
{
	/* cambiamos los formatos de fechas para insertar en el servidor
	 */ 
	var 
		fechaServer =  sigesop.mantenimiento.formatoFechaServidor( fechaLocal ),
		mtzOrdenTrabajo = [];

	/* creamos las ordenes de trabajo cambiando las fechas programas 
	 */
	for( var i = 0, lon = fechaServer.length; i < lon; i++ )
	{
		datos.fecha_inicial.valor = fechaServer[ i ].from;
		var obj = jQuery.extend( true, {}, datos );

		delete obj.duracion.idHTML;
		delete obj.fecha_final.idHTML;
		delete obj.fecha_inicial.idHTML;
		delete obj.id_mantenimiento.idHTML;
		delete obj.magnitud_duracion.idHTML;
		delete obj.numero_aero.idHTML;
		delete obj.numero_unidad.idHTML;
		delete obj.trabajo_solicitado.idHTML;

		mtzOrdenTrabajo.push( obj );
	}
	
	/* insertamos los datos al servidor
	 */	
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: { ordenTrabajo: mtzOrdenTrabajo },
		class: 'mantenimiento',
		query: 'nuevaOrdenTrabajo',
		queryType: 'sendData',
		type: 'POST',
		OK: function () 
		{	
			$.unblockUI();		
			getData();
			limpiarCampos()
			$( '#_vg' ).modal( 'hide' );
			sigesop.msg( 'Orden de trabajo agregada satisfactoriamente', '', 'success' );			
		},

		NA: function () { $.unblockUI(); sigesop.msg( 'Advertencia', 'Un campo necesario se encuentra nulo o no es válido', 'warning' ); },
		DEFAULT: function (data) { $.unblockUI(); sigesop.msg( 'Error', data, 'error' ); },
		error: function () { $.unblockUI(); sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' ); }
	});		
}

function getData()
{
	sigesop.query({
		class: 'mantenimiento',
		query: 'obtenerOrdenTrabajo',
		success: function ( data ) 
		{
			window.sesion.matrizOrdenTrabajo = data;
			docR.table.update_table( data );
			document.getElementById( 'badge_RM' ).innerHTML = data != null ? data.length : 0 ;
		}
	});

	sigesop.query({
		class: 'unidades',
		query: 'obtenerUnidades',
		success: function ( data ) 
		{
			window.sesion.matrizUnidades = data;
			$( doc.datos.numero_unidad.idHTML )
			.combo({ arr: data, campo: 'numero_unidad' });
		}
	});

	sigesop.query({
		class: 'listaVerificacion',
		query: 'obtenerTipoMantenimiento',
		success: function ( data )
		{			
			window.sesion.matrizTipoMantto = data;
			$( doc.datos.id_mantenimiento.idHTML )
			.combo({ 
				arr: data, 
				campo: 'id_mantenimiento, nombre_mantenimiento',
				campoValor: 'id_mantenimiento'
			});
		}
	});	
}

function verDetalles ( elem, data )
{
	if ( data == null ) 
	{
		sigesop.msgBlockUI( 'Sin elementos registrados', 'error' ); 
		return null;
	}

	if( elem )
	{			
		sigesop.ventanaEmergente({
			idDiv: '__divVerDetallesOrdenT',
			titulo: 'Detalles de Orden de trabajo',
			idBody: '__bodyVDOT',
			idBtnCerrar: '__btnCerrarVDOT',
			idBtnOK: '__btnOKVDOT',
			clickAceptar: function ( event )
			{
				event.preventDefault();
				$( '#__divVerDetallesOrdenT' ).modal( 'hide' );
			},
			showBsModal: function () 				
			{
				sigesop.insertarDatosRespuestaSistema({
					Datos: { idOrdenTrabajo: elem.id_orden_trabajo, con_todo: 'barrido_validacion' },
					clase: 'ajaxMantenimiento',
					solicitud: 'obtenerOrdenTrabajoLista',
					respuesta: function ( data )
					{
						window.sesion.matrizOrdenTrabajoLista = data;
						if ( data != null )
						{
							// ---------- creamos la estructura para la edicion de el usuario en la ventana

							docOT = sigesop.mantenimiento.documentoInsertarDatos({
										arr: data,
										submit: procesoValidacionLista, 
										suf: '_'
									});
							
							// ---------- ejecutamos el HTML y el Javascript del formulario

							document.getElementById( '__bodyVDOT' ).innerHTML = docOT.html;
							docOT.javascript();
						}
						else $( '#__bodyVDOT' ).html( '<h3 class=" text-center ">SIN LISTAS DE VERIFICACION POR VALIDAR...</h3>' );
					},
					errorRespuesta: function ()
					{

					}
				});
			}
		});
	} 
	else sigesop.msgBlockUI( 'Seleccione un elemento para continuar', 'error' );
}

function insertarUsuarios( index )
{
	var elemento = window.sesion.matrizOrdenTrabajo[ index ];

	if( elemento )
	{
		if ( elemento.orden_trabajo_personal.supervisor )
		{
			sigesop.msg( 'info', 'Los usuarios ya han sido asignados previamente', 'info' );
			return null;
		}

		var 
			nuevoUsuario = function ( datos, IDS, limpiarCampos )
			{
				/* capturar los datos restantes del formulario
				 */				
				datos.supervisor.valor = window.localStorage.usuario;
				datos.responsable.valor = $( datos.responsable.idHTML ).val();

				datos.id_orden_trabajo = {};
				datos.id_orden_trabajo.valor = elemento.id_orden_trabajo;

				/* capturar usuarios auxiliares
				 */
				datos.auxiliar.length = 0; // vaciar matriz
				var 
					i = 0,
					lon = IDS.mtz_auxiliar.length;

				for ( i ; i < lon ; i++ )
					if ( IDS.mtz_auxiliar[ i ].valor !== null )
						datos.auxiliar.push( IDS.mtz_auxiliar[ i ].valor );;
				
				/* Enviar datos al servidor
				 */ 
				sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );

				sigesop.query({
					data: datos,
					class: 'mantenimiento',
					query: 'asignarUsuariosOrdenTrabajo',
					queryType: 'sendData',
					type: 'POST',
					OK: function ( msj, eventos ) 
					{
						getData();
						$.unblockUI();
						$( '#__divInsertarUsuarios' ).modal( 'hide' );
						sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
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

			showBsModal = function () 				
			{
				document.getElementById( this.idBody ).innerHTML = '<br>' + docU.html;
				docU.javascript();

				sigesop.query({
					class: 'usuarios',
					query: 'obtenerUsuarios',
					success: function ( data ) 
					{
						docU.update_user( data );
					}
				});
			},

			docU = sigesop.mantenimiento.documentAddUser({
				error: error,
				success: nuevoUsuario
			}),

			win = sigesop.ventanaEmergente({
				idDiv: '__divInsertarUsuarios',
				titulo: 'Insertar Usuarios',
				clickAceptar: function ( event )
				{
					event.preventDefault();
					$( win.idDiv ).modal( 'hide' );
				},

				showBsModal: showBsModal
			});
	}
	else sigesop.msg( 'info', 'Seleccione un elemento para continuar', 'info' );
}