if ( typeof sigesop !== 'undefined' ) {
	new Error( 'sigesopCFE es requerido' );
}

(function( _ ){
var loginDocument = function () {
	var IDS = this.IDS;

	/********************************
	 ** JQuery objects
	 ********************************/
	var $botonAcceso = $( '<button></button>' )
		.prop({
			'type': 'button'
		})
		.html( 'Acceso al Sistema' )
		.addClass( 'btn btn-success' );

	var $content = $( '<div></div>' );
	var $header  = $( '<header></header>' )
		.append(
			$('<div></div>').addClass('row')
			.append(
				$('<div></div>').addClass('col-sm-offset-3 col-sm-6')
				.append(
					$('<h1></h1>').addClass('text-center')
					.html('Sistema de gestión operativa y mantenimiento')
				)
			)
			.append('<div class="col-sm-3"></div>')
		)
		.append('<br><br><br>')
		.append(
			$('<div></div>').addClass('row')
			.append(
				$('<div></div>').addClass('col-sm-offset-1 col-sm-11')
				.append(
					$('<p></p>').addClass('pull-center')
					.append( $botonAcceso )
				)
			)
		)


	/* Estructuring body document
	 */
	$content.append( $header );

	/* binding jQuery objects
	 */
	IDS.$content     = $content;
	IDS.$header      = $header;
	IDS.$botonAcceso = $botonAcceso;
}

var singInDocument = function () {
	var IDS = this.IDS;

	/********************************
	 ** JQuery objects
	 ********************************/
	var $usuario = $( '<input/>' )
	.prop({
		'name'       : 'usuario',
		'type'       : 'text',
		'placeholder': 'Usuario'
	})
	.addClass( 'form-control' )

	var $password = $( '<input/>' )
	.prop({
		'name'       : 'password',
		'type'       : 'password',
		'placeholder': 'Contraseña'
	})
	.addClass( 'form-control' );

	var $botonLogin = $( '<button></button>' )
	.html( 'Ingresar' )
	.prop({
		'type': 'submit'
	})
	.addClass( 'btn btn-lg btn-success btn-block' )

	var $enlace_guia_usuario = $( '<a></a>' )
	.html( 'Guia de usuario' )
	.prop({
		'type': 'button'
	})
	.append( '&nbsp;<span class="glyphicon glyphicon-question-sign"></span>' )

	/* Estructuring form document
	 */
	var $form = $( '<form></form>' )
		.attr( 'role', 'form' )
		.addClass( 'form-singin' ); // cfe-img-logo-home src="css/images/logohome1.png"

	$form.append(
		'<div class="form-group"><center><img class="img-responsive" src="css/images/logohome1.png"></img></center></div><br>'
	)
	.append(
		$('<div class="form-group"></div>')
		.append( $usuario )
	)
	.append(
		$('<div class="form-group"></div>')
		.append( $password )
	)
	.append( $botonLogin )

	/* Estructuring panel container document
	 */
	var $formContainer = $('<div></div>')
	.attr({
		'title': 'Acceso al sistema'
	})
	.addClass('container-fluid')
	.append( $form )	
	.append(
		$('<br><br><div class="text-center"></div>').html( $enlace_guia_usuario )
	)

	/* binding jQuery objects
	 */
	IDS.$formContainer       = $formContainer;
	IDS.$form                = $form;
	IDS.$usuario             = $usuario;
	IDS.$password            = $password;
	IDS.$botonLogin          = $botonLogin;
	IDS.$enlace_guia_usuario = $enlace_guia_usuario;
}

_.view.bootstrap = {
	loginDocument : loginDocument,
	singInDocument: singInDocument
}
})( sigesop )