app
    .factory( 'CabinRepository', [ 'CRUDService', '$http', function( CRUDService, $http ) {
        var model = "cabin";
        return({
            getAll : () => CRUDService.getAll( model ),
            add : ( data ) => CRUDService.add( model, data ),
            getById : ( id ) => CRUDService.getById( model, id ),
            update : ( data ) => CRUDService.update( model, data ),
            remove : ( id ) => CRUDService.remove( model, id ),
            validateData : ( data, scope ) => {
                var ban = true;
                scope.errors = "";
                if( data.name.length == 0 || data.name.length > 100 ) {
                    ban = false;
                    scope.errors += "Escriba un nombre válido. \n";
                }
                if( data.description.length == 0 || data.description.length > 500 ) {
                    ban = false;
                    scope.errors += "Escriba una descripción válida. \n";
                }
                if( data.price == 0 ) {
                    ban = false;
                    scope.errors += "Agregué un precio válido. \n";
                }
                if( data.cabin_type == 0 ) {
                    ban = false;
                    scope.errors += "Seleccione un tipo de cabaña. \n";
                }
                return ban;
            }
        });
    }])
    .controller( 'cabin-controller',
                [   '$scope',
                    '$rootScope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'CabinRepository',
                    'CabinTypeRepository',
                    'AuthRepository',
                    'ImageRepository',
                    function(
                        $scope,
                        $rootScope,
                        $location,
                        $routeParams,
                        $mdDialog,
                        CabinRepository,
                        CabinTypeRepository,
                        AuthRepository,
                        ImageRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Cabañas";

            var allCabins = function() {
                CabinRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.cabins = data.data;
                        $scope.cabins_table = $scope.cabins;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            var allCabinTypes = function() {
                CabinTypeRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.cabintypes = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            if( $routeParams.id ) {

                CabinRepository.getById( $routeParams.id ).success( function( d ) {
                    if( !d.error ) {
                        $scope.cabin = d.data;
                        $scope.cabin.price = parseFloat( $scope.cabin.price );
                    } else {
                        $scope.errors = d.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.update = function() {

                    $scope.cabin.cabin_type = $scope.cabin.cabin_type.id;

                    if( CabinRepository.validateData( $scope.cabin, $scope ) ) {
                        CabinRepository.update( $scope.cabin ).success( function( data ) {
                            if( !data.error ) {
                                $scope.cabin = data.data;
                                $location.path( '/cabins/detail/' + $scope.cabin.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {

                allCabins();
                allCabinTypes();

                $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
                    $scope.file = file;
                    $scope.cabin_image = fileObj.base64;
                };

                $scope.cabin = {
                    name : "",
                    description : "",
                    cabin_type : 0,
                    price : 0,
                    img_url : ""
                };

                $scope.loanding = false;

                $scope.add = function() {

                    $scope.loanding = true;

                    $scope.cabin.cabin_type = $scope.cabin.cabin_type.id;

                    if( CabinRepository.validateData( $scope.cabin, $scope ) ) {
                        CabinRepository.add( $scope.cabin ).success( function( data ) {
                            if( !data.error ) {
                                $scope.cabin = data.data;
                                $scope.cabin.price = parseFloat( $scope.cabin.price );
                                if( $scope.cabin_image ) {
                                    ImageRepository.imageToCabin( $scope.cabin.id, $scope.cabin_image ).success( function( d ) {
                                        $scope.loanding = false;
                                        $location.path( '/cabins' );
                                    }).error( function( error ) {
                                        $scope.loanding = false;
                                        $scope.errors = error;
                                    });
                                } else {
                                    $scope.loanding = false;
                                    $location.path( '/cabins' );
                                }
                            } else {
                                $scope.loanding = false;
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.loanding = false;
                            $scope.errors = error;
                        });
                    }
                };

                $scope.searchChange = function() {
                    $scope.cabins_table = $scope.cabins.filter( c => c.name.includes( $scope.search_text ) || c.description.includes( $scope.search_text ) );
                };

            }

            $scope.delete = function( e, id ){

                var confirm = $mdDialog.confirm()
                    .title('¿Desea borrar el registro?')
                    .textContent("Después de borrar esto no podrá ser recuperado.")
                    .ariaLabel('Lucky day')
                    .targetEvent(e)
                    .ok('Borrar Cabaña')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    CabinRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allCabins();
                            $location.path( "/cabins" );
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
