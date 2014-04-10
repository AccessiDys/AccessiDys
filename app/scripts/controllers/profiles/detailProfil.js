/* File: detailProfil.js
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

angular.module('cnedApp').controller('detailProfilCtrl', function($scope, $http, configuration, $location) {
	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').show();

	$scope.target = $location.search()['idProfil'];

	$scope.initial = function() {
		$http.post(configuration.URL_REQUEST + '/chercherProfil', {
			profilID: $scope.target
		}).success(function(data) {
			console.log('inisde');
			console.log(data);
			$scope.profil = data;

			$http.post(configuration.URL_REQUEST + '/chercherTagsParProfil', {
				idProfil: $scope.target
			}).success(function(data) {
				$scope.tagsByProfils = data;
				$scope.tests = [];
				for (var i = $scope.tagsByProfils.length - 1; i >= 0; i--) {
					if ($scope.tagsByProfils[i].tagName === 'Titre 01' || $scope.tagsByProfils[i].tagName === 'Titre 02' || $scope.tagsByProfils[i].tagName === 'Titre 03') {
						$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.tagsByProfils[i].tagName + ' : Ceci est un exemple de' + $scope.tagsByProfils[i].tagName + ' </p>';
					}
					if ($scope.tagsByProfils[i].tagName === 'Paragraphe' || $scope.tagsByProfils[i].tagName === 'Exercice' || $scope.tagsByProfils[i].tagName === 'Énoncé' || $scope.tagsByProfils[i].tagName === 'Solution' || $scope.tagsByProfils[i].tagName === 'Résumé') {
						$scope.tests[i] = '<p class="text-center" data-font="' + $scope.tagsByProfils[i].police + '" data-size="' + $scope.tagsByProfils[i].taille + '" data-lineheight="' + $scope.tagsByProfils[i].interligne + '" data-weight="' + $scope.tagsByProfils[i].interligne + '" data-coloration="' + $scope.tagsByProfils[i].coloration + '">' + $scope.tagsByProfils[i].tagName + ' : CnedAdapt est une application qui permet d\'adapter les documents. </p>';
					}
				};
			});

		});

	}
});