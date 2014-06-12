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
/* global $ */

angular.module('cnedApp').controller('TagCtrl', function($scope, $http, configuration) {

	$scope.niveauTags = [{
		value: '0',
		name: 'Par défaut'
	}, {
		value: '1',
		name: 'Niveau 1'
	}, {
		value: '2',
		name: 'Niveau 2'
	}, {
		value: '3',
		name: 'Niveau 3'
	}, {
		value: '4',
		name: 'Niveau 4'
	}];

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();
	$('#titreTag').show();

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$scope.clearUploadPicto = function() {
		$scope.files = [];
		$scope.errorMsg = '';
		$('#docUploadPdf').val('');
		$('.filename_show').val('');
	};

	$scope.clearTag = function() {
		$scope.clearUploadPicto();
		$scope.tag = {};
		$scope.fiche = {};
	};

	$scope.afficherTags = function() {
		$scope.requestToSend = {};
		if (localStorage.getItem('compteId')) {
			$scope.requestToSend = {
				id: localStorage.getItem('compteId')
			};
		}
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
		$scope.errorMsg = '';
		console.log('$scope.niveauTag ===> ' + $scope.niveauTag);

		if (!$scope.tag || !$scope.tag.libelle || $scope.tag.libelle.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}

		if (!$scope.tag.position || $scope.tag.position.length <= 0) {
			$scope.errorMsg = 'La position est obligatoire et doit être numérique !';
			return;
		}

		$scope.tag.niveau = $scope.niveauTag;
		$scope.requestToSend.tag = $scope.tag;
		var fd = new FormData();
		if ($scope.files && $scope.files.length > 0) {
			fd.append('uploadedFile', $scope.files[0]);
		}
		fd.append('tagData', JSON.stringify($scope.requestToSend));
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', $scope.uploadComplete, false);
		xhr.addEventListener('error', $scope.uploadFailed, false);
		xhr.open('POST', configuration.URL_REQUEST + '/addTag');
		xhr.send(fd);
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
		$scope.errorMsg = '';
		if (!$scope.fiche || !$scope.fiche.libelle || $scope.fiche.libelle.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}

		if (!$scope.fiche.position || $scope.fiche.position.length <= 0) {
			$scope.errorMsg = 'La position est obligatoire et doit être numérique !';
			return;
		}

		$scope.fiche.niveau = $scope.niveauTag;
		$scope.requestToSend.tag = $scope.fiche;

		var fd = new FormData();
		if ($scope.files && $scope.files.length > 0) {
			fd.append('uploadedFile', $scope.files[0]);
		}
		fd.append('tagData', JSON.stringify($scope.requestToSend));
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', $scope.uploadComplete, false);
		xhr.addEventListener('error', $scope.uploadFailed, false);
		xhr.open('POST', configuration.URL_REQUEST + '/updateTag');
		xhr.send(fd);
	};

	$scope.uploadComplete = function() {
		$scope.clearTag();
		$('#tagAdd').modal('hide');
		$('#tagEdit').modal('hide');
		$scope.afficherTags();
	};

	$scope.preAjouterTag = function() {
		$scope.niveauTag = $scope.niveauTags[0].value;
		$('#niveauTagAdd + .customSelect .customSelectInner').text($scope.niveauTags[0].name);
	};

	$scope.preModifierTag = function(tag) {
		$scope.niveauTag = $scope.niveauTags[tag.niveau].value;
		$('#niveauTagEdit + .customSelect .customSelectInner').text($scope.niveauTags[tag.niveau].name);
		$scope.fiche = angular.copy(tag);
	};

	$scope.preSupprimerTag = function(tag) {
		$scope.fiche = tag;
	};

	$scope.afficherTags();

	$scope.setFiles = function(element) {
		$scope.files = [];
		$scope.errorMsg = '';
		var field_txt = '';
		$scope.$apply(function() {
			for (var i = 0; i < element.files.length; i++) {
				if (element.files[i].type === 'image/jpeg' || element.files[i].type === 'image/png') {
					$scope.files.push(element.files[i]);
					field_txt += ' ' + element.files[i].name;
					$('.filename_show').val(field_txt);
					break;
				} else {
					$scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des images.';
					$scope.files = [];
					break;
				}
			}
		});
	};

});