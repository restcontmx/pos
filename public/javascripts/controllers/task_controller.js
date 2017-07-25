app
    .factory( 'TaskRepository', [ 'CRUDService', function( CRUDService ) {
        var model = "task";
        return({
            getAll : () => CRUDService.getAll( model ),
            add : ( data ) => CRUDService.add( model, data ),
            update : ( data ) => CRUDService.update( model, data ),
            remove : ( id ) => CRUDService.remove( model, id ),
            getAssigned : () => CRUDService.getAll( 'task/assigned' ),
            validateData : ( data, scope ) => {
                var ban = true;
                scope.errors = "";
                if( data.name.length < 1 && data.name.length > 100 ) {
                    ban = false;
                    scope.errors += "Escriba un nombre válido. \n";
                }
                if( data.description.length < 1 && data.description.length > 500 ) {
                    ban = false;
                    scope.errors += "Escriba una descripción válida. \n";
                }
                if( data.date_end.length < 6 ) {
                    ban = false;
                    scope.errors += "Seleccione una fecha válida."
                }
                if( data.user_assigned.user.id == 0 ) {
                    ban = false;
                    scope.errors += "Seleccione un responsable válido. \n";
                }
                if( data.value == 0 ) {
                    ban = false;
                    scope.errors += "Seleccione un rango válido. \n";
                }
                return ban;
            }
        });
    }])
    .controller( 'task-controller',
                [   '$scope',
                    '$location',
                    '$routeParams',
                    '$mdDialog',
                    'TaskRepository',
                    'AuthRepository',
                    function(
                        $scope,
                        $location,
                        $routeParams,
                        $mdDialog,
                        TaskRepository,
                        AuthRepository ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Tareas";

            var allTasks = function() {
                    TaskRepository.getAll().success( function( data ) {
                        if( !data.error ) {
                            $scope.tasks = data.data;
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                allAssignedTasks = function() {
                    TaskRepository.getAssigned().success( function( data ) {
                        if( !data.error ) {
                            $scope.assigned_tasks = data.data;
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                getAllUsers = function() {
                    AuthRepository.getUserCat().success( function( data ) {
                        if( !data.error ) {
                            $scope.users = data.data;
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                setAllValues = function(){
                    $scope.values = [
                        { "name" : "importante", "id" : 3 },
                        { "name" : "normal", "id" : 2 },
                        { "name" : "no importante", "id" : 1 }
                    ];
                },
                initTask = function() {
                    $scope.task = {
                        name : "",
                        description : "",
                        value : $scope.values[2],
                        date_end : "",
                        user_assigned : { user : { id : 0, username : "" } }
                    };
                };

            allTasks();
            allAssignedTasks();
            setAllValues();
            getAllUsers();
            initTask();

            $scope.add = function( ) {

                $scope.task.date_end = document.getElementById( 'date_end' ).value;
                $scope.task.value = $scope.task.value.id;

                if( TaskRepository.validateData( $scope.task, $scope ) ) {

                    $scope.task.user_assigned = $scope.task.user_assigned.user.id;

                    TaskRepository.add( $scope.task ).success( function( data ) {
                        if( !data.error ) {
                            initTask();
                            allTasks();
                            allAssignedTasks();
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                }
            };
            $scope.delete = function( id ) {
                TaskRepository.remove( id ).success( function( data ) {
                    if( !data.error ) {
                        allTasks();
                        allAssignedTasks();
                    } else {
                        $scope.error = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            }
        }
    }]);
