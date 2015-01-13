$.sigesop.sistemaGenerador = {
	documentoSistemaGenerador: function ( obj, suf ) 
	{
		suf = suf || '';
		obj = obj || {
			id_sistema_aero: '',
			nombre_sistema_aero: ''
		};

		var 			
			html = 
				'<form class="form-horizontal" role="form" method="post">' +
				'	<div id="formNombreSistema_' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">Nombre Sistema:</label>' +
				'		<div class="col-sm-7">' +
				'			<input id="nombreSistema_' + suf + '" type="text" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese nombre del sistema" value="'+obj.nombre_sistema_aero+'">' +
				'		</div>' +
				'	</div>' +

				'	<div id="formIdSistema_' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">ID del Sistema:</label>' +
				'		<div class="col-sm-7">' +
				'			<input id="idSistema_' + suf + '" type="text" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese ID del sistema (2 digitos)" value="'+obj.id_sistema_aero+'">' +
				'		</div>' +
				'	</div>' +

				'	<div class="form-group">' +
				'		<div class="col-md-3"></div>' +
				'		<div class="col-md-7">' +
				'			<p>' +
				'				<button id="btnNuevoSistema_' + suf + '" class="btn btn-success" data-loading-text="Enviando..." ><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
				'				<button id="btnlimpiarSistema_' + suf + '" class="btn btn-success"><span class=" glyphicon glyphicon-repeat"></span> Limpiar</button>' +
				'			</p>' +
				'		</div>' +
				'	</div>' +
				'</form>',

			doc =
			{
				html: html,

				javascript: function ()
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' )
				},

				datos:
				{
					idSistema: {
						valor: null,
						idHTML: '#idSistema_' + suf,
						idValidacion: '#formIdSistema_' + suf,
						regexp:  /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]{1,2}$/i,
						popover: {
							content: 'Ingrese ID del Sistema ( 1-2 caracteres [A-Z] [0-9] sin simbolos, caracteres especiales o acentos)',
							placement: 'top'
						}
					},	
					nombreSistema: {
						valor: null,
						idHTML: '#nombreSistema_' + suf,
						idValidacion: '#formNombreSistema_' + suf,
						regexp:  /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]{1,50}$/i,
						popover: {
							content: 'Ingrese Nombre del Sistema ( 1-50 caracteres [A-Z] [0-9] sin caracteres especiales o acentos)',
							placement: 'bottom'
						}
					},
					idSistemaUpdate: { valor: null }
				},

				IDS:
				{
					botonGuardar: '#btnNuevoSistema_' + suf,
					botonLimpiar: '#btnlimpiarSistema_' + suf
				}
			};

		return doc;
	}
}