app
    .factory( 'AreaTypeRepository', [ 'CRUDService', function( CRUDService ) {
        var model = 'areatype';
        return({
            getAll : () => CRUDService.getAll( model ),
            add : ( data ) => CRUDService.add( model, data ),
            getById : ( id ) => CRUDService.getById( model, id ),
            update : ( data ) => CRUDService.update( model, data ),
            remove : ( id ) => CRUDService.remove( model, id ),
            validateData : ( data, scope ) => {
                var ban = false;
                scope.errors = "";
                if( data.name.length < 1 && data.name.length > 100 ) {
                    ban = false;
                    scope.errors += "Por favor escriba un nombre válido. \n";
                }
                if( data.description.length < 1 && data.description.length > 200 ) {
                    ban = false;
                    scope.errors += "Por favor escriba una descripción válida. \n";
                }
                if( data.max_guests == 0 ) {
                    ban = false;
                    scope.errors += "Por favor agregué un Máximo válido. \n";
                }
                return ban;
            }
        });
    }])
    .controller( 'areatype-controller',
                [   '$scope',
                    '$rootScope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'AreaTypeRepository',
                    'AuthRepository',
                    function(
                        $scope,
                        $rootScope,
                        $location,
                        $routeParams,
                        $mdDialog,
                        AreaTypeRepository,
                        AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Tipo de área";

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

            if( $routeParams.id ) {

                AreaTypeRepository.getById( $routeParams.id ).success( function( data ) {
                    if( !data.error ) {
                        $scope.areatype = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.update = function() {
                    if( AreaTypeRepository.validateData( $scope.areatype, $scope ) ) {
                        AreaTypeRepository.update( $scope.areatype ).success( function( data ) {
                            if( !data.error ) {
                                $scope.areatype = data.data;
                                $location.path( '/areatypes/detail/' + $scope.areatype.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {

                allAreaTypes();

                $scope.areatype = {
                    name : "",
                    description : "",
                    max_guests : 0
                };

                $scope.add = function() {

                    if( AreaTypeRepository.validateData( $scope.areatype, $scope ) ) {
                        AreaTypeRepository.add( $scope.areatype ).success( function( data ) {
                            if( !data.error ) {
                                $location.path( "/areatypes" );
                            } else {
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
                    .ok('Borrar Tipo de Área')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    AreaTypeRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allAreaTypes();
                            $location.path( "/areatypes" );
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
