<?php
include 'sigesop.class.php';

class gestionCentral extends sigesop 
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() { parent::__destruct(); }

    function solicitudAjax( $accion, $post, $get ) {
        switch ( $accion )
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
                echo json_encode('Funcion no registrada en la clase gestionCentral');
                break;  

        }        
    }

    function obtenerDatosCentral() {
        $sql = 
            "SELECT clave_20, clave_sap, centro_costo, nombre_central, ".
            "direccion, telefono, cp, superintendente, capacidad_instalada ".
            "FROM central";
        $query = $this->query( $sql );
        return $query;
    }

    function nuevaCentral( $post ) {
        $rsp = array();
        $validar = 
            $this->verificaDatosNulos( $post, array(
                'clave_20', 'clave_sap', 
                'centro_costo', 'nombre_central', 'direccion', 
                'telefono', 'cp', 'superintendente'
            ));        
        
        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $clave_20 = $post["clave_20"]['valor'];
        $clave_sap = $post["clave_sap"]['valor'];
        $centro_costo = $post["centro_costo"]['valor'];
        $nombre_central = $post["nombre_central"]['valor'];
        $direccion = $post["direccion"]['valor'];
        $telefono = $post["telefono"]['valor'];
        $cp = $post["cp"]['valor'];
        $superintendente = $post["superintendente"]['valor'];

        $sql = 
            "INSERT INTO central( clave_20, clave_sap, centro_costo, ".
            "nombre_central, direccion, telefono, cp, superintendente ) ".
            "VALUES ('$clave_20', '$clave_sap', '$centro_costo', ".
            "'$nombre_central', '$direccion', '$telefono', ".
            "'$cp', '$superintendente')";

        // return $sql;
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$clave_20, 'msj' => 'OK' );
            $this->conexion->commit();
        } 
        else 
        {            
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_20, 'msj' => 'Error al insertar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;
    }

    function actualizarDatosCentral( $post ) {
        $rsp = array();
        $validar = 
            $this->verificaDatosNulos( $post, array(
                'clave_20_update', 'clave_20', 'clave_sap', 
                'centro_costo', 'nombre_central', 'direccion', 
                'telefono', 'cp', 'superintendente'
            ));
        
        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }
        
        $clave_20_update = $post['clave_20_update']['valor'];
        $clave_20 = $post["clave_20"]['valor'];
        $clave_sap = $post["clave_sap"]['valor'];
        $centro_costo = $post["centro_costo"]['valor'];
        $nombre_central = $post["nombre_central"]['valor'];
        $direccion = $post["direccion"]['valor'];
        $telefono = $post["telefono"]['valor'];
        $cp = $post["cp"]['valor'];
        $superintendente = $post["superintendente"]['valor'];

        $sql = 
            "UPDATE central ".
            "SET clave_20 = '$clave_20', clave_sap='$clave_sap', ".
            "centro_costo='$centro_costo', nombre_central='$nombre_central', ".
            "direccion='$direccion', telefono='$telefono', ".
            "cp='$cp', superintendente='$superintendente' ".
            "WHERE clave_20 = '$clave_20_update'";

        // return $sql;
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'central actualizada satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$clave_20, 'msj' => 'OK' );
            $this->conexion->commit();
        } 
        else 
        {            
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_20, 'msj' => 'Error al insertar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;      
    }   
}