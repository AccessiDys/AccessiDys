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

angular.module('cnedApp').controller('styleEditModalCtrl', function ($scope, $uibModalInstance, $rootScope, $interval, $log, $timeout, profile, profileTagIndex) {
    $scope.requiredFieldErrors = [];
    $scope.profile = profile;
    $scope.profileTagIndex = profileTagIndex;
    $scope.styleName = '';
    $scope.style = {
        police: '',
        taille: '',
        interligne: '',
        styleValue: '',
        spaceSelected: '',
        spaceCharSelected: '',
        coloration: ''
    };

    $uibModalInstance.opened.then(function () {
        $scope.styleName = $scope.profile.profileTags.tags[profileTagIndex].tagDetail.libelle;

        $scope.style = {
            police: $scope.profile.profileTags.tags[profileTagIndex].police,
            taille: $scope.profile.profileTags.tags[profileTagIndex].taille,
            interligne: $scope.profile.profileTags.tags[profileTagIndex].interligne,
            styleValue: $scope.profile.profileTags.tags[profileTagIndex].styleValue,
            space: $scope.profile.profileTags.tags[profileTagIndex].spaceSelected,
            spaceChar: $scope.profile.profileTags.tags[profileTagIndex].spaceCharSelected,
            coloration: $scope.profile.profileTags.tags[profileTagIndex].coloration
        };

        $scope.interValTmp = $interval(function () {
            $interval.cancel($scope.interValTmp);

            /* Selection of the pop-up of modification */
            var modalEdit = $('#styleEditModal');

            // set span text value of customselect
            modalEdit.find('select[data-ng-model="style.police"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].police);
            modalEdit.find('select[data-ng-model="style.taille"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].taille);
            modalEdit.find('select[data-ng-model="style.interligne"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].interligne);
            modalEdit.find('select[data-ng-model="style.styleValue"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].styleValue);
            modalEdit.find('select[data-ng-model="style.space"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].spaceSelected);
            modalEdit.find('select[data-ng-model="style.spaceChar"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].spaceCharSelected);
            modalEdit.find('select[data-ng-model="style.coloration"] + .customSelect .customSelectInner').text($scope.profile.profileTags.tags[profileTagIndex].coloration);

            $scope.editStyleChange('police', $scope.profile.profileTags.tags[profileTagIndex].police);
            $scope.editStyleChange('taille', $scope.profile.profileTags.tags[profileTagIndex].taille);
            $scope.editStyleChange('interligne', $scope.profile.profileTags.tags[profileTagIndex].interligne);
            $scope.editStyleChange('style', $scope.profile.profileTags.tags[profileTagIndex].styleValue);
            $scope.editStyleChange('space', $scope.profile.profileTags.tags[profileTagIndex].spaceSelected);
            $scope.editStyleChange('spaceChar', $scope.profile.profileTags.tags[profileTagIndex].spaceCharSelected);

            $scope.editStyleChange('coloration', $scope.profile.profileTags.tags[profileTagIndex].coloration);


        }, 200);
    });

    $scope.closeModal = function () {
        if (checkRequiredFields()) {
            $scope.profile.profileTags.tags[profileTagIndex].police = $scope.style.police;
            $scope.profile.profileTags.tags[profileTagIndex].taille = $scope.style.taille;
            $scope.profile.profileTags.tags[profileTagIndex].interligne = $scope.style.interligne;
            $scope.profile.profileTags.tags[profileTagIndex].styleValue = $scope.style.styleValue;
            $scope.profile.profileTags.tags[profileTagIndex].spaceSelected = $scope.style.space;
            $scope.profile.profileTags.tags[profileTagIndex].spaceCharSelected = $scope.style.spaceChar;
            $scope.profile.profileTags.tags[profileTagIndex].coloration = $scope.style.coloration;

            $uibModalInstance.close({
                profile: $scope.profile
            });

            reset();
        }
    };

    var reset = function () {
        $scope.requiredFieldErrors = [];
        $scope.profile = {};
        $scope.profileTagIndex = 0;
        $scope.styleName = '';
        $scope.style = {
            police: '',
            taille: '',
            interligne: '',
            styleValue: '',
            spaceSelected: '',
            spaceCharSelected: '',
            coloration: ''
        };
    };


    var checkRequiredFields = function () {
        var isValid = true;

        if ($scope.style.police == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Police ');
        }
        if ($scope.style.taille == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Taille ');
        }
        if ($scope.style.interligne == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Interligne ');
        }
        if ($scope.style.coloration == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Coloration ');
        }
        if ($scope.style.styleValue == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Graisse ');
        }
        if ($scope.style.space == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Espace entre Les mots ');
        }
        if ($scope.style.spaceChar == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Espace entre Les caractères ');
        }

        return isValid;
    };

    $scope.dismissModal = function () {
        $uibModalInstance.dismiss();
        reset();
    };

    $scope.editStyleChange = function (operation, value) {


        switch (operation) {
            case 'police':
                $scope.style.police = value;
                break;
            case 'taille':
                $scope.style.taille = value;
                break;
            case 'interligne':
                $scope.style.interligne = value;
                break;
            case 'coloration':
                $scope.style.coloration = value;
                break;
            case 'style':
                $scope.style.style = value;
                break;
            case 'space':
                $scope.style.space = value;
                break;
            case 'spaceChar':
                $scope.style.spaceChar = value;
                break;
        }

        $log.debug('editStyleChange operation = ' + operation, value);

        $rootScope.$emit('reglesStyleChange', {
            'operation': operation,
            'element': 'shown-text-edit',
            'value': value
        });

        // wait for 2s and force coloration.
        $timeout(function() {
            $rootScope.$emit('reglesStyleChange', {
                'operation' : 'coloration',
                'element' : 'shown-text-edit',
                'value' : $scope.style.coloration
            });
        }, 1000);
    };

});