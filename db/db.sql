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
	nombre_usuario			varchar(16) not null unique,
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
	numero_aero					varchar(50) primary key not null,
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

CREATE TABLE `materiales` (
	codigo_material 			int unsigned primary key,
	descripcion_material 		varchar(100),
	tipo_material				enum( 'REFACCION', 'EQUIPO', 'MATERIAL' )
);

# SECCION DE ORDEN DE TRABAJO (TABLAS DE ELEMENTOS INSERTADOS)-----------------------------------------------------------
-- En esta seccion creamos tablas para almacenar el orden jerarquico de los componentes

CREATE TABLE `catalogo_unidad_medida`(	
	unidad_medida 				varchar(20) primary key,
	descripcion_unidad_medida 	varchar(50)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO catalogo_unidad_medida VALUES('N/A', 'No Aplica');
-- SELECT @password := 'laventa_cfe';

CREATE TABLE `tipo_mantenimiento`(
	id_mantenimiento		varchar(2) primary key,
	nombre_mantenimiento	varchar(30) not null unique,
	numero_frecuencia		int unsigned not null,
	tipo_frecuencia			enum('d', 'M', 'y')
	-- tipo_frecuencia			enum('Dias', 'Meses', 'Anios', 'INDEFINIDO')
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------- lista_verificacion ----------------------------------

CREATE TABLE `lista_verificacion` (
	id_lista_verificacion 			int unsigned primary key,

	id_mantenimiento				varchar(2) NOT NULL UNIQUE,
	foreign key ( id_mantenimiento ) references tipo_mantenimiento( id_mantenimiento )
	on delete cascade
	on update cascade,

	lista_verificacion 				varchar(100) NOT NULL UNIQUE
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `actividad_verificar` (
	id_actividad_verificar 			int unsigned primary key auto_increment,

	id_lista_verificacion			int unsigned NOT NULL,
	foreign key ( id_lista_verificacion ) references lista_verificacion( id_lista_verificacion )
	on delete cascade
	on update cascade,

	id_sistema_aero 				varchar(2) NOT NULL,
	foreign key( id_sistema_aero ) references sistema_aero( id_sistema_aero )
	on delete restrict
	on update cascade,

	id_equipo_aero					varchar(4) NOT NULL,
	foreign key(id_equipo_aero) references equipo_aero(id_equipo_aero)
	on delete restrict
	on update cascade,
	
	actividad_verificar 			text NOT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `parametro_actividad`(
	id_actividad					int unsigned not null,
	foreign key (id_actividad) references actividad_verificar(id_actividad_verificar)
	on delete cascade
	on update cascade,

	id 								int unsigned primary key,
	tipo_dato 						enum( 'BINARIO', 'TEXTO', 'COMPARACION', 'RANGO', 'TOLERANCIA' ) not null,
	dato 							varchar(51),
	parametro 						text not null,	
	secuencia_datos					int unsigned not null,
	unidad_medida 					varchar(20),
	foreign key (unidad_medida) references catalogo_unidad_medida(unidad_medida)
	on delete restrict
	on update cascade	
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
-- ----------------------------------------------------------------
-- ----------------------------------------------------------------
-- ----------------------------------------------------------------
-- ----------------------------------------------------------------
-- ----------------------------------------------------------------
-- ----------------------------------------------------------------

CREATE TABLE `orden_trabajo`(	
	id_prog_mtto			int unsigned PRIMARY KEY,
	numero_orden			varchar(30) NOT NULL,

	-- campos capturados por el que asigna la orden ---------------------------------
	
	id_aero 				varchar(50) NOT NULL,
	foreign key(id_aero) references aeros(numero_aero)
	on delete restrict
	on update cascade,

	id_mantenimiento		varchar(2) NOT NULL,
	foreign key (id_mantenimiento) references tipo_mantenimiento (id_mantenimiento)
	on delete restrict
	on update cascade,

	duracion				int unsigned NOT NULL,
	magnitud_duracion		enum('d', 'M', 'y') NOT NULL,
	fecha_inicial 			date NOT NULL,
	fecha_final 			date NOT NULL,
	trabajo_solicitado		text NOT NULL,
	estado_asignado 		enum( 'FINALIZADO' ) DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `programacion_mtto`(	
	id_orden_trabajo		int unsigned PRIMARY KEY,
	id_prog_mtto		 	int unsigned,
	foreign key ( id_prog_mtto ) references orden_trabajo( id_prog_mtto )
	ON DELETE RESTRICT 
	ON UPDATE CASCADE,

	fecha_inicial 			date NOT NULL,
	fecha_final 			date NOT NULL,

	id_orden_reprog			int unsigned DEFAULT NULL,
	-- foreign key( id_orden_reprog ) references programacion_mtto( id_orden_trabajo )
	-- ON DELETE RESTRICT
	-- ON UPDATE CASCADE,

	fecha_realizada			date DEFAULT NULL,
	estado_asignado 		enum( 'ACTIVO', 'REPROGRAMADO', 'FINALIZADO' ) DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orden_trabajo_personal`(
	id_orden_trabajo		int unsigned,
	foreign key ( id_orden_trabajo ) references programacion_mtto( id_orden_trabajo )
	on delete cascade
	on update cascade,

	usuario 			varchar( 16 ),
	foreign key ( usuario ) references personal( nombre_usuario )
	on delete cascade
	on update cascade,

	tipo_usuario			enum( 'AUXILIAR', 'RESPONSABLE', 'SUPERVISOR' )
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `orden_trabajo_material`(
	id_orden_trabajo_material	int unsigned primary key,

	id_orden_trabajo			int unsigned,
	foreign key ( id_orden_trabajo ) references programacion_mtto( id_orden_trabajo )
	on delete restrict
	on update cascade,

	codigo_material 			int unsigned,
	foreign key ( codigo_material ) references materiales( codigo_material )
	on delete restrict
	on update cascade,

	cantidad					int unsigned
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
	foreign key (id_orden_trabajo) references programacion_mtto(id_orden_trabajo)
	on delete restrict
	on update cascade
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `datos_lista_verificacion`(
	id_orden_trabajo					int unsigned not null,
	foreign key ( id_orden_trabajo ) references programacion_mtto ( id_orden_trabajo )
	on delete restrict
	on update cascade,

	fecha							date not null,
	hora 							time not null,
	observaciones					text
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- libro_licencia ---------------------------------

CREATE TABLE `libro_licencia` (
	id_libro_licencia		int unsigned auto_increment primary key,
	anio_licencia			varchar(4) unique not null,
	inicializador			int unsigned -- numero donde iniciará el contador autoincrement
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- libro_relatorio --------------------------------

CREATE TABLE `libro_relatorio` (
	id_libro_relatorio 		int unsigned primary key,

	id_orden_trabajo 		int unsigned DEFAULT null,
	foreign key ( id_orden_trabajo ) references programacion_mtto( id_orden_trabajo )
	on delete restrict 
	on update cascade,

	reporte_por 			enum('AEROGENERADOR','UNIDAD') NOT NULL,

	numero_aero 			varchar(50) not null, -- unique, -- unico pues no deben existir 2 eventos para el mismo generador
	foreign key ( numero_aero ) references aeros( numero_aero )
	on delete restrict 
	on update cascade,

	id_libro_licencia 		int unsigned not null,
	foreign key ( id_libro_licencia ) references libro_licencia( id_libro_licencia )
	on delete restrict
	on update cascade,

	condicion_operativa		enum('C.A.', 'DISPONIBLE', 'FALLA', 'MTTO', 'F.A.') not null,

	consecutivo_licencia 	int unsigned DEFAULT NULL,

	fecha_inicio_evento 	date not null,
	hora_inicio_evento 		time not null,
	fecha_termino_evento 	date,
	hora_termino_evento  	time,
	fecha_termino_estimado 	date,

	trabajador_solicito 	char(5) NOT NULL,
	foreign key( trabajador_solicito ) references personal( RDE_trabajador )
	on delete restrict
	on update cascade,

	trabajador_autorizo 	char(5),
	foreign key( trabajador_autorizo ) references personal( RDE_trabajador )
	on delete restrict
	on update cascade,

	descripcion_evento 		text not null,

	estado_evento 			boolean DEFAULT TRUE # TRUE --> activo || FALSE --> terminado
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `libro_relatorio_historial` (
	id_libro_relatorio_historial	int unsigned primary key,
	id_libro_relatorio 				int unsigned,
	FOREIGN KEY( id_libro_relatorio ) references libro_relatorio( id_libro_relatorio )
	ON DELETE restrict
	ON UPDATE cascade,

	fecha_inicio_evento 			date NOT NULL,
	hora_inicio_evento 				time NOT NULL,
	fecha_termino_estimado_evento 	date NOT NULL,
	hora_termino_estimado_evento 	time NOT NULL,
	fecha_termino_evento 			date NOT NULL,
	hora_termino_evento				time NOT NULL,

	condicion_operativa			enum('C.A.', 'DISPONIBLE', 'FALLA', 'MTTO', 'F.A.') NOT NULL,
	descripcion_evento 			text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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