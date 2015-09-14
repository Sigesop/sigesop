<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
    <head>
        <title>Sistema de Videoconferencias</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta name="description" content="Slide Down Box Menu with jQuery and CSS3" />
        <meta name="keywords" content="jquery, css3, sliding, box, menu, cube, navigation, portfolio, thumbnails"/>
		<link rel="shortcut icon" href="../favicon.ico" type="image/x-icon"/>
        <link rel="stylesheet" href="../assets/css/estilo_menu.css" type="text/css" media="screen"/>
        <style>
			body{
				/*background:#333 url(../assets/img/background.png) repeat top left;*/
				background:#fff;
				font-family:Arial;
			}
			span.reference{
				position:fixed;
				left:10px;
				bottom:10px;
				font-size:12px;
			}
			span.reference a{
				color:#aaa;
				text-transform:uppercase;
				text-decoration:none;
				text-shadow:1px 1px 1px #000;
				margin-right:30px;
			}
			span.reference a:hover{
				color:#ddd;
			}
			ul.sdt_menu{
				margin-top:150px;
			}
			a h1.title{
				text-indent:-9000px;
				background:transparent url(../assets/img/_logo.png) no-repeat top left;
				width:500px;
				height:132px;
			}
		</style>
    </head>

    <body>
		<div class="content">
			<a href="http://www.google.com/">
				<h1 class="title"></h1>
			</a>
			
			<ul id="sdt_menu" class="sdt_menu">
				<li>
					<a href="#">
						<img src="../assets/img/programacion.jpg" alt=""/>
						<span class="sdt_active"></span>
						<span class="sdt_wrap">
							<span class="sdt_link">PROGRAMAR VC</span>
							<!-- <span class="sdt_descr">Indica fecha y horario</span> -->
						</span>
					</a>
				</li>
				<li>
					<a href="#">
						<img src="../assets/img/videoconferencia.jpg" alt=""/>
						<span class="sdt_active"></span>
						<span class="sdt_wrap">
							<span class="sdt_link">VIDEOCONFERENCIA ONLINE</span>
							<!-- <span class="sdt_descr">Realiza un VC ahora</span> -->
						</span>
					</a>
				</li>
				<li>
					<a href="#">
						<img src="../assets/img/consultas.jpg" alt=""/>
						<span class="sdt_active"></span>
						<span class="sdt_wrap">
							<span class="sdt_link">CONSULTA VC</span>
							<!-- <span class="sdt_descr">Ver VC programadas</span> -->
						</span>
					</a>
				</li>
				<li>
					<a href="#">
						<img src="../assets/img/reporte.jpg" alt=""/>
						<span class="sdt_active"></span>
						<span class="sdt_wrap">
							<span class="sdt_link">REPORTES ADMINISTRADOR</span>
							<!-- <span class="sdt_descr">Únicamente administrador del sistema</span> -->
						</span>
					</a>
					<div class="sdt_box">
						<a href="usuarios.php">Alta de Usuario</a>
						<a href="#">Baja de usuario</a>						
					</div>
				</li>
			</ul>
		</div>
        <div>
            <span class="reference">
                <a href="http://tympanus.net/codrops/2010/07/16/slide-down-box-menu/">back to the Codrops Tutorial</a>
				<a href="http://www.flickr.com/photos/arcticpuppy/sets/72157622090180990/">Images by tibchris</a>
            </span>
		</div>

        <!-- The JavaScript -->
        <script type="text/javascript" src="../assets/js/jquery.min.js"></script>
		<script type="text/javascript" src="../assets/js/jquery.easing.js"></script>
		<script src="../assets/js/jquery.backstretch.min.js"></script>
        <script type="text/javascript">
            $(function() {
            	// $.backstretch("../assets/img/background.png");
				/**
				* for each menu element, on mouseenter, 
				* we enlarge the image, and show both sdt_active span and 
				* sdt_wrap span. If the element has a sub menu (sdt_box),
				* then we slide it - if the element is the last one in the menu
				* we slide it to the left, otherwise to the right
				*/
                $('#sdt_menu > li').bind('mouseenter',function(){
					var $elem = $(this);
					$elem.find('img')
						 .stop(true)
						 .animate({
							'width':'250px',
							'height':'170px',
							'left':'0px'
						 },400,'easeOutBack')
						 .andSelf()
						 .find('.sdt_wrap')
					     .stop(true)
						 .animate({'top':'140px'},500,'easeOutBack')
						 .andSelf()
						 .find('.sdt_active')
					     .stop(true)
						 .animate({'height':'170px'},300,function(){
						var $sub_menu = $elem.find('.sdt_box');
						if($sub_menu.length){
							var left = '170px';
							if($elem.parent().children().length == $elem.index()+1)
								left = '-170px';
							$sub_menu.show().animate({'left':left},200);
						}	
					});
				}).bind('mouseleave',function(){
					var $elem = $(this);
					var $sub_menu = $elem.find('.sdt_box');
					if($sub_menu.length)
						$sub_menu.hide().css('left','0px');
					
					$elem.find('.sdt_active')
						 .stop(true)
						 .animate({'height':'0px'},300)
						 .andSelf().find('img')
						 .stop(true)
						 .animate({
							'width':'0px',
							'height':'0px',
							'left':'85px'},400)
						 .andSelf()
						 .find('.sdt_wrap')
						 .stop(true)
						 .animate({'top':'7px'},500);
				});
            });
        </script>
    </body>
</html>