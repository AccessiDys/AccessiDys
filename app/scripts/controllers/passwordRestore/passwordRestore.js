/* File: passwordRestore.js
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
		$scope.flagInit = true;
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
					$scope.flagRestoreSucces = true;
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