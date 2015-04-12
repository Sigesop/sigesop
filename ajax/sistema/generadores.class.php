<?php
include 'sigesop.class.php';

class generadores extends sigesop
{
    private $estadoLicencia = array('C.A.', 'FALLA', 'MTTO', 'F.A.');

    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }  

	function solicitudAjax( $accion, $post, $get ) {
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
                echo json_encode('Funcion no registrada en la clase generadores');
                break;                  
        }		
	}

    function obtenerEstadoLicencia() { return $this->estadoLicencia; } 

    function obtenerGeneradores( $get ) {
        $numero_unidad = $get[ 'numero_unidad' ];
        $numero_aero = $get[ 'numero_aero' ];

        $option = $get[ 'option' ];

        if ( !empty( $numero_unidad ) ) $opt = 'numero_unidad';
        else if ( !empty( $numero_aero ) ) $opt = 'numero_aero';
        else $opt = null;

        switch ( $opt ) 
        {
            case 'numero_unidad':
                switch ( $option ) {
                    case 'libro_relatorio':
                        // $sql =  "select * from aeros where numero_unidad = '$numero_unidad' and ".
                        //         "numero_aero not in( select numero_aero from libro_relatorio )";
                        $sql =  "select * from aeros where numero_unidad = '$numero_unidad' and ".
                                "numero_aero not in( select numero_aero from libro_relatorio where estado_evento = TRUE )";
                        break;
                    
                    default:
                        $sql = "select * from aeros where numero_unidad = '$numero_unidad'";
                        break;
                }
                // if ( !empty( $libro_relatorio ) )
                //     $sql =  "select * from aeros where numero_unidad = '$numero_unidad' and ".
                //             "numero_aero not in( select numero_aero from libro_relatorio )";
                // else $sql = "select * from aeros where numero_unidad = '$numero_unidad'";
                break;

            case 'numero_aero':
                $sql = "select * from aeros where numero_aero = '$numero_aero'";
                break;
            
            default:
                $sql = "select * from aeros";
                break;
        }

        
        $query = $this->array_query( $sql );
        return $query;
    }

    function obtenerGeneradoresPorUnidad( $data ) {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $unidad = $data['unidad'];
        $sql = "SELECT * FROM aeros WHERE numero_unidad = ".$unidad;
        $query = $this->array_query( $sql );
        return $query;
    }

    function nuevoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
        $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ][ 'valor' ];
        
        $sql = 
            "INSERT INTO aeros(numero_unidad, numero_aero, capacidad_efectiva_aero) ".
            "VALUES('$numero_unidad', '$numero_aero', $capacidad_efectiva_aero)";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nueva Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function actualizarGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'numero_unidad', 'numero_aero', 
                'capacidad_efectiva_aero', 'numero_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
        $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ] [ 'valor' ];
        $numero_aero_update = $data[ 'numero_aero_update' ] [ 'valor' ];
        
        $sql = 
            "UPDATE aeros ".
            "SET numero_unidad = $numero_unidad, ".
            "numero_aero = '$numero_aero', ".
            "capacidad_efectiva_aero = $capacidad_efectiva_aero ".
            "WHERE numero_aero = '$numero_aero_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function eliminarGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'numero_aero' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_aero = $data['numero_aero'];

        $sql = "DELETE FROM aeros WHERE numero_aero = '$numero_aero'";
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }
}