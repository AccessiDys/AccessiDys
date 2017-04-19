/*
 * File: listDocumentModal.js
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

describe('Controller: VocalHelpModalCtrl', function () {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance, $localForage;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _$localForage_) {
        modalInstance = {
            close: function () {
                return;
            },
            dismiss: function () {
                return;
            }
        };

        spyOn(modalInstance, 'close').and.callThrough();

        $localForage = _$localForage_;

        spyOn($localForage, 'setItem').and.callThrough();
        spyOn($localForage, 'getItem').and.callThrough();

        $scope = $rootScope.$new();

        $controller('VocalHelpModalCtrl', {
            $scope: $scope,
            $uibModalInstance: modalInstance,
            $localForage: _$localForage_
        });
    }));

    it('VocalHelpModalCtrl:init()', function () {

        expect($scope.checkbox).toBeDefined();
        expect($scope.checkbox.checked).toBeDefined();
        expect($scope.checkbox.checked).toEqual(false);

        expect($localForage.getItem).toHaveBeenCalled();
    });

    it('VocalHelpModalCtrl:onCheckboxChange()', function () {

        expect($scope.onCheckboxChange).toBeDefined();

        $scope.onCheckboxChange();
        expect($localForage.setItem).toHaveBeenCalled();

        $scope.checkbox.checked = true;
        $scope.onCheckboxChange();
        expect($localForage.setItem).toHaveBeenCalledWith('vocalHelpShowed', true);

    });

    it('VocalHelpModalCtrl:closeModal()', function () {

        expect($scope.closeModal).toBeDefined();

        $scope.closeModal();

        expect(modalInstance.close).toHaveBeenCalled();
    });


});