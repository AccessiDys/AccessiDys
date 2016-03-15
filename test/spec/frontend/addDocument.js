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
/* global spyOn:false, CKEDITOR:true, PDFJS:true, BlobBuilder:true */

/** XBrowser blob creation * */
var NewBlob = function(data, datatype) {
    var out;

    try {
        out = new Blob([ data ], {
            type : datatype
        });
        console.debug('case 1');
    } catch (e) {
        window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;

        if (e.name === 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data);
            out = bb.getBlob(datatype);
        } else if (e.name === 'InvalidStateError') {
            // InvalidStateError (tested on FF13 WinXP)
            out = new Blob([ data ], {
                type : datatype
            });
        } else {
            // We're screwed, blob constructor unsupported entirely
            console.debug('Error');
        }
    }
    return out;
};

describe(
        'Controller:AddDocumentCtrl',
        function() {
            var $scope, controller, fileStorageService, q, deferred, ckeditorData, htmlEpubTool, pdf, pdfPage, modal, modalParameter;

            var doc = {
                titre : 'Document 01'
            };

            beforeEach(function() {

                modal = {
                    open : function(Params) {
                        modalParameter = Params;
                    },
                };
                htmlEpubTool = {
                    cleanHTML : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve('<h1>test</h1>');
                        return deferred.promise;
                    }
                };
                spyOn(htmlEpubTool, 'cleanHTML').andCallThrough();

                fileStorageService = {
                    saveTempFile : function(data) {
                        deferred = q.defer();
                        // Place the fake return object here
                        if (data === '<p>test</p>') {
                            deferred.resolve({});
                        } else {
                            deferred.reject({
                                error : 'une erreur est survenue'
                            });
                        }
                        return deferred.promise;
                    },
                    saveFile : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve({});
                        return deferred.promise;
                    },
                    searchFiles : function(online, query) {
                        deferred = q.defer();
                        // Place the fake return object here
                        if (query.indexOf('Doublon') !== -1) {
                            deferred.resolve([ {
                                filename : '2015-9-20' + query + '.html',
                                filepath : '2015-9-20' + query + '.html'
                            } ]);
                        } else {
                            deferred.resolve([ {
                                filename : 'file',
                                filepath : 'file'
                            } ]);
                        }
                        return deferred.promise;
                    },
                    getFile : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve({});
                        return deferred.promise;
                    }
                };
                spyOn(modal, 'open').andCallThrough();
                spyOn(fileStorageService, 'saveTempFile').andCallThrough();
                spyOn(fileStorageService, 'getFile').andCallThrough();
                ckeditorData = 'texte';

                CKEDITOR = {
                    instances : {
                        editorAdd : {
                            setData : function(data) {
                                ckeditorData = data;
                            },
                            getData : function() {
                                return ckeditorData;
                            },
                            checkDirty : function() {
                                return false;
                            },
                            resetDirty : function() {
                            },
                            insertHtml : function() {
                            },
                            destroy : function() {
                            },
                            lang : {
                                format : {}
                            }
                        }
                    },
                    inline : function() {
                        return 1;
                    },
                    addCss : function() {
                        return 1;
                    },
                };
                spyOn(CKEDITOR.instances.editorAdd, 'setData').andCallThrough();
                spyOn(CKEDITOR.instances.editorAdd, 'insertHtml').andCallThrough();
                spyOn(CKEDITOR.instances.editorAdd, 'resetDirty').andCallThrough();
                spyOn(CKEDITOR, 'inline').andCallThrough();
                spyOn(CKEDITOR, 'addCss').andCallThrough();

                spyOn(window, 'FileReader')
                        .andReturn(
                                {
                                    onload : function() {
                                    },
                                    readAsDataURL : function() {
                                        this
                                                .onload({
                                                    target : {
                                                        result : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
                                                    }
                                                });
                                    },
                                    readAsArrayBuffer : function() {
                                        this
                                                .onload({
                                                    target : {
                                                        result : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAwFBMVEXm7NK41k3w8fDv7+q01Tyy0zqv0DeqyjOszDWnxjClxC6iwCu11z6y1DvA2WbY4rCAmSXO3JZDTxOiwC3q7tyryzTs7uSqyi6tzTCmxSukwi9aaxkWGga+3FLv8Ozh6MTT36MrMwywyVBziSC01TbT5ZW9z3Xi6Mq2y2Xu8Oioxy7f572qxzvI33Tb6KvR35ilwTmvykiwzzvV36/G2IPw8O++02+btyepyDKvzzifvSmw0TmtzTbw8PAAAADx8fEC59dUAAAA50lEQVQYV13RaXPCIBAG4FiVqlhyX5o23vfVqUq6mvD//1XZJY5T9xPzzLuwgKXKslQvZSG+6UXgCnFePtBE7e/ivXP/nRvUUl7UqNclvO3rpLqofPDAD8xiu2pOntjamqRy/RqZxs81oeVzwpCwfyA8A+8mLKFku9XfI0YnSKXnSYZ7ahSII+AwrqoMmEFKriAeVrqGM4O4Z+ADZIhjg3R6LtMpWuW0ERs5zunKVHdnnnMLNQqaUS0kyKkjE1aE98b8y9x9JYHH8aZXFMKO6JFMEvhucj3Wj0kY2D92HlHbE/9Vk77mD6srRZqmVEAZAAAAAElFTkSuQmCC'
                                                    }
                                                });
                                    }
                                });

                spyOn(PDFJS, 'getDocument').andCallFake(function() {
                    deferred = q.defer();
                    // Place the fake return object here
                    deferred.resolve(pdf);
                    return deferred.promise;
                });

                pdf = {
                    getPage : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve(pdfPage);
                        return deferred.promise;
                    },
                };

                pdfPage = {
                    error : false,
                    render : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        // deferred.resolve(this.internalRenderTask.callback());
                        return deferred.promise;
                    },
                    getViewport : function() {
                        return {
                            height : 100,
                            width : 100
                        };
                    }
                };

            });

            beforeEach(module('cnedApp'));

            beforeEach(inject(function($controller, $rootScope, $httpBackend, configuration, $q) {
                q = $q;
                $scope = $rootScope.$new();
                controller = $controller('AddDocumentCtrl', {
                    $scope : $scope,
                    fileStorageService : fileStorageService,
                    htmlEpubTool : htmlEpubTool,
                    $modal : modal,
                });
                $scope.testEnv = true;

                $scope.mail = {
                    to : 'test@test.com',
                    content : 'Je viens de partager avec vous le lien suivant : dropbox.com',
                    encoded : '<div>Je viens de partager avec vous le lien suivant : dropbox.com</div>'
                };

                $scope.sharedDoc = 'test.pdf';

                $scope.docApartager = {
                    lienApercu : 'dropbox.com'
                };
                $rootScope.myUser = {
                    dropbox : {
                        accessToken : 'K79U_9sinzkAAAAAAAAAAXOOOO-ShukKKOSFG6tVhO645bUwaYER2g7bN3eHuQsS'
                    }
                };

                $rootScope.currentUser = {
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
                localStorage.setItem('compteId', $rootScope.currentUser.local.token);

                var tags = [ {
                    _id : '52c6cde4f6f46c5a5a000004',
                    libelle : 'Exercice'
                }, {
                    _id : '52c588a861485ed41c000002',
                    libelle : 'Cours'
                } ];
                $scope.destination = 'test@test.com';

                $scope.destinataire = 'test@test.com';

                $scope.dataRecu = {
                    loged : true,
                    dropboxWarning : true,
                    user : {
                        __v : 0,
                        _id : '5329acd20c5ebdb429b2ec66',
                        dropbox : {
                            accessToken : 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                            country : 'MA',
                            'display_name' : 'youbi anas',
                            emails : 'anasyoubi@gmail.com',
                            'referral_link' : 'https://db.tt/wW61wr2c',
                            uid : '264998156'
                        },
                        local : {
                            email : 'anasyoubi@gmail.com',
                            nom : 'youbi',
                            password : '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
                            prenom : 'anas',
                            role : 'admin'
                        }
                    },
                    __v : 0,
                    _id : '5329acd20c5ebdb429b2ec66',
                    dropbox : {
                        accessToken : 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn',
                        country : 'MA',
                        'display_name' : 'youbi anas',
                        emails : 'anasyoubi@gmail.com',
                        'referral_link' : 'https://db.tt/wW61wr2c',
                        uid : '264998156'
                    },
                    local : {
                        email : 'anasyoubi@gmail.com',
                        nom : 'youbi',
                        password : '$2a$08$xo/zX2ZRZL8g0EnGcuTSYu8D5c58hFFVXymf.mR.UwlnCPp/zpq3S',
                        prenom : 'anas',
                        role : 'admin'
                    }
                };

                $scope.dropboxHtmlSearch = [ {
                    'revision' : 919,
                    'rev' : '39721729c92',
                    'thumb_exists' : false,
                    'bytes' : 121273,
                    'modified' : 'Tue, 01 Apr 2014 08:47:13 +0000',
                    'client_mtime' : 'Tue, 01 Apr 2014 08:47:13 +0000',
                    'path' : '/manifestPresent.json',
                    'is_dir' : false,
                    'icon' : 'page_white_code',
                    'root' : 'dropbox',
                    'mime_type' : 'text/html',
                    'size' : '118.4 KB'
                } ];
                $scope.uniqueResult = {
                    'size' : '15 bytes',
                    'rev' : '1f0a503351f',
                    'thumb_exists' : false,
                    'bytes' : 15,
                    'modified' : 'Wed, 10 Aug 2011 18:21:29 +0000',
                    'path' : '/test1.txt',
                    'is_dir' : false,
                    'icon' : 'page_white_text',
                    'root' : 'dropbox',
                    'mime_type' : 'text/plain',
                    'revision' : 496342
                };

                var data = {
                    url : 'dl.dropboxusercontent.com/s/1a5ul0g820on65b/test.html#/listDocument'
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
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/allVersion').respond([ {
                    appVersion : 10
                } ]);
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
                $httpBackend.whenPOST(/externalEpub.*/).respond({
                    html : [ {
                        dataHtml : '<h1>test</h1>'
                    } ]
                });
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/htmlPage').respond('<h1>test</h1>');
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/generateSign').respond({
                    sign : '0a02'
                });
                $httpBackend.whenPOST('https://api.dropbox.com/1/search/?access_token=PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn&query=0a02&root=' + configuration.DROPBOX_TYPE).respond([]);
            }));

            afterEach(inject(function($controller, $rootScope) {
                $rootScope.$apply();
            }));

            it('AddDocumentCtrl:afficherInfoDeconnecte', function() {
                $scope.afficherInfoDeconnecte();
                expect(modal.open).toHaveBeenCalled();
                expect(modalParameter.templateUrl).toEqual('views/common/informationModal.html');
            });

            it('AddDocumentCtrl:openDocument', function() {
                $scope.files = [];
                $scope.openDocument();
                expect($scope.errorMsg).toBe(false);
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.lien).toEqual('');
            });

            it('AddDocumentCtrl:openDocumentEditorWithData', function() {
                $scope.openDocumentEditorWithData();
                expect($scope.alertNew).toEqual('#addDocumentModal');
            });

            it('AddDocumentCtrl:editExistingDocument', function() {
                spyOn(fileStorageService, 'searchFiles').andCallThrough();
                $scope.idDocument = 'file';
                $scope.editExistingDocument();
                expect($scope.pageTitre).toEqual('Editer le document');
                expect(fileStorageService.searchFiles).toHaveBeenCalledWith(true, 'file', 'PBy0CqYP99QAAAAAAAAAATlYTo0pN03u9voi8hWiOY6raNIH-OCAtzhh2O5UNGQn');
            });

            it('AddDocumentCtrl:setFiles', inject(function() {
                var element = {};
                element.files = [];

                // cas fichier non supporté
                element.files[0] = {
                    type : 'image/formatInconnu',
                    name : 'formatInconnu'
                };
                $scope.setFiles(element);
                expect($scope.msgErrorModal).toEqual('Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.');
                expect($scope.errorMsg).toEqual(true);

                // cas fichier word
                element.files[0] = {
                    type : 'application/msword',
                    name : 'mondoc.docx'
                };
                $scope.setFiles(element);
                expect($scope.msgErrorModal).toEqual('Les documents de ce type doivent être insérés en effectuant un copier/coller du contenu.');
                expect($scope.errorMsg).toEqual(true);

                // cas fichier epub
                element.files[0] = {
                    type : '',
                    name : 'fichierEpub.epub'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierEpub');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);

                // cas fichier image png
                element.files[0] = {
                    type : 'image/png',
                    name : 'fichierpng.png'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierpng');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
                expect($scope.files[0]).toEqual(element.files[0]);

                // cas fichier image jpeg
                element.files[0] = {
                    type : 'image/jpeg',
                    name : 'fichierjpeg.jpeg'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierjpeg');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
                expect($scope.files[0]).toEqual(element.files[0]);

                // cas fichier image jpg
                element.files[0] = {
                    type : 'image/jpeg',
                    name : 'fichierjpg.jpg'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierjpg');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
                expect($scope.files[0]).toEqual(element.files[0]);

                // cas fichier image pdf
                element.files[0] = {
                    type : 'application/pdf',
                    name : 'fichierpdf.pdf'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierpdf');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
                expect($scope.files[0]).toEqual(element.files[0]);

                // cas fichier image epub+zip
                element.files[0] = {
                    type : 'application/epub+zip',
                    name : 'fichierepub.epub'
                };
                $scope.setFiles(element);
                expect($scope.doc.titre).toEqual('fichierepub');
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
                expect($scope.files[0]).toEqual(element.files[0]);

            }));

            it('AddDocumentCtrl:clearUploadFile', function() {
                expect($scope.clearUploadFile).toBeDefined();
                $scope.clearUploadFile();
                expect($scope.files).toEqual([]);
            });

            it('AddDocumentCtrl:createCKEditor', inject(function() {
                expect($scope.createCKEditor).toBeDefined();
                var ckConfig = {}, listTags = [ {
                    balise : 'blockquote',
                    libelle : 'test_blockquote'
                }, {
                    balise : 'div',
                    libelle : 'test_div'
                }, {
                    balise : 'p',
                    libelle : 'test_non_div'
                } ];
                $scope.createCKEditor(ckConfig, listTags);

                expect(ckConfig.on).toBeDefined();
                expect(ckConfig.on.instanceReady).toBeDefined();
                expect(ckConfig.on.change).toBeDefined();
                expect(ckConfig.on.afterPaste).toBeDefined();

                spyOn(ckConfig.on, 'instanceReady').andCallThrough();
                ckConfig.on.instanceReady();

                expect(CKEDITOR.instances.editorAdd.lang.format.tag_blockquote).toEqual('test_blockquote');
                expect(CKEDITOR.instances.editorAdd.lang.format.tag_p).toEqual('test_non_div');
                expect(CKEDITOR.instances.editorAdd.lang.format.tag_test_div).toEqual('test_div');

                expect(CKEDITOR.inline).toHaveBeenCalled();
                expect($scope.editor).toBeDefined();

            }));

            it('AddDocumentCtrl:generateMD5', inject(function() {
                expect($scope.generateMD5('test')).toEqual('098f6bcd4621d373cade4e832627b4f6');
            }));

            it('AddDocumentCtrl:showSaveDialog', inject(function() {
                $scope.docTitre = '';
                $scope.showSaveDialog();
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);

                $scope.docTitre = 'titre';
                $scope.showSaveDialog();
                expect($scope.msgErrorModal).toEqual('');
                expect($scope.errorMsg).toEqual(false);
            }));

            it('AddDocumentCtrl:processLink', inject(function() {
                $scope.lien = 'http://www.wikipedia.org/';
                var result = $scope.processLink('<a href="/test">test</a>');
                expect(result).toEqual('<a href="https://www.wikipedia.org/test">test</a>');

                result = $scope.processLink('<img src="/test"/>');
                expect(result).toEqual('<img src="https://www.wikipedia.org/test"/>');

                $scope.lien = null;
                result = $scope.processLink('<a href="/test">test</a>');
                expect(result).toEqual('<a href="/test">test</a>');
            }));

            it('AddDocumentCtrl:openApercu', inject(function() {
                $scope.currentData = '<p>test</p>';
                $scope.openApercu();
                expect(fileStorageService.saveTempFile).toHaveBeenCalled();
            }));

            it('AddDocumentCtrl:cancelSave', inject(function() {
                $scope.errorMsg = true;
                $scope.msgErrorModal = 'testMsg';
                $scope.cancelSave();
                expect($scope.errorMsg).toEqual(false);
                expect($scope.msgErrorModal).toEqual('');
            }));

            it('AddDocumentCtrl:uploadProgress', inject(function() {
                var event = {
                    lengthComputable : true,
                    loaded : 10,
                    total : 100
                };
                $scope.uploadProgress(event);
                expect($scope.loaderProgress).toEqual(10);
            }));

            it('AddDocumentCtrl:verifyLink', inject(function() {
                expect($scope.verifyLink('http://test.com')).toEqual(true);
                expect($scope.verifyLink('https://test.com')).toEqual(true);
                expect($scope.verifyLink('htts://test.com')).toEqual(false);
                expect($scope.verifyLink('ftp://test.com')).toEqual(false);
            }));

            it('AddDocumentCtrl:uploadFile', inject(function($rootScope) {
                $scope.files = [];
                $scope.uploadFile();
                expect($scope.msgErrorModal).toEqual('Vous devez choisir un fichier.');
                expect($scope.errorMsg).toEqual(true);

                $scope.files = [ {
                    type : 'image/png'
                } ];
                $scope.uploadFile();
                expect($scope.loaderMessage).toEqual('Chargement de votre/vos image(s) en cours. Veuillez patienter ');
                $rootScope.$apply();

                $scope.files = [ {
                    type : 'application/pdf'
                } ];
                $scope.uploadFile();
                expect($scope.loaderMessage).toEqual('Chargement de votre document PDF en cours. Veuillez patienter ');
                $rootScope.$apply();
            }));

            it('AddDocumentCtrl:save', inject(function($rootScope) {
                // cas titre trop long
                $scope.docTitre = 'titretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrement';
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.save();
                expect($scope.msgErrorModal).toEqual('Le titre est trop long !');
                expect($scope.errorMsg).toEqual(true);

                // cas titre non renseigne
                $scope.docTitre = '';
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.save();
                expect($scope.msgErrorModal).toEqual('Le titre est obligatoire !');
                expect($scope.errorMsg).toEqual(true);

                // cas titre avec caracteres speciaux
                $scope.docTitre = 'titreAvec_Caract&res_speciaux';
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.save();
                expect($scope.msgErrorModal).toEqual('Veuillez ne pas utiliser les caractères spéciaux.');
                expect($scope.errorMsg).toEqual(true);

                // cas document existe deja
                $scope.docTitre = 'documentDoublon';
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.save();
                $rootScope.$apply();
                expect($scope.msgErrorModal).toEqual('Le document existe déjà');
                expect($scope.errorMsg).toEqual(true);

                // cas sans token dropbox
                $rootScope.currentUser.dropbox.accessToken = undefined;
                $scope.docTitre = 'document';
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.save();
                expect($scope.msgErrorModal).toEqual('Veuillez-vous connecter pour pouvoir enregistrer votre document');
                expect($scope.errorMsg).toEqual(true);
            }));

            it('AddDocumentCtrl:showLoader', inject(function() {
                $scope.showLoader('test');
                expect($scope.loader).toEqual(true);
                expect($scope.showloaderProgress).toEqual(true);
                expect($scope.loaderMessage).toEqual('test');
            }));

            it('AddDocumentCtrl:hideLoader', inject(function($timeout) {
                $scope.hideLoader();
                $timeout(function() {
                    expect($scope.loader).toEqual(false);
                    expect($scope.showloaderProgress).toEqual(false);
                }, 0);
            }));

            it('AddDocumentCtrl:ajouterDocument', inject(function(dropbox, $rootScope) {
                // cas titre trop long
                $scope.doc = {
                    titre : 'titretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrementtitretroplongpourpouvoiretreprisencomptelorsdelenregistrement'
                };
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.ajouterDocument();
                expect($scope.msgErrorModal).toEqual('Le titre est trop long !');
                expect($scope.errorMsg).toEqual(true);

                // cas titre non renseigne
                $scope.doc = {
                    titre : ''
                };
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.ajouterDocument();
                expect($scope.msgErrorModal).toEqual('Le titre est obligatoire !');
                expect($scope.errorMsg).toEqual(true);

                // cas titre avec caracteres speciaux

                $scope.doc = {
                    titre : 'titreAvec_Caract&res_speciaux'
                };
                $scope.msgErrorModal = '';
                $scope.errorMsg = false;
                $scope.ajouterDocument();
                expect($scope.msgErrorModal).toEqual('Veuillez ne pas utiliser les caractères spéciaux.');
                expect($scope.errorMsg).toEqual(true);

                // cas document existant

                $scope.doc.titre = 'monDocument';
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve([ {
                    filepath : 'a_monDocument_.html'
                } ]);
                spyOn(fileStorageService, 'searchFiles').andReturn(deferred.promise);
                $scope.ajouterDocument();
                $rootScope.$apply();
                expect($scope.msgErrorModal).toEqual('Le document existe déjà');
                expect($scope.errorMsg).toEqual(true);

                $scope.doc.titre = 'bonDocument';
                $scope.lien = undefined;
                $scope.files = [];
                $scope.ajouterDocument();
                $rootScope.$apply();
                expect($scope.msgErrorModal).toEqual('Veuillez saisir un lien ou uploader un fichier !');
                expect($scope.errorMsg).toEqual(true);

                $scope.doc.titre = 'bonDocument';
                $scope.lien = 'lienInvalide';
                $scope.files = [];
                $scope.ajouterDocument();
                $rootScope.$apply();
                expect($scope.msgErrorModal).toEqual('Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"');
                expect($scope.errorMsg).toEqual(true);

            }));

            it('AddDocumentCtrl:getText', inject(function() {
                $scope.getText();
                expect($scope.currentData).toEqual('texte');
                expect($scope.alertNew).toEqual('#save-new-modal');
                CKEDITOR.instances.editorAdd.setData('');
                $scope.getText();
                expect($scope.currentData).toEqual('');
                expect($scope.alertNew).toEqual('#addDocumentModal');
            }));

            it('AddDocumentCtrl:insertPageBreak', inject(function() {
                $scope.insertPageBreak();
                expect(CKEDITOR.instances.editorAdd.insertHtml).toHaveBeenCalled();
            }));

            it('AddDocumentCtrl:validerAjoutDocument', inject(function($rootScope, $httpBackend) {
                $scope.doc = {
                    titre : 'monDocument'
                };
                $scope.files = [ {
                    type : 'invalid'
                } ];
                $scope.validerAjoutDocument();
                expect($scope.pageTitre).toEqual('Ajouter un document');
                expect($scope.existingFile).toBe(null);
                expect($scope.doc).toEqual({});
                expect($scope.msgErrorModal).toEqual('Le type de fichier n\'est pas supporté. Merci de ne rattacher que des fichiers PDF, des ePub  ou des images.');
                expect($scope.errorMsg).toBe(true);

                $scope.files = [ new NewBlob('<h1>test</h1>', 'application/pdf') ];
                $scope.validerAjoutDocument();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

                $scope.files = [ new NewBlob('<h1>test</h1>', 'image/jpeg') ];
                $scope.validerAjoutDocument();
                expect($scope.files).toEqual([]);

                $scope.files = [ new NewBlob('<h1>test</h1>', 'image/png') ];
                $scope.validerAjoutDocument();
                expect($scope.files).toEqual([]);

                $scope.files = [ new NewBlob('<h1>test</h1>', 'image/jpg') ];
                $scope.validerAjoutDocument();
                expect($scope.files).toEqual([]);

                $scope.files = [ new NewBlob('<h1>test</h1>', 'application/epub+zip') ];
                $scope.validerAjoutDocument();
                expect($scope.loaderProgress).toBe(10);

                $scope.files = [ {
                    type : '',
                    name : 'file.epub'
                } ];
                $scope.validerAjoutDocument();
                expect($scope.loaderProgress).toBe(10);

                $scope.files = [];
                $scope.lien = 'http://wikipedia.org/test.epub';
                $scope.validerAjoutDocument();
                expect($scope.loaderMessage).toEqual('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                expect($scope.loader).toBe(true);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

                $scope.files = [];
                $scope.lien = 'http://wikipedia.org/test.pdf';
                $scope.validerAjoutDocument();
                expect($scope.loaderMessage).toEqual('Traitement de votre document en cours');
                expect($scope.loader).toBe(true);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

                $scope.files = [];
                $scope.lien = 'https://wikipedia.org/test.pdf';
                $scope.validerAjoutDocument();
                expect($scope.loaderMessage).toEqual('Traitement de votre document en cours');
                expect($scope.loader).toBe(true);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

                $scope.files = [];
                $scope.lien = 'http://wikipedia.org/';
                $scope.validerAjoutDocument();
                expect($scope.loaderMessage).toEqual('Traitement de votre document en cours');
                expect($scope.loader).toBe(true);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();
            }));

            it('AddDocumentCtrl:loadPdfPage', inject(function($rootScope) {
                $scope.loadPdfPage(pdf, 1);
                $rootScope.$apply();
                pdfPage.render();

            }));

            it('AddDocumentCtrl:initLoadExistingDocument ', inject(function() {
                $scope.idDocument = 'test';
                $scope.initLoadExistingDocument();
                expect($scope.loaderMessage).toEqual('Chargement de votre document en cours');
                expect($scope.loader).toBe(true);
                expect($scope.pageTitre).toEqual('Editer le document');
            }));

            it('AddDocumentCtrl:uploadComplete', inject(function($httpBackend, $timeout) {
                var evt = {
                    target : {
                        status : 200,
                        responseText : '{ "tooManyHtml" : true}'
                    }
                };
                $scope.uploadComplete(evt);

                expect($scope.loaderProgress).toBe(100);
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);

                evt.target.responseText = '{ "oversized" : true }';
                $scope.uploadComplete(evt);
                expect($scope.loaderProgress).toBe(100);
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);

                evt.target.responseText = '{ "oversizedIMG" : true }';
                $scope.uploadComplete(evt);
                expect($scope.loaderProgress).toBe(100);
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);

                evt.target.responseText = '{ "html" : [{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="}], "img" : [ {"link" : "http://example.org/icon.png"} ] }';
                $scope.uploadComplete(evt);
                expect($scope.loaderProgress).toBe(100);
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

                evt.target.responseText = '{ "html" : [{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="},{ "dataHtml" : "PGgxPnRlc3Q8L2gxPg=="}], "img" : [ {"link" : "http://example.org/icon.png"} ] }';
                $scope.uploadComplete(evt);
                expect($scope.loaderProgress).toBe(100);
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);
                $httpBackend.flush();
                expect(CKEDITOR.instances.editorAdd.setData).toHaveBeenCalled();

            }));

            it('AddDocumentCtrl:uploadFailed ', inject(function($timeout) {
                $scope.uploadFailed();
                $timeout(function() {
                    expect($scope.loader).toBe(false);
                }, 0);
            }));

            it('AddDocumentCtrl:resetDirtyCKEditor ', inject(function() {
                $scope.resetDirtyCKEditor();
                expect(CKEDITOR.instances.editorAdd.resetDirty).toHaveBeenCalled();
            }));

            it('AddDocumentCtrl:resizeEditor agrandissement', inject(function() {
                $scope.resizeDocEditor = 'Réduire';
                $scope.resizeEditor();
                expect($scope.resizeDocEditor).toEqual('Agrandir');
            }));

            it('AddDocumentCtrl:resizeEditor réduction', inject(function() {
                $scope.resizeDocEditor = 'Agrandir';
                $scope.resizeEditor();
                expect($scope.resizeDocEditor).toEqual('Réduire');
            }));

            it('AddDocumentCtrl:applyStyles', inject(function($timeout) {

                $scope.caret = {
                    savePosition : function() {
                    },
                    restorePosition : function() {
                    }
                };
                spyOn($scope.caret, 'savePosition');
                spyOn($scope.caret, 'restorePosition');
                $scope.applyStyles();
                expect($scope.caret.savePosition).toHaveBeenCalled();
                $timeout(function() {
                    expect($scope.applyRules).toBe(true);
                });
                $timeout.flush();
                expect($scope.caret.restorePosition).toHaveBeenCalled();
                expect($scope.applyRules).toBe(false);

            }));

            it('AddDocumentCtrl:getEpubLink', inject(function($httpBackend) {
                $scope.showLoader = function() {
                };
                spyOn($scope, 'showLoader');
                $scope.epubDataToEditor = function() {
                };
                spyOn($scope, 'epubDataToEditor');

                $scope.getEpubLink();
                expect($scope.showLoader).toHaveBeenCalled();
                $httpBackend.flush();
                var data = {
                    html : [ {
                        dataHtml : '<h1>test</h1>'
                    } ]
                };
                expect($scope.epubDataToEditor).toHaveBeenCalled();
                expect($scope.epubDataToEditor).toHaveBeenCalledWith(data);
            }));

            it('AddDocumentCtrl:epubDataToEditor', function() {
                var epubContent = {
                    html : [ {
                        dataHtml : '<h1>test</h1>'
                    } ]
                };
                $scope.hideLoader = function() {
                };
                spyOn($scope, 'hideLoader');

                $scope.epubDataToEditor(epubContent);
                var resultHtml = '<h1>test</h1>';
                expect(htmlEpubTool.cleanHTML).toHaveBeenCalledWith(resultHtml);
                expect($scope.hideLoader).toHaveBeenCalled();

            });

            it('AddDocumentCtrl:clearLien', function() {
                $scope.lien = 'lien';
                $scope.clearLien();
                expect($scope.lien).toEqual('');
            });

            it('ApercuCtrl:affichageInfoDeconnecte()', function() {
                $scope.affichageInfoDeconnecte();
                expect(modal.open).toHaveBeenCalled();
                expect(modalParameter.templateUrl).toEqual('views/common/informationModal.html');
                var modalContent = modalParameter.resolve.reason();
                expect(modalContent).toEqual('/listDocument');
            });

        });
