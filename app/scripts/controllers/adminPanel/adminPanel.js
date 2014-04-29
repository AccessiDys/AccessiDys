/* File: adminPanel.js
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
angular.module('cnedApp').controller('AdminPanelCtrl', function($scope, $http, $location, configuration, $rootScope, serviceCheck) {
	/*global $:false */

	$scope.headers = ['Nom', 'Prenom', 'Email', 'Action'];
	$scope.loader = false;

	$rootScope.area = 'ADMIN ';


	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').show();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();

	$scope.listAccounts = function() {
		$http.get(configuration.URL_REQUEST + '/allAccounts', {
			params: {
				id: $rootScope.currentUser.local.token
			}
		}).success(function(data) {
			$scope.comptes = data;
		}).error(function() {
			console.log('/allAccounts error');
		});
	};

	$scope.initial = function() {

		// if ($location.absUrl().indexOf('key=') > -1) {
		// 	var callbackKey = $location.absUrl().substring($location.absUrl().indexOf('key=') + 4, $location.absUrl().length);
		// 	localStorage.setItem('compteId', callbackKey);
		// }

		var tmp = serviceCheck.getData();
		tmp.then(function(result) { // this is only run after $http completes
			if (result.loged) {
				console.log('result ===>');
				console.log(result);
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
					$rootScope.currentUser = result.user;
					$rootScope.apply; // jshint ignore:line
					if (result.admin) {
						$http.get(configuration.URL_REQUEST + '/adminService', {
							params: {
								id: $rootScope.currentUser.local.token
							}
						})
							.success(function(data) {
								$scope.admin = data;
								$rootScope.admin = true;
								$rootScope.apply; // jshint ignore:line
							}).error(function() {
								console.log('/adminService error');
								//$location.path('/');
							});
						$scope.listAccounts();
					}

				}
			} else {
				if ($location.path() !== '/') {
					$location.path('/');
				}
			}
		});

	};

	$scope.deleteAccount = function() {
		$scope.loader = true;
		$http.post(configuration.URL_REQUEST + '/deleteAccounts', {
			id: $rootScope.currentUser.local.token,
			compte: $scope.compteAsupprimer
		})
			.success(function(data) {
				$scope.deleted = data;
				$scope.listAccounts();
				$scope.loader = false;

			});
	};

	$scope.preSupprimer = function(account) {
		$scope.compteAsupprimer = account;
	};
});