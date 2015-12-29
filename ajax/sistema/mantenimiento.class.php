<?php
require_once 'sigesop.class.php';
require_once '../Carbon/Carbon.php';
use Carbon\Carbon;

class mantenimiento extends sigesop
{
	public function __construct( $usuario, $clave ) {
		parent::sigesop( $usuario, $clave );

        // $this->dataUser[ 'orden_trabajo' ] = $this->obtenerOrdenTrabajo( array( 'usuario' => $this->usuario ) );
	}

    public function __destruct() {
        parent::__destruct();
    }

	public function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion) {
            case 'actividadesOrdenTrabajo':
                $query = $this->actividadesOrdenTrabajo( $get );
                echo json_encode( $query );
                break;

            case 'actividades_into_equipo':
                $query = $this->actividades_into_equipo( $get );
                echo json_encode( $query );
                break;

            case 'asignarUsuariosOrdenTrabajo':
                $query = $this->asignarUsuariosOrdenTrabajo( $post );
                echo json_encode( $query );
                break;

            case 'eliminar_programacion_mtto':
                $query = $this->eliminar_programacion_mtto( $get );
                echo json_encode( $query );
                break;

            case 'equipo_into_systems_mantto':
                $query = $this->equipo_into_systems_mantto( $get );
                echo json_encode( $query );
                break;

            case 'insertarDatosListaVerificacion':
                $insertarDatosListaVerificacion = $this->insertarDatosListaVerificacion( $post );
                echo json_encode( $insertarDatosListaVerificacion );
                break;

  			case 'nuevaOrdenTrabajo':
  				$nuevaOrdenTrabajo = $this->nuevaOrdenTrabajo( $post );
                echo json_encode( $nuevaOrdenTrabajo );
  				break;

            case 'obtenerDatosGraficaMantenimiento':
                $obtenerDatosGraficaMantenimiento = $this->obtenerDatosGraficaMantenimiento();
                echo json_encode( $obtenerDatosGraficaMantenimiento );
                break;

            case 'obtenerOrdenTrabajo':
                $obtenerOrdenTrabajo = $this->obtenerOrdenTrabajo( $get );
                echo json_encode( $obtenerOrdenTrabajo );
                break;

            case 'obtenerOrdenTrabajoLista':
                $obtenerOrdenTrabajoLista = $this->obtenerOrdenTrabajoLista( $get );
                echo json_encode( $obtenerOrdenTrabajoLista );
                break;

            // case 'obtenerOrdenesPorGenerador':
            //     $obtenerOrdenesPorGenerador = $this->obtenerOrdenesPorGenerador( $get );
            //     echo json_encode( $obtenerOrdenesPorGenerador );
            //     break;

            // case 'obtenerVerificacionOrdenTrabajo':
            //     $obtenerVerificacionOrdenTrabajo = $this->obtenerVerificacionOrdenTrabajo( $get );
            //     echo json_encode( $obtenerVerificacionOrdenTrabajo );
            //     break;

            case 'reprogramacion_fecha_mtto':
                $query = $this->reprogramacion_fecha_mtto();
                echo json_encode( $query );
                break;

            case 'systems_into_mantto':
                $query = $this->systems_into_mantto( $get );
                echo json_encode( $query );
                break;

            case 'verifica_orden_trabajo':
                $query = $this->verifica_orden_trabajo( $get );
                echo json_encode( $query );
                break;

            case 'test':
                $q = $this->test( $get );
                echo json_encode( $q );
                break;

            default:
                echo json_encode('Funcion no registrada en la clase mantenimiento');
            break;
		}
	}

    # nuevaOrdenTrabajo -------------------------
    public function nuevaOrdenTrabajo ( $data ) {
        // echo var_dump( $_REQUEST );
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'numero_unidad', 'numero_aero', 'id_mantenimiento', 'duracion', 'magnitud_duracion',
                'fecha_inicial', 'trabajo_solicitado', 'programacion_mtto'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_prog_mtto = $this->autoincrement( "SELECT id_prog_mtto FROM orden_trabajo ORDER BY id_prog_mtto ASC", 'id_prog_mtto' );
        $numero_unidad =  $data[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
        $id_mantenimiento = $data[ 'id_mantenimiento' ][ 'valor' ];
        $duracion = $data[ 'duracion'][ 'valor' ];
        $magnitud_duracion = $data[ 'magnitud_duracion' ][ 'valor' ];
        $fecha_inicial = $data[ 'fecha_inicial' ][ 'valor' ];
        $fecha_final = $data[ 'fecha_final' ][ 'valor' ];
        $trabajo_solicitado = $data[ 'trabajo_solicitado' ][ 'valor' ];
        $numero_orden = $numero_unidad . $numero_aero . $id_mantenimiento;

        $sql =
            "INSERT INTO ".
            "orden_trabajo( id_prog_mtto, numero_orden, ".
            "id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
            "fecha_inicial, fecha_final, trabajo_solicitado ) ".
            "VALUES( $id_prog_mtto ,'$numero_orden', '$numero_aero', ".
            "'$id_mantenimiento', $duracion, '$magnitud_duracion', ".
            "STR_TO_DATE( '$fecha_inicial', '%d-%m-%Y' ), ".
            "STR_TO_DATE( '$fecha_final', '%d-%m-%Y' ), ".
            "'$trabajo_solicitado' )";

        // return $sql;

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            # insertamos las fechas de programacion de mantenimiento
            $isValid = true;
            $i = 0;
            foreach( $data[ 'programacion_mtto' ] as $row ) {
                $id_orden_trabajo = $this->autoincrement( "SELECT id_orden_trabajo FROM programacion_mtto ORDER BY id_orden_trabajo ASC", 'id_orden_trabajo' );
                $fecha_inicial = $row[ 'from' ];
                $fecha_final = $row[ 'to' ];

                if ( $i !== 0 ) {
                    $sql =
                        "INSERT INTO programacion_mtto ".
                        "(id_orden_trabajo, id_prog_mtto, fecha_inicial, fecha_final) ".
                        "VALUES ( $id_orden_trabajo, $id_prog_mtto, ".
                        "STR_TO_DATE( '$fecha_inicial', '%d-%m-%Y' ), ".
                        "STR_TO_DATE( '$fecha_final', '%d-%m-%Y' ) )";
                } else {
                    # la primer fecha programada se inicializa como una
                    # orden ACTIVA
                    $sql =
                        "INSERT INTO programacion_mtto ".
                        "(id_orden_trabajo, id_prog_mtto, fecha_inicial, ".
                        "fecha_final, estado_asignado ) ".
                        "VALUES ( $id_orden_trabajo, $id_prog_mtto, ".
                        "STR_TO_DATE( '$fecha_inicial', '%d-%m-%Y' ), ".
                        "STR_TO_DATE( '$fecha_final', '%d-%m-%Y' ), 'ACTIVO' )";
                }

                $query = $this->insert_query( $sql );
                if ( $query !== 'OK' ) {
                    $isValid = false;
                    $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $fecha_inicial, 'msj' => $query );
                }

                $i++;
            }

            # validando que todas las fechas hayan sido insertadas y retornando respuesta
            if ( $isValid ) {
                $this->conexion->commit();
                $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Orden de trabajo creada satisfactoriamente.' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
                return $rsp;
            } else {
                $this->conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al crear orden de trabajo' );
                return $rsp;
            }
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al crear orden de trabajo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    public function eliminar_programacion_mtto ( $get ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $get, array(
                'id_prog_mtto'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_prog_mtto = $get[ 'id_prog_mtto' ];

        $sql =
        "DELETE FROM programacion_mtto ".
        "WHERE id_prog_mtto = $id_prog_mtto";

        $query = $this->insert_query( $sql );
        if ( $query !== 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar programación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'id_prog_mtto', 'msj' => $query );
            return $rsp;
        }

        $sql =
        "DELETE FROM orden_trabajo ".
        "WHERE id_prog_mtto = $id_prog_mtto";

        $query = $this->insert_query( $sql );
        if ( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Programación eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'msj' => 'Correcto' );
            return $rsp;
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar programación' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'key' => 'id_prog_mtto', 'msj' => $query );
            return $rsp;
        }
    }

    # asignarUsuariosOrdenTrabajo -----------------------

    public function asignarUsuariosOrdenTrabajo ( $data ) {
        $rsp = array();

        $validar = $this->verificaDatosNulos( $data, array(
            'supervisor', 'responsable',
            'id_prog_mtto', 'auxiliar'
        ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ]    = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ]   = $validar[ 'eventos' ];
            return $rsp;
        }

        # recolectando datos en variables
        $id_prog_mtto   = $data[ 'id_prog_mtto' ][ 'valor' ];
        $supervisor         = $data[ 'supervisor' ][ 'valor' ];
        $responsable        = $data[ 'responsable' ][ 'valor' ];
        $auxiliar           = $data[ 'auxiliar' ]; # arreglo de datos
        $transaccion        = true; # bandera para validar la correcta insercion de todos los datos

        # usuario root no puede asignar a otros usuarios ya que no
        # existe en la base de datos [laventa_cfe]
        if ( $supervisor == $this->root ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Error... el usuario $this->root no puede asignar usuarios, asigne usuarios con la cuenta apropiada." );
            return $rsp;
        }

        # insertar usuario supervisor
        $query = $this->__insertaUsuario( $id_prog_mtto, $supervisor, 'SUPERVISOR' );
        if ( $query != 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario supervisor' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $supervisor, 'key' => 'supervisor', 'msj' => $query );
            $transaccion = false;
        }

        # insertar usuario reponsable
        $query = $this->__insertaUsuario( $id_prog_mtto, $responsable, 'RESPONSABLE' );
        if ( $query != 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario responsable' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $responsable, 'key' => 'responsable', 'msj' => $query );
            $transaccion = false;
        }

        # insertar usuarios auxiliares, pueden ser
        # uno o muchos
        $query = $this->__insertaUsuarioAuxiliar( $id_prog_mtto, $auxiliar );
        if ( $query != 'OK' ) {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar auxiliar responsable' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => 'auxiliar', 'msj' => $query );
            $transaccion = false;
        }

        # si todos los usuarios se ingresaron satisfactoriamente
        # realizamos terminamos la transaccion
        if ( $transaccion ) {
            $this->conexion->commit();
            $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Usuarios agregados satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => 'status', 'msj' => 'Correcto' );
        }
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al activar orden de trabajo' );
        }

        return $rsp;
    }

    # Esta funcion unicamente inserta a los usuarios tipo:
    # [SUPERVISOR, RESPONSABLE]
    private function __insertaUsuario ( $id_prog_mtto, $usuario, $tipo_usuario ) {
        # verificamos que sea un usuario valido: [SUPERVISOR, RESPONSABLE]
        if ( $tipo_usuario != 'SUPERVISOR' &&
             $tipo_usuario != 'RESPONSABLE' )
            return 'Usuario no valido para funcion __insertaUsuario';

        # verificamos que no existan usuarios previamente insertados
        $sql =
        "SELECT usuario FROM orden_trabajo_personal ".
        "WHERE id_libro_relatorio IS NULL ".
        "AND id_prog_mtto = $id_prog_mtto ".
        "AND tipo_usuario = '$tipo_usuario'";

        $query = $this->array_query( $sql, 'usuario', NULL );

        if ( !empty( $query ) )
            return "Usuario supervisor asignado previamente";

        # estructuramos SQL y realizamos consulta
        $sql =
        "INSERT INTO orden_trabajo_personal( ".
            "id_prog_mtto, ".
            "usuario, ".
            "tipo_usuario ".
        ")".
        "VALUES ( ".
            "$id_prog_mtto, ".
            "'$usuario', ".
            "'$tipo_usuario' ".
        ")";
        // return $sql;

        $query = $this->insert_query( $sql );
        return $query !== 'OK' ?
            $query.'. Error al insertar usuario supervisor' : $query;
    }

    # Inserta multiples usuarios auxiliares
    private function __insertaUsuarioAuxiliar ( $id_prog_mtto, $arr ) {
        # verificamos que no existan usuarios previamente insertados
        # validando que el campo id_libro_relatorio sea nulo
        $sql =
        "SELECT usuario FROM orden_trabajo_personal ".
        "WHERE id_libro_relatorio IS NULL ".
        "AND id_prog_mtto = $id_prog_mtto ".
        "AND tipo_usuario = 'AUXILIAR'";
        // return $sql;

        $query = $this->array_query( $sql, 'usuario', null );

        if ( $query == null ) {
            $dataString = '';
            $i = 0;
            $lon = sizeof( $arr );
            foreach ( $arr as $user ){
                $dataString .= $i < ( $lon - 1 ) ?
                    "( $id_prog_mtto, '$user', 'AUXILIAR' ),":
                    "( $id_prog_mtto, '$user', 'AUXILIAR' )";
                $i++;
            }

            $sql =
            "INSERT INTO orden_trabajo_personal (".
                "id_prog_mtto, ".
                "usuario, ".
                "tipo_usuario ".
            ") ".
            "VALUES ".$dataString;
            // return $sql;

            return $this->insert_query( $sql );
        }

        else return "Usuario auxiliar asignado previamente";
    }

    # ---------------------------------------------------

    public function obtenerDatosGraficaMantenimiento () {
        $objetoRetorno = array();

        // ------------------------ consultando numero de unidades
        $SQL_matrizUnidades =
        "select numero_unidad from unidad_aero where numero_unidad in (
            select numero_unidad from aeros where numero_aero in (
                select id_aero from orden_trabajo where numero_orden is not null
            )
        )";
        $matrizUnidades = $this->array_query( $SQL_matrizUnidades, 'numero_unidad', null );
        if ($matrizUnidades != null) {
            // ------------------------ recorriendo matriz de unidades
            $indexUnidad = 0;
            foreach ($matrizUnidades as $unidad) {
                $objetoRetorno[$indexUnidad]['numeroUnidad'] = $unidad;

                // ------------------------ consultando generadores en la unidad actual
                $SQL_matrizAeros =
                "select numero_aero from aeros where numero_unidad = '$unidad' and numero_aero in (
                    select id_aero from orden_trabajo where numero_orden is not null
                )";
                $matrizAeros = $this->array_query( $SQL_matrizAeros, 'numero_aero', null );

                // ------------------------ recorriendo matriz de aeros
                $indexAero = 0;
                foreach ($matrizAeros as $aero) {
                    $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['numeroAero'] = $aero;

                    // ------------------------ consultando tipos de mantenimientos existentes por aero dentro de las ordenes
                    $SQL_matrizTipoMantto =
                    "select id_mantenimiento, nombre_mantenimiento, numero_frecuencia, tipo_frecuencia from tipo_mantenimiento where id_mantenimiento in(
                        select id_mantenimiento from orden_trabajo where id_aero = '$aero'
                    )";
                    $matrizTipoMantto = $this->array_query( $SQL_matrizTipoMantto );

                    // ------------------------ recorriendo matriz de tipos de mantenimiento
                    $indexTipoMantto = 0;
                    foreach ($matrizTipoMantto as $tipoMantto) {
                        $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['seriesTipoMantto'][$indexTipoMantto]['tipoMantto'] = $tipoMantto['nombre_mantenimiento'];
                        $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['seriesTipoMantto'][$indexTipoMantto]['frecuencia'] = $tipoMantto['numero_frecuencia'];
                        $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['seriesTipoMantto'][$indexTipoMantto]['magnitudFrecuencia'] = $tipoMantto['tipo_frecuencia'];

                        // ------------------------ consultando datos de la orden de trabajo para graficar
                        $idMantto = $tipoMantto['id_mantenimiento'];
                        $SQL_datosOrden =
                        "select numero_orden, fecha_programada, fecha_reprogramada, fecha_realizada, duracion, magnitud_duracion
                        from orden_trabajo where id_mantenimiento = '$idMantto' and id_aero = '$aero' order by fecha_programada asc";
                        $matrizDatosOrden = $this->array_query( $SQL_datosOrden );

                        // ------------------------recorriendo la matriz de ordenes de trabajo
                        // $datos = [];
                        // $indexDatosOrden = 0;
                        // foreach ($matrizDatosOrden as $datosOrden) {
                        //     $datos[$indexDatosOrden] = array_merge($datosOrden, array('numero_frecuencia' => $tipoMantto['numero_frecuencia'], 'tipo_frecuencia' => $tipoMantto['tipo_frecuencia'] ) );
                        //     $indexDatosOrden++;
                        // }

                        // ------------------------ combinando matrices de datos
                        $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['seriesTipoMantto'][$indexTipoMantto]['datos'] = $matrizDatosOrden;

                        $indexTipoMantto++;
                    }

                    $indexAero++;
                }

                $indexUnidad++;
            }
        } else return null;

        return $objetoRetorno;
    }

    public function obtenerOrdenTrabajo ( $get ) {
        if ( !empty( $get[ 'numero_unidad' ] ) ) $tipo_query    = 'numero_unidad';
        else if ( !empty( $get[ 'numero_aero' ] ) ) $tipo_query = 'numero_aero';
        else if ( !empty( $get[ 'usuario' ] ) ) $tipo_query     = 'usuario';
        else if ( !empty( $get[ 'option' ] ) ) $tipo_query      = $get[ 'option' ];
        else $tipo_query                                        = 'default';

        switch ( $tipo_query ) {
            case 'numero_unidad': # devuelve todas las ordenes de trabajo por unidad de generador
                $numero_unidad = $get[ 'numero_unidad' ];
                $sql =
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where estado_asignado = true and fecha_realizada is null and id_aero in( ".
                        "select numero_aero from aeros where numero_unidad = '$numero_unidad'".
                    " ) group by numero_orden order by fecha_programada asc";
                break;

            case 'numero_aero':
                $numero_aero = $get[ 'numero_aero' ];
                $option = $get[ 'option' ];

                switch ( $option ) {
                    # retorna la siguiente orden de trabajo no asignada,
                    # del generador solicitado
                    case 'case_sin_asignar':
                        $sql =
                            "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                            "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                            "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                            "where estado_asignado = false and fecha_realizada is null && id_aero = '$numero_aero' group by numero_orden order by fecha_programada asc";
                        break;

                    # retorna la ultima orden de trabajo programada,
                    # del generador solicitado
                    case 'ultima_orden':
                        $id_mantenimiento = $get[ 'id_mantenimiento' ];
                        return $this->__ultima_orden( $numero_aero, $id_mantenimiento );
                        break;

                    # retorna la orden de trabajo activa,
                    # del generador solicitado
                    default:
                        $sql =
                        "SELECT t_ot.id_prog_mtto, numero_orden, id_aero, ".
                        "id_mantenimiento, duracion, magnitud_duracion, ".
                        "DATE_FORMAT(t_pm.fecha_inicial, '%d-%m-%Y' ) as fecha_programada, ".
                        "trabajo_solicitado, t_pm.id_orden_reprog, t_pm.id_orden_trabajo ".
                        "FROM orden_trabajo t_ot ".
                        "INNER JOIN programacion_mtto t_pm ".
                        "ON t_ot.id_prog_mtto = t_pm.id_prog_mtto ".
                        "WHERE t_ot.estado_asignado IS NULL ".
                        "AND t_pm.estado_asignado = 'ACTIVO' ".
                        "AND t_ot.id_aero = '$numero_aero' ".
                        "ORDER BY t_ot.numero_orden ASC";
                        break;
                }
                break;

            case 'usuario': # devuelve todas las ordenes de trabajo por usuario
                $usuario = $get[ 'usuario' ];
                $sql =
                "SELECT ".
                    "ot.id_prog_mtto, ".
                    "numero_orden, id_aero, ".
                    "id_mantenimiento, ".
                    "duracion, magnitud_duracion, ".
                    "ot.fecha_inicial, ot.fecha_final, ".
                    "DATE_FORMAT(pm.fecha_inicial, '%d-%m-%Y' ) as fecha_programada, ".
                    "trabajo_solicitado, pm.id_orden_reprog, pm.id_orden_trabajo ".
                "FROM orden_trabajo ot ".
                "INNER JOIN programacion_mtto pm ".
                "ON ot.id_prog_mtto = pm.id_prog_mtto ".
                "WHERE ot.estado_asignado IS NULL ".
                "AND pm.estado_asignado = 'ACTIVO' ".
                "AND ( ".
                    "pm.id_prog_mtto in( ".
                        "SELECT id_prog_mtto ".
                        "FROM orden_trabajo_personal ".
                        "WHERE id_libro_relatorio IS NOT NULL ".
                        "AND usuario = '$usuario' ".
                        "AND tipo_usuario = 'RESPONSABLE' ".
                    " )".
                " )".
                "ORDER BY ot.numero_orden ASC";
                break;

            # retorna todas las ordenes de trabajo que fueron programadas
            # y asignadas en un evento para su seguimiento
            case 'obtener_libro_relatorio_orden_trabajo_programado':
                $sql =
                "SELECT ".
                    "t_a.numero_unidad, ".
                    "lr.id_orden_trabajo, ".
                    "pm.id_orden_reprog, ".
                    "pm.id_prog_mtto, ".
                    "lv.id_lista_verificacion, ".
                    "ot.numero_orden, ".
                    "lr.numero_aero, ".
                    "lr.condicion_operativa, ".
                    "lr.consecutivo_licencia, ".
                    "lr.descripcion_evento, ".
                    "lr.id_libro_relatorio, ".
                    "lr.id_libro_licencia, ".
                    // "DATE_FORMAT( fecha_inicio_evento, '%d-%m-%Y' ) AS fecha_prog, ".
                    "lr.hora_inicio_evento, ".
                    "DATE_FORMAT( pm.fecha_inicial, '%d-%m-%Y' ) AS fecha_inicial, ".
                    "DATE_FORMAT( pm.fecha_final, '%d-%m-%Y' ) AS fecha_final, ".
                    "fecha_termino_evento, lr.hora_termino_evento, ".
                    "DATE_FORMAT( fecha_termino_estimado, '%d-%m-%Y' ) as fecha_termino_estimado, ".
                    "lr.trabajador_solicito, lr.trabajador_autorizo ".
                "FROM aeros t_a ".

                "INNER JOIN libro_relatorio lr ".
                "ON t_a.numero_aero = lr.numero_aero ".

                "LEFT JOIN programacion_mtto pm ".
                "ON pm.id_prog_mtto = ( ".
                    "SELECT id_prog_mtto FROM orden_trabajo_personal ".
                    "WHERE id_libro_relatorio = lr.id_libro_relatorio ".
                    "LIMIT 1 ".
                ") ".

                "LEFT JOIN orden_trabajo ot ".
                "ON ot.id_prog_mtto = pm.id_prog_mtto ".

                "LEFT JOIN lista_verificacion lv ".
                "ON ot.id_mantenimiento = lv.id_mantenimiento ";

                # filtramos por estados de licencias
                switch ( $get[ 'sin_licencia' ] ) {
                    case 'mtto_sin_licencia':
                        $sql .=
                            "WHERE lr.id_libro_relatorio IN ( ".
                                "SELECT id_libro_relatorio ".
                                "FROM libro_relatorio ".
                                "WHERE estado_evento = TRUE ".
                                "AND condicion_operativa = 'MTTO' ".
                                "AND id_orden_trabajo IS NULL ".
                            ") ";
                        break;

                    case 'mtto_con_licencia':
                        $sql .=
                            "WHERE ( pm.estado_asignado = 'ACTIVO' ".
                                "AND lr.estado_evento = TRUE ".
                                "AND lr.condicion_operativa = 'MTTO' ".
                            ") ";
                        break;

                    # se regresan todas las programaciones con o sin licencia
                    case 'mtto_con_sin_licencia':
                        $sql .=
                            "WHERE lr.id_libro_relatorio IN ( ".
                                "SELECT id_libro_relatorio ".
                                "FROM libro_relatorio ".
                                "WHERE estado_evento = TRUE ".
                                "AND condicion_operativa = 'MTTO' ".
                                "AND id_orden_trabajo IS NULL ".
                            ") ".
                            "OR ( pm.estado_asignado = 'ACTIVO' ".
                                "AND lr.estado_evento = TRUE ".
                                "AND lr.condicion_operativa = 'MTTO' ".
                            ") ";
                        break;

                    default: return array();
                }

                $fecha_inf = $get[ 'fecha_inf' ];
                $fecha_sup = $get[ 'fecha_sup' ];

                # si viene un rango de fechas
                if ( !empty( $fecha_inf ) && !empty( $fecha_sup ) ) {
                    $sql .=
                    "AND pm.fecha_inicial >= STR_TO_DATE( '$fecha_inf', '%d-%m-%Y' ) ".
                    "AND pm.fecha_inicial <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ";
                }

                # si unicamente viene la fecha superior
                else if ( !empty( $fecha_sup ) ) {
                    $sql .=
                    "AND pm.fecha_inicial <= STR_TO_DATE( '$fecha_sup', '%d-%m-%Y' ) ";
                }

                // return $sql;

                $arr = array();
                foreach ( $this->array_query( $sql ) as $row ) {
                    $id_orden_trabajo      = $row[ 'id_orden_trabajo' ];
                    $id_lista_verificacion = $row[ 'id_lista_verificacion' ];
                    $id_libro_relatorio    = $row[ 'id_libro_relatorio' ];
                    $id_prog_mtto          = $row[ 'id_prog_mtto' ];
                    $fecha                 = $this->__retorna_fecha_prog_mtto( $id_orden_trabajo );

                    $row[ 'fecha_reprogramada' ] = $fecha[ 'fecha_reprogramada' ];
                    $row[ 'fecha_programada' ]   = $fecha[ 'fecha_programada' ];

                    # cambiamos la etiqueta del numero de orden si es null
                    if ( $row[ 'numero_orden' ] == NULL )
                        $row[ 'numero_orden' ] = 'SIN LICENCIA';

                    # calculamos las actividades no realizadas de la lista
                    # de verificacion
                    $query = $this->__verificar_datos_actividad( $this->__retorna_id_orden_trabajo_original( $id_orden_trabajo ), $id_lista_verificacion );
                    $row[ 'actividades_faltantes' ] = $query != 'OK' ?
                        $query : 0;

                    ###################################################
                    # calculamos horas programadas ####################
                    ###################################################
                    $fecha_inicio = Carbon::parse( $row[ 'fecha_inicial' ], 'America/Mexico_City' );
                    $fecha_final  = Carbon::parse( $row[ 'fecha_final' ], 'America/Mexico_City' );
                    $horas        = $fecha_final->diffInHours( $fecha_inicio );
                    $min_total    = $fecha_final->diffInMinutes( $fecha_inicio );
                    $min          = $min_total % 60;

                    # formateamos la cadena para dejar una estructura
                    # similar a 00:00:00
                    $row[ 'horas_programadas' ] = $this->__struct_string_time( $horas, $min );

                    ###################################################
                    # calculamos horas reales en base al tiempo #######
                    # en el historial del relatorio ###################
                    ###################################################
                    $sql = "SELECT ".
                        "fecha_inicio_evento, hora_inicio_evento, ".
                        "fecha_termino_evento, hora_termino_evento ".
                    "FROM libro_relatorio_historial ".
                    "WHERE id_libro_relatorio = $id_libro_relatorio ";

                    $min_total = 0;
                    $hora_total = 0;
                    foreach( $this->array_query( $sql ) as $_row ) {
                        $fecha_inicio = Carbon::parse( $_row[ 'fecha_inicio_evento' ]." ".$_row[ 'hora_inicio_evento' ] , 'America/Mexico_City' );
                        $fecha_final  = Carbon::parse( $_row[ 'fecha_termino_evento' ]." ".$_row[ 'hora_termino_evento' ], 'America/Mexico_City' );
                        $hora_total   += $fecha_final->diffInHours( $fecha_inicio );
                        $min_total    += $fecha_final->diffInMinutes( $fecha_inicio );
                    }

                    # formateamos la cadena para dejar una estructura
                    # similar a 00:00:00
                    $row[ 'horas_reales' ] = $this->__struct_string_time( $hora_total, ( $min_total % 60 ) );

                    $arr[] = $row;
                }

                return $arr;
                break;

            # retorna las ordenes de trabajo más proximas
            default: // devuelve todas las ordenes de trabajo no realizadas
                $sql =
                "SELECT t_ot.id_prog_mtto, numero_orden, id_aero, ".
                "id_mantenimiento, duracion, magnitud_duracion, ".
                "DATE_FORMAT(t_pm.fecha_inicial, '%d-%m-%Y' ) as fecha_programada, ".
                // "DATE_FORMAT(t_pm.fecha_final, '%d-%m-%Y' ) as fecha_final, ".
                "trabajo_solicitado, t_pm.id_orden_reprog, t_pm.id_orden_trabajo ".
                "FROM orden_trabajo t_ot ".
                "INNER JOIN programacion_mtto t_pm ".
                "ON t_ot.id_prog_mtto = t_pm.id_prog_mtto ".
                "WHERE t_ot.estado_asignado IS NULL ".
                "AND t_pm.estado_asignado = 'ACTIVO' ".
                "ORDER BY t_ot.numero_orden ASC";
                break;
        }

        // return $sql;

        $this->__reprogramacion_fecha(); # lanzamos reprogramacion de ordenes de trabajo
        $query = $this->array_query( $sql );
        $arr = array();

        # completamos los datos que se requieren
        foreach ( $query as $orden ) {
            $id_orden_trabajo = empty( $orden[ 'id_orden_reprog' ] ) ?
                $orden[ 'id_orden_trabajo' ] : $orden[ 'id_orden_reprog' ];

            // $id_orden_trabajo = $orden[ 'id_orden_trabajo' ];
            $id_prog_mtto     = $orden[ 'id_prog_mtto' ];

            # reasignando nomenclatura de las fechas por
            # reprogramacion de orden de trabajo
            $sql =
                "SELECT DATE_FORMAT(fecha_inicial, '%d-%m-%Y' ) as fecha_programada ".
                "FROM programacion_mtto ".
                "WHERE id_orden_trabajo = $id_orden_trabajo";

            $query = $this->query( $sql, 'fecha_programada' );

            # verificamos que la fecha programada y reprogramada sean diferentes
            # sino llenamos el campo con N/A
            $orden[ 'fecha_reprogramada' ] = $orden[ 'fecha_programada' ] == $query ?
                'N/A' : $orden[ 'fecha_programada' ];
            $orden[ 'fecha_programada' ]   = $query;

            # buscando nombre de [id_mantenimiento]
            $id_mantenimiento                = $orden[ 'id_mantenimiento' ];
            $sql                             = "SELECT nombre_mantenimiento FROM tipo_mantenimiento WHERE id_mantenimiento = '$id_mantenimiento'";
            $_query                          = $this->query( $sql, 'nombre_mantenimiento', null );
            $orden[ 'nombre_mantenimiento' ] = $_query;

            # buscando a los usuarios asociados a la orden de trabajo
            $orden[ 'orden_trabajo_personal' ] = $this->__orden_trabajo_personal( $id_prog_mtto );

            $arr[] = $orden;
        }

        return $arr;
    }

    # retorna la fecha programada y reprogramada de la orden de trabajo
    private function __retorna_fecha_prog_mtto ( $id_orden_trabajo ) {
        $arr = array();
        $id_orden_original = $this->__retorna_id_orden_trabajo_original( $id_orden_trabajo );

        $sql =
            "SELECT DATE_FORMAT(fecha_inicial, '%d-%m-%Y' ) AS fecha_inicial ".
            "FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_trabajo";

        $_sql =
            "SELECT DATE_FORMAT(fecha_inicial, '%d-%m-%Y' ) AS fecha_inicial ".
            "FROM programacion_mtto ".
            "WHERE id_orden_trabajo = $id_orden_original";

        #evitamos repetir la misma fecha en los campos [programado, reprogramado]
        if ( $id_orden_original == $id_orden_trabajo ) {
            $arr[ 'fecha_programada' ]   = $this->query( $sql, 'fecha_inicial', '' );
            $arr[ 'fecha_reprogramada' ] = '';
        }

        else {
            $arr[ 'fecha_programada' ]   = $this->query( $_sql, 'fecha_inicial', '' );
            $arr[ 'fecha_reprogramada' ] = $this->query( $sql, 'fecha_inicial', '' );
        }

        return $arr;
    }

    public function __ultima_orden ( $numero_aero, $id_mantenimiento ) {
        if ( empty( $numero_aero ) && empty( $id_mantenimiento ) )
            return NULL;

        $sql =
        "SELECT DATE_FORMAT(fecha_final, '%d-%m-%Y' ) AS fecha_final ".
        "FROM orden_trabajo ".
        "WHERE id_aero = '$numero_aero' ".
        "AND id_mantenimiento = '$id_mantenimiento'";

        // return $sql;

        return $this->query( $sql, 'fecha_final', NULL );
    }

    #------------------------------------------------------------------------

    private function __orden_trabajo_personal( $id_prog_mtto ) {
        # buscar supervisor
        $sql =  "SELECT usuario FROM orden_trabajo_personal ".
                "WHERE tipo_usuario = 'SUPERVISOR' ".
                "AND id_prog_mtto = $id_prog_mtto ".
                "AND ( ".
                    "id_libro_relatorio IN ( ".
                        "SELECT id_libro_relatorio FROM libro_relatorio ".
                        "WHERE estado_evento = TRUE ".
                    ") ".
                    "OR ".
                    "id_libro_relatorio IS NULL ".
                ")";

        // return $sql;
        $query = $this->query( $sql, 'usuario', null );
        $arr[ 'supervisor' ] = $query;

        # buscar responsable
        $sql =
        "SELECT usuario FROM orden_trabajo_personal ".
        "WHERE tipo_usuario = 'RESPONSABLE' ".
        "AND id_prog_mtto = $id_prog_mtto ".
        "AND ( ".
            "id_libro_relatorio IN ( ".
                "SELECT id_libro_relatorio FROM libro_relatorio ".
                "WHERE estado_evento = TRUE ".
            ") ".
            "OR ".
            "id_libro_relatorio IS NULL ".
        ")";

        // return $sql;

        // "SELECT usuario FROM orden_trabajo_personal ".
        // "WHERE tipo_usuario = 'RESPONSABLE' ".
        // "AND id_prog_mtto = $id_prog_mtto ".
        // "AND id_libro_relatorio IS NULL";

        $query = $this->array_query( $sql, 'usuario', null );
        $arr[ 'responsable' ] = $query[ 0 ];

        # buscar auxiliar
        $sql =
        "SELECT usuario FROM orden_trabajo_personal ".
        "WHERE tipo_usuario = 'AUXILIAR' ".
        "AND id_prog_mtto = $id_prog_mtto ".
        "AND ( ".
            "id_libro_relatorio IN ( ".
                "SELECT id_libro_relatorio FROM libro_relatorio ".
                "WHERE estado_evento = TRUE ".
            ") ".
            "OR ".
            "id_libro_relatorio IS NULL ".
        ")";

        // "SELECT usuario FROM orden_trabajo_personal ".
        // "WHERE tipo_usuario = 'AUXILIAR' ".
        // "AND id_prog_mtto = $id_prog_mtto ".
        // "AND id_libro_relatorio IS NULL";
        $query = $this->array_query( $sql, 'usuario', null );
        $arr[ 'auxiliar' ] = $query;

        return $arr;
    }

    /* ---------- verifica_orden_trabajo ----------------------------
     * verifica la existencia de una orden de trabajo "No realizada" para los campos
     * [numero_generador, numero_unidad]
     * retorna los generadores sin una orden de trabajo planificada
     */
    public function verifica_orden_trabajo ( $get ) {
        if ( !empty( $get[ 'numero_unidad' ] ) ) $tipo_query = 'numero_unidad';
        else if ( !empty( $get[ 'numero_aero' ] ) ) $tipo_query = 'numero_aero';
        else return null;

        $arr = array();

        switch ( $tipo_query ) {
            case 'numero_unidad': // devuelve todos los generadores que no tienen un programa de mantenimiento dentro una unidad
                $numero_unidad = $get[ 'numero_unidad' ];
                $sql =
                    "SELECT DISTINCT aeros.numero_aero FROM aeros ".
                    "LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "WHERE aeros.numero_unidad = '$numero_unidad' ".
                    "&& orden_trabajo.id_aero IS NULL";

                $arr[ 'no_valido' ] = $this->array_query( $sql, 'numero_aero', null );

                $sql =
                    "SELECT DISTINCT aeros.numero_aero FROM aeros ".
                    "LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "WHERE aeros.numero_unidad = '$numero_unidad' ".
                    "&& aeros.numero_aero = orden_trabajo.id_aero ".
                    "ORDER BY orden_trabajo.id_aero ASC";

                $arr[ 'valido' ] = $this->array_query( $sql, 'numero_aero', null );
                break;

            case 'numero_aero': // devuelve todos los generadores que no tienen un programa de mantenimiento
                $numero_aero = $get[ 'numero_aero' ];
                $sql =
                    "SELECT DISTINCT aeros.numero_aero FROM aeros ".
                    "LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "WHERE aeros.numero_aero = '$numero_aero' ".
                    "&& orden_trabajo.id_aero IS NULL";

                $arr[ 'no_valido' ] = $this->array_query( $sql, 'numero_aero', null );

                $sql =
                    "SELECT DISTINCT aeros.numero_aero FROM aeros ".
                    "LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "WHERE aeros.numero_aero = '$numero_aero' ".
                    "&& orden_trabajo.id_aero = aeros.numero_aero";

                $arr[ 'valido' ] = $this->array_query( $sql, 'numero_aero', null );
                break;

            default:
                return null;
                break;
        }

        return $arr;
    }

    #------------------------------------------------------------------------

    public function systems_into_mantto( $get ) {
        $id_mantenimiento = $get[ 'id_mantenimiento' ];
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $get[ 'id_orden_trabajo' ] );
        $con_datos        = $get[ 'con_datos' ];

        if ( empty( $id_mantenimiento ) ) return null;

        # buscar el [id_lista_verificacion] con el id_mantenimiento
        $sql =  "SELECT id_lista_verificacion FROM lista_verificacion ".
                "WHERE id_mantenimiento = '$id_mantenimiento'";

        $id_lista_verificacion = $this->query( $sql, 'id_lista_verificacion', NULL );
        if ( $id_lista_verificacion == NULL ) return NULL;

        switch ( $con_datos ) {
            case 'true': # sistemas con datos capturados
                $sql =
                "SELECT DISTINCT id_sistema_aero FROM actividad_verificar ".
                "WHERE id_lista_verificacion = $id_lista_verificacion ".
                "AND id_actividad_verificar IN ( ".
                    "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                    "WHERE id_orden_trabajo = $id_orden_trabajo ".
                ")";
                break;

            default: # sistemas sin datos capturados
                $sql =
                "SELECT DISTINCT id_sistema_aero FROM actividad_verificar ".
                "WHERE id_lista_verificacion = $id_lista_verificacion ".
                "AND id_actividad_verificar NOT IN ( ".
                    "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                    "WHERE id_orden_trabajo = $id_orden_trabajo ".
                ")";
                break;
        }

        // return $sql;

        $query = $this->array_query( $sql, 'id_sistema_aero', null );
        if ( $query == null ) return null;

        $mtz = array_unique( $query );
        $arr = array(); // matriz de retorno

        foreach ( $mtz as $id_sistema_aero ) {
            $sql =  "SELECT * FROM sistema_aero ".
                    "WHERE id_sistema_aero = '$id_sistema_aero'";
            $query = $this->array_query( $sql );
            $arr[] = $query[ 0 ];
        }

        return $arr;
    }

    /**
     * [equipo_into_systems_mantto description]
     * @param  [Array] [$get] variables de opciones pasadas
     *                        a través del queryString _GET
     * @return [Array] retorna los equipos con actividades
     * existentes dentro de un mantenimiento puede configurarse
     * para que retorne equipos con datos en las actividades
     * o que retorne equipos sin datos en las actividades
     */
    public function equipo_into_systems_mantto ( $get ) {
        $validar =
            $this->verificaDatosNulos( $get, array(
                'id_mantenimiento', 'id_sistema_aero'
            ));

        // if ( $validar !== 'OK' ) return null;

        $id_mantenimiento = $get[ 'id_mantenimiento' ];
        $id_sistema_aero = $get[ 'id_sistema_aero' ];
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $get[ 'id_orden_trabajo' ] );
        $con_datos = $get[ 'con_datos' ];

        # buscar el [id_lista_verificacion] con el id_mantenimiento
        $sql =
        "SELECT id_lista_verificacion FROM lista_verificacion ".
        "WHERE id_mantenimiento = '$id_mantenimiento'";

        $id_lista_verificacion = $this->query( $sql, 'id_lista_verificacion', NULL );
        if ( $id_lista_verificacion == NULL ) return NULL;

        switch ( $con_datos ) {
            case 'true': # retorna equipos dentro de sistemas con datos capturados
                $sql =
                    "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
                    "WHERE id_lista_verificacion = $id_lista_verificacion ".
                    "AND id_sistema_aero = '$id_sistema_aero' AND ".
                    "id_actividad_verificar IN ( ".
                        "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                        "WHERE id_orden_trabajo = $id_orden_trabajo ".
                    ")";
                break;

            default: # retorna equipos dentro de sistemas sin datos capturados
                $sql =
                    "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
                    "WHERE id_lista_verificacion = $id_lista_verificacion ".
                    "AND id_sistema_aero = '$id_sistema_aero' AND ".
                    "id_actividad_verificar NOT IN ( ".
                        "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                        "WHERE id_orden_trabajo = $id_orden_trabajo ".
                    ")";
                break;
        }

        // return $sql;

        $query = $this->array_query( $sql, 'id_equipo_aero', null );
        // $equipos = array_unique( $query );
        $arr = array(); // matriz de retorno

        foreach ( $query as $equ )
        {
            $sql = "select * from equipo_aero where id_equipo_aero = '$equ'";
            $query = $this->array_query( $sql );
            $arr [ ] = $query[ 0 ];
        }

        return !empty( $arr ) ?
            $arr : null;
    }

    /**
     * [actividades_into_equipo description]
     * @param  [Array] [$get] variables de opciones pasadas
     *                        a través del queryString _GET
     * @return [Array] retorna el conjunto de actividades
     * existentes dentro de un equipo en particular
     */
    public function actividades_into_equipo ( $get ) {
        $validar =
            $this->verificaDatosNulos( $get, array(
                'id_mantenimiento', 'id_equipo_aero', 'id_orden_trabajo'
            ));

        // if ( $validar === 'OK' ) return null;

        $id_mantenimiento = $get[ 'id_mantenimiento' ];
        $id_equipo_aero   = $get[ 'id_equipo_aero' ];
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $get[ 'id_orden_trabajo' ] );

        return $this->__actividad_verificar_equipo( $get );
    }

    private function __actividad_verificar_equipo ( $data ) {
        $id_mantenimiento = $data[ 'id_mantenimiento' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ];
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $data[ 'id_orden_trabajo' ] );
        $con_datos = $data[ 'con_datos' ];

        # buscar el [id_lista_verificacion] con el id_mantenimiento
        $sql =
        "SELECT id_lista_verificacion FROM lista_verificacion ".
        "WHERE id_mantenimiento = '$id_mantenimiento'";

        $id_lista_verificacion = $this->query( $sql, 'id_lista_verificacion', NULL );
        if ( $id_lista_verificacion == NULL ) return NULL;

        # Preparamos el tipo de consulta
        $sql =
        "SELECT id_actividad_verificar, ".
        "id_lista_verificacion, ".
        "id_sistema_aero, ".
        "id_equipo_aero, ".
        "actividad_verificar ".
        "FROM actividad_verificar ".
        "WHERE id_lista_verificacion = $id_lista_verificacion ".
        "AND id_equipo_aero = '$id_equipo_aero' ";

        switch ( $con_datos ) {
            case 'true':
                $sql .=
                "AND id_actividad_verificar IN( ".
                    "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                    "WHERE id_orden_trabajo = $id_orden_trabajo ".
                ")";
                break;

            default:
                $sql .=
                "AND id_actividad_verificar NOT IN( ".
                    "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                    "WHERE id_orden_trabajo = $id_orden_trabajo ".
                ")";
                break;
        }

        // return $sql;

        /* verificamos actividades con el campo id_equipo_aero nulo
         * (actividad perteneciente a todos los equipos del sistema)
         */

        $data_equipo_null = $this->__resolve_equipo_null( $id_equipo_aero );
        $data_equipo_null == null ?
            $data_equipo_null = array() : null;

        $mtz = $this->array_query( $sql );
        $mtz == null ?
            $mtz = array() : null;

        # combinamos ambas matrices

        $mtz = array_merge( $mtz, $data_equipo_null );
        if ( empty( $mtz ) ) return null;

        # complementamos datos de nuevos campos

        $arr = array();
        foreach ( $mtz as $actividad ) {
            $id_actividad_verificar = $actividad[ 'id_actividad_verificar' ];

            $actividad[ 'parametro_actividad' ] = $con_datos == 'true' ?
                $this->__parametroActividad( $id_actividad_verificar ):
                $this->__parametroActividad( $id_actividad_verificar );

            $actividad[ 'lectura_actual' ] = $con_datos == 'true' ?
                $this->__lecturaActual( $id_actividad_verificar, 'con_captura', $id_orden_trabajo ):
                $this->__lecturaActual( $id_actividad_verificar );

            $actividad[ 'lectura_posterior' ] = $con_datos == 'true' ?
                $this->__lecturaPosterior( $id_actividad_verificar, 'con_captura', $id_orden_trabajo ):
                $this->__lecturaPosterior( $id_actividad_verificar );

            # si se solicitan actividades con datos, retornamos el
            # campo de observaciones
            if ( $con_datos == 'true' )
                $actividad[ 'observaciones' ] = $this->__observaciones( $id_actividad_verificar, $id_orden_trabajo );

            $arr [] = $actividad;
        }

        return $arr;
    }

    private function __parametroActividad ( $id_actividad ) {
        $sql =
        "SELECT id_actividad, ".
        "id, ".
        "tipo_dato, ".
        "dato, ".
        "parametro, ".
        "secuencia_datos, ".
        "unidad_medida ".
        "FROM parametro_actividad ".
        "WHERE id_actividad = $id_actividad ".
        "ORDER BY secuencia_datos ASC";

        $arr = $this->array_query( $sql );
        return $arr;
    }

    private function __lecturaActual ( $id_actividad, $con_todo, $id_orden_trabajo ) {
        # buscamos el tipo de dato para realizar
        # consultas por filas de datos o por lotes completos
        $sql =
        "SELECT tipo_dato ".
        "FROM parametro_actividad ".
        "WHERE id_actividad = $id_actividad";
        $tipo_dato = $this->query( $sql, 'tipo_dato', NULL );

        $sql =
        "SELECT t_la.id_actividad, ".
        "t_la.tipo_dato, ".
        "t_la.parametro, ".
        "t_la.unidad_medida, ".
        "t_la.secuencia_datos, ".
        "t_la.id, ".
        "t_pa.tipo_dato AS tipo_validacion, ".
        "t_pa.dato AS dato_validacion ".
        "FROM lectura_actual t_la ".
        "LEFT JOIN parametro_actividad t_pa ".
        "ON t_la.id_actividad = t_pa.id_actividad ".
        "WHERE t_la.id_actividad = $id_actividad ";

        # si es un tipo de dato diferente a texto se verifica
        # la secuencia de datos para enlazar las filas de
        # datos correctmente
        if ( $tipo_dato != 'TEXTO' ) {
            $sql .= "AND t_la.secuencia_datos = t_pa.secuencia_datos ";
        }

        $sql .=
        "ORDER BY t_la.secuencia_datos ASC";

        // return $sql;

        $arr = $this->array_query( $sql );

        switch ( $con_todo ) {
            case ( $con_todo == 'con_captura' || $con_todo == 'barrido_validacion' ):
                $i = 0;
                foreach ( $arr as $lectura_actual ) {
                    $id = $lectura_actual[ 'id' ];
                    $sql =  "SELECT t_dla.dato, t_dla.prioridad ".
                            "FROM datos_lectura_actual t_dla ".
                            "INNER JOIN datos_actividad t_da ".
                            "ON t_dla.id_actividad = t_da.id_datos_actividad ".
                            "INNER JOIN orden_trabajo_actividad t_ota ".
                            "ON t_da.id_datos_actividad = t_ota.id_datos_actividad ".
                            "WHERE t_ota.id_actividad_verificar = $id_actividad ".
                            "AND t_ota.id_orden_trabajo = $id_orden_trabajo";
                    // return $sql;
                    $datos_lectura_actual = $this->array_query( $sql );

                    $arr[ $i ][ 'dato' ] = $datos_lectura_actual[ $i ][ 'dato' ];
                    $arr[ $i ][ 'prioridad' ] = $datos_lectura_actual[ $i ][ 'prioridad' ];
                    $i++;
                }

            case 'sin_captura':
                return $arr;
        }
    }

    private function __lecturaPosterior ( $id_actividad, $con_todo, $id_orden_trabajo ) {
        # buscamos el tipo de dato para realizar
        # consultas por filas de datos o por lotes completos
        $sql =
        "SELECT tipo_dato ".
        "FROM parametro_actividad ".
        "WHERE id_actividad = $id_actividad";
        $tipo_dato = $this->query( $sql, 'tipo_dato', NULL );

        $sql =
        "SELECT t_lp.id_actividad, ".
        "t_lp.tipo_dato, ".
        "t_lp.parametro, ".
        "t_lp.unidad_medida, ".
        "t_lp.secuencia_datos, ".
        "t_lp.id, ".
        "t_pa.tipo_dato AS tipo_validacion, ".
        "t_pa.dato AS dato_validacion ".
        "FROM lectura_posterior t_lp ".
        "LEFT JOIN parametro_actividad t_pa ".
        "ON t_lp.id_actividad = t_pa.id_actividad ".
        "WHERE t_lp.id_actividad = $id_actividad ";

        # si es un tipo de dato diferente a texto se verifica
        # la secuencia de datos para enlazar las filas de
        # datos correctmente
        if ( $tipo_dato != 'TEXTO' ) {
            $sql .= "AND t_lp.secuencia_datos = t_pa.secuencia_datos ";
        }

        $sql .=
        "ORDER BY t_lp.secuencia_datos ASC";

        $arr = $this->array_query( $sql );

        switch ( $con_todo )
        {
            case 'con_captura':
                $i = 0;
                foreach ( $arr as $lectura_post )
                {
                    $id = $lectura_post[ 'id' ];
                    $sql =  "SELECT t_dlp.dato, t_dlp.prioridad ".
                            "FROM datos_lectura_posterior t_dlp ".
                            "INNER JOIN datos_actividad t_da ".
                            "ON t_dlp.id_actividad = t_da.id_datos_actividad ".
                            "INNER JOIN orden_trabajo_actividad t_ota ".
                            "ON t_da.id_datos_actividad = t_ota.id_datos_actividad ".
                            "WHERE t_ota.id_actividad_verificar = $id_actividad ".
                            "AND t_ota.id_orden_trabajo = $id_orden_trabajo";
                    // return $sql;
                    $datos_lectura_post = $this->array_query( $sql );

                    $arr[ $i ][ 'dato' ] = $datos_lectura_post[ $i ][ 'dato' ];
                    $arr[ $i ][ 'prioridad' ] = $datos_lectura_post[ $i ][ 'prioridad' ];
                    $i++;
                }

            default: return $arr; break;
        }
    }

    private function __observaciones( $id_actividad_verificar, $id_orden_trabajo ) {
        $sql =
            "SELECT observaciones FROM datos_actividad ".
            "WHERE id_actividad = $id_actividad_verificar ".
            "AND id_datos_actividad IN ( ".
                "SELECT id_datos_actividad FROM orden_trabajo_actividad ".
                "WHERE id_orden_trabajo = $id_orden_trabajo ".
            ")";

        // return $sql;
        return $this->query( $sql, 'observaciones', -1 );
    }

    private function __resolve_equipo_null ( $id_equipo_aero, $conexion ) {
        $sql = "select id_sistema_aero from equipo_aero where id_equipo_aero = $id_equipo_aero";
        $query = $this->array_query( $sql, 'id_sistema_aero', null );
        $id_sistema_aero = $query[0];

        $sql = "select * from actividad_verificar where id_sistema_aero = '$id_sistema_aero' && ".
                "id_equipo_aero is null";

        // return $sql;

        $query = $this->array_query( $sql );

        return $query;
    }

    # insertarDatosListaVerificacion -----------------------

    public function insertarDatosListaVerificacion ( $data ) {
        $rsp = array();

        $validar =
            $this->verificaDatosNulos( $data, array(
                'id_orden_trabajo', 'datos_actividad'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        # insertamos la tabla [datos_lista_verificacion]
        $id_orden_trabajo = $this->__retorna_id_orden_trabajo_original( $data[ 'id_orden_trabajo' ] );
        $fecha = date( 'Y/m/d' );
        $hora = date( 'h:i:s' );
        $observaciones = '';
        $datos_actividad = $data[ 'datos_actividad' ];

        # registramos observaciones, fecha y hora de la insercion
        # de datos
        $sql =
        "INSERT INTO datos_lista_verificacion ".
        "VALUES( $id_orden_trabajo, '$fecha', '$hora', '$observaciones' )";
        $query = $this->insert_query( $sql );

        if ( $query !== 'OK' ) {
            $this->conexion->rollback();

            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar tabla: [datos_lista_verificacion]' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => $query );
            return $rsp;
        }

        # insertamos actividades
        $datos_actividad = $this->__insertar_datos_actividad( $id_orden_trabajo, $datos_actividad );
        if ( $datos_actividad === 'OK' ) {
            $this->conexion->commit();
            $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Datos guardados satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => 'Correcto' );
            return $rsp;
        }

        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al guardar los datos' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => $datos_actividad );
            return $rsp;
        }
    }

    private function __insertar_datos_actividad ( $id_orden_trabajo, $arr ) {
        $mtzError = array();

        foreach ( $arr as $actividad )
        {
            # datos de tabla [orden_trabajo_actividad]
            $id_actividad = $actividad[ 'id_actividad' ];

            # buscar si la actividad fue guardada previamente
            $flag = $this->verifica_actividad_insertada ( $id_orden_trabajo, $id_actividad );

            if ( $flag )
            {
                # datos de tabla [datos_actividad]
                $id_datos_actividad = $this->autoincrement( "select id_datos_actividad from datos_actividad order by id_datos_actividad asc", "id_datos_actividad", $conexion );
                $observaciones = $actividad[ 'observaciones' ][ 'valor' ];

                # datos de tablas [ datos_lectura_actual, datos_lectura_posterior ]
                $datos_lectura_actual = $actividad[ 'datos_lectura_actual' ];
                $datos_lectura_posterior = $actividad[ 'datos_lectura_posterior' ];

                /* verificamos el campo observaciones para condicionar
                 * la estructura de la consulta (activar la badera de prioridad)
                 */
                empty( $observaciones ) ?
                    $sql = "insert into datos_actividad( id_datos_actividad, id_actividad ) values( $id_datos_actividad, $id_actividad )":
                    $sql = "insert into datos_actividad( id_datos_actividad, id_actividad, prioridad, observaciones ) values( $id_datos_actividad, $id_actividad, 'U', '$observaciones' )";

                # insertamos la tabla [datos_actividad]
                $query = $this->insert_query( $sql );
                if ( $query !== 'OK' ) return $query.". Error al insertar la tabla [datos_actividad]";

                # insertamos la tabla [datos_lectura_actual]
                $lectura_actual = $this->__datos_lectura( $datos_lectura_actual, $id_datos_actividad, 'actual' );
                if ( $lectura_actual !== 'OK' ) return $lectura_actual.". Error al insertar la tabla [datos_lectura_actual]";

                # insertamos la tabla [datos_lectura_posterior]
                $lectura_posterior = $this->__datos_lectura( $datos_lectura_posterior, $id_datos_actividad, 'posterior' );
                if ( $lectura_posterior !== 'OK' ) return $lectura_posterior.". Error al insertar la tabla [datos_lectura_posterior]";

                # insertamos nuevo registro en tabla orden_trabajo_actividad
                $sql =  "INSERT INTO orden_trabajo_actividad(id_datos_actividad, ".
                        "id_actividad_verificar, id_orden_trabajo) ".
                        "VALUES ( $id_datos_actividad, $id_actividad, $id_orden_trabajo )";

                $query = $this->insert_query( $sql );
                if ( $query !== 'OK' ) return $query.". Error al insertar en tabla [orden_trabajo_actividad]";
            }

            else
            {
                $mtzError[] = $id_actividad;
            }
        }

        if( empty( $mtzError ) )
            return 'OK';
        else return sizeof( $mtzError )." de las ".sizeof( $arr )." actividades han sido capturadas previamente";
    }

    private function verifica_actividad_insertada ( $id_orden_trabajo, $id_actividad ) {
        $sql = "select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo and id_actividad_verificar = $id_actividad";
        $query = $this->array_query( $sql, 'id_actividad_verificar', null );

        if ( $query == null ) return true;
        else return false;
    }

    private function __datos_lectura( $arr, $id_actividad, $tipo_lectura ) {
        foreach ( $arr as $lectura )
        {
            $tipo_dato = $lectura[ 'tipo_dato' ];
            $id_lectura = $lectura[ 'id_lectura' ];

            $tipo_validacion = $lectura[ 'tipo_validacion' ];
            $dato_validacion = $lectura[ 'dato_validacion' ];
            $dato = $lectura[ 'dato' ][ 'valor' ];

            $prioridad =
                $this->__evaluacion_parametro( $tipo_validacion, $dato_validacion, $dato );


            // ---------- seleccionamos tipo de lectura

            switch ( $tipo_lectura )
            {
                /* verificamos el campo observaciones para condicionar
                 * la estructura de la consulta (activar la badera de prioridad)
                 */

                case 'actual':
                    $prioridad === true ?
                        $sql = "insert into datos_lectura_actual( id_actividad, dato, id_lectura ) values( $id_actividad, '$dato', $id_lectura )" :
                        $sql = "insert into datos_lectura_actual( id_actividad, dato, prioridad, id_lectura ) values( $id_actividad, '$dato', 'U', $id_lectura )";
                    break;

                case 'posterior':
                    $prioridad === true ?
                        $sql = "insert into datos_lectura_posterior( id_actividad, dato, id_lectura ) values( $id_actividad, '$dato', $id_lectura )" :
                        $sql = "insert into datos_lectura_posterior( id_actividad, dato, prioridad, id_lectura ) values( $id_actividad, '$dato', 'U', $id_lectura )";
                    break;

                default:
                    return "tabla invalida";
                    break;
            }

            // ---------- insertamos la tabla [datos_lectura_actual]

            $datos_lectura = $this->insert_query( $sql );
            if ( $datos_lectura !== 'OK' ) return $datos_lectura;
        }

        return 'OK';
    }

    private function __evaluacion_parametro ( $tipo_validacion, $dato_validacion, $dato ) {
        switch ( $tipo_validacion )
        {
            case 'BINARIO': return true; break;
            case 'TEXTO': return true; break;

            case 'COMPARACION':
                $dato_validacion = doubleval( $dato_validacion );
                $dato = doubleval( $dato );
                return $dato_validacion == $dato ?
                    true : false;
                break;

            case 'RANGO':
                $arr = explode( ',', $dato_validacion );
                $inf = doubleval( $arr[0] );
                $sup = doubleval( $arr[1] );
                return $this->beetwen( $dato, $inf, $sup );
                break;

            case 'TOLERANCIA':
                $arr = explode( ',', $dato_validacion );
                $target = doubleval( $arr[0] );
                $tol = doubleval( $arr[1] );
                $inf = $target - $tol;
                $sup = $target + $tol;
                return $this->beetwen( $dato, $inf, $sup );
                break;

            default:
                return true;
                break;
        }
    }

    public function reprogramacion_fecha_mtto () {
        return  $this->__reprogramacion_fecha();
    }

    # funcion publica para hacer pruebas
    public function test ( $get ) {
        return $this->dataUser;
    }

    #############################################################
    #############################################################
    ## SECCION DE FUNCIONES ADAPTADAS A DISPOSITIVO MOVIL
    #############################################################
    #############################################################

    public function obtenerOrdenTrabajoLista  ( $get ) {
        $get[ 'usuario' ] = $this->usuario;
        $data = $this->obtenerOrdenTrabajo( $get );
        $arr = array();

        # recorriendo ordenes de trabajo de los usuarios
        foreach ( $data as $ordenTrabajo ) {
            # obtener los sistemas
            $sistemas = $this->systems_into_mantto(array(
                    'id_orden_trabajo' => $ordenTrabajo[ 'id_orden_trabajo' ],
                    'id_mantenimiento' => $ordenTrabajo[ 'id_mantenimiento' ]
                ));

            # recorrer sistemas para obtener equipos
            $i = 0;
            foreach ( $sistemas as $sis ) {
                # obtener equipos
                $equipos = $this->equipo_into_systems_mantto(array(
                        'id_orden_trabajo' => $ordenTrabajo[ 'id_orden_trabajo' ],
                        'id_mantenimiento' => $ordenTrabajo[ 'id_mantenimiento' ],
                        'id_sistema_aero'  => $sis[ 'id_sistema_aero' ]
                    ));

                #recorrer equipos para obtener actividades
                $j = 0;
                foreach ( $equipos as $equi ) {
                    $actividades = $this->actividades_into_equipo(array(
                            'id_mantenimiento' => $ordenTrabajo[ 'id_mantenimiento' ],
                            'id_equipo_aero' => $equi[ 'id_equipo_aero' ],
                            'id_orden_trabajo' => $ordenTrabajo[ 'id_orden_trabajo' ]
                        ));

                    $equipos[ $j ][ 'data' ] = $actividades;
                    $j++;
                }

                $sistemas[ $i ][ 'data' ] = $equipos;
                $i++;
            }

            $arr[] = array(
                'id_orden_trabajo'       => $ordenTrabajo[ 'id_orden_trabajo' ],
                'id_prog_mtto'           => $ordenTrabajo[ 'id_prog_mtto' ],
                'id_mantenimiento'       => $ordenTrabajo[ 'id_mantenimiento' ],
                'nombre_mantenimiento'   => $ordenTrabajo[ 'nombre_mantenimiento' ],
                'trabajo_solicitado'     => $ordenTrabajo[ 'trabajo_solicitado' ],
                'orden_trabajo_personal' => $ordenTrabajo[ 'orden_trabajo_personal' ],
                'fecha_inicial'          => $ordenTrabajo[ 'fecha_inicial' ],
                'fecha_final'            => $ordenTrabajo[ 'fecha_final' ],
                'id_orden_reprog'        => $ordenTrabajo[ 'id_orden_reprog' ],
                'fecha_realizada'        => $ordenTrabajo[ 'fecha_realizada' ],
                'estado_asignado'        => $ordenTrabajo[ 'estado_asignado' ],                
                'data'                   => $sistemas
            );
        }

        return $arr;
    }
}