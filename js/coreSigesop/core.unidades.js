$.sigesop.unidades = {
	documentoUnidad: function ( obj, suf ) 
	{
		suf = suf || '';

		obj = obj || {
				clave_20: '',
				numero_unidad: ''
			}		

		var 
			html = 
				'<form class="form-horizontal" role="form" method="post">' +
				'	<div id="formClaveCentral' + suf + '" class="form-group">' +
				'		<label class="col-md-3 control-label">Clave Central:</label>' +
				'		<div class="col-md-7">' +
				'			<input id="claveCentralUnidad' + suf +
							'" disabled="disabled" class="form-control input-md" value="' + obj.clave_20 +
							'" placeholder="Clave de la central">' +
				'		</div>' +
				'	</div>' +

				'	<div id="formNumeroUnidad' + suf + '" class="form-group">' +
				'		<label class="col-md-3 control-label">Número Unidad:</label>' +
				'		<div class="col-md-7">' +
				'			<input id="numeroUnidad' + suf +
							'" class="form-control input-md eventoCambioMayuscula" value="' + obj.numero_unidad +
							'" placeholder="Ingrese ID de Unidad ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])">' +
				'		</div>' +
				'	</div>' +
					
				'	<div class="form-group">' +
				'		<div class="col-md-3"></div>' +
				'		<div class="col-md-7">' +
				'			<p>' +
				'				<button id="btnNuevaUnidad' + suf + '" class="btn btn-success" data-loading-text="Enviando..."><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
				'				<button id="limpiarCamposUnidad' + suf + '" class="btn btn-success"><span class=" glyphicon glyphicon-repeat"></span> Limpiar</button>' +
				'			</p>' +
				'		</div>' +
				'	</div>' +
				'</form>',

			obj = {
				html: html,
				
				javascript: function()
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
				},

				datos:
				{
					clave_20: {
						valor: null,
						idHTML: '#claveCentralUnidad' + suf,
						idValidacion: '#formClaveCentral' + suf
					},
					numero_unidad: {
						valor: null,
						idHTML: '#numeroUnidad' + suf,
						idValidacion: '#formNumeroUnidad' + suf,
						regexp: /^[-_.\w\s]{1,4}$/i,
						popover: {
							content: 'Ingrese ID de Unidad ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])',
							placement: 'top'
						}
					},

					numero_unidad_update: { valor: null }	
				},

				IDS:
				{
					botonGuardar: '#btnNuevaUnidad' + suf,
					botonLimpiar: '#limpiarCamposUnidad' + suf
				}
			};

		return obj;
	}
}