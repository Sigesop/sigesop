$.sigesop.tipoMantenimiento = {
	documentoTipoMantenimiento: function ( obj, suf )
	{
		suf = suf || '';
		obj = obj || {
				id_mantenimiento: '',
				nombre_mantenimiento: '',
				numero_frecuencia: '',
				tipo_frecuencia: ''
			}

		var 
			html =
				'<form class="form-horizontal" role="form">' +
				'	<div id="formNombreMantenimiento' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Nombre Mantenimiento:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="nombreMantenimiento' + suf + '" class="form-control input-md eventoCambioMayuscula" ' +
							'value="' + obj.nombre_mantenimiento + '" placeholder="Ingrese nombre del nuevo tipo de mantenimiento"></input>'+
				'		</div>'+
				'	</div>'+

				'	<div id="formIDMantenimiento' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">ID Mantenimiento:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="IDMantenimiento' + suf + '" class="form-control input-md eventoCambioMayuscula" ' +
							'value ="' + obj.id_mantenimiento + '" placeholder="Ingrese ID del mantenimiento (2 Caracteres)"></input>'+
				'		</div>'+
				'	</div>'+

				'	<div id="FormNumeroFrecuenciaMantenimiento' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">Frecuencia:</label>' +
				'		<div class="col-sm-3">' +
				'			<input id="numeroFrecuenciaMantenimiento' + suf + '" class="form-control input-md" ' +
							'value="' + obj.numero_frecuencia + '" placeholder="Frecuencia"></input>' +
				'		</div>' +
				'		<div class="col-sm-4">' +
				'			<select id="tipoFrecuenciaMantenimiento' + suf + '" class="form-control">' +
				'				<option value="">' + $.sigesop.seleccioneOpcion + '</option>' +
				'				<option value="d">DIAS</option>' +
				'				<option value="M">MESES</option>' +
				'				<option value="y">AÑOS</option>' +
				'			</select>' +
				'		</div>' +
				'	</div>' +

				'	<div class="form-group">'+
				'		<div class="col-sm-3 control-label"></div>'+
				'		<p class="col-sm-7">'+
				'			<button id="btnGuardarTipoMantenimiento' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
				'			<button id="btnLimpiarTipoMantenimiento' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>'+
				'		</p>'+
				'	</div>	'+
				'</form>',

			doc = {
				html: html,

				javascript: function ()
				{
					$( doc.datos.tipo_frecuencia.idHTML ).val( obj.tipo_frecuencia );

					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );

					$( doc.datos.numero_frecuencia.idHTML ).spinner({
						spin: function ( event, ui )
						{
							if ( ui.value <= 0 ) 
							{
								$( this ).spinner( 'value', 1 );
								return false;
							}
						}
					});
				},

				datos: {
					nombre_mantenimiento: {
						valor: null,
						idHTML: '#nombreMantenimiento' + suf,
						idValidacion: '#formNombreMantenimiento' + suf
					},	
					id_mantenimiento: {
						valor: null,
						idHTML: '#IDMantenimiento' + suf,
						idValidacion: '#formIDMantenimiento' + suf
					},
					id_mantenimiento_update: { valor: null },
					numero_frecuencia: {
						valor: null,
						idHTML: '#numeroFrecuenciaMantenimiento' + suf,
						idValidacion: '#FormNumeroFrecuenciaMantenimiento' + suf
					},
					tipo_frecuencia: {
						valor: null,
						idHTML: '#tipoFrecuenciaMantenimiento' + suf,
						idValidacion: '#FormNumeroFrecuenciaMantenimiento' + suf
					}
				},

				IDS: {
					botonGuardar: '#btnGuardarTipoMantenimiento' + suf,
					botonLimpiar: '#btnLimpiarTipoMantenimiento' + suf
				}
			};
		
		return doc;		
	}
};