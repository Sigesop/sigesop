sigesop.unidadMedida = {
	documentoCatalogoUnidadMedida: function ( obj, suf )
	{
		suf = suf || '';
		
		obj = obj || {
				unidad_medida: '',
				descripcion_unidad_medida: ''
			}					

		var 
			html = 
				'<form class="form-horizontal" role="form">' +
					'<div id="formUnidadMedida' + suf + '" class="form-group">' +
						'<label class="col-sm-3 control-label">Unidad de Medida:</label>' +
						'<div class="col-sm-7">' +
							'<input id="unidadMedida' + suf + '" class="form-control input-md evtCambioMay" placeholder="Ingrese descripcion de la actividad" value="' + obj.unidad_medida + '" > ' +
						'</div>' +
					'</div>' +

					'<div id="formDescUnidadMedida' + suf + '" class="form-group">' +
						'<label class="col-sm-3 control-label">Descripcion Unidad de Medida:</label>' +
						'<div class="col-sm-7">' +
							'<textarea id="descUnidadMedida' + suf + '" class="form-control input-md evtCambioMay" placeholder="Ingrese descripcion de la actividad">' + obj.descripcion_unidad_medida + '</textarea>' +
						'</div>' +
					'</div>' +

					'<div class="form-group">' +
						'<div class="col-sm-3 control-label"></div>' +
						'<p class="col-sm-7">' +
							'<button id="btnGuardarUnidadMedida' + suf + '" type="submit" class="btn btn-success"> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
							'<button id="btnLimpiarUnidadMedida' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
						'</p>' +
					'</div>' +
				'</form>',

			doc = {
				html: html,
				javascript: function ()
				{
					sigesop.eventoCambioMayuscula( '.evtCambioMay' );
				},
				datos: {
					unidad_medida: {
						valor: null,
						idHTML: '#unidadMedida' + suf,
						idValidacion: '#formUnidadMedida' + suf,
						regexp:  /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]{1,20}$/i,
						popover: {
							content: 'Ingrese Nombre de la Unidad de Medida ( 1-20 caracteres [A-Z] [0-9] sin caracteres especiales, ni acentos)',
							placement: 'top'
						}
					},
					unidad_medida_update: { valor: null },
					descripcion_unidad_medida: {
						valor: null,
						idHTML: '#descUnidadMedida' + suf,
						idValidacion: '#formDescUnidadMedida' + suf,
						regexp:  /^[\-\]!"#$%&\/()=?¡*°[_:;,.{´+}¿'|^~\w\s]{1,50}$/i,
						popover: {
							content: 'Ingrese descripcion de la Unidad de Medida ( 1-50 caracteres [A-Z] [0-9] sin caracteres especiales, ni acentos)',
							placement: 'left'
						}
					}
				},
				IDS: {
					botonGuardar: '#btnGuardarUnidadMedida' + suf,
					botonLimpiar: '#btnLimpiarUnidadMedida' + suf
				}
			};

		return doc;
	},

	documentoCatalogoUnidadMedidaRegistro: function ( sufijo )
	{
		// ----------------------------- asignamos los ID's de los elementos
		
		var statusUnidadMedida = 'statusUnidadMedida' + sufijo,
			statusDescUnidadMedida = 'statusDescUnidadMedida' + sufijo;

		// ----------------------------- asignamos los ID's de los botones
		
		var botonEditar = 'botonEditar' + sufijo,
			botonEliminar = 'botonEliminar' + sufijo,
			panelLista = 'panelLista' + sufijo,
			listaUnidadMedida = 'listaUnidadMedida' + sufijo;

		// ----------------------------- creamos la estructura HTML

		var html = '' +
			'<form  class="form-horizontal ' + panelLista + '" role="form" method="post" >	'+
			'	<div class="form-group">'+
			'		<div class="col-sm-1 col-lg-1"></div>'+
			'		<div class="col-sm-7 col-lg-8">'+
			'			<div class=" well well-sm">' +
			'				<p id="' + statusUnidadMedida + '"></p>'+
			'				<p id="' + statusDescUnidadMedida + '"></p>'+
			'			</div>' +
			'		</div>'+
			'		 <div class="col-sm-3 col-lg-2">'+
			'			<p class="pull-right">'+
        	'        		<button id="' + botonEditar + '" type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-list"></span> Editar</button>'+
        	'				<button id="' + botonEliminar + '" class="btn btn-danger"> <span class="glyphicon glyphicon-trash"></span> Eliminar</button>'+
        	'			</p>'+
        	'		 </div>'+
			'		<div class="col-sm-1"></div>'+
			'	</div>'+				

			'	<div class="form-group">'+
			'		<div class="col-sm-1"></div>'+
			'			<ol id="' + listaUnidadMedida + '" class="col-sm-10 selectable"></ol>'+
			'		<div class="col-sm-1"></div>'+
			'	</div>'+
			'</form>';
	
		var objetoRetorno = {
			html: html,
			javascript: function ()
			{
				$( '#' + listaUnidadMedida ).selectable({
					stop: function() 
					{
						var unidadMedida = $( '#' + statusUnidadMedida ).empty(),
							descUnidadMedida = $( '#' + statusDescUnidadMedida ).empty();

						window.sesion.indexUnidadMedida = null;

						$( ".ui-selected", this ).each(function() 
						{
							window.sesion.indexUnidadMedida = $( '#' + listaUnidadMedida + ' li' ).index( this );
							unidadMedida.text( " Nombre del rol: " + window.sesion.matrizUnidadMedida[ window.sesion.indexUnidadMedida ]['unidad_medida']);								
							descUnidadMedida.text( "Descripción del rol: " + window.sesion.matrizUnidadMedida[ window.sesion.indexUnidadMedida ]['descripcion_unidad_medida']);	
						});
					}
				});
			},
			IDS: {
				botonEditar: '#' + botonEditar,
				botonEliminar: '#' + botonEliminar,
				panelLista: '.' + panelLista,
				listaRegistro: '#' + listaUnidadMedida,
				status: [
					'#' + statusUnidadMedida,
					'#' + statusDescUnidadMedida
				]
			}
		}

		return objetoRetorno;
	}		
}