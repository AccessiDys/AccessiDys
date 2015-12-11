/* File: passport.js
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

/*global $:false */
/* jshint indent: false */
/*jshint unused: false, undef:false */

'use strict';

describe('Controller: passportCtrl', function() {
    var $scope, controller;

    beforeEach(module('cnedApp'));

    beforeEach(inject(function($controller, $rootScope, $httpBackend, md5, configuration) {
        $scope = $rootScope.$new();
        controller = $controller('passportCtrl', {
            $scope: $scope
        });
        $scope.user = {
            'email': 'anasyoubi2@gmail.com',
            'password': 'aaaaaa',
            'nom': 'test',
            'prenom': 'test',
            'data': {
                'local': 'admin'
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
        $scope.dataRecu = {
            __v: 0,
            _id: '5329acd20c5ebdb429b2ec66',
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
        var data = $scope.dataRecu;
        $rootScope.currentUser = {
            _id: '5329acd20c5ebdb429b2ec66',
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

        $scope.profileID = {
            profilID: '5329acd20c5ebdb429b2ec66'
        };
        var profil = [{
            _id: '52d8f928548367ee2d000006',
            photo: './files/profilImage.jpg',
            descriptif: 'descriptif3',
            nom: 'Nom3',
            profilID: '5329acd20c5ebdb429b2ec66'
        }];

        var tags = [{
            _id: '52c6cde4f6f46c5a5a000004',
            libelle: 'Exercice'
        }, {
            _id: '52c588a861485ed41c000002',
            libelle: 'Cours'
        }];

        $scope.tagProfil = [{
            tag: '53359e9c153022351017d757',
            texte: '<p data-font=\'Arial\' data-size=\'12\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Surligner les mots\'> </p>',
            profil: '53359f97153022351017d758',
            tagName: 'azerty',
            police: 'Arial',
            taille: '12',
            interligne: '22',
            styleValue: 'Bold',
            coloration: 'Surligner les mots',
            _id: '53359f97153022351017d75a',
            __v: 0
        }, {
            tag: '53359e5a153022351017d756',
            texte: '<p data-font=\'Arial\' data-size=\'16\' data-lineheight=\'22\' data-weight=\'Bold\' data-coloration=\'Colorer les mots\'> </p>',
            profil: '53359f97153022351017d758',
            tagName: 'uyuy',
            police: 'Arial',
            taille: '16',
            interligne: '22',
            styleValue: 'Bold',
            coloration: 'Colorer les mots',
            _id: '53398a0d439bd8702158db6f',
            __v: 0
        }];

        $scope.dropboxHtmlSearch = [{
            'revision': 919,
            'rev': '39721729c92',
            'thumb_exists': false,
            'bytes': 121273,
            'modified': 'Tue, 01 Apr 2014 08:47:13 +0000',
            'client_mtime': 'Tue, 01 Apr 2014 08:47:13 +0000',
            'path': '/manifestPresent.html',
            'is_dir': false,
            'icon': 'page_white_code',
            'root': 'dropbox',
            'mime_type': 'text/html',
            'size': '118.4 KB'
        }, {
            'revision': 924,
            'rev': '39c21729c92',
            'thumb_exists': false,
            'bytes': 17344,
            'modified': 'Tue, 01 Apr 2014 08:52:08 +0000',
            'client_mtime': 'Tue, 01 Apr 2014 08:52:09 +0000',
            'path': '/test.html',
            'is_dir': false,
            'icon': 'page_white_code',
            'root': 'dropbox',
            'mime_type': 'text/html',
            'size': '16.9 KB'
        }];

        $scope.dropboxHtmlSearchTest = [{
            'revision': 924,
            'rev': '39c21729c92',
            'thumb_exists': false,
            'bytes': 17344,
            'modified': 'Tue, 01 Apr 2014 08:52:08 +0000',
            'client_mtime': 'Tue, 01 Apr 2014 08:52:09 +0000',
            'path': '/test.html',
            'is_dir': false,
            'icon': 'page_white_code',
            'root': 'dropbox',
            'mime_type': 'text/html',
            'size': '16.9 KB'
        }];

        $scope.shareLink = {
            'url': 'https://www.dropbox.com/s/ee44iev4pgw0avb/test.html',
            'expires': 'Tue, 01 Jan 2030 00:00:00 +0000'
        };

        $scope.loginFlag = $scope.dataRecu;

        $scope.dropboxHtmlSearchCache = [{
            'revision': 924,
            'rev': '39c21729c92',
            'thumb_exists': false,
            'bytes': 17344,
            'modified': 'Tue, 01 Apr 2014 08:52:08 +0000',
            'client_mtime': 'Tue, 01 Apr 2014 08:52:09 +0000',
            'path': '/test.html',
            'is_dir': false,
            'icon': 'page_white_code',
            'root': 'dropbox',
            'mime_type': 'text/html',
            'size': '16.9 KB'
        }];
        $scope.appcache = 'CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached \'master entries\'. CACHE: https://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ';
        $scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body></body></html>';

        $scope.testEnv = true;
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
            '__v': 0,
            '_id': '538f3f7db18737e654ef5b79',
            'dateVersion': '10/6/2014_17:12:44',
            'appVersion': 10
        }]);

        $rootScope.testEnv = true;
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/signup').respond($scope.user);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/login?email=teste@gmail.com' + '&password=' + md5.createHash('azzdderr')).respond($scope.dataRecu);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/login?email=anasyoubi2@gmail.com' + '&password=0b4e7a0e5fe84ad35fb5f95b9ceeac79').respond($scope.dataRecu);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilParDefaut').respond($scope.user);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond($scope.user);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajoutDefaultProfil').respond($scope.user);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.user);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsTagParProfil').respond($scope.tagProfil);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/saveProfilTag').respond($scope.userList);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $scope.dataRecu.local.token).respond($scope.dataRecu);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond($scope.dataRecu);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.tagProfil);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.user);
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=' + configuration.CATALOGUE_NAME + '&root=sandbox').respond($scope.dropboxHtmlSearchTest);
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=listDocument.appcache&root=sandbox').respond($scope.dropboxHtmlSearchCache);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond();
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&path=' + configuration.CATALOGUE_NAME + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond($scope.shareLink);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsParDefaut').respond(profil);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/restorePassword').respond({});
        $httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond($scope.appcache);

        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond({});
        $httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond($scope.indexPage);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond(tags);

        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=listDocument.appcache&root=sandbox&short_url=false').respond($scope.shareLink);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + configuration.CATALOGUE_NAME + '&root=sandbox&short_url=false').respond($scope.shareLink);

    }));
  afterEach(inject(function($controller, $rootScope) {
    $rootScope.$apply();
  }));
    it('passportCtrl:signin should add a user Ok', inject(function($httpBackend) {
        var respTag = {
            tag: '53359e9c153022351017d757',
            texte: '<p data-font="Arial" data-size="12" data-lineheight="22" data-weight="Bold" data-coloration="Surligner les mots"> </p>',
            profil: undefined,
            tagName: 'azerty',
            police: 'Arial',
            taille: '12',
            interligne: '22',
            styleValue: 'Bold',
            coloration: 'Surligner les mots',
            _id: null,
            __v: 0
        };
        $scope.obj.emailSign = '';
        $scope.obj.passwordSign = '';
        $scope.obj.nomSign = '';
        $scope.obj.prenomSign = '';

        expect($scope.signin).toBeDefined();
        $('<div class="modal fade in" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>').appendTo('body');
        $scope.signin();
        expect($scope.erreur.erreurSigninNom).toBe(true);
        expect($scope.erreur.erreurSigninPrenom).toBe(true);
        expect($scope.erreur.erreurSigninPasse).toBe(true);
        expect($scope.erreur.erreurSigninEmail).toBe(true);
        expect($scope.erreur.erreurSigninNomMessage).toBe('Nom : Cette donnée est obligatoire. Merci de compléter le champ.');
        expect($scope.erreur.erreurSigninPrenomMessage).toBe('Prénom : Cette donnée est obligatoire. Merci de compléter le champ.');
        expect($scope.erreur.erreurSigninEmailMessage).toBe('Email : Cette donnée est obligatoire. Merci de compléter le champ.');
        $scope.obj.emailSign = 'test@test.com';
        $scope.obj.passwordSign = 'azzdderr';
        $scope.obj.passwordConfirmationSign = 'azzdderr';
        $scope.obj.nomSign = 'test';
        $scope.obj.prenomSign = 'test';
        $scope.signin();
        $httpBackend.flush();

        expect($scope.singinFlag).toEqual($scope.user);
        expect($scope.user).not.toBe(null);
        expect($scope.saveProfilTagFlag).toEqual($scope.userList);
    }));

    it('passportCtrl:login should return a user Ok', inject(function($httpBackend) {
        $scope.testEnv = true;
        $scope.emailLogin = null;
        expect($scope.login).toBeDefined();
        $scope.login();
        expect($scope.erreurLogin).toBe(true);
        $scope.emailLogin = 'teste@gmail.com';
        $scope.passwordLogin = 'azzdderr';
        $scope.role = 'admin';
        $scope.login();
        $httpBackend.flush();
        expect($scope.loginFlag).toEqual($scope.dataRecu);
    }));

    it('passportCtrl: init', inject(function($httpBackend, $location) {
        expect($scope.init).toBeDefined();
        $scope.init();
        $httpBackend.flush();



        $location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu?Acces=true';
        localStorage.setItem('redirectionEmail', 'anasyoubi2@gmail.com');
        localStorage.setItem('redirectionPassword', 'aaaaaa');
        $scope.init();

        $location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu?create=true';
        localStorage.setItem('redirectionEmail', 'anasyoubi2@gmail.com');
        localStorage.setItem('redirectionPassword', 'aaaaaa');
        $scope.init();
    }));

    it('passportCtrl: verifyEmail', inject(function() {
        expect($scope.verifyEmail).toBeDefined();
        var tmp = $scope.verifyEmail('aaaaaa');
        expect(tmp).toBe(false);
        tmp = $scope.verifyEmail('aaa@aaa.com');
        expect(tmp).toBe(true);
    }));

    it('passportCtrl: showPasswordRestorePanel', inject(function() {
        $scope.showPasswordRestorePanel();
    }));
    it('passportCtrl: verifyString', inject(function() {
        expect($scope.verifyString).toBeDefined();
        var tmp = $scope.verifyString('a=');
        expect(tmp).toBe(false);
        tmp = $scope.verifyString('aaaa');
        expect(tmp).toBe(true);
    }));

    it('passportCtrl: verifyPassword', inject(function() {
        expect($scope.verifyPassword).toBeDefined();
        var tmp = $scope.verifyPassword('aaaa');
        expect(tmp).toBe(false);
        tmp = $scope.verifyPassword('aaa567a');
        expect(tmp).toBe(true);
    }));

    it('passportCtrl: goNext', inject(function() {
        expect($scope.goNext).toBeDefined();
        $scope.goNext();
    }));

    it('passportCtrl: roleRedirect', inject(function($httpBackend) {
        $scope.loginFlag = $scope.dataRecu;
        $scope.locationURL = 'https://dl.dropboxusercontent.com/s/ungf6ylr8vs0658/adaptation.html#/';
        expect($scope.roleRedirect).toBeDefined();
        $scope.roleRedirect();
        $scope.loginFlag = $scope.dataRecu;
        $scope.loginFlag.local.role = '';
        $scope.roleRedirect();
        localStorage.setItem('bookmarkletDoc', 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.pdf');
        $scope.roleRedirect();
    }));

    it('passportCtrl: setListTagsByProfil', inject(function($httpBackend) {
        expect($scope.setListTagsByProfil).toBeDefined();
        $scope.setListTagsByProfil();
        $httpBackend.flush();

    }));

    it('passportCtrl: restorePassword', inject(function($httpBackend) {
        $scope.emailRestore = 'anasyoubi';
        expect($scope.restorePassword).toBeDefined();
        $scope.restorePassword();
        expect($scope.failRestore).toEqual(true);


        $scope.emailRestore = 'anasyoubi@gmail.com';
        $scope.restorePassword();
        $httpBackend.flush();

    }));


});
