$( document ).on( 'ready', main );

function main ( event ) {
	/* Documento principal
	 */ 
	doc = $('#main').dataTable({
		head: 	'NÚMERO DE ORDEN, TRABAJO SOLICITADO, MANTENIMIENTO, ' +
				'SUPERVISOR, RESPONSABLE, AUXILIAR, FECHA PROGRAMADA, ' +
				'FECHA REPROGRAMADA',
		campo: 	'numero_orden, trabajo_solicitado, nombre_mantenimiento, ' +
				'orden_trabajo_personal.supervisor, orden_trabajo_personal.responsable, '+
				'orden_trabajo_personal.auxiliar, fecha_programada, fecha_reprogramada',
		color_fila : 'success',
		contextMenu: {
			selector: 'tr',
			items: {
	            insertData: {
	            	name: 'Insertar datos', 
	            	icon: 'user',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			getChecklist( index, false );
	        		}
	            },
	            readData: {
	            	name: 'Leer datos capturados',
	            	icon: 'copy',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).attr( 'table-index' );
	        			getChecklist( index, true );
	        		}
	            }
			}
		}
	})
	.factory();

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
			
			doc.update_table( data );
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

	},

	activate_actividades = function ( id, value ) {

	},

	onshown = function ( dialog ) {		
		_doc = $.fn.newCheckList({
			obj: {
				id_mantenimiento: elemento.id_mantenimiento,
				id_orden_trabajo: elemento.id_orden_trabajo		
			},
			withData: false,
			success: nuevoElemento,
			error: error
		})
		.factory();

		dialog.$modalBody.html( _doc.IDS.$container );
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

function getChecklist ( index, withData ) {
	if ( index < 0 )
		throw new Error( 'function getChecklist: index fuera de rango' );

	var elem = window.sesion.matrizOrdenTrabajo[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elemento para continuar', 'warning' );
		throw new Error('function editarElemento: elemento es indefinido');
	}	

	var _doc = $.fn.newCheckList({
		obj: {
			id_mantenimiento: elem.id_mantenimiento,
			id_orden_trabajo: elem.id_orden_trabajo		
		},
		withData: withData,
		success: nuevoElemento,
		error: error
	})
	.factory();

    var win = BootstrapDialog.show({
        title: 'Datos lista de verificación',
        type: BootstrapDialog.TYPE_DEFAULT,
        onshown: function ( dialog ) {
        	dialog.$modalBody.html( _doc.IDS.$sistemasView )
        },
        size: BootstrapDialog.SIZE_WIDE,
        closable: false,        
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
			IDS.$actividadesView.html('<h3 class=" text-center ">SIN ACTIVIDADES POR CAPTURAR...</h3>')
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
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