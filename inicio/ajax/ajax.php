<?php
    // desabilitar notificaciones
    error_reporting( E_ALL ^ E_NOTICE ^ E_WARNING );

    $conexion = new mysqli( 'localhost', 'root', '9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684', 'video' );
    if ( mysqli_connect_errno() ) {
        echo json_encode('Error de conexion');
        return NULL;
    }

    # deshabilitamos el autocommit
    $conexion->autocommit( false );

    // Obtenemos la accion que deseamos ejecutar
    $class = $_GET[ 'q' ];

    switch ( $class ) {
        case 'insertarUsuario':
            $q = insertarUsuario( $conexion, $_POST );
            echo json_encode( $q );
            break;

        case 'obtenerUsuarios':
            $q = obtenerUsuarios( $conexion );
            echo json_encode( $q );
            break;

        case 'iniciarSesion':
            $q = iniciarSesion( $conexion, $_POST );
            echo json_encode( $q );
            break;
        
        default:
            echo json_encode( 'Funcion no definida' );
            break;
    }

function insertarUsuario ( $conexion, $post ) {
    $nombre = $post[ 'nombre' ];
    $apellido = $post[ 'apellido' ];    
    $usuario = $post[ 'usuario' ];
    $password = $post[ 'password' ];
    $especialidad = $post[ 'especialidad' ];


    $sql = 
    "INSERT INTO video( usuario, password, nombre, apellido, especialidad ) ".
    "VALUES( '$usuario', '$password', '$nombre', '$apellido', '$especialidad' )";
    
    # si la consulta es correcta
    if ( $query = $conexion->query( $sql ) ) {
        $conexion->commit();
        return 'OK';
    } else {
        $conexion->rollback();
        return 'ERROR';
    }
}

function obtenerUsuarios ( $conexion ) {

    // creo variable tipo matriz donde guardaré datos
    $arr = array();

    // creo consulta en SQL
    $sql = "SELECT * FROM video";

    // consulto los datos
    if( $query = $conexion->query( $sql ) ) 
    {
        // recorro todos los datos para guardarlos en $arr
        while ( $data = $query->fetch_assoc() ) {
            $arr[ ] = $data;
        }
    }

    return $arr;
}

function iniciarSesion ( $conexion, $post ) {
    $usuario = $post[ 'usuario' ];
    $password = $post[ 'password' ];

    $sql = 
    "SELECT usuario FROM video ".
    "WHERE usuario = '$usuario' ".
    "AND password = '$password'";

    // return $sql;

    // consulto los datos
    if( $query = $conexion->query( $sql ) ) {
        // recorro todos los datos para guardarlos en $arr
        while ( $data = $query->fetch_assoc() ) {
            $arr[ ] = $data;
        }

        if ( sizeof( $arr ) == 1 ) return 'OK';
        else return 'ERROR';
    }

    else {
        return 'ERROR';
    }
}
   
?>