<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxGeneradores extends funcionesPrimarias
{
    private $estadoLicencia = array('C.A.', 'DISPONIBLE', 'FALLA', 'MTTO');

	public function ajaxGeneradores($host, $usuario, $clave, $baseDatos)
	{		
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);		
	}    

	function solicitudAjax( $accion, $post, $get )
	{
        switch ( $accion )
        {
            case 'actualizarGenerador':
                $actualizarGenerador = $this->actualizarGenerador( $post );
                echo json_encode($actualizarGenerador);
                break;

            case 'eliminarGenerador':
                $eliminarGenerador = $this->eliminarGenerador( $get );
                echo json_encode($eliminarGenerador);
                break;

            case 'nuevoGenerador':
                $nuevoGenerador = $this->nuevoGenerador( $post );
                echo json_encode( $nuevoGenerador );
                break;

            case 'obtenerEstadoLicencia':
                $obtenerEstadoLicencia = $this->obtenerEstadoLicencia();
                echo json_encode($obtenerEstadoLicencia);
                break;

            case 'obtenerGeneradores':
                $query = $this->obtenerGeneradores( $get );
                echo json_encode( $query );
                break;

            case 'obtenerGeneradoresPorUnidad':
                $obtenerGeneradoresPorUnidad = $this->obtenerGeneradoresPorUnidad( $get );
                echo json_encode($obtenerGeneradoresPorUnidad);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase ajaxGeneradores');
                break;                  
        }		
	}

    function obtenerEstadoLicencia() { return $this->estadoLicencia; } 

    // ---------- nuevoGenerador ------------------------------------------------------------------------------------------------

    private $datosNuevoGenerador = array(
        'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero', 'estado_licencia'
    );

    function nuevoGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoGenerador );

        if ( $flag === 'OK' )
        {
            $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
            $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
            $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ][ 'valor' ];
            $estado_licencia = $data[ 'estado_licencia' ][ 'valor' ];

            $sql = "insert into aeros(numero_unidad, numero_aero, capacidad_efectiva_aero, estado_licencia) values('$numero_unidad', '$numero_aero', $capacidad_efectiva_aero, '$estado_licencia')";                    
            $insertaGenerador = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ( $insertaGenerador === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else
            {
                $this->conexion->rollback();
                return $insertaGenerador.'. Error al ingresar generador al sistema';
            } 
        } 
        else return 'NA';
    }

    // --------------------------------------------------------------------------------------------------------------------------

    function obtenerGeneradores( $get )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $numero_unidad = $get[ 'numero_unidad' ];
        $numero_aero = $get[ 'numero_aero' ];

        if ( !empty( $numero_unidad ) ) $opt = 'numero_unidad';
        else if ( !empty( $numero_aero ) ) $opt = 'numero_aero';
        else $opt = null;

        switch ( $opt ) 
        {
            case 'numero_unidad':
                $sql = "select * from aeros where numero_unidad = '$numero_unidad'";
                break;

            case 'numero_aero':
                $sql = "select * from aeros where numero_aero = '$numero_aero'";
                break;
            
            default:
                $sql = "select * from aeros";
                break;
        }

        
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $this->conexion );
        return $query;
    }

    function obtenerGeneradoresPorUnidad( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $unidad = $data['unidad'];
        $sql = "select * from aeros where numero_unidad = ".$unidad;
        $obtenerAerogeneradores = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
        return $obtenerAerogeneradores;
    }

    function eliminarGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $numero_aero = $data['numero_aero'];

        if ( !empty( $numero_aero ) )
        {
            $sql = "delete from aeros where numero_aero = '$numero_aero'";
            $borrarAero = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $borrarAero === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $borrarAero.". Error al Eliminar Aerogenerador";
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarGenerador -------------------------------------------------------------------------------------------

    private $datosActualizarGenerador = array(
        'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero', 'numero_aero_update'
    );

    function actualizarGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarGenerador );
        if ( $flag )
        {
            $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
            $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
            $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ] [ 'valor' ];
            $numeroAero_update = $data[ 'numero_aero_update' ] [ 'valor' ];
            
            $sql = "update aeros set numero_unidad = $numero_unidad, numero_aero = '$numero_aero', capacidad_efectiva_aero = $capacidad_efectiva_aero where numero_aero = '$numeroAero_update'";

            $actualizarAerogenerador = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($actualizarAerogenerador === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $actualizarAerogenerador.'. Error al actualizar generador';
            }
        } 
        else return 'NA';
    }
}

$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxGeneradores( $host, $user, $pass, 'laventa_cfe' );

if ($obj->estadoConexion) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( 'Acceso no autorizado' );
?>