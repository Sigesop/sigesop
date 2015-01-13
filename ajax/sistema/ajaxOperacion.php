<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxOperacion extends funcionesPrimarias
{	
	public function __construct($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

    public function __destruct()
    {
        parent::__destruct();
    }

	public function solicitudAjax( $accion, $post, $get )
	{
		switch ( $accion)
		{
            case 'eliminar_libro_licencia':
                $query = $this->eliminar_libro_licencia( $get );
                echo json_encode( $query );
                break;

            case 'nuevo_libro_licencia':
                $query = $this->nuevo_libro_licencia( $post );
                echo json_encode( $query );
                break; 

            case 'obtener_libro_licencia':
                $query = $this->obtener_libro_licencia( $post );
                echo json_encode( $query );
                break; 

            default:
                echo json_encode('Funcion no registrada en la clase ajaxOperacion');
            break;
		}
	}

    function eliminar_libro_licencia( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $id_libro_licencia = $data['id_libro_licencia'];

        if ( !empty( $id_libro_licencia ) )
        {
            $sql = "delete from libro_licencia where id_libro_licencia = '$id_libro_licencia'";
            $query = $this->consultaInsercionSimple($sql, $this->conexion);
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

    public function nuevo_libro_licencia( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $anio_licencia = $data[ 'anio_licencia' ][ 'valor' ];

        if ( !empty( $anio_licencia ) ) 
        {
            $conexion = $this->conexion;
            $sql = "insert into libro_licencia ( anio_licencia ) values ( '$anio_licencia' )";
            // return $sql;
            $query = $this->consultaInsercionSimple( $sql, $conexion );
            
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

    public function obtener_libro_licencia ()
    {
        $sql = "select * from libro_licencia";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $this->conexion );
        return $query;
    }
    
}


$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxOperacion($host , $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion ) 
    $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( "Acceso no autorizado" );
?>