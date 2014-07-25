/* File: userAccount.js
 *
 * Copyright (c) 2014
 * Centre National d’Enseignement à Distance (Cned), Boulevard Nicephore Niepce, 86360 CHASSENEUIL-DU-POITOU, France
 * (direction-innovation@cned.fr)
 *
 * GNU Affero General Public License (AGPL) version 3.0 or later version
 *
 * This file is part of a program which is free software: you can
 * redistribute it and/or modify it under the terms of the
 * GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 */

'use strict';

angular.module('cnedApp').controller('UserAccountCtrl', function($scope, $http, md5, configuration, $location, $rootScope, serviceCheck) {


	/*global $:false */
	$scope.oneAtATime = true;
	$scope.compte = {};
	$scope.infoModif = false;
	$scope.erreurModif = false;
	$scope.passwordIstheSame = null;
	$('#titreCompte').show();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();
	$scope.affichage = false;
	$scope.modifierPasswordDisplay = false;
	

	// ngDialog.open({
	// 	template: 'errorHandling.html',
	// 	scope: $scope
	// });

	$scope.initial = function() {
		$scope.passwordIstheSame = null;
		var tmp2 = serviceCheck.getData();
		tmp2.then(function(result) {
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
					$scope.objet = result;
					$scope.compte.email = result.user.local.email;
					$scope.compte.nom = result.user.local.nom;
					$scope.compte.password = result.user.local.password;
					$scope.compte.prenom = result.user.local.prenom;
					$scope.token = {
						id: result.user.local.token
					};
				}
			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}

		});
	};

	$scope.modifierCompte = function() {
		$scope.addErrorField = [];
		if ($scope.compte && !$scope.compte.prenom) {
			$scope.addErrorField.push('Prénom');
			$scope.affichage = true;
		}
		if ($scope.compte && !$scope.compte.nom) {
			$scope.addErrorField.push('Nom');
			$scope.affichage = true;
		}
		if ($scope.addErrorField.length === 0) {
			$scope.userAccount = {
				_id: $scope.objet.user._id,
				local: {
					email: $scope.compte.email,
					nom: $scope.compte.nom,
					prenom: $scope.compte.prenom
				}
			};
			$http.post(configuration.URL_REQUEST + '/modifierInfosCompte', {
				id: localStorage.getItem('compteId'),
				userAccount: $scope.userAccount
			})
				.success(function(data) {
				$scope.monObjet = data;
				$('#succes').fadeIn('fast').delay(3000).fadeOut('fast');

				})
		}


	};

	$scope.modifierPassword = function() {
		$scope.passwordErrorField = [];
		$scope.erreur = false;
		if ($scope.compte && !$scope.compte.oldPassword) {
			$scope.passwordErrorField.push('Ancien mot de passe');
			$scope.modifierPasswordDisplay = true;
			$scope.erreur = true;
		}
		if ($scope.compte && !$scope.compte.newPassword) {
			$scope.passwordErrorField.push('Nouveau mot de passe');
			$scope.modifierPasswordDisplay = true;
			$scope.erreur = true;
		}
		if ($scope.compte && !$scope.compte.reNewPassword) {
			$scope.passwordErrorField.push('Resaisir nouveau mot de passe');
			$scope.modifierPasswordDisplay = true;
			$scope.erreur = true;
		}
		if ($scope.compte.newPassword !== $scope.compte.reNewPassword) {
			$('#erreur').fadeIn('fast').delay(3000).fadeOut('fast');
			$scope.erreur = true;
		}
		if (!$scope.verifyPassword($scope.compte.newPassword) || !$scope.verifyPassword($scope.compte.reNewPassword)) {
			$('#erreurPattern').fadeIn('fast').delay(3000).fadeOut('fast');
			$scope.erreur = true;
		}
		if (!$scope.erreur) {
			$scope.userPassword = {
				_id: $scope.objet.user._id,
				local: {
					password: md5.createHash($scope.compte.oldPassword),
					newPassword: md5.createHash($scope.compte.newPassword)
				}
			};
			$http.post(configuration.URL_REQUEST + '/modifierPassword', {
				id: $scope.token.id,
				userPassword: $scope.userPassword
			}).success(function(data) {
				if (data === 'true') {
					$scope.compte.oldPassword = '';
					$scope.compte.newPassword = '';
					$scope.compte.reNewPassword = '';
					$('#succes').fadeIn('fast').delay(3000).fadeOut('fast');
					$('#confirmation_pw').modal('hide');
					$scope.modifierPasswordDisplay = false;
				} else {
					$('#errorPassword').fadeIn('fast').delay(3000).fadeOut('fast');
				}
			});
		}
	};

	$scope.cancelModification = function() {
		$scope.modifierPasswordDisplay = false;
	};

	$scope.verifyPassword = function(password) {
		var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

		if (!ck_password.test(password)) {
			return false;
		}
		return true;
	};



});