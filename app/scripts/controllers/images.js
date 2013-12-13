'use strict';

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope) {

    $scope.cropedImages = [];
    $scope.zones = [];
    $scope.loader = false;
    // $rootScope.bodystyle = "overflow:hidden;";

    $scope.selected = function(x) {
        $scope.zones.push(x);
        $rootScope.$emit('releaseCrop');
    };

    // submit crop data
    $scope.sendCrop = function(source) {

        // get crop informations
        console.log("sendCrop");
        var callsFinish = 0;

        $scope.loader = true;
        angular.forEach($scope.zones, function(zone, key) {
            zone.srcImg = source;
            console.log(zone);
            $http.post("/images", {
                DataCrop: zone
            }).success(function(data, status, headers, config) {
                var imageTreated = {};
                imageTreated.source = angular.fromJson(data);

                // Get text by OCR
                $http.post("/oceriser", {
                    sourceImage: imageTreated.source
                }).success(function(data, status, headers, config) {
                    callsFinish += 1;
                    imageTreated.text = angular.fromJson(data);
                    imageTreated.editor = $scope.addEditor(imageTreated.text);
                    $scope.cropedImages.push(imageTreated);
                    console.log($scope.cropedImages);
                    if ($scope.zones.length == callsFinish) {
                        console.log("Ajax calls ae finished");
                        $scope.loader = false;
                    }
                    $scope.msg = "ok";
                }).error(function(data, status, headers, config) {
                    $scope.msg = "ko";
                });
            }).error(function(data, status, headers, config) {
                $scope.msg = "ko";
            });
        });

    };

    $scope.oceriser = function(source) {
        console.log(source);
    }

    $scope.addEditor = function(text) {
        $scope.isDisabled = true;
        $scope.ckEditors = [];
        var init = text;
        $scope.ckEditors.push({
            value: init
        });
        $scope.decision = true;

        $scope.editor = {value: init};
    };

    $scope.getOcrText = function() {
        $scope.editorValue = CKEDITOR.instances.editor1.document.getBody().getText();
    }
});