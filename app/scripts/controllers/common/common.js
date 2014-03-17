/* File: common.js
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

angular.module('cnedApp').controller('CommonCtrl', function($scope, $rootScope, $location, gettextCatalog) {


	$scope.logout = $rootScope.loged;
	$scope.missingDropbox = $rootScope.dropboxWarning;
	// detect current location
	$scope.isActive = function(route) {
		return route === $location.path();
	};

	// Changer la langue
	$scope.changerLangue = function(value) {
		gettextCatalog.currentLanguage = value;
	};
	$scope.$watch('missingDropbox', function() {
		console.log('watch ' + $scope.missingDropbox);
		if ($scope.missingDropbox === false) {
			$rootScope.showpart2 = true;
			$rootScope.dropboxWarning = true;
			$scope.apply; // jshint ignore:line
			$location.path('/#/');
		} else {
			$rootScope.showpart2 = false;
		}
	});
});