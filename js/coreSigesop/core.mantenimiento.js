$.sigesop.mantenimiento = {
	documentoProgramaMantenimiento: function ( obj, suf )
	{
		obj = obj || {};

		suf = suf || '';	
				
		// -------------------- Estructura HTML del documento

		var 
			html =
				'<div class="panel panel-success">' +
				'	<div class="panel-heading">Datos de la orden de trabajo</div>' +
				'	<br>' +
				'	<form class="form-horizontal" role="form">' +
				'		<div id="formUnidad' + suf + '" class="form-group">' +
				'			<label class="control-label col-sm-3">Unidad: </label>' +
				'			<div class="col-sm-7">' +
				'				<select id="numeroUnidad' + suf + '" class="form-control"></select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="formNumeroGenerador' + suf + '" class="form-group">' +
				'			<label class="control-label col-sm-3">Aerogenerador: </label>' +
				'			<div class="col-sm-7">' +
				'				<select id="numeroGenerador' + suf + '" class="form-control" disabled></select>' +
				'			</div>' +
				'		</div>' +
						
				'		<div id="formTipoMantto' + suf + '" class="form-group">' +
				'			<label for="" class="control-label col-sm-3">Tipo Mantenimiento: </label>' +
				'			<div class="col-sm-7">' +
				'				<select id="tipoMantto' + suf + '" class="form-control" disabled></select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="formDuracion' + suf + '" class="form-group">' +
				'			<label for="" class="control-label col-sm-3">Duración: </label>' +
				'			<div class="col-sm-3">' +
				'				<input id="duracion' + suf + '" class="form-control" >' +
				'			</div>' +
				'			<div class="col-sm-4">' +
				'				<select id="magnitudDuracion' + suf + '" class="form-control" >' +
				'					<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
				'					<option value="d">DIAS</option>' +
				'					<option value="M">MESES</option>' +
				'					<option value="y">AÑOS</option>' +
				'				</select>' +
				'			</div>' +
				'		</div>' +

				'		<div id="formFechas' + suf + '" class="form-group">' +
				'			<label for="" class="control-label col-sm-3">Periodo de Programación Inicial: </label>' +
				'			<div class="col-sm-7">' +
				'					<input id="fechaProgramada' + suf + '" type="text" class="form-control">' +
				'			</div>' +
				'		</div>' +

				'		<div id="formFechaFinalProgramada' + suf + '" class="form-group">' +
				'			<label for="" class="control-label col-sm-3">Periodo de Programación Final: </label>' +
				'			<div class="col-sm-7">' +
				'					<input id="fechaFinalProgramada' + suf + '" type="text" class="form-control">' +
				'			</div>' +
				'		</div>' +

				// '		<div id="formUsuarioResponsable' + suf + '" class="form-group">' +
				// '			<label for="" class="control-label col-sm-3">Trabajador Responsable: </label>' +
				// '			<div class="col-sm-5">' +
				// '					<input id="usuarioResponsable' + suf + '" type="text" class="form-control" disabled>' +
				// '			</div>' +			
				// '			<div class="col-sm-4">'+
				// '				<p class="pull-center">'+
				// '					<button id="btnResp' + suf + '" class="btn btn-primary" > <span class="glyphicon glyphicon-user"></span> Seleccionar </button>'+
				// '				</p>'+
				// '			</div>'+
				// '		</div>' +

				// '		<div id="formUsuarioSuper' + suf + '" class="form-group">' +
				// '			<label for="" class="control-label col-sm-3">Trabajador Supervisor</label>' +
				// '			<div class="col-sm-5">' +
				// '					<input id="usuarioSuper' + suf + '" type="text" class="form-control" disabled>' +
				// '			</div>' +				
				// '			<div class="col-sm-4">'+
				// '				<p class="pull-center">'+
				// '					<button id="btnSuperv' + suf + '" class="btn btn-primary" > <span class="glyphicon glyphicon-user"></span> Seleccionar </button>'+
				// '				</p>'+
				// '			</div>'+
				// '		</div>' +

				// '		<div id="formUsuarioAuxiliar' + suf + '" class="form-group">' +
				// '			<label for="" class="control-label col-sm-3">Trabajador Auxiliar: </label>' +				
				// '			<div class="col-sm-4">'+
				// '				<p class="pull-center">'+
				// '					<button id="btnAuxiliar' + suf + '" class="btn btn-primary" > <span class="glyphicon glyphicon-user"></span> Seleccionar </button>'+
				// '				</p>'+
				// '			</div>'+
				// '		</div>' +			

				// '		<div class="form-group">'+
				// '			<div class="col-sm-3"> </div>'+
				// '			<div id="listaUsuarioAux' + suf + '" class="col-sm-5"> </div>' +
				// '		</div>'+

				'		<div id="formTrabajoSolicitado' + suf + '" class="form-group">' +
				'			<label class="control-label col-sm-3">Trabajo solicitado: </label>' +
				'			<div class="col-sm-7">' +
				'				<textarea id="trabajoSolicitado' + suf + '" class="form-control eventoCambioMayuscula' + suf + '" ></textarea>' +
				'			</div>' +
				'		</div>' +
							
				'		<div class="form-group">' +
				'			<div class="col-sm-3 control-label"></div>' +
				'			<p class="col-sm-9">' +
				'				<button id="btnGenerarOrdenes' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Generar</button>' +
				'				<button id="btnLimpiarFormOrdenes' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'			</p>' +
				'		</div>' +
				'	</form>' +
				'</div>',

			obj = {
				html: html,

				javascript: function ()
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
				},

				datos: {
					numero_unidad: {
						valor: null,
						idHTML: '#numeroUnidad' + suf,
						idValidacion: '#formUnidad' + suf,
						popover: {
							content: 'Seleccione un número de unidad válido',
							placement: 'top'
						}
					},

					numero_aero: {
						valor: null,
						idHTML: '#numeroGenerador' + suf,
						idValidacion: '#formNumeroGenerador' + suf,
						popover: {
							content: 'Seleccione un número de generador válido',
							placement: 'left'
						}
					},

					id_mantenimiento: {
						valor: null,
						idHTML: '#tipoMantto' + suf,
						idValidacion: '#formTipoMantto' + suf,
						popover: {
							content: 'Seleccione un tipo de Mantenimiento válido',
							placement: 'top'
						}
					},

					duracion: {
						valor: null,
						idHTML: '#duracion' + suf,
						idValidacion: '#formDuracion' + suf,
						popover: {
							content: 'Agregue duracion de mantenimiento',
							placement: 'top'
						}
					},

					magnitud_duracion: {
						valor: null,
						idHTML: '#magnitudDuracion' + suf,
						idValidacion: '#formDuracion' + suf,
						popover: {
							content: 'Seleccione una magnitud de duración válida',
							placement: 'right'
						}
					},

					fecha_inicial: {
						valor: null,
						idHTML: '#fechaProgramada' + suf,
						idValidacion: '#formFechas' + suf,
						popover: {
							content: 'Seleccione una fecha válida',
							placement: 'top'
						}
					},

					fecha_final: {
						valor: null,
						idHTML: '#fechaFinalProgramada' + suf,
						idValidacion: '#formFechaFinalProgramada' + suf,
						popover: {
							content: 'Seleccione una fecha válida',
							placement: 'left'
						}
					},

					trabajo_solicitado: {
						valor: null,
						idHTML: '#trabajoSolicitado' + suf,
						idValidacion: '#formTrabajoSolicitado' + suf,
						popover: {
							content: 'Agregue la descripcion del trabajo solicitado',
							placement: 'top'
						}
					}
				},

				IDS: {
					botonGuardar: '#btnGenerarOrdenes' + suf,
					botonLimpiar: '#btnLimpiarFormOrdenes' + suf
				}
			};

		return obj;
	},

	documentoVistaPreliminar: function ( suf )
	{
		// ---------- ID de los botones

		var botonGuardar = 'btnGuardarOrdenes' + suf,
			grafica = 'graf' + suf;

		html = '' +
			'<form class="form-horizontal" role="form">' +
			'	<div id="' + grafica + '" class="text-center" > <h4> CARGANDO DATOS... </h4></div> <br><br>' +

			'	<div class="form-group">' +
			'		<div class="col-sm-2 control-label"></div>' +
			'		<p class="col-sm-9">' +
			'			<button id="' + botonGuardar + '" type="submit" class="btn btn-success" data-loading-text="Cargando Ordenes..."> <span class="glyphicon glyphicon-floppy-disk"></span> Autorizar Ordenes</button>' +
			'		</p>' +
			'	</div>' +
			
			'</form>';
		
		var objetoRetorno = {			
			html: html,

			IDS: {
				botonGuardar: '#' + botonGuardar,
				grafica: '#' + grafica
			}
		}

		return objetoRetorno;
	},

	documentoAgregarUsuario: function( obj, suf, arr_user )
	{
		obj = obj || {};
		suf = suf || '';

		var 
			html = 
				'<form class="form-horizontal" role="form">' +
				// '	<div id="formUsuarioSuper' + suf + '" class="form-group">' +
				// '		<label for="" class="control-label col-sm-3">Trabajador Supervisor</label>' +
				// '		<div class="col-sm-7">' +
				// '				<select id="usuarioSuper' + suf + '" type="text" class="form-control"></select>' +
				// '		</div>' +
				// '	</div>' +

				'	<div id="formUsuarioResponsable' + suf + '" class="form-group">' +
				'		<label for="" class="control-label col-sm-3">Trabajador Responsable: </label>' +
				'		<div class="col-sm-7">' +
				'				<select id="usuarioResponsable' + suf + '" type="text" class="form-control"></select>' +
				'		</div>' +
				'	</div>' +

				'	<div id="formUsuarioAuxiliar' + suf + '" class="form-group">' +
				'		<label for="" class="control-label col-sm-3">Trabajador Auxiliar: </label>' +				
				'		<div id="usuarioAuxiliar' + suf + '" class="col-sm-7"></div>'+
				'	</div>' +

				'	<div class="form-group">' +
				'		<div class="col-sm-3 control-label"></div>' +
				'		<p class="col-sm-9">' +
				'			<button id="btnAgregarUsuarios' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Generar</button>' +
				'			<button id="btnLimpiarUsuarios' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'		</p>' +
				'	</div>' +
				'</form>',

			update_user = function ( arr )
			{
				if ( !jQuery.isEmptyObject( arr ) )
				{
					$.sigesop.insertaCombo( arr, this.datos.supervisor.idHTML, 'nombre_trabajador, apellidos_trabajador', 'nombre_usuario', '  ' );
					$.sigesop.insertaCombo( arr, this.datos.responsable.idHTML, 'nombre_trabajador, apellidos_trabajador', 'nombre_usuario', '  ' );
					
					var aux = 	$.sigesop.generaArregloCheck( arr,
								[ 'nombre_trabajador', 'apellidos_trabajador' ], 'nombre_usuario' );
					$( this.IDS.usuarioAuxiliar ).html( aux.html );
					this.IDS.checkAuxiliar = aux.matrizCheck;
				}

				else console.log( 'function: documentoAgregarUsuario \n[arr_user] es nulo' )
			},

			doc = {
				html: html,
				javascript: function ()
				{

				},

				datos: {
					supervisor:{
						valor: null
						// idHTML: '#usuarioSuper' + suf,
						// idValidacion: '#formUsuarioSuper' + suf,
						// popover: {
						// 	content: 'Seleccione usuario supervisor',
						// 	placement: 'top'
						// }
					},

					responsable: {
						valor: null,
						idHTML: '#usuarioResponsable' + suf,
						idValidacion: '#formUsuarioResponsable' + suf,
						popover: {
							content: 'Seleccione usuario responsable',
							placement: 'left'
						}
					},

					auxiliar: []
				},

				IDS: {
					botonGuardar: '#btnAgregarUsuarios' + suf,
					botonLimpiar: '#btnLimpiarUsuarios' + suf,
					usuarioAuxiliar: '#usuarioAuxiliar' + suf,
					checkAuxiliar: null
				},

				update_user: update_user
			};

		return doc;
	},	

	// --------------------------------------------------------------

	/**
	 * Json como parametro con las siguientes propiedades
	 * @param {String} fechaInicial
	 * @param {String} fechaFinal
	 * @param {Int} duracion
	 * @param {String} mangnitudDuracion
	 * @param {Int} frecuencia
	 * @param {String} mangnitudFrecuencia
	 */ 		
	calculaPeriodoMantenimiento: function ( opt )
	{
		var 
			inicio = moment( opt.fechaInicial, 'DD-MM-YYYY' ),
			fin = moment( opt.fechaFinal, 'DD-MM-YYYY' );

		if ( inicio.isValid && fin.isValid )
		{
			var 
				ff = fin, // fecha final del periodo
				fr_i = moment( opt.fechaInicial, 'DD-MM-YYYY' ), // fecha recorrido inicial
				fr_f = moment( opt.fechaInicial, 'DD-MM-YYYY' ); // fecha recorrido final
				
			var fechas = [];
			
			do 
			{
				fr_f.add( opt.duracion, opt.magnitudDuracion );
				// console.log( 'fr_i: ' + fr_i.format( 'DD-MM-YYYY' ) );
				// console.log( 'fr_f: ' + fr_f.format( 'DD-MM-YYYY' ) );
				// console.log( 'ff: ' + ff.format( 'DD-MM-YYYY' ) );
				
				if ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) ) 
				{
					fechas.push( {
						from: fr_i.utc().valueOf(),
						to: fr_f.utc().valueOf()
					} ) ;

					fr_f.add( opt.frecuencia, opt.magnitudFrecuencia );
					fr_i.add( opt.duracion, opt.magnitudDuracion ).add( opt.frecuencia, opt.magnitudFrecuencia );
				}
								
				// console.log( 'fr_i recorrido: ' + fr_i.format( 'DD-MM-YYYY' ) );
				// console.log( '\n' );
			}
			while ( ff.isAfter( fr_i ) && ff.isAfter( fr_f ) );

			return fechas;
		}
	},

	estructuraDatosOrdenTrabajo: function ( array )
	{
		if ( !jQuery.isEmptyObject( array ) )
		{
			jQuery.each( data, function( i, unidad ) 
			{
				var numeroUnidad = unidad.numeroUnidad,
					matrizAeros = unidad.matrizAeros;

				jQuery.each( matrizAeros, function( j, aero )
				{
					var numeroAero = aero.numeroAero,
					 	seriesTipoMantto = aero.seriesTipoMantto;

				 	jQuery.each( seriesTipoMantto, function( k, tipoMantto )
				 	{
				 		var nombreTipoMantto = tipoMantto.tipoMantto,
				 			matrizDatosOrden = tipoMantto.datos;
							frecuencia = tipoMantto.frecuencia,
				 			magnitudFrecuencia = tipoMantto.magnitudFrecuencia;

				 		jQuery.each( matrizDatosOrden, function( l, datos )
				 		{
				 			var numeroOrden = datos.numero_orden,
				 				duracion = datos.duracion,
				 				magnitudDuracion = datos.magnitud_duracion,	
				 				fechaProgramada = datos.fecha_programada,
				 				fechaReprogramada = datos.fecha_reprogramada,
				 				fechaRelizada = datos.fecha_realizada;

								var objFechaInicio = moment(fechaProgramada);
									diaFechaInicio = moment(fechaProgramada).date();
									mesFechaInicio = objFechaInicio.month(),
									anioFechaInicio = objFechaInicio.year();

								// var	objFechaFinal = $.sigesop.mantenimiento.propiedadesFecha( fechaFinal ),
								// 	diaFechaFinal = objFechaFinal.numeroDia,
								// 	mesFechaFinal = objFechaFinal.numeroMes,
								// 	anioFechaFinal = objFechaFinal.numeroAnio;

								// var ordenTrabajo = {
								// 	name: nombre,
								// 	color: color,
								// 	intervals: [{ // From-To pairs
								// 	    from: Date.UTC(anioFechaInicio, (mesFechaInicio-1), diaFechaInicio),
								// 	    to: Date.UTC(anioFechaFinal, ( mesFechaFinal-1 ), diaFechaFinal),
								// 	    label: label
								// 	}]
								// }

				 		});
				 	});
				});

				// tasks.push( ordenTrabajo );
			});
		}
		else console.log( 'Matriz Orden de trabajo vacia' );
	},

	formatoFechaServidor: function ( arr )
	{
		var r = [];
		for( var i in arr )
		{
			var from = moment( parseInt( arr[ i ].from ) ).format( 'DD-MM-YYYY' ),
				to = moment( parseInt( arr[ i ].to ) ).format( 'DD-MM-YYYY' );
				
			r.push({
				from: from,
				to: to
			});
		}

		return r;
	},

	graficaMantenimiento: function ( data, idHTML )
	{
		// try {
			if ( data !== null ) {
				// var tareas = [];
				
                // Define tasks
                var tasks = data

                // re-structure the tasks into line seriesvar series = [];
                series = [];
                jQuery.each( tasks.reverse(), function ( i, task ) 
                {
                    var item = {
                        color: task.colorGrafica,
                        name: task.nombre,                            
                        data: []
                    };
                    
                    jQuery.each( task.intervalos, function ( j, interval ) 
                    {
                        item.data.push({
                            x: interval.from,
                            y: i,
                            label: interval.label,
                            from: interval.from,
                            to: interval.to
                        }, 
                        {
                            x: interval.to,
                            y: i,
                            from: interval.from,
                            to: interval.to
                        });
                        
                        // add a null value between intervalos
                        if ( task.intervalos[ j + 1 ] ) 
                        {
                            item.data.push(
                                [ ( interval.to + task.intervalos[ j + 1 ].from ) / 2, null ]
                            );
                        }

                    });

                    series.push( item );
                });

                // creamos la grafica
                $( idHTML ).highcharts({

                    chart: {
                        // renderTo: idHTML
                        // width: null
                    },
                    
                    title: {
                        text: 'Programa de Mantenimiento'
                    },

                    subtitle: {
                        text: 'Central eoloeléctrica La Venta'
                    },

                    xAxis: {
                        type: 'datetime'
                    },

                    yAxis: {
                        tickInterval: 1,
                        labels: {
                            formatter: function() {
                                if (tasks[this.value]) {
                                    return tasks[this.value].nombre;
                                }
                            }
                        },
                        startOnTick: false,
                        endOnTick: false,
                        title: {
                            text: 'Aerogeneradores - Tipo Mantenimiento'
                        },
                        minPadding: 0.2,
                        maxPadding: 0.2
                    },

                    legend: {
                        enabled: false
                    },

                    tooltip: {
                        formatter: function() {
                            return '<b>'+ tasks[this.y].nombre + '</b><br/>' +
                                Highcharts.dateFormat('%d %B %Y', this.point.options.from)  +
                                ' - ' + Highcharts.dateFormat('%d %B %Y', this.point.options.to); 
                        }
                    },

                    plotOptions: {
                        line: {
                            lineWidth: 9,
                            marker: {
                                enabled: false
                            },
                            dataLabels: {
                                enabled: true,
                                align: 'left',
                                formatter: function() {
                                    return this.point.options && this.point.options.label;
                                }
                            }
                        },

                        series: {
                            animation: {
                                duration: 3000
                            },
                            turboThreshold: 10000
                        } 
                    },

                    series: series
                });
			} 
			else $(idHTML).html('<h4 text-center>' + $.sigesop.sinRegistros + '</h4>');
        // } catch (e) {
        // 	alert('Es necesario importar la libreria de graficación');
        // } 
	},

	// --------------------------------------------------------------

	documentoOrdenTrabajo: function ( suf )
	{
		var 
			html = 
				// '<div class="row">' +
				// '	<div class="col-md-1"></div>' +
				// '	<div class="col-md-10">' +
				// '		<nav class="navbar navbar-cfe" role="navigation">' +
	  			// '			<div class="container-fluid">' +
				// '				<form class="navbar-form" role="Search">' +
				// '					<select class="form-control"><option value="" >' + $.sigesop.sinRegistros + '</option></select>' +
				// '					<div class="form-group">' +
				// '						<input type="text" class="form-control" placeholder="Filtrar">' +
				// '					</div>' +
				// '					<button id="botonFiltro' + suf + '" type="submit" class="btn btn-default">Filtrar</button>' +				
				// '				</form>' +
				// '			</div>' +
				// '		</nav>' +
				// '	</div>' +
				// '	<div class="col-md-1"></div>' +
				// '</div>' +

				'<form  class="form-horizontal panelLista' + suf + '" role="form" method="post" >'+	
				'	<div class="form-group">'+
				'		<div class="col-sm-1"></div>'+
				'			<ol id="regListaVerificacion' + suf + '" class="col-sm-10 selectable"></ol>'+
				'		<div class="col-sm-1"></div>'+
				'	</div>'+
				'</form>';

		var doc = {
			html: html,
			javascript: function ()
			{
				$( doc.IDS.botonFiltro ).on('click', function ( event )
				{
					event.preventDefault();
					alert( 'test' );
				});

				$( doc.IDS.listaRegistro ).selectable({
					stop: function() 
					{
						// var nombreLista = $( '#' + statusNombreLista ).empty(),
						// 	numeroLista = $( '#' + statusNumeroLista ).empty();

						window.sesion.indexOrdenTrabajoPorUsuario = null;

						$( ".ui-selected", this ).each( function() 
						{
							var index = window.sesion.indexOrdenTrabajoPorUsuario = $( doc.IDS.listaRegistro + ' li' ).index( this );
							// nombreLista.text( " Nombre del lista de verificacion: " + window.sesion.matrizListaVerificacion[ index ]['descripcion_lista_verificacion']);
							// numeroLista.text( "Numero de lista de verificacion: " + window.sesion.matrizListaVerificacion[ index ]['id_lista_verificacion']);	
						});
					}
				});
				
			    $( doc.IDS.listaRegistro ).contextMenu({
			        selector: 'li', 
			        items: {
			        	insertar:
			        	{
			        		name: 'Insertar datos', 
			        		icon: 'paste',
			        		callback: function ( key, option )
			        		{
			        			var index = $( this ).index();
			        			typeof doc.callback.menuInsertar === 'function' ? 
			        				doc.callback.menuInsertar( index, window.sesion.matrizOrdenTrabajoPorUsuario, key, option ) : null;
			        		}
			        	},
			        	pdf: 
			        	{ 
			        		name: 'Generar PDF', 
			        		icon: 'add',
			        		callback: function ( key, option )
			        		{
			        			var index = $( this ).index();
			        			typeof doc.callback.menuPDF === 'function' ? 
			        				doc.callback.menuPDF( index, window.sesion.matrizOrdenTrabajoPorUsuario, key, option ) : null;
			        		}
			        	 },
			            editar: 
			            {
			            	name: 'Editar', 
			            	icon: 'edit',
			        		callback: function ( key, option )
			        		{
			        			var index = $( this ).index();
			        			typeof doc.callback.menuEditar === 'function' ? 
			        				doc.callback.menuEditar( index, window.sesion.matrizOrdenTrabajoPorUsuario, key, option ) : null;
			        		}
			            },
			            eliminar: 
			            {
			            	name: 'Eliminar', 
			            	icon: 'delete',
			        		callback: function ( key, option )
			        		{
			        			var index = $( this ).index();
			        			typeof doc.callback.menuEliminar === 'function' ? 
			        				doc.callback.menuEliminar( index, window.sesion.matrizOrdenTrabajoPorUsuario, key, option ) : null;
			        		}
			            }
			        }
			    });	
			},
			IDS: {
				panelLista: '.panelLista' + suf,
				listaRegistro: '#regListaVerificacion' + suf,
				botonFiltro: '#botonFiltro' + suf
			},

			callback:
			{
				menuInsertar: null,
				menuPDF: null,
				menuEditar: null,
				menuEliminar: null
			}
		}

		return doc;
	},

	generarPDFordenTrabajo: function ( data )
	{
		if ( jQuery.isEmptyObject( data ) ) 
		{
			$.sigesop.msgBlockUI( 'Se requiere de los datos de la orden de trabajo', 'error' );
			return null;
		}

		var href = '',
			div = '';

		for( var i = 0, lon = obj.length; i < lon; i++ )
		{
			href += '<li><a href="#' + obj[ i ].id_lista_verificacion + suf + '" role="tab" data-toggle="tab">' + 
					obj[ i ].descripcion_lista_verificacion + ' &nbsp; <span class="glyphicon glyphicon-remove"></span> </a></li>';

			var tabla = '';			
			for( var j = 0, y = obj[ i ].actividades.length; j < y; j++ )
			{
                tabla += '<tr>' +     
                		'<td class="active col-lg-2 col-sm-2">' + obj[ i ].actividades[ j ].actividad_verificar + '</td>' +
                        '<td class="success col-lg-2 col-sm-2"><center>' + obj[ i ].actividades[ j ].parametro_aceptacion + '</center></td>';

                tabla += '<td class="success col-lg-2 col-sm-2"><center>';
                for( var k = 0, z = obj[ i ].actividades[ j ].lectura_actual.length; k < z; k++  )
                {
                	var secuencia = 'actual_' + obj[ i ].actividades[ j ].id_actividad_verificar + obj[ i ].actividades[ j ].lectura_actual[ k ].secuencia_datos,
                		tipoDato = obj[ i ].actividades[ j ].lectura_actual[ k ].tipo_dato;
                	
                	tabla += obj[ i ].actividades[ j ].lectura_actual[ k ].parametro;
    				
    				if( tipoDato == 'Binario' ) tabla += '&nbsp; <input type="radio" name="' + secuencia + '" id="' + secuencia + '_si" value="si"> &nbsp; SI &nbsp;<input type="radio" name="' + secuencia + '" id="' + secuencia + '_no" value="no"> &nbsp; NO<br>';
    				else if( tipoDato == 'Datos' ) tabla += '&nbsp; <input type="text" id="' + secuencia + '_dato" > &nbsp;' +
    					obj[ i ].actividades[ j ].lectura_actual[ k ].unidad_medida + '<br>';                	
                }

                tabla += '</center></td><td class="success col-lg-2 col-sm-2"><center>';

                for( var k = 0, z = obj[ i ].actividades[ j ].lectura_posterior.length; k < z; k++  )
                {
                	var secuencia = 'post_' + obj[ i ].actividades[ j ].id_actividad_verificar + obj[ i ].actividades[ j ].lectura_actual[ k ].secuencia_datos,
                		tipoDato = obj[ i ].actividades[ j ].lectura_posterior[ k ].tipo_dato;

                	tabla += obj[ i ].actividades[ j ].lectura_posterior[ k ].parametro;
    				
    				if( tipoDato == 'Binario' ) tabla += '&nbsp; <input type="radio" name="' + secuencia + '" id="' + secuencia + '_si" value="si"> &nbsp; SI &nbsp; <input type="radio" name="' + secuencia + '" id="' + secuencia + '_no" value="no"> &nbsp; NO <br>';
    				else if( tipoDato == 'Datos' ) tabla += '&nbsp; <input type="text" id="' + secuencia + '_dato" > &nbsp;' +
    					obj[ i ].actividades[ j ].lectura_posterior[ k ].unidad_medida + '<br>';
                }
                tabla += '</center></td><td class="info col-lg-2 col-sm-2"><textarea  id="' + secuencia + '_obser" class="form-control"></textarea></td></tr>';
			}			

			div += '<div class="tab-pane fade" id="' + obj[ i ].id_lista_verificacion + suf + '"><br>' +
		            '<div class="panel panel-default table-responsive">' +
		            '    <div class="panel-heading">' + obj[ i ].descripcion_lista_verificacion + '</div>' +
		            '    <table class="table table-bordered">' +
		            '        <thead><tr><th>Actividad</th><th> Parámetro de aceptación</th><th>Lectura Actual</th>' +
		            '               <th>Lectura Posterior</th><th>Observaciones</th></tr>' +
		            '        </thead>' +
		            '        <tbody>' + tabla + '</tbody>' +
		            '    </table>' +
		            '</div></div>';
		}

		var html = '' +
		'<ul id="myTab" class="nav nav-tabs" role="tablist">' +
		'	<li class="dropdown">' +
		'		<a class="dropdown-toggle" data-toggle="dropdown" href="#"> Captura Listas de verificación</a>' +
		'		<ul class="dropdown-menu" role="menu" aria-labelledby="myTabDrop1">' + href + '</ul>' +
		'	</li>' +
		'</ul>' +

		'<div class="tab-content">' + div + '</div>';

		var doc = {
			html: html,
			javascript: function ()
			{
				$( '#myTab a' ).on( 'show.bs.tab', function (e)
				{
					e.target // activated tab
					e.relatedTarget // previous tab
					// alert( 'antes de entrar' )
				});

				// $( '#myTab a' ).click( function (e)
				// {
				// 	e.preventDefault()
					// $(this).tab('show')
				// })
			}
		}

		return doc;
	},
	
	// -------------------------------------------------------------

	documentoInsertarDatos: function ( opt )
	{
		/*
		 * name
		 * suf
		 * arr
		 * sortable
		 * activate
		 * campo
		 * dataValue
		 */

		opt.suf = opt.suf || '';
		opt.name = opt.name + opt.suf || 'accordion' + opt.suf;
		opt.activate = opt.activate || function () {};

		var 
			update_accordion = function ( arr )
			{
				if ( jQuery.isEmptyObject( arr ) )
				{
					console.log( '[arr] es nulo' );
					return null;
				}

				var 
					html = '<div id="' + opt.name + '">';

				// if ( opt.sortable ) // con el efecto sortable
				// {
				// 	for( var i = 0, lon = arr.length; i < lon; i++ )
				// 	{
				// 		html +=
				// 		'<div class="group">' +
				// 		'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
				// 		'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' +
				// 		'</div>';		
				// 	}
				// }

				// else
				// {
				// 	for( var i = 0, lon = arr.length; i < lon; i++ )
				// 	{
				// 		html +=
				// 		'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
				// 		'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' ;
				// 	}
				// }

				for( var i = 0, lon = arr.length; i < lon; i++ )
				{
					html +=
					'	<h3>' + arr[ i ][ opt.campo ] + '</h3>' +
					'	<div data-value="' + arr[ i ][ opt.dataValue ] + '"></div>' ;
				}				
				
				html += '</div>'

				return html;
			},

			doc = {
				html: update_accordion( opt.arr ),

				javascript: function ()
				{
					// if ( opt.sortable )
					// {
					// 	$( '#' + opt.name ).accordion({
					// 		collapsible: true,
					// 		active: false,
					// 		heightStyle: 'content',
					// 		header: "> div > h3",
					// 		icons: {
					// 			header: "ui-icon-circle-arrow-e",
					// 			activeHeader: "ui-icon-circle-arrow-s"
					// 		},
					// 		beforeActivate: function( event, ui ) 
					// 		{
					// 			_ui = ui;
					// 			// _event = event;

					// 			var 
					// 				id = ui.newPanel[0].id,
					// 				value = document.getElementById( ui.newPanel[0].id ).getAttribute('data-value');

					// 			typeof opt.activate === 'function' ? 
					// 				opt.activate( id, value ): null;
					// 		}
					// 	})
					// 	.sortable({
					// 		axis: "y",
					// 		handle: "h3",
					// 		stop: function( event, ui ) 
					// 		{
					// 			// IE doesn't register the blur when sorting
					// 			// so trigger focusout handlers to remove .ui-state-focus
					// 			ui.item.children( "h3" ).triggerHandler( "focusout" );
					// 			// Refresh accordion to handle new order
					// 			$( this ).accordion( "refresh" );
					// 		}
					// 	});
					// }

					// else
					// {
					// 	$( '#' + opt.name ).accordion({
					// 		collapsible: true,
					// 		active: false,
					// 		heightStyle: 'content',
					// 		icons: {
					// 			header: "ui-icon-circle-arrow-e",
					// 			activeHeader: "ui-icon-circle-arrow-s"
					// 		},
					// 		beforeActivate: function( event, ui ) 
					// 		{
					// 			_ui = ui;
					// 			// _event = event;

					// 			var 
					// 				id = ui.newPanel[0].id,
					// 				value = document.getElementById( ui.newPanel[0].id ).getAttribute('data-value');

					// 			typeof opt.activate === 'function' ? 
					// 				opt.activate( id, value ): null;
					// 		}
					// 	});
					// }

					$( '#' + opt.name ).accordion({
						collapsible: true,
						active: false,
						heightStyle: 'content',
						icons: {
							header: "ui-icon-circle-arrow-e",
							activeHeader: "ui-icon-circle-arrow-s"
						},
						beforeActivate: function( event, ui ) 
						{
							// _ui = ui;
							// _event = event;

							var 
								id = ui.newPanel[0].id,
								value = document.getElementById( ui.newPanel[0].id ).getAttribute('data-value');

							typeof opt.activate === 'function' ? 
								opt.activate( id, value ): null;
						}
					});
				},

				activate: opt.activate,

				datos: {

				},

				IDS: {
					id_accordion: '#' + opt.name
				}
			};

		return doc;
	},

	/*
	 * crea el documento de una lisa de verificacion en especifico
	 * @param {Object} obj - objeto de datos de la lista de verificacion
	 * @param {String} suf - sufijo HTML para los id's del documento
	 */ 
	documentoActividades: function ( opt )
	{
		/*
		 * obj
		 * suf
		 * submit
		 * clean
		 */ 

		if ( jQuery.isEmptyObject( opt.obj.actividades ) )
		{
			$.sigesop.msgBlockUI( 'Se requiere de los datos de la orden de trabajo', 'error' );
			return null;
		}

		opt.submit = opt.submit || function ( doc, btn ){};
		opt.clean = opt.clean || function ( doc, btn ) {};
		
		// ---------- 

		var 
			obj = opt.obj,
			
			suf = opt.suf || '',

			struct_tabla = function ( obj )
			{
				var 
					datos = [],
					tabla = '';

			    // ---------- iteracion del objeto para estructurar las propiedades

				for( var j = 0, y = obj.actividades.length; j < y; j++ )
				{
					// ---------- creacion del objeto datosAct

					var 
						datosAct = {
							id_actividad: obj.actividades[ j ].id_actividad_verificar,
							observaciones: {
								valor: null,
								idHTML: '#obser_' + obj.id_orden_trabajo + '_' + j + suf,
								regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,5000}$/i,
								popover: {
									content: 'Caracteres no válidos ( 1-5000 caracteres )',
									placement: 'top'
								}
							},

							validacion: [],
							
							datos_lectura_actual: [],
							datos_lectura_posterior: []
						};

					// ----------

		            tabla += '<tr>' +     
		            		'<td class="active col-lg-2 col-sm-2 text-justify">' + obj.actividades[ j ].actividad_verificar + '</td>';

		            // ---------- iteracion de parametros

		            tabla += '<td class="success col-lg-2 col-sm-2 text-justify">';

		            for( var k = 0, z = obj.actividades[ j ].parametro_actividad.length; k < z; k++  )
		            {
		            	var mtz = obj.actividades[ j ].parametro_actividad[ k ];

		            	// ---------- vista html

		            	// ---------- datos para validacion

		            	var datoValidar = {
		            		tipo_dato: mtz.tipo_dato
		            	}

		            	switch ( mtz.tipo_dato )
		            	{
		            		case 'BINARIO':
		            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '<br>';
		            			datoValidar.dato = mtz.dato;
		            			break;

		            		case 'TEXTO':
		            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '<br>';
		            			datoValidar.dato = mtz.dato;
		            			break;

		            		case 'COMPARACION':
		            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '&nbsp;' + mtz.unidad_medida + '<br>';
		            			datoValidar.dato = mtz.dato;
		            			break;

		            		case 'RANGO' :
								var values = $.sigesop.splitParametros( mtz.dato, ',' );

		            			tabla += mtz.parametro + '&nbsp;' + values[0] + 
		            				'&nbsp; <span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] + 
		            				'&nbsp;' + mtz.unidad_medida + '<br>';


		            			datoValidar.dato_inf = values[0];
		            			datoValidar.dato_sup = values[1];
		            			break;

		            		case 'TOLERANCIA' :
            					var 
		            				values = $.sigesop.splitParametros( mtz.dato, ',' ),
		            				target = parseInt( values[ 0 ] ),
		            				tol = parseInt( values[ 1 ] );

		            			tabla += mtz.parametro + '&nbsp;' + values[0] + 
		            				'&nbsp; <span class="glyphicon glyphicon-plus"></span><span class="glyphicon glyphicon-minus"></span> &nbsp;' + values[1] + 
		            				'&nbsp;' + mtz.unidad_medida + '<br>';


		            			datoValidar.dato_inf = target - tol;
		            			datoValidar.dato_sup = target + tol;
		            			break;

		            		default:
		            			tabla += mtz.parametro + '&nbsp;' + mtz.dato + '&nbsp;' + mtz.unidad_medida + '<br>';
		            			break;
		            	}

		            	datosAct.validacion.push( datoValidar );
		            }

		            tabla += '</td>';

					// ---------- iteracion de lectura actual

		            tabla += '<td class="success col-lg-2 col-sm-2">';

		            for( var k = 0, z = obj.actividades[ j ].lectura_actual.length; k < z; k++  )
		            {
		            	var mtz = obj.actividades[ j ].lectura_actual[ k ],
		            		secuencia = 'actual_' + obj.id_orden_trabajo + '_' + obj.actividades[ j ].id_actividad_verificar + 
		            			mtz.secuencia_datos + suf,
		            		tipoDato = mtz.tipo_dato;

		            	// ---------- creacion del objeto datosLecAct

		            	var datosLecAct = {
		            		id_lectura: mtz.id,            		
		            		dato: { 
		            			valor: null,
		            			name: secuencia
		            		},
		            		tipo_dato: mtz.tipo_dato
		            	}

		            	// ----------
		            	
		            	tabla += mtz.parametro;
						
						if( tipoDato == 'Binario' ) 
						{
							tabla += 	'<br> &nbsp; <input type="radio" id="' + secuencia + '_si" name="' + secuencia + 
										'"  value="si"> &nbsp; SI &nbsp;<input type="radio" name="' + 
										secuencia + '" id="' + secuencia + '_no" value="no"> &nbsp; NO <br><br>';

							datosLecAct.dato.idHTML = '#' + secuencia + '_si';
							datosLecAct.dato.popover = {
								content: 'valor no válido, seleccione una opcion',
								placement: 'top'
							}
						}
						else if( tipoDato == 'Datos' ) 
						{
							tabla += 	'&nbsp; <input type="text" id="' + secuencia + '" > &nbsp;' +
										mtz.unidad_medida + '<br><br>';

							datosLecAct.dato.idHTML = '#' + secuencia;
							datosLecAct.dato.regexp = /^[\-+]?([0-9](\.[0-9])?){1,50}$/i;
							datosLecAct.dato.popover = {
								content: 'valor no válido, (1-50 caracteres numericos)',
								placement: 'top'
							}
						}

						datosAct.datos_lectura_actual.push( datosLecAct );
		            }

		            tabla += '</td>';

		            // ---------- iteracion de lectura posterior

		            tabla += '<td class="success col-lg-2 col-sm-2">';

		            for( var k = 0, z = obj.actividades[ j ].lectura_posterior.length; k < z; k++  )
		            {
		            	var mtz = obj.actividades[ j ].lectura_posterior[ k ],
		            		secuencia = 'post_' + obj.id_orden_trabajo + '_' + obj.actividades[ j ].id_actividad_verificar + 
		            			obj.actividades[ j ].lectura_actual[ k ].secuencia_datos + suf,
		            		tipoDato = mtz.tipo_dato;

		            	// ---------- creacion del objeto datosLecPost

		            	var datosLecPost = {
		            		id_lectura: mtz.id,            		
		            		dato: { 
		            			valor: null,
		            			name: secuencia
		            		},
		            		tipo_dato: mtz.tipo_dato
		            	}

		            	// ----------

		            	tabla += mtz.parametro;
						
						if( tipoDato == 'Binario' ) 
						{ 
							tabla += 	
								'<br> &nbsp; <input type="radio" name="' + secuencia + '" value="si" id="' + secuencia + 
								'_si" > &nbsp; SI &nbsp; <input type="radio" name="' + secuencia + '"  value="no"> &nbsp; NO <br><br>';
							
							datosLecPost.dato.idHTML = '#' + secuencia + '_si';
							datosLecPost.dato.popover = {
								content: 'valor no válido, seleccione una opcion',
								placement: 'top'
							}
						}
						else if( tipoDato == 'Datos' ) 
						{ 
							tabla += 	
								'&nbsp; <input type="text" id="' + secuencia + '" > &nbsp;' +
								mtz.unidad_medida + '<br><br>';
							
							datosLecPost.dato.idHTML = '#' + secuencia;
							datosLecPost.dato.regexp = /^[\-+]?([0-9](\.[0-9])?){1,50}$/i;
							datosLecPost.dato.popover = {
								content: 'valor no válido, (1-50 caracteres numericos)',
								placement: 'top'
							}
						}

						datosAct.datos_lectura_posterior.push( datosLecPost );
		            }

		            datos.push( datosAct );

		            // ---------- campo observaciones

		            tabla += '</td><td class="info col-lg-2 col-sm-2"><textarea  id="obser_' + obj.id_orden_trabajo + '_' + j + suf
		            	+ '" class="form-control eventoCambioMayuscula"></textarea></td></tr>';
				}

	            return {
	            	tabla: tabla,
	            	actividades: datos
	            };
			};

		object = struct_tabla( obj );		

		var
			html = 
				'<form class="form-horizontal" role="form">' +				
				'	<div class="form-group">' +
	            '		<div class="panel panel-default table-responsive">' +
	            '	   	 	<div class="panel-heading">LISTA DE VERIFICACION</div>' +
	            '	    	<table class="table table-bordered">' +
	            '	   	    	<thead><tr><th><center>Actividad</center></th><th><center>Parámetro de aceptación</center></th><th><center>Lectura Actual</center></th>' +
	            '	       	    	<th><center>Lectura Posterior</center></th><th><center>Observaciones</center></th></tr>' +
	            '	       		</thead>' +
	            '	       		<tbody>' + object.tabla + '</tbody>' +
	        	'    		</table>' +		            
	            '		</div>' +         
	            '	</div>' +

				'	<div class="form-group">' +					
				'		<p class="col-sm-9">' +
				'			<button id="btnGuardarLista_' + obj.id_orden_trabajo + suf + '" class="btn btn-success" data-loading-text="Enviando..." type="submit"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
				'			<button id="btnLimpiarLista_' + obj.id_orden_trabajo + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'		</p>' +
				'	</div>' +	            
	            '</form><br>',
	     
	    	doc = {
		    	html: html,

		    	javascript: function ()
		    	{
		    		$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

		    		$( doc.IDS.botonGuardar ).on('click', function ( event )
		    		{
		    			event.preventDefault();
		    			opt.submit( doc, doc.IDS.botonGuardar );
		    		});

		    		$( doc.IDS.botonLimpiar ).on('click', function ( event )
		    		{
		    			event.preventDefault();
		    			opt.clean( doc, doc.IDS.botonLimpiar );
		    		});
		    	},

		    	datos: {
					// id_lista_verificacion: obj.id_lista_verificacion,
					id_orden_trabajo: obj.id_orden_trabajo,
					// id_orden_lista: obj.id_orden_lista,
					// observaciones: {
					// 	valor: null,
					// 	idHTML: ,
					// 	idValidacion, 
					// }
					datos_actividad: object.actividades
				},

				IDS:
				{
					botonGuardar: '#btnGuardarLista_' + obj.id_orden_trabajo + suf,
					botonLimpiar: '#btnLimpiarLista_' + obj.id_orden_trabajo + suf
				}
	    	};

	    return doc;
	},

	// --------------------------------------------------------------

	/*
	 * valida los datos de las listas de verificacion de las ordenes de trabajo
	 * @param {Object | Array} obj - objeto de datos o arreglo de objeto de datos.
	 * 		Cada objeto es una lista de verificacion de una orden de trabajo
	 */  
	validacion: function ( obj )
	{
		if ( jQuery.isEmptyObject( obj ) ) 
		{
			console.log( 'Matriz vacia, imposible continuar con validacion' );
			return false;
		}

		var 
			mtzValidacion = [],

			datosActividad = function ( mtz )
			{
				if ( jQuery.isArray( mtz ) )
				{
					var mtzValidacion = [];

					// ---------- recorrido de las actividades de la lista de verificacion

					// for ( var i = 0, lon = mtz.length; i < lon; i++ )
					// {
					// 	var 
					// 		prop = Object.getOwnPropertyNames( mtz[ i ] ),
					// 		obs = prop.indexOf( 'observaciones' ),
					// 		actual = prop.indexOf( 'datos_lectura_actual' ),
					// 		post = prop.indexOf( 'datos_lectura_posterior' ),
					// 		val = prop.indexOf( 'validacion' );

					// 	// ---------- iniciamos la verificacion de los datos de la lista de verificacion

					// 	if ( ( obs && actual && post && val ) != -1 ) // existen los 4 campos
					// 		mtzValidacion.push( comparacion( mtz[ i ].datos_lectura_actual, mtz[ i ].datos_lectura_posterior, mtz[ i ].validacion, mtz[ i ].observaciones ) );
					// 	else 
					// 	{
					// 		console.log( 'Propiedades incompletas para iniciar validacion de Actividades' );
					// 		return false
					// 	}
					// }

					for ( var i = 0, lon = mtz.length; i < lon; i++ )
					{
						var 
							obs = $.sigesop.array_key_exists( 'observaciones', mtz[ i ] ),
							actual = $.sigesop.array_key_exists( 'datos_lectura_actual', mtz[ i ] ),
							post = $.sigesop.array_key_exists( 'datos_lectura_posterior', mtz[ i ] ),
							val = $.sigesop.array_key_exists( 'validacion', mtz[ i ] );

						// ---------- iniciamos la verificacion de los datos de la lista de verificacion

						if ( obs && actual && post && val ) // existen los 4 campos
							mtzValidacion.push( comparacion( mtz[ i ].datos_lectura_actual, mtz[ i ].datos_lectura_posterior, mtz[ i ].validacion, mtz[ i ].observaciones ) );
						else 
						{
							console.log( 'Propiedades incompletas para iniciar validacion de Actividades' );
							return false
						}
					}

					// ---------- verificar objetos no validos
					
					for( var i = 0, lon = mtzValidacion.length; i < lon; i++ ) 
						if( mtzValidacion[ i ] === false ) return false;

					return true;
				}

				else
				{
					return false
					console.log( 'Elemento propiedad: datos_actividad no es un arreglo' );
				}
			},

			comparacion = function ( arr_actual, arr_post, arr_validar, obser )
			{
				// b = arr_actual;
				// c = arr_post;
				// d = arr_validar;

				// ---------- verificando arreglos vacios

				if ( jQuery.isEmptyObject( arr_actual ) && jQuery.isEmptyObject( arr_post ) &&
					 jQuery.isEmptyObject( arr_validar ) )
				{
					console.log( 'arreglos [ arr_actual || arr_post || arr_validar ] vacios' )
					return false;
				}

				var flag = true;
					
				if ( obser.valor )
					flag = $.sigesop.validacion( [ obser ], { tipoValidacion: 'error' } );
				else $.sigesop.vaciarPopover( [ obser ] );	

				// ---------- inicio de validaciones

				if ( flag )
				{
					// ---------- verificamos longitudes de los arreglos para definir acciones

					var 
						lon_actual = arr_actual.length,	
						lon_post = arr_post.length,
						lon_validar = arr_validar.length;

					if ( lon_validar == 1 ) // contiene un paramentro, hay que validar el unico con todas las lecturas
						return __verificaParametro( arr_validar[ 0 ], arr_actual, arr_post );

					else if ( lon_validar > 1 ) // contiene varios parametros, hay que validar lecturas por filas correspondientes
					{
						if ( ( lon_actual && lon_post ) == lon_validar )
							return __verificaMtzParametros( arr_validar, arr_actual, arr_post );
						else 
						{
							console.log( 'arr_actual: ' + lon_actual + ' arr_post: ' + lon_post + ' arr_avalidar: ' + lon_validar );
							console.log( 'longitud de [ arr_actual || arr_post || arr_avalidar ] no son iguales' );
							return false;
						}
					}

					else
					{
						return false;
						console.log( 'longitud de [ arr_validar ] no valida o es nula' )
					}
				}

				else return false;				
			},

			__verificaParametro = function ( obj_validar, arr_actual, arr_post )
			{
				var mtzValidacion = [];

				switch ( obj_validar.tipo_dato )
				{
					case 'TEXTO': // sólo verifica que los campos no sean nulos y con el formato regexp
						for ( var i = 0, lon = arr_actual.length; i < lon; i++ )
						{
							mtzValidacion.push( $.sigesop.validacion( [ arr_actual[ i ].dato ], { tipoValidacion: 'error' } ) );
							mtzValidacion.push( $.sigesop.validacion( [ arr_post[ i ].dato ], { tipoValidacion: 'error' } ) );
						}						
						break;

					case 'COMPARACION':
						for ( var i = 0, lon = arr_actual.length; i < lon; i++ )
						{
							// ---------- validar nulo y formato regexp
							
							var a = $.sigesop.validacion( [ arr_actual[ i ].dato ], { tipoValidacion: 'error' } ),
								p = $.sigesop.validacion( [ arr_post[ i ].dato ], { tipoValidacion: 'error' } );

							if ( a && p )
							{
								arr_actual[ i ].dato.valor == obj_validar.dato ?								
									arr_actual[ i ].dato.prioridad = null :
									arr_actual[ i ].dato.prioridad = 'U';

								arr_post[ i ].dato.valor == obj_validar.dato ?
									arr_post[ i ].dato.prioridad = null :
									arr_post[ i ].dato.prioridad = 'U';

								mtzValidacion.push( true );							 
							}
							else mtzValidacion.push( false );
						}
						break;

					case 'RANGO':
						return 'RANGO';
						break;

					case 'TOLERANCIA':
						return 'TOLERANCIA';
						break;

					default:
						console.log( 'Tipo de dato: [' + obj_validar.tipo_dato + '] no esta definido' );
						return false;
						break;
				}

				return $.sigesop.mtzValidacion( mtzValidacion );
			},

			__verificaMtzParametros = function ( arr_validar, arr_actual, arr_post )
			{
				var mtzValidacion = [],
					i = 0,
					lon = arr_validar.length;

				for( i; i < lon; i++ )
					mtzValidacion.push( __verificaParametro( arr_validar[ i ], [ arr_actual[ i ] ], [ arr_post[ i ] ] ) );

				return $.sigesop.mtzValidacion( mtzValidacion );
			};			

		// ---------- iniciamos recorriendo cada una de las listas de verificacion existentes que deseamos validar

		if ( jQuery.isPlainObject( obj ) )
		{
			// var prop = Object.getOwnPropertyNames( obj );

			// if ( prop.indexOf( 'datos_actividad' ) != -1 ) 
			// {
			// 	mtzValidacion.push( datosActividad ( obj.datos_actividad ) );
			// }

			if ( $.sigesop.array_key_exists( 'datos_actividad', obj ) ) 
			{
				mtzValidacion.push( datosActividad ( obj.datos_actividad ) );
			}

			else
			{
				mtzValidacion.push( false );
				console.log( 'Elemento sin propiedad: datos_actividad' );
			}
		}

		else if ( jQuery.isArray( obj ) )
		{
			// ----------- recorremos y validamos los elementos del arreglo recursivamente

			for( i = 0, lon = obj.length ; i < lon; i++ )
				mtzValidacion.push( this.validacion( obj[ i ] ) );
		}

		else
		{ 
			console.log( 'El elemento ingresado no es una lista de datos válida para listas de verificacion' );
			return false;
		}

		return $.sigesop.mtzValidacion( mtzValidacion );
	}
};