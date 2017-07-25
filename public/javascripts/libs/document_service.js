angular.module( 'document-service', [])
    .service( 'DocumentService', [ '$filter', function( $filter ) {
        this.printReservation = function( reservation, ticket_price_child, ticket_price_adult ) {
            var d1 = new Date( reservation.date_start ),
                d2 = new Date( reservation.date_end ),
                days = Math.ceil( Math.abs( d2.getTime() - d1.getTime() ) / ( 1000 * 3600 * 24 ) ),
                str_id = reservation.extended_token;
            var docDefinition = {
                header: {
                    columns: [
                        { text: 'Balneario Las Palmas', style: 'header' },
                        { text: ( "ID :" + str_id ), alignment: 'right' }
                    ]
                },
                footer: {
                    columns: [
                        'Este recibo se debe mostrar en la entrada.',
                        { text: 'Todos los derechos reservados.', alignment: 'right' }
                    ]
                },
                content: [
                    '\n',
                    { text : 'Información del Cliente', style: 'title' },
                    '\n',
                    { text: 'Nombre : ' + reservation.reservation_info.full_name, style: 'info' },
                    '\n',
                    { text: 'e-mail : ' + reservation.reservation_info.email, style: 'info' },
                    '\n',
                    {
                        columns : [
                            {
                                width: 'auto',
                                text: 'Teléfono : ' + reservation.reservation_info.phone_number,
                                style : 'info'
                            },
                            {
                                width: 'auto',
                                text: 'Código Postal : ' + reservation.reservation_info.zip_code,
                                style : 'info'
                            }
                        ],
                        columnGap: 10
                    },
                    '\n',
                    {
                        columns : [
                            {
                                width: 'auto',
                                text: 'Ciudad : ' + reservation.reservation_info.city,
                                style : 'info'
                            },
                            {
                                width: 'auto',
                                text: 'Estado : ' + reservation.reservation_info.state,
                                style : 'info'
                            },
                            {
                                width: 'auto',
                                text: 'País : ' + reservation.reservation_info.country,
                                style : 'info'
                            }
                        ],
                        columnGap: 10
                    },
                    '\n',
                    { text : 'Detalle de Reservación', style: 'title' },
                    '\n',
                    {
                        table: {
                            headerRows: 1,
                            widths: [ '*', '*' ],
                            body: [
                                [
                                    { text: 'Fecha entrada', bold: true },
                                    { text: 'Fecha de salida', bold: true }
                                ],
                                [ $filter( 'dateFilter' ) ( reservation.date_start ) + ' 14:00 hrs', $filter( 'dateFilter' ) ( reservation.date_end ) + ' 13:00 hrs' ]
                            ]
                        }
                    },
                    '\n',
                    {
                        table: {
                            headerRows: 1,
                            widths: [ '*', 100, 100, '*' ],
                            body: [
                                [
                                    { text: 'Detalle', bold: true },
                                    { text: 'P/U', bold: true },
                                    { text: 'Cantidad', bold: true },
                                    { text: 'Sub Total', bold: true }
                                ],
                                [ 'Máximo de personas', '$ 0.00', '' + reservation.max_guests, '$ 0.00' ],
                                [ 'Boletos Extra Niños', '$ ' + parseFloat( ticket_price_child ), '' + reservation.extra_guests_child, '$ ' + parseFloat( reservation.extra_guests_child * ticket_price_child ) ],
                                [ 'Boletos Extra Adultos', '$ ' + parseFloat( ticket_price_adult ), '' + reservation.extra_guests_adult, '$ ' + parseFloat( reservation.extra_guests_adult * ticket_price_adult ) ]
                            ]
                        }
                    },
                    '\n',
                    { text: 'Sub Total : ' + '$ ' + ( reservation.total / days ), style : { fontSize : 16, alignment: 'right' } },
                    '\n',
                    { text: ' Por ' + days + ' noches', style : { fontSize : 14, bold:true, alignment: 'right' } },
                    '\n',
                    { text: 'Total : ' + '$ ' + reservation.total, style : 'total' }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true
                    },
                    title : {
                        fontSize : 18
                    },
                    total : {
                        fontSize : 18,
                        alignment : 'right'
                    },
                    info : {
                        fontSize : 12
                    }
                }
            };
            reservation.details.forEach( function( detail, index ) {
                docDefinition.content[15].table.body.push([
                    detail.product.name,
                    '$ ' + detail.product.price,
                    '' + detail.qty,
                    '$ ' + ( detail.product.price * detail.qty )
                ]);
            });
            pdfMake.createPdf(docDefinition).download("Res_" + str_id + ".pdf");
        };
    }]);
