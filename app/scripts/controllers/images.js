'use strict';

angular.module('cnedApp')
    .controller('ImagesCtrl', function($scope, $http, $rootScope) {

    $scope.cropedImages = [];

    $scope.selected = function(x) {
        console.log("selected", x);
        $scope.dataCrop = x;
    };

    // submit crop data
    $scope.sendCrop = function(source) {

        // get crop informations
        console.log("sendCrop");
        console.log($scope.dataCrop);
        $rootScope.$emit('releaseCrop');

        // Add source image name
        $scope.dataCrop.srcImg = source;
        // console.log(source);

        $http.post("/images", {
            DataCrop: $scope.dataCrop
        })
            .success(function(data, status, headers, config) {
            var imageTreated = {};
            imageTreated.source = angular.fromJson(data);

            // $scope.msg = "ok";

            // Get text by OCR
            $http.post("/oceriser", {
                sourceImage: imageTreated.source
            })
                .success(function(data, status, headers, config) {
                console.log(imageTreated.source);
                imageTreated.text = angular.fromJson(data);
                $scope.cropedImages.push(imageTreated);
                console.log($scope.cropedImages);
                $scope.msg = "ok";
            })
                .error(function(data, status, headers, config) {
                $scope.msg = "ko";
            });
        })
            .error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });
    };

    $scope.oceriser = function(source) {
        console.log("image to ocerise ... ");
        console.log(source);

        /*$http.post("/oceriser", {
            sourceImage: source
        })
            .success(function(data, status, headers, config) {
            console.log(angular.fromJson(data));
            $scope.cropedImages.push(angular.fromJson(data));
            $scope.msg = "ok";
        })
            .error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });*/

    }
});