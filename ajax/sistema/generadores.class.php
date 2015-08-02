<?php
include 'sigesop.class.php';

class generadores extends sigesop
{
    private $estadoLicencia = array('C.A.', 'FALLA', 'MTTO', 'F.A.');

    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }  

	function solicitudAjax( $accion, $post, $get ) {
        switch ( $accion )
        {
            case 'actualizarGenerador':
                $actualizarGenerador = $this->actualizarGenerador( $post );
                echo json_encode($actualizarGenerador);
                break;

            case 'eliminarGenerador':
                $eliminarGenerador = $this->eliminarGenerador( $get );
                echo json_encode($eliminarGenerador);
                break;

            case 'imprimir':
                $query = $this->imprimir( $get );
                echo json_encode( $query );
                break; 

            case 'nuevoGenerador':
                $nuevoGenerador = $this->nuevoGenerador( $post );
                echo json_encode( $nuevoGenerador );
                break;

            case 'obtenerEstadoLicencia':
                $obtenerEstadoLicencia = $this->obtenerEstadoLicencia();
                echo json_encode($obtenerEstadoLicencia);
                break;

            case 'obtenerGeneradores':
                $query = $this->obtenerGeneradores( $get );
                echo json_encode( $query );
                break;

            case 'obtenerGeneradoresPorUnidad':
                $obtenerGeneradoresPorUnidad = $this->obtenerGeneradoresPorUnidad( $get );
                echo json_encode($obtenerGeneradoresPorUnidad);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase generadores');
                break;                  
        }		
	}

    function obtenerEstadoLicencia() { return $this->estadoLicencia; } 

    function obtenerGeneradores( $get ) {
        
        $numero_unidad = $get[ 'numero_unidad' ];
        $numero_aero = $get[ 'numero_aero' ];

        $option = $get[ 'option' ];
       // $option2 = $get[ 'option2' ];

        if ( !empty( $numero_unidad ) ) $opt = 'numero_unidad';
        else if ( !empty( $numero_aero ) ) $opt = 'numero_aero';
        else $opt = null;

        switch ( $opt ) 
        {
            case 'numero_unidad':
                switch ( $option ) {
                    case 'libro_relatorio':
                        $sql =  
                        "SELECT * FROM aeros where numero_unidad = '$numero_unidad' ".
                        "AND numero_aero NOT IN( SELECT numero_aero FROM libro_relatorio WHERE estado_evento = TRUE )";
                        break;
                    
                    case 'unidad':
                        if( $numero_unidad=="TODAS" ) $sql = "select * from aeros";
                        else $sql = "select * from aeros where numero_unidad = '$numero_unidad'";
                        break;

                    default: 
                        $sql = "SELECT * FROM aeros WHERE numero_unidad = '$numero_unidad'";
                        break;
                }
           
            break;

            case 'numero_aero':
                $sql = "select * from aeros where numero_aero = '$numero_aero'";
                break;
            
            default:
           
                $sql = "select * from aeros";
                break;
        }
        $query = $this->array_query( $sql );
        return $query;
    }

    function obtenerGeneradoresPorUnidad( $data ) {
        $unidad = $data['unidad'];
        $sql = "SELECT * FROM aeros WHERE numero_unidad = ".$unidad;
        $query = $this->array_query( $sql );
        return $query;
    }

    function nuevoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'numero_unidad', 'numero_aero', 'capacidad_efectiva_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
        $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ][ 'valor' ];
        
        $sql = 
            "INSERT INTO aeros(numero_unidad, numero_aero, capacidad_efectiva_aero) ".
            "VALUES('$numero_unidad', '$numero_aero', $capacidad_efectiva_aero)";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nueva Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function actualizarGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'numero_unidad', 'numero_aero', 
                'capacidad_efectiva_aero', 'numero_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_unidad = $data[ 'numero_unidad' ][ 'valor' ];
        $numero_aero = $data[ 'numero_aero' ][ 'valor' ];
        $capacidad_efectiva_aero = $data[ 'capacidad_efectiva_aero' ] [ 'valor' ];
        $numero_aero_update = $data[ 'numero_aero_update' ] [ 'valor' ];
        
        $sql = 
            "UPDATE aeros ".
            "SET numero_unidad = $numero_unidad, ".
            "numero_aero = '$numero_aero', ".
            "capacidad_efectiva_aero = $capacidad_efectiva_aero ".
            "WHERE numero_aero = '$numero_aero_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function eliminarGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'numero_aero' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $numero_aero = $data['numero_aero'];

        $sql = "DELETE FROM aeros WHERE numero_aero = '$numero_aero'";
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Aerogenerador eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $numero_aero, 'msj' => 'Correcto' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar Aerogenerador' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $numero_aero, 'msj' => $query );
            return $rsp;
        }
    }

    public function imprimir ( $get ) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de Generadores' );
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
        $datos = $this->obtenerGeneradores( $get);
       
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'Numero Areo', 'campo'=> 'numero_aero', ),
                    array( 'titulo' => 'Numero unidad', 'campo'=> 'numero_unidad', ),
                    array( 'titulo' => 'Estado de licencia', 'campo'=> 'estado_licencia', ),
                    array( 'titulo' => 'capacidad efectiva', 'campo'=> 'capacidad_efectiva_aero', ),
                    array( 'titulo' => 'fecha de operacion', 'campo'=> 'fecha_operacion', )
                   
                     ), 

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_equiposGenerador.pdf', 'I');
    }
}