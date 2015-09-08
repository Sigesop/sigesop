$( document ).on( 'ready', main );

function main() {
	/* Documento principal
	 */ 
	doc = sigesop.mantenimiento.document({
		success: nuevoElemento,
		error: sigesop.completeCampos
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* Tabla de registros
	 */
	docR = sigesop.mantenimiento.registro ({
		table: {
			actions: {
				insertar: insertarUsuarios,
				materiales: materiales,
				eliminar: eliminarElemento
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

function getData() {
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

function nuevoElemento( datos, IDS, limpiarCampos, dialog ) {
	/* insertamos los datos al servidor
	 */	
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		class: 'mantenimiento',
		query: 'nuevaOrdenTrabajo',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) {
			$.unblockUI();
			limpiarCampos();
			getData();
			dialog.close();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
	});		
}

function eliminarElemento ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function eliminarElemento: index fuera de rango' );

	var elem = window.sesion.matrizOrdenTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function eliminarElemento: elem es indefinido');
	}

	var

	action = function( dialog ) {
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		dialog.close();
		sigesop.query({
			data: { id_prog_mtto: elem.id_prog_mtto },
			class: 'mantenimiento',
			query: 'eliminar_programacion_mtto',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
		});					
	},

    win = BootstrapDialog.show({
        title: 'Autorización requerida',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: '<div class="alert alert-danger text-center"><h4>¿Está seguro de eliminar elemento y los registros dependientes de éste?</h4></div>',        
        size: BootstrapDialog.SIZE_NORMAL,
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            action: function ( dialog ) {
            	dialog.close();
            }
        },{
            label: 'Aceptar',
            cssClass: 'btn-danger',
            action: action
        }]
    });
}

function verDetalles ( elem, data ) {
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

function insertarUsuarios( index ) {
	if ( index < 0 ) 
		throw new Error( 'function insertarUsuarios: index fuera de rango' );

	var elem = window.sesion.matrizOrdenTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function insertarUsuarios: elem es indefinido');
	}

	if ( elem.orden_trabajo_personal.supervisor )
	{
		sigesop.msg( 'info', 'Los usuarios ya han sido asignados previamente', 'info' );
		return null;
	}

	var 
	nuevoUsuario = function ( datos, IDS, limpiarCampos ) {
		/* capturar los datos restantes del formulario
		 */				
		datos.supervisor.valor = window.localStorage.usuario;
		datos.responsable.valor = $( datos.responsable.idHTML ).val();

		datos.id_orden_trabajo = {};
		datos.id_orden_trabajo.valor = elem.id_orden_trabajo;

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
			OK: function ( msj, eventos ) {
				getData();
				$.unblockUI();
				win.close();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) {
				$.unblockUI();
				sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'warning' );
			},
			DEFAULT: function ( msj, eventos ) {
				$.unblockUI();
				sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ),'error' );
			},
			error: function () { 
				$.unblockUI(); 
				sigesop.msg( 'Error', 'Error de conexion al servidor', 'error' );
			}	
		}) ;
	},
	
	_doc = sigesop.mantenimiento.documentAddUser({
		error: sigesop.completeCampos,
		success: nuevoUsuario
	}),

    win = BootstrapDialog.show({
        title: 'Asignar Orden de Trabajo',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: _doc.html,
        onshown: function ( dialog ) {
			_doc.javascript();

			sigesop.query({
				class: 'usuarios',
				query: 'obtenerUsuarios',
				success: function ( data ) {
					_doc.update_user( data );
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
            }
        }]
    });
}

function materiales ( index ) {
	if ( index < 0 ) 
		throw new Error( 'function materiales: index fuera de rango' );

	var elem = window.sesion.matrizOrdenTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function materiales: elem es indefinido');
	}

	var

	__agregarMaterial = function ( datos, IDS, limpiarCampos ) {
		datos.id_orden_trabajo.valor = elem.id_orden_trabajo;
		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: datos,
			class: 'materiales',
			query: 'agregar_material_orden_trabajo',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				limpiarCampos();
				__getData();
				// $( '#agregar-materiales' ).modal( 'hide' );
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		});
	},

	__eliminarMaterial = function ( index ) {
		if ( index < 0 ) 
			throw new Error( 'function __eliminarMaterial: index fuera de rango' );

		var elem = window.sesion.matrizOrdenTrabajoMaterial[ index ];
		if( !elem ) {
			sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
			throw new Error('function __eliminarMaterial: elem es indefinido');
		}

		sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
		sigesop.query({
			data: { 
				id_orden_trabajo_material: elem.id_orden_trabajo_material
			},
			class: 'materiales',
			query: 'eliminar_orden_trabajo_material',
			queryType: 'sendData',
			OK: function ( msj, eventos ) {
				$.unblockUI();
				__getData();
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
		});
	},

	__getData = function () {
		sigesop.query({
			class: 'materiales',
			query: 'obtener_materiales',
			success: function ( data ) {
				docM.IDS.$codigo_material.combo({
					arr: data,
					campo: 'codigo_material, descripcion_material',
					campoValor: 'codigo_material'
				});
				// docM.update_table( data );
			}
		});

		sigesop.query({
			class: 'materiales',
			query: 'obtener_materiales_orden_trabajo',
			data: { id_orden_trabajo: elem.id_orden_trabajo },
			success: function ( data ) {
				sesion.matrizOrdenTrabajoMaterial = data;
				docM.update_table( data );
			}
		});
	},

	docM = sigesop.mantenimiento.documentMateriales({		
		error: sigesop.completeCampos,
		success: __agregarMaterial,
		table: {
			actions: {
				eliminar: __eliminarMaterial
			}
		}
	}),

    win = BootstrapDialog.show({
        title: 'Materiales',
        type: BootstrapDialog.TYPE_DEFAULT,
        message: docM.html,
        onshown: function ( dialog ) {
			docM.javascript();
			__getData();
        },
        size: BootstrapDialog.SIZE_WIDE,        
        draggable: true,
        buttons: [{
            label: 'Cancelar',
            cssClass: 'btn-danger',
            action: function( dialog ) {
            	sesion.matrizOrdenTrabajoMaterial = [];
                dialog.close();
            }
        }]
    });
}