/* File: common.js
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

describe(
    'Controller: CommonCtrl',
    function () {

        // load the controller's module
        beforeEach(module('cnedApp'));

        var MainCtrl, $scope;
        var $timeout = null;

        var serviceCheck;
        var q;
        var deferred;
        var profilsService;
        var profils;
        var location;
        var modal, modalParameters;

        // define the mock people service
        beforeEach(function () {
            location = {
                path: function () {
                    return;
                }
            };

            modal = {
                open: function (params) {
                    modalParameters = params;
                }
            };

            serviceCheck = {
                getData: function () {
                    deferred = q.defer();
                    deferred.resolve({
                        _id: '52c588a861485ed41c000001',
                        dropbox: {
                            accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                            country: 'MA',
                            display_name: 'youbi anas',
                            emails: 'anasyoubi@gmail.com',
                            referral_link: 'https://db.tt/wW61wr2c',
                            uid: '264998156'
                        },
                        local: {
                            email: 'email@email.com',
                            nom: 'nom1',
                            prenom: 'prenom1',
                            password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
                            role: 'user',
                            restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                            secretTime: '201431340',
                            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                            tokenTime: 1397469765520
                        },
                        loged: true,
                        dropboxWarning: true,
                        admin: true,
                        user: {

                            _id: '52c588a861485ed41c000001',
                            dropbox: {
                                accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                                country: 'MA',
                                display_name: 'youbi anas',
                                emails: 'anasyoubi@gmail.com',
                                referral_link: 'https://db.tt/wW61wr2c',
                                uid: '264998156'
                            },
                            local: {
                                email: 'email@email.com',
                                nom: 'nom1',
                                prenom: 'prenom1',
                                password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
                                role: 'user',
                                restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                                secretTime: '201431340',
                                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                                tokenTime: 1397469765520
                            },
                            loged: true,
                            dropboxWarning: true,
                            admin: true

                        }
                    });
                    return deferred.promise;
                },
                deconnect: function () {
                    deferred = q.defer();
                    deferred.resolve({
                        deconnected: true
                    });
                    return deferred.promise;
                }
            };

            profilsService = {
                getUrl: function () {
                    deferred = q.defer();
                    deferred.resolve('blob://12ac');
                    return deferred.promise;
                }
            };
        });

        // Initialize the controller and a mock scope
        beforeEach(inject(function ($controller, $rootScope, gettextCatalog, $httpBackend, configuration, _$timeout_, $q) {
            $scope = $rootScope.$new();
            q = $q;
            MainCtrl = $controller('CommonCtrl', {
                $scope: $scope,
                serviceCheck: serviceCheck,
                profilsService: profilsService,
                $location: location,
                $modal: modal
            });
            $timeout = _$timeout_;

            $scope.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec';

            var testUser = {
                _id: '52c588a861485ed41c000001',
                dropbox: {
                    accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                    country: 'MA',
                    display_name: 'youbi anas',
                    emails: 'anasyoubi@gmail.com',
                    referral_link: 'https://db.tt/wW61wr2c',
                    uid: '264998156'
                },
                local: {
                    email: 'email@email.com',
                    nom: 'nom1',
                    prenom: 'prenom1',
                    password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
                    role: 'user',
                    restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                    secretTime: '201431340',
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                    tokenTime: 1397469765520
                },
                loged: true,
                dropboxWarning: true,
                admin: true
            };


            var testAdmin = {

                _id: '52c588a861485ed41c000001',
                dropbox: {
                    accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                    country: 'MA',
                    display_name: 'youbi anas',
                    emails: 'anasyoubi@gmail.com',
                    referral_link: 'https://db.tt/wW61wr2c',
                    uid: '264998156'
                },
                local: {
                    email: 'email@email.com',
                    nom: 'nom1',
                    prenom: 'prenom1',
                    password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
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

            $scope.dataRecu = testUser;
            $scope.currentUserData = testUser;
            $rootScope.currentUser = testUser;
            $scope.languages = [{
                name: 'FRANCAIS',
                shade: 'fr_FR'
            }, {
                name: 'ANGLAIS',
                shade: 'en_US'
            }];

            $scope.profilsParUsers = {
                owner: '53301d8b5836a5be73dc5d50',
                nom: 'test',
                descriptif: 'sefeqsfv',
                photo: '/9j/4AAQSkZJR',
                _id: '53301fbfadb072be27f48106',
                __v: 0
            };
            localStorage.setItem('dropboxLink', 'https://dl.dropboxusercontent.com/s/ungf6ylr8vs0658/adaptation.html#/');

            localStorage.setItem('compteId', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');
            $scope.shareLink = {
                'url': 'https://www.dropbox.com/s/ee44iev4pgw0avb/test.html',
                'expires': 'Tue, 01 Jan 2030 00:00:00 +0000'
            };

            $scope.listeProfilsParUser = [{
                owner: '53301d8b5836a5be73dc5d50',
                nom: 'test',
                descriptif: 'sefeqsfv',
                photo: '/9j/4AAQSkZJR',
                _id: '53301fbfadb072be27f48106',
                __v: 0,
                type: 'profile'
            }];

            profils = [{
                _id: '52d8f928548367ee2d000006',
                photo: './files/profilImage.jpg',
                descriptif: 'descriptif3',
                nom: 'Nom3',
                profilID: '5329acd20c5ebdb429b2ec66',
                type: 'profile'
            }];

            localStorage.setItem('profilActuel', JSON.stringify(profils[0]));

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

            var tags = [{
                _id: '52c588a861485ed41c000001',
                libelle: 'Exercice'
            }, {
                _id: '52c588a861485ed41c000002',
                libelle: 'Cours'
            }];

            localStorage.setItem('lastDocument', '2000-2-2_nnn_anjanznjjjdjcjc.html');

            $scope.testEnv = true;
            $rootScope.testEnv = true;

            $scope.upgradeMode = false;
            $scope.upgradeurl = '/updateVersion';
            $scope.oldVersion = {
                valeur: 3,
                date: '',
                newvaleur: 4,
                sysVersionId: 'okjkhb67587G',
                id: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec'
            };

            $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + localStorage.getItem('compteId')).respond($scope.dataRecu);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond($scope.dataRecu);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=dgsjgddshdhkjshdjkhskdhjghqksggdlsjfhsjkggsqsldsgdjldjlsd').respond($scope.dataRecu);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/profilParUser').respond(profils);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterUserProfil').respond($scope.profilsParUsers);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond($scope.tagProfil);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond($scope.dataRecu);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfil').respond(profils);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/findUsersProfilsFavoris').respond($scope.user);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond(tags);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilsParDefaut').respond(profils);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/addUserProfil').respond($scope.dataRecu);

            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&path=' + configuration.CATALOGUE_NAME + '&root=sandbox&short_url=false').respond($scope.shareLink);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/findUserProfilsFavoris').respond(profils);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/logout?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond();
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/profilActuByToken').respond(profils);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/listeProfils?id=' + localStorage.getItem('compteId')).respond(profils);
            $httpBackend
                .whenGET(
                    configuration.URL_REQUEST + '/listeProfils?0=e&1=y&10=J&100=l&101=Z&102=e&103=D&104=T&105=W&106=8&107=E&108=c&11=K&12=V&13=1&14=Q&15=i&16=L&17=C&18=J&19=h&2=J&20=b&21=G&22=c&23=i&24=O&25=i&26=J&27=I&28=U&29=z&3=0&30=I&31=1&32=N&33=i&34=J&35=9&36=.&37=e&38=y&39=J&4=e&40=j&41=a&42=G&43=F&44=p&45=b&46=m&47=U&48=i&49=O&5=X&50=i&51=I&52=5&53=d&54=W&55=5&56=n&57=c&58=3&59=l&6=A&60=2&61=a&62=S&63=J&64=9&65=.&66=y&67=G&68=5&69=k&7=i&70=C&71=z&72=i&73=w&74=7&75=x&76=M&77=L&78=a&79=9&8=O&80=_&81=6&82=f&83=z&84=l&85=J&86=p&87=Q&88=n&89=X&9=i&90=6&91=P&92=S&93=U&94=R&95=y&96=X&97=8&98=C&99=G')
                .respond(profils);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?').respond(tags);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/listeProfils').respond(profils);

            $httpBackend.whenPOST(configuration.URL_REQUEST + '/updateVersion').respond({});
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
                appVersion: 10
            }]);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/findAdmin').respond(testAdmin);
        }));

        it('CommonCtrl:	updgradeService', inject(function ($httpBackend) {
            expect($scope.updgradeService).toBeDefined();
            $scope.updgradeService();
            $httpBackend.flush();
        }));

        it('CommonCtrl : bookmarkletPopin ', inject(function () {

            spyOn(serviceCheck, 'getData').and.callThrough();

            $scope.bookmarkletPopin();

            deferred.resolve();

            $scope.$root.$digest();

        }));

        it('CommonCtrl : afficherProfilsParUser ', inject(function () {
            localStorage.setItem('profilActuel', JSON.stringify(profils[0]));
            expect($scope.afficherProfilsParUser).toBeDefined();
        }));

        it('CommonCtrl : initCommon ', inject(function ($httpBackend, $rootScope) {
            var testUser = {
                _id: '52c588a861485ed41c000001',
                dropbox: {
                    accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                    country: 'MA',
                    display_name: 'youbi anas',
                    emails: 'anasyoubi@gmail.com',
                    referral_link: 'https://db.tt/wW61wr2c',
                    uid: '264998156'
                },
                local: {
                    email: 'email@email.com',
                    nom: 'nom1',
                    prenom: 'prenom1',
                    password: '$2a$08$.tZ6HjO4P4Cfs1smRXzTdOXht2Fld6RxAsxZsuoyscenp3tI9G6JO',
                    role: 'user',
                    restoreSecret: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiJ0dHdocjUyOSJ9.0gZcerw038LRGDo3p-XkbMJwUt_JoX_yk2Bgc0NU4Vs',
                    secretTime: '201431340',
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec',
                    tokenTime: 1397469765520
                },
                loged: true,
                dropboxWarning: true,
                admin: true
            };
            $scope.currentUserData = testUser;
            $rootScope.currentUser = testUser;
            $scope.initCommon();
            $httpBackend.flush();
            // expect($scope.dataRecu.loged).toBeTruthy();

        }));


        it('CommonCtrl : initCommon Not Logged ', inject(function ($httpBackend, $rootScope) {


            deferred = q.defer();
            deferred.resolve({
                _id: '',
                dropbox: {},
                local: {},
                loged: false,
                dropboxWarning: false,
                admin: false,
                user: {}
            });

            spyOn(serviceCheck, 'getData').and.returnValue(deferred.promise);


            $scope.initCommon();

            $rootScope.defaultProfilList = true;

            $httpBackend.flush();


        }));


        it('CommonCtrl : changeProfilActuel ', inject(function () {
            expect($scope.changeProfilActuel).toBeDefined();

        }));

        it('CommonCtrl:logoutFonction()', inject(function () {

            expect($scope.logoutFonction).toBeDefined();
        }));

        it('CommonCtrl: test watch actu', inject(function ($rootScope) {
            $rootScope.$emit('actu');
        }));

        it('CommonCtrl:goToUserAccount', inject(function ($rootScope) {
            $rootScope.isAppOnline = true;
            spyOn(location, 'path').and.callThrough();
            $scope.goToUserAccount();
            expect(location.path).toHaveBeenCalledWith('/userAccount');

            $rootScope.isAppOnline = false;
            spyOn(modal, 'open').and.callThrough();
            $scope.goToUserAccount();
        }));


    });