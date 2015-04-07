<?php
require 'sigesop.class.php';
require '../Carbon/Carbon.php';
include 'pdf.class.php';
use Carbon\Carbon;

class operacion extends sigesop
{	
	public function __construct( $usuario, $clave ) { 
        parent::sigesop( $usuario, $clave ); 
    }
    
    public function __destruct(){ parent::__destruct(); }
	public function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion )
		{
            case 'cerrar_evento':
                $query = $this->cerrar_evento( $get );
                echo json_encode( $query );
                break;

            case 'eliminar_libro_licencia':
                $query = $this->eliminar_libro_licencia( $get );
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

            default:
                echo json_encode('Funcion no registrada en la clase operacion');
            break;
		}
	}

    public function cerrar_evento ( $get ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        $id_libro_relatorio = $get[ 'id_libro_relatorio' ];
        $numero_aero = $get[ 'numero_aero' ];
        $fecha = Carbon::now( 'America/Mexico_City' )->format( 'd-m-Y' );
        $hora = Carbon::now( 'America/Mexico_City' )->toTimeString();

        if ( !empty( $id_libro_relatorio ) ) {
            $conexion = $this->conexion;
            $sql =  "UPDATE libro_relatorio SET estado_evento = FALSE, ".
                    "fecha_termino_evento = STR_TO_DATE( '$fecha', '%d-%m-%Y' ), ".
                    "hora_termino_evento = '$hora' ".
                    "where id_libro_relatorio = '$id_libro_relatorio'";
            
            $query = $this->insert_query( $sql );
            if ( $query != 'OK' ) {
                $conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al cerrar evento' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                return $rsp;
            }

            $query = $this->__cambiar_estado_generador( $numero_aero, 'DISPONIBLE', $fecha );
            if ( $query === 'OK' ) {
                $conexion->commit();

                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Cerrado' );
                $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Evento cerrado satisfactoriamente.' );
                return $rsp;
            }

            else {
                $conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al cerrar evento' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => "Error al cambiar estado del generador. ".$query );
                return $rsp;
            }
        }

        else
            $rsp [ 'status' ] = array( 'transaccion' => 'NA', 'msj' => 'Un campo necesario se encuentra nulo o no es válido' );
        
        return $rsp;
    }

    public function eliminar_libro_licencia( $data ) {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

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

    public function nuevo_evento_relatorio ( $post ) {
        $conexion = $this->conexion;
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'id_libro_relatorio', 'fecha_evento', 'hora', 'descripcion_evento'
            ));

        if ( $validar == 'OK' ) 
        {
            $id_libro_relatorio = $post[ 'id_libro_relatorio' ][ 'valor' ];
            $fecha_evento = $post[ 'fecha_evento' ][ 'valor' ];
            $hora = $post[ 'hora' ][ 'valor' ];         
            $descripcion_evento = $post[ 'descripcion_evento' ][ 'valor' ];

            $sql =  "insert into libro_relatorio_historial( id_libro_relatorio, fecha_evento, ".
                    "hora, descripcion_evento ) values( $id_libro_relatorio, STR_TO_DATE( '$fecha_evento', '%d-%m-%Y' ), ".
                    "'$hora', '$descripcion_evento')";

            $query = $this->insert_query( $sql );
            if ( $query == 'OK' )
            {
                $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$fecha_evento, 'msj' => 'OK' );
                $conexion->commit();
            }
            else 
            {
                $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $fecha_evento, 'msj' => 'Error al ingresar evento' );
                $conexion->rollback();
            }            
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    public function nuevo_libro_licencia( $data ) {
        $anio_licencia = $data[ 'anio_licencia' ][ 'valor' ];

        if ( !empty( $anio_licencia ) ) 
        {
            $conexion = $this->conexion;
            $sql = "insert into libro_licencia ( anio_licencia ) values ( '$anio_licencia' )";
            // return $sql;
            $query = $this->insert_query( $sql );
            
            if ( $query === 'OK' ) 
            {
                $conexion->commit();
                return $query; 
            }
            else 
            {
                $conexion->rollback();
                return $query." .Error al insertar año de licencia";
            }
        }

        else return 'NA';
    }    

    # nuevo_relatorio ----------------------

    public function nuevo_relatorio( $post ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'reporte_por', 'numero_unidad', 'numero_aero', 'id_libro_licencia',
                'hora_inicio_evento', 'fecha_inicio_evento', 'condicion_operativa',
                'trabajador_solicito', 'trabajador_autorizo', 'descripcion_evento'
            ));

        if ( $validar == 'OK' ) 
        {
            $reporte_por = $post[ 'reporte_por' ][ 'valor' ];
            $condicion_operativa = $post[ 'condicion_operativa' ][ 'valor' ];
            $numero_unidad = $post[ 'numero_unidad' ][ 'valor' ];
            $numero_aero = $post[ 'numero_aero' ][ 'valor' ];            

            switch ( $condicion_operativa ) 
            {
                case 'MTTO':
                    $query = $this->__mantto_por_aero( $post, $numero_aero );
                    if ( $query === 'OK' ) 
                    {
                        $this->conexion->commit();
                        $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                        $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                    }

                    else
                    {
                        $this->conexion->rollback();
                        $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                        $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar mantenimiento.' );
                    }                    
                    break;                  
                default:
                    if ( $reporte_por == 'byAero' )
                    {
                        $query = $this->__evento_por_aero( $post, $numero_aero, $condicion_operativa );
                        if ( $query === 'OK' ) 
                        {
                            $this->conexion->commit();
                            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente.' );
                        }

                        else
                        {
                            $this->conexion->rollback();
                            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
                            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar evento.' );
                        }
                    }

                    else if ( $reporte_por == 'byUnidad' )
                        $rsp = $this->__evento_por_unidad( $post, $numero_unidad, $condicion_operativa );

                    else $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Sin tipo de reporte especificado' );
                    break;
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    private function __evento_por_aero ( $data, $numero_aero, $condicion_operativa ){
        $id_libro_relatorio = $this->autoincrement( 'select id_libro_relatorio from libro_relatorio order by id_libro_relatorio asc', 'id_libro_relatorio' );
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];
        $secuencia_licencia = $this->autoincrement( 'select secuencia_licencia from libro_relatorio order by secuencia_licencia asc', 'secuencia_licencia' );
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

        # verificamos si existe un evento previo del generador solicitado
        $sql =  "insert into libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, ".
                "secuencia_licencia, fecha_inicio_evento, hora_inicio_evento, fecha_termino_estimado, ".
                "trabajador_solicito, trabajador_autorizo, descripcion_evento ) values( $id_libro_relatorio, ".
                "'$numero_aero', $id_libro_licencia, '$condicion_operativa', $secuencia_licencia, ".
                "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', ".
                $fecha_termino_estimado."'$trabajador_solicito', '$trabajador_autorizo', '$descripcion_evento' )";
        
        // return $sql;
        
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;
         
        $query = $this->__cambiar_estado_generador( $numero_aero, $condicion_operativa, $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        return 'OK';
    }

    private function __evento_por_unidad ( $data, $numero_unidad, $condicion_operativa ){
        # buscar todos los aeros de la unidad 
        $sql =  "select numero_aero from aeros where numero_unidad = '$numero_unidad' and ".
                "numero_aero not in( select numero_aero from libro_relatorio where estado_evento = TRUE )";
        $arr = $this->array_query( $sql, 'numero_aero' );
        if ( empty( $arr ) ) # verificamos que no este vacio
            return array( 'status' => array( 'transaccion' => 'NA', 'msj' => 'Los elementos ya han sido ingresados.' ),
                'eventos' => array() 
            );

        $rsp = array( 'status' => array(), 'eventos' => array() );
        $flag = true;

        foreach ( $arr as $numero_aero )
        {
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
        $id_libro_relatorio = $this->autoincrement( 'select id_libro_relatorio from libro_relatorio order by id_libro_relatorio asc', 'id_libro_relatorio' );
        $id_libro_licencia = $data[ 'id_libro_licencia' ][ 'valor' ];
        $secuencia_licencia = $this->autoincrement( 'select secuencia_licencia from libro_relatorio order by secuencia_licencia asc', 'secuencia_licencia' );
        $fecha_inicio_evento = $data[ 'fecha_inicio_evento' ][ 'valor' ];
        $hora_inicio_evento = $data[ 'hora_inicio_evento' ][ 'valor' ];          
        $trabajador_solicito = $data[ 'trabajador_solicito' ][ 'valor' ];
        $trabajador_autorizo = $data[ 'trabajador_autorizo' ][ 'valor' ];
        $descripcion_evento = $data[ 'descripcion_evento' ][ 'valor' ];            

        $mantto = $data[ 'condicion_operativa' ][ 'mantenimiento' ];
        $id_orden_trabajo = $mantto[ 0 ][ 'id_orden_trabajo' ];
        $sin_licencia = $mantto[ 0 ][ 'sin_licencia' ];

        # verificamos si no se ha ingresado previamente
        $sql =  "SELECT numero_aero FROM libro_relatorio where estado_evento = TRUE AND numero_aero = '$numero_aero'".                
        $arr = $this->array_query( $sql, 'numero_aero' );
        if ( !empty( $arr ) )
            return 'Elemento ingresado previamente';

        # creamos consulta de inserción
        $sql = $sin_licencia == 'false' ?
            "insert into libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, secuencia_licencia, ".
            "fecha_inicio_evento, hora_inicio_evento, trabajador_solicito, trabajador_autorizo, id_orden_trabajo, ".
            "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', $secuencia_licencia, ".
            "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', '$trabajador_solicito', '$trabajador_autorizo', ".
            "$id_orden_trabajo, '$descripcion_evento' )" :

            "insert into libro_relatorio( id_libro_relatorio, numero_aero, id_libro_licencia, condicion_operativa, ".
            "fecha_inicio_evento, hora_inicio_evento, trabajador_solicito, trabajador_autorizo, ".
            "descripcion_evento ) values( $id_libro_relatorio, '$numero_aero', $id_libro_licencia, 'MTTO', ".
            "STR_TO_DATE( '$fecha_inicio_evento', '%d-%m-%Y' ), '$hora_inicio_evento', '$trabajador_solicito', ".
            "'$trabajador_autorizo', '$descripcion_evento' )";
        
        // return $sql;
        
        #insertamos un nuevo evento
        $query = $this->insert_query( $sql );
        if( $query != 'OK' ) return $query;

        # cambiamos la condicion operativa del generador
        $query = $this->__cambiar_estado_generador( $numero_aero, 'MTTO', $fecha_inicio_evento );
        if( $query != 'OK' ) return $query.". Error al cambiar condicion operativa";

        if ( $sin_licencia == 'false' )
        {
            # cambiamos la orden de trabajo a un estado activo
            $sql = "update orden_trabajo set estado_asignado = true where id_orden_trabajo = $id_orden_trabajo";
            $query = $this->insert_query( $sql );
            if ( $query != 'OK' ) return $query;
        }

        return 'OK';
    }

    private function __cambiar_estado_generador ( $gen, $estado, $fecha_operacion ){
        $sql =  "update aeros set estado_licencia = '$estado', ".
                "fecha_operacion = STR_TO_DATE( '$fecha_operacion', '%d-%m-%Y' ) ".
                " where numero_aero = '$gen'";

        // return $sql;

        $change_state = $this->insert_query( $sql );
        return $change_state;        
    }

    # -----------------------------------------------

    public function obtener_historial_eventos( $get ) {
        $conexion = $this->conexion;
        $id_libro_relatorio = $get[ 'id_libro_relatorio' ];

        if ( !empty( $id_libro_relatorio ) ) 
        {
            $sql =  "select id_libro_relatorio, DATE_FORMAT(fecha_evento, '%d-%m-%Y' ) as fecha_evento, hora, descripcion_evento from ".
                    "libro_relatorio_historial where id_libro_relatorio = $id_libro_relatorio";
            $query = $this->array_query( $sql ); //return $sql;
            return $query;
        }

        else return null;
    }

    public function obtener_libro_licencia () {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $sql =  "select * from libro_licencia";
        $query = $this->array_query( $sql );
        return $query;
    }
    
    public function obtener_libro_relatorio ( $get ) {
        $option = $get[ 'option' ];

        $sql =  "SELECT t_a.numero_unidad, t_lr.numero_aero, t_lr.condicion_operativa, ".
                "t_lr.descripcion_evento, t_lr.id_libro_relatorio, fecha_inicio_evento, ".
                "t_lr.hora_inicio_evento, fecha_termino_evento, t_lr.hora_termino_evento, ".
                "DATE_FORMAT( fecha_termino_estimado, '%d-%m-%Y' ) as fecha_termino_estimado, ".
                "t_lr.trabajador_solicito, t_lr.trabajador_autorizo ".
                "FROM aeros t_a INNER JOIN libro_relatorio t_lr on t_a.numero_aero = t_lr.numero_aero ";

        switch ( $option ) 
        {
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
        foreach ( $query as $val )
        {
            $fecha_termino_evento = $val [ 'fecha_termino_evento' ];
            $hora_termino_evento = $val [ 'hora_termino_evento' ];
            $estado_evento = $val [ 'estado_evento' ];            

            if( empty( $fecha_termino_evento ) && empty( $hora_termino_evento ) ) // si el evento no esta finalizado
            {
                #------------

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

            else // si el evento esta finalizado
            {
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

            $arr[] = $val;
        }

        return $arr;
    }
  
    private function struct_tabla ( $head, $data ) {
        $html = 
            '<table cellspacing="0" cellpadding="1" border="1" >'.
                '<thead>'.
                '<tr style="background-color:#009300;color:#000000;">';
            foreach ( $head as $row ) {
                $width = empty( $row[ 'x' ] ) ? '' : ' width="'.$row[ 'x' ].'" ';
                $titulo = $row[ 'titulo' ];
                $html .= 
                    '<th '.$width.'>'.$titulo.'</th>';
            }
        $html .=
                '</tr>'.
                '</thead>'.
                '<tbody>';

        if ( empty( $data ) ) return $html." <tbody></tbody></table>";

        foreach( $data as $fila ) 
        {
            $html .=
                '<tr>';
            foreach ( $head as $row ) {
                $campo = $row[ 'campo' ];
                $texto = $fila[ $campo ];
                $width = empty( $row[ 'x' ] ) ? '' : ' width="'.$row[ 'x' ].'" ';
                $html .= 
                    '<td '.$width.'>'.$texto.'</td>';
            }
            $html .=
                '</tr>';
        }

        $html .=
                '</tbody>'.
            '</table>';
        return $html;
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
                "SELECT descripcion_evento, DATE_FORMAT( fecha_evento, '%d-%m-%Y') ".
                "AS fecha_evento, hora ".
                "FROM libro_relatorio_historial ".
                "WHERE id_libro_relatorio = $id_libro_relatorio ".
                "ORDER BY fecha_evento ASC, hora ASC";

            $string = 
                $row[ 'descripcion_evento' ]."<br><br><b>HISTORIAL:</b><br><br>";
            $query = $this->array_query( $sql );

            if ( !empty( $query ) ) {
                foreach ( $query as $log ) {
                    $string .= 
                        $log[ 'fecha_evento' ]." ".$log[ 'hora' ]."<br>".
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
}