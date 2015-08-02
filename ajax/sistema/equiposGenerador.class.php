<?php
include 'sigesop.class.php';

class equiposGenerador extends sigesop 
{
    public function __construct( $usuario, $clave ) {
        parent::sigesop( $usuario, $clave );
    }

    public function __destruct() {
        parent::__destruct();
    }

	public  function solicitudAjax( $accion, $post, $get ) {
		switch ( $accion ) {
            case 'actualizarEquipoGenerador':
                $query = $this->actualizarEquipoGenerador( $post );
                echo json_encode( $query );
                break;  

            case 'eliminarEquipoGenerador':
                $query = $this->eliminarEquipoGenerador( $get );
                echo json_encode( $query );
              break;

	        case 'nuevoEquipoGenerador':
	            $query = $this->nuevoEquipoGenerador( $post );
	            echo json_encode( $query );
	            break;

	        case 'obtenerEquipoGenerador':
	            $query = $this->obtenerEquipoGenerador( $get );
	            echo json_encode( $query );
	            break;

            case 'obtenerEquipoGeneradorPorSistema':
                $query = $this->obtenerEquipoGeneradorPorSistema( $get );
                echo json_encode( $query );
                break;

            case 'imprimir':
                $query = $this->imprimir( $get );
                echo json_encode( $query );
                break; 

            default:
                echo json_encode('Funcion no registrada en la clase equiposGenerador');
                break;                     
        }		
	}

    public function nuevoEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'nombre_equipo_aero', 'id_equipo_aero', 'id_sistema_aero'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $nombre_equipo_aero = $data[ 'nombre_equipo_aero' ][ 'valor' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ][ 'valor' ];
        $id_sistema_aero = $data[ 'id_sistema_aero' ][ 'valor' ];

        $sql = 
            "INSERT INTO equipo_aero ".
            "(id_equipo_aero, nombre_equipo_aero, id_sistema_aero) ".
            "VALUES('$id_equipo_aero', '$nombre_equipo_aero', '$id_sistema_aero')";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo ingresado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al insertar nuevo equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_equipo_aero, 'msj' => $query );
            return $rsp;
        }
    }    

    public function obtenerEquipoGenerador( $get ) {
        $id_sistema_aero = $get[ 'id_sistema_aero' ];
        $option = $get[ 'option' ];

        if ( !empty( $id_sistema_aero ) ) $opt = 'sistema';
        else $opt = null;

        switch( $opt ) {
            case 'sistema':
                if( $id_sistema_aero == 'ALL' ) $sql = "SELECT * FROM equipo_aero";
                else $sql = "SELECT * FROM equipo_aero WHERE id_sistema_aero = '$id_sistema_aero'";
                break;

            default:
                $sql = "SELECT * FROM equipo_aero";
                break;
        }

        $mtz = $this->array_query( $sql );
        $arr = array(); // matriz de retorno
        
        foreach ( $mtz as $equipo ) {
            $id_sistema_aero = $equipo[ 'id_sistema_aero' ];
            $sql = 
            "select nombre_sistema_aero from sistema_aero where id_sistema_aero = '$id_sistema_aero'";
            $query = $this->query( $sql, 'nombre_sistema_aero', NULL );

            $equipo[ 'nombre_sistema_aero' ] = $query;
            $arr [] = $equipo;
        }
        return $arr; 
    }

    public function obtenerEquipoGeneradorPorSistema( $data )  {
        $idSistema = $data['valor'];
        if ( !empty($idSistema) ) 
        {
            $sql = "select * from equipo_aero where id_sistema_aero = '$idSistema'";
            $obtenerEquipoGenerador = $this->array_query( $sql );
            return $obtenerEquipoGenerador;
        } 
        else return null;
    }

    public function eliminarEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array( 'id_equipo_aero' ) );

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $id_equipo_aero = $data[ 'id_equipo_aero' ];

        $sql = "DELETE FROM equipo_aero WHERE id_equipo_aero = '$id_equipo_aero'";
        
        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $id_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo eliminado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al aliminar equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $id_equipo_aero, 'msj' => $query );
            return $rsp;
        }
    }    

    public function actualizarEquipoGenerador( $data ) {
        $rsp = array();

        $validar = 
            $this->verificaDatosNulos( $data, array(
                'nombre_equipo_aero', 'id_equipo_aero', 'id_sistema_aero',
                'id_equipo_aero_update'
            ));

        if( $validar !== 'OK' ) {
            $rsp[ 'status' ] = array( 'transaccion' => 'NA', 'msj' => $validar[ 'msj' ] );
            $rsp[ 'eventos' ] = $validar[ 'eventos' ];
            return $rsp;
        }

        $nombre_equipo_aero = $data[ 'nombre_equipo_aero' ][ 'valor' ];
        $id_equipo_aero = $data[ 'id_equipo_aero' ][ 'valor' ];
        $id_equipo_aero_update = $data[ 'id_equipo_aero_update' ][ 'valor' ];
        $id_sistema_aero = $data[ 'id_sistema_aero' ][ 'valor' ];

        $sql = 
            "UPDATE equipo_aero ".
            "SET id_equipo_aero = '$id_equipo_aero', ".
            "nombre_equipo_aero='$nombre_equipo_aero', ".
            "id_sistema_aero='$id_sistema_aero' ".
            "WHERE id_equipo_aero='$id_equipo_aero_update'";

        $query = $this->insert_query( $sql );
        if( $query === 'OK' ) {
            $this->conexion->commit();
            $rsp [ 'eventos' ][] = array( 'estado' => 'OK', 'elem' => $nombre_equipo_aero, 'msj' => 'Correcto' );
            $rsp [ 'status' ] = array( 'transaccion' => 'OK', 'msj' => 'Equipo actualizado satisfactoriamente.' );
            return $rsp;
        } 
        else {
            $this->conexion->rollback();
            $rsp[ 'status' ] = array( 'transaccion' => 'ERROR', 'msj' => 'Error al actualizar equipo' );
            $rsp [ 'eventos' ][] = array( 'estado' => 'ERROR', 'elem' => $nombre_equipo_aero, 'msj' => $query );
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
        $pdf->SetTitle( 'Reporte de equipos generadores' );
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
        $datos = $this->obtenerEquipoGenerador( $get );
       
        $html = 
            $this->struct_tabla(
                array ( 
                    array( 'titulo' => 'Id equipo aero', 'campo'=> 'id_equipo_aero', ),
                    array( 'titulo' => 'Nombre del equipo', 'campo'=> 'nombre_equipo_aero', ),
                    array( 'titulo' => 'Nombredel sistema aero', 'campo'=> 'nombre_sistema_aero', )
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