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
angular.module('cnedApp').controller('AdminPanelCtrl', function($scope, $http, $location, configuration) {
	$scope.headers = ['Nom', 'Prenom', 'Email', 'Action'];
	$scope.loader = false;

	$scope.listAccounts = function() {
		$http.get(configuration.URL_REQUEST + '/allAccounts')
			.success(function(data) {
				$scope.comptes = data;
				console.log('$scope.comptes');
				console.log($scope.comptes);
			});
	};

	$scope.initial = function() {
		$http.get(configuration.URL_REQUEST + '/adminService').success(function(data, status) {
			console.log('data==>');
			$scope.admin = data;
			console.log(data);
			console.log('status===>');
			console.log(status);
		}).error(function() {
			$location.path('/logout');
		});

		$scope.listAccounts();

	};

	$scope.deleteAccount = function() {
		$scope.loader = true;
		$http.post(configuration.URL_REQUEST + '/deleteAccounts', $scope.compteAsupprimer)
			.success(function(data) {
				console.log('deleted' + data);
				$scope.listAccounts();
				$scope.loader = false;

			});
	};

	$scope.preSupprimer = function(account) {
		$scope.compteAsupprimer = account;
	}
});