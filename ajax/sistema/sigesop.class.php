<?php
class sigesop {
    public $conexion; 
    public $conexionMySQL; // conexion a la base de datos mysql    
    public $errnoRoot;
    public $estadoConexion = false; // conexion satisfactoria para cualquier usuario registrado
    public $estadoConexionMysql = false;
    public $estadoConexionRoot = false; // conexion satisfactoria para usuario root de mysql
    public $solo_lectura = array( 'N/A' ); // elementos de solo lectura
    
    # configuraciones del servidor
    public $serverRoot = 'http://laventa.cfe.local/';
    public $host = 'localhost';
    public $db = 'laventa_cfe';
    public $root = 'root'; # superusuario con clave encriptada con algoritmo SHA1
    public $usuario, $clave;

    public $matrizAreaAcceso = array(
        array(
            'nivelBarra' => 1, 'idAcceso' => 'status', 'paginaAcceso' => 'status.php', 'nombrePagina' => 'Estatus'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoRolUsuario', 'paginaAcceso' => 'catalogoRolUsuario.php', 'nombrePagina' => 'Roles de Usuario'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoAreaTrabajo', 'paginaAcceso' => 'catalogoAreaTrabajo.php', 'nombrePagina' => 'Áreas de Trabajo'
        ), 

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUsuarios', 'paginaAcceso' => 'catalogoUsuarios.php', 'nombrePagina' => 'Usuarios'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'gestionCentral', 'paginaAcceso' => 'gestionCentral.php', 'nombrePagina' => 'Gestión de la Central'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUnidades', 'paginaAcceso' => 'catalogoUnidades.php', 'nombrePagina' => 'Unidades'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoAeros', 'paginaAcceso' => 'catalogoAeros.php', 'nombrePagina' => 'Aerogeneradores'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoSistemas', 'paginaAcceso' => 'catalogoSistemas.php', 'nombrePagina' => 'Sistemas'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoEquipos', 'paginaAcceso' => 'catalogoEquipos.php', 'nombrePagina' => 'Equipos'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoMateriales', 'paginaAcceso' => 'materiales.php', 'nombrePagina' => 'Materiales'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoUnidadesMedida', 'paginaAcceso' => 'catalogoUnidadesMedida.php', 'nombrePagina' => 'Unidades de Medida'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoTipoMantenimiento', 'paginaAcceso' => 'catalogoTipoMantenimiento.php', 'nombrePagina' => 'Tipos de Mantenimiento'
        ),

        array(
            'nivelBarra' => 2, 'idAcceso' => 'catalogoListas', 'paginaAcceso' => 'catalogoListas.php', 'nombrePagina' => 'Listas de Verificación'
        ),

        array(
            'nivelBarra' => 3, 'idAcceso' => 'creacionOrdenTrabajo', 'paginaAcceso' => 'creacionOrdenTrabajo.php', 'nombrePagina' => 'Creación de Orden de Trabajo'
        ),

        array(
            'nivelBarra' => 3, 'idAcceso' => 'capturaOrdenTrabajo', 'paginaAcceso' => 'capturaOrdenTrabajo.php', 'nombrePagina' => 'Captura de Orden de Trabajo'
        ),

        array(
            'nivelBarra' => 4, 'idAcceso' => 'consecutivoLicencia', 'paginaAcceso' => 'consecutivoLicencia.php', 'nombrePagina' => 'Consecutivo de Licencias'
        ),

        array(
            'nivelBarra' => 4, 'idAcceso' => 'libroRelatorio', 'paginaAcceso' => 'libroRelatorio.php', 'nombrePagina' => 'Libro Relatorio'
        )
    );

    /***************************************************FUNCIONES INTERNAS***************************************************/ 
    
    function sigesop ( $usuario, $clave ) {
        // Guardamos las variables para uso interno
        $this->usuario = $usuario;
        $this->clave = $clave;        
        $this->checkUsuario( $usuario, $clave );
    }

    function __destruct() {
        $this->estadoConexion ? $this->conexionMySQL->close(): null;
        $this->estadoConexionMysql ? $this->conexion->close(): null;
    }    

    /*
     * retorna una matriz numerica, a partir de una matriz cualquiera, es decir; elimina
     * los indices 
     */
    protected function array_numerico( $array ) {
        $m = array();

        foreach ( $array as $val ) 
        {
            $m[] = $val;
        }

        return $m;
    }

    // simula un autoincremento
    protected function autoincrement( $sql, $fetch_assoc ) {
        $arr = $this->array_query( $sql, $fetch_assoc, 0 );
        return $arr[ sizeof( $arr ) - 1 ] + 1;
    }

    protected function auto_increment( $table, $key ) {
        if ( empty( $table ) || empty( $key ) ) return NULL;
        $sql = "SELECT ".$key." FROM ".$table." ORDER BY ".$key." DESC LIMIT 1";
        $query = $this->query( $sql, $key, NULL );
        return $query + 1;
    }

    protected function checkRoot( $password_check, $root ) {
        $this->conexionMySQL = 
            new mysqli( $this->host, $root, $password_check, 'mysql');

        if ( !mysqli_connect_errno() ) {
            # deshabilitamos el autocommit
            $this->conexionMySQL->autocommit( false ); 
                       
            $this->estadoConexionRoot = true;
            $this->estadoConexionMysql = true;

            # abrimos conexion y verificamos si se realizo correctamente
            $this->conexion = 
                new mysqli( $this->host, $root, $password_check, $this->db );
            if ( !mysqli_connect_errno() ) {
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

    protected function checkUsuario( $usuario, $clave ) {
        if ( $usuario != $this->root )
        {        
            $this->conexion = 
                new mysqli( $this->host, $usuario, $clave, $this->db );

            if( !mysqli_connect_errno() )
            {
                # deshabilitamos el autocommit
                $this->conexion->autocommit( false );

                # consulta para verificar si el usuario existe 
                # en la tabla personal de la base de datos laventa_cfe
                $usr = $this->checkUserInsideLaVenta( $usuario );
                if( $usr )
                {
                    $this->estadoConexion = true;

                    # Abrimos una conexion a MYSQL y verificamos conexion
                    $this->conexionMySQL = 
                        new mysqli( $this->host, $usuario, $clave, 'mysql' );

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

        # como no existe [root] en LAVENTA verificamos en subrutina
        else $this->checkRoot( $clave, $usuario );
    } 

    protected function checkUserInsideMysql( $usuario ) {
        $sql = "SELECT user FROM user WHERE user = '$usuario'";
        $user = $this->array_query( $sql, 'user', null, true );
        return $user[0] == $usuario ? true : false;
    } 
    
    protected function checkUserInsideLaVenta( $usuario ) {
        $sql = "SELECT nombre_usuario FROM personal WHERE nombre_usuario = '$usuario'";        
        $user = $this->query( $sql, 'nombre_usuario' );
        return $user != null ?
            ( $user == $usuario ? true : false ) : false;
        // return $user;
    }

    public function accesoPagina( $nombrePagina ) {
        # verificamos que tenga acceso root
        if ( $this->usuario == $this->root && $this->estadoConexionRoot ) 
            return true;
        else
        {
            # verificamos que el usuario exista en la tabla user de mysql
            if ( !$this->estadoConexion ) return false;

            # consulta para verificar si el usuario existe en la tabla personal 
            # de la base de datos laventa_cfe            
            $sql = "SELECT nombre_usuario FROM personal WHERE nombre_usuario = '$this->usuario'";
            $consulta = $this->array_query( $sql, 'nombre_usuario' ); 
            $usuario = $consulta[0];

            if ( empty( $usuario ) ) return false;

            # consultamos el tipo de rol al que pertenece            
            $sql = 'SELECT clave_rol FROM personal WHERE nombre_usuario = "'.$this->usuario.'"';
            $consulta = $this->array_query( $sql, 'clave_rol' );
            $rol = $consulta[0];

            # consultamos las paginas a las que tiene acceso            
            $sql = "SELECT pagina_acceso_rol FROM acceso_rol WHERE clave_rol = '$rol'";
            $mtz = $this->array_query( $sql, 'pagina_acceso_rol' );

            foreach ( $mtz as $pagina ) 
            {
                if ( $pagina == $nombrePagina ) return true;
            }

            return false;
        }
    } 

    # retorna un unico dato de la primera fila

    protected function query( $sql, $fetch_assoc = false, $valorNulo = null, $type = false ) {
        # por defecto: conexion de usuario normal
        # verdadero: conexion a tablas mysql
        $conexion = $type === false ? $this->conexion : $this->conexionMySQL;

        if( $query = $conexion->query( $sql ) )
        {
            $data = $query->fetch_assoc(); //return $query;
            return $data ? 
                ( $fetch_assoc !== false ? $data[ $fetch_assoc ] : $data ) : $valorNulo;
        }         
        return $valorNulo;
    }

    # obtiene todos los datos de una o varias columnas

    protected function array_query( $sql, $fetch_assoc = false, $valorNulo = null, $type = false ) {
        # por defecto: conexion de usuario normal
        # verdadero: conexion a tablas mysql
        $conexion = $type === false ? $this->conexion : $this->conexionMySQL;

        $arr = array();
        if( $query = $conexion->query( $sql ) )
        {
            while ( $data = $query->fetch_assoc() )
            {
                $arr[ ] = $fetch_assoc === false ?
                    $data : 
                    ( $data[ $fetch_assoc ] == null ? $valorNulo : $data[ $fetch_assoc ] );
            }
        } 
        return $arr;
    }

    # realiza una consulta del tipo insertar dato

    protected function insert_query( $sql, $type = false ) {
        # por defecto: conexion de usuario normal
        # verdadero: conexion a tablas mysql
        $conexion = $type === false ? $this->conexion : $this->conexionMySQL;

        if ( $query = $conexion->query( $sql ) ) return 'OK';
        else return $this->returnError( $conexion->errno, $this->conexion->error );
    }

    protected function verificaDatosNulos( $data, $keys )  {
        $rsp = 
        array( 'msj' => 'Los siguientes campos se encuentran nulos:', 
                'eventos' => array() );

        if ( !empty( $data ) && !empty( $keys ) ) 
        {
            $state = true;
            
            foreach ( $keys as $key ) 
            {                             
                $val = $data[ $key ][ 'valor' ];
                $array = $data[ $key ];                    

                if( empty( $array ) )
                {
                    $state = false;
                    $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $key, 'msj' => 'Campo vacío', 'key' => $key );
                }
                else if ( isset( $val ) && empty( $val ) ) 
                {
                    $state = false;
                    $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $key, 'msj' => 'Campo vacío', 'key' => $key );
                }          
            }
        } 

        else
            $rsp[ 'msj' ] = 'No existen datos o nombre de datos';

            return $state === true ? 
                'OK' : $rsp;
    }

    public function multi_array_unique( $arr, $campo ) {
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

    # retorna el numero de error de mysql y lo asocia con el mensaje correspondiente
    protected function returnError( $noError, $error ) {
        switch ( $noError )
        {
            case 1005:
                return "Error ".$noError.".\nNo se puede crear la tabla debido a una restricción de clave foránea incorrectamente formulada.";
                break;
                
            case 1044:
                return "Error ".$noError.".\nAcceso denegado para el usuario";
                break;

            case 1045:
                return "Error ".$noError.".\nAcceso denegado para el usuario: ".$this->usuario.", no cuenta con los privilegios necesarios";
                break;

            case 1054:
                return "Error ".$noError.".\nColumna desconocida";
                break;

            case 1062:
                return "Error ".$noError.".\nEntrada duplicada";
                break;            

            case 1064:
                return "Error ".$noError.".\nError de sintaxis SQL";
                break;

            case 1065:
                return "Error ".$noError.".\nLa consulta se encuentra vacia";
                break;

            // case 1133:
            //     return "Error ".$noError.".\n".$error;
            //     break;                

            case 1136:
                return "Error ".$noError.".\nEl número de columnas no corresponde al número en la línea";
                break;

            case 1142:
                return "Error ".$noError.".\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes";
                break;                

            case 1146:
                return "Error ".$noError.".\nNo existe la tabla solicitada";
                break;

            case 1227:
                return "Error ".$noError.".\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes";
                break;                

            case 1265:
                return "Error ".$noError.".\nDatos truncados para columna";
                break;        

            case 1364:
                return "Error ".$noError.".\n El valor no puede ser nulo";
                break;

            // case 1396:
            //     return "Error ".$noError.".\nOperacion fallada";
            //     break;

            case 1406:
                return "Error ".$noError.".\n Dato demasiado largo para el tamaño de la columna";
                break;

            case 1451:
                return "Error ".$noError.".\nNo se puede eliminar elemento del que dependen registros";
                break;

            case 1452:
                return "Error ".$noError.".\nNo se puede eliminar, actualizar o crear elemento sin elemento padre disponible";
                break;

            default:
                return "Error desconocido ".$noError.".\n".$error;
                break;
        }    
    }

    /**
     * [beetwen description]
     * Evalua si un número entero, flotante o string (numero dentro un string)
     * se encuentra en un rango. El rango es definido por el parametro
     * numero 2 (param1) y el parametro numero 3 (param2), no importa si
     * param2 sea el rango inferior o superior, o si param3 sea inferior
     * o superior. El rango (inferior y superior) lo determina la funcion
     * internamente.
     * Ejemplo 1: beetwen( -10.2899, -5.26, -10.29 )
     * Retorno 1: true
     * Ejemplo 2: beetwen( -10.2899, -10.29, -5.26 )
     * Retorno 2: true
     * @param  [double] [$target] valor a ser evaluado dentro del rango
     * establecido
     * @param  [double] [$rango]  rango numero 1 definido para evaluarse
     * si es el menor o el mayor.
     * @param  [double] [$rango_] rango numero 2 definido para evaluarse
     * si es el menor o el mayor
     * @return [boolean] retorna [true] si el dato a evaluar esta dentro
     * rango o [false] si sucede lo contrario
     */
    protected function beetwen( $target, $rango, $rango_ ) {
        /* Determinamos cual de los dos datos es menor y mayor
         * repectivamente        
         */
        $v1 = doubleval( $rango );
        $v2 = doubleval( $rango_ );

        if ( $v1 < $v2 ) {
            $min = $v1;
            $max = $v2;
        } else {
            $min = $v2;
            $max = $v1;
        }

        $target = doubleval( $target );

        return ( $target >= $min && $target <= $max );
    }

    protected function indexof( $arr, $target, $field = NULL ) {
        if ( !is_array( $arr ) ) return -1;

        $i = 0;
        $lon = sizeof( $arr );

        # arreglo con asociativo
        if ( $field !== NULL ) { 
            for( $i; $i < $lon; $i++ ) {
                $row = $arr[ $i ];
                if ( $target == $row[ $field ] ) return $i;
            }
            return -1;
        }

        # arreglo numerico
        else { 
            for( $i; $i < $lon; $i++ ) {
                $row = $arr[ $i ];
                if ( $target == $row ) return $i;
            }
            return -1;
        }
    }

    protected function struct_tabla ( $head, $data ) {
        $html = 
            '<table cellspacing="0" cellpadding="1" border="1" >'.
                '<thead>'.
                '<tr style="background-color:#009300;color:#000000;">';
            foreach ( $head as $row ) {
                $width = empty( $row[ 'x' ] ) ? '' : ' width="'.$row[ 'x' ].'" ';
                $titulo = $row[ 'titulo' ];
                $html .= 
                    '<th '.$width.'>'.$titulo.'</th>';
            }
        $html .=
                '</tr>'.
                '</thead>'.
                '<tbody>';

        if ( empty( $data ) ) return $html." <tbody></tbody></table>";

        foreach( $data as $fila ) 
        {
            $html .=
                '<tr>';
            foreach ( $head as $row ) {
                $campo = $row[ 'campo' ];
                $texto = $fila[ $campo ];
                $width = empty( $row[ 'x' ] ) ? '' : ' width="'.$row[ 'x' ].'" ';
                $html .= 
                    '<td '.$width.'>'.$texto.'</td>';
            }
            $html .=
                '</tr>';
        }

        $html .=
                '</tbody>'.
            '</table>';
        return $html;
    }

    protected function __retorna_id_orden_trabajo_original( $id_orden_trabajo ) {
        # verificamos si la orden esta reprogramada
        # si lo esta utilizamos el ID original
        $sql =
        "SELECT id_orden_reprog FROM programacion_mtto ".
        "WHERE id_orden_trabajo = $id_orden_trabajo";
        $query = $this->query( $sql, 'id_orden_reprog', NULL ); 
        return !empty( $query ) ? $query : $id_orden_trabajo;
    }
}