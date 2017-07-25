app
    .controller( 'pos-controller', [ '$scope', function( $scope ) {

        $scope.title = 'Punto de Venta';

        $scope.products = [
            { 'id' : 123, 'name' : 'Coca Cola', 'category' : { 'id' : 1, 'description' : 'bebidas', 'color' : '#C70039' }, 'price' : 12.55 },
            { 'id' : 124, 'name' : 'Ensaldada Cesar', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 80.99 },
            { 'id' : 125, 'name' : 'Pescado Empanizado', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 126, 'name' : 'Camarones al ajo', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 127, 'name' : 'Ensaldada Cesar', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 80.99 },
            { 'id' : 128, 'name' : 'Pescado Empanizado', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 129, 'name' : 'Camarones al ajo', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 110, 'name' : 'Ensaldada Cesar', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 80.99 },
            { 'id' : 111, 'name' : 'Pescado Empanizado', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 112, 'name' : 'Camarones al ajo', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 113, 'name' : 'Ensaldada Cesar', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 80.99 },
            { 'id' : 114, 'name' : 'Pescado Empanizado', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
            { 'id' : 115, 'name' : 'Camarones al ajo', 'category' : { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }, 'price' : 110.00 },
        ];

        $scope.products_table = $scope.products;
        $scope.details = [];
        $scope.sale = {
            'id' : 0,
            'total' : 0,
            'details' : [],
            'product_qty' : 0,
            'discount' : 0,
            'iva' : 0,
            'total_payable' : 0
        }
        $scope.categories = [
            { 'id' : 1, 'description' : 'bebidas', 'color' : '#C70039' },
            { 'id' : 2, 'description' : 'platillos', 'color' : '#FFC300' }
        ];

        $scope.categoy_click = function( category ) {
            if ($scope.search_product_txt != "") {
                $scope.products_table = $scope.products.filter( p => p.category.id == category.id && p.name.includes( $scope.search_product_txt ));
            } else {
                $scope.products_table = $scope.products.filter( p => p.category.id == category.id );
            }
        };

        $scope.product_click = function( product ) {
            let temp_detail = $scope.details.find( d => d.product.id == product.id );
            if( temp_detail ) {
                temp_detail.qty++;
            } else {
                $scope.details.push( {
                    'id' : 0,
                    'product' : product,
                    'qty' : 1
                });
            }
            sale_calculation();
        };

        $scope.all_click = function() {
            $scope.search_product_txt = "";
            $scope.products_table = $scope.products;
        };

        $scope.search_box_change = function() {
            $scope.products_table = $scope.products.filter( p => p.name.includes( $scope.search_product_txt ) );
        }

        $scope.detail_selected = function( d ) {
            $scope.selected_detail = d;
        };

        var sale_calculation = function() {
            $scope.sale.product_qty = $scope.details.map( d => d.qty ).reduce( ( a, b ) => ( a + b ), 0 );
            $scope.sale.total = $scope.details.map( d => d.product.price * d.qty ).reduce( ( a, b ) => ( a + b ), 0);
            $scope.sale.total_payable += $scope.sale.total - ( ( $scope.sale.total * $scope.sale.discount ) / 100 );
            $scope.sale.total_payable += ( ( $scope.sale.total_payable * $scope.sale.iva ) / 100 );
        };

    }]);
