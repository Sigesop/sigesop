$( document ).on( 'ready', main );

function main () {
	/* documento de creacion de listas de verificacion
	 */
	doc = sigesop.listaVerificacion.document({
		success: nuevoElemento,
		error: error
	});
	document.getElementById( 'main' ).innerHTML = '<br>' + doc.html;
	doc.javascript();

	/* documento de registro de listas de verificacion
	 */
	docR = sigesop.listaVerificacion.registro({
		table: {
			actions: {
				actividades: editarElemento
			}
		}
	});
	document.getElementById( 'main2' ).innerHTML = '<br>' + docR.html;
	docR.javascript();

	// ----------------------------------------------------------

	$( 'header' ).barraHerramientas();
	getData();
}

function getData() {
	sigesop.query ({
		class: 'listaVerificacion',
		query: 'obtenerTipoMantenimiento',
		success: function ( data )
		{
			window.sesion.matrizTipoMantto = data;
			
			sigesop.combo({
				arr: data, 
				elem: doc.datos.id_mantenimiento.idHTML,
				campo: 'nombre_mantenimiento',
				campoValor: 'id_mantenimiento'
			});
		}
	});

	sigesop.query ({
		class: 'listaVerificacion',
		query: 'num_actividades_into_lista',
		success: function ( data ) {
			window.sesion.num_actividades_into_lista = data;
			document.getElementById( 'badge_listaVerificacion' ).innerHTML = data !== null ?
				data.length : 0;

			docR.table.update_table( data );
		}
	});
}

function error() { sigesop.msg( 'Advertencia', 'Complete los campos', 'warning' ); }

function nuevoElemento( datos, IDS, limpiarCampos ) {
	datos.id_mantenimiento.valor = 
		$( datos.id_mantenimiento.idHTML ).val().trim();
	datos.descripcion_lista_verificacion.valor = 
		$( datos.descripcion_lista_verificacion.idHTML ).val().trim();

	sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
	sigesop.query({
		data: datos,
		class: 'listaVerificacion',
		query: 'nuevaListaVerificacion',
		queryType: 'sendData',
		type: 'POST',
		OK: function ( msj, eventos ) 
		{
			$.unblockUI();
			limpiarCampos();
			getData();
			sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
		},
		NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'warning' ); },
		DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos ), 'error' ); }
	}) ;
}

/**
 * [editarElemento description]
 * @param  {Int} {index} Genera ventana emergente para
 * 
 * @return {Void}
 */
function editarElemento( index ) {
	if ( index < 0 ) 
		throw new Error( 'function editarElemento: index fuera de rango' );

	var elem = window.sesion.num_actividades_into_lista[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarElemento: elem es indefinido');
	}

	var

	showBsModal = function () {
		var 

		getLista = function () {
			sigesop.query({
				data: {	lista_verificacion: elem.lista_verificacion },
				class: 'listaVerificacion',
				query: 'actividades_into_lista',
				success: function ( data ) { 
					window.sesion.actividades_into_lista = data;
					actividades.update_table( data ); 
				}
			});
		},

		actividades = sigesop.tablaRegistro({
			head: 	'ACTIVIDAD, PARAMETRO DE ACEPTACION, LECTURA ACTUAL,' +
					'LECTURA POSTERIOR',
			campo:  'actividad_verificar, parametro_aceptacion.texto, ' +
					'lectura_actual.texto, lectura_posterior.texto',
			suf: 	'tabla-actividades'
		});

		document.getElementById( this.idBody )
		.innerHTML = actividades.html;

		$( actividades.IDS.body ).contextMenu({
			selector: 'tr',
			items: {
	            actividad: {
	            	name: 'Editar Actividad', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).index();
	        			editarActividadVerificar( index, getLista );
	        		}
	            },
	            parametro_aceptacion: {
	            	name: 'Editar Paramentro de Aceptación', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).index();
	        		}
	            },
	            lectura_actual: {
	            	name: 'Editar Lectura Actual', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).index();
	        		}
	            },
	            lectura_posterior: {
	            	name: 'Editar Lectura Posterior', 
	            	icon: 'edit',
	        		callback: function ( key, _opt ) {
	        			var index = $( this ).index();
	        		}
	            },
			}
		});

		getLista();
	},

	win = sigesop.ventanaEmergente({
		idDiv: 'div-insertar-datos-lista-v',
		titulo: 'Edición de actividad',
		clickAceptar: function ( event ) {
			event.preventDefault();
			$( win.idDiv ).modal( 'hide' );
		},
		showBsModal: showBsModal
	});
}

function editarActividadVerificar ( index, update_table ) {
	if ( index < 0 ) 
		throw new Error( 'function editarActividad: index fuera de rango' );

	var elem = window.sesion.actividades_into_lista[ index ];
	if( !elem ) {
		sigesop.msg( 'Advertencia', 'Seleccione un elem para continuar', 'warning' );
		throw new Error('function editarActividad: elem es indefinido');
	}

	var

	success = function ( datos, IDS ) {
		datos.actividad_verificar.valor = 
			$( datos.actividad_verificar.idHTML ).val().trim();

		sigesop.msgBlockUI('Enviando...', 'loading', 'blockUI');
		sigesop.query({
			data: datos,
			class: 'listaVerificacion',
			query: 'actualizar_actividad_verificar',
			queryType: 'sendData',
			type: 'POST',
			OK: function ( msj, eventos ) 
			{
				update_table();
				$.unblockUI();
				$( win.idDiv ).modal('hide');
				sigesop.msg( msj, sigesop.parseMsj( eventos ), 'success' );
			},
			NA: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'warning' ); },
			DEFAULT: function ( msj, eventos ) { $.unblockUI(); sigesop.msg( msj, sigesop.parseMsj( eventos, IDS.$form ), 'error' ); }
		}) ;
	},

	showBsModal = function () {
		var actividadVerificar =
			sigesop.listaVerificacion.actividadVerificar({
				obj: elem,
				suf: 'win-editar',
				success: success
			});

		document.getElementById( this.idBody )
		.innerHTML = actividadVerificar.html;
		actividadVerificar.javascript();
	},

	win = sigesop.ventanaEmergente({
		idDiv: 'win-edicion-actividad-verificar',
		ttulo: 'Editar actividad',
		clickAceptar: function( event ) {
			$( win.idDiv ).modal('hide');
		},
		showBsModal: showBsModal
	});
}