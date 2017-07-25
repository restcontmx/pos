app
    .factory( 'ReportsRepository', [ '$http', function( $http ) {
        return({
            getReportsByMonth : ( month, year ) => {
                var today = new Date(),
                    date = year + '-' + ( month + 1 ) + '-' + today.getDate();
                return $http.get( '/reports/bymonth/?date=' + date );
            },
            getPendingReportsByMonth : ( month, year ) => {
                var today = new Date(),
                    date = year + '-' + ( month + 1 ) + '-' + today.getDate();
                return $http.get( '/reports/pendingbymonth/?date=' + date );
            },
            getPayedReportsByMonth : ( month, year ) => {
                var today = new Date(),
                    date = year + '-' + ( month + 1 ) + '-' + today.getDate();
                return $http.get( '/reports/payedbymonth/?date=' + date );
            },
            getPayedReportsByDates : ( date_start, date_end ) => {
                var date_1 = date_start.getFullYear() + '-' + ( date_start.getMonth() + 1 ) + '-' + date_start.getDate(),
                    date_2 = date_end.getFullYear() + '-' + ( date_end.getMonth() + 1 ) + '-' + date_end.getDate();
                return $http.get( '/reports/payedbydates/?d1=' + date_1 + '&d2=' + date_2 );
            },
            getPendingReportsByDates : ( date_start, date_end ) => {
                var date_1 = date_start.getFullYear() + '-' + ( date_start.getMonth() + 1 ) + '-' + date_start.getDate(),
                    date_2 = date_end.getFullYear() + '-' + ( date_end.getMonth() + 1 ) + '-' + date_end.getDate();
                return $http.get( '/reports/pendingbydates/?d1=' + date_1 + '&d2=' + date_2 );
            },
            getReportsByDates : ( date_start, date_end ) => {
                var date_1 = date_start.getFullYear() + '-' + ( date_start.getMonth() + 1 ) + '-' + date_start.getDate(),
                    date_2 = date_end.getFullYear() + '-' + ( date_end.getMonth() + 1 ) + '-' + date_end.getDate();
                return $http.get( '/reports/bydates/?d1=' + date_1 + '&d2=' + date_2 );
            },
            getCabinReportsByMonth : ( month, year ) => {
                var today = new Date(),
                    date = year + '-' + ( month + 1 ) + '-' + today.getDate();
                return $http.get( '/reports/cabinsbymonth/?date=' + date );
            },
            getReportsByYear : ( year ) => $http.get( '/reports/byyear/?year=' + year ) ,
            getPayedReportsByYear : ( year ) => $http.get( '/reports/payedbyyear/?year=' + year ),
            getCabinReportsByYear : ( year ) => $http.get( '/reports/cabinsbyyear/?year=' + year )
        });
    }])
    .controller( 'reports-controller', [    '$scope',
                                            'AuthRepository',
                                            'ReportsRepository',
                                            function(   $scope,
                                                        AuthRepository,
                                                        ReportsRepository   ) {
        if( AuthRepository.viewVerification() ) {

            $scope.title = "Reportes";

            $scope.month_reports = {
                "chart": {
                    "caption": "Ganancias de cabañas durante este Mes",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "$",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Ganancias",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };
            $scope.year_reports = {
                "chart": {
                    "caption": "Ganancias de cabañas durante este Año",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "$",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Ganancias",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };

            $scope.month_cabin_reports = {
                "chart": {
                    "caption": "Ganancias de cabañas durante este Mes",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "$",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Ganancias",
                        "renderas": "bar",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };
            $scope.year_cabin_reports = {
                "chart": {
                    "caption": "Ganancias de cabañas durante este Mes",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "$",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Ganancias",
                        "renderas": "bar",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };

            var today_date = new Date(),
                reports_by_month = function( month, year ) {
                    ReportsRepository.getPayedReportsByMonth( month, year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.month_reports.categories[0].category.length = 0;
                            $scope.month_reports.dataset[0].data.length = 0;
                            $scope.month_reports.chart.caption = "Ganancias de cabañas durante el mes de " + $scope.month;
                            $scope.reports_month = data.data;
                            $scope.reports_month.forEach( rm => $scope.month_reports.categories[0].category.push( { 'label' : '' + rm.day } ) );
                            $scope.reports_month.forEach( rm => $scope.month_reports.dataset[0].data.push( { 'value' : rm.total } ) );
                            $scope.monthly_total = $scope.reports_month.map( rm => rm.total ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.res_total = $scope.reports_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.d_max_res = $scope.reports_month.reduce( ( a, b ) => Math.max( parseInt( a.qty ), parseInt( b.qty ) ) == parseInt( a.qty ) ? a : b );
                            $scope.d_max_sales = $scope.reports_month.reduce( ( a, b ) => Math.max( parseFloat( a.total ), parseInt( b.total ) ) == parseFloat( a.total ) ? a : b );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                reports_by_year = function( year ) {
                    ReportsRepository.getPayedReportsByYear( year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.year_reports.categories[0].category.length = 0;
                            $scope.year_reports.dataset[0].data.length = 0;
                            $scope.year_reports.chart.caption = "Ganancias de cabañas durante el año " + $scope.year;
                            $scope.reports_year = data.data;
                            $scope.reports_year.forEach( rm => $scope.year_reports.categories[0].category.push( { 'label' : '' + rm.month } ) );
                            $scope.reports_year.forEach( rm => $scope.year_reports.dataset[0].data.push( { 'value' : rm.total } ) );
                            $scope.yearly_total = $scope.reports_year.map( rm => rm.total ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.res_yearly_total = $scope.reports_year.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.m_max_res = $scope.reports_year.reduce( ( a, b ) => Math.max( parseInt( a.qty ), parseInt( b.qty ) ) == parseInt( a.qty ) ? a : b );
                            $scope.m_max_sales = $scope.reports_year.reduce( ( a, b ) => Math.max( parseFloat( a.total ), parseFloat( b.total ) ) == parseFloat( a.total ) ? a : b );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                cabinreports_by_month = function( month, year ) {
                    ReportsRepository.getCabinReportsByMonth( month, year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.month_cabin_reports.categories[0].category.length = 0;
                            $scope.month_cabin_reports.dataset[0].data.length = 0;
                            $scope.month_cabin_reports.chart.caption = "Ganancias por cabaña del mes de " + $scope.month;
                            $scope.cabinreports_month = data.data;
                            $scope.cabinreports_month.forEach( rm => $scope.month_cabin_reports.categories[0].category.push( { 'label' : '' + rm.cabin.name } ) );
                            $scope.cabinreports_month.forEach( rm => $scope.month_cabin_reports.dataset[0].data.push( { 'value' : rm.total } ) );
                            $scope.d_max_cabres = $scope.cabinreports_month.reduce( ( a, b ) => Math.max( parseInt( a.total ), parseInt( b.total ) ) == parseInt( a.total ) ? a : b );
                            $scope.d_max_cabres_mr = $scope.cabinreports_month.reduce( ( a, b ) => Math.max( parseInt( a.total ), parseInt( b.total ) ) == parseInt( a.total ) ? a : b );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                cabinreports_by_year = function( year ) {
                    ReportsRepository.getCabinReportsByYear( year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.year_cabin_reports.categories[0].category.length = 0;
                            $scope.year_cabin_reports.dataset[0].data.length = 0;
                            $scope.year_cabin_reports.chart.caption = "Reporte de ganancias del año " + $scope.year;
                            $scope.cabinreports_year = data.data;
                            $scope.cabinreports_year.forEach( rm => $scope.year_cabin_reports.categories[0].category.push( { 'label' : '' + rm.cabin.name } ) );
                            $scope.cabinreports_year.forEach( rm => $scope.year_cabin_reports.dataset[0].data.push( { 'value' : rm.total } ) );
                            $scope.m_max_cabres = $scope.cabinreports_year.reduce( ( a, b ) => Math.max( parseInt( a.total ), parseInt( b.total ) ) == parseInt( a.total ) ? a : b );
                            $scope.m_max_cabres_mr = $scope.cabinreports_year.reduce( ( a, b ) => Math.max( parseInt( a.total ), parseInt( b.total ) ) == parseInt( a.total ) ? a : b );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };

            $scope.months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Semptiembre', 'Noviembre', 'Diciembre' ],
            $scope.month = $scope.months[today_date.getMonth()];
            $scope.month_cabins = $scope.months[today_date.getMonth()];
            $scope.year_m = today_date.getFullYear();
            $scope.year_m_cabins = today_date.getFullYear();
            $scope.years = [];
            $scope.years_m = [];
            $scope.year = today_date.getFullYear();
            $scope.year_cabins = today_date.getFullYear();

            $scope.change_month = function() {
                for( var i = 0; i < 12; i++ ){
                    if( $scope.months[i] == $scope.month ) {
                        reports_by_month( i, $scope.year_m );
                    }
                }
            };
            $scope.change_month_cabins = function() {
                for( var i = 0; i < 12; i++ ){
                    if( $scope.months[i] == $scope.month_cabins ) {
                        cabinreports_by_month( i, $scope.year_m_cabins );
                    }
                }
            };

            for ( var i = 0; i <= ( today_date.getFullYear() - 2015 ); i++) {
                $scope.years.push( 2015 + i );
                $scope.years_m.push( 2015 + i );
            }

            $scope.change_year = function() {
                reports_by_year( $scope.year );
            };
            $scope.change_year_cabins = function() {
                cabinreports_by_year( $scope.year_cabins );
            };

            reports_by_month( today_date.getMonth(), $scope.year_m );
            reports_by_year( $scope.year );

            cabinreports_by_month( today_date.getMonth(), $scope.year_m_cabins );
            cabinreports_by_year( $scope.year_cabins );

        }
    }])
    .controller( 'sales-controller', [  '$scope',
                                        'AuthRepository',
                                        'ReportsRepository',
                                        'ReservationCabinRepository',
                                        function(   $scope,
                                                    AuthRepository,
                                                    ReportsRepository,
                                                    ReservationCabinRepository ) {
        if( AuthRepository.viewVerification() ) {
            $scope.title = "Ventas";

            $scope.month_sales = {
                "chart": {
                    "caption": "Ventas del Mes",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Todas",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    },
                    {
                        "seriesname": "Pagadas",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    },
                    {
                        "seriesname": "Pendientes",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };

            $scope.date_sales = {
                "chart": {
                    "caption": "Ventas por periodo",
                    "xaxisname": "Mes",
                    "yaxisname": "Cantidad",
                    "numberprefix": "$",
                    "theme": "fint"
                },
                "categories": [
                    {
                        "category": []
                    }
                ],
                "dataset": [
                    {
                        "seriesname": "Todas",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    },
                    {
                        "seriesname": "Pagadas",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    },
                    {
                        "seriesname": "Pendientes",
                        "renderas": "area",
                        "showvalues": "0",
                        "data": []
                    }
                ]
            };

            var today_date = new Date(),
                sales_by_month = function( month, year ) {
                    ReportsRepository.getReportsByMonth( month, year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.month_sales.categories[0].category.length = 0;
                            $scope.month_sales.dataset[0].data.length = 0;
                            $scope.month_sales.chart.caption = "Cantidad de ventas durante el mes de " + $scope.month;
                            $scope.reports_month = data.data;
                            $scope.reports_month.forEach( rm => $scope.month_sales.categories[0].category.push( { 'label' : '' + rm.day } ) );
                            $scope.reports_month.forEach( rm => $scope.month_sales.dataset[0].data.push( { 'value' : rm.qty } ) );
                            $scope.res_num = $scope.reports_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );

                            var calendar = {
                                "date_start" : new Date( year + "/" + ( month + 1 ) + "/01" ),
                                "date_end" :  new Date( year + "/" + ( month + 2 ) + "/01" ) };
                            ReservationCabinRepository.getAll( calendar ).success( function( data ) {
                                if( !data.error ) {
                                    $scope.reservations_by_month = data.data;
                                    $scope.reservations_by_month_table = $scope.reservations_by_month;
                                } else {
                                    $scope.errors = data.message;
                                }
                            }).error( function( error ) {
                                $scope.errors = error;
                            });
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                    ReportsRepository.getPayedReportsByMonth( month, year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.month_sales.dataset[1].data.length = 0;
                            $scope.reports_payed_month = data.data;
                            $scope.reports_payed_month.forEach( rm => $scope.month_sales.dataset[1].data.push( { 'value' : rm.qty } ) );
                            $scope.total_num_month = $scope.reports_payed_month.map( rm => rm.total ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.payed_res_num = $scope.reports_payed_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                    ReportsRepository.getPendingReportsByMonth( month, year ).success( function( data ) {
                        if( !data.error ) {
                            $scope.month_sales.dataset[2].data.length = 0;
                            $scope.reports_pending_month = data.data;
                            $scope.reports_pending_month.forEach( rm => $scope.month_sales.dataset[2].data.push( { 'value' : rm.qty } ) );
                            $scope.pendings_num = $scope.reports_pending_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                },
                sales_by_dates = function( d_s, d_e ) {
                    ReportsRepository.getReportsByDates( d_s, d_e ).success( function( data ) {
                        if( !data.error ) {
                            $scope.date_sales.categories[0].category.length = 0;
                            $scope.date_sales.dataset[0].data.length = 0;
                            $scope.date_sales.chart.caption = "Cantidad de ventas durante el mes de " + $scope.month;
                            $scope.reports_date = data.data;
                            $scope.reports_date.forEach( rm => $scope.date_sales.categories[0].category.push( { 'label' : '' + rm.date } ) );
                            $scope.reports_date.forEach( rm => $scope.date_sales.dataset[0].data.push( { 'value' : rm.qty } ) );
                            $scope.res_num_dates = $scope.reports_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                            ReservationCabinRepository.getAll( { 'date_start' : d_s, 'date_end' : d_e } ).success( function( data ) {
                                if( !data.error ) {
                                    $scope.reservations_by_dates = data.data;
                                    $scope.reservations_by_dates_table = $scope.reservations_by_dates;
                                } else {
                                    $scope.errors = data.message;
                                }
                            }).error( function( error ) {
                                $scope.errors = error;
                            });
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                    ReportsRepository.getPayedReportsByDates( d_s, d_e ).success( function( data ) {
                        if( !data.error ) {
                            $scope.date_sales.dataset[1].data.length = 0;
                            $scope.reports_payed_date = data.data;
                            $scope.reports_payed_date.forEach( rm => $scope.date_sales.dataset[1].data.push( { 'value' : rm.qty } ) );
                            $scope.total_num_dates = $scope.reports_payed_date.map( rm => rm.total ).reduce( ( a, b ) => ( a + b ), 0 );
                            $scope.payed_res_num_dates = $scope.reports_payed_date.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                    ReportsRepository.getPendingReportsByDates( d_s, d_e ).success( function( data ) {
                        if( !data.error ) {
                            $scope.date_sales.dataset[2].data.length = 0;
                            $scope.reports_pending_date = data.data;
                            $scope.reports_pending_date.forEach( rm => $scope.date_sales.dataset[2].data.push( { 'value' : rm.qty } ) );
                            $scope.pendings_num = $scope.reports_pending_month.map( rm => rm.qty ).reduce( ( a, b ) => ( a + b ), 0 );
                        } else {
                            $scope.errors = data.message;
                        }
                    }).error( function( error ) {
                        $scope.errors = error;
                    });
                };

            $scope.on_change_search_month = function() {
                // Filter with search bar NAME and Cabins And Extended Token
                $scope.reservations_by_month_table = $scope.reservations_by_month.filter( r => r.reservation_info.full_name.includes( $scope.search_txt_month ) );
            };

            $scope.on_change_search_dates = function() {
                // Filter with search bar NAME and Cabins And Extended Token
                $scope.reservations_by_dates_table = $scope.reservations_by_dates.filter( r => r.reservation_info.full_name.includes( $scope.search_txt_dates ) );
            };

            $scope.pending_month = function() {
                // filter by pending on months area
                $scope.reservations_by_month_table = $scope.reservations_by_month.filter( r => r.payment_info.payment_status.name == "Pendiente" );
            };

            $scope.pending_dates = function() {
                // filter by pending on the dates area
                $scope.reservations_by_dates_table = $scope.reservations_by_dates.filter( r => r.payment_info.payment_status.name == "Pendiente" );
            };

            $scope.payed_month = function() {
                // filter by payed reservations on months area
                $scope.reservations_by_month_table = $scope.reservations_by_month.filter( r => r.payment_info.payment_status.name == "Pagada" );
            };

            $scope.payed_dates = function() {
                // filter by payed reservations on dates area
                $scope.reservations_by_dates_table = $scope.reservations_by_dates.filter( r => r.payment_info.payment_status.name == "Pagada" );
            };

            $scope.all_months = function() {
                // Filter by all reservations on months area
                $scope.reservations_by_month_table = $scope.reservations_by_month;
            };

            $scope.all_dates = function() {
                // Filter by all reservations on dates area
                $scope.reservations_by_dates_table = $scope.reservations_by_dates;
            };

            $scope.on_change_month_and_year_select = function() {
                // function for both month and year
                for( var i = 0; i < 12; i++ ){
                    if( $scope.months[i] == $scope.month ) {
                        sales_by_month( i, $scope.year_m );
                    }
                }
            };

            $scope.on_chage_dates = function() {
                var d_s_txt = document.getElementById( 'date_start' ).value,
                    d_e_txt = document.getElementById( 'date_end' ).value;
                if( d_s_txt && d_e_txt ) {
                    $scope.date_data.date_start = new Date( d_s_txt );
                    $scope.date_data.date_end = new Date( d_e_txt );
                    sales_by_dates( $scope.date_data.date_start, $scope.date_data.date_end );
                }
            };

            $scope.months = [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Semptiembre', 'Noviembre', 'Diciembre' ],
            $scope.month = $scope.months[today_date.getMonth()];
            $scope.year_m = today_date.getFullYear();
            $scope.years_m = [];
            $scope.date_data = { "date_start" : "", "date_end" : "" };

            for ( var i = 0; i <= ( today_date.getFullYear() - 2015 ); i++) {
                $scope.years_m.push( 2015 + i );
            }

            sales_by_month( today_date.getMonth(), $scope.year_m );
        }
    }]);
