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
            case 'insertaBarraHerramientasRolUsuario':
                $insertaBarraHerramientasRolUsuario = $this->insertaBarraHerramientasRolUsuario();
                echo json_encode($insertaBarraHerramientasRolUsuario);
                break;

            case 'requestCloseSesion':
                $requestCloseSesion = $this->requestCloseSesion();
                echo json_encode($requestCloseSesion);
                break;

            case 'solicitudInicioSesion':
                $solicitudInicioSesion = $this->solicitudInicioSesion();
                echo json_encode($solicitudInicioSesion);
                break;

            case 'verificaRoot':
                $verificaRoot = $this->verificaRoot();
                echo json_encode($verificaRoot);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase sistema');
                break;                  
        }        
    }

    function insertaBarraHerramientasRolUsuario() {
        // consultamos las paginas a las que tiene acceso
        // if ($this->estadoConexionRoot && $this->usuario == 'root') 
        if ( $this->estadoConexionRoot ) {
            $barraHerramientas = $this->matrizAreaAcceso;
            $usuarioActivo = 'Sesión: '.$this->usuario;
            $barraHerramientas[] = array('nivelBarra' => 0, 'idAcceso' => 'usuarioActivo', 'paginaAcceso' => '#', 'nombrePagina' => $usuarioActivo);
            return array( 'root' => $this->root, 'data' => $barraHerramientas ); 
        } 
        else { 
            # consultamos el tipo de rol al que pertenece
            $sql = 'select clave_rol from personal where nombre_usuario = "'.$this->usuario.'"';
            $query = $this->array_query( $sql, 'clave_rol' );

            $tipoRol = $query[0];
            $acceso = array();

            # consultamos las paginas que tiene asignado el rol

            $sql = "select pagina_acceso_rol from acceso_rol where clave_rol = '$tipoRol'";
            $query = $this->array_query( $sql, 'pagina_acceso_rol' );
            // return $query;

            # recorremos la matriz para obtener los datos completos de la variable privada matrizAreaAcceso
            
            foreach ( $query as $areaAccesoRetorno ) {
                foreach ( $this->matrizAreaAcceso as $areaAcceso ) {
                    if ( $areaAcceso['paginaAcceso'] == $areaAccesoRetorno ) {
                        $acceso[] = $areaAcceso;
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
            return array( 'root' => $this->root, 'data' => $acceso ); 
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
                // consulta para verificar si el usuario existe en la tabla personal de la base de datos laventa_cfe
                $sql = "select nombre_usuario from personal where nombre_usuario = '$this->usuario'";
                $usuario = $this->array_query( $sql, 'nombre_usuario', null );

                // cosulta para obtener el tipo de rol que tendra el usuario (admin, user, etc)
                $sql = 'select clave_rol, RDE_trabajador from personal where nombre_usuario = "'.$this->usuario.'"';
                $datos = $this->array_query( $sql );

                $rolUsuario = $datos[0]['clave_rol'];

                // consulta para obtener el primer documento de pagina que se le fue asignado
                $sql = "select pagina_acceso_rol from acceso_rol where clave_rol = '$rolUsuario'";
                $consultaPagina = $this->array_query( $sql, 'pagina_acceso_rol', null );
                
                // verificamos que el usuario exista tanto en mysql como en la tabla personal de laventa_cfe
                if( $this->estadoConexion && !empty( $usuario[ 0 ] ) )
                {
                    $retorno['estado'] = true;
                    $retorno[ 'rpe' ] = $datos[ 0 ][ 'RDE_trabajador' ];
                    // se le retorna el primer documento asignado
                    $retorno['indexUsuario'] = $consultaPagina[0];
                    return $retorno;
                } else
                { 
                    $retorno['estado'] = false;
                    // $retorno['tipo'] = null;
                    return $retorno;
                }
            } else{
                // Conexion a la base de datos incorrecta por incompatibilidad de los datos del login del usuario
                // con los de la base de datos
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
}