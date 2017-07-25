app
    .factory( 'PaymentStatusRepository', [ 'CRUDService', '$http', function( CRUDService, $http ) {
        var model = 'paymentstatus';
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
                if( data.value == 0 ) {
                    ban = false;
                    scope.errors += "Por favor aregue un valor válido.";
                }
                return ban;
            }
        });
    }])
    .controller( 'paymentstatus-controller',
                [   '$scope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'PaymentStatusRepository',
                    'AuthRepository',
                    function(   $scope,
                                $location,
                                $routeParams,
                                $mdDialog,
                                PaymentStatusRepository,
                                AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Estatus de pago";

            var allPaymentStatus = function() {
                PaymentStatusRepository.getAll().success( function( data ) {
                    if (!data.error) {
                        $scope.paymentstatuses = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };

            if( $routeParams.id ) {

                PaymentStatusRepository.getById( $routeParams.id ).success( function( data ) {
                    if( !data.error ) {
                        $scope.paymentstatus = data.data;
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.update = function() {

                    if( PaymentStatusRepository.validateData( $scope.paymentstatus, $scope ) ) {
                        PaymentStatusRepository.update( $scope.paymentstatus ).success( function( data ) {
                            if( !data.error ) {
                                $scope.paymentstatus = data.data;
                                $location.path( '/cabintypes/detail/' + $scope.paymentstatus.id );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function( error ) {
                            $scope.errors = error;
                        });
                    }
                };

            } else {

                allPaymentStatus();

                $scope.paymentstatus = {
                    name : "",
                    description : "",
                    value : 0
                };

                $scope.add = function() {

                    if( PaymentStatusRepository.validateData( $scope.paymentstatus, $scope ) ) {
                        PaymentStatusRepository.add( $scope.paymentstatus ).success( function( data ) {
                            if( !data.error ) {
                                $location.path( "/paymentstatus" );
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
                    .ok('Borrar Estatus de Pago')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    PaymentStatusRepository.remove( id ).success( function( data ) {
                        if( !data.error ) {
                            allPaymentStatus();
                            $location.path( "/paymentstatus" );
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
