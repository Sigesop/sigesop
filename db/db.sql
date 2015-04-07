drop database if exists laventa_cfe;
create database laventa_cfe;
use laventa_cfe;

# SECCION DE ADMINISTRACION DE USUARIOS -------------------------------------------------------------------------------------

CREATE TABLE sessions (ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY, SessionID CHAR(26), Data TEXT , DateTouched INT);
CREATE USER '__session'@'localhost' identified by '162bed2fa894a934c3120893c9332c51cc4a5f43';
grant all privileges on laventa_cfe.sessions to '__session'@'localhost';

-- ---------- roles -----------------------------------------------

create table `roles`(
	clave_rol					varchar(25) primary key,
	descripcion_areaTrabajo		text not null
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

create table `acceso_rol`(
	clave_rol					varchar(25),
	foreign key (clave_rol) references roles(clave_rol) 
	on update cascade 
	on delete cascade,
	
	nivelBarra					tinyint unsigned not null,
	nombre_barra				varchar(50) not null,
	pagina_acceso_rol			varchar(50) not null
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

create table `permiso_rol`(
	clave_rol					varchar(25),
	foreign key (clave_rol) references roles(clave_rol) 
	on update cascade 
	on delete cascade,

	permiso_rol				varchar(25) not null
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

-- ----------------------------------------------------------------

create table `area_trabajo`(
	clave_areaTrabajo			varchar(10) primary key,
	descripcion_areaTrabajo		varchar(50) not null
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

create table `personal`(
	RDE_trabajador 			varchar(5) primary key,
	nombre_usuario			varchar(30) not null unique,
	nombre_trabajador		varchar(50) not null,
	apellidos_trabajador	varchar(50) not null,
	password_trabajador		char(50) not null,
	-- password_trabajador		varbinary(200) not null,

	clave_areaTrabajo		varchar(10) not null,
	clave_rol				varchar(25) not null,

	foreign key(clave_areaTrabajo) references area_trabajo(clave_areaTrabajo)
	on delete restrict
	on update cascade,	

	foreign key(clave_rol) references roles(clave_rol)
	on delete restrict
	on update cascade
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

# SECCION DE ORDEN DE TRABAJO (TABLAS DE ELEMENTOS UNICOS)-------------------------------------------------------------------
-- Aqui unicamente creamos las tablas para almacenar los aeros, sistemas, equipos y componentes
-- estas tablas nos serviran por si el usuario quiera dar de alta un valor nuevo de los anteriormente
-- enlistado. Estas tablas serviran de referencia cuando en la interfaz web solicitemos los valores
-- en los combobox

create table `central`(
	clave_20					varchar(5) primary key not null,  -- Clave unica de la central
	clave_sap					varchar(4) not null,
	centro_costo				varchar(6) not null,
	nombre_central				varchar(100) not null,
	direccion					varchar(100) not null,
	telefono					varchar(50) not null,
	cp							varchar(5) not null,
	superintendente				varchar(5) not null,
	capacidad_instalada			double unsigned ,
	capacidad_efectiva_central	double unsigned , -- La capacidad efectiva en central es la suma de la capacidad de las unidades

	foreign key(superintendente) references personal(RDE_trabajador)
	on delete restrict
	on update cascade
)ENGINE=InnoDB  DEFAULT CHARSET=utf8;

CREATE TABLE `unidad_aero`(
	clave_20					varchar(5) not null, -- Clave unica de la central
	numero_unidad				varchar(4) primary key not null,
	capacidad_instalada			double unsigned,
	capacidad_efectiva_unidad	double unsigned, -- La capacidad efectiva en la unidad es la suma de la capacidad de los aeros

	foreign key(clave_20) references central(clave_20)
	on delete restrict
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `aeros` (
	-- clave_20					varchar(5) not null, -- Clave unica de la central
	numero_unidad				varchar(4) not null,
	numero_aero					varchar(4) primary key not null,
	capacidad_efectiva_aero		double unsigned not null, -- La capacidad efectiva de cada aerogenerador
	fecha_operacion				date, -- Fecha en la que el aerogenerador entra en mantenimiento
	estado_licencia 			enum('C.A.', 'DISPONIBLE', 'FALLA', 'MTTO', 'F.A.') DEFAULT 'DISPONIBLE',

	-- foreign key(estado_licencia) references tabla_estados(estado_licencia)
	-- on update cascade
	-- on delete restrict,

	foreign key(numero_unidad) references unidad_aero(numero_unidad)
	on delete restrict 
	on update cascade

	-- foreign key(capacidad_efectiva_aero) references unidad_aero(capacidad_efectiva_unidad)
	-- on delete restrict
	-- on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `sistema_aero`(
	id_sistema_aero 		varchar(2) primary key not null,
	nombre_sistema_aero		varchar(50) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `equipo_aero`(
	id_equipo_aero			varchar(4) primary key,
	nombre_equipo_aero		varchar(50) not null,

	id_sistema_aero 		varchar(2) not null,

	foreign key(id_sistema_aero) references sistema_aero(id_sistema_aero) 
	on delete restrict 
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

# SECCION DE ORDEN DE TRABAJO (TABLAS DE ELEMENTOS INSERTADOS)-----------------------------------------------------------
-- En esta seccion creamos tablas para almacenar el orden jerarquico de los componentes

CREATE TABLE `catalogo_unidad_medida`(	
	unidad_medida 				varchar(20) primary key,
	descripcion_unidad_medida 	varchar(50)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `tipo_mantenimiento`(
	id_mantenimiento		varchar(2) primary key,
	nombre_mantenimiento	varchar(30) not null unique,
	numero_frecuencia		int unsigned not null,
	tipo_frecuencia			enum('d', 'M', 'y')
	-- tipo_frecuencia			enum('Dias', 'Meses', 'Anios', 'INDEFINIDO')
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------- lista_verificacion ----------------------------------

CREATE TABLE `actividad_verificar` (
	id_actividad_verificar 			int unsigned primary key auto_increment,

	id_mantenimiento				varchar(2),
	foreign key ( id_mantenimiento ) references tipo_mantenimiento( id_mantenimiento )
	on delete cascade
	on update cascade,

	id_sistema_aero 		varchar(2),
	foreign key( id_sistema_aero ) references sistema_aero( id_sistema_aero )
	on delete restrict
	on update cascade,

	id_equipo_aero					varchar(4) DEFAULT null,
	foreign key(id_equipo_aero) references equipo_aero(id_equipo_aero)
	on delete restrict
	on update cascade,

	descripcion_lista_verificacion 	varchar(50) not null,
	
	actividad_verificar 			text
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `parametro_actividad`(
	id_actividad					int unsigned not null,
	foreign key (id_actividad) references actividad_verificar(id_actividad_verificar)
	on delete cascade
	on update cascade,

	tipo_dato 						enum( 'BINARIO', 'TEXTO', 'COMPARACION', 'RANGO', 'TOLERANCIA' ) not null,
	dato 							varchar(51),
	parametro 						text not null,	
	secuencia_datos					int unsigned not null,
	unidad_medida 					varchar(20),
	foreign key (unidad_medida) references catalogo_unidad_medida(unidad_medida)
	on delete restrict
	on update cascade,
	id 								int unsigned primary key
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lectura_actual`(
	id_actividad					int unsigned not null,
	foreign key (id_actividad) references actividad_verificar(id_actividad_verificar)
	on delete cascade
	on update cascade,

	tipo_dato						varchar(20) not null,
	parametro 						text,	

	unidad_medida 					varchar(20),
	foreign key (unidad_medida) references catalogo_unidad_medida(unidad_medida)
	on delete restrict
	on update cascade,

	secuencia_datos					int unsigned not null,
	id 								int unsigned primary key
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `lectura_posterior`(
	id_actividad				int unsigned not null,
	foreign key (id_actividad) references actividad_verificar(id_actividad_verificar)
	on delete cascade
	on update cascade,

	tipo_dato						varchar(20) not null,
	parametro 						text,

	unidad_medida 					varchar(20),
	foreign key (unidad_medida) references catalogo_unidad_medida(unidad_medida)
	on delete restrict
	on update cascade,

	secuencia_datos					int unsigned not null,
	id 								int unsigned primary key
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------- orden_trabajo ---------------------------------------

CREATE TABLE `orden_trabajo`(
	-- campos capturados por el sistema del que asigna la orden ---------------------------------
	
	id_orden_trabajo		int unsigned primary key,
	numero_orden			varchar(30) not null,

	-- campos capturados por el que asigna la orden ---------------------------------
	
	id_aero 				varchar(4) not null,
	foreign key(id_aero) references aeros(numero_aero)
	on delete restrict
	on update cascade,

	id_mantenimiento		varchar(2) not null,
	foreign key (id_mantenimiento) references tipo_mantenimiento (id_mantenimiento)
	on delete restrict
	on update cascade,

	duracion				int unsigned not null,
	magnitud_duracion		enum('d', 'M', 'y') not null,
	fecha_programada		date not null,
	fecha_reprogramada		date,
	fecha_realizada			date,
	trabajo_solicitado		text not null,
	estado_asignado 		boolean not null DEFAULT false
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orden_trabajo_personal`(
	id_orden_trabajo		int unsigned,
	foreign key ( id_orden_trabajo ) references orden_trabajo( id_orden_trabajo )
	on delete cascade
	on update cascade,

	usuario 			varchar( 30 ),
	foreign key ( usuario ) references personal( nombre_usuario )
	on delete cascade
	on update cascade,

	tipo_usuario			enum( 'AUXILIAR', 'RESPONSABLE', 'SUPERVISOR' )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------- orden_trabajo_lista ----------------------------

CREATE TABLE `datos_actividad`(
	id_datos_actividad				int unsigned primary key,

	id_actividad 					int unsigned,
	foreign key ( id_actividad ) references actividad_verificar( id_actividad_verificar )
	on delete restrict
	on update cascade,

	prioridad						enum( 'B', 'N', 'U' ),
	observaciones 					text
	-- id								int unsigned primary key auto_increment
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datos_lectura_actual`(
	id_actividad					int unsigned not null,
	foreign key (id_actividad) references datos_actividad( id_datos_actividad )
	on delete cascade
	on update cascade,

	dato 							text,
	prioridad						enum( 'B', 'N', 'U' ),

	id_lectura					int unsigned,
	foreign key( id_lectura ) references lectura_actual( id )
	on delete cascade
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datos_lectura_posterior`(
	id_actividad					int unsigned not null,
	foreign key (id_actividad) references datos_actividad( id_datos_actividad )
	on delete cascade
	on update cascade,

	dato 							text,
	prioridad						enum( 'B', 'N', 'U' ),

	id_lectura					int unsigned,
	foreign key( id_lectura ) references lectura_posterior( id )
	on delete cascade
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orden_trabajo_actividad`(	
	id_datos_actividad				int unsigned,
	foreign key( id_datos_actividad ) references datos_actividad( id_datos_actividad )
	on delete restrict
	on update cascade,

	id_actividad_verificar 			int unsigned,
	foreign key ( id_actividad_verificar ) references actividad_verificar( id_actividad_verificar )
	on delete restrict
	on update cascade,

	id_orden_trabajo				int unsigned,
	foreign key (id_orden_trabajo) references orden_trabajo(id_orden_trabajo)
	on delete restrict
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datos_lista_verificacion`(
	id_orden_trabajo					int unsigned not null,
	foreign key ( id_orden_trabajo ) references orden_trabajo ( id_orden_trabajo )
	on delete restrict
	on update cascade,

	fecha							date not null,
	hora 							time not null,
	observaciones					text
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- libro_licencia ---------------------------------

drop table if exists `libro_licencia`;

CREATE TABLE `libro_licencia` (
	id_libro_licencia		int unsigned auto_increment primary key,
	anio_licencia			varchar(4) unique not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- libro_relatorio --------------------------------

drop table if exists `libro_relatorio`;
CREATE TABLE `libro_relatorio` (
	id_libro_relatorio 		int unsigned primary key,

	id_orden_trabajo 		int unsigned DEFAULT null,
	foreign key ( id_orden_trabajo ) references orden_trabajo( id_orden_trabajo )
	on delete restrict 
	on update cascade,

	numero_aero 			varchar(4) not null, -- unique, -- unico pues no deben existir 2 eventos para el mismo generador
	foreign key ( numero_aero ) references aeros( numero_aero )
	on delete restrict 
	on update cascade,

	id_libro_licencia 		int unsigned not null,
	foreign key ( id_libro_licencia ) references libro_licencia( id_libro_licencia )
	on delete restrict
	on update cascade,

	condicion_operativa		enum('C.A.', 'DISPONIBLE', 'FALLA', 'MTTO', 'F.A.') not null,

	secuencia_licencia 		int unsigned DEFAULT null,

	fecha_inicio_evento 	date not null,
	hora_inicio_evento 		time not null,
	fecha_termino_evento 	date,
	hora_termino_evento  	time,
	fecha_termino_estimado 	date,

	trabajador_solicito 	char(5) not null,
	foreign key( trabajador_solicito ) references personal( RDE_trabajador )
	on delete restrict
	on update cascade,

	trabajador_autorizo 	char(5) not null,
	foreign key( trabajador_autorizo ) references personal( RDE_trabajador )
	on delete restrict
	on update cascade,

	descripcion_evento 		text not null,

	estado_evento 			boolean DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists `libro_relatorio_historial`;
CREATE TABLE `libro_relatorio_historial` (
	id_libro_relatorio 		int unsigned,
	foreign key( id_libro_relatorio ) references libro_relatorio( id_libro_relatorio )
	on delete restrict
	on update cascade,

	fecha_evento 			date not null,
	hora 					time not null,
	descripcion_evento 		text not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------------------------------------------------------------------------------------------------------------
-- Definicion de trigger para la suma total de las capacidades efectivas e instaladas despues de una insercion
-- ---------------------------------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `PROMEDIO_CAP_INSERT` AFTER INSERT ON `aeros` FOR EACH ROW 
BEGIN
	-- Consulta para cambiar el valor de la capacidad efectiva de las unidades cuando se ingrese un nuevo aero generador
	-- para que realice la consulta el aerogenerador debe estar activo
	update unidad_aero set capacidad_efectiva_unidad =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = new.numero_unidad;

	-- Consulta para cambiar el valor de la capacidad instalada de las unidades cuando se ingrese un nuevo aero generador
	-- para que realice la consulta el aerogenerador debe estar activo
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;

	-- Consulta para cambiar la capacidad instalada de la central cuando se agre
	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );

	-- Consulta para cambiar el valor de la capacidad de las central cuando el valor de las unidades varie
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);
END
;;
DELIMITER ;

-- update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = "2") where numero_unidad = "2";

-- ---------------------------------------------------------------------------------------------------------------
-- Definicion de trigger para la suma total de las capacidades efectivas e instaladas despues de un update
-- ---------------------------------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `PROMEDIO_CAP_UPDATE` AFTER UPDATE ON `aeros` FOR EACH ROW
BEGIN
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = new.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;
	-- actualizamos el valor nuevo de la unidad que se le quito alguna unidad para eliminar inconsistencias de capacidades
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = old.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad)  where numero_unidad = old.numero_unidad;

	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);	
END
;;
DELIMITER ;

-- ---------------------------------------------------------------------------------------------------------------
-- Suma total de las capacidades efectivas e instaladas despues de una eliminacion
-- ----------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `PROMEDIO_CAP_DELETE` AFTER DELETE ON `aeros` FOR EACH ROW
BEGIN
	update unidad_aero set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad AND estado_licencia = 'DISPONIBLE')  where numero_unidad = old.numero_unidad;
	update unidad_aero set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = old.numero_unidad)  where numero_unidad = old.numero_unidad;	
	update central set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM aeros );
	update central set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM unidad_aero);	
END
;;
DELIMITER ;

-- ---------------------------------------------------------------------------------------------------------------
-- actualiza es estado del generador a disponible tras eliminar un evento de la tabla "libro_relatorio"
-- ---------------------------------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `CAMBIO_ESTADO_DELETE` AFTER DELETE ON `libro_relatorio` FOR EACH ROW
BEGIN
	update aeros set estado_licencia = 'DISPONIBLE', fecha_operacion = NULL where numero_aero = old.numero_aero;
	-- update orden_trabajo set estado_asignado = 0 where id_orden_trabajo = old.id_orden_trabajo;
END
;;
DELIMITER ;

-- UPDATE aeros SET estado_operacion = false WHERE numero_unidad = "2";

# SECCION DE INSERCION DE DATOS -------------------------------------------------------------------------------------

SELECT @password := 'laventa_cfe';

insert into catalogo_unidad_medida values('N/A', 'No Aplica');

-- LOCK TABLES `roles` WRITE;
-- INSERT INTO `roles` VALUES ('ADMINISTRADOR','ADMINISTRADOR DE LA BASE DE DATOS ÚNICO'),('INVITADO','USUARIO INVITADO, PUEDE VER TODAS LAS INTERFACES EN MODO SOLO LECTURA'),('MANTENIMIENTO','GENERA LOS PROGRAMAS DE MANTENIMIENTO, LISTAS DE VERIFICACION Y AUTORIZACION'),('OPERADOR','PERSONAL DE QUE CAPTURA LAS CONDICIONES OPERATIVAS DE LOS AEROGENERADORES'),('O_MANTENIMIENTO','PERSONAL QUE REALIZA EL MANTENIMIENTO EN CAMPO, ACTUALIZA LAS ORDENES DE TRABAJO Y LAS LISTAS DE VERIFICACION'),('SUPERINTENDENTE','ADMINISTRA LAS FUNCIONES PRINCIPALES DEL SISTEMA');
-- UNLOCK TABLES;

-- LOCK TABLES `acceso_rol` WRITE;
-- INSERT INTO `acceso_rol` VALUES ('MANTENIMIENTO',2,'CATALOGO DE LISTAS DE VERIFICACION','catalogoListas.php'),('SUPERINTENDENTE',1,'ESTATUS','status.php'),('SUPERINTENDENTE',2,'CATALOGO DE LISTAS DE VERIFICACION','catalogoListas.php'),('SUPERINTENDENTE',3,'PROGRAMA DE MANTENIMIENTO','programaMtto.php'),('OPERADOR',1,'Estatus','status.php'),('OPERADOR',3,'Programa de Mantenimiento','programaMtto.php'),('OPERADOR',3,'Orden Trabajo','ordenTrabajo.php'),('O_MANTENIMIENTO',1,'Estatus','status.php'),('O_MANTENIMIENTO',3,'Orden Trabajo','ordenTrabajo.php'),('O_MANTENIMIENTO',3,'Programa de Mantenimiento','programaMtto.php'),('O_MANTENIMIENTO',3,'Autorizacion de Mantenimiento','autorizacionMtto.php'),('INVITADO',1,'Estatus','status.php'),('INVITADO',2,'Catálogo de Roles de Usuario','catalogoRolUsuario.php'),('INVITADO',2,'Catálogo de Áreas de Trabajo','catalogoAreaTrabajo.php'),('INVITADO',2,'Catálogo de Usuarios','catalogoUsuarios.php'),('INVITADO',2,'Gestión de la Central','gestionCentral.php'),('INVITADO',2,'Catálogo de Unidades','catalogoUnidades.php'),('INVITADO',2,'Catálogo de Aéros','catalogoAeros.php'),('INVITADO',2,'Catálogo de Sistemas','catalogoSistemas.php'),('INVITADO',2,'Catálogo de Equipos','catalogoEquipos.php'),('INVITADO',2,'Catálogo de Unidades de Medida','catalogoUnidadesMedida.php'),('INVITADO',2,'Catálogo de Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('INVITADO',2,'Catálogo de Listas de Verificación','catalogoListas.php'),('INVITADO',3,'Creación de Orden de Trabajo','programaMtto.php'),('INVITADO',3,'Captura de Orden de Trabajo','ordenTrabajo.php'),('ADMINISTRADOR',1,'Estatus','status.php'),('ADMINISTRADOR',2,'Catálogo de Roles de Usuario','catalogoRolUsuario.php'),('ADMINISTRADOR',2,'Catálogo de Áreas de Trabajo','catalogoAreaTrabajo.php'),('ADMINISTRADOR',2,'Catálogo de Usuarios','catalogoUsuarios.php'),('ADMINISTRADOR',2,'Gestión de la Central','gestionCentral.php'),('ADMINISTRADOR',2,'Catálogo de Unidades','catalogoUnidades.php'),('ADMINISTRADOR',2,'Catálogo de Aéros','catalogoAeros.php'),('ADMINISTRADOR',2,'Catálogo de Sistemas','catalogoSistemas.php'),('ADMINISTRADOR',2,'Catálogo de Equipos','catalogoEquipos.php'),('ADMINISTRADOR',2,'Catálogo de Unidades de Medida','catalogoUnidadesMedida.php'),('ADMINISTRADOR',2,'Catálogo de Tipos de Mantenimiento','catalogoTipoMantenimiento.php'),('ADMINISTRADOR',2,'Catálogo de Listas de Verificación','catalogoListas.php'),('ADMINISTRADOR',3,'Creación de Orden de Trabajo','creacionOrdenTrabajo.php'),('ADMINISTRADOR',3,'Captura de Orden de Trabajo','capturaOrdenTrabajo.php'),('ADMINISTRADOR',4,'Consecutivo de Licencias','consecutivoLicencia.php'),('ADMINISTRADOR',4,'Libro Relatorio','libroRelatorio.php');
-- UNLOCK TABLES;

-- LOCK TABLES `permiso_rol` WRITE;
-- INSERT INTO `permiso_rol` VALUES ('MANTENIMIENTO','select'),('MANTENIMIENTO','insert'),('MANTENIMIENTO','update'),('MANTENIMIENTO','delete'),('SUPERINTENDENTE','select'),('SUPERINTENDENTE','insert'),('SUPERINTENDENTE','update'),('SUPERINTENDENTE','delete'),('OPERADOR','select'),('OPERADOR','insert'),('OPERADOR','update'),('O_MANTENIMIENTO','select'),('O_MANTENIMIENTO','insert'),('INVITADO','select'),('ADMINISTRADOR','all');
-- UNLOCK TABLES;

-- LOCK TABLES `area_trabajo` WRITE;
-- INSERT INTO `area_trabajo` VALUES ('AD','ADMINISTRACION'),('HJJK0','C.E. LA VENTA II'),('MN','MANTENIMIENTO'),('OP','OPERACION'),('SG','SUPERINTENDENCIA GENERAL');
-- UNLOCK TABLES;

-- LOCK TABLES `personal` WRITE;
-- INSERT INTO `personal` VALUES ('F7DG0','gorbachov','MIJAIL','GORBACHOV','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','AD','ADMINISTRADOR'),('QWERR','edgardo.g','EDGARDO DANIEL','GORDILLO DOMINGUEZ','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','HJJK0','ADMINISTRADOR'),('QWERT','hitler','ADOLFO','HITLER','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','AD','INVITADO'),('SDFU7','admin','VLADIMIR','PUTIN','9d4e1e23bd5b727046a9e3b4b7db57bd8d6ee684','AD','ADMINISTRADOR');
-- UNLOCK TABLES;

-- LOCK TABLES `central` WRITE;
-- INSERT INTO `central` VALUES ('HJJK0','2157','21571','C.E. LA VENTA II','CARRETERA PANAMERICANA KM. 821. COLONIA FELIPE PESCADOR. JUCHITAN DE ZARAGOZA OAXACA','9616179200 Ext. 76861','70050','QWERR',38.83,28);
-- UNLOCK TABLES;

-- LOCK TABLES `unidad_aero` WRITE;
-- INSERT INTO `unidad_aero` VALUES ('HJJK0','1',3.32,3.32),('HJJK0','2',19,NULL),('HJJK0','3',19.83,NULL),('HJJK0','4',NULL,NULL),('HJJK0','5',NULL,NULL),('HJJK0','6',NULL,NULL);
-- UNLOCK TABLES;

-- LOCK TABLES `aeros` WRITE;
-- INSERT INTO `aeros` VALUES ('3','GA01',0.83,'2015-01-28','DISPONIBLE'),('3','GA02',1,'2015-01-28','DISPONIBLE'),('3','GA03',1,'2015-01-28','DISPONIBLE'),('3','GA04',1,'2015-01-28','DISPONIBLE'),('3','GA05',1,'2015-01-28','DISPONIBLE'),('3','GA06',1,'2015-01-28','DISPONIBLE'),('3','GA07',1,'2015-01-28','DISPONIBLE'),('3','GA08',1,'2015-01-28','DISPONIBLE'),('3','GA09',1,'2015-01-28','DISPONIBLE'),('3','GA10',1,'2015-01-28','DISPONIBLE'),('3','GA11',1,'2015-01-28','DISPONIBLE'),('3','GA12',1,'2015-01-28','DISPONIBLE'),('3','GB01',1,'2015-01-28','DISPONIBLE'),('3','GB02',1,'2015-01-28','DISPONIBLE'),('3','GB03',1,'2015-01-28','DISPONIBLE'),('3','GB04',1,'2015-01-28','DISPONIBLE'),('3','GB05',1,'2015-01-28','DISPONIBLE'),('3','GB06',1,'2015-01-28','DISPONIBLE'),('3','GB07',1,'2015-01-28','DISPONIBLE'),('3','GB08',1,'2015-01-28','DISPONIBLE'),('2','GC01',1,'2015-01-28','DISPONIBLE'),('2','GC02',1,'2015-01-28','DISPONIBLE'),('2','GC03',1,'2015-01-28','DISPONIBLE'),('2','GC04',1,'2015-01-28','DISPONIBLE'),('2','GC05',1,'2015-01-28','DISPONIBLE'),('2','GC06',1,'2015-01-28','DISPONIBLE'),('2','GC07',1,'2015-01-28','DISPONIBLE'),('2','GC08',1,'2015-01-28','DISPONIBLE'),('2','GC09',1,'2015-01-28','DISPONIBLE'),('2','GD01',1,'2015-01-28','DISPONIBLE'),('2','GD02',1,'2015-01-28','DISPONIBLE'),('2','GD03',1,'2015-01-28','DISPONIBLE'),('2','GD04',1,'2015-01-28','DISPONIBLE'),('2','GD05',1,'2015-01-28','DISPONIBLE'),('2','GD06',1,'2015-01-28','DISPONIBLE'),('2','GD07',1,'2015-01-28','DISPONIBLE'),('2','GD08',1,'2015-01-28','DISPONIBLE'),('2','GD09',1,'2015-01-28','DISPONIBLE'),('2','GD10',1,'2015-01-28','DISPONIBLE'),('1','GF01',0.83,'2015-01-28','DISPONIBLE'),('1','GF02',0.83,NULL,'DISPONIBLE'),('1','GF03',0.83,NULL,'DISPONIBLE'),('1','GF04',0.83,NULL,'DISPONIBLE');
-- INSERT INTO aeros(numero_unidad,numero_aero,capacidad_efectiva_aero,estado_licencia) VALUES 
-- ('3','GA01',0.83,'DISPONIBLE'),
-- ('3','GA02',1,'DISPONIBLE'),
-- ('3','GA03',1,'DISPONIBLE'),
-- ('3','GA04',1,'DISPONIBLE'),
-- ('3','GA05',1,'DISPONIBLE'),
-- ('3','GA06',1,'DISPONIBLE'),
-- ('3','GA07',1,'DISPONIBLE'),
-- ('3','GA08',1,'DISPONIBLE'),
-- ('3','GA09',1,'DISPONIBLE'),
-- ('3','GA10',1,'DISPONIBLE'),
-- ('3','GA11',1,'DISPONIBLE'),
-- ('3','GA12',1,'DISPONIBLE'),
-- ('3','GB01',1,'DISPONIBLE'),
-- ('3','GB02',1,'DISPONIBLE'),
-- ('3','GB03',1,'DISPONIBLE'),
-- ('3','GB04',1,'DISPONIBLE'),
-- ('3','GB05',1,'DISPONIBLE'),
-- ('3','GB06',1,'DISPONIBLE'),
-- ('3','GB07',1,'DISPONIBLE'),
-- ('3','GB08',1,'DISPONIBLE'),
-- ('2','GC01',1,'DISPONIBLE'),
-- ('2','GC02',1,'DISPONIBLE'),
-- ('2','GC03',1,'DISPONIBLE'),
-- ('2','GC04',1,'DISPONIBLE'),
-- ('2','GC05',1,'DISPONIBLE'),
-- ('2','GC06',1,'DISPONIBLE'),
-- ('2','GC07',1,'DISPONIBLE'),
-- ('2','GC08',1,'DISPONIBLE'),
-- ('2','GC09',1,'DISPONIBLE'),
-- ('2','GD01',1,'DISPONIBLE'),
-- ('2','GD02',1,'DISPONIBLE'),
-- ('2','GD03',1,'DISPONIBLE'),
-- ('2','GD04',1,'DISPONIBLE'),
-- ('2','GD05',1,'DISPONIBLE'),
-- ('2','GD06',1,'DISPONIBLE'),
-- ('2','GD07',1,'DISPONIBLE'),
-- ('2','GD08',1,'DISPONIBLE'),
-- ('2','GD09',1,'DISPONIBLE'),
-- ('2','GD10',1,'DISPONIBLE'),
-- ('1','GF01',0.83,'DISPONIBLE'),
-- ('1','GF02',0.83,'DISPONIBLE'),
-- ('1','GF03',0.83,'DISPONIBLE'),
-- ('1','GF04',0.83,'DISPONIBLE');
-- UNLOCK TABLES;

-- LOCK TABLES `sistema_aero` WRITE;
-- INSERT INTO `sistema_aero` VALUES ('CE','CAJA DE ENGRANES'),('CP','CONTROL, PROTECCION Y COMUNICACION'),('EA','EDIFICIO, ACCESO E INSTALACIONES'),('EL','ELECTRICO'),('ES','ESTRUCTURA (SOPORTE Y NACELLE)'),('GE','GENERADOR ELECTRICO'),('OR','ORIENTACION'),('TU','TURBINA (ROTOR DEL GENERADOR)');
-- UNLOCK TABLES;

-- LOCK TABLES `equipo_aero` WRITE;
-- INSERT INTO `equipo_aero` VALUES ('AC','ACCESOS Y CUNETAS','EA'),('AI','ARMARIO INFERIOR (GROUD CONTROL)','CP'),('AR','ALMACEN RESIDUOS','EA'),('AS','ARMARIO SUPERIOR (TOP CONTROL)','CP'),('AT','ALTA TENSION (+ DE 690 V Y HASTA 34.5 KV)','EA'),('BA','BARQUILLA (NACELLE)','ES'),('BT','BAJA TENSION','EL'),('CC','CUARTO DE CONTROL','EA'),('CH','CHASIS','ES'),('CP','CELDAS DE POTENCIA','EL'),('CV','CASETA DE VIGILACIA','EA'),('EA','ENFRIAMIENTO ACEITE','CE'),('EP','ENGRANE PLANETARIO','OR'),('FD','FRENO DE DISCO','GE'),('FH','FRENO HIDRAULICO','OR'),('FP','FLECHA PRINCIPAL (CABALLETE)','TU'),('GP','GENERADOR PRINCIPAL','GE'),('MR','MOTOREDUCTORES','OR'),('MT','MEDIANA TENSION (+ DE 480 V Y HASTA 13.8 KV)','EL'),('OF','OFICINAS','EA'),('PY','PISTA DEL YAW','OR'),('RP','ROTOR PRINCIPAL','TU'),('RT','RED DE TIERRAS','EL'),('SA','SISTEMA DE AMORTIGUAMIENTO','CE'),('SC','SISTEMA DE COMUNICACION','CP'),('SCI','SISTEMA CONTRAINCENDIO','CP'),('SE','SUBESTACION 13.8 KV','EA'),('SEP','SECCION DE EMBARRADO Y PROTECCIONES','CP'),('SI','SISTEMA DE INCLINACION (PITCH)','TU'),('SRY','SISTEMA DE RODAMIENTO DEL YAW','OR'),('TAV','TREN DE ALTA VELOCIDAD','CE'),('TBV','TREN DE BAJA VELOCIDAD','CE'),('TF','TRANSFORMADORES','EL'),('TMC','TABLERO METAL CLAD 34.5 KV','EL'),('TR','TRANSMISION','GE'),('TT','TORRE TRONCOCONICA','ES'),('TVI','TREN DE VELOCIDAD INTERMEDIA','CE'),('UH','UNIDAD HIDRAULICA','TU');
-- UNLOCK TABLES;

-- LOCK TABLES `catalogo_unidad_medida` WRITE;
-- INSERT INTO `catalogo_unidad_medida` VALUES ('AV','AUDIOVISUAL'),('BAR','BARES'),('MM','MILIMETROS'),('NM','NEWTOWS METRO'),('T','TACTIL'),('V','VISUAL');
-- UNLOCK TABLES;

-- LOCK TABLES `tipo_mantenimiento` WRITE;
-- INSERT INTO `tipo_mantenimiento` VALUES ('ME','MENOR',3,'M'),('MY','MAYOR',8,'M'),('RT','RUTINARIO',15,'d'),('SE','SEMESTRAL',6,'M');
-- UNLOCK TABLES;

-- LOCK TABLES `actividad_verificar` WRITE;
-- INSERT INTO `actividad_verificar` VALUES (1,'RT','CE','TBV','CONO','1.1 REVISAR TOMILLOS DEL SOPORTE DEL CONO M20 10.9 DACROMET500B.'),(2,'RT','CE','TBV','CONO','1.2 REVISAR APRIETE Y ESTADO FISICO DE LAS ABRAZADERAS DE UNION CONO-ARO'),(3,'RT','CE','TBV','CONO','1.3 REVISAR SOLDADURAS DEL SOPORTE DE LA NARIZ'),(4,'RT','CE','TBV','CONO','1.4 REVISAR CONO EN BUSCA DE FISURAS'),(5,'RT','CE','TBV','CONO','1.5 REVISAR LOS TOMILLOS DE LA FIBRA DE VIDRIO'),(6,'RT','CP','AS','PALAS','2.1 CON MAQUINA EN OPERACIÃ“N, PONER ATENCION AL RUIDO DEL VIENTO AL PASAR POR LAS PALAS.'),(7,'RT','CP','AS','PALAS','2.2 REVISAR PALAS EN BUSCA DE FISURAS, DESDE EL PISO Y EN LA RAIZ POR DENTRO DEL CONO'),(8,'RT','CP','AS','PALAS','2.3 HISTORIAL DE GRIETAS. ANOTAR LA EVOLUCIÃ“N DE GRIETAS ENCONTRADAS EN INSPECCIONES PASADAS.'),(9,'RT','CE','EA','ÁÉÍÓÚÑ','ÁÉÍÓÚÑ'),(10,'RT','TU','SI','TOLERANCIA','ACTIVIDAD DE TOLERANCIA'),(11,'RT','TU','FP','TEST','TEST');
-- UNLOCK TABLES;

-- LOCK TABLES `parametro_actividad` WRITE;
-- INSERT INTO `parametro_actividad` VALUES (1,'COMPARACION','435','PAR:',1,'NM',1),(2,'TEXTO','','VISUAL Y TACTIL',1,'N/A',2),(3,'TEXTO','','VISUAL',1,'N/A',3),(4,'TEXTO','','VISUAL',1,'N/A',4),(5,'TEXTO','','VISUAL',1,'N/A',5),(6,'TEXTO','','AUDIOVISUAL',1,'N/A',6),(7,'TEXTO','','VISUAL',1,'N/A',7),(8,'TEXTO','','VISUAL',1,'N/A',8),(9,'TEXTO','','TEST',1,'N/A',9),(10,'TOLERANCIA','50,2','DATO:',1,'NM',10),(10,'TOLERANCIA','60,3','DATO:',2,'NM',11),(11,'TOLERANCIA','50,2','TEST',1,'AV',12);
-- UNLOCK TABLES;

-- LOCK TABLES `lectura_actual` WRITE;
-- INSERT INTO `lectura_actual` VALUES (1,'Datos','PAR:','NM',1,1),(2,'Binario','SE MUEVE?','N/A',1,2),(3,'Binario','EXISTEN FISURAS?','N/A',1,3),(4,'Binario','EXISTEN FISURAS?','N/A',1,4),(5,'Binario','EXISTEN FISURAS?','N/A',1,5),(6,'Datos','PALA A:','N/A',1,6),(6,'Datos','PALA B:','N/A',2,7),(6,'Datos','PALA C:','N/A',3,8),(7,'Datos','PALA A:','N/A',1,9),(7,'Datos','PALA B:','N/A',2,10),(7,'Datos','PALA C:','N/A',3,11),(8,'Datos','PALA A:','N/A',1,12),(8,'Datos','PALA B:','N/A',2,13),(8,'Datos','PALA C:','N/A',3,14),(9,'Binario','TEST','N/A',1,15),(10,'Datos','DATO:','NM',1,16),(10,'Datos','DATO:','NM',2,17),(11,'Binario','TEST','N/A',1,18);
-- UNLOCK TABLES;

-- LOCK TABLES `lectura_posterior` WRITE;
-- INSERT INTO `lectura_posterior` VALUES (1,'Datos','PAR:','NM',1,1),(2,'Binario','SE MUEVE?','N/A',1,2),(3,'Binario','EXISTEN FISURAS?','N/A',1,3),(4,'Binario','EXISTEN FISURAS?','N/A',1,4),(5,'Binario','EXISTEN FISURAS?','N/A',1,5),(6,'Datos','PALA A:','N/A',1,6),(6,'Datos','PALA B:','N/A',2,7),(6,'Datos','PALA C:','N/A',3,8),(7,'Datos','PALA A:','N/A',1,9),(7,'Datos','PALA B:','N/A',2,10),(7,'Datos','PALA C:','N/A',3,11),(8,'Datos','PALA A:','N/A',1,12),(8,'Datos','PALA B:','N/A',2,13),(8,'Datos','PALA C:','N/A',3,14),(9,'Binario','TEST','N/A',1,15),(10,'Datos','DATO:','NM',1,16),(10,'Datos','DATO:','NM',2,17),(11,'Binario','TEST','N/A',1,18);
-- UNLOCK TABLES;

-- LOCK TABLES `libro_licencia` WRITE;
-- INSERT INTO `libro_licencia` VALUES (1,'2015');
-- UNLOCK TABLES;