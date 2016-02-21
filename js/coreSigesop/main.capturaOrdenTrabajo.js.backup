$( document ).on( 'ready', main );

function main ( event ) {
	/* Documento principal
	 */ 
	doc = sigesop.capturaOrdenTrabajo.document({
		table: {
			actions: {
				insertData: insertarDatos,
				readData: readData
			}
		}
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();
	
	/* Descarga de datos
	 */ 
	$( 'header' ).barraHerramientas();
	getData();
}

function error () { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function getData() {
	sigesop.query({
		data: { usuario: window.localStorage.usuario },
		class: 'mantenimiento',
		query: 'obtenerOrdenTrabajo',
		success: function ( data ) {
			window.sesion.matrizOrdenTrabajo = data;
			document.getElementById( 'badge_OT' ).innerHTML = data != null ? data.length : 0 ;
			
			doc.table.update_table( data );
		}
	});	
}

function struct_data( index, con_datos ) {
	if ( index < 0 ) 
		throw new Error( 'function insertarDatos: index fuera de rango' );

	var elemento = window.sesion.matrizOrdenTrabajo[ index ];
	if( !elemento ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function insertarDatos: elemento es indefinido');
	}

	var
	 
	activate_equipos = function ( id, value ) {
		var data = {
			id_mantenimiento: elemento.id_mantenimiento, 
			id_sistema_aero: value,
			id_orden_trabajo: elemento.id_orden_trabajo			
		};

		/* verificamos si requerimos las actividades con datos
		 * en caso de que el documento sea para la revision de
		 * actividades
		 */
		con_datos === true ? data.con_datos = true : null;

		sigesop.query({
			data: data,
			class: 'mantenimiento',
			query: 'equipo_into_systems_mantto',
			success: function ( data ) {	
				if ( data != null )	{
					// ---------- creamos la estructura para la edicion de el usuario en la ventana

					docEM = sigesop.capturaOrdenTrabajo.documentInsertData({
						arr: data,
						suf: '_' + value,		
						name: 'equipos',
						campo: 'nombre_equipo_aero',
						dataValue: 'id_equipo_aero',
						activate: activate_actividades
					});						

					document.getElementById( id ).innerHTML = docEM.html;
					docEM.javascript();
				}

				else document.getElementById( id ).innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>';
			}
		});
	},

	activate_actividades = function ( id, value ) {
		var 
			elem = document.getElementById( id ),
			data = { 
				id_mantenimiento: elemento.id_mantenimiento, 
				id_equipo_aero: value,
				id_orden_trabajo: elemento.id_orden_trabajo
			};

		/* verificamos si requerimos las actividades con datos
		 * en caso de que el documento sea para la revision de
		 * actividades
		 */
		con_datos === true ? data.con_datos = true : null;

		sigesop.query({
			data: data,
			class: 'mantenimiento',
			query: 'actividades_into_equipo',
			success: function ( data )
			{	
				if ( !$.isEmptyObject( data ) )	{
					/* creamos la estructura para la edicion de el usuario en la ventana
					 */
					var 
					actividades = {
						id_orden_trabajo: elemento.id_orden_trabajo,
						actividades: data
					},

					config = {
						obj: actividades,							
						suf: '_' + value,
						success: nuevoElemento,
						error: error
					};

					/* verificamos si requerimos las actividades con datos
					 * en caso de que el documento sea para la revision de
					 * actividades
					 */
					con_datos === true ? config.con_datos = true : null;

					var
					docAC = 
						sigesop.capturaOrdenTrabajo.documentActivity( config );
					elem.innerHTML = docAC.html;
					docAC.javascript();
				}

				else 
					elem
					.innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>';
			}
		});
	},

	onshown = function ( dialog ) {
		var data = {
			id_mantenimiento: elemento.id_mantenimiento,
			id_orden_trabajo: elemento.id_orden_trabajo		
		};

		/* verificamos si requerimos las actividades con datos
		 * en caso de que el documento sea para la revision de
		 * actividades
		 */
		con_datos === true ? data.con_datos = true : null;

		sigesop.query({
			data: data,
			class: 'mantenimiento',
			query: 'systems_into_mantto',
			success: function ( data ) {						
				if ( !$.isEmptyObject( data ) ) {
					var 
					docSM = sigesop.capturaOrdenTrabajo.documentInsertData({
						arr: data, 
						name: 'sistemas',
						campo: 'nombre_sistema_aero',
						dataValue: 'id_sistema_aero',
						activate: activate_equipos
					});

					// document.getElementById( win.idBody.flushChar('#') )
					// 	.innerHTML = docSM.html;
					
					dialog.setMessage( docSM.html );
					docSM.javascript();
				}

				else dialog.setMessage( '<h3 class=" text-center ">SIN LISTAS DE VERIFICACION POR CAPTURAR...</h3>' );
			}
		});
	},

    win = BootstrapDialog.show({
        title: 'Datos lista de verificación',
        type: BootstrapDialog.TYPE_DEFAULT,
        onshown: onshown,
        size: BootstrapDialog.SIZE_WIDE,
        closable: true,        
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

function insertarDatos ( index ) { struct_data( index, false ); }

function readData ( index ) { struct_data( index, true ); }

function leerDatos ( datos ) {
	var 
		m = datos.datos_actividad, // matriz de actividades
		i = 0,
		lon_i = m.length;
	
	for( i ; i < lon_i ; i++ )
	{
		/* capturar datos de lectura actual
		 */
		var
			n = m[ i ].datos_lectura_actual,
			j = 0,
			lon_j = n.length;

		for( var j = 0 ; j < lon_j ; j++ )
		{
			var elem = n[ j ].dato;

			n[ j ].tipo_dato === 'Binario' ?
				elem.valor = sigesop.getDataRadio( elem.name ):
				elem.valor = $( elem.idHTML ).val().trim();
		}

		/* capturar datos de lectura posterior
		 */
		var
			n = m[ i ].datos_lectura_posterior,
			j = 0,
			lon_j = n.length;

		for( j = 0 ; j < lon_j ; j++ )
		{
			var elem = n[ j ].dato;					

			n[ j ].tipo_dato === 'Binario' ?
				elem.valor = sigesop.getDataRadio( elem.name ):
				elem.valor = $( elem.idHTML ).val().trim();

		}

		/* capturar el dato observaciones de la actividad
		 */
		m[ i ].observaciones.valor = $( m[ i ].observaciones.idHTML ).val().trim();	
	}
}

function nuevoElemento ( datos, IDS ) {
	leerDatos( datos );
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		class: 'mantenimiento',
		query: 'insertarDatosListaVerificacion',
		queryType: 'sendData',
		data: datos,
		type: 'POST',
		OK: function ( msj, eventos ) {
			$.unblockUI();
			document.getElementById( IDS.form.flushChar('#') )
				.innerHTML = '<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>';
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );		
			$( doc.IDS.botonLimpiar ).prop( 'disabled', true ); // impedir enviar de nuevo
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
}