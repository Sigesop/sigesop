$.sigesop.reporteNovedades = {
	document: function ( obj, suf )
	{
		obj = obj || {

			};

		suf = suf || '';

		// ----------

		var 
			html =
				'<form class="form-horizontal" role="form">'+
				'	<div id="formReportePor' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Reporte por: </label>'+
				'		<div class="col-sm-7">'+
				'			<select id="reportePor' + suf + '" class="form-control input-md">'+
				'				<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
				'				<option value="byAero">AEROGENERADOR</option>' +
				'				<option value="byUnidad">UNIDAD</option>' +				
				'			</select>'+
				'		</div>'+
				'	</div>'+

				'	<div id="formUnidad' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">No. de Unidad: </label>'+
				'		<div class="col-sm-7">'+
				'			<select id="numUnidad' + suf + '" class="form-control input-md"></select>' +
				'		</div>'+
				'	</div>'+

				'	<div id="formNumAero' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">No. de Aerogenerador: </label>'+
				'		<div class="col-sm-7">'+
				'			<select id="numAero' + suf + '" class="form-control input-md" disabled></select>' +
				'		</div>'+
				'	</div>'+

				'<div id="formAnioLicencia' + suf + '" class="form-group">'+
				'	<label class="col-sm-3 control-label">Año de Licencia: </label>'+
				'	<div class="col-sm-7">'+
				'		<select id="anioLicencia' + suf + '" class="form-control input-md"></select>' +
				'	</div>'+
				'</div>'+

				'<div id="formHoraInicio' + suf + '" class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Hora Inicio Evento (HH:SS): </label>' +
				'	<div class="col-sm-7">' +
				'		<input id="horaInicio' + suf + '" class="form-control input-md" type="text">' +
				'	</div>' +
				'</div>' +

				'<div id="formFechaInicio' + suf + '" class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Fecha Inicio Evento: </label>' +
				'	<div class="col-sm-7">' +
				'		<input id="fechaInicio' + suf + '" class="form-control" type="text"/>' +
				'	</div>' +
				'</div>' +

				'<div id="formCondOpera' + suf + '" class="form-group">'+
				'	<label class="col-sm-3 control-label">Condicion Operativa: </label>'+
				'	<div class="col-sm-7">'+
				'			<select id="condOpera' + suf + '" class="form-control input-md" disabled></select>' +
				'	</div>'+
				'</div>'+

				'<div id="creacionMantto' + suf + '" class="form-group"></div>'+

				'<div id="formSolicito' + suf + '" class="form-group">' +
				'	<label class="col-sm-3 control-label">Trabajador que solicitó:</label>' +
				'	<div class="col-sm-5">' +
				'		<input id="solicito' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Seleccione trabajador" value="" disabled="">' +
				'	</div>' +
				'	<div class="col-sm-2">' +
				'		<button id="botonSolicito' + suf + '" class="btn btn-primary" type="button">Seleccione Trabajador</button>' +
				'	</div>' +
				'</div>' +

				'<div id="formAutorizo' + suf + '" class="form-group">' +
				'	<label class="col-sm-3 control-label">Trabajador que autorizó:</label>' +
				'	<div class="col-sm-5">' +
				'		<input id="autorizo' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Seleccione trabajador" value="" disabled="">' +
				'	</div>' +
				'	<div class="col-sm-2">' +
				'		<button id="botonAutorizo' + suf + '" class="btn btn-primary" type="button">Seleccione Trabajador</button>' +
				'	</div>' +
				'</div>' +

				// '<div id="formDevolvio' + suf + '" class="form-group">' +
				// '	<label class="col-sm-3 control-label">Trabajador que devolvió:</label>' +
				// '	<div class="col-sm-5">' +
				// '		<input id="devolvio' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Seleccione trabajador" value="" disabled="">' +
				// '	</div>' +
				// '	<div class="col-sm-2">' +
				// '		<button id="botonDevolvio' + suf + '" class="btn btn-primary" type="button">Seleccione Trabajador</button>' +
				// '	</div>' +
				// '</div>' +

				'<div id="formDescripcionEvento' + suf + '" class="form-group">' +
				'	<label class="control-label col-sm-3" for="">Causa de salida: </label>' +
				'	<div class="col-sm-7">' +
				'		<textarea id="descripcionEvento' + suf + '" class="form-control input-md" type="text"></textarea>' +
				'	</div>' +
				'</div>' +

				'	<div class="form-group">'+
				'		<div class="col-sm-3 control-label"></div>'+
				'		<p class="col-sm-7">'+
				'			<button id="btnGuardarReporte' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
				'			<button id="botonLimpiarReporte' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'		</p>'+
				'	</div>'+
				'</form>',

			byAero = function ( elemento )
			{
				$( elemento ).prop( 'disabled', false );
				$( elemento ).val( '' );
				valor = null;
			},

			byUnidad = function ( elemento, valor )
			{
				$( elemento ).prop( 'disabled', true );
				$( elemento ).val( '' );
				valor = null;

				$( doc.IDS.divMantenimiento ).empty();
			},

			run_mantenimiento = function ( obj_unidad, obj_aero, obj_condicion_operativa )
			{
				var query = {};
				switch ( doc.datos.reporte_por.valor )
				{
					case 'byAero': 
						if ( $.sigesop.validacion( [ obj_aero ], { tipoValidacion: 'error' } ) )
							query = { numero_aero: obj_aero.valor };
						else 
						{
							$.sigesop.msgBlockUI( 'Complete el campo: No. de Aerogenerador', 'error' );
							return null;
						}
						break;

					case 'byUnidad': 						
						if ( $.sigesop.validacion( [ obj_unidad ], { tipoValidacion: 'error' } ) )
							query = { numero_unidad: obj_unidad.valor }; 
						else 
						{
							$.sigesop.msgBlockUI( 'Complete el campo: No. de Unidad', 'error' );
							return null;
						}
						break;
					default:

						break;
				}

				$.sigesop.insertarDatosRespuestaSistema({
					clase: 'ajaxGeneradores',
					solicitud: 'obtenerGeneradores',
					Datos: query,
					respuesta: function ( data ) 
					{
						asignar_mantenimiento( data );
					}
				});
			},

			asignar_mantenimiento = function ( arr_gen )
			{
				docG = documento_asignar_mantenimiento( arr_gen );

				var
					// docG = documento_asignar_mantenimiento( arr_gen ),

					clickAceptar = function( event ) 
					{
						// ---------- Guardamos el id del sistema y ponenos el nombre del sistema en la caja
						
						// if ( !jQuery.isEmptyObject( docT.matrizInput ) )
						// {
						// 	var index = $.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
						// 		$.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) : -1;

						// 	if ( index >= 0 ) 
						// 	{
						// 		// doc.datos.solicito.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];
						// 		elem.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];

						// 		var full_name = window.sesion.matrizUsuario[ index ]['nombre_trabajador'] + ' ' + window.sesion.matrizUsuario[ index ]['apellidos_trabajador'];
						// 		$( elem.idHTML ).val( full_name );
						// 		$( win.idDiv ).modal( 'hide' );
						// 	}

						// 	else $.sigesop.msgBlockUI( 'Trabajador no seleccionado', 'error', 'msgBlock', '#seleccionTrabajador_modal' );
						// }

						// else console.log( '[docT.matrizInput] es nula' );			
					},

					showBsModal = function () 
					{
						document.getElementById( this.idBody ).innerHTML = docG.html;					

						// if( !jQuery.isEmptyObject( window.sesion.matrizUsuario ) )
						// 	docT.update_table( window.sesion.matrizUsuario );

						// else 
						// {
						// 	$.sigesop.solicitarDatosSistema({
						// 		clase: 'ajaxUsuarios',
						// 		solicitud: 'obtenerUsuarios',
						// 		respuesta: function ( data ) 
						// 		{
						// 			window.sesion.matrizUsuario = data;
						// 			docT.update_table( data );
						// 		}
						// 	});
						// }
					},

					win = $.sigesop.ventanaEmergente({
						idDiv: 'asignarMantenimiento',
						titulo: 'Asignar Mantenimiento',
						clickAceptar: clickAceptar,
						showBsModal: showBsModal
					});
			},

			documento_asignar_mantenimiento = function ( arr_gen )
			{
				var
					struct_body = function ( arr )
					{
						var html = '';
						for( var i = 0, lon = arr.length; i < lon; i++ )
						{
							html +=
							'<div id="formReportePor' + suf + '" class="form-group">'+
							'	<label class="col-sm-5 control-label">Numero de orden para Aerogenerador: ' +
								arr[ i ].numero_aero + ' </label>'+
							'	<div class="col-sm-5">'+
							'		<input id="reportePor' + suf + '" class="form-control input-md" />'+
							'	</div>'+
							'</div>';
						}

						return html;
					},

					html =
						'<form class="form-horizontal" role="form">' + struct_body( arr_gen ) + '</form>',

					obj = {
						html: html
					};

				return obj;
			},

			javascript = function () 
			{
				$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

				$( this.datos.hora_inicio_evento.idHTML ).val( moment().format( 'H:mm' ) );

				$( this.datos.fecha_inicio_evento.idHTML ).val( moment().format( 'DD-MM-YYYY' ) );

				$( this.datos.reporte_por.idHTML ).change( function ( event ) 
				{
					// ---------- reiniciar [numero_unidad]

					doc.datos.numero_unidad.valor = null;
					$( doc.datos.numero_unidad.idHTML ).val( '' );

					// ---------- reiniciar [numero_unidad]

					$( doc.datos.condicion_operativa.idHTML ).prop( 'disabled', true ) // deshabilitamos el campo condicion operativa
					doc.datos.condicion_operativa.valor = null;
					$( doc.datos.condicion_operativa.idHTML ).val( '' );
					$( doc.IDS.divMantenimiento ).empty(); // limpiar mensajes

					var 
						estado = $( this ).val(),
						elemento = doc.datos.numero_aero.idHTML;
						doc.datos.reporte_por.valor = estado;

					switch ( estado )
					{
						case 'byAero': byAero( elemento ); break;
						case 'byUnidad': byUnidad( elemento, doc.datos.numero_aero.valor ); break;
					}
				});

				$( this.datos.numero_unidad.idHTML ).change( function ( event ) 
				{
					// ---------- cambios visuales de [condicion_operativa]

					$( doc.datos.condicion_operativa.idHTML ).prop( 'disabled', true ) // deshabilitamos el campo condicion operativa
					doc.datos.condicion_operativa.valor = null;
					$( doc.datos.condicion_operativa.idHTML ).val( '' );
					$( doc.IDS.divMantenimiento ).empty(); // limpiar mensajes

					// ----------

					var unidad = $( this ).val();
					doc.datos.numero_unidad.valor = unidad; // guardamos dato en estructura principal

					if( unidad )
					{
						$( doc.datos.condicion_operativa.idHTML ).prop( 'disabled', false ) // habilitamos el campo condicion operativa
						
						$.sigesop.insertarDatosRespuestaSistema({
							clase: 'ajaxGeneradores',
							solicitud: 'obtenerGeneradoresPorUnidad',
							Datos: { unidad: unidad },
							respuesta: function ( data ) 
							{
								window.sesion.matrizGeneradores = data;
								$.sigesop.combo({
									arr: data,
									elem: doc.datos.numero_aero.idHTML,
									campo: 'numero_aero'
								});
							}
						});
					}
				});

				$( this.datos.numero_aero.idHTML ).change( function ( event ) 
				{
					var value = $( this ).val();
					doc.datos.numero_aero.valor = value;

					// ---------- cambios visuales de [condicion_operativa]

					$( doc.datos.condicion_operativa.idHTML ).val( '' );
					doc.datos.condicion_operativa.valor = null;
					$( doc.IDS.divMantenimiento ).empty(); // limpiar mensajes
				});

				$( this.datos.condicion_operativa.idHTML ).change( function ( event ) 
				{
					var value = $( this ).val();
					if ( value === 'MTTO' ) run_mantenimiento( doc.datos.numero_unidad, 
						doc.datos.numero_aero, doc.datos.condicion_operativa );
					else
					{
						$( doc.IDS.divMantenimiento ).empty();
					}
				});
			},

			datos = {
				reporte_por: {
					valor: null,
					idValidacion: '#formReportePor' + suf,
					idHTML: '#reportePor' + suf
				},

				numero_unidad: {
					valor: null,
					idValidacion: '#formUnidad' + suf,
					idHTML: '#numUnidad' + suf
				},

				numero_aero: {
					valor: null,
					idValidacion: '#formNumAero' + suf,
					idHTML: '#numAero' + suf
				},

				id_libro_licencia: {
					valor: null,
					idValidacion: '#formAnioLicencia' + suf,
					idHTML: '#anioLicencia' + suf
				},

				fecha_inicio_evento: {
					valor: null,
					idValidacion: '#formFechaInicio' + suf,
					idHTML: '#fechaInicio' + suf
				},

				hora_inicio_evento: {
					valor: null,
					idValidacion: '#formHoraInicio' + suf,
					idHTML: '#horaInicio' + suf
				},

				condicion_operativa: {
					valor: null,
					mantenimiento: [], // matriz que guarda mantenimientos en el caso que lo sea
					idValidacion: '#formCondOpera' + suf,
					idHTML: '#condOpera' + suf
				},

				trabajador_solicito: { 
					valor: null,
					idValidacion: '#formSolicito' + suf,
					idHTML: '#solicito' + suf,
					boton: '#botonSolicito' + suf
				},

				trabajador_autorizo: { 
					valor: null,
					idValidacion: '#formAutorizo' + suf,
					idHTML: '#autorizo' + suf,
					boton: '#botonAutorizo' + suf
				},

				// trabajador_devolvio: { 
				// 	valor: null,
				// 	idValidacion: '#formDevolvio' + suf,
				// 	idHTML: '#devolvio' + suf,
				// 	boton: '#botonDevolvio' + suf
				// },

				descripcion_evento: { 
					valor: null,
					idValidacion: '#formDescripcionEvento' + suf,
					idHTML: '#descripcionEvento' + suf
				}
			},

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,

				IDS: {
					botonGuardar: '#btnGuardarReporte' + suf,
					botonLimpiar: '#botonLimpiarReporte' + suf,
					divMantenimiento: '#creacionMantto' + suf
				}
			}

		return doc;
	}
};