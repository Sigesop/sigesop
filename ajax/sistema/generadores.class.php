<?php
include 'sigesop.class.php';

class generadores extends sigesop
{
    private $estadoLicencia = array('C.A.', 'FALLA', 'MTTO', 'F.A.');

    public function __construct( $usuario, $clave )
    {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct()
    {
        parent::__destruct();
    }  

	function solicitudAjax( $accion, $post, $get )
	{
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

    // ---------- nuevoGenerador ------------------------------------------------------------------------------------------------

    private $datosNuevoGenerador = array(
        'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero'
    );

    function nuevoGenerador( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoGenerador );

        if ( $flag === 'OK' )
        {
            $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
            $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
            $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ][ 'valor' ];
            // $estado_licencia = $data[ 'estado_licencia' ][ 'valor' ];

            // $sql = "insert into aeros(numero_unidad, numero_aero, capacidad_efectiva_aero, estado_licencia) values('$numero_unidad', '$numero_aero', $capacidad_efectiva_aero, '$estado_licencia')";
            $sql = "insert into aeros(numero_unidad, numero_aero, capacidad_efectiva_aero) values('$numero_unidad', '$numero_aero', $capacidad_efectiva_aero)";
            $insertaGenerador = $this->insert_query( $sql );
            if ( $insertaGenerador === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else
            {
                $this->conexion->rollback();
                return $insertaGenerador.'. Error al ingresar generador al sistema';
            } 
        } 
        else return 'NA';
    }

    // --------------------------------------------------------------------------------------------------------------------------

    function obtenerGeneradores( $get )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

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

    function obtenerGeneradoresPorUnidad( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL"; 

        $unidad = $data['unidad'];
        $sql = "SELECT * FROM aeros WHERE numero_unidad = ".$unidad;
        $query = $this->array_query( $sql );
        return $query;
    }

    function eliminarGenerador( $data )
    {
        $numero_aero = $data['numero_aero'];

        if ( !empty( $numero_aero ) )
        {
            $sql = "DELETE FROM aeros WHERE numero_aero = '$numero_aero'";
            $query = $this->insert_query( $sql );
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al Eliminar Aerogenerador";
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarGenerador -------------------------------------------------------------------------------------------

    private $datosActualizarGenerador = array(
        'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero', 'numero_aero_update'
    );

    function actualizarGenerador( $data )
    {
        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarGenerador );
        if ( $flag )
        {
            $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
            $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
            $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ] [ 'valor' ];
            $numeroAero_update = $data[ 'numero_aero_update' ] [ 'valor' ];
            
            $sql = "update aeros set numero_unidad = $numero_unidad, numero_aero = '$numero_aero', capacidad_efectiva_aero = $capacidad_efectiva_aero where numero_aero = '$numeroAero_update'";

            $query = $this->insert_query( $sql );
            if ($query === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $query.'. Error al actualizar generador';
            }
        } 
        else return 'NA';
    }
}