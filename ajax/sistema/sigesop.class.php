<?php
set_include_path( 'E:\Documents\GitHub\sigesop\ajax' );
require_once 'Carbon/Carbon.php';
use Carbon\Carbon;

class sigesop {
    public $conexion;
    # conexion a la base de datos mysql
    public $conexionMySQL;
    # Conexion con usuario interno para el control de
    # rutinas que necesitan de permisos totales en
    # la base de datos laventa_cfe
    public $conexionControlInterno;
    public $errnoRoot;
    public $estadoConexion               = false; # conexion satisfactoria para cualquier usuario registrado
    public $estadoConexionMysql          = false;
    public $estadoConexionRoot           = false; # conexion satisfactoria para usuario root de mysql
    public $estadoConexionControlInterno = false;

    public $solo_lectura     = array( 'N/A' ); # elementos de solo lectura
    public $path_carbon      = '';
    public $path_pear        = 'E:\Documents\GitHub\sigesop\ajax\pear';
    public $path_file_pear   = 'Spreadsheet/Excel/Writer.php';
    public $path_pdf         = '';
    public $path_file_pdf    = '../tcpdf/tcpdf.php';
    public $path_user_manual = '../../docs/sistema de_gestion_operativa_manual_usuario.pdf';

    # configuraciones del servidor
    public $serverRoot  = 'http://laventa.cfe.local/';
    public $host        = 'localhost';
    public $db          = 'laventa_cfe';
    public $root        = 'root'; # superusuario con clave encriptada con algoritmo SHA1
    public $usuario, $clave;

    # usuario y password (SHA1) para el usuario
    # de control interno.
    public $usuarioControlInterno = '__session';
    public $passControlInterno    = '162bed2fa894a934c3120893c9332c51cc4a5f43';

    # Estructura de datos para generar las asociaciones
    # adecuadas entre las vistas y roles de usuario
    public $matrizAreaAcceso = array(
        array( 'id_area_acceso' => 1,  'nivelBarra' => 1, 'paginaAcceso' => 'status.php', 'nombrePagina' => 'Estatus' ),
        array( 'id_area_acceso' => 2,  'nivelBarra' => 2, 'paginaAcceso' => 'rol_usuario.php', 'nombrePagina' => 'Roles de Usuario' ),
        array( 'id_area_acceso' => 3,  'nivelBarra' => 2, 'paginaAcceso' => 'area_trabajo.php', 'nombrePagina' => 'Áreas de Trabajo' ),
        array( 'id_area_acceso' => 4,  'nivelBarra' => 2, 'paginaAcceso' => 'usuarios.php', 'nombrePagina' => 'Usuarios' ),
        array( 'id_area_acceso' => 5,  'nivelBarra' => 2, 'paginaAcceso' => 'gestion_central.php', 'nombrePagina' => 'Gestión de la Central' ),
        array( 'id_area_acceso' => 6,  'nivelBarra' => 2, 'paginaAcceso' => 'unidades.php', 'nombrePagina' => 'Unidades' ),
        array( 'id_area_acceso' => 7,  'nivelBarra' => 2, 'paginaAcceso' => 'aerogeneradores.php', 'nombrePagina' => 'Aerogeneradores' ),
        array( 'id_area_acceso' => 8,  'nivelBarra' => 2, 'paginaAcceso' => 'sistemas.php', 'nombrePagina' => 'Sistemas' ),
        array( 'id_area_acceso' => 9,  'nivelBarra' => 2, 'paginaAcceso' => 'equipos.php', 'nombrePagina' => 'Equipos' ),
        array( 'id_area_acceso' => 10, 'nivelBarra' => 2, 'paginaAcceso' => 'materiales.php', 'nombrePagina' => 'Materiales' ),
        array( 'id_area_acceso' => 11, 'nivelBarra' => 2, 'paginaAcceso' => 'unidad_medida.php', 'nombrePagina' => 'Unidades de Medida' ),
        array( 'id_area_acceso' => 12, 'nivelBarra' => 2, 'paginaAcceso' => 'tipo_mtto.php', 'nombrePagina' => 'Tipos de Mantenimiento' ),
        array( 'id_area_acceso' => 13, 'nivelBarra' => 2, 'paginaAcceso' => 'lista_verificacion.php', 'nombrePagina' => 'Listas de Verificación' ),
        array( 'id_area_acceso' => 14, 'nivelBarra' => 3, 'paginaAcceso' => 'creacion_orden_trabajo.php', 'nombrePagina' => 'Creación de Orden de Trabajo' ),
        array( 'id_area_acceso' => 15, 'nivelBarra' => 3, 'paginaAcceso' => 'captura_orden_trabajo.php', 'nombrePagina' => 'Captura de Orden de Trabajo' ),
        array( 'id_area_acceso' => 16, 'nivelBarra' => 4, 'paginaAcceso' => 'consecutivo_licencia.php', 'nombrePagina' => 'Consecutivo de Licencias' ),
        array( 'id_area_acceso' => 17, 'nivelBarra' => 4, 'paginaAcceso' => 'libro_relatorio.php', 'nombrePagina' => 'Libro Relatorio' )
    );

    /***************************************************FUNCIONES INTERNAS***************************************************/

    function sigesop ( $usuario, $clave ) {
        // Guardamos las variables para uso interno
        $this->usuario = $usuario;
        $this->clave   = $clave;
        # Abrimos la conexion para la base de datos de
        # laventa_cfe y mysql para el usuario que inicia
        # la sesion
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

    # DEPRECATED -------------------------------------------
    # simula un autoincremento
    protected function autoincrement( $sql, $fetch_assoc ) {
        $arr = $this->array_query( $sql, $fetch_assoc, 0 );
        return $arr[ sizeof( $arr ) - 1 ] + 1;
    }

    # simula un autoincremento
    protected function auto_increment( $table, $key ) {
        if ( empty( $table ) || empty( $key ) ) return NULL;
        $sql = "SELECT ".$key." FROM ".$table." ORDER BY ".$key." DESC LIMIT 1";
        $query = $this->query( $sql, $key, NULL );
        return $query + 1;
    }

    # Realiza la conexion a la base de datos de MySQL
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
        # verificamos y abrimos conexionControlInterno
        if ( !empty( $this->usuarioControlInterno ) &&
             !empty( $this->passControlInterno) )
        {
            # Abrimos una conexion a control Interno
            # y verificamos conexion
            $this->conexionControlInterno =
                new mysqli( $this->host,
                            $this->usuarioControlInterno,
                            $this->passControlInterno,
                            $this->db );

            if ( !mysqli_connect_errno() ) {
                $this->conexionControlInterno->autocommit( false );
                $this->estadoConexionControlInterno = true;
            }

            else {
                echo "<h1>Error!!! Conexion a usuario de control interno fallada</h1>";
                return  false;
            }
        }
        else {
            echo "<h1>Error!!! Usuario de control interno no definido</h1>";
            return false;
        }

        # comprobamos si es un usuario root o no
        if ( $usuario != $this->root ) {
            $this->conexion =
                new mysqli( $this->host,
                            $usuario,
                            $clave,
                            $this->db );

            if( !mysqli_connect_errno() ) {
                # deshabilitamos el autocommit
                $this->conexion->autocommit( false );

                # consulta para verificar si el usuario existe
                # en la tabla personal de la base de datos laventa_cfe
                $usr = $this->checkUserInsideLaVenta( $usuario );
                if( $usr ) {
                    $this->estadoConexion = true;

                    # Abrimos una conexion a MYSQL y verificamos conexion
                    $this->conexionMySQL =
                        new mysqli( $this->host, $usuario, $clave, 'mysql' );

                    if ( !mysqli_connect_errno() ) {
                        $this->conexionMySQL->autocommit( false );
                        $this->estadoConexionMysql = true;
                    }
                    else $this->estadoConexionMysql = false;
                }
            }
            else {
                $this->estadoConexion = false;
                $this->estadoConexionMysql = false;
            }
        }

        # como no existe [root] en LAVENTA verificamos en subrutina
        else $this->checkRoot( $clave, $usuario );
    }

    # Verifica si un usuario existe en la base de datos
    # de MySQL
    protected function checkUserInsideMysql( $usuario ) {
        $sql = "SELECT user FROM user WHERE user = '$usuario'";
        $user = $this->array_query( $sql, 'user', null, true );
        return $user[0] == $usuario ? true : false;
    }

    # Verifica si un usuario existe en la base de datos
    # de laventa_cfe
    protected function checkUserInsideLaVenta( $usuario ) {
        $sql = "SELECT nombre_usuario FROM personal WHERE nombre_usuario = '$usuario'";
        $user = $this->query( $sql, 'nombre_usuario' );
        return $user != null ?
            ( $user == $usuario ? true : false ) : false;
        // return $user;
    }

    # verifica si el usuario que abrio la conexion tiene acceso
    # a una vista del sistema
    public function accesoPagina( $paginaAcceso ) {
        # verificamos que tenga acceso root
        if ( $this->usuario == $this->root && $this->estadoConexionRoot )
            return true;

        # verificamos que el usuario exista en la tabla user de mysql
        if ( !$this->estadoConexion ) return false;

        # consultamos las paginas a las que tiene acceso
        $sql =  "SELECT id_area_acceso ".
                "FROM acceso_rol ar ".
                    "INNER JOIN personal p ".
                    "ON p.clave_rol = ar.clave_rol ".
                "WHERE p.nombre_usuario = '".$this->usuario."'";

        $data = $this->array_query( $sql, 'id_area_acceso' );

        foreach ( $data as $id_area_acceso ) {
            foreach ( $this->matrizAreaAcceso as $row ) {
                if ( $row[ 'id_area_acceso' ] == $id_area_acceso 
                     && $row[ 'paginaAcceso' ] == $paginaAcceso ) {
                    return true;
                }
            }            
        }

        return false;        
    }

    # retorna un unico dato de la primera fila
    protected function query( $sql, $fetch_assoc = false, $valorNulo = null, $type = false ) {
        # por defecto: conexion de usuario normal
        # verdadero: conexion a tablas mysql
        $conexion = $type === false ?
            $this->conexion : ( $type === true ? $this->conexionMySQL : $this->conexionControlInterno );

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
        $conexion = $type === false ?
            $this->conexion : ( $type === true ? $this->conexionMySQL : $this->conexionControlInterno );

        $arr = array();
        if( $query = $conexion->query( $sql ) ) {
            while ( $data = $query->fetch_assoc() ) {
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
        $conexion = $type === false ?
            $this->conexion : ( $type === true ? $this->conexionMySQL : $this->conexionControlInterno );

        if ( $query = $conexion->query( $sql ) ) return 'OK';
        else return $this->returnError( $conexion->errno, $this->conexion->error );
    }

    # valida que los datos provinientes del cliente contenga
    # informacion
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

    # retorna el numero de error de mysql y lo asocia con
    # el mensaje correspondiente
    protected function returnError( $noError, $error ) {
        switch ( $noError )
        {
            case 1005:
                return "Error ".$noError.".\nNo se puede crear la tabla debido a una restricción de clave foránea incorrectamente formulada.";
                break;

            case 1044:
                return "Error ".$noError.".\nAcceso denegado para el usuario.";
                break;

            case 1045:
                return "Error ".$noError.".\nAcceso denegado para el usuario: ".$this->usuario.", no cuenta con los privilegios necesarios.";
                break;

            case 1054:
                return "Error ".$noError.".\nColumna desconocida.";
                break;

            case 1062:
                return "Error ".$noError.".\nEntrada duplicada.";
                break;

            case 1064:
                return "Error ".$noError.".\nError de sintaxis SQL.";
                break;

            case 1065:
                return "Error ".$noError.".\nLa consulta se encuentra vacia.";
                break;

            case 1133:
                return "Error ".$noError.".\nNo se puede encontrar ninguna coincidencia en la tabla [user].";
                break;

            case 1136:
                return "Error ".$noError.".\nEl número de columnas no corresponde al número en la línea.";
                break;

            case 1142:
                return "Error ".$noError.".\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes.";
                break;

            case 1146:
                return "Error ".$noError.".\nNo existe la tabla solicitada.";
                break;

            case 1227:
                return "Error ".$noError.".\nAccion negada para usuario: \"". $this->usuario ."\". No cuenta con los privilegios suficientes.";
                break;

            case 1265:
                return "Error ".$noError.".\nDatos truncados para columna.";
                break;

            case 1364:
                return "Error ".$noError.".\n El valor no puede ser nulo.";
                break;

            // case 1396:
            //     return "Error ".$noError.".\nOperacion fallada";
            //     break;

            case 1406:
                return "Error ".$noError.".\n Dato demasiado largo para el tamaño de la columna.";
                break;

            case 1451:
                return "Error ".$noError.".\nNo se puede eliminar elemento del que dependen registros.";
                break;

            case 1452:
                return "Error ".$noError.".\nNo se puede eliminar, actualizar o crear elemento sin elemento padre disponible.";
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

    # Estructura una tabla en HTML que servirá para
    # crear los reportes en PDF
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

    # estuctura los valores numericos [ hour, min, seg ] a una cadena
    # de tiempo formateada: 00:00:00
    protected function __struct_string_time ( $hour = '00', $min = '00', $seg = '00' ) {
        if( strlen( $hour ) == 1 )
            $hour = "0".$hour;

        if( strlen( $min ) == 1 )
            $min = "0".$min;

        if( strlen( $seg ) == 1 )
            $seg = "0".$seg;

        return $hour . ":" . $min . ":" . $seg;
    }

    ############################################################
    ## Estas son funciones que se usan en las clases:         ##
    ##   [matenimiento, operacion]                            ##
    ############################################################

    # Retorna la id_orden_trabajo que fue asignada originalmente
    # ya que el id_orden_trabajo cambia cuando la orden de trabajo
    # ha sido reprogramada
    protected function __retorna_id_orden_trabajo_original( $id_orden_trabajo ) {
        # verificamos si la orden esta reprogramada
        # si lo esta utilizamos el ID original
        $sql =
        "SELECT id_orden_reprog FROM programacion_mtto ".
        "WHERE id_orden_trabajo = $id_orden_trabajo";
        $query = $this->query( $sql, 'id_orden_reprog', NULL, 'controlInterno' );
        return !empty( $query ) ? $query : $id_orden_trabajo;
    }

    # Reprograma una orden de trabajo en base a la fecha actual
    protected function __reprogramacion_fecha () {
        # obtenemos todas las ordenes que estan activas
        $sql =
        "SELECT t_ot.id_prog_mtto, t_pm.id_orden_trabajo, ".
            "t_pm.id_orden_reprog ".
        "FROM orden_trabajo t_ot ".
        "INNER JOIN programacion_mtto t_pm ".
        "ON t_ot.id_prog_mtto = t_pm.id_prog_mtto ".
        # que la tabla [orden_trabajo] siga activa
        "WHERE t_ot.estado_asignado IS NULL ".
        # que la orden de trabajo programada este [ACTIVO]
        "AND t_pm.estado_asignado = 'ACTIVO'";

        // return $sql;

        $today = Carbon::now( 'America/Mexico_City' )->timestamp;
        $arr_ordenes = $this->array_query( $sql, false, NULL, 'controlInterno' );
        // return $arr_ordenes;

        # recorriendo ordenes activas
        foreach ( $arr_ordenes as $orden_activa ) {
            $id_prog_mtto = $orden_activa[ 'id_prog_mtto' ];
            // $id_orden_trabajo_origin = $orden_activa[ 'id_orden_trabajo' ];

            # evitamos que se reasignen el id_orden_reprog
            $id_orden_trabajo_origin = !empty( $orden_activa[ 'id_orden_reprog' ] ) ?
                $orden_activa[ 'id_orden_reprog' ]:
                $orden_activa[ 'id_orden_trabajo' ];

            # obtenemos todas las fechas que estan programadas
            # asi obtener la fecha más proxima en relacion a la fecha actual
            $sql =
            "SELECT id_orden_trabajo, id_prog_mtto, ".
            "fecha_final, estado_asignado ".
            "FROM programacion_mtto ".
            # filtramos todas las ordenes de trabajo con [id_prog_mtto]
            # y asi obtener el bloque completo de la programacion
            "WHERE id_prog_mtto = $id_prog_mtto ".

            # buscamos del bloque de programaciones a la siguiente orden
            # de trabajo que tiene una fecha mayor a la orden que se
            # encuentra [ACTIVA]
            "AND fecha_inicial >= ( ".
                "SELECT fecha_inicial ".
                "FROM programacion_mtto ".
                "WHERE estado_asignado = 'ACTIVO' ".
                "AND id_prog_mtto = $id_prog_mtto ".
            ") ".
            # y que ademas no sea una orden que se encuentre con el
            # estatus: [REPROGRAMADA, ACTIVA, FINALIZADA]
            "AND ( estado_asignado IS NULL OR estado_asignado = 'ACTIVO' ) ".
            "ORDER BY fecha_inicial ASC ";

            // "SELECT fecha_final, estado_asignado, ".
            // "id_orden_trabajo, id_orden_reprog ".
            // "FROM programacion_mtto ".
            // "WHERE id_prog_mtto = $id_prog_mtto ".
            // "ORDER BY fecha_inicial ASC";

            // return $sql;
            $arr_repro = $this->array_query( $sql, false, NULL, 'controlInterno' );
            // return $arr_repro;

            # recorremos las fechas programadas
            $i = 0;
            $lon = sizeof( $arr_repro );
            for( $i ; $i < $lon; $i++ ) {
                $id_orden_trabajo = $arr_repro[ $i ][ 'id_orden_trabajo' ];
                $estado_asignado = $arr_repro[ $i ][ 'estado_asignado' ];
                $fecha_1 = $arr_repro[ $i ][ 'fecha_final' ];
                $fecha_final = Carbon::parse( $fecha_1, 'America/Mexico_City' )->timestamp;

                # mientras no sea la ultima orden
                if ( $i < ( $lon - 1 ) ) {
                    # Si la fecha final de la orden de trabajo
                    # es menor a la fecha del momento
                    # cambiamos el estado de la orden de trabajo
                    # a [REPROGRAMADO]
                    if  ( $fecha_final < $today ) {
                        # Cambiamos el estado a [REPROGRAMADO] y
                        # guardamos el [id_orden_trabajo]
                        $sql =
                        "UPDATE programacion_mtto ".
                        "SET id_orden_reprog = $id_orden_trabajo_origin, ".
                        "estado_asignado = 'REPROGRAMADO' ".
                        "WHERE id_orden_trabajo = $id_orden_trabajo";

                        $query = $this->insert_query( $sql, 'controlInterno' );
                    }

                    # Activamos la nueva orden
                    else if ( $fecha_final >= $today ) {
                        $sql =
                        "UPDATE programacion_mtto ".
                        "SET id_orden_reprog = $id_orden_trabajo_origin, ".
                        "estado_asignado = 'ACTIVO' ".
                        "WHERE id_orden_trabajo = $id_orden_trabajo";

                        $query = $this->insert_query( $sql, 'controlInterno' );

                        if ( $query === 'OK' ) $this->conexionControlInterno->commit();
                        else $this->conexionControlInterno->rollback();

                        # si llegamos a la orden activa
                        # rompemos el ciclo
                        break;
                    }
                }

                # extremo, orden final programada
                # aunque la fecha se vaya aplazando y ya no existan
                # mas fechas programadas, la orden se mantendrá
                # activa hasta que sea cerrada
                else {
                    $sql =
                    "UPDATE programacion_mtto ".
                    "SET id_orden_reprog = $id_orden_trabajo_origin, ".
                    "estado_asignado = 'ACTIVO' ".
                    "WHERE id_orden_trabajo = $id_orden_trabajo";

                    // return $sql;

                    $query = $this->insert_query( $sql, 'controlInterno' );
                    if ( $query === 'OK' ) $this->conexionControlInterno->commit();
                    else $this->conexionControlInterno->rollback();

                    # si llegamos a la orden activa
                    # rompemos el ciclo
                    break;
                }
            }
        }
    }

    # Verifica que todas las actividades de una lista de
    # verificacion hayan sido completadas y tengan datos
    # retorna [OK] o la cantidad de actividades faltantes
    protected function __verificar_datos_actividad ( $id_orden_trabajo, $id_lista_verificacion ) {
        # consultamos cuantas actividades no tienen datos registrados
        // $sql =
        // "SELECT COUNT(av.id_actividad_verificar) AS actividades_sin_datos ".
        // "FROM orden_trabajo ot ".

        // "INNER JOIN lista_verificacion lv ".
        // "ON ot.id_mantenimiento = lv.id_mantenimiento ".

        // "INNER JOIN actividad_verificar av ".
        // "ON lv.id_lista_verificacion = av.id_lista_verificacion ".

        // "LEFT JOIN datos_actividad da ".
        // "ON av.id_actividad_verificar = da.id_actividad ".

        // "WHERE ot.id_prog_mtto = $id_prog_mtto ".
        // "AND da.id_datos_actividad IS NULL";

        $sql =
            "SELECT COUNT( id_actividad_verificar ) AS actividades_sin_datos ".
            "FROM actividad_verificar ".

            "WHERE id_lista_verificacion = $id_lista_verificacion ".
            "AND id_actividad_verificar NOT IN ( ".
                "SELECT id_actividad_verificar ".
                "FROM orden_trabajo_actividad ".
                "WHERE id_orden_trabajo = $id_orden_trabajo ".
            ")";

        // return $sql;
        $actividades_sin_datos = $this->query( $sql, 'actividades_sin_datos', NULL );

        if ( $actividades_sin_datos == 0 ) return 'OK';
        else return $actividades_sin_datos;
            // return  "No se han completado la captura de datos ".
            //         "de la lista de verificación. Existen: $actividades_sin_datos ".
            //         "actividades sin capturar";
    }
}