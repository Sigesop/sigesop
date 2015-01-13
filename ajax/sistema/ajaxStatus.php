<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class ajaxStatus extends funcionesPrimarias{

    public function ajaxStatus( $host, $usuario, $clave, $baseDatos )
    {
    	parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
    }

    function solicitudAjax( $accion, $post, $get ) 
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ($accion)
        {     
            case 'comprobarDatosPrincipalesNulos':
                $comprobarDatosPrincipalesNulos = $this->comprobarDatosPrincipalesNulos();
                echo json_encode($comprobarDatosPrincipalesNulos);                
                break;      

            case 'obtenerCapacidadEfectiva':
                $obtenerCapacidadEfectiva = $this->obtenerCapacidadEfectiva();
                echo json_encode($obtenerCapacidadEfectiva);    
                break;

            case 'obtenerDatosGraficas':
                $obtenerDatosGraficas = $this->obtenerDatosGraficas();
                echo json_encode($obtenerDatosGraficas);
                break;

            case 'procesarTablaCapacidades':
                $procesarTablaCapacidades = $this->procesarTablaCapacidades($get['unidad']);
                echo json_encode($procesarTablaCapacidades);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase AjaxStatus');
                break;                
        }  
    }

    function comprobarDatosPrincipalesNulos () 
    {  

        // roles
        // area_trabajo
        // personal
        // central

        $SQL_consultaRoles = "select  * from roles";
        $consulta = $this->consultaSimpleArrayNumericoMultiple($SQL_consultaRoles, $this->conexion);
        if (!empty($consulta)) {
            $returnConsulta['roles'] = 'OK';
        } else {
            $returnConsulta['roles'] = null;
        }
        
        $SQL_consultaAreaTrabajo = "select  * from area_trabajo";
        $consulta = $this->consultaSimpleArrayNumericoMultiple($SQL_consultaAreaTrabajo, $this->conexion);
        if (!empty($consulta)) {
            $returnConsulta['areaTrabajo'] = 'OK';
        } else {
            $returnConsulta['areaTrabajo'] = null;
        }

        $SQL_consultaPersonal = "select  * from personal";
        $consulta = $this->consultaSimpleArrayNumericoMultiple($SQL_consultaPersonal, $this->conexion);
        if (!empty($consulta)) {
            $returnConsulta['personal'] = 'OK';
        } else {
            $returnConsulta['personal'] = null;
        }

        $SQL_consultaCentral = "select  * from central";
        $consulta = $this->consultaSimpleArrayNumericoMultiple($SQL_consultaCentral, $this->conexion);
        if (!empty($consulta)) {
            $returnConsulta['central'] = 'OK';
        } else {
            $returnConsulta['central'] = null;
        }  

        // $SQL_consultaCentral = "select * from central";
        // $consulta = $this->consultaSimpleMergeArrayNumericoMultiple($consulta, $consulta, $SQL_consultaCentral, $this->conexion);
        // return $consulta;

        return $returnConsulta;
    }

    function obtenerCapacidadEfectiva () 
    {
        $conexion = $this->conexion;
        $arr = array();

        // encuentra la capacidad efectiva de toda la central
        $sql = "select capacidad_efectiva_central, capacidad_instalada from central";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr[ 'capacidad_efectiva_central' ] = $query[ 0 ][ 'capacidad_efectiva_central' ];
        $arr[ 'capacidad_instalada_central' ] = $query[ 0 ][ 'capacidad_instalada' ];

        // encuentra las unidades disponibles en toda la central
        $sql = "select count(estado_licencia) as genDispo from aeros where  estado_licencia = 'disponible'";
        $query = $this->consultaSimpleArrayNumerico( $sql, "genDispo", $conexion, 0 );
        $arr[ 'genDispo' ] = $query[ 0 ];

        // encuentra las unidades en mantenimiento en toda la central
        $sql = "select count(estado_licencia) as genMantto, sum(capacidad_efectiva_aero) as MWMantto from aeros where  estado_licencia = 'mtto'";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr[ 'genMantto' ] = $query[ 0 ][ 'genMantto' ];
        $arr[ 'MWMantto' ] = $query[ 0 ][ 'MWMantto' ];        

        // encuentra las unidades en mantenimiento en toda la central
        $sql = "select count(estado_licencia) as genCA, sum(capacidad_efectiva_aero) as MWca from aeros where  estado_licencia = 'c.a.'";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr[ 'genCA' ] = $query[ 0 ][ 'genCA' ];
        $arr[ 'MWca' ] = $query[ 0 ][ 'MWca' ];         

        // encuentra las unidades en mantenimiento en toda la central
        $sql = "select count(estado_licencia) as genFalla, sum(capacidad_efectiva_aero) as MWFalla from aeros where  estado_licencia = 'falla'";
        $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
        $arr[ 'genFalla' ] = $query[ 0 ][ 'genFalla' ];
        $arr[ 'MWFalla' ] = $query[ 0 ][ 'MWFalla' ];

        $arr[ 'unidades' ] = $this->obtenerDatosGraficas();

        return $arr;
    }

    function obtenerDatosGraficas () 
    {
        $conexion = $this->conexion;
        // buscamos el numero de unidades existentes y lo guardamos en un array numerico
        $sql = 'select numero_unidad from unidad_aero';
        $numeroUnides = $this->consultaSimpleArrayNumerico( $sql, 'numero_unidad', $this->conexion, null );
        $arr = array();

        if( $numeroUnides != null )
        {              
            $consulta = null;      
            foreach ( $numeroUnides as $unidad )
            {   
                $mtz = array();

                $sql = "select numero_unidad, capacidad_instalada, capacidad_efectiva_unidad from unidad_aero where numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );
                $mtz [ 'numero_unidad' ] = $query[ 0 ][ 'numero_unidad' ];
                $mtz [ 'capacidad_instalada' ] = $query[ 0 ][ 'capacidad_instalada' ];
                $mtz [ 'capacidad_efectiva_unidad' ] = $query[ 0 ][ 'capacidad_efectiva_unidad' ];

                // obtiene numero de generadores disponibles
                $sql = "select count(numero_aero) as numGenAct from aeros where estado_licencia = 'disponible' and numero_unidad = ".$unidad;
                $query =$this->consultaSimpleArrayNumerico( $sql, 'numGenAct', $conexion, 0 );
                $mtz[ 'numGenAct' ] = $query[ 0 ];

                // obtiene numero de generadores en mantenimiento
                $sql = "select count(numero_aero) as numGenMantto from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'numGenMantto', $conexion, 0 );
                $mtz[ 'numGenMantto' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en mantenimiento
                $sql = "select sum(capacidad_efectiva_aero) as MWMantto from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'MWMantto', $conexion, 0 );
                $mtz[ 'MWMantto' ] = $query[ 0 ];

                // // obtiene numero de generadores en causas ajenas
                $sql = "select count(numero_aero) as numGenCA from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'numGenCA', $conexion, 0 ); 
                $mtz[ 'numGenCA' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en causas ajenas
                $sql = "select sum(capacidad_efectiva_aero) as MWca from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'MWca', $conexion, 0 );            
                $mtz[ 'MWca' ] = $query[ 0 ];

                // // obtiene numero de generadores en falla
                $sql = "select count(numero_aero) as numGenFalla from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'numGenFalla', $conexion, 0 ); 
                $mtz[ 'numGenFalla' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en falla
                $sql = "select sum(capacidad_efectiva_aero) as MWFalla from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'MWFalla', $conexion, 0 );            
                $mtz[ 'MWFalla' ] = $query[ 0 ];

                // // obtiene numero de generadores totales instalados en la unidad
                $sql = "select count(numero_aero) as numGen from aeros where numero_unidad = ".$unidad;
                $query = $this->consultaSimpleArrayNumerico( $sql, 'numGen', $conexion, 0 );             
                $mtz[ 'numGen' ] = $query[ 0 ];
               
                // obtener capacidades efectivas de cada aerogenerador
                $sql = 'select numero_aero, capacidad_efectiva_aero, fecha_operacion, estado_licencia from aeros where numero_unidad = "'.$unidad.'"';
                $mtz[ 'generadores' ] = $this->consultaSimpleArrayNumericoMultiple( $sql, $conexion );

                $arr[] = $mtz;
            }

            return $arr;
        } return null;
    }

    function procesarTablaCapacidades ($unidad) 
    {
        if($unidad != null & $unidad != '')
        {
            // obtiene la capacidad instala de la unidad especificada
            $consulta = "select capacidad_instalada from unidad_aero where numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimple($consulta, 'capacidad_instalada', 'capacidad_instalada', $this->conexion, 0);

            // obtiene la capacidad efectiva de la unidad especificada
            $consulta = "select capacidad_efectiva_unidad from unidad_aero where numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'capacidad_efectiva_unidad', 'capacidad_efectiva_unidad', $this->conexion, 0);

            // obtiene numero de generadores disponibles
            $consulta = "select count(numero_aero) from aeros where estado_licencia = 'disponible' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'numGenAct', 'count(numero_aero)', $this->conexion, 0);

            // obtiene numero de generadores en mantenimiento
            $consulta = "select count(numero_aero) from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'numGenMantto', 'count(numero_aero)', $this->conexion, 0);

            // obtiene numero de MegaWatts en mantenimiento
            $consulta = "select sum(capacidad_efectiva_aero) from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'MWMantto', 'sum(capacidad_efectiva_aero)', $this->conexion, 0);

            // obtiene numero de generadores en causas ajenas
            $consulta = "select count(numero_aero) from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'numGenCA', 'count(numero_aero)', $this->conexion, 0); 

            // obtiene numero de MegaWatts en causas ajenas
            $consulta = "select sum(capacidad_efectiva_aero) from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'MWca', 'sum(capacidad_efectiva_aero)', $this->conexion, 0);            

            // obtiene numero de generadores en falla
            $consulta = "select count(numero_aero) from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'numGenFalla', 'count(numero_aero)', $this->conexion, 0); 

            // obtiene numero de MegaWatts en falla
            $consulta = "select sum(capacidad_efectiva_aero) from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'MWFalla', 'sum(capacidad_efectiva_aero)', $this->conexion, 0);            

            // obtiene numero de generadores totales instalados en la unidad
            $consulta = "select count(numero_aero) from aeros where numero_unidad = ".$unidad;
            $Capacidades = $this->consultaSimpleMergeArray($Capacidades, $Capacidades, $consulta, 'numGen', 'count(numero_aero)', $this->conexion, 0);             


            // obtiene el nombre de los aerogeneradores de una determinada unidad
            /*********************************************************************************/
            $SQL_nombreAero = 'select numero_aero from aeros where numero_unidad = '.$unidad.' order by numero_aero asc';
            if($nombreAero = $this->conexion->query($SQL_nombreAero))
            {
                while ($filaAero = $nombreAero->fetch_assoc())
                {
                    // guardamos el numero de aerogenerador
                    $Capacidades[] = $filaAero['numero_aero'];

                    // obtener capacidades efectivas de cada aerogenerador
                    $consulta = 'select capacidad_efectiva_aero from aeros where numero_aero = "'.$filaAero['numero_aero'].'"';
                    $Capacidades = $this->consultaSimpleMergeArrayNumerico($Capacidades, $Capacidades, $consulta, 'capacidad_efectiva_aero', $this->conexion, 0);

                    // obtener la fecha de operacion de cada aerogenerador
                    $consulta = 'select fecha_operacion from aeros where numero_aero = "'.$filaAero['numero_aero'].'"';
                    $Capacidades = $this->consultaSimpleMergeArrayNumerico($Capacidades, $Capacidades, $consulta, 'fecha_operacion', $this->conexion, 'No disponible');

                    // obtener el estado de la licencia de cada aerogenerador
                    // obtener la fecha de operacion de cada aerogenerador
                    $consulta = 'select estado_licencia from aeros where numero_aero = "'.$filaAero['numero_aero'].'"';
                    $Capacidades = $this->consultaSimpleMergeArrayNumerico($Capacidades, $Capacidades, $consulta, 'estado_licencia', $this->conexion, 'Informacion no disponible');

                }
            }          
            return $Capacidades;
        } return null;
    }

}
$_SESSION['host'] = 'localhost';

//Guardamos al usuario y su password en una variable global para acceder a ellas en el resto del codigo
$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new ajaxStatus($host, $user, $pass, 'laventa_cfe');

if ( $obj->estadoConexion )   
    $obj->solicitudAjax( $_GET['action'], $_POST, $_GET );
else echo json_encode( "Acceso no autorizado" );

?>