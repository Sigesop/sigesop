<?php
require_once 'sigesop.class.php';
require_once '../Carbon/Carbon.php';
include_once 'pdf.class.php';
use Carbon\Carbon;

class operacion extends sigesop {
	public function __construct( $usuario, $clave ) { 
        parent::sigesop( $usuario, $clave );
    }
    
    public function __destruct(){ parent::__destruct(); }
	
    public function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion ) { 
            case 'actualizar_relatorio':
                $query = $this->actualizar_relatorio( $post );
                echo json_encode( $query );
                break;

            case 'actualizar_evento_relatorio':
                $query = $this->actualizar_evento_relatorio( $post );
                echo json_encode( $query );
                break;

            case 'agregar_consecutivo_inicializador':
                $query = $this->agregar_consecutivo_inicializador( $post );
                echo json_encode( $query );
                break;

            case 'cerrar_evento':
                $query = $this->cerrar_evento( $get );
                echo json_encode( $query );
                break;

            case 'verifica_consecutivo_licencia':
                $query = $this->verifica_consecutivo_licencia( $get );
                echo json_encode( $query );
                break;

            case 'eliminar_libro_licencia':
                $query = $this->eliminar_libro_licencia( $get );
                echo json_encode( $query );
                break;

            case 'eliminar_libro_relatorio':
                $query = $this->eliminar_libro_relatorio( $get );
                echo json_encode( $query );
                break;

            case 'eliminar_libro_relatorio_historial':
                $query = $this->eliminar_libro_relatorio_historial( $get );
                echo json_encode( $query );
                break;

            case 'imprimir':
                $query = $this->imprimir( $get );
                echo json_encode( $query );
                break; 

            case 'nuevo_evento_relatorio':
                $query = $this->nuevo_evento_relatorio( $post );
                echo json_encode( $query );
                break; 

            case 'nuevo_libro_licencia':
                $query = $this->nuevo_libro_licencia( $post );
                echo json_encode( $query );
                break; 

            case 'nuevo_relatorio':
                $query = $this->nuevo_relatorio( $post );
                echo json_encode( $query );
                break;

            case 'obtener_historial_eventos':
                $query = $this->obtener_historial_eventos( $get );
                echo json_encode( $query );
                break; 

            case 'obtener_libro_licencia':
                $query = $this->obtener_libro_licencia();
                echo json_encode( $query );
                break; 

            case 'obtener_libro_relatorio':
                $query = $this->obtener_libro_relatorio( $get );
                echo json_encode( $query );
                break; 

            case 'obtener_tipo_reporte':
                $query = $this->obtener_tipo_reporte();
                echo json_encode( $query );
                break; 

            default:
                echo json_encode('Funcion no registrada en la clase operacion');
            break;
		}
	}

    private $tipo_reporte = array( 'AEROGENERADOR', 'UNIDAD' );

    public function obtener_tipo_reporte () {
        return $this->tipo_reporte;
    }

    public function nuevo_libro_licencia( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'anio_licencia'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $anio_licencia = $data[ 'anio_licencia' ][ 'valor' ];

        $sql = 
        "INSERT INTO libro_licencia ( anio_licencia ) VALUES ( '$anio_licencia' )";
        // return $sql;
        $query = $this->insert_query( $sql );
        
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Año de licencia creado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $anio_licencia, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario responsable' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $anio_licencia, 'key' => 'anio_licencia', 'msj' => $query );
            return $rsp;
        }
    }  

    public function eliminar_libro_licencia( $data ) {
        $id_libro_licencia = $data['id_libro_licencia'];

        if ( !empty( $id_libro_licencia ) )
        {
            $sql = "delete from libro_licencia where id_libro_licencia = '$id_libro_licencia'";
            $query = $this->insert_query( $sql );
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $borrarAero.". Error al Eliminar Año de licencia";
            }
        } 
        else return 'NA';
    }

    public function obtener_libro_licencia () {
        $sql =  
            "SELECT id_libro_licencia, anio_licencia, inicializador ".
            "FROM libro_licencia";
        $query = $this->array_query( $sql );
        return $query;
    }

    public function agregar_consecutivo_inicializador ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'consecutivo_licencia', 'id_libro_licencia'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $consecutivo_licencia = $post[ 'consecutivo_licencia' ][ 'valor' ];
        $id_libro_licencia = $post[ 'id_libro_licencia' ][ 'valor' ];

        $sql = 
        "UPDATE libro_licencia SET inicializador = $consecutivo_licencia ".
        "WHERE id_libro_licencia = $id_libro_licencia";
        $query = $this->insert_query( $sql );

        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Año de licencia creado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $consecutivo_licencia, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario responsable' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $consecutivo_licencia, 'key' => 'consecutivo_licencia', 'msj' => $query );
            return $rsp;
        }
    }

    # verifica si existen relatorios asociados a un año especifico
    public function verifica_consecutivo_licencia ( $get ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'id_libro_licencia'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_libro_licencia = $get[ 'id_libro_licencia' ];
        $sql =
        "SELECT id_libro_relatorio FROM libro_relatorio ".
        "WHERE id_libro_licencia = $id_libro_licencia";
        
        $query = $this->query( $sql, 'id_libro_relatorio', NULL );
        return !empty( $query ) ? 'OK' : NULL;
    } 

    # ----------------------------

    public function nuevo_evento_relatorio ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'id_libro_relatorio', 'numero_aero',
                'fecha_inicio_evento', 'hora_inicio_evento', 
                'fecha_termino_estimado_evento', 'hora_termino_estimado_evento',
                'fecha_termino_evento', 'hora_termino_evento', 
                'condicion_operativa', 'descripcion_evento'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_libro_relatorio_historial = $this->auto_increment( 'libro_relatorio_historial', 'id_libro_relatorio_historial' );
        $id_libro_relatorio = $post[ 'id_libro_relatorio' ][ 'valor' ];
        $numero_aero = $post[ 'numero_aero' ][ 'valor' ];
        
        $fecha_inicio_evento = $post[ 'fecha_inicio_evento' ][ 'valor' ];
        $hora_inicio_evento = $post[ 'hora_inicio_evento' ][ 'valor' ];         

        $fecha_termino_estimado_evento = $post[ 'fecha_termino_estimado_evento' ][ 'valor' ];
        $hora_termino_estimado_evento = $post[ 'hora_termino_estimado_evento' ][ 'valor' ];

        $fecha_termino_evento = $post[ 'fecha_termino_evento' ][ 'valor' ];
        $hora_termino_evento = $post[ 'hora_termino_evento' ][ 'valor' ];
        
        $condicion_operativa = $post[ 'condicion_operativa' ][ 'valor' ];
        $descripcion_evento = $post[ 'descripcion_evento' ][ 'valor' ];

        $sql =  
        "INSERT INTO libro_relatorio_historial".
        "( id_libro_relatorio_historial, id_libro_relatorio, ".
        "fecha_inicio_evento, hora_inicio_evento, ".
        "fecha_termino_estimado_evento, hora_termino_estimado_evento, ".
        "fecha_termino_evento, hora_termino_evento, ".
        "condicion_operativa, descripcion_evento ) ".
        "VALUES( $id_libro_relatorio_historial, $id_libro_relatorio, ".
        "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
        "'$hora_inicio_evento', ".
        "STR_TO_DATE( '$fecha_termino_estimado_evento', '%d-%m-%Y' ), ".
        "'$hora_termino_estimado_evento', ".        
        "STR_TO_DATE( '$fecha_termino_evento', '%d-%m-%Y' ), ".
        "'$hora_termino_evento', '$condicion_operativa', ".
        "'$descripcion_evento')";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query != 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar evento' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }

        # cerramos el evento si se ingresa un evento adicional como [DISPONIBLE]
        # si es cualquier otra condicion operativa simplemente agregamos
        $query = $condicion_operativa != 'DISPONIBLE' ?
        $this->__cambiar_estado_generador( $numero_aero, $condicion_operativa, $fecha_inicio_evento ) :        
        $this->__cerrar_evento ( $id_libro_relatorio, $fecha_termino_evento, $hora_termino_evento );

        if ( $query == 'OK' ) {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$fecha_evento, 'msj' => 'OK' );
            $this->conexion->commit();
            return $rsp;
        } else {
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $fecha_evento, 'msj' => 'Error al ingresar evento' );
            $this->conexion->rollback();
            return $rsp;
        }
    } 

    public function __cerrar_evento ( $id_libro_relatorio, $fecha_termino_evento, $hora_termino_evento ) {
        // $condicion_operativa = $data[ 'condicion_operativa' ];
        // $id_libro_relatorio = $data[ 'id_libro_relatorio' ];
        // $numero_aero = $data[ 'numero_aero' ];
        // $fecha = Carbon::now( 'America/Mexico_City' )->format( 'd-m-Y' );
        // $hora = Carbon::now( 'America/Mexico_City' )->toTimeString();
        // $conexion = $this->conexion;        

        # cerramos la orden de trabajo si se trata de un mantenimiento
        // if ( $condicion_operativa == 'MTTO' ) {
        //     $query = $this->__cerrar_orden_trabajo( $id_libro_relatorio, $fecha );
        //     if ( $query != 'OK' ) {
        //         $conexion->rollback();

        //         $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al cerrar evento' );
        //         $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
        //         return $rsp;
        //     }
        // }

        # Buscamos numero de aerogenerador
        $sql = "SELECT numero_aero FROM libro_relatorio WHERE id_libro_relatorio = $id_libro_relatorio";
        $numero_aero = $this->query( $sql, 'numero_aero', NULL );

        # cerramos el evento del libro relatorio
        $sql =  
        "UPDATE libro_relatorio ".
        "SET estado_evento = FALSE, ".
        "fecha_termino_evento = STR_TO_DATE( '$fecha_termino_evento', '%d-%m-%Y' ), ".
        "hora_termino_evento = '$hora_termino_evento' ".
        "WHERE id_libro_relatorio = '$id_libro_relatorio'";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query != 'OK' ) $query;

        # cambiamos el estado del generador para cambiar las graficas
        $query = $this->__cambiar_estado_generador( $numero_aero, 'DISPONIBLE', $fecha_termino_evento );
        if ( $query === 'OK' ) return "OK";

        else $query;
    }

    private function __cerrar_orden_trabajo ( $id_libro_relatorio, $fecha_realizada ) {
        # buscamos [id_orden_trabajo] del evento
        $sql = 
        "SELECT id_orden_trabajo FROM libro_relatorio ".
        "WHERE id_libro_relatorio = $id_libro_relatorio";
        $id_orden_trabajo = $this->query( $sql, 'id_orden_trabajo', NULL );

        # cerramos la programacion de orden de trabajo
        $sql =
        "UPDATE programacion_mtto ".
        "SET estado_asignado = 'FINALIZADO', ".
        "fecha_realizada = STR_TO_DATE( '$fecha_realizada', '%d-%m-%Y' ) ".
        "WHERE id_orden_trabajo = $id_orden_trabajo"; 
        $query = $this->insert_query( $sql );
        if ( $query !== 'OK' ) return $query;

        # buscamos toda la programacion de mantenimiento de
        # la orden de trabajo
        $sql = 
        "SELECT id_orden_trabajo FROM programacion_mtto ".
        "WHERE id_prog_mtto IN( ".
            "SELECT id_prog_mtto FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo ".
        ") ".
        "ORDER BY fecha_inicial ASC";
        $arr = $this->array_query( $sql, 'id_orden_trabajo', NULL );

        # buscamos la posicion de la orden
        $index = $this->indexof( $arr, $id_orden_trabajo );

        # recorremos la orden activa a la siguiente programacion
        # o de lo contrario cerramos completamente la orden
        # de trabajo
        if ( $index < (sizeof( $arr ) - 1) ) {
            $id_orden_trabajo = $index + 1;

            $sql =
            "UPDATE programacion_mtto ".
            "SET estado_asignado = 'ACTIVO', ".            
            "WHERE id_orden_trabajo = $id_orden_trabajo"; 
            $query = $this->insert_query( $sql );
            if ( $query !== 'OK' ) return $query;
        }

        else {

        }
    } 

    # nuevo_relatorio ----------------------

    public function nuevo_relatorio( $post ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'reporte_por', 'numero_unidad', 'id_libro_licencia',
                'hora_inicio_evento', 'fecha_inicio_evento', 'condicion_operativa',
                'trabajador_solicito', 'trabajador_autorizo', 'descripcion_evento'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $reporte_por = $post[ 'reporte_por' ][ 'valor' ];
        $condicion_operativa = $post[ 'condicion_operativa' ][ 'valor' ];
        $numero_unidad = $post[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $post[ 'numero_aero' ][ 'valor' ];            

        switch ( $condicion_operativa ) {
            case 'MTTO':
                $query = $this->__mantto_por_aero( $post, $numero_aero );
                if ( $query === 'OK' ) {
                    $this->conexion->commit();
                    $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                    $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                }

                else {
                    $this->conexion->rollback();
                    $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                    $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar mantenimiento.' );
                }                    
                break;                  
            default:
                if ( $reporte_por == 'AEROGENERADOR' ) {
                    $query = $this->__evento_por_aero( $post, $numero_aero, $condicion_operativa );
                    if ( $query === 'OK' ) {
                        $this->conexion->commit();
                        $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                        $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                    }

                    else {
                        $this->conexion->rollback();
                        $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                        $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar evento.' );
                    }
                }

                else if ( $reporte_por == 'UNIDAD' )
                    $rsp = $this->__evento_por_unidad( $post, $numero_unidad, $condicion_operativa );

                else $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Sin tipo de reporte especificado' );
                break;
        }

        return $rsp;
    }

    private function __evento_por_aero ( $data, $numero_aero, $condicion_operativa ){
        $id_libro_relatorio = $this->autoincrement( "select id_libro_relatorio from libro_relatorio order by id_libro_relatorio asc", 'id_libro_relatorio' );
        $reporte_por = $data[ 'reporte_por' ][ 'valor' ];
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];        
        $fecha_inicio_evento = $data[ 'fecha_inicio_evento' ][ 'valor' ];
        $hora_inicio_evento = $data[ 'hora_inicio_evento' ][ 'valor' ];
        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' ), " : 'NULL, ';

        $condicion_operativa = $data[ 'condicion_operativa' ][ 'valor' ];  
        // $mantto = $data[ 'condicion_operativa' ][ 'mantenimiento' ];         
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento = $data[ 'descripcion_evento' ][ 'valor' ];            

        $consecutivo_licencia = $data[ 'consecutivo_licencia' ][ 'valor' ];
        
        # verificamos si nos han enviado un consecutivo desde la 
        # interfaz del navegador
        if ( !empty( $consecutivo_licencia ) ) {
            # verificar que el consecutivo de licencia no se repita
            $check = $this->__unique_consecutivo_licencia( $id_libro_licencia, $consecutivo_licencia );
            if ( !$check ) return "Consecutivo de licencia ingresado previamente";
        }

        # si [consecutivo_licencia] es NULL asignamos 
        # automaticamente un consecutivo
        else 
            $consecutivo_licencia = $this->resolve_consecutivo_licencia( $id_libro_licencia );


        # verificamos si no se ha ingresado previamente
        $sql =  "SELECT numero_aero FROM libro_relatorio where estado_evento = TRUE AND numero_aero = '$numero_aero'";
        $arr = $this->array_query( $sql, 'numero_aero' );
        if ( !empty( $arr ) ) return 'Elemento ingresado previamente';

        # verificamos si trae numero consecutivo de licencia
        $sql = $trabajador_autorizo !== $this->root ?
        "INSERT INTO libro_relatorio".
        "( id_libro_relatorio, reporte_por, numero_aero, id_libro_licencia, condicion_operativa, ".
        "consecutivo_licencia, fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, ".
        "trabajador_solicito, trabajador_autorizo, descripcion_evento ) ".
        "VALUES( $id_libro_relatorio, '$reporte_por', ".
        "'$numero_aero', $id_libro_licencia, '$condicion_operativa', $consecutivo_licencia, ".
        "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', ".
        $fecha_termino_estimado."'$trabajador_solicito', '$trabajador_autorizo', '$descripcion_evento' )":

        "INSERT INTO libro_relatorio".
        "( id_libro_relatorio, reporte_por, numero_aero, id_libro_licencia, condicion_operativa, ".
        "consecutivo_licencia, fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, ".
        "trabajador_solicito, descripcion_evento ) ".
        "VALUES( $id_libro_relatorio, '$reporte_por', ".
        "'$numero_aero', $id_libro_licencia, '$condicion_operativa', $consecutivo_licencia, ".
        "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', ".
        $fecha_termino_estimado."'$trabajador_solicito', '$descripcion_evento' )";
        
        // return $sql;
        
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;
         
        $query = $this->__cambiar_estado_generador( $numero_aero, $condicion_operativa, $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        return 'OK';
    }

    private function __evento_por_unidad ( $data, $numero_unidad, $condicion_operativa ){
        # buscar todos los aeros de la unidad 
        $sql =  
            "SELECT numero_aero FROM aeros ".
            "WHERE numero_unidad = '$numero_unidad' AND ".
            "numero_aero NOT IN(".
                "SELECT numero_aero FROM libro_relatorio WHERE estado_evento = TRUE".
            ")";
        $arr = $this->array_query( $sql, 'numero_aero' );
        if ( empty( $arr ) ) # verificamos que no este vacio
            return array( 'status' => array( 'transaccion' => 'NA', 'msj' => 'Los elementos ya han sido ingresados.' ),
                'eventos' => array() 
            );

        $rsp = array( 'status' => array(), 'eventos' => array() );
        $flag = true;

        foreach ( $arr as $numero_aero ) {
            $query = $this->__evento_por_aero( $data, $numero_aero, $condicion_operativa );
            if ( $query === 'OK' ) $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            else
            {
                $flag = false;
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            }
        }

        $this->conexion->commit();

        $rsp [ 'status' ] = $flag ?
            array( 'transaccion' => 'OK', 'msj' => 'Elementos ingresados satisfactoriamente.' ):
            array( 'transaccion' => 'NA', 'msj' => 'Se han encontrado los siguientes eventos.' );

        return $rsp;
    }

    private function __mantto_por_aero ( $data, $numero_aero ){        
        $id_libro_relatorio = $this->autoincrement( "select id_libro_relatorio from libro_relatorio order by id_libro_relatorio asc", 'id_libro_relatorio' );
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];
        $fecha_inicio_evento = $data[ 'fecha_inicio_evento' ][ 'valor' ];

        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' )" : 'NULL';
        
        $hora_inicio_evento = $data[ 'hora_inicio_evento' ][ 'valor' ];          
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento = $data[ 'descripcion_evento' ][ 'valor' ];

        $mantto = $data[ 'condicion_operativa' ][ 'mantenimiento' ];
        $id_orden_trabajo = $mantto[ 0 ][ 'id_orden_trabajo' ];        
        $sin_licencia = $mantto[ 0 ][ 'sin_licencia' ];

        $consecutivo_licencia = $data[ 'consecutivo_licencia' ][ 'valor' ];
        
        # verificamos si nos han enviado un consecutivo desde la 
        # interfaz del navegador
        if ( !empty( $consecutivo_licencia ) ) {
            # verificar que el consecutivo de licencia no se repita
            $check = $this->__unique_consecutivo_licencia( $id_libro_licencia, $consecutivo_licencia );
            if ( !$check ) return "Consecutivo de licencia ingresado previamente";
        }

        # si [consecutivo_licencia] es NULL asignamos 
        # automaticamente un consecutivo
        else 
            $consecutivo_licencia = $this->resolve_consecutivo_licencia( $id_libro_licencia );

        # verificamos si no se ha ingresado previamente
        $sql =  "SELECT numero_aero FROM libro_relatorio where estado_evento = TRUE AND numero_aero = '$numero_aero'";
        $arr = $this->array_query( $sql, 'numero_aero' );
        if ( !empty( $arr ) )
            return 'Elemento ingresado previamente';

        # creamos consulta de inserción 
        switch ( $sin_licencia ) {
            case 'false':
                $sql = $trabajador_autorizo !== $this->root ?
                "insert into libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, trabajador_autorizo, id_orden_trabajo, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', '$trabajador_autorizo', ".
                "$id_orden_trabajo, '$descripcion_evento' )" :

                "insert into libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, id_orden_trabajo, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', ".
                "$id_orden_trabajo, '$descripcion_evento' )";
                break;
            
            case 'true':
                $sql = $trabajador_autorizo !== $this->root ?
                "INSERT INTO libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, trabajador_autorizo, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', ".
                "'$trabajador_autorizo', '$descripcion_evento' )" :

                "INSERT INTO libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', ".
                "'$descripcion_evento' )";
                break;
        }

        // return $sql;
        
        #insertamos un nuevo evento
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;

        # cambiamos la condicion operativa del generador
        $query = $this->__cambiar_estado_generador( $numero_aero, 'MTTO', $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        return 'OK';
    }

    private function __cambiar_estado_generador ( $gen, $estado, $fecha_operacion ){
        if ( empty( $gen ) ) return "Número de aerogenerador es nulo.";

        $sql =  "update aeros set estado_licencia = '$estado', ".
                "fecha_operacion = STR_TO_DATE( '$fecha_operacion', '%d-%m-%Y' ) ".
                " where numero_aero = '$gen'";

        // return $sql;

        $change_state = $this->insert_query( $sql );
        return $change_state;        
    }

    # resuelve y retorna el numero consecutivo de un evento
    private function resolve_consecutivo_licencia( $id_libro_licencia ) {
        #verificamos si existe un consecutivo inicializador
        # registrado en libro_licencia.inicializador
        $sql = 
        "SELECT inicializador FROM libro_licencia ".
        "WHERE id_libro_licencia = $id_libro_licencia";
        $init = $this->query( $sql, 'inicializador', NULL );

        # si es NULL el autoincrement inicializa
        # desde el ultimo registro        
        # si no es NULL el autoincrement inicializa
        # a partir del inicializador de la licencia
        
        if ( !empty( $init ) ) {
            $sql = 
            "SELECT consecutivo_licencia FROM libro_relatorio ".
            "WHERE id_libro_licencia = $id_libro_licencia ".
            "AND consecutivo_licencia >= $init ".
            "ORDER BY consecutivo_licencia ASC";

            $arr = $this->array_query( $sql, 'consecutivo_licencia', NULL );

            # si es NULL no existen registros a partir de ese
            # numero por lo tanto es el primer registro a partir
            # de dicho numero
            if ( !empty( $arr ) ) {
                return $arr[ sizeof( $arr ) - 1 ] + 1;
            }
            else return $init;
        }
        else {
            $sql =
            "SELECT consecutivo_licencia FROM libro_relatorio ".
            "WHERE id_libro_licencia = $id_libro_licencia ".
            "ORDER BY consecutivo_licencia ASC";
            return $this->autoincrement( $sql, 'consecutivo_licencia' );
        }            
    }

    private function __unique_consecutivo_licencia( $id_libro_licencia, $consecutivo_licencia ){
        $sql =
        "SELECT id_libro_relatorio FROM libro_relatorio ".
        "WHERE id_libro_licencia = $id_libro_licencia ".
        "AND consecutivo_licencia = $consecutivo_licencia";

        $query = $this->query( $sql, 'id_libro_relatorio', NULL );
        return empty( $query ) ? TRUE : FALSE;
    }

    # actualizar_relatorio ----------------------
    public function actualizar_relatorio( $post ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'id_libro_relatorio_update', 'id_libro_licencia',
                'hora_inicio_evento', 'fecha_inicio_evento', 'condicion_operativa',
                'trabajador_solicito', 'trabajador_autorizo', 'descripcion_evento'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        // return 'OK';
        //         
        $condicion_operativa = $post[ 'condicion_operativa' ][ 'valor' ];

        if ( $condicion_operativa == 'MTTO' ) {
            $query = $this->__update_mantto_por_aero( $post, $numero_aero );
            if ( $query === 'OK' ) {
                $this->conexion->commit();
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
            }

            else {
                $this->conexion->rollback();
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar mantenimiento.' );
            }  
        }

        else {
            // $query = $this->__update_evento_por_aero( $post, $numero_aero, $condicion_operativa );
            $query = $this->__update_evento_por_aero( $post, $condicion_operativa );
            if ( $query === 'OK' ) {
                $this->conexion->commit();
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
            }

            else {
                $this->conexion->rollback();
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar evento.' );
            }
        }
            
        return $rsp;
    }

    private function __update_evento_por_aero ( $data, $condicion_operativa ){
        $id_libro_relatorio_update = $data[ 'id_libro_relatorio_update' ][ 'valor' ];
        // $reporte_por = $data[ 'reporte_por' ][ 'valor' ];
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];        
        $fecha_inicio_evento = $data[ 'fecha_inicio_evento' ][ 'valor' ];
        $hora_inicio_evento = $data[ 'hora_inicio_evento' ][ 'valor' ];
        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' )" : 'NULL';

        $condicion_operativa = $data[ 'condicion_operativa' ][ 'valor' ]; 
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento = $data[ 'descripcion_evento' ][ 'valor' ];            

        $consecutivo_licencia = $data[ 'consecutivo_licencia' ][ 'valor' ];
        
        # verificamos si nos han enviado un consecutivo desde la 
        # interfaz del navegador.
        # si [consecutivo_licencia] es NULL asignamos 
        # automaticamente un consecutivo
        if ( empty( $consecutivo_licencia ) )
        $consecutivo_licencia = $this->resolve_consecutivo_licencia( $id_libro_licencia );

        # verificamos si es un usuario root para evitar el campo
        # [trabajador_autorizo] y dejarlo NULL
        $sql = $trabajador_autorizo !== $this->root ?
        "UPDATE libro_relatorio SET ".
        // "id_libro_relatorio = $id_libro_relatorio, ".
        // "reporte_por = '$reporte_por', ".
        // "numero_aero = '$numero_aero', ".
        "id_libro_licencia = $id_libro_licencia, ".
        "condicion_operativa = '$condicion_operativa', ".
        "consecutivo_licencia = $consecutivo_licencia, ".
        "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
        "hora_inicio_evento = '$hora_inicio_evento', ".
        "fecha_termino_estimado = $fecha_termino_estimado, ".
        "trabajador_solicito = '$trabajador_solicito', ".
        "trabajador_autorizo = '$trabajador_autorizo', ".
        "descripcion_evento = '$descripcion_evento', ".
        "id_orden_trabajo = NULL ".
        "WHERE id_libro_relatorio = $id_libro_relatorio_update":

        "UPDATE libro_relatorio SET ".
        // "id_libro_relatorio = $id_libro_relatorio, ".
        // "reporte_por = '$reporte_por', ".
        // "numero_aero = '$numero_aero', ".
        "id_libro_licencia = $id_libro_licencia, ".
        "condicion_operativa = '$condicion_operativa', ".
        "consecutivo_licencia = $consecutivo_licencia, ".
        "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
        "hora_inicio_evento = '$hora_inicio_evento', ".
        "fecha_termino_estimado = $fecha_termino_estimado, ".
        "trabajador_solicito = '$trabajador_solicito', ".
        "descripcion_evento = '$descripcion_evento', ".
        "id_orden_trabajo = NULL ".
        "WHERE id_libro_relatorio = $id_libro_relatorio_update";
        
        // return $sql;
        
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;

        # buscar el [numero_aero]
        $sql = "SELECT numero_aero from libro_relatorio WHERE id_libro_relatorio = $id_libro_relatorio_update";
        $numero_aero = $this->query( $sql, 'numero_aero', NULL );

        $query = $this->__cambiar_estado_generador( $numero_aero, $condicion_operativa, $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        return 'OK';
    }

    private function __update_mantto_por_aero ( $data, $numero_aero ){        
        $id_libro_relatorio_update = $data[ 'id_libro_relatorio_update' ][ 'valor' ];
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];
        $fecha_inicio_evento = $data[ 'fecha_inicio_evento' ][ 'valor' ];

        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' )" : 'NULL';
        
        $hora_inicio_evento = $data[ 'hora_inicio_evento' ][ 'valor' ];          
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento = $data[ 'descripcion_evento' ][ 'valor' ];

        $mantto = $data[ 'condicion_operativa' ][ 'mantenimiento' ];
        $id_orden_trabajo = $mantto[ 0 ][ 'id_orden_trabajo' ];        
        $sin_licencia = $mantto[ 0 ][ 'sin_licencia' ];

        $consecutivo_licencia = $data[ 'consecutivo_licencia' ][ 'valor' ];
        
        # verificamos si nos han enviado un consecutivo desde la 
        # interfaz del navegador.
        # si [consecutivo_licencia] es NULL asignamos 
        # automaticamente un consecutivo
        if ( empty( $consecutivo_licencia ) )
        $consecutivo_licencia = $this->resolve_consecutivo_licencia( $id_libro_licencia );

        # creamos consulta de inserción 
        switch ( $sin_licencia ) {
            case 'false':
                # NO ROOT
                $sql = $trabajador_autorizo !== $this->root ?
                "UPDATE libro_relatorio SET ".
                // "id_libro_relatorio = $id_libro_relatorio, ".
                // "numero_aero = '$numero_aero', ".
                "id_libro_licencia = $id_libro_licencia, ".
                "condicion_operativa = 'MTTO', ".
                "consecutivo_licencia = $consecutivo_licencia, ".
                "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
                "hora_inicio_evento = '$hora_inicio_evento', ".
                "fecha_termino_estimado = $fecha_termino_estimado, ".
                "trabajador_solicito = '$trabajador_solicito', ".
                "trabajador_autorizo = '$trabajador_autorizo', ".
                "id_orden_trabajo = $id_orden_trabajo, ".
                "descripcion_evento = '$descripcion_evento' ".
                "WHERE id_libro_relatorio = $id_libro_relatorio_update":

                # SI ROOT
                "UPDATE libro_relatorio SET ".
                // "id_libro_relatorio = $id_libro_relatorio, ".
                // "numero_aero = '$numero_aero', ".
                "id_libro_licencia = $id_libro_licencia, ".
                "condicion_operativa = 'MTTO', ".
                "consecutivo_licencia = $consecutivo_licencia, ".
                "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
                "hora_inicio_evento = '$hora_inicio_evento', ".
                "fecha_termino_estimado = $fecha_termino_estimado, ".
                "trabajador_solicito = '$trabajador_solicito', ".
                "id_orden_trabajo = $id_orden_trabajo, ".
                "descripcion_evento = '$descripcion_evento' ".
                "WHERE id_libro_relatorio = $id_libro_relatorio_update";
                break;
            
            case 'true':
                $sql = $trabajador_autorizo !== $this->root ?
                "UPDATE libro_relatorio SET ".
                // "id_libro_relatorio = $id_libro_relatorio, ".
                // "numero_aero = '$numero_aero', ".
                "id_libro_licencia = $id_libro_licencia, ".
                "condicion_operativa = 'MTTO', ".
                "consecutivo_licencia = $consecutivo_licencia, ".
                "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
                "hora_inicio_evento = '$hora_inicio_evento', ".
                "fecha_termino_estimado = $fecha_termino_estimado, ".
                "trabajador_solicito = '$trabajador_solicito', ".
                "trabajador_autorizo = '$trabajador_autorizo', ".
                "id_orden_trabajo = NULL, ".
                "descripcion_evento = '$descripcion_evento' ".
                "WHERE id_libro_relatorio = $id_libro_relatorio_update":

                "UPDATE libro_relatorio SET ".
                // "id_libro_relatorio = $id_libro_relatorio, ".
                // "numero_aero = '$numero_aero', ".
                "id_libro_licencia = $id_libro_licencia, ".
                "condicion_operativa = 'MTTO', ".
                "consecutivo_licencia = $consecutivo_licencia, ".
                "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
                "hora_inicio_evento = '$hora_inicio_evento', ".
                "fecha_termino_estimado = $fecha_termino_estimado, ".
                "trabajador_solicito = '$trabajador_solicito', ".
                "id_orden_trabajo = NULL, ".
                "descripcion_evento = '$descripcion_evento' ".
                "WHERE id_libro_relatorio = $id_libro_relatorio_update";
                break;
        }

        // return $sql;
        
        #insertamos un nuevo evento
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;

        # buscar el [numero_aero]
        $sql = "SELECT numero_aero from libro_relatorio WHERE id_libro_relatorio = $id_libro_relatorio_update";
        $numero_aero = $this->query( $sql, 'numero_aero', NULL );

        # cambiamos la condicion operativa del generador
        $query = $this->__cambiar_estado_generador( $numero_aero, 'MTTO', $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        return 'OK';
    }

    # -----------------------------------------------

    public function actualizar_evento_relatorio ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'id_libro_relatorio_historial',
                'fecha_inicio_evento', 'hora_inicio_evento', 
                'fecha_termino_estimado_evento', 'hora_termino_estimado_evento',
                'fecha_termino_evento', 'hora_termino_evento', 
                'descripcion_evento'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_libro_relatorio_historial = $post[ 'id_libro_relatorio_historial' ][ 'valor' ];
        
        $fecha_inicio_evento = $post[ 'fecha_inicio_evento' ][ 'valor' ];
        $hora_inicio_evento = $post[ 'hora_inicio_evento' ][ 'valor' ];         

        $fecha_termino_estimado_evento = $post[ 'fecha_termino_estimado_evento' ][ 'valor' ];
        $hora_termino_estimado_evento = $post[ 'hora_termino_estimado_evento' ][ 'valor' ];

        $fecha_termino_evento = $post[ 'fecha_termino_evento' ][ 'valor' ];
        $hora_termino_evento = $post[ 'hora_termino_evento' ][ 'valor' ];
        
        $descripcion_evento = $post[ 'descripcion_evento' ][ 'valor' ];

        $sql =  
        "UPDATE libro_relatorio_historial SET ".
        "fecha_inicio_evento = STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), ".
        "hora_inicio_evento = '$hora_inicio_evento', ".
        "fecha_termino_estimado_evento = STR_TO_DATE( '$fecha_termino_estimado_evento', '%d-%m-%Y' ), ".
        "hora_termino_estimado_evento = '$hora_termino_estimado_evento', ".
        "fecha_termino_evento = STR_TO_DATE( '$fecha_termino_evento', '%d-%m-%Y' ), ".
        "hora_termino_evento = '$hora_termino_evento', ".
        "descripcion_evento = '$descripcion_evento' ".
        "WHERE id_libro_relatorio_historial = $id_libro_relatorio_historial";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query == 'OK' ) {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento actualizado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'OK' );
            $this->conexion->commit();
            return $rsp;
        } else {
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => 'Error al actualizar evento' );
            $this->conexion->rollback();
            return $rsp;
        } 
    }

    public function obtener_historial_eventos( $get ) {
        $id_libro_relatorio = $get[ 'id_libro_relatorio' ];

        if ( empty( $id_libro_relatorio ) ) return null;
        
        // $sql =  
        // "SELECT id_libro_relatorio_historial, id_libro_relatorio, ".
        // "DATE_FORMAT(fecha_inicio_evento, '%d-%m-%Y' ) as fecha_inicio_evento, ".
        // "hora_inicio_evento, ".
        // "DATE_FORMAT(fecha_termino_estimado_evento, '%d-%m-%Y' ) as fecha_termino_estimado_evento, ".
        // "hora_termino_estimado_evento, ".        
        // "DATE_FORMAT(fecha_termino_evento, '%d-%m-%Y' ) as fecha_termino_evento, ".
        // "hora_termino_evento, condicion_operativa, descripcion_evento ".
        // "FROM libro_relatorio_historial ".
        // "WHERE id_libro_relatorio = $id_libro_relatorio";
        
        $sql =  
        "SELECT id_libro_relatorio_historial, ".
        "id_libro_relatorio, ".
        "DATE_FORMAT(fecha_inicio_evento, '%d-%m-%Y' ) as fecha_inicio_evento, ".
        "hora_inicio_evento, ".
        "DATE_FORMAT(fecha_termino_estimado_evento, '%d-%m-%Y' ) as fecha_termino_estimado_evento, ".
        "hora_termino_estimado_evento, ".
        "DATE_FORMAT(fecha_termino_evento, '%d-%m-%Y' ) as fecha_termino_evento, ".
        "hora_termino_evento, condicion_operativa, descripcion_evento ".
        "FROM libro_relatorio_historial ".
        "WHERE id_libro_relatorio = $id_libro_relatorio";

        // return $sql;

        $query = $this->array_query( $sql ); 
        return $query;
    }
    
    public function obtener_libro_relatorio ( $get ) {
        $option = $get[ 'option' ];

        $sql =  
        "SELECT t_a.numero_unidad, t_lr.reporte_por, ".
        "t_lr.id_orden_trabajo, ".
        "t_lr.numero_aero, t_lr.condicion_operativa, ".
        "t_lr.consecutivo_licencia, t_lr.descripcion_evento, ".
        "t_lr.id_libro_relatorio, t_lr.id_libro_licencia, ".
        "fecha_inicio_evento, t_lr.hora_inicio_evento, ".
        "fecha_termino_evento, t_lr.hora_termino_evento, ".
        "DATE_FORMAT( fecha_termino_estimado, '%d-%m-%Y' ) as fecha_termino_estimado, ".
        "t_lr.trabajador_solicito, t_lr.trabajador_autorizo ".
        "FROM aeros t_a INNER JOIN libro_relatorio t_lr ".
        "ON t_a.numero_aero = t_lr.numero_aero ";

        switch ( $option ) {
            case 'rango_fechas': # retorna reportes dentro de un rango de fechas
                $fecha_inf = $get[ 'fecha_inf' ];
                $fecha_sup = $get[ 'fecha_sup' ];
                $estado_evento = $get[ 'estado_evento' ];

                # verifica si es un reporte activo, terminado o ambos [default ambos]
                # opciones: [true, false, null]
                switch ( $estado_evento ) {
                    case 'true': # reportes activos
                        $sql.= "WHERE estado_evento = true "; 
                        break;

                    case 'false': # reportes terminandos
                        $sql.= "WHERE estado_evento = false ";
                        empty( $fecha_inf ) ? # si fecha_inf está vacia busca todas los reportes existentes hasta la fecha superior
                            $sql.= "AND t_lr.fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ": 
                            $sql.= "AND t_lr.fecha_termino_evento >= STR_TO_DATE( '$fecha_inf', '%d-%m-%Y' ) AND ".
                                   "t_lr.fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ";
                        break;

                    default: # reportes activos y terminados
                        $sql.=  "WHERE ";
                        
                        empty( $fecha_inf ) ? # si fecha_inf está vacia busca todas los reportes existentes hasta la fecha superior
                            $sql.=  "( t_lr.id_libro_relatorio IN ".
                                    "(SELECT id_libro_relatorio FROM libro_relatorio ".
                                    "WHERE estado_evento = false ".
                                    "AND fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' )) OR estado_evento = true ) ": 

                            $sql.=  "( t_lr.id_libro_relatorio IN ".
                                    "(SELECT id_libro_relatorio FROM libro_relatorio ".
                                    "WHERE estado_evento = false ".
                                    "AND fecha_termino_evento >= STR_TO_DATE( '$fecha_inf', '%d-%m-%Y' ) ".
                                    "AND fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' )) OR estado_evento = true )";
                        break; # si estado_evento está vacio selecciona reportes activos y terminados
                }        

                # añadiendo filtros extras
                $option2 = $get[ 'option2' ];
                switch ( $option2 ) {
                    case 'numero_unidad':
                        $numero_unidad = $get[ 'numero_unidad' ];
                        $sql.= "AND numero_unidad = '$numero_unidad' ";
                        break;
                    
                    default: break; # si es nulo lo omitimos
                }
                // return $sql;
                break;

            case 'activos': # retorna todos los reportes activos
                $dia_reporte = $get[ 'dia_reporte' ];
                $sql .= "WHERE t_lr.fecha_termino_evento IS NULL AND t_lr.fecha_termino_evento IS NULL ".
                        "AND estado_evento = TRUE ";
                break;
            
            default: return array();        
                break;
        }

        $sql .= "ORDER BY t_a.numero_unidad ASC, t_a.numero_aero ASC";

        // return $sql;

        $query = $this->array_query( $sql );
        $arr = array();        

        # calculamos las horas para cada evento
        foreach ( $query as $val ) {
            $fecha_termino_evento = $val [ 'fecha_termino_evento' ];
            $hora_termino_evento = $val [ 'hora_termino_evento' ];
            $estado_evento = $val [ 'estado_evento' ]; 

            $id_libro_licencia = $val[ 'id_libro_licencia' ];
            $consecutivo_licencia = $val[ 'consecutivo_licencia' ];

            if( empty( $fecha_termino_evento ) 
                && empty( $hora_termino_evento ) ) { // si el evento no esta finalizado

                $fecha_inicio = Carbon::parse( $val[ 'fecha_inicio_evento' ]." ".$val[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                $fecha_final = $dia_reporte != '7AM' ?
                    Carbon::now( 'America/Mexico_City' ): # el dia de hoy desde las 00:00 hasta la hora del instante
                    Carbon::parse( Carbon::now()->toDateString()." "."07:00:00" ,'America/Mexico_City' ); # el dia de hoy desde las 00:00 hasta las 7:00 A.M.

                #------------

                $val[ 'horas_dia_reporte' ] = $fecha_final->format( 'H:i' ).":00"; 

                #------------

                $horas = $fecha_inicio->diffInHours( $fecha_final, false );
                $min_total = $fecha_final->diffInMinutes( $fecha_inicio );
                $min = $min_total % 60;
                $val[ 'horas_acumuladas_evento' ] = $horas.':'.$min;
            }

            else { // si el evento esta finalizado            
                $val[ 'fecha_termino_evento' ] = Carbon::parse( $fecha_termino_evento, 'America/Mexico_City' )->format( 'd-m-Y' );
                $val[ 'horas_dia_reporte' ] = null;

                #------------

                $fecha_inicio = Carbon::parse( $val[ 'fecha_inicio_evento' ]." ".$val[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                $fecha_final = Carbon::parse( $val[ 'fecha_termino_evento' ]." ".$val[ 'hora_termino_evento' ], 'America/Mexico_City' );

                $horas = $fecha_final->diffInHours( $fecha_inicio );
                $min_total = $fecha_final->diffInMinutes( $fecha_inicio );
                $min = $min_total % 60;
                $val[ 'horas_acumuladas_evento' ] = $horas.':'.$min;
            }

            $val[ 'fecha_inicio_evento' ] = Carbon::parse( $val[ 'fecha_inicio_evento' ], 'America/Mexico_City' )->format( 'd-m-Y' );
            $val[ 'numero_licencia' ] = $this->__get_numero_licencia( $id_libro_licencia, $consecutivo_licencia );

            $arr[] = $val;
        }

        return $arr;
    }

    private function __get_numero_licencia ( $id_libro_licencia, $consecutivo_licencia ) {
        if ( empty( $consecutivo_licencia ) ) return NULL;

        $sql = 
        "SELECT anio_licencia FROM libro_licencia ".
        "WHERE id_libro_licencia = $id_libro_licencia";
        $query = $this->query( $sql, 'anio_licencia', NULL );
        return $query.'-'.$consecutivo_licencia;
    }

    public function imprimir ( $get ) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de Mantenimiento' );
        $pdf->SetSubject('');
        $pdf->SetKeywords('');

        // set default header data
        $pdf->SetHeaderData( 
            PDF_HEADER_LOGO, 
            30, 
            'GERENCIA REGIONAL DE PRODUCCION SURESTE SUBGERENCIA REGIONAL HIDROELECTRICA GRIJALVA', 
            'C.E. LA VENTA'
        );

        // set header and footer fonts
        $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        // $pdf->SetFont('helvetica', '', 8);
        $pdf->SetFont('courier', '', 8);

        // add a page
        $pdf->AddPage('L', 'A4');

        # estructuring data for pdf
        $datos = $this->obtener_libro_relatorio( $get );
        $i = 0;

        foreach ( $datos as $row ) {
            $id_libro_relatorio = $row[ 'id_libro_relatorio' ];
            $sql =
                "SELECT descripcion_evento, ".
                "DATE_FORMAT( fecha_inicio_evento, '%d-%m-%Y') AS fecha_inicio_evento, ".
                "DATE_FORMAT( fecha_termino_evento, '%d-%m-%Y') AS fecha_termino_evento, ".
                "hora_inicio_evento, hora_termino_evento, condicion_operativa ".
                "FROM libro_relatorio_historial ".
                "WHERE id_libro_relatorio = $id_libro_relatorio ".
                "ORDER BY fecha_inicio_evento ASC, hora_inicio_evento ASC";

            $string = 
                $row[ 'descripcion_evento' ]."<br><br><b>HISTORIAL:</b><br><br>";
            $query = $this->array_query( $sql );

            if ( !empty( $query ) ) {
                foreach ( $query as $log ) {
                    $string .= 
                        "INICIO: <br>".
                        $log[ 'fecha_inicio_evento' ]." ".$log[ 'hora_inicio_evento' ]."<br>".
                        
                        "TERMINO: <br>".
                        $log[ 'fecha_termino_evento' ]." ".$log[ 'hora_termino_evento' ]."<br>".

                        "CONDICION OPERATIVA: ".$log[ 'condicion_operativa' ]."<br>".
                        
                        "DESCRIPCIÓN: <br>".
                        $log[ 'descripcion_evento' ]."<br><br>";
                }
                $datos[ $i ][ 'descripcion_evento' ] = $string;
            }
            else {
                $datos[ $i ][ 'descripcion_evento' ] = $string;
            }
            $i++;
        }

        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'NO. UNIDAD', 'campo'=> 'numero_unidad', 'x'=>50 ),
                    array( 'titulo' => 'NO. AEREO', 'campo'=> 'numero_aero', 'x'=>50 ),
                    array( 'titulo' => 'CONDICION', 'campo'=> 'condicion_operativa', ),
                    array( 'titulo' => 'NO. LICENCIA', 'campo', '', 'x'=>70 ),
                    array( 'titulo' => 'REPORTE DE EVENTO', 'campo'=> 'descripcion_evento', 'x'=>175 ),
                    array( 'titulo' => 'FECHA INICIO EVENTO', 'campo'=> 'fecha_inicio_evento'  ),
                    array( 'titulo' => 'HORA INICIO EVENTO', 'campo'=> 'hora_inicio_evento'  ),
                    array( 'titulo' => 'FECHA ESTIMADA', 'campo'=> ''  ),
                    array( 'titulo' => 'FECHA TERMINO', 'campo'=> 'fecha_termino_evento'  ),
                    array( 'titulo' => 'HORA TERMINO', 'campo'=> 'hora_termino_evento'  ),
                    array( 'titulo' => 'HORAS DEL DIA', 'campo'=> '', 'x'=>60 ),
                    array( 'titulo' => 'HORAS ACUMULADAS', 'campo'=> 'horas_acumuladas_evento', 'x'=>70 )
                ), 

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Mantenimiento.pdf', 'I');
    } 

    public function eliminar_libro_relatorio ( $get ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'id_libro_relatorio'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_libro_relatorio = $get[ 'id_libro_relatorio' ];

        # eliminar el historial de eventos secundarios
        // $sql =
        // "DELETE FROM libro_relatorio_historial ".
        // "WHERE id_libro_relatorio = $id_libro_relatorio";

        // $query = $this->insert_query( $sql );
        // if ( $query !== 'OK' ) {
        //     $this->conexion->rollback();
        //     $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar historial' );
        //     $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'id_libro_relatorio', 'msj' => $query );
        //     return $rsp;
        // }

        $sql =
        "DELETE FROM libro_relatorio ".
        "WHERE id_libro_relatorio = $id_libro_relatorio";

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Evento eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar Evento' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'id_libro_relatorio', 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_libro_relatorio_historial ( $get ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'id_libro_relatorio_historial'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        # eliminamos el evento
        $id_libro_relatorio_historial = $get[ 'id_libro_relatorio_historial' ];
        $sql = 
        "DELETE FROM libro_relatorio_historial ".
        "WHERE id_libro_relatorio_historial = $id_libro_relatorio_historial";        
        $query = $this->insert_query( $sql );

        # buscamos el id_libro_relatorio para resolver el estado del
        # generador
        $sql = 
        "SELECT id_libro_relatorio FROM libro_relatorio ".
        "WHERE id_libro_relatorio_historial = $id_libro_relatorio_historial";
        $id_libro_relatorio = $this->query( $sql, 'id_libro_relatorio', NULL );

        # resolvemos la 

        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Evento adicional eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar Evento adicional.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'id_libro_relatorio', 'msj' => $query );
            return $rsp;
        }
    }

    # verifica si existen relatorios asociados a un año especifico
    // public function verifica_anio_licencia ( $id_libro_licencia ) {
    //     if ( empty( $consecutivo_licencia ) ) return NULL;

    //     $sql =
    //     "SELECT anio_licencia FROM libro_licencia ".
    //     "WHERE id_libro_licencia = $id_libro_licencia";
        
    //     $query = $this->query( $sql, 'anio_licencia', NULL );
    //     return !empty( $query ) ? 'OK' : NULL;
    // }  
}