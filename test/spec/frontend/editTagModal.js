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

describe('Controller: EditTagModalCtrl', function () {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance, ToasterService, configuration, mode, tag;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope,  _ToasterService_, _configuration_) {


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

        configuration = _configuration_;
        ToasterService = _ToasterService_;

        spyOn(ToasterService, 'showToaster').and.callThrough();

        mode = 'edit';
        tag = {
            libelle: 'Titre 1',
            niveau: 2,
            position: 2,
            balise: 'h1'
        };

        $scope = $rootScope.$new();

        $rootScope.currentUser = {
            __v: 0,
            _id: '5329acd20c5ebdb429b2ec66',
            dropbox: {
                accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                country: 'MA',
                display_name: 'youbi anas', // jshint ignore:line
                emails: 'anasyoubi@gmail.com',
                referral_link: 'https://db.tt/wW61wr2c', // jshint ignore:line
                uid: '264998156'
            },
            local: {
                email: 'anasyoubi@gmail.com',
                nom: 'youbi',
                password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
                prenom: 'anas',
                role: 'admin',
                restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                secretTime: '201431340',
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                tokenTime: 1397469765520
            },
            loged: true,
            dropboxWarning: true,
            admin: true
        };

        $controller('EditTagModalCtrl', {
            $rootScope: $rootScope,
            $scope: $scope,
            $uibModalInstance: modalInstance,
            ToasterService: ToasterService,
            configuration: configuration,
            mode: mode,
            tag: tag

        });
    }));

    it('EditTagModalCtrl:init()', function () {

        expect($scope.mode).toBeDefined();
        expect($scope.mode).toEqual('edit');

        expect($scope.showNiveauTag).toBeDefined();
        expect($scope.showNiveauTag).toEqual(true);

        expect($scope.minNiveau).toBeDefined();
        expect($scope.minNiveau).toEqual(1);

        expect($scope.maxNiveau).toBeDefined();
        expect($scope.maxNiveau).toEqual(6);

        expect($scope.isDisabled).toBeDefined();
        expect($scope.isDisabled).toEqual(false);

        expect($scope.tag).toBeDefined();
        expect($scope.tag).toEqual(tag);

    });

    it('EditTagModalCtrl:dismissModal()', function () {
        expect($scope.dismissModal).toBeDefined();
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });


    it('EditTagModalCtrl:showDefaultNiveau()', function () {
        expect($scope.showDefaultNiveau).toBeDefined();
        $scope.showDefaultNiveau(tag);
        expect(tag.niveau).toEqual(1);
    });

    it('EditTagModalCtrl:saveTag()', function () {
        expect($scope.saveTag).toBeDefined();

        $scope.tag = {
            libelle: '',
            niveau: 2,
            position: 2,
            balise: 'h1'
        };

        $scope.saveTag();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#edit-tag-error-toaster', 'style.message.save.ko.title.mandatory');

        //
        $scope.tag = {
            libelle: 'Titre 1',
            niveau: 2,
            position: null,
            balise: 'h1'
        };

        $scope.saveTag();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#edit-tag-error-toaster', 'style.message.save.ko.position.mandatory');

        //
        $scope.tag = {
            libelle: 'Titre 1',
            niveau: null,
            position: 2,
            balise: 'h1'
        };
        $scope.showNiveauTag = false;

        $scope.saveTag();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#edit-tag-error-toaster', 'style.message.save.ko.level.mandatory');

        //
        $scope.tag = {
            libelle: 'Titre 1',
            niveau: 2,
            position: 2,
            balise: null
        };

        $scope.saveTag();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#edit-tag-error-toaster', 'style.message.save.ko.html.mandatory');

        //
        $scope.tag = {
            libelle: 'Titre 1',
            niveau: 2,
            position: 2,
            balise: 'h1'
        };
        $scope.showNiveauTag = true;

        $scope.saveTag();
        expect($scope.tag.niveau).toEqual(0);
    });


    it('EditTagModalCtrl:uploadComplete()', function () {
        expect($scope.uploadComplete).toBeDefined();
        $scope.uploadComplete();
        expect(modalInstance.close).toHaveBeenCalledWith({
            status: 'ok'
        });
    });

    it('EditTagModalCtrl:uploadFailed()', function () {
        expect($scope.uploadFailed).toBeDefined();
        $scope.uploadFailed();
        expect(modalInstance.close).toHaveBeenCalledWith({
            status: 'ko'
        });
    });

    it('EditTagModalCtrl:resetImportFile()', function () {
        expect($scope.form).toBeDefined();
        expect($scope.form.files).toBeDefined();
        $scope.resetImportFile();
        expect($scope.form.files).toEqual([ 0 ]);
    });


});