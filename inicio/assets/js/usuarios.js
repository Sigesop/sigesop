$( document ).on( 'ready', main );

function main () {
	var

	$form = $( '#form-usuarios' ).formValidation({
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },

        onSuccess: function ( e ) {
        	e.preventDefault();

        	var 
        		inputNombre = $( '#input-nombre' ),
        		inputApellido = $( '#input-apellido' ),
        		inputUsuario = $( '#input-usuario' ),
        		inputPassword = $( '#input-password' ),
        		selectEspecialidad = $( '#select-especialidad' );

        	var datos = {
        		nombre: inputNombre.val(),
        		apellido: inputApellido.val(),
        		usuario: inputUsuario.val(),
        		password: inputPassword.val(),
        		especialidad: selectEspecialidad.val()
        	}

	    	$.ajax( {
				type: 'POST', // comunicacion GET o POST
				data: datos,
				dataType: "json",
				async: true,
				url: '../ajax/ajax.php?q=insertarUsuario',
				success: function ( data ) {
					if ( data == 'OK' ) {
						// limpiando las cajas de texto y el combo
						inputNombre.val('');
						inputApellido.val('');
						inputUsuario.val('');
						inputPassword.val('');
						selectEspecialidad.val('');
						$form.formValidation( 'resetForm' );

						alert( 'Usuario guardado satisfactoriamente...' );
					} else {
						alert ( 'Error al guardar usuario...' )
					}					
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
        	nombre: {
				validators: {
                    notEmpty: {
                        message: 'Ingrese Nombre'
                    },

                    stringLength: {
                    	min: 1,
                    	max: 50,
                    	message: 'Nombre inválido'
                    }
                }
        	},

        	apellido: {
				validators: {
                    notEmpty: {
                        message: 'Ingrese Apellido'
                    },

                    stringLength: {
                    	min: 1,
                    	max: 50,
                    	message: 'Apellido inválido'
                    }
                }
        	},

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
                    	message: 'Contraseña inválida'
                    }
                }
        	},

        	especialidad: {
				validators: {
                    notEmpty: {
                        message: 'Seleccione especialidad'
                    }
                }
        	},
        }
	}).on( 'success.field.fv', function( e, data ) {
		data.fv.disableSubmitButtons( false );
	});

	$( '#limpiar-campos' ).on( 'click', function ( e ) {
		// e.preventDefault();
		$form.formValidation( 'resetForm' );
	});
}