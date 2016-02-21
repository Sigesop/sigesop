(function ( $ ) {
var loginDocument = function ( opt ) {
	var

	that = this,

	struct_document = sigesop.view[ sigesop.FRAMEWORK ].loginDocument,

	javascript = function () {

	},

	factory = function () {
		var IDS = this.IDS;

		struct_document.call( this );
		if ( typeof this !== 'undefined' ) {
			$( that ).append( IDS.$content );
			javascript.call( this );
		}

		return this;
	},

	IDS = {
		$content    : null,
		$header     : null,
		$botonAcceso: null
	},

	doc = {
		IDS  : IDS
	};

	doc.factory = factory.bind( doc );

	return doc;
}

var singInDocument = function ( opt ) {
	var

	that = this,	

	struct_document = sigesop.view[ sigesop.FRAMEWORK ].singInDocument,

	javascript = function () {
		var datos = this.datos;
		var IDS   = this.IDS;

		IDS.$form.formValidation({
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

	        	IDS.$form.data( 'formValidation' ).disableSubmitButtons( false );
	        },
	        onError: function ( e ) {
	        	e.preventDefault();
	        	typeof opt.error == 'function' ?
	        		opt.error() : console.log( 'error is null' );
	        },
	        fields: {
	            usuario: {
	            	onSuccess: function ( e, data ) {
	            		datos.usuario.valor = data.element.val();
	            	},
	            	onError: function ( e, data ) {
	            		datos.usuario.valor = null;
	            	},
                	onStatus: function ( e, data ) {
                		if ( data.status === 'NOT_VALIDATED' )
                			datos.usuario.valor = null;
                	},
	                validators: {
	                    notEmpty: {
	                        message: 'Campo necesario'
	                    }
	                }
	            },
	            password: {
	            	onSuccess: function ( e, data ) {
	            		datos.clave.valor = data.element.val().SHA1();
	            	},
	            	onError: function ( e, data ) {
	            		datos.clave.valor = null;
	            	},
                	onStatus: function ( e, data ) {
                		if ( data.status === 'NOT_VALIDATED' )
                			datos.clave.valor = null;
                	},
	                validators: {
	                    notEmpty: {
	                        message: 'Campo necesario'
	                    }
	                }
	            }
	        }
		});

		IDS.$formContainer.dialog({
			dialogClass: "no-close",
			autoOpen: true,
			resizable: false,
			height: 480,
			width: 400,
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

		IDS.$enlace_guia_usuario.on( 'click', function ( e ){
			var win = window.open( sigesop.path_user_manual );
			win.focus();
		});
	},

	factory = function () {
		var IDS = this.IDS;

		struct_document.call( this );
		if ( typeof this !== 'undefined' ) {
			// $( that ).append( IDS.$form );
			javascript.call( this );
		}

		return this;
	},

	datos = {
		usuario: { valor: null },
		clave  : { valor: null }
	},

	IDS = {
		$form            : null
	},

	doc = {
		datos: datos,
		IDS  : IDS
	};

	doc.factory = factory.bind( doc );

	return doc;
}

$.extend( $.fn, {	
	'singInDocument': singInDocument,
	'loginDocument' : loginDocument
});

})( jQuery )
