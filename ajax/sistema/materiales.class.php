<?php
include 'sigesop.class.php';

class materiales extends sigesop {
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }  

	public function solicitudAjax( $accion, $post, $get ) {
        switch ( $accion ) {
            case 'actualizar_materiales':
                $query = $this->actualizar_materiales( $post );
                echo json_encode($query);
                break;

            case 'agregar_material_orden_trabajo':
                $query = $this->agregar_material_orden_trabajo( $post );
                echo json_encode($query);
                break;

            case 'eliminar_material':
                $query = $this->eliminar_material( $get );
                echo json_encode($query);
                break;

            case 'eliminar_orden_trabajo_material':
                $query = $this->eliminar_orden_trabajo_material( $get );
                echo json_encode($query);
                break;

            case 'nuevoMaterial':
                $query = $this->nuevoMaterial( $post );
                echo json_encode($query);
                break;

            case 'obtener_materiales':
                $query = $this->obtener_materiales();
                echo json_encode($query);
                break; 

            case 'obtener_materiales_orden_trabajo':
                  $query = $this->obtener_materiales_orden_trabajo( $get );
                  echo json_encode( $query );
                  break; 

            case 'obtener_tipo_materiales':
                  $query = $this->obtener_tipo_materiales();
                  echo json_encode( $query );
                  break; 

            default:
                echo json_encode('Funcion no registrada en la clase generadores');
                break;                  
        }		
	}

    private $tipo_materiales = array( 'REFACCION', 'EQUIPO', 'MATERIAL' );

    public function nuevoMaterial ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'codigo_material', 'descripcion_material', 'tipo_material'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $codigo_material = $post[ 'codigo_material' ][ 'valor' ];
        $descripcion_material = $post[ 'descripcion_material' ][ 'valor' ];
        $tipo_material = $post[ 'tipo_material' ][ 'valor' ];

        $sql =
        "INSERT INTO materiales (codigo_material, descripcion_material, tipo_material) ".
        "VALUES ($codigo_material, '$descripcion_material', '$tipo_material')";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Material creado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $descripcion_material, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al crear nuevo material' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $descripcion_material, 'key' => 'descripcion_material', 'msj' => $query );
            return $rsp;
        }
    }

    public function agregar_material_orden_trabajo ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'id_orden_trabajo', 'codigo_material', 'cantidad'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $ai = 
        "SELECT id_orden_trabajo_material ".
        "FROM orden_trabajo_material ".
        "ORDER BY id_orden_trabajo_material ASC";
        $id_orden_trabajo_material = $this->autoincrement( $ai, 'id_orden_trabajo_material' );
        
        $id_orden_trabajo = $post[ 'id_orden_trabajo' ][ 'valor' ];
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $id_orden_trabajo );        
        
        $codigo_material = $post[ 'codigo_material' ][ 'valor' ];
        $cantidad = $post[ 'cantidad' ][ 'valor' ];

        $sql =
        "INSERT INTO orden_trabajo_material(id_orden_trabajo_material, id_orden_trabajo, codigo_material, cantidad) ".
        "VALUES ($id_orden_trabajo_material, $id_orden_trabajo, $codigo_material, $cantidad)";

        // return $sql;

        $query = $this->insert_query( $sql );

        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Material agregado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $codigo_material, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al agregar material.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $codigo_material, 'key' => 'codigo_material', 'msj' => $query );
            return $rsp;
        }
    }

    public function actualizar_materiales ( $post ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $post, array(
                'codigo_material', 'descripcion_material', 
                'tipo_material', 'codigo_material_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $codigo_material_update = $post[ 'codigo_material_update' ][ 'valor' ];
        $codigo_material = $post[ 'codigo_material' ][ 'valor' ];
        $descripcion_material = $post[ 'descripcion_material' ][ 'valor' ];
        $tipo_material = $post[ 'tipo_material' ][ 'valor' ];

        $sql =
        "UPDATE materiales ".
        "SET codigo_material = $codigo_material, ".
        "descripcion_material = '$descripcion_material', ".
        "tipo_material = '$tipo_material' ".
        "WHERE codigo_material = $codigo_material_update";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Material actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $descripcion_material, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar material' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $descripcion_material, 'key' => 'descripcion_material', 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_material ( $get ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'codigo_material'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $codigo_material = $get[ 'codigo_material' ];
        $sql =
        "DELETE FROM materiales WHERE codigo_material = $codigo_material";

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Material eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $codigo_material, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar material' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $codigo_material, 'key' => 'codigo_material', 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_orden_trabajo_material ( $get ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'id_orden_trabajo_material'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_orden_trabajo_material = $get[ 'id_orden_trabajo_material' ];

        $sql =
        "DELETE FROM orden_trabajo_material ".
        "WHERE id_orden_trabajo_material = $id_orden_trabajo_material";

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Material eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $codigo_material, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar material' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $codigo_material, 'key' => 'codigo_material', 'msj' => $query );
            return $rsp;
        }
    }

    public function obtener_materiales () {
        $sql = 
        "SELECT codigo_material, descripcion_material, tipo_material ".
        "FROM materiales";
        return $this->array_query( $sql );
    }

    public function obtener_materiales_orden_trabajo ( $get ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $get, array(
                'id_orden_trabajo'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_orden_trabajo = $get[ 'id_orden_trabajo' ];

        $sql =
        "SELECT t_otm.id_orden_trabajo_material, t_otm.id_orden_trabajo, ".
        "t_otm.codigo_material, t_otm.cantidad, ".
        "t_mat.descripcion_material, t_mat.tipo_material ".
        "FROM orden_trabajo_material t_otm INNER JOIN materiales t_mat ".
        "ON t_otm.codigo_material = t_mat.codigo_material ".
        "WHERE t_otm.id_orden_trabajo = $id_orden_trabajo";

        // return $sql;

        return $this->array_query( $sql );
    }

    public function obtener_tipo_materiales () {
        return $this->tipo_materiales;
    }
}