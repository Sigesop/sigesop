<?php
require 'sigesop.class.php';
class usuarios extends sigesop {
    private $matrizPermisoAcceso = array(
        array('idPermiso' => 'select', 'descripcion' => 'Consulta a datos'),
        array('idPermiso' => 'insert', 'descripcion' => 'Inserción de datos'),
        array('idPermiso' => 'update', 'descripcion' => 'Actualización de datos'),
        array('idPermiso' => 'delete', 'descripcion' => 'Eliminacion de datos'),
        // array('idPermiso' => 'create', 'descripcion' => 'Creación de nuevas tablas'),
        array('idPermiso' => 'create user', 'descripcion' => 'Creación de nuevos usuarios'),
        // array('idPermiso' => 'alter', 'descripcion' => 'Alteración de tablas'),
        // array('idPermiso' => 'drop', 'descripcion' => 'Eliminación de tablas'),
        array('idPermiso' => 'all', 'descripcion' => 'Permisos de administración de la Base de datos')
    );

    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct(){ parent::__destruct(); }

	public function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion ) {
            case 'actualizarAreaTrabajo':
                $actualizarAreaTrabajo = $this->actualizarAreaTrabajo( $post );
                echo json_encode( $actualizarAreaTrabajo );
                break;
            case 'actualizarRolUsuario':
                $actualizarRolUsuario = $this->actualizarRolUsuario( $post );
                echo json_encode( $actualizarRolUsuario );
                break;
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

            # Funciones para imprimir
            case 'imprimirR':
                $query = $this->imprimirR();
                echo json_encode( $query );
                break;

            case 'imprimir':
                $query = $this->imprimir( $get );
                echo json_encode( $query );
                break;

            case 'imprimirAT':
                $query = $this->imprimirAT( );
                echo json_encode( $query );
                break;

            default:
                echo json_encode('Funcion no registrada en la clase usuarios');
                break;
		}
	}

    # nuevaAreaTrabajo ----------------------

    public function nuevaAreaTrabajo( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar =
            $this->verificaDatosNulos( $data, array(
                'claveAreaTrabajo', 'descripcionAreaTrabajo'
            ));

        if ( $validar === 'OK' )
        {
            $clave_areaTrabajo = $data['claveAreaTrabajo']['valor'];
            $descripcion_areaTrabajo = $data['descripcionAreaTrabajo']['valor'];
            $conexion = $this->conexion;

            $sql =  "INSERT INTO area_trabajo( clave_areaTrabajo, descripcion_areaTrabajo ) ".
                    "VALUES( '$clave_areaTrabajo', '$descripcion_areaTrabajo' )";
            $query = $this->insert_query( $sql );

            if ( $query === 'OK' )
            {
                $conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Área de trabajo ingresado satisfactoriamente.' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $clave_areaTrabajo, 'msj' => 'Correcto' );
            }
            else
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar Área de trabajo.' );
                $rsp [ 'eventos' ][] =
                    array( 'estado' => 'ERROR', 'elem' => $clave_areaTrabajo, 'msj' => $query );
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    # nuevoRolUsuario ----------------------

    public function nuevoRolUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar =
            $this->verificaDatosNulos( $data, array(
                'nombreRol',
                'descripcionRol',
                'matrizAreaAcceso',
                'matrizPermisoAcceso'
            ));

        if( $validar != 'OK' ) {
            $rsp[ 'status' ]  = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        $clave_rol               = $data[ 'nombreRol' ][ 'valor' ];
        $descripcion_areaTrabajo = $data[ 'descripcionRol' ][ 'valor' ];
        $matrizAreaAcceso        = $data[ 'matrizAreaAcceso' ];
        $matrizPermisoAcceso     = $data[ 'matrizPermisoAcceso' ];
        $conexion                = $this->conexion;
        $state                   = true; # bandera para comprobar recorrido de arreglo

        # ----------------------
        $sql = "INSERT INTO roles VALUES( ".
            "'$clave_rol', ".
            "'$descripcion_areaTrabajo' ".
        ")";
        // return $sql;

        $query = $this->insert_query( $sql );
        if ($query != 'OK') {
            $conexion->rollback();
            $rsp[ 'status' ]    = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar Rol en la base de datos' );
            $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_rol, 'msj' => $query );
            return $rsp;
        }

        foreach ( $matrizPermisoAcceso as $row ) {
            $sql = "INSERT INTO permiso_rol VALUES( ".
                "'$clave_rol', ".
                "'$row' ".
            ")";
            // return $sql;

            $query = $this->insert_query( $sql );
            if ( $query != 'OK' ) {
                $state = false;
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $row, 'msj' => $query );
            }
        }

        foreach ( $matrizAreaAcceso as $_id_area_acceso ) {
            # buscamos [nivelBarra] y [nombrePagina] dentro de la clase
            # para almacenar con su elemento correspondiente
            foreach ( $this->matrizAreaAcceso as $row ) {
                if ( $row[ 'id_area_acceso' ] == $_id_area_acceso ) {
                    $id_area_acceso = $row[ 'id_area_acceso' ];
                    break;
                }
            }

            $sql = "INSERT INTO acceso_rol( ".
                "clave_rol, ".
                "id_area_acceso ".
            ") VALUES( ".
                "'$clave_rol', ".
                "$id_area_acceso ".
            ")";
            // return $sql;

            $query = $this->insert_query( $sql );
            if ( $query != 'OK' )
            {
                $state = false;
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $_id_area_acceso, 'msj' => $query );
            }
        }

        if ( $state === true )
        {
            $conexion->commit();
            $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Rol de usuario ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $clave_rol, 'msj' => 'Correcto' );
        } else {
            $conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al ingresar rol de usuario.' );
        }

        return $rsp;
    }

    # nuevoUsuario ----------------------

    public function nuevoUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar =
            $this->verificaDatosNulos( $data, array(
                'nombreUsuario', 'apellidosUsuario', 'RPEusuario',
                'usuario', 'claveUsuario', 'areaTrabajo', 'rolUsuario'
            ));

        if( $validar == 'OK' )
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

            # comprobamos que no intenten usar root o usuario de sesiones

            if ( $usuario == '__session' || $usuario == $this->root )
            {
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Usuario de sólo lectura' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'key' => 'usuario', 'msj' => 'Usuario no válido' );
                return $rsp;
            }

            # verificamos la existencia del usuario en las bases de datos laventa_cfe y mysql

            $flagMysql = $this->checkUserInsideMysql( $usuario );
            $flagLaVenta = $this->checkUserInsideLaVenta( $usuario );

            if ( $flagMysql && $flagLaVenta )
            {
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'El usuario solicitado ya existe en la base de datos' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'key' => 'usuario', 'msj' => 'Duplicado' );
                return $rsp;
            }
            else if ( $flagMysql && !$flagLaVenta )
            {
                # eliminamos el usuario de mysql ya que no existe en laventa_cfe

                $dropUser = $this->__dropUser( $usuario );
                if ( $dropUser == 'OK' ) $flagInsercion = true;
            }
            else if ( !$flagMysql && $flagLaVenta )
            {
                # si existe en laventa_cfe pero no en mysql hay que reasignarle el
                # usuario y los permisos conforme al rol recibido

                $sql = "SELECT password_trabajador, clave_rol FROM personal where nombre_usuario = '$usuario'";
                $query = $this->array_query( $sql );
                $password = $query[ 0 ][ 'password_trabajador' ];
                $rolUsuario = $query[ 0 ][ 'clave_rol' ];

                $query = $this->__createUser( $usuario, $password, $rolUsuario );
                if ( $query === 'OK' )
                    $this->conexionMySQL->commit();
                else
                    $this->conexionMySQL->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'El usuario solicitado ya existe en la base de datos' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'key' => 'usuario', 'msj' => 'Duplicado' );

                return $rsp;
            }
            else if ( !$flagMysql && !$flagLaVenta ) $flagInsercion = true;

            if ( $flagInsercion )
            {
                # Creando usuario en laventa_cfe

                $usuarioLaventa = $this->__createUsuario( $matrizDatosUsuario );
                if ( $usuarioLaventa !== 'OK' )
                {
                    $this->conexion->rollback();
                    $this->conexionMySQL->rollback();

                    $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al crear usuario' );
                    $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'msj' => $usuarioLaventa );
                    return $rsp;
                }

                # Creando usuario en Mysql

                $usuarioMysql = $this->__createUser( $usuario, $password, $rolUsuario );
                if ( $usuarioMysql === 'OK' )
                {
                    $this->conexion->commit();
                    $this->conexionMySQL->commit();

                    $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Usuario creado satisfactoriamente' );
                    $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $usuario, 'msj' => 'Correcto' );
                }
                else
                {
                    $this->conexion->rollback();
                    $this->conexionMySQL->rollback();

                    $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al crear usuario' );
                    $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'msj' => $usuarioMysql );
                }
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    private function __createUsuario( $data ){
        $nombreUsuario = $data['nombreUsuario'];
        $apellidosUsuario = $data['apellidosUsuario'];
        $RPEusuario = $data['RPEusuario'];
        $usuario = $data['usuario'];
        $password = $data['claveUsuario'];
        $areaTrabajo = $data['areaTrabajo'];
        $rol = $data['rolUsuario'];

        $sql =  "insert into personal(RDE_trabajador, nombre_usuario, nombre_trabajador, apellidos_trabajador, ".
                "password_trabajador, clave_areaTrabajo, clave_rol) ".
                "values('$RPEusuario','$usuario','$nombreUsuario','$apellidosUsuario', ".
                "'$password','$areaTrabajo','$rol')";

        $query = $this->insert_query( $sql );

        return $query;
    }

    private function __createUser( $usuario, $password, $rol ) {
        $sql =  "CREATE USER '$usuario'@'$this->host' IDENTIFIED BY '$password'";
        $query = $this->insert_query( $sql, true );

        if ( $query === 'OK' )
        {
            $permisos = $this->__grantPrivileges( $usuario, $rol );
            return $permisos;
        }

        return $query;
    }

    private function __grantPrivileges( $usuario, $rol ) {
        # Definimos los permisos que tendra cada tipo de usuario

        $sql = "SELECT permiso_rol FROM permiso_rol WHERE clave_rol = '$rol'";
        $mtz = $this->array_query( $sql, 'permiso_rol', null );
        if( empty( $mtz ) ) return 'No existen permisos registrados para el rol seleccionado';

        # buscamos si existe el permiso all de superUsuario

        $superUsuario = false;
        foreach ( $mtz as $fila ) {
            if ( $fila == 'all' ) {
                $superUsuario = true;
                break;
            }
        }

        if ( $superUsuario )
            $permiso = "GRANT ALL PRIVILEGES ON *.* TO '$usuario'@'$this->host' WITH GRANT OPTION";
        else {
            $permiso = 'GRANT ';

            for ( $i = 0; $i < sizeof( $mtz ) ; $i++ ) {
                if ( $i !== ( sizeof( $mtz ) -1 ) ) $permiso = $permiso.$mtz[ $i ].', ';
                else $permiso = $permiso.$mtz[ $i ];
            }

            $permiso = $permiso." ON *.* TO '$usuario'@'$this->host'";
        }

        // return $permiso;

        # revocar permisos de usuario

        $revoke = "REVOKE ALL ON *.* FROM '$usuario'@'$this->host'";
        $revokeMysql = $this->insert_query( $revoke, true );
        // if ( $revokeMysql !== 'OK' ) return $revokeMysql;

        # reinsertar los permisos

        $crearPermiso = $this->insert_query( $permiso, true );

        # recargar los privilegios

        $flush = $this->insert_query( 'flush privileges', true );

        return $crearPermiso;
    }

    # actualizarUsuario ----------------------

    public function actualizarUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar = $this->verificaDatosNulos( $data, array(
            'nombreUsuario',
            'apellidosUsuario',
            'RPEusuario',
            'usuario',
            'claveUsuario',
            'areaTrabajo',
            'rolUsuario',
            'RPEusuarioUpdate',
            'usuarioUpdate'
        ));

        if ( $validar === 'OK' )
        {
            $usuario        = $data['usuario']['valor'];
            $usuario_update = $data['usuarioUpdate']['valor'];

            # comprobamos que no intenten usar root o usuario de sesiones

            if ( $usuario == '__session' || $usuario == $this->root )
            {
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Usuario de sólo lectura' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'key' => 'usuario', 'msj' => 'Usuario no válido' );
                return $rsp;
            }

            # comprobamos que no sea un usuario activo
            # o que sea un usuario activo pero cambiando sus propios datos

            if ( $this->checkUserInsideLaVenta( $usuario ) &&
                 $usuario != $usuario_update )
            {
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar usuario' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'key' => 'usuario', 'msj' => 'Usuario existente' );
                return $rsp;
            }

            # actualizamos la informacion del usuario en laventa_cfe

            $updateUsuario = $this->__updateUsuario( $data );
            if ( $updateUsuario !== 'OK' )
            {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar usuario' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'msj' => $updateUsuario );
                return $rsp;
            }

            # actualizamos la informacion del usuario en mysql

            $updateUser = $this->__updateUser( $usuario, $usuario_update,
                $data['claveUsuario']['valor'], $data['rolUsuario']['valor'] );

            if ( $updateUser === 'OK' )
            {
                $this->conexion->commit();
                $this->conexionMySQL->commit();

                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Usuario actualizado satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $usuario, 'msj' => 'Correcto' );
                return $rsp;
            }
            else
            {
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar usuario' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'msj' => $updateUser );
                return $rsp;
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    private function __updateUsuario( $data ) {
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

        $sql =  "UPDATE personal SET rde_trabajador = '$rpeUsuario', ".
                "nombre_usuario = '$usuario', nombre_trabajador = '$nombre', ".
                "apellidos_trabajador = '$apellidos', password_trabajador = '$password', ".
                "clave_areaTrabajo = '$areaTrabajo', clave_rol = '$rol' ".
                "WHERE rde_trabajador = '$RPE_update'";

        $query = $this->insert_query( $sql );
        return $query;
    }

    private function __updateUser( $usuario, $usuario_update, $password, $rol ){
        $dropUser = $this->__dropUser( $usuario ); # si existía o no, siempre retorna OK;

        # creamos usuario en mysql

        $createUser = $this->__createUser( $usuario, $password, $rol );
        if ( $createUser == 'OK' )
        {
            # eliminamos usuario actualizado en mysql, si el usuario
            # es diferente al usuario anterior
            if( $usuario != $usuario_update )
                $dropUser = $this->__dropUser( $usuario_update );

            return 'OK';
        }
    }

    # actualizarAreaTrabajo ---------------

    public function actualizarAreaTrabajo( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $validar =
            $this->verificaDatosNulos( $data, array(
                'claveAreaTrabajo', 'descripcionAreaTrabajo', 'claveAreaTrabajoUpdate'
            ));

        if ( $validar === 'OK' )
        {
            $clave_areaTrabajo =         $data[ 'claveAreaTrabajo' ][ 'valor' ];
            $descripcion_areaTrabajo =   $data[ 'descripcionAreaTrabajo' ][ 'valor' ];
            $clave_areaTrabajo_update =  $data[ 'claveAreaTrabajoUpdate' ][ 'valor' ];
            $conexion = $this->conexion;

            $sql =  "UPDATE area_trabajo SET clave_areaTrabajo = '$clave_areaTrabajo', ".
                    "descripcion_areaTrabajo = '$descripcion_areaTrabajo' WHERE ".
                    "clave_areaTrabajo = '$clave_areaTrabajo_update' ";

            $query = $this->insert_query( $sql );
            if ( $query === 'OK' )
            {
                $conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Área de trabajo actualizada satisfactoriamente.' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $clave_areaTrabajo_update, 'msj' => 'Actualizada' );
            }
            else
            {
                $conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar Área de trabajo.' );
                $rsp [ 'eventos' ][] =
                    array( 'estado' => 'ERROR', 'elem' => $clave_areaTrabajo_update, 'msj' => $query );
            }
        }
        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    # actualizarRolUsuario ----------------------

    public function actualizarRolUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );

        $validar =
            $this->verificaDatosNulos( $data, array(
                'nombreRol', 
                'descripcionRol', 
                'matrizAreaAcceso',
                'matrizPermisoAcceso', 
                'nombreRolUpdate'
            ));

        if ( $validar == 'OK' ) {
            $rol = $data['nombreRol']['valor'];

            # limpiando areas de acceso
            $query = $this->__limpiarAreasAcceso( $rol );
            if ( $query != 'OK') {
                $this->conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al limpiar areas de acceso.' );
                $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => '', 'msj' => $query );
                return $rsp;
            }

            # limpiando permisos de acceso
            $query = $this->__limpiarPermisoAcceso( $rol );
            if ( $query != 'OK' ) {
                $this->conexion->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al limpiar permisos de acceso.' );
                $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => '', 'msj' => $query );
                return $rsp;
            }

            # actualizando datos de rol
            $query = $this->__updateRol( $data );
            if ( $query == 'OK' ) {
                $this->conexion->commit();
                $this->conexionMySQL->commit();

                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Rol de usuario actualizado satisfactoriamente.' );
                $rsp[ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $rol, 'msj' => 'Correcto' );
                return $rsp;
            }
            else {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();

                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar datos del rol.' );
                $rsp[ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => '', 'msj' => $query );
                return $rsp;
            }
        }

        else {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
        }

        return $rsp;
    }

    private function __limpiarAreasAcceso ( $rol ) {
        $sql = "delete from acceso_rol where clave_rol = '$rol'";
        $clean = $limpiarAreasAcceso = $this->insert_query( $sql );
        return $clean;
    }

    private function __limpiarPermisoAcceso ( $rol ) {
        $sql = "delete from permiso_rol where clave_rol = '$rol'";
        $clean = $this->insert_query( $sql );
        return $clean;
    }

    private function __updateRol ( $data ) {
        $rol =                  $data[ 'nombreRol' ][ 'valor' ];
        $descripcion =          $data[ 'descripcionRol' ][ 'valor' ];
        $matrizAreaAcceso =     $data[ 'matrizAreaAcceso' ];
        $matrizPermisoAcceso =  $data[ 'matrizPermisoAcceso' ];

        $rolUpdate =            $data[ 'nombreRolUpdate' ][ 'valor' ];

        $sql =
        "UPDATE roles SET ".
        "clave_rol = '$rol', ".
        "descripcion_areaTrabajo = '$descripcion' ".
        "WHERE clave_rol = '$rolUpdate'";

        $updateRol = $this->insert_query( $sql );

        # retornamos el ERROR si no se inserta correctamente
        if ( $updateRol != 'OK' ) return $updateRol;

        # insertando las areas de acceso
        $insertarAreaAcceso = $this->__insertarAreaAcceso ( $rol, $matrizAreaAcceso );
        if ( $insertarAreaAcceso != 'OK' ) return $insertarAreaAcceso;

        # insertando los permisos de acceso
        $insertarPermisoAcceso = $this->__insertarPermisoAcceso ( $rol, $matrizPermisoAcceso );
        if ( $insertarPermisoAcceso != 'OK' ) return $insertarPermisoAcceso;

        # actualizar los nuevos permisos a los usuarios previamente asignados
        $reasignarPermisos = $this->__reasignarPermisos( $rol );

        /* si la respuesta es [null] es porque no hay usuario para reasignar permisos
         * si es [OK] es porque se reasignaron a los usuarios pertenecientes al rol actualizado
         */
        if ( $reasignarPermisos == 'OK' || $reasignarPermisos == null ) return 'OK';
        else return $reasignarPermisos." Permisos no reasignados.";
    }

    private function __insertarAreaAcceso ( $rol, $data ) {
        foreach ( $data as $_id_area_acceso ) {
            # buscamos [nivelBarra] y [nombrePagina] dentro de la clase
            # para almacenar con su elemento correspondiente
            foreach ( $this->matrizAreaAcceso as $row ) {
                if ( $row[ 'id_area_acceso' ] == $_id_area_acceso ) {
                    $id_area_acceso = $row[ 'id_area_acceso' ];
                    break;
                }
            }

            $sql = "INSERT INTO acceso_rol( ".
                "clave_rol, ".
                "id_area_acceso ".
            ") VALUES( ".
                "'$rol', ".
                "$id_area_acceso ".
            ")";
            // return $sql;

            $query = $this->insert_query( $sql );
            if ( $query != 'OK' ) {
                return $query.'. Error al insertar fila de acceso de pagina';
            }
        }

        return 'OK';
    }

    private function __insertarPermisoAcceso( $rol, $data ) {
        foreach ( $data as $permiso )
        {
            $sql = "insert into permiso_rol values('$rol', '$permiso')";

            $insertaPermiso = $this->insert_query( $sql );
            if ( $insertaPermiso != 'OK' ) return $insertaPermiso.'. Error al insertar permisos de usuario';
        }

        return 'OK';
    }

    private function __reasignarPermisos( $rol ) {
        $sql =
            "SELECT nombre_usuario FROM personal ".
            "WHERE clave_rol = '$rol'";

        $users = $this->array_query( $sql, 'nombre_usuario', null );
        if ( $users == null ) return null;

        foreach ( $users as $usr ) {
            $updatePermisos = $this->__grantPrivileges( $usr, $rol );
            if ( $updatePermisos != 'OK' ) return $updatePermisos;
        }

        return 'OK';
    }

    # ------------------------------------------

    public function eliminarAreaTrabajo ( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        if ( !$this->estadoConexion )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: ". $this->baseDatos );
        if ( !$this->estadoConexionMysql )
            return $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => "Sin conexion a base de datos: MySQL" );

        $clave_areaTrabajo = $data[ 'clave_areaTrabajo' ];

        if ( !empty( $clave_areaTrabajo ) )
        {
            $conexion = $this->conexion;
            $sql = "delete from area_trabajo where clave_areaTrabajo = '$clave_areaTrabajo' ";
            $query = $this->insert_query( $sql );

            if ( $query == 'OK' )
            {
                $this->conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Área de trabajo eliminado satisfactoriamente.' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $clave_areaTrabajo, 'msj' => 'Eliminado' );
            } else
            {
                $this->conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar área de trabajo' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_areaTrabajo, 'msj' => $query );
            }
        }
        else
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => 'El campo se encuentra nulo' );

        return $rsp;
    }

    public function eliminarRolUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        $clave_rol = $data[ 'clave_rol' ];

        if( !empty($clave_rol) )
        {
            $sql = "DELETE from roles WHERE clave_rol = '$clave_rol'";
            $query = $this->insert_query( $sql );
            if ($query === 'OK')
            {
                $this->conexion->commit();
                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Rol de usuario eliminado satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $clave_rol, 'msj' => 'Eliminado' );
            }
            else
            {
                $this->conexion->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar rol de usuario' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_rol, 'msj' => $query );
            }
        }

        else
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => 'El campo clave_rol es nulo' );

        return $rsp;
    }

    # eliminarUsuario ---------------

    public function eliminarUsuario( $data ) {
        $rsp = array( 'status' => array(), 'eventos' => array() );
        $usuario = $usuario = $data['nombre_usuario'];

        if( !empty($usuario) )
        {
            $query = $this->__dropUsuario( $usuario );

            if ($query === 'OK')
            {
                $this->conexion->commit();
                $this->conexionMySQL->commit();

                $rsp[ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Usuario eliminado satisfactoriamente' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $usuario, 'msj' => 'Eliminado' );
            }
            else
            {
                $this->conexion->rollback();
                $this->conexionMySQL->rollback();
                $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar usuario' );
                $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $usuario, 'msj' => $query );
            }
        }
        else
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => 'El campo nombre_usuario es nulo' );

        return $rsp;
    }

    private function __dropUsuario( $usuario ){
        $sql = "DELETE FROM personal WHERE nombre_usuario = '$usuario'";

        $query = $this->insert_query( $sql );
        if ( $query == 'OK' )
        {
            $userMySQL = $this->__dropUser( $usuario );
            if( $userMySQL == 'OK' ) return 'OK';
                else return $userMySQL;
        }
        else return $query;
    }

    private function __dropUser( $usuario ) {
        // ---------- verificamos la existencia del usuario

        $user = $this->checkUserInsideMysql( $usuario );
        // return $user;

        if ( $user )
        {
            $sql = "DROP USER '$usuario'@'$this->host'";
            // return $sql;

            $dropUser = $this->insert_query( $sql, true );
            return $dropUser;
        }

        # si retorna FALSO el usuario no existe

        else return 'OK';
    }

    # -------------------------------

    public function obtenerTipoRolUsuario() {
        $sql = 'select * from roles';
        $tipoRol = $this->array_query( $sql );

        $objetoRoles = array();
        $indice = 0;
        foreach ( $tipoRol as $val )
        {
            $rolActual = $val['clave_rol'];

            // buscamos los permisos asignados al rol
            $sql = "select permiso_rol from permiso_rol where clave_rol = '$rolActual'";
            $permisoAcceso = $this->array_query( $sql, 'permiso_rol' );

            // buscamos las areas asignadas al rol
            $sql = "select id_area_acceso from acceso_rol where clave_rol = '$rolActual'";
            $areaAcceso = $this->array_query( $sql, 'id_area_acceso' );

            // unimos los datos
            $objetoRoles[$indice] = $val;
            $objetoRoles[$indice]['permisoAcceso'] = $permisoAcceso;
            $objetoRoles[$indice]['areaAcceso'] = $areaAcceso;
            $indice++;
        }
        return $objetoRoles;
    }

    public function obtenerAreaTrabajo() {
        // Obteniendo las diferentes areas de trabajo
        $sql = 'select * from area_trabajo';
        $areaTrabajo = $this->array_query( $sql );
        return $areaTrabajo;
    }

    public function obtenerAreasAcceso() { return $this->matrizAreaAcceso; }

    public function obtenerPermisoAcceso () { return $this->matrizPermisoAcceso; }

    public function obtenerUsuarios() {
        $sql =  'SELECT RDE_trabajador, nombre_usuario, nombre_trabajador, '.
                'apellidos_trabajador, clave_areaTrabajo, clave_rol FROM personal';
        $query = $this->array_query( $sql );
        return $query;
    }

    public function imprimir ( $get ) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de Usuarios' );
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
        $datos = $this->obtenerUsuarios(  );

        $html =
            $this->struct_tabla(
                array (
                    array( 'titulo' => 'RDE', 'campo'=> 'RDE_trabajador', 'x'=>50 ),
                    array( 'titulo' => 'Nombre de Usuario', 'campo'=> 'nombre_usuario',  ),
                    array( 'titulo' => 'Nombre del Trabajador', 'campo'=> 'nombre_trabajador', ),
                    array( 'titulo' => 'Apellido', 'campo'=> 'apellidos_trabajador', ),
                    array( 'titulo' => 'Clave de Area del Trabajo', 'campo'=> 'clave_areaTrabajo', 'x'=>175 ),
                    array( 'titulo' => 'Clave del rol', 'campo'=> 'clave_rol'  )
                ),

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_Usuario.pdf', 'I');
    }

    public function imprimirAT (  ) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de Area de trabajo' );
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
        $datos = $this->obtenerAreaTrabajo(  );

        $html =
            $this->struct_tabla(
                array (
                    array( 'titulo' => 'clave de area de trabajo', 'campo'=> 'clave_areaTrabajo', 'x'=>200 ),
                    array( 'titulo' => 'descripcion ', 'campo'=> 'descripcion_areaTrabajo',  )
                ),

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_AreaTrabajo.pdf', 'I');
    }

    public function imprimirR (  ) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de tipo de rol' );
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
       $datos = $this->obtenerTipoRolUsuario( $get );

        $html =
            $this->struct_tabla(
                array (
                    array( 'titulo' => 'Clave de rol', 'campo'=> 'clave_rol', 'x'=>200 ),

                    array( 'titulo' => 'Descripcion', 'campo'=> 'descripcion_areaTrabajo', )

                ),
                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte tipos de rol de usuario.pdf', 'I');
    }
}