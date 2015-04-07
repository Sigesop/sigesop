<?php
include 'sigesop.class.php';

class status extends sigesop
{
    public function __construct( $usuario, $clave )
    {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct()
    {
        parent::__destruct();
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
                echo json_encode('Funcion no registrada en la clase status');
                break;                
        }  
    }

    function comprobarDatosPrincipalesNulos () 
    {  

        // roles
        // area_trabajo
        // personal
        // central
        
        $arr = array();

        $sql = "SELECT * FROM roles";
        $query = $this->array_query( $sql );
        if ( !empty( $query ) ) $arr[ 'roles' ] = 'OK';
        else $arr[ 'roles' ] = null;
        
        $sql = "SELECT  * FROM area_trabajo";
        $query = $this->array_query( $sql );
        if ( !empty( $query ) ) $arr[ 'areaTrabajo' ] = 'OK';
        else $arr[ 'areaTrabajo' ] = null;

        $sql = "SELECT * FROM personal";
        $query = $this->array_query( $sql );
        if ( !empty( $query ) ) $arr[ 'personal' ] = 'OK';
        else $arr[ 'personal' ] = null;

        $sql = "SELECT * FROM central";
        $query = $this->array_query( $sql );
        if ( !empty( $query ) ) $arr[ 'central' ] = 'OK';
        else $arr[ 'central' ] = null;

        return $arr;
    }

    function obtenerCapacidadEfectiva () 
    {
        $arr = array();

        # encuentra la capacidad efectiva de toda la central
        $sql = 
            "SELECT capacidad_efectiva_central, capacidad_instalada FROM central";
        $query = $this->array_query( $sql );
        $arr[ 'capacidad_efectiva_central' ] = $query[ 0 ][ 'capacidad_efectiva_central' ];
        $arr[ 'capacidad_instalada_central' ] = $query[ 0 ][ 'capacidad_instalada' ];

        # encuentra las unidades disponibles en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS genDispo ".
            "FROM aeros WHERE  estado_licencia = 'disponible'";
        $query = $this->array_query( $sql, "genDispo", 0 );
        $arr[ 'genDispo' ] = $query[ 0 ];

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS genMantto, sum(capacidad_efectiva_aero) ".
            "AS MWMantto FROM aeros WHERE  estado_licencia = 'mtto'";
        $query = $this->array_query( $sql );
        $arr[ 'genMantto' ] = $query[ 0 ][ 'genMantto' ];
        $arr[ 'MWMantto' ] = $query[ 0 ][ 'MWMantto' ];        

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS genCA, sum(capacidad_efectiva_aero) ".
            "AS MWca FROM aeros WHERE  estado_licencia = 'c.a.'";
        $query = $this->array_query( $sql );
        $arr[ 'genCA' ] = $query[ 0 ][ 'genCA' ];
        $arr[ 'MWca' ] = $query[ 0 ][ 'MWca' ];         

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS genFalla, sum(capacidad_efectiva_aero) AS ".
            "MWFalla FROM aeros WHERE  estado_licencia = 'falla'";
        $query = $this->array_query( $sql );
        $arr[ 'genFalla' ] = $query[ 0 ][ 'genFalla' ];
        $arr[ 'MWFalla' ] = $query[ 0 ][ 'MWFalla' ];

        $arr[ 'unidades' ] = $this->obtenerDatosGraficas();

        return $arr;
    }

    function obtenerDatosGraficas () 
    {
        // buscamos el numero de unidades existentes y lo guardamos en un array numerico
        $sql = 'select numero_unidad from unidad_aero';
        $numeroUnides = $this->array_query( $sql, 'numero_unidad', null );
        $arr = array();

        if( $numeroUnides != null )
        {              
            $consulta = null;      
            foreach ( $numeroUnides as $unidad )
            {   
                $mtz = array();

                $sql = "select numero_unidad, capacidad_instalada, capacidad_efectiva_unidad from unidad_aero where numero_unidad = ".$unidad;
                $query = $this->array_query( $sql );
                $mtz [ 'numero_unidad' ] = $query[ 0 ][ 'numero_unidad' ];
                $mtz [ 'capacidad_instalada' ] = $query[ 0 ][ 'capacidad_instalada' ];
                $mtz [ 'capacidad_efectiva_unidad' ] = $query[ 0 ][ 'capacidad_efectiva_unidad' ];

                // obtiene numero de generadores disponibles
                $sql = "select count(numero_aero) as numGenAct from aeros where estado_licencia = 'disponible' and numero_unidad = ".$unidad;
                $query =$this->array_query( $sql, 'numGenAct', 0 );
                $mtz[ 'numGenAct' ] = $query[ 0 ];

                // obtiene numero de generadores en mantenimiento
                $sql = "select count(numero_aero) as numGenMantto from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'numGenMantto', 0 );
                $mtz[ 'numGenMantto' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en mantenimiento
                $sql = "select sum(capacidad_efectiva_aero) as MWMantto from aeros where estado_licencia = 'mtto' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'MWMantto', 0 );
                $mtz[ 'MWMantto' ] = $query[ 0 ];

                // // obtiene numero de generadores en causas ajenas
                $sql = "select count(numero_aero) as numGenCA from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'numGenCA', 0 ); 
                $mtz[ 'numGenCA' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en causas ajenas
                $sql = "select sum(capacidad_efectiva_aero) as MWca from aeros where estado_licencia = 'c.a.' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'MWca', 0 );            
                $mtz[ 'MWca' ] = $query[ 0 ];

                // // obtiene numero de generadores en falla
                $sql = "select count(numero_aero) as numGenFalla from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'numGenFalla', 0 ); 
                $mtz[ 'numGenFalla' ] = $query[ 0 ];

                // // obtiene numero de MegaWatts en falla
                $sql = "select sum(capacidad_efectiva_aero) as MWFalla from aeros where estado_licencia = 'falla' and numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'MWFalla', 0 );            
                $mtz[ 'MWFalla' ] = $query[ 0 ];

                // // obtiene numero de generadores totales instalados en la unidad
                $sql = "select count(numero_aero) as numGen from aeros where numero_unidad = ".$unidad;
                $query = $this->array_query( $sql, 'numGen', 0 );             
                $mtz[ 'numGen' ] = $query[ 0 ];
               
                // obtener capacidades efectivas de cada aerogenerador
                $sql = 'select numero_aero, capacidad_efectiva_aero, DATE_FORMAT(fecha_operacion, "%d-%m-%Y" ) as fecha_operacion, estado_licencia from aeros where numero_unidad = "'.$unidad.'"';
                $mtz[ 'generadores' ] = $this->array_query( $sql );

                $arr[] = $mtz; 
            }

            return $arr;
        } return null;
    }
}