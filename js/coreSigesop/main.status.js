$( document ).on( 'ready', main );

function main()
{
	$( 'header' ).barraHerramientas();

	sigesop.query({ 
		class: 'status',
		query: 'obtenerCapacidadEfectiva',
		success: function ( data ) 
		{
			if ( data.capacidad_instalada_central !== null ) 
			{
				globalCapEfect = data;					
				// ====================================INFORMACION CENTRAL===================================			
				if (data['capacidad_instalada_central'] != 0)
				{					
					var instalado = 100;
						capacidadEfectiva = data['capacidad_efectiva_central'],
						capacidadInstalada = data['capacidad_instalada_central'],
						porcentDisponible = (capacidadEfectiva*100)/capacidadInstalada,
						porcentFalla = (data['MWFalla']*100)/capacidadInstalada,
						porcentMantto = (data['MWMantto']*100)/capacidadInstalada,
						porcentCA = (data['MWca']*100)/capacidadInstalada;
				} else 
				{
					var instalado = 0,
						capacidadEfectiva = 0,
						capacidadInstalada = 0,
						porcentDisponible = 0,
						porcentMantto = 0,
						porcentFalla = 0,
						porcentCA = 0;
				}

				// insertando mensaje de la capacidad instalada y su valor en megawatts
				var msj = "Capacidad instalada central: " + parseFloat( capacidadInstalada ).toFixed(2) + " MW"
				$("#infoCapInstalada").html(msj);
				// insertando mensaje de la capacidad efectiva y su valor en megawatts
				msj = "Capacidad efectiva central: " + parseFloat( capacidadEfectiva ).toFixed(2) + " MW"
				$("#infoCapEfec").html(msj);							
				// agregando valores a la barra de progreso de capacidad instalada en la central
				var attrInstalado = 'width: ' + instalado + '%';
				$('#barraCentralInstal div').attr('style', attrInstalado);
				$('#barraCentralInstal span').text(instalado.toFixed(2) + '%');

				// AGREGANDO VALORES A LA BARRA DE PROGRESO DE CAPACIDAD EFECTIVA EN LA CENTRAL
				// agregando valores a la seccion disponible de la barra de progreso
				var attrDisponible = 'width: ' + porcentDisponible + '%';
				$('#barDisponible').attr('style', attrDisponible);
				$('#barDisponible span').text(porcentDisponible.toFixed(2) + '%');
				// agregando valores a la seccion mantenimiento de la barra de progreso
				var attrMantto = 'width: ' + porcentMantto + '%';
				$('#barMantto').attr('style', attrMantto);
				$('#barMantto span').text(porcentMantto.toFixed(2) + '%');
				// agregando valores a la seccion causa ajena de la barra de progreso
				var attrCausaAjena = 'width: ' + porcentCA + '%';
				$('#barCausaAjena').attr('style', attrCausaAjena);
				$('#barCausaAjena span').text(porcentCA.toFixed(2) + '%');
				// agregando valores a la seccion falla de la barra de progreso
				var attrFalla = 'width: ' + porcentFalla + '%';
				$('#barFalla').attr('style', attrFalla);
				$('#barFalla span').text(porcentFalla.toFixed(2) + '%');

				sigesop.status.graficaPastel( data.unidades, '#resumenUnidades' );
				
				doc_tabla = sigesop.status.tablaCapacidades( data.unidades );
				document.getElementById( 'tablaDesglosada' ).innerHTML = '<br>' + doc_tabla.html;
				doc_tabla.javascript();
			} 

			else sigesop.status.comprobarDatosPrincipalesNulos();
		}
	});
}