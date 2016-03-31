/* File: tag.js
 *
 * Copyright (c) 2013-2016
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

	$scope.minNiveau = 1;
	$scope.maxNiveau = 6;

    $scope.html = [
        {
            'balise': 'h1',
            'libelle': 'Titre1'
        },
        {
            'balise': 'h2',
            'libelle': 'Titre2'
        },
        {
            'balise': 'h3',
            'libelle': 'Titre3'
        },
        {
            'balise': 'h4',
            'libelle': 'Titre4'
        },
        {
            'balise': 'h3',
            'libelle': 'Titre5'
        },
        {
            'balise': 'h6',
            'libelle': 'Titre6'
        },
        {
            'balise': 'p',
            'libelle': 'Paragraphe'
        },
        {
            'balise': 'ol',
            'libelle': 'Liste numérotée'
        },
        {
            'balise': 'ul',
            'libelle': 'Liste à puces'
        },
        {
            'balise': 'sup',
            'libelle': 'Exposant'
        },
        {
            'balise': 'sub',
            'libelle': 'Indice'
        },
        {
            'balise': 'div',
            'libelle': 'Autre'
        }
    ];

	$('#titreCompte').hide();
	$('#titreProfile').hide();
	$('#titreDocument').hide();
	$('#titreAdmin').hide();
	$('#titreListDocument').hide();
	$('#detailProfil').hide();
	$('#titreDocumentApercu').hide();
	$('#titreTag').show();
	$scope.showNiveauTag = true;
	$scope.successMsg = '';

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$scope.showDefaultNiveau = function(tag) {
		tag.niveau = 1;
	};

	$scope.getLibelleNiveau = function(nivNum) {
		var nivLibelle = 'Par défaut';
		if (nivNum && parseInt(nivNum) > 0) {
			nivLibelle = 'Niveau ' + nivNum;
		}
		return nivLibelle;
	};

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
		$scope.showNiveauTag = true;
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
					localStorage.setItem('listTags', JSON.stringify($scope.listTags));
				}
			});
	};

	$scope.ajouterTag = function() {
		$scope.errorMsg = '';

		if (!$scope.tag || !$scope.tag.libelle || $scope.tag.libelle.length <= 0) {
			$scope.errorMsg = 'Le titre est obligatoire !';
			return;
		}

		if (!$scope.tag.position || $scope.tag.position.length <= 0) {
			$scope.errorMsg = 'La position est obligatoire et doit être numérique et supérieure strictement à 0 !';
			return;
		}

		if (!$scope.showNiveauTag && (!$scope.tag.niveau || $scope.tag.niveau.length <= 0)) {
			$scope.errorMsg = 'Le niveau est obligatoire et doit être numérique compris entre ' + $scope.minNiveau + ' et ' + $scope.maxNiveau + ' !';
			return;
		}

        if (!$scope.tag.balise) {
            $scope.errorMsg = 'L\'équivalence html est obligatoire !';
            return;
        }

		if ($scope.showNiveauTag) {
			$scope.tag.niveau = 0;
		}

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
		$scope.successMsg = 'Style ajouté avec succès !';
		$('#tagSuccess').fadeIn('fast').delay(3000).fadeOut('slow');
	};

	$scope.supprimerTag = function() {
		$scope.requestToSend.deleteTag = $scope.fiche;
		$http.post(configuration.URL_REQUEST + '/deleteTag', $scope.requestToSend)
			.success(function(data) {
				if (data === 'err') {
					console.log('Désolé un problème est survenu lors de la suppression');
				} else {
					$scope.tagFlag = data; /* destiné aux tests unitaires */
					$scope.successMsg = 'Style supprimé avec succès !';
					$('#tagSuccess').fadeIn('fast').delay(3000).fadeOut('slow');
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
			$scope.errorMsg = 'La position est obligatoire et doit être numérique et supérieure strictement à 0 !';
			return;
		}

		if (!$scope.showNiveauTag && (!$scope.fiche.niveau || $scope.fiche.niveau.length <= 0)) {
			$scope.errorMsg = 'Le niveau est obligatoire et doit être numérique compris entre ' + $scope.minNiveau + ' et ' + $scope.maxNiveau + ' !';
			return;
		}

        if (!$scope.fiche.balise) {
            $scope.errorMsg = 'L\'équivalence html est obligatoire !';
            return;
        }

		if ($scope.showNiveauTag) {
			$scope.fiche.niveau = 0;
		}

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
		$scope.successMsg = 'Style modifié avec succès !';
		$('#tagSuccess').fadeIn('fast').delay(3000).fadeOut('slow');
	};

	$scope.uploadComplete = function() {
		$scope.clearTag();
		$('#tagAdd').modal('hide');
		$('#tagEdit').modal('hide');
		$scope.afficherTags();
	};

	$scope.preAjouterTag = function() {
		$scope.tag = {
			position: 1
		};
	};

	$scope.preModifierTag = function(tag) {
		$scope.isDisabled = '';
		$scope.fiche = angular.copy(tag);
		if ($scope.fiche.niveau && parseInt($scope.fiche.niveau) > 0) {
			$scope.showNiveauTag = false;
		}

		if ($scope.fiche.libelle == 'Titre 1' || $scope.fiche.libelle == 'Titre 2' || $scope.fiche.libelle == 'Titre 3' || $scope.fiche.libelle == 'Titre 4' || $scope.fiche.libelle == 'Paragraphe' || $scope.fiche.libelle == 'Annotation' || $scope.fiche.libelle == 'Liste à puces' || $scope.fiche.libelle == 'Liste numérotée') { // jshint ignore:line
			// $('#tagLibelle').attr('disabled');
			// $("#tagLibelle").prop('disabled', true);
			$scope.isDisabled = 'disabled';

		}
	};

	$scope.preSupprimerTag = function(tag) {
		$scope.fiche = tag;
		$scope.toDeleteTagName= tag.libelle;
		if ($scope.fiche.libelle != 'Titre 1' && $scope.fiche.libelle != 'Titre 2' && $scope.fiche.libelle != 'Titre 3' && $scope.fiche.libelle != 'Titre 4' && $scope.fiche.libelle != 'Paragraphe' && $scope.fiche.libelle != 'Annotation' && $scope.fiche.libelle != 'Liste à puces' || $scope.fiche.libelle == 'Liste numérotée') { // jshint ignore:line
			$('#tagDelete').modal('show');
		} else {
			$('#tagDeleteDenied').modal('show');
		}
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