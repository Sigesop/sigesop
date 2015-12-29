<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title></title>
	<link rel="stylesheet" href="">
</head>
<body ng-app="app">
	<div ng-controller="click">
		<button ng-click="clickMe()"> Click me!!!</button>
	</div>

	<script src="js/angular.min.js"></script>
	<script>
		sigesop = {
			raizServidor: 'ajax/sistema/',

			/**
			* The workhorse; converts an object to x-www-form-urlencoded serialization.
			* @param {Object} obj
			* @return {String}
			*/ 
			param: function ( obj ) {
				var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

				for(name in obj) {
					value = obj[name];

					if(value instanceof Array) {
						for(i=0; i<value.length; ++i) {
							subValue = value[i];
							fullSubName = name + '[' + i + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					}
					else if(value instanceof Object) {
						for(subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += param(innerObj) + '&';
						}
					}
					else if(value !== undefined && value !== null)
					query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
				}

				return query.length ? query.substr(0, query.length - 1) : query;
			},

			query: function ( $http, opt ) {
				/* type
				 * data
				 * class
				 * queryType
				 * query
				 * async
				 * beforeSend
				 * error
				 */

				opt.file = opt.file || 'ajax';
				opt.queryType = opt.queryType || 'getData';

				var

				type = opt.type || 'GET',

				data = opt.data || {},

				url = this.raizServidor + opt.file + '.php?class=' + opt.class +
				'&action=' + opt.query,

				sendData = function( data ) {
					if ( !jQuery.isEmptyObject( data ) ) {
						var
							std = null,
							msj = '';

						if ( typeof data == 'string' ) {
							std = data;
							msj = data;
						}
						else if ( typeof data == 'object' ) {
							std = data.status.transaccion;
							msj = data.status.msj;
						}

						switch( std ) {
							case 'OK':
								typeof opt.OK === 'function' ? opt.OK( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, OK is null' );
								break;
							case 'NA':
								typeof opt.NA === 'function' ? opt.NA( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, NA is null' );
								break;
							default:
								typeof opt.DEFAULT === 'function' ? opt.DEFAULT( msj, data.eventos ) : console.log( 'Function: insertarDatosSistema, DEFAULT is null' );
								break;
						}
					}

					else {
						console.log( 'Function query, [data] is null' );
						return -1;
					}
				},

				success = function ( data, status, headers, config, statusText ) {
					switch ( opt.queryType ) {
						case 'getData': opt.success( data ); break;
						case 'sendData': sendData( data ); break;
						case 'sendGetData': opt.success( data ); break;
						default: console.log( 'Function: query, [queryType] is undefined' ); break;
					}
				},

				error = function( data, status, headers, config, statusText ) {
					// sigesop.msgBlockUI( 'Comunicación al servidor abortada', 'error' );
					console.log( "Funcion: " + opt.query + "()\n" + "Estado: " + status + "\nError: " + statusText );
					typeof opt.error !== 'undefined' ? opt.error() : null;
				};

				/* Concatenamos los datos al query string si se trata de
				 * una solicitud tipo GET				
				 */
				if ( type === 'GET' ) {
					url += '&' + sigesop.param( opt.data );
					data = {};
				}					

				/* Ejecutamos solicitud				
				 */
				$http({
					method: type,
					data: data,
					url: url
				})
				.success ( success )
				.error ( error );
			}
		}

		var app = angular.module( 'app', [], function ( $httpProvider ) {
			// Use x-www-form-urlencoded Content-Type
			$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

			// Override $http service's default transformRequest
			$httpProvider.defaults.transformRequest = [function(data) {
				return angular.isObject(data) && String(data) !== '[object File]' ? sigesop.param(data) : data;
			}];
		});


		app.controller( 'click', function ( $scope, $http, $q ) {
			$scope.clickMe = function () {


				// var deferredTimer function (success) {
				// 	var deferred = $q.defer();

				// 	$timeout(function() {
				// 		if (success) {
				// 			deferred.resolve({ message: "This is great!" });
				// 		} else {
				// 			deferred.reject({ message: "Really bad" });
				// 		}
				// 	}, 1000);

				// 	return deferred.promise;
				// }



				var q1 = function () {
					var deferred = $q.defer();

					sigesop.query( $http, {
						data: { usuario: 'admin' },
						class: 'mantenimiento',
						query: 'obtenerOrdenTrabajo',
						success: function ( data ) {
							deferred.resolve( data );
							// console.log( data );
						}
					});

					return deferred.promise;
				}

				var q2 = function () {
					var deferred = $q.defer();

					sigesop.query( $http, {
						class: 'sistema',
						query: 'keepAlive',
						success: function ( data ) {
							deferred.resolve( data );
							// console.log( data );
						}
					});

					return deferred.promise;
				}

				$q.all({q1: q1(), q2: q2()}).then(function ( values ) {
					console.log( values );
				})
				

				// var first  = $http.get("ajax/sistema/ajax.php?class=mantenimiento&action=obtenerOrdenTrabajo"),
				//     second = $http.get("ajax/sistema/ajax.php?class=sistema&action=keepAlive"),
				//     third  = $http.get("ajax/sistema/ajax.php?class=sistema&action=keepAlive");

				// $q.all([first, second, third]).then(function(result) {
				// 	var tmp = [];
				// 	angular.forEach(result, function(response) {
				// 		tmp.push(response.data);
				// 	});
					
				// 	console.log( tmp );
				// 	return tmp;
				// }).then(function(tmpResult) {
				// 	$scope.combinedResult = tmpResult.join(", ");
				// });


			}
		});		
	</script>
</body>
</html>