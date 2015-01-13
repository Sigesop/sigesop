<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxUnidades extends funcionesPrimarias 
{
	public function ajaxUnidades($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

    function solicitudAjax( $accion, $post, $get )
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ( $accion )
        {    

            case 'actualizarUnidad':
                $actualizarUnidad = $this->actualizarUnidad( $post );
                echo json_encode($actualizarUnidad);
                break;

            case 'eliminarUnidad':
                $eliminarUnidad = $this->eliminarUnidad( $get );
                echo json_encode($eliminarUnidad);
                break;                

	        // Inserta una nueva unidad
	        case 'nuevaUnidad':
	            $nuevaUnidad = $this->nuevaUnidad( $post );
	            echo json_encode( $nuevaUnidad );
	            break;

	        // Obtiene el total de unidades existentes en la central
	        case 'obtenerUnidades':
	            $obtenerUnidades = $this->obtenerUnidades();
	            echo json_encode($obtenerUnidades);
	            break;                

            default:
                echo json_encode('Funcion no registrada en la clase AjaxUnidades');
                break;                
        }        
    }

    // ---------- nuevaUnidad --------------------------------------------------------------------------------------------

    private $datosNuevaUnidad = array( 'clave_20', 'numero_unidad' );

    function nuevaUnidad( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";      

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevaUnidad ); 
        if( $flag === 'OK' )
        {
            $claveCentralUnidad = $data['clave_20']['valor'];
            $numeroUnidad = $data['numero_unidad']['valor']; 
                       
            $sql = "insert into unidad_aero(clave_20, numero_unidad) values('$claveCentralUnidad', '$numeroUnidad')";
            $nuevaUnidad = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $nuevaUnidad === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else
            {
                $this->conexion->rollback();
                return $nuevaUnidad." .Error al insertar nueva unidad.";
            } 
        } 
        else return 'NA';
    }    

    // ---------- actualizarUnidad ---------------------------------------------------------------------------------------

    private $datosActualizarUnidad = array( 'numero_unidad_update', 'numero_unidad' );

    function actualizarUnidad( $data )
    {     
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarUnidad );

        if ( $flag === 'OK' )
        {
            $numeroUnidad = $data['numero_unidad']['valor'];        
            $numeroUnidad_update = $data['numero_unidad_update']['valor'];

            $sql = "update unidad_aero set numero_unidad = '$numeroUnidad' where numero_unidad = '$numeroUnidad_update'";
            $actualizarUnidad = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($actualizarUnidad === 'OK')
            {
                $this->conexion->commit();
                return 'OK';  
            } 
            else 
            {
                $this->conexion->rollback();
                return $actualizarUnidad;
            }
        } 
        else return 'NA';
    }

    // -------------------------------------------------------------------------------------------------------------------  

    function obtenerUnidades()
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $sql = "select * from unidad_aero";
        $obtenerUnidades = $this->consultaSimpleArrayNumericoMultiple( $sql, $this->conexion );
        return $obtenerUnidades;
    } 

    function eliminarUnidad( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $numeroUnidad = $data['numero_unidad'];
        if ( !empty( $numeroUnidad ) )
        {
            $sql = "delete from unidad_aero where  numero_unidad = '$numeroUnidad'";
            $eliminarUnidad = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($eliminarUnidad == 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $eliminarUnidad;
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

$obj = new ajaxUnidades( $host, $user, $pass, 'laventa_cfe' );

if ( $obj->estadoConexion ) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( 'Acceso no autorizado' );

?>