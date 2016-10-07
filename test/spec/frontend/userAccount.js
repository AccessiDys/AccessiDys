/* File: userAccount.js
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

'use strict';

describe('Controller:UserAccountCtrl', function () {
    var $scope, controller, serviceCheck, deferred, q;
    var accounts = {
        user: {
            _id: '532328858785a8e31b786238'
        },
        dropbox: {
            accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
            country: 'MA',
            display_name: 'youbi anas',
            emails: 'anasyoubi@gmail.com',
            referral_link: 'https://db.tt/wW61wr2c',
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
        }
    };

    var account = {
        user: {
            _id: '52c588a861485ed41c210001'
        },
        local: {
            email: 'mail@email.com',
            nom: 'nom3',
            prenom: 'prenom3',
            password: '$2a$08$.tZ6f5O4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
            role: 'user'

        }
    };

    var testVar = {
        loged: true,
        redirected: 'ok',
        path: '/inscriptionContinue',
        dropboxWarning: false
    };

    beforeEach(module('cnedApp'));




    beforeEach(inject(function ($controller, $rootScope, $httpBackend, configuration, $q) {


        q = $q;

        serviceCheck = {
            getData: function () {
                deferred = q.defer();
                deferred.resolve(testVar);
                return deferred.promise;
            }
        };


        $scope = $rootScope.$new();
        controller = $controller('UserAccountCtrl', {
            $scope: $scope,
            serviceCheck: serviceCheck
        });

        $scope.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec';

        $scope.compte = accounts.local;
        localStorage.setItem('compteId', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');

        $scope.objet = {
            user: {
                _id: '532328858785a8e31b786238'
            }
        };


        $scope.userAccount = account;
        $rootScope.testEnv = true;
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $scope.compte.token).respond(testVar);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/modifierInfosCompte').respond(accounts);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/checkPassword').respond('true');
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/modifierPassword').respond(true);

    }));


    afterEach(inject(function ($controller, $rootScope) {
        $rootScope.$apply();
    }));

    it('UserAccountCtrl:initial should set initial function', inject(function () {
        expect($scope.initial).toBeDefined();
    }));

    it('UserAccountCtrl:initial should set initial function', inject(function ($httpBackend, $rootScope) {
        $scope.initial();
        expect($rootScope.dropboxWarning).toBeFalsy();
        //expect($rootScope.loged).toBeTruthy();

        var tmpVar = {
            loged: true,
            redirected: 'ok',
            path: '/inscriptionContinue',
            dropboxWarning: true,
            user: {
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
                }
            }
        };

        deferred = q.defer();
        // Place the fake return object here
        deferred.resolve(tmpVar);
        spyOn(serviceCheck, 'getData').andReturn(deferred.promise);

        $scope.initial();


    }));


    it('UserAccountCtrl:modifierCompte should set modifierCompte function', inject(function ($httpBackend) {
        expect($scope.modifierCompte).toBeDefined();

        $scope.modifierCompte();
        $httpBackend.flush();
        expect($scope.monObjet).toEqual(accounts);

    }));
    
    it('UserAccountCtrl:modifierCompte should set modifierCompte function', inject(function () {
        expect($scope.modifierCompte).toBeDefined();

        $scope.compte = {
            nom: 'undefined',
        };
        console.log('T1');
        $scope.modifierCompte();        
    }));
    
    it('UserAccountCtrl:verifyString should set verifyString function', inject(function () {
        var tmpChaine = null;
        $scope.verifyString(tmpChaine);
        
        var tmpChaine2 = '§§§§µµ';
        $scope.verifyString(tmpChaine2);
    }));
    
    it('UserAccountCtrl:modifierPassword should set modifierPassword function', inject(function () {
        expect($scope.modifierPassword).toBeDefined();

        $scope.compte = {
            oldPassword: '',
            newPassword: '',
            reNewPassword: ''
        };
        console.log('T1');
        $scope.modifierPassword();
        expect($scope.erreur).toEqual(true);

        $scope.compte = {
            oldPassword: 'asdff',
            newPassword: 'sqs',
            reNewPassword: 'c'
        };
        console.log('T2');
        $scope.modifierPassword();
        expect($scope.erreur).toEqual(true);

        $scope.compte = {
            oldPassword: accounts.local.password,
            newPassword: 'password',
            reNewPassword: 'password'
        };
        console.log('T3');
        $scope.modifierPassword();

        $scope.compte = {
            nom: 'undefined',
            prenom: 'undefined',
            oldPassword: accounts.local.password,
            newPassword: 'password',
            reNewPassword: 'password'
        };
        console.log('T4');
        $scope.modifierPassword();
        expect($scope.erreur).toEqual(true);

        $scope.compte = {
            oldPassword: '§§µµµ§§',
            newPassword: '§§§§µµµ',
            reNewPassword: '§§§§µµµ'
        };
        console.log('T5');
        $scope.modifierPassword();
        

    }));

    it('UserAccountCtrl:verifyPassword should set verifyPassword function', inject(function () {
        expect($scope.modifierPasswordDisplay).toBeFalsy();
    }));

    it('UserAccountCtrl:cancelModification should set cancelModification function', inject(function () {
        expect($scope.verifyPassword).toBeDefined();
        expect($scope.verifyPassword('password')).toBeTruthy();
        expect($scope.verifyPassword('001')).toBeFalsy();
        $scope.cancelModification();
    }));


});