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

describe('Controller: SocialShareModalCtrl', function () {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance, dropbox, EmailService, ToasterService, LoaderService, mode, itemToShare;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _dropbox_,
                                _EmailService_, _ToasterService_, _LoaderService_, $log, $timeout) {


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

        dropbox = _dropbox_;
        spyOn(dropbox, 'upload').and.callThrough();
        spyOn(dropbox, 'shareLink').and.callThrough();


        EmailService = _EmailService_;
        ToasterService = _ToasterService_;
        LoaderService = _LoaderService_;

        mode = 'profile';
        itemToShare = {
            linkToShare: 'https://accessidys.org/profil?id=AKLZDJQSDLKJQS',
            name: 'TEST',
            annotationsToShare: []
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

        $controller('SocialShareModalCtrl', {
            $rootScope: $rootScope,
            $scope: $scope,
            $uibModalInstance: modalInstance,
            dropbox: dropbox,
            EmailService: EmailService,
            ToasterService: ToasterService,
            LoaderService: LoaderService,
            $log: $log,
            $timeout: $timeout,
            mode: mode,
            itemToShare: itemToShare

        });
    }));

    it('SocialShareModalCtrl:init()', function () {

        expect($scope.hasRightToShare).toBeDefined();
        expect($scope.hasRightToShare).toEqual(false);

        expect($scope.facebookLink).toBeDefined();
        expect($scope.facebookLink).toEqual('');

        expect($scope.twitterLink).toBeDefined();
        expect($scope.twitterLink).toEqual('');

        expect($scope.mode).toBeDefined();
        expect($scope.mode).toEqual('');

        expect($scope.shareAnnotation).toBeDefined();
        expect($scope.shareAnnotation).toEqual(false);

        expect($scope.hasAnnotation).toBeDefined();
        expect($scope.hasAnnotation).toEqual(false);

        expect($scope.itemToShare).toBeDefined();
        expect($scope.itemToShare).toEqual({
            linkToShare: '',
            name: '',
            annotationsToShare: []
        });

        expect($scope.shareMethod).toBeDefined();
        expect($scope.shareMethod).toEqual('');

        expect($scope.form).toBeDefined();
        expect($scope.form).toEqual({
            email: ''
        });
    });

    it('SocialShareModalCtrl:dismissModal()', function () {
        expect($scope.dismissModal).toBeDefined();
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('SocialShareModalCtrl:changed()', function () {
        expect($scope.changed).toBeDefined();

        $scope.changed(true);
        expect($scope.shareAnnotation).toEqual(true);

        $scope.changed(false);
        expect($scope.shareAnnotation).toEqual(false);
    });

    it('SocialShareModalCtrl:processAnnotation()', function () {
        spyOn($scope, 'attachFacebook').and.callThrough();

        expect($scope.processAnnotation).toBeDefined();
        $scope.processAnnotation();

        $scope.shareAnnotation = false;
        $scope.processAnnotation();
        expect($scope.hasRightToShare).toEqual(true);
        expect($scope.attachFacebook).toHaveBeenCalled();

        $scope.shareAnnotation = true;
        $scope.itemToShare = {
            linkToShare: 'https://accessidys.org/profil?id=AKLZDJQSDLKJQS',
            name: 'TEST',
            annotationsToShare: [{
                noteId: 'XXX'
            }]
        };
        $scope.processAnnotation();
        expect(dropbox.upload).toHaveBeenCalled();
    });

    it('SocialShareModalCtrl:shareByEmail()', function () {
        expect($scope.shareByEmail).toBeDefined();

        $scope.shareByEmail();
    });

    it('SocialShareModalCtrl:attachFacebook()', function () {
        expect($scope.attachFacebook).toBeDefined();

        $scope.attachFacebook();
    });


});