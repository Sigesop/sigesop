<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxEquiposGenerador extends funcionesPrimarias 
{
	public function ajaxEquiposGenerador($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

	public  function solicitudAjax( $accion, $post, $get )
	{
		switch ($accion)
		{
            case 'actualizarEquipoGenerador':
                $actualizarEquipoGenerador = $this->actualizarEquipoGenerador( $post );
                echo json_encode($actualizarEquipoGenerador);
                break;  

            case 'eliminarEquipoGenerador':
                $eliminarEquipoGenerador = $this->eliminarEquipoGenerador( $get );
                echo json_encode($eliminarEquipoGenerador);
              break;

	        case 'nuevoEquipoGenerador':
	            $nuevoEquipoGenerador = $this->nuevoEquipoGenerador( $post );
	            echo json_encode($nuevoEquipoGenerador);
	            break;

	        case 'obtenerEquipoGenerador':
	            $obtenerEquipoGenerador = $this->obtenerEquipoGenerador();
	            echo json_encode($obtenerEquipoGenerador);
	            break;

            case 'obtenerEquipoGeneradorPorSistema':
                $obtenerEquipoGeneradorPorSistema = $this->obtenerEquipoGeneradorPorSistema( $get );
                echo json_encode($obtenerEquipoGeneradorPorSistema);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase ajaxEquiposGenerador');
                break;                     
        }		
	}

    // ---------- nuevoEquipoGenerador -----------------------------------------------------------------------------------

    private $datosNuevoEquipo = array( 'idEquipo', 'nombreEquipo', 'idSistema' );

    public function nuevoEquipoGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoEquipo );
        if( $flag === 'OK' )
        {
            $idEquipo = $data['idEquipo']['valor'];
            $nombreEquipo = $data['nombreEquipo']['valor'];
            $idSistema = $data['idSistema']['valor'];

            $sql = "insert into equipo_aero(id_equipo_aero, nombre_equipo_aero, id_sistema_aero) values('$idEquipo', '$nombreEquipo', '$idSistema')";               
            $nuevoSistema = $this->consultaInsercionSimple($sql, $this->conexion);
            if($nuevoSistema === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $nuevoSistema.'. Error al insertar equipo.';
            }
        } 
        else return 'NA';
    }

    // --------------------------------------------------------------------------------------------------------------------

    public function obtenerEquipoGenerador()
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 
        $conexion = $this->conexion;

        $sql = "select * from equipo_aero";
        $mtz = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr = array(); // matriz de retorno

        // ---------- buscar nombre del sistema, correspondiente en el equipo

        foreach ( $mtz as $equipo )
        {
            $id_sistema_aero = $equipo[ 'id_sistema_aero' ];
            $sql = "select nombre_sistema_aero from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->consultaSimpleArrayNumerico( $sql, 'nombre_sistema_aero', $conexion, null );

            $equipo[ 'nombre_sistema_aero' ] = $query[0];
            $arr [] = $equipo;
        }

        return $arr;
    }

    public function obtenerEquipoGeneradorPorSistema( $data ) 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $idSistema = $data['valor'];
        if ( !empty($idSistema) ) 
        {
            $sql = "select * from equipo_aero where id_sistema_aero = '$idSistema'";
            $obtenerEquipoGenerador = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
            return $obtenerEquipoGenerador;
        } 
        else return null;
    }

    public function eliminarEquipoGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $id_equipo = $data['id_equipo_aero'];      
        if ( !empty( $id_equipo ) )
        {
            $sql = "delete from equipo_aero where id_equipo_aero = '$id_equipo'";
            $borrarEquipo = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $borrarEquipo === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $borrarEquipo.". Error al eliminar Equipo";
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarEquipoGenerador -----------------------------------------------------------------------------------

    private $datosActualizarEquipo = array( 'idEquipo_update', 'idEquipo', 'idSistema', 'nombreEquipo' );

    public function actualizarEquipoGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarEquipo );
        if ( $flag === 'OK' )
        {
            $idEquipo_update = $data['idEquipo_update']['valor'];
            $idEquipo = $data['idEquipo']['valor'];
            $Sistema = $data['idSistema']['valor'];
            $NombreEquipo = $data['nombreEquipo']['valor'];

            $sql = "update equipo_aero set id_equipo_aero = '$idEquipo', nombre_equipo_aero='$NombreEquipo', id_sistema_aero='$Sistema' where id_equipo_aero='$idEquipo_update'";
            $actualizarEquipo = $this->consultaInsercionSimple($sql, $this->conexion);
            if ($actualizarEquipo === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $actualizarEquipo.". Error al Actualizar Equipo";
            }
        } 
        else return 'NA'; 
    }
}

$_SESSION['host'] = 'localhost';

$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxEquiposGenerador($host , $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion ) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( "Acceso no autorizado" );
?>