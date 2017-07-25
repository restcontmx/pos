app
    .factory( 'ContentsRepository', [ 'CRUDService', function( CRUDService ) {
        return({
            getOurCompanyContents : function(){
                return CRUDService.getBunch( 'contents/ourcompanycontent' );
            },
            getOurServicesContents : function() {
                return CRUDService.getBunch( 'contents/ourservicescontent' );
            },
            getRecomendationsContents : function() {
                return CRUDService.getBunch( 'contents/recomendations' );
            },
            getOurPersonalContents : function() {
                return CRUDService.getBunch( 'contents/ourpersonalcontent' );
            },
            getOurProductsContents : function() {
                return CRUDService.getBunch( 'contents/ourproductscontent' );
            },
            editOurCompanyContent : function( data ) {
                return CRUDService.updateBunch( 'contents/ourcompanycontent', data );
            },
            editOurServicesContent : function( data ) {
                return CRUDService.updateBunch( 'contents/ourservicescontent', data );
            },
            editRecomendationsContent : function( data ) {
                return CRUDService.updateBunch(  'contents/recomendations', data );
            },
            editOurPersonalContent : function( data ) {
                return CRUDService.updateBunch( 'contents/ourpersonalcontent', data );
            },
            editOurProductsContent : function( data ) {
                return CRUDService.updateBunch( 'contents/ourproductscontent', data );
            }
        });
    }])
    .controller( 'contents-controller',
                    [   '$scope',
                        '$location',
                        'ContentsRepository',
                        'AuthRepository',
                        'ImageRepository',
                        function(   $scope,
                                    $location,
                                    ContentsRepository,
                                    AuthRepository,
                                    ImageRepository ) {
        if( AuthRepository.viewVerification() ) {

            $scope.title = "Contenidos del sitio";
            $scope.icons = [
                "fa fa-cog",
                "fa fa-gears",
                "fa fa-bed"
            ];
            // load contents
            ContentsRepository.getOurCompanyContents().success( function( data ) {
                if( !data.error ) {
                    $scope.ourcompanycontents = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            ContentsRepository.getOurServicesContents().success( function( data ) {
                if( !data.error ) {
                    $scope.ourservicescontents = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            ContentsRepository.getRecomendationsContents().success( function( data ) {
                if( !data.error ) {
                    $scope.recomendationscontents = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            ContentsRepository.getOurPersonalContents().success( function( data ) {
                if( !data.error ) {
                    $scope.ourpersonalcontents = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            ContentsRepository.getOurProductsContents().success( function( data ) {
                if( !data.error ) {
                    $scope.ourproductscontents = data.data;
                } else {
                    $scope.errors = data.message;
                }
            }).error( function( error ) {
                $scope.errors = error;
            });

            // edit nuestra compañía
            $scope.save_ourcompany = function() {
                ContentsRepository.editOurCompanyContent( $scope.ourcompanycontents ).success( function( data ) {
                    if( !data.error ) {
                        $location.path( '/contents/' );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            $scope.onLoadOurCompanyImage1 = function( e, reader, file, fileList, fileOjects, fileObj) {
                $scope.ourcompanyimage1 = fileObj.base64;
            };
            $scope.save_ourcompany_img_1 = function() {
                ImageRepository.image1ToOurCompanyContent( $scope.ourcompanycontents[0].id, $scope.ourcompanyimage1 ).success( function( data ) {
                    $location.path( '/contents/' );
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            $scope.onLoadOurCompanyImage2 = function( e, reader, file, fileList, fileOjects, fileObj) {
                $scope.ourcompanyimage2 = fileObj.base64;
            };
            $scope.save_ourcompany_img_2 = function() {
                ImageRepository.image2ToOurCompanyContent( $scope.ourcompanycontents[0].id, $scope.ourcompanyimage2 ).success( function( data ) {
                    $location.path( '/contents/' );
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            // edit nuestros servicios
            $scope.save_ourservices = function() {
                ContentsRepository.editOurServicesContent( $scope.ourservicescontents ).success( function( data ) {
                    if( !data.error ) {
                        $location.path( '/contents/' );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            // edit recomendaciones
            $scope.save_recomendations = function() {
                ContentsRepository.editRecomendationsContent( $scope.recomendationscontents ).success( function( data ) {
                    if( !data.error ) {
                        $location.path( '/contents/' );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            // edit nuestro personal
            $scope.save_ourpersonal = function() {
                ContentsRepository.editOurPersonalContent( $scope.ourpersonalcontents ).success( function( data ) {
                    if( !data.error ) {
                        $location.path( '/contents/' );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            $scope.onLoadOurPersonalImage = function( e, reader, file, fileList, fileOjects, fileObj) {
                $scope.ourpersonalimage = fileObj.base64;
            };
            $scope.save_ourpersonal_img = function() {
                ImageRepository.imageToOurPersonalContent( $scope.ourpersonalcontents[0].id, $scope.ourpersonalimage ).success( function( data ) {
                    $location.path( '/contents/' );
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
            // edit nuestros productos
            $scope.save_ourproducts = function() {
                ContentsRepository.editOurProductsContent( $scope.ourproductscontents ).success( function( data ) {
                    if( !data.error ) {
                        $location.path( '/contents/' );
                    } else {
                        $scope.errors = data.message;
                    }
                }).error( function( error ) {
                    $scope.errors = error;
                });
            };
        }
    }]);
