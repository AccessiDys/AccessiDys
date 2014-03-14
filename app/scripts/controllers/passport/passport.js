'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

angular.module('cnedApp').controller('passportCtrl', function($scope, $http, $location) {

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
	$scope.inscriptionStep3 = false; //false
	$scope.inscriptionStep4 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.showStep2part2 = false; //false

	$scope.step1 = 'btn btn-primary btn-circle';
	$scope.step2 = 'btn btn-default btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';

	$scope.nomSign = null;
	$scope.prenomSign = null;

	$scope.init = function() {

		if (localStorage.getItem('step3')) {
			$scope.showlogin = false;
			$scope.inscriptionStep1 = false;
			$scope.inscriptionStep2 = true;
			$scope.inscriptionStep3 = false;
			$scope.showStep2part1 = false;
			$scope.showStep2part2 = true;
			$scope.step2 = 'btn btn-primary btn-circle';
			$scope.step1 = 'btn btn-default btn-circle';
			localStorage.removeItem('step3');
		}
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
	$scope.signin = function() {
		if ($scope.emailSign === null || $scope.passwordSign === null || $scope.nomSign === null || $scope.prenomSign === null) {
			$scope.erreurSignin = true;
		} else {

			var emailverif = $scope.verifyEmail($scope.emailSign);
			if (emailverif === true && $scope.passwordSign.length > 5 && $scope.nomSign.length > 3 && $scope.prenomSign.length > 3 && $scope.passwordConfirmationSign === $scope.passwordSign) {
				var data = {
					email: $scope.emailSign,
					password: $scope.passwordSign,
					nom: $scope.nomSign,
					prenom: $scope.prenomSign
				};
				$http.post('/signup', data)
					.success(function(data, status) {
						$scope.singinFlag = data;
						console.log('succes signin');
						console.log(status);
						console.log(data);

						$scope.inscriptionStep1 = false;
						$scope.inscriptionStep2 = true;
						$scope.step2 = 'btn btn-primary btn-circle';
						$scope.step1 = 'btn btn-default btn-circle';
						localStorage.setItem('step3', 'ok');
					})
					.error(function(data, status) {
						console.log('erreeeeeeeur');
						console.log(status);
						$scope.erreurSignin = true;

					});
			} else {
				console.log('er saisie');
				$scope.erreurSignin = true;

			}
		}
	};

	$scope.login = function() {
		if ($scope.emailLogin === null || $scope.passwordLogin === null) {
			$scope.erreurLogin = true;
		} else {

			var tmp = $scope.verifyEmail($scope.emailLogin);
			if (tmp === true && $scope.passwordLogin.length > 5) {
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
});