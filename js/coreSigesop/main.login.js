$( document ).on( 'ready', main );

function main()
{
	doc = $.sigesop.login.documentoLogin( '' );	
	// $( 'body' ).html( doc.html );
	document.getElementsByTagName( 'body' )[0].innerHTML = doc.html;
	doc.javascript();

	$( doc.IDS.botonAcceso ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		$( doc.IDS.formularioLogin ).dialog( "open" );
	});

	$( doc.IDS.botonLogin ).on( 'click', function ( event ) 
	{
		event.preventDefault();
		var boton = $( this );
		doc.datos.usuario.valor = $( doc.datos.usuario.idHTML ).val().trim();

		var clave = $( doc.datos.clave.idHTML ).val();
		!jQuery.isEmptyObject( clave ) ? doc.datos.clave.valor = $.sigesop.SHA1( clave ) : null;
		// alert(envioDatos.clave.valor);

		var array = [
			doc.datos.usuario,
			doc.datos.clave
		]

		var flag = true;
		flag = $.sigesop.validacion( array, { tipoValidacion: 'error' } );

		if ( flag ) 
		{
			boton.button('loading');
			$.sigesop.msgBlockUI( '', 'loading', 'block', '#formularioLogin' );
			$.sigesop.insertarDatosRespuestaSistema({
				Datos: doc.datos,
				type: 'POST',
				clase: 'ajaxSistema',
				solicitud: 'solicitudInicioSesion',
				respuesta: function ( data ) 
				{
					boton.button( 'reset' );
					if ( data !== null ) 
					{
						if (data.estado) 
						{
							$( '#formularioLogin' ).unblock();
							$.sigesop.msgBlockUI( 'Acceso Autorizado', 'success' );

							window.localStorage.usuario = doc.datos.usuario.valor;
							$( doc.datos.usuario.idValidacion ).removeClass( "has-error" )
							$( doc.datos.clave.idValidacion ).removeClass( "has-error" )								
							$( doc.datos.usuario.idValidacion ).addClass( "has-success" )
							$( doc.datos.clave.idValidacion ).addClass( "has-success" )						
							document.location.href = "sitios/" + data.indexUsuario;						
						} 
						else 
						{
							$( '#formularioLogin' ).unblock();
							$.sigesop.msgBlockUI( 'Credenciales no válidas', 'error' );

							$( "#tips" ).text( "Usuario o Contraseña Incorrecta" );
							$( "#formH6" ).addClass( "has-error" )

							$( doc.datos.usuario.idValidacion ).addClass( "has-error" )
							$( doc.datos.clave.idValidacion ).addClass( "has-error" )
							
							setTimeout( function() 
							{
								$( "#tips" ).removeClass( "ui-state-error", 1500 );
								$( doc.datos.usuario.idValidacion ).removeClass( "has-error" );
								$( doc.datos.clave.idValidacion ).removeClass( "has-error" );
							}, 5000 );	
						}
					} else console.log('Valor retornado del servidor es null');
				},

				errorRespuesta: function() 
				{ 
					boton.button( 'reset' );
					$( '#formularioLogin' ).unblock();					
				}
			});
		}
	});
}