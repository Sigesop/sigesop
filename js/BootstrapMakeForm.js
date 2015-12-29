(function ( _, factory ) {
	BootstrapMakeForm = factory( _, $ );

	// object test
	// target_ = BootstrapMakeForm.show({
	// 	selector: '#main-8',
	// 	fields: [
	// 		{
	// 			label: {
	// 				text: 'Nombre del usuario:',
	// 				class: 'col-sm-4'
	// 			},
	// 			field: {
	// 				selector: 'input',
	// 				name: 'nombre_usuario',
	// 				class: 'col-sm-5'
	// 			}
	// 		},
	// 		{
	// 			label: {
	// 				text: 'Apellido del usuario:',
	// 				class: 'col-sm-4'
	// 			},
	// 			field: {
	// 				selector: 'input',
	// 				name: 'apellidos_trabajador',
	// 				class: 'col-sm-5'
	// 			}
	// 		},
	// 		{
	// 			label: {
	// 				text: 'Password:',
	// 				class: 'col-sm-4'
	// 			},
	// 			field: {
	// 				selector: 'input',
	// 				type: 'password',
	// 				class: 'col-sm-5',
	// 				name: 'password'
	// 			}
	// 		},
	// 		{
	// 			label: {
	// 				text: 'Seleccione área de trabajo:',
	// 				class: 'col-sm-4'
	// 			},
	// 			field: {
	// 				selector: 'select',
	// 				name: 'area_trabajo',
	// 				class: 'col-sm-5'
	// 			}
	// 		},
	// 		{
	// 			label: {
	// 				text: 'Seleccione rol de usuario:',
	// 				class: 'col-sm-4'
	// 			},
	// 			field: {
	// 				selector: 'select',
	// 				name: 'rol_usuario',
	// 				class: 'col-sm-5'
	// 			}
	// 		}
	// 	],
	// 	buttonFooter:{
	// 		sizes: {
	// 			sm: {
	// 				col: 3,
	// 				offset: 4
	// 			},
	// 			md: {},
	// 			lg: {},
	// 			xl: {}
	// 		},

	// 		buttons: [
	// 			{
	// 				label: 'Guardar',
	// 				icon: 'glyphicon-save',
	// 				class: 'btn-success',
	// 				action: function () {
	// 					alert( 'hola mundo' )
	// 				}
	// 			},
	// 			{
	// 				label: 'Limpiar Campos',
	// 				icon: 'glyphicon-repeat',
	// 				class: 'btn-danger',
	// 				action: function () {
	// 					alert( 'hello world!!!' )
	// 				}
	// 			}
	// 		]
	// 	}
	// });

})( sigesop, function ( _, $ ) {

	var BootstrapMakeForm = function ( options ) {
		this.defaultOptions = $.extend(true, {
			id: _.newId()
		}, BootstrapMakeForm.defaultOptions )

		this.data = {};

		this.IDS = {
			fields: {}
		};

		this.initOptions( options )
	};

	/* Some constants
	 */
	BootstrapMakeForm.NAMESPACE = 'bootstrap-make-form';

	/* Default options
	 */
	BootstrapMakeForm.defaultOptions = {
        cssClass: '',
        title: null,
	};

    /**
     * Config default options.
     */
    BootstrapMakeForm.configDefaultOptions = function(options) {
        BootstrapMakeForm.defaultOptions = $.extend( true, BootstrapMakeForm.defaultOptions, options );
    };

    BootstrapMakeForm.prototype = {
    	constructor: BootstrapMakeForm,
        initOptions: function(options) {
            this.options = $.extend(true, this.defaultOptions, options);

            return this;
        },

        open: function () {
        	this.realize();
        	// this.makeForm();

        	return this;
        },

        initFormStuff: function () {
        	this.setForm( this.createForm() )
        		.setFormFields( this.createFields() );

        	return this;
        },

        createForm: function () {
        	return $( '<form class="form-horizontal" role="form"></form>' )
        			.prop( 'id', this.getIdName( 'form' ) );
        },

        setForm: function ( $form ) {
        	this.IDS.$form = $form;

        	return this;
        },

        getForm: function () {
        	return this.IDS.$form;
        },

        getId: function () {
        	return this.options.id
        },

        getNamespace: function ( name ) {
        	return BootstrapMakeForm.NAMESPACE + '-' + name;
        },

        getIdName: function ( name ) {
        	return name + '-' + this.defaultOptions.id;
        },

        getNewIdName: function ( name ) {
        	return name + '-' + _.newId()
        },

        setFormFields: function ( $fields ) {
        	var that = this;

        	$.each( $fields, function ( index, $field ) {
        		/* data structurt for $field
        		 * { name: 'String', $field: {JQuery Object} }
        		 */

        		that.IDS.fields[ '$' + $field.name ] = $field.$field;
        		that.data[ $field.name ] = { valor: null };
        	});

        	return this;
        },

        createFields: function () {
        	var arr = [],
        		that = this;

    		/* data structurt for $field
    		 * { name: 'String', $field: {JQuery Object} }
    		 */
        	$.each( this.options.fields , function( index, fieldOptions ) {
	        	var

        		$field = that[ 'create_' + fieldOptions.field.selector ]( fieldOptions ),

        		$label = $( '<label class="control-label"></label>' )
        					.text( fieldOptions.label.text )
        					.addClass( fieldOptions.label.class || 'col-sm-3' ),

        		$divContainer = $( '<div><div>' )
        			.addClass( fieldOptions.field.class || 'col-sm-3' ),

        		$formGroup = $( '<div class="form-group"></div>' );

        		that.getForm().append(
        			$formGroup.append( $label )
        			.append( $divContainer.append( $field ) )
        		)

	        	/* Store JQuery Object like property
	        	 */
        		var name = fieldOptions.field.name || index;
        		arr.push({
        			name: name,
        			$field: $field
        		});
        	});

    		/* Append elements inside document HTML
    		 */
        	$( that.options.selector ).append(
        			that.getForm()
        			.append( that.createFormGroupButtons() )
        	);

        	return arr;
        },

        getFormFields: function () {
        	return this.IDS.fields;
        },

        create_select: function ( fieldOptions ) {
    		/* data structurt for fieldOptions
    		 *
    		 * selector: {String}
    		 * name: {String},
    		 * class: {String}
    		 */
    		var that = this;

        	return $( '<select class="form-control input-md"></select>' )
        			.prop({
        				'id': that.getNewIdName( 'select' ),
        				'name': fieldOptions.field.name,
        			});
        },

        create_input: function ( fieldOptions ) {
    		/* data structurt for fieldOptions
    		 *
    		 * selector: {String}
    		 * name: {String},
    		 * class: {String}
    		 */
    		var that = this;

        	return $( '<input class="form-control input-md"/>' )
        			.prop({
        				'id': that.getNewIdName( 'select' ),
        				'name': fieldOptions.field.name,
        				'type': fieldOptions.field.type
        			})
        			.addClass( fieldOptions.field.class );
        },

        createFormGroupButtons: function () {
        	var $formGroup = $( '<div class="form-group"></div>' ),
        		that = this;

        	$.each( this.options.buttons, function ( index, buttonOptions ) {
        		if ( typeof buttonOptions.offset === 'undefined' ) {
        			buttonOptions.offset = 1
        		}
        		var $paragraph = $( '<p></p>' )
        			.addClass( 'col-sm-offset-' + buttonOptions.offset )
        			.append( that.createButton( buttonOptions ) );

        		$formGroup.append( $paragraph );
        	});

        	return $formGroup;
        },

        createButton: function ( buttonOptions ) {
        	var $button = $( '<button class="btn"></button>' )
        					.addClass( buttonOptions.class || 'btn-default' )
        					.prop( 'type', buttonOptions.type || 'button' );

	    	if ( typeof buttonOptions.icon !== 'undefined' && $.trim( buttonOptions.icon ) !== '' ) {
        		$button.append( this.createButtonIcon( buttonOptions.icon ) )
        	}

        	if ( typeof buttonOptions.label !== 'undefined' ) {
        		$button.append( '&nbsp;' + buttonOptions.label );
        	}

        	/* click event
        	 */
        	$button.on('click', { form: this, $button: $button }, function ( event ) {
        		var form = event.data.form;
        		var $button = event.data.$button;
        		if ( typeof buttonOptions.action !== 'undefined' ) {
        			buttonOptions.action.call( $button, form, event );
        		};
        	});

        	return $button;
        },

        createButtonIcon: function( icon ) {
        	return $( '<span></span>' )
        			.addClass( 'glyphicon ' + icon );
        },

        realize: function () {
        	this.initFormStuff();

        	return this;
        }
    }

    /* Create de public object
     */
    BootstrapMakeForm.show = function ( options ) {
    	return new BootstrapMakeForm( options ).open();
    }

	return BootstrapMakeForm;
});