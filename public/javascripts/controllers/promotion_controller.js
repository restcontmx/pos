app
    .factory( 'PromotionRepository', [ 'CRUDService', function( CRUDService ) {
        var model = 'promotion';
        return({
            getAll : () => CRUDService.getAll( model ),
            add : ( data ) => CRUDService.add( model, data ),
            getById : ( id ) => CRUDService.getById( model, id ),
            update : ( data ) => CRUDService.update( model, data ),
            remove : ( id ) => CRUDService.remove( model, data ),
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
                if( data.date_start.length < 1 || data.date_start.length > 200 ) {
                    ban = false;
                    scope.errors += "Por favor escriba una descripción válida. \n";
                }
                if( data.date_end.length < 1 || data.date_end.length > 200 ) {
                    ban = false;
                    scope.errors += "Por favor escriba una descripción válida. \n";
                }
                if( data.value < 0 ) {
                    ban = false;
                    scope.errors += "Por favor aregue un valor válido.";
                }
                return ban;
            }
        });
    }])
    .controller( 'promotion-controller',
                [   '$scope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'PromotionRepository',
                    'AuthRepository',
                    function(   $scope,
                                $location,
                                $routeParams,
                                $mdDialog,
                                PromotionRepository,
                                AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Promociones";

            var allPromotions = function() {
                PromotionRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.promotions = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            if( $routeParams.id ) {

                PromotionRepository.getById( $routeParams.id ).success( function( data ) {
                    if( !data.error ) {
                        $scope.promotion = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.update = function() {
                    if( PromotionRepository.validateData( $scope.promotion, $scope ) ) {
                        PromotionRepository.update( $scope.promotion ).success( function( data ) {
                            if( !data.error ) {
                                $scope.promotion = data.data;
                                $location.path( '/promotions/detail/' + $scope.promotion.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {

                allPromotions();

                $scope.promotion = {
                    name : "",
                    description : "",
                    discount : 0,
                    date_start : "",
                    date_end : ""
                };

                $scope.add = function() {

                    $scope.promotion.date_start = document.getElementById( 'date_start' ).value;
                    $scope.promotion.date_end = document.getElementById( 'date_end' ).value;

                    if( PromotionRepository.validateData( $scope.promotion, $scope ) ) {
                        PromotionRepository.add( $scope.promotion ).success( function( data ) {
                            if( !data.error ) {
                                $location.path( "/promotions" );
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
                    .ok('Borrar Promoción')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    PromotionRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allPaymentStatus();
                            $location.path( "/promotions" );
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
