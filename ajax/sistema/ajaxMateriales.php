<?php
include '../funcionesPrimarias.php';
session_start();
error_reporting(E_ALL ^ E_NOTICE ^ E_WARNING);

class requestMateriales extends funcionesPrimarias
{
    public function __construct($host, $usuario, $clave, $baseDatos)
    {
        parent::funcionesPrimarias($host, $usuario, $clave, $baseDatos);
    }

    function solicitudAjax($accion)
    {
        // Switch de opciones para las diferentes funciones que realizara el servidor.
        // la opcion seleccionada se envia mediante el metodos GET desde el cliente por medio del
        // la funcion ajax de JQuery.
        // Todos los datos son enviados al cliente en formato JSON

        switch ($accion)
        {        
            // Obtiene el catalogo de los materiales registrados en la base de datos
            case 'obtenerMateriales':
                $obtenerMateriales = $this->obtenerMateriales();
                echo json_encode($obtenerMateriales);
                break;

            // inserta un nuevo material a la base de datos
            case 'nuevoMaterial':
                $nuevoMaterial = $this->nuevoMaterial();
                echo json_encode($nuevoMaterial);
                break;

            // eliminar un material de la lista
            case 'eliminarMaterial':
                $eliminarMaterial = $this->eliminarMaterial();
                echo json_encode($eliminarMaterial);
                break;

            // actualiza los datos del material seleccionado
            case 'actualizarMaterial':
                $actualizarMaterial = $this->actualizarMaterial();
                echo json_encode($actualizarMaterial);
                break;

            default:
                echo json_encode('Funcion no registrada en la clase AjaxMateriales');
                break;                  
        }        
    }

    function obtenerMateriales()
    {
        $SQL_catalogoMateriales = 'select * from catalogo_materiales';
        $catalogoMateriales = $this->consultaSimpleArrayNumericoMultiple($SQL_catalogoMateriales, $this->conexion);
        return $catalogoMateriales;
    }

    function nuevoMaterial()
    {
        $cantidad = $_POST['cantidad'];
        $material = $_POST['descMaterial'];
        $observaciones = $_POST['observMaterial'];

        if($material != null & $material != '')
        {
            $SQL_nuevoMaterial = 'insert into catalogo_materiales
                (cantidad_disponible, descripcion_materiales, observaciones_materiales) values('.$cantidad.',"'.$material.'","'.$observaciones.'")';
            $nuevoMaterial = $this->consultaInsercionSimple($SQL_nuevoMaterial, $this->conexion);
            if($nuevoMaterial === 'OK') return "OK";
                else return $nuevoMaterial;
        } else return 'NA';
    }

    function eliminarMaterial()
    {
        $id_material = $_POST['id_material'];
        if ($id_material != null & $id_material != '')
        {
            $SQL_eliminarMaterial = 'delete from catalogo_materiales where id_material='.$id_material;
            $eliminarMaterial = $this->consultaInsercionSimple($SQL_eliminarMaterial, $this->conexion);
            if($eliminarMaterial === 'OK') return 'OK';
                else return $eliminarMaterial;
        } else return 'NA';
    }

    function actualizarMaterial()
    {
            // DATOS ENVIADOS MEDIANTE POST    
            // idMaterial
            // canMaterial
            // desMaterial
            // obsMaterial

            $idMaterial = $_POST['idMaterial_update'];
            $canMaterial = $_POST['cantidad-sec4'];
            $desMaterial = $_POST['descMaterial-sec4'];
            $obsMaterial = $_POST['observMaterial-sec4'];

            if ($idMaterial != null & $idMaterial != '')
            {
                $SQL_actualizarMaterial = "update catalogo_materiales set cantidad_disponible=$canMaterial, descripcion_materiales='$desMaterial', observaciones_materiales='$obsMaterial' where id_material = '$idMaterial'";
                $actualizarMaterial = $this->consultaInsercionSimple($SQL_actualizarMaterial, $this->conexion);
                if($actualizarMaterial === 'OK') return 'OK';
                    else return $actualizarMaterial;
            } else return 'NA';
    }
}

$_SESSION['host'] = 'localhost';

$user = $_SESSION['user'];
$pass = $_SESSION['pass'];
$host = $_SESSION['host'];

$obj = new requestMateriales($host , $user, $pass, 'laventa_cfe');
$obj->solicitudAjax($_GET['action']);