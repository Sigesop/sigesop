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

        case 'insertarSala':
            $q = insertarSala( $conexion, $_POST );
            echo json_encode( $q );
            break;

        case 'disponibilidadSalaRequerida':
            $q = disponibilidadSalaRequerida( $conexion, $_POST );
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

function insertarSala ( $conexion, $post ) {
    $id_programacion_vc = 5;
    $fecha_vc = $post[ 'fecha_vc' ] = '12/12/2015';
    $hora_inicio = $post[ 'hora_inicio' ] = '12:00';
    $hora_termino = $post[ 'hora_termino' ] = '14:00';
    $sala_requerida = $post[ 'sala_requerida' ] = 'GRTSE';
    $area_solicitante = $post[ 'area_solicitante' ] = 'SDT';
    $especialidad_solicitante = $post[ 'especialidad_solicitante' ] = 'CM';
    $nombre_vc = $post[ 'nombre_vc' ] = 'Pruebas vc';
    $area_participante = $post[ 'area_participante' ] = 'GRTSE';
    $especialidad_participante = $post[ 'especialidad_participante' ] = 'SL';
    $comentario = $post[ 'comentario' ] = 'TEST';    

    $sql =
    "INSERT INTO programacion_vc ".
    "VALUES( $id_programacion_vc, STR_TO_DATE( '$fecha_vc', '%d/%m/%Y' ), '$hora_inicio', ".
    "'$hora_termino', '$sala_requerida', '$area_solicitante', '$especialidad_solicitante', ".
    "'$nombre_vc', '$area_participante', '$especialidad_participante', ".
    "'$comentario', 'ACTIVO' )";

    // return $sql;
    if ( $query = $conexion->query( $sql ) ) {        
        $conexion->commit();
        return 'OK';
    }
    else {        
        $conexion->rollback();
        return 'ERROR';
    }
}

function disponibilidadSalaRequerida( $conexion, $post ) {
    $salas = array(
        'SGCOM',
        'GRTSE',
        'SEYLT',
        'PTYM',
        'OFNA_NPL',
        'OFNA_JURV',
        'OFNA_GIHF'
    );

    $fecha_vc = $post[ 'fecha_vc' ];
    $hora_inicio = $post[ 'hora_inicio' ];
    $hora_termino = $post[ 'hora_termino' ];

    # buscar las salas ocupadas
    $sql = 
    "SELECT DISTINCT sala FROM programacion_vc ".
    "WHERE estado = 'ACTIVO' ".    
    "AND ( ".
        "hora_inicio < '$hora_inicio' ".
        "AND ".
        "hora_termino > '$hora_termino' ".
    ")".

    "OR ( ".
        "hora_inicio < '$hora_termino' ".
        "AND ".
        "hora_termino > '$hora_inicio' ".
    ")".
    "AND fecha_vc = STR_TO_DATE( '$fecha_vc', '%d/%m/%Y' ) ";

    // return $sql;
    $arr = array();
    // consulto los datos
    if( $query = $conexion->query( $sql ) ) {
        // recorro todos los datos para guardarlos en $arr
        while ( $data = $query->fetch_assoc() ) {
            $arr[ ] = $data[ 'sala' ];
        }
    }

    $mtz = array_diff( $salas , $arr);

    # limpiando indices de funcion array_diff
    $retorno = array();
    foreach ($mtz as $row) {
        $retorno[ ] = $row;
    }

    return $retorno;
}
   
?>