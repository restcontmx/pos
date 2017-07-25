app
    .controller( 'reservation-controller', [    '$scope',
                                                'AuthRepository',
                                                function(   $scope,
                                                            AuthRepository  ) {

        if( AuthRepository.viewVerification() ) {
            $scope.title = "Reservación";
            
        }

    }]);
