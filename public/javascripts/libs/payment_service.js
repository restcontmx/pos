angular.module( 'payment-service', [])
    .factory( 'PaymentRepository', [ '$http', function( $http ) {
        return({
            reservationPayment : function( reservation ) {
                return $http.post( '/payments/mercadopago', JSON.stringify( reservation ) );
            },
            getPayment : function( collection_id ) {
                return $http.get( '/payments/mercadopago/payment/' + collection_id );
            }
        });
    }]);
