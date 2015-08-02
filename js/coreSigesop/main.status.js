$( document ).on( 'ready', main );

function main() {
	$( 'header' ).barraHerramientas();
	sigesop.query({ 
		class: 'status',
		query: 'obtenerCapacidadEfectiva',
		success: function ( data ) {
			if ( $.isEmptyObject( data.capacidad_instalada_central ) ) 
				sigesop.status.comprobarDatosPrincipalesNulos();

			sigesop.status.barraCapacidad({
				arr: data,
				elem: '#barras'
			});

			sigesop.status.graficaPastel({
				arr: data.unidades, 
				elem: '#resumenUnidades'
			});				
			
			var doc_tabla = sigesop.status.tablaCapacidades({
				data: data.unidades
			});
			document.getElementById( 'tablaDesglosada' ).innerHTML = '<br>' + doc_tabla.html;
			doc_tabla.javascript();
		}
	});
}