<?php
include 'sigesop.class.php';

class equiposGenerador extends sigesop 
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }

	public  function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion ) {
            case 'actualizarEquipoGenerador':
                $query = $this->actualizarEquipoGenerador( $post );
                echo json_encode( $query );
                break;  

            case 'eliminarEquipoGenerador':
                $query = $this->eliminarEquipoGenerador( $get );
                echo json_encode( $query );
              break;

	        case 'nuevoEquipoGenerador':
	            $query = $this->nuevoEquipoGenerador( $post );
	            echo json_encode( $query );
	            break;

	        case 'obtenerEquipoGenerador':
	            $query = $this->obtenerEquipoGenerador();
	            echo json_encode( $query );
	            break;

            case 'obtenerEquipoGeneradorPorSistema':
                $query = $this->obtenerEquipoGeneradorPorSistema( $get );
                echo json_encode( $query );
                break;

            default:
                echo json_encode('Funcion no registrada en la clase equiposGenerador');
                break;                     
        }		
	}

    public function nuevoEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'nombre_equipo_aero', 'id_equipo_aero', 'id_sistema_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $nombre_equipo_aero = $data[ 'nombre_equipo_aero' ][ 'valor' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ][ 'valor' ];
        $id_sistema_aero = $data[ 'id_sistema_aero' ][ 'valor' ];

        $sql = 
            "INSERT INTO equipo_aero ".
            "(id_equipo_aero, nombre_equipo_aero, id_sistema_aero) ".
            "VALUES('$id_equipo_aero', '$nombre_equipo_aero', '$id_sistema_aero')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo ingresado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nuevo equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_equipo_aero, 'msj' => $query );
            return $rsp;
        }
    }    

    public function obtenerEquipoGenerador() {
        $sql = "SELECT * FROM equipo_aero";
        $mtz = $this->array_query( $sql );
        $arr = array(); // matriz de retorno

        // ---------- buscar nombre del sistema, correspondiente en el equipo

        foreach ( $mtz as $equipo )
        {
            $id_sistema_aero = $equipo[ 'id_sistema_aero' ];
            $sql = "select nombre_sistema_aero from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->array_query( $sql, 'nombre_sistema_aero', null );

            $equipo[ 'nombre_sistema_aero' ] = $query[0];
            $arr [] = $equipo;
        }

        return $arr;
    }

    public function obtenerEquipoGeneradorPorSistema( $data )  {
        $idSistema = $data['valor'];
        if ( !empty($idSistema) ) 
        {
            $sql = "select * from equipo_aero where id_sistema_aero = '$idSistema'";
            $obtenerEquipoGenerador = $this->array_query( $sql );
            return $obtenerEquipoGenerador;
        } 
        else return null;
    }

    public function eliminarEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'id_equipo_aero' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_equipo_aero = $data[ 'id_equipo_aero' ];

        $sql = "DELETE FROM equipo_aero WHERE id_equipo_aero = '$id_equipo_aero'";
        
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo eliminado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al aliminar equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_equipo_aero, 'msj' => $query );
            return $rsp;
        }
    }    

    public function actualizarEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'nombre_equipo_aero', 'id_equipo_aero', 'id_sistema_aero',
                'id_equipo_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $nombre_equipo_aero = $data[ 'nombre_equipo_aero' ][ 'valor' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ][ 'valor' ];
        $id_equipo_aero_update = $data[ 'id_equipo_aero_update' ][ 'valor' ];
        $id_sistema_aero = $data[ 'id_sistema_aero' ][ 'valor' ];

        $sql = 
            "UPDATE equipo_aero ".
            "SET id_equipo_aero = '$id_equipo_aero', ".
            "nombre_equipo_aero='$nombre_equipo_aero', ".
            "id_sistema_aero='$id_sistema_aero' ".
            "WHERE id_equipo_aero='$id_equipo_aero_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo actualizado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_equipo_aero, 'msj' => $query );
            return $rsp;
        }
    }
}