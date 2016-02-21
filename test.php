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

	<script src="../js/angular/angular.min.js"></script>
	<script>
		sigesop = {
			raizServidor: '../ajax/sistema/',

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
							query += this.param(innerObj) + '&';
						}
					}
					else if(value instanceof Object) {
						for(subName in value) {
							subValue = value[subName];
							fullSubName = name + '[' + subName + ']';
							innerObj = {};
							innerObj[fullSubName] = subValue;
							query += this.param(innerObj) + '&';
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
				// url = '../ajax/sistema/' + opt.file + '.php?class=' + opt.class +
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
		})
		.service( '$sigesop', function ( $http ) {
			return({
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
		                        query += this.param(innerObj) + '&';
		                    }
		                }
		                else if(value instanceof Object) {
		                    for(subName in value) {
		                        subValue = value[subName];
		                        fullSubName = name + '[' + subName + ']';
		                        innerObj = {};
		                        innerObj[fullSubName] = subValue;
		                        query += this.param(innerObj) + '&';
		                    }
		                }
		                else if(value !== undefined && value !== null)
		                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		            }

		            return query.length ? query.substr(0, query.length - 1) : query;
		        },

		        query: function ( opt ) {
		            /* type
		             * data
		             * class
		             * queryType
		             * query
		             * async
		             * beforeSend
		             * error
		             */

		            // alert( 'networkState: ' + this.networkState );
		            // alert( 'raizServidor: ' + this.raizServidor );

		            var error = function( response ) {
		                console.log( "Funcion: " + opt.query + "()\n" + "\nError: " + response );
		                if( typeof opt.error !== 'undefined' ) opt.error( response.message, response.stack );
		            };

		            opt.file = opt.file || 'ajax';
		            opt.queryType = opt.queryType || 'getData';

		            var

		            type = opt.type || 'GET',

		            data = opt.data || {},

		            url = 'ajax/sistema/ajax.php?class=' + opt.class +
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

		            success = function ( response ) {
		                switch ( opt.queryType ) {
		                    case 'getData': opt.success( response.data ); break;
		                    case 'sendData': sendData( response.data ); break;
		                    case 'sendGetData': opt.success( response.data ); break;
		                    default: console.log( 'Function: query, [queryType] is undefined' ); break;
		                }
		            };

		            /* Concatenamos los datos al query string si se trata de
		             * una solicitud tipo GET
		             */
		            if ( type === 'GET' ) {
		                url += '&' + this.param( opt.data );
		                data = {};
		            }

		            // alert( url );

		            /* Ejecutamos solicitud
		             */
		            $http({
		                // timeout: 1000,
		                method: type,
		                data: data,
		                url: url
		            })
		            .then( success, error );
		        }
			});
		});


		app.controller( 'click', function ( $scope, $http, $q, $sigesop ) {
			$scope.clickMe = function () {
				var q1 = function () {
					var deferred = $q.defer();

					$sigesop.query({
						data: { 
							usuario: 'admin',
							ordenes: [
								// {
								// 	id_prog_mtto: 1,
								// 	id_actividad_verificar: [ 172, 173, 174, 175, 176 ]
								// },
								{
									id_prog_mtto: [2,3],
									id_actividad_verificar: [ 
										// 1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
										// 16,17,18,19,20,21,22,23,24,25,26,27,
										// 28,29,30,31,32,33,34,35,36,37,38,39,
										// 40,41,42,43,44,45,46,47,48,49,50,51,
										// 52,53,54,55,56,57,58,59,60,61,62,63,
										// 64,65,66,67,68,69,70,71,72,73,74,75,
										// 76,77,78,79,80,81,82,83,84,85,86,87,
										// 88,89,90,91,92,93, 94,95,96,97,98,99,
										// 100,101,102,103,104,105,106,107,108,
										// 109,110,111,112,113,114,115,116,117,
										// 118,119,120,121,122,123,124,125,126,
										// 127,128,129,130,131,132,133,134,135,
										// 136,137,138,139,140,141,142,143,144,
										// 145,146,147,148,149,150,151,152,153,
										// 154,155,156,157,158
									]
								}
							]
						},
						class: 'mantenimiento',
						query: 'obtenerOrdenTrabajoLista',
						type: 'POST',
						success: function ( data ) {
							deferred.resolve( data );
							// console.log( data );
						}
					});

					return deferred.promise;
				}

				var q2 = function () {
					var deferred = $q.defer();

					$sigesop.query({
						class: 'sistema',
						query: 'keepAlive',
						success: function ( data ) {
							deferred.resolve( data );
							// console.log( data );
						}
					});

					return deferred.promise;
				}

				$q.all({q1: q1()}).then(function ( values ) {
					console.log( values );
				})
			}
		});		
	</script>
</body>
</html>