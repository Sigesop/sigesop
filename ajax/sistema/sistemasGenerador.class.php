<?php
include 'sigesop.class.php';

class sistemasGenerador extends sigesop
{
	public function __construct( $usuario, $clave ) {
		parent::sigesop( $usuario, $clave );
	}

    public function __destruct() {
        parent::__destruct();
    }

	function solicitudAjax( $accion, $post, $get ) {
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
                echo json_encode('Funcion no registrada en la clase sistemasGenerador');
                break;                    
		}
	}

    function nuevoSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'id_sistema_aero', 'nombre_sistema_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data['id_sistema_aero']['valor'];
        $nombre_sistema_aero = $data['nombre_sistema_aero']['valor'];

        $sql = 
            "INSERT INTO sistema_aero(id_sistema_aero, nombre_sistema_aero) ".
            "VALUES('$id_sistema_aero', '$nombre_sistema_aero')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nuevo sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_sistema_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function actualizarSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'id_sistema_aero', 'nombre_sistema_aero', 'id_sistema_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data['id_sistema_aero']['valor'];
        $nombre_sistema_aero = $data['nombre_sistema_aero']['valor'];
        $id_sistema_aero_update = $data['id_sistema_aero_update']['valor']; 

        $sql = 
            "UPDATE sistema_aero ".
            "SET id_sistema_aero = '$id_sistema_aero', ".
            "nombre_sistema_aero='$nombre_sistema_aero' ".
            "WHERE id_sistema_aero='$id_sistema_aero_update'";  

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_sistema_aero, 'msj' => $query );
            return $rsp;
        }     
    }

    function obtenerSistemas() {
        $sql = "SELECT id_sistema_aero, nombre_sistema_aero FROM sistema_aero";
        $query = $this->array_query( $sql );
        return $query;  
    }

    function eliminarSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'id_sistema_aero' ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data[ 'id_sistema_aero' ];

        $sql = 
            "DELETE FROM sistema_aero WHERE id_sistema_aero = '$id_sistema_aero'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_sistema_aero, 'msj' => $query );
            return $rsp;
        }      
    }
}