-- MySQL dump 10.13  Distrib 5.5.36, for Win64 (x86)
--
-- Host: localhost    Database: laventa_cfe
-- ------------------------------------------------------
-- Server version	5.5.36-log

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
INSERT INTO `acceso_rol` VALUES ('DB',1,'Estatus','status.php'),('DB',2,'Catálogo de Roles de Usuario','catalogoRolUsuario.php'),('DB',2,'Catálogo de Áreas de Trabajo','catalogoAreaTrabajo.php'),('DB',2,'Catálogo de Usuarios','catalogoUsuarios.php'),('DB',2,'Gestión de la Central','gestionCentral.php'),('DB',2,'Catálogo de Unidades','catalogoUnidades.php'),('DB',2,'Catálogo de Aéros','catalogoAeros.php'),('DB',2,'Catálogo de Sistemas','catalogoSistemas.php'),('DB',2,'Catálogo de Equipos','catalogoEquipos.php'),('DB',2,'Catálogo de Unidades de Medida','catalogoUnidadesMedida.php'),('DB',2,'Catálogo de Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('DB',2,'Catálogo de Listas de Verificación','catalogoListas.php'),('DB',3,'Programa de Mantenimiento','programaMtto.php'),('DB',3,'Autorizacion de Mantenimiento','autorizacionMtto.php'),('DB',3,'Orden Trabajo','ordenTrabajo.php');
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
  CONSTRAINT `actividad_verificar_ibfk_2` FOREIGN KEY (`id_sistema_aero`) REFERENCES `sistema_aero` (`id_sistema_aero`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `actividad_verificar_ibfk_3` FOREIGN KEY (`id_equipo_aero`) REFERENCES `equipo_aero` (`id_equipo_aero`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `actividad_verificar`
--

LOCK TABLES `actividad_verificar` WRITE;
/*!40000 ALTER TABLE `actividad_verificar` DISABLE KEYS */;
INSERT INTO `actividad_verificar` VALUES (1,'ME','CE','EA','CONO','ACTIVIDAD 1'),(2,'ME','CP',NULL,'CONO','ACTIVIDAD'),(3,'ME','CE',NULL,'TEST','TEST');
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
  `numero_aero` varchar(4) NOT NULL,
  `capacidad_efectiva_aero` double unsigned NOT NULL,
  `fecha_operacion` date DEFAULT NULL,
  `estado_licencia` varchar(20) NOT NULL,
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
INSERT INTO `aeros` VALUES ('1','GC01',1.53,NULL,'DISPONIBLE'),('1','GC02',0.83,NULL,'DISPONIBLE'),('1','GC03',2.81,NULL,'C.A.'),('1','GC04',2.81,NULL,'MTTO');
/*!40000 ALTER TABLE `aeros` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
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
INSERT INTO `area_trabajo` VALUES ('DB','ADMINISTRADOR DE LA BASE DE DATOSQ');
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
INSERT INTO `catalogo_unidad_medida` VALUES ('MM','MILIMETROS'),('N/A','No Aplica'),('NM','NEWTON METRO'),('RPM','REVOLUCIONES POR MINUTO'),('°/S','GRADOS POR SEGUNDO'),('°C','GRADOS CENTIGRADOS');
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
INSERT INTO `central` VALUES ('ERTU5','EDT4','43534','LA VENTA','DESCONOCIDO','desconocido','29000','WET8F',7.98,2.36);
/*!40000 ALTER TABLE `central` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `datos_actividad`
--

DROP TABLE IF EXISTS `datos_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datos_actividad` (
  `id_datos_actividad` int(10) unsigned DEFAULT NULL,
  `id_actividad` int(10) unsigned DEFAULT NULL,
  `prioridad` enum('B','N','U') DEFAULT NULL,
  `observaciones` text,
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `id_datos_actividad` (`id_datos_actividad`),
  KEY `id_actividad` (`id_actividad`),
  CONSTRAINT `datos_actividad_ibfk_1` FOREIGN KEY (`id_datos_actividad`) REFERENCES `orden_trabajo_actividad` (`id_datos_actividad`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `datos_actividad_ibfk_2` FOREIGN KEY (`id_actividad`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON UPDATE CASCADE
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
  CONSTRAINT `datos_lectura_actual_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `datos_actividad` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
  CONSTRAINT `datos_lectura_posterior_ibfk_1` FOREIGN KEY (`id_actividad`) REFERENCES `datos_actividad` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
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
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `observaciones` text,
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  CONSTRAINT `datos_lista_verificacion_ibfk_1` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `orden_trabajo` (`id_orden_trabajo`) ON DELETE CASCADE ON UPDATE CASCADE
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
  UNIQUE KEY `nombre_equipo_aero` (`nombre_equipo_aero`),
  KEY `id_sistema_aero` (`id_sistema_aero`),
  CONSTRAINT `equipo_aero_ibfk_1` FOREIGN KEY (`id_sistema_aero`) REFERENCES `sistema_aero` (`id_sistema_aero`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipo_aero`
--

LOCK TABLES `equipo_aero` WRITE;
/*!40000 ALTER TABLE `equipo_aero` DISABLE KEYS */;
INSERT INTO `equipo_aero` VALUES ('EA','ENFRIAMIENTO ACEITE','CE'),('FD','FRENO DE DISCO','GE'),('FP','FLECHA PRINCIPAL (CABALLETE)','TU'),('GP','GENERADOR PRINCIPAL','GE'),('RP','ROTOR PRINCIPAL','TU'),('SA','SISTEMA DE AMORTIGUAMIENTO','CE'),('SIN','SISTEMA DE INCLINACION (PITCH)','TU'),('TAV','TREN DE ALTA VELOCIDAD','CE'),('TBV','TREN DE BAJA VELOCIDAD','CE'),('TR','TRANSMISION','GE'),('TVI','TREN DE VELOCIDAD INTERMEDIA','CE'),('UH','UNIDAD HIDRAULICA','TU');
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
INSERT INTO `lectura_actual` VALUES (1,'Binario','TEST','N/A',1,1),(2,'Datos','DATA','MM',1,2),(2,'Datos','DATA','MM',2,3),(3,'Binario','TEST','N/A',1,4);
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
INSERT INTO `lectura_posterior` VALUES (1,'Datos','DATO 1','MM',1,1),(1,'Datos','DATO 2','N/A',2,2),(2,'Datos','DATA','MM',1,3),(2,'Datos','DATA','MM',2,4),(3,'Binario','TEST','N/A',1,5);
/*!40000 ALTER TABLE `lectura_posterior` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo`
--

DROP TABLE IF EXISTS `orden_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo` (
  `id_orden_trabajo` int(10) unsigned NOT NULL,
  `numero_orden` varchar(30) NOT NULL,
  `id_aero` varchar(4) NOT NULL,
  `id_mantenimiento` varchar(2) NOT NULL,
  `duracion` int(10) unsigned NOT NULL,
  `magnitud_duracion` enum('d','M','y') NOT NULL,
  `fecha_programada` date NOT NULL,
  `fecha_reprogramada` date DEFAULT NULL,
  `fecha_realizada` date DEFAULT NULL,
  `trabajo_solicitado` text NOT NULL,
  PRIMARY KEY (`id_orden_trabajo`),
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
INSERT INTO `orden_trabajo` VALUES (1,'1GC04SE','GC04','SE',3,'d','2014-12-01',NULL,NULL,'TEST'),(2,'1GC04SE','GC04','SE',3,'d','2015-06-04',NULL,NULL,'TEST'),(3,'1GC04SE','GC04','SE',3,'d','2015-12-07',NULL,NULL,'TEST'),(4,'1GC04SE','GC04','SE',3,'d','2016-06-10',NULL,NULL,'TEST'),(5,'1GC04SE','GC04','SE',3,'d','2016-12-13',NULL,NULL,'TEST'),(6,'1GC04SE','GC04','SE',3,'d','2017-06-16',NULL,NULL,'TEST'),(7,'1GC01ME','GC01','ME',3,'d','2014-12-01',NULL,NULL,'MANTENIMIENTO'),(8,'1GC01ME','GC01','ME',3,'d','2015-03-04',NULL,NULL,'MANTENIMIENTO'),(9,'1GC01ME','GC01','ME',3,'d','2015-06-07',NULL,NULL,'MANTENIMIENTO'),(10,'1GC01ME','GC01','ME',3,'d','2015-09-10',NULL,NULL,'MANTENIMIENTO'),(11,'1GC01ME','GC01','ME',3,'d','2015-12-13',NULL,NULL,'MANTENIMIENTO'),(12,'1GC01ME','GC01','ME',3,'d','2016-03-16',NULL,NULL,'MANTENIMIENTO'),(13,'1GC01ME','GC01','ME',3,'d','2016-06-19',NULL,NULL,'MANTENIMIENTO'),(14,'1GC01ME','GC01','ME',3,'d','2016-09-22',NULL,NULL,'MANTENIMIENTO'),(15,'1GC01ME','GC01','ME',3,'d','2016-12-25',NULL,NULL,'MANTENIMIENTO'),(16,'1GC01ME','GC01','ME',3,'d','2017-03-28',NULL,NULL,'MANTENIMIENTO'),(17,'1GC01ME','GC01','ME',3,'d','2017-06-30',NULL,NULL,'MANTENIMIENTO'),(18,'1GC01ME','GC01','ME',3,'d','2017-10-03',NULL,NULL,'MANTENIMIENTO'),(19,'1GC01ME','GC01','ME',3,'d','2018-01-06',NULL,NULL,'MANTENIMIENTO'),(20,'1GC01ME','GC01','ME',3,'d','2018-04-09',NULL,NULL,'MANTENIMIENTO'),(21,'1GC01ME','GC01','ME',3,'d','2018-07-12',NULL,NULL,'MANTENIMIENTO'),(22,'1GC01ME','GC01','ME',3,'d','2018-10-15',NULL,NULL,'MANTENIMIENTO'),(23,'1GC01ME','GC01','ME',3,'d','2019-01-18',NULL,NULL,'MANTENIMIENTO'),(24,'1GC01ME','GC01','ME',3,'d','2019-04-21',NULL,NULL,'MANTENIMIENTO'),(25,'1GC01ME','GC01','ME',3,'d','2019-07-24',NULL,NULL,'MANTENIMIENTO'),(26,'1GC01ME','GC01','ME',3,'d','2019-10-27',NULL,NULL,'MANTENIMIENTO'),(27,'1GC01ME','GC01','ME',3,'d','2020-01-30',NULL,NULL,'MANTENIMIENTO'),(28,'1GC01ME','GC01','ME',3,'d','2020-05-02',NULL,NULL,'MANTENIMIENTO'),(29,'1GC01ME','GC01','ME',3,'d','2020-08-05',NULL,NULL,'MANTENIMIENTO'),(30,'1GC01ME','GC01','ME',3,'d','2020-11-08',NULL,NULL,'MANTENIMIENTO'),(31,'1GC01MY','GC01','MY',3,'d','2014-12-01',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(32,'1GC01MY','GC01','MY',3,'d','2015-08-04',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(33,'1GC01MY','GC01','MY',3,'d','2016-04-07',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(34,'1GC01MY','GC01','MY',3,'d','2016-12-10',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(35,'1GC01MY','GC01','MY',3,'d','2017-08-13',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(36,'1GC01MY','GC01','MY',3,'d','2018-04-16',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(37,'1GC01MY','GC01','MY',3,'d','2018-12-19',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(38,'1GC01MY','GC01','MY',3,'d','2019-08-22',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(39,'1GC01MY','GC01','MY',3,'d','2020-04-25',NULL,NULL,'ESTA ES UNA DESCRIPCION DEL TRABAJO SOLICITADO CON FINES INFORMATIVOS'),(40,'1GC01RT','GC01','RT',4,'d','2014-12-01',NULL,NULL,'MANTENIMIENT'),(41,'1GC01RT','GC01','RT',4,'d','2014-12-20',NULL,NULL,'MANTENIMIENT'),(42,'1GC01RT','GC01','RT',4,'d','2015-01-08',NULL,NULL,'MANTENIMIENT'),(43,'1GC01RT','GC01','RT',4,'d','2015-01-27',NULL,NULL,'MANTENIMIENT'),(44,'1GC01RT','GC01','RT',4,'d','2015-02-15',NULL,NULL,'MANTENIMIENT'),(45,'1GC01RT','GC01','RT',4,'d','2015-03-06',NULL,NULL,'MANTENIMIENT'),(46,'1GC01RT','GC01','RT',4,'d','2015-03-25',NULL,NULL,'MANTENIMIENT'),(47,'1GC01RT','GC01','RT',4,'d','2015-04-13',NULL,NULL,'MANTENIMIENT'),(48,'1GC01RT','GC01','RT',4,'d','2015-05-02',NULL,NULL,'MANTENIMIENT'),(49,'1GC01RT','GC01','RT',4,'d','2015-05-21',NULL,NULL,'MANTENIMIENT'),(50,'1GC01RT','GC01','RT',4,'d','2015-06-09',NULL,NULL,'MANTENIMIENT'),(51,'1GC01RT','GC01','RT',4,'d','2015-06-28',NULL,NULL,'MANTENIMIENT'),(52,'1GC01RT','GC01','RT',4,'d','2015-07-17',NULL,NULL,'MANTENIMIENT'),(53,'1GC01RT','GC01','RT',4,'d','2015-08-05',NULL,NULL,'MANTENIMIENT'),(54,'1GC01RT','GC01','RT',4,'d','2015-08-24',NULL,NULL,'MANTENIMIENT'),(55,'1GC01RT','GC01','RT',4,'d','2015-09-12',NULL,NULL,'MANTENIMIENT'),(56,'1GC01RT','GC01','RT',4,'d','2015-10-01',NULL,NULL,'MANTENIMIENT'),(57,'1GC01RT','GC01','RT',4,'d','2015-10-20',NULL,NULL,'MANTENIMIENT'),(58,'1GC01RT','GC01','RT',4,'d','2015-11-08',NULL,NULL,'MANTENIMIENT'),(59,'1GC01RT','GC01','RT',4,'d','2015-11-27',NULL,NULL,'MANTENIMIENT'),(60,'1GC01RT','GC01','RT',4,'d','2015-12-16',NULL,NULL,'MANTENIMIENT');
/*!40000 ALTER TABLE `orden_trabajo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo_actividad`
--

DROP TABLE IF EXISTS `orden_trabajo_actividad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_trabajo_actividad` (
  `id_datos_actividad` int(10) unsigned NOT NULL,
  `id_actividad_verificar` int(10) unsigned DEFAULT NULL,
  `id_orden_trabajo` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id_datos_actividad`),
  KEY `id_actividad_verificar` (`id_actividad_verificar`),
  KEY `id_orden_trabajo` (`id_orden_trabajo`),
  CONSTRAINT `orden_trabajo_actividad_ibfk_1` FOREIGN KEY (`id_actividad_verificar`) REFERENCES `actividad_verificar` (`id_actividad_verificar`) ON UPDATE CASCADE,
  CONSTRAINT `orden_trabajo_actividad_ibfk_2` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `orden_trabajo` (`id_orden_trabajo`) ON DELETE CASCADE ON UPDATE CASCADE
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
INSERT INTO `parametro_actividad` VALUES (1,'TEXTO','','PARAMETRO',1,'N/A',1),(2,'COMPARACION','34','DATO',1,'MM',2),(2,'COMPARACION','56','DATA',2,'MM',3),(3,'TEXTO','','TEST',1,'N/A',4);
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
INSERT INTO `permiso_rol` VALUES ('DB','all');
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
INSERT INTO `personal` VALUES ('DJG7S','gorbachov','MIJAIL','GORBACHOV','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','DB','DB'),('F7DG0','hitler','ADOLF','HITLER','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','DB','DB'),('FG9G3','admin','VLADIMIR','PUTIN','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','DB','DB'),('FKI76','user','SERGUEY','IZOZOVA','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','DB','DB'),('WET8F','edgardo.g','EDGARDO DANIEL','GORDILLO DOMINGUEZ','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','DB','DB');
/*!40000 ALTER TABLE `personal` ENABLE KEYS */;
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
INSERT INTO `roles` VALUES ('DB','ADMINISTRADOR DE LA BASE DE DATOS');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
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
INSERT INTO `sistema_aero` VALUES ('CE','CAJA DE ENGRANES'),('CP','CONTROL, PROTECCION Y COMUNICACION'),('EA','EDIFICIO, ACCESO E INSTALACIONES'),('EL','ELECTRICO'),('ES','ESTRUCTURA (SOPORTE Y NACELLE)'),('GE','GENERADOR ELECTRICO'),('OR','ORIENTACION'),('TU','TURBINA (ROTOR DEL GENERADOR)');
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
INSERT INTO `tipo_mantenimiento` VALUES ('ME','MENOR',3,'M'),('MY','MAYOR',8,'M'),('RT','RUTINARIO',15,'d'),('SE','SEMESTRAL',6,'M');
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
INSERT INTO `unidad_aero` VALUES ('ERTU5','1',7.98,2.36);
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

-- Dump completed on 2014-12-10 14:24:57
