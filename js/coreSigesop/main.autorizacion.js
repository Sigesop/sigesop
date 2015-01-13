$( document ).on( 'ready' , main );

function main ()
{
	doc = $.sigesop.autorizacion.documentoAutorizacion( null, '_' );
	document.getElementById( 'main' ).innerHTML = doc.html;
	doc.javascript();

	$.sigesop.solicitarDatosSistema({
		clase: 'ajaxSistema',
		solicitud: 'insertaBarraHerramientasRolUsuario',
		respuesta: function ( data ) 
		{
			if (data != null) 
			{
				$.sigesop.insertaBarraHerramientasRolUsuario(data, 'header');
			}
		}
	});
}