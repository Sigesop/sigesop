drop database if exists laventa_cfe;
create database laventa_cfe;
use laventa_cfe;



# SECCION DE ADMINISTRACION DE USUARIOS -------------------------------------------------------------------------------------
create table `ROLES`(

	clave_rol					varchar(10) primary key,
	descripcion_areaTrabajo		varchar(50) not null,
	estado_admin				boolean not null DEFAULT false,
	estado_delete				boolean not null DEFAULT false,	
	estado_insert				boolean not null DEFAULT false,	
	estado_select				boolean not null DEFAULT false

)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/ROLES';


create table `AREA_TRABAJO`(

	clave_areaTrabajo			varchar(2) primary key,
	descripcion_areaTrabajo		varchar(50) not null

)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/AREA_TRABAJO';


create table `PERSONAL`(

	RDE_trabajador 			varchar(5) primary key,
	nombre_usuario			varchar(30) not null unique,
	nombre_trabajador		varchar(50) not null,
	apellidos_trabajador	varchar(50) not null,
	password_trabajador		varchar(20) not null,

	clave_areaTrabajo		varchar(2) not null,
	clave_rol				varchar(10) not null,

	foreign key(clave_areaTrabajo) references AREA_TRABAJO(clave_areaTrabajo)
	on delete restrict
	on update cascade,

	foreign key(clave_rol) references ROLES(clave_rol)
	on delete restrict
	on update cascade

)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/PERSONAL';


create table sesionActiva(

	nombre_usuario 		varchar(30) primary key,
	estado				boolean not null DEFAULT false

)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/sesionActiva';

# SECCION DE ORDEN DE TRABAJO (TABLAS DE ELEMENTOS UNICOS)-------------------------------------------------------------------
-- Aqui unicamente creamos las tablas para almacenar los aeros, sistemas, equipos y componentes
-- estas tablas nos serviran por si el usuario quiera dar de alta un valor nuevo de los anteriormente
-- enlistado. Estas tablas serviran de referencia cuando en la interfaz web solicitemos los valores
-- en los combobox


create table `CENTRAL`(

	clave_20					varchar(5) primary key,  -- Clave unica de la central
	clave_SAP					varchar(4) not null,
	centro_costo				varchar(6) not null,
	nombre_central				varchar(100) not null,
	direccion					varchar(100) not null,
	telefono					varchar(10) not null,
	cp							varchar(5) not null,
	superintendente				varchar(5) not null,
	capacidad_instalada			int (7) unsigned not null,
	capacidad_efectiva_central	int(7) unsigned not null, -- La capacidad efectiva en central es la suma de la capacidad de las unidades

	foreign key(superintendente) references PERSONAL(RDE_trabajador)
	on delete restrict
	on update cascade


)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/CENTRAL';


CREATE TABLE `UNIDAD_AERO`(
	
	clave_20					varchar(5) not null, -- Clave unica de la central
	numero_unidad				varchar(4) primary key,
	capacidad_instalada			int (7) unsigned not null,
	capacidad_efectiva_unidad	int(7) unsigned not null, -- La capacidad efectiva en la unidad es la suma de la capacidad de los aeros

	foreign key(clave_20) references CENTRAL(clave_20)
	on delete restrict
	on update cascade

	-- foreign key(capacidad_efectiva_unidad) references CENTRAL(capacidad_efectiva_central)
	-- on delete restrict
	-- on update cascade
	

)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/UNIDAD_AERO';


CREATE TABLE `AEROS` (

	clave_20					varchar(5) not null, -- Clave unica de la central
	numero_unidad				varchar(4) not null,
	numero_aero					varchar(4) primary key,
	capacidad_efectiva_aero		int(7) unsigned not null, -- La capacidad efectiva de cada aerogenerador
	fecha_operacion				date not null,
	estado_operacion			boolean not null DEFAULT TRUE,
	estado_licencia				boolean not null DEFAULT FALSE, -- Bandera para determinar si el generador será tomado en cuenta en la suma de la capacidad
																-- efectiva, define el estado de la licencia, si la tiene se encuentra en mantenimiento
																-- por lo tanto se encuentra fuera de linea

	foreign key(clave_20) references UNIDAD_AERO(clave_20)
	on delete restrict 
	on update cascade

	-- foreign key(capacidad_efectiva_aero) references UNIDAD_AERO(capacidad_efectiva_unidad)
	-- on delete restrict
	-- on update cascade


)ENGINE=FEDERATED  DEFAULT CHARSET=utf8 CONNECTION='mysql://esclavo01@192.168.0.3:3306/laventa_cfe/AEROS';




-- CREATE TABLE SISTEMA_AERO(
	
-- 	id_sistema_aero 		varchar(2) primary key,
-- 	nombre_sistema_aero		varchar(30) not null

-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- CREATE TABLE EQUIPO_AERO(

-- 	id_equipo_aero			varchar(4) primary key,
-- 	nombre_equipo_aero		varchar(30) not null

-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- CREATE TABLE COMPONENTE_AERO(
	
-- 	id_componente_aero		varchar(3) primary key,
-- 	nombre_componente_aero	varchar(30) not null,	
-- 	id_equipo_aero			varchar(4),	
-- 	id_sistema_aero 		varchar(2),


-- 	foreign key(id_equipo_aero) references EQUIPO_AERO(id_equipo_aero),
-- 	foreign key(id_sistema_aero) references SISTEMA_AERO(id_sistema_aero)

-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- CREATE TABLE TIPO_MANTENIMIENTO(

-- 	id_mantenimiento		varchar(2) primary key,
-- 	nombre_mantenimiento	varchar(30) not null

-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;


# SECCION DE ORDEN DE TRABAJO (TABLAS DE ELEMENTOS INSERTADOS)-----------------------------------------------------------
-- En esta seccion creamos tablas para almacenar el orden jerarquico de los componentes

-- CREATE TABLE MANTTO_GENERADOR_AERO(
	
-- 	id_aero 				varchar(4) not null,
-- 	id_mantenimiento		varchar(2),
-- 	id_componente_aero		varchar(3),

-- 	foreign key(id_aero) references UNIDAD_AERO(id_aero),
-- 	foreign key(id_mantenimiento) references TIPO_MANTENIMIENTO(id_mantenimiento),
-- 	foreign key(id_componente_aero) references COMPONENTE_AERO(id_componente_aero)

-- )ENGINE=InnoDB DEFAULT CHARSET=utf8;

# SECCION DE INSERCION DE DATOS -------------------------------------------------------------------------------------

drop user sesionActiva@'localhost';
create user sesionActiva@'localhost' identified by 'E*k9qMJjjU4^D5q';
grant select, insert, update on laventa_cfe.sesionActiva to sesionActiva@'localhost';

insert into ROLES values('Admin', "TEST", 0, 0, 0, 0);
insert into ROLES values('Operador', "TEST", 0, 0, 0, 1);

insert into AREA_TRABAJO values("AA", "Area de trabajo 1");
insert into AREA_TRABAJO values("AB", "Area de trabajo 2");
insert into AREA_TRABAJO values("AC", "Area de trabajo 3");
insert into AREA_TRABAJO values("AD", "Area de trabajo 4");
insert into AREA_TRABAJO values("AE", "Area de trabajo 5");
insert into AREA_TRABAJO values("AF", "Area de trabajo 6");

-- insert into SISTEMA_AERO values('00','sistema electrico');
-- insert into SISTEMA_AERO values('01','sistema de lubricacion');
-- insert into SISTEMA_AERO values('02','sistema de transmision');
-- insert into SISTEMA_AERO values('03','sistema de enfriamiento');
-- insert into SISTEMA_AERO values('04','sistema hidraulico');

-- insert into EQUIPO_AERO values('0000', 'generador');
-- insert into EQUIPO_AERO values('0001', 'transformador');
-- insert into EQUIPO_AERO values('0002', 'regulador');
-- insert into EQUIPO_AERO values('0003', 'gobernador');

-- insert into COMPONENTE_AERO values('111', 'estator', '0000', '00');
-- insert into COMPONENTE_AERO values('222', 'bobinas', '0000', '00');
-- insert into COMPONENTE_AERO values('333', 'escobillas', '0000', '00');

-- insert into TIPO_MANTENIMIENTO values('01', 'Mayor');
-- insert into TIPO_MANTENIMIENTO values('02', 'Menor');
-- insert into TIPO_MANTENIMIENTO values('03', 'Semestral');
-- insert into TIPO_MANTENIMIENTO values('04', 'Rutinario');
-- insert into TIPO_MANTENIMIENTO values('05', 'Productivo');
-- insert into TIPO_MANTENIMIENTO values('06', 'Correctivo');

-- insert into MANTTO_GENERADOR_AERO values('GC01', '01', '111');


-- insert into AREA_TRABAJO values("AA", "TEST");
-- insert into AREA_TRABAJO values("AB", "TEST");
-- insert into AREA_TRABAJO values("AC", "TEST");

-- insert into UNIDAD_AERO values('GC01');
-- insert into UNIDAD_AERO values('GC02');
-- insert into UNIDAD_AERO values('GC03');
-- insert into UNIDAD_AERO values('GC04');
-- insert into UNIDAD_AERO values('GC05');

-- insert into SISTEMA_AERO values('GC01', '00','sistema electrico');
-- insert into SISTEMA_AERO values('GC01', '01','sistema de lubricacion');
-- insert into SISTEMA_AERO values('GC01', '02','sistema de transmision');
-- insert into SISTEMA_AERO values('GC01', '03','sistema de enfriamiento');
-- insert into SISTEMA_AERO values('GC01', '04','sistema hidraulico');

-- insert into EQUIPO_AERO values('1234', '');
-- insert into EQUIPO_AERO values('1236', '');
-- insert into EQUIPO_AERO values('1237', '');
-- insert into EQUIPO_AERO values('1238', '');
-- insert into EQUIPO_AERO values('1239', '');


drop user user@'localhost';
insert into PERSONAL values('ABCDE', 'user', 'Abimael', 'Hernandez Hernandez', 'pass', 'AA', 'Admin');
insert into sesionActiva values('user', false);
create user user@'localhost' identified by 'pass';
grant insert, select on laventa_cfe.* to user@'localhost';

drop user admin@'localhost';
insert into PERSONAL values('ABCD1', 'admin', 'Juan de Jesus', 'Lopez Ortiz', 'pass', 'AA', 'Admin');
insert into sesionActiva values('admin', false);
create user admin@'localhost' identified by 'pass';
grant insert, select on laventa_cfe.* to admin@'localhost';


-- ------------------------------------------------------------------------------------------------
-- Definicion de trigger para la suma total de las capacidades efectivas e instaladas despues de una insercion
-- ------------------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `PROMEDIO_CAP_INSERT` AFTER INSERT ON `AEROS` FOR EACH ROW 
BEGIN

	-- Consulta para cambiar el valor de la capacidad efectiva de las unidades cuando se ingrese un nuevo aero generador
	-- para que realice la consulta el aerogenerador debe estar activo
	update UNIDAD_AERO set capacidad_efectiva_unidad =  (SELECT SUM(capacidad_efectiva_aero) from AEROS where numero_unidad = new.numero_unidad AND estado_licencia = false)  where numero_unidad = new.numero_unidad;

	-- Consulta para cambiar el valor de la capacidad instalada de las unidades cuando se ingrese un nuevo aero generador
	-- para que realice la consulta el aerogenerador debe estar activo
	update UNIDAD_AERO set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from AEROS where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;

	-- Consulta para cambiar la capacidad instalada de la central cuando se agre
	update CENTRAL set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM AEROS );

	-- Consulta para cambiar el valor de la capacidad de las central cuando el valor de las unidades varie
	update CENTRAL set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM UNIDAD_AERO);

END
;;
DELIMITER ;

-- update UNIDAD_AERO set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from aeros where numero_unidad = "2") where numero_unidad = "2";

-- ------------------------------------------------------------------------------------------------


-- ------------------------------------------------------------------------------------------------
-- Definicion de trigger para la suma total de las capacidades efectivas e instaladas despues de un update
-- ------------------------------------------------------------------------------------------------

DELIMITER ;;
CREATE TRIGGER `PROMEDIO_CAP_UPDATE` AFTER UPDATE ON `AEROS` FOR EACH ROW
BEGIN

	update UNIDAD_AERO set capacidad_efectiva_unidad = (SELECT SUM(capacidad_efectiva_aero) from AEROS where numero_unidad = new.numero_unidad AND estado_licencia = false)  where numero_unidad = new.numero_unidad;
	update UNIDAD_AERO set capacidad_instalada =  (SELECT SUM(capacidad_efectiva_aero) from AEROS where numero_unidad = new.numero_unidad)  where numero_unidad = new.numero_unidad;	
	update CENTRAL set capacidad_instalada = (SELECT SUM(capacidad_efectiva_aero) FROM AEROS );
	update CENTRAL set capacidad_efectiva_central = (SELECT SUM(capacidad_efectiva_unidad) FROM UNIDAD_AERO);	

END
;;
DELIMITER ;

-- UPDATE AEROS SET estado_operacion = false WHERE numero_unidad = "2";

-- ------------------------------------------------------------------------------------------------
insert into CENTRAL values("AAAAA", "SAP1", "COS01", "LA ANGOSTURA", "CARRETERA VENUSTIANO CARRANZA", "9612280912", "29160", "ABCD1", 0, 0);

insert into UNIDAD_AERO values("AAAAA", "1", 0, 0);
insert into UNIDAD_AERO values("AAAAA", "2", 0, 0);
insert into UNIDAD_AERO values("AAAAA", "3", 0, 0);
insert into UNIDAD_AERO values("AAAAA", "4", 0, 0);
insert into UNIDAD_AERO values("AAAAA", "5", 0, 0);
insert into UNIDAD_AERO values("AAAAA", "6", 0, 0);

insert into AEROS values("AAAAA", "1", "GC96", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "1", "GC97", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "1", "GC98", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "1", "GC99", 850, "2013-02-13", true, false);

insert into AEROS values("AAAAA", "2", "GC01", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC02", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC03", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC04", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC05", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC06", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC07", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC08", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GC09", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "2", "GD01", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "2", "GD02", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "2", "GD03", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "2", "GD04", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD05", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD06", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD07", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD08", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD09", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "2", "GD10", 850, "2013-02-13", true, false);

insert into AEROS values("AAAAA", "3", "GA01", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA02", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA03", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA04", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA05", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA06", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA07", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA08", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA09", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA10", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA11", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GA12", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB01", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB02", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB03", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB04", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB05", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB06", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB07", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "3", "GB08", 850, "2013-02-13", true, false);

insert into AEROS values("AAAAA", "4", "GC23", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GC24", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GC25", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GC26", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GC27", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD11", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD12", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD13", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD14", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD15", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD16", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD17", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD18", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD19", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD20", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD21", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD22", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD23", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD24", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "4", "GD25", 850, "2013-02-13", true, false);

insert into AEROS values("AAAAA", "5", "GB09", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB10", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB11", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB12", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB13", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB14", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GB15", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC10", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC11", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC12", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC13", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC14", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC15", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC16", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC17", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC18", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC19", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC20", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC21", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "5", "GC22", 850, "2013-02-13", true, false);

insert into AEROS values("AAAAA", "6", "GA13", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA14", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA15", 850, "2013-02-13", true, true);
insert into AEROS values("AAAAA", "6", "GA16", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA17", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA18", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA19", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA20", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA21", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA22", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GA23", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB16", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB17", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB18", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB19", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB20", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB21", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB22", 850, "2013-02-13", true, false);
insert into AEROS values("AAAAA", "6", "GB23", 850, "2013-02-13", true, false);