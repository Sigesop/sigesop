USE laventa_cfe;

DROP TABLE IF EXISTS libro_relatorio_historial;
DROP TABLE IF EXISTS libro_relatorio;
DROP TABLE IF EXISTS libro_licencia;
DROP TABLE IF EXISTS datos_lista_verificacion;
DROP TABLE IF EXISTS orden_trabajo_actividad;
DROP TABLE IF EXISTS datos_lectura_posterior;
DROP TABLE IF EXISTS datos_lectura_actual;
DROP TABLE IF EXISTS datos_actividad;

DROP TABLE IF EXISTS orden_trabajo_personal;
DROP TABLE IF EXISTS programacion_mtto;
DROP TABLE IF EXISTS orden_trabajo;

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