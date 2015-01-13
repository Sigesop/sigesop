$.sigesop.licencias = {
	document: function ( obj, suf )
	{
		obj = obj || {

			};

		suf = suf || '';

		// ----------

		var 
			html =
				'<form class="form-horizontal" role="form">'+
				'	<div id="formAnioLicencia' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Año de licencia: </label>'+
				'		<div class="col-sm-7">'+
				'			<input id="anioLicencia' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese año de licencia (4 caracteres exactos, signos aceptados [0-9])" value="">'+
				'		</div>'+
				'	</div>'+

				'	<div class="form-group">'+
				'		<div class="col-sm-3 control-label"></div>'+
				'		<p class="col-sm-7">'+
				'			<button id="btnGuardarLicencia' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
				'			<button id="botonLimpiarLicencia' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
				'		</p>'+
				'	</div>'+
				'</form>',

			doc = {
				html: html,

				javascript: function () {
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
				},

				datos: {
					anio_licencia: {
						valor: null,
						idValidacion: '#formAnioLicencia' + suf,
						idHTML: '#anioLicencia' + suf,
						regexp: /^[0-9]{4}\b$/,
						popover: {
							content: 'Ingrese año de licencia (4 caracteres exactos, signos aceptados [0-9])',
							placement: 'top'
						}
					}
				},

				IDS: {
					botonGuardar: '#btnGuardarLicencia' + suf,
					botonLimpiar: '#botonLimpiarLicencia' + suf
				}
			}

		return doc;
	}
};