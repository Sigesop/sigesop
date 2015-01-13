<?php
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class funcionesPrimarias {

    public $conexion; 
    public $conexionMySQL; // conexion a la base de datos mysql
    public $errnoRoot;
    public $estadoConexion = false; // conexion satisfactoria para cualquier usuario registrado
    public $estadoConexionMysql = false;
    public $estadoConexionRoot = false; // conexion satisfactoria para usuario root de mysql
    public $host, $usuario, $clave, $baseDatos;

    public $matrizAreaAcceso = array(
        0 => array(
            'nivelBarra' => 1, 'idAcceso' => 'status', 'paginaAcceso' => 'status.php', 'nombrePagina' => 'Estatus'
        ),

        1 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoRolUsuario', 'paginaAcceso' => 'catalogoRolUsuario.php', 'nombrePagina' => 'Catálogo de Roles de Usuario'
        ),

        2 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoAreaTrabajo', 'paginaAcceso' => 'catalogoAreaTrabajo.php', 'nombrePagina' => 'Catálogo de Áreas de Trabajo'
        ), 

        3 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUsuarios', 'paginaAcceso' => 'catalogoUsuarios.php', 'nombrePagina' => 'Catálogo de Usuarios'
        ),

        4 => array(
            'nivelBarra' => 2, 'idAcceso' => 'gestionCentral', 'paginaAcceso' => 'gestionCentral.php', 'nombrePagina' => 'Gestión de la Central'
        ),

        5 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUnidades', 'paginaAcceso' => 'catalogoUnidades.php', 'nombrePagina' => 'Catálogo de Unidades'
        ),

        6 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoAeros', 'paginaAcceso' => 'catalogoAeros.php', 'nombrePagina' => 'Catálogo de Aéros'
        ),

        7 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoSistemas', 'paginaAcceso' => 'catalogoSistemas.php', 'nombrePagina' => 'Catálogo de Sistemas'
        ),

        8 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoEquipos', 'paginaAcceso' => 'catalogoEquipos.php', 'nombrePagina' => 'Catálogo de Equipos'
        ),

        9 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUnidadesMedida', 'paginaAcceso' => 'catalogoUnidadesMedida.php', 'nombrePagina' => 'Catálogo de Unidades de Medida'
        ),

        10 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoTipoMantenimiento', 'paginaAcceso' => 'catalogoTipoMantenimiento.php', 'nombrePagina' => 'Catálogo de Tipos de Mantenimiento'
        ),

        11 => array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoListas', 'paginaAcceso' => 'catalogoListas.php', 'nombrePagina' => 'Catálogo de Listas de Verificación'
        ),

        12 => array(
            'nivelBarra' => 3, 'idAcceso' => 'programaMtto', 'paginaAcceso' => 'programaMtto.php', 'nombrePagina' => 'Creación de Orden de Trabajo'
        ),

        13 => array(
            'nivelBarra' => 3, 'idAcceso' => 'ordenTrabajo', 'paginaAcceso' => 'ordenTrabajo.php', 'nombrePagina' => 'Captura de Orden de Trabajo'
        ),

        14 => array(
            'nivelBarra' => 4, 'idAcceso' => 'libroLicencia', 'paginaAcceso' => 'libroLicencia.php', 'nombrePagina' => 'Consecutivo de Licencias'
        ),

        15 => array(
            'nivelBarra' => 4, 'idAcceso' => 'reporteNovedades', 'paginaAcceso' => 'reporteNovedades.php', 'nombrePagina' => 'Libro Relatorio'
        )
    );

/***************************************************FUNCIONES INTERNAS***************************************************/ 
    
    function funcionesPrimarias( $host, $usuario, $clave, $baseDatos )
    {
        // Guardamos las variables para uso interno
        $this->host = $host;
        $this->usuario = $usuario;
        $this->clave = $clave;
        $this->baseDatos = $baseDatos;
        $this->checkUsuario( $host, $usuario, $clave, $baseDatos );
    }

    function __destruct()
    {
        $this->estadoConexion ? $this->conexionMySQL->close(): null;
        $this->estadoConexionMysql ? $this->conexion->close(): null;
        // $this->conexionMySQL->close();
        // $this->conexion->close();
    }    

    /*
     * retorna una matriz numerica, a partir de una matriz cualquiera, es decir; elimina
     * los indices 
     */
    protected function array_numerico( $array )
    {
        $m = array();

        foreach ( $array as $val ) 
        {
            $m[] = $val;
        }

        return $m;
    }

    // simula un autoincremento
    protected function autoincrement( $SQL_consulta, $fetch_assoc, $conexion ) 
    {
            $obtenerID = $this->consultaSimpleArrayNumerico( $SQL_consulta, $fetch_assoc, $this->conexion, 0 );
            $indice = $obtenerID[ sizeof( $obtenerID ) - 1 ] + 1;
            return $indice;
    }    

    protected function checkRoot( $password_check, $root )
    {
        $this->conexionMySQL = new mysqli( $this->host, $root, $password_check, 'mysql');
        if ( !mysqli_connect_errno() ) 
        {
            // ---------- deshabilitamos el autocommit

            $this->conexionMySQL->autocommit( false ); 
                       
            $this->estadoConexionRoot = true;
            $this->estadoConexionMysql = true;

            // ---------- abrimos conexion y verificamos si se realizo correctamente

            $this->conexion = new mysqli( $this->host, $root, $password_check, $this->baseDatos );
            if ( !mysqli_connect_errno() ) 
            {
                $this->conexion->autocommit( false ); 
                $this->estadoConexion = true;
            }
            else $this->estadoConexion = false;
        } 
        else
        {
            $this->estadoConexionRoot = false;
            $this->estadoConexion = false;
            $this->estadoConexionMysql = false;
        }
    }    

    /* abre la conexion a la base de datos, verifica si existe el usuario
     * y verifica si es superusuario o usuario comun
     */ 

    protected function checkUsuario( $host, $usuario, $clave, $baseDatos )
    {
        if ( $usuario != 'root' )
        {        
            $this->conexion = new mysqli( $host, $usuario, $clave, $baseDatos );
            if( !mysqli_connect_errno() )
            {
                // ---------- deshabilitamos el autocommit

                $this->conexion->autocommit( false );

                // ---------- consulta para verificar si el usuario existe en la tabla personal de la base de datos laventa_cfe

                $usr = $this->checkUserInsideLaVenta( $usuario, $this->conexion );
                if( $usr )
                {
                    $this->estadoConexion = true;

                    // ---------- Abrimos una conexion a MYSQL y verificamos conexion

                    $this->conexionMySQL = new mysqli( $host, $usuario, $clave, 'mysql' );
                    if ( !mysqli_connect_errno() ) 
                    {
                        $this->conexionMySQL->autocommit( false );
                        $this->estadoConexionMysql = true;
                    }
                    else $this->estadoConexionMysql = false;
                } 

            }
            else 
            {
                $this->estadoConexion = false;
                $this->estadoConexionMysql = false;
            }
        }

        // ---------- como no existe [root] en LAVENTA verificamos en subrutina

        else $this->checkRoot( $clave, $usuario );
    } 

    protected function checkUserInsideMysql( $usuario, $conexionMySQL )
    {
        $SQL_user = "select user from user where user = '$usuario' ";
        $user = $this->consultaSimple( $SQL_user, 'usuario', 'user', $conexionMySQL, null );
        if ( $user['usuario'] == $usuario ) return true;
        else return false;
    } 
    
    protected function checkUserInsideLaVenta( $usuario, $conexion )
    {
        $SQL_user = "select nombre_usuario from personal where nombre_usuario = '$usuario' ";        
        $user = $this->consultaSimple( $SQL_user, 'usuario', 'nombre_usuario', $conexion, null );
        if ( $user['usuario'] == $usuario ) return true;
        else return false;
    }

    public function accesoPagina( $nombrePagina )
    {
        // ---------- verificamos que tenga acceso root

        if ( $this->usuario == 'root' && $this->estadoConexionRoot ) return true;
        else
        {
            // ---------- verificamos que el usuario exista en la tabla user de mysql

            if ( !$this->estadoConexion ) return false;

            // ---------- consulta para verificar si el usuario existe en la tabla personal de la base de datos laventa_cfe
            
            $sql = "select nombre_usuario from personal where nombre_usuario = '$this->usuario'";
            $consulta = $this->consultaSimple( $sql, 'usuario', 'nombre_usuario', $this->conexion, null ); 
            $usuario = $consulta['usuario'];

            if ( empty( $usuario ) ) return false;

            // ---------- consultamos el tipo de rol al que pertenece
            
            $sql = 'select clave_rol from personal where nombre_usuario = "'.$this->usuario.'"';
            $consulta = $this->consultaSimple( $sql, 'tipoRol', 'clave_rol', $this->conexion, null );
            $rol = $consulta['tipoRol'];

            // ---------- consultamos las paginas a las que tiene acceso
            
            $sql = "select pagina_acceso_rol from acceso_rol where clave_rol = '$rol'";
            $matrizAccesoPagina = $this->consultaSimpleArrayNumerico( $sql, 'pagina_acceso_rol', $this->conexion, null );

            foreach ( $matrizAccesoPagina as $pagina ) 
            {
                if ( $pagina == $nombrePagina ) return true;
            }

            return false;
        }
    }

    protected function consultaSimpleMergeArray($array_1, $array_2, $SQL_consulta, $nombreResultado, $fetch_assoc, $conexion, $valorNulo)
    {        
        $array_2 = $this->consultaSimple($SQL_consulta, $nombreResultado, $fetch_assoc, $conexion, $valorNulo);
        $array = array_merge($array_1, $array_2);
        return $array;
    }

    protected function consultaSimpleMergeArrayNumerico($array_1, $array_2, $SQL_consulta, $fetch_assoc, $conexion, $valorNulo)
    {        
        $array_2 = $this->consultaSimpleArrayNumerico($SQL_consulta, $fetch_assoc, $conexion, $valorNulo);
        $array = array_merge($array_1, $array_2);
        return $array;
    }

    protected function consultaSimpleMergeArrayNumericoMultiple($array_1, $array_2, $SQL_consulta, $conexion)
    {
        $array_2 = $this->consultaSimpleArrayNumericoMultiple($SQL_consulta, $conexion);
        $array = array_merge($array_1, $array_2);
        return $array;
    }

    public function consultaSimple($SQL_consulta, $nombreResultado, $fetch_assoc, $conexion, $valorNulo)
    {        
        if($consulta = $conexion->query( $SQL_consulta) )
        {
            while ( $resultadoConsulta = $consulta->fetch_assoc() )
            {
                if ( $resultadoConsulta[ $fetch_assoc ] == null ) $array[ $nombreResultado ] = $valorNulo;
                else $array[ $nombreResultado ] = $resultadoConsulta[ $fetch_assoc ];            
            }
        } 
        else return $this->returnError( $conexion->errno );

        return $array;
    }

    // ---------- obtiene todos los datos de una columna

    public function consultaSimpleArrayNumerico( $SQL_consulta, $fetch_assoc, $conexion, $valorNulo )
    {        
        if($consulta = $conexion->query($SQL_consulta))
        {
            while ( $resultadoConsulta = $consulta->fetch_assoc() )
            {
                if ($resultadoConsulta[$fetch_assoc] == null) $array[ ] = $valorNulo;
                else $array[ ] = $resultadoConsulta[ $fetch_assoc ];
            }
        }
        
        return $array;
    }

    // ---------- obtiene todos los datos de una tabla

    protected function consultaSimpleArrayNumericoMultiple($SQL_consulta, $conexion)
    {        
        if($consulta = $conexion->query($SQL_consulta))
        {
            while ($resultadoConsulta = $consulta->fetch_assoc()) $array[] = $resultadoConsulta;
        }
        return $array;
    }    

    // realiza una consulta del tipo insertar dato
    protected function consultaInsercionSimple($SQL_consulta, $conexion)
    {
        if ( $consulta = $conexion->query( $SQL_consulta ) ) return 'OK';
        else return $this->returnError( $conexion->errno, $conexion->error );
    }

    protected function retornaMatrizRespuesta( $matriz )
    {
        $mensaje = '';
        $estado = true;
        foreach ( $matriz as $val )
        {
            if ( $val['respuesta'] != 'OK' ) 
            {
                $estado = false;
                $mensaje .= "FUNCION: ".$val['funcion']."\nRESPUESTA: ".$val['respuesta']." \n";
            }
        }

        if ( $estado ) return 'OK';
            else return $mensaje;        
    }

    protected function verificaDatosNulos( $matrizDatos, $matrizNombreDatos ) 
    {
        if ( !empty( $matrizDatos ) && !empty( $matrizNombreDatos ) ) 
        {
            $flagValidacion = true;
            $mensajeErrores = 'Los siguientes campos se encuentran nulos:';
            foreach ( $matrizNombreDatos as $key => $nombre ) 
            {                             
                $val = $matrizDatos[ $nombre ][ 'valor' ];
                $array = $matrizDatos[ $nombre ];                    

                if( empty( $array ) )
                {
                    $flagValidacion = false;
                    $mensajeErrores .= " $nombre";
                }
                else if ( isset( $val ) && empty( $val ) ) 
                {
                    $flagValidacion = false;
                    $mensajeErrores .= " $nombre";
                }          
            }

            if ( $flagValidacion  === true ) return 'OK';
                else return $mensajeErrores;
        } 
        else return "No existen datos o nombre de datos";
    }

    public function multi_array_unique( $arr, $campo )
    {
        $unico = $arr [ 0 ][ $campo ];

        // echo json_encode($arr)."<br><br>";
        // echo $unico."<br><br>";

        $arr_cpy = array();
        $arr_descar = array();
        $lon = sizeof( $arr );
        $i = 0;

        for ( $i; $i < $lon; $i++)
        {
            // echo "valor: ".$arr [ $i ][ $campo ]."<br>Unico: ".$unico."<br>Unico_search: ".array_search( $arr [ $i ][ $campo ], $arr_descar )."<br>";
            
            // if ( $arr [ $i ][ $campo ] != $unico && array_search( $arr [ $i ][ $campo ], $arr_descar ) == null )
            if ( array_search( $arr [ $i ][ $campo ], $arr_descar ) === false )
            {
                // echo json_encode( $arr[ $i ] )."<br>";
                $arr_cpy[] = $arr[ $i ];
                $unico = $arr[ $i ][ $campo ];
                $arr_descar[] = $unico;
            }

            // echo "<br>";
        }

        // echo json_encode( $arr_descar );
        return $arr_cpy;
    }

    // retorna el numero de error de mysql y lo asocia con el mensaje correspondiente
    protected function returnError( $noError, $error )
    {
        switch ( $noError )
        {
            case 1005:
                return "Error: ".$noError."\nNo se puede crear la tabla debido a una restricción de clave foránea incorrectamente formulada.";
                break;
                
            case 1044:
                return "Error: ".$noError."\nAcceso denegado para el usuario";
                break;

            case 1045:
                return "Error: ".$noError."\nAcceso denegado para el usuario: ".$this->usuario.", no cuenta con los privilegios necesarios";
                break;

            case 1054:
                return "Error: ".$noError."\nColumna desconocida";
                break;

            case 1062:
                return "Error: ".$noError."\nEntrada duplicada";
                break;            

            case 1064:
                return "Error: ".$noError."\nError de sintaxis SQL";
                break;

            case 1065:
                return "Error: ".$noError."\nLa consulta se encuentra vacia";
                break;

            // case 1133:
            //     return "Error: ".$noError.".\n".$error;
            //     break;                

            case 1136:
                return "Error: ".$noError."\nEl número de columnas no corresponde al número en la línea";
                break;

            case 1142:
                return "Error: ".$noError."\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes";
                break;                

            case 1146:
                return "Error: ".$noError."\nNo existe la tabla solicitada";
                break;

            case 1227:
                return "Error: ".$noError."\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes";
                break;                

            case 1265:
                return "Error: ".$noError."\nDatos truncados para columna";
                break;        

            case 1364:
                return "Error: ".$noError."\n El valor no puede ser nulo";
                break;

            // case 1396:
            //     return "Error: ".$noError."\nOperacion fallada";
            //     break;

            case 1406:
                return "Error: ".$noError."\n Dato demasiado largo para el tamaño de la columna";
                break;

            case 1451:
                return "Error: ".$noError."\nNo se puede eliminar elemento del que dependen registros";
                break;

            case 1452:
                return "Error: ".$noError."\nNo se puede eliminar, actualizar o crear elemento sin elemento padre disponible";
                break;

            default:
                return "Error ".$noError.".\n".$error;
                break;
        }    
    }
}

?>