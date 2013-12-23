'use strict';

angular.module('cnedApp').controller('CreateCtrl', function($scope, $http) {
    $scope.submit = function() {
        $http.post("/clients", {
            ClientName: $scope.nomClient
        })
            .success(function(data, status, headers, config) {
            $scope.msg = "ok";
        })
            .error(function(data, status, headers, config) {
            $scope.msg = "ko";
        });
    };
});