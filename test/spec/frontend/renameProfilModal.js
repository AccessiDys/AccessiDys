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

describe('Controller:ProfilesRenommageModalCtrl', function () {
    var $scope, controller, modalInstance;


    beforeEach(module('cnedApp'));

    // define the mock people service
    beforeEach(function () {

    });

    beforeEach(inject(function ($controller, $rootScope) {

        $scope = $rootScope.$new();

        modalInstance = {
            close: function () {
                return;
            },
            dismiss: function () {
                return;
            }
        };

        var profile = {
            nom: 'test'
        };

        controller = $controller('profilesRenommageModalCtrl', {
            $scope: $scope,
            $modalInstance: modalInstance,
            profile: profile
        });
    }));

    it('ProfilesRenommageModalCtrl:should instantiate the controller properly', function () {
        expect(controller).not.toBeUndefined();

        expect($scope.closeModal).toBeDefined();
        expect($scope.dismissModal).toBeDefined();

        expect($scope.profile).toBeDefined();
        expect($scope.profileName).toBeDefined();

        expect($scope.profile).toEqual(profile);
        expect($scope.profileName ).toEqual(profile.nom);

    });

    it('ProfilesRenommageModalCtrl:closeModal', function () {
        spyOn(modalInstance, 'close');
        $scope.closeModal();

        expect(modalInstance.close).toHaveBeenCalled();

    });

    it('ProfilesRenommageModalCtrl:dismissModal', function () {
        spyOn(modalInstance, 'dismiss');
        $scope.dismissModal();

        expect(modalInstance.dismiss).toHaveBeenCalled();

    });


});