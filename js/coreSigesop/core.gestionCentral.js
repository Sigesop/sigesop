$.sigesop.gestionCentral = {
	documentoCatalogoGestionCentral: function ( obj, suf, esEdicion )
	{	

		obj = obj || {
				clave_20: '',
				clave_sap: '',
				centro_costo: '',
				nombre_central: '',
				direccion: '',
				telefono: '',
				cp: '',
				superintendente: '',
				capacidad_instalada: ''
			};

		suf = suf || '_';

		esEdicion ? estadoElemento = 'disabled="disabled"' : estadoElemento = '';

		var html = '' +
			'<form class="form-horizontal" role="form" method="post">'+
			'	<div id="formClaveCentral' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Clave:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="claveCentral' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese clave de la central ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])" ' + estadoElemento + ' value="' + obj.clave_20 + '" >'+
			'		</div>'+
			'	</div>'+

			'	<div id="formClaveSAP' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Clave SAP:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="claveSAP' + suf + '" class="form-control input-md eventoCambioMayuscula" placeholder="Ingrese clave SAP ( 4 caracteres exactos, signos aceptados [A-Z] [0-9])" ' + estadoElemento + ' value="' + obj.clave_sap + '" >'+
			'		</div>'+
			'	</div>'+

			'	<div id="formCentroCosto' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Centro Costo:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="centroCosto' + suf + '" class="form-control input-md eventoCambioMayuscula" ' + estadoElemento + ' placeholder="Ingrese centro costo ( 1-6 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])" value="' + obj.centro_costo + '">'+
			'		</div>'+
			'	</div>'+

			'	<div id="formNombreCentral' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Nombre de la Central:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="nombreCentral' + suf + '" class="form-control input-md eventoCambioMayuscula" ' + estadoElemento + ' placeholder="Nombre de la central" value="' + obj.nombre_central + '" >'+
			'		</div>'+
			'	</div>'+

			'	<div id="formDireccion' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Dirección de la Central:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="direccion' + suf + '" class="form-control input-md eventoCambioMayuscula" ' + estadoElemento + ' placeholder="Dirección de la central" value="' + obj.direccion + '">'+
			'		</div>'+
			'	</div>'+

			'	<div id="formTelefono' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Teléfono de la Central:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="telefono' + suf + '" class="form-control input-md" ' + estadoElemento + ' placeholder="Teléfono de la central" value="' + obj.telefono + '" >'+
			'		</div>'+
			'	</div>'+

			'	<div id="formCodigoPostal' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Código Postal de la Central:</label>'+
			'		<div class="col-sm-7">'+
			'			<input id="codigoPostal' + suf + '" class="form-control input-md" ' + estadoElemento + ' placeholder="Código Postal de la central" value="' + obj.cp + '" >'+
			'		</div>'+
			'	</div>'+

			'	<div id="formSuperintendente' + suf + '" class="form-group">'+
			'		<label class="col-sm-3 control-label">Superintendente de la Central</label>'+
			'		<div class="col-sm-4">'+
			'			<input id="superintendente' + suf + '" ' + estadoElemento + ' class="form-control input-md" disabled="disabled" value="' + obj.superintendente + '" >'+
			'		</div>'+
			'		<div class="col-sm-4">'+
			'			<p>'+
			'				<button id="btnSuperintendente_' + suf + '" class="btn btn-primary" ' + estadoElemento + '> <span class="glyphicon glyphicon-user"></span> Seleccione superintendente</button>'+
			'			</p>'+
			'		</div>'+
			'	</div>';

			if ( esEdicion )
			{
				html +=
				'	<div class="form-group">'+
				'		<label class="col-sm-3 control-label">Capacidad Instalada de la Central</label>'+
				'		<div class="col-sm-7">'+
				'			<input id="capacidadInstalada' + suf + '"  disabled="disabled" class="form-control input-md" placeholder="Capacidad Instalada de la central" value="' + obj.capacidad_instalada + '" >'+
				'		</div>'+
				'	</div>';
			}

			html +=	
			'	<div class="form-group">'+
			'		<div class="col-sm-3"></div>'+
			'		<div class="col-sm-8">'+
			'			<p>'+
			'				<button id="btnGuardarCentral_' + suf + '" class="btn btn-success " ' + estadoElemento + ' data-loading-text="Enviando..."> <span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button>';
			
			esEdicion ? html += '				<button id="btnEditarCentral_' + suf + '" class="btn btn-danger"><span class="glyphicon glyphicon-list"></span> Editar</button>' :
				html += '				<button id="btnLimpiar' + suf + '" class="btn btn-success"> <span class=" glyphicon glyphicon-repeat"></span> Limpiar Campos</button>';

			html +=
			'			</p>'+
			'		</div>'+
			'		<div class="col-sm-1"></div>'+
			'	</div>'+
			'</form>';

		var doc = {
			html: html,

			javascript: function ()
			{
				$.sigesop.eventoCambioMayuscula( '.eventoCambioMayuscula' );
				
				$( doc.IDS.botonEditar ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					var win = $.sigesop.ventanaEmergente({
						idDiv: 'confirmarSolicitud' + suf,
						titulo: 'Autorización requerida',
						clickAceptar: function( event ) 
						{
							event.preventDefault();
							$( win.idDiv ).modal( 'hide' );
							
							// -------------------- habilitamos las cajas de texto

							var arr = [
								doc.datos.claveCentral,
								doc.datos.claveSAP,
								doc.datos.centroCosto,
								doc.datos.nombreCentral,
								doc.datos.direccion,
								doc.datos.telefono,
								doc.datos.codigoPostal,
								doc.datos.superintendente
							];

							$.sigesop.habilitarElementos( arr, false );					

							// -------------------- habilitamos los botones
							
							$( doc.IDS.botonGuardar ).prop( 'disabled',false );
							$( doc.IDS.botonSuperintendente ).prop( 'disabled', false );
							$( doc.IDS.botonEditar ).prop( 'disabled', true );

							// -------------------- guardamos la clave original para tener una referencia
							
							doc.datos.claveCentralUpdate.valor = $( doc.datos.claveCentral.idHTML ).val();
						},
						showBsModal: function () 
						{								
							$( '#' + this.idBody ).html( '<div class="alert alert-danger text-center"><h4>¿Está seguro de editar datos de la central?</h4></div>' );
						}
					});	
				});

				$( doc.IDS.botonSuperintendente ).on('click', function ( event ) 
				{
					event.preventDefault();
					var
						docT = $.sigesop.tablaSeleccion({
								color_select: 'success',
								head: 'RPE, USUARIO, NOMBRE, APELLIDOS, AREA DE TRABAJO, ROL DE USUARIO',
								campo: 'RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol',						
							}),

						clickAceptar = function( event ) 
						{
							// ---------- Guardamos el id del sistema y ponenos el nombre del sistema en la caja
														
							if ( !jQuery.isEmptyObject( docT.matrizInput ) )
							{
								var index = $.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) ? // impedir que no sea seleccionado alguno
									$.sigesop.getDataRadio( docT.matrizInput[ 0 ] ) : -1;

								if ( index >= 0 ) 
								{
									doc.datos.superintendente.valor = window.sesion.matrizUsuario[ index ]['RDE_trabajador'];

									var full_name = window.sesion.matrizUsuario[ index ]['nombre_trabajador'] + ' ' + window.sesion.matrizUsuario[ index ]['apellidos_trabajador'];
									$( doc.datos.superintendente.idHTML ).val( full_name );
									$( win.idDiv ).modal( 'hide' );
								}

								else $.sigesop.msgBlockUI( 'Trabajador no seleccionado', 'error', 'msgBlock', '#seleccionTrabajador_modal' );
							}

							else console.log( '[docT.matrizInput] es nula' );			
						},

						showBsModal = function () 
						{
							document.getElementById( this.idBody ).innerHTML = docT.html;					

							if( !jQuery.isEmptyObject( window.sesion.matrizUsuario ) )
								docT.update_table( window.sesion.matrizUsuario );

							else 
							{
								$.sigesop.solicitarDatosSistema({
									clase: 'ajaxUsuarios',
									solicitud: 'obtenerUsuarios',
									respuesta: function ( data ) 
									{
										window.sesion.matrizUsuario = data;
										docT.update_table( data );
									}
								});
							}
						},

						win = $.sigesop.ventanaEmergente({
							idDiv: 'seleccionTrabajador',
							titulo: 'Selección de superintendente',
							clickAceptar: clickAceptar,
							showBsModal: showBsModal
						});
				});

				$( doc.IDS.botonLimpiar ).on('click', function ( event ) 
				{
					event.preventDefault();
					$.sigesop.vaciarCampos( doc.datos );
				});
			},

			datos:
			{
				claveCentralUpdate: { valor: null },
				claveCentral:
				{
					valor: null,
					idHTML: '#claveCentral' + suf,
					idValidacion: '#formClaveCentral' + suf,
					regexp: /^[\dA-Z]{5}$/i,
					popover: {
						content: 'Ingrese clave de la central ( 5 caracteres exactos, signos aceptados [A-Z] [0-9])',
						placement: 'top'
					}
				},
				claveSAP:
				{
					valor: null,
					idHTML: '#claveSAP' + suf,
					idValidacion: '#formClaveSAP' + suf,
					regexp: /^[\dA-Z]{4}$/i,
					popover: {
						content: 'Ingrese clave SAP ( 4 caracteres exactos, signos aceptados [A-Z] [0-9])',
						placement: 'left'
					}
				},
				centroCosto:
				{
					valor: null,
					idHTML: '#centroCosto' + suf,
					idValidacion: '#formCentroCosto' + suf,
					regexp: /^[-_.\w\s]{1,6}$/i,
					popover: {
						content: 'Ingrese centro costo ( 1-6 caracteres, signos aceptados [-_.] [A-Za-z] [0-9])',
						placement: 'top'
					}
				},
				nombreCentral:
				{
					valor: null,
					idHTML: '#nombreCentral' + suf,
					idValidacion: '#formNombreCentral' + suf,
					regexp: /^[,-_.\w\s]{1,100}$/i,
					popover: {
						content: 'Ingrese nombre de la central ( 1-100 caracteres, signos aceptados [,-_.] [A-Za-z] [0-9])',
						placement: 'left'
					}
				},
				direccion:
				{
					valor: null,
					idHTML: '#direccion' + suf,
					idValidacion: '#formDireccion' + suf
				},
				telefono:
				{
					valor: null,
					idHTML: '#telefono' + suf,
					idValidacion: '#formTelefono' + suf
				},
				codigoPostal:
				{
					valor: null,
					idHTML: '#codigoPostal' + suf,
					idValidacion: '#formCodigoPostal' + suf
				},
				superintendente:
				{
					valor: null,
					idHTML: '#superintendente' + suf,
					idValidacion: '#formSuperintendente' + suf
				},
				capacidadInstalada:
				{
					valor: null,
					idHTML: '#capacidadInstalada' + suf,
					idValidacion: null
				}
			},

			IDS:
			{
				botonGuardar: '#btnGuardarCentral_' + suf,
				botonEditar: '#btnEditarCentral_' + suf,
				botonLimpiar: '#btnLimpiar' + suf,
				botonSuperintendente: '#btnSuperintendente_' + suf
			}
		}

		return doc		
	}	
}