angular.module( 'image-service', [])
        .service( 'imageData', [ function() {
            this.api_uri = "https://blooming-eyrie-89149.herokuapp.com/api/";
            // Return the api uri for the images module
            this.getApiUri = function( ext ) {
                return this.api_uri + ext;
            };
        }])
        .factory( 'ImageRepository', [ '$http', 'imageData', function( $http, imageData ) {
            return({
                // add images to cabin model
                imageToCabin : function( id, data ) {
                    return $http.put( imageData.getApiUri( 'cabin/image/' + id ), JSON.stringify( data ) );
                },
                // add images to area model
                imageToArea : function( id, data ) {
                    return $http.put( imageData.getApiUri( 'area/image/' + id ), JSON.stringify( data ) );
                },
                // add first image to company content for the website module
                image1ToOurCompanyContent : function( id, data ) {
                    return $http.put( imageData.getApiUri( 'website/ourcompanycontent/image1/' + id ), JSON.stringify( data ) );
                },
                // add image 2 to the company content for the website module
                image2ToOurCompanyContent : function( id, data ) {
                    return $http.put( imageData.getApiUri( 'website/ourcompanycontent/image2/' + id ), JSON.stringify( data ) );
                },
                // add image to our personal content for the web site moduel
                imageToOurPersonalContent : function( id, data ) {
                    return $http.put( imageData.getApiUri( 'website/ourpersonalcontent/image/' + id ), JSON.stringify( data ) );
                }
            });
        }]);
