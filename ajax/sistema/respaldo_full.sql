-- MySQL dump 10.13  Distrib 5.6.19, for Linux (x86_64)
--
-- Host: localhost    Database: laventa_cfe
-- ------------------------------------------------------
-- Server version	5.6.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acceso_rol`
--

DROP TABLE IF EXISTS `acceso_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acceso_rol` (
  `clave_rol` varchar(25) DEFAULT NULL,
  `nivelBarra` tinyint(3) unsigned NOT NULL,
  `nombre_barra` varchar(50) NOT NULL,
  `pagina_acceso_rol` varchar(50) NOT NULL,
  KEY `clave_rol` (`clave_rol`),
  CONSTRAINT `acceso_rol_ibfk_1` FOREIGN KEY (`clave_rol`) REFERENCES `roles` (`clave_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acceso_rol`
--

LOCK TABLES `acceso_rol` WRITE;
/*!40000 ALTER TABLE `acceso_rol` DISABLE KEYS */;
INSERT INTO `acceso_rol` VALUES ('ADMINISTRADOR SISTEMA',1,'Estatus','status.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Roles de Usuario','catalogoRolUsuario.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Ãreas de Trabajo','catalogoAreaTrabajo.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Usuarios','catalogoUsuarios.php'),('ADMINISTRADOR SISTEMA',2,'GestiÃ³n de la Central','gestionCentral.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Unidades','catalogoUnidades.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de AÃ©ros','catalogoAeros.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Sistemas','catalogoSistemas.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Equipos','catalogoEquipos.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Unidades de Medida','catalogoUnidadesMedida.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('ADMINISTRADOR SISTEMA',2,'CatÃ¡logo de Listas de VerificaciÃ³n','catalogoListas.php'),('ADMINISTRADOR SISTEMA',3,'CreaciÃ³n de Orden de Trabajo','creacionOrdenTrabajo.php'),('ADMINISTRADOR SISTEMA',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('ADMINISTRADOR SISTEMA',4,'Consecutivo de Licencias','consecutivoLicencia.php'),('ADMINISTRADOR SISTEMA',4,'Libro Relatorio','libroRelatorio.php'),('LECTOR UNIVERSAL',4,'Libro Relatorio','libroRelatorio.php'),('ADMINISTRADOR',1,'Estatus','status.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Roles de Usuario','catalogoRolUsuario.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Ãreas de Trabajo','catalogoAreaTrabajo.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Usuarios','catalogoUsuarios.php'),('ADMINISTRADOR',2,'GestiÃ³n de la Central','gestionCentral.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Unidades','catalogoUnidades.php'),('ADMINISTRADOR',2,'CatÃ¡logo de AÃ©ros','catalogoAeros.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Sistemas','catalogoSistemas.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Equipos','catalogoEquipos.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Materiales','materiales.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Unidades de Medida','catalogoUnidadesMedida.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('ADMINISTRADOR',2,'CatÃ¡logo de Listas de VerificaciÃ³n','catalogoListas.php'),('ADMINISTRADOR',3,'CreaciÃ³n de Orden de Trabajo','creacionOrdenTrabajo.php'),('ADMINISTRADOR',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('ADMINISTRADOR',4,'Consecutivo de Licencias','consecutivoLicencia.php'),('ADMINISTRADOR',4,'Libro Relatorio','libroRelatorio.php'),('OPERADOR',1,'Estatus','status.php'),('OPERADOR',4,'Libro Relatorio','libroRelatorio.php'),('TECNICO',1,'Estatus','status.php'),('TECNICO',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('SUPERVISOR',1,'Estatus','status.php'),('SUPERVISOR',2,'Unidades de Medida','catalogoUnidadesMedida.php'),('SUPERVISOR',2,'Listas de VerificaciÃ³n','catalogoListas.php'),('SUPERVISOR',3,'CreaciÃ³n de Orden de Trabajo','creacionOrdenTrabajo.php'),('SUPERVISOR',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('JEFATURA',1,'Estatus','status.php'),('JEFATURA',2,'Unidades','catalogoUnidades.php'),('JEFATURA',2,'Sistemas','catalogoSistemas.php'),('JEFATURA',2,'Materiales','materiales.php'),('JEFATURA',2,'Unidades de Medida','catalogoUnidadesMedida.php'),('JEFATURA',2,'Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('JEFATURA',2,'Listas de VerificaciÃ³n','catalogoListas.php'),('JEFATURA',3,'CreaciÃ³n de Orden de Trabajo','creacionOrdenTrabajo.php'),('JEFATURA',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('JEFATURA',4,'Consecutivo de Licencias','consecutivoLicencia.php'),('JEFATURA',4,'Libro Relatorio','libroRelatorio.php');
/*!40000 ALTER TABLE `acceso_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `actividad_verificar`
--

DROP TABLE IF EXISTS `actividad_verificar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `actividad_verificar` (
  `id_actividad_verificar` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `id_mantenimiento` varchar(2) DEFAULT NULL,
  `id_sistema_aero` varchar(2) DEFAULT NULL,
  `id_equipo_aero` varchar(4) DEFAULT NULL,
  `descripcion_lista_verificacion` varchar(50) NOT NULL,
  `actividad_verificar` text,
  PRIMARY KEY (`id_actividad_verificar`),
  KEY `id_mantenimiento` (`id_mantenimiento`),
  KEY `id_sistema_aero` (`id_sistema_aero`),
  KEY `id_equipo_aero` (`id_equipo_aero`),
  CONSTRAINT `actividad_verificar_ibfk_1` FOREIGN KEY (`id_mantenimiento`) REFERENCES `tipo_mantenimiento` (`id_mantenimiento`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `actividad_verificar_ibfk_2` FOREIGN KEY (`id_sistema_aero`) REFERENCES `sistema_aero` (`id_sistema_aero`) ON UPDATE CASCADE,
  CONSTRAINT `actividad_verificar_ibfk_3` FOREIGN KEY (`id_equipo_aero`) REFERENCES `equipo_aero` (`id_equipo_aero`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad_verificar`
--

LOCK TABLES `actividad_verificar` WRITE;
/*!40000 ALTER TABLE `actividad_verificar` DISABLE KEYS */;
INSERT INTO `actividad_verificar` VALUES (1,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','1.1 REVISAR TORNILLOS DEL SOPORTE DEL CONO M20 10.9 DACROMET500B'),(2,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','1.2 REVISAR APRIETE Y ESTADO FÃSICO DE LAS ABRAZADERAS DE UNIÃ“N CONO-ARO'),(3,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','1.3 REVISAR SOLDADURAS DEL SOPORTE DE LA NARIZ'),(4,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','1.4 REVISAR CONO EN BUSCA DE FISURAS'),(5,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','1.5 REVISAR LOS TORNILLOS DE LA FIBRA DE VIDRIO'),(6,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','2.1 CON LA MAQUINA EN OPERACION, PONER ATENCION AL RUIDO DEL VIENTO AL PASAR POR LAS PALAS'),(7,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','2.2 REVISAR PALAS EN BUSCA DE FISURAS, DESDE EL PISO Y EN LA RAIZ POR DENTRO DEL CONO'),(8,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','2.3 HISTORIAL DE GRIETAS, ANOTAR LA EVOLUCION DE GRIETAS ENCONTRADAS EN INSPECCIONES PASADAS'),(9,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.1 COMPROBAR RETENES EXTERIORES DE LOS RODAMIENTOS DE LAS PALAS. NOTA: DEBERA LEVANTARSE LIGERAMENTE LA GOMA EN VARIOS PUNTOS PARA COMPROBAR SI EL RETEN DEL RODAMIENTO DE PALA HA FUGADO. DEBERA TENERSE ESPECIAL CUIDADO DE NO DEFORMAR NI DAÃ‘AR LAS PROTECCIONES DE GOMA'),(10,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.2 COMPROBAR RETENES INTERIORES DE LOS RODAMIENTOS DE LAS PALAS'),(11,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.3 COMPROBAR EL CORRECTO MOVIMIENTO DE LOS RODAMIENTOS. NOTA: ADEMAS DE COMPROBAR EL CORRECTO MOVIMIENTO DE LOS RODAMIENTOS, DEBERA CONTROLARSE QUE, AL GIRAR EL RODAMIENTO, LA GOMA NO SE MONTA SOBRE NINGUNO DE LOS TORNILLOS DE UNION PALA-BUJE, NI SOBRE LAS CHAPAS QUE SIRVEN PARA SUJETAR EL CONO AL BUJE.'),(12,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.4 COMPROBAR 4 TORNILLOS POR PALA AL AZAR EN CRUZ, ENTRE EL RODAMIENTO DE LA PALA Y BUJE. TORNILLO ISO 4014, M24, 10.9, DACROMET 500A'),(13,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.5 COMPROBAR 6 TORNILLOS POR PALA AL AZAR EN CRUZ UNIFORMEMENTE, ENTRE EL ROOT JOINT Y RODAMIENTO. TORNILLO ISO 4014, M24, 10.9, DACROMET 500A'),(14,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.6 ENGRASAR RODAMIENTOS DE LA PALAS. SHELL GREASE 14: 660 GR (110 GR POR CADA ENTRADA) REALIZAR PRUEBA DE SENOS (-3 A +87 GRADOS)'),(15,'MS','00','00','REPORTE DE MANTENIMIENTO SEMESTRAL','3.7 COMPROBAR QUE EL GUARDAPOLVOS DEL RODAMIENTO DE LA PALA ESTA CORRECTAMENTE COLOCADO, NO ALABEADO NI DEFORMADO, CUBRIENDO POR COPLETO EL RETEN Y SIN MONTARSE EN NINGUNO DE LOS TORNILLOS DE UNION DEL RODAMIENTO DE PALA AL BUJE NI SOBRE LAS CHAPAS DE UNION BUJE-CONO'),(16,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.0 COMPROBAR EL ESTADO FISICO DE LOS UTILES DE BLOQUEO DE ESTRELLA'),(17,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.1 COMPROBAR EL PAR DE APRIETE DE LOS TORNILLOS DE LA CAJA DE RODAMIENTOS A LA ESTRELLA, 4 TORNILLOS EN CRUZ, M12, 10.9, DACROMET'),(18,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.2 COMRPOBAR EL PAR DE APRIETE DE LOS TORNILLOS DE LA BRIDA DE LA CAJA DE RODAMIENTOS, 4 TORNILLOS EN CRUZ DE LA CAJA DE RODAMIENTOS (M10, 12.9, DACROMET 500B, TOLERANCIA +/- 5%)'),(19,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.3 COMPROBAR EL PAR DE APRIETE DE LA TUERCA DE PRESTENSADO (SUPERBOLT) DEL EJE EMPUJADOR, QUITAR LOS TORNILLOS JUNTO CON LA TAPA DE LA CAJA DE RODAMIENTOS, VERIFICAR APRIETES DE CADA TORNILLO.'),(20,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.4 COPROBAR PAR DE LAS 3 TUERCAS DE LOS PINES DE LA ESTRELLA. TOLERANCIA +/- 10 NM'),(21,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.5 COMPROBAR EL PAR EN LAS TUERCAS DE LOS PINES DE PALA, RETIRAR LOS CIRCLIPS QUE SUJETAN LOS PORTECTORES, RETIRAR LOS 6 PROTECTORES. TOLERANCIA +/- 30 NM'),(22,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.6 COPROBAR ESTADO SUPERFICIAL DEL EJE HUECO DEL PITCH'),(23,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.7 VERIFICAR SUPERFICIE DE DESLIZAMIENTO DEL EJE ANTIRROTACION'),(24,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.8 ENGRASAR EL EJE ANTIRROTACION CON GRASA SKF LGWM 1'),(25,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.9 ENGRASAR LA CAJA DE RODAMIENTOS CON GRASA SKF LGWM 1 (100 GR)'),(26,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.10 ENGRASAR SOPORTE DELANTERO DEL EJE HUECO. GRASA SKF LGWM 1 (110 GR)'),(27,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.11 COMPROBAR LA HOLGURA MAZIMA DEL EJE HUECO CONTRA EL COJINETE DE DESLIZAMIENTO SOPORTE. SI LA HOLGURA EXCEDE ESTE VALOR REPORTARLO'),(28,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.12 COMPROBAR LA HOLGURA ENTRE EL CASQUILLO DE DESLIZAMIENTO Y LA BARRA ANTIRROTACION, SI EXCEDE ESTA VALOR REPORTARLO.'),(29,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','4.13 COMPROBAR HOLGURA DE LA BARRA ANTIRROTACION Y EL CASQUILLO'),(30,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','5.1 COMPROBAR FUGAS EN EL CILINDRO HIDRAULICO Y EN MANGUERAS'),(31,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','5.2 COMPROBAR PAR DE APRIETE DEL ACOPLAMIENTO ENTRE EL CILINDRO HIDRAULICO Y EJE EMPUJADOR'),(32,'MS','00','02','REPORTE DE MANTENIMIENTO SEMESTRAL','5.3 VERIFICAR EL EJE EMPUJADOR A TRAVÃ‰S DE LA MULTIPLICADORA, REPORTAR EN CASO DE EXISTIR RUIDOS EXTRAÃ‘OS'),(33,'MS','00','01','REPORTE DE MANTENIMIENTO SEMESTRAL','6.1 COMPROBAR TORNILLOS DE UNION ENTRE ROTOR Y EJE PRINCIPAL, 4 TORNILLOS AL EZAR EN CRUZ, M33, 10.9, DACROMET (TOLERANCIA +/- 100 NM)'),(34,'MS','00','01','REPORTE DE MANTENIMIENTO SEMESTRAL','6.2 COMPROBAR LOS RETENES INTERIORES DE LOS RODAMIENTOS PRINCIPALES (SEGUN ES000010 REV-17, PAG 11 DE 104)'),(35,'MS','00','01','REPORTE DE MANTENIMIENTO SEMESTRAL','6.3 ENGRASAR RODAMIENTOS PRINCIPALES. GRASA SKF LGWM 1 (400 GR SEGUN ES000010 REV. 17, PAG 11 DE 104)'),(36,'MS','00','01','REPORTE DE MANTENIMIENTO SEMESTRAL','6.4 COMPROBAR PAR DE APRIETE DE UNION DEL CABALLETE Y BASTIDOR, TORNILLOS M36, 8.8, DACROMET. (TOLERANCIA +/- 20 NM)'),(37,'MS','01','11','REPORTE DE MANTENIMIENTO SEMESTRAL','7.1 COMPROBAR PAR DE LOS TORNILOS M24, 10.9, GZN, DEL EMBOLO DE LOS AMORTIGUADORES.'),(38,'MS','01','11','REPORTE DE MANTENIMIENTO SEMESTRAL','7.1 B COMPROBAR PAR DE APRIETE DE LOS TORNILLOS M16, 10.9, DACROMET DE LA HORQUILLA. (TOLERANCIA +/- 26 NM)'),(39,'MS','01','11','REPORTE DE MANTENIMIENTO SEMESTRAL','7.3 COMPROBAR BULONES DE CONEXION A LAS ROTULAS'),(40,'MS','01','11','REPORTE DE MANTENIMIENTO SEMESTRAL','7.4 COMPROBAR DESGASTE DE LAS ROTULAS'),(41,'MS','01','13','REPORTE DE MANTENIMIENTO SEMESTRAL','8.1 COMPROBAR EL PAR DE APRIETE DEL COLLARIN CONICO, TORNILLOS M27, 10.9, DACROMET 500A (TOLERANCIA +/- 145 NM)'),(42,'MS','01','13','REPORTE DE MANTENIMIENTO SEMESTRAL','8.2 COMPROBAR ESTADO DE LA PINTURA Y ASPECTO EXTERIOR DEL COLLARIN CONICO'),(43,'MS','01','10','REPORTE DE MANTENIMIENTO SEMESTRAL','9.1 COMPROBAR FUGAS EN EL EXTERIOR DE LA CAJA DE ENGRANES'),(44,'MS','01','10','REPORTE DE MANTENIMIENTO SEMESTRAL','9.2 COMPROBAR EL NIVEL DE ACEITE EN PARO. FUCHS RENOLIN UNISYN CLP 320, CON VARILLA DE NIVEL'),(45,'MS','01','10','REPORTE DE MANTENIMIENTO SEMESTRAL','9.3 COMPROBAR ASPECTO DEL ACEITE'),(46,'MS','01','10','REPORTE DE MANTENIMIENTO SEMESTRAL','9.4 COMPROBAR INDICADOR MAGNETICO'),(47,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.5 MUESTRA DE ACEITE, LA MUESTRA DEBE TOMARSE DENTRO DE LOS PRIMEROS DIEZ MINUTOS DE MAQUINA PARADA (PROCEDIMIENTO 3181802)'),(48,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.6 COMPROBAR FILTRO DE ACEITE'),(49,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.7 REVISAR QUE LAS VIBRACIONES SEAN NORMALES (CON MAQUINA ACOPLADA)'),(50,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.8 COMPROBACION DE RUIDOS EN FUNCIONAMIENTO (CON MAQUINA ACOPLADA)'),(51,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.9 COMPROBACION DE HOLGURAS, PONER LA MAQUINA EN MODO PRUEBA Y APLICAR FRENOS, VARIAR LA CONSIGNA DE GRADOS DEL PITCH ENTRE 50 Y 90 GRADOS.'),(52,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.9A COMPROBACION DEL INTERIOR DE LA MULTIPLICADORA'),(53,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.10 COMPROBACION DE RODAMIENTOS (LIMPIAR LA TAPA DE INSPECCION Y LEVANTARLA)'),(54,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.11 COMPROBACION DE ENGRANAJES (DESBLOQUEAR LA MAQUINA Y PONERLA EN MODO PAUSA, COMPROBAR EL ESTADO DE LOS ENGRANES)'),(55,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.12 COMPROBAR ALINEACION RADIAL Y AXIAL CON EL INDICADOR DE CARATULA EN FLECHA DE ALTA Y FLECHA DE BAJA VELOCIDAD (ROTOR GIRANDO LENTO)'),(56,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.13 COMPROBAR HOLGURA ENTRE EL EJE PRINCIPAL CONTRA EL CASQUILLO DEL EJE DE LA MULTIPLICADORA EN TODA LA CIRCUNFERENCIA'),(57,'MS','01','10','REPORTE DE MANENIMIENTO SEMESTRAL','9.15 COMPROBAR EL ESTADO DEL TAPON DE VACIADO DE ACEITE. SI FUGA O EN ALGUNO DE LOS PROCEDIMIENTOS SE HA VISTO QUE ESTA DETERIORADO SE DEBE PROCEDER A SU CAMBIO. SE PROCEDERA DE IGUAL MODO SI OCURRE ALGO SIMILAR CON CUALQUIER OTRA CONEXION O TAPON DE LA MULTIPLICADORA O DEL BLOQUE DE VALVULAS');
/*!40000 ALTER TABLE `actividad_verificar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aeros`
--

DROP TABLE IF EXISTS `aeros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `aeros` (
  `numero_unidad` varchar(4) NOT NULL,
  `numero_aero` varchar(50) NOT NULL DEFAULT '',
  `capacidad_efectiva_aero` double unsigned NOT NULL,
  `fecha_operacion` date DEFAULT NULL,
  `estado_licencia` enum('C.A.','DISPONIBLE','FALLA','MTTO','F.A.') DEFAULT 'DISPONIBLE',
  PRIMARY KEY (`numero_aero`),
  KEY `numero_unidad` (`numero_unidad`),
  CONSTRAINT `aeros_ibfk_1` FOREIGN KEY (`numero_unidad`) REFERENCES `unidad_aero` (`numero_unidad`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aeros`
--

LOCK TABLES `aeros` WRITE;
/*!40000 ALTER TABLE `aeros` DISABLE KEYS */;
INSERT INTO `aeros` VALUES ('3','GA-01',0.85,NULL,'DISPONIBLE'),('3','GA-02',0.85,NULL,'DISPONIBLE'),('3','GA-03',0.85,NULL,'DISPONIBLE'),('3','GA-04',0.85,NULL,'DISPONIBLE'),('3','GA-05',0.85,NULL,'DISPONIBLE'),('3','GA-06',0.85,NULL,'DISPONIBLE'),('3','GA-07',0.85,NULL,'DISPONIBLE'),('3','GA-08',0.85,'2013-10-15','MTTO'),('3','GA-09',0.85,NULL,'DISPONIBLE'),('3','GA-10',0.85,NULL,'DISPONIBLE'),('3','GA-11',0.85,NULL,'DISPONIBLE'),('3','GA-12',0.85,NULL,'DISPONIBLE'),('6','GA-13',0.85,'2015-05-29','FALLA'),('6','GA-14',0.85,'2015-02-17','FALLA'),('6','GA-15',0.85,NULL,'DISPONIBLE'),('6','GA-16',0.85,'2015-03-04','FALLA'),('6','GA-17',0.85,NULL,'DISPONIBLE'),('6','GA-18',0.85,'2015-03-04','FALLA'),('6','GA-19',0.85,NULL,'DISPONIBLE'),('6','GA-20',0.85,NULL,'DISPONIBLE'),('6','GA-21',0.85,'2015-06-15','FALLA'),('6','GA-22',0.85,NULL,'DISPONIBLE'),('6','GA-23',0.85,NULL,'DISPONIBLE'),('3','GB-01',0.85,NULL,'DISPONIBLE'),('3','GB-02',0.85,NULL,'DISPONIBLE'),('3','GB-03',0.85,NULL,'DISPONIBLE'),('3','GB-04',0.85,NULL,'DISPONIBLE'),('3','GB-05',0.85,'2015-06-01','FALLA'),('3','GB-06',0.85,NULL,'DISPONIBLE'),('3','GB-07',0.85,NULL,'DISPONIBLE'),('3','GB-08',0.85,'2015-06-01','FALLA'),('5','GB-09',0.85,NULL,'DISPONIBLE'),('5','GB-10',0.85,NULL,'DISPONIBLE'),('5','GB-11',0.85,NULL,'DISPONIBLE'),('5','GB-12',0.85,NULL,'DISPONIBLE'),('5','GB-13',0.85,NULL,'DISPONIBLE'),('5','GB-14',0.85,NULL,'DISPONIBLE'),('5','GB-15',0.85,'2015-03-05','FALLA'),('6','GB-16',0.85,NULL,'DISPONIBLE'),('6','GB-17',0.85,NULL,'DISPONIBLE'),('6','GB-18',0.85,NULL,'DISPONIBLE'),('6','GB-19',0.85,NULL,'DISPONIBLE'),('6','GB-20',0.85,NULL,'DISPONIBLE'),('6','GB-21',0.85,NULL,'DISPONIBLE'),('6','GB-22',0.85,NULL,'DISPONIBLE'),('6','GB-23',0.85,NULL,'DISPONIBLE'),('2','GC-01',0.85,NULL,'DISPONIBLE'),('2','GC-02',0.85,NULL,'DISPONIBLE'),('2','GC-03',0.85,NULL,'DISPONIBLE'),('2','GC-04',0.85,NULL,'DISPONIBLE'),('2','GC-05',0.85,NULL,'DISPONIBLE'),('2','GC-06',0.85,NULL,'DISPONIBLE'),('2','GC-07',0.85,NULL,'DISPONIBLE'),('2','GC-08',0.85,NULL,'DISPONIBLE'),('2','GC-09',0.85,NULL,'DISPONIBLE'),('5','GC-10',0.85,'2014-10-29','FALLA'),('5','GC-11',0.85,NULL,'DISPONIBLE'),('5','GC-12',0.85,NULL,'DISPONIBLE'),('5','GC-13',0.85,NULL,'DISPONIBLE'),('5','GC-14',0.85,NULL,'DISPONIBLE'),('5','GC-15',0.85,NULL,'DISPONIBLE'),('5','GC-16',0.85,NULL,'DISPONIBLE'),('5','GC-17',0.85,NULL,'DISPONIBLE'),('5','GC-18',0.85,NULL,'DISPONIBLE'),('5','GC-19',0.85,NULL,'DISPONIBLE'),('5','GC-20',0.85,NULL,'DISPONIBLE'),('5','GC-21',0.85,NULL,'DISPONIBLE'),('5','GC-22',0.85,NULL,'DISPONIBLE'),('4','GC-23',0.85,NULL,'DISPONIBLE'),('4','GC-24',0.85,NULL,'DISPONIBLE'),('4','GC-25',0.85,NULL,'DISPONIBLE'),('4','GC-26',0.85,NULL,'DISPONIBLE'),('4','GC-27',0.85,NULL,'DISPONIBLE'),('2','GD-01',0.85,NULL,'DISPONIBLE'),('2','GD-02',0.85,NULL,'DISPONIBLE'),('2','GD-03',0.85,NULL,'DISPONIBLE'),('2','GD-04',0.85,NULL,'DISPONIBLE'),('2','GD-05',0.85,NULL,'DISPONIBLE'),('2','GD-06',0.85,NULL,'DISPONIBLE'),('2','GD-07',0.85,NULL,'DISPONIBLE'),('2','GD-08',0.85,NULL,'DISPONIBLE'),('2','GD-09',0.85,NULL,'DISPONIBLE'),('2','GD-10',0.85,NULL,'DISPONIBLE'),('4','GD-11',0.85,NULL,'DISPONIBLE'),('4','GD-12',0.85,NULL,'DISPONIBLE'),('4','GD-13',0.85,NULL,'DISPONIBLE'),('4','GD-14',0.85,NULL,'DISPONIBLE'),('4','GD-15',0.85,NULL,'DISPONIBLE'),('4','GD-16',0.85,NULL,'DISPONIBLE'),('4','GD-17',0.85,NULL,'DISPONIBLE'),('4','GD-18',0.85,NULL,'DISPONIBLE'),('4','GD-19',0.85,NULL,'DISPONIBLE'),('4','GD-20',0.85,NULL,'DISPONIBLE'),('4','GD-21',0.85,NULL,'DISPONIBLE'),('4','GD-22',0.85,NULL,'DISPONIBLE'),('4','GD-23',0.85,NULL,'DISPONIBLE'),('4','GD-24',0.85,NULL,'DISPONIBLE'),('4','GD-25',0.85,NULL,'DISPONIBLE'),('1','V-02',0.225,NULL,'DISPONIBLE'),('1','V-03',0.225,NULL,'DISPONIBLE'),('1','V-04',0.225,NULL,'DISPONIBLE'),('1','V-05',0.225,NULL,'DISPONIBLE');
/*!40000 ALTER TABLE `aeros` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `PROMEDIO_CAP_INSERT` AFTER INSERT ON `aeros` FOR EACH ROW 
BEGIN
	
	
	update unidad_aero set capacidad_efectiva_unidad =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = new.numero_unidad;

	
	
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;

	
	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );

	
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `PROMEDIO_CAP_UPDATE` AFTER UPDATE ON `aeros` FOR EACH ROW
BEGIN
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = new.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;
	
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = old.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad)  where numero_unidad = old.numero_unidad;

	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);	
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `PROMEDIO_CAP_DELETE` AFTER DELETE ON `aeros` FOR EACH ROW
BEGIN
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = old.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad)  where numero_unidad = old.numero_unidad;	
	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);	
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `area_trabajo`
--

DROP TABLE IF EXISTS `area_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area_trabajo` (
  `clave_areaTrabajo` varchar(10) NOT NULL,
  `descripcion_areaTrabajo` varchar(50) NOT NULL,
  PRIMARY KEY (`clave_areaTrabajo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_trabajo`
--

LOCK TABLES `area_trabajo` WRITE;
/*!40000 ALTER TABLE `area_trabajo` DISABLE KEYS */;
INSERT INTO `area_trabajo` VALUES ('ADM','ADMINISTRACION'),('ADMIN','ADMINISTRADOR DE LA BASE DE DATOS'),('MAN','ÃREAS TÃ‰CNICAS DE MANTENIMIENTO'),('OPE','OPERACION'),('PROD','PRODUCCION'),('SUP','SUPERINTENDENCIA GENERAL');
/*!40000 ALTER TABLE `area_trabajo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalogo_unidad_medida`
--

DROP TABLE IF EXISTS `catalogo_unidad_medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `catalogo_unidad_medida` (
  `unidad_medida` varchar(20) NOT NULL,
  `descripcion_unidad_medida` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`unidad_medida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalogo_unidad_medida`
--

LOCK TABLES `catalogo_unidad_medida` WRITE;
/*!40000 ALTER TABLE `catalogo_unidad_medida` DISABLE KEYS */;
INSERT INTO `catalogo_unidad_medida` VALUES ('BAR','BARES'),('LT','LITRO'),('MM','MILIMETROS'),('MT','METRO'),('N/A','No Aplica'),('NM','NEWTON METRO'),('PZ','PIEZA');
/*!40000 ALTER TABLE `catalogo_unidad_medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `central`
--

DROP TABLE IF EXISTS `central`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `central` (
  `clave_20` varchar(5) NOT NULL,
  `clave_sap` varchar(4) NOT NULL,
  `centro_costo` varchar(6) NOT NULL,
  `nombre_central` varchar(100) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `cp` varchar(5) NOT NULL,
  `superintendente` varchar(5) NOT NULL,
  `capacidad_instalada` double unsigned DEFAULT NULL,
  `capacidad_efectiva_central` double unsigned DEFAULT NULL,
  PRIMARY KEY (`clave_20`),
  KEY `superintendente` (`superintendente`),
  CONSTRAINT `central_ibfk_1` FOREIGN KEY (`superintendente`) REFERENCES `personal` (`RDE_trabajador`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `central`
--

LOCK TABLES `central` WRITE;
/*!40000 ALTER TABLE `central` DISABLE KEYS */;
INSERT INTO `central` VALUES ('HJJK0','2156','21571','C.E. LA VENTA II','CARRETERA PANAMERICANA KM. 821. COLONIA FELIPE PESCADOR. JUCHITAN DE ZARAGOZA OAXACA','9616179200 Ext. 76861','70050','9B96H',84.19999999999992,75.69999999999997);
/*!40000 ALTER TABLE `central` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_actividad`
--

DROP TABLE IF EXISTS `datos_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_actividad` (
  `id_datos_actividad` int(10) unsigned NOT NULL,
  `id_actividad` int(10) unsigned DEFAULT NULL,
  `prioridad` enum('B','N','U') DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`id_datos_actividad`),
  KEY `id_actividad` (`id_actividad`),
  CONSTRAINT `datos_actividad_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_actividad`
--

LOCK TABLES `datos_actividad` WRITE;
/*!40000 ALTER TABLE `datos_actividad` DISABLE KEYS */;
/*!40000 ALTER TABLE `datos_actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_lectura_actual`
--

DROP TABLE IF EXISTS `datos_lectura_actual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_lectura_actual` (
  `id_actividad` int(10) unsigned NOT NULL,
  `dato` text,
  `prioridad` enum('B','N','U') DEFAULT NULL,
  `id_lectura` int(10) unsigned DEFAULT NULL,
  KEY `id_actividad` (`id_actividad`),
  KEY `id_lectura` (`id_lectura`),
  CONSTRAINT `datos_lectura_actual_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `datos_actividad` (`id_datos_actividad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datos_lectura_actual_ibfk_2` FOREIGN KEY (`id_lectura`) REFERENCES `lectura_actual` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_lectura_actual`
--

LOCK TABLES `datos_lectura_actual` WRITE;
/*!40000 ALTER TABLE `datos_lectura_actual` DISABLE KEYS */;
/*!40000 ALTER TABLE `datos_lectura_actual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_lectura_posterior`
--

DROP TABLE IF EXISTS `datos_lectura_posterior`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_lectura_posterior` (
  `id_actividad` int(10) unsigned NOT NULL,
  `dato` text,
  `prioridad` enum('B','N','U') DEFAULT NULL,
  `id_lectura` int(10) unsigned DEFAULT NULL,
  KEY `id_actividad` (`id_actividad`),
  KEY `id_lectura` (`id_lectura`),
  CONSTRAINT `datos_lectura_posterior_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `datos_actividad` (`id_datos_actividad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datos_lectura_posterior_ibfk_2` FOREIGN KEY (`id_lectura`) REFERENCES `lectura_posterior` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_lectura_posterior`
--

LOCK TABLES `datos_lectura_posterior` WRITE;
/*!40000 ALTER TABLE `datos_lectura_posterior` DISABLE KEYS */;
/*!40000 ALTER TABLE `datos_lectura_posterior` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_lista_verificacion`
--

DROP TABLE IF EXISTS `datos_lista_verificacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_lista_verificacion` (
  `id_orden_trabajo` int(10) unsigned NOT NULL,
  `fecha` date NOT NULL,
  `hora` time NOT NULL,
  `observaciones` text,
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  CONSTRAINT `datos_lista_verificacion_ibfk_1` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `programacion_mtto` (`id_orden_trabajo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `datos_lista_verificacion`
--

LOCK TABLES `datos_lista_verificacion` WRITE;
/*!40000 ALTER TABLE `datos_lista_verificacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `datos_lista_verificacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipo_aero`
--

DROP TABLE IF EXISTS `equipo_aero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `equipo_aero` (
  `id_equipo_aero` varchar(4) NOT NULL,
  `nombre_equipo_aero` varchar(50) NOT NULL,
  `id_sistema_aero` varchar(2) NOT NULL,
  PRIMARY KEY (`id_equipo_aero`),
  KEY `id_sistema_aero` (`id_sistema_aero`),
  CONSTRAINT `equipo_aero_ibfk_1` FOREIGN KEY (`id_sistema_aero`) REFERENCES `sistema_aero` (`id_sistema_aero`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo_aero`
--

LOCK TABLES `equipo_aero` WRITE;
/*!40000 ALTER TABLE `equipo_aero` DISABLE KEYS */;
INSERT INTO `equipo_aero` VALUES ('00','ROTOR PRINCIPAL','00'),('01','FLECHA PRINCIPAL (CABALLETE)','00'),('02','SISTEMA DE INCLINACION (PITCH)','00'),('03','UNIDAD HIDRAULICA','00'),('10','CAJA DE ENGRANES','01'),('11','SISTEMA DE AMORTIGUAMIENTO','01'),('12','ENFRIAMIENTO DE ACEITE','01'),('13','COLLARIN OPRESOR','01'),('20','GENERADOR PRINCIPAL','02'),('21','TRANSMISION','02'),('22','FRENO DE DISCO','02'),('30','MOTOREDUCTORES','03'),('31','PISTA DEL YAW','03'),('32','FRENO HIDRAULICO','03'),('33','COJINETE DESLIZAMIENTO YAW','03'),('34','ENGRANE CORONA','03'),('40','ARMARIO SUPERIOR (TOP CONTROL)','04'),('41','ARMARIO INFERIOR (GROUND CONTROL)','04'),('42','SECCION DE EMBARRADO Y PROTECCIONES','04'),('43','SISTEMA DE COMUNICACIONES','04'),('44','SISTEMA CONTRAINCENDIO','04'),('45','MEDICION Y PROTECCION ELECTRICA','04'),('50','CHASIS','05'),('51','TORRE TRONCONICA','05'),('52','GONDOLA','05'),('60','BAJA TENSION (HASTA 690 V)','06'),('61','ALTA TENSION (+690V A 34.5 KV)','06'),('62','TRANSFORMADORES','06'),('63','CELDAS DE POTENCIA','06'),('64','TABLERO METAL CLAD 34.5 KV','06'),('65','RED DE TIERRAS','06'),('70','CUARTO DE CONTROL','07'),('71','OFICINAS','07'),('72','CAMINOS Y CUNETAS','07'),('73','SUBESTACION 13.8 KV','07'),('74','CASETA DE VIGILANCIA','07'),('75','ALMACEN RESIDUOS','07');
/*!40000 ALTER TABLE `equipo_aero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectura_actual`
--

DROP TABLE IF EXISTS `lectura_actual`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lectura_actual` (
  `id_actividad` int(10) unsigned NOT NULL,
  `tipo_dato` varchar(20) NOT NULL,
  `parametro` text,
  `unidad_medida` varchar(20) DEFAULT NULL,
  `secuencia_datos` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_actividad` (`id_actividad`),
  KEY `unidad_medida` (`unidad_medida`),
  CONSTRAINT `lectura_actual_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lectura_actual_ibfk_2` FOREIGN KEY (`unidad_medida`) REFERENCES `catalogo_unidad_medida` (`unidad_medida`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectura_actual`
--

LOCK TABLES `lectura_actual` WRITE;
/*!40000 ALTER TABLE `lectura_actual` DISABLE KEYS */;
INSERT INTO `lectura_actual` VALUES (1,'Datos','PAR:','MT',1,1),(2,'Binario','Â¿SE MUEVE?','N/A',1,2),(3,'Binario','Â¿EXISTEN FISURAS?','N/A',1,3),(4,'Binario','Â¿EXISTEN FISURAS?','N/A',1,4),(5,'Binario','Â¿EXISTEN FISURAS?','N/A',1,5),(6,'Binario','RUIDOS EN PALA A:','N/A',1,6),(6,'Binario','RUIDOS EN PALA B:','N/A',2,7),(6,'Binario','RUIDOS EN PALA C:','N/A',3,8),(7,'Binario','EXISTEN FISURAS EN PALA A:','N/A',1,9),(7,'Binario','EXISTEN FISURAS EN PALA B:','N/A',2,10),(7,'Binario','EXISTEN FISURAS EN PALA C:','N/A',3,11),(8,'Binario','GRIETAS ANTERIORES EN PALA A:','N/A',1,12),(8,'Binario','GRIETAS ANTERIORES EN PALA B:','N/A',2,13),(8,'Binario','GRIETAS ANTERIORES EN PALA C:','N/A',3,14),(9,'Binario','Â¿EXISTE GRASA?','N/A',1,15),(9,'Binario','Â¿RETEN CON GRIETAS?','N/A',2,16),(10,'Binario','Â¿EXISTE GRASA?','N/A',1,17),(11,'Binario','Â¿EXISTEN RUIDOS?','N/A',1,18),(11,'Binario','Â¿MOVIEMIENTOS ANORMALES?','N/A',2,19),(11,'Binario','Â¿RODAMIENTOS EN BUEN ESTADO?','N/A',3,20),(12,'Datos','PAR:','NM',1,21),(13,'Datos','PAR:','NM',1,22),(14,'Binario','Â¿SE LUBRICARON LOS RODAMIENTOS?','N/A',1,23),(15,'Binario','Â¿GUARDAPOLVO DAÃ‘ADO?','N/A',1,24),(16,'Binario','Â¿SE ENCUENTRAN EN BUEN ESTADO?','N/A',1,25),(17,'Datos','PAR:','NM',1,26),(18,'Datos','PAR:','NM',1,27),(19,'Datos','PAR:','NM',1,28),(20,'Datos','PAR:','NM',1,29),(21,'Datos','PAR:','NM',1,30),(22,'Binario','Â¿ESTADO SUPERFICIAL EN BUEN ESTADO?','N/A',1,31),(23,'Binario','Â¿ESTADO SUPERFICIAL EN BUEN ESTADO?','N/A',1,32),(24,'Binario','Â¿SE ENGRASO?','N/A',1,33),(25,'Binario','Â¿SE ENGRASO?','N/A',1,34),(26,'Binario','Â¿SE ENGRASO?','N/A',1,35),(27,'Datos','HOLGURA:','MM',1,36),(28,'Datos','HOLGURA:','MM',1,37),(29,'Binario','Â¿EXISTE HOLGURA?','N/A',1,38),(30,'Binario','Â¿EXISTEN FUGAS?','N/A',1,39),(31,'Datos','PAR:','NM',1,40),(32,'Binario','Â¿EXISTEN RUIDOS ANOMALOS?','N/A',1,41),(33,'Datos','PAR:','NM',1,42),(34,'Binario','Â¿EXISTE ALABEO?','N/A',1,43),(35,'Binario','Â¿SE ENGRASO?','N/A',1,44),(36,'Datos','PAR:','NM',1,45),(37,'Datos','PAR:','NM',1,46),(38,'Datos','PAR:','NM',1,47),(39,'Binario','Â¿SE ENCUENTRAN EN BUEN ESTADO?','N/A',1,48),(40,'Binario','Â¿EXISTE DESGASTE?','N/A',1,49),(41,'Datos','PAR:','NM',1,50),(42,'Binario','Â¿PINTURA EN BUEN ESTADO?','N/A',1,51),(43,'Binario','Â¿EXISTEN FUGAS?','N/A',1,52),(44,'Binario','Â¿EL NIVEL ES EL ADECUADO?','N/A',1,53),(45,'Binario','Â¿EL COLOR ES AMBAR?','N/A',1,54),(46,'Binario','Â¿EXISTEN PARTICULAR METALICAS?','N/A',1,55),(47,'Binario','Â¿SE TOMO LA MUESTRA DE ACEITE?','N/A',1,56),(48,'Binario','Â¿EL FILTRO ESTA SUCIO O EMPAPADO?','N/A',1,57),(48,'Binario','Â¿SE CAMBIO EL FILTRO?','N/A',2,58),(49,'Binario','Â¿EXISTEN VIBRACIONES?','N/A',1,59),(50,'Binario','Â¿EXISTEN SILBIDOS?','N/A',1,60),(50,'Binario','Â¿EXISTEN CRUJIDOS?','N/A',2,61),(50,'Binario','Â¿EXISTEN MACHAQUEOS?','N/A',3,62),(50,'Binario','Â¿OTROS?','N/A',4,63),(51,'Binario','Â¿EXISTE DESPLAZAMIENTO AXIAL?','N/A',1,64),(51,'Binario','Â¿EXISTE DESPLAZAMIENTO RADIAL?','N/A',2,65),(52,'Binario','Â¿EXISTEN MATERIALES EXTRAÃ‘OS?','N/A',1,66),(53,'Binario','Â¿EXISTEN RUIDOS ANORMALES?','N/A',1,67),(53,'Binario','Â¿RODAMIENTOS EN BUEN ESTADO?','N/A',2,68),(54,'Binario','Â¿DIENTES EN BUEN ESTADO?','N/A',1,69),(54,'Binario','Â¿DIENTES CON OXIDO?','N/A',2,70),(54,'Binario','Â¿DIENTES CON DESGASTE EXCESIVO?','N/A',3,71),(55,'Datos','EJE DE ALTA VELOCIDAD','MM',1,72),(55,'Datos','EJE DE BAJA VELOCIDAD','MM',2,73),(56,'Datos','HOLGURA MENOR A:','MM',1,74),(57,'Binario','Â¿EXISTEN FUGAS DE ACEITE EN TAPONES O MANGUERAS?','N/A',1,75);
/*!40000 ALTER TABLE `lectura_actual` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lectura_posterior`
--

DROP TABLE IF EXISTS `lectura_posterior`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lectura_posterior` (
  `id_actividad` int(10) unsigned NOT NULL,
  `tipo_dato` varchar(20) NOT NULL,
  `parametro` text,
  `unidad_medida` varchar(20) DEFAULT NULL,
  `secuencia_datos` int(10) unsigned NOT NULL,
  `id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_actividad` (`id_actividad`),
  KEY `unidad_medida` (`unidad_medida`),
  CONSTRAINT `lectura_posterior_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lectura_posterior_ibfk_2` FOREIGN KEY (`unidad_medida`) REFERENCES `catalogo_unidad_medida` (`unidad_medida`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lectura_posterior`
--

LOCK TABLES `lectura_posterior` WRITE;
/*!40000 ALTER TABLE `lectura_posterior` DISABLE KEYS */;
INSERT INTO `lectura_posterior` VALUES (1,'Datos','PAR:','MT',1,1),(2,'Binario','Â¿SE MUEVE?','N/A',1,2),(3,'Binario','Â¿EXISTEN FISURAS?','N/A',1,3),(4,'Binario','Â¿EXISTEN FISURAS?','N/A',1,4),(5,'Binario','Â¿EXISTEN FISURAS?','N/A',1,5),(6,'Binario','RUIDOS EN PALA A:','N/A',1,6),(6,'Binario','RUIDOS EN PALA B:','N/A',2,7),(6,'Binario','RUIDOS EN PALA C:','N/A',3,8),(7,'Binario','EXISTEN FISURAS EN PALA A:','N/A',1,9),(7,'Binario','EXISTEN FISURAS EN PALA B:','N/A',2,10),(7,'Binario','EXISTEN FISURAS EN PALA C:','N/A',3,11),(8,'Binario','GRIETAS ANTERIORES EN PALA A:','N/A',1,12),(8,'Binario','GRIETAS ANTERIORES EN PALA B:','N/A',2,13),(8,'Binario','GRIETAS ANTERIORES EN PALA C:','N/A',3,14),(9,'Binario','Â¿EXISTE GRASA?','N/A',1,15),(9,'Binario','Â¿RETEN CON GRIETAS?','N/A',2,16),(10,'Binario','Â¿EXISTE GRASA?','N/A',1,17),(11,'Binario','Â¿EXISTEN RUIDOS?','N/A',1,18),(11,'Binario','Â¿MOVIMIENTOS ANORMALES?','N/A',2,19),(11,'Binario','Â¿RODAMIENTOS EN BUEN ESTADO?','N/A',3,20),(12,'Datos','PAR:','NM',1,21),(13,'Datos','PAR:','NM',1,22),(14,'Binario','Â¿SE LUBRICARON LOS RODAMIENTOS?','N/A',1,23),(15,'Binario','Â¿GUARDAPOLVO DAÃ‘ADO?','N/A',1,24),(16,'Binario','Â¿SE ENCUENTRAN EN BUEN ESTADO?','N/A',1,25),(17,'Datos','PAR:','NM',1,26),(18,'Datos','PAR:','NM',1,27),(19,'Datos','PAR:','NM',1,28),(20,'Datos','PAR:','NM',1,29),(21,'Datos','PAR:','NM',1,30),(22,'Binario','Â¿ESTADO SUPERFICIAL EN BUEN ESTADO?','N/A',1,31),(23,'Binario','Â¿ESTADO SUPERFICIAL EN BUEN ESTADO?','N/A',1,32),(24,'Binario','Â¿SE ENGRASO?','N/A',1,33),(25,'Binario','Â¿SE ENGRASO?','N/A',1,34),(26,'Binario','Â¿SE ENGRASO?','N/A',1,35),(27,'Datos','HOLGURA','MM',1,36),(28,'Datos','HOLGURA','MM',1,37),(29,'Binario','Â¿EXISTE HOLGURA?','N/A',1,38),(30,'Binario','Â¿EXISTEN FUGAS?','N/A',1,39),(31,'Datos','PAR:','NM',1,40),(32,'Binario','Â¿EXISTEN RUIDOS ANOMALOS?','N/A',1,41),(33,'Datos','PAR:','NM',1,42),(34,'Binario','Â¿EXISTE ALABEO?','N/A',1,43),(35,'Binario','Â¿SE ENGRASO?','N/A',1,44),(36,'Datos','PAR:','NM',1,45),(37,'Datos','PAR:','NM',1,46),(38,'Datos','PAR:','NM',1,47),(39,'Binario','Â¿SE ENCUENTRAN EN BUEN ESTADO?','N/A',1,48),(40,'Binario','Â¿EXISTE DESGASTE?','N/A',1,49),(41,'Datos','PAR:','NM',1,50),(42,'Binario','Â¿PINTURA EN BUEN ESTADO?','N/A',1,51),(43,'Binario','Â¿EXISTEN FUGAS?','N/A',1,52),(44,'Binario','Â¿EL NIVEL ES EL ADECUADO?','N/A',1,53),(45,'Binario','Â¿EL COLOR ES AMBAR?','N/A',1,54),(46,'Binario','Â¿EXISTEN PARTICULAR METALICAS?','N/A',1,55),(47,'Binario','Â¿SE TOMO LA MUESTRA DE ACEITE?','N/A',1,56),(48,'Binario','Â¿EL FILTRO ESTA SUCIO O EMPAPADO?','N/A',1,57),(48,'Binario','Â¿SE CAMBIO EL FILTRO?','N/A',2,58),(49,'Binario','Â¿EXISTEN VIBRACIONES?','N/A',1,59),(50,'Binario','Â¿EXISTEN SILBIDOS?','N/A',1,60),(50,'Binario','Â¿EXISTEN CRUJIDOS?','N/A',2,61),(50,'Binario','Â¿EXISTEN MACHAQUEOS?','N/A',3,62),(50,'Binario','Â¿OTROS?','N/A',4,63),(51,'Binario','Â¿EXISTE DESPLAZAMIENTO AXIAL?','N/A',1,64),(51,'Binario','Â¿EXISTE DESPLAZAMIENTO RADIAL?','N/A',2,65),(52,'Binario','Â¿EXISTEN MATERIALES EXTRAÃ‘OS?','N/A',1,66),(53,'Binario','Â¿EXISTEN RUIDOS ANORMALES?','N/A',1,67),(53,'Binario','Â¿RODAMIENTOS EN BUEN ESTADO?','N/A',2,68),(54,'Binario','Â¿DIENTES EN BUEN ESTADO?','N/A',1,69),(54,'Binario','Â¿DIENTES CON OXIDO?','N/A',2,70),(54,'Binario','Â¿DIENTES CON DESGASTE EXCESIVO?','N/A',3,71),(55,'Datos','EJE DE ALTA VELOCIDAD','MM',1,72),(55,'Datos','EJE DE BAJA VELOCIDAD','MM',2,73),(56,'Datos','HOLGURA MENOR A:','MM',1,74),(57,'Binario','Â¿EXISTEN FUGAS DE ACEITE EN TAPONES O MANGUERAS?','N/A',1,75);
/*!40000 ALTER TABLE `lectura_posterior` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libro_licencia`
--

DROP TABLE IF EXISTS `libro_licencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libro_licencia` (
  `id_libro_licencia` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `anio_licencia` varchar(4) NOT NULL,
  `inicializador` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id_libro_licencia`),
  UNIQUE KEY `anio_licencia` (`anio_licencia`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro_licencia`
--

LOCK TABLES `libro_licencia` WRITE;
/*!40000 ALTER TABLE `libro_licencia` DISABLE KEYS */;
INSERT INTO `libro_licencia` VALUES (7,'2013',1845),(14,'2014',NULL);
/*!40000 ALTER TABLE `libro_licencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `libro_relatorio`
--

DROP TABLE IF EXISTS `libro_relatorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libro_relatorio` (
  `id_libro_relatorio` int(10) unsigned NOT NULL,
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  `reporte_por` enum('AEROGENERADOR','UNIDAD') NOT NULL,
  `numero_aero` varchar(50) NOT NULL,
  `id_libro_licencia` int(10) unsigned NOT NULL,
  `condicion_operativa` enum('C.A.','DISPONIBLE','FALLA','MTTO','F.A.') NOT NULL,
  `consecutivo_licencia` int(10) unsigned DEFAULT NULL,
  `fecha_inicio_evento` date NOT NULL,
  `hora_inicio_evento` time NOT NULL,
  `fecha_termino_evento` date DEFAULT NULL,
  `hora_termino_evento` time DEFAULT NULL,
  `fecha_termino_estimado` date DEFAULT NULL,
  `trabajador_solicito` char(5) NOT NULL,
  `trabajador_autorizo` char(5) DEFAULT NULL,
  `descripcion_evento` text NOT NULL,
  `estado_evento` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_libro_relatorio`),
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  KEY `numero_aero` (`numero_aero`),
  KEY `id_libro_licencia` (`id_libro_licencia`),
  KEY `trabajador_solicito` (`trabajador_solicito`),
  KEY `trabajador_autorizo` (`trabajador_autorizo`),
  CONSTRAINT `libro_relatorio_ibfk_1` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `programacion_mtto` (`id_orden_trabajo`) ON UPDATE CASCADE,
  CONSTRAINT `libro_relatorio_ibfk_2` FOREIGN KEY (`numero_aero`) REFERENCES `aeros` (`numero_aero`) ON UPDATE CASCADE,
  CONSTRAINT `libro_relatorio_ibfk_3` FOREIGN KEY (`id_libro_licencia`) REFERENCES `libro_licencia` (`id_libro_licencia`) ON UPDATE CASCADE,
  CONSTRAINT `libro_relatorio_ibfk_4` FOREIGN KEY (`trabajador_solicito`) REFERENCES `personal` (`RDE_trabajador`) ON UPDATE CASCADE,
  CONSTRAINT `libro_relatorio_ibfk_5` FOREIGN KEY (`trabajador_autorizo`) REFERENCES `personal` (`RDE_trabajador`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro_relatorio`
--

LOCK TABLES `libro_relatorio` WRITE;
/*!40000 ALTER TABLE `libro_relatorio` DISABLE KEYS */;
INSERT INTO `libro_relatorio` VALUES (1,NULL,'AEROGENERADOR','GA-21',7,'FALLA',1845,'2013-06-24','09:21:00',NULL,NULL,'2015-12-31','9B96H',NULL,'MAQUINA NO ACOPLA; NO REGISTRA R.P.M. EL GENERADOR.\nMULTIPLICADORA Y CABALLETE DAÃ‘ADOS; ACOPLAMIENTO JAUREX TORCIDO.',1),(2,NULL,'AEROGENERADOR','GB-08',7,'FALLA',1846,'2012-10-14','09:12:00',NULL,NULL,'2015-12-31','9B96H',NULL,'EJE EMPUJADOR DAÃ‘ADO.\nCAJA DE RODAMIENTOS DE LA ESTRELLA DAÃ‘ADA; TORNILLOS DEGOLLADOS EN LA FLECHA HUECA.',1),(3,NULL,'AEROGENERADOR','GA-13',7,'FALLA',2358,'2013-12-06','16:01:00',NULL,NULL,'2015-12-31','9B96H',NULL,'PRESENTA RUIDO EXTRAÃ‘O EN EL RODAMIENTO DEL EJE DE ALTA DE LA MULTIPLICADORA.',1),(4,NULL,'AEROGENERADOR','GA-16',7,'FALLA',1986,'2013-10-09','13:38:00',NULL,NULL,'2015-12-31','9B96H',NULL,'COLLARIN OPRESOR DE LA MULTIPLICADORA ROTO; CABALLETE DAÃ‘ADO.',1),(5,NULL,'AEROGENERADOR','GB-15',7,'FALLA',1847,'2012-09-15','09:50:00',NULL,NULL,'2015-12-31','9B96H',NULL,'MULTIPLICADORA Y CABALLETE DAÃ‘ADOS.\nSE LE RETIRA TARJETAS DRIVERS PARA GC-06; SE LE RETIRA BASE CON SENSORES RPM, VOG Y AZIMUT.',1),(6,NULL,'AEROGENERADOR','GA-08',7,'MTTO',2360,'2013-10-15','08:40:00',NULL,NULL,'2013-12-31','9B96H',NULL,'MANTTO. PREVENTIVO DE TORQUE AL COLLARIN OPRESOR DE LA MULTIPLICADORA (100% 15-10-13).  INDISPONIBLE POR RUIDO EXTRAÃ‘O EN RODAMIENTO DE LAS PALAS (15-10-13).',1),(7,NULL,'AEROGENERADOR','GA-18',7,'MTTO',2359,'2013-12-06','16:01:00',NULL,NULL,'2016-01-31','9B96H',NULL,'PRESENTA RUIDO EXTRAÃ‘O EN EL RODAMIENTO DEL EJE DE ALTA DE LA MULTIPLICADORA.',1),(8,NULL,'AEROGENERADOR','GA-14',14,'FALLA',2159,'2014-12-04','20:02:00',NULL,NULL,'2015-12-31','9B96H',NULL,'MULTIPLICADORA DAÃ‘ADA (RODAMIENTO DELANTERO DEL EJE DE BAJA DAÃ‘ADO)',1),(9,NULL,'AEROGENERADOR','GC-10',14,'FALLA',34,'2014-01-21','08:58:00',NULL,NULL,'2015-12-31','9B96H',NULL,'BAJO NIVEL DE ACEITE MULTIPLICADORA Y DISPARO TERMICO MULTIPLICADORA',1),(10,NULL,'AEROGENERADOR','GB-05',14,'MTTO',560,'2014-05-06','08:56:00',NULL,NULL,'2015-12-31','9B96H',NULL,'LUBRICACION, AVANCE DEL 85%, PENDIENTE PRUEBAS AL GRUPO H..\nCON ESTA FECHA QUEDA INDISPONIBLE SE REVISARA  ENTRE EL CABALLETE Y EL  COLLARIN PARA  DESCARTAR POSIBLE DAÃ‘O, QUEDA EL AERO INDISPONIBLE POR ENCONTRARSE EL COLLARÃN DESPLAZADO APROX 4 O 5 MM Y EL AMORTIGUADOR ATORADO',1);
/*!40000 ALTER TABLE `libro_relatorio` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `CAMBIO_ESTADO_DELETE` AFTER DELETE ON `libro_relatorio` FOR EACH ROW
BEGIN
	update aeros set estado_licencia = 'DISPONIBLE', fecha_operacion = NULL where numero_aero = old.numero_aero;
	
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `libro_relatorio_historial`
--

DROP TABLE IF EXISTS `libro_relatorio_historial`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `libro_relatorio_historial` (
  `id_libro_relatorio` int(10) unsigned DEFAULT NULL,
  `fecha_inicio_evento` date NOT NULL,
  `hora_inicio_evento` time NOT NULL,
  `fecha_termino_estimado_evento` date NOT NULL,
  `hora_termino_estimado_evento` time NOT NULL,
  `fecha_termino_evento` date NOT NULL,
  `hora_termino_evento` time NOT NULL,
  `condicion_operativa` enum('C.A.','DISPONIBLE','FALLA','MTTO','F.A.') NOT NULL,
  `descripcion_evento` text NOT NULL,
  KEY `id_libro_relatorio` (`id_libro_relatorio`),
  CONSTRAINT `libro_relatorio_historial_ibfk_1` FOREIGN KEY (`id_libro_relatorio`) REFERENCES `libro_relatorio` (`id_libro_relatorio`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `libro_relatorio_historial`
--

LOCK TABLES `libro_relatorio_historial` WRITE;
/*!40000 ALTER TABLE `libro_relatorio_historial` DISABLE KEYS */;
INSERT INTO `libro_relatorio_historial` VALUES (1,'2013-07-27','08:00:00','0000-00-00','00:00:00','2013-07-27','16:00:00','FALLA','SE LE RETIRA VALVULA TERMOSTATICA PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GD-07'),(1,'2014-10-17','08:00:00','0000-00-00','00:00:00','2014-10-17','16:00:00','FALLA','INSPECCION VISUAL GENERAL DE  LOS COMPONENTES FALTANTES DEL AERO  POR PERSONAL DE GES SCADA ::::NOTA::: SE CONCLUYE  CON LA INSPECCION AL 100% ENTREGARAN REPORTE A LOS SUPERVISORES, CONTINÃšA INDISPONIBLE'),(4,'2013-09-10','08:00:00','0000-00-00','00:00:00','2013-09-10','16:00:00','FALLA','SE RETIRA LA CCU PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GA-20'),(4,'2014-10-28','08:00:00','0000-00-00','00:00:00','2014-10-28','16:00:00','FALLA','SE CONCLUYE CON LA INSPECCION  VISUAL PERSONAL DE GES-SCADA AL 100% ENTREGARAN REPORTE ALOS SUPERVISORES'),(4,'2015-03-04','15:46:00','0000-00-00','00:00:00','2015-03-04','08:00:00','FALLA','TRABAJOS AL 100%'),(3,'2013-12-09','08:00:00','0000-00-00','00:00:00','2013-12-09','16:00:00','FALLA','SE LE RETIRA CCU PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GC-03'),(3,'2014-10-27','08:00:00','0000-00-00','00:00:00','2014-10-27','16:00:00','FALLA','INSPECCION VISUAL GENERAL DE  LOS COMPONENTES FALTANTES DEL AERO  POR PERSONAL DE GES SCADA'),(3,'2015-02-01','08:00:00','0000-00-00','00:00:00','2015-02-01','16:00:00','FALLA','SE CONCLUYE  CON LA INSPECCION AL 100% ENTREGARAN REPORTE A LOS SUPERVISORES , CONTINÃšA INDISPONIBLE'),(3,'2015-02-17','08:00:00','0000-00-00','00:00:00','2015-02-17','16:00:00','FALLA','SE REALIZA PRUEBAS CON EQUIPO VIDEOSCOPIO Y MEGGEADO POR PARTE DE PERSONAL DE IGETEAM'),(3,'2015-05-29','08:00:00','0000-00-00','00:00:00','2015-05-29','16:00:00','FALLA','MANTTO AL 100% NO SE PUEDE CERRAR CELDA DE POTENCIA'),(5,'2014-10-28','08:00:00','0000-00-00','00:00:00','2014-10-28','16:00:00','FALLA','MULTIPLICADORA Y CABALLETE DAÃ‘ADOS.SE LE RETIRA TARJETAS DRIVERS PARA GC-06; SE LE RETIRA BASE CON SENSORES RPM, VOG Y AZIMUT.'),(5,'2014-12-24','08:00:00','0000-00-00','00:00:00','2014-12-24','16:00:00','FALLA','NOTA:::SE CONCLUYE CON LA INSPECCION  VISUAL PERSONAL DE GES-SCADA AL 100% ENTREGARAN REPORTE ALOS SUPERVISORES'),(5,'2014-12-24','08:00:00','0000-00-00','00:00:00','2014-12-24','16:00:00','FALLA','SE REALIZA ACTUALIZACION DE PROGRAMA POR GES - SCADA'),(5,'2015-03-04','08:00:00','0000-00-00','00:00:00','2015-03-04','16:00:00','FALLA','NO SE REALIZAN TRABAJOS POR NO CONTAR CON LUMINARIAS EL AERO'),(5,'2015-03-05','08:00:00','0000-00-00','00:00:00','2015-03-05','16:00:00','FALLA','TRABAJOS AL 100% IGETEAM'),(2,'2014-10-28','08:00:00','0000-00-00','00:00:00','2014-10-28','16:00:00','FALLA','SE CONCLUYE CON LA INSPECCION  VISUAL PERSONAL DE GES-SCADA AL 100% ENTREGARAN REPORTE ALOS SUPERVISORES'),(2,'2015-02-25','08:00:00','0000-00-00','00:00:00','2015-02-25','16:00:00','FALLA','SE RETIRO ANEMOMETRO PARA UTILIZAR EN EL AERO GB-21'),(2,'2015-03-04','08:00:00','0000-00-00','00:00:00','2015-03-04','16:00:00','FALLA','TRABAJOS AL 100%'),(2,'2015-06-01','08:00:00','0000-00-00','00:00:00','2015-06-01','16:00:00','FALLA','TRABAJOS DE LIMPIEZA EN GROUND AL 100%'),(1,'2015-03-05','08:00:00','0000-00-00','00:00:00','2015-03-05','16:00:00','FALLA','TRABAJOS AL 100% IGETEAM'),(6,'2013-10-23','08:00:00','0000-00-00','00:00:00','2013-10-23','16:00:00','FALLA','SE LE RETIRA CCU PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GC-07'),(6,'2013-11-02','08:00:00','0000-00-00','00:00:00','2013-11-02','16:00:00','FALLA','SE LE RETIRO CONTACTOR KM52R, PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GA-11'),(6,'2013-12-27','08:00:00','0000-00-00','00:00:00','2013-12-27','16:00:00','FALLA','SE LE RETIRA CONTACTOR KM-07 PARA INSTALAR Y RECUPERAR DISPONIBILIDAD DE GB-03'),(6,'2014-06-27','08:00:00','0000-00-00','00:00:00','2014-06-27','16:00:00','FALLA','SE LE RETIRA BOMBA AUXILIAR DE LA MULTIPLICADORA PARA  INSTALAR Y RECUPERAR DISPONIBILIDAD DE GB-10'),(6,'2014-10-20','08:00:00','0000-00-00','00:00:00','2014-10-20','16:00:00','FALLA','REALIZARAN TRABAJOS EN EL BUJE , BLOQUEO DE PALAS Y RETIRO DE  RODAMIENTO,SE RETIRA  RODAMIENTO  DE LA ESTRELLA--SE COLOCARON ESPARRAGOS DE BLOQUEOS--PENDIENTE RETIRAR EL EJE HUECO  DE LA  ESTRELLA'),(6,'2014-10-22','08:00:00','0000-00-00','00:00:00','2014-10-22','16:00:00','FALLA','CONTINUA INDISPONIBLE: SE DESCONECTA CILINDRO DEL PITCH Y SE REALIZA  LIMPIEZA EN EL INTERIOR DEL BUJE ..EN ESPERA DE LA GRUA PARA BAJAR EL ROTOR'),(6,'2014-10-27','08:00:00','0000-00-00','00:00:00','2014-10-27','16:00:00','FALLA','INSPECCION VISUAL GENERAL DE  LOS COMPONENTES FALTANTES DEL AERO  POR PERSONAL DE GES SCADA :::::NOTA::: SE CONCLUYE  CON LA INSPECCION AL 100% ENTREGARAN REPORTE A LOS SUPERVISORES'),(6,'2015-03-04','08:00:00','0000-00-00','00:00:00','2015-03-04','16:00:00','FALLA','NOTA:TRABAJOS AL 100%  NOTA: NO SE PUDO REALIZAR EL CAMBIO DE RODAMIENTO DE PALA POR VIENTO FUERTE PARA ESTA ACTIVIDAD INFORMA PERSONAL DE IGETEAM'),(6,'2015-06-10','08:00:00','0000-00-00','00:00:00','2015-06-10','16:00:00','FALLA','INF. PERSONAL CONTRATISTA QAUE TERMINA CON PREPARATIVOS PARA REALIZAR CAMBIO DE RODAMIENTO DE PALA CONTINUAN CON TRABAJOS MAÃ‘NA'),(7,'2014-08-30','08:00:00','0000-00-00','00:00:00','2014-08-30','16:00:00','FALLA','SE RETIRA JUREX IXIFLEX PARA COLOCAR EN GC-08 YA QUE NO HAY EN ALMACEN INFORMA JOSE ANGEL LOPEZ'),(7,'2014-10-27','08:00:00','0000-00-00','00:00:00','2014-10-27','16:00:00','FALLA','INSPECCION VISUAL GENERAL DE  LOS COMPONENTES FALTANTES DEL AERO  POR PERSONAL DE GES SCADA :::NOTA::: SE CONCLUYE  CON LA INSPECCION AL 100% ENTREGARAN REPORTE A LOS SUPERVISORES, CONTINÃšA INDISPONIBLE'),(7,'2015-03-04','08:00:00','0000-00-00','00:00:00','2015-03-04','16:00:00','FALLA','TRABAJOS AL 100% DE MEGGEO DE GENERADOR Y INSPECCION GENERAL'),(8,'2014-12-26','08:00:00','0000-00-00','00:00:00','2014-12-26','16:00:00','FALLA','SE CARGAN PARAMETROS PLC CCU Y PANTALLA'),(8,'2015-02-01','08:00:00','0000-00-00','00:00:00','2015-02-01','16:00:00','FALLA','SE INSPECCIONA AL 100% PERSONAL DEW IGETEAMNOTA'),(8,'2015-02-17','08:00:00','0000-00-00','00:00:00','2015-02-17','16:00:00','FALLA','SE REALIZA PRUEBAS CON EQUIPO VIDEOSCOPIO Y MEGGEADO POR PARTE DE PERSONAL DE IGETEAM '),(9,'2014-02-21','08:00:00','0000-00-00','00:00:00','2014-02-21','16:00:00','FALLA','SE INSPECCIONO LA MAQUINA LA CAUSA DEL DERRAME FUE QUE LA MULTIPLICADORA ESTA ROTA PARTE INFERIOR DEL PLANETARIO (EN LA CARCAZA)LA MAQUINA SE ENCONTRABA EN STOP Y SE DEJA EN EMERGENCIA MANUAL AL NORTE INDISPONIBLE POR MULTIPLICADORA DAÃ‘ADA'),(9,'2014-10-29','08:00:00','0000-00-00','00:00:00','2014-10-29','16:00:00','FALLA','NOTA::SE CONCLUYE CON LA INPECCION Y VERIFICACION DE COMPONENTES FALTANTES AL 100% ENTREGARAN REPORTE LOS SUPERVISORES NOTA: 04/03/2015 TRABAJOS AL 100%.'),(10,'2014-07-17','08:00:00','0000-00-00','00:00:00','2014-07-17','16:00:00','FALLA','SE REVISA EL COLLARIN OPRESOR Y SE OBSERVA UNA DESALINEACIÃ“N ENTRE LA MULTIPLICADORA Y EL CABALLETE, AL PARECER LA FLECHA ESTÃ DAÃ‘ADA, MAÃ‘ANA SUBIRÃN CON LOS SUPERVISORES PARA DETERMINAR ESTADO DE LA FLECHA'),(10,'2014-10-06','08:00:00','0000-00-00','00:00:00','2014-10-06','16:00:00','FALLA','SUBEN A INSPECCIONAR PERSONAL DE GAMESA YDETERMINARON QUE LA FLECHA PRINCIPLA ESTÃ ROTA, SE DEJA EN PAUSA E INDISPONIBLE.    \nNOTA::AERO INDISPONIBLE'),(10,'2014-10-22','08:00:00','0000-00-00','00:00:00','2014-10-22','16:00:00','FALLA','SE RETIRAN LOS SENSORES INDUCTIVOS -ANEMO Y VELETA\n27/10/2014 INSPECCION VISUAL GENERAL DE  LOS COMPONENTES FALTANTES DEL AERO  POR PERSONAL DE GES SCADA :::CONTINÃšA INDISPONIBLE.'),(10,'2014-10-29','08:00:00','0000-00-00','00:00:00','2014-10-29','16:00:00','FALLA','NOTA ::: SE RETIRAN LOS 2 VENTILADORES AL 100% PARA SER UTILIZADOS EN OTRO AERO'),(10,'2014-12-24','08:00:00','0000-00-00','00:00:00','2014-12-24','16:00:00','FALLA','SE CARGA VERSION ACTUALIZADA A PLC. PENDIENTE CCU(NO COMUNICA), Y PANTALLA TACTIL,YA QUE NO CUENTA CON TARJETA DE MEMORIA'),(10,'2015-03-04','08:00:00','0000-00-00','00:00:00','2015-03-04','16:00:00','FALLA','NOTA:TRABAJOS AL 100% '),(10,'2015-06-01','08:00:00','0000-00-00','00:00:00','2015-06-01','16:00:00','FALLA','TRABAJOS DE LIMPIEZA EN GRAUND AL 100%');
/*!40000 ALTER TABLE `libro_relatorio_historial` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materiales`
--

DROP TABLE IF EXISTS `materiales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materiales` (
  `codigo_material` int(10) unsigned NOT NULL,
  `descripcion_material` varchar(100) DEFAULT NULL,
  `tipo_material` enum('REFACCION','EQUIPO','MATERIAL') DEFAULT NULL,
  PRIMARY KEY (`codigo_material`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materiales`
--

LOCK TABLES `materiales` WRITE;
/*!40000 ALTER TABLE `materiales` DISABLE KEYS */;
INSERT INTO `materiales` VALUES (100,'TARJETA X','REFACCION'),(120,'MULTIPLICADORA','EQUIPO'),(130,'TORNILLOS DE 2\"','MATERIAL');
/*!40000 ALTER TABLE `materiales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo`
--

DROP TABLE IF EXISTS `orden_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo` (
  `id_prog_mtto` int(10) unsigned NOT NULL,
  `numero_orden` varchar(30) NOT NULL,
  `id_aero` varchar(50) NOT NULL,
  `id_mantenimiento` varchar(2) NOT NULL,
  `duracion` int(10) unsigned NOT NULL,
  `magnitud_duracion` enum('d','M','y') NOT NULL,
  `fecha_inicial` date NOT NULL,
  `fecha_final` date NOT NULL,
  `trabajo_solicitado` text NOT NULL,
  `estado_asignado` enum('FINALIZADO') DEFAULT NULL,
  PRIMARY KEY (`id_prog_mtto`),
  KEY `id_aero` (`id_aero`),
  KEY `id_mantenimiento` (`id_mantenimiento`),
  CONSTRAINT `orden_trabajo_ibfk_1` FOREIGN KEY (`id_aero`) REFERENCES `aeros` (`numero_aero`) ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_ibfk_2` FOREIGN KEY (`id_mantenimiento`) REFERENCES `tipo_mantenimiento` (`id_mantenimiento`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_trabajo`
--

LOCK TABLES `orden_trabajo` WRITE;
/*!40000 ALTER TABLE `orden_trabajo` DISABLE KEYS */;
INSERT INTO `orden_trabajo` VALUES (1,'1V-02MS','V-02','MS',3,'d','2015-06-15','2020-06-01','MANTENIMIENTO SEMESTRAL V-02',NULL);
/*!40000 ALTER TABLE `orden_trabajo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo_actividad`
--

DROP TABLE IF EXISTS `orden_trabajo_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo_actividad` (
  `id_datos_actividad` int(10) unsigned DEFAULT NULL,
  `id_actividad_verificar` int(10) unsigned DEFAULT NULL,
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  KEY `id_datos_actividad` (`id_datos_actividad`),
  KEY `id_actividad_verificar` (`id_actividad_verificar`),
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  CONSTRAINT `orden_trabajo_actividad_ibfk_1` FOREIGN KEY (`id_datos_actividad`) REFERENCES `datos_actividad` (`id_datos_actividad`) ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_actividad_ibfk_2` FOREIGN KEY (`id_actividad_verificar`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_actividad_ibfk_3` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `programacion_mtto` (`id_orden_trabajo`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_trabajo_actividad`
--

LOCK TABLES `orden_trabajo_actividad` WRITE;
/*!40000 ALTER TABLE `orden_trabajo_actividad` DISABLE KEYS */;
/*!40000 ALTER TABLE `orden_trabajo_actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo_material`
--

DROP TABLE IF EXISTS `orden_trabajo_material`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo_material` (
  `id_orden_trabajo_material` int(10) unsigned NOT NULL,
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  `codigo_material` int(10) unsigned DEFAULT NULL,
  `cantidad` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id_orden_trabajo_material`),
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  KEY `codigo_material` (`codigo_material`),
  CONSTRAINT `orden_trabajo_material_ibfk_1` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `programacion_mtto` (`id_orden_trabajo`) ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_material_ibfk_2` FOREIGN KEY (`codigo_material`) REFERENCES `materiales` (`codigo_material`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_trabajo_material`
--

LOCK TABLES `orden_trabajo_material` WRITE;
/*!40000 ALTER TABLE `orden_trabajo_material` DISABLE KEYS */;
/*!40000 ALTER TABLE `orden_trabajo_material` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo_personal`
--

DROP TABLE IF EXISTS `orden_trabajo_personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo_personal` (
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  `usuario` varchar(30) DEFAULT NULL,
  `tipo_usuario` enum('AUXILIAR','RESPONSABLE','SUPERVISOR') DEFAULT NULL,
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  KEY `usuario` (`usuario`),
  CONSTRAINT `orden_trabajo_personal_ibfk_1` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `programacion_mtto` (`id_orden_trabajo`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_personal_ibfk_2` FOREIGN KEY (`usuario`) REFERENCES `personal` (`nombre_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_trabajo_personal`
--

LOCK TABLES `orden_trabajo_personal` WRITE;
/*!40000 ALTER TABLE `orden_trabajo_personal` DISABLE KEYS */;
INSERT INTO `orden_trabajo_personal` VALUES (1,'admin','SUPERVISOR'),(1,'gildardo.jimenez','RESPONSABLE'),(1,'jose.pech','AUXILIAR');
/*!40000 ALTER TABLE `orden_trabajo_personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parametro_actividad`
--

DROP TABLE IF EXISTS `parametro_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `parametro_actividad` (
  `id_actividad` int(10) unsigned NOT NULL,
  `tipo_dato` enum('BINARIO','TEXTO','COMPARACION','RANGO','TOLERANCIA') NOT NULL,
  `dato` varchar(51) DEFAULT NULL,
  `parametro` text NOT NULL,
  `secuencia_datos` int(10) unsigned NOT NULL,
  `unidad_medida` varchar(20) DEFAULT NULL,
  `id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_actividad` (`id_actividad`),
  KEY `unidad_medida` (`unidad_medida`),
  CONSTRAINT `parametro_actividad_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `parametro_actividad_ibfk_2` FOREIGN KEY (`unidad_medida`) REFERENCES `catalogo_unidad_medida` (`unidad_medida`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parametro_actividad`
--

LOCK TABLES `parametro_actividad` WRITE;
/*!40000 ALTER TABLE `parametro_actividad` DISABLE KEYS */;
INSERT INTO `parametro_actividad` VALUES (1,'COMPARACION','435','PAR:',1,'MT',1),(2,'TEXTO','','VISUAL Y TACTIL',1,'N/A',2),(3,'TEXTO','','VISUAL',1,'N/A',3),(4,'TEXTO','','VISUAL',1,'N/A',4),(5,'TEXTO','','VISUAL',1,'N/A',5),(6,'TEXTO','','AUDIOVISUAL',1,'N/A',6),(7,'TEXTO','','VISUAL',1,'N/A',7),(8,'TEXTO','','VISUAL',1,'N/A',8),(9,'TEXTO','','VISUAL. NO DEBE EXISTIR PRESCENCIA DE GRASA. EN CASO AFIRMATIVO, LIMPIAR Y DESPUES DE LUBRICAR COMPROBAR NUEVAMENTE QUE NO EXISTA GRASA, SI EL RETEN PRESENTA GRIETAS O ALGUN DAÃ‘O REEMPAZARLO.',1,'N/A',9),(10,'TEXTO','','VISUAL. NO DEBE EXISTIR FUGA DE GRASA. EN CASO AFIRMATIVO, LIMPIAR Y DESPUES LUBRICAR, COMPROBAR NUEVAMENTE QUE NO EXISTA GRASA.',1,'N/A',10),(11,'TEXTO','','AUDIOVISUAL. NO DEBEN OIRSE RUIDOS ANORMALES, MOVIMIENTOS ANORMALES. REALIZAR PRUEBA DE SENOS PARA COMPROBAR LOS RODAMIENTOS.',1,'N/A',11),(12,'COMPARACION','800','PAR:',1,'NM',12),(13,'COMPARACION','800','PAR:',1,'NM',13),(14,'TEXTO','','EL RODAMIENTO DEBE DE MOVERSE MIENTRAS SE LUBRICA, PARA GARANTIZAR LA LUBRICACION UNIFORME',1,'N/A',14),(15,'TEXTO','','VISUAL',1,'N/A',15),(16,'TEXTO','','VISUAL',1,'N/A',16),(17,'COMPARACION','125','PAR:',1,'NM',17),(18,'COMPARACION','50','PAR:',1,'NM',18),(19,'COMPARACION','12','PAR:',1,'NM',19),(20,'COMPARACION','1000','PAR:',1,'NM',20),(21,'COMPARACION','300','PAR:',1,'NM',21),(22,'TEXTO','','VISUAL',1,'N/A',22),(23,'TEXTO','','VISUAL',1,'N/A',23),(24,'TEXTO','','VISUAL',1,'N/A',24),(25,'TEXTO','','VISUAL',1,'N/A',25),(26,'TEXTO','','VISUAL',1,'N/A',26),(27,'COMPARACION','0.5','HOLDURA:',1,'MM',27),(28,'COMPARACION','0.8','HOLGURA:',1,'MM',28),(29,'TEXTO','','VISUAL. ENCASQUILLAR CON LAINAS EN CASO DE PRESENTAR JUEGO APRECIABLE',1,'N/A',29),(30,'TEXTO','','VISUAL',1,'N/A',30),(31,'COMPARACION','125','PAR:',1,'NM',31),(32,'TEXTO','','AUDIOVISUAL. MOVER EL EJE EMPUJADOR ADELANE Y ATRAS, COMPROBAR QUE NO EXISTEN RUIDOS DE ROCES ANOMALOS',1,'N/A',32),(33,'COMPARACION','2000','PAR:',1,'NM',33),(34,'TEXTO','','VISUAL. COMPROBAR ALABEO DE LA FLECHA CON IDICADOR DE CARATULA (EL REGISTRO LO REVISARA EL JEFE DEL AREA)',1,'N/A',34),(35,'TEXTO','','VISUAL',1,'N/A',35),(36,'COMPARACION','2800','PAR:',1,'NM',36),(37,'COMPARACION','858','PAR:',1,'NM',37),(38,'COMPARACION','264','PAR:',1,'NM',38),(39,'TEXTO','','VISUAL',1,'N/A',39),(40,'TEXTO','','VISUAL',1,'N/A',40),(41,'COMPARACION','1450','PAR:',1,'NM',41),(42,'TEXTO','','VISUAL',1,'N/A',42),(43,'TEXTO','','VISUAL',1,'N/A',43),(44,'TEXTO','','VISUAL. RECUPERAR NIVEL SI ES NECESARIO (SEGUN MAUNAL DE LA MULTIPLICADORA)',1,'N/A',44),(45,'TEXTO','','VISUAL. NO DEBE TENER ESPUMA, DEBE SER COLOR AMBAR',1,'N/A',45),(46,'TEXTO','','VISUAL. NO DEBE EXISTIR PARTICULAS METALICAS',1,'N/A',46),(47,'TEXTO','','VISUAL',1,'N/A',47),(48,'TEXTO','','VISUAL. CAMBIAR CADA 24 MESES O SI ESTA SUCIO O EMPAPADO',1,'N/A',48),(49,'TEXTO','','AUDIOVISUAL. BUSCAR SI HAY VIBRACIONES ANORMALES',1,'N/A',49),(50,'TEXTO','','AUDIOVISUAL. RUIDOS ANORMALES (SILBIDOS, CRUJIDOS, MACHAQUEO, OTROS)',1,'N/A',50),(51,'TEXTO','','VISUAL',1,'N/A',51),(52,'TEXTO','','VISUAL. LEVANTAR LA TAPA DE INSPECCION (NO DEBE HABER NINGUN TIPO DE MATERIALES EXTRAÃ‘OS), REPORTAR ANOMALIAS',1,'N/A',52),(53,'TEXTO','','VISUAL. COMPROBAR EL ESTADO DE LOS RODAMIENTOS Y RUIDOS ANORMALES',1,'N/A',53),(54,'TEXTO','','VISUAL. NO DEBE EXISTIR DESGASTE EXCESIVO EN LOS DIENTES, OXIDO, DIENTES ROTOS, ETC.',1,'N/A',54),(55,'RANGO','0,0.35','EJE DE ALTA VELOCIDAD',1,'MM',55),(55,'RANGO','0,0.35','EJE DE BAJA VELOCIDAD',2,'MM',56),(56,'COMPARACION','0.05','HOLGURA MENOR A:',1,'MM',57),(57,'TEXTO','','VISUAL',1,'N/A',58);
/*!40000 ALTER TABLE `parametro_actividad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso_rol`
--

DROP TABLE IF EXISTS `permiso_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permiso_rol` (
  `clave_rol` varchar(25) DEFAULT NULL,
  `permiso_rol` varchar(25) NOT NULL,
  KEY `clave_rol` (`clave_rol`),
  CONSTRAINT `permiso_rol_ibfk_1` FOREIGN KEY (`clave_rol`) REFERENCES `roles` (`clave_rol`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso_rol`
--

LOCK TABLES `permiso_rol` WRITE;
/*!40000 ALTER TABLE `permiso_rol` DISABLE KEYS */;
INSERT INTO `permiso_rol` VALUES ('ADMINISTRADOR SISTEMA','all'),('LECTOR UNIVERSAL','select'),('ADMINISTRADOR','all'),('OPERADOR','select'),('OPERADOR','insert'),('OPERADOR','update'),('TECNICO','select'),('TECNICO','insert'),('TECNICO','update'),('SUPERVISOR','select'),('SUPERVISOR','insert'),('SUPERVISOR','update'),('JEFATURA','select'),('JEFATURA','insert'),('JEFATURA','update');
/*!40000 ALTER TABLE `permiso_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal`
--

DROP TABLE IF EXISTS `personal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal` (
  `RDE_trabajador` varchar(5) NOT NULL,
  `nombre_usuario` varchar(30) NOT NULL,
  `nombre_trabajador` varchar(50) NOT NULL,
  `apellidos_trabajador` varchar(50) NOT NULL,
  `password_trabajador` char(50) NOT NULL,
  `clave_areaTrabajo` varchar(10) NOT NULL,
  `clave_rol` varchar(25) NOT NULL,
  PRIMARY KEY (`RDE_trabajador`),
  UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  KEY `clave_areaTrabajo` (`clave_areaTrabajo`),
  KEY `clave_rol` (`clave_rol`),
  CONSTRAINT `personal_ibfk_1` FOREIGN KEY (`clave_areaTrabajo`) REFERENCES `area_trabajo` (`clave_areaTrabajo`) ON UPDATE CASCADE,
  CONSTRAINT `personal_ibfk_2` FOREIGN KEY (`clave_rol`) REFERENCES `roles` (`clave_rol`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal`
--

LOCK TABLES `personal` WRITE;
/*!40000 ALTER TABLE `personal` DISABLE KEYS */;
INSERT INTO `personal` VALUES ('12345','admin','ADMINISTRADOR','ADMINISTRADOR','5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8','ADMIN','ADMINISTRADOR'),('9A70J','jose.pech','JOSE LUIS','PECH SULUB','df1cd31847445063c3c41b4871e3fe4c3f900b57','ADMIN','ADMINISTRADOR SISTEMA'),('9A9PN','Edvin','EDVIN','HERNANDEZ','47bfce9c6aab2550ad2f8670d0320addf3c75dd7','ADM','ADMINISTRADOR'),('9B96H','gildardo.jimenez','GILDARDO','JIMENEZ RAMOS','ac33ac0ebc6460b3fd5db08e6d7f92bdf21ba6dc','SUP','JEFATURA'),('9B9MX','JMBL','JOSE MANUEL','BENITEZ LOPEZ','fb49bdead0ddad7248714149b2b680af1c235f03','PROD','JEFATURA'),('9DDDD','AMV','ARTEMIO DE JESUS','MARTINEZ VAZQUEZ','4ba008e3381509f02d5e2ce799c1333dac574207','MAN','SUPERVISOR'),('9J6JN','FSV','FILIBERTO','SANTIAGO VILLALOBOS','05a13326ab90f98f2ea517ea28f0b498ff2b20d3','MAN','TECNICO'),('9J6JP','ERG','EDGAR','RIOS GARRIDO','63c0617c4a26b18941bd6e2a2f6dfca9443922b3','MAN','TECNICO'),('9JGJA','JOTT','JOSE OCTAVIO','TORIJA THOMAS','385a1e75ee9c903a7e92fe51de5b13e243960f9c','MAN','TECNICO'),('9JGJG','GCL','GERARDO','CARRASCO LOPEZ','7ace52b1e38a411cc5abdd05b70891871067df20','MAN','TECNICO'),('9JGJK','LRF','LEANDRO','RODRIGUEZ FARRERA','9ca73327a9e7289d367c1c6131a4637f5c224f96','MAN','TECNICO'),('9JGJL','JALS','JOSE ANGEL','LOPEZ SANCHEZ','2c76d94385cdbf563fab830c448f8cbbd570f1cb','MAN','TECNICO'),('9JGJM','LARO','LUIS ANTONIO','REVUELTA OSORIO','363a4552bfece0c8f652aede9785f3cb544fd931','MAN','TECNICO'),('9JGJR','IAA','ISIDRO','AGUILERA ALVISO','cf6d0771ffb1989a963705c3080dcef4a4e4fad6','MAN','TECNICO'),('9JGKJ','EGO','ERCELAN','GUERRA OSORIO','e2a01fb7be8d7e6ca15aab6e927332ae1e95fba8','MAN','TECNICO'),('9JH1G','JDLCB','JUAN','DE LA CRUZ BENITEZ','df19c76905273c450c818a8e251cd9a0e747f02c','MAN','TECNICO'),('9L0JX','HVA','HUGO','VARGAS ANTONIO','ba953f52399b21c08a9fed7f706a95270b42c19f','MAN','TECNICO'),('9M4WN','ADS','ALFREDO','DIAZ SALVADOR','81ef8f109809979b1e24a276d8a2a16d5192077a','PROD','JEFATURA'),('CD526','OGR','ORLANDO DE JESUS','GONZALEZ RODAS','512ec857f50081a361c6504cbd538c4278c1491c','MAN','SUPERVISOR');
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programacion_mtto`
--

DROP TABLE IF EXISTS `programacion_mtto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programacion_mtto` (
  `id_orden_trabajo` int(10) unsigned NOT NULL,
  `id_prog_mtto` int(10) unsigned DEFAULT NULL,
  `fecha_inicial` date NOT NULL,
  `fecha_final` date NOT NULL,
  `id_orden_reprog` int(10) unsigned DEFAULT NULL,
  `fecha_realizada` date DEFAULT NULL,
  `estado_asignado` enum('ACTIVO','REPROGRAMADO','FINALIZADO') DEFAULT NULL,
  PRIMARY KEY (`id_orden_trabajo`),
  KEY `id_prog_mtto` (`id_prog_mtto`),
  CONSTRAINT `programacion_mtto_ibfk_1` FOREIGN KEY (`id_prog_mtto`) REFERENCES `orden_trabajo` (`id_prog_mtto`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programacion_mtto`
--

LOCK TABLES `programacion_mtto` WRITE;
/*!40000 ALTER TABLE `programacion_mtto` DISABLE KEYS */;
INSERT INTO `programacion_mtto` VALUES (1,1,'2015-06-15','2015-06-18',1,NULL,'ACTIVO'),(2,1,'2015-12-17','2015-12-20',NULL,NULL,NULL),(3,1,'2016-06-21','2016-06-24',NULL,NULL,NULL),(4,1,'2016-12-23','2016-12-26',NULL,NULL,NULL),(5,1,'2017-06-27','2017-06-30',NULL,NULL,NULL),(6,1,'2017-12-29','2018-01-01',NULL,NULL,NULL),(7,1,'2018-07-02','2018-07-05',NULL,NULL,NULL),(8,1,'2019-01-04','2019-01-07',NULL,NULL,NULL),(9,1,'2019-07-08','2019-07-11',NULL,NULL,NULL),(10,1,'2020-01-10','2020-01-13',NULL,NULL,NULL);
/*!40000 ALTER TABLE `programacion_mtto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `clave_rol` varchar(25) NOT NULL,
  `descripcion_areaTrabajo` text NOT NULL,
  PRIMARY KEY (`clave_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES ('ADMINISTRADOR','ADMINISTRADOR DE LA BASE DE DATOS'),('ADMINISTRADOR SISTEMA','ADMINISTRADOR GENERAL DEL SISTEMA'),('JEFATURA','USUARIO QUE CORRESPONDE AL SUPERINTENDENTE GENERAL O SUPERINTENDENTE DE PRODUCCIÃ“N DE LA CENTRAL'),('LECTOR UNIVERSAL','PUEDE REALIZAR CONSULTA SOBRE TODOS LOS MODULOS DEL SISTEMA'),('OPERADOR','OPERADOR DEL CUARTO DE CONTROL, CAPTURA DEL LIBRO RELATORIO Y CREACIÃ“N DE ORDENES DE TRABAJO'),('SUPERVISOR','PERSONAL DE SUPERVISIÃ“N DEL ÃREA DE MANTENIMIENTO'),('TECNICO','PERSONAL RESPONSABLE DE LA CAPTURA DE LOS DATOS DE MANTENIMIENTO');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `SessionID` char(26) DEFAULT NULL,
  `Data` text,
  `DateTouched` int(11) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (95,'r15vbnbldmg79n6v42snf7tdp5','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1433363896),(96,'42t1sfj21v0tijc9cp4fgi76b2','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1433364355),(97,'2sj0pbkf8m67kjt503ml03mi77','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1433450680),(98,'oni1l4689g5k3ao332dat429i2','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1433769598),(100,'foln1vujlbi1j426qbmi4hprv5','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434138095),(101,'le59rumcmgj5plkt5d73kaufj7','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434127606),(103,'5ap5iv3mqc3q1iag1ih98f5273','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434139428),(104,'f0p3u3pr8d0cdf3cm0m0s9rc45','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434385839),(107,'8e8lj75rjnirk0kc1fdt5d4ea5','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434462878),(108,'e45tgpqh3ikboj2g3p4ct2pf10','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434389241),(111,'su6ujn8pjkdpnhu4g503f7t7d3','host|s:9:\"localhost\";user|s:16:\"gildardo.jimenez\";pass|s:40:\"ac33ac0ebc6460b3fd5db08e6d7f92bdf21ba6dc\";',1434398694),(114,'viivjpnub7fhtodh2c59q94af5','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434483905),(115,'lacc3uvoet42gabhg9jk7ekmp5','host|s:9:\"localhost\";user|s:5:\"9B96H\";pass|s:40:\"060e3c0159f7455332b31621f8930207aa0882d0\";',1434464702),(122,'0omo3ko9mn0bplmn6me38q1kq5','host|s:9:\"localhost\";user|s:5:\"Edvin\";pass|s:40:\"47bfce9c6aab2550ad2f8670d0320addf3c75dd7\";',1434474027),(123,'453g8f34t0suf4nc0n0iiv7dh4','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434475759),(124,'53h7it82isp231b0c6atpm4l47','host|s:9:\"localhost\";user|s:5:\"admin\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434484329),(125,'82qrsu37v5h237h2suk15s7hm6','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434483845),(126,'tj87evfnrinottq5vk1frhvam0','host|s:9:\"localhost\";user|s:4:\"root\";pass|s:40:\"5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8\";',1434484182);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistema_aero`
--

DROP TABLE IF EXISTS `sistema_aero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sistema_aero` (
  `id_sistema_aero` varchar(2) NOT NULL,
  `nombre_sistema_aero` varchar(50) NOT NULL,
  PRIMARY KEY (`id_sistema_aero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema_aero`
--

LOCK TABLES `sistema_aero` WRITE;
/*!40000 ALTER TABLE `sistema_aero` DISABLE KEYS */;
INSERT INTO `sistema_aero` VALUES ('00','TURBINA (ROTOR AEROGENERADOR)'),('01','CAJA DE ENGRANES'),('02','GENERADOR ELECTRICO'),('03','ORIENTACION'),('04','CONTROL, PROTECCION Y COMUNICACIONES'),('05','ESTRUCTURA (SOPORTE Y GONDOLA)'),('06','ELECTRICO'),('07','EDIFICIO, ACCESO E INSTALACIONES');
/*!40000 ALTER TABLE `sistema_aero` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_mantenimiento`
--

DROP TABLE IF EXISTS `tipo_mantenimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo_mantenimiento` (
  `id_mantenimiento` varchar(2) NOT NULL,
  `nombre_mantenimiento` varchar(30) NOT NULL,
  `numero_frecuencia` int(10) unsigned NOT NULL,
  `tipo_frecuencia` enum('d','M','y') DEFAULT NULL,
  PRIMARY KEY (`id_mantenimiento`),
  UNIQUE KEY `nombre_mantenimiento` (`nombre_mantenimiento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_mantenimiento`
--

LOCK TABLES `tipo_mantenimiento` WRITE;
/*!40000 ALTER TABLE `tipo_mantenimiento` DISABLE KEYS */;
INSERT INTO `tipo_mantenimiento` VALUES ('MA','MANTENIMIENTO ANUAL',1,'y'),('MC','MANTENIMIENTO CUATRIMESTRAL',4,'M'),('MS','MANTENIMIENTO SEMESTRAL',6,'M');
/*!40000 ALTER TABLE `tipo_mantenimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidad_aero`
--

DROP TABLE IF EXISTS `unidad_aero`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `unidad_aero` (
  `clave_20` varchar(5) NOT NULL,
  `numero_unidad` varchar(4) NOT NULL,
  `capacidad_instalada` double unsigned DEFAULT NULL,
  `capacidad_efectiva_unidad` double unsigned DEFAULT NULL,
  PRIMARY KEY (`numero_unidad`),
  KEY `clave_20` (`clave_20`),
  CONSTRAINT `unidad_aero_ibfk_1` FOREIGN KEY (`clave_20`) REFERENCES `central` (`clave_20`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidad_aero`
--

LOCK TABLES `unidad_aero` WRITE;
/*!40000 ALTER TABLE `unidad_aero` DISABLE KEYS */;
INSERT INTO `unidad_aero` VALUES ('HJJK0','1',0.9,0.9),('HJJK0','2',16.149999999999995,16.149999999999995),('HJJK0','3',16.999999999999996,14.449999999999996),('HJJK0','4',16.999999999999996,16.999999999999996),('HJJK0','5',16.999999999999996,15.299999999999995),('HJJK0','6',16.149999999999995,11.899999999999997);
/*!40000 ALTER TABLE `unidad_aero` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-06-16 14:53:18
