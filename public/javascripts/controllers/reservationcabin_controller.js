app
    .factory( 'ReservationCabinRepository', [ 'CRUDService', '$http', function( CRUDService, $http ) {
        var model = 'reservation/cabin';
        return({
            getAll : ( calendar ) => {
                var date_1 = calendar.date_start.getFullYear() + '-' + ( calendar.date_start.getMonth() + 1 ) + '-' + calendar.date_start.getDate(),
                    date_2 = calendar.date_end.getFullYear() + '-' + ( calendar.date_end.getMonth() + 1 ) + '-' + calendar.date_end.getDate();
                return $http.get( '/reservation/cabin?d1=' + date_1 + '&d2=' + date_2 );
            },
            add : ( data ) => CRUDService.add( model, data ),
            getById : ( id ) => CRUDService.getById( model, id ),
            update : ( data ) => CRUDService.update( model, id ),
            remove : ( id ) => CRUDService.remove( model, id ),
            pay : ( id ) => $http.put( 'reservation/cabin/paymentstatus/' + id ),
            getCabinsByDate : ( data ) => {
                var date_1 = data.date_start.getFullYear() + '-' + ( data.date_start.getMonth() + 1 ) + '-' + data.date_start.getDate(),
                    date_2 = data.date_end.getFullYear() + '-' + ( data.date_end.getMonth() + 1 ) + '-' + data.date_end.getDate();
                return $http.get( '/reservation/cabins?d1=' + date_1 + '&d2=' + date_2 );
            },
            validateReservationInfo : ( data, scope ) => {
                var ban = true;
                scope.errors = "";
                if( data.full_name.length == 0 || data.full_name.length > 200 ) {
                    ban = false;
                    scope.errors += "Por favor seleccione un nombre completo válido.";
                }
                if( data.email.length == 0 || data.email.length > 500 ) {
                    ban = false;
                    scope.errors += "Por favor seleccione un correo eléctronico válido.";
                }
                if( data.phone_number.length == 0 || data.phone_number.length > 100 ) {
                    ban = false;
                    scope.errors += "Por favor seleccione un teléfono válido.";
                }
                return ban;
            }
        });
    }])
    .controller( 'reservation-cabin-controller',
                [   '$scope',
                    '$mdDialog',
                    '$location',
                    '$routeParams',
                    'AuthRepository',
                    'DocumentService',
                    'uiCalendarConfig',
                    'CabinRepository',
                    'PromotionRepository',
                    'SettingsRepository',
                    'ReservationCabinRepository',
                    'PaymentRepository',
                    function(
                        $scope,
                        $mdDialog,
                        $location,
                        $routeParams,
                        AuthRepository,
                        DocumentService,
                        uiCalendarConfig,
                        CabinRepository,
                        PromotionRepository,
                        SettingsRepository,
                        ReservationCabinRepository,
                        PaymentRepository  ) {

        if( AuthRepository.viewVerification() ) {

            $scope.title = "Reservaciones";

            SettingsRepository.getTicketPrices().success( function( data ) {
                if( !data.error ) {
                    var ticketprices = data.data;
                    $scope.ticket_price_child = ticketprices[0].price;
                    $scope.ticket_price_adult = ticketprices[1].price;
                } else {
                    $scope.errors = data.message;
                    $scope.ticket_price_child = 0;
                    $scope.ticket_price_adult = 0;
                }
            }).error( function( error ) {
                $scope.errors = error;
                $scope.ticket_price_child = 0;
                $scope.ticket_price_adult = 0;
            });

            if( $routeParams.id ) {

                ReservationCabinRepository.getById( $routeParams.id ).success( function( data ) {
                    if( !data.error ){
                        $scope.reservation = data.data;
                        if( $scope.reservation.payment_info.collection_id != 0 ) {
                            PaymentRepository.getPayment( $scope.reservation.payment_info.collection_id ).success( function( d2 ) {
                                if( !d2.error ) {
                                    $scope.collection = d2.data.response.results[0].collection;
                                } else {
                                    $scope.errors = d2.message;
                                }
                            }).error( function( error ) {
                                $scope.errors = error;
                            });
                        }
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });

                $scope.print = function() {
                    DocumentService.printReservation( $scope.reservation, $scope.ticket_price_child, $scope.ticket_price_adult );
                };

            } else {

                var getCabins = function() {
                    ReservationCabinRepository.getCabinsByDate($scope.date_data).success( function( data ) {
                        if( !data.error ) {
                            $scope.cabins = data.data;
                            initReservation();
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };

                var getAllPromotions = function() {
                    PromotionRepository.getAll().success( function( data ) {
                        if( !data.error ) {
                            $scope.promotions = data.data;
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };

                var getAllReservations = function( calendar ) {
                    ReservationCabinRepository.getAll( calendar ).success( function( data ) {
                        if( !data.error ) {
                            $scope.tb_reservations = data.data;
                            $scope.reservations = data.data;
                            $scope.events.length = 0;
                            $scope.reservations.forEach( function( item, index ) {
                                item.details.forEach( function( product, index ) {
                                    var date1 = new Date(item.date_start), date2 = new Date(item.date_end);
                                    date1.setDate( date1.getDate() + 1 );
                                    date2.setDate( date2.getDate() + 2 );
                                    $scope.events.push({
                                        title : product.product.name,
                                        start: new Date( date1 ),
                                        end: new Date( date2 ),
                                        allDay: true
                                    });
                                });
                            });
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };
                var initReservation = function() {
                    $scope.reservation = {
                        total : 0,
                        max_guests : 0,
                        max_extra_guests : 0,
                        date_start : "",
                        date_end : "",
                        reservation_type : 1,
                        promotion : {},
                        details : [],
                        extra_guests_child : 0,
                        extra_guests_adult : 0,
                        reservationinfo : {
                            full_name : "",
                            email : "",
                            address1 : "",
                            address2 : "",
                            zip_code : 0,
                            state : "",
                            country : "México",
                            city : "",
                            phone_number : ""
                        }
                    };
                };
                /* alert on eventClick */
                $scope.alertOnEventClick = function( date, jsEvent, view){
                    $scope.alertMessage = (date.title + ' was clicked ');
                };
                /* alert on Drop */
                $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
                    $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
                };
                /* alert on Resize */
                $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
                    $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
                };
                /* add and removes an event source of choice */
                $scope.addRemoveEventSource = function(sources,source) {
                    var canAdd = 0;
                    angular.forEach(sources,function(value, key){
                        if(sources[key] === source){
                            sources.splice(key,1);
                            canAdd = 1;
                        }
                    });
                    if(canAdd === 0){
                        sources.push(source);
                    }
                };
                $scope.eventRender = function( event, element, view ) {
                    element.attr({'tooltip': event.title,
                        'tooltip-append-to-body': true});
                };
                /* config object */
                $scope.uiConfig = {
                    calendar:{
                        height: 500,
                        editable: false,
                        header:{
                            left: 'title',
                            center: '',
                            right: 'today prev,next'
                        },
                        eventClick: $scope.alertOnEventClick,
                        eventDrop: $scope.alertOnDrop,
                        eventResize: $scope.alertOnResize,
                        eventRender: $scope.eventRender,
                        viewRender: function(view, element) {
                            getAllReservations( { date_start : view.start._d, date_end : view.end._d } );
                        }
                    }
                };

                $scope.events = [];
                $scope.eventSources = [ $scope.events ];

                initReservation();

                $scope.date_data = {
                    date_start : "",
                    date_end : ""
                };

                $scope.addNewDetail = function() {
                    if( $scope.cabins ) {
                        $scope.reservation.details.push( { id : 0, product : {}, qty : 1 } );
                    } else {
                        alert( "Selecciona una fecha." );
                    }
                };

                var set_dates = function() {
                    var d_s_txt = document.getElementById( 'date_start' ).value,
                        d_e_txt = document.getElementById( 'date_end' ).value;
                    if( d_s_txt && d_e_txt ) {
                        $scope.date_data.date_start = new Date( d_s_txt );
                        $scope.date_data.date_end = new Date( d_e_txt );
                        return true;
                    }return false;
                };

                var calculate_total = function() {
                    var d_s = $scope.date_data.date_start,
                        d_e = $scope.date_data.date_end,
                        days = Math.round( ( d_e - d_s ) / ( 1000 * 60 * 60 * 24 ) ),
                        sum = $scope.reservation.details.map( d => parseInt( d.product.price ) ).reduce( ( a, b ) => ( a + b ), 0 );
                    $scope.reservation.max_guests = $scope.reservation.details.map( d => parseInt( d.product.cabin_type.max_guests ) ).reduce( ( a, b ) => ( a + b ), 0 );
                    $scope.reservation.max_extra_guests = $scope.reservation.details.map( d => parseInt( d.product.cabin_type.max_extra_guests ) ).reduce( ( a, b ) => ( a + b ), 0 );
                    $scope.reservation.total = days * ( ( sum ) + ( $scope.reservation.extra_guests_adult * $scope.ticket_price_adult ) + ( $scope.reservation.extra_guests_child * $scope.ticket_price_child ) );
                };

                $scope.onDateChange = function() {
                    if( set_dates() ) {
                        getCabins();
                        calculate_total();
                    }
                };

                $scope.onSelectChange = function() {
                    if( set_dates() ) {
                        calculate_total();
                    }
                };
                $scope.reserve = function() {
                    if( $scope.reservation.details.length > 0 ) {
                        if( ReservationCabinRepository.validateReservationInfo( $scope.reservation.reservationinfo, $scope ) ) {
                            $scope.reservation.date_start = document.getElementById('date_start').value;
                            $scope.reservation.date_end = document.getElementById('date_end').value;
                            ReservationCabinRepository.add( $scope.reservation ).success( function( data ) {
                                if( !data.error ) {
                                    $location.path( "/reservations/cabin" );
                                } else {
                                    $scope.errors = data.message;
                                }
                            }).error( function( error ) {
                                $scope.errors = error;
                            });
                        } else {
                            alert( "Por favor llene válidamente la información de reservación." );
                        }
                    } else {
                        alert( "Por favor seleccione alguna cabaña para reservar." );
                    }
                };

                $scope.delete = function( e, id ) {
                    var confirm = $mdDialog.confirm()
                        .title('¿Desea borrar el registro?')
                        .textContent("Después de borrar esto no podrá ser recuperado.")
                        .ariaLabel('Lucky day')
                        .targetEvent(e)
                        .ok('Borrar Reservación')
                        .cancel('Cancelar');

                    $mdDialog.show(confirm).then(function() {
                        ReservationCabinRepository.remove( id ).success( function( data ) {
                            if( !data.error ) {
                                $location.path( "/reservations/cabin" );
                            } else {
                                $scope.errors = data.message;
                            }
                        }).error( function(error) {
                            $scope.errors =  "Ha habido un error.";
                        });
                    }, null );
                };

            }

            $scope.pay = function( e, id ) {
                var confirm = $mdDialog.confirm()
                    .title('¿Desea cambiar el registro a pagado?')
                    .textContent("Después de cambiar el registro no se podrá regresar el estado.")
                    .ariaLabel('Lucky day')
                    .targetEvent(e)
                    .ok('Marcar Reservación como Pagada')
                    .cancel('Cancelar');

                $mdDialog.show(confirm).then(function() {
                    ReservationCabinRepository.pay( id ).success( function( data ) {
                        if( !data.error ) {
                            alert( data.data );
                            $location.path( "/reservations/cabin" );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function(error) {
                        $scope.errors =  "Ha habido un error.";
                    });
                }, null );
            };

            $scope.all_months = function() {
                $scope.tb_reservations = $scope.reservations;
            };

            $scope.payed_month = function() {
                $scope.tb_reservations = $scope.reservations.filter( r => r.payment_info.payment_status.name == "Pagada" );
            };

            $scope.pending_month = function() {
                $scope.tb_reservations = $scope.reservations.filter( r => r.payment_info.payment_status.name == "Pendiente" );
            };
        }

    }]);
