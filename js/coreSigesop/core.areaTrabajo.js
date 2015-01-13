$.sigesop.areaTrabajo = {
	documentoAreaTrabajo: function ( objetoAreaTrabajo, sufijo ) 
	{
		// ----------------------------- objetoAreaTrabajo por defecto objeto vacio
		
		if ( $.isEmptyObject( objetoAreaTrabajo ) ) 
		{
			var objetoAreaTrabajo = {
				clave_areaTrabajo: '',
				descripcion_areaTrabajo: ''
			}
		}

		// ----------------------------- sufijo por defecto una cadena vacia
		
		$.isEmptyObject(sufijo) ? sufijo = '': null; 			

		// -------------------- ID's de los form para la validacion

		var formClaveAreaTrabajo = 'formClaveAreaTrabajo' + sufijo,
			formDescripcionTrabajo = 'formDescripcionTrabajo' + sufijo;

		// -------------------- ID's de los elementos

		var claveAreaTrabajo = 'claveAreaTrabajo' + sufijo,
			descripcionAreaTrabajo = 'descripcionAreaTrabajo' + sufijo;

		// -------------------- ID de los botones

		var btnGuardarAreaTrabajo = 'btnGuardarAreaTrabajo' + sufijo,
			botonLimpiar = 'btnLimpiarBoton' + sufijo,
			eventoCambioMayuscula = 'eventoCambioMayuscula' + sufijo;	
				
		// -------------------- Estructura HTML del documento

		var html = '' + 
			'<form class="form-horizontal" role="form">'+
			'	<div id="' + formClaveAreaTrabajo + '" class="form-group">'+
			'		<label class="col-sm-2 control-label">Clave del área de trabajo: </label>'+
			'		<div class="col-sm-9">'+
			'			<input id="' + claveAreaTrabajo + '" class="form-control input-md ' + eventoCambioMayuscula + '" placeholder="Ingrese clave del área de trabajo (10 caracteres)" value="' + objetoAreaTrabajo.clave_areaTrabajo + '">'+
			'		</div>'+
			'	</div>'+

			'	<div id="' + formDescripcionTrabajo + '" class="form-group">'+
			'		<label class="col-sm-2 control-label">Descripción:</label>'+
			'		<div class="col-sm-9">'+
			'			<textarea id="' + descripcionAreaTrabajo + '" class="form-control input-md ' + eventoCambioMayuscula + '" placeholder="Descripción del área de trabajo (50 caractéres)">' + objetoAreaTrabajo.descripcion_areaTrabajo + '</textarea>'+
			'		</div>'+
			'	</div>'+

			'	<div class="form-group">'+
			'		<div class="col-sm-2 control-label"></div>'+
			'		<p class="col-sm-9">'+
			'			<button id="' + btnGuardarAreaTrabajo + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>'+
			'			<button id="' + botonLimpiar + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>' +
			'		</p>'+
			'	</div>'+
			'</form>';

		var objetoRetorno = {
			html: html,
			javascript: function () 
			{
				$.sigesop.eventoCambioMayuscula( '.' + eventoCambioMayuscula )
			},
			datos:
			{
				claveAreaTrabajo: 
				{
					valor: null,
					idValidacion: '#' + formClaveAreaTrabajo,
					idHTML: '#' + claveAreaTrabajo,
					regexp: /^[\-\]!"#\/()=?¡*[_{+}¿'|\w\s]{1,10}$/i,
					popover: {
						content: 'Ingrese clave de area de trabajo ( 1-10 caracteres [A-Z] [0-9] sin caracteres especiales, ni acentos)',
						placement: 'top'
					}
				},
				claveAreaTrabajoUpdate: { valor: null },
				descripcionAreaTrabajo: 
				{
					valor: null,
					idValidacion: '#' + formDescripcionTrabajo,
					idHTML: '#' + descripcionAreaTrabajo,
					regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,50}$/i,
					popover: {
						content: 'Ingrese clave de area de trabajo ( 1-50 caracteres)',
						placement: 'bottom'
					}
				},					
			},
			IDS: {
				botonGuardar: '#' + btnGuardarAreaTrabajo, // id HTML del boton guardar
				botonLimpiar: '#' + botonLimpiar
			}
		}

		return objetoRetorno;
	}

	// documentoAreaTrabajoRegistro: function ( sufijo )
	// {
	// 	// ----------------------------- asignamos los ID's de los elementos
		
	// 	var statusNombreArea = 'statusNombreArea' + sufijo,
	// 		statusDescripcionArea = 'statusDescripcionArea' + sufijo;

	// 	// ----------------------------- asignamos los ID's de los botones
		
	// 	var botonEditar = 'botonEditar' + sufijo,
	// 		botonEliminar = 'botonEliminar' + sufijo,
	// 		panelLista = 'panelLista' + sufijo,
	// 		listaAreaTrabajo = 'listaAreaTrabajo' + sufijo;

	// 	// ----------------------------- creamos la estructura HTML

	// 	var html = '' +
	// 		'<form  class="form-horizontal ' + panelLista + '" role="form" method="post" >	'+
	// 		'	<div class="form-group">'+
	// 		'		<div class="col-sm-1 col-lg-1"></div>'+
	// 		'		<div class="col-sm-7 col-lg-8">'+
	// 		'			<div class=" well well-sm">' +
	// 		'				<p id="' + statusNombreArea + '"></p>'+
	// 		'				<p id="' + statusDescripcionArea + '"></p>'+
	// 		'			</div>' +
	// 		'		</div>'+
	// 		'		 <div class="col-sm-3 col-lg-2">'+
	// 		'			<p class="pull-right">'+
 //        	'        		<button id="' + botonEditar + '" type="submit" class="btn btn-success" ><span class="glyphicon glyphicon-list"></span> Editar</button>'+
 //        	'				<button id="' + botonEliminar + '" class="btn btn-danger"> <span class="glyphicon glyphicon-trash"></span> Eliminar</button>'+
 //        	'			</p>'+
 //        	'		 </div>'+
	// 		'		<div class="col-sm-1"></div>'+
	// 		'	</div>'+				

	// 		'	<div class="form-group">'+
	// 		'		<div class="col-sm-1"></div>'+
	// 		'			<ol id="' + listaAreaTrabajo + '" class="col-sm-10 selectable"></ol>'+
	// 		'		<div class="col-sm-1"></div>'+
	// 		'	</div>'+
	// 		'</form>';
	
	// 	var objetoRetorno = {
	// 		html: html,
	// 		javascript: function ()
	// 		{
	// 			$( '#' + listaAreaTrabajo ).selectable({
	// 				stop: function() 
	// 				{
	// 					var nombreArea = $( '#' + statusNombreArea ).empty(),
	// 						descripcionArea = $( '#' + statusDescripcionArea ).empty();

	// 					window.sesion.indexAreaTrabajo = null;

	// 					$( ".ui-selected", this ).each( function() 
	// 					{
	// 						window.sesion.indexAreaTrabajo = $( '#' + listaAreaTrabajo + ' li' ).index( this );
	// 						nombreArea.text( " Clave área de trabajo: " + window.sesion.matrizAreaTrabajo[ window.sesion.indexAreaTrabajo ]['clave_areaTrabajo']);								
	// 						descripcionArea.text( " Descripción: " + window.sesion.matrizAreaTrabajo[ window.sesion.indexAreaTrabajo ]['descripcion_areaTrabajo']);	
	// 					});
	// 				}
	// 			});
	// 		},
	// 		IDS: {
	// 			botonEditar: '#' + botonEditar,
	// 			botonEliminar: '#' + botonEliminar,
	// 			panelLista: '.' + panelLista,
	// 			listaRegistro: '#' + listaAreaTrabajo,
	// 			status: [
	// 				'#' + statusNombreArea,
	// 				'#' + statusDescripcionArea
	// 			]
	// 		}
	// 	}
	// 	return objetoRetorno;
	// }
}
