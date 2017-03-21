/* File: upgrade.modal.js
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

angular.module('cnedApp').controller('PrintModalCtrl', function ($scope, $rootScope, $uibModalInstance,
                                                                 $window, fileStorageService, workspaceService,
                                                                 content, docSignature, notes) {

    $scope.content = content;
    $scope.docSignature = docSignature;
    $scope.notes = notes;
    $scope.pageA = 1;
    $scope.pageDe = 1;
    $scope.printMode = 0;


    /*
     * Initialize the start and end pages when printing.
     */
    $scope.selectionnerMultiPage = function () {
        $scope.pageA = 1;
        $scope.pageDe = 1;
        $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text('1');
        $('select[data-ng-model="pageA"]').val(1);
        $('select[data-ng-model="pageDe"] + .customSelect .customSelectInner').text('1');
        $('select[data-ng-model="pageDe"]').val(1);
    };

    /*
     * Select the start page for printing
     */
    $scope.selectionnerPageDe = function () {

        $scope.pageDe = parseInt($('select[data-ng-model="pageDe"]').val());
        $scope.pageA = parseInt($('select[data-ng-model="pageA"]').val());

        if ($scope.pageDe > $scope.pageA) {
            $scope.pageA = $scope.pageDe;
            $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text($scope.pageA);
            $('select[data-ng-model="pageA"]').val($scope.pageA);
        }

        var pageDe = parseInt($scope.pageDe);
        $('select[data-ng-model="pageA"] option').prop('disabled', false);

        for (var i = 0; i <= pageDe - 1; i++) {
            $('select[data-ng-model="pageA"] option').eq(i).prop('disabled', true);
        }
    };

    var PRINTMODE = {
        EVERY_PAGES: 0,
        CURRENT_PAGE: 1,
        MULTIPAGE: 2
    };

    /*
     * Print the document according to the chosen mode.
     */
    $scope.printByMode = function () {

        var win = $window.open(); // Keep window reference which is not accessible in promise

        fileStorageService.saveTempFileForPrint($scope.content).then(function (data) {

            workspaceService.saveTempNotesForPrint($scope.notes);

            var printPlan = $scope.printPlan ? 1 : 0;

            var printURL = '#/print?documentId=' + $scope.docSignature + '&plan=' + printPlan + '&mode=' + $scope.printMode;
            if ($scope.printMode === PRINTMODE.CURRENT_PAGE) {
                printURL += ('&page=' + $scope.currentPage);
            } else if ($scope.printMode === PRINTMODE.MULTIPAGE) {
                printURL += ('&pageDe=' + $scope.pageDe + '&pageA=' + $scope.pageA);
            }
            win.location = printURL;
        }, function (err) {
            throw (err);
        });
    };

    $scope.closeModal = function () {
        $uibModalInstance.close();
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
    };


});
