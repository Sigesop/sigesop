$( document ).on( 'ready', main );

function main()
{
	doc = sigesop.login.document({
		success: login,
		error: sigesop.completeCampos
	});

	document.getElementsByTagName( 'body' )[0].innerHTML = doc.html;
	doc.javascript();
}

function login ( datos )
{
	datos.usuario.valor = $( datos.usuario.idHTML ).val().trim();
	datos.clave.valor = $( datos.clave.idHTML ).val().SHA1();
	// console.log(datos.clave.valor);

	sigesop.msgBlockUI( 'Enviando...', 'loading', 'blockUI' );
	sigesop.query({
		data: datos,
		type: 'POST',
		class: 'sistema',
		query: 'solicitudInicioSesion',
		queryType: 'sendGetData',
		success: function ( data ) 
		{
			if ( jQuery.isEmptyObject( data ) ) {
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
				// $( datos.usuario.idValidacion ).removeClass( "has-error" )
				// $( datos.clave.idValidacion ).removeClass( "has-error" )								
				// $( datos.usuario.idValidacion ).addClass( "has-success" )
				// $( datos.clave.idValidacion ).addClass( "has-success" )						
				document.location.href = "sitios/" + data.indexUsuario;						
			} 
			else 
			{
				$.unblockUI();
				// sigesop.msg( '<br><center>Credenciales no válidas</center>', '', 'error' );
				sigesop.msg( '<br><center>' + data.status.msj + '</center>', '', 'error' );
				doc.IDS.$form.data( 'formValidation' ).updateStatus( 'usuario', 'INVALID' );
				doc.IDS.$form.data( 'formValidation' ).updateStatus( 'clave', 'INVALID' );

				setTimeout( function() 
				{
					// doc.IDS.$form.data( 'formValidation' ).resetField( 'usuario' );
					// doc.IDS.$form.data( 'formValidation' ).resetField( 'clave' );
					doc.IDS.$form.formValidation( 'resetForm' );
				}, 5000 );	
			}
		},
		error: function() {	$.unblockUI(); }
	});
}