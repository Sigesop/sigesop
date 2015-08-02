<?php
include 'sigesop.class.php';

class gestionCentral extends sigesop 
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() { parent::__destruct(); }

    function solicitudAjax( $accion, $post, $get ) {
        switch ( $accion )
        {    
            case 'actualizarDatosCentral':
                $actualizarDatosCentral = $this->actualizarDatosCentral( $post );
                echo json_encode($actualizarDatosCentral);
                break;

	        // inserta los datos de la central
	        case 'nuevaCentral':
	            $nuevaCentral = $this->nuevaCentral( $post );
	            echo json_encode($nuevaCentral);
	            break;

            case 'imprimir':
                $query = $this->imprimir(  );
                echo json_encode( $query );
                break; 

            // Obtiene los todos los datos de la central
            case 'obtenerDatosCentral':
                $obtenerDatosCentral = $this->obtenerDatosCentral();
                echo json_encode($obtenerDatosCentral);
                break;       

            default:
                echo json_encode('Funcion no registrada en la clase gestionCentral');
                break;  

        }        
    }

    function obtenerDatosCentral() {
        $sql = 
            "SELECT clave_20, clave_sap, centro_costo, nombre_central, ".
            "direccion, telefono, cp, superintendente, capacidad_instalada ".
            "FROM central";
        $query = $this->query( $sql );
        return $query;
    }

    function nuevaCentral( $post ) {
        $rsp = array();
        $validar = 
            $this->verificaDatosNulos( $post, array(
                'clave_20', 'clave_sap', 
                'centro_costo', 'nombre_central', 'direccion', 
                'telefono', 'cp', 'superintendente'
            ));        
        
        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $clave_20 = $post["clave_20"]['valor'];
        $clave_sap = $post["clave_sap"]['valor'];
        $centro_costo = $post["centro_costo"]['valor'];
        $nombre_central = $post["nombre_central"]['valor'];
        $direccion = $post["direccion"]['valor'];
        $telefono = $post["telefono"]['valor'];
        $cp = $post["cp"]['valor'];
        $superintendente = $post["superintendente"]['valor'];

        $sql = 
            "INSERT INTO central( clave_20, clave_sap, centro_costo, ".
            "nombre_central, direccion, telefono, cp, superintendente ) ".
            "VALUES ('$clave_20', '$clave_sap', '$centro_costo', ".
            "'$nombre_central', '$direccion', '$telefono', ".
            "'$cp', '$superintendente')";

        // return $sql;
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Elemento ingresado satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$clave_20, 'msj' => 'OK' );
            $this->conexion->commit();
        } 
        else 
        {            
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_20, 'msj' => 'Error al insertar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;
    }

    function actualizarDatosCentral( $post ) {
        $rsp = array();
        $validar = 
            $this->verificaDatosNulos( $post, array(
                'clave_20_update', 'clave_20', 'clave_sap', 
                'centro_costo', 'nombre_central', 'direccion', 
                'telefono', 'cp', 'superintendente'
            ));
        
        if ( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }
        
        $clave_20_update = $post['clave_20_update']['valor'];
        $clave_20 = $post["clave_20"]['valor'];
        $clave_sap = $post["clave_sap"]['valor'];
        $centro_costo = $post["centro_costo"]['valor'];
        $nombre_central = $post["nombre_central"]['valor'];
        $direccion = $post["direccion"]['valor'];
        $telefono = $post["telefono"]['valor'];
        $cp = $post["cp"]['valor'];
        $superintendente = $post["superintendente"]['valor'];

        $sql = 
            "UPDATE central ".
            "SET clave_20 = '$clave_20', clave_sap='$clave_sap', ".
            "centro_costo='$centro_costo', nombre_central='$nombre_central', ".
            "direccion='$direccion', telefono='$telefono', ".
            "cp='$cp', superintendente='$superintendente' ".
            "WHERE clave_20 = '$clave_20_update'";

        // return $sql;
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) 
        {
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'central actualizada satisfactoriamente' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' =>$clave_20, 'msj' => 'OK' );
            $this->conexion->commit();
        } 
        else 
        {            
            $rsp [ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => $query );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $clave_20, 'msj' => 'Error al insertar los datos' );
            $this->conexion->rollback();
        }

        return $rsp;      
    }

    public function imprimir () {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de central' );
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
       $datos = array( $this->obtenerDatosCentral() );
      
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'Clave', 'campo'=> 'clave_20', 'x'=>50),
                    array( 'titulo' => 'Clave sap', 'campo'=> 'clave_sap', 'x'=>50 ),
                    array( 'titulo' => 'Centro de costo', 'campo'=> 'centro_costo', 'x'=>50 ),
                    array( 'titulo' => 'Nombre de la central', 'campo'=> 'nombre_central','x'=>200 ),
                    array( 'titulo' => 'Direccion de la central', 'campo'=> 'direccion', 'x'=>200),
                    array( 'titulo' => 'Telefono de la central', 'campo'=> 'telefono', 'x'=>200 ),
                    array( 'titulo' => 'Codigo postal de la central', 'campo'=> 'cp', 'x'=>50),
                    array( 'titulo' => 'Superintendente de la central', 'campo'=> 'superintendente', 'x'=>50),
                    array( 'titulo' => 'Capacidad instalada de la central', 'campo'=> 'capacidad_instalada',  )
                   
                ),
                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte de la central.pdf', 'I');
    }
}