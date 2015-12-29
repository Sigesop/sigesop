<?php
include 'sigesop.class.php';

class sistema extends sigesop
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }

    function solicitudAjax( $accion ) {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ( $accion ) {
            case 'barraHerramientas':
                $q = $this->barraHerramientas();
                echo json_encode( $q );
                break;

            case 'insertaBarraHerramientasRolUsuario':
                $q = $this->insertaBarraHerramientasRolUsuario();
                echo json_encode($q);
                break;

            case 'keepAlive':
                $q = $this->keepAlive();
                echo json_encode( $q );
                break;

            case 'requestCloseSesion':
                $q = $this->requestCloseSesion();
                echo json_encode($q);
                break;

            case 'solicitudInicioSesion':
                $q = $this->solicitudInicioSesion();
                echo json_encode($q);
                break;

            case 'verificaRoot':
                $q = $this->verificaRoot();
                echo json_encode($q);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase sistema');
                break;
        }
    }

    public function barraHerramientas () {

    }

    function insertaBarraHerramientasRolUsuario() {
        // consultamos las paginas a las que tiene acceso
        // if ($this->estadoConexionRoot && $this->usuario == 'root')
        if ( $this->estadoConexionRoot ) {
            $barraHerramientas = $this->matrizAreaAcceso;
            $usuarioActivo = 'Sesión: '.$this->usuario;
            $barraHerramientas[] = array('nivelBarra' => 0, 'idAcceso' => 'usuarioActivo', 'paginaAcceso' => '#', 'nombrePagina' => $usuarioActivo);
            return array(
                    'root'       => $this->root,
                    'userManual' => $this->path_user_manual,
                    'data'       => $barraHerramientas
            );
        }
        else {
            # consultamos el tipo de rol al que pertenece
            $sql     = 'SELECT clave_rol FROM personal WHERE nombre_usuario = "'.$this->usuario.'"';
            $tipoRol = $this->query( $sql, 'clave_rol' );

            # consultamos las paginas que tiene asignado el rol
            $acceso = array();
            $sql    = "SELECT id_area_acceso FROM acceso_rol WHERE clave_rol = '$tipoRol'";
            $query  = $this->array_query( $sql, 'id_area_acceso' );
            // return $query;

            # recorremos la matriz para obtener los datos completos de la variable privada matrizAreaAcceso

            foreach ( $query as $id_area_acceso ) {
                foreach ( $this->matrizAreaAcceso as $row ) {
                    if ( $row[ 'id_area_acceso' ] == $id_area_acceso ) {
                        $acceso[] = $row;
                        break;
                    }
                }
            }

            // foreach ( $this->matrizAreaAcceso as $areaAcceso )
            // {
            //     // return $areaAcceso['paginaAcceso'];
            //     return array_search( "status.php", ["status.php","catalogoRolUsuario.php","catalogoAreaTrabajo.php"] );
            //     if ( array_search( $areaAcceso['paginaAcceso'], $query ) != false )
            //         $acceso[] = $areaAcceso;
            // }

            $usuarioActivo = 'Sesión: '.$this->usuario;
            $acceso[] = array('nivelBarra' => 0, 'idAcceso' => 'usuarioActivo', 'paginaAcceso' => '#', 'nombrePagina' => $usuarioActivo );
            return array(
                'root' => $this->root,
                'userManual' => $this->path_user_manual,
                'data' => $acceso
            );
        }
    }

    // ---------- Funcion que cierra sesion destruyendo la variable global SESSION

    function requestCloseSesion() {
        if( session_destroy() ) {
            return "OK";
        }
        else return "NA";
    }

    function sesionActiva() {
        // Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
        $user = $_SESSION['user'];
        $pass = $_SESSION['pass'];
        $host = $_SESSION['host'];

        // Consulta el estado de la conexion
        //      0 ----------------> CONECTADO
        //      1 ----------------> DESCONECTADO

        $statusSesion = ignore_user_abort();
        if ($statusSesion == 1) {
            $conexionSesionActiva = mysql_connect($host, 'sesionActiva', 'E*k9qMJjjU4^D5q' );
            if (mysql_select_db('laventa_cfe', $conexionSesionActiva)) {
                // Consulta para cambiar el estado del usuario y asi no quedar atrapado
                $SQL_updateSesionActiva = 'update sesionActiva set estado = 0 where nombre_usuario = "'.$user.'"';
                if (mysql_query($SQL_updateSesionActiva))
                {
                }
            }
        } else {
            // EC = Error de Conexion
            return "EC";
        }
    }

    function solicitudInicioSesion() {

        $flagVerificacion = true;
        empty( $this->usuario ) ? $flagVerificacion = false : null;
        empty( $this->clave ) ? $flagVerificacion = false : null;

        if ( $flagVerificacion )
        {
            // $datos es una variable array global en donde guardaremos el estado de la conexion (true, false) y el tipo de rol
            // que tendra el usuario (admin, user, etc) y al final de la rutina se retornara para enviarlo al javaScript
            // mediante AJAX
            $datos = array();

            // verificamos si se inicio sesion correctamente en el constructor
            if ( $this->estadoConexionRoot )
            {
                $datosRetorno['estado'] = true;
                $datosRetorno['tipo'] = 'Root';
                $datosRetorno['indexUsuario'] = 'status.php';

                return $datosRetorno;
            }
            else if( $this->estadoConexion )
            {
                # consulta para verificar si el usuario
                # existe en la tabla personal de la base de datos laventa_cfe
                $sql     = "SELECT nombre_usuario FROM personal WHERE nombre_usuario = '$this->usuario'";
                $usuario = $this->array_query( $sql, 'nombre_usuario', null );

                # cosulta para obtener el tipo de rol que tendra
                # el usuario (admin, user, etc)
                $sql        = 'SELECT clave_rol, RDE_trabajador FROM personal WHERE nombre_usuario = "'.$this->usuario.'"';
                $datos      = $this->array_query( $sql );

                $rolUsuario = $datos[0]['clave_rol'];

                # consulta para obtener el primer documento
                # de pagina que se le fue asignado
                $sql            = "SELECT id_area_acceso FROM acceso_rol WHERE clave_rol = '$rolUsuario'";
                $id_area_acceso = $this->query( $sql, 'id_area_acceso', null );

                foreach ( $this->matrizAreaAcceso as $row ) {
                    if ( $row[ 'id_area_acceso' ] == $id_area_acceso ) {
                        $consultaPagina = $row[ 'paginaAcceso' ];
                        break;
                    }
                }                

                # verificamos que el usuario exista tanto en
                # mysql como en la tabla personal de laventa_cfe
                if( $this->estadoConexion && !empty( $usuario[ 0 ] ) )
                {
                    $retorno['estado'] = true;
                    $retorno[ 'rpe' ] = $datos[ 0 ][ 'RDE_trabajador' ];

                    # se le retorna el primer documento asignado
                    $retorno['indexUsuario'] = $consultaPagina;
                    return $retorno;
                } else
                {
                    $retorno['estado'] = false;
                    // $retorno['tipo'] = null;
                    return $retorno;
                }
            } else{
                $datos['estado'] = false;
                $datos['tipo'] = null;
                return $datos;
            }
        } else {
            $datos['estado'] = false;
            $datos['tipo'] = null;
            return $datos;
        }
    }

    #############################################################
    #############################################################
    ## SECCION DE FUNCIONES ADAPTADAS A DISPOSITIVO MOVIL
    #############################################################
    #############################################################
    
    public function keepAlive () {
        $this->estadoConexion = true;
        return array( 'state' => 'OK' );
    }
}