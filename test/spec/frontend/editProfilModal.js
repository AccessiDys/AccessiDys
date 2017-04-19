/* File: profiles.js
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

/* global spyOn:false */
'use strict';

describe('Controller:EditProfilModalCtrl', function () {
    var $scope, controller, modalInstance, $interval, profile, profileTagIndex;


    beforeEach(module('cnedApp'));

    // define the mock people service
    beforeEach(function () {

        profile = {
            nom: 'test',
            profileTags: {
                type: 'tags',
                tags: [{
                    _id: '58bd55d2cfdeac0100382092',
                    coloration: 'Colorer les lignes RBV',
                    id_tag: '58b686cfb102ed01008bb6a7',
                    interligne: '1',
                    police: 'opendyslexicregular',
                    profil: '58b7b5e0c589b701007af018',
                    spaceCharSelected: 1,
                    spaceSelected: 1,
                    style: '<h1>Titre 1: AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap',
                    styleValue: 'Gras',
                    tag: '58b686cfb102ed01008bb6a7',
                    tagDetail: {
                        _id: '58b686cfb102ed01008bb6a7',
                        libelle: 'Titre 1',
                        niveau: 1,
                        position: 1,
                        balise: 'h1'
                    },
                    taille: '24',
                    texte: '<h1>Titre 1: AccessiDys facilite la lecture des documents, livres et pages web. AccessiDys vise les personnes en situation de handicap'
                }]
            }
        };

        profileTagIndex = 0;

    });

    beforeEach(inject(function ($controller, $rootScope, _$interval_, $log) {

        $scope = $rootScope.$new();

        modalInstance = {
            opened: {
                then: function(cb){
                    cb();
                }
            },
            close: function () {
                return;
            },
            dismiss: function () {
                return;
            }
        };

        $interval = _$interval_;

        controller = $controller('styleEditModalCtrl', {
            $scope: $scope,
            $uibModalInstance: modalInstance,
            $rootScope: $rootScope,
            $interval: $interval,
            $log: $log,
            profile: profile,
            profileTagIndex: profileTagIndex
        });

    }));

    it('EditProfilModalCtrl:should instantiate the controller properly', function () {
        expect(controller).not.toBeUndefined();

        expect($scope.closeModal).toBeDefined();
        expect($scope.editStyleChange).toBeDefined();
        expect($scope.dismissModal).toBeDefined();

        expect($scope.style).toEqual({
            police: 'opendyslexicregular',
            taille: '24',
            interligne: '1',
            styleValue: 'Gras',
            space: 1,
            spaceChar: 1,
            coloration: 'Colorer les lignes RBV'
        });

    });

    it('EditProfilModalCtrl:closeModal', function () {
        spyOn(modalInstance, 'close');
        $scope.closeModal();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('EditProfilModalCtrl:dismissModal', function () {
        spyOn(modalInstance, 'dismiss');
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('EditProfilModalCtrl:editStyleChange', function () {

        $scope.editStyleChange('police', 1);
        expect($scope.style.police).toEqual(1);
        $scope.editStyleChange('taille', 1);
        expect($scope.style.taille).toEqual(1);
        $scope.editStyleChange('interligne', 1);
        expect($scope.style.interligne).toEqual(1);
        $scope.editStyleChange('coloration', 1);
        expect($scope.style.coloration).toEqual(1);
        $scope.editStyleChange('style', 1);
        expect($scope.style.style).toEqual(1);
        $scope.editStyleChange('space', 1);
        expect($scope.style.space).toEqual(1);
        $scope.editStyleChange('spaceChar', 1);
        expect($scope.style.spaceChar).toEqual(1);
    });

});