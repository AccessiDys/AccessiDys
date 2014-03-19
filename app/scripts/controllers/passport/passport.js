'use strict';
/**
 *controller responsacle de tout les operation ayant rapport avec la bookmarklet
 */

angular.module('cnedApp').controller('passportCtrl', function($scope, $rootScope, $http, $location, serviceCheck) {

	$rootScope.area = 'AUTHENTIFICATION / INSCRIPTION';

	$scope.guest = $rootScope.loged;
	$scope.obj = {
		nomSign: '',
		prenomSign: '',
		emailSign: '',
		passwordSign: '',
		passwordConfirmationSign: ''
	};
	$scope.erreur = {
		erreurSigninNom: false,
		erreurSigninNomMessage: '',
		erreurSigninPrenom: false,
		erreurSigninPrenomMessage: '',
		erreurSigninEmail: false,
		erreurSigninEmailMessage: '',
		erreurSigninPasse: false,
		erreurSigninPasseMessage: '',
		erreurSigninConfirmationPasse: false,
		erreurSigninConfirmationPasseMessage: '',
		erreurSigninEmailNonDisponibleMessage: false
	};
	$scope.emailLogin = null;
	$scope.passwordLogin = null;
	$scope.showlogin = true; //true
	$scope.erreurLogin = false; //false
	$scope.erreurSignin = false; //false
	$scope.inscriptionStep1 = true; //true
	$scope.inscriptionStep2 = false; //false
	$scope.showStep2part1 = true; //true
	$scope.erreurSigninConfirmationPasse = false;
	$scope.erreurSigninEmailNonDisponible = false;
	$scope.step1 = 'btn btn-primary btn-circle';
	$scope.step2 = 'btn btn-default btn-circle';
	$scope.step3 = 'btn btn-default btn-circle';
	$scope.step4 = 'btn btn-default btn-circle';

	$scope.logout = $rootScope.loged;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	$scope.showpart2 = false;

	$rootScope.$watch('dropboxWarning', function() {
		$scope.guest = $rootScope.loged;
		$scope.apply; // jshint ignore:line
	});

	$scope.init = function() {
		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
			if (result.loged) {
				if (result.dropboxWarning === false) {
					$rootScope.dropboxWarning = false;
					$scope.missingDropbox = false;
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
					if ($location.path() !== '/inscriptionContinue') {
						$location.path('/inscriptionContinue');
					}
				} else {
					$rootScope.loged = true;
					$rootScope.admin = result.admin;
					$rootScope.apply; // jshint ignore:line
				}
			} else {
				if ($location.path() !== '/' && $location.path() !== '/workspace') {
					$location.path('/');
				}
			}
		});
	};

	$scope.signin = function() {
		$scope.erreurSigninEmailNonDisponible = false;
		if ($scope.verifyEmail($scope.obj.emailSign) && $scope.verifyPassword($scope.obj.passwordSign) && $scope.verifyString($scope.obj.nomSign) && $scope.verifyString($scope.obj.prenomSign) && $scope.obj.passwordConfirmationSign === $scope.obj.passwordSign) {
			var data = {
				email: $scope.obj.emailSign,
				password: $scope.obj.passwordSign,
				nom: $scope.obj.nomSign,
				prenom: $scope.obj.prenomSign
			};
			$http.post('/signup', data)
				.success(function(data) {
					$scope.singinFlag = data;
					$scope.inscriptionStep1 = false;
					$scope.inscriptionStep2 = true;
					$scope.step2 = 'btn btn-primary btn-circle';
					$scope.step1 = 'btn btn-default btn-circle';
					$('#myModal').modal('show');
				})
				.error(function() {
					$scope.erreur.erreurSigninEmail = false;
					$scope.erreur.erreurSigninEmailNonDisponible = true;
				});
		} else {

			if (!$scope.verifyString($scope.obj.nomSign)) {
				if ($scope.obj.nomSign === null) {
					$scope.erreur.erreurSigninNomMessage = 'Nom : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninNomMessage = "Nom : Veuillez n'utiliser que des lettres (de a à z), des chiffres et des points.";
				}
				$scope.erreur.erreurSigninNom = true;
			} else {
				$scope.erreur.erreurSigninNom = false;
			}

			if (!$scope.verifyString($scope.obj.prenomSign)) {
				if ($scope.obj.prenomSign === null) {
					$scope.erreur.erreurSigninPrenomMessage = 'Prénom : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninPrenomMessage = "Prénom : Veuillez n'utiliser que des lettres (de a à z), des chiffres et des points.";

				}
				$scope.erreur.erreurSigninPrenom = true;
			} else {
				$scope.erreur.erreurSigninPrenom = false;
			}

			if (!$scope.verifyEmail($scope.obj.emailSign)) {
				if ($scope.obj.emailSign === null) {
					$scope.erreur.erreurSigninEmailMessage = 'Email : Cette donnée est obligatoire. Merci de compléter le champ.';
				} else {
					$scope.erreur.erreurSigninEmailMessage = 'Email : Veuillez entrer une adresse mail valable.';
				}
				$scope.erreur.erreurSigninEmail = true;
			} else {
				$scope.erreur.erreurSigninEmail = false;
			}

			if (!$scope.verifyPassword($scope.obj.passwordSign)) {
				$scope.erreur.erreurSigninPasseMessage = 'Les mots de passe doivent comporter au moins six caractères.';
				$scope.erreur.erreurSigninPasse = true;
			} else {
				$scope.erreur.erreurSigninPasse = false;
			}

			if ($scope.obj.passwordSign !== $scope.obj.passwordConfirmationSign) {
				if ($scope.obj.passwordConfirmationSign === '') {
					$scope.erreur.erreurSigninConfirmationPasseMessage = 'Veuillez confirmer votre mot de passe ici.';
				} else {
					$scope.erreur.erreurSigninConfirmationPasseMessage = 'Ces mots de passe ne correspondent pas.';
				}
				$scope.erreur.erreurSigninConfirmationPasse = true;
			} else {
				$scope.erreur.erreurSigninConfirmationPasse = false;
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
				.success(function(dataRecue) {
					$scope.loginFlag = dataRecue;
					$rootScope.loged = true;
					$rootScope.apply; // jshint ignore:line
					if ($scope.loginFlag.data) {
						if ($scope.loginFlag.data.local) {
							if ($scope.loginFlag.data.local === 'admin') {
								$location.path('/adminPanel');
							} else {
								$location.path('/workspace');
							}
						}
					} else {

						if ($scope.loginFlag.local.role === 'admin') {
							$location.path('/adminPanel');
						} else {
							$location.path('/workspace');
						}
					}


				}).error(function() {
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
		var ck_nomPrenom = /^[A-Za-z0-9éèâîôç ]{3,20}$/;
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