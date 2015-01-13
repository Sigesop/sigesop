$.sigesop.equipoGenerador = {
	documentoEquipoGenerador: function ( obj, suf )
	{
		suf = suf || '';
		obj = obj || {
				id_equipo_aero: '',
				nombre_equipo_aero: '',
				id_sistema_aero: '',
				nombre_sistema_aero: ''
			}

		var 
			html =
				'<form class="form-horizontal" role="form" method="post">' +
				'	<div id="formNombreEquipo' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">Nombre Equipo:</label>' +
				'		<div class="col-sm-7">' +
				'			<input id="nombreEquipo' + suf + '" value="' + obj.nombre_equipo_aero + 
							'" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese nombre del componente">' +
				'		</div>' +
				'	</div>' +
				
				'	<div id="formIdEquipo' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">ID del Equipo:</label>' +
				'		<div class="col-sm-7">' +
				'			<input id="idEquipo' + suf + '" value="' + obj.id_equipo_aero + 
							'" type="text" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese ID de equipo ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])" />' +
				'		</div>' +
				'	</div>' +

				'	<div id="formIdSistema' + suf + '" class="form-group">' +
				'		<label class="col-sm-3 control-label">Sistema:</label>' +
				'		<div class="col-sm-5">' +
				'			<input id="idSistema' + suf + '" disabled value="' + obj.nombre_sistema_aero + '" class="form-control input-md eventoCambioMayuscula" placeholder="Seleccione Sistema">' +
				'		</div>' +
				'		<div class="col-sm-2">' +
				'			<button type="button" id="botonSistema' + suf + '" class="btn btn-primary">Seleccione sistema</button>' +
				'		</div>' +
				'	</div>' +

				'	<div class="form-group">' +
				'		<div class="col-sm-3"></div>' +
				'		<div class="col-sm-7">' +
				'			<p>' +
				'				<button id="btnNuevoEquipo' + suf + '" class="btn btn-success" data-loading-text="Enviando..."><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
				'				<button id="btnlimpiarCamposEquipo' + suf + '" class="btn btn-success"><span class=" glyphicon glyphicon-repeat"></span> Limpiar</button>' +
				'			</p>' +
				'		</div>' +
				'	</div>' +
				'</form>',

			doc = {
				html: html,

				javascript: function ()
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
					this.datos.idSistema.valor = obj.id_sistema_aero;
				},

				datos: {
					idEquipo: {
						valor: null,
						idHTML: '#idEquipo' + suf,
						idValidacion: '#formIdEquipo' + suf,
						regexp: /^[-_.\w\s]{1,4}$/i,
						popover: {
							content: 'Ingrese ID de equipo ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])',
							placement: 'top'
						}
					},

					idEquipo_update: { valor: null },

					idSistema: {
						valor: null,
						idHTML: '#idSistema' + suf,
						idValidacion: '#formIdSistema' + suf,
						popover: {
							content: 'Seleccione Sistema',
							placement: 'left'
						}
					},
					nombreEquipo: {
						valor: null,
						idHTML: '#nombreEquipo' + suf,
						idValidacion: '#formNombreEquipo' + suf,
						regexp:  /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]{1,50}$/i,
						popover: {
							content: 'Ingrese Nombre del equipo ( 1-50 caracteres [A-Z] [0-9] sin caracteres especiales, ni acentos)',
							placement: 'top'
						}
					}
				},

				IDS:
				{
					botonGuardar: '#btnNuevoEquipo' + suf,
					botonLimpiar: '#btnlimpiarCamposEquipo' + suf,
					botonSistema: '#botonSistema' + suf
				}
			};		

		return doc;
	}
}