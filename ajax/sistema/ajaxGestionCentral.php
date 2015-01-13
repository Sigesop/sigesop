<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxGestionCentral extends funcionesPrimarias 
{
	public function ajaxGestionCentral($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

    function solicitudAjax( $accion, $post, $get )
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ($accion)
        {    
            case 'actualizarDatosCentral':
                $actualizarDatosCentral = $this->actualizarDatosCentral( $post );
                echo json_encode($actualizarDatosCentral);
                break;

	        // inserta los datos de la central
	        case 'nuevaCentral':
	            $nuevaCentral = $this->nuevaCentral( $post );
	            echo json_encode($nuevaCentral);
	            break;

            // Obtiene los todos los datos de la central
            case 'obtenerDatosCentral':
                $obtenerDatosCentral = $this->obtenerDatosCentral();
                echo json_encode($obtenerDatosCentral);
                break;       

            default:
                echo json_encode('Funcion no registrada en la clase ajaxGestionCentral');
                break;  

        }        
    }

    function obtenerDatosCentral()
    {

        /****CAMPOS DE LA TABLA CENTRAL*****/
        // clave_20                         |
        // clave_SAP                        |
        // centro_costo                     |
        // nombre_central                   |
        // direccion                        |
        // telefono                         |
        // cp                               |
        // superintendente                  |
        // capacidad_instalada              |
        // capacidad_efectiva_central       |

        $SQL_obtenerDatosCentral = "select * from central";
        $obtenerDatosCentral = $this->consultaSimpleArrayNumericoMultiple($SQL_obtenerDatosCentral, $this->conexion);
        return $obtenerDatosCentral;
    }

    // ---------- nuevaCentral -------------------------------------------------------------------------------------------------------

    private $datosNuevaCentral = array(
        'claveCentral', 'claveSAP', 'centroCosto', 'nombreCentral', 'direccion',
        'telefono', 'codigoPostal', 'superintendente'
    );

    function nuevaCentral( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";        
        
        $flag = $this->verificaDatosNulos( $data, $this->datosNuevaCentral );                
        if ( $flag === 'OK' )
        {
            $clave = $data["claveCentral"]['valor'];
            $claveSAP = $data["claveSAP"]['valor'];
            $centroCosto = $data["centroCosto"]['valor'];
            $nombreCentral = $data["nombreCentral"]['valor'];
            $direccionCentral = $data["direccion"]['valor'];
            $telefonoCentral = $data["telefono"]['valor'];
            $cpCentral = $data["codigoPostal"]['valor'];
            $superintendenteCentral = $data["superintendente"]['valor'];

            $sql = "insert into central(clave_20, clave_sap, centro_costo, nombre_central, direccion, telefono, cp, superintendente) values('$clave', '$claveSAP', '$centroCosto', '$nombreCentral', '$direccionCentral', '$telefonoCentral', '$cpCentral', '$superintendenteCentral')";
            // return $sql;
            $nuevaCentral = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $nuevaCentral === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $nuevaCentral.'. Error al insertar los datos';
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarDatosCentral --------------------------------------------------------------------------------

    private $datosActualizarCentral = array(
        'claveCentralUpdate', 'claveCentral', 'claveSAP', 'centroCosto', 'nombreCentral', 
        'direccion', 'telefono', 'codigoPostal', 'superintendente'
    );

    function actualizarDatosCentral( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";        
        
        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarCentral );
        
        if ( $flag === 'OK' )
        {
            $clave_update = $data['claveCentralUpdate']['valor'];
            $clave = $data["claveCentral"]['valor'];
            $claveSAP = $data["claveSAP"]['valor'];
            $centroCosto = $data["centroCosto"]['valor'];
            $nombreCentral = $data["nombreCentral"]['valor'];
            $direccionCentral = $data["direccion"]['valor'];
            $telefonoCentral = $data["telefono"]['valor'];
            $cpCentral = $data["codigoPostal"]['valor'];
            $superintendenteCentral = $data["superintendente"]['valor'];

            $sql = "update central set clave_20='$clave', clave_sap='$claveSAP', centro_costo='$centroCosto', nombre_central='$nombreCentral', direccion='$direccionCentral', telefono='$telefonoCentral', cp='$cpCentral', superintendente='$superintendenteCentral' where clave_20='$clave_update'";
            $actualizaCentral = $this->consultaInsercionSimple($sql, $this->conexion);
            if( $actualizaCentral === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $actualizaCentral.'. Error en la actualizacion de los datos';
            }

        } 
        else return 'NA';
    }   

    // ------------------------------------------------------------------------------------------------------------------
}

$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxGestionCentral( $host, $user, $pass, 'laventa_cfe' );

if ( $obj->estadoConexion ) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( 'Acceso no autorizado' );

?>