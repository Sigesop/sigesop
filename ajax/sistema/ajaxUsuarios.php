<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxUsuarios extends funcionesPrimarias
{	
    private $matrizPermisoAcceso = array(
        0 => array('idPermiso' => 'select', 'descripcion' => 'Consulta a datos'),
        1 => array('idPermiso' => 'insert', 'descripcion' => 'Inserción de datos'),
        2 => array('idPermiso' => 'update', 'descripcion' => 'Actualización de datos'),
        3 => array('idPermiso' => 'delete', 'descripcion' => 'Eliminacion de datos'),
        4 => array('idPermiso' => 'create', 'descripcion' => 'Creación de nuevas tablas'),
        5 => array('idPermiso' => 'create user', 'descripcion' => 'Creación de nuevos usuarios'),
        6 => array('idPermiso' => 'alter', 'descripcion' => 'Alteración de tablas'),
        7 => array('idPermiso' => 'drop', 'descripcion' => 'Eliminación de tablas'),
        8 => array('idPermiso' => 'all', 'descripcion' => 'Permisos de administración de la Base de datos')
    );

	public function __construct($host, $usuario, $clave, $baseDatos)
	{
		parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
	}

	public function solicitudAjax( $accion, $post, $get )
	{
		switch ( $accion )
		{
            case 'actualizarAreaTrabajo':
                $actualizarAreaTrabajo = $this->actualizarAreaTrabajo( $post );
                echo json_encode( $actualizarAreaTrabajo );
                break;
            case 'actualizarRolUsuario':
                $actualizarRolUsuario = $this->actualizarRolUsuario( $post );
                echo json_encode( $actualizarRolUsuario );
                break; 
            // Actualiza la informacion del usuario
            case 'actualizarUsuario':
                $actualizarUsuario = $this->actualizarUsuario( $post );
                echo json_encode($actualizarUsuario);
                break;

            case 'eliminarAreaTrabajo':
                $eliminarAreaTrabajo = $this->eliminarAreaTrabajo( $get );
                echo json_encode( $eliminarAreaTrabajo );
                break;

            case 'eliminarRolUsuario':
                $eliminarRolUsuario = $this->eliminarRolUsuario( $get );
                echo json_encode( $eliminarRolUsuario );
                break;

            case 'eliminarUsuario':
                $eliminarUsuario = $this->eliminarUsuario( $get );
                echo json_encode($eliminarUsuario);
                break;

            case 'nuevaAreaTrabajo':
                $nuevaAreaTrabajo = $this->nuevaAreaTrabajo( $post );
                echo json_encode($nuevaAreaTrabajo);
                break;

            case 'nuevoRolUsuario':
                $query = $this->nuevoRolUsuario( $post );
                echo json_encode( $query );
                break;

            case 'nuevoUsuario':
                $nuevoUsuario = $this->nuevoUsuario( $post );
                echo json_encode($nuevoUsuario);
                break;

            case 'obtenerAreasAcceso':
                $obtenerAreasAcceso = $this->obtenerAreasAcceso();
                echo json_encode( $obtenerAreasAcceso );
                break;

            case 'obtenerAreaTrabajo':
                $obtenerAreaTrabajo = $this->obtenerAreaTrabajo();
                echo json_encode($obtenerAreaTrabajo);
                break;

            case 'obtenerPermisoAcceso':
                $obtenerPermisoAcceso = $this->obtenerPermisoAcceso();
                echo json_encode( $obtenerPermisoAcceso );
                break;

            case 'obtenerTipoRolUsuario':
                $obtenerTipoRolUsuario = $this->obtenerTipoRolUsuario();
                echo json_encode($obtenerTipoRolUsuario);
                break;                               

            case 'obtenerUsuarios':
                $obtenerUsuarios = $this->obtenerUsuarios();
                echo json_encode( $obtenerUsuarios );
                break;

            default:
                echo json_encode('Funcion no registrada en la clase ajaxUsuarios');
                break;
		}
	}

    // ---------- nuevaAreaTrabajo -------------------------------------------------------------------

    private $datosAreaTrabajo = array(
        'claveAreaTrabajo', 'descripcionAreaTrabajo'
    );

    public function nuevaAreaTrabajo( $data ) 
    {
        // ---------- verificamos las conexiones a las bases de datos

        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $flagValidacion = $this->verificaDatosNulos( $data, $this->datosAreaTrabajo );

        if ( $flagValidacion === 'OK' ) 
        {
            $claveAreaTrabajo = $data['claveAreaTrabajo']['valor'];
            $descripcionAreaTrabajo = $data['descripcionAreaTrabajo']['valor'];

            $sql = "insert into area_trabajo values( '$claveAreaTrabajo', '$descripcionAreaTrabajo' )";        
            $insertaAreaTrabajo = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ($insertaAreaTrabajo === 'OK') 
            {                
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $insertaAreaTrabajo.'. Error al insertar Área de trabajo';
            }


        } 
        else return 'NA';
    }

    // -----------------------------------------------------------------------------------------------

    // esta funcion crea una sentencia SQL trucada para asignar los permisos seleccionados en el formulario
    function nuevoRolUsuario( $data ) 
    {
        $rolUsuario =  $data['nombreRol']['valor'];
        $descripcionRol =  $data['descripcionRol']['valor'];

        // ---------- matriz de datos

        $matrizAreaAcceso = $data['matrizAreaAcceso'];
        $matrizPermisoAcceso = $data['matrizPermisoAcceso'];

        // return $matrizPermisoAcceso;

        $flagValidacion = true;
        empty( $rolUsuario ) ? $flagValidacion = false : null;
        empty( $descripcionRol ) ? $flagValidacion = false : null;
        empty( $matrizAreaAcceso ) ? $flagValidacion = false : null;
        empty( $matrizPermisoAcceso ) ? $flagValidacion = false : null;

        if($flagValidacion)
        {
            $SQL_insertaRol = "insert into roles values('$rolUsuario', '$descripcionRol')"; 
            $transaccion = $this->consultaInsercionSimple( 'begin', $this->conexion );
            if ($transaccion == 'OK') {
            
                $insertaRol = $this->consultaInsercionSimple($SQL_insertaRol, $this->conexion);
                if ($insertaRol == 'OK') {

                    foreach ($matrizPermisoAcceso as $fila) {
                        $SQL_insertaPermiso = "insert into permiso_rol values('$rolUsuario', '$fila')"; 

                        $insertaPermiso = $this->consultaInsercionSimple($SQL_insertaPermiso, $this->conexion);
                        if ($insertaPermiso != 'OK') {
                            $finTransaccion = $this->consultaInsercionSimple('rollback', $this->conexion);
                            return $insertaPermiso.'. Error al insertar permisos de usuario';
                        }
                    }

                    foreach ($matrizAreaAcceso as $fila) {

                        foreach ($this->matrizAreaAcceso as $filaNivel) {
                            if ($filaNivel['paginaAcceso'] == $fila) {
                                $nivelBarra = $filaNivel['nivelBarra'];
                                $nombreBarra = $filaNivel['nombrePagina'];
                            }
                        }

                        $SQL_insertaAreaAcceso = "insert into acceso_rol values('$rolUsuario', $nivelBarra, '$nombreBarra', '$fila')"; 

                        $insertaAreaAcceso = $this->consultaInsercionSimple($SQL_insertaAreaAcceso, $this->conexion);
                        if ($insertaAreaAcceso != 'OK') {
                            $finTransaccion = $this->consultaInsercionSimple('rollback', $this->conexion);
                            return $insertaAreaAcceso.'. Error al insertar acceso de pagina';
                        }
                    }  

                    $finTransaccion = $this->consultaInsercionSimple('commit', $this->conexion);
                    return 'OK';
                    
                } else {
                    $finTransaccion = $this->consultaInsercionSimple('rollback', $this->conexion);
                    return $insertaRol.'. Error al insertar Rol en la base de datos';
                }
                
            } else return $transaccion.'. Error al iniciar la transacción';

        } else return 'NA';       
    }

    // ---------- nuevoUsuario -----------------------------------------------------------------------

    private $datosUsuario = array(
        'nombreUsuario', 'apellidosUsuario', 'RPEusuario',
        'usuario', 'claveUsuario', 'areaTrabajo', 'rolUsuario'
    );

    public function nuevoUsuario( $data ) 
    {
        // ---------- verificamos las conexiones a las bases de datos

        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        // ---------- definimos los campos que deseamos validar provenientes de POST

        $flagValidacion = $this->verificaDatosNulos( $data, $this->datosUsuario );

        if( $flagValidacion == 'OK' )
        {    
            $nombre = $data['nombreUsuario']['valor'];
            $apellidos = $data['apellidosUsuario']['valor'];
            $rpeUsuario = $data['RPEusuario']['valor'];
            $usuario = $data['usuario']['valor'];
            $password = $data['claveUsuario']['valor'];
            $areaTrabajoUsuario = $data['areaTrabajo']['valor'];
            $rolUsuario = $data['rolUsuario']['valor']; 

            $matrizDatosUsuario = array(
                'nombreUsuario' => $nombre,
                'apellidosUsuario' => $apellidos,
                'RPEusuario' => $rpeUsuario,
                'usuario' => $usuario,
                'claveUsuario' => $password,
                'areaTrabajo' => $areaTrabajoUsuario,
                'rolUsuario' => $rolUsuario
            );
          
            // ---------- verificamos la existencia del usuario en las bases de datos laventa_cfe y mysql

            $flagMysql = $this->checkUserInsideMysql( $usuario, $this->conexionMySQL );
            $flagLaVenta = $this->checkUserInsideLaVenta( $usuario, $this->conexion );

            if ( $flagMysql && $flagLaVenta )
            {
                return 'El usuario solicitado ya existe en la base de datos';
            } 
            else if ( $flagMysql && !$flagLaVenta ) 
            {
                // --------- eliminamos el usuario de mysql ya que no existe en laventa_cfe

                $dropUser = $this->__dropUser( $usuario, $this->conexionMySQL );                
                if ( $dropUser == 'OK' ) $flagInsercion = true;
                    else return $dropUser;
            }            
            else if ( !$flagMysql && $flagLaVenta )
            {
                // -------- si existe en laventa_cfe pero no en mysql hay que reasignarle el usuario y los permisos conforme al rol recibido

                $usuarioMysql = $this->__createUser( $usuario, $password, $rolUsuario, $this->conexion, $this->conexionMySQL );
                if ( $usuarioMysql == 'OK' )
                {
                    $this->conexionMySQL->commit();
                    return 'OK';
                }
                else
                {
                    $this->conexionMySQL->rollback();
                    return $respuesta;
                }

                return 'El usuario solicitado ya existe en la base de datos';
            }
            else if ( !$flagMysql && !$flagLaVenta ) $flagInsercion = true;

            if ( $flagInsercion ) 
            {
                // --------------- Creando usuario en Mysql

                $usuarioMysql = $this->__createUser( $usuario, $password, $rolUsuario, $this->conexion, $this->conexionMySQL );
                if ( $usuarioMysql !== 'OK' ) 
                {
                    $this->conexion->rollback();
                    $this->conexionMySQL->rollback();
                    return $usuarioMysql;
                }   
                              
                // --------------- Creando usuario en laventa_cfe                

                $usuarioLaventa = $this->__createUsuario( $matrizDatosUsuario, $this->conexion );
                if ( $usuarioLaventa === 'OK' ) 
                {
                    $this->conexion->commit();
                    $this->conexionMySQL->commit();
                    return 'OK';
                }
                else
                {
                    $this->conexion->rollback();
                    $this->conexionMySQL->rollback();
                    return $usuarioLaventa;                    
                }                    
            }
        } 
        else return $flagValidacion; 
    }

    private function __createUsuario( $data, $conexion )
    {
        $nombreUsuario = $data['nombreUsuario'];
        $apellidosUsuario = $data['apellidosUsuario'];
        $RPEusuario = $data['RPEusuario'];
        $usuario = $data['usuario'];
        $password = $data['claveUsuario'];
        $areaTrabajo = $data['areaTrabajo'];
        $rol = $data['rolUsuario'];

        $SQL = "insert into personal values('$RPEusuario','$usuario','$nombreUsuario','$apellidosUsuario','$password','$areaTrabajo','$rol')";         
        $createUsuario = $this->consultaInsercionSimple( $SQL, $conexion );
        
        return $createUsuario;
    }

    private function __createUser( $usuario, $password, $rol, $conexion, $conexionMySQL ) 
    {
        $SQL =  "create user '$usuario'@'localhost' identified by '".$password."'";

        $createUser = $this->consultaInsercionSimple( $SQL, $conexionMySQL );
        // return $SQL;
        // return $rol;
        if ( $createUser === 'OK' )
        {
            $permisos = $this->__grantPrivileges( $usuario, $rol, $conexion, $conexionMySQL );
            return $permisos;
        }
        else return $createUser; 
    }

    private function __grantPrivileges( $usuario, $rol, $conexion, $conexionMySQL )
    {
        // ----------------- Definimos los permisos que tendra cada tipo de usuario *****************************************
        
        $consulta = "select permiso_rol from permiso_rol where clave_rol = '$rol'";
        $matrizPermisos = $this->consultaSimpleArrayNumerico( $consulta, 'permiso_rol', $conexion, null );
        if( empty( $matrizPermisos ) ) return 'No existen permisos registrados para el rol seleccionado';

        // ----------------- buscamos si existe el permiso all de superUsuario
        
        $superUsuario = false;
        foreach ( $matrizPermisos as $fila ) 
        {
            if ( $fila == 'all' ) 
            {
                $superUsuario = true;
                break;
            }
        }

        if ( $superUsuario ) $permiso = "grant all privileges on *.* to '$usuario'@'localhost' with grant option";
        else 
        {
            $permiso = 'grant ';

            for ( $i = 0; $i < sizeof( $matrizPermisos ) ; $i++ ) 
            {
                if ( $i !== ( sizeof( $matrizPermisos ) -1 ) ) $permiso = $permiso.$matrizPermisos[ $i ].', ';
                else $permiso = $permiso.$matrizPermisos[ $i ];
            }

            $permiso = $permiso." on *.* to '$usuario'@'localhost'";
        }

        // return $permiso;

        // ---------- revocar permisos de usuario

        $revoke = "revoke all on *.* from '$usuario'@'localhost'";
        $revokeMysql = $this->consultaInsercionSimple( $revoke, $conexionMySQL );
        // if ( $revokeMysql !== 'OK' ) return $revokeMysql;

        // ----------- reinsertar los permisos
               
        $crearPermiso = $this->consultaInsercionSimple( $permiso, $conexionMySQL );

        // ---------- recargar los privilegios

        $flush = $this->consultaInsercionSimple( 'flush privileges', $conexionMySQL );

        return $crearPermiso;
    }    

    // ---------- actualizarUsuario ------------------------------------------------------------------

    private $datosUsuarioUpdate = array(
        'nombreUsuario', 'apellidosUsuario', 'RPEusuario',
        'usuario', 'claveUsuario', 'areaTrabajo', 'rolUsuario',
        'RPEusuarioUpdate', 'usuarioUpdate'
    );

    function actualizarUsuario( $data ) 
    {
        // ---------- verificamos las conexiones a las bases de datos

        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        // ---------- definimos los campos que deseamos validar provenientes de POST

        $flag = $this->verificaDatosNulos( $data, $this->datosUsuarioUpdate );        

        if ( $flag === 'OK' )
        {
            // ---------- actualizamos la informacion del usuario en laventa_cfe

            $updateUsuario = $this->__updateUsuario( $data, $this->conexion );
            if ( $updateUsuario !== 'OK' )
            {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();
                return $updateUsuario;
            }

            // ---------- actualizamos la informacion del usuario en mysql

            $updateUser = $this->__updateUser( $data['usuarioUpdate']['valor'], 
                $data['claveUsuario']['valor'], $data['rolUsuario']['valor'], 
                $this->conexion, $this->conexionMySQL );

            if ( $updateUser === 'OK' ) 
            {
                $this->conexion->commit();
                $this->conexionMySQL->commit();
                return 'OK';
            }
            else
            {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();
                return $updateUser;
            }
        }
        
        else return $flagValidacion;
    }

    private function __updateUsuario( $data, $conexion )
    {
        $nombre = utf8_encode( $data['nombreUsuario']['valor'] );
        $apellidos = utf8_encode( $data['apellidosUsuario']['valor'] );
        $rpeUsuario = utf8_encode( $data['RPEusuario']['valor'] );
        $usuario = utf8_encode( $data['usuario']['valor'] );
        $password = $data['claveUsuario']['valor'];
        $areaTrabajo = utf8_encode( $data['areaTrabajo']['valor'] );
        $rol = utf8_encode( $data['rolUsuario']['valor'] );
        
        /* 
         * Variables que guardan el RDE y el usuario actual, antes de actualizar los datos, esto se realiza
         * en el caso que se intente cambiar el RDE y el usuario tambien, de esta manera tendremos una referencia de quién
         * updetear en la sentencia de SQL
         */
        
        $RPE_update = utf8_encode( $data['RPEusuarioUpdate']['valor'] );
        $Usuario_update = utf8_encode( $data['usuarioUpdate']['valor'] );

        $sql = "update personal set rde_trabajador='$rpeUsuario', nombre_usuario='$usuario', nombre_trabajador='$nombre', apellidos_trabajador='$apellidos', password_trabajador='$password', clave_areaTrabajo='$areaTrabajo', clave_rol='$rol' where rde_trabajador='$RPE_update'";
        $query = $this->consultaInsercionSimple( $sql, $conexion );
        return $query;
    }

    private function __updateUser( $usuario, $password, $rol, $conexion, $conexionMySQL )
    {
        // ---------- eliminamos al usuario en mysql

        $dropUser = $this->__dropUser( $usuario, $conexionMySQL );
        // return $dropUser;

        if ( $dropUser === 'OK' )
        {
            // ---------- creamos nuevamente al usuario en mysql

            $createUser = $this->__createUser( $usuario, $password, $rol, $conexion, $conexionMySQL );
            return $createUser;
        }

        else $dropUser;
    }

    // ---------- actualizarAreaTrabajo --------------------------------------------------------------

    private $datosActualizarAreaTrabajo = array(
        'claveAreaTrabajo', 'descripcionAreaTrabajo', 'claveAreaTrabajoUpdate'
    );

    function actualizarAreaTrabajo( $data ) 
    {        
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $flag = $this->verificaDatosNulos( $data, $this->datosActualizarAreaTrabajo );


        if ( $flag === 'OK' ) 
        {
            $claveAreaTrabajo = $data['claveAreaTrabajo']['valor'];
            $descripcionAreaTrabajo = $data['descripcionAreaTrabajo']['valor'];
            $claveAreaTrabajoUpdate = $data['claveAreaTrabajoUpdate']['valor'];  
                     
            $sql = "update area_trabajo set clave_areaTrabajo = '$claveAreaTrabajo', descripcion_areaTrabajo = '$descripcionAreaTrabajo' where clave_areaTrabajo = '$claveAreaTrabajoUpdate' ";
            $actualizarAreaTrabajo = $this->consultaInsercionSimple( $sql, $this->conexion );
            if ( $actualizarAreaTrabajo === 'OK' ) 
            {
                $this->conexion->commit();
                return 'OK';
            } 
            else 
            {
                $this->conexion->rollback();
                return $actualizarAreaTrabajo.'. Error al actualizar área de trabajo';
            }
        } 
        else return 'NA';
    }    

    // ---------- actualizarRolUsuario ---------------------------------------------------------------

    private $datosRolUpdate = array( 'nombreRol', 'descripcionRol', 'matrizAreaAcceso', 'matrizPermisoAcceso', 'nombreRolUpdate' );

    function actualizarRolUsuario( $data ) 
    {
        if ( !$this->estadoConexion ) return "Sin conexion a base de datos: ". $this->baseDatos;
        if ( !$this->estadoConexionMysql ) return "Sin conexion a base de datos: MySQL";

        $validar = $this->verificaDatosNulos( $data, $this->datosRolUpdate );

        if ( $validar == 'OK' ) 
        {  
            $rol = $data['nombreRol']['valor'];  

            // -------------------- limpiando areas de acceso

            $limpiarAreasAcceso = $this->__limpiarAreasAcceso( $rol, $this->conexion );
            if ( $limpiarAreasAcceso != 'OK') 
            {
                $this->conexion->rollback();         
                return $limpiarAreasAcceso.'. Error al limpiar areas de acceso';
            }

            // -------------------- limipado permisos de acceso

            $limpiarPermisoAcceso = $this->__limpiarPermisoAcceso( $rol, $this->conexion );
            if ( $limpiarPermisoAcceso != 'OK' )
            {
                $this->conexion->rollback();
                return $limpiarPermisoAcceso.'. Error al limpiar permisos de acceso';
            }

            // -------------------- actualizando datos de rol

            $actualizarRol = $this->__updateRol( $data, $this->conexion, $this->conexionMySQL );
            if ( $actualizarRol == 'OK' ) 
            {              
                $this->conexion->commit();
                $this->conexionMySQL->commit();
                return 'OK';
            }
            else 
            {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();
                return $actualizarRol;
            }
        } else return $validar;   
    }

    private function __limpiarAreasAcceso ( $rol, $conexion )
    {
        $SQL = "delete from acceso_rol where clave_rol = '$rol'";
        $clean = $limpiarAreasAcceso = $this->consultaInsercionSimple( $SQL, $conexion );
        return $clean;
    }

    private function __limpiarPermisoAcceso ( $rol, $conexion )
    {
        $SQL = "delete from permiso_rol where clave_rol = '$rol'";
        $clean = $this->consultaInsercionSimple( $SQL, $conexion );
        return $clean;
    }

    private function __updateRol ( $data, $conexion, $conexionMySQL )
    {
        $rol = $data['nombreRol']['valor'];
        $descripcion = $data['descripcionRol']['valor'];
        $matrizAreaAcceso = $data['matrizAreaAcceso'];
        $matrizPermisoAcceso = $data['matrizPermisoAcceso'];

        $rolUpdate = $data['nombreRolUpdate']['valor'];
                    
        $SQL = "update roles set clave_rol = '$rol', descripcion_areaTrabajo = '$descripcion' where clave_rol = '$rolUpdate'";
        $updateRol = $this->consultaInsercionSimple( $SQL, $conexion );

        if ( $updateRol == 'OK' ) 
        {
            // -------------------- insertando las areas de acceso

            $insertarAreaAcceso = $this->__insertarAreaAcceso ( $rol, $matrizAreaAcceso, $conexion );
            if ( $insertarAreaAcceso != 'OK' ) return $insertarAreaAcceso;

            // -------------------- insertando los permisos de acceso

            $insertarPermisoAcceso = $this->__insertarPermisoAcceso ( $rol, $matrizPermisoAcceso, $conexion );
            if ( $insertarPermisoAcceso != 'OK' ) return $insertarPermisoAcceso;

            // -------------------- actualizar los nuevos permisos a los usuarios previamente asignados
            
            $reasignarPermisos = $this->__reasignarPermisos( $rol, $conexion, $conexionMySQL );

            /*
             * si la respuesta es [null] es porque no hay usuario para reasignar permisos
             * si es [OK] es porque se reasignaron a los usuarios pertenecientes al rol actualizado
             */ 
            if ( $reasignarPermisos == 'OK' || $reasignarPermisos == null ) return 'OK';
                else return $reasignarPermisos;
        } 
        else return $updateRol.'. Error al actualizar datos del rol';
    }

    private function __insertarAreaAcceso ( $rol, $data, $conexion )
    {
        foreach ( $data as $area ) 
        {
            foreach ( $this->matrizAreaAcceso as $filaNivel ) 
            {
                if ($filaNivel['paginaAcceso'] == $area) 
                {
                    $nivelBarra = $filaNivel['nivelBarra'];
                    $nombreBarra = $filaNivel['nombrePagina'];
                }
            }

            $SQL = "insert into acceso_rol values( '$rol', $nivelBarra, '$nombreBarra', '$area')"; 

            $insertaAreaAcceso = $this->consultaInsercionSimple( $SQL, $conexion );
            if ($insertaAreaAcceso != 'OK') return $insertaAreaAcceso.'. Error al insertar fila de acceso de pagina';
        }

        return 'OK';
    }

    private function __insertarPermisoAcceso( $rol, $data, $conexion )
    {
        foreach ( $data as $permiso ) 
        {
            $SQL = "insert into permiso_rol values('$rol', '$permiso')"; 

            $insertaPermiso = $this->consultaInsercionSimple( $SQL, $conexion );
            if ( $insertaPermiso != 'OK' ) return $insertaPermiso.'. Error al insertar permisos de usuario';
        } 

        return 'OK';
    }

    private function __reasignarPermisos( $rol, $conexion, $conexionMySQL )
    {
        $SQL_matrizUsr = "select nombre_usuario from personal where clave_rol = '$rol'";
        $matrizUsr = $this->consultaSimpleArrayNumerico( $SQL_matrizUsr, 'nombre_usuario', $conexion, null );
        if ( $matrizUsr != null )
        {
            foreach ( $matrizUsr as $usr ) 
            {
                $updatePermisos = $this->__grantPrivileges( $usr, $rol, $conexion, $conexionMySQL );
                if ( $updatePermisos != 'OK' ) return $updatePermisos;
            }

            return 'OK';
        }
        else return $matrizUsr;
        // else return 'AQUI';
    }

    // ----------------------------------------------------------------------------------------------------------------------

    function obtenerUsuarios() 
    {

        $SQL_usuario = 'select RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, clave_areaTrabajo, clave_rol from personal';
        $matrizUsuarios = $this->consultaSimpleArrayNumericoMultiple($SQL_usuario, $this->conexion);
        return $matrizUsuarios;  
    }
 
    function eliminarAreaTrabajo ( $data ) 
    {
        $claveAreaTrabajo = $data['clave_areaTrabajo'];

        $flagComprobacion = true;
        empty( $claveAreaTrabajo ) ? $flagComprobacion = false : null;

        if ( $flagComprobacion ) {
            $SQL_eliminarAreaTrabajo = " delete from area_trabajo where clave_areaTrabajo = '$claveAreaTrabajo' ";
            // return $SQL_eliminarAreaTrabajo;

            // ------------------ iniciamos transaccion de consulta
            $transaccion = $this->consultaInsercionSimple( 'begin', $this->conexion );
            if ( $transaccion == 'OK' ) {
                // ------------------ realizamos consulta de eliminacion
                $eliminarAreaTrabajo = $this->consultaInsercionSimple( $SQL_eliminarAreaTrabajo, $this->conexion );
                if ( $eliminarAreaTrabajo == 'OK' ) {
                    $finTransaccion = $this->consultaInsercionSimple( 'commit', $this->conexion );
                    return 'OK';
                } else {
                    $finTransaccion = $this->consultaInsercionSimple( 'rollback', $this->conexion );
                    return $eliminarAreaTrabajo.'. Error al eliminar área de trabajo';
                }
            } else return $transaccion.'. Error al iniciar transacción';
        } else return 'NA';
    }

    function eliminarRolUsuario( $data ) 
    {
        $claveRol = $data['clave_rol'];
        // return $claveRol;

        $flagValidacion = true;
        !empty($claveRol) ? '' : $flagValidacion = false;

        if($flagValidacion)
        {
            $SQL_eliminarRol = 'delete from roles where clave_rol="'.$claveRol.'"';
            $eliminarRol = $this->consultaInsercionSimple($SQL_eliminarRol, $this->conexion);
            if ($eliminarRol === 'OK') 
            {
                $this->conexion->commit();
                return 'OK';
            }
            else
            {
                $this->conexion->rollback();
                return $eliminarRol;  
            } 
        } return 'NA';
    }    

    // ---------- eliminarUsuario ------------------------------------------------------------------------------------------------------------

    function eliminarUsuario( $data ) 
    {
        $usuario = $data['nombre_usuario'];

        $flagValidacion = true;
        !empty($usuario) ? null : $flagValidacion = false;

        if( $flagValidacion )
        {
            $eliminarUsuario = $this->__dropUsuario( $usuario, $this->conexion, $this->conexionMySQL );
            if ( $eliminarUsuario == 'OK' )
            {
                $this->conexion->commit();
                $this->conexionMySQL->commit();
                // $this->requestCloseSesion();
                return 'OK';
            }
            
            else return $eliminarUsuario;
        } return 'NA';
    }

    private function __dropUsuario( $usuario, $conexion, $conexionMySQL )
    {
        $SQL = 'delete from personal where nombre_usuario = "'.$usuario.'"';

        $borrarUsuario = $this->consultaInsercionSimple( $SQL, $conexion );
        if ( $borrarUsuario == 'OK' ) 
        {
            $borrarUsuarioMysql = $this->__dropUser( $usuario, $conexionMySQL );
            if( $borrarUsuarioMysql == 'OK' ) return 'OK';
                else return $borrarUsuarioMysql;
        }
        else return $borrarUsuario;
    } 

    private function __dropUser( $usuario, $conexionMySQL ) 
    {
        // ---------- verificamos la existencia del usuario

        $user = $this->checkUserInsideMysql( $usuario, $conexionMySQL );
        // return $user;

        if ( $user ) 
        {            
            $sql = "drop user '$usuario'@'localhost'";
            // return $sql;

            $dropUser = $this->consultaInsercionSimple( $sql, $conexionMySQL );
            return $dropUser;
        }

        // ---------- si retorna FALSO el usuario no existe

        else return 'OK';        
    }

    // ----------------------------------------------------------------------------------------------------------------------

    function obtenerTipoRolUsuario() 
    {
        $SQL_tipoRol = 'select * from roles';
        $tipoRol = $this->consultaSimpleArrayNumericoMultiple($SQL_tipoRol, $this->conexion);

        $objetoRoles = array();
        $indice = 0;
        foreach ($tipoRol as $val) {
            $rolActual = $val['clave_rol'];

            // buscamos los permisos asignados al rol
            $SQL_permisoAcceso = "select permiso_rol from permiso_rol where clave_rol = '$rolActual'";
            $permisoAcceso = $this->consultaSimpleArrayNumerico($SQL_permisoAcceso, 'permiso_rol', $this->conexion, null);

            // buscamos las areas asignadas al rol
            $SQL_areaAcceso = "select pagina_acceso_rol from acceso_rol where clave_rol = '$rolActual'";
            $areaAcceso = $this->consultaSimpleArrayNumerico($SQL_areaAcceso, 'pagina_acceso_rol', $this->conexion, null);

            // unimos los datos
            $objetoRoles[$indice] = $val;
            $objetoRoles[$indice]['permisoAcceso'] = $permisoAcceso;
            $objetoRoles[$indice]['areaAcceso'] = $areaAcceso;
            $indice++;
        }
        return $objetoRoles;
    }

    function obtenerAreaTrabajo() 
    {
        // Obteniendo las diferentes areas de trabajo
        $SQL_areaTrabajo = 'select * from area_trabajo';
        $areaTrabajo = $this->consultaSimpleArrayNumericoMultiple($SQL_areaTrabajo, $this->conexion);
        return $areaTrabajo;
    }

    function obtenerAreasAcceso()
    {
        return $this->matrizAreaAcceso;
    }

    function obtenerPermisoAcceso ()
    {
        return $this->matrizPermisoAcceso;
    }
}


$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxUsuarios($host , $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion )
    $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( "Acceso no autorizado" );
?>