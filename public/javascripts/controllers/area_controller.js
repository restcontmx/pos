app
    .factory( 'AreaRepository', [ 'CRUDService', function( CRUDService ) {
        var model = 'area';
        return({
            getAll : () => CRUDService.getAll( model ),
            add : ( data ) => CRUDService.add( model, data ),
            getById : ( id ) => CRUDService.getById( model, id ),
            update : ( data ) => CRUDService.update( model, data ),
            remove : ( id ) => CRUDService.remove( model, id ),
            validateData : ( data, scope ) => {
                var ban = false;
                scope.errors = "";
                if( data.name.length > 1 && data.name.length < 100 ) {
                    ban = true;
                } else {
                    ban = false;
                    scope.errors += "Escriba un nombre válido. \n";
                }
                if( data.description.length > 1 && data.description.length < 500 ) {
                    ban = true;
                } else {
                    ban = false;
                    scope.errors += "Escriba una descripción válida. \n";
                }
                if( data.price > 0 ) {
                    ban = true;
                } else {
                    ban = false;
                    scope.errors += "Agregué un precio válido. \n";
                }
                if( data.area_type > 0 ) {
                    ban = true;
                } else {
                    ban = false;
                    scope.errors += "Seleccione un tipo de cabaña. \n";
                }
                return ban;
            }
        });
    }])
    .controller( 'area-controller',
                [   '$scope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'AreaRepository',
                    'AreaTypeRepository',
                    'PoolRepository',
                    'AuthRepository',
                    function(
                        $scope,
                        $location,
                        $routeParams,
                        $mdDialog,
                        AreaRepository,
                        AreaTypeRepository,
                        PoolRepository,
                        AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Áreas";

            var allAreas = function() {
                AreaRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.areas = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            var allAreaTypes = function() {
                AreaTypeRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.areatypes = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            var allPools = function() {
                PoolRepository.getAll().success( function( data ) {
                    if( !data.error ) {
                        $scope.pools = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            if( $routeParams.id ) {

                PoolRepository.getAll().success( function( data ) {
                    if( !data.error ) {
                        $scope.pools = data.data;
                        AreaTypeRepository.getAll().success( function( d1 ) {

                            if( !d1.error ) {

                                $scope.areatypes = d1.data.data;

                                AreaRepository.getById( $routeParams.id ).success( function( d2 ) {
                                    if( !d2.error ) {
                                        $scope.area = d2.data;
                                        $scope.area.price = parseFloat( $scope.area.price );
                                        $scope.area.area_type = $scope.areatypes.find( at => at.id === $scope.area.area_type );
                                        for( var i = 0; i < $scope.area.pools.length; i++ ) {
                                            $scope.area.pools[i] = $scope.pools.find( p => p.id === $scope.area.pools[i] );
                                        }
                                    } else {
                                        $scope.errors = d2.message;
                                    }
                                }).error( function( error ) {
                                    $scope.errors = error;
                                });

                            } else {
                                $scope.errors = data.message;
                            }

                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.update = function() {

                    $scope.area.area_type = $scope.area.area_type.id;
                    $scope.area.pools = $scope.area.pools.map( p => p.id );

                    if( AreaRepository.validateData( $scope.area, $scope ) ) {
                        AreaRepository.update( $scope.area ).success( function( data ) {
                            if( !data.error ) {
                                $scope.area = data.data;
                                $scope.area.price = parseFloat( $scope.area.price );
                                $location.path( '/areas/detail/' + $scope.area.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {

                allAreas();
                allAreaTypes();
                allPools();

                $scope.area = {
                    name : "",
                    description : "",
                    area_type : 0,
                    price : 0
                };

                $scope.add = function() {

                    $scope.area.area_type = $scope.area.area_type.id;
                    $scope.area.pools = $scope.area.pools.map( p => p.id );

                    if( AreaRepository.validateData( $scope.area, $scope ) ) {

                        AreaRepository.add( $scope.area ).success( function( data ) {
                            if( !data.error ){
                                $location.path( "/areas" );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });

                    }

                };

                $scope.searchChange = function() {
                    console.log( $scope.search_text );
                };

            }

            $scope.delete = function( e, id ){

                var confirm = $mdDialog.confirm()
                    .title('¿Desea borrar el registro?')
                    .textContent("Después de borrar esto no podrá ser recuperado.")
                    .ariaLabel('Lucky day')
                    .targetEvent(e)
                    .ok('Borrar Área')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    AreaRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allAreas();
                            $location.path( "/areas" );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function(error) {
                        $scope.errors =  "Ha habido un error.";
                    });
                }, null );
            };
        }
    }]);
