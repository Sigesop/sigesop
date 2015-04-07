<?php
include 'sigesop.class.php';

class sistemasGenerador extends sigesop
{
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

    // ---------- nuevoSistema ------------------------------------------------------------------------------------------

    private $datosNuevoSistema = array( 'idSistema', 'nombreSistema' );

    function nuevoSistema( $data )
    {       
        $flag = $this->verificaDatosNulos( $data, $this->datosNuevoSistema );    

        if( $flag === 'OK' )
        {
            $idSistemaAero = $data['idSistema']['valor'];
            $nombreSistemaAero = $data['nombreSistema']['valor'];

            $sql = "insert into sistema_aero(id_sistema_aero, nombre_sistema_aero) values('$idSistemaAero', '$nombreSistemaAero')";
            $query = $this->insert_query( $sql );
            if($query === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $query.'. Error al crear nuevo sistema';
            }
        } 
        else return 'NA';
    }

    // ------------------------------------------------------------------------------------------------------------------

    function obtenerSistemas()
    {
        $sql = "SELECT * FROM sistema_aero";
        $query = $this->array_query( $sql );
        return $query;  
    }

    function eliminarSistema( $data )
    {
        $id_sistema_aero = $data['id_sistema_aero'];
        if ( !empty( $id_sistema_aero ) )
        {
            $sql = "DELETE FROM sistema_aero WHERE id_sistema_aero = '$id_sistema_aero'";
            $query = $this->insert_query( $sql );
            if( $query === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                return $query.". Error al Eliminar Sistema";
            }
        } else return 'NA';        
    }

    // ---------- actualizarSistema ------------------------------------------------------------------------------------------

    private $datosActualizarSistema = array( 'nombreSistema', 'idSistema', 'idSistemaUpdate' );

    function actualizarSistema( $data )
    {
        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarSistema );       
        if ( $flag === 'OK' )
        {
            $nombreSistema = $data['nombreSistema']['valor'];
            $idSistema = $data['idSistema']['valor'];
            $idSistema_update = $data['idSistemaUpdate']['valor']; 

            $sql = "UPDATE sistema_aero SET id_sistema_aero = '$idSistema', nombre_sistema_aero='$nombreSistema' where id_sistema_aero='$idSistema_update'";            
            $query = $this->insert_query( $sql );
            if ($query === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $query.'. Error al actualizar sistema';
            }
        } 
        else return 'NA';        
    }    

    // -----------------------------------------------------------------------------------------------------------------------
}