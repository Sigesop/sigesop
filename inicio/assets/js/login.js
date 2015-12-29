// evento de documento listo
$( document ).on( 'ready', main );

function main () {
	// configurar fondo de pantalla
    $.backstretch("assets/img/_background.png");

    var 
    	inputUsuario = $( '#input-usuario' ),
    	inputPassword = $( '#input-password' );    	

    $( '#form-login' ).formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        onSuccess: function ( e ) {
        	e.preventDefault();	

	    	var usuario = {
	    		usuario: inputUsuario.val().toUpperCase(),
	    		password: inputPassword.val()
	    	}

	    	$.ajax( {
				type: 'POST', // comunicacion GET o POST
				data: usuario,
				dataType: "json",
				async: true,
				url: 'ajax/ajax.php?q=iniciarSesion',
				success: function ( data ) {
					alert( data );
                    if ( data === 'OK' ) 
                        document.location.href = 'vistas/menu.php';
				},
				error: function () {
					alert( 'Error de conexion ajax!!!' );
				}
	    	});
        },

        onError: function ( e ) {
        	e.preventDefault();			        	
		    alert( 'Complete los campos' );
        },

        fields: {
        	usuario: {
				validators: {
                    notEmpty: {
                        message: 'Ingrese Usuario'
                    },

                    stringLength: {
                    	min: 5,
                    	max: 5,
                    	message: 'Usuario inválido'
                    }
                }
        	},

        	password: {
				validators: {
                    notEmpty: {
                        message: 'Ingrese Contraseña'
                    },

                    stringLength: {
                    	min: 5,
                    	max: 8,
                    	message: 'Usuario inválido'
                    }
                }
        	}
        }
    }).on( 'success.field.fv', function( e, data ) {
		data.fv.disableSubmitButtons( false );
	});
}