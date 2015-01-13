<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxListaVerificacion extends funcionesPrimarias
{
    private $solo_lectura = array( 'N/A' );

    public function ajaxListaVerificacion($host, $usuario, $clave, $baseDatos)
    {
    	parent::funcionesPrimarias( $host, $usuario, $clave, $baseDatos );
    }

    function solicitudAjax( $accion, $post, $get )
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ( $accion )
        {
            case 'actualizarTipoMantto':
                $query = $this->actualizarTipoMantto( $post );
                echo json_encode( $query );
                break;

            case 'actualizarUnidadMedida':
                $query = $this->actualizarUnidadMedida( $post );
                echo json_encode( $query );
                break;

            case 'eliminarTipoMantto':
                $query = $this->eliminarTipoMantto( $get );
                echo json_encode( $query );
                break;

            case 'eliminarUnidadMedida':
                $query = $this->eliminarUnidadMedida( $get );
                echo json_encode( $query );
                break;

            case 'nuevaListaVerificacion':
                $query = $this->nuevaListaVerificacion( $post );
                echo json_encode($query);
                break;

            case 'nuevaUnidadMedida':
                $query = $this->nuevaUnidadMedida( $post );
                echo json_encode($query);
                break;

            case 'nuevoTipoMantenimiento':
                $query = $this->nuevoTipoMantenimiento( $post );
                echo json_encode( $query );
                break;

            case 'obtenerListasVerificacion':
                $query = $this->obtenerListasVerificacion();
                echo json_encode($query);
                break;               

            case 'obtenerListasVerificacionPorParametros':
                $query = $this->obtenerListasVerificacionPorParametros( $get );
                echo json_encode( $query );
                break;

            case 'obtenerTipoMantenimiento':
                $query = $this->obtenerTipoMantenimiento();
                echo json_encode($query);
                break;

            case 'obtenerTipoParamentroAceptacion':
                $query = $this->obtenerTipoParamentroAceptacion();
                echo json_encode( $query );
                break;

            case 'obtenerUnidadMedida':
                $query = $this->obtenerUnidadMedida();
                echo json_encode($query);
                break;

            case 'systems_into_mantto':
                $query = $this->systems_into_mantto();
                echo json_encode( $query );
                break;    

            default:
                echo json_encode('Funcion no registrada en la clase ajaxListaVerificacion');
                break;                  
        }  
    }

    // ---------- nuevaUnidadMedida ------------------------------------------------------------------------

    private $datosNuevaUnidadMedida = array( 'unidad_medida', 'descripcion_unidad_medida' );

    public function nuevaUnidadMedida( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevaUnidadMedida );
        if ( $flag === 'OK' )
        {
            $unidad_medida = $data['unidad_medida']['valor'];
            $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

            $sql = "insert into catalogo_unidad_medida values('$unidad_medida','$descripcion_unidad_medida')";
            $nuevaUnidadMedida = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($nuevaUnidadMedida == 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $nuevaUnidadMedida.'. Error al insertar unidad de medida';
            }
        } 
        else return 'NA';
    }

    // -----------------------------------------------------------------------------------------------------
    
    public function obtenerUnidadMedida() 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from catalogo_unidad_medida";
        $unidadMedida = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
        return $unidadMedida;
    }

    // ---------- nuevoTipoMantenimiento -------------------------------------------------------------------

    private $datosNuevoTipoMantto = array(
        'numero_frecuencia', 'tipo_frecuencia',
        'id_mantenimiento', 'nombre_mantenimiento'
    );

    public function nuevoTipoMantenimiento( $data )
    {
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
            $insertarTipoMantto = $this->consultaInsercionSimple($sql, $this->conexion);
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

    public function obtenerTipoMantenimiento() 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from tipo_mantenimiento";
        $obtenerTipoMantenimiento = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
        return $obtenerTipoMantenimiento;
    }

    // -----------------------------------------------------------------------------------------------------

    public function eliminarTipoMantto ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $id_mantenimiento = $data['id_mantenimiento'];

        if ( !empty( $id_mantenimiento ) )
        {
            $sql = "delete from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $query = $this->consultaInsercionSimple( $sql, $this->conexion );
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

    public function nuevaListaVerificacion ( $data ) 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";      
        $conexion = $this->conexion;

        $flag = $this->verificaDatosNulos( $data, $this->datosListaVerificacion );     

        if ( $flag === 'OK' ) 
        {
            $id_mantenimiento = utf8_encode( $data[ 'id_mantenimiento' ][ 'valor' ] );
            $descripcion_lista_verificacion = utf8_encode( $data[ 'descripcion_lista_verificacion' ][ 'valor' ] );
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

    private function __insertarActividad ( $data, $id_mantenimiento, $descripcion_lista_verificacion, $conexion )
    {
        // if ( $this->verificaDatosNulos( $data, $this->datosActividadLista ) ) return 'NA';

        $noAct = 1;
        foreach ( $data as $act ) 
        {
            $id_actividad_verificar = $this->autoincrement( 'select id_actividad_verificar from actividad_verificar order by id_actividad_verificar asc', 'id_actividad_verificar', $conexion );
            $id_sistema_aero = $act[ 'id_sistema_aero' ][ 'valor' ];            
            !empty( $act[ 'id_equipo_aero' ][ 'valor' ] ) ?
                $id_equipo_aero = "'".$act[ 'id_equipo_aero' ][ 'valor' ]."'":
                $id_equipo_aero = 'null';            
            $actividad_verificar = utf8_encode( $act[ 'actividad_verificar' ][ 'valor' ] );            
            
            // ----------

            $parametro_actividad = $act[ 'parametro_actividad' ];
            $lectura_actual = $act[ 'lectura_actual' ];
            $lectura_posterior = $act[ 'lectura_posterior' ];            

            // ---------- insertar datos de actividad

            $sql =  "insert into actividad_verificar values( $id_actividad_verificar, '$id_mantenimiento', '$id_sistema_aero', ".
                    "$id_equipo_aero, '$descripcion_lista_verificacion', '$actividad_verificar' )";

            // return $sql;
            $query = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $query !== 'OK') return $query.". Error al insertar actividad No. ".$noAct;

            $query = $this->__insertarParametro( $parametro_actividad, $id_actividad_verificar, $conexion );
            if ( $query !== 'OK' ) return $query;

            $query = $this->__insertarLecturas( $lectura_actual, $lectura_posterior, $id_actividad_verificar, $conexion );
            if ( $query !== 'OK' ) return $query;
            
            $noAct++;
        }
        
        return 'OK';
    }

    private function __insertarParametro ( $arr, $id, $conexion )
    {
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
            $parametro = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $parametro !== 'OK' ) return $parametro." Error al insertar paramentro No. ".$secuencia_datos;

            $secuencia_datos++;
        }

        return 'OK';
    }

    private function __insertarLecturas ( $arrActual, $arrPost, $id, $conexion )
    {   
        $secuenciaDatos = 1;

        foreach ( $arrActual as $dato ) 
        {
            $tipo_dato = $dato[ 'tipo_dato' ];
            $parametro = $dato[ 'parametro' ][ 'valor' ];
            $unidad_medida = $dato[ 'unidad_medida' ][ 'valor' ];

            $index = $this->autoincrement( "select id from lectura_actual order by id asc", 'id',$conexion );
            $sql = "insert into lectura_actual values( $id, '$tipo_dato', '$parametro', '$unidad_medida', $secuenciaDatos, $index )";
            // return $sql;
            $lecturaActual = $this->consultaInsercionSimple( $sql, $conexion );
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
            $lecturaPost = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ( $lecturaPost == 'OK' ) $secuenciaDatos++;
            else return $lecturaPost.". Error al insertar parametros posteriores";                                
        }

        return 'OK';
    }

    // ----------------------------------------------------------------------------------------------------

    public function obtenerListasVerificacion () 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from lista_verificacion";
        $query = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
        $arr = array();

        foreach ( $query as $lista )
        {
            $id_mantenimiento = $lista[ 'id_mantenimiento' ];
            $sql = "select nombre_mantenimiento from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $nombre_mantenimiento = $this->consultaSimpleArrayNumerico( $sql, 'nombre_mantenimiento', $this->conexion, null );

            $id_equipo_aero = $lista[ 'id_equipo_aero' ];
            $sql = "select nombre_equipo_aero from equipo_aero where id_equipo_aero = '$id_equipo_aero'";
            $nombre_equipo_aero = $this->consultaSimpleArrayNumerico( $sql, 'nombre_equipo_aero', $this->conexion, null );

            $lista[ 'nombre_mantenimiento' ] = $nombre_mantenimiento[0];
            $lista[ 'nombre_equipo_aero' ] = $nombre_equipo_aero[0];
            $arr[] = $lista;
        }

        return $arr;
    }

    public function obtenerListasVerificacionPorParametros ( $data ) 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 
        
        $idEquipo = $data['equipo'];
        if ( !empty( $idEquipo ) ) 
        {            
            $sql = "select * from lista_verificacion where id_equipo_aero = '$idEquipo'";
            $obtenerListaVerificacion = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
            return $obtenerListaVerificacion;
        } 
        else return null;
    }

    // ---------- obtenertTipoParamentroAceptacion ------------------------------------------------    

    public function obtenerTipoParamentroAceptacion()
    {
        return $this->tipoParamentroAceptacion;
    }

    private $tipoParamentroAceptacion = array(
        // 'BINARIO', 
        'TEXTO', 
        'COMPARACION',
        'RANGO',
        'TOLERANCIA'
    );

    // ----------------------------------------------------------------------------------------------------    

    public function eliminarUnidadMedida ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $unidad_medida = $data[ 'unidad_medida' ];
                
        if ( !empty( $unidad_medida ) )
        {        
            if ( in_array( $unidad_medida, $this->solo_lectura ) ) // verificamos que no sea un elemente de solo lectura
                    return "Operación Imposible, elemento de solo lectura.";

            $sql = "delete from catalogo_unidad_medida where unidad_medida = '$unidad_medida'";
            $query = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al insertar Eliminar Aerogenerador";
            }
        }

        else return 'NA';
    }

    // ---------- actualizarUnidadMedida ------------------------------------------------------------------

    private $datosActualizarUnidadMedida = array( 'unidad_medida', 'unidad_medida_update', 'descripcion_unidad_medida' );

    public function actualizarUnidadMedida( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarUnidadMedida );
        
        if ( $flag === 'OK' )
        {
            $unidad_medida = $data['unidad_medida']['valor'];
            $unidad_medida_update = $data['unidad_medida_update']['valor'];
            $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

            if ( in_array( $unidad_medida, $this->solo_lectura ) ) // verificamos que no sea un elemente de solo lectura
                    return "Operación Imposible, elemento de solo lectura.";

            $sql = "update catalogo_unidad_medida set unidad_medida = '$unidad_medida', descripcion_unidad_medida = '$descripcion_unidad_medida' where unidad_medida = '$unidad_medida_update'";
            $query = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($query == 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $query.'. Error al insertar unidad de medida';
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarTipoMantto -------------------------------------------------------------------------------------------

    private $datosActualizatTipoMantto = array(
        'nombre_mantenimiento', 'numero_aero', 'id_mantenimiento', 
        'id_mantenimiento_update', 'numero_frecuencia', 'tipo_frecuencia'
    );

    function actualizarTipoMantto( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

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

            $query = $this->consultaInsercionSimple( $sql, $this->conexion );
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

    // -----------------------------------------------------------------------------------------------

    public function systems_into_mantto( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $sql = "select id_sistema_aero from actividad_verificar order by id_sistema_aero asc";

        $query = $this->consultaSimpleArrayNumerico( $sql, 'id_sistema_aero', $conexion, null );
        if ( $query == null ) return null;
        
        $mtz = array_unique( $query );
        $arr = array(); // matriz de retorno

        foreach ( $mtz as $id_sistema_aero ) 
        {
            $sql = "select * from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

            $sql = "select count( id_actividad_verificar ) as elementos from actividad_verificar where id_sistema_aero = '$id_sistema_aero'";
            $elem = $this->consultaSimpleArrayNumerico( $sql, 'elementos', $conexion, null );            

            $query[ 0 ][ 'elementos' ] = $elem[ 0 ];
            $arr[] = $query[ 0 ];
        }

        return $arr;
    }
}

$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxListaVerificacion($host, $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion ) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode(  "Acceso no autorizado" );

?>