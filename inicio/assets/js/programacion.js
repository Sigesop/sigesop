vc = {

}

var 
programacion = function (  ) {
    var
    html =
        '<div class="panel panel-success">' +
            '<div class="panel-heading">ALTA DE USUARIOS</div>' +

            '<div class="panel-body">' +
                '<form id="form-programacion-vc" class="form-horizontal" role="form">' +
                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">FECHA DE LA VC: </label>' +
                        '<div class="col-sm-3">' +
                            '<input id="input-fecha-vc" name="fecha_vc" class="form-control"/>' +
                        '</div>' +

                        '<label class="control-label col-sm-2">NOMBRE DE LA VC: </label>' +
                        '<div class="col-sm-3">' +
                            '<input id="input-nombre-vc" name="nombre_vc" class="form-control"/>' +
                        '</div>  ' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">HORA INICIO: </label>' +
                        '<div class="col-sm-3">' +
                            '<input id="input-hora-inicio" name="hora_inicio" class="form-control"/>' +
                        '</div>' +

                        '<label class="control-label col-sm-2">ÁREA PARTICIPANTE: </label>' +
                        '<div class="col-sm-3">' +
                            '<select id="select-area-participante" name="area_participante" class="form-control">' +
                                '<option value="" >SELECCIONE OPCION...</option>' +
                                '<option value="GRTSE" >GERENCIA REGIONAL DE TRANSMISIÓN SURESTE</option>' +
                                '<option value="TODAS" >SELECCIONAR ZONAS DE TRANSMISIÓN</option>' +
                            '</select>' +
                        '</div>  ' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">HORA TERMINO: </label>' +
                        '<div class="col-sm-3">' +
                            '<input id="input-hora-termino" name="hora_termino" class="form-control"/>' +
                        '</div>' +

                        '<label class="control-label col-sm-2">ESPECIALIDAD PARTICIPANTE: </label>' +
                        '<div class="col-sm-3">' +
                            '<select id="select-especialidad-participante" name="especialidad_participante" class="form-control">' +
                                '<option value="" >SELECCIONE OPCION...</option>' +
                                '<option value="JF" >JEFATURA</option>' +
                                '<option value="SL" >SUBESTACIONES Y LINEAS</option>' +
                                '<option value="PT" >PROTECCIONES</option>' +
                                '<option value="CM" >COMUNICACIONES</option>' +
                                '<option value="CI" >CONTROL E INFORMATICA</option>' +
                                '<option value="AD" >ADMINISTRACION</option>' +
                                '<option value="CG" >CONTROL DE GESTIÓN</option>' +
                                '<option value="AM" >AMBIENTAL</option>' +
                                '<option value="SM" >SELECCIÓN MÚLTIPLE...</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">SALA REQUERIDA: </label>' +
                        '<div class="col-sm-3">' +
                            '<select id="select-sala-requerida" name="sala_requerida" class="form-control" disabled></select>' +
                        '</div>' +

                        '<label class="control-label col-sm-2">COMENTARIOS</label>' +
                        '<div class="col-sm-3">' +
                            '<textarea id="text-comentario" name="comentario" class="form-control"></textarea>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">ÁREA SOLICITANTE: </label>' +
                        '<div class="col-sm-3">' +
                            '<select id="select-area-solicitante" name="area_solicitante" class="form-control">' +
                                '<option value="" >SELECCIONE OPCION...</option>' +
                                '<option value="SDT" >SUBDIRECCIÓN DE TRANSMISIÓN</option>' +
                                '<option value="GRTSE" >GERENCIA REGIONAL DE TRANSMISIÓN SURESTE</option>' +
                                '<option value="GCROR" >GERENCIA DE CONTROL REGIONAL ORIENTAL/CENACE</option>' +
                                '<option value="TUX" >ZONA DE TRANSMISIÓN TUXTLA</option>' +
                                '<option value="MPS" >ZONA DE TRANSMISIÓN MALPASO</option>' +
                                '<option value="VHSA" >ZONA DE TRANSMISIÓN VILLAHERMOSA</option>' +
                                '<option value="TAP" >ZONA DE TRANSMISIÓN TAPACHULA</option>' +
                                '<option value="IST" >ZONA DE TRANSMISIÓN ISTMO</option>' +
                                '<option value="ZOTSE" >ZONA DE OPERACIÓN DE TRANSMISIÓN SURESTE</option>' +
                            '</select>' +
                        '</div>' +
                    '</div>' +

                    '<div class="form-group">' +
                        '<label class="control-label col-sm-2">ESPECIALIDAD SOLICITANTE: </label>' +
                        '<div class="col-sm-3">' +
                            '<select id="select-especialidad-solicitante" name="especialidad_solicitante" class="form-control">' +
                                '<option value="" >SELECCIONE OPCION...</option>' +
                                '<option value="JF" >JEFATURA</option>' +
                                '<option value="SL" >SUBESTACIONES Y LINEAS</option>' +
                                '<option value="PT" >PROTECCIONES</option>' +
                                '<option value="CM" >COMUNICACIONES</option>' +
                                '<option value="CI" >CONTROL E INFORMATICA</option>' +
                                '<option value="AD" >ADMINISTRACION</option>' +
                                '<option value="CG" >CONTROL DE GESTIÓN</option>' +
                                '<option value="AM" >AMBIENTAL</option>' +
                            '</select>' +
                        '</div>' +

                        '<label class="control-label col-sm-2"></label>' +
                        '<div class="col-sm-3">' +
                            '<p>' +
                                '<button type="submit" class="btn btn-success">Guardar</button> ' +
                                '<button id="limpiar-campos" type="reset" class="btn btn-success">Limpiar</button>' +
                            '</p>' +
                        '</div>' +
                    '</div>' +
                '</form>' +
            '</div>' +
        '</div>',

    javascript = function () {
        var
            $form                       = $( '#form-programacion-vc' ),
            $fecha_vc                   = $( '#input-fecha-vc' ),
            $hora_inicio                = $( '#input-hora-inicio' ),
            $hora_termino               = $( '#input-hora-termino' ),
            $nombre_vc                  = $( '#input-nombre-vc' ),
            $area_participante          = $( '#select-area-participante' ),
            $especialidad_participante  = $( '#select-especialidad-participante' ),
            $sala_requerida             = $( '#select-sala-requerida' ),
            $text_comentario            = $( '#text-comentario' ),
            $area_solicitante           = $( '#select-area-solicitante' ),
            $especialidad_solicitante   = $( '#select-especialidad-solicitante' ),
            $limpiar_campos             = $( '#limpiar-campos' ),        

        verificarDatosDisponibilidad = function  () {
            var
                hora_1 = $hora_inicio.val(),
                hora_2 = $hora_termino.val(),
                hora_inicio = moment( hora_1, 'h:m' ),
                hora_termino = moment ( hora_2, 'h:m' );

            if( hora_termino.isBefore( hora_inicio ) ) {
                $form.data( 'formValidation' )
                    .updateStatus( 'hora_termino', 'INVALID' );
                return false;
            }

            else return true;
        },

        disponibilidadSalaRequerida = function () {
            var datos = {
                fecha_vc: $fecha_vc.val(),
                hora_inicio: $hora_inicio.val(),
                hora_termino: $hora_termino.val()
            };

            $.ajax( {
                type: 'POST', // comunicacion GET o POST
                data: datos,
                dataType: "json",
                async: true,
                url: '../ajax/ajax.php?q=disponibilidadSalaRequerida',
                success: function ( data ) {
                    var html = '';
                    if ( !$.isEmptyObject( data ) ) {
                        html += '<option value="">SELECCIONE OPCIÓN...</option>';
                        for ( var i = 0, lon = data.length; i < lon; i++ ) {
                            html += '<option>' + data[ i ] + '</option>';
                        }

                        $sala_requerida
                        .prop( 'disabled', false )
                        .html( html );
                    }  
                },
                error: function () {
                    alert( 'Error de conexion ajax!!!' );
                }
            });
        };

        $form.formValidation({
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
                fecha_vc: {
                    validators: {
                        notEmpty: {
                            message: 'Ingrese fecha de la vc'
                        },

                        date: {
                            format: 'DD/MM/YYYY',
                            message: 'Fecha inválida'
                        }
                    }
                },

                hora_inicio: {
                    validators: {
                        notEmpty: {
                            message: 'Ingrese hora de VC'
                        },

                        regexp: {
                            regexp: /^([0-9]{2})\:([0-9]{2})$/,
                            message: 'Hora inválida de VC'
                        }
                    }
                },

                hora_termino: {
                    validators: {
                        notEmpty: {
                            message: 'Ingrese hora conclusión de VC'
                        },

                        regexp: {
                            regexp: /^([0-9]{2})\:([0-9]{2})$/,
                            message: 'Hora inválida de VC'
                        }
                    }
                },

                sala_requerida: {
                    validators: {
                        notEmpty: {
                            message: 'Seleccione sala'
                        }
                    }
                },

                area_solicitante: {
                    validators: {
                        notEmpty: {
                            message: 'Indique área solicitante'
                        }
                    }
                },

                especialidad_solicitante: {
                    validators: {
                        notEmpty: {
                            message: 'Indique especialidad solicitante'
                        }
                    }
                },

                nombre_vc: {
                    validators: {
                        notEmpty: {
                            message: 'Ingresa nombre de la VC'
                        },

                        stringLength: {
                            min: 5,
                            max: 100,
                            message: 'Longitud inválida'
                        }
                    }
                },

                area_participante: {
                    validators: {
                        notEmpty: {
                            message: 'Indique área participante'
                        }
                    }
                }, 

                especialidad_participante: {
                    validators: {
                        notEmpty: {
                            message: 'Indique especialidad participante'
                        }
                    }
                },

                comentario: {
                    validators: {
                        notEmpty: {
                            message: 'Ingresa comentario'
                        }
                    }
                }
            }
        }).on( 'success.field.fv', function( e, data ) {
            data.fv.disableSubmitButtons( false );
        });

        $fecha_vc.datetimepicker({
            lang:'es',
            format: 'd/m/Y',
            timepicker:false,
            datepicker:true,
            onClose:function() {
                $form.formValidation( 'revalidateField', 'fecha_vc' );
            }
        })    
        .on( 'success.field.fv', function ( e, data ) {
            var 
                today = moment().format( 'DD/MM/YYYY' ),
                _today = moment( today, 'DD/MM/YYYY' ),
                value = moment( $fecha_vc.val(), 'DD/MM/YYYY' );
            
            if ( value.isBefore( _today ) ) {
                $fecha_vc.val( today );
            }

            // si los 3 campos [hora_inicio, hora_termino, fecha_vc]
            // son validos entonces lanzamos el ajax de verificacion
            // de las salas
            else {
                // verificamos que [hora_inicio, hora_termino]
                // no sean vacios, de lo contrario que no
                // lance la verificacion de disponibilidad de salas
                var 
                    hora_inicio = $hora_inicio.val(),
                    hora_termino = $hora_termino.val();

                if ( !$.isEmptyObject( hora_inicio ) &&
                     !$.isEmptyObject( hora_termino )) 
                {
                    if ( verificarDatosDisponibilidad() ) 
                        disponibilidadSalaRequerida();
                    else {
                        alert( 'datos inválidos' );
                    }
                }
            }
        })
        .val( moment().format( 'DD/MM/YYYY' ) );

        $hora_inicio.datetimepicker({
            lang:'es',
            format: 'H:i',
            timepicker:true,
            datepicker:false,
            onClose: function () {
                $form.formValidation( 'revalidateField', 'hora_inicio' );
            }
        })
        .on( 'success.field.fv', function ( e, data ) {
            var hora_termino = $hora_termino.val();

            if ( !$.isEmptyObject( hora_termino ) ) {
                if ( !verificarDatosDisponibilidad() ) {
                    alert( 'hora inválida' )
                }
                // lanzamos ajax para la consulta de las salas disponibles
                else {
                    disponibilidadSalaRequerida();
                }
            }
        });

        $hora_termino.datetimepicker({
            lang:'es',
            format: 'H:i',
            timepicker:true,
            datepicker:false,
            onClose: function () {
                $form.formValidation( 'revalidateField', 'hora_termino' );
            }
        })
        .on( 'success.field.fv', function ( e, data ) {

            if ( !verificarDatosDisponibilidad() ) {
                alert( 'hora inválida' )
            }
            // lanzamos ajax para la consulta de las salas disponibles
            else {
                disponibilidadSalaRequerida();
            }
        });
    };

    return {
        html: html,
        javascript: javascript
    }
}

vc.programacion = programacion;

$( document ).on('ready', main );

function main () {
    doc = vc.programacion();

    $( '#btn-programacion-vc' ).on( 'click', function ( e ) {
        win = BootstrapDialog.show({
            title: 'Programacion de VC',
            type: BootstrapDialog.TYPE_DEFAULT,
            message: doc.html,        
            size: BootstrapDialog.SIZE_WIDE,
            draggable: true,
            onshown: function ( dialog ) {
                doc.javascript();
            },
            buttons: [{
                label: 'Cancelar',
                cssClass: 'btn-danger',
                action: function( dialog ) {
                    dialog.close();
                }
            }]
        });
    });

    scheduler.config.xml_date="%Y-%m-%d %H:%i";
    scheduler.init('calendario',new Date(2015,0,10),"week");
    scheduler.load("events.xml");
}