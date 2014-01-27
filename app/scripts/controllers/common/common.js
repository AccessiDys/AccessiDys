'use strict';

angular.module('cnedApp').controller('CommonCtrl', function($scope, $location) {

	// detect current location
	$scope.isActive = function(route) {
		return route === $location.path();
	};
});