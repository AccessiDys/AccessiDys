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

/* global $:false */
/* jshint undef: true, unused: true */
/* global PDFJS ,Promise */
/* jshint unused: false, undef:false */

angular
    .module('cnedApp')
    .controller(
        'AddDocumentCtrl',
        function ($log, $scope, $rootScope, $stateParams, serviceCheck, $http,
                  htmlEpubTool, fileStorageService,
                  canvasToImage, UtilsService, LoaderService, ToasterService, documentService,
                  UserService, textAngularManager, $state, configuration) {

            $scope.document = {
                filename: null,
                filepath: null,
                data: null
            };

            $scope.initDocumentData = null;

            $scope.idDocument = $stateParams.idDocument;
            $scope.docTitleTmp = $stateParams.title;
            $scope.url = $stateParams.url;
            // Parameters to initialize
            $scope.files = [];
            $scope.currentData = '';
            $scope.pageBreakElement = '<hr/>';
            $scope.resizeDocEditor = 'Agrandir';
            $scope.lien = '';


            $scope.confirmDocumentEdit = function (cb) {

                if ($scope.document.data !== $scope.initDocumentData) {
                    UtilsService.openConfirmModal('INFORMATION', 'Vous risquez de perdre le document en cours d\'enregistrement, êtes-vous sûr de vouloir quitter cette page ?', true)
                        .then(function () {
                            $scope.document.data = $scope.initDocumentData;
                            cb();
                        });
                } else {

                    cb();
                }
            };

            $scope.openDocument = function () {

                $scope.confirmDocumentEdit(function () {
                    documentService.openDocument().then(function (document) {

                        if (document.title) {
                            $scope.document.filename = UtilsService.cleanUpSpecialChars(document.title);
                        }

                        $scope.document.filepath = null;

                        // Presence of a file with the browse button
                        if (document.files.length > 0) {
                            var file = document.files[0];

                            if (document.type === 'pdf') {
                                $scope.loadPdf(file);
                            } else if (document.type === 'image') {
                                $scope.loadImage(file);
                            } else if (document.type === 'epub') {
                                $scope.uploadFile(file);
                            } else if (document.type === 'word') {
                                $scope.loadWordFile(file);
                            }

                        } else if (document.uri) {

                            $scope.lien = document.uri;

                            if (document.uri.indexOf('.epub') > -1) {
                                $scope.getEpubLink();
                            } else if (document.uri.indexOf('.pdf') > -1) {
                                $scope.loadPdfByLien(document.uri);
                            } else {
                                LoaderService.showLoader('document.message.info.treatment.inprogress', true);
                                LoaderService.setLoaderProgress(10);

                                // Retrieving the contents of the body of link by services.
                                serviceCheck.htmlPreview(document.uri)
                                    .then(function (resultHtml) {

                                        if (resultHtml.documentHtml && resultHtml.documentHtml.indexOf('<title>') > -1) {
                                            $scope.document.filename = UtilsService.cleanUpSpecialChars(resultHtml.documentHtml.substring(resultHtml.documentHtml.indexOf('<title>') + 7, resultHtml.documentHtml.indexOf('</title>')));
                                        }

                                        var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                                        promiseClean.then(function (resultClean) {

                                            // Insertion in the editor
                                            $scope.document.data = resultClean;
                                            $scope.initDocumentData = resultClean;
                                            LoaderService.hideLoader();
                                        });
                                    }, function () {

                                        LoaderService.hideLoader();

                                        UtilsService.showInformationModal('information',
                                            'L\'import du document a échoué. Une erreur technique est survenue.<br><br>Veuillez réessayer ultérieurement.', null, true);
                                    });
                            }
                        }

                    });
                });


            };

            // TODO
            /**
             * Replace the internal lincks
             *
             * @method $scope.processLink
             */
            $scope.processLink = function (data) {

                $log.debug('processLink', $scope.lien);
                if ($scope.lien) {
                    var parser = document.createElement('a');
                    parser.href = $scope.lien;
                    $scope.urlHost = parser.hostname;
                    $scope.urlPort = 443;
                    data = data.replace(new RegExp('href="\/(?!\/)', 'g'), 'href="https://' + $scope.urlHost + '/');
                    data = data.replace(new RegExp('src="\/(?!\/)', 'g'), 'src="https://' + $scope.urlHost + '/');

                }
                return data;
            };

            /**
             * Backup performed further to the record in the popup
             * "Save"
             *
             * @method $scope.save
             */
            $scope.save = function () {
                if ($scope.document.filepath || $scope.document.id) {
                    editDocument();
                } else {
                    createDocument();
                }
            };


            function createDocument (){

                var documentData = $scope.document.data;
                if (documentData) {
                    documentData = documentData.replace(/&nbsp;/gi, ' ');
                    documentData = documentData.replace(/href="(http.*?)"/gi, 'href="/#/apercu?url=$1"');
                }


                fileStorageService.listAll(true)
                    .then(function (listDocument) {
                        documentService.openFolderModal(listDocument)
                            .then(function (result) {

                                var folder = null;
                                if (result.selectedFolder.filepath !== '/') {
                                    folder = result.selectedFolder;
                                }

                                documentService.save({
                                    title: $scope.document.filename,
                                    data: documentData,
                                    filePath: $scope.document.filepath,
                                    folder: folder
                                }, 'create')
                                    .then(function (data) {
                                        $log.debug('Save - data', data);
                                        ToasterService.showToaster('#document-success-toaster', 'document.message.save.ok');

                                        $scope.document.filepath = data.filepath;
                                        $scope.document.filename = data.filename;

                                        $scope.initDocumentData = angular.copy($scope.document.data);

                                    }, function (cause) {
                                        if (cause !== 'edit-title') {
                                            ToasterService.showToaster('#document-success-toaster', 'document.message.save.ko');
                                            LoaderService.hideLoader();
                                        }
                                    });

                            });

                    }, function () {
                    });

            }

            function editDocument (){

                var documentData = $scope.document.data;
                if (documentData) {
                    documentData = documentData.replace(/&nbsp;/gi, ' ');
                    documentData = documentData.replace(/href="(http.*?)"/gi, 'href="/#/apercu?url=$1"');
                }

                documentService.save({
                    id: $scope.document.id,
                    title: $scope.document.filename,
                    data: documentData,
                    filePath: $scope.document.filepath
                }, 'edit')
                    .then(function (data) {
                        $log.debug('Save - data', data);
                        ToasterService.showToaster('#document-success-toaster', 'document.message.save.ok');

                        $scope.document.filepath = data.filepath;
                        $scope.document.filename = data.filename;

                        $scope.initDocumentData = angular.copy($scope.document.data);

                    }, function (cause) {
                        if (cause !== 'edit-title') {
                            ToasterService.showToaster('#document-success-toaster', 'document.message.save.ko');
                            LoaderService.hideLoader();
                        }
                    });

            }

            /**
             * Recovering html content of an eupb
             *
             * @method $scope.getEpub
             * @return {String} html
             */
            $scope.getEpubLink = function () {

                LoaderService.showLoader('document.message.info.save.analyze', false);

                var epubLink = $scope.lien;
                $http.post(configuration.BASE_URL  + '/externalEpub', {
                    lien: epubLink
                }).success(function (data) {
                    var epubContent = angular.fromJson(data);
                    $scope.epubDataToEditor(epubContent);
                }).error(function () {

                    ToasterService.showToaster('#document-error-toaster', 'document.message.save.ko.epud.download');
                    LoaderService.hideLoader();
                });
            };

            $scope.close = function () {
                $scope.confirmDocumentEdit(function () {
                    stateChange();
                    $state.go('app.list-document');
                });
            };

            /**
             * cleans and puts the epub content in the editor
             */
            $scope.epubDataToEditor = function (epubContent) {

                $log.debug('epubDataToEditor');

                if (epubContent.html.length > 1) {
                    var tabHtml = [];
                    var makeHtml = function (i, length) {
                        if (i !== length) {
                            var pageHtml = epubContent.html[i].dataHtml;
                            var resultHtml = {
                                documentHtml: pageHtml
                            };
                            var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                            promiseClean.then(function (resultClean) {
                                for (var j in epubContent.img) {
                                    if (resultClean.indexOf(epubContent.img[j].link)) {
                                        resultClean = resultClean.replace(new RegExp('src=\"([ A-Z : 0-9/| ./]+)?' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                                    }
                                }
                                tabHtml[i] = resultClean;
                                makeHtml(i + 1, length);
                            }, function () {
                                ToasterService.showToaster('#document-error-toaster', 'document.message.save.ko.epud.download');
                                LoaderService.hideLoader();
                            });
                        } else {
                            var html = tabHtml.join($scope.pageBreakElement);
                            $scope.document.data = html;
                            $scope.initDocumentData = html;
                        }
                    };

                    makeHtml(0, epubContent.html.length);
                } else {
                    var resultHtml = epubContent.html[0].dataHtml;
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);

                    promiseClean.then(function (resultClean) {
                        for (var j in epubContent.img) {
                            if (resultClean.indexOf(epubContent.img[j].link)) {
                                resultClean = resultClean.replace(new RegExp('src=\"([./]+)?' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                            }
                        }
                        $scope.document.data = resultClean;
                        $scope.initDocumentData = resultClean;
                    });
                }
                LoaderService.hideLoader();
            };

            /**
             * Load the image in the editor
             *
             * @method $scope.loadImage
             */
            $scope.loadImage = function (file) {
                var reader = new FileReader();
                // Read the image
                reader.onload = function (e) {
                    // Insert the image
                    $scope.document.data = '<p><img src="' + e.target.result + '"/></p>';
                    $scope.initDocumentData = angular.copy($scope.document.data);
                };

                // Read in the image file as a data URL.
                reader.readAsDataURL(file);
            };

            /**
             * Load the pdf by link in the editor
             *
             * @method $scope.loadPdfByLien
             */
            $scope.loadPdfByLien = function (url) {

                LoaderService.showLoader('document.message.info.treatment.inprogress', true);
                LoaderService.setLoaderProgress(0);

                var contains = (url.indexOf('https') > -1); // true
                var service = '';
                if (contains === false) {
                    service = '/sendPdf';
                } else {
                    service = '/sendPdfHTTPS';
                }
                $http.post(configuration.BASE_URL  + service, {
                    lien: url
                }).success(function (data) {
                    // Clear editor content
                    var pdfbinary = UtilsService.base64ToUint8Array(data);
                    PDFJS.getDocument(pdfbinary).then(function (pdf) {
                        $scope.document.data = '';
                        $scope.loadPdfPage(pdf, 1);
                    });
                }).error(function () {
                    LoaderService.hideLoader();
                    UtilsService.showInformationModal('lien non valide', 'L\'import du document a échoué.', null, true);
                });
            };

            /**
             * Load the local pdf in the editor
             *
             * @method $scope.loadPdf
             */
            $scope.loadPdf = function (file) {
                LoaderService.showLoader('document.message.info.treatment.inprogress', true);

                // Step 2: Read the file using file reader
                var fileReader = new FileReader();

                fileReader.onload = function () {
                    // Step 4:turn array buffer into typed array
                    var typedarray = new Uint8Array(this.result);

                    // Step 5:PDFJS should be able to read this
                    PDFJS.getDocument(typedarray).then(function (pdf) {
                        $scope.document.data = '';
                        $scope.loadPdfPage(pdf, 1);
                    });
                };

                // Step 3:Read the file as ArrayBuffer
                fileReader.readAsArrayBuffer(file);
            };

            /**
             * Load the pages of the pdf as image in the editor
             *
             * @param pdf
             *            The pdf to load
             * @param pageNumber
             *            The Number of the page from which to load
             *            the pdf
             * @method $scope.loadPdfPage
             */
            $scope.loadPdfPage = function (pdf, pageNumber) {
                return pdf.getPage(pageNumber).then(function (page) {
                    $log.debug('get page pdf');
                    angular.element(document.getElementById('canvas')).remove();
                    angular.element(document.getElementsByTagName('body')[0]).append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');

                    $log.debug('add canvas elemebnt');

                    var canvas = document.getElementById('canvas');
                    var context = canvas.getContext('2d');
                    var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width); // page.getViewport(1.5);
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };

                    page.render(renderContext).then(function (error) {
                        $log.debug('page render');
                        if (error) {
                            LoaderService.hideLoader();
                        } else {
                            new Promise(function (resolve) {
                                var dataURL = canvasToImage(canvas, context, '#FFFFFF');
                                if (dataURL) {
                                    $scope.document.data += '<img src="' + dataURL + '" />';
                                    pageNumber++;
                                    if (pageNumber <= pdf.numPages) {
                                        LoaderService.setLoaderProgress((pageNumber / pdf.numPages) * 100);
                                        $scope.document.data += $scope.pageBreakElement;
                                        $scope.loadPdfPage(pdf, pageNumber);
                                    } else {
                                        window.scrollTo(0, 0);
                                        LoaderService.hideLoader();
                                    }
                                    resolve();
                                }
                            });
                        }
                    });
                });
            };

            /**
             * Treatment further to the upload of files on the server
             *
             * @method $scope.uploadComplete
             * @param evt
             *            the event upload
             */
            $scope.uploadComplete = function (evt) {
                LoaderService.setLoaderProgress(100);
                LoaderService.hideLoader();

                if (evt.target.status === 200) {

                    var serverResp = angular.fromJson(evt.target.responseText);

                    $scope.files = [];

                    if (serverResp.tooManyHtml) {
                        UtilsService.showInformationModal('information', 'La taille de l\'ePub est supérieur à la taille limite supportée par l\'application.', null, true);
                    } else if (serverResp.oversized || serverResp.oversizedIMG) {
                        UtilsService.showInformationModal('information', 'L\'application ne pourra pas traiter votre document de façon optimale en raison du poids du fichier et/ou de son contenu. Aussi, nous vous invitons à réessayer avec une autre version de votre document.', null, true);
                    } else {
                        var fileChunck = evt.target.responseText.substring(0, 50000).replace('"', '');
                        var tmp = serviceCheck.getSign(fileChunck);
                        tmp.then(function (loacalSign) {
                            if (loacalSign.erreurIntern) {
                                UtilsService.showInformationModal('lien non valide', 'L\'import du document a échoué.', null, true);
                            } else {
                                $scope.filePreview = loacalSign.sign;
                                if ($scope.serviceUpload !== '/fileupload') {
                                    var epubContent = angular.fromJson(evt.target.responseText);
                                    if (epubContent.html.length > 1) {

                                        //recursive function to concatenate the various HTML pages
                                        var tabHtml = [];
                                        var makeHtml = function (i, length) {
                                            if (i !== length) {
                                                var pageHtml = atob(epubContent.html[i].dataHtml);
                                                var resultHtml = {
                                                    documentHtml: pageHtml
                                                };
                                                var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                                                promiseClean.then(function (resultClean) {
                                                    for (var j in epubContent.img) {
                                                        if (resultClean.indexOf(epubContent.img[j].link)) {
                                                            resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                                                        }
                                                    }
                                                    tabHtml[i] = resultClean;
                                                    makeHtml(i + 1, length);
                                                });
                                            } else {
                                                var html = tabHtml.join($scope.pageBreakElement);
                                                $scope.document.data = html;
                                                $scope.initDocumentData = html;
                                            }
                                        };

                                        makeHtml(0, epubContent.html.length);
                                    } else {
                                        var resultHtml = atob(epubContent.html[0].dataHtml);
                                        htmlEpubTool.cleanHTML(resultHtml).then(function (resultClean) {
                                            for (var j in epubContent.img) {
                                                if (resultClean.indexOf(epubContent.img[j].link)) {
                                                    resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                                                }
                                            }
                                            $scope.document.data = resultClean;
                                            $scope.initDocumentData = resultClean;
                                        }, function () {
                                            ToasterService.showToaster('#document-error-toaster', 'document.message.save.ko.epud.download');
                                            LoaderService.hideLoader();
                                        });
                                    }
                                }
                            }
                        });
                    }
                } else {
                    UtilsService.showInformationModal('lien non valide', 'L\'import du document a échoué.', null, true);
                }

            };

            /**
             * Treatment further to an error during the upload of files
             *
             * @method $scope.uploadFailed
             */
            $scope.uploadFailed = function () {
                LoaderService.hideLoader();
            };

            $scope.uploadProgress = function (evt) {
                if (evt.lengthComputable) {
                    // evt.loaded the bytes browser receive
                    // evt.total the total bytes seted by the header
                    LoaderService.setLoaderProgress((evt.loaded / evt.total) * 100);
                }
            };

            /**
             * Treatment following the transmission of the upload form
             *
             * @method $scope.uploadFile
             */
            $scope.uploadFile = function (file) {
                var uploadService = '';
                var fd = new FormData();
                fd.append('uploadedFile', file);
                if (file.type === 'application/epub+zip') {
                    uploadService = '/epubUpload';

                    LoaderService.showLoader('document.message.info.save.analyze', true);

                } else {
                    if (file.type === '' && file.name.indexOf('.epub')) {

                        uploadService = '/epubUpload';
                        LoaderService.showLoader('document.message.info.save.analyze', true);


                    } else if (file.type.indexOf('image/') > -1) {
                        // call image conversion service
                        // -> base64
                        uploadService = '/fileupload';

                        LoaderService.show('document.message.info.load.image', true);
                    } else {
                        //call pdf conversion service ->
                        // base64
                        uploadService = '/fileupload';
                        LoaderService.show('document.message.info.load.pdf', true);
                    }
                }

                LoaderService.setLoaderProgress(10);
                if ($rootScope.isAppOnline) {
                    var xhr = new XMLHttpRequest();
                    xhr.addEventListener('load', $scope.uploadComplete, false);
                    xhr.addEventListener('error', $scope.uploadFailed, false);
                    xhr.open('POST', uploadService + '?id=' + localStorage.getItem('compteId'));
                    xhr.send(fd);
                } else {
                    htmlEpubTool.convertToHtml([file]).then(function (data) {
                        $scope.epubDataToEditor(data);
                    });
                }


            };

            $scope.loadWordFile = function (file) {
                var reader = new FileReader();
                // Read the word file
                reader.onload = function (e) {

                    var zip = new JSZip(event.target.result);

                    try {
                        var doc = new Docxtemplater();
                        doc.loadZip(zip);
                        $scope.document.data = doc.getFullText();
                        $scope.initDocumentData = doc.getFullText();
                    } catch (e) {
                        console.log('error', e);
                    }


                };

                reader.readAsBinaryString(file);


            };

            // reduces or enlarges the text editor
            $scope.resizeEditor = function () {

                if ($scope.resizeDocEditor === 'Agrandir') {
                    $scope.resizeDocEditor = 'Réduire';
                    $rootScope.isFullsize = false;
                    $('.navbar-fixed-top').slideUp(200, function () {
                    });
                } else {
                    $scope.resizeDocEditor = 'Agrandir';
                    $rootScope.isFullsize = true;
                    $('.navbar-fixed-top').slideDown(200, function () {
                    });
                }
            };


            $scope.init = function () {

                if ($stateParams.idDocument) {

                    LoaderService.showLoader('document.message.info.load', true);
                    LoaderService.setLoaderProgress(50);

                    var filename = $stateParams.idDocument || $stateParams.file.filename;

                    fileStorageService.get(filename, 'document').then(function (file) {
                        $log.debug('Init document edit', file);

                        $scope.document = file;
                        $scope.initDocumentData = angular.copy($scope.document.data);
                        LoaderService.hideLoader();
                    });

                }

                if ($stateParams.file) {
                    $scope.document = $stateParams.file;


                    $scope.initDocumentData = angular.copy($scope.document.data);

                    if (!$stateParams.file.toBeSaved) {
                        ToasterService.showToaster('#document-success-toaster', 'document.message.save.storage.ok', {
                            '%%PROVIDER%%': UserService.getData().provider
                        });

                    }
                }


            };

            $scope.textAngularSetup = function (textEditor) {
                textEditor.attr('text-angular-profile-coloration', '');

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h1', {
                    buttontext: 'Titre 1',
                    tooltiptext: 'Titre 1'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h2', {
                    buttontext: 'Titre 2',
                    tooltiptext: 'Titre 2'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h3', {
                    buttontext: 'Titre 3',
                    tooltiptext: 'Titre 3'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h4', {
                    buttontext: 'Titre 4',
                    tooltiptext: 'Titre 4'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h5', {
                    buttontext: 'Sous-titre 1',
                    tooltiptext: 'Sous-titre 1'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'h6', {
                    buttontext: 'Sous-titre 2',
                    tooltiptext: 'Sous-titre 2'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'p', {
                    buttontext: 'Paragraphe',
                    tooltiptext: 'Paragraphe'
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'ul', {
                    buttontext: 'Liste de niveau 1',
                    tooltiptext: 'Liste de niveau 1',
                    iconclass: ''
                });

                textAngularManager.updateToolbarToolDisplay('toolbar', 'undo', {
                    tooltiptext: 'Annuler'
                });


            };

            var stateChange = $rootScope.$on('$stateChangeStart',
                function (event, toState, toParams, fromState) {


                    if(fromState.name === 'app.edit-document' && toState.name !== 'app.my-backup'){

                        $scope.confirmDocumentEdit(function () {
                            stateChange();
                            $state.go(toState.name);
                        });
                        event.preventDefault();
                    }

                });


        });