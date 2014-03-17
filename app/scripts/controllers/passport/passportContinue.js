'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

angular.module('cnedApp').controller('passportContinueCtrl', function($scope, $rootScope) {

	$scope.guest = $rootScope.loged;
	$scope.inscriptionStep2 = false; //false
	$scope.inscriptionStep3 = false; //false
	$scope.inscriptionStep4 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.showStep2part2 = false; //false
	$scope.step1 = 'btn btn-default btn-circle';
	$scope.step2 = 'btn btn-primary btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';

	$scope.init = function() {
		$scope.inscriptionStep1 = false;
		$scope.inscriptionStep2 = true;
		$scope.inscriptionStep3 = false;
		$scope.showStep2part2 = true;
		$scope.step2 = 'btn btn-primary btn-circle';
		$scope.step1 = 'btn btn-default btn-circle';
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