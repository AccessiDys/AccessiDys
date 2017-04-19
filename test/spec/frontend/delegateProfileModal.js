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

describe('Controller: DelegateProfileModalCtrl', function () {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance,  EmailService, ToasterService, LoaderService, UserService, profile, profilsService;
    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope,
                                _EmailService_, _ToasterService_, _LoaderService_, $log, $timeout, $location, _profilsService_, _UserService_) {


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


        $rootScope.currentUser = {
            __v: 0,
            _id: '5329acd20c5ebdb429b2ec66',
            dropbox: {
                accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                country: 'MA',
                display_name: 'youbi anas', // jshint ignore:line
                emails: 'test@gmail.com',
                referral_link: 'https://db.tt/wW61wr2c', // jshint ignore:line
                uid: '264998156'
            },
            local: {
                email: 'test@gmail.com',
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


        EmailService = _EmailService_;
        ToasterService = _ToasterService_;
        spyOn(ToasterService, 'showToaster').and.callThrough();

        LoaderService = _LoaderService_;
        spyOn(LoaderService, 'showLoader').and.callThrough();

        UserService = _UserService_;
        spyOn(UserService, 'findUserByEmail').and.callFake(function () {
            return {
                success: function(cb){
                    // Place the fake return object here

                    cb({
                        local: {
                            email: 'test2@gmail.com'
                        }
                    });
                }
            };
        });

        profilsService = _profilsService_;
        spyOn(profilsService, 'delegateProfile').and.callThrough();

        profile = {
            _id: 'kqjsdlkqjsd8127',
            nom: 'TEST'
        };


        $scope = $rootScope.$new();


        $controller('DelegateProfileModalCtrl', {
            $rootScope: $rootScope,
            $scope: $scope,
            $uibModalInstance: modalInstance,
            EmailService: EmailService,
            UserService: UserService,
            LoaderService: LoaderService,
            ToasterService: ToasterService,
            profilsService: profilsService,
            $location: $location,
            profile: profile
        });
    }));

    it('DelegateProfileModalCtrl:init()', function () {

        expect($scope.form).toBeDefined();
        expect($scope.form.email).toBeDefined();
        expect($scope.form.email).toEqual('');

    });

    it('DelegateProfileModalCtrl:dismissModal()', function () {
        expect($scope.dismissModal).toBeDefined();
        $scope.dismissModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    });

    it('DelegateProfileModalCtrl:delegateProfile() email empty', function () {
        expect($scope.delegateProfile).toBeDefined();

        $scope.form = {
            email: ''
        };
        $scope.delegateProfile();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.email.mandatory');
    });

    it('DelegateProfileModalCtrl:delegateProfile() email not valid', function () {
        expect($scope.delegateProfile).toBeDefined();

        $scope.form = {
            email: 'qklsdj'
        };
        $scope.delegateProfile();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.email.invalid');

    });

    it('DelegateProfileModalCtrl:delegateProfile() email equals to current user', function () {
        expect($scope.delegateProfile).toBeDefined();


        $scope.form = {
            email: 'test@gmail.com'
        };
        $scope.delegateProfile();
        expect(ToasterService.showToaster).toHaveBeenCalledWith('#profile-delegate-success-toaster', 'profile.message.delegate.save.ko.yourself');
    });

    it('DelegateProfileModalCtrl:delegateProfile() email ok', function () {
        expect($scope.delegateProfile).toBeDefined();
        $scope.form = {
            email: 'test1@gmail.com'
        };
        $scope.delegateProfile();
        expect(LoaderService.showLoader).toHaveBeenCalledWith('profile.message.info.delegate.inprogress', false);
        expect(UserService.findUserByEmail).toHaveBeenCalledWith('test1@gmail.com');
        expect(profilsService.delegateProfile).toHaveBeenCalled();
    });



});