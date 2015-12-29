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
				
			case 'imprimir_reporte_periodo':
                $query = $this->imprimir_reporte_periodo( $get );
                echo json_encode( $query );
                break;
			
			case 'exportar_reporte_periodo':
                $query = $this->exportar_reporte_periodo( $get );
                echo json_encode( $query );
                break;

            case 'exportar_reporte_orden_trabajo_programado':
                $q = $this->exportar_reporte_orden_trabajo_programado( $get );
                echo json_encode( $q );
                break;

            case 'imprimir_reporte_orden_trabajo':
                $query = $this->imprimir_reporte_orden_trabajo( $get );
                echo json_encode( $query );
                break; 

            case 'imprimir_reporte_orden_trabajo_programado':
                $q = $this->imprimir_reporte_orden_trabajo_programado( $get );
                echo json_encode( $q );
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

            case 'obtener_libro_relatorio_orden_trabajo':
                $query = $this->obtener_libro_relatorio_orden_trabajo($get);
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

        # recalculamos las programaciones
        $this->__reprogramacion_fecha();

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
        } else {
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $fecha_evento, 'msj' => 'Error al ingresar evento' );
            $this->conexion->rollback();            
        }

        return $rsp;
    } 

    public function __cerrar_evento ( $id_libro_relatorio, $fecha_termino_evento, $hora_termino_evento ) {
        # Buscamos numero de aerogenerador e investigamos si
        # el evento que tiene asociada una orden de trabajo
        # para que sea cerrada tambien.
        $sql = "SELECT numero_aero, condicion_operativa FROM libro_relatorio WHERE id_libro_relatorio = $id_libro_relatorio";
        $query = $this->query( $sql );
        $numero_aero = $query[ 'numero_aero' ];
        $condicion_operativa = $query[ 'condicion_operativa' ];

        # cerramos el evento del libro relatorio
        $sql =  
        "UPDATE libro_relatorio ".
        "SET estado_evento = FALSE, ".
        "fecha_termino_evento = STR_TO_DATE( '$fecha_termino_evento', '%d-%m-%Y' ), ".
        "hora_termino_evento = '$hora_termino_evento' ".
        "WHERE id_libro_relatorio = '$id_libro_relatorio'";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query != 'OK' ) return $query;

        # si la condicion operativa es del tipo MANTENIMIENTO
        if ( $condicion_operativa == 'MTTO' ) {
            $query = $this->__cerrar_orden_trabajo( $id_libro_relatorio, $fecha_termino_evento );
            if ( $query !== 'OK' ) return $query;
        }

        # cambiamos el estado del generador para cambiar las graficas
        $query = $this->__cambiar_estado_generador( $numero_aero, 'DISPONIBLE', $fecha_termino_evento );
        if ( $query === 'OK' ) return "OK";

        else $query;
    }

    private function __cerrar_orden_trabajo ( $id_libro_relatorio, $fecha_realizada ) {
        # buscamos [id_orden_trabajo, id_orden_reprog] del evento
        # en la tabla [libro_relatorio]
        $sql = 
        "SELECT ".
            "pm.id_orden_trabajo, pm.id_orden_reprog, ".
            "pm.id_prog_mtto ".
        "FROM libro_relatorio lr ".
        "INNER JOIN programacion_mtto pm ".
        "ON lr.id_orden_trabajo = pm.id_orden_trabajo ".
        "WHERE lr.id_libro_relatorio = $id_libro_relatorio";
        // return $sql;
        
        $query                     = $this->query( $sql );
        $id_orden_trabajo          = $query[ 'id_orden_trabajo' ];
        $id_orden_trabajo_original = $this->__retorna_id_orden_trabajo_original( $id_orden_trabajo );
        $id_orden_reprog           = $query[ 'id_orden_reprog' ];
        $id_prog_mtto              = $query[ 'id_prog_mtto' ];

        # si el libro relatorio esta en MTTO y no tiene asociada
        # una orden de trabajo, es porque se autorizó sin licencia
        # asi que cerramos
        if ( empty( $id_orden_trabajo ) ) return 'OK';

        ##########################################################

        # verificamos que todas las actividades de la lista de
        # verificacion fueros hechas y tienen datos
        // $query = $this->__verificar_datos_actividad( $id_prog_mtto );
        // if ( $query !== 'OK' ) return $query;

        ##########################################################

        # buscamos la orden de trabajo mas proxima
        # para activarla
        $sql = 
        "SELECT id_orden_trabajo, id_prog_mtto ".
        "FROM programacion_mtto ".
        # filtramos todas las ordenes de trabajo con [id_prog_mtto]
        # y asi obtener el bloque completo de la programacion
        "WHERE id_prog_mtto IN( ".
            "SELECT id_prog_mtto ".
            "FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo ".
        ") ".
        # buscamos del bloque de programaciones a la siguiente orden 
        # de trabajo que tiene una fecha mayor a la orden que se
        # encuentra [ACTIVA]
        "AND fecha_inicial > ( ".
            "SELECT fecha_inicial ".
            "FROM programacion_mtto ".
            "WHERE estado_asignado = 'ACTIVO' ".
            "AND id_orden_reprog = $id_orden_reprog ".
        ") ".
        # y que ademas no sea una orden que se encuentre con el 
        # estatus: [REPROGRAMADA, ACTIVA, FINALIZADA]
        "AND estado_asignado IS NULL ".
        "ORDER BY fecha_inicial ASC ".
        "LIMIT 1";

        // return $sql;        
        $next_orden = $this->query( $sql, 'id_orden_trabajo', NULL );

        # cerramos la programacion de orden de trabajo
        # Rastreamos el id_orden_trabajo desde el campo id_orden_reprog
        # en el caso de que la orden de trabajo haya sido reprogramada
        # y asi no cerrar la orden de trabajo equivocada
        $sql =
        "UPDATE programacion_mtto ".        
        "SET fecha_realizada = STR_TO_DATE( '$fecha_realizada', '%d-%m-%Y' ), ".
        "estado_asignado = 'FINALIZADO' ".
        "WHERE estado_asignado = 'ACTIVO' ".
        "AND id_orden_reprog = $id_orden_trabajo_original";

        // return $sql;
        $query = $this->insert_query( $sql );
        if ( $query !== 'OK' ) return $query;

        # si existe una siguiente programacion la activamos
        # o de lo contrario cerramos completamente la orden
        # de trabajo
        if ( !empty( $next_orden ) ) {
            // $id_orden_trabajo = $next_orden;

            $sql =
            "UPDATE programacion_mtto ".
            "SET estado_asignado = 'ACTIVO', ".
            "id_orden_reprog = $next_orden ".
            "WHERE id_orden_trabajo = $next_orden"; 
            // return $sql;
            return $this->insert_query( $sql );
        }

        # Cerramos la orden de trabajo completa
        else {
            $sql =
            "SELECT id_prog_mtto FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo";
            $id_prog_mtto = $this->query( $sql, 'id_prog_mtto', NULL );

            $sql =
            "UPDATE orden_trabajo ".
            "SET estado_asignado = 'FINALIZADO' ".
            "WHERE id_prog_mtto = $id_prog_mtto";
            // return $sql;
            return $this->insert_query( $sql );
        }
    }

    # verifica que el tipo de mantenimiento tenga una
    # lista de verificacion asociada con actividades 
    # registradas por lo menos 1 actividad
    private function __verificar_lista_verificacion_mtto () {

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
            $rsp[ 'status' ]    = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ]   = $validar[ 'eventos' ];
            return $rsp;
        }

        $reporte_por            = $post[ 'reporte_por' ][ 'valor' ];
        $condicion_operativa    = $post[ 'condicion_operativa' ][ 'valor' ];
        $numero_unidad          = $post[ 'numero_unidad' ][ 'valor' ];
        $numero_aero            = $post[ 'numero_aero' ][ 'valor' ];            

        switch ( $condicion_operativa ) {
            case 'MTTO':
                $query = $this->__mantto_por_aero( $post, $numero_aero );
                if ( $query === 'OK' ) {
                    $this->conexion->commit();
                    $rsp [ 'eventos' ][]    = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                    $rsp [ 'status' ]       = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                }

                else {
                    $this->conexion->rollback();
                    $rsp [ 'eventos' ][]    = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                    $rsp [ 'status' ]       = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar mantenimiento.' );
                }                    
                break;                  
            default:
                if ( $reporte_por == 'AEROGENERADOR' ) {
                    $query = $this->__evento_por_aero( $post, $numero_aero, $condicion_operativa );
                    if ( $query === 'OK' ) {
                        $this->conexion->commit();
                        $rsp [ 'eventos' ][]    = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                        $rsp [ 'status' ]       = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                    }

                    else {
                        $this->conexion->rollback();
                        $rsp [ 'eventos' ][]    = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                        $rsp [ 'status' ]       = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar evento.' );
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
        $id_libro_relatorio     = $this->auto_increment( 'libro_relatorio', 'id_libro_relatorio' );
        $id_libro_licencia      = $data[ 'id_libro_licencia' ][ 'valor' ];
        $fecha_inicio_evento    = $data[ 'fecha_inicio_evento' ][ 'valor' ];

        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' )" : 'NULL';
        
        $hora_inicio_evento     = $data[ 'hora_inicio_evento' ][ 'valor' ];          
        $trabajador_solicito    = $data[ 'trabajador_solicito' ][ 'valor' ];
        $trabajador_autorizo    = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento     = $data[ 'descripcion_evento' ][ 'valor' ];

        $mantto                 = $data[ 'condicion_operativa' ][ 'mantenimiento' ];
        $id_orden_trabajo       = $mantto[ 0 ][ 'id_orden_trabajo' ];        
        $sin_licencia           = $mantto[ 0 ][ 'sin_licencia' ];
        $consecutivo_licencia   = $data[ 'consecutivo_licencia' ][ 'valor' ];
        
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
                # el usuario [root] no es un usuario registrado
                # en la db [laventa_cfe] por lo tanto no puede
                # crear relatorios
                $sql = $trabajador_autorizo !== $this->root ?
                "INSERT INTO libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, trabajador_autorizo, id_orden_trabajo, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', '$trabajador_autorizo', ".
                "$id_orden_trabajo, '$descripcion_evento' )" :

                "INSERT INTO libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, consecutivo_licencia, ".
                "fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, trabajador_solicito, id_orden_trabajo, ".
                "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $consecutivo_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', $fecha_termino_estimado, '$trabajador_solicito', ".
                "$id_orden_trabajo, '$descripcion_evento' )";
                break;
            
            case 'true':
                # el usuario [root] no es un usuario registrado
                # en la db [laventa_cfe] por lo tanto no puede
                # crear relatorios
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

        $query = $this->__asignar_orden_trabajo_personal
                            ( $id_orden_trabajo, $id_libro_relatorio );
        if ( $query != 'OK' ) return $query;

        # cambiamos la condicion operativa del generador
        $query = $this->__cambiar_estado_generador
                            ( $numero_aero, 'MTTO', $fecha_inicio_evento );
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

    # asocia la tabla [orden_trabajo_personal] con un
    # [id_libro_relatorio] de tal manera que la orden de trabajo
    # tenga usuario para realizar el mantenimiento
    # 
    # En caso que aun no existan usuarios para la orden de trabajo
    # el sistema no limitará la creacion del reporte libro relatorio
    private function __asignar_orden_trabajo_personal( $id_orden_trabajo, $id_libro_relatorio ) {
        # verificamos que existan usuarios asignado
        $sql =
        "SELECT usuario FROM orden_trabajo_personal ".
        "WHERE id_libro_relatorio IS NULL ".
        "AND id_prog_mtto = ( ".
            "SELECT id_prog_mtto FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo ".
        ")";

        // return $sql;
        $query = $this->array_query( $sql );

        # para esta orden de trabajo si no existen
        # usuario saltamos la asignacion 
        if ( empty( $query ) ) 
            return  'No existen trabajadores asignados al mantenimiento. '.
                    'Verifique la programación.';
        
        # Asignamos el [id_libro_relatorio] a la tabla
        # [orden_trabajo_personal] y asi enlazar la orden de
        # trabajo al usuario y las pueda descargar
        $sql =
        "UPDATE orden_trabajo_personal ".
        "SET id_libro_relatorio = $id_libro_relatorio ".
        "WHERE id_libro_relatorio IS NULL ".
        "AND id_prog_mtto = ( ".
            "SELECT id_prog_mtto FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo ".
        ")";
        
        return $this->insert_query( $sql );
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
        $id_libro_licencia         = $data[ 'id_libro_licencia' ][ 'valor' ];
        $fecha_inicio_evento       = $data[ 'fecha_inicio_evento' ][ 'valor' ];
        
        $fecha_termino_estimado = $data[ 'fecha_termino_estimado' ][ 'valor' ];
        $fecha_termino_estimado = !empty( $fecha_termino_estimado ) ? 
            "STR_TO_DATE( '$fecha_termino_estimado', '%d-%m-%Y' )" : 'NULL';
        
        $hora_inicio_evento  = $data[ 'hora_inicio_evento' ][ 'valor' ];          
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento  = $data[ 'descripcion_evento' ][ 'valor' ];

        $mantto           = $data[ 'condicion_operativa' ][ 'mantenimiento' ];
        $id_orden_trabajo = $mantto[ 0 ][ 'id_orden_trabajo' ];        
        $sin_licencia     = $mantto[ 0 ][ 'sin_licencia' ];

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

    // -----------------------------------------------------------------------------------
    //   17-Sep-2015 julioe
    // -----------------------------------------------------------------------------------
    public function obtener_libro_relatorio_orden_trabajo ( $get ) {
        $tipo_orden_trabajo = $get[ 'tipo_orden_trabajo' ];
        $fecha_inf = $get[ 'fecha_inf' ];
        $fecha_sup = $get[ 'fecha_sup' ];
        $estado_evento = $get[ 'estado_evento' ];
        $aeros = $get[ 'aeros' ];
        $aeros = !is_array($aeros) ? explode(",", $aeros) : $aeros; 
            $sql =  
            "SELECT ".
                "ot.id_prog_mtto,ot.numero_orden,ot.trabajo_solicitado,a.numero_unidad,ot.id_aero, ".
                // "pm.fecha_inicial fecha_prog," .
                "DATE_FORMAT(pm.fecha_inicial, '%d-%m-%Y') AS fecha_prog, ".
                // "DATE_FORMAT(pm.fecha_final, '%d-%m-%Y') AS fecha_final, ".
                "pm.fecha_final, ".
                "'horas_prog' horas_prog,".
                "lr.fecha_inicio_evento,lr.hora_inicio_evento, ".
                "lr.fecha_termino_evento,lr.hora_termino_evento,".
                "'horas_reales' horas_reales,pm.estado_asignado,lr.descripcion_evento,lr.id_libro_relatorio ".
            "FROM orden_trabajo ot ". 
            "INNER JOIN programacion_mtto pm ON (pm.id_prog_mtto = ot.id_prog_mtto) ".
            "INNER JOIN aeros a ON (a.numero_aero=ot.id_aero) ".
            "INNER JOIN libro_relatorio lr ON (pm.id_orden_trabajo=lr.id_orden_trabajo) ";

            $sql.=  "WHERE ";
                        
            empty( $fecha_inf ) ? # si fecha_inf está vacia busca todas los reportes existentes hasta la fecha superior
            $sql.= "pm.fecha_inicial <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) " : 
            $sql.= "pm.fecha_inicial >= STR_TO_DATE( '$fecha_inf', '%d-%m-%Y' ) ".
               "AND pm.fecha_inicial <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ";
            $sql.= "AND ot.id_aero IN ('" . implode("','", $aeros) ."') ";
            //---------------------------------------------
            switch ( $tipo_orden_trabajo ) {
                case 'PROGRAMADAS':
                    $sql.= "AND (pm.estado_asignado='ACTIVO') ";
                    break;
                case 'REPROGRAMADAS':
                    $sql.= "AND (pm.estado_asignado='REPROGRAMADO') ";
                    break;
                case 'TERMINADAS':
                    $sql.= "AND (pm.estado_asignado='FINALIZADO') ";
                    break;
                default: // 'TODAS'
                    //$sql.= "AND (pm.estado_asignado='FINALIZADO') ";
                    break;
            }
        
            $sql .= "ORDER BY a.numero_unidad ASC, ot.id_aero ASC";
        
            // return $sql;
        $query = $this->array_query( $sql );
        $arr = array();        

        // return $query;
        $tiempo_muerto_horas=0;
        $tiempo_muerto_minutos=0;
        # calculamos las horas para cada evento
        
        $rw[][]="";
        $corte_aero_hp=0;
        $corte_aero_hr=0;
        $corte_unidad_hp=0;
        $corte_unidad_hr=0;
        $total_hp=0;
        $total_hr=0;
        $temp_aero=$query[0]['id_aero'];
        $temp_unidad=$query[0]['numero_unidad'];
        
        foreach ($query as $val)
        {
            if($temp_aero!=$val['id_aero'])
            {
                $rw[++$i]['numero_unidad']      ="";
                $rw[$i]['id_aero']              ="";
                $rw[$i]['fecha_prog']           ="";
                $rw[$i]['numero_orden']         ="";
                $rw[$i]['fecha_inicio_evento']  ="Corte Aero:";
                $rw[$i]['horas_prog']           =$corte_aero_hp;
                $rw[$i]['horas_reales']         =$corte_aero_hr;
                $arr[] = $rw[$i];
                $corte_aero_hp=0;
                $corte_aero_hr=0;
                $temp_aero=$val['id_aero'];
                $i++;
            }
            if($temp_unidad!=$val['numero_unidad'])
            {
                $rw[++$i]['numero_unidad']      ="";
                $rw[$i]['id_aero']              ="";
                $rw[$i]['fecha_prog']           ="";
                $rw[$i]['numero_orden']         ="";
                $rw[$i]['fecha_inicio_evento']  ="Corte Unidad:";
                $rw[$i]['horas_prog']           =$corte_unidad_hp;
                $rw[$i]['horas_reales']         =$corte_unidad_hr;
                $arr[] = $rw[$i];
                $corte_unidad_hp=0;
                $corte_unidad_hr=0;
                $temp_unidad=$val['numero_unidad'];
                $i++;
            }
            $fecha_inicio = Carbon::parse( $val[ 'fecha_prog' ]." 00:00:00", 'America/Mexico_City' );
            $fecha_final = Carbon::parse( $val[ 'fecha_final' ]." 00:00:00", 'America/Mexico_City' );
            $horas_prog = $fecha_final->diffInHours( $fecha_inicio );
            $val['horas_prog']=$horas_prog;
            
            $fecha_inicio = Carbon::parse( $val[ 'fecha_inicio_evento' ]." ".$val[ 'hora_inicio_evento' ], 'America/Mexico_City' );
            $fecha_final = $val['fecha_termino_evento'];
            $hora_final = $val['hora_termino_evento'];
            if(empty($fecha_final) && empty($hora_final))
            {
                $fecha_final = Carbon::now( 'America/Mexico_City' );
                $val['fecha_termino_evento']="ABIERTO";
                $val['hora_termino_evento']="ABIERTO";
            }
            else
            {
                $fecha_final = Carbon::parse( $val[ 'fecha_termino_evento' ]." ".$val[ 'hora_termino_evento' ], 'America/Mexico_City' );
            }
            $horas_reales = $fecha_final->diffInHours( $fecha_inicio );
            $min_reales   = $fecha_final->diffInMinutes( $fecha_inicio );
            $min = $min_reales % 60;
            $val[ 'horas_reales' ] = $horas_reales.':'. (($min<10) ? '0'.$min : $min);
            
            $rw[$i]['id_libro_relatorio']   =$val['id_libro_relatorio'];
            $rw[$i]['id_prog_mtto']         =$val['id_prog_mtto'];
            $rw[$i]['numero_unidad']        =$val['numero_unidad'];
            $rw[$i]['id_aero']              =$val['id_aero'];
            $rw[$i]['numero_orden']         =$val['numero_orden'];
            $rw[$i]['trabajo_solicitado']   =$val['trabajo_solicitado'];
            $rw[$i]['fecha_prog']           =$val['fecha_prog'];
            $rw[$i]['fecha_inicio_evento']  =$val['fecha_inicio_evento'];
            $rw[$i]['horas_prog']           =$val['horas_prog'];
            $rw[$i]['horas_reales']         =$val['horas_reales'];
            $rw[$i]['estado_asignado']      =$val['estado_asignado'];
            $rw[$i]['descripcion_evento']   =$val['descripcion_evento'];
            
            $corte_aero_hp   +=$val['horas_prog'];
            $corte_aero_hr   =$this->sumar_horas($corte_aero_hr,$val['horas_reales']);
            $corte_unidad_hp +=$val['horas_prog'];
            $corte_unidad_hr =$this->sumar_horas($corte_unidad_hr,$val['horas_reales']);
            $total_hp        +=$val['horas_prog'];
            $total_hr        =$this->sumar_horas($total_hr,$val['horas_reales']);

            $arr[] = $rw[$i];
            $i++;
        }
        $rw[++$i]['numero_unidad']      ="";
        $rw[$i]['id_aero']              ="";
        $rw[$i]['fecha_prog']           ="";
        $rw[$i]['numero_orden']         ="";
        $rw[$i]['fecha_inicio_evento']  ="Corte Aero:";
        $rw[$i]['horas_prog']           =$corte_aero_hp;
        $rw[$i]['horas_reales']         =$corte_aero_hr;
        $arr[] = $rw[$i];
        $rw[++$i]['numero_unidad']      ="";
        $rw[$i]['id_aero']              ="";
        $rw[$i]['fecha_prog']           ="";
        $rw[$i]['numero_orden']         ="";
        $rw[$i]['fecha_inicio_evento']  ="Corte Unidad:";
        $rw[$i]['horas_prog']           =$corte_unidad_hp;
        $rw[$i]['horas_reales']         =$corte_unidad_hr;
        $arr[] = $rw[$i];
        $rw[++$i]['numero_unidad']      ="";
        $rw[$i]['id_aero']              ="";
        $rw[$i]['fecha_prog']           ="";
        $rw[$i]['numero_orden']         ="";
        $rw[$i]['fecha_inicio_evento']  ="Total Reporte:";
        $rw[$i]['horas_prog']           =$total_hp;
        $rw[$i]['horas_reales']         =$total_hr;
        $arr[] = $rw[$i];
        return $arr;
    }

    private function sumar_horas ( $hora1,$hora2 ) {
        $hora1=explode(":",$hora1);
        $hora2=explode(":",$hora2);
        $horas=(int)$hora1[0]+(int)$hora2[0];
        $minutos=(int)$hora1[1]+(int)$hora2[1];
        $horas+=(int)($minutos/60);
        $minutos=$minutos%60;
        if($minutos<10)$minutos="0".$minutos ;
        return $horas.":".$minutos;
    }
    
    // -----------------------------------------------------------------------------------
    
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

                    case 'condicion_operativa':
                        $condicion_operativa = $get[ 'condicion_operativa' ];
                        if ( $condicion_operativa !== 'TODAS' ) 
                            $sql.= "AND condicion_operativa = '$condicion_operativa' ";
                        
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

            case 'programacion_mtto':
                "LEFT JOIN programacion_mtto pm ".
                "ON pm.id_prog_mtto = ( ".
                    "SELECT id_prog_mtto FROM orden_trabajo_personal ".
                    "WHERE id_libro_relatorio = t_lr.id_libro_relatorio ".
                    "LIMIT 1 ".
                ") ".
                "WHERE pm.estado_asignado = 'ACTIVO' ";
                
                $sql .= "WHERE t_lr.condicion_operativa = 'MTTO' ";

                empty( $fecha_inf ) ? # si fecha_inf está vacia busca todas los reportes existentes hasta la fecha superior
                    $sql.= "AND t_lr.fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ": 
                    $sql.= "AND t_lr.fecha_termino_evento >= STR_TO_DATE( '$fecha_inf', '%d-%m-%Y' ) AND ".
                           "t_lr.fecha_termino_evento <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ";

                return $sql;
                break;
            
            default: return array();  
                break;
        }

        $sql .= "ORDER BY t_a.numero_unidad ASC, t_a.numero_aero ASC";

        // return $sql;

        $query = $this->array_query( $sql );
        $arr = array();

        // return $query;
        $tiempo_muerto_horas   =0;
        $tiempo_muerto_minutos =0;
        # calculamos las horas para cada evento
        foreach ( $query as $val ) {
            $fecha_termino_evento = $val [ 'fecha_termino_evento' ];
            $hora_termino_evento  = $val [ 'hora_termino_evento' ];
            $estado_evento        = $val [ 'estado_evento' ]; 
            
            $id_libro_relatorio   = $val[ 'id_libro_relatorio' ];
            $id_libro_licencia    = $val[ 'id_libro_licencia' ];
            $consecutivo_licencia = $val[ 'consecutivo_licencia' ];

            if( empty( $fecha_termino_evento ) 
                && empty( $hora_termino_evento ) ) { // si el evento no esta finalizado
                date_default_timezone_set('America/Mexico_City');
                
                $fecha_inicio = Carbon::parse( $val[ 'fecha_inicio_evento' ]." ".$val[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                $fecha_final = $dia_reporte != '7AM' ?
                    Carbon::now( 'America/Mexico_City' ): # el dia de hoy desde las 00:00 hasta la hora del instante
                    // Carbon::now( 'America/Mexico_City' );
                    Carbon::parse( Carbon::now()->toDateString()." "."07:00:00" ); # el dia de hoy desde las 00:00 hasta las 7:00 A.M

				/*  julioe 09-09-2015  */
                $val['fecha_termino_evento'] ="ABIERTO";
                $val['hora_termino_evento']  ="ABIERTO";
				/*  julioe 09-09-2015  */

                #------------

                $val[ 'horas_dia_reporte' ] = $fecha_final->format( 'H:i' ).":00"; 

                #------------

                $horas     = $fecha_inicio->diffInHours( $fecha_final, false );
                $min_total = $fecha_final->diffInMinutes( $fecha_inicio );
				//$tiempo_muerto_minutos = $min_total;
                $min = $min_total % 60;

                # formateamos la cadena para dejar una estructura
                # similar a 00:00:00
                $val[ 'horas_acumuladas_evento' ] = $this->__struct_string_time( $horas, $min );
            }

            else { // si el evento esta finalizado            
                $val[ 'fecha_termino_evento' ] = Carbon::parse( $fecha_termino_evento, 'America/Mexico_City' )->format( 'd-m-Y' );
                $val[ 'horas_dia_reporte' ]    = null;

                #------------

                $fecha_inicio = Carbon::parse( $val[ 'fecha_inicio_evento' ]." ".$val[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                $fecha_final  = Carbon::parse( $val[ 'fecha_termino_evento' ]." ".$val[ 'hora_termino_evento' ], 'America/Mexico_City' );

                $horas     = $fecha_final->diffInHours( $fecha_inicio );
                $min_total = $fecha_final->diffInMinutes( $fecha_inicio );
                $min       = $min_total % 60;

                # formateamos la cadena para dejar una estructura
                # similar a 00:00:00
                $val[ 'horas_acumuladas_evento' ] = $this->__struct_string_time ( $horas, $min );
            }

			$tiempo_muerto_minutos = $min_total;
            # Calculamos el numero de subeventos
            $sql =
            "SELECT COUNT( id_libro_relatorio ) num_subeventos ".
            "FROM libro_relatorio_historial ".
            "WHERE id_libro_relatorio = $id_libro_relatorio";

            // return $sql;

            $num_subeventos = $this->query( $sql, 'num_subeventos', null );


            # Calculamos el tiempo de los subeventos
            $sql =
            "SELECT fecha_inicio_evento,hora_inicio_evento,fecha_termino_evento,hora_termino_evento ".
            "FROM libro_relatorio_historial ".
            "WHERE id_libro_relatorio = $id_libro_relatorio";

            // return $sql;

            $subeventos = $this->array_query($sql);

            //------------------------------------------------------------------------------------------------------------------------
            // 2015-09-08 Julioe
            //------------------------------------------------------------------------------------------------------------------------
            
            $sumatoria_horas   = 0;
            $sumatoria_minutos = 0;

			//$tiempo_muerto_horas=$horas;
            //$tiempo_muerto_minutos=$min;
			
            foreach ($subeventos as $row)
            {
                $fecha_inicio = Carbon::parse( $row[ 'fecha_inicio_evento' ]." ".$row[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                $fecha_final  = Carbon::parse( $row[ 'fecha_termino_evento' ]." ".$row[ 'hora_termino_evento' ], 'America/Mexico_City' );
                
                $horas     = $fecha_final->diffInHours( $fecha_inicio );
                $min_total = $fecha_final->diffInMinutes( $fecha_inicio );
                

                $sumatoria_horas   +=$horas;
                $sumatoria_minutos +=$min_total;

            }

			
            $min = $sumatoria_minutos % 60;
            //$row['horas_acumuladas_evento'] = $sumatoria_horas.':'.$min;

            $val[ 'sum_subeventos' ] = $this->__struct_string_time( $sumatoria_horas, $min );
			
            //------------------------------------------------------------------------------------------------------------------------
            // 2015-09-09 Julioe
            //------------------------------------------------------------------------------------------------------------------------
			
			//$tiempo_muerto_horas-=$sumatoria_horas;
            $tiempo_muerto_minutos-=$sumatoria_minutos;
			
			$val[ 'tiempo_muerto' ] = $this->__struct_string_time( intval($tiempo_muerto_minutos/60), $tiempo_muerto_minutos%60 );
			
			//
			//  end - julioe
			//
			
            $val[ 'num_subeventos' ] = $num_subeventos;
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
        require_once( $this->path_file_pdf );

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
        $datos = $this->obtener_libro_relatorio($get);
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
//  ----------------------------------------------------------------------
//  julioe 09-09-2015
//  ----------------------------------------------------------------------
    public function imprimir_reporte_periodo ( $get ) {
        require_once( $this->path_file_pdf );

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
        $datos = $this->obtener_libro_relatorio($get);
        $i = 0;

        foreach ( $datos as $row ) {
            $id_libro_relatorio = $row[ 'id_libro_relatorio' ];
			$string = $row['descripcion_evento'];
			if($get[ 'historial']=='SI')
			{
				$string .= "<br><br><b>HISTORIAL:</b><br><br>";
			
				$sql =
					"SELECT descripcion_evento, ".
					"DATE_FORMAT( fecha_inicio_evento, '%d-%m-%Y') AS fecha_inicio_evento, ".
					"DATE_FORMAT( fecha_termino_evento, '%d-%m-%Y') AS fecha_termino_evento, ".
					"hora_inicio_evento, hora_termino_evento, condicion_operativa ".
					"FROM libro_relatorio_historial ".
					"WHERE id_libro_relatorio = $id_libro_relatorio ".
					"ORDER BY fecha_inicio_evento ASC, hora_inicio_evento ASC";
			
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
			}
			$i++;
        }
		
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'NO. AEREO', 'campo'=> 'numero_aero', 'x'=>50 ),
                    array( 'titulo' => 'CONDICION', 'campo'=> 'condicion_operativa','x'=>70 ),
                    array( 'titulo' => 'REPORTE DE EVENTO', 'campo'=> 'descripcion_evento', 'x'=>220 ),
                    array( 'titulo' => 'FECHA INICIO EVENTO', 'campo'=> 'fecha_inicio_evento', 'x'=>82 ),
                    array( 'titulo' => 'HORA INICIO EVENTO', 'campo'=> 'hora_inicio_evento', 'x'=>82 ),
					array( 'titulo' => 'FECHA TERMINO EVENTO', 'campo'=> 'fecha_termino_evento' , 'x'=>82  ),
                    array( 'titulo' => 'HORA TERMINO EVENTO', 'campo'=> 'hora_termino_evento', 'x'=>82 ),
                    array( 'titulo' => 'TIEMPO TOTAL', 'campo'=> 'horas_acumuladas_evento', 'x'=>72 ),
					array( 'titulo' => 'NO. SUBEVENTOS', 'campo'=> 'num_subeventos', 'x'=>70 ),
					array( 'titulo' => 'T. TOTAL SUBEVENTOS', 'campo'=> 'sum_subeventos', 'x'=>70 ),
                    array( 'titulo' => 'TIEMPO MUERTO', 'campo'=> 'tiempo_muerto', 'x'=>70 )
                ), 
                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Mantenimiento.pdf', 'I');
    } 	
//  ----------------------------------------------------------------------
//  end julioe
//  ----------------------------------------------------------------------	

//  ----------------------------------------------------------------------
//  julioe 10-09-2015 al 14-09-2015
//  ----------------------------------------------------------------------    
    public function exportar_reporte_periodo ( $get ) {
        $datos = $this->obtener_libro_relatorio($get);
        $i = 0;
		$hist=$get['historial'];
		//$j = 0;
		$rw[][]="";
		foreach($datos as $row )
		{
            $id_libro_relatorio                =$row['id_libro_relatorio'];
            $rw[$i]['id_libro_relatorio']      =$row['id_libro_relatorio'];
            $rw[$i]['numero_aero']             =$row['numero_aero'];
            $rw[$i]['condicion_operativa']     =$row['condicion_operativa'];
            $rw[$i]['descripcion_evento']      =$row['descripcion_evento'];
            $rw[$i]['fecha_inicio_evento']     =$row['fecha_inicio_evento'];
            $rw[$i]['hora_inicio_evento']      =$row['hora_inicio_evento'];
            $rw[$i]['fecha_termino_evento']    =$row['fecha_termino_evento'];
            $rw[$i]['hora_termino_evento']     =$row['hora_termino_evento'];
            $rw[$i]['horas_acumuladas_evento'] =$row['horas_acumuladas_evento'];
            $rw[$i]['num_subeventos']          =$row['num_subeventos'];
            $rw[$i]['sum_subeventos']          =$row['sum_subeventos'];
            $rw[$i]['tiempo_muerto']           =$row['tiempo_muerto'];
			if($hist=='SI')
			{			
				$sql =
					"SELECT condicion_operativa,descripcion_evento,".
					"DATE_FORMAT( fecha_inicio_evento, '%d-%m-%Y') AS fecha_inicio_evento, ".
					"DATE_FORMAT( fecha_termino_evento, '%d-%m-%Y') AS fecha_termino_evento, ".
					"hora_inicio_evento, hora_termino_evento ".
					"FROM libro_relatorio_historial ".
					"WHERE id_libro_relatorio = $id_libro_relatorio ".
					"ORDER BY fecha_inicio_evento ASC, hora_inicio_evento ASC";			
				$query = $this->array_query($sql);
				if(!empty($query))
				{
					foreach($query as $log)
					{
						$rw[++$i]['id_libro_relatorio']    =$row['id_libro_relatorio'];
						$rw[$i]['numero_aero']             ="-";//$row['numero_aero'];
						$rw[$i]['condicion_operativa']     =$log['condicion_operativa'];
						$rw[$i]['descripcion_evento']      =$log['descripcion_evento'];
						$rw[$i]['fecha_inicio_evento']     =$log['fecha_inicio_evento'];
						$rw[$i]['hora_inicio_evento']      =$log['hora_inicio_evento'];
						$rw[$i]['fecha_termino_evento']    =$log['fecha_termino_evento'];
						$rw[$i]['hora_termino_evento']     =$log['hora_termino_evento'];
						// Calcular la duracion del evento
				
						#------------
						//$log[ 'fecha_termino_evento' ] = Carbon::parse( $fecha_termino_evento, 'America/Mexico_City' )->format( 'd-m-Y' );
						//$val[ 'horas_dia_reporte' ] = null;

						$_fecha_inicio = Carbon::parse( $log[ 'fecha_inicio_evento' ]." ".$log[ 'hora_inicio_evento' ], 'America/Mexico_City' );
						$_fecha_final = Carbon::parse( $log[ 'fecha_termino_evento' ]." ".$log[ 'hora_termino_evento' ], 'America/Mexico_City' );

						$_horas = $_fecha_final->diffInHours($_fecha_inicio);
						$_min_total = $_fecha_final->diffInMinutes( $_fecha_inicio );
						$_min = $_min_total % 60;
						$rw[$i]['horas_acumuladas_evento'] = $_horas.':'.$_min;
						#------------
						
						//$rw[$i]['horas_acumuladas_evento'] =$log['horas_acumuladas_evento'];
						$rw[$i]['num_subeventos']          ="-";
						$rw[$i]['sum_subeventos']          ="-";
						$rw[$i]['tiempo_muerto']           ="-";
					}
				}
			}
			$i++;
        }

		// -----
		//  Archivo en Excel
		// -----
		
		error_reporting(E_ALL | E_WARNING | E_STRICT );
		ini_set('display_errors', FALSE);
        // set_include_path('/var/www/html/LaVenta/ajax/pear');
		set_include_path( $this->path_pear );
		require_once( $this->path_file_pear );
		//mb_internal_encoding('ISO-8859-1');
		$workbook = new Spreadsheet_Excel_Writer();
		//$workbook->setVersion(8);

		$format_title =& $workbook->addFormat(array('Size' => 11,
                                      'Align' => 'left',
									  'bold'=> 1));
		$format_normal =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'left'));
		$format_normal_center =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'center'));
		$format_normal_center_h =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'center',
									  'FgColor' => 26));
		$format_bold =& $workbook->addFormat(array('Size' => 10,
                                      'Align' => 'center',
                                      'Color' => 'white',
                                      'Pattern' => 1,
                                      'FgColor' => 'green',
									  'VAlign' => 'vcenter',
									  'HAlign' => 'hcenter',
									  'bold'=> 1));
		$format_bold->setTextWrap();							  
		
		$worksheet  =& $workbook->addWorksheet("Reporte");
		//$worksheet->insertBitmap(0,0,'/css/7images/cfe.bmp','1','1','2','2');
		$worksheet->writeString(0, 0, "Gerencia Regional de Produccion Sureste", $format_title);
		$worksheet->setMerge(0, 0, 0, 4);
		$worksheet->writeString(1, 0, "Subgerencia Regional de Generacion Hidroelectrica Grijalva", $format_title);
		$worksheet->setMerge(1, 0, 1, 4);
		$worksheet->writeString(2, 0, "C.E. La Venta", $format_title);
		$worksheet->setMerge(2, 0, 2, 4);
		$worksheet->writeString(4, 0, "NO. AEREO", $format_bold);
		$worksheet->writeString(4, 1, "CONDICION", $format_bold);
		$worksheet->writeString(4, 2, "FECHA INICIO EVENTO", $format_bold);
		$worksheet->writeString(4, 3, "HORA INICIO EVENTO", $format_bold);
		$worksheet->writeString(4, 4, "FECHA TERMINO EVENTO", $format_bold);
		$worksheet->writeString(4, 5, "HORA TERMINO EVENTO", $format_bold);
		$worksheet->writeString(4, 6, "TIEMPO TOTAL", $format_bold);
		$worksheet->writeString(4, 7, "NO. SUBEVENTOS", $format_bold);
		$worksheet->writeString(4, 8, "T. TOTAL SUBEVENTOS", $format_bold);
		$worksheet->writeString(4, 9, "TIEMPO MUERTO", $format_bold);
		
		$i = 5;
        foreach( $rw as $row )
        {
            $id_libro_relatorio = $row['id_libro_relatorio'];
			$string = iconv("UTF-8", "ISO-8859-1//TRANSLIT",$row['descripcion_evento']);
			$string1=($row['fecha_termino_evento']=="ABIERTO") ? "Abierto" : $row['fecha_termino_evento'];
			$string2=($row['hora_termino_evento']=="ABIERTO") ? "Abierto" : $row['hora_termino_evento'];
			$string3=$row['numero_aero'];
			$worksheet->writeString($i,0,$string3,($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,1,$row['condicion_operativa'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeNote($i,1,$string,($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,2,$row['fecha_inicio_evento'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,3,$row['hora_inicio_evento'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,4,$string1,($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,5,$string2,($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,6,$row['horas_acumuladas_evento'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			if($row['num_subeventos']=="-")
				$worksheet->writeString($i,7,"-",($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			else
				$worksheet->writeNumber($i,7,$row['num_subeventos'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,8,$row['sum_subeventos'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$worksheet->writeString($i,9,$row['tiempo_muerto'],($hist=="SI" and $string3=="-") ? $format_normal_center : $format_normal_center_h);
			$i++;
        }
		$worksheet->setRow(4,27);
		$worksheet->setColumn(0,1,11);
		$worksheet->setColumn(2,3,13);
		$worksheet->setColumn(4,5,16);
		$worksheet->setColumn(6,6,11);
		$worksheet->setColumn(7,9,14);
		$workbook->send('reporte.xls');
		$workbook->close();
    }
//  ----------------------------------------------------------------------
//  end julioe
//  ----------------------------------------------------------------------	

//  ----------------------------------------------------------------------
//  julioe 17-09-2015
//  ----------------------------------------------------------------------
    public function imprimir_reporte_orden_trabajo ($get) {
        require_once( $this->path_file_pdf );

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
        $datos = $this->obtener_libro_relatorio_orden_trabajo($get);
        $i = 0;
        /*
         -------------------------------------------------
        */
        $hist=$get['historial'];
        $rw[][]="";
        foreach($datos as $row )
        {
            $id_libro_relatorio             =$row['id_libro_relatorio'];
            $rw[$i]['id_libro_relatorio']   =$row['id_libro_relatorio'];
            $rw[$i]['id_prog_mtto']         =$row['id_prog_mtto'];
            $rw[$i]['numero_unidad']        =$row['numero_unidad'];
            $rw[$i]['id_aero']              =$row['id_aero'];
            $rw[$i]['numero_orden']         =$row['numero_orden'];
            $rw[$i]['trabajo_solicitado']   =$row['trabajo_solicitado'];
            $rw[$i]['fecha_prog']           =$row['fecha_prog'];
            $rw[$i]['fecha_inicio_evento']  =$row['fecha_inicio_evento'];
            $rw[$i]['horas_prog']           =$row['horas_prog'];
            $rw[$i]['horas_reales']         =$row['horas_reales'];
            $rw[$i]['estado_asignado']      =$row['estado_asignado'];
            $rw[$i]['descripcion_evento']   =$row['descripcion_evento'];
            
            //$rw[$i]['fecha_final']            =$row['fecha_final'];
            //$rw[$i]['fecha_termino_evento']   =$row['fecha_termino_evento'];
            //$rw[$i]['hora_termino_evento']    =$row['hora_termino_evento'];
            //echo $id_libro_relatorio;
            if($hist=='SI' and $id_libro_relatorio!=NULL)
            {           
                $sql = "SELECT ".
                        "id_libro_relatorio_historial," .
                        "id_libro_relatorio," .
                        "fecha_inicio_evento," .
                        "hora_inicio_evento," .
                        "fecha_termino_estimado_evento," .
                        "hora_termino_estimado_evento," .
                        "fecha_termino_evento," .
                        "hora_termino_evento," .
                        "condicion_operativa," .
                        "descripcion_evento " .
                    "FROM libro_relatorio_historial ".
                    "WHERE id_libro_relatorio = $id_libro_relatorio ".
                    "ORDER BY fecha_inicio_evento ASC, hora_inicio_evento ASC";         
                $query = $this->array_query($sql);
                
                if(!empty($query))
                {
                    foreach($query as $log)
                    {
                        $rw[++$i]['id_libro_relatorio'] =$log['id_libro_relatorio'];
                        $rw[$i]['id_prog_mtto']         =$row['id_prog_mtto'];
                        $rw[$i]['numero_unidad']        ="";//$row['numero_unidad'];
                        $rw[$i]['id_aero']              ="";//$row['id_aero'];
                        $rw[$i]['numero_orden']         =$log['condicion_operativa'];
                        $rw[$i]['trabajo_solicitado']   =$row['trabajo_solicitado'];
                        $rw[$i]['fecha_prog']           =$row['fecha_prog'];
                        $rw[$i]['fecha_inicio_evento']  =$log['fecha_inicio_evento'];
                        $rw[$i]['horas_prog']           =$row['horas_prog'];

                        $_fecha_inicio = Carbon::parse( $log[ 'fecha_inicio_evento' ]." ".$log[ 'hora_inicio_evento' ], 'America/Mexico_City' );
                        $_fecha_final = Carbon::parse( $log[ 'fecha_termino_evento' ]." ".$log[ 'hora_termino_evento' ], 'America/Mexico_City' );

                        $_horas = $_fecha_final->diffInHours($_fecha_inicio);
                        $_min_total = $_fecha_final->diffInMinutes( $_fecha_inicio );
                        $_min = $_min_total % 60;
                        $rw[$i]['horas_reales'] = $_horas.':'.$_min;
                        $rw[$i]['estado_asignado']      =$row['estado_asignado'];
                        $rw[$i]['descripcion_evento']    =$log['descripcion_evento'];
                    }
                }
            }
            $i++;
        }
        /*
         -------------------------------------------------
        */
        //return $rw;
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'UNIDAD', 'campo'=> 'numero_unidad', 'x'=>50 ),
                    array( 'titulo' => 'AERO', 'campo'=> 'id_aero','x'=>70 ),
                    array( 'titulo' => 'No ORDEN', 'campo'=> 'numero_orden','x'=>70 ),
                    array( 'titulo' => 'DESCRIPCIÓN', 'campo'=> 'trabajo_solicitado','x'=>370 ),
                    array( 'titulo' => 'FECHA PROG.', 'campo'=> 'fecha_prog', 'x'=>110 ),
                    array( 'titulo' => 'FECHA REAL', 'campo'=> 'fecha_inicio_evento', 'x'=>110 ),
                    array( 'titulo' => 'HORAS PROG.', 'campo'=> 'horas_prog', 'x'=>82 ),
                    array( 'titulo' => 'HORAS REALES', 'campo'=> 'horas_reales' , 'x'=>82  ),
                ), 
                $rw
                //$datos
            );
        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Ordenes_Trabajo.pdf', 'I');
    }   
//  ----------------------------------------------------------------------
//  end julioe
//  ----------------------------------------------------------------------  

    public function imprimir_reporte_orden_trabajo_programado ($get) {
        require_once( $this->path_file_pdf );

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
        require_once 'mantenimiento.class.php';
        $obj = new mantenimiento( $this->usuario, $this->clave );
        $datos = $obj->obtenerOrdenTrabajo( $get );

        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'UNIDAD', 'campo'=> 'numero_unidad', 'x'=>50 ),
                    array( 'titulo' => 'AERO', 'campo'=> 'numero_aero','x'=>70 ),
                    array( 'titulo' => 'No. ORDEN', 'campo'=> 'numero_orden','x'=>70 ),
                    array( 'titulo' => 'DESCRIPCIÓN EVENTO', 'campo'=> 'descripcion_evento','x'=>340 ),
                    array( 'titulo' => 'FECHA PROG.', 'campo'=> 'fecha_programada', 'x'=>85 ),
                    array( 'titulo' => 'FECHA REPROG.', 'campo'=> 'fecha_reprogramada', 'x'=>85 ),
                    array( 'titulo' => 'HORAS PROG.', 'campo'=> 'horas_programadas', 'x'=>82 ),
                    array( 'titulo' => 'HORAS REALES', 'campo'=> 'horas_reales' , 'x'=>82  ),
                    array( 'titulo' => 'ACTIVIDADES FALTANTES', 'campo'=> 'actividades_faltantes' , 'x'=>82  )
                ), 
                
                $datos
            );
        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Ordenes_Trabajo_programado.pdf', 'I');
    } 

    public function exportar_reporte_orden_trabajo_programado ( $get ) {
        require_once 'mantenimiento.class.php';
        $obj = new mantenimiento( $this->usuario, $this->clave );
        $data = $obj->obtenerOrdenTrabajo( $get );

        // -----
        //  Archivo en Excel
        // -----
        
        error_reporting(E_ALL | E_WARNING | E_STRICT );
        ini_set('display_errors', FALSE);
        set_include_path( $this->path_pear );
        require_once( $this->path_file_pear );
        //mb_internal_encoding('ISO-8859-1');
        $workbook = new Spreadsheet_Excel_Writer();
        //$workbook->setVersion(8);

        $format_title =& $workbook->addFormat(array('Size' => 11,
                                      'Align' => 'left',
                                      'bold'=> 1));
        $format_normal =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'left'));
        $format_normal_justify_h =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'justify',
                                      'FgColor' => 26));
        $format_normal_center =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'center'));
        $format_normal_center_h =& $workbook->addFormat(array('Size' => 8,
                                      'Align' => 'center',
                                      'FgColor' => 26));
        $format_bold =& $workbook->addFormat(array('Size' => 10,
                                      'Align' => 'center',
                                      'Color' => 'white',
                                      'Pattern' => 1,
                                      'FgColor' => 'green',
                                      'VAlign' => 'vcenter',
                                      'HAlign' => 'hcenter',
                                      'bold'=> 1));
        $format_bold->setTextWrap(); 
        $format_normal_center_h->setTextWrap();
        $format_normal_justify_h->setTextWrap();
        
        $worksheet  =& $workbook->addWorksheet("Reporte");
        //$worksheet->insertBitmap(0,0,'/css/7images/cfe.bmp','1','1','2','2');
        $worksheet->writeString(0, 0, "Gerencia Regional de Produccion Sureste", $format_title);
        $worksheet->setMerge(0, 0, 0, 4);

        $worksheet->writeString(1, 0, "Subgerencia Regional de Generacion Hidroelectrica Grijalva", $format_title);
        $worksheet->setMerge(1, 0, 1, 4);

        $worksheet->writeString(2, 0, "C.E. La Venta", $format_title);
        $worksheet->setMerge(2, 0, 2, 4);

        $worksheet->writeString(4, 0, "UNIDAD", $format_bold);
        $worksheet->writeString(4, 1, "NO. AEREO", $format_bold);        
        $worksheet->writeString(4, 2, "No. ORDEN", $format_bold);
        $worksheet->writeString(4, 3, "DESCRIPCION EVENTO", $format_bold);        
        $worksheet->writeString(4, 4, "FECHA PROG.", $format_bold);
        $worksheet->writeString(4, 5, "FECHA REPROG.", $format_bold);
        $worksheet->writeString(4, 6, "HORAS PROG.", $format_bold);
        $worksheet->writeString(4, 7, "HORAS REALES", $format_bold);
        $worksheet->writeString(4, 8, "ACTIVIDADES FALTANTES", $format_bold);
        
        $i = 5;
        foreach( $data as $row )
        {
            $descripcion_evento = iconv("UTF-8", "ISO-8859-1//TRANSLIT",$row['descripcion_evento']);
            
            $worksheet->writeString( $i, 0, $row['numero_unidad'], $format_normal_center_h );
            $worksheet->writeString( $i, 1, $row['numero_aero'], $format_normal_center_h );
            $worksheet->writeString( $i, 2, $row['numero_orden'], $format_normal_center_h );
            $worksheet->writeString( $i, 3, $descripcion_evento, $format_normal_justify_h );
            $worksheet->writeString( $i, 4, $row['fecha_programada'], $format_normal_center_h );
            $worksheet->writeString( $i, 5, $row['fecha_reprogramada'], $format_normal_center_h );
            $worksheet->writeString( $i, 6, $row['horas_programadas'], $format_normal_center_h );
            $worksheet->writeString( $i, 7, $row['horas_reales'], $format_normal_center_h );
            $worksheet->writeString( $i, 8, $row['actividades_faltantes'], $format_normal_center_h );
            $i++;
        }
        
        $worksheet->setRow( 4, 27 );
        $worksheet->setColumn( 0, 1, 11 );
        $worksheet->setColumn( 2, 2, 11 );
        $worksheet->setColumn( 3, 3, 60 );
        $worksheet->setColumn( 4, 5, 16 );
        $worksheet->setColumn( 6, 6, 11 );
        $worksheet->setColumn( 7, 9, 14 );
        $workbook->send('reporte.xls');
        $workbook->close();
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

        # solo usuario root no puede eliminar libro relatorio 
        if ( $this->usuario != $this->root ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Error... solo usuario $this->root puede eliminar eventos del relatorio." );
            return $rsp;
        }

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
}