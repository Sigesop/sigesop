<?php
include 'sigesop.class.php';

class equiposGenerador extends sigesop 
{
    public function __construct( $usuario, $clave )
    {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct()
    {
        parent::__destruct();
    }

	public  function solicitudAjax( $accion, $post, $get )
	{
		switch ($accion)
		{
            case 'actualizarEquipoGenerador':
                $actualizarEquipoGenerador = $this->actualizarEquipoGenerador( $post );
                echo json_encode($actualizarEquipoGenerador);
                break;  

            case 'eliminarEquipoGenerador':
                $eliminarEquipoGenerador = $this->eliminarEquipoGenerador( $get );
                echo json_encode($eliminarEquipoGenerador);
              break;

	        case 'nuevoEquipoGenerador':
	            $nuevoEquipoGenerador = $this->nuevoEquipoGenerador( $post );
	            echo json_encode($nuevoEquipoGenerador);
	            break;

	        case 'obtenerEquipoGenerador':
	            $obtenerEquipoGenerador = $this->obtenerEquipoGenerador();
	            echo json_encode($obtenerEquipoGenerador);
	            break;

            case 'obtenerEquipoGeneradorPorSistema':
                $query = $this->obtenerEquipoGeneradorPorSistema( $get );
                echo json_encode($query);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase equiposGenerador');
                break;                     
        }		
	}

    // ---------- nuevoEquipoGenerador -----------------------------------------------------------------------------------

    private $datosNuevoEquipo = array( 'idEquipo', 'nombreEquipo', 'idSistema' );

    public function nuevoEquipoGenerador( $data )
    {
        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoEquipo );
        if( $flag === 'OK' )
        {
            $idEquipo = $data['idEquipo']['valor'];
            $nombreEquipo = $data['nombreEquipo']['valor'];
            $idSistema = $data['idSistema']['valor'];

            $sql = "insert into equipo_aero(id_equipo_aero, nombre_equipo_aero, id_sistema_aero) values('$idEquipo', '$nombreEquipo', '$idSistema')";               
            $nuevoSistema = $this->insert_query( $sql );
            if($nuevoSistema === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $nuevoSistema.'. Error al insertar equipo.';
            }
        } 
        else return 'NA';
    }

    // --------------------------------------------------------------------------------------------------------------------

    public function obtenerEquipoGenerador()
    {
        $conexion = $this->conexion;

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

    public function obtenerEquipoGeneradorPorSistema( $data ) 
    {
        $idSistema = $data['valor'];
        if ( !empty($idSistema) ) 
        {
            $sql = "select * from equipo_aero where id_sistema_aero = '$idSistema'";
            $obtenerEquipoGenerador = $this->array_query( $sql );
            return $obtenerEquipoGenerador;
        } 
        else return null;
    }

    public function eliminarEquipoGenerador( $data )
    {
        $id_equipo = $data['id_equipo_aero'];      
        if ( !empty( $id_equipo ) )
        {
            $sql = "DELETE FROM equipo_aero WHERE id_equipo_aero = '$id_equipo'";
            $query = $this->insert_query( $sql );
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al eliminar Equipo";
            }
        } 
        else return 'NA';
    }

    // ---------- actualizarEquipoGenerador -----------------------------------------------------------------------------------

    private $datosActualizarEquipo = array( 'idEquipo_update', 'idEquipo', 'idSistema', 'nombreEquipo' );

    public function actualizarEquipoGenerador( $data )
    {
        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarEquipo );
        if ( $flag === 'OK' )
        {
            $idEquipo_update = $data['idEquipo_update']['valor'];
            $idEquipo = $data['idEquipo']['valor'];
            $Sistema = $data['idSistema']['valor'];
            $NombreEquipo = $data['nombreEquipo']['valor'];

            $sql = "UPDATE equipo_aero SET id_equipo_aero = '$idEquipo', nombre_equipo_aero='$NombreEquipo', id_sistema_aero='$Sistema' where id_equipo_aero='$idEquipo_update'";
            $query = $this->insert_query( $sql );
            if ($query === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al Actualizar Equipo";
            }
        } 
        else return 'NA'; 
    }
}