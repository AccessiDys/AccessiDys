/* File: apercu.js
 *
 * Copyright (c) 2014
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

/*global $:false, CKEDITOR:true */

'use strict';

describe('Controller:ApercuCtrl', function() {
    var scope, controller, window, speechService, speechStopped, serviceCheck, deferred, fileStorageService, isOnlineServiceCheck, workspaceService, configuration;

    var profilTags = [ {
        '__v' : 0,
        '_id' : '52fb65eb8856dce835c2ca87',
        'coloration' : 'Colorer les lignes',
        'interligne' : '18',
        'police' : 'opendyslexicregular',
        'profil' : '52d0598c563380592bc1d703',
        'styleValue' : 'Normal',
        'tag' : '52d0598c563380592bc1d704',
        'tagName' : 'Titre 01',
        'taille' : '12',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'12\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Colorer les lignes\'> </p>'
    }, {
        'tag' : '52c588a861485ed41c000001',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
        'profil' : '52d0598c563380592bc1d703',
        'tagName' : 'Solution',
        'police' : 'opendyslexicregular',
        'taille' : '14',
        'interligne' : '18',
        'styleValue' : 'Normal',
        'coloration' : 'Surligner les lignes',
        '_id' : '52fb65eb8856dce835c2ca8d',
        '__v' : 0
    }, {
        'tag' : '52d0598c5633863243545676',
        'texte' : '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\'> </p>',
        'profil' : '52d0598c563380592bc1d703',
        'tagName' : 'Annotation',
        'police' : 'opendyslexicregular',
        'taille' : '14',
        'interligne' : '18',
        'styleValue' : 'Normal',
        'coloration' : 'Surligner les lignes',
        '_id' : '52fb65eb8856dce835c2ca8d',
        '__v' : 0
    } ];

    var tags = [ {
        _id : '52c588a861485ed41c000001',
        libelle : 'Solution',
        niveau : 0
    }, {
        _id : '52d0598c563380592bc1d704',
        libelle : 'Titre 01',
        niveau : 1
    }, {
        _id : '52d0598c5633863243545676',
        libelle : 'Annotation',
        niveau : 0
    } ];

    var profile = {
        _id : '533d350e4952c0d457478243',
        dropbox : {
            'accessToken' : '0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV',
            'country' : 'MA',
            'display_name' : 'Ahmed BOUKHARI',
            'emails' : 'ahmed.boukhari@gmail.com',
            'referral_link' : 'https://db.tt/8yRfYgRM',
            'uid' : '274702674'
        },
        local : {
            'role' : 'user',
            'prenom' : 'aaaaaaa',
            'nom' : 'aaaaaaaa',
            'password' : '$2a$08$53hezQbdhQrrux7pxIftheQwirc.ud8vEuw/IgFOP.tBcXBNftBH.',
            'email' : 'test@test.com'
        }
    };

    var profilActuel = {
        nom : 'Nom1',
        descriptif : 'Descriptif1',
        photo : '',
        owner : '5325aa33a21f887257ac2995',
        _id : '52fb65eb8856dce835c2ca86'
    };

    var user = {
        'email' : 'test@test.com',
        'password' : 'password example',
        'nom' : 'test',
        'prenom' : 'test',
        'data' : {
            'local' : 'admin'
        }
    };
    
    var notes = [ {
        'idNote' : '1401965900625976',
        'idInPage' : 1,
        'idDoc' : '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
        'idPage' : 1,
        'texte' : 'Note 1',
        'x' : 750,
        'y' : 194,
        'xLink' : 382,
        'yLink' : 194,
        'styleNote' : '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
    } ];
    var compteId = 'dgsjgddshdhkjshdjkhskdhjghqksggdlsjfhsjkggsqsldsgdjldjlsd';
    var appVersions = [ {
        appVersion : 2
    } ];

    // var source = './files/audio.mp3';

    beforeEach(module('cnedApp'));

    beforeEach(inject(function($controller, $rootScope, $httpBackend, $location, $injector, $q) {
        
        speechStopped = false;
        isOnlineServiceCheck = true;
        
        window  = {
                location : {
                    href : 'test'
                },
                getSelection : function() {
                    return {
                        toString : function() {
                            return 'textSelected';
                        }
                    };
                }
        };
        
        speechService = {
                stopSpeech : function() {
                    speechStopped = true;
                },
                isBrowserSupported : function() {
                    return true;
                },
                speech : function() {
                    return;
                }
        };
        
        serviceCheck = {
                getData : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        user : {
                            local : {
                                authorisations : {
                                    audio : true
                                }
                            }
                        }
                    });
                    return deferred.promise;
                },
                isOnline : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    if(isOnlineServiceCheck) {
                        deferred.resolve(isOnlineServiceCheck);
                    } else {
                        deferred.reject(isOnlineServiceCheck);
                    }
                    return deferred.promise;
                },
                htmlPreview : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve({documentHtml : '<h1>test</h1'});
                    return deferred.promise;
                },
                checkName : function() {
                    return true;
                }
        };
        
        CKEDITOR = {
                instances : {
                    editorAdd : {
                        setData : function() {
                        },
                        getData : function() {
                            return 'texte';
                        },
                        checkDirty : function() {
                            return false;
                        }
                    }
                },
                inline : function(){}
            };
        
        fileStorageService = {
                getFile : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve('<h1>test</h1>');
                    return deferred.promise;
                },
                getTempFile : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve('<h1>test</h1>');
                    return deferred.promise;
                },
                saveTempFileForPrint : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve();
                    return deferred.promise;
                }
            };
        
        workspaceService = {
                parcourirHtml : function(html) {
                    return ['titre', html];
                },
                restoreNotesStorage : function() {
                    return notes;
                }
        };
        
        configuration = {
                    'NODE_ENV': 'test',
                    'MONGO_URI': 'localhost',
                    'MONGO_DB': 'adaptation-test',
                    'URL_REQUEST': 'https://localhost:3000',
                    'CATALOGUE_NAME':'adaptation.html',
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
            $scope : scope,
            $window : window,
            speechService : speechService,
            serviceCheck : serviceCheck,
            fileStorageService : fileStorageService,
            workspaceService : workspaceService,
            configuration : configuration
        });
        scope.testEnv = true;
        scope.duplDocTitre = 'Titredudocument';

        $rootScope.currentUser = profile;
        $rootScope.currentIndexPage = 1;

        scope.pageDe = scope.pageA = [ 1, 2, 3, 4, 5, 6 ];
        

        var mapNotes = {
            '2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232' : [ {
                'idNote' : '1401965900625976',
                'idInPage' : 1,
                'idDoc' : '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
                'idPage' : 1,
                'texte' : 'Note 1',
                'x' : 750,
                'y' : 194,
                'xLink' : 382,
                'yLink' : 194,
                'styleNote' : '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
            } ]
        };
        var jsonannotation = [ {
            'idNote' : '1413886387872259',
            'idInPage' : 1,
            'idDoc' : '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage' : 1,
            'texte' : 'Note 1',
            'x' : 750,
            'y' : 54,
            'xLink' : 510,
            'yLink' : 49,
            'styleNote' : '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
        }, {
            'idNote' : '1413886389688203',
            'idInPage' : 2,
            'idDoc' : '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage' : 1,
            'texte' : 'Note 2',
            'x' : 750,
            'y' : 122,
            'xLink' : 658,
            'yLink' : 122,
            'styleNote' : '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 2 </p>'
        } ];
        localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));

        // Mocker le service de recherche des tags
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
            url : 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
        });

        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV&path=2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json&root=sandbox&short_url=false').respond({
            url : 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.manifestName
        });

        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.apercuName + '?access_token=' + profile.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + profile.dropbox.accessToken + '&path=' + scope.apercuName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url : 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/' + scope.apercuName
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
    }));
    /* ApercuCtrl:init */
    it('ApercuCtrl:init cas url', inject(function($rootScope) {
        scope.url = 'https://localhost:3000/#/apercu?url=https:%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes';
        scope.idDocument = null;
        scope.tmp = null;
        scope.init();
        expect(scope.urlHost).toEqual('localhost');
        expect(scope.urlPort).toEqual(443);
        expect(scope.url).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.docName).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');
        expect(scope.docSignature).toEqual('https://localhost:3000/#/apercu?url=https://fr.wikipedia.org/wiki/Maîtres_anonymes');
        expect(scope.loader).toBe(false);
    }));

    it('ApercuCtrl:init cas document', inject(function($rootScope) {
        scope.url = null;
        scope.idDocument = 'test';
        scope.tmp = null;
        scope.init();
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.docName).toEqual('test');
        expect(scope.content).toEqual(['titre', '<h1>test</h1>']);
        expect(scope.loader).toBe(false);
        expect(scope.currentPage).toBe(1);
    }));

    it('ApercuCtrl:init cas temporaire', inject(function($rootScope) {
        scope.url = null;
        scope.idDocument = null;
        scope.tmp = true;
        scope.init();
        expect(scope.loader).toBe(true);
        $rootScope.$apply();
        expect(scope.docName).toEqual('Aperçu Temporaire');
        expect(scope.content).toEqual(['titre', '<h1>test</h1>']);
        expect(scope.loader).toBe(false);
        expect(scope.currentPage).toBe(1);
    }));

    /* ApercuCtrl:dupliquerDocument */
    it('ApercuCtrl:dupliquerDocument', inject(function($httpBackend) {
        localStorage.setItem('compteId', compteId);
        scope.dupliquerDocument();
        $httpBackend.flush();
        expect(scope.dupliquerDocument).toBeDefined();
        expect(scope.showMsgSuccess).toBe(true);

        scope.duplDocTitre = null;
        scope.dupliquerDocument();

        scope.duplDocTitre = 'iknonjn_lkjnkljnkj_/khbjhbk';
        scope.dupliquerDocument();

    }));

    /* ApercuCtrl:clearDupliquerDocument */
    it('ApercuCtrl:clearDupliquerDocument', function() {
        scope.clearDupliquerDocument();
        expect(scope.msgSuccess).toBe('');
        expect(scope.showMsgSuccess).toBe(false);
    });

    /* ApercuCtrl:editer */
    it('ApercuCtrl:editer', inject(function() {
        scope.idDocument = 'test';
        scope.editer();
        expect(window.location.href).toEqual('https://localhost:3000/#/addDocument?idDocument=test');
    }));

    /* ApercuCtrl:setActive */
    it('ApercuCtrl:setActive', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.setActive(0, 1, '52cb095fa8551d800b000012');
        expect(scope.currentPage).toBe(1);
    });
    
    /* ApercuCtrl:setPage */
    it('ApercuCtrl:setPage', function() {
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
    it('ApercuCtrl:precedent', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.precedent();
        expect(scope.currentPage).toBe(1);
    });

    /* ApercuCtrl:suivant */
    it('ApercuCtrl:suivant', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 1;
        scope.suivant();
        expect(scope.currentPage).toBe(2);
    });

    /* ApercuCtrl:premier */
    it('ApercuCtrl:premier', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.premier();
        expect(scope.currentPage).toBe(1);
    });

    /* ApercuCtrl:dernier */
    it('ApercuCtrl:dernier', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 1;
        scope.dernier();
        expect(scope.currentPage).toBe(2);
    });

    /* ApercuCtrl:plan */
    it('ApercuCtrl:plan', function() {
        scope.content = ['page1', 'page2', 'page3'];
        scope.currentPage = 2;
        scope.plan();
        expect(scope.currentPage).toBe(0);
    });

    /* ApercuCtrl:afficherMenu */
    it('ApercuCtrl:afficherMenu', function() {
        $('<div class="menu_wrapper"><button type="button" class="open_menu shown"></button></div>').appendTo('body');
        scope.afficherMenu();
        $('<div class="menu_wrapper"><button type="button" class="open_menu"></button></div>').appendTo('body');
        scope.afficherMenu();
    });

    /* ApercuCtrl:socialShare */
    it('ApercuCtrl:socialShare', function() {
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

    /* ApercuCtrl:sendMail */
    it('ApercuCtrl:sendMail', inject(function($httpBackend) {
        scope.docApartager = {
                filename : 'file',
                lienApercu : 'dropbox.com'
        };
        scope.destinataire = 'test@email.com';
        scope.encodeURI = 'https%3A%2F%2Flocalhost%3A3000%2F%23%2Fapercu%3Furl%3Dhttps%3A%2F%2Ffr.wikipedia.org%2Fwiki%2FMa%C3%AEtres_anonymes';
        scope.sendMail();
        $httpBackend.flush();
        expect(scope.destinataire).toBe('');
        expect(scope.sendVar).toEqual({
                to: 'test@email.com',
                content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  dropbox.com',
                encoded: '<span> vient d\'utiliser CnedAdapt pour partager ce fichier avec vous :   <a href=' + 'dropbox.com' + '>' + 'file' +
                  '</a> </span>',
                prenom: 'aaaaaaa',
                fullName: 'aaaaaaa aaaaaaaa',
                doc: 'file'
              });
    }));

    it('ApercuCtrl:selectionnerMultiPage', function() {
        scope.selectionnerMultiPage();
        expect(scope.pageDe).toBe(1);
        expect(scope.pageA).toBe(1);
    });

    it('ApercuCtrl:selectionnerPageDe', function() {
        scope.selectionnerPageDe();
    });

    it('ApercuCtrl:printByMode', function() {
        scope.printMode = 1;
        scope.printPlan = true;
        scope.printByMode();
        scope.printMode = 2;
        scope.printByMode();
    });

    it('ApercuCtrl:addNote', function() {
        scope.notes = notes.slice(0);
        scope.addNote(700, 50);
        expect(scope.notes.length).toBe(2);
    });

    it('ApercuCtrl:restoreNotesStorage', function() {
        scope.restoreNotesStorage(1);
        expect(scope.notes.length).toBe(1);
    });

    it('ApercuCtrl:editNote', function() {
        localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
        scope.docSignature=0;
        scope.editNote(scope.notes[0]);
    });

    it('ApercuCtrl:removeNote', function() {
        scope.notes = notes.slice(0);
        scope.docSignature='2014-4-29_doc dds éé dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232';
        scope.removeNote(scope.notes[0]);
        expect(scope.notes.length).toBe(0);
    });

    it('ApercuCtrl:applySharedAnnotation', inject(function($httpBackend, $location) {
        // $httpBackend.flush();
        scope.annotationURL = 'https://dl.dropboxusercontent.com/s/gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8.json';
        scope.annotationDummy = 'gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
        console.log('$location.absUrl()');
        console.log($location.absUrl());

        scope.applySharedAnnotation();

        localStorage.removeItem('notes');
        scope.applySharedAnnotation();

        $httpBackend.flush();

    }));

    it('ApercuCtrl:setPasteNote', inject(function() {
        // $httpBackend.flush();
        var $event = {
            originalEvent : {
                clipboardData : {
                    getData : function() {
                        return 'abcdg';
                    }
                }
            }
        };
        scope.setPasteNote($event);
        expect(scope.pasteNote).toBeTruthy();
    }));

    it('ApercuCtrl:prepareNote', inject(function() {
        // $httpBackend.flush();
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget : elem.children[0]
        };

        var note = {
            texte : 'aggljj'
        };
        scope.prepareNote(note, $event);
    }));

    it('ApercuCtrl:autoSaveNote', inject(function() {
        scope.notes = notes.slice(0);
        localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
        scope.docSignature=0;
        // $httpBackend.flush();
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget : elem.children[0]
        };
        var note = {
            texte : 'aggljj'
        };
        scope.autoSaveNote(note, $event);
    }));

    it('ApercuCtrl:addNoteOnClick', inject(function($rootScope) {
        $rootScope.currentIndexPag = 2;
        scope.isEnableNoteAdd = true;
        var elem = document.createElement('div');
        var trgt = '<span class="menu_wrapper"><span class="open_menu shown"><span class="zoneID">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget : elem.children[0]
        };

        scope.addNoteOnClick($event);
    }));

    it('ApercuCtrl:processAnnotation', inject(function($httpBackend, $location) {
        // $httpBackend.flush();
        scope.docApartager = {
                filename : 'file',
                lienApercu : 'dropbox.com'
        };

        scope.annotationOk = false;
        scope.processAnnotation();
        

        scope.annotationOk = true;
//        $location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu/2014-4-29_doc%20dds%20%C3%A9%C3%A9%20dshds_3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232.html#/apercu?annotation=gk6ueltm1ckrq9u/2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
        scope.testEnv = true;
        scope.docFullName = '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8';
        scope.annotationToShare = [ {
            'idNote' : '1413886387872259',
            'idInPage' : 1,
            'idDoc' : '2014-10-21_buildeazy_24b9855644b7c8733a69cd5bf8290bc8',
            'idPage' : 1,
            'texte' : 'Note 1',
            'x' : 750,
            'y' : 54,
            'xLink' : 510,
            'yLink' : 49,
            'styleNote' : '<p  data-font=\'Arial\' data-size=\'14\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Colorer les syllabes\' data-word-spacing=\'5\' data-letter-spacing=\'7\'> Note 1 </p>'
        } ];
        scope.processAnnotation();

        $httpBackend.flush();

    }));
    
    it('ApercuCtrl:getSelectedText', inject(function() {
        expect(scope.getSelectedText()).toEqual('textSelected');
    }));
    
    it('ApercuCtrl:closeOfflineSynthesisTips', inject(function() {
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
    
    it('ApercuCtrl:closeNoAudioRights', inject(function() {
        scope.displayNoAudioRights = true;
        scope.closeNoAudioRights();
        expect(scope.displayNoAudioRights).toBe(false);
    }));
    
    it('ApercuCtrl:closeBrowserNotSupported', inject(function() {
        scope.displayBrowserNotSupported = true;
        scope.closeBrowserNotSupported();
        expect(scope.displayBrowserNotSupported).toBe(false);
    }));
    
    it('ApercuCtrl:speak', inject(function($timeout) {
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


});
