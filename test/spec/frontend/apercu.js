/* File: apercu.js
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

/*global $:false, spyOn:false, CKEDITOR:true */

'use strict';

describe('Controller:ApercuCtrl', function () {
    var scope, controller, window, speechService, speechStopped, serviceCheck, deferred, fileStorageService, isOnlineServiceCheck, workspaceService, configuration, filesFound, lienPartage, mapNotes, logedServiceCheck, modal, modalParameters;
    var profilTags = [{
        '__v': 0,
        '_id': '52fb65eb8856dce835c2ca87',
        'coloration': 'Colorer les lignes',
        'interligne': '18',
        'police': 'opendyslexicregular',
        'profil': '52d0598c563380592bc1d703',
        'styleValue': 'Normal',
        'tag': '52d0598c563380592bc1d704',
        'tagName': 'Titre 01',
        'taille': '12',
        'texte': '<p data-font=\'opendyslexicregular\' data-size=\'12\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes\'> </p>'
    }, {
        'tag': '52c588a861485ed41c000001',
        'texte': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
        'profil': '52d0598c563380592bc1d703',
        'tagName': 'Solution',
        'police': 'opendyslexicregular',
        'taille': '14',
        'interligne': '18',
        'styleValue': 'Normal',
        'coloration': 'Surligner les lignes',
        '_id': '52fb65eb8856dce835c2ca8d',
        '__v': 0
    }, {
        'tag': '52d0598c5633863243545676',
        'texte': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
        'profil': '52d0598c563380592bc1d703',
        'tagName': 'Annotation',
        'police': 'opendyslexicregular',
        'taille': '14',
        'interligne': '18',
        'styleValue': 'Normal',
        'coloration': 'Surligner les lignes',
        '_id': '52fb65eb8856dce835c2ca8d',
        '__v': 0
    }];

    var tags = [{
        _id: '52c588a861485ed41c000001',
        libelle: 'Solution',
        niveau: 0
    }, {
        _id: '52d0598c563380592bc1d704',
        libelle: 'Titre 01',
        niveau: 1
    }, {
        _id: '52d0598c5633863243545676',
        libelle: 'Annotation',
        niveau: 0
    }];

    var profile = {
        _id: '533d350e4952c0d457478243',
        dropbox: {
            'accessToken': '0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV',
            'country': 'MA',
            'display_name': 'Ahmed BOUKHARI',
            'emails': 'ahmed.boukhari@gmail.com',
            'referral_link': 'https://db.tt/8yRfYgRM',
            'uid': '274702674'
        },
        local: {
            'role': 'user',
            'prenom': 'aaaaaaa',
            'nom': 'aaaaaaaa',
            'password': '$2a$08$53hezQbdhQrrux7pxIftheQwirc.ud8vEuw/IgFOP.tBcXBNftBH.',
            'email': 'test@test.com'
        }
    };

    var profilActuel = {
        nom: 'Nom1',
        descriptif: 'Descriptif1',
        photo: '',
        owner: '5325aa33a21f887257ac2995',
        _id: '52fb65eb8856dce835c2ca86'
    };

    var user = {
        'email': 'test@test.com',
        'password': 'password example',
        'nom': 'test',
        'prenom': 'test',
        'data': {
            'local': 'admin'
        }
    };

    var notes = [{
        'idNote': '1401965900625976',
        'idInPage': 1,
        'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
        'idPage': 1,
        'texte': 'Note 1',
        'x': 750,
        'y': 194,
        'xLink': 382,
        'yLink': 194,
        'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
    }];
    var compteId = 'dgsjgddshdhkjshdjkhskdhjghqksggdlsjfhsjkggsqsldsgdjldjlsd';
    var appVersions = [{
        appVersion: 2
    }];

    // var source = './files/audio.mp3';

    beforeEach(module('cnedApp'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, $location, $injector, $q) {

        modal = {
            open: function (params) {
                modalParameters = params;
            },
        };

        speechStopped = false;
        isOnlineServiceCheck = true;
        logedServiceCheck = false;

        window = {
            location: {
                href: 'test'
            },
            getSelection: function () {
                return {
                    toString: function () {
                        return 'textSelected';
                    }
                };
            },
            open: function () {
                return;
            }
        };

        speechService = {
            stopSpeech: function () {
                speechStopped = true;
            },
            isBrowserSupported: function () {
                return true;
            },
            speech: function () {
                return;
            }
        };

        serviceCheck = {
            getData: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve({
                    user: {
                        local: {
                            authorisations: {
                                audio: true
                            }
                        }
                    },
                    loged: logedServiceCheck

                });
                return deferred.promise;
            },
            isOnline: function () {
                deferred = $q.defer();
                // Place the fake return object here
                if (isOnlineServiceCheck) {
                    deferred.resolve(isOnlineServiceCheck);
                } else {
                    deferred.reject(isOnlineServiceCheck);
                }
                return deferred.promise;
            },
            htmlPreview: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve({
                    documentHtml: '<h1>test</h1'
                });
                return deferred.promise;
            },
            checkName: function () {
                return true;
            }
        };

        CKEDITOR = {
            instances: [],
            inline: function () {},
            remove: function () {}
        };

        CKEDITOR.instances.editorAdd = {
            setData: function () {},
            getData: function () {
                return 'texte';
            },
            checkDirty: function () {
                return false;
            },
            destroy: function () {}
        };

        fileStorageService = {
            getFile: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve('<h1>test</h1>');
                return deferred.promise;
            },
            getTempFile: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve('<h1>test</h1>');
                return deferred.promise;
            },
            saveTempFileForPrint: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve();
                return deferred.promise;
            },
            searchFiles: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve(filesFound);
                return deferred.promise;
            },
            shareFile: function () {
                deferred = $q.defer();
                // Place the fake return object here
                deferred.resolve(lienPartage);
                return deferred.promise;
            }
        };

        workspaceService = {
            parcourirHtml: function (html) {
                return ['titre', html];
            },
            restoreNotesStorage: function () {
                return notes;
            },
            saveTempNotesForPrint: function () {
                return;
            }
        };

        configuration = {
            'NODE_ENV': 'test',
            'MONGO_URI': 'localhost',
            'MONGO_DB': 'adaptation-test',
            'URL_REQUEST': 'https://localhost:3000',
            'CATALOGUE_NAME': 'adaptation.html',
            'DROPBOX_CLIENT_ID': 'xxxx',
            'DROPBOX_CLIENT_SECRET': 'xxxx',
            'DROPBOX_TYPE': 'sandbox',
            'EMAIL_HOST': 'smtp.gmail.com',
            'EMAIL_HOST_UID': 'test@gmail.com',
            'EMAIL_HOST_PWD': 'xxxx'
        };

        $location = $injector.get('$location');
        $location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu';

        scope = $rootScope.$new();
        controller = $controller('ApercuCtrl', {
            $scope: scope,
            $window: window,
            speechService: speechService,
            serviceCheck: serviceCheck,
            fileStorageService: fileStorageService,
            workspaceService: workspaceService,
            configuration: configuration,
            $modal: modal
        });
        scope.testEnv = true;
        scope.duplDocTitre = 'Titredudocument';

        $rootScope.currentUser = profile;
        $rootScope.currentIndexPage = 1;

        scope.pageDe = scope.pageA = [1, 2, 3, 4, 5, 6];

        mapNotes = {
            '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232': [{
                'idNote': '1401965900625976',
                'idInPage': 1,
                'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
                'idPage': 1,
                'texte': 'Note 1',
                'x': 750,
                'y': 194,
                'xLink': 382,
                'yLink': 194,
                'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
            }, {
                'idNote': '1401965900625977',
                'idInPage': 1,
                'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
                'idPage': 1,
                'texte': 'Note 1',
                'x': 750,
                'y': 194,
                'xLink': 382,
                'yLink': 194,
                'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
            }]
        };
        var jsonannotation = [{
            'idNote': '1413886387872259',
            'idInPage': 1,
            'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage': 1,
            'texte': 'Note 1',
            'x': 750,
            'y': 54,
            'xLink': 510,
            'yLink': 49,
            'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
        }, {
            'idNote': '1413886389688203',
            'idInPage': 2,
            'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage': 1,
            'texte': 'Note 2',
            'x': 750,
            'y': 122,
            'xLink': 658,
            'yLink': 122,
            'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 2 </p>'
        }];
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));

        // Mock the the tag search service
        $rootScope.testEnv = true;
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond(profilActuel);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(profilTags);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=' + compteId).respond(tags);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilParDefaut').respond(user);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + compteId).respond(profile);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond(appVersions);
        scope.manifestName = 'doc01.appcache';
        scope.apercuName = 'doc01.html';
        scope.url = 'https://dl.dropboxusercontent.com/s/vnmvpqykdwn7ekq/' + scope.apercuName;
        scope.listDocumentDropbox = 'test.html';
        scope.listDocumentManifest = 'listDocument.appcache';

        $httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond('CACHE MANIFEST # 2010-06-18:v1 # Explicitly cached ');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.manifestName + '?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV').respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.manifestName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
        });

        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV&path=2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json&root=sandbox&short_url=false').respond({
            url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
        });

        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.apercuName + '?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.apercuName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.apercuName
        });

        $httpBackend.whenGET(scope.url).respond('<html manifest=""><head><script> var ownerId = null; var blocks = []; </script></head><body></body></html>');
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond('<htlm manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond('');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV&query=Titredudocument_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html&root=sandbox').respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + profile.dropbox.accessToken + '&query=_' + scope.duplDocTitre + '_&root=sandbox').respond({});
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html?access_token=' + profile.dropbox.accessToken).respond('<html manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.appcache?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond('<html manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
        $httpBackend.whenGET('https://dl.dropboxusercontent.com/s/gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json').respond(jsonannotation);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=gk6ueltm1ckrq9u24b9855644b7c8733a69cd5bf8290bc8').respond(jsonannotation);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html?access_token=' + profile.dropbox.accessToken).respond({});

        $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond({});

        $httpBackend.whenGET('/2015-9-22_testsAnnotations_cf5ad4f059eb80c206e92be53b9e8d30.json').respond(mapNotes['2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232']);
    }));
    /* ApercuCtrl:init */

    it('ApercuCtrl:init cas url', inject(function ($rootScope, $timeout, $q) {
        // case url web
        spyOn(scope, 'getHTMLContent').andCallFake(function () {
            var promiseToreturn = $q.defer();
            // Place the fake return object here
            promiseToreturn.resolve();
            return promiseToreturn.promise;
        });
        scope.url = 'https://localhost:3000/#/apercu?url=https:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes';
        scope.init();
        $rootScope.$apply();
        expect(scope.loader).toBe(true);
        expect(scope.urlHost).toEqual('localhost');
        expect(scope.urlPort).toEqual(443);
        expect(scope.url).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');
        expect(scope.docName).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');
        expect(scope.docSignature).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');


        scope.url = 'http://localhost:3000/#/apercu?url=http:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes';
        scope.init();
        expect(scope.urlPort).toEqual(80);


        // case url pdf
        scope.url = 'https://localhost:3000/#/apercu?url=https:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes.pdf';
        spyOn(scope, 'loadPdfByLien').andReturn();
        scope.init();
        $rootScope.$apply();
        expect(scope.loadPdfByLien).toHaveBeenCalled();

        // case url image
        scope.url = 'https://localhost:3000/#/apercu?url=https:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes.png';
        spyOn(scope, 'loadPictureByLink').andReturn();
        scope.init();
        $rootScope.$apply();
        expect(scope.loadPictureByLink).toHaveBeenCalled();
    }));

    it('ApercuCtrl:init cas url http', inject(function ($rootScope, $timeout, $q) {
        // case url web
        spyOn(scope, 'getHTMLContent').andCallFake(function () {
            var promiseToreturn = $q.defer();
            // Place the fake return object here
            promiseToreturn.resolve();
            return promiseToreturn.promise;
        });
        scope.url = 'http://localhost:3000/#/apercu?url=http:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes.pdf';
        scope.init();
        //$rootScope.$apply();
        expect(scope.loader).toBe(true);
        expect(scope.urlHost).toEqual('localhost');
        expect(scope.urlPort).toEqual(80);
        expect(scope.url).toEqual('http://localhost:3000/#/apercu?url=http://fr.wikipedia.org/wiki/Maîtres_anonymes.pdf');
    }));


    it('ApercuCtrl:init cas document', inject(function ($rootScope, $timeout, $q) {
        // Case of a document of which the contents were already loaded at least
        // once.
        logedServiceCheck = true;
        scope.url = null;
        scope.idDocument = 'test';
        scope.tmp = null;
        scope.init();
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.docName).toEqual('test');
        expect(scope.content).toEqual(['titre', '<h1>test</h1>']);
        $timeout(function () {
            expect(scope.loader).toBe(false);
        }, 1000);
        expect(scope.currentPage).toBe(1);

        // Case of a document of which the contents were never loaded
        spyOn(scope, 'affichageInfoDeconnecte').andCallThrough();
        spyOn(fileStorageService, 'getFile').andCallFake(function () {
            deferred = $q.defer();
            // Place the fake return object here
            deferred.resolve(null);
            return deferred.promise;
        });
        logedServiceCheck = true;
        scope.url = null;
        scope.idDocument = 'test';
        scope.tmp = null;
        scope.init();
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.affichageInfoDeconnecte).toHaveBeenCalled();
        $timeout(function () {
            expect(scope.loader).toBe(false);
        }, 1000);
    }));

    it('ApercuCtrl:init cas temporaire', inject(function ($rootScope, $timeout) {
        logedServiceCheck = true;
        scope.url = null;
        scope.idDocument = null;
        scope.tmp = true;
        scope.init();
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.docName).toEqual('Aperçu Temporaire');
        expect(scope.content).toEqual(['titre', '<h1>test</h1>']);
        $timeout(function () {
            expect(scope.loader).toBe(false);
        }, 1000);
        expect(scope.currentPage).toBe(1);
    }));

    it('ApercuCtrl:loadPictureByLink()', inject(function () {
        scope.url = 'http://localhost:3000/#/apercu?url=http:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes.pdf';
        scope.loadPictureByLink(scope.url);

    }));

    /* ApercuCtrl:dupliquerDocument */
    it('ApercuCtrl:dupliquerDocument', inject(function () {
        localStorage.setItem('compteId', compteId);

        serviceCheck.checkName = function () {
            return false;
        };

        scope.dupliquerDocument();
        expect(scope.dupliquerDocument).toBeDefined();

        scope.duplDocTitre = null;
        scope.dupliquerDocument();

        scope.duplDocTitre = 'iknonjn_lkjnkljnkj_/khbjhbk';
        scope.dupliquerDocument();
    }));


    it('ApercuCtrl:dupliquerDocument', inject(function ($httpBackend) {
        localStorage.setItem('compteId', compteId);

        serviceCheck.checkName = function () {
            return true;
        };

        scope.dupliquerDocument();
        $httpBackend.flush();
        expect(scope.dupliquerDocument).toBeDefined();

        scope.duplDocTitre = null;
        scope.dupliquerDocument();

        scope.duplDocTitre = 'iknonjn_lkjnkljnkj_/khbjhbk';
        scope.dupliquerDocument();
    }));


    /* ApercuCtrl:ete */
    it('ApercuCtrl:ete', inject(function () {

        scope.duplDocTitre = null;
        scope.ete();
    }));


    /* ApercuCtrl:clearDupliquerDocument */
    it('ApercuCtrl:clearDupliquerDocument', function () {
        scope.clearDupliquerDocument();
        expect(scope.msgSuccess).toBe('');
        expect(scope.showMsgSuccess).toBe(false);
    });

    /* ApercuCtrl:hideLoader */
    it('ApercuCtrl:hideLoader', inject(function ($timeout) {
        scope.hideLoader();
        $timeout(function () {
            expect(scope.loader).toEqual(false);
            expect(scope.loaderMsg).toEqual('');
        }, 1000);
        $timeout.flush();
    }));

    /* ApercuCtrl:enableNoteAdd  */
    it('ApercuCtrl:enableNoteAdd', inject(function () {
        scope.enableNoteAdd();
        expect(scope.isEnableNoteAdd).toEqual(true);
    }));

    /* ApercuCtrl:collapse  */
    it('ApercuCtrl:collapse', inject(function () {
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget: elem.children[0]
        };
        scope.collapse($event);
    }));

    /* ApercuCtrl:editer */
    it('ApercuCtrl:editer', inject(function () {
        scope.idDocument = 'test';
        scope.editer();
        expect(window.location.href).toEqual('https://localhost:3000/#/addDocument?idDocument=test');
    }));

    /* ApercuCtrl:setActive */
    it('ApercuCtrl:setActive', inject(function ($timeout) {
        spyOn(document, 'getElementById').andReturn({
            scrollIntoView: function () {
                return;
            }
        });
        scope.content = ['page1', 'page2', 'page3'];
        scope.setActive(0, 1, '52cb095fa8551d800b000012');
        expect(scope.currentPage).toBe(1);
        $timeout.flush();
    }));

    /* ApercuCtrl:setPage */
    it('ApercuCtrl:setPage', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 1;
        scope.setPage(3);
        expect(scope.currentPage).toBe(1);

        scope.currentPage = 1;
        scope.setPage(-1);
        expect(scope.currentPage).toBe(1);

        scope.currentPage = 1;
        scope.setPage(0);
        expect(scope.currentPage).toBe(0);

        scope.currentPage = 1;
        scope.setPage(2);
        expect(scope.currentPage).toBe(2);
    });

    /* ApercuCtrl:precedent */
    it('ApercuCtrl:precedent', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.precedent();
        expect(scope.currentPage).toBe(1);
    });

    /* ApercuCtrl:suivant */
    it('ApercuCtrl:suivant', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 1;
        scope.suivant();
        expect(scope.currentPage).toBe(2);
    });

    /* ApercuCtrl:premier */
    it('ApercuCtrl:premier', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.premier();
        expect(scope.currentPage).toBe(1);
    });

    /* ApercuCtrl:dernier */
    it('ApercuCtrl:dernier', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 1;
        scope.dernier();
        expect(scope.currentPage).toBe(2);
    });

    /* ApercuCtrl:plan */
    it('ApercuCtrl:plan', function () {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.plan();
        expect(scope.currentPage).toBe(0);
    });

    /* ApercuCtrl:afficherMenu */
    it('ApercuCtrl:afficherMenu', function () {
        $('<div class="menu_wrapper"><button type="button" class="open_menu shown"></button></div>').appendTo('body');
        scope.afficherMenu();
        $('<div class="menu_wrapper"><button type="button" class="open_menu"></button></div>').appendTo('body');
        scope.afficherMenu();
    });

    /* ApercuCtrl:socialShare */
    it('ApercuCtrl:socialShare', function () {
        scope.clearSocialShare();
        scope.loadMail();
        scope.dismissConfirm();
        scope.socialShare();
        scope.destinataire = 'test@email';
        scope.socialShare();
        expect(scope.emailMsgError).not.toBe('');
        scope.destinataire = 'test@email.com';
        scope.socialShare();
        expect(scope.emailMsgError).toBe('');

        localStorage.removeItem('notes');
        scope.clearSocialShare();

    });

    /* ApercuCtrl:clearSocialShare */
    it('ApercuCtrl:clearSocialShare', function () {
        scope.idDocument = '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232';
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        scope.clearSocialShare();
        expect(scope.addAnnotation).toBe(true);

        scope.idDocument = 'docquinapasdenotes';
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        scope.clearSocialShare();
        expect(scope.addAnnotation).toBe(false);
    });

    /* ApercuCtrl:sendMail */
    it('ApercuCtrl:sendMail', inject(function ($httpBackend) {
        scope.docApartager = {
            filename: 'file',
            lienApercu: 'dropbox.com'
        };
        scope.destinataire = 'test@email.com';
        scope.encodeURI = 'https%3A%2F%2Flocalhost%3A3000%2F%23%2Fapercu%3Furl%3Dhttps%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes';
        scope.sendMail();
        $httpBackend.flush();
        expect(scope.destinataire).toBe('');
        expect(scope.sendVar).toEqual({
            to: 'test@email.com',
            content: ' a utilisé Accessidys pour partager un fichier avec vous !  dropbox.com',
            encoded: '<span> vient d\'utiliser Accessidys pour partager ce fichier avec vous :   <a href=' + 'dropbox.com' + '>' + 'file' + '</a> </span>',
            prenom: 'aaaaaaa',
            fullName: 'aaaaaaa aaaaaaaa',
            doc: 'file'
        });
    }));

    it('ApercuCtrl:selectionnerMultiPage', function () {
        scope.selectionnerMultiPage();
        expect(scope.pageDe).toBe(1);
        expect(scope.pageA).toBe(1);
    });

    it('ApercuCtrl:selectionnerPageDe', function () {
        scope.pageA = [1, 2];
        scope.selectionnerPageDe();
    });

    it('ApercuCtrl:printByMode', inject(function ($rootScope) {
        scope.printMode = 1;
        scope.printPlan = true;
        scope.printByMode();
        $rootScope.$apply();
        scope.printMode = 2;
        scope.printByMode();
        $rootScope.$apply();
    }));

    it('ApercuCtrl:addNote', function () {
        scope.notes = notes.slice(0);
        scope.addNote(700, 50);
        expect(scope.notes.length).toBe(2);
    });

    it('ApercuCtrl:restoreNotesStorage', function () {
        scope.modeImpression = false;
        scope.notes = notes.slice(0);
        scope.currentPage = 1;
        scope.restoreNotesStorage(1);
        expect(scope.notes.length).toBe(1);
    });

    it('ApercuCtrl:editNote', function () {

        scope.notes = notes.slice(0);

        scope.docSignature = '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232';
        scope.editNote(scope.notes[0]);
        scope.modeImpression = false;
        scope.editNote(scope.notes[0]);
    });


    it('ApercuCtrl:removeNote', function () {

        var temp = {
            '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232': [{
                'idNote': '1401965900625976',
                'idInPage': 1,
                'idDoc': '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
                'idPage': 1,
                'texte': 'Note 1',
                'x': 750,
                'y': 194,
                'xLink': 382,
                'yLink': 194,
                'styleNote': '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
            }]
        };

        localStorage.setItem('notes', JSON.stringify(angular.toJson(temp)));
        scope.notes = notes.slice(0);
        scope.docSignature = '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232';
        scope.removeNote(scope.notes[0]);
        expect(scope.notes.length).toEqual(0);
    });

    it('ApercuCtrl:removeNote', function () {
        scope.notes = notes.slice(0);
        scope.docSignature = '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232';
        scope.removeNote(scope.notes[0]);
        //expect(scope.notes.length).toEqual(0);
    });

    it('ApercuCtrl:drawLineForPrintMode()', inject(function ($timeout) {
        scope.notes = notes.slice(0);
        scope.drawLineForPrintMode();
        $timeout.flush();
    }));

    it('ApercuCtrl:applySharedAnnotation', inject(function ($httpBackend) {
        // $httpBackend.flush();
        scope.annotationURL = 'https://dl.dropboxusercontent.com/s/gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json';
        scope.annotationDummy = 'gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';

        scope.applySharedAnnotation();

        localStorage.removeItem('notes');
        scope.applySharedAnnotation();

        $httpBackend.flush();

        scope.annotationURL = undefined;
        scope.applySharedAnnotation();
    }));

    it('ApercuCtrl:setPasteNote', inject(function () {
        // $httpBackend.flush();
        var $event = {
            originalEvent: {
                clipboardData: {
                    getData: function () {
                        return 'abcdg';
                    }
                }
            },

            preventDefault: function () {
                return;
            }
        };
        scope.testEnv = false;
        scope.setPasteNote($event);
        expect(scope.pasteNote).toEqual(true);
    }));

    it('ApercuCtrl:prepareNote', inject(function () {
        // $httpBackend.flush();
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget: elem.children[0]
        };

        var note = {
            texte: 'aggljj'
        };
        scope.prepareNote(note, $event);
    }));

    it('ApercuCtrl:autoSaveNote', inject(function () {
        scope.notes = notes.slice(0);
        localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
        scope.docSignature = 0;
        // $httpBackend.flush();
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget: elem.children[0]
        };
        var note = {
            texte: 'aggljj'
        };
        scope.autoSaveNote(note, $event);
    }));

    it('ApercuCtrl:addNoteOnClick', inject(function ($rootScope) {
        $rootScope.currentIndexPag = 2;
        scope.isEnableNoteAdd = true;
        var elem = document.createElement('div');
        var trgt = '<span class="menu_wrapper"><span class="open_menu shown"><span class="zoneID">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget: elem.children[0]
        };

        scope.addNoteOnClick($event);
    }));

    it('ApercuCtrl:processAnnotation', inject(function ($httpBackend) {
        // $httpBackend.flush();
        scope.docApartager = {
            filename: 'file',
            lienApercu: 'dropbox.com'
        };

        scope.annotationOk = false;
        scope.processAnnotation();

        scope.annotationOk = true;
        scope.testEnv = true;
        scope.docFullName = '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
        scope.annotationToShare = [{
            'idNote': '1413886387872259',
            'idInPage': 1,
            'idDoc': '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage': 1,
            'texte': 'Note 1',
            'x': 750,
            'y': 54,
            'xLink': 510,
            'yLink': 49,
            'styleNote': '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
        }];
        scope.processAnnotation();

        $httpBackend.flush();

    }));

    it('ApercuCtrl:getSelectedText', inject(function () {
        expect(scope.getSelectedText()).toEqual('textSelected');

        // test of the selection when the browser does not support the function
        // getSelection
        window.getSelection = undefined;
        document.selection = {
            type: 'NotControl',
            createRange: function () {
                return {
                    text: 'textSelected'
                };
            }
        };
        expect(scope.getSelectedText()).toEqual('textSelected');

        // Test if no selection is possible.
        document.selection = {
            type: 'Control'
        };

        expect(scope.getSelectedText()).toEqual('');
    }));

    it('ApercuCtrl:closeOfflineSynthesisTips', inject(function () {
        scope.neverShowOfflineSynthesisTips = false;
        scope.displayOfflineSynthesisTips = true;
        scope.closeOfflineSynthesisTips();
        expect(scope.displayOfflineSynthesisTips).toBe(false);
        expect(localStorage.getItem('neverShowOfflineSynthesisTips')).toEqual('false');

        scope.neverShowOfflineSynthesisTips = true;
        scope.displayOfflineSynthesisTips = true;
        scope.closeOfflineSynthesisTips();
        expect(scope.displayOfflineSynthesisTips).toBe(false);
        expect(localStorage.getItem('neverShowOfflineSynthesisTips')).toEqual('true');
    }));

    it('ApercuCtrl:closeNoAudioRights', inject(function () {
        scope.displayNoAudioRights = true;
        scope.closeNoAudioRights();
        expect(scope.displayNoAudioRights).toBe(false);
    }));

    it('ApercuCtrl:closeBrowserNotSupported', inject(function () {
        scope.displayBrowserNotSupported = true;
        scope.closeBrowserNotSupported();
        expect(scope.displayBrowserNotSupported).toBe(false);
    }));

    it('ApercuCtrl:docPartage', inject(function (configuration, $rootScope) {
        scope.idDocument = 'test';
        filesFound = [{
            filepath: '/2015-9-22_monNouveauDoc_cf5ad4f059eb80c206e92be53b9e8d30.html'
        }];
        lienPartage = 'monpartage';
        scope.docPartage();
        $rootScope.$apply();
        expect(scope.docApartager.lienApercu.indexOf('/#/apercu?url=monpartage') > -1).toBe(true);

        filesFound = [];
        scope.docApartager = {};
        scope.docPartage();
        $rootScope.$apply();
        expect(scope.docApartager.lienApercu).toBeUndefined();

        $rootScope.isAppOnline = false;
        spyOn(modal, 'open').andCallThrough();
        scope.docPartage();
        expect(modal.open).toHaveBeenCalled();
        expect(modalParameters.templateUrl).toEqual('views/common/informationModal.html');
        var modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('La fonctionnalité de partage de document nécessite un accès à internet');
        modalContent = modalParameters.resolve.title();
        expect(modalContent).toEqual('Pas d\'accès internet');
        modalContent = modalParameters.resolve.reason();
        modalContent = modalParameters.resolve.forceClose();


    }));

    it('ApercuCtrl:checkAnnotations', inject(function (configuration, $rootScope, $httpBackend) {
        scope.annotationURL = '/2015-9-22_testsAnnotations_cf5ad4f059eb80c206e92be53b9e8d30.json';
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        scope.checkAnnotations();
        $httpBackend.flush();
        expect(scope.docSignature).toEqual('testsAnnotations');

        scope.annotationURL = '/2015-9-22_testsAnnotations_cf5ad4f059eb80c206e92be53b9e8d30.json';
        localStorage.removeItem('notes');
        scope.checkAnnotations();
        $httpBackend.flush();
        expect(scope.docSignature).toEqual('testsAnnotations');

        scope.docSignature = undefined;
        scope.annotationURL = false;
        scope.checkAnnotations();
        expect(scope.docSignature).toBeUndefined();
    }));

    it('ApercuCtrl:destroyCkeditor', inject(function () {
        scope.destroyCkeditor();
        expect(CKEDITOR.instances.editorAdd).toBeUndefined();

        CKEDITOR.instances.secondEditeur = {
            setData: function () {},
            getData: function () {
                return 'texte';
            },
            checkDirty: function () {
                return false;
            },
            destroy: function () {},
            filter: function () {}
        };

        scope.destroyCkeditor();
        expect(CKEDITOR.instances.secondEditeur).toBeUndefined();

        CKEDITOR.instances.editeurUndefined = undefined;
        scope.destroyCkeditor();
        expect(CKEDITOR.instances.editeurUndefined).toBeUndefined();
    }));

    it('ApercuCtrl:speakOnKeyboard', inject(function ($timeout) {
        var eventShiftLeftArrow = {
            shiftKey: true,
            keyCode: 37
        };
        scope.speakOnKeyboard(eventShiftLeftArrow);

        var eventShift = {
            shiftKey: true,
            keyCode: 16
        };
        scope.speakOnKeyboard(eventShift);

        expect(speechStopped).toBe(true);
        $timeout.flush();
        expect(scope.displayOfflineSynthesisTips).toBe(false);
    }));

    it('ApercuCtrl:checkBrowserSupported', inject(function () {

        scope.neverShowBrowserNotSupported = false;
        var result = scope.checkBrowserSupported();
        expect(result).toBe(true);
        expect(scope.displayBrowserNotSupported).toBe(false);

        scope.neverShowBrowserNotSupported = true;
        result = scope.checkBrowserSupported();
        expect(result).toBe(true);
        expect(scope.displayBrowserNotSupported).toBe(false);

        speechService.isBrowserSupported = function () {
            return false;
        };
        scope.neverShowBrowserNotSupported = false;
        result = scope.checkBrowserSupported();
        expect(result).toBe(false);
        expect(scope.displayBrowserNotSupported).toBe(true);
    }));

    it('ApercuCtrl:checkAudioRights', inject(function ($rootScope, $q) {

        scope.neverShowNoAudioRights = false;
        var result;
        scope.checkAudioRights().then(function (data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result).toBe(true);
        expect(scope.displayNoAudioRights).toBe(false);

        var getDataUserResponse = {};
        var toResolve = true;

        spyOn(serviceCheck, 'getData').andCallFake(function () {
            deferred = $q.defer();
            // Place the fake return object here
            if (toResolve) {
                deferred.resolve({
                    user: getDataUserResponse
                });
            } else {
                deferred.reject();
            }
            return deferred.promise;
        });

        scope.neverShowNoAudioRights = false;
        scope.checkAudioRights().then(function (data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result).toBe(true);
        expect(scope.displayNoAudioRights).toBe(false);

        getDataUserResponse = {
            local: {
                authorisations: {
                    audio: false
                }
            }
        };

        scope.neverShowNoAudioRights = true;
        scope.checkAudioRights().then(function (data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result).toBe(false);
        expect(scope.displayNoAudioRights).toBe(false);

        scope.neverShowNoAudioRights = false;
        scope.checkAudioRights().then(function (data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result).toBe(false);
        expect(scope.displayNoAudioRights).toBe(true);

        toResolve = false;
        scope.neverShowNoAudioRights = false;
        scope.checkAudioRights().then(function (data) {
            result = data;
        });
        $rootScope.$apply();
        expect(result).toBe(true);
        expect(scope.displayNoAudioRights).toBe(false);
    }));

    it('ApercuCtrl:speak', inject(function ($timeout) {
        scope.speak();
        expect(speechStopped).toBe(true);
        $timeout.flush();
        expect(scope.displayOfflineSynthesisTips).toBe(false);

        isOnlineServiceCheck = false;
        scope.neverShowOfflineSynthesisTips = false;
        scope.speak();
        expect(speechStopped).toBe(true);
        $timeout.flush();
        expect(scope.displayOfflineSynthesisTips).toBe(true);

        isOnlineServiceCheck = false;
        scope.neverShowOfflineSynthesisTips = true;
        scope.speak();
        expect(speechStopped).toBe(true);
        $timeout.flush();
        expect(scope.displayOfflineSynthesisTips).toBe(false);
    }));

    // it('ApercuCtrl:browserSupported thruthness',
    // inject(function($location) {
    // scope.browserSupported = true;
    // scope.$apply();
    // var hash = $location.hash();
    // expect(hash).toEqual('main_header');
    // })
    // );

    it('ApercuCtrl:checkLinkOffline', inject(function ($rootScope) {
        $rootScope.isAppOnline = false;
        var event = {
            target: {
                nodeName: 'A'
            },
            preventDefault: function () {},
            stopPropagation: function () {}
        };
        spyOn(modal, 'open').andCallThrough();
        scope.checkLinkOffline(event);
        expect(modal.open).toHaveBeenCalled();
        expect(modalParameters.templateUrl).toEqual('views/common/informationModal.html');
        var modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('La navigation adaptée n\'est pas disponible sans accès internet.');

        $rootScope.isAppOnline = true;
        //We resets to 0 the number of calls to the mock.
        modal.open.reset();
        scope.checkLinkOffline(event);
        // modal.open has not been called
        expect(modal.open).not.toHaveBeenCalled();

        modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('La navigation adaptée n\'est pas disponible sans accès internet.');
        modalContent = modalParameters.resolve.title();
        expect(modalContent).toEqual('Pas d\'accès internet');
        modalContent = modalParameters.resolve.reason();
        modalContent = modalParameters.resolve.forceClose();

    }));

    it('ApercuCtrl:affichageInfoDeconnecte()', function () {
        spyOn(modal, 'open').andCallThrough();
        scope.affichageInfoDeconnecte();
        expect(modal.open).toHaveBeenCalled();
        expect(modalParameters.templateUrl).toEqual('views/common/informationModal.html');
        var modalContent = modalParameters.resolve.reason();
        expect(modalContent).toEqual('/listDocument');
        modalContent = modalParameters.resolve.title();
        expect(modalContent).toEqual('Pas d\'accès internet');
        modalContent = modalParameters.resolve.forceClose();
        modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('L\'affichage de ce document nécessite au moins un affichage préalable via internet.');

    });

    it('ApercuCtrl:openDocumentListModal()', function () {
        spyOn(modal, 'open').andCallThrough();
        scope.openDocumentListModal();
        expect(modal.open).toHaveBeenCalled();
        expect(modalParameters.templateUrl).toEqual('views/listDocument/listDocumentModal.html');
        var modalContent = modalParameters.resolve.reason();
        expect(modalContent).toEqual('/listDocument');
        modalContent = modalParameters.resolve.title();
        expect(modalContent).toEqual('Pas d\'accès internet');
        modalContent = modalParameters.resolve.forceClose();
        modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('L\'affichage de ce document nécessite au moins un affichage préalable via internet.');

    });


    it('ApercuCtrl:getUserAndInitApercu()', inject(function ($rootScope, $routeParams) {
        // classic case
        spyOn(scope, 'init').andReturn();
        $rootScope.loged = true;
        scope.getUserAndInitApercu();
        $rootScope.$apply();
        expect(scope.init).toHaveBeenCalled();
        // The case of a shared document
        $routeParams.url = 'dropboxusercontent';
        scope.getUserAndInitApercu();
        $rootScope.$apply();
        expect(scope.init).toHaveBeenCalled();
    }));



    it('ApercuCtrl:resizeApercu ', inject(function () {
        // enlargement
        scope.resizeDocApercu = 'Réduire';
        scope.resizeApercu();
        expect(scope.resizeDocApercu).toEqual('Agrandir');

        // reduction
        scope.resizeDocEditor = 'Agrandir';
        scope.resizeApercu();
        expect(scope.resizeDocApercu).toEqual('Réduire');
    }));

    it('ApercuCtrl:switchModeAffichage', inject(function () {
        //passing the  print mode to the consultation mode.
        scope.modeImpression = true;
        scope.switchModeAffichage();
        expect(scope.modeImpression).toBe(false);

        // passing the consultation mode to print mode.
        scope.modeImpression = false;
        scope.switchModeAffichage();
        expect(scope.modeImpression).toBe(true);
        scope.testEnv = false;
        scope.switchModeAffichage();

        scope.tmp = false;
        scope.switchModeAffichage();

    }));

    it('ApercuCtrl:fermerApercu', inject(function ($location) {
        // Close the overview for a nontemporary document.
        spyOn($location, 'path').andCallThrough();
        scope.tmp = false;
        scope.fermerApercu();
        expect($location.path).toHaveBeenCalled();

        // Close the overview for a temporary document.
        spyOn(modal, 'open').andCallThrough();
        scope.tmp = true;
        scope.fermerApercu();
        expect(modal.open).toHaveBeenCalled();
        expect(modalParameters.templateUrl).toEqual('views/common/informationModal.html');

        var modalContent = modalParameters.resolve.title();
        expect(modalContent).toEqual('Fermeture!');
        modalContent = modalParameters.resolve.content();
        expect(modalContent).toEqual('Pour fermer l\'aperçu du document, veuillez fermer la fenêtre.');
        modalContent = modalParameters.resolve.reason();
        modalContent = modalParameters.resolve.forceClose();

    }));

    it('ApercuCtrl:loadPdfPage', inject(function ($q, $rootScope) {
        var q = $q;
        var pdf = {
                getPage: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve(pdfPage);
                    return deferred.promise;
                },
                numPages: 3
            },
            pdfPage = {
                error: false,
                render: function () {
                    deferred = q.defer();

                    // Place the fake return object here
                    //deferred.resolve(this.internalRenderTask.callback());
                    deferred.resolve();
                    return deferred.promise;
                },
                getViewport: function () {
                    return {
                        height: 100,
                        width: 100
                    };
                }
            };


        scope.pdfTohtml = {
            push: function (arg) {
                return arg;
            },
            filter: function () {
                return ['--'];
            }
        };

        expect(scope.loadPdfPage).toBeDefined();

        scope.loadPdfPage(pdf, 1);
        $rootScope.$apply();
    }));

    it('ApercuCtrl:loadPdfPageError', inject(function ($q, $rootScope) {
        var q = $q;
        var pdf = {
                getPage: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve(pdfPage);
                    return deferred.promise;
                },
            },
            pdfPage = {
                error: false,
                render: function () {
                    deferred = q.defer();

                    // Place the fake return object here
                    //deferred.resolve(this.internalRenderTask.callback());
                    deferred.resolve({
                        error: 'error'
                    });
                    return deferred.promise;
                },
                getViewport: function () {
                    return {
                        height: 100,
                        width: 100
                    };
                }
            };

        expect(scope.loadPdfPage).toBeDefined();
        scope.loadPdfPage(pdf, 1);
        $rootScope.$apply();
    }));

    it('ApercuCtrl:loadPdfByLien', inject(function () {
        scope.url = 'https://localhost:3000/#/apercu?url=https://www.esprit.presse.fr/whoarewe/historique.pdf';
        //$httpBackend.expectPOST(/sendPdfHTTPS.*/).respond(401, '');

        scope.loadPdfByLien(scope.url);

        scope.url = 'http://localhost:3000/#/apercu?url=http://www.esprit.presse.fr/whoarewe/historique.pdf';
        scope.loadPdfByLien(scope.url);
    }));

    it('ApercuCtrl:loadPictureByLink', inject(function () {
        scope.url = 'https://localhost:3000/#/apercu?url=https://www.w3.org/Style/Examples/011/gevaar.png';
        expect(scope.loadPictureByLink).toBeDefined();
        scope.loadPictureByLink(scope.url);
    }));

    it('ApercuCtrl:getHTMLContent', function () {
        scope.url = 'https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Wikip%C3%A9dia';
        scope.getHTMLContent(scope.url);
    });

    it('ApercuCtrl:stopSpeech', function () {
        scope.stopSpeech();
    });

    it('ApercuCtrl:base64ToUint8Array', function () {
        scope.base64ToUint8Array('64');
    });

});