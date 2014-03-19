'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

angular.module('cnedApp').controller('passportContinueCtrl', function($scope, $rootScope, $location, serviceCheck) {

	$scope.guest = $rootScope.loged;
	$scope.missingDropbox = $rootScope.dropboxWarning;

	$scope.inscriptionStep2 = false; //false
	$scope.inscriptionStep3 = false; //false
	$scope.inscriptionStep4 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.showStep2part2 = false; //false
	$scope.step1 = 'btn btn-default btn-circle';
	$scope.step2 = 'btn btn-primary btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';


	$rootScope.$watch('dropboxWarning', function() {
		$scope.guest = $rootScope.loged;
		$scope.apply; // jshint ignore:line
	});

	$scope.init = function() {


		$scope.inscriptionStep1 = false;
		$scope.inscriptionStep2 = true;
		$scope.inscriptionStep3 = false;
		$scope.showStep2part2 = false;
		$scope.step2 = 'btn btn-primary btn-circle';
		$scope.step1 = 'btn btn-default btn-circle';
		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$('#myModal').modal('show');
					$rootScope.apply;// jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$rootScope.dropboxWarning = true;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$scope.showStep2part1 = false; //true
					$scope.showStep2part2 = true; //false
					$rootScope.apply;// jshint ignore:line
				}
			} else {
				if ($location.path() !== '/' && $location.path() !== '/workspace') {
					$location.path('/');
				}
			}
		});
	};

	$scope.toStep3 = function() {

		$scope.step3 = 'btn btn-primary btn-circle';
		$scope.step2 = 'btn btn-default btn-circle';
		$scope.showlogin = false;
		$scope.inscriptionStep1 = false;
		$scope.inscriptionStep2 = false;
		$scope.inscriptionStep3 = true;
	};

	$scope.toStep4 = function() {

		$scope.showlogin = false;
		$scope.inscriptionStep1 = false;
		$scope.inscriptionStep2 = false;
		$scope.inscriptionStep3 = false;
		$scope.inscriptionStep4 = true;
		$scope.step4 = 'btn btn-primary btn-circle';
		$scope.step3 = 'btn btn-default btn-circle';
	};

});