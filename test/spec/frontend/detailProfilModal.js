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
    var $scope, controller, modalInstance, intervalCallback, timeoutCallback;


    beforeEach(module('cnedApp'));


    // define the mock people service
    beforeEach(function () {

    });


    beforeEach(inject(function ($controller, $rootScope) {

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

        var interval = function (item1) {
            intervalCallback = item1;
        };

        var timeout = function (item) {
            timeoutCallback = item;
        };


        controller = $controller('profilesAffichageModalCtrl', {
            $scope: $scope,
            $modalInstance: modalInstance,
            displayedPopup: displayedPopup,
            $interval: interval,
            $timeout: timeout
        });
    }));

    it('DetailProfilModalCtrl:should instantiate the controller properly', function () {
        expect(controller).not.toBeUndefined();

        modalInstance.open();

        spyOn(jQuery.fn, 'is').andReturn('toto');

        intervalCallback();
        timeoutCallback();
    });

    it('DetailProfilModalCtrl:closeModal', function () {
        spyOn(modalInstance, 'close');
        $scope.closeModal();
        expect(modalInstance.close).toHaveBeenCalled();
    });

    it('DetailProfilModalCtrl:dismissModal', function () {
        spyOn(modalInstance, 'dismiss');
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

});