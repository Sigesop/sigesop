$.sigesop.listaVerificacion = {
	documentoListaVerificacion: function ( obj, suf )
	{
		var 
			html =
				'<div class="panel panel-success">' +
				'	<div class="panel-heading">ASOCIACIÓN</div>' +
				'	<br>' +
				'	<form class="form-horizontal" role="form">' +
				'		<div id="formTipoMantto' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Tipo Mantenimiento:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select id="tipoMantto' + suf + '" class="form-control" ><option value="" >' + $.sigesop.sinRegistros + '</option></select>' +
				'			</div>' +
				'		</div>' +
				'	</form>' +
				'</div>'+

				'<div class="panel panel-default">' +
				'	<div class="panel-heading">ACTIVIDADES</div>' +
				'	<br>' +
				'	<form class="form-horizontal" role="form" method="post">' +
				'		<div id="formSistema' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Sistema:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select id="sistema' + suf + '" class="form-control" ><option value="" >' + $.sigesop.sinRegistros + '</option></select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="formEquipo' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Equipo:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select id="equipo' + suf + '" class="form-control" disabled></select>' +
				'			</div>' +
				'		</div>' +
				
				'		<div id="formDescripcion_act' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Actividad:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<textarea id="descripcion_act' + suf + '" class="form-control input-sm eventoCambioMayuscula" placeholder="Ingrese descripcion de la actividad"></textarea>' +
				'			</div>' +
				'		</div>' +

				'		<div id="formParametroAceptacion' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Parámetro de Aceptación:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select id="parametroAceptacion' + suf + '" class="form-control">' +
								'<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
								'<option value="TEXTO">TEXTO</option>' +
								'<option value="COMPARACION">COMPARACION</option>' +
								'<option value="RANGO">RANGO</option>' +
								'<option value="TOLERANCIA">TOLERANCIA</option>' +
				'			</select></div>' +
				'		</div>' +

				'			<div id="insertarEstructuraDato_parametroAceptacion' + suf + '"></div>' +

				'		<div id="formLecturaActual' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Lectura actual:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select class="form-control" id="tipoDatoLecturaActual' + suf + '" disabled>' +
				'					<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
				'					<option value="tipoBinario">BINARIO</option>' +
				'					<option value="tipoDato">DATOS</option>' +
				'				</select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="insertarEstructuraDato_lecturaActual' + suf + '"></div>' +

				'		<div id="formLecturaPost' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 col-md-3 control-label">Lectura posterior:</label>' +
				'			<div class="col-sm-7 col-md-7">' +
				'				<select class="form-control" id="tipoDatoLecturaPost' + suf + '" disabled>' +
				'					<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
				'					<option value="tipoBinario">BINARIO</option>' +
				'					<option value="tipoDato">DATOS</option>' +
				'				</select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="insertarEstructuraDato_lecturaPost' + suf + '"></div>' +

				'		<div class="form-group">' +
				'			<div class="col-sm-3 col-md-3"></div>' +
				'			<div class="col-sm-9">' +
				'				<p>' +
				'					<button id="agregarActividad' + suf + '" class="btn btn-success" disabled><span class="glyphicon glyphicon-plus"></span> Agregar actividad</button>' +
				'					<button id="reiniciarAct' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Reiniciar Actividad</button>' +
				'				</p>' +
				'			</div>' +
				'		</div>' +

				'		<div>' +
				'			<ul class="nav nav-tabs">' +
				'				<li class="active"><a href="#actividades' + suf + '" data-toggle="tab">ACTIVIDADES AÑADIDAS</a></li>' +
				'			</ul>' +
								
				'			<div class="tab-content form-group">' +
				'				<div class="tab-pane fade in active" id="actividades' + suf + '">' +
				'				<br>' +
				'					<div class="col-sm-1"></div>' +
				'						<ol id="listaActividades' + suf + '" class="col-sm-10 selectable"></ol>' +
				'					<div class="col-sm-1"></div>' +
				'				</div>' +
				'			</div>' +
				'		</div>' +
				'		<br>' +
				'	</form>' +
				'</div>'+

				'<div class="panel panel-success">' +
				'	<div class="panel-heading">LISTA DE VERIFICACIÓN</div>	' +
				'	<br>' +
				'	<form class="form-horizontal" role="form">' +
				'		<div id="formDescripcion' + suf + '" class="form-group">' +
				'			<label class="col-sm-3 control-label">Descripción:</label>' +
				'			<div class="col-sm-7">' +
				'				<textarea id="descripcion_lista' + suf + '" class="form-control input-sm eventoCambioMayuscula" placeholder="Ingrese descripcion de la lista de verificación"></textarea>' +
				'			</div>' +
				'		</div>' +
				'		<div class="form-group">' +
				'			<div class="col-sm-3 control-label"></div>' +
				'			<p class="col-sm-8">' +
				'				<button id="btnGuardarLista' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
				'				<button id="btnLimpiarLista' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'			</p>' +
				'		</div>' +
				'	</form>' +
				'</div>',

			parametroAceptacion = function ( doc, obj )
			{
				// ---------- secuencia grafica del documento y reinicio de datos

				doc.IDS.idsParametro = [];
				doc.actividad_verificar.parametro_actividad = [];
				$( doc.IDS.divParametroAceptacion ).empty();					

				doc.IDS.idsLecturaActual = [];
				doc.actividad_verificar.lectura_actual = [];
				$( doc.IDS.lecturaActual ).val( '' );
				$( doc.IDS.lecturaActual ).prop( 'disabled', true );
				$( doc.IDS.divLecturaActual ).empty();

				doc.IDS.idsLecturaPosterior = [];
				doc.actividad_verificar.lectura_posterior = [];
				$( doc.IDS.lecturaPost ).val( '' );
				$( doc.IDS.lecturaPost ).prop( 'disabled', true );
				$( doc.IDS.divLecturaPost ).empty();

				$( doc.IDS.botonActividad ).prop( 'disabled', true );

				// ----------

				if ( typeof obj !== 'undefined' )
				{
					window.sesion.numeroFilas = 0;

					// --------- enlazar comunicacion entre objetos

					doc.IDS.idsParametro = obj.IDS.matrizID;
					doc.actividad_verificar.parametro_actividad = obj.datos.parametro_actividad;

					// ---------- Ejecucion del documento

					$( doc.IDS.divParametroAceptacion ).html( obj.html );
					obj.javascript();
					obj.success = function ()
					{
						// ---------- secuencias graficas del documento

						// $( doc.IDS.divParametroAceptacion ).empty();
						$( obj.IDS.botonAgregarCelda ).prop( 'disabled', true ); // desabilitamos boton [Agregar]
						$( obj.IDS.botonAgregarParametro ).prop( 'disabled', true ); // desabilitamos boton [Agregar Paramentro]
						$( doc.IDS.lecturaActual ).prop( 'disabled', false );
					}
				}
				else 
				{
					console.log( 'obj parametroAceptacion es indefinido' )
					$( doc.IDS.divParametroAceptacion ).empty(); // limpiar area de captura
				}
			},

			lecturaActual = function ( doc, obj )
			{
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

			lecturaPost = function ( doc, obj )
			{
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

			eliminar_actividad = function ( index, arr, update_table )
			{				
				arr.splice( index, 1 );
				update_table( arr );
			},

			// editar_actividad = function ( key, opt ) 
			// {
   			//  	var 
   			//  	index = $( this ).index();
   			//  	obj = doc.datos.actividad_verificar[ index ];    			
   			// },

			doc = {
				html: html,
				javascript: function ()
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

					// ---------- tabla de registro de las actividades

					var 
						docA = $.sigesop.tablaRegistro({
							head: 'ACTIVIDAD',
							campo: "actividad_verificar.valor",
							suf: '_actividades'
						});

					this.IDS.update_table_actividad = docA.update_table; // enlazamos el enlace de actualizar tabla de actividades
					$( this.IDS.listaActividades ).html( '<br>' + docA.html );

					$( docA.IDS.body ).contextMenu({
						selector: 'tr',
						items: {
				          //   editar: 
				          //   {
				          //   	name: 'Editar', 
				          //   	icon: 'edit',
				        		// callback: editar_actividad
				          //   },
				            eliminar: 
				            {
				            	name: 'Eliminar', 
				            	icon: 'delete',
				        		callback: function ( key, opt ) {
				        			var index = $( this ).index();
				        			eliminar_actividad( index, doc.datos.actividad_verificar, docA.update_table );
				        		}
				            }
						}
					});
					
					// ---------- 

					$( this.actividad_verificar.id_sistema_aero.idHTML ).change( function ( event )
					{
						var 
							idEquipo = $( doc.actividad_verificar.id_equipo_aero.idHTML ),
							query = $( this ).val();

						if( query )
						{
							$.sigesop.insertarDatosRespuestaSistema ({
								Datos: { valor: query },
								clase: 'ajaxEquiposGenerador',
								solicitud: 'obtenerEquipoGeneradorPorSistema',					
								respuesta: function ( data ) 
								{
									$.sigesop.combo({
										arr: data, 
										elem: doc.actividad_verificar.id_equipo_aero.idHTML, 
										campo: 'nombre_equipo_aero', 
										campoValor: 'id_equipo_aero'
									});

									idEquipo.prop( 'disabled', false );
								}
							});
						}
						else
						{					
							idEquipo.val('');
							idEquipo.prop( 'disabled', true );
						}
					});

					// ----------

					$( this.IDS.parametroAceptacion ).change( function ( event ) 
					{
						var val = $( this ).val().toLowerCase(),
							obj = $.sigesop.listaVerificacion.__retornaFuncion( val, '_param' );

						parametroAceptacion ( doc, obj );
					});

					$( this.IDS.lecturaActual ).change( function ( event )
					{
						var val = $( this ).val().trim(),
							obj = $.sigesop.listaVerificacion.__retornaFuncion( val, '_lec_act' );

						lecturaActual( doc, obj );
					});

					$( this.IDS.lecturaPost ).change( function ( event )
					{
						var val = $( this ).val().trim(),
							obj = $.sigesop.listaVerificacion.__retornaFuncion( val, '_lec_post' );

						lecturaPost( doc, obj );
					});

					// ----------
				},

				datos: 
				{
					id_mantenimiento: {
						valor: null,
						idHTML: '#tipoMantto' + suf,
						idValidacion: '#formTipoMantto' + suf,
						popover: {
							content: 'Seleccione un tipo de Mantenimiento',
							placement: 'top'
						}
					},

					descripcion_lista_verificacion: {
						valor: null,
						idHTML: '#descripcion_lista' + suf,
						idValidacion: '#formDescripcion' + suf,
						regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
						popover: {
							content: 'Escriba la descripcion de la lista de verificacion ( 1-600 caracteres, sin caracteres especiales )',
							placement: 'left'
						}					
					},

					actividad_verificar: []
				},

				actividad_verificar: 
				{
					id_sistema_aero: {
						valor: null,
						idHTML: '#sistema' + suf,
						idValidacion: '#formSistema' + suf,
						popover: {
							content: 'Seleccione un sistema',
							placement: 'left'
						}
					},

					id_equipo_aero: {
						valor: null,
						idHTML: '#equipo' + suf,
						idValidacion: '#formEquipo' + suf,
						popover: {
							content: 'Seleccione un Equipo',
							placement: 'top'
						}					
					},

					actividad_verificar: {
						valor: null,
						idHTML: '#descripcion_act' + suf,
						idValidacion: '#formDescripcion_act' + suf,
						regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
						popover: {
							content: 'Ingrese descipción de actividad ( 1-600 caracteres, sin caracteres especiales )',
							placement: 'left'
						}
					},
					
					parametro_actividad: [],
					lectura_actual: [],
					lectura_posterior: []
				},

				IDS: {
					botonGuardar: '#btnGuardarLista' + suf,
					botonLimpiar: '#btnLimpiarLista' + suf,
					parametroAceptacion: '#parametroAceptacion' + suf,
					lecturaActual: '#tipoDatoLecturaActual' + suf,
					lecturaPost: '#tipoDatoLecturaPost' + suf,
					botonActividad: '#agregarActividad' + suf,
					botonReiniciarAct: '#reiniciarAct' + suf,
					listaActividades: '#listaActividades' + suf,
					divParametroAceptacion: '#insertarEstructuraDato_parametroAceptacion' + suf,
					divLecturaActual: '#insertarEstructuraDato_lecturaActual' + suf,
					divLecturaPost: '#insertarEstructuraDato_lecturaPost' + suf,					
					idsParametro: [],
					idsLecturaActual: [],
					idsLecturaPosterior: [],
					update_table_actividad: function () {}
				}
			};

		return doc;
	},

	__retornaFuncion: function ( val, suf )
	{
		if ( val )
		{
			var accion = '__' + val,
				obj = null;

			suf = suf || '';

			if ( typeof $.sigesop.listaVerificacion[ accion ] === 'function' )
				return obj = $.sigesop.listaVerificacion[ accion ]( suf );
				else jQuery.error( 'Funcion: ' + accion + ' no definida' );
		}
	},

		/****************************** parametro de aceptacion ******************************/

	__binario: function ( suf )
	{
		return this.__retornaFuncion( 'texto' );
	},

	__texto: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div id="formParamAcept' + suf + '" class="form-group">' +
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9">'+
				'		<div class="table-responsive">'+
				'			<table class="table table-bordered">'+
				'				<thead><tr><th>Parámetro</th></tr></thead>'+
				'				<tbody>' + 
				'					<tr>'	+							
				'						<td class="col-sm-6 col-md-6">'+
				'							<textarea id="paramAcept__' + suf +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
				'						</td>'+
				'					</tr>' +
				'				</tbody>'+
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'</div>' +

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9"><p><button id="agregarParamentro__' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar Parámetro</button></p>'+
				'</div>'

			// ---------- funciones privadas

			agregarCeldas = function ( mtzID, mtzParam )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzParam.length = 0; // vaciar los campos anteriores de la propiedad publica

					mtzParam.push({
						tipo_dato: 'TEXTO',
						parametro: {
							valor: $( mtzID[ 0 ].parametro ).val().trim(),
							idHTML: mtzID[ 0 ].parametro,
							regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
							popover: {
								content: 'Ingrese parametro ( 1-600 caracteres, sin caracteres especiales )',
								placement: 'top'
							}
						},
						unidad_medida: { valor: 'N/A' }
					});

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzParam, { tipoValidacion: 'error' } ) )
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					else 
					{
						mtzParam.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			};

		// ---------- objeto de retorno

		var doc = {
			html: html,
			javascript: function ()
			{
				$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

				// ---------- agregamos el evento click al boton agregar celdas

				$( doc.IDS.botonAgregarParametro ).on( 'click', function ( event )
				{
					event.preventDefault();
					agregarCeldas( doc.IDS.matrizID, doc.datos.parametro_actividad );
				});
			},
			datos:
			{
				parametro_actividad: []
			},
			IDS:
			{
				botonAgregarParametro: '#agregarParamentro__' + suf,
				matrizID: [ { parametro: '#paramAcept__' + suf } ] // donde se guardaran los ids html de las cajas de texto
			}
		}

		return doc;
	},

	__comparacion: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<label class="col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
				'	<div class="col-sm-2 col-md-2">'+
				'		<input id="cantidadDatos__param'+ suf +'" class="form-control input-md">'+
				'	</div>'+
				'	<div class="col-sm-5 col-md-5">'+
				'		<button id="botonAgregarCelda__param' + suf + '" class="btn btn-primary">Agregar</button>'+
				'	</div>'+
				'</div>'+

				'<div id="formParamAcept' + suf + '" class="form-group">' +
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9">'+
				'		<div class="table-responsive">'+
				'			<table class="table table-bordered">'+
				'				<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>' +
				'				<tbody id="tbody__param' + suf + '" ></tbody>'+
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'</div>' +

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9"><p><button id="agregarParamentro__' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar Parámetro</button></p>'+
				'</div>',

			// ---------- funciones privadas

			crearCeldas = function ( valor, matrizID, div )
			{
				if ( valor > 0 )
				{
					// ---------- Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
					
					var html = '',
						i = 0,
						lon = parseInt( valor );

					matrizID.length = 0;

					for ( var i = 0; i < lon; i++ ) 
					{
						var idHTML = suf + parseInt( i );

						html += 
							'<tr>'	+							
							'	<td class="col-sm-6 col-md-6">'+
							'		<textarea id="paramAcept' + idHTML + '" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
							'	</td>'+
							'	<td class="col-sm-3 col-md-3">'+
							'		<textarea id="paramDato_' + idHTML + '" class="form-control input-sm eventoCambioMayuscula" placeholder="Dato comparativo"></textarea>'+
							'	</td>'+	
							'	<td class="col-sm-3 col-md-3">'+
							'		<select id="paramMedida_' + idHTML + '" class="form-control" ><option>' + $.sigesop.sinRegistros + '</option></select>'+
							'	</td>'+	
							'</tr>';

						matrizID.push({
							parametro: '#paramAcept' + idHTML,
							dato: '#paramDato_' + idHTML,
							unidadMedida: '#paramMedida_'+ idHTML
						});						
					}

					$( div ).html( html );
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

					window.sesion.numeroFilas = i; // creamos la restriccion para lectura_actual y lectura_posterior

					// ---------- insertamos en los "select" los tipos de datos que estan almacenados en la base de datos
					
					if ( !jQuery.isEmptyObject( window.sesion.matrizUnidadMedida ) )
					{
						for ( var i = 0; i < lon; i++ ) 
							$.sigesop.insertaCombo( window.sesion.matrizUnidadMedida, '#paramMedida_' + suf + parseInt( i ), 'unidad_medida' );
					}
					else
					$.sigesop.solicitarDatosSistema({
						clase: 'ajaxListaVerificacion',
						solicitud: 'obtenerUnidadMedida',
						respuesta: function ( data ) 
						{
							window.sesion.matrizUnidadMedida = data;
							for ( var i = 0; i < lon; i++ ) 
								$.sigesop.insertaCombo( data, '#paramMedida_' + suf + parseInt( i ), 'unidad_medida' );
						}
					});													
				} 
				else $.sigesop.msgBlockUI( 'Especifique una cantidad de datos válida', 'error' );
			},

			agregarCeldas = function ( mtzID, mtzParam )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzParam.length = 0; // vaciar los campos anteriores de la propiedad publica

					var i = 0,
						lon = mtzID.length;

					for ( i = 0; i < lon; i++ ) 
					{
						mtzParam.push({
							tipo_dato: 'COMPARACION',
							dato: {
								valor: $( mtzID[ i ].dato ).val().trim(),
								idHTML: mtzID[ i ].dato,
								regexp: /^[\-+]?([0-9](\.[0-9])?){1,50}$/i,
								popover: {
									content: 'Ingrese dato ( 1-50 caracteres, únicamente números y decimales )',
									placement: 'top'
								}
							},
							parametro: {
								valor: $( mtzID[ i ].parametro ).val().trim(),
								idHTML: mtzID[ i ].parametro,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
								popover: {
									content: 'Ingrese parametro ( 1-600 caracteres )',
									placement: 'top'
								}
							},
							unidad_medida: {
								valor: $( mtzID[ i ].unidadMedida ).val().trim(),
								idHTML: mtzID[ i ].unidadMedida,
								popover: {
									content: 'Seleccione unidad de medida',
									placement: 'top'
								}
							}
						});
					}

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzParam, { tipoValidacion: 'error' } ) )
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					else 
					{
						mtzParam.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			},

			doc = {
				html: html,
				javascript: function ()
				{	
					var 
						spinerCantidad = $( doc.IDS.cantidadDatos ).spinner({
							spin: function ( event, ui ) 
							{
								if ( ui.value <= 0 ) 
								{
									$( this ).spinner( 'value' , 1 );
									return false;
								}
							}
						});		

					// ---------- agregamos el evento click al boton agregar celdas

					$( doc.IDS.botonAgregarCelda ).on( 'click', function ( event ) 
					{
						event.preventDefault();
						var valor = spinerCantidad.val().trim();
						crearCeldas( valor, doc.IDS.matrizID, doc.IDS.tabla );
					});

					$( doc.IDS.botonAgregarParametro ).on( 'click', function ( event )
					{
						event.preventDefault();
						agregarCeldas( doc.IDS.matrizID, doc.datos.parametro_actividad );
					});
				},

				datos:
				{
					parametro_actividad: []
				},

				IDS:
				{
					cantidadDatos: '#cantidadDatos__param' + suf,
					botonAgregarCelda: '#botonAgregarCelda__param' + suf,
					tabla: '#tbody__param' + suf,
					botonAgregarParametro: '#agregarParamentro__' + suf,
					matrizID: [] // donde se guardaran los ids html de las cajas de texto
				}
			};

		return doc;
	},

	__rango: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<label class="col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
				'	<div class="col-sm-2 col-md-2">'+
				'		<input id="cantidadDatos__param_rango'+ suf +'" class="form-control input-md">'+
				'	</div>'+
				'	<div class="col-sm-5 col-md-5">'+
				'		<button id="botonAgregarCelda__param_rango' + suf + '" class="btn btn-primary">Agregar</button>'+
				'	</div>'+
				'</div>'+

				'<div class="form-group">' +
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9">'+
				'		<div class="table-responsive">'+
				'			<table class="table table-bordered">'+
				'				<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>' +
				'				<tbody id="tbody__param_rango' + suf + '"></tbody>' +
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'</div>' +

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9"><p><button id="agregarParamentro__rango' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar Parámetro</button></p>'+
				'</div>',

			// ---------- funciones privadas

			crearCeldas = function ( valor, matrizID, div )
			{
				if ( valor > 0 )
				{
					// ---------- Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
					
					var html = '',
						i = 0,
						lon = parseInt( valor )

					matrizID.length = 0;

					for ( var i = 0; i < lon; i++ ) 
					{
						var idHTML = suf + parseInt( i );

						html += 
							'<tr>'	+							
							'	<td class="col-sm-4 col-md-4">'+
							'		<textarea id="paramAcept__rango' + idHTML +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
							'	</td>'+
							'	<td class="col-sm-5 col-md-5">'+
							'		<div class="col-md-5 col-sm-5 ">' +
							'			<input id="paramDatoInf_rango' + idHTML +'" class="form-control" placeholder="Dato inferior">'+
							'		</div>' +
							'		<div class="col-md-2 col-sm-2" ><center><label class="control-label"><span class="glyphicon glyphicon-minus"></span></label></center></div>' +
							'		<div class="col-md-5 col-sm-5">' +
							'			<input id="paramDatoSup_rango' + idHTML +'" class="form-control" placeholder="Dato superior">'+
							'		</div>' +
							'	</td>'+	
							'	<td class="col-sm-3 col-md-3">'+
							'		<select id="paramMedida__rango' + idHTML +'" class="form-control" ><option>' + $.sigesop.sinRegistros + '</option></select>'+
							'	</td>'+	
							'</tr>'

						matrizID.push({
							parametro: '#paramAcept__rango' + idHTML,
							datoInf: '#paramDatoInf_rango' + idHTML,
							datoSup: '#paramDatoSup_rango' + idHTML,
							unidadMedida: '#paramMedida__rango'+ idHTML
						});						
					}

					$( div ).html( html );
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

					window.sesion.numeroFilas = i; // creamos la restriccion para lectura_actual y lectura_posterior

					// ---------- insertamos en los "select" los tipos de datos que estan almacenados en la base de datos
					
					if ( !jQuery.isEmptyObject( window.sesion.matrizUnidadMedida ) )
					{
						for ( var i = 0; i < lon; i++ ) 
							$.sigesop.insertaCombo( window.sesion.matrizUnidadMedida, '#paramMedida__rango' + suf + parseInt( i ), 'unidad_medida' );
					}
					else
					$.sigesop.solicitarDatosSistema({
						clase: 'ajaxListaVerificacion',
						solicitud: 'obtenerUnidadMedida',
						respuesta: function ( data ) 
						{
							window.sesion.matrizUnidadMedida = data;
							for ( var i = 0; i < lon; i++ ) 
								$.sigesop.insertaCombo( data, '#paramMedida__rango' + suf + parseInt( i ), 'unidad_medida' );
						}
					});													
				} 
				else $.sigesop.msgBlockUI( 'Especifique una cantidad de datos válida', 'error' );
			},

			agregarCeldas = function ( mtzID, mtzParam )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzParam.length = 0; // vaciar los campos anteriores de la propiedad publica

					var 
						i = 0,
						lon = mtzID.length;

					for ( i = 0; i < lon; i++ ) 
					{
						mtzParam.push({
							tipo_dato: 'RANGO',							
							datoSup: {
								valor: $( mtzID[ i ].datoSup ).val().trim(),
								idHTML: mtzID[ i ].datoSup,
								regexp: /^[\-+]?([0-9](\.[0-9])?){1,50}$/i,
								popover: {
									content: 'Ingrese dato ( 1-50 caracteres, únicamente números y decimales )',
									placement: 'top'
								}
							},
							datoInf: {
								valor: $( mtzID[ i ].datoInf ).val().trim(),
								idHTML: mtzID[ i ].datoInf,
								regexp: /^[\-+]?([0-9](\.[0-9])?){1,50}$/i,
								popover: {
									content: 'Ingrese dato ( 1-50 caracteres, únicamente números y decimales)',
									placement: 'top'
								}
							},							
							parametro: {
								valor: $( mtzID[ i ].parametro ).val().trim(),
								idHTML: mtzID[ i ].parametro,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
								popover: {
									content: 'Ingrese parametro ( 1-600 caracteres )',
									placement: 'top'
								}
							},
							unidad_medida: {
								valor: $( mtzID[ i ].unidadMedida ).val().trim(),
								idHTML: mtzID[ i ].unidadMedida,
								popover: {
									content: 'Seleccione unidad de medida',
									placement: 'top'
								}
							}
						});
					}

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzParam, { tipoValidacion: 'error' } ) )
					{
						// ---------- concatenamos datoInf con datoSup delimitado por comas

						for( var i = 0, lon = mtzParam.length; i < lon; i++ )
						{
							mtzParam[ i ].dato = {};
							mtzParam[ i ].dato.valor = 
								mtzParam[ i ].datoInf.valor.concat( ',' + mtzParam[ i ].datoSup.valor );

							delete mtzParam[ i ].datoInf;
							delete mtzParam[ i ].datoSup;
						}

						// ----------
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					}
					else 
					{
						mtzParam.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			},

			doc = {
				html: html,
				javascript: function ()
				{
					var 
						spinerCantidad = $( doc.IDS.cantidadDatos ).spinner({
							spin: function ( event, ui ) 
							{
								if ( ui.value <= 0 ) 
								{
									$( this ).spinner( 'value' , 1 );
									return false;
								}
							}
						});

					// ---------- agregamos el evento click al boton agregar celdas

					$( doc.IDS.botonAgregarCelda ).on( 'click', function ( event ) 
					{
						event.preventDefault();
						var valor = spinerCantidad.val().trim();
						crearCeldas( valor, doc.IDS.matrizID, doc.IDS.tabla );
					});

					$( doc.IDS.botonAgregarParametro ).on( 'click', function ( event )
					{
						event.preventDefault();
						agregarCeldas( doc.IDS.matrizID, doc.datos.parametro_actividad );
					});
				},
				datos:
				{
					parametro_actividad: []
				},
				IDS:
				{
					cantidadDatos: '#cantidadDatos__param_rango' + suf,
					botonAgregarCelda: '#botonAgregarCelda__param_rango' + suf,
					tabla: '#tbody__param_rango' + suf,
					botonAgregarParametro: '#agregarParamentro__rango' + suf,
					matrizID: [] // donde se guardaran los ids html de las cajas de texto
				}
			};

		return doc;
	},

	__tolerancia: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<label class="col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
				'	<div class="col-sm-2 col-md-2">'+
				'		<input id="cantidadDatos__param_tolerancia'+ suf +'" class="form-control input-md">'+
				'	</div>'+
				'	<div class="col-sm-5 col-md-5">'+
				'		<button id="botonAgregarCelda__param_tolerancia' + suf + '" class="btn btn-primary">Agregar</button>'+
				'	</div>'+
				'</div>'+

				'<div class="form-group">' +
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9">'+
				'		<div class="table-responsive">'+
				'			<table class="table table-bordered">'+
				'				<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>' +
				'				<tbody id="tbody__param_tolerancia' + suf + '"></tbody>' +
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'</div>' +

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9"><p><button id="agregarParamentro__tolerancia' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar Parámetro</button></p>'+
				'</div>',

			// ---------- funciones privadas

			crearCeldas = function ( valor, matrizID, div )
			{
				if ( valor > 0 )
				{
					// ---------- Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad
					
					var html = '',
						i = 0,
						lon = parseInt( valor )

					matrizID.length = 0;

					for ( var i = 0; i < lon; i++ ) 
					{
						var idHTML = suf + parseInt( i );

						html += 
							'<tr>'	+							
							'	<td class="col-sm-4 col-md-4">'+
							'		<textarea id="paramAcept_tolerancia' + idHTML +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
							'	</td>'+
							'	<td class="col-sm-5 col-md-5">'+
							'		<div class="col-md-5 col-sm-5 ">' +
							'			<input id="paramDato_tolerancia' + idHTML +'" class="form-control" placeholder="Dato">'+
							'		</div>' +
							'		<div class="col-md-2 col-sm-2 ">' +
							'			<span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span>' +
							'		</div>' +
							'		<div class="col-md-5 col-sm-5 ">' +
							'			<input id="paramDatoTol_tolerancia' + idHTML +'" class="form-control" placeholder="Tolerancia">'+
							'		</div>' +
							'	</td>'+	
							'	<td class="col-sm-3 col-md-3">'+
							'		<select id="paramMedida_tolerancia' + idHTML +'" class="form-control" ><option>' + $.sigesop.sinRegistros + '</option></select>'+
							'	</td>'+	
							'</tr>'

						matrizID.push({
							parametro: '#paramAcept_tolerancia' + idHTML,
							dato: '#paramDato_tolerancia' + idHTML,
							tolerancia: '#paramDatoTol_tolerancia' + idHTML,
							unidadMedida: '#paramMedida_tolerancia'+ idHTML
						});						
					}

					$( div ).html( html );
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

					window.sesion.numeroFilas = i; // creamos la restriccion para lectura_actual y lectura_posterior

					// ---------- insertamos en los "select" los tipos de datos que estan almacenados en la base de datos
					
					if ( !jQuery.isEmptyObject( window.sesion.matrizUnidadMedida ) )
					{
						for ( var i = 0; i < lon; i++ ) 
							$.sigesop.combo({
								arr: window.sesion.matrizUnidadMedida, 
								elem: '#paramMedida_tolerancia' + suf + parseInt( i ), 
								campo: 'unidad_medida'
							});
					}
					else
					$.sigesop.solicitarDatosSistema({
						clase: 'ajaxListaVerificacion',
						solicitud: 'obtenerUnidadMedida',
						respuesta: function ( data ) 
						{
							window.sesion.matrizUnidadMedida = data;
							for ( var i = 0; i < lon; i++ ) 
								$.sigesop.combo({
									arr: window.sesion.matrizUnidadMedida, 
									elem: '#paramMedida_tolerancia' + suf + parseInt( i ), 
									campo: 'unidad_medida'
								});
						}
					});													
				} 
				else $.sigesop.msgBlockUI( 'Especifique una cantidad de datos válida', 'error' );
			},

			agregarCeldas = function ( mtzID, mtzParam )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzParam.length = 0; // vaciar los campos anteriores de la propiedad publica

					var 
						i = 0,
						lon = mtzID.length;

					for ( i = 0; i < lon; i++ ) 
					{
						mtzParam.push({
							tipo_dato: 'TOLERANCIA',							
							dato: {
								valor: $( mtzID[ i ].dato ).val().trim(),
								idHTML: mtzID[ i ].dato,
								regexp: /^[\-+]?([0-9](\.[0-9])?){1,50}$/i,
								popover: {
									content: 'Ingrese dato ( 1-50 caracteres, únicamente números y decimales )',
									placement: 'top'
								}
							},
							tolerancia: {
								valor: $( mtzID[ i ].tolerancia ).val().trim(),
								idHTML: mtzID[ i ].tolerancia,
								regexp: /^[\-+]?([0-9](\.[0-9])?){1,50}$/i,
								popover: {
									content: 'Ingrese dato ( 1-50 caracteres, únicamente números y decimales)',
									placement: 'top'
								}
							},							
							parametro: {
								valor: $( mtzID[ i ].parametro ).val().trim(),
								idHTML: mtzID[ i ].parametro,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
								popover: {
									content: 'Ingrese parametro ( 1-600 caracteres )',
									placement: 'top'
								}
							},
							unidad_medida: {
								valor: $( mtzID[ i ].unidadMedida ).val().trim(),
								idHTML: mtzID[ i ].unidadMedida,
								popover: {
									content: 'Seleccione unidad de medida',
									placement: 'top'
								}
							}
						});
					}

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzParam, { tipoValidacion: 'error' } ) )
					{
						// ---------- concatenamos datoInf con datoSup delimitado por comas

						for( var i = 0, lon = mtzParam.length; i < lon; i++ )
						{
							// mtzParam[ i ].dato = {};
							mtzParam[ i ].dato.valor = 
								mtzParam[ i ].dato.valor.concat( ',' + mtzParam[ i ].tolerancia.valor );

							delete mtzParam[ i ].tolerancia;							
						}

						// ----------
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					}
					else 
					{
						mtzParam.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			},

			doc = {
				html: html,
				javascript: function ()
				{
					var 
						spinerCantidad = $( doc.IDS.cantidadDatos ).spinner({
							spin: function ( event, ui ) 
							{
								if ( ui.value <= 0 ) 
								{
									$( this ).spinner( 'value' , 1 );
									return false;
								}
							}
						});

					// ---------- agregamos el evento click al boton agregar celdas

					$( doc.IDS.botonAgregarCelda ).on( 'click', function ( event ) 
					{
						event.preventDefault();
						var valor = spinerCantidad.val().trim();
						crearCeldas( valor, doc.IDS.matrizID, doc.IDS.tabla );
					});

					$( doc.IDS.botonAgregarParametro ).on( 'click', function ( event )
					{
						event.preventDefault();
						agregarCeldas( doc.IDS.matrizID, doc.datos.parametro_actividad );
					});
				},
				datos:
				{
					parametro_actividad: []
				},
				IDS:
				{
					cantidadDatos: '#cantidadDatos__param_tolerancia' + suf,
					botonAgregarCelda: '#botonAgregarCelda__param_tolerancia' + suf,
					tabla: '#tbody__param_tolerancia' + suf,
					botonAgregarParametro: '#agregarParamentro__tolerancia' + suf,
					matrizID: [] // donde se guardaran los ids html de las cajas de texto
				}
			};

		return doc;
	},

		/****************************** lectura actual y posterior ******************************/

	__tipoBinario: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<label class="col-sm-2 col-md-2 control-label">Cantidad de datos:</label>'+
				'	<div class="col-sm-2 col-md-2">'+
				'		<input id="cantidadBinario__'+ suf +'" class="form-control input-md">'+
				'	</div>'+
				'	<div class="col-sm-5 col-md-5">'+
				'		<button id="btnCantidadBinario' + suf + '" class="btn btn-primary">Agregar</button>'+
				'	</div>'+
				'</div>'+

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9">'+
				'		<div class="table-responsive">'+
				'			<table class="table table-bordered">'+
				'				<thead><tr><th>Parámetro</th><th>Dato</th></tr></thead>'+
				'				<tbody id="tabla_binario' + suf + '"></tbody>'+
				'			</table>'+
				'		</div>'+
				'	</div>'+
				'</div>'+

				'<div class="form-group">'+
				'	<div class="col-sm-2 col-md-2"></div>'+
				'	<div class="col-sm-9 col-md-9"><p><button id="agregarLecturaActual__' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar lectura</button></p>'+
				'</div>',

			// ---------- funciones privadas

			crearCeldas = function ( filas, matrizID, div )
			{
				if ( filas > 0 )
				{				
					// -------- Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad

					if ( typeof filas !== 'undefined' )
					{
						var html = '';

						matrizID.length = 0;

						for ( var i = 0; i < parseInt( filas ) ; i++ ) 
						{
							var idHTML = suf + parseInt( i );
							
							html += '<tr>'	+							
							'	<td class="col-sm-6">'+
							'		<textarea id="parametroVerificar_' + idHTML +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
							'	</td>'+
							'	<td class="col-sm-6">'+
							'		<input id=""type="radio" name="binario_' + idHTML + '" class="input-sm" disabled>'+
							'		<label class="control-label">SI</label>'+
							'		<input type="radio" name="binario_'+ idHTML +'" class="input-sm" disabled>'+
							'		<label class="">NO</label>'+
							'	</td>'+
							'</tr>';

							matrizID.push({
								parametro: '#parametroVerificar_' + idHTML
							});
						}
						
						$( div ).html( html );
						$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
					}
					else console.log( 'La variable [filas] es indefinida' );
				} 
				else $.sigesop.msgBlockUI( 'Especifique una cantidad de datos válida', 'error' )
			},

			agregarCeldas = function ( mtzID, mtzLectura )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzLectura.length = 0; // vaciar los campos anteriores

					for ( var j = 0, lon = mtzID.length ; j < lon; j++ ) 
					{
						mtzLectura.push({
							tipo_dato: 'Binario',
							parametro: {
								valor: $( mtzID[ j ].parametro ).val().trim(),
								idHTML: mtzID[ j ].parametro,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
								popover: {
									content: 'Ingrese dato ( 1-600 caracteres, evite el uso de simbolos especiales )',
									placement: 'top'
								}
							},
							unidad_medida: { valor: 'N/A' }
						});
					}

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzLectura, { tipoValidacion: 'error' } ) )
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					else
					{
						mtzLectura.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			},

			doc = {
				html: html,
				javascript: function ()
				{
					var 
						spinerCantidad = $( doc.IDS.cantidadDatos ).spinner({
							spin: function ( event, ui ) {
								if ( ui.value <= 0 ) 
								{
									$( this ).spinner( 'value' , 1 );
									return false;
								}
							}
						});

					/* verificamos si la numeroFilas ha sido modificado por el [paramentro de aceptacion]
					 * si esto es verdadero restringiremos al usuario a crear celdas, ya que la cantidad de
					 * celdas debe de ser la misma que en el [parametro de aceptacion]
					 */

		 			if ( window.sesion.numeroFilas > 0 )
					{
						spinerCantidad.spinner( 'value', window.sesion.numeroFilas )
						spinerCantidad.spinner( 'disable' );
						$( doc.IDS.botonAgregarCelda ).prop( 'disabled', true );
						crearCeldas( window.sesion.numeroFilas, doc.IDS.matrizID, doc.IDS.tabla );
					}				

					$( doc.IDS.botonAgregarCelda ).on( 'click', function ( event ) 
					{
						event.preventDefault();			
						var valor = spinerCantidad.val();
						crearCeldas( valor, doc.IDS.matrizID, doc.IDS.tabla );
					});	
					
					$( doc.IDS.botonAgregarLectura ).on( 'click', function ( event )
					{
						event.preventDefault();					
						agregarCeldas( doc.IDS.matrizID, doc.datos.matrizLectura );
					});
				},

				datos:{
					matrizLectura: []
				},

				IDS: {
					cantidadDatos: '#cantidadBinario__' + suf,
					botonAgregarCelda: '#btnCantidadBinario' + suf,
					botonAgregarLectura: '#agregarLecturaActual__' + suf,
					tabla: '#tabla_binario' + suf,				
					matrizID: []
				}
			};

		return doc;
	},

	__tipoDato: function ( suf )
	{
		suf = suf || '';

		var 
			html = '<br>' +
				'<div class="form-group">' +
				'	<div class="col-sm-2"></div>' +
				'	<label class="col-sm-2 control-label">Cantidad de datos:</label>' +
				'	<div class="col-sm-2">' +
				'		<input id="cantidadDatos' + suf + '" class="form-control input-md">' +
				'	</div>' +
				'	<div class="col-sm-5">' +
				'		<button id="btnCantidadDato' + suf + '" class="btn btn-default">Agregar</button>' +
				'	</div>' +
				'</div>' +

				'<div class="form-group">' +
				'	<div class="col-sm-2"></div>' +
				'	<div class="col-sm-9">' +
				'		<div class="table-responsive">' +
				'			<table class="table table-bordered">' +
				'				<thead><tr><th>Parámetro</th><th>Dato</th><th>Tipo de Dato</th></tr></thead>' +
				'				<tbody id="tabla_dato' + suf + '"></tbody>' +
				'			</table>' +
				'		</div>' +
				'	</div>' +
				'</div>' +

				'<div class="form-group">' +
				'	<div class="col-sm-2"></div>' +
				'	<div class="col-sm-9"><p><button id="agregarLecturaDato' + suf + '" class="btn btn-primary"><span class="glyphicon glyphicon-plus"></span> Agregar lectura</button></p>' +
				'</div>',

			// ---------- funciones privadas

			crearCeldas = function ( filas, matrizID, div )
			{
				if ( filas > 0 )
				{				
					// -------- Se inserta la interfaz grafica de la cantidad de datos que tendra la actividad

					if ( typeof filas !== 'undefined' )
					{
						var html = '';

						matrizID.length = 0;

						for ( var i = 0; i < parseInt( filas ) ; i++ ) 
						{
							var idHTML = suf + parseInt( i );
							
							html += '<tr>'	+							
								'	<td class="col-sm-5">'+
								'		<textarea id="parametroVerificar_dato_'+ idHTML +'" class="form-control input-sm eventoCambioMayuscula" placeholder="Parámetro"></textarea>'+
								'	</td>' +
								'	<td class="col-sm-2 text-center">'+
								'		<label class="control-label">Dato '+ ( parseInt( i ) + 1 ) +'</label>'+
								'	</td>'+
								'	<td class="col-sm-5">'+
								'		<select id="unidadMedidaVerificar_dato_'+ idHTML +'" class="form-control"><option value="">' + $.sigesop.sinRegistros + '</option></select>'+
								'	</td>' +
								'</tr>';

							matrizID.push({
								parametro: '#parametroVerificar_dato_' + idHTML,
								unidadMedida: '#unidadMedidaVerificar_dato_' + idHTML
							});
						}

						// window.sesion.filas = i;
						
						$( div ).html( html );
						$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

						// ---------- insertamos en los "select" los tipos de datos que estan almacenados en la base de datos
						
						if ( !jQuery.isEmptyObject( window.sesion.matrizUnidadMedida ) ) 
						{
							for ( var i = 0; i < parseInt( filas ); i++ ) 
								$.sigesop.insertaCombo( window.sesion.matrizUnidadMedida, '#unidadMedidaVerificar_dato_' + suf + parseInt( i ), 'unidad_medida' );							
						}
						else $.sigesop.solicitarDatosSistema({
							clase: 'ajaxListaVerificacion',
							solicitud: 'obtenerUnidadMedida',
							respuesta: function ( data ) 
							{
								window.sesion.matrizUnidadMedida = data;
								for ( var i = 0; i < parseInt( filas ); i++ ) 
									$.sigesop.insertaCombo( data, '#unidadMedidaVerificar_dato_' + suf + parseInt( i ), 'unidad_medida' );
							}
						});	
					}
					else console.log( 'La variable [filas] es indefinida' );
				} 
				else $.sigesop.msgBlockUI( 'Especifique una cantidad de datos válida', 'error' )
			},

			agregarCeldas = function ( mtzID, mtzLectura )
			{
				if ( !jQuery.isEmptyObject( mtzID ) ) 
				{					
					mtzLectura.length = 0; // vaciar los campos anteriores

					for ( var j = 0, lon = mtzID.length ; j < lon; j++ ) 
					{
						mtzLectura.push({
							tipo_dato: 'Datos',
							parametro: {
								valor: $( mtzID[ j ].parametro ).val().trim(),
								idHTML: mtzID[ j ].parametro,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,600}$/i,
								popover: {
									content: 'Ingrese dato ( 1-600 caracteres, evite el uso de simbolos especiales )',
									placement: 'top'
								}
							},
							unidad_medida: {
								valor: $( mtzID[ j ].unidadMedida ).val().trim(),
								idHTML: mtzID[ j ].unidadMedida,
								popover: {
									content: 'Seleccione unidad de medida',
									placement: 'top'
								}
							}
						});
					}

					// ---------- si la validacion es correcta ejecutamos la funcion [success] de tal manera que desde el 
					// ---------- objeto superior realice una accion ante este evento success

					if ( $.sigesop.validacion( mtzLectura, { tipoValidacion: 'error' } ) )
						typeof doc.success === 'function'  ? doc.success() : null; // ejecutamos callback
					else
					{
						mtzLectura.length = 0; // si no pasa validacion vaciamos datos
						$.sigesop.msgBlockUI( 'Complete los campos', 'error' );
					}
				} 
				else $.sigesop.msgBlockUI( 'Sin datos: Especifique una cantidad de datos válida', 'error' );
			},

			doc = {
				html: html,
				javascript: function ()
				{			
					var spinerCantidad = $( doc.IDS.cantidadDatos ).spinner({
							spin: function ( event, ui ) {
								if ( ui.value <= 0 ) 
								{
									$( this ).spinner( 'value' , 1 );
									return false;
								}
							}
						});

					/* verificamos si la numeroFilas ha sido modificado por el [paramentro de aceptacion]
					 * si esto es verdadero restringiremos al usuario a crear celdas, ya que la cantidad de
					 * celdas debe de ser la misma que en el [parametro de aceptacion]
					 */

		 			if ( window.sesion.numeroFilas > 1 )
					{
						spinerCantidad.spinner( 'value', window.sesion.numeroFilas )
						spinerCantidad.spinner( 'disable' );
						$( doc.IDS.botonAgregarCelda ).prop( 'disabled', true );
						crearCeldas( window.sesion.numeroFilas, doc.IDS.matrizID, doc.IDS.tabla );
					}

					$( doc.IDS.botonAgregarCelda ).on( 'click', function ( event ) 
					{
						event.preventDefault();			
						var valor = spinerCantidad.val();
						crearCeldas( valor, doc.IDS.matrizID, doc.IDS.tabla );
					});	
					
					$( doc.IDS.botonAgregarLectura ).on( 'click', function ( event )
					{
						event.preventDefault();					
						agregarCeldas( doc.IDS.matrizID, doc.datos.matrizLectura );
					});
				},

				datos:{
					matrizLectura: []
				},

				IDS: {
					cantidadDatos: '#cantidadDatos' + suf,
					botonAgregarCelda: '#btnCantidadDato' + suf,
					tabla: '#tabla_dato' + suf,
					botonAgregarLectura: '#agregarLecturaDato' + suf,
					matrizID: []
				}
			};

		return doc;
	}
}