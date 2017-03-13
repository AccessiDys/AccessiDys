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
/* global jQuery */
'use strict';

describe('Controller:DetailProfilModalCtrl', function () {
    var $scope, controller, modalInstance, profilsService, template, profile, q, deferred;

    beforeEach(module('cnedApp'));

    beforeEach(function() {
        modalInstance = {
            close: function () {
                return;
            },
            dismiss: function () {
                return;
            }
        };

        template = 'update';
        profile = {
            nom: 'test'
        };

        profilsService = {
            lookForExistingProfile: function (isAppOnline, profile) {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve(undefined);
                return deferred.promise;
            },
            addProfil: function () {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve({});
                return deferred.promise;
            },
            updateProfil: function () {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve({});
                return deferred.promise;
            }
        };

        spyOn(profilsService, 'lookForExistingProfile').andCallThrough();
        spyOn(profilsService, 'addProfil').andCallThrough();
        spyOn(profilsService, 'updateProfil').andCallThrough();
    });

    beforeEach(inject(function ($controller, $rootScope, $q) {

        q = $q;
        $scope = $rootScope.$new();

        controller = $controller('profilesAffichageModalCtrl', {
            $scope: $scope,
            $modalInstance: modalInstance,
            $rootScope: $rootScope.$new(),
            profilsService: profilsService,
            template: template,
            profile: profile
        });
    }));

    it('DetailProfilModalCtrl:should instantiate the controller properly', function () {
        expect(controller).not.toBeUndefined();

        // Methods
        expect($scope.editTag).toBeDefined();
        expect($scope.editName).toBeDefined();
        expect($scope.dismissModal).toBeDefined();
        expect($scope.save).toBeDefined();

        // Variables
        expect($scope.requiredFieldErrors).toBeDefined();
        expect($scope.requiredFieldErrors).toEqual([]);
        expect($scope.duplicateNameError).toBeDefined();
        expect($scope.duplicateNameError).toEqual(false);
    });

    it('DetailProfilModalCtrl:editTag', function () {
        spyOn(modalInstance, 'close');
        $scope.editTag();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('DetailProfilModalCtrl:editName', function () {
        spyOn(modalInstance, 'close');
        $scope.editName();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('DetailProfilModalCtrl:dismissModal', function () {
        spyOn(modalInstance, 'dismiss');
        $scope.dismissModal();
        expect($scope.loader).toEqual(false);
        expect($scope.loaderMsg).toEqual('');
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('DetailProfilModalCtrl:save', function () {
        $scope.template = 'create';
        $scope.save();
        expect(profilsService.lookForExistingProfile).toHaveBeenCalled();

        $scope.template = 'update';
        $scope.save();
        expect(profilsService.lookForExistingProfile).toHaveBeenCalled();

        $scope.template = 'duplicate';
        $scope.save();
        expect(profilsService.lookForExistingProfile).toHaveBeenCalled();
    });

});