/* File: images.js
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

'use strict';
/* global pdfdata, jasmine */
/*jshint -W117 */
/* jshint indent: false */
/*jshint unused: false, undef:false */


describe('Controller:ImagesCtrl', function() {
    beforeEach(module('cnedApp'));
    var scope, controller;
    var $window;

    // You can copy/past this beforeEach
    beforeEach(module(function($provide) {

        $window = {
            // now, $window.location.path will update that empty object
            location: {
                href: ''
            },
            // we keep the reference to window.document
            document: window.document
        };

        // We register our new $window instead of the old
        $provide.constant('$window', $window);
    }));

    /*Tags de test*/
    var tags = [{
        _id: '52c588a861485ed41c000001',
        libelle: 'Exercice'
    }, {
        _id: '52c588a861485ed41c000002',
        libelle: 'Cours'
    }];

    var blocksList = {
        'children': [{
            'id': 461.5687490440905,
            'originalSource': 'data:image/png;base64,',
            'source': {},
            'text': '',
            'level': 0,
            'children': [{
                'id': '139482262782797',
                'text': 'Un titre',
                'source': {},
                'children': [],
                'originalSource': 'data:image/png;base64,jhdsghfsdhhtd',
                'tag': '52d0598c563380592bc1d704'
            }, {
                'id': '1394822627845718',
                'text': 'Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte ',
                'source': {},
                'children': [],
                'originalSource': 'data:image/png;base64,dgshgdhgsdggd',
                'tag': '52c588a861485ed41c000001'
            }]
        }]
    };

    /*Profils de test*/
    var profils = [{
        nom: 'profil 1',
        descriptif: 'desc profil 1',
        type: 'Dyslexie N1',
        niveauScolaire: 'CP',
        photo: '',
        _id: '52d1429458e68dbb0c000004'
    }];

    /*Zones de test*/
    var zones = [{
        x: 0,
        y: 0,
        w: 100,
        h: 100,
        source: './files/image.png'
    }];

    // Sources des fichiers uploadés
    /*var srcs = [{
    path: './files/image.png',
    extension: '.png'
  }, {
    path: './files/multipages.pdf',
    extension: '.pdf'
  }];*/

    // Retour service download pdf
    var base64 = pdfdata;


    // commenté parceque il est jamais utilisé
    // var profile = {
    //     _id: '532328858785a8e31b786238',
    //     dropbox: {
    //         'accessToken': '0beblvS8df0AAAAAAAAAAfpU6yreiprJ0qjwvbnfp3TCqjTESOSYpLIxWHYCA-LV',
    //         'country': 'MA',
    //         'display_name': 'Ahmed BOUKHARI',
    //         'emails': 'ahmed.boukhari@gmail.com',
    //         'referral_link': 'https://db.tt/8yRfYgRM',
    //         'uid': '274702674'
    //     },
    //     local: {
    //         'role': 'user',
    //         'prenom': 'aaaaaaa',
    //         'nom': 'aaaaaaaa',
    //         'password': '$2a$08$53hezQbdhQrrux7pxIftheQwirc.ud8vEuw/IgFOP.tBcXBNftBH.',
    //         'email': 'test@test.com'
    //     }
    // };

    var compteId = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec';
    var tgs = [{
        _id: '52c588a861485ed41c000003',
        libelle: 'Titre niveau 1'
    }, {
        _id: '52c588a861485ed41c000004',
        libelle: 'Titre niveau 2'
    }, {
        _id: '52c588a861485ed41c000005',
        libelle: 'Titre niveau 3'
    }, {
        _id: '52c588a861485ed41c000006',
        libelle: 'Paragraphe'
    }];
    localStorage.setItem('listTags', JSON.stringify(tgs));
    beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $location, $injector) {
        localStorage.setItem('listTags', JSON.stringify(tgs));
        localStorage.setItem('compteId', compteId);

        $rootScope.uploadDoc = {
            titre: '2014-4-29_document01_1dfa7b2fb007bb7de17a22562fba6653afcdc4a7802b50ec7d229b4828a13051',
            //lienPdf: 'https://dl.dropboxusercontent.com/s/ursvf38qjs6nbgp/grammaire.pdf',
            uploadPdf: []
        };

        $rootScope.restructedBlocks = blocksList;
        $rootScope.docTitre = '2014-4-29_document01_1dfa7b2fb007bb7de17a22562fba6653afcdc4a7802b50ec7d229b4828a13051';

        scope = $rootScope.$new();
        controller = $controller('ImagesCtrl', {
            $scope: scope
        });

        scope.docTitre = 'KL1234567';
        scope.apercuName = 'doc02.html';
        scope.manifestName = 'doc02.appcache';
        scope.listDocumentDropbox = 'test.html';
        scope.listDocumentManifest = 'listDocument.appcache';



        scope.currentImage = {
            source: './files/image.png',
            originalSource: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApwAAAAoCAYAAABTjyrvAAAV40lEQVR4Xu2dBbAcRReFOzjBgjskuLu7uxfu7u7w0ODB3d1dggUI7u7uVri7/T9fV92t+zozs7P7Nm93H+dWUSTZnpbTPdOnr3Wv//0rQSIEhIAQEAJCQAgIASEgBIYSAr1qIZxffPHFUOqGqhUCQkAICAEhIASEgBBoRQTGG2+8LnerNOGEbE444YRhnHHG6XKjqkAICAEhIASEgBAQAkKg9RH4+eefw3777Rc6Ojq61NmaCOfMM88cPv/88y41qIeFgBAQAkJACAgBISAE2gOBAw88MIw00kginO0xXeqlEBACQkAICAEhIATaDwERzvabM/VYCAgBISAEhIAQEAJthYAIZ1tNlzorBISAEBACQkAICIH2Q0CEs/3mTD0WAkJACAgBISAEhEBbISDC2VbTpc4KASEgBISAEBACQqD9EGgpwvnZZ5+F22+/Pdxyyy3h5ptvjmjOMsssYd555w0rr7xyWHLJJUPv3r0LUf7111/DbbfdFi655JIwcODAStm11147LL/88mHFFVcM4447btWZeuihh+LzgwcPDs8++2wsv/TSS4ellloq9mX66aevWocv8NJLL4WrrroqDDfccGH77bcP448/fk3PZxW+9dZbw4ABAwJ9RRgbbYw66qhdrruogieffDIMGjQoRpuVlZ9++ilsttlmoW/fvmUfKV2O/tx0002hX79+Ycsttwy9evWqPPvXX3+F33//PYwyyiil6+upBb/99tsw5phjNmR4rD3ei8knnzxssskmDakzr5Jmz+GPP/4YRh555PjuSoSAEBACQqA+BFqGcEISV1pppcJRkDD0/vvvzyV7jzzySFhjjTVCtcTyRx99dNhzzz3DsMMOO0R7P/zwQ1hhhRUCdRUJwB1yyCFhmGGGKYX8FVdcETbYYINY9tFHHw3zzz9/qefyCkHMIZheFl544XDfffdljqtLjSUP+7HUUm8jxp3VnvUHPDio2LxC8tddd92w+eabhz322KOWrvaoshDuc845Jxx++OHh9ddfbwjp3GKLLcIFF1wQ16DHvNHANXsO77jjjvg94FAz99xzN3p4qk8ICAEh8J9BoCUIJ+RuoYUWqoDOh50NDU3kG2+8Efbff//Kb5DOJ554YghN2WWXXRY22mijTuVIMDrV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',
            level: 0,
            text: 'test',
            synthese: 'data:audio/mpeg;base64,//NAxAAAAANIAUAAAN4JfOX//btmp/7f/vb//tuo0b//t7reWUp//yZ9R9zM88eJC8FjhKVFwkjRyRP//5jWPeY3bOMGpAHo3LkSQtMdRHVP//+r/',
            children: []
        };

        scope.dataRecu = {
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
                role: 'admin'
            }
        };

        scope.blocks = {
            children: []
        };
        scope.canvas = document.createElement('canvas');
        scope.context = scope.canvas.getContext('2d');

        scope.pdflinkTaped = 'http://info.sio2.be/tdtooo/sostdt.pdf';

        scope.testVar = '<html manifest=""><head><script> var ownerId = null; var blocks = []; </script></head><body></body></html>';
        scope.blocksNull = '<html manifest=""><head><script> var ownerId = null; var blocks = null ; </script></head><body></body></html>';

        var data = {
            url: 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/test.html#/listDocument'
        };

        scope.fichierSimilaire = [{
            path: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.html'
        }, {
            path: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.html'
        }];
        //scope.pdflinkTaped = 'http://info.sio2.be/tdtooo/sostdt.pdf';

        $rootScope.currentUser = {
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

        $location = $injector.get('$location');
        $location.$$absUrl = 'https://dl.dropboxusercontent.com/s/ytnrsdrp4fr43nu?pdfUrl=';


        /*mock OCR web service*/
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/oceriser/').respond(angular.toJson('text oceriser'));

        /*mock redTags web service*/
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=' + compteId).respond(tags);

        /*mock listerProfil web service*/
        $httpBackend.whenGET(configuration.URL_REQUEST + '/listerProfil').respond(profils);

        /*mock Crop Images web service*/
        // $httpBackend.whenPOST(configuration.URL_REQUEST + '/images').respond(angular.toJson('./files/img_cropped.png'));

        /*mock webservice de la synthese vocale*/
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/texttospeech').respond(angular.toJson('//NAxAAAAANIAUAAAN4JfOX//btmp/7f/vb//tuo0b//t7reWUp//yZ9R9zM88eJC8FjhKVFwkjRyRP//5jWPeY3bOMGpAHo3LkSQtMdRHVP//+r/'));

        /*mock webservice enregistrement des blocks structurés*/
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterDocStructure').respond(angular.toJson('52e24471be3a449a2988a0e9'));

        /*mock */
        /*$httpBackend.whenPOST(configuration.URL_REQUEST + '/pdfimage').respond(angular.toJson({
      path: './files/image.png',
      extension: '.png'
    }));*/

        $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendPdf').respond(base64);

        $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendPdfHTTPS').respond(base64);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/htmlPage').respond(wikiVar);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/htmlImage').respond({
            img: imgVar
        });
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/epubUpload').respond(epubvar);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/externalEpub').respond(epubvar);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
            '__v': 0,
            '_id': '538f3f7db18737e654ef5b79',
            'dateVersion': '10/6/2014_17:12:44',
            'appVersion': 10
        }]);

        /* mock les services de stockage dans dropbox */
        $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $rootScope.currentUser.local.token).respond($rootScope.currentUser);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond('<htlm manifest=""><head><script> var profilId = null; var blocks = []; </script></head><body></body></html>');
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&query=' + scope.docTitre + '.html&root=' + configuration.DROPBOX_TYPE).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=undefined&root=' + configuration.DROPBOX_TYPE).respond({});
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.docTitre + '.appcache?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&path=' + scope.docTitre + '.appcache&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://dl.dropboxusercontent.com/s/sy4g4yn0qygxhs5/K-L-1234567.appcache'
        });
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.docTitre + '.html?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&path=' + scope.docTitre + '.html&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://www.dropbox.com/s/gdhgsjdggd/' + scope.docTitre
        });
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond('<htlm manifest=""><head><script> var profilId = null; var blocks = []; var listDocument= []; </script></head><body></body></html>');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentDropbox + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond('');
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + scope.manifestName + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond('');
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.listDocumentManifest + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.manifestName + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&path=' + scope.listDocumentDropbox + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond(null);
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.html&root=sandbox&short_url=false').respond(null);
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&path=' + scope.manifestName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://www.dropbox.com/s/gdhgsjdggd/' + scope.manifestName
        });

        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/' + configuration.DROPBOX_TYPE + '/' + scope.apercuName + '?access_token=' + $rootScope.currentUser.dropbox.accessToken).respond({});
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=' + $rootScope.currentUser.dropbox.accessToken + '&path=' + scope.apercuName + '&root=' + configuration.DROPBOX_TYPE + '&short_url=false').respond({
            url: 'https://www.dropbox.com/s/gdhgsjdggd/' + scope.apercuName
        });

        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=K-L-1234567.html&root=sandbox').respond(null);
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=K-L-1234567.appcache&root=sandbox&short_url=false').respond(data);
        $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=K-L-1234567.html&root=sandbox&short_url=false').respond(data);
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=lijnkjkjbkukuhnk&root=sandbox').respond(data);
        $httpBackend.whenGET('/profile').respond(scope.dataRecu);
        $httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond(scope.dataRecu);
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/test.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.testVar);
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.blocksNull);
        $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.testVar);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/K-L-1234567.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.dataRecu);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/K-L-1234567.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.dataRecu);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/test.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(scope.dataRecu);
        $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(null);
        $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=_KL1234567_&root=sandbox').respond(data);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/oceriser').respond(angular.toJson('text oceriser'));
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/generateSign').respond('lijnkjkjbkukuhnk');
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/htmlPagePreview').respond('lijnkjkjbkukuhnk');

    }));
    afterEach(inject(function($controller, $rootScope) {
        $rootScope.$apply();
    }));
    it('ImagesCtrl: oceriser le texte d\'une image', inject(function($httpBackend) {
        scope.oceriser();
        $httpBackend.flush();

        expect(scope.textes).toBeDefined();
        expect(scope.currentImage.text).toBe('text oceriser');
    }));

    it('ImagesCtrl: afficherTexte', inject(function() {
        scope.currentImage = {
            text: 'data-font'
        };
        scope.afficherTexte();

    }));

    it('ImagesCtrl: resiseWorkspace', inject(function() {
        var elem = document.createElement('div');
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        elem.className = 'active';
        elem.innerHTML = trgt;
        var $event = {
            currentTarget: elem.children[0]
        };
        window.document.body.appendChild(elem);
        console.log('=======>===>');
        console.log(angular.element($event.currentTarget).hasClass('active'));
        scope.resiseWorkspace($event);

    }));

    it('ImagesCtrl: initialisation des variable pour l\'espace de travail', function() {
        var trgt = '<span class="image_container"><img id="cut_piece" onclick="simul(event);" ng-show="(child.source!==undefined)" ng-src="data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAAxUAAAQbCAYAAAD+sIb0AAAgAElEQVR4XuydBZgcxd"><span ng-show="(child.source===undefined)" onclick="simul(event);" style="width:142px;height:50px;background-color:white;display: inline-block;" dynamic="child.text | showText:30:true" class="cut_piece ng-hide"><span class="ng-scope">- Vide -</span></span></span>';
        var elem = document.createElement('div');
        elem.className = 'layer_container';
        elem.innerHTML = trgt;
        var event = {
            target: elem.children[0]
        };
        var image = {
            'source': './files/image.png',
            'originalSource': './files/image.png',
            'level': 0
        };
        scope.workspace(image, event);
    });

    it('ImagesCtrl: selection d\'une zone', inject(function() {
        scope.selected(zones[0]);
    }));

    it('ImagesCtrl: supression d\'une zone', inject(function() {
        scope.removeZone(zones[0]);
    }));

    it('ImagesCtrl: Selection de la liste des tags', inject(function($httpBackend) {
        scope.afficherTags();
        $httpBackend.flush();
        expect(scope.listTags.length).toBe(2);
        expect(scope.listTags).toEqual(tags);
    }));

    it('ImagesCtrl: découpage des images', inject(function($httpBackend) {
        // scope.affectSrcValue(srcs);
        scope.zones = zones;
        console.log('zones.length', scope.zones);
        scope.sendCrop(zones[0]);
        $httpBackend.flush();
        expect(scope.cropedImages.length).toBe(1);
    }));

    it('ImagesCtrl: test de l\'upload de Fichiers', function() {
        scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
        spyOn(window, 'XMLHttpRequest').andReturn(scope.xhrObj);
        scope.files = [{
            type: 'application/epub+zip'
        }];
        scope.uploadFile();
        expect(scope.xhrObj.addEventListener).toHaveBeenCalled();
        expect(scope.xhrObj.addEventListener.calls.length).toBe(3);
        scope.files = [{
            type: 'application/pdf'
        }];
        scope.uploadFile();
        expect(scope.xhrObj.addEventListener).toHaveBeenCalled();
        expect(scope.xhrObj.addEventListener.calls.length).toBe(6);
        scope.files = [{
            type: '',
            name: 'test.epub'
        }];
        scope.uploadFile();
        expect(scope.xhrObj.addEventListener).toHaveBeenCalled();
        expect(scope.xhrObj.addEventListener.calls.length).toBe(9);
    });

    it('ImagesCtrl: test uploadComplete', function() {
        var evt = {
            target: {
                responseText: ''
            }
        };
        evt.target.responseText = angular.toJson(epubvar);

        scope.uploadComplete(evt);
    });

    it('ImagesCtrl: test modalError', function() {
        scope.testEnv = true;
        scope.modalError(1);
    });

    it('ImagesCtrl: test uploadNewDoc', inject(function($httpBackend) {
        var evt = {
            target: {
                responseText: 'ojnervjknekjlrnfveljknrvjlenrvkjlenrvkjenrkjvlnelrvnjelnrvuelrviuneurlivneruinvleuinvlsdnvlsundvlugetSign'
            }
        };
        evt.target.responseText = angular.toJson(epubvar);
        localStorage.setItem('compteId', compteId);

        scope.uploadNewDoc(evt);
        $httpBackend.flush();
    }));

    it('ImagesCtrl: test de l\'upload de Fichiers epub', inject(function($httpBackend) {
        var evt = {
            target: {
                responseText: ''
            }
        };
        localStorage.setItem('listTags', JSON.stringify(scope.listTags));
        evt.target.responseText = angular.toJson(epubvar);

        scope.uploadComplete(evt);
        $httpBackend.flush();
    }));

    it('ImagesCtrl: enlever un block de l\'espace de travail', inject(function() {
        scope.remove(scope.currentImage);
    }));

    it('ImagesCtrl: getPictoTag', inject(function() {
        scope.listTags = tags;
        var block = {
            tag: '52c588a861485ed41c000003'
        };
        var rslt = scope.getPictoTag(block);
        expect(rslt).toBe('');
    }));

    it('ImagesCtrl: Appeler mdification du texte', inject(function() {
        scope.modifierTexte();
        scope.currentImage.ocrOk = true;
        scope.listTags = [{
            _id: '52c588a861485ed41c000003',
            libelle: 'Titre niveau 1'
        }, {
            _id: '52c588a861485ed41c000004',
            libelle: 'Titre niveau 2'
        }, {
            _id: '52c588a861485ed41c000005',
            libelle: 'Titre niveau 3'
        }, {
            _id: '52c588a861485ed41c000006',
            libelle: 'Paragraphe'
        }];
        initListTags();
        scope.tagSelected = '52c588a861485ed41c000003';
        scope.modifierTexte();
    }));


    it('ImagesCtrl: Appeler htmlPreview', inject(function(serviceCheck, $httpBackend, $rootScope) {
        var prom = serviceCheck.htmlPreview('http://test');
        prom.then(function(rst) {
            console.log('Appeler htmlPreview');
        });
        $rootScope.$apply();
        $httpBackend.flush();
        localStorage.removeItem('compteId');
        prom = serviceCheck.htmlPreview('http://test');
    }));

    it('ImagesCtrl: Appeler htmlImages', inject(function(serviceCheck, $httpBackend) {
        var prom = serviceCheck.htmlImage('http://test');
        prom.then(function(rst) {
            console.log('htmlImages');
        });
        $httpBackend.flush();
        localStorage.removeItem('compteId');
        prom = serviceCheck.htmlImage('');
    }));

    it('ImagesCtrl: Appeler setID', inject(function(htmlEpubTool) {
        htmlEpubTool.setIdToCnedObject(blockVar);
        scope.blocks = {
            children: [blockVar]
        };
        if (imgVar) {
            htmlEpubTool.setImgsIntoCnedObject(blockImg, imgVar);
        }
        htmlEpubTool.cleanHTML({
            documentHtml: wikiVar
        });
    }));

    it('ImagesCtrl: Appeler filter showText', inject(function(htmlEpubTool, $compile, $filter) {
        $filter('showText')('sGf2AQ3EALVpp122nDQQQdFf0kvV199dSBwLZW33norum14Vw3KcKA58sgjOwWXGcYE1xFYB3a4dXihLl5qSKt', 10, false);
        $filter('showText')('sGf2AQ3EALVpp122nDQQQdFf0kvV199dSBwLZW33norum14Vw3KcKA58sgjOwWXGcYE1xFYB3a4dXihLl5qSKt', 1000, false);
        $filter('showText')('<div>sGf2AQ3EALVpp122nDQQQdFf0kvV199d</div>', 10, true);
        // var ele = document.createElement('div');
        // ele.outerHTML = '<div dynamic="test"></div>';
        $compile('<div dynamic="test"></div>')(scope);
    }));

    it('ImagesCtrl: getClasses', inject(function() {
        var table = {
            length: function() {}
        };
        blockVar.class = 'titre1';
        blockVar.type = 1;
        getClasses(blockVar, table);
        // console.log(table.length);
    }));

    it('ImagesCtrl: Avoir le texte du WYSIWYG', inject(function($rootScope) {
        $rootScope.ckEditorValue = '<p>text oceriser</p>';
        scope.getOcrText();
    }));

    it('ImagesCtrl: Generation de la synthese vocale', inject(function($httpBackend) {
        scope.blocks.children[0] = scope.currentImage;
        scope.textToSpeech();
        $httpBackend.flush();
        expect(scope.currentImage.synthese).toEqual('data:audio/mpeg;base64,//NAxAAAAANIAUAAAN4JfOX//btmp/7f/vb//tuo0b//t7reWUp//yZ9R9zM88eJC8FjhKVFwkjRyRP//5jWPeY3bOMGpAHo3LkSQtMdRHVP//+r/');
    }));

    it('ImagesCtrl: Activation de l\'enregistrement des blocks', inject(function() {
        scope.permitSaveblocks();
    }));

    it('ImagesCtrl: init CKeditor', inject(function() {
        window.CKEDITOR.instances.editorOcr = {
            on: function(a, b) {
                scope.getOcrText();
            }
        };
        scope.initCkEditorChange();
    }));

    it('ImagesCtrl: remove2', inject(function() {
        scope.remove2();
    }));

    it('ImagesCtrl: playSong', inject(function() {
        // var elem = document.createElement('div');
        // elem.innerHTML = '<audio id="player" src="" preload="auto"></audio>'
        // window.document.body.appendChild(elem);
        //scope.playSong();
    }));

    it('ImagesCtrl: updateProgress', inject(function() {
        var oEvent = {
            lengthComputable: true,
            loaded: 10,
            total: 100
        };
        scope.updateProgress(oEvent);
    }));

    it('ImagesCtrl: epubLink', inject(function($httpBackend) {
        scope.epubLink('http://www.solidfiles.com/d/f1e92ced25/Stricken_Resolve.epub');
        $httpBackend.flush();
    }));

    it('ImagesCtrl:setFiles', function() {
        var elm = {
            files: [{
                'webkitRelativePath': '',
                'lastModifiedDate': '2014-06-12T10:12:18.000Z',
                'name': 'p4.pdf',
                'type': 'application/epub',
                'size': 1208
            }]
        };
        scope.setFiles(elm);
        expect(scope.files.length).toEqual(0);
        elm = {
            files: [{
                'webkitRelativePath': '',
                'lastModifiedDate': '2014-06-12T10:12:18.000Z',
                'name': 'p4.png',
                'type': 'image/png',
                'size': 1208
            }]
        };
        scope.setFiles(elm);
        expect(scope.files.length).toEqual(1);
    });

    // it('ImagesCtrl: updateDragDrop', inject(function() {
    //     window.simul = function(event) {
    //         console.log('event', event)
    //         scope.updateDragDrop(event, {});
    //     };
    //     var trgt = '<li id="cut_piece" onclick="simul(event);"></li> ';
    //     var elem = document.createElement('div');
    //     elem.className = 'layer_container';
    //     elem.innerHTML = trgt;
    //     document.body.appendChild(elem);
    //     spyOnEvent('#cut_piece', 'click');
    //     $('#cut_piece').trigger("click");

    // }));

    it('ImagesCtrl: Stockage dans Dropbox et Redirection automatique vers l\'aperçu', inject(function($httpBackend, $window) {
        scope.showlocks();
        $httpBackend.flush();
        expect($window.location.href).toBe('https://dl.dropboxusercontent.com/s/gdhgsjdggd/doc02.html#/apercu?key=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec');
        expect(scope.loader).toEqual(false);
    }));

    it('ImagesCtrl: uploadFailed', inject(function() {
        var evt = {};
        scope.uploadFailed();
    }));

    it('ImagesCtrl: Modification du type du document', inject(function() {
        scope.tagSelected = tags[1];
        scope.blocks.children[0] = scope.currentImage;
        scope.updateBlockType();
        expect(scope.blocks.children[0].tag).toEqual(tags[1]);
    }));

    it('ImagesCtrl: changer les lien relatif en lien absolut', inject(function() {
        baseUrl = 'http://fr.wikipedia.org/wiki/Wiki';
        changeRelatifLink('https://dl.dropboxusercontent.com/s/sxkrx1le4zwoqh6/images/e7SN03ANPB0014_cover.jpg');
        changeRelatifLink('https://dl.dropboxusercontent.com/s/sxkrx1le4zwoqh6/adaptation.html/#');
    }));

    it('ImagesCtrl: Afficher le bouton prévisualisation synthese vocale', inject(function() {
        scope.showPlaySong();
    }));

    it('ImagesCtrl: loadPdfLink pass le lien du fichier pdf au serveur pour le telecharger et le recupere', inject(function($httpBackend) {
        var data = {
            lien: 'http://info.sio2.be/tdtooo/sostdt.pdf'
        };
        $httpBackend.flush();
        scope.loadPdfLink();
        expect(scope.pdflink).toBe('http://info.sio2.be/tdtooo/sostdt.pdf');
        expect(scope.pdferrLien).toEqual(false);
        expect(data.lien).toEqual(scope.pdflink);
        expect(scope.pdfinfo).toEqual(true);
        expect(scope.showPdfCanvas).toEqual(true);

        expect(scope.showPdfCanvas).toEqual(true);


    }));

    it('ImagesCtrl: loadPdfLink pass le lien du fichier pdf au serveur pour le telecharger et le recupere 2', inject(function($httpBackend) {
        var data = {
            lien: 'http://info.sio2.be/tdtooo/sostdt.pdf'
        };
        localStorage.setItem('pdfFound', 'http://info.sio2.be/tdtooo/sostdt.pdf');

        $httpBackend.flush();
        scope.loadPdfLink();


    }));


    it('ImagesCtrl: cverifie le lien si il est valide', inject(function(configuration) {
        var lien = configuration.URL_REQUEST + '/#/';
        var tmp = scope.verifLink(lien);
        expect(tmp).toEqual(false);
        lien = 'http://info.sio2.be/tdtooo/sostdt.pdf';
        tmp = scope.verifLink(lien);
        expect(tmp).toEqual(true);
        lien = 'https://info.sio2.be/tdtooo/sostdt.pdf';
        tmp = scope.verifLink(lien);
        expect(tmp).toEqual(true);
    }));

    it('ImagesCtrl:canvasToImage change image background', inject(function() {
        var tmp = scope.canvasToImage('#FFFFFF');
        expect(tmp).not.toBe(null);
    }));

    it('ImagesCtrl:base64ToUint8Array converte base64 to uint8', inject(function() {
        var tmp = scope.base64ToUint8Array(base64);
        expect(tmp).not.toBe(null);
    }));

    it('ImagesCtrl: initImage', inject(function($httpBackend) {
        expect(scope.initImage).toBeDefined();
        scope.initImage();
        $httpBackend.flush();
    }));

    it('ImagesCtrl: Test toggleMinimized', inject(function() {
        scope.toggleMinimized(scope.currentImage);
    }));

    it('ImagesCtrl: vocalised should be defined', inject(function() {
        expect(scope.vocalised).toBeDefined();
        var param = 'test';
        scope.vocalised(param);
        expect(scope.vocalised(param)).toBeTruthy();
        param = null;
        expect(scope.vocalised(param)).toBeFalsy();
    }));

    it('ImagesCtrl: ocerised should be defined', inject(function() {
        expect(scope.ocerised).toBeDefined();
        var param = 'test';
        scope.flagOcr = true;
        scope.ocerised(param);
        expect(scope.ocerised(param)).toBeTruthy();
        param = null;
        expect(scope.ocerised(param)).toBeFalsy();
    }));

    it('ImagesCtrl: initCkEditorChange should be defined', inject(function() {
        expect(scope.initCkEditorChange).toBeDefined();
    }));

    it('ImagesCtrl:saveRestBlocks', inject(function($httpBackend) {
        scope.saveRestBlocks();
        $httpBackend.flush();
        expect(scope.loader).toEqual(false);
    }));


    it('ImagesCtrl:createNew', inject(function($rootScope, $httpBackend) {
        $httpBackend.flush();
        $rootScope.uploadDoc = {
            lienPdf: 'http://info.sio2.be/tdtooo/sostdt.pdf'
        };
        scope.createNew();
        expect(scope.pdflinkTaped).toEqual('http://info.sio2.be/tdtooo/sostdt.pdf');

        $rootScope.uploadDoc = {
            lienPdf: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.epub'
        };
        scope.createNew();
        $rootScope.uploadDoc = {
            lienPdf: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.html'
        };
        scope.createNew();
    }));

    it('ImagesCtrl:openApercu', inject(function() {
        scope.openApercu();
    }));


    it('ImagesCtrl:resumeWorking', inject(function($httpBackend) {
        scope.testEnv = true;
        scope.fichierSimilaire = [{
            path: 'listDocument.html'
        }];
        scope.resumeWorking();
        $httpBackend.flush();
    }));

    it('ImagesCtrl:duplicateBlock', function() {
        scope.blocks = blocksList;
        scope.duplicateBlock(blocksList.children[0].children[0]);
    });

    it('ImagesCtrl:duplicateBlock2', function() {
        scope.blocks = blocksList;
        scope.duplicateBlock2(blocksList.children[0].children[0]);
    });

    it('ImagesCtrl:htmlProgressMethode', inject(function() {
        var data = {
            fileProgress: 55
        };
        scope.htmlProgressMethode(data);
    }));

    it('ImagesCtrl:epubProgressMethode', inject(function() {
        var data = {
            fileProgress: 55
        };
        scope.epubProgressMethode(data);
    }));



});