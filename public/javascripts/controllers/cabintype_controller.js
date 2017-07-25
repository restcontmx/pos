app
    .factory( 'CabinTypeRepository', [ 'CRUDService', function( CRUDService ) {
        var model = "cabintype";
        return({
            getAll : function(  ) {
                return CRUDService.getAll( model );
            },
            add : function( data ) {
                return CRUDService.add( model, data );
            },
            getById : function( id ) {
                return CRUDService.getById( model, id );
            },
            update : function( data ) {
                return CRUDService.update( model, data );
            },
            remove : function( id ) {
                return CRUDService.remove( model, id );
            },
            validateData : function( data, scope ) {
                var ban = true;
                scope.errors = "";
                if( data.name.length < 1 || data.name.length > 100 ) {
                    ban = false;
                    scope.errors += "Por favor escriba un nombre válido. \n";
                }
                if( data.description.length < 1 || data.description.length > 200 ) {
                    ban = false;
                    scope.errors += "Por favor escriba una descripción válida. \n";
                }
                if( data.rooms == 0 ) {
                    ban = false;
                    scope.errors += "Por favor agregué un número de cuartos válido. \n";
                }
                if( data.max_guests == 0 ) {
                    ban = false;
                    scope.errors += "Por favor agregué un Máximo válido. \n";
                }
                if( data.max_extra_guests == 0 ) {
                    ban = false;
                    scope.errors += "Por favor agregué un Extra válido. \n";
                }
                return ban;
            }
        });
    }])
    .controller( 'cabintype-controller',
                [   '$scope',
                    '$rootScope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'CabinTypeRepository',
                    'AuthRepository',
                    function(
                        $scope,
                        $rootScope,
                        $location,
                        $routeParams,
                        $mdDialog,
                        CabinTypeRepository,
                        AuthRepository ) {
        // If user is logged in
        if( AuthRepository.viewVerification() ) {
            // title of the view
            $scope.title = "Tipo de cabaña";
            /**
            * Gets all the elements of the model on the repository
            ***/
            var allCabinTypes = function() {
                CabinTypeRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.cabintypes = data.data;
                        $scope.cabintypes_table = $scope.cabintypes;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            // If there is an id on the url
            if( $routeParams.id ) {
                /**
                * gets element by id
                **/
                CabinTypeRepository.getById( $routeParams.id ).success( function( data ) {
                    if( !data.error ) {
                        $scope.cabintype = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                /**
                * updates the model on the repository
                * then goes to the detail of itself
                **/
                $scope.update = function() {
                    if( CabinTypeRepository.validateData( $scope.cabintype, $scope ) ) {
                        CabinTypeRepository.update( $scope.cabintype ).success( function( data ) {
                            if( !data.error ) {
                                $scope.cabintype = data.data;
                                $location.path( '/cabintypes/detail/' + $scope.cabintype.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {
                // Get all data for listing
                allCabinTypes();

                // init model
                $scope.cabintype = {
                    name : "",
                    description : "",
                    rooms : 0,
                    max_guests : 0,
                    max_extra_guests : 0
                };

                /**
                * Add element to repository
                * then returns to listing
                **/
                $scope.add = function() {

                    if( CabinTypeRepository.validateData( $scope.cabintype, $scope ) ) {
                        CabinTypeRepository.add( $scope.cabintype ).success( function( data ) {
                            if( !data.error ) {
                                $location.path( "/cabintypes" );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }

                };

                $scope.searchChange = function() {
                    $scope.cabintypes_table = $scope.cabintypes.filter( c => c.name.includes( $scope.search_text ) || c.description.includes( $scope.search_text ) );
                };

            }

            /**
            * Delete modal
            * shows modal to confirm deleting row
            **/
            $scope.delete = function( e, id ){
                var confirm = $mdDialog.confirm()
                    .title('¿Desea borrar el registro?')
                    .textContent("Después de borrar esto no podrá ser recuperado.")
                    .ariaLabel('Lucky day')
                    .targetEvent(e)
                    .ok('Borrar Tipo de Cabaña')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    CabinTypeRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allCabinTypes();
                            $location.path( "/cabintypes" );
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
