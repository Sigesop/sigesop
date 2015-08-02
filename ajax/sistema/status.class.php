<?php
include 'sigesop.class.php';

class status extends sigesop
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }

    function solicitudAjax( $accion, $post, $get ) {
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

    function comprobarDatosPrincipalesNulos () {  

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

    function obtenerCapacidadEfectiva () {
        $arr = array();

        # encuentra la capacidad efectiva de toda la central
        $sql = 
            "SELECT capacidad_efectiva_central, capacidad_instalada FROM central";
        $query = $this->array_query( $sql );
        $arr[ 'capacidad_efectiva_central' ] = $query[ 0 ][ 'capacidad_efectiva_central' ];
        $arr[ 'capacidad_instalada_central' ] = $query[ 0 ][ 'capacidad_instalada' ];

        # encuentra las unidades disponibles en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS cantidad, sum( capacidad_efectiva_aero ) as mw ".
            "FROM aeros WHERE  estado_licencia = 'DISPONIBLE'";
        $query = $this->query( $sql );
        $arr[ 'disponible' ][ 'generadores' ] = $query[ 'cantidad' ];
        $arr[ 'disponible' ][ 'mw' ] = $query[ 'mw' ];

        # encuentra las unidades con Falta de Aire en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS cantidad, sum( capacidad_efectiva_aero ) as mw ".
            "FROM aeros WHERE  estado_licencia = 'F.A.'";
        $query = $this->query( $sql );
        $arr[ 'falta_aire' ][ 'generadores' ] = $query[ 'cantidad' ];
        $arr[ 'falta_aire' ][ 'mw' ] = $query[ 'mw' ];

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS cantidad, ".
            "sum( capacidad_efectiva_aero ) AS mw ".
            "FROM aeros WHERE estado_licencia = 'MTTO'";
        $query = $this->query( $sql );
        $arr[ 'mtto' ][ 'generadores' ] = $query[ 'cantidad' ];
        $arr[ 'mtto' ][ 'mw' ] = $query[ 'mw' ];

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS cantidad, ".
            "sum(capacidad_efectiva_aero) AS mw ".
            "FROM aeros WHERE  estado_licencia = 'C.A.'";
        $query = $this->query( $sql );
        $arr[ 'causa_ajena' ][ 'generadores' ] = $query[ 'cantidad' ];
        $arr[ 'causa_ajena' ][ 'mw' ] = $query[ 'mw' ];     

        # encuentra las unidades en mantenimiento en toda la central
        $sql = 
            "SELECT count(estado_licencia) AS cantidad, ".
            "sum( capacidad_efectiva_aero ) AS mw ".
            "FROM aeros WHERE estado_licencia = 'FALLA'";
        $query = $this->query( $sql );
        $arr[ 'falla' ][ 'generadores' ] = $query[ 'cantidad' ];
        $arr[ 'falla' ][ 'mw' ] = $query[ 'mw' ];

        $arr[ 'unidades' ] = $this->obtenerDatosGraficas();

        return $arr;
    }

    function obtenerDatosGraficas () {
        /* buscamos el numero de unidades existentes y lo guardamos en un array numerico
         */ 
        $sql = 'SELECT numero_unidad FROM unidad_aero';
        $numeroUnides = $this->array_query( $sql, 'numero_unidad', null );
        $arr = array();

        if ( empty( $numeroUnides ) ) 
            return null;

        $consulta = null;      
        foreach ( $numeroUnides as $unidad ) {
            $mtz = array();

            $sql = 
                "SELECT numero_unidad, capacidad_instalada, ".
                "capacidad_efectiva_unidad ".
                "FROM unidad_aero ".
                "WHERE numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz [ 'numero_unidad' ] = $query[ 'numero_unidad' ];
            $mtz [ 'capacidad_instalada' ] = $query[ 'capacidad_instalada' ];
            $mtz [ 'capacidad_efectiva_unidad' ] = $query[ 'capacidad_efectiva_unidad' ];

            // obtiene numero de generadores totales instalados en la unidad
            $sql = 
                "SELECT count(numero_aero) AS numero_generadores_unidad ".
                "FROM aeros WHERE numero_unidad = ".$unidad;

            $query = $this->query( $sql, 'numero_generadores_unidad', 0 );             
            $mtz[ 'numero_generadores_unidad' ] = $query;            

            // obtiene numero de generadores en disponibilidad
            $sql = 
                "SELECT count(numero_aero) AS cantidad, ".
                "COALESCE( sum(capacidad_efectiva_aero), 0 ) AS mw ".
                "FROM aeros WHERE estado_licencia = 'DISPONIBLE' ".
                "AND numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz[ 'disponible' ][ 'generadores' ] = $query[ 'cantidad' ];
            $mtz[ 'disponible' ][ 'mw' ] = $query[ 'mw' ];

            // obtiene numero de generadores con Falta de Aire
            $sql = 
                "SELECT count(numero_aero) AS cantidad, ".
                "COALESCE( sum(capacidad_efectiva_aero), 0 ) AS mw ".
                "FROM aeros WHERE estado_licencia = 'F.A.' ".
                "AND numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz[ 'falta_aire' ][ 'generadores' ] = $query[ 'cantidad' ];
            $mtz[ 'falta_aire' ][ 'mw' ] = $query[ 'mw' ];

            // obtiene numero de generadores en mantenimiento
            $sql = 
                "SELECT count(numero_aero) AS cantidad, ".
                "COALESCE( sum(capacidad_efectiva_aero), 0 ) AS mw ".
                "FROM aeros WHERE estado_licencia = 'MTTO' ".
                "AND numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz[ 'mtto' ][ 'generadores' ] = $query[ 'cantidad' ];
            $mtz[ 'mtto' ][ 'mw' ] = $query[ 'mw' ];

            // obtiene numero de generadores en causas ajenas
            $sql = 
                "SELECT count(numero_aero) AS cantidad, ".
                "COALESCE( sum(capacidad_efectiva_aero), 0 ) AS mw ".
                "FROM aeros WHERE estado_licencia = 'C.A.' ".
                "AND numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz[ 'causa_ajena' ][ 'generadores' ] = $query[ 'cantidad' ];
            $mtz[ 'causa_ajena' ][ 'mw' ] = $query[ 'mw' ];

            // obtiene numero de generadores en falla
            $sql = 
                "SELECT count(numero_aero) AS cantidad, ".
                "COALESCE( sum(capacidad_efectiva_aero), 0 ) AS mw ".
                "FROM aeros WHERE estado_licencia = 'FALLA' ".
                "AND numero_unidad = ".$unidad;

            $query = $this->query( $sql );
            $mtz[ 'falla' ][ 'generadores' ] = $query[ 'cantidad' ];
            $mtz[ 'falla' ][ 'mw' ] = $query[ 'mw' ];
           
            // obtener capacidades efectivas de cada aerogenerador
            $sql = 
                "SELECT numero_aero, capacidad_efectiva_aero, ".
                "DATE_FORMAT( fecha_operacion, '%d-%m-%Y' ) ".
                "AS fecha_operacion, estado_licencia ".
                "FROM aeros WHERE numero_unidad = ".$unidad;

            $mtz[ 'generadores' ] = $this->array_query( $sql );

            $arr[] = $mtz; 
        }

        return $arr;
    }
}