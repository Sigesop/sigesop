$.sigesop.roles = {
	/**
	 * crea la estructura HTML y javascript correspondiente para la edicion de 
	 * los roles de usuario.
	 * @param {Object} objetoRol - objeto con datos de los roles existentes
	 * @param {Object} matrizAreaAcceso - objeto con datos de las areas de acceso existentes
	 * @param {Object} matrizPermisoAcceso - objeto con datos de los permisos de acceso existentes
	 * @param {String} sufijoIDhtml - sufijo que se agrega al id de los elementos para no repetir ID's
	 * @returns {Object[html, javascript, envioDatos]} retorna codigo html, codigo javascript para la
	 * 		nueva structura html y la estructura de datos del formulario
	 */
	documentoCatalagoRoles: function ( objetoRol, matrizAreaAcceso, matrizPermisoAcceso, sufijoIDhtml ) 
	{
		// ---------- objetoRol por defecto objeto vacio
		
		if ( $.isEmptyObject( objetoRol ) ) 
		{
			var objetoRol = {
				clave_rol: '',
				descripcion_areaTrabajo: '',
				areaAcceso: [],
				permisoAcceso: []
			}
		}			

		// ---------- sufijoIDhtml por defecto una cadena vacia
		
		$.isEmptyObject( sufijoIDhtml ) ? sufijoIDhtml = '' : null; 			

		// ---------- ID's de los form para la validacion

		var formNombreRol = 'formNombreRol' + sufijoIDhtml,
			formDescripcionRol = 'formDescripcionRol' + sufijoIDhtml;

		// ---------- ID's de los elementos

		var nombreRol = 'nombreRol' + sufijoIDhtml,
			areasAcceso = 'areasAcceso' + sufijoIDhtml,
			permisoAcceso = 'permisoAcceso' + sufijoIDhtml,
			descripcionRol = 'descripcionRol' + sufijoIDhtml;

		// ---------- ID de los botones

		var btnNuevoPermiso = 'btnNuevoPermiso' + sufijoIDhtml,
			botonLimpiar = 'btnLimpiar' + sufijoIDhtml,
			eventoCambioMayuscula = 'eventoCambioMayuscula' + sufijoIDhtml;

		// ---------- generamos el html de las areas de acceso y los permisos de acceso

		var htmlAreasAcceso = this.documentoAreaAcceso( matrizAreaAcceso, sufijoIDhtml ),
			htmlPermisoAcceso = this.documentoPermisoAcceso( matrizPermisoAcceso, sufijoIDhtml );

		// ---------- unimos todo el html en uno mismo

		var html = '' +						
			'<form class="form-horizontal" role="form">' +
			'	<div id="' + formNombreRol + '" class="form-group">' +
			'		<label class="col-sm-2 col-md-2 control-label">Nombre del Rol:</label>' +
			'		<div class="col-sm-9 col-md-9">' +
			'			<input id="' + nombreRol + '" class="form-control input-md ' + eventoCambioMayuscula + '" placeholder="Ingrese tipo de usuario por ejemplo (admin, operador, etc.)" value="' + objetoRol.clave_rol + '">' +
			'		</div>' +
			'	</div>' +

			'	<div class="form-group">' +
			'		<label class="col-sm-2 col-md-2 control-label">Áreas de Acceso:</label>' +
			'		<div class="col-sm-9 col-md-9" id="' + areasAcceso + '">' + htmlAreasAcceso.html + '</div>' +
			'	</div>' +

			'	<div class="form-group">' +
			'		<label class="col-sm-2 col-md-2 control-label">Permisos:</label>' +
			'		<div class="col-sm-9 col-md-9" id="' + permisoAcceso + '">' + htmlPermisoAcceso.html + '</div>' +
			'	</div>' +			

			'	<div id="' + formDescripcionRol + '" class="form-group">' +
			'		<label class="col-sm-2 col-md-2 control-label">Descripción Rol:</label>' +
			'		<div class="col-sm-9 col-md-9">' +
			'			<textarea id="' + descripcionRol +'" class="form-control ' + eventoCambioMayuscula + '" rows="3" placeholder="Descripción área de trabajo" >' + objetoRol.descripcion_areaTrabajo + '</textarea>' +
			'		</div>' +
			'	</div>' +

			'	<div class="form-group">' +
			'		<div class="col-sm-2 col-md-2 control-label"></div>' +
			'		<p class="col-sm-9 col-md-9">' +
			'			<button id="' + btnNuevoPermiso + '" type="submit" class="btn btn-success" data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>' +
			'			<button id="' + botonLimpiar + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>'
			'		</p>' +
			'	</div>' +
			'</form>';

		var objetoRetorno = {
			html: html,
			javascript: function () 
			{
				$.sigesop.eventoCambioMayuscula( '.' + eventoCambioMayuscula );
				
				// ----------------- rellenamos los check de areas de acceso y permisos de acuedo al rol

				if ( !jQuery.isEmptyObject( htmlAreasAcceso.html ) )
				{
					jQuery.each( htmlAreasAcceso.matrizID, function( index, id ) 
					{						
						var valor = $( id ).val();

						!jQuery.isEmptyObject( objetoRol.areaAcceso ) && objetoRol.areaAcceso.indexOf( valor ) != -1 ? 
							$( id ).prop('checked', true) : null;
					});
				}

				if ( !jQuery.isEmptyObject( htmlPermisoAcceso.html ) )
				{
					jQuery.each( htmlPermisoAcceso.matrizID, function( index, id ) 
					{
						var valor = $( id ).val();

						!jQuery.isEmptyObject( objetoRol.permisoAcceso ) && objetoRol.permisoAcceso.indexOf( valor ) != -1 ?
							$( id ).prop('checked', true) : null;
					});

				// -----------------

					htmlPermisoAcceso.javascript();						
				}
			},

			datos: 
			{
				nombreRol: 
				{
					valor: null,
					idValidacion: '#' + formNombreRol,
					idHTML: '#' + nombreRol,
					regexp:  /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\s]{1,25}$/i,
					popover: {
						content: 'Ingrese Nombre del Rol de Usuario ( 1-25 caracteres [A-Z] [0-9] sin caracteres especiales, ni acentos)',
						placement: 'top'
					}
				},
				nombreRolUpdate: { valor: null },
				descripcionRol: 
				{ 
					valor: null,
					idValidacion: '#' + formDescripcionRol,
					idHTML: '#' + descripcionRol,
					regexp: /^[\-\]!"#$%&\/()=?¡*[_:;,.{´+}¿'|^~\w\sáéíóúñ]{1,5000}$/i,
					popover: {
						content: 'Ingrese Descipción del Rol de Usuario ( 1-5000 caracteres )',
						placement: 'bottom'
					}
				},					
				matrizAreaAcceso: [],
				matrizPermisoAcceso: []
			},

			IDS:
			{
				botonGuardar: '#' + btnNuevoPermiso,
				botonLimpiar: '#' + botonLimpiar,
				divAreaAcceso: '#' + areasAcceso, // no es necesario para los datos hacia el servidor
				divPermisoAcceso: '#' + permisoAcceso, // no es necesario para los datos hacia el servidor
				matrizIDareaAcceso: htmlAreasAcceso.matrizID,
				matrizIDpermisoAcceso: htmlPermisoAcceso.matrizID					
			},
		}

		return objetoRetorno; 
	},

	// documentoCatalagoRolesRegistro: function ( sufijo )
	// {
	// 	// ----------------------------- asignamos los ID's de los elementos
		
	// 	var statusNombreRol = 'statusNombreRol' + sufijo,
	// 		statusDescripcionRol = 'statusDescripcionRol' + sufijo;

	// 	// ----------------------------- asignamos los ID's de los botones
		
	// 	var botonEditar = 'botonEditar' + sufijo,
	// 		botonEliminar = 'botonEliminar' + sufijo,
	// 		panelLista = 'panelLista' + sufijo,
	// 		listaRoles = 'listaRoles' + sufijo;

	// 	// ----------------------------- creamos la estructura HTML

	// 	var html = '' +
	// 		'<form  class="form-horizontal ' + panelLista + '" role="form" method="post" >	'+
	// 		'	<div class="form-group">'+
	// 		'		<div class="col-sm-1 col-lg-1"></div>'+
	// 		'		<div class="col-sm-7 col-lg-8">'+
	// 		'			<div class=" well well-sm">' +
	// 		'				<p id="' + statusNombreRol + '"></p>'+
	// 		'				<p id="' + statusDescripcionRol + '"></p>'+
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
	// 		'			<ol id="' + listaRoles + '" class="col-sm-10 selectable"></ol>'+
	// 		'		<div class="col-sm-1"></div>'+
	// 		'	</div>'+
	// 		'</form>';
	
	// 	var obj = {
	// 		html: html,
	// 		javascript: function ()
	// 		{
	// 			$( obj.IDS.listaRegistro ).selectable({
	// 				stop: function() 
	// 				{
	// 					var nombreRol = $( '#' + statusNombreRol ).empty(),
	// 						descripcionRol = $( '#' + statusDescripcionRol ).empty();

	// 					window.sesion.indexTipoRol = null;

	// 					$( ".ui-selected", this ).each(function() 
	// 					{
	// 						window.sesion.indexTipoRol = $( '#' + listaRoles + ' li' ).index( this );
	// 						nombreRol.text( " Nombre del rol: " + window.sesion.matrizTipoRol[ window.sesion.indexTipoRol ]['clave_rol']);								
	// 						descripcionRol.text( "Descripción del rol: " + window.sesion.matrizTipoRol[ window.sesion.indexTipoRol ]['descripcion_areaTrabajo']);	
	// 					});
	// 				}
	// 			});

	// 		    $( obj.IDS.listaRegistro ).contextMenu({
	// 		        selector: 'li', 
	// 		        items: {
	// 		            editar: 
	// 		            {
	// 		            	name: 'Editar', 
	// 		            	icon: 'edit',
	// 		        		callback: function ( key, option )
	// 		        		{
	// 		        			var index = $( this ).index();
	// 		        			typeof obj.callback.menuEditar === 'function' ? 
	// 		        				obj.callback.menuEditar( index, key, option ) : null;			        			
	// 		        		}
	// 		            },
	// 		            eliminar: 
	// 		            {
	// 		            	name: 'Eliminar', 
	// 		            	icon: 'delete',
	// 		        		callback: function ( key, option )
	// 		        		{
	// 		        			var index = $( this ).index();
	// 		        			typeof obj.callback.menuEliminar === 'function' ? 
	// 		        				obj.callback.menuEliminar( index, key, option ) : null;			        			
	// 		        		}
	// 		            }
	// 		        }
	// 		    });
	// 		},
	// 		IDS: {
	// 			botonEditar: '#' + botonEditar,
	// 			botonEliminar: '#' + botonEliminar,
	// 			panelLista: '.' + panelLista,
	// 			listaRegistro: '#' + listaRoles,
	// 			status: [
	// 				'#' + statusNombreRol,
	// 				'#' + statusDescripcionRol,
	// 			]
	// 		},
	// 		callback:
	// 		{
	// 			menuPDF: null,
	// 			menuEditar: null,
	// 			menuEliminar: null
	// 		}
	// 	}
	// 	return obj;
	// },

	/**
	 * crea la estructura HTML y javascript correspondiente de las areas de acceso en forma de check list
	 * @param {object} matrizAreaAcceso - objeto con datos de las areas de acceso existentes
	 * @param {String} sufijoIDhtml - sufijo que se agrega al id de los check para no repetir ID's
	 */ 		
	documentoAreaAcceso: function ( matrizAreaAcceso, sufijoIDhtml ) 
	{
		// sufijoIDhtml por defecto una cadena vacia
		$.isEmptyObject( sufijoIDhtml ) ? sufijoIDhtml = '' : null;

		if( !jQuery.isEmptyObject( matrizAreaAcceso ) )
		{				
			var arregloIDs = [],
				htmlAreasAcceso = '<div class="form-group">';
			
			$.each( matrizAreaAcceso, function ( index, val ) 
			{
				var idAreaAcceso = val.idAcceso + sufijoIDhtml;
				arregloIDs.push( '#' + idAreaAcceso );

				htmlAreasAcceso += 
				'<div class="col-sm-6 col-md-6">'+
				    '<div class="input-group checkbox-inline">'+
				      '<span class="input-group-addon">'+
				        '<input id="' + idAreaAcceso + '" value="' + val.paginaAcceso + '" type="checkbox">'+ val.nombrePagina +
				      '</span>'+
				    '</div>'+
			  	'</div>';
			});

			htmlAreasAcceso += '</div>';

			var objetoRetorno = {
				html: htmlAreasAcceso,
				matrizID: arregloIDs
			}

			return objetoRetorno;
		} 
		else
		{
			var objetoRetorno = {
				html: '',
				javascript: function() {}
			}

			return  objetoRetorno;
		}
	},
	/**
	 * crea la estructura HTML y javascript correspondiente de los permisos de acceso en forma de check list
	 * @param {object} matrizPermisoAcceso - objeto con datos de los permisos de acceso existentes
	 * @param {String} sufijoIDhtml - sufijo que se agrega al id de los check para no repetir ID's
	 */ 		
	documentoPermisoAcceso: function ( matrizPermisoAcceso, sufijoIDhtml ) 
	{
		// sufijoIDhtml por defecto una cadena vacia
		$.isEmptyObject( sufijoIDhtml ) ? sufijoIDhtml = '': null;

		if( !jQuery.isEmptyObject( matrizPermisoAcceso ) )
		{				
			var arregloIDs = [],
				htmlPermisoAcceso = '<div class="form-group">';

			$.each( matrizPermisoAcceso, function ( index, val ) 
			{
				var claseEvento = '',
					idPermisoAcceso = val.idPermiso.split(' ').join('_') + sufijoIDhtml;

				arregloIDs.push( '#' + idPermisoAcceso );
				val.idPermiso != 'all' ? claseEvento = 'checkNormal' : claseEvento = 'checkSuperUsuario';

				 htmlPermisoAcceso += 
				 '<div class="col-sm-6 col-md-6">' +
					'<div class="input-group checkbox-inline">' +
						'<span class="input-group-addon">' +
							'<input id="' + idPermisoAcceso + '" value="' + val.idPermiso + '" type="checkbox" class="' + claseEvento + '">' + val.descripcion +
						'</span>' +
					'</div>' +
				'</div>';
			});

			htmlPermisoAcceso += '</div>';

			var objetoRetorno = {
				html: htmlPermisoAcceso,
				javascript: function () 
				{
					$( '.checkNormal' ).change( function ( event )
					{
						$( this ).prop( 'checked' ) ?
							$( '.checkSuperUsuario' ).prop( 'checked', false ) : null;						
					});

					$( '.checkSuperUsuario' ).change( function ( event )
					{
						$( this ).prop( 'checked' ) ?
							$( '.checkNormal' ).prop( 'checked', false ) : null;
					});						
				},
				matrizID: arregloIDs
			}
			return objetoRetorno;
		}
		else
		{
			var objetoRetorno = {
				html: '',
				javascript: function() {}
			}

			return  objetoRetorno;
		}
	}
}