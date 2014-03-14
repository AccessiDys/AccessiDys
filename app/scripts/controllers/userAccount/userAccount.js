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

angular.module('cnedApp').controller('UserAccountCtrl', function($scope, $http, configuration,$location) {
	/*global $:false */

	$scope.compte = {};
	$scope.infoModif = false;
	$scope.erreurModif = false;


	$scope.initial = function() {
		$http.get('/profile')
			.success(function(data) {
				$scope.objet = data;
				$scope.compte.email = data.local.email;
				$scope.compte.nom = data.local.nom;
				$scope.compte.password = data.local.password;
				$scope.compte.prenom = data.local.prenom;
				console.log(data);
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
				prenom: $scope.compte.prenom,
				password: $scope.compte.oldPassword,
				newPassword: $scope.compte.newPassword,
				reNewPassword: $scope.compte.reNewPassword
			}
		};
		if ($scope.userAccount.local.newPassword === $scope.userAccount.local.reNewPassword) {
			$http.post(configuration.URL_REQUEST + '/modifierInfosCompte', $scope.userAccount)
				.success(function() {
					console.log('ok pour MODIFIERCOMPTEINFOS===>');
					$('#succes').fadeIn('fast').delay(1000).fadeOut('fast');

				})
				.error(function() {
					alert('ko');

				});

		} else {
			$('#erreur').fadeIn('fast').delay(1000).fadeOut('fast');

		}

	};

	$scope.modifDisabled = function() {
		if ($scope.compte.nom !== null && $scope.compte.prenom !== null && $scope.compte.email !== null && $scope.compte.oldPassword !== null && $scope.compte.newPassword !== null && $scope.compte.reNewPassword !== null) {
			console.log('false');
			return false;
		} else {
			console.log('true');
			return true;
		}
	};



});