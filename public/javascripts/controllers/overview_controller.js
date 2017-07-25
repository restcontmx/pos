app
    .controller( 'overview-controller', [   '$scope',
                                            'TaskRepository',
                                            'AuthRepository',
                                            function(   $scope,
                                                        TaskRepository,
                                                        AuthRepository ) {
        if( AuthRepository.viewVerification() ) {

            $scope.title = "Perfil";

            var getAllTasks = function() {
                    TaskRepository.getAll().success( function( data ) {
                        if( !data.error ) {
                            $scope.tasks = data.data;
                            $scope.todo = $scope.tasks.filter( t => t.state == 1 );
                            $scope.doing = $scope.tasks.filter( t => t.state == 2 );
                            $scope.done = $scope.tasks.filter( t => t.state == 3 );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                task_todo = function( t ) {
                    t.state = 1;
                    TaskRepository.update( t ).success( function( data ) {
                        if( !data.error ) {
                            getAllTasks();
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                task_doing = function( t ) {
                    t.state = 2;
                    TaskRepository.update( t ).success( function( data ) {
                        if( !data.error ) {
                            getAllTasks();
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                task_done = function( t ) {
                    t.state = 3;
                    TaskRepository.update( t ).success( function( data ) {
                        if( !data.error ) {
                            getAllTasks();
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };

            $scope.task_todo = task_todo;
            $scope.task_doing = task_doing;
            $scope.task_done = task_done;

            getAllTasks();

        }
    }]);
