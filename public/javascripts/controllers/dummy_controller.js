app
    .factory( 'DummyRepository', [ 'AuthRepository', '$http', function( AuthRepository, $http ) {
        return ({
            FESimpleConn : function(  ) {
                var jsonData = JSON.stringify({
                    testname : 'FESimpleConn',
                    message : 'Hello world!'
                });
                return $http({
                    method : 'POST',
                    url : '/dummy/fesimpleconn/',
                    data : jsonData
                });
            },
            BESimpleConn : function(  ) {
                var jsonData = JSON.stringify({
                    testname : 'BESimpleConn',
                    message : 'Hello world from the FE'
                });
                return $http({
                    method : 'POST',
                    url : 'dummy/besimpleconn/',
                    data : jsonData
                });
            },
            BasicAuthTest : function(  ) {
                var jsonData = JSON.stringify({
                    testname : 'Basic auth test',
                    message : 'Hello wordl from the FE with user and pass'
                });
                return $http({
                    method : 'POST',
                    url : 'dummy/basicauthtest',
                    data : jsonData
                });
            },
            EncryptTest : function(  ) {
                var jsonData = JSON.stringify({
                    testname : 'Encryption Test',
                    message : 'Hello World from the FE encrypted'
                });
                return $http({
                    method : 'POST',
                    url : 'dummy/encrypttest',
                    data : jsonData
                });
            },
            TestCookies : function(  ) {
                var jsonData = JSON.stringify({
                    testname : 'cookie test',
                    message : 'Hello world from cookie test.'
                });
                return $http({
                    method : 'POST',
                    url : 'dummy/cookietest',
                    data : jsonData
                });
            }
        });
    }])
    .controller( 'dummy-controller',
                [   '$scope',
                    '$rootScope',
                    '$location',
                    'DummyRepository',
                    'AuthRepository',
                    function(
                        $scope,
                        $rootScope,
                        $location,
                        DummyRepository,
                        AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.fe = {
                message : "",
                message_cookie : "",
                username : "",
                token : ""
            };

            $scope.be = {
                message : "",
                message_auth : "",
                message_encrypt : ""
            };

            DummyRepository.FESimpleConn().success( function( data ) {
                console.log( data );
                $scope.fe.message = data;
            }).error( function( error ) {
                console.log( error );
                $scope.fe.message = error;
            });

            DummyRepository.BESimpleConn().success( function( data ) {
                console.log( data );
                $scope.be.message = data;
            }).error( function( error ) {
                console.log( error );
                $scope.be.message = error;
            });

            DummyRepository.BasicAuthTest().success( function( data ) {
                console.log( data );
                $scope.be.message_auth = data;
            }).error( function( error ) {
                console.log( error );
                $scope.be.message_auth = error;
            });

            DummyRepository.EncryptTest().success( function( data ) {
                console.log( data );
                $scope.be.message_encrypt = data;
            }).error( function( error ) {
                console.log( error );
                $scope.be.message_encrypt = error;
            });

            DummyRepository.TestCookies().success( function( data ) {
                var user_data = AuthRepository.getSession();
                $scope.fe.message_cookie = data;
                $scope.fe.username = user_data.username;
                $scope.fe.token = user_data.auth_data;
            }).error( function( error ) {
                console.log( error );
                $scope.fe.message_cookie = error;
            });

        }

    }]);
