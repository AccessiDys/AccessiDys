/* File: helpers.js
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
/* global spyOn:false */
describe('factory: helpers',

function() {
    var scope = {}, localStorage, $localForage, compteId, compteOffline, q, deferred,$modal,modalParameter;
    beforeEach(module('cnedApp'));

    beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $q) {
        q = $q;
        $modal = {
             open: function(Params) {
                  modalParameter = Params;
             },
        };
        $localForage = {
            getItem : function(name) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    deferred.resolve(compteOffline);
                else
                    deferred.resolve(compteId);
                return deferred.promise;
            },
            setItem : function(name, item) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    compteOffline = item;
                else
                    compteId = item;
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
            removeItem : function(name) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    compteOffline = undefined;
                else
                    compteId = undefined;
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
            clear : function() {

            }
        };
        localStorage = {
            getItem : function(name) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    deferred.resolve(compteOffline);
                else
                    deferred.resolve(compteId);
                return deferred.promise;
            },
            clear : function() {
            },
            setItem : function(name, item) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    compteOffline = item;
                else
                    compteId = item;
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            },
            removeItem : function(name) {
                deferred = q.defer();
                if (name === 'compteOffline')
                    compteOffline = undefined;
                else
                    compteId = undefined;
                deferred = q.defer();
                deferred.resolve();
                return deferred.promise;
            }
        };
        scope.dataRecu = {
            __v : 0,
            _id : '5329acd20c5ebdb429b2ec66',
            dropbox : {
                accessToken : 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                country : 'MA',
                display_name : 'youbi anas',
                emails : 'anasyoubi@gmail.com',
                referral_link : 'https://db.tt/wW61wr2c',
                uid : '264998156'
            },
            local : {
                email : 'anasyoubi@gmail.com',
                nom : 'youbi',
                password : '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
                prenom : 'anas',
                role : 'admin',
                restoreSecret : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                secretTime : '201431340',
                token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                tokenTime : 1397469765520
            }
        };

        $rootScope.testEnv = true;
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + scope.dataRecu.local.token).respond(scope.dataRecu);
        spyOn($localForage, 'setItem').andCallThrough();
        spyOn($localForage, 'clear').andCallThrough();
        spyOn($localForage, 'getItem').andCallThrough();
        spyOn($localForage, 'removeItem').andCallThrough();
        spyOn(localStorage, 'clear').andCallThrough();
        spyOn($modal, 'open').andCallThrough();


        localStorage.setItem('compteId', scope.dataRecu.local.token);
    }));
    it('helpers:removeAccents', inject(function(removeAccents) {
        expect(removeAccents('&agrave;&eacute;')).toEqual('àé');
    }));
    it('helpers:removeStringsUppercaseSpaces', inject(function(removeStringsUppercaseSpaces) {
        expect(removeStringsUppercaseSpaces('àé AE')).toEqual('aeae');
    }));
    it('helpers:removeHtmlTags', inject(function(removeHtmlTags) {
        expect(removeHtmlTags('<span>test<br/></span>')).toEqual('test');
    }));
    it('helpers:htmlToPlaintext', inject(function(htmlToPlaintext) {
        expect(htmlToPlaintext('<span>test<br/></span>')).toEqual('test');
    }));

    it('helpers:protocolToLowerCase', inject(function(protocolToLowerCase) {
        expect(protocolToLowerCase('HTTP://test.com')).toEqual('http://test.com');
        expect(protocolToLowerCase('HTTPS://test.com')).toEqual('https://test.com');
        expect(protocolToLowerCase('HttPS://test.com')).toEqual('https://test.com');
    }));

    it('serviceCheck:getData avec accès internet et authentifié', inject(function(serviceCheck, $rootScope) {
        var result;
        $rootScope.isAppOnline = true;
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.loged).toBe(true);
        });
    }));

    it('serviceCheck:getData avec accès internet non authentifié', inject(function(serviceCheck, $rootScope) {
        localStorage.removeItem('compteId');
        $rootScope.isAppOnline = true;
        var result;
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.loged).toBe(false);
            expect(result.dropboxWarning).toBe(true);
        });

    }));

    it('serviceCheck:getData sans accès internet et authentifié', inject(function(serviceCheck, $rootScope) {
        var result;
        $rootScope.isAppOnline = false;
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.loged).toBe(true);
        });
    }));
    
    it('serviceCheck:getData isAppOnline = undefined et authentifié', inject(function(serviceCheck, $rootScope, $httpBackend) {
        var result;
        $rootScope.isAppOnline = undefined;
        $httpBackend.whenGET(' https://localhost:3000/profile?id=' + scope.dataRecu.local.token).respond(500, scope.dataRecu);
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.loged).toBe(true);
        });
    }));

    it('serviceCheck:getData compte utilisateur supprimé', inject(function(serviceCheck, $rootScope, $httpBackend) {
        var result;
        $rootScope.isAppOnline = true;
        scope.dataRecu.code = 1;
        $httpBackend.whenGET(' https://localhost:3000/profile?id=' + scope.dataRecu.local.token).respond(500, scope.dataRecu);
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.deleted).toBe(true);
        });
    }));
    
    
    it('serviceCheck:getData session expirée', inject(function(serviceCheck, $rootScope, $httpBackend) {
        var result;
        $rootScope.isAppOnline = true;
        scope.dataRecu.code = 2;
        $httpBackend.whenGET(' https://localhost:3000/profile?id=' + scope.dataRecu.local.token).respond(500, scope.dataRecu);
        serviceCheck.getData().then(function(data) {
            result = data;
            $rootScope.$apply();
            expect(result.inactif).toBe(true);
            expect(modalParameter.backdrop).toBe(false);
            expect($rootScope.dropboxWarning).toBe(false);
            expect($rootScope.loged).toBe(false);
            
        });
    }));

});
