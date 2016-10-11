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

describe('Controller:EditProfilModalCtrl', function () {
    var $scope, controller, modalInstance, timeoutCallback, $interval;


    beforeEach(module('cnedApp'));

    // define the mock people service
    beforeEach(function () {

    });

    beforeEach(inject(function ($controller, $rootScope, _$interval_) {

        $scope = $rootScope.$new();

        modalInstance = {
            opened: {
                then: function (confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            },
            open: function (item) {
                this.opened.confirmCallBack(item);
            },
            close: function () {
                return;
            },
            dismiss: function () {
                return;
            }
        };

        var displayedPopup = {
            msg: ''
        };

        $interval = _$interval_;

        var timeout = function (item) {
            timeoutCallback = item;
        };

        controller = $controller('styleEditModalCtrl', {
            $scope: $scope,
            $modalInstance: modalInstance,
            displayedPopup: displayedPopup,
            $timeout: timeout
        });
    }));

    it('EditProfilModalCtrl:should instantiate the controller properly', function () {
        expect(controller).not.toBeUndefined();

        spyOn(jQuery.fn, 'is').andReturn('toto');
        $scope.currentTagProfil = {
            tagLibelle: '',
            police: '',
            taille: '',
            interligne: '',
            styleValue: '',
            coloration: '',
            spaceSelected: '',
            spaceCharSelected: ''
        };

        modalInstance.open();



        $interval.flush(1000);

        //intervalCallback();


        //timeoutCallback();
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
        expect($scope.policeList).toEqual(1);
        $scope.editStyleChange('taille', 1);
        expect($scope.tailleList).toEqual(1);
        $scope.editStyleChange('interligne', 1);
        expect($scope.interligneList).toEqual(1);
        $scope.editStyleChange('coloration', 1);
        expect($scope.colorList).toEqual(1);
        $scope.editStyleChange('style', 1);
        expect($scope.weightList).toEqual(1);
        $scope.editStyleChange('space', 1);
        expect($scope.spaceSelected).toEqual(1);
        $scope.editStyleChange('spaceChar', 1);
        expect($scope.spaceCharSelected).toEqual(1);
        timeoutCallback();
    });

});