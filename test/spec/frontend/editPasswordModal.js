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

describe('Controller: editPasswordCtrl', function () {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance, ToasterService, UtilsService;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _ToasterService_, $log, $timeout, _UtilsService_, $http, _md5_, _configuration_) {


        modalInstance = {
            close: function () {
            }, dismiss: function () {
            }, opened: {
                then: function () {
                }
            }
        };
        spyOn(modalInstance, 'close').and.callThrough();
        spyOn(modalInstance, 'dismiss').and.callThrough();
        spyOn(modalInstance, 'opened').and.callThrough();

        UtilsService = _UtilsService_;
        ToasterService = _ToasterService_;


        $scope = $rootScope.$new();

        var userId = '1';
        var token = 'Qqsdjqsmldkqlsmdkqsd';

        $controller('editPasswordCtrl', {
            $scope: $scope,
            $uibModalInstance: modalInstance,
            ToasterService: ToasterService,
            UtilsService: UtilsService,
            $http: $http,
            md5: _md5_,
            userId: userId,
            token: token,
            configuration: _configuration_
        });
    }));

    it('editPasswordCtrl:init()', function () {

        expect($scope.compte).toBeDefined();
        expect($scope.compte).toEqual({
            oldPassword: '',
            newPassword: '',
            reNewPassword: ''
        });
    });

    it('editPasswordCtrl:dismissModal()', function () {
        expect($scope.dismissModal).toBeDefined();
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('editPasswordCtrl:modifierPassword should set modifierPassword function', inject(function () {
        expect($scope.modifierPassword).toBeDefined();

        $scope.compte = {
            oldPassword: '',
            newPassword: '',
            reNewPassword: ''
        };
        $scope.modifierPassword();

        $scope.compte = {
            oldPassword: 'asdff',
            newPassword: 'sqs',
            reNewPassword: 'c'
        };
        $scope.modifierPassword();

        $scope.compte = {
            oldPassword: 'password',
            newPassword: 'password',
            reNewPassword: 'password'
        };
        $scope.modifierPassword();

        $scope.compte = {
            nom: 'undefined',
            prenom: 'undefined',
            oldPassword: 'password',
            newPassword: 'password',
            reNewPassword: 'password'
        };
        $scope.modifierPassword();

        $scope.compte = {
            oldPassword: '§§µµµ§§',
            newPassword: '§§§§µµµ',
            reNewPassword: '§§§§µµµ'
        };
        $scope.modifierPassword();


    }));


});