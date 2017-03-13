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
/* global PDFJS ,Promise, CKEDITOR */
/* jshint unused: false, undef:false */

angular
    .module('cnedApp')
    .controller(
        'AddDocumentCtrl',
        function ($log, $scope, $rootScope, $routeParams, $timeout, $compile, tagsService, serviceCheck, $http, $location, dropbox, $window, configuration, htmlEpubTool, md5, fileStorageService, removeStringsUppercaseSpaces, $modal, $interval, canvasToImage, gettextCatalog) {

            $scope.idDocument = $routeParams.idDocument;
            $scope.docTitleTmp = $routeParams.title;
            $scope.url = $routeParams.url;
            $scope.applyRules = false;
            // menu management
            $('#titreCompte').hide();
            $('#titreProfile').hide();
            $('#titreDocument').hide();
            $('#titreAdmin').hide();
            $('#detailProfil').hide();
            $('#titreDocumentApercu').hide();
            $('#titreTag').hide();
            $('#titreListDocument').hide();

            // Parameters to initialize
            $scope.pageTitre = 'Ajouter un document';
            $scope.showloaderProgress = false;
            $scope.files = [];
            $scope.errorMsg = false;
            $scope.alertNew = '#addDocumentModal';
            $scope.currentData = '';
            $scope.pageBreakElement = '<div aria-label="Saut de page" class="cke_pagebreak" contenteditable="false" data-cke-display-name="pagebreak" data-cke-pagebreak="1" style="page-break-after: always" title="Saut de page"></div>';
            $scope.resizeDocEditor = 'Agrandir';
            // Initialize the lock of the document
            // (to activate the alert pop-up if output of the page ) 
            // in false
            localStorage.setItem('lockOperationDropBox', false);


            $scope.caret = {
                lastPosition: null,
                savePosition: function () {
                    $scope.caret.lastPosition = rangy.getSelection().saveCharacterRanges(document.getElementById('editorAdd'));
                },
                restorePosition: function () {
                    if ($scope.caret.lastPosition) {
                        rangy.getSelection().restoreCharacterRanges(document.getElementById('editorAdd'), $scope.caret.lastPosition);
                    }
                }
            };

            $scope.applyStyleInterval = undefined;
            $scope.applyStyles = function () {

                $scope.caret.savePosition();

                //define of close alert
                $scope.currentData = CKEDITOR.instances.editorAdd.getData();
                $scope.currentData = $scope.currentData.replace(/<div style="page-break-after: always"><span style="display: none;">&nbsp;<\/span><\/div>/g, $scope.pageBreakElement);

                if ($scope.currentData === '') {
                    localStorage.setItem('lockOperationDropBox', false);
                    $scope.alertNew = '#addDocumentModal';
                } else {
                    localStorage.setItem('lockOperationDropBox', true);
                    $scope.alertNew = '#save-new-modal';
                }
                if (!CKEDITOR.instances.editorAdd.checkDirty()) {
                    localStorage.setItem('lockOperationDropBox', false);
                }


                $timeout(function () {
                    //deactivation of the update of the tags
                    $scope.applyRules = false;
                    //console.log('update tag');
                    $scope.listTagsByProfil = JSON.parse(localStorage.getItem('listTagsByProfil'));
                    //refresh
                    $scope.applyRules = true;
                }).then(function () {
                    $scope.caret.restorePosition();
                    $interval.cancel($scope.applyStyleInterval);
                });
            };

            /**
             * Return the modal when clicking on the button to open
             * a document
             *
             * @method $scope.openDocument
             */
            $scope.openDocument = function () {
                $scope.errorMsg = false;
                $scope.msgErrorModal = '';
                $scope.clearUploadFile();
                $scope.clearLien();
                $($scope.alertNew).modal('show');
            };

            $scope.openDocumentEditorWithData = function () {
                $scope.alertNew = '#addDocumentModal';
                $scope.openDocument();
            };

            /**
             * Generate an MD5 identifier from the provided html
             * Use for signing the document in the title when recording
             *
             * @param {String}
             *            html
             * @method $scope.generateMD5
             */
            $scope.generateMD5 = function (html) {
                return md5.createHash(html);
            };

            /**
             * Store the contents of the editor in $scope.currentData
             * Locks the exit of the editor if the content is
             * present
             *
             * @method $scope.getText
             */
            $scope.getText = function () {
                localStorage.setItem('lockOperationDropBox', true);
                $scope.alertNew = '#save-new-modal';


                if ($scope.applyStyleInterval){
                    $interval.cancel($scope.applyStyleInterval);
                }
                $scope.applyStyleInterval = $interval($scope.applyStyles, 1000);
            };

            /**
             * Show the recording popup
             *
             * @method $scope.showSaveDialog
             */
            $scope.showSaveDialog = function () {
                //if the title has not been informed 
                //we display the recording popup
                if (!$scope.docTitre) {
                    $scope.errorMsg = false;
                    $scope.msgErrorModal = '';
                    $('#save-modal').modal('show');
                } else {
                    // otherwise , we directly record
                    $scope.save();
                }
            };

            /**
             * Replace the internal lincks
             *
             * @method $scope.processLink
             */
            $scope.processLink = function (data) {
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

                $scope.errorMsg = false;

                if (!$scope.docTitre || $scope.docTitre.length <= 0) {
                    $scope.msgErrorModal = 'Le titre est obligatoire !';
                    $scope.errorMsg = true;
                    $('#save-modal').modal('show');
                    return;
                } else {
                    if ($scope.docTitre.length > 201) {
                        $scope.errorMsg = true;
                        $('#save-modal').modal('show');
                        $scope.showToaster('#document-modal-error-toaster', 'document.message.save.ko.title.size');

                        return;
                    } else if (!serviceCheck.checkName($scope.docTitre)) {
                        $scope.errorMsg = true;
                        $('#save-modal').modal('show');
                        $scope.showToaster('#document-modal-error-toaster', 'document.message.save.ko.title.specialchar');
                        return;
                    }
                }
                if (!$scope.errorMsg) {
                    $('#save-modal').modal('hide');
                }

                $scope.showLoader('Enregistrement du document en cours veuillez patienter.');
                $scope.loaderProgress = 20;
                localStorage.setItem('lockOperationDropBox', true);
                if ($rootScope.currentUser.dropbox.accessToken) {
                    var token = $rootScope.currentUser.dropbox.accessToken;
                    var documentExist = false;
                    fileStorageService.searchFiles($rootScope.isAppOnline, $scope.docTitre, token).then(function (filesFound) {
                        for (var i = 0; i < filesFound.length; i++) {
                            if (filesFound[i].filepath.indexOf('.html') > 0 && filesFound[i].filepath.toLowerCase().indexOf('_' + $scope.docTitre.toLowerCase() + '_') > 0) {
                                documentExist = true;
                                break;
                            }
                        }
                        $scope.loaderProgress = 25;

                        if (documentExist && !$scope.existingFile) {
                            localStorage.setItem('lockOperationDropBox', false);
                            $scope.hideLoader();
                            $scope.errorMsg = true;
                            $('#save-modal').modal('show');
                            $scope.showToaster('#document-modal-error-toaster', 'document.message.save.ko.alreadyexist');
                        } else {
                            var ladate = new Date();
                            var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();

                            $scope.filePreview = $scope.generateMD5($scope.currentData);
                            var apercuName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.html';
                            if ($scope.existingFile) {
                                apercuName = $scope.existingFile.filepath;
                            }
                            $scope.loaderProgress = 30;
                            localStorage.setItem('lockOperationDropBox', true);
                            $scope.loaderProgress = 60;

                            $scope.currentData = $scope.processLink($scope.currentData);

                            fileStorageService.saveFile($rootScope.isAppOnline, ($scope.apercuName || apercuName), $scope.currentData, token).then(function (data) {
                                // We switch to edit mode
                                $scope.pageTitre = 'Editer le document'; // title of the page
                                $scope.loaderProgress = 70;
                                localStorage.setItem('lockOperationDropBox', false);
                                $scope.loaderProgress = 75;
                                $scope.existingFile = data;
                                $scope.idDocument = $scope.docTitre;
                                $scope.hideLoader();
                                $scope.resetDirtyCKEditor();

                                $scope.showToaster('#document-success-toaster', 'document.message.save.ok');
                            });
                        }
                    });
                } else {
                    localStorage.setItem('lockOperationDropBox', false);
                    $scope.loader = false;
                    $scope.errorMsg = true;
                    $('#save-modal').modal('show');
                    $scope.showToaster('#document-modal-error-toaster', 'document.message.save.ko.connexion');
                }
            };

            /**
             * Called when the user cancels the registration.
             * Reset error messages.
             *
             * @method $scope.cancelSave
             */
            $scope.cancelSave = function () {
                $scope.errorMsg = false;
                $scope.msgErrorModal = '';
            };


            /**
             * Test the truthfulness of a link (by checking the presence of the http protocol in String)
             *
             * @method $scope.verifyLink
             * @param String
             *            link
             * @return Boolean
             */
            $scope.verifyLink = function (link) {
                return link && ((link.toLowerCase().indexOf('https') > -1) || (link.toLowerCase().indexOf('http') > -1));
            };
            /**
             * Open a modal to alert the user that
             * the link import is unavailable in offline mode
             *
             * @method $afficherInfoDeconnecte
             */
            $scope.afficherInfoDeconnecte = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/common/informationModal.html',
                    controller: 'InformationModalCtrl',
                    size: 'sm',
                    resolve: {
                        title: function () {
                            return 'Pas d\'accès internet';
                        },
                        content: function () {
                            return 'La fonctionnalité d\'import de lien nécessite un accès à internet';
                        },
                        reason: function () {
                            return null;
                        },
                        forceClose: function () {
                            return null;
                        }
                    }
                });
            };

            /**
             * Check up the data of the opening popup of a document
             * "error messages management" through
             * $scope.errorMsg
             *
             * This methods adds a document
             * @method $scope.ajouterDocument
             */
            $scope.ajouterDocument = function () {
                if (!$rootScope.isAppOnline && $scope.lien) {
                    $scope.afficherInfoDeconnecte();
                } else {
                    if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
                        $scope.msgErrorModal = 'Le titre est obligatoire !';
                        $scope.errorMsg = true;
                        return;
                    }
                    if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length > 201) {
                        $scope.msgErrorModal = 'Le titre est trop long !';
                        $scope.errorMsg = true;
                        return;
                    }
                    if (!serviceCheck.checkName($scope.doc.titre)) {
                        $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
                        $scope.errorMsg = true;
                        return;
                    }
                    var foundDoc = false;
                    var searchApercu = fileStorageService.searchFiles($rootScope.isAppOnline, $scope.doc.titre, $rootScope.currentUser.dropbox.accessToken);
                    searchApercu.then(function (result) {
                        for (var i = 0; i < result.length; i++) {
                            if (result[i].filepath.indexOf('.html') > 0 && result[i].filepath.indexOf('_' + $scope.doc.titre + '_') > 0) {
                                foundDoc = true;
                                break;
                            }
                        }
                        if (foundDoc) {
                            $scope.msgErrorModal = 'Le document existe déjà';
                            $scope.errorMsg = true;
                        } else {
                            if ((!$scope.lien && $scope.files.length <= 0) || (($scope.lien && /\S/.test($scope.lien)) && $scope.files.length > 0)) {
                                $scope.msgErrorModal = 'Veuillez saisir un lien ou uploader un fichier !';
                                $scope.errorMsg = true;
                                return;
                            }
                            if ($scope.lien && !$scope.verifyLink($scope.lien)) {
                                $scope.msgErrorModal = 'Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
                                $scope.errorMsg = true;
                                return;
                            }
                            $('#addDocumentModal').modal('hide');
                        }
                    });
                }

            };

            /**
             * Recovering html content of an eupb
             *
             * @method $scope.getEpub
             * @return {String} html
             */
            $scope.getEpubLink = function () {

                $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                var epubLink = $scope.lien;
                $http.post(configuration.URL_REQUEST + '/externalEpub', {
                    id: $rootScope.currentUser.local.token,
                    lien: epubLink
                }).success(function (data) {
                    var epubContent = angular.fromJson(data);
                    $scope.epubDataToEditor(epubContent);
                }).error(function () {
                    $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub.';
                    $scope.errorMsg = true;
                    $scope.hideLoader();
                });
            };

            /**
             * cleans and puts the epub content in the editor
             */
            $scope.epubDataToEditor = function (epubContent) {

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
                                $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub.';
                                $scope.errorMsg = true;
                                $scope.hideLoader();
                            });
                        } else {
                            var html = tabHtml.join($scope.pageBreakElement);
                            CKEDITOR.instances.editorAdd.setData(html);
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
                        CKEDITOR.instances.editorAdd.setData(resultClean);
                    });
                }
                $scope.hideLoader();
            };

            /**
             * Open the document selected by the user.
             */
            $scope.validerAjoutDocument = function () {
                // Presence of a file with the browse button
                if ($scope.files.length > 0) {
                    $scope.pageTitre = 'Ajouter un document';
                    $scope.existingFile = null;
                    if ($scope.doc && $scope.doc.titre) {
                        $scope.docTitre = $scope.doc.titre;
                    }

                    $rootScope.uploadDoc = $scope.doc;
                    $scope.doc = {};
                    $rootScope.uploadDoc.uploadPdf = $scope.files;
                    if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/pdf') {
                        $scope.loadPdf();
                    } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'image/jpeg' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/png' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/jpg') {
                        $scope.loadImage();
                    } else if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/epub+zip' || ($rootScope.uploadDoc.uploadPdf[0].type === '' && $rootScope.uploadDoc.uploadPdf[0].name.indexOf('.epub'))) {
                        $scope.uploadFile();
                    } else {
                        $scope.msgErrorModal = 'Le type de fichier n\'est pas supporté. Merci de ne rattacher que des fichiers PDF, des ePub  ou des images.';
                        $scope.errorMsg = true;
                    }
                }

                // Link management
                else if ($scope.lien) {
                    $scope.pageTitre = 'Ajouter un document';
                    $scope.existingFile = null;
                    if ($scope.doc && $scope.doc.titre) {
                        $scope.docTitre = $scope.doc.titre;
                    }

                    $rootScope.uploadDoc = $scope.doc;
                    $scope.doc = {};
                    if ($scope.lien.indexOf('.epub') > -1) {
                        $scope.getEpubLink();
                    } else if ($scope.lien.indexOf('.pdf') > -1) {
                        $scope.loadPdfByLien($scope.lien);
                    } else {
                        $scope.loaderProgress = 10;
                        $scope.showLoader('Traitement de votre document en cours');
                        // Retrieving the contents of the body of link by services.
                        var promiseHtml = serviceCheck.htmlPreview($scope.lien, $rootScope.currentUser.dropbox.accessToken);
                        promiseHtml.then(function (resultHtml) {
                            var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                            promiseClean.then(function (resultClean) {
                                // Insertion in the editor
                                CKEDITOR.instances.editorAdd.setData(resultClean);
                                $scope.hideLoader();
                            });
                        }, function (err) {

                            $scope.hideLoader();
                            $scope.techError = err;
                            angular.element('#myModalWorkSpaceTechnical').modal('show');
                        });
                    }
                }
            };

            /**
             * Activated when opening a document
             */
            $('#addDocumentModal').on('hidden.bs.modal', function () {
                $scope.validerAjoutDocument();
            });

            /**
             * Load the image in the editor
             *
             * @method $scope.loadImage
             */
            $scope.loadImage = function () {
                var reader = new FileReader();
                // Read the image
                reader.onload = function (e) {
                    // Insert the image
                    CKEDITOR.instances.editorAdd.setData('<img src="' + e.target.result + '" width="790px"/>');
                };

                // Read in the image file as a data URL.
                reader.readAsDataURL($rootScope.uploadDoc.uploadPdf[0]);
                $scope.clearUploadFile();
            };

            /**
             * Load the pdf by link in the editor
             *
             * @method $scope.loadPdfByLien
             */
            $scope.loadPdfByLien = function (url) {
                $scope.loaderProgress = 0;
                $scope.showLoader('Traitement de votre document en cours');
                var contains = (url.indexOf('https') > -1); // true
                if (contains === false) {
                    $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
                } else {
                    $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
                }
                $http.post($scope.serviceNode, {
                    lien: url,
                    id: localStorage.getItem('compteId')
                }).success(function (data) {
                    // Clear editor content
                    CKEDITOR.instances.editorAdd.setData('');
                    var pdfbinary = $scope.base64ToUint8Array(data);
                    PDFJS.getDocument(pdfbinary).then(function (pdf) {
                        $scope.loadPdfPage(pdf, 1);
                    });
                }).error(function () {
                    $scope.hideLoader();
                    $('#myModalWorkSpace').modal('show');
                    $scope.pdferrLien = true;
                });
                $scope.clearUploadFile();
            };

            /**
             * Convert  base64 to Uint8Array
             *
             * @param base64
             *        The binary to be converted.
             * @method $scope.base64ToUint8Array
             */
            $scope.base64ToUint8Array = function (base64) {
                var raw = atob(base64);
                var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
                for (var i = 0; i < raw.length; i++) {
                    uint8Array[i] = raw.charCodeAt(i);
                }
                return uint8Array;
            };

            /**
             * Load the local pdf in the editor
             *
             * @method $scope.loadPdf
             */
            $scope.loadPdf = function () {
                $scope.loaderProgress = 0;
                $scope.showLoader('Traitement de votre document en cours');

                // Step 1: Get the file from the input element
                var file = $rootScope.uploadDoc.uploadPdf[0];

                // Step 2: Read the file using file reader
                var fileReader = new FileReader();

                fileReader.onload = function () {
                    // Step 4:turn array buffer into typed array
                    var typedarray = new Uint8Array(this.result);

                    // clear ckeditor
                    CKEDITOR.instances.editorAdd.setData('');

                    // if (!$rootScope.isAppOnline) PDFJS.disableWorker
                    // = true;
                    // Step 5:PDFJS should be able to read this
                    PDFJS.getDocument(typedarray).then(function (pdf) {
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
                    $('#canvas').remove();
                    $('body').append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');
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
                        if (error) {
                            $scope.hideLoader();
                            $scope.$apply();
                            console.log(error);
                        } else {
                            new Promise(function (resolve) {
                                var dataURL = canvasToImage(canvas, context, '#FFFFFF');
                                if (dataURL) {
                                    CKEDITOR.instances.editorAdd.insertHtml('<img src="' + dataURL + '" />');

                                    pageNumber++;
                                    if (pageNumber <= pdf.numPages) {
                                        $scope.loaderProgress = (pageNumber / pdf.numPages) * 100;
                                        $scope.insertPageBreak();
                                        $scope.loadPdfPage(pdf, pageNumber);
                                    } else {
                                        window.scrollTo(0, 0);
                                        $scope.hideLoader();
                                    }
                                    resolve();
                                    $scope.$apply();
                                }
                            });
                        }
                    });
                });
            };

            /**
             * Inserts a page break in the editor
             *
             * @method $scope.insertPageBreak
             */
            $scope.insertPageBreak = function () {
                CKEDITOR.instances.editorAdd.insertHtml($scope.pageBreakElement);
            };

            /**
             * Reset browse field
             */
            $scope.clearUploadFile = function () {
                $scope.files = [];
                $('#docUploadPdf').val('');
                $('#filename_show').val('');
            };

            /**
             * Reset the link field
             *
             * @method $scope.clearLien
             */
            $scope.clearLien = function () {
                $scope.lien = '';
            };

            /**
             * Treatment further to the upload of files on the server
             *
             * @method $scope.uploadComplete
             * @param evt
             *            the event upload
             */
            $scope.uploadComplete = function (evt) {
                $scope.loaderProgress = 100;
                $scope.hideLoader();

                if (evt.target.status === 200) {

                    var serverResp = angular.fromJson(evt.target.responseText);

                    $scope.files = [];

                    if (serverResp.tooManyHtml) {
                        $('#myModalWorkSpaceTooMany').modal('show');
                    } else if (serverResp.oversized || serverResp.oversizedIMG) {
                        $('#myModalWorkSpaceBig').modal('show');
                    } else {
                        var fileChunck = evt.target.responseText.substring(0, 50000).replace('"', '');
                        var tmp = serviceCheck.getSign(fileChunck);
                        tmp.then(function (loacalSign) {
                            if (loacalSign.erreurIntern) {
                                $('#myModalWorkSpace').modal('show');
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
                                                CKEDITOR.instances.editorAdd.setData(html);
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
                                            CKEDITOR.instances.editorAdd.setData(resultClean);
                                        }, function () {
                                            $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub.';
                                            $scope.errorMsg = true;
                                            $scope.hideLoader();
                                            angular.element('#myModalWorkSpace').modal('show');
                                        });
                                    }
                                }
                            }
                        });
                    }
                } else {
                    $('#myModalWorkSpace').modal('show');
                }

            };

            /**
             * Treatment further to an error during the upload of files
             *
             * @method $scope.uploadFailed
             */
            $scope.uploadFailed = function () {
                $scope.hideLoader();
            };

            $scope.uploadProgress = function (evt) {
                if (evt.lengthComputable) {
                    // evt.loaded the bytes browser receive
                    // evt.total the total bytes seted by the header
                    $scope.loaderProgress = (evt.loaded / evt.total) * 100;
                }
            };

            /**
             * Treatment following the transmission of the upload form
             *
             * @method $scope.uploadFile
             */
            $scope.uploadFile = function () {
                if ($scope.files.length > 0) {
                    $scope.loaderProgress = 10;
                    var fd = new FormData();
                    for (var i in $scope.files) {
                        fd.append('uploadedFile', $scope.files[i]);
                        if ($scope.files[i].type === 'application/epub+zip') {
                            $scope.serviceUpload = '/epubUpload';
                            $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                        } else {
                            if ($scope.files[i].type === '' && $scope.files[i].name.indexOf('.epub')) {
                                $scope.serviceUpload = '/epubUpload';
                                $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                            } else if ($scope.files[i].type.indexOf('image/') > -1) {
                                // call image conversion service
                                // -> base64
                                $scope.serviceUpload = '/fileupload';
                                $scope.showLoader('Chargement de votre/vos image(s) en cours. Veuillez patienter ');
                            } else {
                                //call pdf conversion service ->
                                // base64
                                $scope.serviceUpload = '/fileupload';
                                $scope.showLoader('Chargement de votre document PDF en cours. Veuillez patienter ');
                            }
                        }
                    }
                    if ($rootScope.isAppOnline) {
                        var xhr = new XMLHttpRequest();
                        xhr.addEventListener('load', $scope.uploadComplete, false);
                        xhr.addEventListener('error', $scope.uploadFailed, false);
                        xhr.open('POST', configuration.URL_REQUEST + $scope.serviceUpload + '?id=' + localStorage.getItem('compteId'));
                        $scope.$apply();
                        xhr.send(fd);
                    } else {
                        htmlEpubTool.convertToHtml($scope.files).then(function (data) {
                            $scope.epubDataToEditor(data);
                        });
                    }
                } else {
                    $scope.msgErrorModal = 'Vous devez choisir un fichier.';
                    $scope.errorMsg = true;
                }

            };

            /**
             * Opening of the overview
             *
             * @method $scope.openApercu
             */
            $scope.openApercu = function () {
                var win = $window.open(); // Keep window reference which is not accessible in promise
                fileStorageService.saveTempFile($scope.currentData).then(function () {
                    win.location = '#/apercu?tmp=true';
                });
            };

            /**
             * Updates the available formats in the editor
             *
             * @method $scope.updateFormats
             */
            $scope.updateFormats = function () {
                var formatsArray = [];
                var ckConfig = {};
                tagsService.getTags(localStorage.getItem('compteId')).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        var balise = data[i].balise;
                        if (balise === 'div') {
                            var classes = removeStringsUppercaseSpaces(data[i].libelle);
                            ckConfig['format_' + classes] = {
                                element: balise,
                                attributes: {
                                    'class': classes
                                }
                            };
                            formatsArray.push(classes);
                        } else if (balise === 'blockquote') {
                            // FIX on CKEDITOR which does not support
                            // blockquote in
                            // format list by default
                            formatsArray.push(data[i].balise);
                            ckConfig.format_blockquote = {
                                element: 'blockquote'
                            };
                            // formats that are not present in the list
                        } else if (balise !== 'li' && balise !== 'ol' && balise !== 'ul') {
                            formatsArray.push(data[i].balise);
                        }
                    }
                    var formats = formatsArray.join(';');
                    ckConfig.format_tags = formats;
                    // Removal of title
                    ckConfig.title = false;
                    $scope.createCKEditor(ckConfig, data);
                });
            };

            /**
             * Load the document to be edited.
             *
             * @method $scope.editExistingDocument
             */
            $scope.editExistingDocument = function () {
                $scope.pageTitre = 'Editer le document';
                fileStorageService.searchFiles($rootScope.isAppOnline, $scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function (files) {
                    $scope.existingFile = files[0];
                    $scope.docTitre = $scope.idDocument;
                    $scope.loaderProgress = 27;
                    fileStorageService.getFile($rootScope.isAppOnline, $scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function (filecontent) {
                        if (filecontent === null) {
                            $scope.hideLoader();
                            $scope.affichageInfoDeconnecte();
                        } else {
                            CKEDITOR.instances.editorAdd.setData(filecontent, {
                                callback: $scope.resetDirtyCKEditor
                            });
                            $scope.hideLoader();
                        }
                    });
                });
            };

            /**
             * Creating the editor with formats previously retrieved
             * and adjusting the screen labels.
             *
             * @param ckConfig
             *            configuration ckeditor to apply
             * @param formatTags
             *            available formats in the editor
             * @method $scope.createCKEditor
             */
            $scope.createCKEditor = function (ckConfig, listTags) {

                // Creation de l'editeur inline
                for (var name in CKEDITOR.instances) {
                    if (CKEDITOR.instances[name].destroy) {
                        CKEDITOR.instances[name].destroy(true);
                    }
                }

                ckConfig.on = {
                    instanceReady: function () {
                        $log.debug('ckeditor - instance ready');

                        for (var i = 0; i < listTags.length; i++) {
                            var tag = listTags[i];
                            if (tag.balise === 'blockquote') {
                                // FIX CKEDITOR blockquote
                                CKEDITOR.instances.editorAdd.lang.format.tag_blockquote = tag.libelle;
                            } else if (tag.balise !== 'div') {
                                CKEDITOR.instances.editorAdd.lang.format['tag_' + tag.balise] = tag.libelle;
                            } else {
                                CKEDITOR.instances.editorAdd.lang.format['tag_' + removeStringsUppercaseSpaces(tag.libelle)] = tag.libelle;
                            }

                            CKEDITOR.instances.editorAdd.lang.format['panelTitle'] = 'Styles';
                        }
                        if ($scope.idDocument) {
                            $scope.$apply(function () {
                                $scope.editExistingDocument();
                            });
                        } else if ($scope.docTitleTmp) {

                            $scope.docTitre = $scope.docTitleTmp;

                            fileStorageService.getTempFile().then(function (data) {

                                $log.debug('data - ', data);
                                var doc = '';
                                for(var x = 1 ; x < data.length; x ++){
                                    doc += data[x];
                                }
                                CKEDITOR.instances.editorAdd.setData(doc);
                            });

                            //$scope.validerAjoutDocument();
                        }

                        if (!$rootScope.isAppOnline) {
                            // hack to keep dropdown's css
                            // click to load the iframe (can't be
                            // jqueried else)
                            angular.element('.cke_combo_button').click();
                            // click again to hide the iframe
                            angular.element('.cke_combo_button').click();

                            // on load append inline css
                            angular
                                .element('iframe.cke_panel_frame')
                                .first()
                                .load(
                                    function () {
                                        angular
                                            .element('iframe.cke_panel_frame')
                                            .contents()
                                            .find('head')
                                            .append(
                                                '<style>.cke_reset{margin:0;padding:0;border:0;background:transparent;text-decoration:none;width:auto;height:auto;vertical-align:baseline;box-sizing:content-box;position:static;transition:none}.cke_reset_all,.cke_reset_all *,.cke_reset_all a,.cke_reset_all textarea{margin:0;padding:0;border:0;background:transparent;text-decoration:none;width:auto;height:auto;vertical-align:baseline;box-sizing:content-box;position:static;transition:none;border-collapse:collapse;font:normal normal normal 12px Arial,Helvetica,Tahoma,Verdana,Sans-Serif;color:#000;text-align:left;white-space:nowrap;cursor:auto;float:none}.cke_reset_all .cke_rtl *{text-align:right}.cke_reset_all iframe{vertical-align:inherit}.cke_reset_all textarea{white-space:pre-wrap}.cke_reset_all textarea,.cke_reset_all input[type=\"text\"],.cke_reset_all input[type=\"password\"]{cursor:text}.cke_reset_all textarea[disabled],.cke_reset_all input[type=\"text\"][disabled],.cke_reset_all input[type=\"password\"][disabled]{cursor:default}.cke_reset_all fieldset{padding:10px;border:2px groove #e0dfe3}.cke_reset_all select{box-sizing:border-box}.cke_reset_all table{table-layout:auto}.cke_chrome{display:block;border:1px solid #b6b6b6;padding:0;box-shadow:0 0 3px rgba(0,0,0,.15)}.cke_inner{display:block;-webkit-touch-callout:none;background:#fff;padding:0}.cke_float{border:0}.cke_float .cke_inner{padding-bottom:0}.cke_top,.cke_contents,.cke_bottom{display:block;overflow:hidden}.cke_top{border-bottom:1px solid #b6b6b6;padding:6px 8px 2px;white-space:normal;box-shadow:0 1px 0 #fff inset;background:#cfd1cf;background-image:linear-gradient(to bottom,#f5f5f5,#cfd1cf);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#f5f5f5\',endColorstr=\'#cfd1cf\')}.cke_float .cke_top{border:1px solid #b6b6b6;border-bottom-color:#999}.cke_bottom{padding:6px 8px 2px;position:relative;border-top:1px solid #bfbfbf;box-shadow:0 1px 0 #fff inset;background:#cfd1cf;background-image:linear-gradient(to bottom,#ebebeb,#cfd1cf);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#ebebeb\',endColorstr=\'#cfd1cf\')}.cke_browser_ios .cke_contents{overflow-y:auto;-webkit-overflow-scrolling:touch}.cke_resizer{width:0;height:0;overflow:hidden;width:0;height:0;overflow:hidden;border-width:10px 10px 0 0;border-color:transparent #666 transparent transparent;border-style:dashed solid dashed dashed;font-size:0;vertical-align:bottom;margin-top:6px;margin-bottom:2px;box-shadow:0 1px 0 rgba(255,255,255,.3)}.cke_hc .cke_resizer{font-size:15px;width:auto;height:auto;border-width:0}.cke_resizer_ltr{cursor:se-resize;float:right;margin-right:-4px}.cke_resizer_rtl{border-width:10px 0 0 10px;border-color:transparent transparent transparent #a5a5a5;border-style:dashed dashed dashed solid;cursor:sw-resize;float:left;margin-left:-4px;right:auto}.cke_wysiwyg_div{display:block;height:100%;overflow:auto;padding:0 8px;outline-style:none;box-sizing:border-box}.cke_panel{visibility:visible;width:120px;height:100px;overflow:hidden;background-color:#fff;border:1px solid #b6b6b6;border-bottom-color:#999;border-radius:3px;box-shadow:0 0 3px rgba(0,0,0,.15)}.cke_menu_panel{padding:0;margin:0}.cke_combopanel{width:150px;height:170px}.cke_panel_frame{width:100%;height:100%;font-size:12px;overflow:auto;overflow-x:hidden}.cke_panel_container{overflow-y:auto;overflow-x:hidden}.cke_panel_list{list-style-type:none;margin:3px;padding:0;white-space:nowrap}.cke_panel_listItem{margin:0;padding-bottom:1px}.cke_panel_listItem a{padding:3px 4px;display:block;border:1px solid #fff;color:inherit!important;text-decoration:none;overflow:hidden;text-overflow:ellipsis;border-radius:2px}* html .cke_panel_listItem a{width:100%;color:#000}*:first-child+html .cke_panel_listItem a{color:#000}.cke_panel_listItem.cke_selected a{border:1px solid #dedede;background-color:#f2f2f2;box-shadow:0 0 2px rgba(0,0,0,.1) inset}.cke_panel_listItem a:hover,.cke_panel_listItem a:focus,.cke_panel_listItem a:active{border-color:#dedede;background-color:#f2f2f2;box-shadow:0 0 2px rgba(0,0,0,.1) inset}.cke_hc .cke_panel_listItem a{border-style:none}.cke_hc .cke_panel_listItem a:hover,.cke_hc .cke_panel_listItem a:focus,.cke_hc .cke_panel_listItem a:active{border:2px solid;padding:1px 2px}.cke_panel_grouptitle{cursor:default;font-size:11px;font-weight:bold;white-space:nowrap;margin:0;padding:4px 6px;color:#474747;text-shadow:0 1px 0 rgba(255,255,255,.75);border-bottom:1px solid #b6b6b6;border-radius:2px 2px 0 0;box-shadow:0 1px 0 #fff inset;background:#cfd1cf;background-image:linear-gradient(to bottom,#f5f5f5,#cfd1cf);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#f5f5f5\',endColorstr=\'#cfd1cf\')}.cke_panel_listItem p,.cke_panel_listItem h1,.cke_panel_listItem h2,.cke_panel_listItem h3,.cke_panel_listItem h4,.cke_panel_listItem h5,.cke_panel_listItem h6,.cke_panel_listItem pre{margin-top:0;margin-bottom:0}.cke_colorblock{padding:3px;font-size:11px;font-family:\'Microsoft Sans Serif\',Tahoma,Arial,Verdana,Sans-Serif}.cke_colorblock,.cke_colorblock a{text-decoration:none;color:#000}span.cke_colorbox{width:10px;height:10px;border:#808080 1px solid;float:left}.cke_rtl span.cke_colorbox{float:right}a.cke_colorbox{border:#fff 1px solid;padding:2px;float:left;width:12px;height:12px}.cke_rtl a.cke_colorbox{float:right}a:hover.cke_colorbox,a:focus.cke_colorbox,a:active.cke_colorbox{border:#b6b6b6 1px solid;background-color:#e5e5e5}a.cke_colorauto,a.cke_colormore{border:#fff 1px solid;padding:2px;display:block;cursor:pointer}a:hover.cke_colorauto,a:hover.cke_colormore,a:focus.cke_colorauto,a:focus.cke_colormore,a:active.cke_colorauto,a:active.cke_colormore{border:#b6b6b6 1px solid;background-color:#e5e5e5}.cke_toolbar{float:left}.cke_rtl .cke_toolbar{float:right}.cke_toolgroup{float:left;margin:0 6px 5px 0;border:1px solid #a6a6a6;border-bottom-color:#979797;border-radius:3px;box-shadow:0 1px 0 rgba(255,255,255,.5),0 0 2px rgba(255,255,255,.15) inset,0 1px 0 rgba(255,255,255,.15) inset;background:#e4e4e4;background-image:linear-gradient(to bottom,#fff,#e4e4e4);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#ffffff\',endColorstr=\'#e4e4e4\')}.cke_hc .cke_toolgroup{border:0;margin-right:10px;margin-bottom:10px}.cke_rtl .cke_toolgroup{float:right;margin-left:6px;margin-right:0}a.cke_button{display:inline-block;height:18px;padding:4px 6px;outline:0;cursor:default;float:left;border:0}.cke_ltr .cke_button:last-child,.cke_rtl .cke_button:first-child{border-radius:0 2px 2px 0}.cke_ltr .cke_button:first-child,.cke_rtl .cke_button:last-child{border-radius:2px 0 0 2px}.cke_rtl .cke_button{float:right}.cke_hc .cke_button{border:1px solid black;padding:3px 5px;margin:-2px 4px 0 -2px}a.cke_button_on{box-shadow:0 1px 5px rgba(0,0,0,.6) inset,0 1px 0 rgba(0,0,0,.2);background:#b5b5b5;background-image:linear-gradient(to bottom,#aaa,#cacaca);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#aaaaaa\',endColorstr=\'#cacaca\')}.cke_hc .cke_button_on,.cke_hc a.cke_button_off:hover,.cke_hc a.cke_button_off:focus,.cke_hc a.cke_button_off:active,.cke_hc a.cke_button_disabled:hover,.cke_hc a.cke_button_disabled:focus,.cke_hc a.cke_button_disabled:active{border-width:3px;padding:1px 3px}.cke_button_disabled .cke_button_icon{opacity:.3}.cke_hc .cke_button_disabled{opacity:.5}a.cke_button_on:hover,a.cke_button_on:focus,a.cke_button_on:active{box-shadow:0 1px 6px rgba(0,0,0,.7) inset,0 1px 0 rgba(0,0,0,.2)}a.cke_button_off:hover,a.cke_button_off:focus,a.cke_button_off:active,a.cke_button_disabled:hover,a.cke_button_disabled:focus,a.cke_button_disabled:active{box-shadow:0 0 1px rgba(0,0,0,.3) inset;background:#ccc;background-image:linear-gradient(to bottom,#f2f2f2,#ccc);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#f2f2f2\',endColorstr=\'#cccccc\')}.cke_button_icon{cursor:inherit;background-repeat:no-repeat;margin-top:1px;width:16px;height:16px;float:left;display:inline-block}.cke_rtl .cke_button_icon{float:right}.cke_hc .cke_button_icon{display:none}.cke_button_label{display:none;padding-left:3px;margin-top:1px;line-height:17px;vertical-align:middle;float:left;cursor:default;color:#474747;text-shadow:0 1px 0 rgba(255,255,255,.5)}.cke_rtl .cke_button_label{padding-right:3px;padding-left:0;float:right}.cke_hc .cke_button_label{padding:0;display:inline-block;font-size:12px}.cke_button_arrow{display:inline-block;margin:8px 0 0 1px;width:0;height:0;cursor:default;vertical-align:top;border-left:3px solid transparent;border-right:3px solid transparent;border-top:3px solid #474747}.cke_rtl .cke_button_arrow{margin-right:5px;margin-left:0}.cke_hc .cke_button_arrow{font-size:10px;margin:3px -2px 0 3px;width:auto;border:0}.cke_toolbar_separator{float:left;background-color:#c0c0c0;background-color:rgba(0,0,0,.2);margin:5px 2px 0;height:18px;width:1px;box-shadow:1px 0 1px rgba(255,255,255,.5)}.cke_rtl .cke_toolbar_separator{float:right;box-shadow:-1px 0 1px rgba(255,255,255,.1)}.cke_hc .cke_toolbar_separator{width:0;border-left:1px solid;margin:1px 5px 0 0}.cke_toolbar_break{display:block;clear:left}.cke_rtl .cke_toolbar_break{clear:right}a.cke_toolbox_collapser{width:12px;height:11px;float:right;margin:11px 0 0;font-size:0;cursor:default;text-align:center;border:1px solid #a6a6a6;border-bottom-color:#979797;border-radius:3px;box-shadow:0 1px 0 rgba(255,255,255,.5),0 0 2px rgba(255,255,255,.15) inset,0 1px 0 rgba(255,255,255,.15) inset;background:#e4e4e4;background-image:linear-gradient(to bottom,#fff,#e4e4e4);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#ffffff\',endColorstr=\'#e4e4e4\')}.cke_toolbox_collapser:hover{background:#ccc;background-image:linear-gradient(to bottom,#f2f2f2,#ccc);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#f2f2f2\',endColorstr=\'#cccccc\')}.cke_toolbox_collapser.cke_toolbox_collapser_min{margin:0 2px 4px}.cke_rtl .cke_toolbox_collapser{float:left}.cke_toolbox_collapser .cke_arrow{display:inline-block;height:0;width:0;font-size:0;margin-top:1px;border-left:3px solid transparent;border-right:3px solid transparent;border-bottom:3px solid #474747;border-top:3px solid transparent}.cke_toolbox_collapser.cke_toolbox_collapser_min .cke_arrow{margin-top:4px;border-bottom-color:transparent;border-top-color:#474747}.cke_hc .cke_toolbox_collapser .cke_arrow{font-size:8px;width:auto;border:0;margin-top:0;margin-right:2px}.cke_menubutton{display:block}.cke_menuitem span{cursor:default}.cke_menubutton:hover,.cke_menubutton:focus,.cke_menubutton:active{background-color:#d3d3d3;display:block}.cke_hc .cke_menubutton{padding:2px}.cke_hc .cke_menubutton:hover,.cke_hc .cke_menubutton:focus,.cke_hc .cke_menubutton:active{border:2px solid;padding:0}.cke_menubutton_inner{display:table-row}.cke_menubutton_icon,.cke_menubutton_label,.cke_menuarrow{display:table-cell}.cke_menubutton_icon{background-color:#d7d8d7;opacity:.70;filter:alpha(opacity=70);padding:4px}.cke_hc .cke_menubutton_icon{height:16px;width:0;padding:4px 0}.cke_menubutton:hover .cke_menubutton_icon,.cke_menubutton:focus .cke_menubutton_icon,.cke_menubutton:active .cke_menubutton_icon{background-color:#d0d2d0}.cke_menubutton_disabled:hover .cke_menubutton_icon,.cke_menubutton_disabled:focus .cke_menubutton_icon,.cke_menubutton_disabled:active .cke_menubutton_icon{opacity:.3;filter:alpha(opacity=30)}.cke_menubutton_label{padding:0 5px;background-color:transparent;width:100%;vertical-align:middle}.cke_menubutton_disabled .cke_menubutton_label{opacity:.3;filter:alpha(opacity=30)}.cke_menubutton_on{border:1px solid #dedede;background-color:#f2f2f2;box-shadow:0 0 2px rgba(0,0,0,.1) inset}.cke_menubutton_on .cke_menubutton_icon{padding-right:3px}.cke_menubutton:hover,.cke_menubutton:focus,.cke_menubutton:active{background-color:#eff0ef}.cke_panel_frame .cke_menubutton_label{display:none}.cke_menuseparator{background-color:#d3d3d3;height:1px;filter:alpha(opacity=70);opacity:.70}.cke_menuarrow{background-image:url(images\/arrow.png);background-position:0 10px;background-repeat:no-repeat;padding:0 5px}.cke_rtl .cke_menuarrow{background-position:5px -13px;background-repeat:no-repeat}.cke_menuarrow span{display:none}.cke_hc .cke_menuarrow span{vertical-align:middle;display:inline}.cke_combo{display:inline-block;float:left}.cke_rtl .cke_combo{float:right}.cke_hc .cke_combo{margin-top:-2px}.cke_combo_label{display:none;float:left;line-height:26px;vertical-align:top;margin-right:5px}.cke_rtl .cke_combo_label{float:right;margin-left:5px;margin-right:0}a.cke_combo_button{cursor:default;display:inline-block;float:left;margin:0 6px 5px 0;border:1px solid #a6a6a6;border-bottom-color:#979797;border-radius:3px;box-shadow:0 1px 0 rgba(255,255,255,.5),0 0 2px rgba(255,255,255,.15) inset,0 1px 0 rgba(255,255,255,.15) inset;background:#e4e4e4;background-image:linear-gradient(to bottom,#fff,#e4e4e4);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#ffffff\',endColorstr=\'#e4e4e4\')}.cke_combo_off a.cke_combo_button:hover,.cke_combo_off a.cke_combo_button:focus{background:#ccc;background-image:linear-gradient(to bottom,#f2f2f2,#ccc);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#f2f2f2\',endColorstr=\'#cccccc\');outline:0}.cke_combo_off a.cke_combo_button:active,.cke_combo_on a.cke_combo_button{border:1px solid #777;box-shadow:0 1px 0 rgba(255,255,255,.5),0 1px 5px rgba(0,0,0,.6) inset;background:#b5b5b5;background-image:linear-gradient(to bottom,#aaa,#cacaca);filter:progid:DXImageTransform.Microsoft.gradient(gradientType=0,startColorstr=\'#aaaaaa\',endColorstr=\'#cacaca\')}.cke_combo_on a.cke_combo_button:hover,.cke_combo_on a.cke_combo_button:focus,.cke_combo_on a.cke_combo_button:active{box-shadow:0 1px 6px rgba(0,0,0,.7) inset,0 1px 0 rgba(0,0,0,.2)}.cke_rtl .cke_combo_button{float:right;margin-left:5px;margin-right:0}.cke_hc a.cke_combo_button{padding:3px}.cke_hc .cke_combo_on a.cke_combo_button,.cke_hc .cke_combo_off a.cke_combo_button:hover,.cke_hc .cke_combo_off a.cke_combo_button:focus,.cke_hc .cke_combo_off a.cke_combo_button:active{border-width:3px;padding:1px}.cke_combo_text{line-height:26px;padding-left:10px;text-overflow:ellipsis;overflow:hidden;float:left;cursor:default;color:#474747;text-shadow:0 1px 0 rgba(255,255,255,.5);width:60px}.cke_rtl .cke_combo_text{float:right;text-align:right;padding-left:0;padding-right:10px}.cke_hc .cke_combo_text{line-height:18px;font-size:12px}.cke_combo_open{cursor:default;display:inline-block;font-size:0;height:19px;line-height:17px;margin:1px 7px 1px;width:5px}.cke_hc .cke_combo_open{height:12px}.cke_combo_arrow{cursor:default;margin:11px 0 0;float:left;height:0;width:0;font-size:0;border-left:3px solid transparent;border-right:3px solid transparent;border-top:3px solid #474747}.cke_hc .cke_combo_arrow{font-size:10px;width:auto;border:0;margin-top:3px}.cke_combo_disabled .cke_combo_inlinelabel,.cke_combo_disabled .cke_combo_open{opacity:.3}.cke_path{float:left;margin:-2px 0 2px}a.cke_path_item,span.cke_path_empty{display:inline-block;float:left;padding:3px 4px;margin-right:2px;cursor:default;text-decoration:none;outline:0;border:0;color:#4c4c4c;text-shadow:0 1px 0 #fff;font-weight:bold;font-size:11px}.cke_rtl .cke_path,.cke_rtl .cke_path_item,.cke_rtl .cke_path_empty{float:right}a.cke_path_item:hover,a.cke_path_item:focus,a.cke_path_item:active{background-color:#bfbfbf;color:#333;text-shadow:0 1px 0 rgba(255,255,255,.5);border-radius:2px;box-shadow:0 0 4px rgba(0,0,0,.5) inset,0 1px 0 rgba(255,255,255,.5)}.cke_hc a.cke_path_item:hover,.cke_hc a.cke_path_item:focus,.cke_hc a.cke_path_item:active{border:2px solid;padding:1px 2px}.cke_button__source_label,.cke_button__sourcedialog_label{display:inline}.cke_combo__fontsize .cke_combo_text{width:30px}.cke_combopanel__fontsize{width:120px}textarea.cke_source{font-family:\'Courier New\',Monospace;font-size:small;background-color:#fff;white-space:pre-wrap;border:0;padding:0;margin:0;display:block}.cke_wysiwyg_frame,.cke_wysiwyg_div{background-color:#fff}.cke_notifications_area{pointer-events:none}.cke_notification{pointer-events:auto;position:relative;margin:10px;width:300px;color:white;border-radius:3px;text-align:center;opacity:.95;filter:alpha(opacity = 95);box-shadow:2px 2px 3px 0 rgba(50,50,50,0.3);-webkit-animation:fadeIn .7s;animation:fadeIn .7s}.cke_notification_message a{color:#12306f}@-webkit-keyframes fadeIn{from{opacity:.4}to{opacity:.95}}@keyframes fadeIn{from{opacity:.4}to{opacity:.95}}.cke_notification_success{background:#72b572;border:1px solid #63a563}.cke_notification_warning{background:#c83939;border:1px solid #902b2b}.cke_notification_info{background:#2e9ad0;border:1px solid #0f74a8}.cke_notification_info span.cke_notification_progress{background-color:#0f74a8;display:block;padding:0;margin:0;height:100%;overflow:hidden;position:absolute;z-index:1}.cke_notification_message{position:relative;margin:4px 23px 3px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;z-index:4;text-overflow:ellipsis;overflow:hidden}.cke_notification_close{background-image:url(images\/close.png);background-repeat:no-repeat;background-position:50%;position:absolute;cursor:pointer;text-align:center;height:20px;width:20px;top:1px;right:1px;padding:0;margin:0;z-index:5;opacity:.6;filter:alpha(opacity = 60)}.cke_notification_close:hover{opacity:1;filter:alpha(opacity = 100)}.cke_notification_close span{display:none}.cke_notification_warning a.cke_notification_close{opacity:.8;filter:alpha(opacity = 80)}.cke_notification_warning a.cke_notification_close:hover{opacity:1;filter:alpha(opacity = 100)}.cke_chrome{visibility:inherit}.cke_voice_label{display:none}legend.cke_voice_label{display:none}</style>');
                                        angular
                                            .element('iframe.cke_panel_frame')
                                            .contents()
                                            .find('head')
                                            .append(
                                                '<style>blockquote,span[lang]{font-style:italic}body{font-family:sans-serif,Arial,Verdana,\"Trebuchet MS\";font-size:12px;color:#333;background-color:#fff;margin:20px}.cke_editable{font-size:13px;line-height:1.6}blockquote{font-family:Georgia,Times,\"Times New Roman\",serif;padding:2px 0;border-style:solid;border-color:#ccc;border-width:0}.cke_contents_ltr blockquote{padding-left:20px;padding-right:8px;border-left-width:5px}.cke_contents_rtl blockquote{padding-left:8px;padding-right:20px;border-right-width:5px}a{color:#0782C1}dl,ol,ul{padding:0 40px}img.left,img.right{padding:5px;border:1px solid #ccc}h1,h2,h3,h4,h5,h6{font-weight:400;line-height:1.2}hr{border:0;border-top:1px solid #ccc}img.right{float:right;margin-left:15px}img.left{float:left;margin-right:15px}pre{white-space:pre-wrap;word-wrap:break-word;-moz-tab-size:4;tab-size:4}.marker{background-color:#ff0}figure{text-align:center;border:1px solid #ccc;border-radius:2px;background:rgba(0,0,0,.05);padding:10px;margin:10px 20px;display:inline-block}figure>figcaption{text-align:center;display:block}a>img{padding:1px;margin:1px;border:none;outline:#0782C1 solid 1px}</style>');
                                    });
                        }
                    },
                    change: function () {
                        $timeout(function () {
                            $scope.getText();
                        });
                    },
                    afterPaste: function (evt) {
                        $scope.applyStyles();
                    }

                };

                CKEDITOR.addCss('div.cke_panel_block {background-color: red}');
                CKEDITOR.addCss('.cke_combo_button {width: auto}');
                CKEDITOR.addCss('.cke_combo_text {width: auto}');

                $scope.editor = CKEDITOR.inline('editorAdd', ckConfig);

                // Adjustment of the size of the editor
                // to the size of the window less the menus
                $('#editorAdd').css('min-height', '500px');
                // scroll in editor.
                $('#editorAdd').css('max-height', '800px');
                $('#editorAdd').css('overflow-y', 'auto');
                // $('#editorAdd').css('min-height', $(window).height()
                // - 380 + 'px');

            };

            /**
             * Deactivation of the automatic creation of the editor
             * inline
             *
             * @method $scope.disableAutoInline
             */
            $scope.disableAutoInline = function () {
                CKEDITOR.disableAutoInline = true;
            };

            /**
             * Displays the loading bar and
             * changes the page title if idDocument parameter is present.
             */
            $scope.initLoadExistingDocument = function () {
                if ($scope.idDocument) {
                    $scope.loaderProgress = 10;
                    $scope.pageTitre = 'Editer le document';
                    $scope.showLoader('Chargement de votre document en cours');
                }
            };

            $scope.resetDirtyCKEditor = function () {
                CKEDITOR.instances.editorAdd.resetDirty();
            };

            $rootScope.$on('profilChanged', function () {
                $scope.applyStyles();
            });

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

            /**
             * Open a modal to alert the user that
             * the display of the document is unavailable in disconnected mode.
             * @method $partageInfoDeconnecte
             */
            $scope.affichageInfoDeconnecte = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/common/informationModal.html',
                    controller: 'InformationModalCtrl',
                    size: 'sm',
                    resolve: {
                        title: function () {
                            return 'Pas d\'accès internet';
                        },
                        content: function () {
                            return 'L\'affichage de ce document nécessite au moins un affichage préalable via internet.';
                        },
                        reason: function () {
                            return '/listDocument';
                        }
                    }
                });
            };


            /**
             * Show loading popup.
             */
            $scope.showAdaptationLoader = function () {
                //console.log('loader adaptation editor');
                $scope.showFixedLoader('Adaptation du document en cours.');
            };

            /**
             * Show loading popup.
             */
            $scope.showLoader = function (msg) {
                $scope.loader = true;
                $scope.loaderMessage = msg;
                $scope.showloaderProgress = true;
                $('.loader_cover').show();
            };

            $scope.showFixedLoader = function (msg) {

                //console.log('show fixed loader ');
                $scope.loader = true;
                $scope.loaderMessage = msg;
                $scope.showloaderProgress = false;
                $('.loader_cover').show();
            };

            /**
             * Hide loading popup.
             */
            $scope.hideLoader = function () {
                //console.log('hide loader adaptation editor');
                $scope.loader = false;
                $scope.loaderMessage = '';
                $scope.showloaderProgress = false;
                $scope.caret.restorePosition();
                $('.loader_cover').hide();
            };


            // Disable automatic creation of inline editors
            $scope.disableAutoInline();

            // Get the list of available formats
            $scope.updateFormats();

            $scope.initLoadExistingDocument();

            $scope.toasterMsg = '';
            $scope.forceToasterApdapt = false;
            $scope.listTagsByProfilToaster = [];

            /**
             * Show success toaster
             * @param msg
             */
            $scope.showToaster = function (id, msg) {
                $scope.listTagsByProfilToaster = JSON.parse(localStorage.getItem('listTagsByProfil'));
                $scope.toasterMsg = '<h1>' + gettextCatalog.getString(msg) + '</h1>';
                $scope.forceToasterApdapt = true;
                $timeout(function() {
                    angular.element(id).fadeIn('fast').delay(10000).fadeOut('fast');
                    $scope.forceToasterApdapt = false;
                }, 0);
            };


        });