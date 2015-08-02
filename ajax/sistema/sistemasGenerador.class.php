<?php
include 'sigesop.class.php';

class sistemasGenerador extends sigesop
{
	public function __construct( $usuario, $clave ) {
		parent::sigesop( $usuario, $clave );
	}

    public function __destruct() {
        parent::__destruct();
    }

	function solicitudAjax( $accion, $post, $get ) {
		switch ($accion)
		{
            case 'actualizarSistema':
                $actualizarSistema = $this->actualizarSistema( $post );
                echo json_encode($actualizarSistema);
                break;

            case 'eliminarSistema':
                $eliminarSistema = $this->eliminarSistema( $get );
                echo json_encode($eliminarSistema);
                break;                

            case 'nuevoSistema':
                $nuevoSistema = $this->nuevoSistema( $post );
                echo json_encode($nuevoSistema);
                break;

            case 'obtenerSistemas':
                $obtenerSistemas = $this->obtenerSistemas( $get );
                echo json_encode($obtenerSistemas);        
                break;

            case 'imprimir':
                $query = $this->imprimir($get);
                echo json_encode( $query );
                break; 

            default:
                echo json_encode('Funcion no registrada en la clase sistemasGenerador');
                break;                    
		}
	}

    function nuevoSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'id_sistema_aero', 'nombre_sistema_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data['id_sistema_aero']['valor'];
        $nombre_sistema_aero = $data['nombre_sistema_aero']['valor'];

        $sql = 
            "INSERT INTO sistema_aero(id_sistema_aero, nombre_sistema_aero) ".
            "VALUES('$id_sistema_aero', '$nombre_sistema_aero')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema ingresado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nuevo sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_sistema_aero, 'msj' => $query );
            return $rsp;
        }
    }

    function actualizarSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'id_sistema_aero', 'nombre_sistema_aero', 'id_sistema_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data['id_sistema_aero']['valor'];
        $nombre_sistema_aero = $data['nombre_sistema_aero']['valor'];
        $id_sistema_aero_update = $data['id_sistema_aero_update']['valor']; 

        $sql = 
            "UPDATE sistema_aero ".
            "SET id_sistema_aero = '$id_sistema_aero', ".
            "nombre_sistema_aero='$nombre_sistema_aero' ".
            "WHERE id_sistema_aero='$id_sistema_aero_update'";  

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema actualizado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_sistema_aero, 'msj' => $query );
            return $rsp;
        }     
    }

    function obtenerSistemas($get) {
        $sistema = $get[ 'sistema' ]; 
        $option = $get[ 'option' ];
       // $option2 = $get[ 'option2' ];

        if ( !empty( $sistema ) ) $opt = 'sistema';
        else $opt = null;

        switch ( $opt ) 
        {
                case 'sistema':
                    switch ($option) {
                        case 'nombre_sistema':   
                            if( $sistema=="TODOS LOS SISTEMAS")
                            {
                                $sql = "SELECT id_sistema_aero, nombre_sistema_aero FROM sistema_aero ";
                            }
                            else
                                {
                                 $sql = 
                                "SELECT id_sistema_aero, nombre_sistema_aero FROM sistema_aero ".
                                "WHERE nombre_sistema_aero = '$sistema' "; 
                                }
                                //return $sql;
                        break;

                     // default:
                     //            $sql = "select * from sistema_aero";
                     //    break;
                    }
                break;
               
                default:
                         $sql = "SELECT * FROM sistema_aero";
                        break;
        }


        $query = $this->array_query( $sql );
        return $query;  
    }

    function eliminarSistema( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'id_sistema_aero' ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_sistema_aero = $data[ 'id_sistema_aero' ];

        $sql = 
            "DELETE FROM sistema_aero WHERE id_sistema_aero = '$id_sistema_aero'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Sistema eliminado satisfactoriamente.' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_sistema_aero, 'msj' => 'Correcto' );            
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al eliminar sistema' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_sistema_aero, 'msj' => $query );
            return $rsp;
        }      
    }

    public function imprimir ( $get) {
        require_once('../tcpdf/tcpdf.php');

        // create new PDF document
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // set document information
        $pdf->SetCreator( 'Sistema de Gestión Operativa' );
        $pdf->SetAuthor( 'Comisión Federal del Electricidad' );
        $pdf->SetTitle( 'Reporte de sistema generadores' );
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
        $datos = $this->obtenerSistemas( $get);
       
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'Id sistema aero', 'campo'=> 'id_sistema_aero', ),
                    array( 'titulo' => 'Nombre del sistema aero', 'campo'=> 'nombre_sistema_aero', )
                     ), 

                $datos
            );

        // output the HTML content
        $pdf->writeHTML( $html, true, false, true, false, '' );

        // reset pointer to the last page
        $pdf->lastPage();
        $pdf->Output('/Reporte_sistemaGenerador.pdf', 'I');
    }
}