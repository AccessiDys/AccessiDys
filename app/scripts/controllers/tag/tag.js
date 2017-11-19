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

angular.module('cnedApp').controller('TagCtrl', function ($scope, $http, configuration, tagsService, Analytics, ToasterService, gettextCatalog, UtilsService, $log) {

    $scope.requestToSend = {};
    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    // get the level of the label
    $scope.getLibelleNiveau = function (nivNum) {
        var nivLibelle = 'Par défaut';
        if (nivNum && parseInt(nivNum) > 0) {
            nivLibelle = 'Niveau ' + nivNum;
        }
        return nivLibelle;
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


    $scope.create = function () {

        tagsService.openEditModal('create', {
            position: 1
        }).then(function (result) {
            if (result.status === 'ok') {
                ToasterService.showToaster('#tag-success-toaster', 'style.message.save.ok');
            } else {
                ToasterService.showToaster('#tag-success-toaster', 'style.message.save.ko');
            }

            $scope.afficherTags();
        });

        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/create.html');
    };

    $scope.edit = function (tag) {

        $log.debug('Edit style', tag);

        tagsService.openEditModal('edit', angular.copy(tag)).then(function (result) {
            if (result.status === 'ok') {
                ToasterService.showToaster('#tag-success-toaster', 'style.message.edit.ok');
            } else {
                ToasterService.showToaster('#tag-success-toaster', 'style.message.save.ko');
            }

            $scope.afficherTags();
        });

        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/update.html');
    };

    $scope.delete = function (tag) {

        if (tag.libelle !== 'Titre 1' && tag.libelle !== 'Titre 2' && tag.libelle !== 'Titre 3' && tag.libelle !== 'Titre 4' && tag.libelle !== 'Paragraphe' && tag.libelle !== 'Annotation' && tag.libelle !== 'Liste à puces' && tag.libelle !== 'Liste numérotée') { // jshint ignore:line

            UtilsService.openConfirmModal('style.label.delete.title',
                gettextCatalog.getString('style.label.delete.anwser').replace('style.label', tag.libelle), true)
                .then(function () {

                    $scope.requestToSend.deleteTag = tag;
                    $http.post(configuration.BASE_URL  + '/deleteTag', $scope.requestToSend)
                        .success(function (data) {
                            if (data === 'err') {
                            } else {
                                $scope.tagFlag = data;
                                /* destiné aux tests unitaires */

                                ToasterService.showToaster('#tag-success-toaster', 'style.message.delete.ok');
                                $scope.afficherTags();
                            }
                        });

                });
        } else {
            UtilsService.showInformationModal('Attention', 'Le style sélectionné ne peut être supprimé.', null, true);
        }


        // angular-google-analytics tracking pages
        Analytics.trackPage('/style/delete.html');
    };
});