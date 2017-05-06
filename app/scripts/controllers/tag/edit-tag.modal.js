/* File: edit-document-title.modal.js
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
/* jshint loopfunc:true */

angular.module('cnedApp').controller('EditTagModalCtrl', function ($scope, $uibModalInstance, ToasterService, configuration, mode, tag) {

    $scope.mode = mode;
    $scope.showNiveauTag = true;
    $scope.minNiveau = 1; // the minimum level
    $scope.maxNiveau = 6; //the  maximum level
    $scope.isDisabled = false;
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

    $scope.tag = tag;
    $scope.form = {
        files: []
    };

    $uibModalInstance.opened.then(function () {


        if ($scope.mode === 'edit') {
            if ($scope.tag.niveau && parseInt($scope.tag.niveau) > 0) {
                $scope.showNiveauTag = false;
            }

            if ($scope.tag.libelle === 'Titre 1' || $scope.tag.libelle === 'Titre 2' || $scope.tag.libelle === 'Titre 3' || $scope.tag.libelle === 'Titre 4' || $scope.tag.libelle === 'Paragraphe' || $scope.tag.libelle === 'Annotation' || $scope.tag.libelle === 'Liste à puces' || $scope.tag.libelle === 'Liste numérotée') { // jshint ignore:line
                $scope.isDisabled = true;
            }
        }

    });


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    // show the default level
    $scope.showDefaultNiveau = function (tag) {
        tag.niveau = 1;
    };


    $scope.saveTag = function () {

        if (!$scope.tag || !$scope.tag.libelle || $scope.tag.libelle.length <= 0) {
            ToasterService.showToaster('#edit-tag-error-toaster', 'style.message.save.ko.title.mandatory');
        } else if (!$scope.tag.position || $scope.tag.position.length <= 0) {
            ToasterService.showToaster('#edit-tag-error-toaster', 'style.message.save.ko.position.mandatory');
        } else if (!$scope.showNiveauTag && (!$scope.tag.niveau || $scope.tag.niveau.length <= 0)) {
            ToasterService.showToaster('#edit-tag-error-toaster', 'style.message.save.ko.level.mandatory');
        } else if (!$scope.tag.balise) {
            ToasterService.showToaster('#edit-tag-error-toaster', 'style.message.save.ko.html.mandatory');
            return;
        }

        if ($scope.showNiveauTag) {
            $scope.tag.niveau = 0;
        }

        var fd = new FormData();
        if ($scope.form.files && $scope.form.files.length > 0) {
            fd.append('uploadedFile', $scope.form.files[0]);
        }
        fd.append('tagData', JSON.stringify({
            id: localStorage.getItem('compteId'),
            tag: $scope.tag
        }));
        var xhr = new XMLHttpRequest();
        xhr.addEventListener('load', $scope.uploadComplete, false);
        xhr.addEventListener('error', $scope.uploadFailed, false);
        if ($scope.mode === 'create') {
            xhr.open('POST', '/addTag');
        } else {
            xhr.open('POST', '/updateTag');
        }

        xhr.send(fd);

    };

    $scope.uploadComplete = function () {
        $uibModalInstance.close({
            status: 'ok'
        });
    };

    $scope.uploadFailed = function () {
        $uibModalInstance.close({
            status: 'ko'
        });
    };

    $scope.resetImportFile = function () {
        $scope.form.files = [0];
    };


});