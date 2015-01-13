<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxMantenimiento extends funcionesPrimarias
{	
	public function __construct($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

    public function __destruct()
    {
        parent::__destruct();
    }

	public function solicitudAjax( $accion, $post, $get )
	{
		switch ( $accion)
		{
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

            // case 'obtenerOrdenTrabajoLista':
            //     $obtenerOrdenTrabajoLista = $this->obtenerOrdenTrabajoLista( $get );
            //     echo json_encode( $obtenerOrdenTrabajoLista );
            //     break;

            case 'obtenerOrdenesPorGenerador':
                $obtenerOrdenesPorGenerador = $this->obtenerOrdenesPorGenerador( $get );
                echo json_encode( $obtenerOrdenesPorGenerador );
                break;

            case 'obtenerVerificacionOrdenTrabajo':
                $obtenerVerificacionOrdenTrabajo = $this->obtenerVerificacionOrdenTrabajo( $get );
                echo json_encode( $obtenerVerificacionOrdenTrabajo );
                break;

            case 'systems_into_mantto':
                $query = $this->systems_into_mantto( $get );
                echo json_encode( $query );
                break; 

            case 'verifica_orden_trabajo':
                $query = $this->verifica_orden_trabajo( $get );
                echo json_encode( $query );
                break;

            default:
                echo json_encode('Funcion no registrada en la clase ajaxMantenimiento');
            break;
		}
	}

    // ---------- nuevaOrdenTrabajo ---------------------------------------------------------

    private $__datosOrdenTrabajo = array(
        'numero_unidad', 'numero_aero', 'id_mantenimiento', 'duracion', 'magnitud_duracion', 
        'fecha_inicial', 'trabajo_solicitado'
    );

    public function nuevaOrdenTrabajo ( $data ) 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        // echo var_dump( $_REQUEST );

        foreach ( $data[ 'ordenTrabajo' ] as $orden )
        {
            $flag = $this->verificaDatosNulos( $orden, $this->__datosOrdenTrabajo );
            if ( $flag ) 
            {
                $numero_unidad =  $orden[ 'numero_unidad' ][ 'valor' ];
                $numero_aero = $orden[ 'numero_aero' ][ 'valor' ];
                $id_mantenimiento = $orden[ 'id_mantenimiento' ][ 'valor' ];
                $duracion = $orden[ 'duracion'][ 'valor' ];
                $magnitud_duracion = $orden[ 'magnitud_duracion' ][ 'valor' ];
                $fecha_inicial = $orden[ 'fecha_inicial' ][ 'valor' ];     
                $trabajo_solicitado = $orden[ 'trabajo_solicitado' ][ 'valor' ];                
                $numeroOrden = $numero_unidad . $numero_aero . $id_mantenimiento;

                // ----------------------------------------------------------------------------------------

                $id_orden_trabajo = $this->autoincrement( "select id_orden_trabajo from orden_trabajo order by id_orden_trabajo asc", 'id_orden_trabajo', $this->conexion );

                $sql =  "insert into orden_trabajo(id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, fecha_programada, trabajo_solicitado) ".
                        "values( $id_orden_trabajo ,'$numeroOrden', '$numero_aero', '$id_mantenimiento', $duracion, '$magnitud_duracion', STR_TO_DATE( '$fecha_inicial', '%d-%m-%Y' ), '$trabajo_solicitado')";
                // return $sql; 
                         
                // ---------- insertamos la orden de trabajo

                $ordenTrabajo = $this->consultaInsercionSimple( $sql, $this->conexion );
                if ( $ordenTrabajo == 'OK' ) 
                {
                    // ---------- insertamos las listas de verificacion agragadas

                    // $ordenLista = $this->__insertaOrdenTrabajoLista( $id_orden_trabajo, $id_mantenimiento, $this->conexion );
                    // if( $ordenLista !== 'OK' )
                    // {
                    //     $this->conexion->rollback();
                    //     return $ordenLista;
                    // }
                } 
                else 
                {
                    $this->conexion->rollback();
                    return $ordenTrabajo.'. Error al insertar orden de trabajo';
                }
            } 
            else return 'NA';
        }

        $this->conexion->commit();
        return 'OK';    
    }

    private function __cambiarEstadoGenerador ( $gen, $conexion )
    {
        $sql = "update aeros set estado_licencia = 'MTTO' where numero_aero = '$gen'";
        $change_state = $this->consultaInsercionSimple( $sql, $conexion );
        return $change_state;        
    }

    // ---------- asignarUsuariosOrdenTrabajo -----------------------------------------------

    private $__datosUsuarioOrden = array( 'supervisor', 'responsable', 'id_orden_trabajo' );

    public function asignarUsuariosOrdenTrabajo ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $flag = $this->verificaDatosNulos( $data, $this->__datosUsuarioOrden );
        $conexion = $this->conexion;

        if ( $flag ) 
        {
            $id_orden_trabajo = $data[ 'id_orden_trabajo' ][ 'valor' ];
            $supervisor = $data[ 'supervisor' ][ 'valor' ];
            $responsable = $data[ 'responsable' ][ 'valor' ]; 
            $auxiliar = $data[ 'auxiliar' ];

            $query = $this->__insertaUsuarioSupervisor( $id_orden_trabajo, $supervisor, $conexion );
            if ( $query != 'OK' ) 
            {
                $conexion->rollback();
                return $query.". Error al insertar usuario supervisor";
            }

            $query = $this->__insertaUsuarioResponsable( $id_orden_trabajo, $responsable, $conexion );
            if ( $query != 'OK' ) 
            {
                $conexion->rollback();
                return $query.". Error al insertar usuario responsable";
            }

            if ( !empty( $auxiliar ) ) 
            {
                $query = $this->__insertaUsuarioAuxiliar( $id_orden_trabajo, $auxiliar, $conexion );
                if ( $query != 'OK' ) 
                {
                    $conexion->rollback();
                    return $query.". Error al insertar auxiliar responsable";
                }
            }

            $sql = "update orden_trabajo set estado_asignado = true where id_orden_trabajo = $id_orden_trabajo";
            $query = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $query != 'OK' ) 
            {
                $conexion->rollback();
                return $query.". Error al activar orden de trabajo";                
            }

            $conexion->commit();
            return 'OK';
        }

        else return 'NA';
    }

    private function __insertaUsuarioResponsable ( $id_orden_trabajo, $usuario, $conexion )
    {
        // ---------- verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'RESPONSABLE'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );

        if ( $query == null )
        {
            $sql = "insert into orden_trabajo_personal values( $id_orden_trabajo, '$usuario', 'RESPONSABLE' )";
            // return $sql;
            $query = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $query !== 'OK' ) return $query.'. Error al insertar usuario responsable';
            else return $query;
        }

        else return "Usuario responsable asignado previamente";
    }

    private function __insertaUsuarioSupervisor ( $id_orden_trabajo, $usuario, $conexion )
    {
        // ---------- verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'SUPERVISOR'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );

        if ( $query == null )
        {
            $sql = "insert into orden_trabajo_personal values( $id_orden_trabajo, '$usuario', 'SUPERVISOR' )";
            // return $sql;
            $query = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $query !== 'OK' ) return $query.'. Error al insertar usuario supervisor';
                else return $query;
        }

        else return "Usuario supervisor asignado previamente";
    }

    private function __insertaUsuarioAuxiliar ( $id_orden_trabajo, $arr, $conexion )
    {
        // ---------- verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'AUXILIAR'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );

        if ( $query == null )
        {
            foreach ( $arr as $user )
            {
                $sql = "insert into orden_trabajo_personal values( $id_orden_trabajo, '$user', 'AUXILIAR' )";
                // return $sql;
                $query = $this->consultaInsercionSimple( $sql, $conexion );
                if ( $query !== 'OK' ) return $query.'. Error al insertar usuario auxiliar';                
            }

            return 'OK';
        }

        else return "Usuario auxiliar asignado previamente";
    }

    // --------------------------------------------------------------------------------------

    public function obtenerDatosGraficaMantenimiento () 
    {
        $objetoRetorno = array();
        
        // ------------------------ consultando numero de unidades
        $SQL_matrizUnidades = 
        "select numero_unidad from unidad_aero where numero_unidad in (
            select numero_unidad from aeros where numero_aero in (
                select id_aero from orden_trabajo where numero_orden is not null
            )
        )";
        $matrizUnidades = $this->consultaSimpleArrayNumerico( $SQL_matrizUnidades, 'numero_unidad', $this->conexion, null );
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
                $matrizAeros = $this->consultaSimpleArrayNumerico( $SQL_matrizAeros, 'numero_aero', $this->conexion, null );

                // ------------------------ recorriendo matriz de aeros
                $indexAero = 0;
                foreach ($matrizAeros as $aero) {                        
                    $objetoRetorno[$indexUnidad]['matrizAeros'][$indexAero]['numeroAero'] = $aero;

                    // ------------------------ consultando tipos de mantenimientos existentes por aero dentro de las ordenes 
                    $SQL_matrizTipoMantto = 
                    "select id_mantenimiento, nombre_mantenimiento, numero_frecuencia, tipo_frecuencia from tipo_mantenimiento where id_mantenimiento in(
                        select id_mantenimiento from orden_trabajo where id_aero = '$aero'
                    )";
                    $matrizTipoMantto = $this->consultaSimpleArrayNumericoMultiple($SQL_matrizTipoMantto, $this->conexion);

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
                        $matrizDatosOrden = $this->consultaSimpleArrayNumericoMultiple( $SQL_datosOrden, $this->conexion );

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

    // ---------- obtenerOrdenTrabajo -------------------------------------------------------

    public function obtenerOrdenTrabajo ( $get )   
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        if ( !empty( $get[ 'numero_unidad' ] ) ) $tipo_query = 'numero_unidad';
        else if ( !empty( $get[ 'numero_aero' ] ) ) $tipo_query = 'numero_aero';
        else if ( !empty( $get[ 'usuario' ] ) ) $tipo_query = 'usuario';
        else $tipo_query = 'default';

        switch ( $tipo_query ) 
        {
            case 'numero_unidad': // devuelve todas las ordenes de trabajo por unidad de generador
                $numero_unidad = $get[ 'numero_unidad' ];
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where estado_asignado = true and fecha_realizada is null and id_aero in( ".
                        "select numero_aero from aeros where numero_unidad = '$numero_unidad'".
                    " ) group by numero_orden order by fecha_programada asc";
                break;

            case 'numero_aero': // devuelve todas las ordenes de trabajo por generador
                $numero_aero = $get[ 'numero_aero' ];
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where estado_asignado = true and fecha_realizada is null && id_aero = '$numero_aero' order by fecha_programada asc";
                break;

            case 'usuario': // devuelve todas las ordenes de trabajo por usuario
                $usuario = $get[ 'usuario' ];
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where estado_asignado = true and fecha_realizada is null and id_orden_trabajo in( ".
                        "select id_orden_trabajo from  orden_trabajo_personal where usuario = '$usuario' && tipo_usuario = 'RESPONSABLE'".
                    " ) order by fecha_programada asc";
                break;
            
            default: // devuelve todas las ordenes de trabajo no realizadas
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where fecha_realizada is null group by numero_orden order by fecha_programada asc";
                break;
        }

        // return $sql;
        
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr = array();
        // $temp = $this->multi_array_unique( $query, 'numero_orden' ); // filtramos las ordenes

        foreach ( $query as $orden ) // añadimos campos
        {
            $id_mantenimiento = $orden[ 'id_mantenimiento' ];
            $sql = "select nombre_mantenimiento from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $nombre_mantenimiento = $this->consultaSimpleArrayNumerico( $sql, 'nombre_mantenimiento', $this->conexion, null );
            $orden[ 'nombre_mantenimiento' ] = $nombre_mantenimiento[0];

            $id_orden_trabajo = $orden[ 'id_orden_trabajo' ];
            $orden[ 'orden_trabajo_personal' ] = $this->__orden_trabajo_personal( $id_orden_trabajo, $conexion );

            $arr[] = $orden;
        }

        return $arr;
    }

    private function __orden_trabajo_personal( $id_orden_trabajo, $conexion )
    {
        // ---------- buscar supervisor

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'SUPERVISOR' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );
        $arr[ 'supervisor' ] = $query[ 0 ];

        // ---------- buscar responsable

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'RESPONSABLE' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );
        $arr[ 'responsable' ] = $query[ 0 ];

        // ---------- buscar auxiliar

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'AUXILIAR' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'usuario', $conexion, null );
        $arr[ 'auxiliar' ] = $query;

        return $arr;
    }

    /* ---------- verifica_orden_trabajo ----------------------------
     * verifica la existencia de una orden de trabajo "No realizada" para los campos
     * [numero_generador, numero_unidad]
     * retorna los generadores sin una orden de trabajo planificada
     */ 
    public function verifica_orden_trabajo ( $get )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        if ( !empty( $get[ 'numero_unidad' ] ) ) $tipo_query = 'numero_unidad';
        else if ( !empty( $get[ 'numero_aero' ] ) ) $tipo_query = 'numero_aero';
        else return null;

        $arr = array();

        switch ( $tipo_query ) 
        {
            case 'numero_unidad': // devuelve todos los generadores que no tienen un programa de mantenimiento dentro una unidad
                $numero_unidad = $get[ 'numero_unidad' ];
                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_unidad = '$numero_unidad' && orden_trabajo.id_aero is null";

                $arr[ 'no_valido' ] = $this->consultaSimpleArrayNumerico( $sql, 'numero_aero', $conexion, null );

                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_unidad = '$numero_unidad' && aeros.numero_aero = orden_trabajo.id_aero order by orden_trabajo.id_aero asc";

                $arr[ 'valido' ] = $this->consultaSimpleArrayNumerico( $sql, 'numero_aero', $conexion, null );
                break;

            case 'numero_aero': // devuelve todos los generadores que no tienen un programa de mantenimiento
                $numero_aero = $get[ 'numero_aero' ];
                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_aero = '$numero_aero' && orden_trabajo.id_aero is null";

                $arr[ 'no_valido' ] = $this->consultaSimpleArrayNumerico( $sql, 'numero_aero', $conexion, null );

                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_aero = '$numero_aero' && orden_trabajo.id_aero = aeros.numero_aero";

                $arr[ 'valido' ] = $this->consultaSimpleArrayNumerico( $sql, 'numero_aero', $conexion, null );
                break;
            
            default:
                return null;
                break;
        }

        return $arr;
    }

    // ---------- obtenerOrdenesPorGenerador ------------------------------------------------

    public function obtenerOrdenesPorGenerador( $data )
    {
        $gen = $data[ 'Generador' ];

        if ( !empty( $gen ) ) 
        {            
            $IDS = $this->__getMatrizIdMantto( $gen, $this->conexion );
            // return $IDS;

            if ( $IDS != null )
            {
                // ---------- creamos el arreglo de retorno

                $datos = array();

                foreach ( $IDS as $id ) 
                {
                    $sql = "select fecha_programada from orden_trabajo where id_aero = '$gen' and id_mantenimiento = '$id' order by fecha_programada desc";
                    $array = $this->consultaSimpleArrayNumerico( $sql, 'fecha_programada', $this->conexion, null );
                    
                    if ( $array != null ) 
                    {
                        $datos[] = array( 'id_mantenimiento' => $id, 'fecha_programada' => $array[0] );
                    }
                }

                return $datos;             
            }
            else return $IDS;
        } 
        else return 'NA';
    }

    private function __getMatrizIdMantto( $gen, $conexion )
    {
        $sql = "select id_mantenimiento from orden_trabajo where id_aero = '$gen' order by id_mantenimiento asc";
        
        $matrizIDS = $this->consultaSimpleArrayNumerico( $sql, 'id_mantenimiento', $conexion, null );

        if ( $matrizIDS != null ) 
        {
            $IDS = array_unique( $matrizIDS );
            return $this->array_numerico( $IDS );
        }
        
        else return $matrizIDS;
    }

    // ---------- actividadesOrdenTrabajo -----------------------------------------------

    public function actividadesOrdenTrabajo ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $id_orden_trabajo = $data[ 'id_orden_trabajo' ];

        if ( !empty( $id_orden_trabajo ) )
        {
            $data = $this->__datos_por_ordenTrabajo( $id_orden_trabajo, $conexion );
            // return $data;

            return $this->__actividad_verificar( $data[ 'id_mantenimiento' ], $conexion );
        }

        return null;
    }

    private function __datos_por_ordenTrabajo( $id_orden_trabajo, $conexion )
    {
        $sql = "select id_mantenimiento, id_aero from orden_trabajo where id_orden_trabajo = $id_orden_trabajo";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        
        $arr = array(
            'id_mantenimiento' => $query[ 0 ][ 'id_mantenimiento' ],
            'id_aero' => $query[ 0 ][ 'id_aero' ]
        );

        return $arr;

        // ---------- buscamos todos los sistemas de las actividades que estan en el tipo de manteminiemto

        // $sql =  "select id_sistema_aero from actividad_verificar where id_mantenimiento = '$id_mantenimiento' ".
        //         "order by id_mantenimiento asc";
        // $query = $this->consultaSimpleArrayNumerico( $sql, 'id_sistema_aero', $conexion, null );

        // $sistema = array_unique( $query );

        // return $sistema;
    }

    private function __actividad_verificar ( $id_mantenimiento, $conexion )
    {
        $sql = "select * from actividad_verificar where id_mantenimiento = '$id_mantenimiento' && id_actividad_verificar not in( ".
                    "select id_actividad_verificar from orden_trabajo_actividad )";    

        $data = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr = array();

        foreach ( $data as $act ) 
        {
            // ---------- consultamos nombre del sistema

            $id_sistema_aero = $act[ 'id_sistema_aero' ];
            $sql = "select nombre_sistema_aero from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->consultaSimpleArrayNumerico( $sql, 'nombre_sistema_aero', $conexion, null );
            $act[ 'nombre_sistema_aero' ] = $query[ 0 ];

            // ---------- consultamos nombre del equipo

            $id_equipo_aero = $act[ 'id_equipo_aero' ];
            $sql = "select nombre_equipo_aero from equipo_aero where id_equipo_aero = '$id_equipo_aero'";
            $query = $this->consultaSimpleArrayNumerico( $sql, 'nombre_equipo_aero', $conexion, null );
            $act[ 'nombre_equipo_aero' ] = $query[ 0 ];

            // ---------- consultamos tablas internas de la actividad

            $id_actividad_verificar = $act[ 'id_actividad_verificar' ];

            $act[ 'parametro_actividad' ] = $this->__parametroActividad( $id_actividad_verificar, $conexion, $con_todo );
            $act[ 'lectura_actual' ] = $this->__lecturaActual( $id_actividad_verificar, $conexion, $con_todo );
            $act[ 'lectura_posterior' ] = $this->__lecturaPosterior( $id_actividad_verificar, $conexion, $con_todo );

            $arr[] = $act;
        }

        return $arr;       
    }

    private function __parametroActividad ( $id_actividad, $conexion, $con_todo )
    {
        $sql = "select * from parametro_actividad where id_actividad = $id_actividad order by secuencia_datos asc";
        $matrizParametros = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        return $matrizParametros;
    }

    private function __lecturaActual ( $idActividad, $conexion, $con_todo )
    {
        $sql = "select * from lectura_actual where id_actividad = $idActividad order by secuencia_datos asc";
        $matrizLecActual = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

        switch ( $con_todo ) 
        {
            case ( $con_todo == 'con_captura' || $con_todo == 'barrido_validacion' ):
                $i = 0;
                foreach ( $matrizLecActual as $lectura_actual ) 
                {
                    $id = $lectura_actual[ 'id' ];
                    $sql = "select dato, prioridad from datos_lectura_actual where id_lectura = $id";
                    $datos_lectura_actual = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

                    $matrizLecActual[ $i ][ 'dato' ] = $datos_lectura_actual[ 0 ][ 'dato' ];
                    $matrizLecActual[ $i ][ 'prioridad' ] = $datos_lectura_actual[ 0 ][ 'prioridad' ];
                    $i++;
                }

            case 'sin_captura':
                return $matrizLecActual;
        }
    }

    private function __lecturaPosterior ( $idActividad, $conexion, $con_todo )
    {
        $sql = "select * from lectura_posterior where id_actividad = $idActividad order by secuencia_datos asc";
        $matrizLecPost = $this->consultaSimpleArrayNumericoMultiple( $sql, $this->conexion );

        switch ( $con_todo ) 
        {
            case ( $con_todo == 'con_captura' || $con_todo == 'barrido_validacion' ):
                $i = 0;
                foreach ( $matrizLecPost as $lectura_post ) 
                {
                    $id = $lectura_post[ 'id' ];
                    $sql = "select dato, prioridad from datos_lectura_posterior where id_lectura = $id";
                    $datos_lectura_post = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

                    $matrizLecPost[ $i ][ 'dato' ] = $datos_lectura_post[ 0 ][ 'dato' ];
                    $matrizLecPost[ $i ][ 'prioridad' ] = $datos_lectura_post[ 0 ][ 'prioridad' ];
                    $i++;
                }

            case 'sin_captura':
                return $matrizLecPost;
        }
    }

    // ----------------------------------------------------------------------------------

    public function systems_into_mantto( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $id_mantenimiento = $data[ 'id_mantenimiento' ];
        $id_orden_trabajo = $data[ 'id_orden_trabajo' ];

        if ( !empty( $id_mantenimiento ) ) 
        {
            $sql = "select DISTINCT id_sistema_aero from actividad_verificar where id_mantenimiento = ".
                    "'$id_mantenimiento' && id_actividad_verificar not in ( select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo )";

            $query = $this->consultaSimpleArrayNumerico( $sql, 'id_sistema_aero', $conexion, null );
            if ( $query == null ) return null;
            
            $mtz = array_unique( $query );
            $arr = array(); // matriz de retorno

            foreach ( $mtz as $id_sistema_aero ) 
            {
                $sql = "select * from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
                $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
                $arr[] = $query[ 0 ];
            }

            return $arr;
        }

        return null;
    }

    // ----------------------------------------------------------------------------------

    private $campo_validacion_equipo_system = array( 'id_mantenimiento', 'id_sistema_aero' );

    public function equipo_into_systems_mantto ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $flag = $this->verificaDatosNulos( $data, $this->campo_validacion_equipo_system );

        if ( $flag ) 
        {
            $id_mantenimiento = $data[ 'id_mantenimiento' ];
            $id_sistema_aero = $data[ 'id_sistema_aero' ];
            $id_orden_trabajo = $data[ 'id_orden_trabajo' ];

            // ---------- buscamos sistemas con equipos

            // $sql =  "select DISTINCT id_equipo_aero from actividad_verificar where id_mantenimiento = '$id_mantenimiento' ".
            //         "&& id_sistema_aero = '$id_sistema_aero' && id_equipo_aero is not null";

            $sql =
                "select DISTINCT id_equipo_aero from actividad_verificar where id_mantenimiento = '$id_mantenimiento' ".
                "&& id_sistema_aero = '$id_sistema_aero' && id_actividad_verificar not in ( select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo )";

            $query = $this->consultaSimpleArrayNumerico( $sql, 'id_equipo_aero', $conexion, null );
            // $equipos = array_unique( $query );
            $arr = array(); // matriz de retorno           

            foreach ( $query as $equ ) 
            {
                $sql = "select * from equipo_aero where id_equipo_aero = '$equ'";
                $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
                $arr [ ] = $query[ 0 ];
            }

            return !empty( $arr ) ?
                $arr : null;
        }

        return null;
    }

    // ----------------------------------------------------------------------------------

    private $campo_validacion_actividades = array( 'id_mantenimiento', 'id_equipo_aero' );

    public function actividades_into_equipo ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        $flag = $this->verificaDatosNulos( $data, $this->campo_validacion_actividades );

        if ( $flag )
        {
            $id_mantenimiento = $data[ 'id_mantenimiento' ];
            $id_equipo_aero = $data[ 'id_equipo_aero' ];
            $id_orden_trabajo = $data[ 'id_orden_trabajo' ];

            return $this->__actividad_verificar_equipo( $id_mantenimiento, $id_equipo_aero, $id_orden_trabajo, $conexion );
        }
    }

    private function __actividad_verificar_equipo ( $id_mantenimiento, $id_equipo_aero, $id_orden_trabajo, $conexion )
    {
        /*
         * verificamos actividades con el campo id_equipo_aero nulo (actividad perteneciente a
         * todos los equipos del sistema
         */ 

        $data_equipo_null = $this->__resolve_equipo_null( $id_equipo_aero, $conexion );
        $data_equipo_null == null ?
            $data_equipo_null = array() : null;

        $sql = "select * from actividad_verificar where id_mantenimiento = '$id_mantenimiento' && ".
                "id_equipo_aero = '$id_equipo_aero' && id_actividad_verificar not in(".
                    "select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo )";

        // return $sql;

        $data = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $data == null ?
            $data = array() : null;

        // ---------- combinamos ambas matrices

        $data = array_merge( $data, $data_equipo_null );
        if ( empty( $data ) ) return null;

        // ---------- complementamos datos de nuevos campos

        $arr = array();
        foreach ( $data as $actividad )
        {
            $id_actividad_verificar = $actividad[ 'id_actividad_verificar' ];

            $actividad[ 'parametro_actividad' ] = $this->__parametroActividad( $id_actividad_verificar, $conexion, 'sin_captura' );
            $actividad[ 'lectura_actual' ] = $this->__lecturaActual( $id_actividad_verificar, $conexion, 'sin_captura' );
            $actividad[ 'lectura_posterior' ] = $this->__lecturaPosterior( $id_actividad_verificar, $conexion, 'sin_captura' );

            $arr [] = $actividad;
        }

        return $arr;
    }

    private function __resolve_equipo_null ( $id_equipo_aero, $conexion )
    {
        $sql = "select id_sistema_aero from equipo_aero where id_equipo_aero = $id_equipo_aero";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'id_sistema_aero', $conexion, null );
        $id_sistema_aero = $query[0];

        $sql = "select * from actividad_verificar where id_sistema_aero = '$id_sistema_aero' && ".
                "id_equipo_aero is null";

        // return $sql;

        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

        return $query;
    }

    // ---------- insertarDatosListaVerificacion ----------------------------------------------------------------------------

    public function insertarDatosListaVerificacion ( $data )
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";
        $conexion = $this->conexion;

        if ( !empty( $data ) )
        {
            // ---------- insertamos la tabla [datos_lista_verificacion]

            $id_orden_trabajo = $data[ 'id_orden_trabajo' ];
            $fecha = date( 'Y/m/d' );
            $hora = date( 'h:i:s' );
            $observaciones = '';
            $datos_actividad = $data[ 'datos_actividad' ];         
            
            $sql = "insert into datos_lista_verificacion values( $id_orden_trabajo, '$fecha', '$hora', '$observaciones' )";
            $query = $this->consultaInsercionSimple( $sql, $conexion );

            if ( $query !== 'OK' ) 
            {
                $conexion->rollback();
                return $query.". Error al insertar tabla: [datos_lista_verificacion]";
            }

            // ---------- insertamos actividades

            $datos_actividad = $this->__insertar_datos_actividad( $id_orden_trabajo, $datos_actividad, $conexion );
            if ( $datos_actividad === 'OK' )
            {
                $conexion->commit();
                return 'OK';                
            }

            else 
            {
                $conexion->rollback();
                return $datos_actividad;
            }


        }
        else return 'NA';
    }

    private function __insertar_datos_actividad ( $id_orden_trabajo, $arr, $conexion )
    {
        $mtzError = array();

        foreach ( $arr as $actividad ) 
        {
            // ---------- datos de tabla [orden_trabajo_actividad] 
            
            $id_actividad = $actividad[ 'id_actividad' ];

            // ---------- buscar si la actividad fue guardada previamente

            $flag = $this->verifica_actividad_insertada ( $id_orden_trabajo, $id_actividad, $conexion );
            // return $flag;

            if ( $flag ) 
            {
               // ---------- datos de tabla [datos_actividad] 

                $id_datos_actividad = $this->autoincrement( "select id_datos_actividad from datos_actividad order by id_datos_actividad asc", "id_datos_actividad", $conexion );
                $observaciones = $actividad[ 'observaciones' ][ 'valor' ];            

                // ---------- datos de tablas [ datos_lectura_actual, datos_lectura_posterior ]

                $datos_lectura_actual = $actividad[ 'datos_lectura_actual' ];
                $datos_lectura_posterior = $actividad[ 'datos_lectura_posterior' ];
            
                /*
                 * verificamos el campo observaciones para condicionar
                 * la estructura de la consulta (activar la badera de prioridad)
                 */

                empty( $observaciones ) ?
                    $sql = "insert into datos_actividad( id_datos_actividad, id_actividad ) values( $id_datos_actividad, $id_actividad )":
                    $sql = "insert into datos_actividad( id_datos_actividad, id_actividad, prioridad, observaciones ) values( $id_datos_actividad, $id_actividad, 'U', '$observaciones' )";

                // ---------- insertamos la tabla [datos_actividad]

                $query = $this->consultaInsercionSimple( $sql, $conexion );
                if ( $query !== 'OK' ) return $query.". Error al insertar la tabla [datos_actividad]";

                // ---------- insertamos la tabla [datos_lectura_actual]

                $lectura_actual = $this->__datos_lectura( $datos_lectura_actual, $id_datos_actividad, 'actual', $conexion );
                if ( $lectura_actual !== 'OK' ) return $lectura_actual.". Error al insertar la tabla [datos_lectura_actual]";

                // ---------- insertamos la tabla [datos_lectura_posterior]

                $lectura_posterior = $this->__datos_lectura( $datos_lectura_posterior, $id_datos_actividad, 'posterior', $conexion );
                if ( $lectura_posterior !== 'OK' ) return $lectura_posterior.". Error al insertar la tabla [datos_lectura_posterior]";

                // ---------- insertamos nuevo registro en tabla orden_trabajo_actividad            

                $sql = "insert into orden_trabajo_actividad values ( $id_datos_actividad, $id_actividad, $id_orden_trabajo )";
                $query = $this->consultaInsercionSimple( $sql, $conexion ); 
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

    private function verifica_actividad_insertada ( $id_orden_trabajo, $id_actividad, $conexion )
    {
        $sql = "select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo and id_actividad_verificar = $id_actividad";
        $query = $this->consultaSimpleArrayNumerico( $sql, 'id_actividad_verificar', $conexion, null );

        if ( $query == null ) return true;
        else return false;
    }

    private function __datos_lectura( $arr, $id_actividad, $tipo_lectura, $conexion )
    {
        foreach ( $arr as $lectura ) 
        {
            $tipo_dato = $lectura[ 'tipo_dato' ];
            $id_lectura = $lectura[ 'id_lectura' ];

            $dato = $lectura[ 'dato' ][ 'valor' ];
            $prioridad = $lectura[ 'dato' ][ 'prioridad' ];


            // ---------- seleccionamos tipo de lectura

            switch ( $tipo_lectura ) 
            {
                /*
                 * verificamos el campo observaciones para condicionar
                 * la estructura de la consulta (activar la badera de prioridad)
                 */

                case 'actual':
                    empty( $prioridad ) ?
                        $sql = "insert into datos_lectura_actual( id_actividad, dato, id_lectura ) values( $id_actividad, '$dato', $id_lectura )" :
                        $sql = "insert into datos_lectura_actual( id_actividad, dato, prioridad, id_lectura ) values( $id_actividad, '$dato', 'U', $id_lectura )";
                    break;

                case 'posterior':
                    empty( $prioridad ) ?
                        $sql = "insert into datos_lectura_posterior( id_actividad, dato, id_lectura ) values( $id_actividad, '$dato', $id_lectura )" :
                        $sql = "insert into datos_lectura_posterior( id_actividad, dato, prioridad, id_lectura ) values( $id_actividad, '$dato', 'U', $id_lectura )";
                    break;
                
                default:
                    return "tabla invalida";
                    break;
            }

            // ---------- insertamos la tabla [datos_lectura_actual]
            
            $datos_lectura = $this->consultaInsercionSimple( $sql, $conexion );
            if ( $datos_lectura !== 'OK' ) return $datos_lectura;
        }

        return 'OK';
    }
}


$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxMantenimiento($host , $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion ) 
    $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( "Acceso no autorizado" );
?>