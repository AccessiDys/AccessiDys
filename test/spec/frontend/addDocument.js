/* File: addDocument.js
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
/* global spyOn:false, CKEDITOR:true, PDFJS:true */

describe(
    'Controller:AddDocumentCtrl',
    function () {
        var $scope, controller, fileStorageService, q, deferred, ckeditorData, htmlEpubTool, pdf, pdfPage, modal, modalParameter, externalEpubRequest, tags, tagsService, cleanHTMLSpy;

        var documentService;
        var doc = {
            titre: 'Document 01'
        };

        beforeEach(function () {

            modal = {
                open: function (Params) {
                    modalParameter = Params;
                }
            };
            htmlEpubTool = {
                cleanHTML: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve('<h1>test</h1>');
                    return deferred.promise;
                }
            };
            cleanHTMLSpy = spyOn(htmlEpubTool, 'cleanHTML').and.callThrough();

            fileStorageService = {
                saveTempFile: function (data) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (data === '<p>test</p>') {
                        deferred.resolve({});
                    } else {
                        deferred.reject({
                            error: 'une erreur est survenue'
                        });
                    }
                    return deferred.promise;
                },
                saveFile: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({});
                    return deferred.promise;
                },
                searchFiles: function (online, query) {
                    deferred = q.defer();
                    // Place the fake return object here
                    if (query.indexOf('Doublon') !== -1) {
                        deferred.resolve([{
                            filename: '2015-9-20' + query + '.html',
                            filepath: '2015-9-20' + query + '.html'
                        }]);
                    } else {
                        deferred.resolve([{
                            filename: 'file',
                            filepath: 'file'
                        }]);
                    }
                    return deferred.promise;
                },
                getFile: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({});
                    return deferred.promise;
                }
            };
            spyOn(modal, 'open').and.callThrough();
            spyOn(fileStorageService, 'saveTempFile').and.callThrough();
            spyOn(fileStorageService, 'getFile').and.callThrough();

            documentService = {
                openDocument: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve({
                        title: 'file 1 --',
                        uri: 'http://test.com'
                    });
                    return deferred.promise;
                }
            };

            spyOn(documentService, 'openDocument').and.callThrough();

            tags = [{
                _id: '52c6cde4f6f46c5a5a000004',
                libelle: 'Exercice'
            }, {
                _id: '52c588a861485ed41c000002',
                libelle: 'Cours'
            }, {
                _id: '52c588a861485ed41c000001',
                libelle: 'Maintenant',
                balise: 'div'
            }, {
                _id: '52c588a861485ed41c000000',
                libelle: '---',
                balise: 'blockquote'
            }];

            tagsService = {
                getTags: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve(tags);
                    return deferred.promise;
                }
            };
            spyOn(tagsService, 'getTags').and.callThrough();


            ckeditorData = 'texte';

            CKEDITOR = {
                instances: {
                    editorAdd: {
                        setData: function (data) {
                            ckeditorData = data;
                        },
                        getData: function () {
                            return ckeditorData;
                        },
                        checkDirty: function () {
                            return false;
                        },
                        resetDirty: function () {
                        },
                        insertHtml: function () {
                        },
                        destroy: function () {
                        },
                        lang: {
                            format: {}
                        }
                    }
                },
                inline: function () {
                    return 1;
                },
                addCss: function () {
                    return 1;
                }
            };
            spyOn(CKEDITOR.instances.editorAdd, 'setData').and.callThrough();
            spyOn(CKEDITOR.instances.editorAdd, 'insertHtml').and.callThrough();
            spyOn(CKEDITOR.instances.editorAdd, 'resetDirty').and.callThrough();
            spyOn(CKEDITOR, 'inline').and.callThrough();
            spyOn(CKEDITOR, 'addCss').and.callThrough();

            spyOn(window, 'FileReader')
                .and.returnValue({
                onload: function () {
                },
                readAsDataURL: function () {
                    this
                        .onload({
                            target: {
                                result: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
                            }
                        });
                },
                readAsArrayBuffer: function () {
                    this
                        .onload({
                            target: {
                                result: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
                            }
                        });
                }
            });

            spyOn(PDFJS, 'getDocument').and.callFake(function () {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve(pdf);
                return deferred.promise;
            });

            pdf = {
                getPage: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve(pdfPage);
                    return deferred.promise;
                },
                numPages: 3
            };

            pdfPage = {
                error: false,
                render: function () {
                    deferred = q.defer();
                    // Place the fake return object here
                    // deferred.resolve(this.internalRenderTask.callback());
                    return deferred.promise;
                },
                getViewport: function () {
                    return {
                        height: 100,
                        width: 100
                    };
                }
            };

        });

        beforeEach(module('cnedApp'));

        beforeEach(inject(function ($controller, $rootScope, $httpBackend, configuration, $q) {
            q = $q;
            $scope = $rootScope.$new();
            controller = $controller('AddDocumentCtrl', {
                $scope: $scope,
                fileStorageService: fileStorageService,
                htmlEpubTool: htmlEpubTool,
                tagsService: tagsService,
                $modal: modal
            });
            $scope.testEnv = true;

            $scope.mail = {
                to: 'test@test.com',
                content: 'Je viens de partager avec vous le lien suivant : dropbox.com',
                encoded: '<div>Je viens de partager avec vous le lien suivant : dropbox.com</div>'
            };

            $scope.sharedDoc = 'test.pdf';

            $scope.docApartager = {
                lienApercu: 'dropbox.com'
            };
            $rootScope.myUser = {
                dropbox: {
                    accessToken: 'K79U_9sinzkAAAAAAAAAAXOOOO-ShukKKOSFG6tVhO645bUwaYER2g7bN3eHuQsS'
                }
            };

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
            localStorage.setItem('compteId', $rootScope.currentUser.local.token);


            $scope.destination = 'test@test.com';

            $scope.destinataire = 'test@test.com';

            $scope.dataRecu = {
                loged: true,
                dropboxWarning: true,
                user: {
                    __v: 0,
                    _id: '5329acd20c5ebdb429b2ec66',
                    dropbox: {
                        accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                        country: 'MA',
                        'display_name': 'youbi anas',
                        emails: 'anasyoubi@gmail.com',
                        'referral_link': 'https://db.tt/wW61wr2c',
                        uid: '264998156'
                    },
                    local: {
                        email: 'anasyoubi@gmail.com',
                        nom: 'youbi',
                        password: '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
                        prenom: 'anas',
                        role: 'admin'
                    }
                },
                __v: 0,
                _id: '5329acd20c5ebdb429b2ec66',
                dropbox: {
                    accessToken: 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                    country: 'MA',
                    'display_name': 'youbi anas',
                    emails: 'anasyoubi@gmail.com',
                    'referral_link': 'https://db.tt/wW61wr2c',
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

            $scope.dropboxHtmlSearch = [{
                'revision': 919,
                'rev': '39721729c92',
                'thumb_exists': false,
                'bytes': 121273,
                'modified': 'Tue, 01 Apr 2014 08:47:13 +0000',
                'client_mtime': 'Tue, 01 Apr 2014 08:47:13 +0000',
                'path': '/manifestPresent.json',
                'is_dir': false,
                'icon': 'page_white_code',
                'root': 'dropbox',
                'mime_type': 'text/html',
                'size': '118.4 KB'
            }];
            $scope.uniqueResult = {
                'size': '15 bytes',
                'rev': '1f0a503351f',
                'thumb_exists': false,
                'bytes': 15,
                'modified': 'Wed, 10 Aug 2011 18:21:29 +0000',
                'path': '/test1.txt',
                'is_dir': false,
                'icon': 'page_white_text',
                'root': 'dropbox',
                'mime_type': 'text/plain',
                'revision': 496342
            };

            var data = {
                url: 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/test.html#/listDocument'
            };

            var ladate = new Date();
            var date = new Date();
            var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();

            $scope.apercuName = 'doc02.html';
            var entirePage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">';
            localStorage.setItem('compte', $scope.dataRecu.dropbox.accessToken);
            localStorage.setItem('dropboxLink', 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/' + configuration.CATALOGUE_NAME + '.html#/listDocument');
            // localStorage.setItem('listTags',tags);

            $rootScope.testEnv = true;
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=' + $scope.dataRecu.dropbox.accessToken + '&query=' + doc.titre + '.html&root=' + configuration.DROPBOX_TYPE).respond({});

            $scope.indexPage = '<html class="no-js" lang="fr" manifest=""> <!--<![endif]--><head></head><body><script>var listDocument= [];</script></body></html>';
            $scope.appcache = 'CACHE MANIFEST # 2010-06-18:v2 # Explicitly cached \'master entries\'. CACHE: https://dl.dropboxusercontent.com/s/ee44iev4pgw0avb/test.html # Resources that require the user to be online. NETWORK: * ';

            $httpBackend.whenPOST(configuration.URL_REQUEST + '/sendMail').respond($scope.mail);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/profile?id=' + $rootScope.currentUser.local.token).respond($scope.dataRecu);
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=abc&root=sandbox').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.html&root=sandbox').respond($scope.dropboxHtmlSearch);

            $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.indexPage);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + configuration.CATALOGUE_NAME + '?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/test.json?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/listDocument.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=/2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&root=sandbox').respond($scope.dataRecu);
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/delete/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=/abc&root=sandbox').respond(data);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?').respond(tags);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags').respond(tags);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjaGFpbmUiOiI5dW5nc3l2aSJ9.yG5kCziw7xMLa9_6fzlJpQnX6PSURyX8CGlZeDTW8Ec').respond(tags);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherTagsParProfil').respond(tags);
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(tags);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(entirePage);
            $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(entirePage);

            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//2014-11-14_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox//2014-11-14_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/chercherProfilActuel').respond(tags);
            $httpBackend
                .whenGET('https://api-content.dropbox.com/1/files/' + configuration.DROPBOX_TYPE + '/' + $scope.apercuName + '?access_token=' + $rootScope.currentUser.dropbox.accessToken)
                .respond(
                    '<htlm manifest=""><head><script> var profilId = null; var blocks = {"children":[{"id":461.5687490440905,"originalSource":"data:image/png;base64,","source":{},"text":"","level":0,"children":[{"id":"139482262782797","text":"Un titre","source":{},"children":[],"originalSource":"data:image/png;base64,jhdsghfsdhhtd","tag":"52d0598c563380592bc1d704"},{"id":"1394822627845718","text":"Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte Un example de texte ","source":{},"children":[],"originalSource":"data:image/png;base64,dgshgdhgsdggd","tag":"52c588a861485ed41c000001"}]}]}; var listDocument= []; </script></head><body></body></html>');
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=test.json&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=test.html&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/fileops/copy?root=sandbox&from_path=2014-1-1_abc_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef&to_path=/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.uniqueResult);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenGET('https://api-content.dropbox.com/1/files/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond($scope.appcache);
            $httpBackend.whenPUT('https://api-content.dropbox.com/1/files_put/sandbox/' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.html?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=' + tmpDate + '_abc2_mlzjbdncvklzbnclenrvkunefvklnerlknjefkljvnef.appcache&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=_Document 01_&root=sandbox').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=.appcache&root=sandbox').respond($scope.dropboxHtmlSearch);
            $httpBackend.whenPOST('https://api.dropbox.com/1/shares/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&path=manifestPresent.json&root=sandbox&short_url=false').respond(data);
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([{
                appVersion: 10
            }]);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/listDocument.appcache').respond($scope.appcache);
            $httpBackend.whenGET(configuration.URL_REQUEST + '/index.html').respond($scope.indexPage);

            $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=compteId').respond(tags);
            $httpBackend.whenPOST(/epubUpload.*/).respond({});
            $httpBackend.whenPOST(/fileUpload.*/).respond({});
            $httpBackend
                .whenPOST(configuration.URL_REQUEST + '/sendPdf')
                .respond(
                    'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC');
            $httpBackend
                .whenPOST(configuration.URL_REQUEST + '/sendPdfHTTPS')
                .respond(
                    'iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC');
            externalEpubRequest = $httpBackend.whenPOST(/externalEpub.*/).respond({
                html: [{
                    dataHtml: '<h1>test</h1>'
                }]
            });


            $httpBackend.whenPOST(configuration.URL_REQUEST + '/htmlPage').respond('<h1>test</h1>');
            $httpBackend.whenPOST(configuration.URL_REQUEST + '/generateSign').respond({
                sign: '0a02'
            });
            $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=0a02&root=' + configuration.DROPBOX_TYPE).respond([]);
        }));

        afterEach(inject(function ($controller, $rootScope) {
            $rootScope.$apply();
        }));

        it('AddDocumentCtrl:openDocument', function () {
            $scope.files = [];
            $scope.openDocument();
            expect($scope.pageTitre).toEqual('Ajouter un document');
        });

        it('AddDocumentCtrl:editExistingDocument', function () {
            spyOn(fileStorageService, 'searchFiles').and.callThrough();
            $scope.idDocument = 'file';
            $scope.editExistingDocument();
            expect($scope.pageTitre).toEqual('Editer le document');
            expect(fileStorageService.searchFiles).toHaveBeenCalledWith(true, 'file', 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn');
        });

        it('AddDocumentCtrl:createCKEditor', inject(function () {
            expect($scope.createCKEditor).toBeDefined();
            var ckConfig = {},
                listTags = [{
                    balise: 'blockquote',
                    libelle: 'test_blockquote'
                }, {
                    balise: 'div',
                    libelle: 'test_div'
                }, {
                    balise: 'p',
                    libelle: 'test_non_div'
                }];
            $scope.createCKEditor(ckConfig, listTags);

            expect(ckConfig.on).toBeDefined();
            expect(ckConfig.on.instanceReady).toBeDefined();
            expect(ckConfig.on.change).toBeDefined();
            expect(ckConfig.on.afterPaste).toBeDefined();

            spyOn(ckConfig.on, 'instanceReady').and.callThrough();
            ckConfig.on.instanceReady();

            expect(CKEDITOR.instances.editorAdd.lang.format.tag_blockquote).toEqual('test_blockquote');
            expect(CKEDITOR.instances.editorAdd.lang.format.tag_p).toEqual('test_non_div');
            expect(CKEDITOR.instances.editorAdd.lang.format.tag_test_div).toEqual('test_div');

            expect(CKEDITOR.inline).toHaveBeenCalled();
            expect($scope.editor).toBeDefined();

        }));

        it('AddDocumentCtrl:processLink', inject(function () {
            $scope.lien = 'http://www.wikipedia.org/';
            var result = $scope.processLink('<a href="/test">test</a>');
            expect(result).toEqual('<a href="https://www.wikipedia.org/test">test</a>');

            result = $scope.processLink('<img src="/test"/>');
            expect(result).toEqual('<img src="https://www.wikipedia.org/test"/>');

            $scope.lien = null;
            result = $scope.processLink('<a href="/test">test</a>');
            expect(result).toEqual('<a href="/test">test</a>');
        }));

        it('AddDocumentCtrl:uploadProgress', inject(function () {
            var event = {
                lengthComputable: true,
                loaded: 10,
                total: 100
            };
            $scope.uploadProgress(event);
        }));

        it('AddDocumentCtrl:uploadFile', inject(function () {


            expect($scope.uploadFile).toBeDefined();
        }));

        it('AddDocumentCtrl:save', inject(function () {

            expect($scope.save).toBeDefined();

        }));

        it('AddDocumentCtrl:getText', inject(function () {
            CKEDITOR.instances.editorAdd.setData('texte');
            $scope.getText();
            expect($scope.currentData).toEqual('');
            CKEDITOR.instances.editorAdd.setData('');
            $scope.getText();
            expect($scope.currentData).toEqual('');
        }));

        it('AddDocumentCtrl:insertPageBreak', inject(function () {
            $scope.insertPageBreak();
            expect(CKEDITOR.instances.editorAdd.insertHtml).toHaveBeenCalled();
        }));

        it('AddDocumentCtrl:loadPdfPage', inject(function () {

            deferred = q.defer();
            // Place the fake return object here
            deferred.resolve();
            spyOn(pdfPage, 'render').and.returnValue(deferred.promise);


            $scope.loadPdfPage(pdf, 1);


            //error case
            deferred = q.defer();
            // Place the fake return object here
            deferred.resolve({
                error: 'error'
            });
            $scope.loadPdfPage(pdf, 1);


        }));

        it('AddDocumentCtrl:initLoadExistingDocument ', inject(function () {
            $scope.idDocument = 'test';
            $scope.initLoadExistingDocument();
            expect($scope.pageTitre).toEqual('Editer le document');
        }));

        it('AddDocumentCtrl:uploadComplete', inject(function ($httpBackend) {
            var evt = {
                target: {
                    status: 200,
                    responseText: '{ "tooManyHtml" : true}'
                }
            };
            $scope.uploadComplete(evt);

            evt.target.responseText = '{ "oversized" : true }';
            $scope.uploadComplete(evt);

            evt.target.responseText = '{ "oversizedIMG" : true }';
            $scope.uploadComplete(evt);

            evt.target.responseText = '{ "html" : [{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="}], "img" : [ {"link" : "http://example.org/icon.png"} ] }';
            $scope.uploadComplete(evt);
            $httpBackend.flush();
            expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

            evt.target.responseText = '{ "html" : [{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="},{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="}], "img" : [ {"link" : "http://example.org/icon.png"} ] }';
            $scope.uploadComplete(evt);

            $httpBackend.flush();
            expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

        }));

        it('AddDocumentCtrl:uploadFailed ', inject(function ($timeout) {
            $scope.uploadFailed();
            $timeout(function () {
                expect($scope.loader).toBe(false);
            }, 0);
        }));

        it('AddDocumentCtrl:resetDirtyCKEditor ', inject(function () {
            $scope.resetDirtyCKEditor();
            expect(CKEDITOR.instances.editorAdd.resetDirty).toHaveBeenCalled();
        }));

        it('AddDocumentCtrl:resizeEditor agrandissement', inject(function () {
            $scope.resizeDocEditor = 'Réduire';
            $scope.resizeEditor();
            expect($scope.resizeDocEditor).toEqual('Agrandir');
        }));

        it('AddDocumentCtrl:resizeEditor réduction', inject(function () {
            $scope.resizeDocEditor = 'Agrandir';
            $scope.resizeEditor();
            expect($scope.resizeDocEditor).toEqual('Réduire');
        }));

        it('AddDocumentCtrl:applyStyles', inject(function ($timeout) {

            $scope.caret = {
                savePosition: function () {
                },
                restorePosition: function () {
                }
            };
            spyOn($scope.caret, 'savePosition');
            spyOn($scope.caret, 'restorePosition');
            $scope.applyStyles();
            expect($scope.caret.savePosition).toHaveBeenCalled();
            $timeout(function () {
                expect($scope.caret.restorePosition).toHaveBeenCalled();
            });
            $timeout.flush();
        }));

        it('AddDocumentCtrl:getEpubLink', inject(function ($httpBackend) {
            //nominal case already treated in another test

            //error case

            $httpBackend.expectPOST(/externalEpub.*/).respond(401, '');
            $scope.getEpubLink();

            $httpBackend.flush();


        }));

        it('AddDocumentCtrl:epubDataToEditor', function () {
            var epubContent = {
                html: [{
                    dataHtml: '<h1>test</h1>'
                }],
                img: [{
                    link: 'test'
                }]
            };
            $scope.hideLoader = function () {
            };
            spyOn($scope, 'hideLoader');

            $scope.epubDataToEditor(epubContent);
            var resultHtml = '<h1>test</h1>';
            expect(htmlEpubTool.cleanHTML).toHaveBeenCalledWith(resultHtml);


            //Case more than 1 epubcontent
            epubContent = {
                html: [{
                    dataHtml: '<h1>test</h1>'
                },
                    {
                        dataHtml: '<h1>test2</h1>'
                    }],
                img: [{
                    link: 'test'
                },
                    {
                        link: 'test2'
                    }]
            };
            $scope.epubDataToEditor(epubContent);
            expect(htmlEpubTool.cleanHTML).toHaveBeenCalledWith(resultHtml);


            epubContent = {
                html: [{
                    dataHtml: '<h1>test</h1>'
                },
                    {
                        dataHtml: '<h1>test2</h1>'
                    }]
            };
            $scope.epubDataToEditor(epubContent);

            //Error case
            epubContent = {
                html: [{
                    dataHtml: '<h1>test</h1>'
                },
                    {
                        dataHtml: '<h1>test2</h1>'
                    }]
            };
            $scope.errorMsg = false;

            deferred = q.defer();
            // Place the fake return object here
            deferred.reject({
                error: 'error'
            });
            cleanHTMLSpy.and.returnValue(deferred.promise);

            $scope.epubDataToEditor(epubContent);


        });


        it('AddDocumentCtrl:updateFormats', function () {
            spyOn($scope, 'createCKEditor');
            $scope.updateFormats();
        });
    });