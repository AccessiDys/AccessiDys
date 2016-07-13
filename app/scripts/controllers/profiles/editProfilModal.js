/* File: editProfilModal.js
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
/* global $:false */
/* jshint loopfunc:true */

angular.module('cnedApp').controller('styleEditModalCtrl', function($scope, $modalInstance, $controller, $rootScope, $timeout, $interval, displayedPopup) {
    $scope.displayedPopup = displayedPopup;

    $modalInstance.opened.then(function() {
        $scope.interValTmp = $interval(function() {
            if ($('#styleEditModal').is(':visible')) {
                $interval.cancel($scope.interValTmp);
                $('#editValidationButton').prop('disabled', false);
                $('.label_action').removeClass('selected_label');
                // $('#' +
                // $scope.currentTagProfil._id).addClass('selected_label');
                $scope.editStyleChange('police', $scope.policeList);
                $scope.editStyleChange('taille', $scope.tailleList);
                $scope.editStyleChange('interligne', $scope.interligneList);
                $scope.editStyleChange('style', $scope.weightList);
                $scope.editStyleChange('space', $scope.spaceSelected);
                $scope.editStyleChange('spaceChar', $scope.spaceCharSelected);
                $scope.editStyleChange('coloration', $scope.colorList);
                $scope.editStyleChange('coloration', $scope.colorList);

                /* Selection du pop-up de Modification */
                var modalEdit = $('#styleEditModal');

                // set span text value of customselect
                $(modalEdit).find('select[data-ng-model="editTag"] + .customSelect .customSelectInner').text($scope.currentTagProfil.tagLibelle);
                $(modalEdit).find('select[data-ng-model="policeList"] + .customSelect .customSelectInner').text($scope.currentTagProfil.police);
                $(modalEdit).find('select[data-ng-model="tailleList"] + .customSelect .customSelectInner').text($scope.currentTagProfil.taille);
                $(modalEdit).find('select[data-ng-model="interligneList"] + .customSelect .customSelectInner').text($scope.currentTagProfil.interligne);
                $(modalEdit).find('select[data-ng-model="weightList"] + .customSelect .customSelectInner').text($scope.currentTagProfil.styleValue);
                $(modalEdit).find('select[data-ng-model="colorList"] + .customSelect .customSelectInner').text($scope.currentTagProfil.coloration);
                $(modalEdit).find('select[data-ng-model="spaceSelected"] + .customSelect .customSelectInner').text($scope.currentTagProfil.spaceSelected);
                $(modalEdit).find('select[data-ng-model="spaceCharSelected"] + .customSelect .customSelectInner').text($scope.currentTagProfil.spaceCharSelected);
            }
        }, 200);
    });

    $scope.closeModal = function() {
        $modalInstance.close({
            type : $scope.displayedPopup,
            editTag : $scope.editTag,
            tagList : $scope.tagList,
            policeList : $scope.policeList,
            tailleList : $scope.tailleList,
            interligneList : $scope.interligneList,
            weightList : $scope.weightList,
            colorList : $scope.colorList,
            spaceSelected : $scope.spaceSelected,
            spaceCharSelected : $scope.spaceCharSelected
        });
    };

    $scope.dismissModal = function() {
        $modalInstance.dismiss($scope.displayedPopup);
    };

    $scope.editStyleChange = function(operation, value) {
        switch (operation) {
        case 'police':
            $scope.policeList = value;
            break;
        case 'taille':
            $scope.tailleList = value;
            break;
        case 'interligne':
            $scope.interligneList = value;
            break;
        case 'coloration':
            $scope.colorList = value;
            break;
        case 'style':
            $scope.weightList = value;
            break;
        case 'space':
            $scope.spaceSelected = value;
            break;
        case 'spaceChar':
            $scope.spaceCharSelected = value;
            break;
        }
        $timeout(function() {
            $rootScope.$emit('reglesStyleChange', {
                'operation' : operation,
                'element' : 'shown-text-edit',
                'value' : value
            });
            // wait for 2s and force coloration.
            $timeout(function() {
                $rootScope.$emit('reglesStyleChange', {
                    'operation' : 'coloration',
                    'element' : 'shown-text-edit',
                    'value' : $scope.colorList
                });
            }, 1000);
        });
    };

});