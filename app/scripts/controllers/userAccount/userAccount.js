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

angular.module('cnedApp').controller('UserAccountCtrl', function($scope, $http, configuration, $location,$rootScope) {
	
	
	/*global $:false */
	$scope.oneAtATime = true;
	$scope.compte = {};
	$scope.infoModif = false;
	$scope.erreurModif = false;
	$scope.passwordIstheSame = null;

	$rootScope.MonCompte = true;
	$scope.initial = function() {
		$scope.passwordIstheSame = null;
		$http.get(configuration.URL_REQUEST + '/profile')
			.success(function(data) {
				$scope.objet = data;
				$scope.compte.email = data.local.email;
				$scope.compte.nom = data.local.nom;
				$scope.compte.password = data.local.password;
				$scope.compte.prenom = data.local.prenom;
			})
			.error(function() {
				$location.path('/logout');

			});
	};

	$scope.modifierCompte = function() {
		$scope.userAccount = {
			_id: $scope.objet._id,
			local: {
				email: $scope.compte.email,
				nom: $scope.compte.nom,
				prenom: $scope.compte.prenom
			}
		};
		$http.post(configuration.URL_REQUEST + '/modifierInfosCompte', $scope.userAccount)
			.success(function(data) {
				$scope.monObjet = data;
				console.log('compte modifé');
				$('#succes').fadeIn('fast').delay(3000).fadeOut('fast');

			})
			.error(function() {
				alert('ko');

			});

	};

	$scope.modifierPassword = function() {
		$scope.userPassword = {
			_id: $scope.objet._id,
			local: {
				password: $scope.compte.oldPassword,
				newPassword: $scope.compte.newPassword
			}
		};
		$http.post(configuration.URL_REQUEST + '/checkPassword', $scope.userPassword)
			.success(function(data) {
				$scope.testVar = data;
				if ($scope.testVar === 'true') {
					console.log('data ====>');
					console.log(data);
					if ($scope.verifyPassword($scope.compte.newPassword) && $scope.verifyPassword($scope.compte.reNewPassword)) {
						if ($scope.compte.newPassword === $scope.compte.reNewPassword) {

							$http.post(configuration.URL_REQUEST + '/modifierPassword', $scope.userPassword)
								.success(function() {
									console.log('okkk');
									$scope.compte.oldPassword = '';
									$scope.compte.newPassword = '';
									$scope.compte.reNewPassword = '';
									$('#succes').fadeIn('fast').delay(3000).fadeOut('fast');

								})
								.error(function() {
									alert('ko');

								});
						} else {
							$('#erreur').fadeIn('fast').delay(3000).fadeOut('fast');

						}
					} else {
						$('#erreurPattern').fadeIn('fast').delay(3000).fadeOut('fast');
					}

				} else {
					$('#errorPassword').fadeIn('fast').delay(3000).fadeOut('fast');

				}

			})
			.error(function() {
				alert('ko');

			});



	};

	$scope.verifyPassword = function(password) {
		var ck_password = /^[A-Za-z0-9!@#$%^&*()_]{6,20}$/;

		if (!ck_password.test(password)) {
			return false;
		}
		return true;
	};



});