<?php
require('../fpdf/fpdf.php');
class PDF extends FPDF
{
  public $x;
  public $y;

	function Header() {
    //Title
    $this->SetFont('Arial','',8);
    $this->Cell(0,3,'GERENCIA REGIONAL DE PRODUCCION SURESTE',0,1,'C');
    $this->Cell(0,3,'SUBGERENCIA REGIONAL HIDROELECTRICA GRIJALVA',0,1,'C');
    $this->Cell(0,3,'C.E LA VENTA',0,1,'C');
    $this->cell(0,3,$fech,0,1,'C');
    $this->Ln(10);
     //Ensure table header is output
    parent::Header();
  }
  
  function struct_head( $head ) {
    $this->SetFillColor(2,157,116);//Fondo verde de celda
    $this->SetTextColor(240, 255, 240); //Letra color blanco
    $this->SetFont('Arial','B',5);

    $ancho = array();

    foreach ($head as $campo) {
      $titulo = $campo['titulo'];
      $x = $campo['x'];
      // $x = $this->GetStringWidth( $titulo ) + 2;
      $this->cell( $x, 7, $titulo, 1, 0, 'C', true );
    }

    $this->ln();
  }
  
  function struct_body( $head, $datos ) {
    $this->SetFont( 'Arial','B',5 );
    $this->SetFillColor( 229, 229, 229 ); //Gris tenue de cada fila
    $this->SetTextColor( 3, 3, 3 ); //Color del texto: Negro

    foreach( $datos as $fila ) {
      foreach ( $head as $campo ) {
        $val = $campo['campo'];
        $x = $campo['x'];

        $texto = $fila[ $val ];        
        
        // $this->MultiCell( $x, 7, utf8_decode( $texto ), 'LRTB', 'L' );
        
        $posX = $this->GetX() + $x;
        // $posY = $this->GetY() + $x;
        $this->MultiCell( $x, 7, $texto, 'LRTB', 'L' );
        $this->setX( $posX );

        // $this->Cell( $x, 7, utf8_decode( $fila[ $campo ]), 'LRTB', 0 , 'L' );
        // $this->Cell( $x, 7, utf8_decode( $fila[ $campo ]), 'LRTB', 0 , 'L' );
      }
        $this->Ln(); 
    }
  }

  function struct_tabla( $head, $datos ) {
    $this->struct_head( $head );

    // $this->x = $this->GetX();
    // $this->y = $this->GetY();
    $this->struct_body( $head, $datos );
  }
 
  function Footer() {
    $this->SetY(-15);
    //Posición: a 1,5 cm del final
    $this->SetFont('Arial','I',8);
 
    $this->Cell( 0, 10, utf8_decode('Página ').$this->PageNo().'/{nb}', 0, 0, 'C');
    //PageNo nos muestra el número de página actual
    //El "/{nb}" es para que nos muestre el número de páginas máximo
    //de tal forma que se quede del tipo "Página 1/2"
    //Esto es debido a la función posterior "AliasNbPages"
  }
}