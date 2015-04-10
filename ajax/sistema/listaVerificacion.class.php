<?php
include 'sigesop.class.php';

class listaVerificacion extends sigesop
{
    public function __construct( $usuario, $clave )
    {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct()
    {
        parent::__destruct();
    }

    function solicitudAjax( $accion, $post, $get )
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ( $accion )
        {
            case 'tipo_mantto_num_actividades':
                $query = $this->tipo_mantto_num_actividades();
                break;

            case 'actividades_into_lista':
                $query = $this->actividades_into_lista( $get );
                break; 

            case 'actualizar_actividad_verificar':
                $query = $this->actualizar_actividad_verificar( $post );
                break; 

            case 'actualizarTipoMantto':
                $query = $this->actualizarTipoMantto( $post );
                break;                

            case 'actualizarUnidadMedida':
                $query = $this->actualizarUnidadMedida( $post );
                break;

            case 'eliminarTipoMantto':
                $query = $this->eliminarTipoMantto( $get );
                break;

            case 'eliminarUnidadMedida':
                $query = $this->eliminarUnidadMedida( $get );
                break;

            case 'equipo_into_systems_mantto':
                $query = $this->equipo_into_systems_mantto( $get );
                break;

            case 'nuevaListaVerificacion':
                $query = $this->nuevaListaVerificacion( $post );
                break;

            case 'nuevaUnidadMedida':
                $query = $this->nuevaUnidadMedida( $post );
                break;

            case 'nuevoTipoMantenimiento':
                $query = $this->nuevoTipoMantenimiento( $post );
                break;

            case 'num_actividades_into_lista':
                $query = $this->num_actividades_into_lista();
                break;

            case 'obtenerListasVerificacion':
                $query = $this->obtenerListasVerificacion();
                break;               

            case 'obtenerListasVerificacionPorParametros':
                $query = $this->obtenerListasVerificacionPorParametros( $get );
                break;

            case 'obtenerTipoMantenimiento':
                $query = $this->obtenerTipoMantenimiento();
                break;

            case 'obtenerTipoParamentroAceptacion':
                $query = $this->obtenerTipoParamentroAceptacion();
                break;

            case 'obtenerUnidadMedida':
                $query = $this->obtenerUnidadMedida();
                break;

            case 'systems_into_mantto':
                $query = $this->systems_into_mantto();
                break;    

            default:
                $query = 'Funcion no registrada en la clase listaVerificacion';
                break;                  
        }  

        echo json_encode( $query );
    }

    public function obtenerUnidadMedida() {
        $sql = "SELECT * FROM catalogo_unidad_medida";
        $query = $this->array_query( $sql );
        return $query;
    }

    public function nuevaUnidadMedida( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'unidad_medida', 'descripcion_unidad_medida'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $unidad_medida = $data['unidad_medida']['valor'];
        $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

        $sql = 
            "INSERT INTO catalogo_unidad_medida ".
            "VALUES('$unidad_medida','$descripcion_unidad_medida')";
        
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida ingresada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nueva unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    public function actualizarUnidadMedida( $data ) {       
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'unidad_medida', 'descripcion_unidad_medida',
                'unidad_medida_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $unidad_medida = $data['unidad_medida']['valor'];
        $unidad_medida_update = $data['unidad_medida_update']['valor'];
        $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

        # verificamos que no sea un elemente de solo lectura
        if ( in_array( $unidad_medida, $this->solo_lectura ) ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Operación Imposible, elemento de solo lectura." );
            return $rsp;
        }

        $sql = 
            "UPDATE catalogo_unidad_medida ".
            "SET unidad_medida = '$unidad_medida', ".
            "descripcion_unidad_medida = '$descripcion_unidad_medida' ".
            "WHERE unidad_medida = '$unidad_medida_update'";
        
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida actualizada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminarUnidadMedida ( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'unidad_medida' ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }
        
        $unidad_medida = $data[ 'unidad_medida' ];

        # verificamos que no sea un elemente de solo lectura
        if ( in_array( $unidad_medida, $this->solo_lectura ) ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Operación Imposible, elemento de solo lectura." );
            return $rsp;
        }

        $sql = 
            "DELETE FROM catalogo_unidad_medida ".
            "WHERE unidad_medida = '$unidad_medida'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida eliminada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    # -----------------------------------------------

    private $datosNuevoTipoMantto = array(
        'numero_frecuencia', 'tipo_frecuencia',
        'id_mantenimiento', 'nombre_mantenimiento'
    );

    public function nuevoTipoMantenimiento( $data ) {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoTipoMantto );
        if ( $flag === 'OK' ) 
        {
            $numero_frecuencia = $data['numero_frecuencia']['valor'];
            $tipo_frecuencia = $data['tipo_frecuencia']['valor'];
            $id_mantenimiento = $data['id_mantenimiento']['valor'];
            $nombre_mantenimiento = $data['nombre_mantenimiento']['valor'];

            $sql = "insert into tipo_mantenimiento values ('$id_mantenimiento', '$nombre_mantenimiento', $numero_frecuencia, '$tipo_frecuencia')";
            $insertarTipoMantto = $this->insert_query( $sql );
            if( $insertarTipoMantto === 'OK' )
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $insertarTipoMantto.'. Error al insertar tipo de mantenimiento';
            }
        } 
        else return 'NA';
    }

    // -----------------------------------------------------------------------------------------------------

    public function obtenerTipoMantenimiento() {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from tipo_mantenimiento";
        $obtenerTipoMantenimiento = $this->array_query( $sql );
        return $obtenerTipoMantenimiento;
    }

    // -----------------------------------------------------------------------------------------------------

    public function eliminarTipoMantto ( $data ) {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $id_mantenimiento = $data['id_mantenimiento'];

        if ( !empty( $id_mantenimiento ) )
        {
            $sql = "delete from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $query = $this->insert_query( $sql );
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al insertar Eliminar Tipo de Mantenimiento";
            }
        } 
        else return 'NA';
    }

    // ---------- nuevaListaVerificacion ------------------------------------------------------------------

    private $datosListaVerificacion = array( 'id_mantenimiento', 'descripcion_lista_verificacion', 'actividad_verificar' );

    public function nuevaListaVerificacion ( $data ) {
        $conexion = $this->conexion;
        $flag = $this->verificaDatosNulos( $data, $this->datosListaVerificacion );     

        if ( $flag === 'OK' ) 
        {
            $id_mantenimiento = $data[ 'id_mantenimiento' ][ 'valor' ];
            $descripcion_lista_verificacion = $data[ 'descripcion_lista_verificacion' ][ 'valor' ];
            $actividad_verificar = $data[ 'actividad_verificar' ];

            // --------- insertamos actividad_verificar

            $actividad = $this->__insertarActividad( $actividad_verificar, $id_mantenimiento, $descripcion_lista_verificacion, $conexion );
            if( $actividad === 'OK' ) $conexion->commit();
            else $conexion->rollback();

            return $actividad;
        } 
        else return 'NA';
    }

    private $datosActividadLista = array( 'id_sistema_aero', 'actividad_verificar', 'parametro_actividad', 'lectura_actual', 
                                            'lectura_posterior' );

    private function __insertarActividad ( $data, $id_mantenimiento, $descripcion_lista_verificacion, $conexion ) {
        // if ( $this->verificaDatosNulos( $data, $this->datosActividadLista ) ) return 'NA';

        $noAct = 1;
        foreach ( $data as $act ) 
        {
            $id_actividad_verificar = $this->autoincrement( 'select id_actividad_verificar from actividad_verificar order by id_actividad_verificar asc', 'id_actividad_verificar', $conexion );
            $id_sistema_aero = $act[ 'id_sistema_aero' ][ 'valor' ];            
            !empty( $act[ 'id_equipo_aero' ][ 'valor' ] ) ?
                $id_equipo_aero = "'".$act[ 'id_equipo_aero' ][ 'valor' ]."'":
                $id_equipo_aero = 'null';            
            $actividad_verificar = $act[ 'actividad_verificar' ][ 'valor' ];
            
            // ----------

            $parametro_actividad = $act[ 'parametro_actividad' ];
            $lectura_actual = $act[ 'lectura_actual' ];
            $lectura_posterior = $act[ 'lectura_posterior' ];            

            // ---------- insertar datos de actividad

            $sql =  "insert into actividad_verificar values( $id_actividad_verificar, '$id_mantenimiento', '$id_sistema_aero', ".
                    "$id_equipo_aero, '$descripcion_lista_verificacion', '$actividad_verificar' )";

            // return $sql;
            $query = $this->insert_query( $sql );
            if ( $query !== 'OK') return $query.". Error al insertar actividad No. ".$noAct;

            $query = $this->__insertarParametro( $parametro_actividad, $id_actividad_verificar, $conexion );
            if ( $query !== 'OK' ) return $query;

            $query = $this->__insertarLecturas( $lectura_actual, $lectura_posterior, $id_actividad_verificar, $conexion );
            if ( $query !== 'OK' ) return $query;
            
            $noAct++;
        }
        
        return 'OK';
    }

    private function __insertarParametro ( $arr, $id, $conexion ) {
        $secuencia_datos = 1;
        foreach ( $arr as $param )
        {
            $parametro = $param[ 'parametro' ][ 'valor' ];
            $dato = $param[ 'dato' ][ 'valor' ];
            $tipo_dato = $param[ 'tipo_dato' ];
            $unidad_medida = $param[ 'unidad_medida' ][ 'valor' ];
            $idParam = $this->autoincrement( 'select id from parametro_actividad order by id asc', 'id', $conexion );

            $sql = "insert into parametro_actividad values( $id, '$tipo_dato', '$dato', '$parametro', $secuencia_datos, '$unidad_medida', $idParam )";
            // return $sql;
            $parametro = $this->insert_query( $sql );
            if ( $parametro !== 'OK' ) return $parametro." Error al insertar paramentro No. ".$secuencia_datos;

            $secuencia_datos++;
        }

        return 'OK';
    }

    private function __insertarLecturas ( $arrActual, $arrPost, $id, $conexion ) {   
        $secuenciaDatos = 1;

        foreach ( $arrActual as $dato ) 
        {
            $tipo_dato = $dato[ 'tipo_dato' ];
            $parametro = $dato[ 'parametro' ][ 'valor' ];
            $unidad_medida = $dato[ 'unidad_medida' ][ 'valor' ];

            $index = $this->autoincrement( "select id from lectura_actual order by id asc", 'id',$conexion );
            $sql = "insert into lectura_actual values( $id, '$tipo_dato', '$parametro', '$unidad_medida', $secuenciaDatos, $index )";
            // return $sql;
            $lecturaActual = $this->insert_query( $sql );
            if ($lecturaActual === 'OK') $secuenciaDatos++;
            else return $lecturaActual.". Error al insertar parametros actuales";                               
        }

        $secuenciaDatos = 1;

        foreach ( $arrPost as $dato ) 
        {
            $tipo_dato = $dato['tipo_dato'];
            $parametro = $dato['parametro'][ 'valor' ];
            $unidad_medida = $dato['unidad_medida'][ 'valor' ];

            $index = $this->autoincrement( "select id from lectura_posterior order by id asc", 'id',$conexion );
            $sql = "insert into lectura_posterior values( $id, '$tipo_dato', '$parametro', '$unidad_medida', $secuenciaDatos, $index )";
            // return $sql;
            $lecturaPost = $this->insert_query( $sql );
            if ( $lecturaPost == 'OK' ) $secuenciaDatos++;
            else return $lecturaPost.". Error al insertar parametros posteriores";                                
        }

        return 'OK';
    }

    // ----------------------------------------------------------------------------------------------------

    public function obtenerListasVerificacion () {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from lista_verificacion";
        $query = $this->array_query( $sql );
        $arr = array();

        foreach ( $query as $lista )
        {
            $id_mantenimiento = $lista[ 'id_mantenimiento' ];
            $sql = "select nombre_mantenimiento from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $nombre_mantenimiento = $this->array_query( $sql, 'nombre_mantenimiento', null );

            $id_equipo_aero = $lista[ 'id_equipo_aero' ];
            $sql = "select nombre_equipo_aero from equipo_aero where id_equipo_aero = '$id_equipo_aero'";
            $nombre_equipo_aero = $this->array_query( $sql, 'nombre_equipo_aero', null );

            $lista[ 'nombre_mantenimiento' ] = $nombre_mantenimiento[0];
            $lista[ 'nombre_equipo_aero' ] = $nombre_equipo_aero[0];
            $arr[] = $lista;
        }

        return $arr;
    }

    public function obtenerListasVerificacionPorParametros ( $data ) {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 
        
        $idEquipo = $data['equipo'];
        if ( !empty( $idEquipo ) ) 
        {            
            $sql = "select * from lista_verificacion where id_equipo_aero = '$idEquipo'";
            $obtenerListaVerificacion = $this->array_query( $sql );
            return $obtenerListaVerificacion;
        } 
        else return null;
    }

    // ---------- obtenertTipoParamentroAceptacion ------------------------------------------------    

    public function obtenerTipoParamentroAceptacion() {
        return $this->tipoParamentroAceptacion;
    }

    private $tipoParamentroAceptacion = array(
        // 'BINARIO', 
        'TEXTO', 
        'COMPARACION',
        'RANGO',
        'TOLERANCIA'
    );

    // ---------- actualizarTipoMantto -------------------------------------------------------------------------------------------

    private $datosActualizatTipoMantto = array(
        'nombre_mantenimiento', 'numero_aero', 'id_mantenimiento', 
        'id_mantenimiento_update', 'numero_frecuencia', 'tipo_frecuencia'
    );

    function actualizarTipoMantto( $data ) {
        $flag = $this->verificaDatosNulos( $data, $this->datosActualizatTipoMantto );
        if ( $flag )
        {
            $nombre_mantenimiento = $data[ 'nombre_mantenimiento' ][ 'valor' ];
            $id_mantenimiento = $data[ 'id_mantenimiento' ] [ 'valor' ];
            $id_mantenimiento_update = $data[ 'id_mantenimiento_update' ] [ 'valor' ];
            $numero_frecuencia = $data[ 'numero_frecuencia' ] [ 'valor' ];
            $tipo_frecuencia = $data[ 'tipo_frecuencia' ] [ 'valor' ];
            
            $sql =  "update tipo_mantenimiento set nombre_mantenimiento = '$nombre_mantenimiento', ".
                    "id_mantenimiento = '$id_mantenimiento', numero_frecuencia = $numero_frecuencia, ".
                    "tipo_frecuencia = '$tipo_frecuencia' where id_mantenimiento = '$id_mantenimiento_update'";

            // return $sql;

            $query = $this->insert_query( $sql );
            if ( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $query.'. Error al actualizar Tipo de mantenimiento';
            }
        } 
        else return 'NA';
    }

    # ------------------------------------

    public function systems_into_mantto() {
        $sql =  "SELECT DISTINCT id_sistema_aero ".
                "FROM actividad_verificar ".
                "ORDER BY id_sistema_aero ASC";

        $query = $this->array_query( $sql, 'id_sistema_aero', null );
        if ( $query == null ) return null;
        
        $arr = array(); // matriz de retorno

        foreach ( $query as $id_sistema_aero ) 
        {
            $sql =  "SELECT id_sistema_aero, nombre_sistema_aero ".
                    "FROM sistema_aero ".
                    "WHERE id_sistema_aero = '$id_sistema_aero'";
            $query = $this->query( $sql );

            $sql =  "SELECT count( id_actividad_verificar ) AS elementos ".
                    "FROM actividad_verificar ".
                    "WHERE id_sistema_aero = '$id_sistema_aero'";
            $elem = $this->query( $sql, 'elementos', null );            

            $query[ 'elementos' ] = $elem;
            $arr[] = $query;
        }

        return $arr;
    }

    public function equipo_into_systems_mantto ( $get ) {
        $id_sistema_aero = $get[ 'id_sistema_aero' ];
        if ( empty( $id_sistema_aero ) ) return null;

        $sql =  "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
                "WHERE  id_sistema_aero = '$id_sistema_aero'";        
        $query = $this->array_query( $sql, 'id_equipo_aero', null );
        if ( $query == null ) return null;
        $arr = array();

        foreach ( $query as $id_equipo_aero ) {
            $sql =  "SELECT id_equipo_aero, nombre_equipo_aero, id_sistema_aero ".
                    "FROM  equipo_aero ".
                    "WHERE id_equipo_aero = '$id_equipo_aero'"; 
            $query = $this->query( $sql );

            $sql =  "SELECT count( id_actividad_verificar ) AS elementos ".
                    "FROM actividad_verificar ".
                    "WHERE id_equipo_aero = '$id_equipo_aero'";
            $elem = $this->query( $sql, 'elementos', null );            

            $query[ 'elementos' ] = $elem;
            $arr[] = $query;
        }

        return $arr;
    }

    /**
     * [tipo_mantto_num_actividades description]
     * @return [Array] retorna los tipos de mantenimientos
     * con el número de actividades existentes en él
     * campos retornados:
     *     [String] [id_mantenimiento]
     *     [String] [nombre_mantenimiento]
     *     [Int] [elementos]
     */
    public function tipo_mantto_num_actividades () {
        $sql =  "SELECT id_mantenimiento, nombre_mantenimiento ".
                "FROM tipo_mantenimiento";

        $query = $this->array_query( $sql );
        if ( $query == null ) return null;
        $arr = array();

        foreach ( $query as $elem ) {
            $id_mantenimiento = $elem[ 'id_mantenimiento' ];
            $sql =  "SELECT count( id_actividad_verificar ) AS elementos ".
                    "FROM actividad_verificar ".
                    "WHERE id_mantenimiento = '$id_mantenimiento'";
            $query = $this->query( $sql, 'elementos', null );            

            $elem[ 'elementos' ] = $query;
            $arr[] = $elem;
        }

        return $arr;
    }

    public function num_actividades_into_lista () {
        $sql = "SELECT DISTINCT descripcion_lista_verificacion AS lista_verificacion FROM actividad_verificar";
        $arr = $this->array_query( $sql );
        $i = 0;
        foreach ( $arr as $row ) {
            $id = $row[ 'lista_verificacion' ];
            $sql = 
                "SELECT COUNT(descripcion_lista_verificacion) AS num_actividades ".
                "FROM actividad_verificar ".
                "WHERE descripcion_lista_verificacion = '$id'";

            $query = $this->query( $sql, 'num_actividades' );
            $arr[ $i ][ 'num_actividades' ] = $query;
            $i++;
        }

        return $arr;
    }


    public function actividades_into_lista( $get ) {
        $lista_verificacion = $get[ 'lista_verificacion' ];
        if( empty( $lista_verificacion ) ) return null;

        $sql = 
            "SELECT id_actividad_verificar, id_mantenimiento ".
            "id_sistema_aero, id_equipo_aero, actividad_verificar ".
            "FROM actividad_verificar ".
            "WHERE descripcion_lista_verificacion = '$lista_verificacion'";

        $arr = $this->array_query( $sql );
        $i = 0;
        foreach ( $arr as $row ) {
            $id_actividad_verificar = $row[ 'id_actividad_verificar' ];

            $arr[ $i ][ 'parametro_aceptacion' ] = $this->parametro_aceptacion( $id_actividad_verificar );
            $arr[ $i ][ 'lectura_actual' ] = $this->lectura( $id_actividad_verificar, 'lectura_actual' );
            $arr[ $i ][ 'lectura_posterior' ] = $this->lectura( $id_actividad_verificar, 'lectura_posterior' );
            $i++;
        }

        return $arr;
    }

    public function parametro_aceptacion ( $id_actividad_verificar ) {
        $sql = 
            "SELECT tipo_dato, dato, parametro, unidad_medida ".
            "FROM parametro_actividad ".
            "WHERE id_actividad = $id_actividad_verificar";

        $query = $this->query( $sql );

        $tipo_dato = $query[ 'tipo_dato' ];
        $dato = $query[ 'dato' ];
        $parametro = $query[ 'parametro' ];
        $unidad_medida = $query[ 'unidad_medida' ];
        $string = '';

        switch ( $tipo_dato ) {
            case 'BINARIO':
                $string = $parametro." ".$dato;
                break;

            case 'TEXTO':
                $string = $parametro." ".$dato;
                break;

            case 'COMPARACION':
                $string = $parametro." ".$dato." ".$unidad_medida;
                break;

            case 'RANGO':
                $arr_data = explode( ',', $dato );
                $inf = $arr_data[0];
                $sup = $arr_data[1];

                $string = 
                    $parametro." ".$inf." A ".$sup." ".
                    $unidad_medida;
                break;

            case 'TOLERANCIA':
                $arr_data = explode( ',', $dato );
                $inf = $arr_data[0];
                $sup = $arr_data[1];

                $string = 
                    $parametro." ".$inf." +- ".$sup." ".
                    $unidad_medida;
                break;
        }

        $query[ 'texto' ] = $string;
        return $query;
    }

    public function lectura ( $id_actividad_verificar, $tipo_lectura ) {
        $sql = 
            "SELECT tipo_dato, parametro, unidad_medida ".
            "FROM $tipo_lectura ".
            "WHERE id_actividad = $id_actividad_verificar";

        $query = $this->query( $sql );
        $parametro = $query[ 'parametro' ];
        $unidad_medida = $query[ 'unidad_medida' ];
        $tipo_dato = $query[ 'tipo_dato' ];
        $string = '';

        switch ( $tipo_dato ) {
            case 'Binario':
                $query[ 'texto' ] = $parametro;
                break;
            
            case 'Datos':
                $query[ 'texto' ] = $parametro." ______ ".$unidad_medida;
                break;
        }
        
        return $query;
    }

    public function actualizar_actividad_verificar ( $post ) {
        $rsp = array();
        $validar = 
            $this->verificaDatosNulos( $post, array( 
                'actividad_verificar', 'id_actividad_verificar'
            ));
        
        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_actividad_verificar = $post[ 'id_actividad_verificar' ][ 'valor' ];
        $actividad_verificar = $post[ 'actividad_verificar' ][ 'valor' ];
        $sql = 
            "UPDATE actividad_verificar ".
            "SET actividad_verificar = '$actividad_verificar' ".
            "WHERE id_actividad_verificar = $id_actividad_verificar";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento actualizado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$id_actividad_verificar, 'msj' => 'OK' );
            $this->conexion->commit();
        } 
        else 
        {            
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_actividad_verificar, 'msj' => 'Error al actualizar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;
    }
}