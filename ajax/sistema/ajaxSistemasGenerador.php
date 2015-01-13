<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxSistemasGenerador extends funcionesPrimarias
{
	public function ajaxSistemasGenerador($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

	function solicitudAjax( $accion, $post, $get )
	{
		switch ($accion)
		{
            case 'actualizarSistema':
                $actualizarSistema = $this->actualizarSistema( $post );
                echo json_encode($actualizarSistema);
                break;

            case 'eliminarSistema':
                $eliminarSistema = $this->eliminarSistema( $get );
                echo json_encode($eliminarSistema);
                break;                

            case 'nuevoSistema':
                $nuevoSistema = $this->nuevoSistema( $post );
                echo json_encode($nuevoSistema);
                break;

            case 'obtenerSistemas':
                $obtenerSistemas = $this->obtenerSistemas();
                echo json_encode($obtenerSistemas);        
                break;

            default:
                echo json_encode('Funcion no registrada en la clase ajaxSistemasGenerador');
                break;                    
		}
	}

    // ---------- nuevoSistema ------------------------------------------------------------------------------------------

    private $datosNuevoSistema = array( 'idSistema', 'nombreSistema' );

    function nuevoSistema( $data )
    {       
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoSistema );    

        if( $flag === 'OK' )
        {
            $idSistemaAero = $data['idSistema']['valor'];
            $nombreSistemaAero = $data['nombreSistema']['valor'];

            $sql = "insert into sistema_aero(id_sistema_aero, nombre_sistema_aero) values('$idSistemaAero', '$nombreSistemaAero')";
            $nuevoSistema = $this->consultaInsercionSimple($sql, $this->conexion);
            if($nuevoSistema === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $nuevoSistema.'. Error al crear nuevo sistema';
            }
        } 
        else return 'NA';
    }

    // ------------------------------------------------------------------------------------------------------------------

    function obtenerSistemas()
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from sistema_aero";
        $obtenerSistemas = $this->consultaSimpleArrayNumericoMultiple($sql, $this->conexion);
        return $obtenerSistemas;  
    }

    function eliminarSistema( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $id_sistema_aero = $data['id_sistema_aero'];
        if ( !empty( $id_sistema_aero ) )
        {
            $sql = "delete from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $borrarSistema = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $borrarSistema === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $borrarSistema.". Error al Eliminar Sistema";
            }
        } else return 'NA';        
    }

    // ---------- actualizarSistema ------------------------------------------------------------------------------------------

    private $datosActualizarSistema = array( 'nombreSistema', 'idSistema', 'idSistemaUpdate' );

    function actualizarSistema( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarSistema );       
        if ( $flag === 'OK' )
        {
            $nombreSistema = $data['nombreSistema']['valor'];
            $idSistema = $data['idSistema']['valor'];
            $idSistema_update = $data['idSistemaUpdate']['valor']; 

            $sql = "update sistema_aero set id_sistema_aero = '$idSistema', nombre_sistema_aero='$nombreSistema' where id_sistema_aero='$idSistema_update'";            
            $actualizarSistema = $this->consultaInsercionSimple($sql, $this->conexion);
            if ($actualizarSistema === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $actualizarSistema.'. Error al actualizar sistema';
            }
        } 
        else return 'NA';        
    }    

    // -----------------------------------------------------------------------------------------------------------------------
}

$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxSistemasGenerador($host , $user, $pass, 'laventa_cfe');

if ($obj->estadoConexion) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( 'Acceso no autorizado' );