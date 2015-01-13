drop database if exists laventa_cfe;
create database laventa_cfe;
use laventa_cfe;

# SECCION DE ADMINISTRACION DE USUARIOS -------------------------------------------------------------------------------------

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
	estado_licencia 			varchar(20) not null,

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
	estado_asignado 		boolean DEFAULT false

	-- campos capturados por el sistema del operador---------------------------------
	-- horas_operacion			int,
	-- fecha_entrada			date,
	-- fecha_salida			date,
	-- hora_entrada			time,
	-- hora_salida				time,
	-- horas_indispo			int,
	-- porcen_indispo			tinyint unsigned,

	-- campos capturados por el operador ---------------------------------
	-- temp_ambiente			smallint,
	-- temp_caja_eng			smallint,
	-- temp_aceite_hid			smallint,
	-- temp_gen_elec			smallint,

	-- equipo_seguridad		varchar(30),
	-- foreign key(equipo_seguridad) references equipo_seguridad(tipo_equipo)
	-- on delete restrict
	-- on update cascade,

	-- trabajos_efectuados		text,
	-- id_material				int unsigned
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


-- ---------- libro_licencia ---------------------------------

drop table if exists `libro_licencia`;

CREATE TABLE `libro_licencia` (
	id_libro_licencia		int unsigned auto_increment primary key,
	anio_licencia			varchar(4) unique not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ---------- libro_relatorio --------------------------------

drop table if exists `libro_relatorio`;
CREATE TABLE `libro_relatorio` (
	id_libro_relatorio 		int unsigned primary key,

	id_orden_trabajo 		int unsigned DEFAULT null,
	foreign key ( id_orden_trabajo ) references orden_trabajo( id_orden_trabajo )
	on delete restrict 
	on update cascade,

	numero_aero 			varchar(4) not null,
	foreign key ( numero_aero ) references aeros( numero_aero )
	on delete restrict 
	on update cascade,

	id_libro_licencia 		int unsigned not null,
	foreign key ( id_libro_licencia ) references libro_licencia( id_libro_licencia )
	on delete restrict
	on update cascade,

	secuencia_licencia 		int unsigned not null,	

	fecha_inicio_evento 	date not null,
	hora_inicio_evento 		time not null,
	fecha_termino_evento 	date,
	hora_termino_evento  	time,

	condicion_operativa 	varchar(20) not null,

	trabajador_solicito 	varchar(30) not null,
	foreign key( trabajador_solicito ) references personal( nombre_usuario )
	on delete restrict
	on update cascade,

	trabajador_autorizo 	varchar(30) not null,
	foreign key( trabajador_solicito ) references personal( nombre_usuario )
	on delete restrict
	on update cascade,

	trabajador_devolvio 	varchar(30),
	foreign key( trabajador_solicito ) references personal( nombre_usuario )
	on delete restrict
	on update cascade,

	descripcion_evento 		text not null
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

drop table if exists `libro_relatorio_historial`;
CREATE TABLE `libro_relatorio_historial` (
	id_libro_relatorio 		int unsigned,
	foreign key( id_libro_relatorio ) references libro_relatorio( id_reporte_novedad )
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
-- actualiza es estado del generador a disponible
-- ---------------------------------------------------------------------------------------------------------------

-- DELIMITER ;;
-- CREATE TRIGGER `CAMBIO_ESTADO_UPDATE` AFTER DELETE ON `orden_trabajo` FOR EACH ROW
-- BEGIN
-- 	update aeros set estado_licencia = 'DISPONIBLE' where numero_aero = old.id_aero;
-- END
-- ;;
-- DELIMITER ;

-- UPDATE aeros SET estado_operacion = false WHERE numero_unidad = "2";

# SECCION DE INSERCION DE DATOS -------------------------------------------------------------------------------------

SELECT @password := 'laventa_cfe';

insert into catalogo_unidad_medida values('N/A', 'No Aplica');