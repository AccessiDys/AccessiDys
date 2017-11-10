/* File: styleEditModal.js
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

angular.module('cnedApp').controller('styleEditModalCtrl', function ($scope, $uibModalInstance, $rootScope, $interval, $log, $timeout, profile, profileTagIndex, UtilsService) {

    $scope.isApplyAll = false;
    $scope.requiredFieldErrors = [];
    $scope.profile = profile;
    $rootScope.tmpProfile = angular.copy(profile);
    $scope.profileTagIndex = profileTagIndex;
    $scope.styleName = '';
    $scope.style = {
        police: '',
        taille: 0,
        interligne: 0,
        styleValue: '',
        spaceSelected: 0,
        spaceCharSelected: 0,
        coloration: '',
        colorationType: '',
        colors: '',
        colorsList: [],
        souffleType: '[Maj. - \'.\']'
    };

    var reset = function () {
        $scope.requiredFieldErrors = [];
        $scope.profile = {};
        $scope.profileTagIndex = 0;
        $scope.styleName = '';
        $scope.style = {
            police: '',
            taille: 0,
            interligne: 0,
            styleValue: '',
            spaceSelected: 0,
            spaceCharSelected: 0,
            coloration: '',
            colorationType: '',
            colors: '',
            colorsList: [],
            souffleType: '[Maj. - \'.\']'
        };
    };

    var generateStyle = function(){

        $scope.text = angular.copy($rootScope.tmpProfile.data.profileTags[profileTagIndex].texte);

        $rootScope.tmpProfile.data.profileTags[profileTagIndex].police = $scope.style.police;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].taille = $scope.style.taille;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].interligne = $scope.style.interligne;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].styleValue = $scope.style.styleValue;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].spaceSelected = $scope.style.spaceSelected;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].spaceCharSelected = $scope.style.spaceCharSelected;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].colorationType = $scope.style.colorationType;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].colors = $scope.style.colors;
        if($scope.style.colorationType === 'Colorer les groupes de souffle' || $scope.style.colorationType === 'Surligner les groupes de souffle'){
            $rootScope.tmpProfile.data.profileTags[profileTagIndex].coloration = $scope.style.colorationType + " " + $scope.style.souffleType + " " + $scope.style.colors;
        } else {
            $rootScope.tmpProfile.data.profileTags[profileTagIndex].coloration = $scope.style.colorationType + " " + $scope.style.colors;
        }

        $rootScope.tmpProfile.data.profileTags[profileTagIndex].colorsList = $scope.style.colorsList;
        $rootScope.tmpProfile.data.profileTags[profileTagIndex].souffleType = $scope.style.souffleType;


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
        if ($scope.style.colorationType == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Type de coloration ');
        }
        if ($scope.style.coloration == null) { // jshint ignore:line
            $scope.requiredFieldErrors.push(' Couleurs ');
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

    $uibModalInstance.opened.then(function () {
        UtilsService.verifyColorsList($scope.profile.data.profileTags[profileTagIndex]);

        $scope.styleName = $scope.profile.data.profileTags[profileTagIndex].tagDetail.libelle;

        $scope.style = {
            police: $scope.profile.data.profileTags[profileTagIndex].police,
            taille: $scope.profile.data.profileTags[profileTagIndex].taille,
            interligne: $scope.profile.data.profileTags[profileTagIndex].interligne,
            styleValue: $scope.profile.data.profileTags[profileTagIndex].styleValue,
            spaceSelected: $scope.profile.data.profileTags[profileTagIndex].spaceSelected,
            spaceCharSelected: $scope.profile.data.profileTags[profileTagIndex].spaceCharSelected,
            coloration: $scope.profile.data.profileTags[profileTagIndex].coloration,
            colorationType: $scope.profile.data.profileTags[profileTagIndex].colorationType,
            colors: $scope.profile.data.profileTags[profileTagIndex].colors,
            colorsList: $scope.profile.data.profileTags[profileTagIndex].colorsLists,
            souffleType: $scope.profile.data.profileTags[profileTagIndex].souffleType
        };

        generateStyle();

        $scope.interValTmp = $interval(function () {
            $interval.cancel($scope.interValTmp);

            /* Selection of the pop-up of modification */
            var modalEdit = $('#styleEditModal');

            // set span text value of customselect
            modalEdit.find('select[data-ng-model="style.police"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].police);
            modalEdit.find('select[data-ng-model="style.taille"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].taille);
            modalEdit.find('select[data-ng-model="style.interligne"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].interligne);
            modalEdit.find('select[data-ng-model="style.styleValue"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].styleValue);
            modalEdit.find('select[data-ng-model="style.spaceSelected"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].spaceSelected);
            modalEdit.find('select[data-ng-model="style.spaceCharSelected"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].spaceCharSelected);
            modalEdit.find('select[data-ng-model="style.colorationType"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].colorationType);
            modalEdit.find('select[data-ng-model="style.colors"] + .customSelect .customSelectInner').text($scope.profile.data.profileTags[profileTagIndex].colors);

            $scope.editStyleChange('police', $scope.profile.data.profileTags[profileTagIndex].police);
            $scope.editStyleChange('taille', $scope.profile.data.profileTags[profileTagIndex].taille);
            $scope.editStyleChange('interligne', $scope.profile.data.profileTags[profileTagIndex].interligne);
            $scope.editStyleChange('style', $scope.profile.data.profileTags[profileTagIndex].styleValue);
            $scope.editStyleChange('spaceSelected', $scope.profile.data.profileTags[profileTagIndex].spaceSelected);
            $scope.editStyleChange('spaceCharSelected', $scope.profile.data.profileTags[profileTagIndex].spaceCharSelected);
            $scope.editStyleChange('colorationType', $scope.profile.data.profileTags[profileTagIndex].colorationType);
            $scope.editStyleChange('colors', $scope.profile.data.profileTags[profileTagIndex].colors);
            $scope.editStyleChange('colorsList', $scope.profile.data.profileTags[profileTagIndex].colorsList);


        }, 200);
    });

    $scope.closeModal = function () {
        if (checkRequiredFields()) {
            $scope.profile.data.profileTags[profileTagIndex].police = $scope.style.police;
            $scope.profile.data.profileTags[profileTagIndex].taille = $scope.style.taille;
            $scope.profile.data.profileTags[profileTagIndex].interligne = $scope.style.interligne;
            $scope.profile.data.profileTags[profileTagIndex].styleValue = $scope.style.styleValue;
            $scope.profile.data.profileTags[profileTagIndex].spaceSelected = $scope.style.spaceSelected;
            $scope.profile.data.profileTags[profileTagIndex].spaceCharSelected = $scope.style.spaceCharSelected;
            $scope.profile.data.profileTags[profileTagIndex].coloration = $scope.style.coloration;
            $scope.profile.data.profileTags[profileTagIndex].colorationType = $scope.style.colorationType;
            $scope.profile.data.profileTags[profileTagIndex].colors = $scope.style.colors;
            $scope.profile.data.profileTags[profileTagIndex].colorsList = $scope.style.colorsList;



            $uibModalInstance.close({
                profile: $scope.profile,
                isApplyAll: $scope.isApplyAll
            });


            reset();
        }
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
            case 'colorationType':
                $scope.style.colorationType = value;
                if(value === 'Pas de coloration'){
                    $scope.style.colors = '';
                    $scope.style.colorsList = [];
                } else if(value === 'Colorer les groupes de souffle' || value === 'Surligner les groupes de souffle'){
                    $scope.style.coloration = $scope.style.colorationType + " " + $scope.style.souffleType + " " + $scope.style.colors;
                } else {
                    $scope.style.coloration = $scope.style.colorationType + " " + $scope.style.colors;
                }
                break;
            case 'souffleType':
                $scope.style.coloration = $scope.style.colorationType + " " + $scope.style.souffleType + " " + $scope.style.colors;
                break;
            case 'colors':
                switch (value) {
                    case 'RBV':
                        $scope.style.colorsList = ['#D90629', '#066ED9', '#4BD906'];
                        break;
                    case 'RVJ':
                        $scope.style.colorsList = ['#D90629', '#4BD906', '#ECE20F'];
                        break;
                    case 'RBVJ':
                        $scope.style.colorsList = ['#D90629', '#066ED9', '#4BD906', '#ECE20F'];
                        break;
                }
                $scope.style.colors = value;
                $scope.style.coloration = $scope.style.colorationType + " " + $scope.style.colors;
                break;
            case 'colorsList':
                $scope.style.colorsList = value;
                break;
            case 'style':
                $scope.style.style = value;
                break;
            case 'spaceSelected':
                $scope.style.spaceSelected = value;
                break;
            case 'spaceCharSelected':
                $scope.style.spaceCharSelected = value;
                break;
        }

        generateStyle();

        $log.debug('editStyleChange operation = ' + operation, value);

    };

});