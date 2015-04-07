<?php
error_reporting( E_ALL ^ E_NOTICE ^ E_WARNING );

require ( 'session.class.php' );
$session = new session();

$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = 'localhost';

switch ( $_GET['class'] ) // clases del sistema
{
	case 'equiposGenerador':
		require ( 'equiposGenerador.class.php' );
		$obj = new equiposGenerador( $user, $pass );
		break;

	case 'generadores':
		require ( 'generadores.class.php' );
		$obj = new generadores( $user, $pass );
		break;

	case 'gestionCentral':
		require ( 'gestionCentral.class.php' );
		$obj = new gestionCentral( $user, $pass );
		break;

	case 'listaVerificacion':
		require ( 'listaVerificacion.class.php' );
		$obj = new listaVerificacion( $user, $pass );
		break;

	case 'mantenimiento':
		require ( 'mantenimiento.class.php' );
		$obj = new mantenimiento( $user, $pass );
		break;

	case 'operacion':
		require ( 'operacion.class.php' );
		$obj = new operacion( $user, $pass );
		break;

	case 'sistema':
		require ( 'sistema.class.php' );
		
		if ( $_GET['action'] != 'solicitudInicioSesion' ) 			
		    $obj = new sistema( $user, $pass );

		else 
		{			
		    $_SESSION['host'] = 'localhost';
		    $_SESSION['user'] = $_POST['usuario']['valor'];
		    $_SESSION['pass'] = $_POST['clave']['valor'];		    
		    
		    $user = $_SESSION['user'];
		    $pass = $_SESSION['pass'];
		    $host = $_SESSION['host'];

		    $obj = new sistema( $user, $pass );
		}
		break;

	case 'sistemasGenerador':
		require ( 'sistemasGenerador.class.php' );
		$obj = new sistemasGenerador( $user, $pass );
		break;

	case 'status':
		require ( 'status.class.php' );
		$obj = new status( $user, $pass );
		break;

	case 'unidades':
		require ( 'unidades.class.php' );
		$obj = new unidades( $user, $pass );
		break;

	case 'usuarios':
		require ( 'usuarios.class.php' );
		$obj = new usuarios( $user, $pass );
		break;
	
	default:
		echo json_encode( "Clase indefinida" ); return 0;
		break;
}

if ( $obj->estadoConexion ) $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( array(
	'status' => array( 'transaccion' => 'ERROR', 'msj' => "Acceso no autorizado" ),
	'eventos' => array()
));