'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

angular.module('cnedApp').controller('passportCtrl', function($scope, $rootScope, $http, $location) {

	$scope.guest = $rootScope.loged;
	$scope.usernameSign = null;
	$scope.emailSign = null;
	$scope.passwordSign = null;
	$scope.passwordConfirmationSign = null;
	$scope.emailLogin = null;
	$scope.passwordLogin = null;
	$scope.showlogin = true; //true
	$scope.erreurLogin = false; //false
	$scope.erreurSignin = false; //false
	$scope.inscriptionStep1 = true; //true
	$scope.inscriptionStep2 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.erreurSigninNom = false;
	$scope.erreurSigninPrenom = false;
	$scope.erreurSigninEmail = false;
	$scope.erreurSigninPasse = false;
	$scope.erreurSigninConfirmationPasse = false;
	$scope.erreurSigninEmailNonDisponible = false;
	$scope.step1 = 'btn btn-primary btn-circle';
	$scope.step2 = 'btn btn-default btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';

	$scope.nomSign = null;
	$scope.prenomSign = null;



	$scope.signin = function() {
		$scope.erreurSigninEmailNonDisponible = false;
		if ($scope.verifyEmail($scope.emailSign) && $scope.verifyPassword($scope.passwordSign) && $scope.verifyString($scope.nomSign) && $scope.verifyString($scope.prenomSign) && $scope.passwordConfirmationSign === $scope.passwordSign) {
			var data = {
				email: $scope.emailSign,
				password: $scope.passwordSign,
				nom: $scope.nomSign,
				prenom: $scope.prenomSign
			};
			$http.post('/signup', data)
				.success(function(data) {
					$scope.singinFlag = data;
					$scope.inscriptionStep1 = false;
					$scope.inscriptionStep2 = true;
					$scope.step2 = 'btn btn-primary btn-circle';
					$scope.step1 = 'btn btn-default btn-circle';
				})
				.error(function() {

					$scope.erreurSigninEmailNonDisponible = true;
				});
		} else {
			if (!$scope.verifyString($scope.nomSign)) {
				$scope.erreurSigninNom = true;
			} else {
				$scope.erreurSigninNom = false;
			}

			if (!$scope.verifyString($scope.prenomSign)) {
				$scope.erreurSigninPrenom = true;
			} else {
				$scope.erreurSigninPrenom = false;
			}

			if (!$scope.verifyEmail($scope.emailSign)) {
				$scope.erreurSigninEmail = true;
			} else {
				$scope.erreurSigninEmail = false;
			}

			if (!$scope.verifyPassword($scope.passwordSign)) {
				$scope.erreurSigninPasse = true;
			} else {
				$scope.erreurSigninPasse = false;
			}
			if ($scope.passwordSign !== $scope.passwordConfirmationSign) {
				$scope.erreurSigninConfirmationPasse = true;
			} else {
				$scope.erreurSigninConfirmationPasse = false;
			}
		}
	};
	$scope.login = function() {
		if ($scope.verifyEmail($scope.emailLogin) && $scope.verifyPassword($scope.passwordLogin)) {
			var data = {
				email: $scope.emailLogin,
				password: $scope.passwordLogin,
			};
			$http.post('/login', data)
				.success(function(data) {
					$scope.loginFlag = data;
					console.log('DATA IS ==>');
					console.log(data);
					if (data.local.role === 'admin') {
						$location.path('/adminPanel');
					} else {
						$location.path('/userAccount');
						console.log('succes login');
						console.log(data);
					}

				}).error(function(data, status) {
					console.log('erreeeeeeeur');
					console.log(status);
					$scope.erreurLogin = true;
				});
		} else {
			$scope.erreurLogin = true;
		}
	};
	$scope.goNext = function() {
		$scope.showlogin = !$scope.showlogin;
	};
	$scope.verifyEmail = function(email) {
		var reg = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		if (reg.test(email)) {
			return true;
		} else {
			return false;
		}
	};
	$scope.verifyString = function(chaine) {
		var ck_nomPrenom = /^[A-Za-z0-9 ]{3,20}$/;
		if (chaine === null) {
			return false;
		}
		if (!ck_nomPrenom.test(chaine)) {
			return false;
		}
		return true;
	};
	$scope.verifyPassword = function(password) {
		var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

		if (!ck_password.test(password)) {
			return false;
		}
		return true;
	};
});