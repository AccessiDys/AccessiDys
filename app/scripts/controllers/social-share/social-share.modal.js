/* File: social-share.modal.js
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

angular.module('cnedApp').controller('SocialShareModalCtrl', function ($rootScope, $scope, $uibModalInstance, dropbox, EmailService, mode, itemToShare) {


    $scope.hasRightToShare = false;
    $scope.mode = '';
    $scope.shareAnnotation = false;
    $scope.hasAnnotation = false;
    $scope.itemToShare = {
        linkToShare: '',
        name: '',
        annotationsToShare: []
    };
    $scope.shareMethod = '';
    $scope.form = {
        email: ''
    };

    $uibModalInstance.then(function () {
        $scope.itemToShare = itemToShare;
        $scope.mode = mode;
    });


    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };

    // TODO Refaire le bouton checbox
    $scope.changed = function (shareAnnotation) {
        $scope.shareAnnotation = shareAnnotation;
    };

    /**
     * If there are annotations then upload to dropbox
     */
    $scope.processAnnotation = function () {
        localStorage.setItem('lockOperationDropBox', true);

        if ($scope.shareAnnotation && $scope.itemToShare.docFullName && $scope.itemToShare.annotationsToShare) {

            var fileName = $scope.itemToShare.docFullName + '.json';

            dropbox.upload(fileName, $scope.itemToShare.annotationToShare, $rootScope.currentUser.dropbox.accessToken, true)
                .then(function () {
                    dropbox.shareLink(fileName, $rootScope.currentUser.dropbox.accessToken)
                        .then(function (result) {
                            $scope.itemToShare.linkToShare += '&annotation=' + result.url;
                            $scope.itemToShare.linkToShare = encodeURIComponent($scope.itemToShare.linkToShare);
                            $scope.hasRightToShare = true;
                            localStorage.setItem('lockOperationDropBox', false);
                        });
                });
        } else {
            localStorage.setItem('lockOperationDropBox', false);

            $scope.itemToShare.linkToShare = encodeURIComponent($scope.itemToShare.linkToShare);
            $scope.hasRightToShare = true;
        }
    };

    $scope.shareByEmail = function () {

        if (EmailService.verifyEmail($scope.form.email)) {

            var emailParams = {
                to: $scope.form.email,
                prenom: $rootScope.currentUser.local.prenom, // the first name
                fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                content: '',
                encoded: '',
                doc: null
            };

            if ($scope.mode === 'document') {
                // Document mode
                emailParams.content = ' a utilisé Accessidys pour partager un fichier avec vous !  ' + $scope.itemToShare.linkToShare;
                emailParams.encoded = '<span> vient d\'utiliser Accessidys pour partager ce fichier avec vous : <a href=' + $scope.itemToShare.linkToShare + '>' + $scope.itemToShare.name + '</a> </span>';
                emailParams.doc = $scope.itemToShare.name;

            } else if ($scope.mode === 'profile') {
                // Profile Mode
                emailParams.content = ' vient de partager avec vous un profil sur l\'application Accessidys.  ' + $scope.itemToShare.linkToShare;
                emailParams.encoded = '<span> vient de partager avec vous un profil sur l\'application Accessidys.   <a href=' + $scope.itemToShare.linkToShare + '>Lien de ce profil</a> </span>';
                emailParams.doc = $scope.itemToShare.linkToShare;
            }

            EmailService.sendMail(emailParams)
                .then(function () {
                    $uibModalInstance.close({
                        status: 'OK'
                    });
                }, function () {
                    $uibModalInstance.close({
                        status: 'KO'
                    });
                });

        } else {
            // TODO show errors
        }
    }

});