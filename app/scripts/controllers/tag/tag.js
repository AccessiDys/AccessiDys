/* File: tag.js
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

angular.module('cnedApp').controller('TagCtrl', function($scope, $http, configuration) {

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$scope.afficherTags = function() {
		$http.get(configuration.URL_REQUEST + '/readTags', {
			params: $scope.requestToSend
		})
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de l\'affichge des tags');
				} else {
					$scope.listTags = data;
				}
			});
	};

	$scope.ajouterTag = function() {
		$scope.requestToSend.tag = $scope.tag;
		$http.post(configuration.URL_REQUEST + '/addTag', $scope.requestToSend)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de l\'enregistrement');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.tag = {};
					$scope.afficherTags();
				}
			});
	};

	$scope.supprimerTag = function() {
		$scope.requestToSend.deleteTag = $scope.fiche;
		$http.post(configuration.URL_REQUEST + '/deleteTag', $scope.requestToSend)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de la suppression');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.afficherTags();
					$scope.fiche = {};
				}
			});
	};

	$scope.modifierTag = function() {
		$scope.requestToSend.tag = $scope.fiche;
		$http.post(configuration.URL_REQUEST + '/updateTag', $scope.requestToSend)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de la modification');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.fiche = {};
					$scope.afficherTags();
				}
			});
	};

	$scope.preModifierTag = function(tag) {
		$scope.fiche = tag;
	};

	$scope.preSupprimerTag = function(tag) {
		$scope.fiche = tag;
	};

	$scope.afficherTags();

});