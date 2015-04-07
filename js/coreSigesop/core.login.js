sigesop.login = {
	document: function ( opt )
	{
		var 
			suf = opt.suf || '';

		var 
			html = 
				'<header>' +
					'<div class="row">' +
						'<div class="col-sm-6 col-sm-offset-3">' +
							'<h1 class="text-center">Sistema de gestión operativa y mantenimiento</h1>' +
							'<span class="text-center">Comisión Federal de Electricidad</span>' +
						'</div>' +
						'<div class="col-sm-3"></div>' +
					'</div>' +

					'<div class="row botonInicio">' +
						'<div class="col-sm-1 col-md-1"></div>' +
						'<div class="col-sm-11 col-md-11">' +
							'<p class="pull-center">' +
								'<button id="accesoSystem' + suf + '" class="btn btn-success">Acceso al Sistema</button>' +
							'</p>' +
						'</div>' +
					'</div>' +
				'</header>' +
				
				'<div class="container-fluid" id="formularioLogin' + suf + '" title="Acceso al sistema" >' +		
					'<form id="formLogin' + suf + '" class="form-singin" role="form"><br>' +
						'<div class="form-group"><img src="css/images/logohome1.png" class="img-responsive"></img></div> <br>'+						

						// '<div id="formH6" class="form-group">' +
						// 	'<h6 class="form-singin-heading text-center" id="tips"><b>Ingrese todos los campos</b></h6>' +
						// '</div>' +
				
						'<div class="form-group">' +
							'<input type="text" name="usuario" id="usuario' + suf + '" class="form-control" required autofocus mouseev="true" autocomplete="off" keyev="true" clickev="true" placeholder="Usuario"/>' +
						'</div>' +
				
						'<div class="form-group" >' +
							'<input type="password" name="clave" id="clave' + suf + '" class="form-control" required autofocus mouseev="true" autocomplete="off" keyev="true" clickev="true" placeholder="Contraseña"/>' +
						'</div><br>' +				
				
						'<div class="form-group">' +
							'<div class="col-md-2"></div>' +
							'<div class="col-md-8">' +
								'<button id="btnLogin' + suf + '" class="btn btn-lg btn-success btn-block" type="submit">Ingresar</button>' +
							'</div>' +
							'<div class="col-md-2"></div>' +
						'</div>' +
					'</form>' +
				'</div>',

			javascript = function () {
				var
				form = this.IDS.form,
				$formularioLogin = $( this.IDS.formularioLogin ),
				$form = $( form ).formValidation({
			        icon: {
			            valid: 'glyphicon glyphicon-ok',
			            invalid: 'glyphicon glyphicon-remove',
			            validating: 'glyphicon glyphicon-refresh'
			        },
			        onSuccess: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.success == 'function' ?
			        		opt.success( doc.datos ) :
			        		console.log( 'success is null' );

			        	$( form ).data( 'formValidation' ).disableSubmitButtons( false );
			        },
			        onError: function ( e ) {
			        	e.preventDefault();			        	
			        	typeof opt.error == 'function' ?
			        		opt.error() : console.log( 'error is null' );			        	
			        },
			        fields: {
			            usuario: {
			                validators: {
			                    notEmpty: {
			                        message: 'Campo necesario'
			                    }
			                }
			            },
			            clave: {
			                validators: {
			                    notEmpty: {
			                        message: 'Campo necesario'
			                    }
			                }
			            }				            
			        }
				});

				this.IDS.$form = $form;

				$formularioLogin.dialog({
					dialogClass: "no-close",
					autoOpen: true,
					resizable: false,
					height: 400,
					width: 350,
					modal: true,
					show: {
						// effect: "blind",
						effect: 'fade',
						duration: 1500
					},
					hide: {
						// effect: "explode",
						effect: 'fade',
						duration: 1000
					}
				});

				$( this.IDS.botonAcceso ).on( 'click', function ( event ) 
				{
					event.preventDefault();
					$formularioLogin.dialog( "open" );
				});
			},

			datos = {
				usuario: {
					valor: null,
					idHTML: '#usuario' + suf
				},

				clave: {
					valor: null,
					idHTML: '#clave' + suf
				}
			},				

			doc = {
				html: html,
				javascript: javascript,
				datos: datos,
				IDS: {
					form: '#formLogin' + suf,
					$form: null,
					botonAcceso: '#accesoSystem' + suf,
					botonLogin: '#btnLogin' + suf,
					formularioLogin: '#formularioLogin' + suf
				}
			};

		return doc;	
	}
}