<?php
require 'sigesop.class.php';

class mantenimiento extends sigesop
{	
	public function __construct( $usuario, $clave )
	{
		parent::sigesop( $usuario, $clave );
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
                echo json_encode('Funcion no registrada en la clase mantenimiento');
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
        $i = 1;
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

                $estado_asignado = $i == 1 ? 1 : 0;

                // ----------------------------------------------------------------------------------------

                $id_orden_trabajo = $this->autoincrement( "select id_orden_trabajo from orden_trabajo order by id_orden_trabajo asc", 'id_orden_trabajo', $this->conexion );

                $sql =  "insert into orden_trabajo(id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, fecha_programada, trabajo_solicitado, estado_asignado) ".
                        "values( $id_orden_trabajo ,'$numeroOrden', '$numero_aero', '$id_mantenimiento', $duracion, '$magnitud_duracion', STR_TO_DATE( '$fecha_inicial', '%d-%m-%Y' ), '$trabajo_solicitado', $estado_asignado)";
                // return $sql; 
                         
                // ---------- insertamos la orden de trabajo

                $ordenTrabajo = $this->insert_query( $sql );
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

                $i++;
            } 
            else return 'NA';
        }

        $this->conexion->commit();
        return 'OK';    
    }

    # asignarUsuariosOrdenTrabajo -----------------------

    public function asignarUsuariosOrdenTrabajo ( $data )
    {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion ) 
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar = $this->verificaDatosNulos( $data, array( 
            'supervisor', 'responsable', 'id_orden_trabajo', 'auxiliar'
        ));
      
        if ( $validar === 'OK' ) 
        {
            $id_orden_trabajo = $data[ 'id_orden_trabajo' ][ 'valor' ];
            $supervisor = $data[ 'supervisor' ][ 'valor' ];
            $responsable = $data[ 'responsable' ][ 'valor' ]; 
            $auxiliar = $data[ 'auxiliar' ];
            $conexion = $this->conexion;

            $query = $this->__insertaUsuarioSupervisor( $id_orden_trabajo, $supervisor, $conexion );
            if ( $query != 'OK' )
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario supervisor' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $supervisor, 'key' => 'supervisor', 'msj' => $query );
                return $rsp;
            }

            $query = $this->__insertaUsuarioResponsable( $id_orden_trabajo, $responsable );
            if ( $query != 'OK' ) 
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar usuario responsable' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $responsable, 'key' => 'responsable', 'msj' => $query );
                return $rsp;
            }

            $query = $this->__insertaUsuarioAuxiliar( $id_orden_trabajo, $auxiliar );
            if ( $query != 'OK' ) 
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar auxiliar responsable' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => 'auxiliar', 'msj' => $query );
                return $rsp;
            } 

            $sql =  "update. orden_trabajo set estado_asignado = true ".
                    "where id_orden_trabajo = $id_orden_trabajo";
            $query = $this->insert_query( $sql );
            if ( $query === 'OK' ) 
            {
                $conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Usuarios agregados satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => 'status', 'msj' => 'Correcto' );
                return $rsp;
            }
            else
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al activar orden de trabajo' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => 'orden de trabajo', 'msj' => $query );
            }

            
            return $rsp;
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp; 
    }

    private function __insertaUsuarioResponsable ( $id_orden_trabajo, $usuario )
    {
        // ---------- verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'RESPONSABLE'";
        $query = $this->array_query( $sql, 'usuario', null );

        if ( $query == null )
        {
            $sql =  "insert into orden_trabajo_personal values".
                    "( $id_orden_trabajo, '$usuario', 'RESPONSABLE' )";
            // return $sql;
            $query = $this->insert_query( $sql );
            if ( $query !== 'OK' ) return $query.'. Error al insertar usuario responsable';
            else return $query;
        }

        else return "Usuario responsable asignado previamente";
    }

    private function __insertaUsuarioSupervisor ( $id_orden_trabajo, $usuario )
    {
        # verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'SUPERVISOR'";
        $query = $this->array_query( $sql, 'usuario', null );

        if ( $query == null )
        {
            $sql =  "insert into orden_trabajo_personal values".
                    "( $id_orden_trabajo, '$usuario', 'SUPERVISOR' )";
            $query = $this->insert_query( $sql );
            return $query;
        }

        else return "Usuario supervisor asignado previamente";
    }

    private function __insertaUsuarioAuxiliar ( $id_orden_trabajo, $arr )
    {
        # verificamos que no existan usuarios previamente insertados

        $sql = "select usuario from orden_trabajo_personal where id_orden_trabajo = '$id_orden_trabajo' and tipo_usuario = 'AUXILIAR'";
        $query = $this->array_query( $sql, 'usuario', null ); 

        if ( $query == null )
        {
            foreach ( $arr as $user )
            {
                $sql = "insert into orden_trabajo_personal values( $id_orden_trabajo, '$user', 'AUXILIAR' )";
                // return $sql;
                $query = $this->insert_query( $sql );
                if ( $query !== 'OK' ) return $query;
            }

            return 'OK';
        }

        else return "Usuario auxiliar asignado previamente";
    }

    # ---------------------------------------------------

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
    
                switch ( $option ) 
                {
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
                    case 'ultima_orden': return $this->__ultima_orden( $numero_aero ); break;
                    
                    # retorna la orden de trabajo activa,
                    # del generador solicitado
                    default:
                        $sql =  
                            "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                            "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                            "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                            "where estado_asignado = true and fecha_realizada is null && id_aero = '$numero_aero' order by fecha_programada asc";
                        break;
                }
                break;

            case 'usuario': # devuelve todas las ordenes de trabajo por usuario
                $usuario = $get[ 'usuario' ];
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    "where estado_asignado = true and fecha_realizada is null and id_orden_trabajo in( ".
                        "select id_orden_trabajo from  orden_trabajo_personal where usuario = '$usuario' && tipo_usuario = 'RESPONSABLE'".
                    " ) order by fecha_programada asc";
                break;
            
            # retorna las ordenes de trabajo más proximas
            default: // devuelve todas las ordenes de trabajo no realizadas
                $sql =  
                    "select id_orden_trabajo, numero_orden, id_aero, id_mantenimiento, duracion, magnitud_duracion, ".
                    "DATE_FORMAT(fecha_programada, '%d-%m-%Y' ) as fecha_programada, DATE_FORMAT(fecha_reprogramada, '%d-%m-%Y' ) as fecha_reprogramada, ".
                    "DATE_FORMAT(fecha_realizada, '%d-%m-%Y' ) as fecha_realizada, trabajo_solicitado from orden_trabajo ".
                    // "where fecha_realizada is null group by numero_orden order by fecha_programada asc";
                    "where estado_asignado = true and fecha_realizada is null order by fecha_programada asc";
                break;
        }

        // return $sql;
        
        $query = $this->array_query( $sql );
        $arr = array();
        // $temp = $this->multi_array_unique( $query, 'numero_orden' ); // filtramos las ordenes

        foreach ( $query as $orden ) // añadimos campos
        {
            $id_mantenimiento = $orden[ 'id_mantenimiento' ];
            $sql = "select nombre_mantenimiento from tipo_mantenimiento where id_mantenimiento = '$id_mantenimiento'";
            $nombre_mantenimiento = $this->array_query( $sql, 'nombre_mantenimiento', null );
            $orden[ 'nombre_mantenimiento' ] = $nombre_mantenimiento[0];

            $id_orden_trabajo = $orden[ 'id_orden_trabajo' ];
            $orden[ 'orden_trabajo_personal' ] = $this->__orden_trabajo_personal( $id_orden_trabajo, $conexion );

            $arr[] = $orden;
        }

        return $arr;
    }

    # __ultima_orden -------------------

    public function __ultima_orden ( $numero_aero )
    {
        if ( !empty( $numero_aero ) ) 
        {            
            $IDS = $this->__getMatrizIdMantto( $numero_aero, $this->conexion );
            // return $IDS;

            if ( $IDS != null )
            {
                // ---------- creamos el arreglo de retorno

                $datos = array();

                foreach ( $IDS as $id ) 
                {
                    $sql = "select fecha_programada from orden_trabajo where id_aero = '$numero_aero' and id_mantenimiento = '$id' order by fecha_programada desc";
                    $array = $this->array_query( $sql, 'fecha_programada', null );
                    
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

    private function __getMatrizIdMantto( $numero_aero, $conexion )
    {
        $sql = "select id_mantenimiento from orden_trabajo where id_aero = '$numero_aero' order by id_mantenimiento asc";
        
        $matrizIDS = $this->array_query( $sql, 'id_mantenimiento', null );

        if ( $matrizIDS != null ) 
        {
            $IDS = array_unique( $matrizIDS );
            return $this->array_numerico( $IDS );
        }
        
        else return $matrizIDS;
    }

    #------------------------------------------------------------------------

    private function __orden_trabajo_personal( $id_orden_trabajo, $conexion )
    {
        // ---------- buscar supervisor

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'SUPERVISOR' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->array_query( $sql, 'usuario', null );
        $arr[ 'supervisor' ] = $query[ 0 ];

        // ---------- buscar responsable

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'RESPONSABLE' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->array_query( $sql, 'usuario', null );
        $arr[ 'responsable' ] = $query[ 0 ];

        // ---------- buscar auxiliar

        $sql =  "select usuario from orden_trabajo_personal where tipo_usuario = 'AUXILIAR' and id_orden_trabajo = '$id_orden_trabajo'";
        $query = $this->array_query( $sql, 'usuario', null );
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

                $arr[ 'no_valido' ] = $this->array_query( $sql, 'numero_aero', null );

                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_unidad = '$numero_unidad' && aeros.numero_aero = orden_trabajo.id_aero order by orden_trabajo.id_aero asc";

                $arr[ 'valido' ] = $this->array_query( $sql, 'numero_aero', null );
                break;

            case 'numero_aero': // devuelve todos los generadores que no tienen un programa de mantenimiento
                $numero_aero = $get[ 'numero_aero' ];
                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_aero = '$numero_aero' && orden_trabajo.id_aero is null";

                $arr[ 'no_valido' ] = $this->array_query( $sql, 'numero_aero', null );

                $sql =  
                    "select DISTINCT aeros.numero_aero from aeros LEFT JOIN orden_trabajo ".
                    "ON orden_trabajo.id_aero = aeros.numero_aero ".
                    "where aeros.numero_aero = '$numero_aero' && orden_trabajo.id_aero = aeros.numero_aero";

                $arr[ 'valido' ] = $this->array_query( $sql, 'numero_aero', null );
                break;
            
            default:
                return null;
                break;
        }

        return $arr;
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
        $query = $this->array_query( $sql );
        
        $arr = array(
            'id_mantenimiento' => $query[ 0 ][ 'id_mantenimiento' ],
            'id_aero' => $query[ 0 ][ 'id_aero' ]
        );

        return $arr;

        // ---------- buscamos todos los sistemas de las actividades que estan en el tipo de manteminiemto

        // $sql =  "select id_sistema_aero from actividad_verificar where id_mantenimiento = '$id_mantenimiento' ".
        //         "order by id_mantenimiento asc";
        // $query = $this->array_query( $sql, 'id_sistema_aero', null );

        // $sistema = array_unique( $query );

        // return $sistema;
    }

    private function __actividad_verificar ( $id_mantenimiento, $conexion )
    {
        $sql = "select * from actividad_verificar where id_mantenimiento = '$id_mantenimiento' && id_actividad_verificar not in( ".
                    "select id_actividad_verificar from orden_trabajo_actividad )";    

        $data = $this->array_query( $sql );
        $arr = array();

        foreach ( $data as $act ) 
        {
            // ---------- consultamos nombre del sistema

            $id_sistema_aero = $act[ 'id_sistema_aero' ];
            $sql = "select nombre_sistema_aero from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->array_query( $sql, 'nombre_sistema_aero', null );
            $act[ 'nombre_sistema_aero' ] = $query[ 0 ];

            // ---------- consultamos nombre del equipo

            $id_equipo_aero = $act[ 'id_equipo_aero' ];
            $sql = "select nombre_equipo_aero from equipo_aero where id_equipo_aero = '$id_equipo_aero'";
            $query = $this->array_query( $sql, 'nombre_equipo_aero', null );
            $act[ 'nombre_equipo_aero' ] = $query[ 0 ];

            // ---------- consultamos tablas internas de la actividad

            $id_actividad_verificar = $act[ 'id_actividad_verificar' ];

            $act[ 'parametro_actividad' ] = $this->__parametroActividad( $id_actividad_verificar, $con_todo );
            $act[ 'lectura_actual' ] = $this->__lecturaActual( $id_actividad_verificar, $con_todo );
            $act[ 'lectura_posterior' ] = $this->__lecturaPosterior( $id_actividad_verificar, $con_todo );

            $arr[] = $act;
        }

        return $arr;       
    }

    # -----------------------------------------

    public function systems_into_mantto( $get )
    {
        $id_mantenimiento = $get[ 'id_mantenimiento' ];
        $id_orden_trabajo = $get[ 'id_orden_trabajo' ];
        $con_datos = $get[ 'con_datos' ];

        if ( !empty( $id_mantenimiento ) ) 
        {
            switch ( $con_datos ) {
                case 'true': # sistemas con datos capturados
                    $sql = "SELECT DISTINCT id_sistema_aero FROM actividad_verificar ".
                            "WHERE id_mantenimiento = '$id_mantenimiento' AND ".
                            "id_actividad_verificar IN ( ".
                                "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                                "WHERE id_orden_trabajo = $id_orden_trabajo ".
                            ")";
                    break;
                
                default: # sistemas sin datos capturados
                    $sql = "SELECT DISTINCT id_sistema_aero FROM actividad_verificar ".
                            "WHERE id_mantenimiento = '$id_mantenimiento' AND ".
                            "id_actividad_verificar NOT IN ( ".
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

            foreach ( $mtz as $id_sistema_aero ) 
            {
                $sql = "select * from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
                $query = $this->array_query( $sql );
                $arr[] = $query[ 0 ];
            }

            return $arr;
        }

        return null;
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
    public function equipo_into_systems_mantto ( $get )
    {
        $validar 
            = $this->verificaDatosNulos( $get, 
                array( 'id_mantenimiento', 'id_sistema_aero' )
            );

        if ( $validar !== 'OK' ) return null;

        $id_mantenimiento = $get[ 'id_mantenimiento' ];
        $id_sistema_aero = $get[ 'id_sistema_aero' ];
        $id_orden_trabajo = $get[ 'id_orden_trabajo' ];
        $con_datos = $get[ 'con_datos' ];

        switch ( $con_datos ) {
            case 'true': # retorna equipos dentro de sistemas con datos capturados
                $sql =
                    "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
                    "WHERE id_mantenimiento = '$id_mantenimiento' ".
                    "AND id_sistema_aero = '$id_sistema_aero' AND ".
                    "id_actividad_verificar IN ( ".
                        "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                        "WHERE id_orden_trabajo = $id_orden_trabajo ".
                    ")";
                break;
            
            default: # retorna equipos dentro de sistemas sin datos capturados
                $sql =
                    "SELECT DISTINCT id_equipo_aero FROM actividad_verificar ".
                    "WHERE id_mantenimiento = '$id_mantenimiento' ".
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
    public function actividades_into_equipo ( $get )
    {
        $validar = 
            $this->verificaDatosNulos( $get, 
                array( 'id_mantenimiento', 'id_equipo_aero', 'id_orden_trabajo' ) 
            );

        if ( $validar === 'OK' )
        {
            $id_mantenimiento = $get[ 'id_mantenimiento' ];
            $id_equipo_aero = $get[ 'id_equipo_aero' ];
            $id_orden_trabajo = $get[ 'id_orden_trabajo' ];

            return $this->__actividad_verificar_equipo( $get );
        }
    }

    private function __actividad_verificar_equipo ( $data )
    {
        $id_mantenimiento = $data[ 'id_mantenimiento' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ];
        $id_orden_trabajo = $data[ 'id_orden_trabajo' ]; 
        $con_datos = $data[ 'con_datos' ];

        # Preparamos el tipo de consulta
        
        switch ( $con_datos ) {
            case 'true':
                $sql =  "SELECT * FROM actividad_verificar ".
                        "WHERE id_mantenimiento = '$id_mantenimiento' ".
                        "AND id_equipo_aero = '$id_equipo_aero' ".
                        "AND id_actividad_verificar IN( ".
                            "SELECT id_actividad_verificar FROM orden_trabajo_actividad ".
                            "WHERE id_orden_trabajo = $id_orden_trabajo ".
                        ")";
                break;
            
            default:
                $sql =  "SELECT * FROM actividad_verificar ".
                        "WHERE id_mantenimiento = '$id_mantenimiento' ".
                        "AND id_equipo_aero = '$id_equipo_aero' ".
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
        foreach ( $mtz as $actividad )
        {
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

    private function __parametroActividad ( $id_actividad )
    {
        $sql = "select * from parametro_actividad where id_actividad = $id_actividad order by secuencia_datos asc";
        $matrizParametros = $this->array_query( $sql );
        return $matrizParametros;
    }

    private function __lecturaActual ( $id_actividad, $con_todo, $id_orden_trabajo )
    {
        $sql =  "SELECT t_la.id_actividad, t_la.tipo_dato, t_la.parametro, ".
                "t_la.unidad_medida, t_la.secuencia_datos, t_la.id, t_pa.tipo_dato ".
                "as tipo_validacion, t_pa.dato as dato_validacion ".
                "FROM lectura_actual t_la LEFT JOIN parametro_actividad t_pa ".
                "ON t_la.id_actividad = t_pa.id_actividad ".
                "WHERE t_la.id_actividad = $id_actividad ".
                "AND t_la.secuencia_datos = t_pa.secuencia_datos ".
                "ORDER BY t_la.secuencia_datos ASC";
        
        // return $sql;
        $arr = $this->array_query( $sql );

        switch ( $con_todo ) 
        {
            case ( $con_todo == 'con_captura' || $con_todo == 'barrido_validacion' ):
                $i = 0;
                foreach ( $arr as $lectura_actual ) 
                {
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

    private function __lecturaPosterior ( $id_actividad, $con_todo, $id_orden_trabajo )
    {
        $sql =  "SELECT t_lp.id_actividad, t_lp.tipo_dato, t_lp.parametro, ".
                "t_lp.unidad_medida, t_lp.secuencia_datos, t_lp.id, t_pa.tipo_dato ".
                "as tipo_validacion, t_pa.dato as dato_validacion ".
                "FROM lectura_posterior t_lp ".
                "LEFT JOIN parametro_actividad t_pa ".
                "ON t_lp.id_actividad = t_pa.id_actividad ".
                "WHERE t_lp.id_actividad = $id_actividad ".
                "AND t_lp.secuencia_datos = t_pa.secuencia_datos ".
                "ORDER BY t_lp.secuencia_datos ASC";
        
        // return $sql;
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

    private function __observaciones( $id_actividad_verificar, $id_orden_trabajo )
    {
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

    private function __resolve_equipo_null ( $id_equipo_aero, $conexion )
    {
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

    public function insertarDatosListaVerificacion ( $data )
    {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion ) 
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );        

        // $data = null;

        if ( !empty( $data ) )
        {
            # insertamos la tabla [datos_lista_verificacion]

            $id_orden_trabajo = $data[ 'id_orden_trabajo' ];
            $fecha = date( 'Y/m/d' );
            $hora = date( 'h:i:s' );
            $observaciones = '';
            $datos_actividad = $data[ 'datos_actividad' ];
            $conexion = $this->conexion;         
            
            $sql = "insert into datos_lista_verificacion values( $id_orden_trabajo, '$fecha', '$hora', '$observaciones' )";
            $query = $this->insert_query( $sql );

            if ( $query !== 'OK' ) 
            {
                $conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar tabla: [datos_lista_verificacion]' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => $query );
                return $rsp;
            }

            # insertamos actividades

            $datos_actividad = $this->__insertar_datos_actividad( $id_orden_trabajo, $datos_actividad );
            if ( $datos_actividad === 'OK' )
            {
                $conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Datos guardados satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => 'Correcto' );
                return $rsp;
            }

            else 
            {
                $conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al guardar los datos' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => "Orden de trabajo ".$id_orden_trabajo, 'msj' => $datos_actividad );
                return $rsp;
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => 'Sin datos...' );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp; 
    }

    private function __insertar_datos_actividad ( $id_orden_trabajo, $arr )
    {
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

    private function verifica_actividad_insertada ( $id_orden_trabajo, $id_actividad )
    {
        $sql = "select id_actividad_verificar from orden_trabajo_actividad where id_orden_trabajo = $id_orden_trabajo and id_actividad_verificar = $id_actividad";
        $query = $this->array_query( $sql, 'id_actividad_verificar', null );

        if ( $query == null ) return true;
        else return false;
    }

    private function __datos_lectura( $arr, $id_actividad, $tipo_lectura )
    {
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

    private function __evaluacion_parametro ( $tipo_validacion, $dato_validacion, $dato )
    {
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
}