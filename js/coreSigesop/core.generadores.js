$.sigesop.generadores = {
	documentoGeneradores: function( obj, arr_unidad, arr_licencia, suf ) 
	{
		suf = suf || '';
		obj = obj || {
			numero_unidad: '',
			numero_aero: '',
			capacidad_efectiva_aero: '',
			fecha_operacion: '',
			estado_licencia: '',
		}

		jQuery.isEmptyObject( arr_unidad ) ?
			console.log( 'matriz: [arr_unidad] es nula' ): null;

		jQuery.isEmptyObject( arr_licencia ) ?
			console.log( 'matriz: [arr_licencia] es nula' ): null;

		var 
			html =
				'<form class="form-horizontal" role="form" method="post">'+
				'	<div id="formNumeroUnidad' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Número de unidad:</label>'+
				'		<div class="col-sm-7">'+
				'			<select id="numeroUnidad' + suf + '" class="form-control input-md" placeholder>' + 
							$.sigesop.insertaCombo( arr_unidad, false, 'numero_unidad' ) + '</select>'+
				'		</div>'+
				'	</div>'+

				'	<div id="formNumeroGenerador' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Numero aerogenerador:</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="numeroGenerador' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese nombre del generador ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])" value="'+obj.numero_aero+'">'+
				'		</div>'+
				'	</div>'+

				'	<div id="formCapacidadEfectiva' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Capacidad efectiva</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="capacidadEfectiva' + suf + '" class="form-control input-md eventoCambioEsNumero" placeholder="Defina capacidad efectiva del Aerogenerador (Números enteros y decimales)" value="'+obj.capacidad_efectiva_aero+'">'+
				'		</div>'+
				'	</div>'+

				'	<div id="formEstadoUnidad' + suf + '" class="form-group">'+
				'		<label class="col-sm-3 control-label">Estado de la unidad:</label>'+
				'		<div class="col-sm-7">'+
				'			<select id="estadoUnidad' + suf + '" class="form-control input-md">' + 
							$.sigesop.insertaCombo( arr_licencia, false ) + '</select>'+
				'		</div>'+
				'	</div>'+

				'	<div class="form-group">' +
				'		<div class="col-sm-3 control-label"></div>' +
				'		<p class="col-sm-7">' +
				'			<button id="btnNuevoGenerador' + suf + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +							
				'			<button id="btnLimpiarGenerador' + suf + '" class="btn btn-success "><span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>'
				'		</p>' +
				'	</div>' +
				'</form>',

			doc = {
				html: html,
				javascript: function () 
				{
					$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
					$.sigesop.eventoCambioEsNumero( '.eventoCambioEsNumero' );

					// --------------- seleccionamos el valor por defecto la unidad en el combo
					
					$( doc.datos.numero_unidad.idHTML ).val( obj.numero_unidad );

					// --------------- seleccionamos el valor por defecto del Estado licencia en el combo
					
					$( doc.datos.estado_licencia.idHTML ).val( obj.estado_licencia );
				},
				datos: 
				{
					numero_unidad: 
					{
						valor: null,
						idValidacion: '#formNumeroUnidad' + suf,
						idHTML: '#numeroUnidad' + suf,
						popover: {
							content: 'Seleccione un número de unidad válido',
							placement: 'top'
						}
					},
					numero_aero_update: { valor: null }, // variable para hacer el update
					numero_aero: 
					{
						valor: null,
						idValidacion: '#formNumeroGenerador' + suf,
						idHTML: '#numeroGenerador' + suf,
						regexp: /^[-_.\w\s]{1,4}$/i,
						popover: {
							content: 'Ingrese nombre del generador ( 1-4 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])',
							placement: 'left'
						}
					},
					capacidad_efectiva_aero: 
					{
						valor: null,
						idValidacion: '#formCapacidadEfectiva' + suf,
						idHTML: '#capacidadEfectiva' + suf,
						regexp: /^[\-+]?[0-9]*\.?[0-9]+\b$/,
						popover: {
							content: 'Defina capacidad efectiva del Aerogenerador (Números enteros y decimales)',
							placement: 'top'
						}
					},
					estado_licencia: 
					{
						valor: null,
						idValidacion: '#formEstadoUnidad' + suf,
						idHTML: '#estadoUnidad' + suf,
						popover: {
							content: 'Seleccione el estado del aerogenerador',
							placement: 'left'
						}
					}					
				},

				IDS: 
				{
					botonGuardar: '#btnNuevoGenerador' + suf,
					botonLimpiar: '#btnLimpiarGenerador' + suf
				}
			};

		return doc;		
	}
}