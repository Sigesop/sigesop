$( document ).on( 'ready', main );

function main() {
	var $body = $('body');

	/* Documento principal
	 */
	canvas = $body.loginDocument({})
	.factory();

	/* Documento Formulario del login
	 */
	login = $body.singInDocument({
		success: login,
		error: sigesop.completeCampos
	})
	.factory();

	/* Enlazar eventos de documentos
	 */
	canvas.IDS.$botonAcceso.on( 'click', function ( event ) {
		login.IDS.$formContainer.dialog( "open" );
	});
}

function login ( datos ) {
	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data     : datos,
		type     : 'POST',
		class    : 'sistema',
		query    : 'solicitudInicioSesion',
		queryType: 'sendGetData',
		success  : function ( data ) {
			if ( $.isEmptyObject( data ) ) {
				console.log('Valor retornado del servidor es null');
				$.unblockUI();
				return -1;
			}

			if ( data.estado ) {
				sigesop.msg( '<br><center>Acceso Autorizado</center>', '', 'success' );

				var usuario = datos.usuario.valor;

				localStorage.rpe = usuario !== sigesop.root ?
					data.rpe : usuario;
				localStorage.usuario = usuario;
				localStorage.indexUsuario = "sitios/" + data.indexUsuario;
				document.location.href = "sitios/" + data.indexUsuario;
			}
			else {
				$.unblockUI();
				sigesop.msg( '<br><center>' + data.status.msj + '</center>', '', 'error' );
				login.IDS.$form.data( 'formValidation' ).updateStatus( 'usuario', 'INVALID' );
				login.IDS.$form.data( 'formValidation' ).updateStatus( 'pass', 'INVALID' );

				setTimeout( function() {
					login.IDS.$form.formValidation( 'resetForm' );
				}, 5000 );
			}
		},
		error: function() {	$.unblockUI(); }
	});
}