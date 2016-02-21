<?php
include 'sigesop.class.php';

class listaVerificacion extends sigesop
{
    public function __construct( $usuario, $clave )
    {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }

    function solicitudAjax( $accion, $post, $get ) {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ( $accion ) {
            case 'tipo_mantto_num_actividades':
                $query = $this->tipo_mantto_num_actividades();
                break;

            case 'actividades_into_equipo':
                $query = $this->actividades_into_equipo( $get );
                break;

            case 'actividades_into_lista':
                $query = $this->actividades_into_lista( $get );
                break;

            case 'actualizar_actividad_verificar':
                $query = $this->actualizar_actividad_verificar( $post );
                break;

            case 'actualizar_lista_verificacion':
                $query = $this->actualizar_lista_verificacion( $post );
                break;

            case 'actualizar_parametro_actividad':
                $query = $this->actualizar_parametro_actividad( $post );
                break;

            case 'actualizarTipoMantto':
                $query = $this->actualizarTipoMantto( $post );
                break;

            case 'actualizarUnidadMedida':
                $query = $this->actualizarUnidadMedida( $post );
                break;

            case 'agregar_actividad_lista_verificacion':
                $query = $this->agregar_actividad_lista_verificacion( $post );
                break;

            case 'eliminarTipoMantto':
                $query = $this->eliminarTipoMantto( $get );
                break;

            case 'eliminarUnidadMedida':
                $query = $this->eliminarUnidadMedida( $get );
                break;

            case 'eliminar_actividad':
                $query = $this->eliminar_actividad( $get );
                break;

            case 'eliminar_lista_verificacion':
                $query = $this->eliminar_lista_verificacion( $get );
                break;

            case 'equipo_into_systems_mantto':
                $query = $this->equipo_into_systems_mantto( $get );
                break;

            case 'nueva_lista_verificacion':
                $query = $this->nueva_lista_verificacion( $post );
                break;

            case 'nuevaUnidadMedida':
                $query = $this->nuevaUnidadMedida( $post );
                break;

            case 'nuevoTipoMantenimiento':
                $query = $this->nuevoTipoMantenimiento( $post );
                break;

            case 'num_actividades_into_lista':
                $query = $this->num_actividades_into_lista();
                break;

            case 'obtener_lista_verificacion':
                $query = $this->obtener_lista_verificacion();
                break;

            case 'obtenerTipoMantenimiento':
                $query = $this->obtenerTipoMantenimiento();
                break;

            case 'obtenerTipoParamentroAceptacion':
                $query = $this->obtenerTipoParamentroAceptacion();
                break;

            case 'obtenerUnidadMedida':
                $query = $this->obtenerUnidadMedida();
                break;

            case 'systems_into_mantto':
                $query = $this->systems_into_mantto( $get );
                break;

            case 'imprimirTipoMtto':
                $query = $this->imprimirTipoMtto( $get );
                echo json_encode( $query );
                break;

            case 'imprimirUM':
                $query = $this->imprimirUM( $get );
                echo json_encode( $query );
                break;

            case 'imprimirLV':
                $query = $this->imprimirLV( $get );
                echo json_encode( $query );
                break;

            default:
                $query = array(
                    'status'  => array( 'transaccion' => 'ERROR', 'msj' => 'Funcion no registrada en la clase listaVerificacion' ),
                    'eventos' => array()
                );
                break;
        }

        echo json_encode( $query );
    }

    # Unidad de medida ------------------------------

    public function obtenerUnidadMedida() {
        $sql = "SELECT * FROM catalogo_unidad_medida";
        $query = $this->array_query( $sql );
        return $query;
    }

    public function nuevaUnidadMedida( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'unidad_medida', 'descripcion_unidad_medida'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $unidad_medida = $data['unidad_medida']['valor'];
        $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

        $sql =
            "INSERT INTO catalogo_unidad_medida ".
            "VALUES('$unidad_medida','$descripcion_unidad_medida')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida ingresada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nueva unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    public function actualizarUnidadMedida( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'unidad_medida', 'descripcion_unidad_medida',
                'unidad_medida_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $unidad_medida = $data['unidad_medida']['valor'];
        $unidad_medida_update = $data['unidad_medida_update']['valor'];
        $descripcion_unidad_medida = $data['descripcion_unidad_medida']['valor'];

        # verificamos que no sea un elemente de solo lectura
        if ( in_array( $unidad_medida, $this->solo_lectura ) ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Operación Imposible, elemento de solo lectura." );
            return $rsp;
        }

        $sql =
            "UPDATE catalogo_unidad_medida ".
            "SET unidad_medida = '$unidad_medida', ".
            "descripcion_unidad_medida = '$descripcion_unidad_medida' ".
            "WHERE unidad_medida = '$unidad_medida_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida actualizada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminarUnidadMedida ( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array( 'unidad_medida' ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $unidad_medida = $data[ 'unidad_medida' ];

        # verificamos que no sea un elemente de solo lectura
        if ( in_array( $unidad_medida, $this->solo_lectura ) ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Operación Imposible, elemento de solo lectura." );
            return $rsp;
        }

        $sql =
            "DELETE FROM catalogo_unidad_medida ".
            "WHERE unidad_medida = '$unidad_medida'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Unidad de medida eliminada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $unidad_medida, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar unidad de medida' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $unidad_medida, 'msj' => $query );
            return $rsp;
        }
    }

    # Tipo de mantenimiento -------------------------

    public function nuevoTipoMantenimiento( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'numero_frecuencia', 'tipo_frecuencia',
                'id_mantenimiento', 'nombre_mantenimiento'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_frecuencia = $data['numero_frecuencia']['valor'];
        $tipo_frecuencia = $data['tipo_frecuencia']['valor'];
        $id_mantenimiento = $data['id_mantenimiento']['valor'];
        $nombre_mantenimiento = $data['nombre_mantenimiento']['valor'];

        $sql =
            "INSERT INTO tipo_mantenimiento ".
            "VALUES ('$id_mantenimiento', '$nombre_mantenimiento', ".
            "$numero_frecuencia, '$tipo_frecuencia')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Tipo de mantenimiento ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_mantenimiento, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar tipo de mantenimiento' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_mantenimiento, 'msj' => $query );
            return $rsp;
        }
    }

    function actualizarTipoMantto( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'nombre_mantenimiento', 'id_mantenimiento', 'tipo_frecuencia',
                'id_mantenimiento_update', 'numero_frecuencia'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $nombre_mantenimiento = $data[ 'nombre_mantenimiento' ][ 'valor' ];
        $id_mantenimiento = $data[ 'id_mantenimiento' ] [ 'valor' ];
        $id_mantenimiento_update = $data[ 'id_mantenimiento_update' ] [ 'valor' ];
        $numero_frecuencia = $data[ 'numero_frecuencia' ] [ 'valor' ];
        $tipo_frecuencia = $data[ 'tipo_frecuencia' ] [ 'valor' ];

        $sql =
            "UPDATE tipo_mantenimiento ".
            "SET nombre_mantenimiento = '$nombre_mantenimiento', ".
            "id_mantenimiento = '$id_mantenimiento', ".
            "numero_frecuencia = $numero_frecuencia, ".
            "tipo_frecuencia = '$tipo_frecuencia' ".
            "WHERE id_mantenimiento = '$id_mantenimiento_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Tipo de mantenimiento actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_mantenimiento, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar tipo de mantenimiento' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_mantenimiento, 'msj' => $query );
            return $rsp;
        }
    }

    public function obtenerTipoMantenimiento() {
        $sql = "select * from tipo_mantenimiento";
        $obtenerTipoMantenimiento = $this->array_query( $sql );
        return $obtenerTipoMantenimiento;
    }

    public function eliminarTipoMantto ( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array( 'id_mantenimiento' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_mantenimiento = $data['id_mantenimiento'];

        $sql =
            "DELETE FROM tipo_mantenimiento ".
            "WHERE id_mantenimiento = '$id_mantenimiento'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Tipo de mantenimiento eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_mantenimiento, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar tipo de mantenimiento' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_mantenimiento, 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_lista_verificacion ( $get ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $get, array( 'id_lista_verificacion' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_lista_verificacion = $get[ 'id_lista_verificacion' ];

        $sql =
        "DELETE FROM lista_verificacion ".
        "WHERE id_lista_verificacion = '$id_lista_verificacion'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Lista de verificación eliminada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Eliminado' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar lista de verificación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_actividad ( $get ) {
        $rsp = array();

        $validar = $this->verificaDatosNulos( $get, array(
                    'id_actividad_verificar'
                ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ]  = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_actividad_verificar = $get[ 'id_actividad_verificar' ];

        $sql = "DELETE FROM actividad_verificar ".
        "WHERE id_actividad_verificar = '$id_actividad_verificar'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ]    = array( 'transaccion' => 'OK', 'msj' => 'Actividad eliminada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Eliminado' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ]     = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar actividad' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }
    }

    # Lista de verificacion --------------------------

    public function nueva_lista_verificacion ( $post ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $post, array(
                'id_mantenimiento',
                'lista_verificacion',
                'actividad_verificar'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ]  = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_lista_verificacion = $this->auto_increment( 'lista_verificacion', 'id_lista_verificacion' );
        $id_mantenimiento      = $post[ 'id_mantenimiento' ][ 'valor' ];
        $lista_verificacion    = $post[ 'lista_verificacion' ][ 'valor' ];
        $actividad_verificar   = $post[ 'actividad_verificar' ];

        $sql = "INSERT INTO lista_verificacion ( ".
            "id_lista_verificacion, ".
            "id_mantenimiento, ".
            "lista_verificacion ".
        ") VALUES ( ".
            "$id_lista_verificacion, ".
            "'$id_mantenimiento', ".
            "'$lista_verificacion' ".
        ")";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ]     = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar lista de verificación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'lista_verificacion', 'msj' => $query );
            return $rsp;
        }

        $query = $this->__insertarActividad( $actividad_verificar, $id_lista_verificacion );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ]    = array( 'transaccion' => 'OK', 'msj' => 'Lista de verificación ingresada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $lista_verificacion, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ]   = array( 'transaccion' => 'ERROR', 'msj' => $query[ 'msj' ] );
            $rsp [ 'eventos' ] = $query[ 'eventos' ];
            return $rsp;
        }
    }

    private function __insertarActividad ( $data, $id_lista_verificacion ) {
        $noAct = 1;
        foreach ( $data as $row ) {
            $validar =
                $this->verificaDatosNulos( $row, array(
                    'id_sistema_aero',
                    'id_equipo_aero',
                    'actividad_verificar',
                    'tipo_actividad',
                    'parametro_actividad',
                    'lectura_actual',
                    'lectura_posterior'
                ));

            if( $validar !== 'OK' ) return $validar;

            $id_actividad_verificar = $this->auto_increment( 'actividad_verificar', 'id_actividad_verificar' );
            $id_sistema_aero        = $row[ 'id_sistema_aero' ][ 'valor' ];
            $id_equipo_aero         = $row[ 'id_equipo_aero' ][ 'valor' ];
            $actividad_verificar    = $row[ 'actividad_verificar' ][ 'valor' ];
            $tipo_actividad         = $row[ 'tipo_actividad' ][ 'valor' ];

            $parametro_actividad    = $row[ 'parametro_actividad' ];
            $lectura_actual         = $row[ 'lectura_actual' ];
            $lectura_posterior      = $row[ 'lectura_posterior' ];

            $sql = "INSERT INTO actividad_verificar( ".
                "id_actividad_verificar, ".
                "id_lista_verificacion, ".
                "id_sistema_aero, ".
                "id_equipo_aero, ".
                "actividad_verificar, ".
                "tipo_actividad ".
            ") VALUES ( ".
                "$id_actividad_verificar, ".
                "$id_lista_verificacion, ".
                "'$id_sistema_aero', ".
                "'$id_equipo_aero', ".
                "'$actividad_verificar', ".
                "'$tipo_actividad' ".
            ")";

            // if( $noAct == 2 ) return array( 'msj' => $sql );

            $query = $this->insert_query( $sql );
            if ( $query !== 'OK') return array( 'msj' => $query.". Error al insertar actividad No. ".$noAct );

            $query = $this->__insertarParametro( $parametro_actividad, $id_actividad_verificar );
            if ( $query !== 'OK' ) return array( 'msj' => $query );

            $query = $this->__insertarLecturas( $lectura_actual, $lectura_posterior, $id_actividad_verificar );
            if ( $query !== 'OK' ) return array( 'msj' => $query );

            $noAct++;
        }

        return 'OK';
    }

    private function __insertarParametro ( $data, $id_actividad ) {
        $secuencia_datos = 1;
        foreach ( $data as $row ) {
            $id            = $this->auto_increment( 'parametro_actividad', 'id' );
            $tipo_dato     = $row[ 'tipo_dato' ];
            $dato          = $row[ 'dato' ][ 'valor' ];
            $parametro     = $row[ 'parametro' ][ 'valor' ];
            $unidad_medida = $row[ 'unidad_medida' ][ 'valor' ];

            $sql =
            "INSERT INTO parametro_actividad ".
                "(id_actividad, ".
                "id, ".
                "tipo_dato, ".
                "dato, ".
                "parametro, ".
                "secuencia_datos, ".
                "unidad_medida) ".
            "VALUES( $id_actividad, ".
                "$id, ".
                "'$tipo_dato', ".
                "'$dato', ".
                "'$parametro', ".
                "$secuencia_datos, ".
                "'$unidad_medida') ";

            // return $sql;

            $parametro = $this->insert_query( $sql );
            if ( $parametro !== 'OK' ) return $parametro." Error al insertar paramentro No. ".$secuencia_datos;

            $secuencia_datos++;
        }

        return 'OK';
    }

    private function __insertarLecturas ( $data_actual, $data_post, $id_actividad ) {
        $secuencia_datos = 1;
        foreach ( $data_actual as $actual ) {
            $tipo_dato     = $actual[ 'tipo_dato' ];
            $parametro     = $actual[ 'parametro' ][ 'valor' ];
            $unidad_medida = $actual[ 'unidad_medida' ][ 'valor' ];
            $id            = $this->auto_increment( 'lectura_actual', 'id' );

            $sql = "INSERT INTO lectura_actual( ".
                "id_actividad, ".
                "tipo_dato, ".
                "parametro, ".
                "unidad_medida, ".
                "secuencia_datos, ".
                "id ".
            ") ".
            "VALUES( ".
                "$id_actividad, ".
                "'$tipo_dato', ".
                "'$parametro', ".
                "'$unidad_medida', ".
                "$secuencia_datos, ".
                "$id ".
            " )";

            // if ( $secuencia_datos == 1 ) return $sql;
            $lectura_actual = $this->insert_query( $sql );
            if ($lectura_actual != 'OK') {
                return  $lectura_actual
                        .". Error al insertar lectura actual No. "
                        .$secuencia_datos;
            };

            $secuencia_datos++;
        }

        $secuencia_datos = 1;
        foreach ( $data_post as $post ) {
            $tipo_dato     = $post['tipo_dato'];
            $parametro     = $post['parametro'][ 'valor' ];
            $unidad_medida = $post['unidad_medida'][ 'valor' ];
            $id            = $this->auto_increment( 'lectura_posterior', 'id' );

            $sql = "INSERT INTO lectura_posterior( ".
                "id_actividad, ".
                "tipo_dato, ".
                "parametro, ".
                "unidad_medida, ".
                "secuencia_datos, ".
                "id ".
            ") VALUES( ".
                "$id_actividad, ".
                "'$tipo_dato', ".
                "'$parametro', ".
                "'$unidad_medida', ".
                "$secuencia_datos, ".
                "$id ".
            ")";

            // return $sql;
            $lectura_posterior = $this->insert_query( $sql );
            if ( $lectura_posterior != 'OK' ) {
                return  $lectura_posterior
                        .". Error al insertar lectura posterior No. "
                        .$secuencia_datos;
            };

            $secuencia_datos++;
        }

        return 'OK';
    }

    # ---------------------------------

    public function agregar_actividad_lista_verificacion ( $post ) {
        $rsp     = array();
        $validar = $this->verificaDatosNulos( $post, array(
                'actividad_verificar',
                'id_lista_verificacion'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ]  = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_lista_verificacion = $post[ 'id_lista_verificacion' ];
        $actividad_verificar   = $post[ 'actividad_verificar' ];

        $query = $this->__insertarActividad( $actividad_verificar, $id_lista_verificacion );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ]    = array( 'transaccion' => 'OK', 'msj' => 'Lista de verificación ingresada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $lista_verificacion, 'msj' => 'Correcto' );
        }
        else {
            $this->conexion->rollback();
            $rsp [ 'status' ]  = array( 'transaccion' => 'ERROR', 'msj' => $query[ 'msj' ] );
            $rsp [ 'eventos' ] = $query[ 'eventos' ];
        }

        return $rsp;
    }

    # ---------------------------------

    public function obtener_lista_verificacion () {
        $sql = "SELECT ".
            "id_lista_verificacion, ".
            "id_mantenimiento, ".
            "lista_verificacion ".
        "FROM lista_verificacion";

        $query = $this->array_query( $sql );
        $arr = array();

        foreach ( $query as $lista ) {
            $id_mantenimiento = $lista[ 'id_mantenimiento' ];
            $sql = "SELECT ".
                "nombre_mantenimiento ".
            "FROM ".
                "tipo_mantenimiento ".
            "WHERE ".
                "id_mantenimiento = '$id_mantenimiento'";

            $nombre_mantenimiento  = $this->query( $sql, 'nombre_mantenimiento', null );
            $id_lista_verificacion = $lista[ 'id_lista_verificacion' ];

            $sql = "SELECT ".
                "COUNT(id_actividad_verificar) AS num_actividades ".
            "FROM actividad_verificar ".
            "WHERE id_lista_verificacion = $id_lista_verificacion";

            $num_actividades                 = $this->query( $sql, 'num_actividades', NULL );
            $lista[ 'nombre_mantenimiento' ] = $nombre_mantenimiento;
            $lista[ 'num_actividades' ]      = $num_actividades;
            $arr[]                           = $lista;
        }

        return $arr;
    }

    public function obtenerTipoParamentroAceptacion() {
        return $this->tipoParamentroAceptacion;
    }

    private $tipoParamentroAceptacion = array(
        // 'BINARIO',
        'TEXTO',
        'COMPARACION',
        'RANGO',
        'TOLERANCIA'
    );

    # ------------------------------------

    public function systems_into_mantto( $get ) {
        $validar =
            $this->verificaDatosNulos( $get, array(
                'id_lista_verificacion'
            ));

        // if ( $validar != 'OK' ) return null;

        $id_lista_verificacion = $get[ 'id_lista_verificacion' ];
        $sql =
        "SELECT DISTINCT id_sistema_aero ".
        "FROM actividad_verificar ".
        "WHERE id_lista_verificacion = '$id_lista_verificacion' ".
        "ORDER BY id_sistema_aero ASC";

        // return $sql;

        $query = $this->array_query( $sql, 'id_sistema_aero', null );
        if ( $query == null ) return null;

        $arr = array(); // matriz de retorno

        foreach ( $query as $id_sistema_aero ) {
            $sql =
            "SELECT id_sistema_aero, nombre_sistema_aero ".
            "FROM sistema_aero ".
            "WHERE id_sistema_aero = '$id_sistema_aero'";
            $query = $this->query( $sql );

            $sql =
            "SELECT count( id_actividad_verificar ) AS elementos ".
            "FROM actividad_verificar ".
            "WHERE id_sistema_aero = '$id_sistema_aero'";
            $elem = $this->query( $sql, 'elementos', null );

            $query[ 'elementos' ] = $elem;
            $arr[] = $query;
        }

        return $arr;
    }

    public function equipo_into_systems_mantto ( $get ) {
        $validar =
        $this->verificaDatosNulos( $get, array(
            'id_sistema_aero', 'id_lista_verificacion'
        ));

        // if ( $validar != 'OK' ) return NULL;

        $id_sistema_aero = $get[ 'id_sistema_aero' ];
        $id_lista_verificacion = $get[ 'id_lista_verificacion' ];
        // if ( empty( $id_sistema_aero ) ) return null;

        $sql =
        "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
        "WHERE id_sistema_aero = '$id_sistema_aero' ".
        "AND id_lista_verificacion = '$id_lista_verificacion'";

        $query = $this->array_query( $sql, 'id_equipo_aero', null );
        if ( $query == null ) return null;
        $arr = array();

        foreach ( $query as $id_equipo_aero ) {
            $sql =  "SELECT id_equipo_aero, nombre_equipo_aero, id_sistema_aero ".
                    "FROM  equipo_aero ".
                    "WHERE id_equipo_aero = '$id_equipo_aero'";
            $query = $this->query( $sql );

            $sql =  "SELECT count( id_actividad_verificar ) AS elementos ".
                    "FROM actividad_verificar ".
                    "WHERE id_equipo_aero = '$id_equipo_aero'";
            $elem = $this->query( $sql, 'elementos', null );

            $query[ 'elementos' ] = $elem;
            $arr[] = $query;
        }

        return $arr;
    }

    public function actividades_into_equipo ( $get ) {
        $validar =
            $this->verificaDatosNulos( $get, array(
                'id_equipo_aero', 'id_lista_verificacion'
            ));

        // if ( $validar === 'OK' ) return null;

        $id_lista_verificacion = $get[ 'id_lista_verificacion' ];
        $id_equipo_aero = $get[ 'id_equipo_aero' ];
        $sql =
            "SELECT id_actividad_verificar, ".
            "id_sistema_aero, ".
            "id_equipo_aero, ".
            "actividad_verificar ".
            "FROM actividad_verificar ".
            "WHERE id_equipo_aero = '$id_equipo_aero' ".
            "AND id_lista_verificacion = $id_lista_verificacion";

        // return $sql;

        $arr = $this->array_query( $sql );
        $i = 0;
        foreach ( $arr as $row ) {
            $id_actividad_verificar = $row[ 'id_actividad_verificar' ];

            $arr[ $i ][ 'parametro_aceptacion' ] = $this->parametro_aceptacion( $id_actividad_verificar );
            $arr[ $i ][ 'lectura_actual' ][ 'texto' ] = $this->lectura( $id_actividad_verificar, 'lectura_actual' );
            $arr[ $i ][ 'lectura_posterior' ][ 'texto' ] = $this->lectura( $id_actividad_verificar, 'lectura_posterior' );
            $i++;
        }

        return $arr;
    }

    /**
     * [tipo_mantto_num_actividades description]
     * @return [Array] retorna los tipos de mantenimientos
     * con el número de actividades existentes en él
     * campos retornados:
     *     [String] [id_mantenimiento]
     *     [String] [nombre_mantenimiento]
     *     [Int] [elementos]
     */
    public function tipo_mantto_num_actividades () {
        $sql =  "SELECT id_mantenimiento, nombre_mantenimiento ".
                "FROM tipo_mantenimiento";

        $query = $this->array_query( $sql );
        if ( $query == null ) return null;
        $arr = array();

        foreach ( $query as $elem ) {
            $id_mantenimiento = $elem[ 'id_mantenimiento' ];
            $sql =  "SELECT count( id_actividad_verificar ) AS elementos ".
                    "FROM actividad_verificar ".
                    "WHERE id_mantenimiento = '$id_mantenimiento'";
            $query = $this->query( $sql, 'elementos', null );

            $elem[ 'elementos' ] = $query;
            $arr[] = $elem;
        }

        return $arr;
    }

    # actividades_into_lista -----------------------

    public function actividades_into_lista( $get, $id_equipo_aero = NULL ) {
        $id_lista_verificacion = $get[ 'id_lista_verificacion' ];
        if( empty( $id_lista_verificacion ) ) return null;

        $sql = "SELECT ".
            "id_actividad_verificar, ".
            "id_sistema_aero, ".
            "id_equipo_aero, ".
            "actividad_verificar, ".
            "tipo_actividad ".
        "FROM actividad_verificar ".
        "WHERE id_lista_verificacion = $id_lista_verificacion";

        # añadir un filtrado por equipos, util para generar los
        # archivos PDF de las listas de verificacion
        if ( !empty( $id_equipo_aero ) )
            $sql .= " AND id_equipo_aero = '$id_equipo_aero'";

        // return $sql;

        $arr = $this->array_query( $sql );
        $i = 0;
        foreach ( $arr as $row ) {
            $id_actividad_verificar = $row[ 'id_actividad_verificar' ];

            $arr[ $i ][ 'parametro_aceptacion' ]         = $this->parametro_aceptacion( $id_actividad_verificar );
            $arr[ $i ][ 'lectura_actual' ][ 'texto' ]    = $this->lectura( $id_actividad_verificar, 'lectura_actual' );
            $arr[ $i ][ 'lectura_posterior' ][ 'texto' ] = $this->lectura( $id_actividad_verificar, 'lectura_posterior' );
            $i++;
        }

        return $arr;
    }

    public function parametro_aceptacion ( $id_actividad_verificar ) {
        $sql = "SELECT ".
            "tipo_dato, ".
            "dato, ".
            "parametro, ".
            "unidad_medida ".
        "FROM parametro_actividad ".
        "WHERE id_actividad = $id_actividad_verificar";

        // return $sql;
        $string = '';

        foreach ( $this->array_query( $sql ) as $row ) {
            $tipo_dato     = $row[ 'tipo_dato' ];
            $dato          = $row[ 'dato' ];
            $parametro     = $row[ 'parametro' ];
            $unidad_medida = $row[ 'unidad_medida' ];

            switch ( $tipo_dato ) {
                case 'BINARIO':
                    $string .= $parametro." ".$dato."<br><br>";
                    break;

                case 'TEXTO':
                    $string .= $parametro." ".$dato."<br><br>";
                    break;

                case 'COMPARACION':
                    $string .= $parametro." ".$dato." ".$unidad_medida."<br><br>";
                    break;

                case 'RANGO':
                    $arr_data = explode( ',', $dato );
                    $inf = $arr_data[0];
                    $sup = $arr_data[1];

                    $string .=
                        $parametro." ".$inf." A ".$sup." ".
                        $unidad_medida."<br><br>";
                    break;

                case 'TOLERANCIA':
                    $arr_data = explode( ',', $dato );
                    $inf = $arr_data[0];
                    $sup = $arr_data[1];

                    $string .=
                        $parametro." ".$inf." +- ".$sup." ".
                        $unidad_medida."<br><br>";
                    break;
            }
        }

        return array( 'texto' => $string );
    }

    public function lectura ( $id_actividad_verificar, $tipo_lectura ) {
        $sql =
            "SELECT tipo_dato, parametro, unidad_medida ".
            "FROM $tipo_lectura ".
            "WHERE id_actividad = $id_actividad_verificar";

        $query = $this->array_query( $sql );
        $string = '';

        foreach ( $query as $row ) {
            $parametro = $row[ 'parametro' ];
            $unidad_medida = $row[ 'unidad_medida' ];
            $tipo_dato = $row[ 'tipo_dato' ];

            switch ( $tipo_dato ) {
                case 'Binario':
                    $string .= $parametro."<br>  a) SI  b) NO <br><br>";
                    break;

                case 'Datos':
                    $string .= $parametro." ______ ".$unidad_medida."<br><br>";
                    break;
            }
        }

        return $string;
    }

    # --------------------------------------------

    public function actualizar_actividad_verificar ( $post ) {
        $rsp = array();
        $validar =
            $this->verificaDatosNulos( $post, array(
                'actividad_verificar',
                'id_actividad_verificar',
                'tipo_actividad'
            ));

        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_actividad_verificar = $post[ 'id_actividad_verificar' ][ 'valor' ];
        $actividad_verificar    = $post[ 'actividad_verificar' ][ 'valor' ];
        $tipo_actividad         = $post[ 'tipo_actividad' ][ 'valor' ];

        $sql = "UPDATE actividad_verificar ".
        "SET ".
            "actividad_verificar = '$actividad_verificar', ".
            "tipo_actividad      = '$tipo_actividad' ".
        "WHERE ".
            "id_actividad_verificar = $id_actividad_verificar";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento actualizado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$id_actividad_verificar, 'msj' => 'OK' );
            $this->conexion->commit();
        }
        else {
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_actividad_verificar, 'msj' => 'Error al actualizar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;
    }

    public function actualizar_parametro_actividad ( $post ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $post, array(
                'id_actividad_verificar_update', 'parametro_actividad',
                'lectura_posterior', 'lectura_actual'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_actividad_verificar_update = $post[ 'id_actividad_verificar_update' ];
        $parametro_actividad           = $post[ 'parametro_actividad' ];
        $lectura_actual                = $post[ 'lectura_actual' ];
        $lectura_posterior             = $post[ 'lectura_posterior' ];

        ##########################################################################
        # verificamos si la actividad no contiene datos previamente capturados
        # en caso que existan datos, no se permitirá actualizar la estructura ya
        # que dejaria datos corruptos e incongruentes
        ##########################################################################

        # buscamos todas las ordenes de trabajo [ACTIVOS, FINALIZADOS, REPROGRAMADOS]
        $sql = "SELECT ".
            "id_orden_trabajo ".
        "FROM programacion_mtto ".
        "WHERE estado_asignado IS NOT NULL";

        foreach ( $this->array_query( $sql, 'id_orden_trabajo' ) as $id_orden_trabajo ) {
            $check = $this->has_data_captured( $id_orden_trabajo, $id_actividad_verificar_update );
            if ( $check ) {
                $rsp[ 'status' ]     = array( 'transaccion' => 'ERROR', 'msj' => 'Imposible actualizar' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => 'La actividad contiene datos capturados' );
                return $rsp;
            }
        }

        ########################################################################
        # Iniciamos proceso de actualizacion del parametros y lecturas
        # de la actividad
        ########################################################################

        # Eliminamos todos los registros de [parametro_aceptacion]
        $sql = "DELETE FROM parametro_actividad WHERE id_actividad = $id_actividad_verificar_update";
        $query = $this->insert_query( $sql );

        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar parametro de actividad' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }

        # Eliminamos todos los registros de [lectura_actual]
        $sql =
        "DELETE FROM lectura_actual WHERE id_actividad = $id_actividad_verificar_update";
        $query = $this->insert_query( $sql );

        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar lectura actual' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }

        # Eliminamos todos los registros de [lectura_posterior]
        $sql =
        "DELETE FROM lectura_posterior WHERE id_actividad = $id_actividad_verificar_update";
        $query = $this->insert_query( $sql );

        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar lectura posterior' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }

        # insertamos los nuevos registros
        $query = $this->__insertarParametro( $parametro_actividad, $id_actividad_verificar_update );
        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar lista de verificación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }

        $query = $this->__insertarLecturas( $lectura_actual, $lectura_posterior, $id_actividad_verificar_update );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Parametro actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Correcto' );
            return $rsp;
        } else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar lista de verificación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'msj' => $query );
            return $rsp;
        }
    }

    public function actualizar_lista_verificacion ( $post ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $post, array(
                'id_lista_verificacion_update',
                'id_mantenimiento', 'lista_verificacion'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_lista_verificacion_update = $post[ 'id_lista_verificacion_update' ][ 'valor' ];
        $id_mantenimiento = $post[ 'id_mantenimiento' ][ 'valor' ];
        $lista_verificacion = $post[ 'lista_verificacion' ][ 'valor' ];

        $sql =
        "UPDATE lista_verificacion SET ".
        "id_mantenimiento = '$id_mantenimiento', ".
        "lista_verificacion = '$lista_verificacion' ".
        "WHERE id_lista_verificacion = '$id_lista_verificacion_update'";

        // return $sql;

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Lista de verificación actualizada satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $lista_verificacion, 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar lista de verificación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'lista_verificacion', 'msj' => $query );
            return $rsp;
        }
    }

    # -----------------------------------

    private function struct_html_tabla_actividades ( $data, $nombre_equipo_aero ) {
        $html = '<br><br><h2>'.$nombre_equipo_aero.'</h2><br><br>'.
            '<table cellspacing="0" cellpadding="1" border="1" >'.
                '<tr style="background-color:#009300;color:#000000;">'.
                    '<th width="240">ACTIVIDAD</th>'.
                    '<th width="240">PARAMETRO DE ACEPTACION</th>'.
                    '<th width="240">LECTURA ACTUAL</th>'.
                    '<th width="240">LECTURA POSTERIOR</th>'.
                '</tr>'.
                '</thead>'.
                '<tbody>';

        if ( empty( $data ) ) return $html." <tbody></tbody></table>";

            foreach( $data as $fila ) {
                $requerido         = $fila[ 'tipo_actividad' ] == 'REQUERIDO' ? 'style="background-color:#FFA3A6"' : '';
                $actividad         = $fila[ 'actividad_verificar' ];
                $parametro         = $fila[ 'parametro_aceptacion' ][ 'texto' ];
                $lectura_actual    = $fila[ 'lectura_actual' ][ 'texto' ];
                $lectura_posterior = $fila[ 'lectura_posterior' ][ 'texto' ];

                $html .=

                    '<tr '. $requerido .'>'.
                        '<td width="240">'.$actividad.'</td>'.
                        '<td width="240">'.$parametro.'</td>'.
                        '<td width="240">'.$lectura_actual.'</td>'.
                        '<td width="240">'.$lectura_posterior.'</td>'.
                    '</tr>';
            }

        $html .=
                '</tbody>'.
            '</table>';
        return $html;
    }

    public function imprimirTipoMtto () {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de tipo de Mantenimiento' );
        $pdf->SetSubject('');
        $pdf->SetKeywords('');

        // set default header data
        $pdf->SetHeaderData(
            PDF_HEADER_LOGO,
            30,
            'GERENCIA REGIONAL DE PRODUCCION SURESTE SUBGERENCIA REGIONAL HIDROELECTRICA GRIJALVA',
            'C.E. LA VENTA'
        );

        // set header and footer fonts
        $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        // $pdf->SetFont('helvetica', '', 8);
        $pdf->SetFont('courier', '', 8);

        // add a page
        $pdf->AddPage('L', 'A4');

        # estructuring data for pdf
        $datos = $this->obtenerTipoMantenimiento(  );

        $html =
            $this->struct_tabla(
                array (
                    array( 'titulo' => 'Id', 'campo'=> 'id_mantenimiento', 'x'=>50 ),
                    array( 'titulo' => 'Nombre del mantenimiento', 'campo'=> 'nombre_mantenimiento',  ),
                    array( 'titulo' => 'Numero de frecuencia', 'campo'=> 'numero_frecuencia', ),
                    array( 'titulo' => 'Tipo de frecuencia', 'campo'=> 'tipo_frecuencia', )
                ),

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_TipoMantenimiento.pdf', 'I');
    }

    public function imprimirUM () {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de Unidades de medida' );
        $pdf->SetSubject('');
        $pdf->SetKeywords('');

        // set default header data
        $pdf->SetHeaderData(
            PDF_HEADER_LOGO,
            30,
            'GERENCIA REGIONAL DE PRODUCCION SURESTE SUBGERENCIA REGIONAL HIDROELECTRICA GRIJALVA',
            'C.E. LA VENTA'
        );

        // set header and footer fonts
        $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        // $pdf->SetFont('helvetica', '', 8);
        $pdf->SetFont('courier', '', 8);

        // add a page
        $pdf->AddPage('L', 'A4');

        # estructuring data for pdf
        $datos = $this->obtenerUnidadMedida(  );

        $html =
            $this->struct_tabla(
                array (
                    array( 'titulo' => 'Unidad de medida', 'campo'=> 'unidad_medida', ),
                    array( 'titulo' => 'descripcion', 'campo'=> 'descripcion_unidad_medida',  )
                ),

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Unidad_Medida.pdf', 'I');
    }

    public function imprimirLV ( $get ) {

        $id_lista_verificacion = $get['id_lista_verificacion'];

        # buscamos el nombre de la lista de verificacion
        $sql =
        "SELECT lista_verificacion FROM lista_verificacion ".
        "WHERE id_lista_verificacion = $id_lista_verificacion";
        $lista_verificacion = $this->query( $sql, 'lista_verificacion', NULL );
        // $html.= '<center><b><h1> ' .$lista_verificacion. ' </h1></b></center><br><br><br><br>';


        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte lista de verificacion' );
        $pdf->SetSubject('');
        $pdf->SetKeywords('');

        // set default header data
        $pdf->SetHeaderData(
            PDF_HEADER_LOGO,
            30,
            'GERENCIA REGIONAL DE PRODUCCION SURESTE SUBGERENCIA REGIONAL HIDROELECTRICA GRIJALVA',
            $lista_verificacion
        );

        // set header and footer fonts
        $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
        $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

        // set default monospaced font
        $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

        // set margins
        $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
        $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

        // set auto page breaks
        $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        // set image scale factor
        $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

        // set font
        // $pdf->SetFont('helvetica', '', 8);
        $pdf->SetFont('courier', '', 8);

        // add a page
        $pdf->AddPage('L', 'A4');

        # estructuring data for pdf
        $html = '';

        # buscamos los ids de los equipos del
        # aerogenerador
        $sql =
        "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
        "WHERE id_lista_verificacion = $id_lista_verificacion";
        $arr_id_equipo_aero = $this->array_query( $sql, 'id_equipo_aero', NULL );

        foreach ( $arr_id_equipo_aero as $id_equipo_aero ) {
            # buscamos nombre de los equipos para ponerlos
            # como titulos de tabla de las actividades
            $sql =
            "SELECT nombre_equipo_aero FROM equipo_aero ".
            "WHERE id_equipo_aero = '$id_equipo_aero'";
            $nombre_equipo_aero = $this->query( $sql, 'nombre_equipo_aero', NULL );

            $datos = $this->actividades_into_lista( array( 'id_lista_verificacion' => $id_lista_verificacion ), $id_equipo_aero );
            $html .= $this->struct_html_tabla_actividades( $datos, $nombre_equipo_aero );
        }

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('Lista_verificacion.pdf', 'I');
        //return $serverRoot.'ajax/sistema/doc/Lista_verificacion.pdf';
    }
}