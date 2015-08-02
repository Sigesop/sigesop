sigesop.unidades = {
	document: function ( opt ) {
		var 

		suf = opt.suf || '',

		html = 
			'<form id="form-unidad-medida-' + suf + '" class="form-horizontal" role="form" method="post">' +
				// '<div class="form-group">' +
				// 	'<label class="col-md-3 control-label">Clave Central:</label>' +
				// 	'<div class="col-md-7">' +
				// 		'<input id="clave-central-unidad-' + suf +
				// 		'" disabled="disabled" class="form-control input-md" value="' +
				// 		'" placeholder="Clave de la central">' +
				// 	'</div>' +
				// '</div>' +

				'<div class="form-group">' +
					'<label class="col-md-3 control-label">Número Unidad:</label>' +
					'<div class="col-md-7">' +
						'<input name="numero_unidad" id="numero-unidad-' + suf +
						'" class="form-control input-md MAYUS" value="' +
						'" placeholder="De 1 – 4 caracteres [- _ .] [0-9] [A-Z]">' +
					'</div>' +
				'</div>' +
				
				'<div class="form-group">' +
					'<div class="col-md-3"></div>' +
					'<div class="col-md-7">' +
						'<p>' +
							'<button id="btn-guardar-unidad-' + suf + '" type="submit" class="btn btn-success"><span class="glyphicon glyphicon-floppy-disk"></span> Guardar</button> ' +
							'<button id="btn-limpiar-unidad-' + suf + '" type="reset" class="btn btn-success"><span class="glyphicon glyphicon-repeat"></span> Limpiar</button>' +
						'</p>' +
					'</div>' +
				'</div>' +
			'</form>',

		limpiarCampos = function () {
			var doc = this;
			$( doc.datos.numero_unidad.idHTML ).val('');
			vaciarDatos.call( doc );
		},

		vaciarDatos = function () {
			var doc = this;
			doc.datos.numero_unidad.valor = null;
			doc.IDS.$form.formValidation( 'resetForm' );
		},

		javascript = function() { 
			var
			doc = this,
			form = doc.IDS.form,
			$numero_unidad = $( doc.datos.numero_unidad.idHTML ),
			$botonLimpiar = $( doc.IDS.botonLimpiar ),
			$form = $( form ).formValidation({
		        icon: {
		            valid: 'glyphicon glyphicon-ok',
		            invalid: 'glyphicon glyphicon-remove',
		            validating: 'glyphicon glyphicon-refresh'
		        },

		        onSuccess: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.success == 'function' ?
		        		opt.success( doc.datos, doc.IDS, limpiarCampos = limpiarCampos.bind( doc ) ) :
		        		console.log( 'success is null' );

		        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
		        },

		        onError: function ( e ) {
		        	e.preventDefault();			        	
		        	typeof opt.error == 'function' ?
		        		opt.error() : console.log( 'error is null' );			        	
		        },

		        fields: {		            
		            numero_unidad: {
		                validators: {
		                    notEmpty: {
		                        message: 'Campo requerido'
		                    },
		                    stringLength: {
		                    	min: 1,
		                    	max: 4,
		                    	message: 'Número de caracteres inválido'
		                    },
		                    regexp: {
		                    	regexp: /^[-_.\w\s]*$/i,
		                    	message: 'Formato inválido'
		                    }
		                }
		            }				            
		        }
			});

			doc.IDS.$form = $form;

			if ( !$.isEmptyObject( opt.obj ) ) {
				var obj = opt.obj; 
				$numero_unidad.val( obj.numero_unidad );
			}

			$botonLimpiar.on( 'click', function ( event ) { vaciarDatos.call( doc ); });
			sigesop.eventoCambioMayuscula( '.MAYUS' );
		},

		datos = {
			numero_unidad: {
				valor: null,
				idHTML: '#numero-unidad-' + suf
			},

			numero_unidad_update: { valor: null }	
		},

		IDS = {
			botonGuardar: '#btn-guardar-unidad-' + suf,
			botonLimpiar: '#btn-limpiar-unidad-' + suf,
			form: '#form-unidad-medida-' + suf,
			$form: null
		},

		obj = {
			html: html,				
			javascript: javascript,
			datos: datos,
			IDS: IDS
		};

		return obj;
	},

	registro: function ( opt ) {
		var 

		suf = opt.suf || '',

		html = 
			'<form id="form-registro-unidades-' + suf + '" class="form-horizontal" role="form">'+
				'<div class="alert alert-danger alert-dismissible fade in" role="alert">' +
					'<button class="close" aria-label="Close" data-dismiss="alert" type="button">' +
						'<span aria-hidden="true">×</span>' +
					'</button>' +
					'<strong>Los elementos unicamente serán eliminados si aún no existen datos asociados.</strong>' +
				'</div>' +

				'<div class="form-group">'+
					'<div class="col-sm-5 control-label"></div>'+
					'<p class="col-sm-7">'+
						'<button type="button" id="btn-imprimir-reporte-' + suf + '" class="btn btn-success" > <span class="glyphicon glyphicon-floppy-disk"></span> Imprimir Reporte de Unidades</button>'+					
					'</p>'+
				'</div>'+

				'<div class="form-group">' +					
					'<div class="col-sm-12 col-md-12" id="tabla-registro-unidades-' + suf + '"></div>' +
				'</div>' +
			'</form>',

		javascript = function () {
			var 
			table = 
			sigesop.tablaRegistro({
				head: 'NUMERO DE UNIDAD, CAPACIDAD INSTALADA, CAPACIDAD EFECTIVA',
				campo: 'numero_unidad, capacidad_instalada, capacidad_efectiva_unidad'
			}),
			$botonImprimir = $( doc.IDS.botonImprimir );			

			doc.table.update_table = table.update_table; // enlazamos a vista publica
			doc.table.body = table.IDS.body;
			document.getElementById( doc.IDS.idTabla.flushChar('#') )
			.innerHTML = '<br>' + table.html;

			$( table.IDS.body ).contextMenu({
				selector: 'tr',
				items: {
		            editar: {
		            	name: 'Editar', 
		            	icon: 'edit',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).attr( 'table-index' );
		        			typeof opt.table.actions.editar == 'function' ?
		        				opt.table.actions.editar( index ):
		        				console.log( 'function editar is null' );
		        		}
		            },
		            eliminar: {
		            	name: 'Eliminar', 
		            	icon: 'delete',
		        		callback: function ( key, _opt ) {
		        			var index = $( this ).attr( 'table-index' );
		        			typeof opt.table.actions.eliminar == 'function' ?
		        				opt.table.actions.eliminar( index ):
		        				console.log( 'function eliminar is null' );
		        		}
		            }
				}
			});

			$botonImprimir.on( 'click', function ( event ) { 
				var url = sigesop.raizServidor + 'ajax.php?class=unidades' +
					'&action=imprimir',
					win = window.open( url );

				win.focus();
			});
		},

		IDS = {
			botonImprimir: '#btn-imprimir-reporte-' + suf,
			idTabla: '#tabla-registro-unidades-' + suf,
			form: '#form-registro-unidades-' + suf
		},

		doc = {
			html: html,
			javascript: javascript,
			IDS: IDS,
			table: {
				body: null,
				update_table: null
			}
		};

		return doc;
	}
}