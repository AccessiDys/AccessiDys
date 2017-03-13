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

angular.module('cnedApp').controller('TagCtrl', function ($scope, $http, configuration, tagsService, Analytics, gettextCatalog, $timeout) {

    $scope.minNiveau = 1; // the minimum level
    $scope.maxNiveau = 6; //the  maximum level

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

    $scope.showNiveauTag = true;

    $scope.requestToSend = {};
    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    // show the default level
    $scope.showDefaultNiveau = function (tag) {
        tag.niveau = 1;
    };

    // get the level of the label
    $scope.getLibelleNiveau = function (nivNum) {
        var nivLibelle = 'Par défaut';
        if (nivNum && parseInt(nivNum) > 0) {
            nivLibelle = 'Niveau ' + nivNum;
        }
        return nivLibelle;
    };

    $scope.clearUploadPicto = function () {
        $scope.files = [];
        $scope.errorMsg = '';
        $('#docUploadPdf').val('');
        $('.filename_show').val('');
    };

    $scope.clearTag = function () {
        $scope.clearUploadPicto();
        $scope.tag = {};
        $scope.fiche = {};
        $scope.showNiveauTag = true;
    };

    // display tags
    $scope.afficherTags = function () {
        $scope.requestToSend = {};
        if (localStorage.getItem('compteId')) {
            $scope.requestToSend = {
                id: localStorage.getItem('compteId')
            };
        }
        tagsService.getTags($scope.requestToSend).then(function (data) {
            $scope.listTags = data;
            localStorage.setItem('listTags', JSON.stringify($scope.listTags));
        });
    };

    // add a tag
    $scope.ajouterTag = function () {
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

        $scope.showToaster('#tag-success-toaster', 'style.message.save.ok');
    };

    // delete a tag
    $scope.supprimerTag = function () {
        $scope.requestToSend.deleteTag = $scope.fiche;
        $http.post(configuration.URL_REQUEST + '/deleteTag', $scope.requestToSend)
            .success(function (data) {
                if (data === 'err') {
                    console.log('Désolé un problème est survenu lors de la suppression');
                } else {
                    $scope.tagFlag = data; /* destiné aux tests unitaires */

                    $scope.showToaster('#tag-success-toaster', 'style.message.delete.ok');
                    $scope.afficherTags();
                    $scope.fiche = {};
                }
            });


    };

    // update a tag
    $scope.modifierTag = function () {
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
        if ($scope.files && $scope.files.length >= 0) {
            fd.append('uploadedFile', $scope.files[0]);
        }
        fd.append('tagData', JSON.stringify($scope.requestToSend));
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', $scope.uploadComplete, false);
        xhr.addEventListener('error', $scope.uploadFailed, false);
        xhr.open('POST', configuration.URL_REQUEST + '/updateTag');
        xhr.send(fd);
        $scope.showToaster('#tag-success-toaster', 'style.message.edit.ok');
    };

    $scope.uploadComplete = function () {
        $scope.clearTag();
        $('#tagAdd').modal('hide');
        $('#tagEdit').modal('hide');
        $scope.afficherTags();
    };

    $scope.preAjouterTag = function () {
        $scope.tag = {
            position: 1
        };

        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/create.html');
    };

    $scope.preModifierTag = function (tag) {
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

        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/update.html');
    };

    $scope.preSupprimerTag = function (tag) {
        $scope.fiche = tag;
        $scope.toDeleteTagName = tag.libelle;
        if ($scope.fiche.libelle != 'Titre 1' && $scope.fiche.libelle != 'Titre 2' && $scope.fiche.libelle != 'Titre 3' && $scope.fiche.libelle != 'Titre 4' && $scope.fiche.libelle != 'Paragraphe' && $scope.fiche.libelle != 'Annotation' && $scope.fiche.libelle != 'Liste à puces' || $scope.fiche.libelle == 'Liste numérotée') { // jshint ignore:line
            $('#tagDelete').modal('show');
        } else {
            $('#tagDeleteDenied').modal('show');
        }

        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/delete.html');
    };

    $scope.afficherTags();

    $scope.setFiles = function (element) {
        $scope.files = [];
        $scope.errorMsg = '';
        var field_txt = '';
        $scope.$apply(function () {
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

    $scope.toasterMsg = '';
    $scope.forceToasterApdapt = false;
    $scope.listTagsByProfilToaster = [];

    /**
     * Show success toaster
     * @param msg
     */
    $scope.showToaster = function (id, msg) {
        $scope.listTagsByProfilToaster = JSON.parse(localStorage.getItem('listTagsByProfil'));
        $scope.toasterMsg = '<h1>' + gettextCatalog.getString(msg) + '</h1>';
        $scope.forceToasterApdapt = true;
        $timeout(function () {
            angular.element(id).fadeIn('fast').delay(10000).fadeOut('fast');
            $scope.forceToasterApdapt = false;
        }, 0);
    };

});