var app = angular.module( 'POS-SALES', [    'ngRoute' ] )
    .run( [ '$rootScope', '$location', function( $rootScope, $location ) {
        $rootScope.isLoggedIn = {
            show_app : true,
            show_auth : false
        };
        console.log("This is app");
        /***
        if( !AuthRepository.isSessionSet() ) {
            $rootScope.isLoggedIn.show_app = false;
            $rootScope.isLoggedIn.show_auth = true;
            $location.path( '/' );
        } else {
            $rootScope.isLoggedIn.show_app = true;
            $rootScope.isLoggedIn.show_auth = false;
        }**/
    }])
    .config([ '$routeProvider', '$locationProvider', function( $routeProvider, $locationProvider ) {
        $routeProvider
            .when( '/', {
                templateUrl : '../public/views/main.html'
            })
            .when( '/pos', {
                templateUrl : '../public/views/pos.html'
            })
            .when( '/overview', {
                templateUrl : '../public/views/overview.html'
            })
            .when( '/404', {
                templateUrl : '../public/404.html'
            })
            .otherwise({
                redirectTo : '/404'
            });
    }])
    .controller( 'navbar-controller', [ '$scope', '$rootScope', function( $scope, $rootScope ) {
        $scope.project_name = "POS-SALES";
        console.log("This is navbar controller");
    }])
    .controller( 'main-controller', [ '$scope', function( $scope ) {
        console.log("This is main controller");
        $scope.title = "Título";
        $scope.message = "Mensaje :O";
    }]);
