<?php
include 'sigesop.class.php';

class unidades extends sigesop 
{
    public function __construct( $usuario, $clave ) { 
        parent::sigesop( $usuario, $clave ); 
    }
    
    public function __destruct(){ parent::__destruct(); }

    public function solicitudAjax( $accion, $post, $get ) {
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
                $query = $this->eliminarUnidad( $get );
                echo json_encode($query);
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
                echo json_encode('Funcion no registrada en la clase unidades');
                break;                
        }        
    }

    public function nuevaUnidad( $post ) {
        $rps = array();
        $validar = 
            $this->verificaDatosNulos( $post, array( 'numero_unidad' )); 

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $post['numero_unidad']['valor'];
        $clave_20 = $this->query( 'select clave_20 from central', 'clave_20' );
    
        $sql = 
            "INSERT INTO unidad_aero(clave_20, numero_unidad) ".
            "VALUES('$clave_20', '$numero_unidad')";

        // return  $sql;
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => "Unidad: ".$numero_unidad, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad ingresada satisfactoriamente.' );
            return $rsp;
        }
        else
        {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nueva unidad' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Unidad: ".$numero_unidad, 'msj' => $query );
            return $rsp;
        } 
    }

    public function actualizarUnidad( $post ){
        $rps = array();
        $validar = 
            $this->verificaDatosNulos( $post, 
                array( 'numero_unidad_update', 'numero_unidad' )
            ); 

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $post['numero_unidad']['valor'];        
        $numero_unidad_update = $post['numero_unidad_update']['valor'];

        $sql = 
            "UPDATE unidad_aero SET numero_unidad = '$numero_unidad' ".
            "WHERE numero_unidad = '$numero_unidad_update'";
        
        // return $sql;
        $query = $this->insert_query( $sql );
        if ($query === 'OK')
        {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => "Unidad: ".$numero_unidad, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad actualizada satisfactoriamente.' );
            return $rsp; 
        } 
        else 
        {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar unidad' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Unidad: ".$numero_unidad, 'msj' => $query );
            return $rsp;
        }
    }   

    public function obtenerUnidades() {
        $sql = 
            "SELECT clave_20, numero_unidad, capacidad_instalada, ".
            "capacidad_efectiva_unidad ".
            "FROM unidad_aero";

        $query = $this->array_query( $sql );
        return $query;
    } 

    public function eliminarUnidad( $get ) {
        $rps = array();
        $validar = 
            $this->verificaDatosNulos( $get, 
                array( 'numero_unidad' )
            ); 

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $get['numero_unidad'];

        $sql = 
            "DELETE FROM unidad_aero ".
            "WHERE numero_unidad = '$numero_unidad'";

        // return $sql;
        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => "Unidad ".$numero_unidad, 'msj' => 'Eliminada' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad eliminada satisfactoriamente.' );
            return $rsp; 
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar unidad' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Unidad ".$numero_unidad, 'msj' => $query );
            return $rsp;
        }
    }
}