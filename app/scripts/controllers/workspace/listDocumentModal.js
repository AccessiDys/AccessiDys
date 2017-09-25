/* File: listDocumentModal.js
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
 * If not, see <http:// www.gnu.org/licenses/>.
 *
 */
'use strict';

/* jshint loopfunc:true */
angular.module('cnedApp').controller('listDocumentModalCtrl', function ($scope, $controller, $uibModalInstance, LoaderService, fileStorageService, configuration) {

    $scope.sortType = 'dateModification';
    $scope.sortReverse = true;
    $scope.configuration = configuration;


    $scope.getListDocument = function () {
        LoaderService.showLoader('document.message.info.load', false);
        LoaderService.setLoaderProgress(20);

        fileStorageService.list('document').then(function (listDocument) {
            LoaderService.setLoaderProgress(100);
            LoaderService.hideLoader();

            if (listDocument) {

                $scope.listDocument = listDocument;
            } else {
                $scope.listDocument = [];
            }


            for (var i = 0; i < $scope.listDocument.length; i++) {
                $scope.listDocument[i].showed = true;
                $scope.listDocument[i].filenameEncoded = $scope.listDocument[i].filename.replace(/ /g, '_');
            }


        }, function () {
            LoaderService.hideLoader();
        });
    };

    $scope.getListDocument();



    /**
     * closes a modal instance
     */
    $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.searchQuery = {};

    /* Filter on the document name to display */
    $scope.specificFilterForModal = function () {
        // browse documents with the loop
        for (var i = 0; i < $scope.listDocument.length; i++) {
            $scope.listDocument[i].showed = $scope.listDocument[i].filename.toLowerCase().indexOf($scope.searchQuery.query.toLowerCase()) !== -1;
        }
    };
});