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

	trabajador_solicito 	char(5) NOT NULL,
	foreign key( trabajador_solicito ) references personal( RDE_trabajador )
	on delete restrict
	on update cascade,

	trabajador_autorizo 	char(5),
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