'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */


/* jshint undef: true, unused: true */

angular.module('cnedApp').controller('passwordRestoreCtrl', function($scope, $rootScope, $http, $location, configuration) {

	$scope.password = '';
	$scope.passwordConfirmation = '';
	$scope.erreurMessage = '';
	$scope.failRestore = false;
	$scope.init = function() {
		if ($location.absUrl().indexOf('secret=') > -1) {
			$scope.secret = $location.absUrl().substring($location.absUrl().indexOf('secret=') + 7, $location.absUrl().length);
			console.log($scope.secret);

		}
	};

	$scope.restorePassword = function() {
		if ($scope.verifyPassword($scope.password) && $scope.verifyPassword($scope.passwordConfirmation) && $scope.password === $scope.passwordConfirmation) {
			var data = {
				password: $scope.password,
				secret: $scope.secret
			};
			$http.post(configuration.URL_REQUEST + '/saveNewPassword', data)
				.success(function(dataRecue) {
					console.log(dataRecue);
					$('#myModal').modal('show');
				}).error(function(error) {
					console.log(error);
				});
		} else {
			if ($scope.password !== $scope.passwordConfirmation) {
				$scope.erreurMessage = 'Ces mots de passe ne correspondent pas.';
			} else {
				$scope.erreurMessage = 'le mot de passe et sa confirmation sont requis.';
			}
			$scope.failRestore = true;
		}
	};

	$scope.verifyPassword = function(password) {
		var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

		if (!ck_password.test(password)) {
			return false;
		}
		return true;
	};
	$('#myModal').on('hidden.bs.modal', function() {
		window.location.href = '/';
	});
});