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

angular.module('cnedApp').controller('AddDocumentCtrl', function($log, $scope, $rootScope, $routeParams, $timeout, $compile, tagsService, serviceCheck, $http, $location, dropbox, $window, configuration, htmlEpubTool, md5, fileStorageService, removeStringsUppercaseSpaces, $modal, $interval, canvasToImage) {

    $scope.idDocument = $routeParams.idDocument;
    $scope.applyRules = false;
    // Gestion du menu
    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').hide();
    $('#titreAdmin').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();
    $('#titreTag').hide();
    $('#titreListDocument').hide();

    // Paramètres à intialiser
    $scope.pageTitre = 'Ajouter un document';
    $scope.showloaderProgress = false;
    $scope.files = [];
    $scope.errorMsg = false;
    $scope.alertNew = '#addDocumentModal';
    $scope.currentData = '';
    $scope.pageBreakElement = '<div aria-label="Saut de page" class="cke_pagebreak" contenteditable="false" data-cke-display-name="pagebreak" data-cke-pagebreak="1" style="page-break-after: always" title="Saut de page"></div><div></div><br />';
    $scope.resizeDocEditor = 'Agrandir';
    // Initialise le veouillage du document (pour déclencher popup d'alerte si
    // sortie de la page) à false
    localStorage.setItem('lockOperationDropBox', false);

    $scope.caret = {
        lastPosition : null,
        savePosition : function() {
            $scope.caret.lastPosition = rangy.getSelection().saveCharacterRanges(document.getElementById('editorAdd'));
        },
        restorePosition : function() {
            if ($scope.caret.lastPosition) {
                rangy.getSelection().restoreCharacterRanges(document.getElementById('editorAdd'), $scope.caret.lastPosition);
            }
        }
    };

    $scope.applyStyleInterval = undefined;
    $scope.applyStyles = function() {
        $scope.caret.savePosition();
        $scope.applyRules = true;
        $scope.showLoader('Adaptation du document en cours veuillez patienter.');
        $timeout(function() {
            $scope.applyRules = false;
            $scope.hideLoader();
            $scope.caret.restorePosition();
            $interval.cancel($scope.applyStyleInterval);
        });
    };

    /**
     * Return le modal à afficher lors du click sur ouvrir un doc
     * 
     * @method $scope.openDocument
     */
    $scope.openDocument = function() {
        $scope.errorMsg = false;
        $scope.msgErrorModal = '';
        $scope.clearUploadFile();
        $scope.clearLien();
        $($scope.alertNew).modal('show');
    };

    $scope.openDocumentEditorWithData = function() {
        $scope.alertNew = '#addDocumentModal';
        $scope.openDocument();
    };

    /**
     * Générer un identifiant MD5 à partir de l'html fourni Utiliser pour la
     * signature du document dans le titre lors de l'enregistrement
     * 
     * @param {String}
     *            html
     * @method $scope.generateMD5
     */
    $scope.generateMD5 = function(html) {
        return md5.createHash(html);
    };

    /**
     * Stocke le contenu de l'éditeur dans $scope.currentData Verouille la
     * sortie de l'éditeur si du contenu est présent
     * 
     * @method $scope.getText
     */
    $scope.getText = function() {
        $scope.currentData = CKEDITOR.instances.editorAdd.getData();
        // console.log($scope.currentData);
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
        if ($scope.applyStyleInterval)
            $interval.cancel($scope.applyStyleInterval);
        $scope.applyStyleInterval = $interval($scope.applyStyles, 2000);
    };

    /**
     * Affiche la popup d'enregistrement
     * 
     * @method $scope.showSaveDialog
     */
    $scope.showSaveDialog = function() {
        // si le titre n'a pas été renseigné on affiche la popup
        // d'enregistrement
        if (!$scope.docTitre) {
            $scope.errorMsg = false;
            $scope.msgErrorModal = '';
            $('#save-modal').modal('show');
        } else {
            // sinon on enregistre directement
            $scope.save();
        }
    };

    /**
     * Effectue le replace des liens interne
     * 
     * @method $scope.processLink
     */
    $scope.processLink = function(data) {
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
     * Sauvegarde exécutée suite à l'enregistrment dans la popup "Enregistrer"
     * 
     * @method $scope.save
     */
    $scope.save = function() {

        $scope.errorMsg = false;

        $scope.msgErrorModal = '';
        var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer votre document';
        var errorMsg2 = 'Erreur lors de l\'enregistrement de votre document';
        var errorMsg3 = 'Erreur lors du partage du document';
        var errorMsg4 = 'Le document existe déjà';
        if (!$scope.docTitre || $scope.docTitre.length <= 0) {
            $scope.msgErrorModal = 'Le titre est obligatoire !';
            $scope.errorMsg = true;
            $('#save-modal').modal('show');
            return;
        } else {
            if ($scope.docTitre.length > 201) {
                $scope.msgErrorModal = 'Le titre est trop long !';
                $scope.errorMsg = true;
                $('#save-modal').modal('show');
                return;
            } else if (!serviceCheck.checkName($scope.docTitre)) {
                $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
                $scope.errorMsg = true;
                $('#save-modal').modal('show');
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
            fileStorageService.searchFiles($rootScope.isAppOnline, '_' + $scope.docTitre + '_', token).then(function(filesFound) {
                for (var i = 0; i < filesFound.length; i++) {
                    if (filesFound[i].filepath.indexOf('.html') > 0 && filesFound[i].filepath.indexOf('_' + $scope.docTitre + '_') > 0) {
                        documentExist = true;
                        break;
                    }
                }
                $scope.loaderProgress = 25;

                if (documentExist && !$scope.existingFile) {
                    localStorage.setItem('lockOperationDropBox', false);
                    $scope.hideLoader();
                    $scope.msgErrorModal = errorMsg4;
                    $scope.errorMsg = true;
                    $('#save-modal').modal('show');
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

                    fileStorageService.saveFile($rootScope.isAppOnline, ($scope.apercuName || apercuName), $scope.currentData, token).then(function(data) {
                        // On passe en mode modificication
                        $scope.pageTitre = 'Editer le document';
                        $scope.loaderProgress = 70;
                        localStorage.setItem('lockOperationDropBox', false);
                        $scope.loaderProgress = 75;
                        $scope.existingFile = data;
                        $scope.idDocument = $scope.docTitre;
                        $scope.hideLoader();
                        $scope.resetDirtyCKEditor();
                    });
                }
            });
        } else {
            localStorage.setItem('lockOperationDropBox', false);
            $scope.loader = false;
            $scope.msgErrorModal = errorMsg1;
            $scope.errorMsg = true;
            $('#save-modal').modal('show');
        }
    };

    /**
     * Appelé lorsque l'utilisateur annule l'enregistrement. Réinitialise les
     * messages d'erreur.
     * 
     * @method $scope.cancelSave
     */
    $scope.cancelSave = function() {
        $scope.errorMsg = false;
        $scope.msgErrorModal = '';
    };

    /**
     * Affiche la popup de chargement.
     */
    $scope.showLoader = function(msg) {
        $scope.loader = true;
        $scope.loaderMessage = msg;
        $scope.showloaderProgress = true;
        $('.loader_cover').show();
    };

    /**
     * Cache la popup de chargement.
     */
    $scope.hideLoader = function() {
        $scope.loader = false;
        $scope.loaderMessage = '';
        $scope.showloaderProgress = false;
        $scope.caret.restorePosition();
        $('.loader_cover').hide();
    };

    /**
     * Test la véracité d'un lien (en vérifiant la présence du protocole http
     * dans la String)
     * 
     * @method $scope.verifyLink
     * @param String
     *            link
     * @return Boolean
     */
    $scope.verifyLink = function(link) {
        return link && ((link.toLowerCase().indexOf('https') > -1) || (link.toLowerCase().indexOf('http') > -1));
    };
    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que l'import de
     * lien est indisponible en mode déconnecté
     * 
     * @method $afficherInfoDeconnecte
     */
    $scope.afficherInfoDeconnecte = function() {
        var modalInstance = $modal.open({
            templateUrl : 'views/common/informationModal.html',
            controller : 'InformationModalCtrl',
            size : 'sm',
            resolve : {
                title : function() {
                    return 'Pas d\'accès internet';
                },
                content : function() {
                    return 'La fonctionnalité d\'import de lien nécessite un accès à internet';
                },
                reason : function() {
                    return null;
                },
                forceClose : function() {
                    return null;
                }
            }
        });
    };

    /**
     * Vérification des données de la popup d'ouverture d'un document Gestion
     * des messages d'erreurs à travers $scope.errorMsg
     * 
     * @method $scope.ajouterDocument
     */
    $scope.ajouterDocument = function() {
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
            var searchApercu = fileStorageService.searchFiles($rootScope.isAppOnline, '_' + $scope.doc.titre + '_', $rootScope.currentUser.dropbox.accessToken);
            searchApercu.then(function(result) {
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
     * Récupération du contenu html d'un epub
     * 
     * @method $scope.getEpub
     * @return {String} html
     */
    $scope.getEpubLink = function() {

        $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
        var epubLink = $scope.lien;
        $http.post(configuration.URL_REQUEST + '/externalEpub', {
            id : $rootScope.currentUser.local.token,
            lien : epubLink
        }).success(function(data) {
            var epubContent = angular.fromJson(data);
            $scope.epubDataToEditor(epubContent);
        }).error(function() {
            $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub.';
            $scope.errorMsg = true;
            $scope.hideLoader();
        });
    };

    /**
     * cleans and puts the epub content to the editor
     */
    $scope.epubDataToEditor = function(epubContent) {

        if (epubContent.html.length > 1) {
            var tabHtml = [];
            var makeHtml = function(i, length) {
                if (i !== length) {
                    var pageHtml = epubContent.html[i].dataHtml;
                    var resultHtml = {
                        documentHtml : pageHtml
                    };
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                    promiseClean.then(function(resultClean) {
                        for ( var j in epubContent.img) {
                            if (resultClean.indexOf(epubContent.img[j].link)) {
                                resultClean = resultClean.replace(new RegExp('src=\"([ A-Z : 0-9/| ./]+)?' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                            }
                        }
                        tabHtml[i] = resultClean;
                        makeHtml(i + 1, length);
                    }, function() {
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

            promiseClean.then(function(resultClean) {
                for ( var j in epubContent.img) {
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
     * Ouvrir le document selectionne par l'utilisateur.
     */
    $scope.validerAjoutDocument = function() {
        // Présence d'un fichier avec parcourir
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

        // Gestion d'un lien
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
                // Récupération du contenu du body du lien par les services
                var promiseHtml = serviceCheck.htmlPreview($scope.lien, $rootScope.currentUser.dropbox.accessToken);
                promiseHtml.then(function(resultHtml) {
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                    promiseClean.then(function(resultClean) {
                        // Insertion dans l'éditeur
                        CKEDITOR.instances.editorAdd.setData(resultClean);
                        $scope.hideLoader();
                    });
                }, function(err) {

                    $scope.hideLoader();
                    $scope.techError = err;
                    angular.element('#myModalWorkSpaceTechnical').modal('show');
                });
            }
        }
    };

    /**
     * Déclenché lors de l'ouverture d'un document
     */
    $('#addDocumentModal').on('hidden.bs.modal', function() {
        $scope.validerAjoutDocument();
    });

    /**
     * Charge l'image dans l'éditeur
     * 
     * @method $scope.loadImage
     */
    $scope.loadImage = function() {
        var reader = new FileReader();
        // Lecture de l'image
        reader.onload = function(e) {
            // Insert image
            CKEDITOR.instances.editorAdd.setData('<img src="' + e.target.result + '" width="790px"/>');
        };

        // Read in the image file as a data URL.
        reader.readAsDataURL($rootScope.uploadDoc.uploadPdf[0]);
        $scope.clearUploadFile();
    };

    /**
     * Charge le pdf par lien dans l'editeur
     * 
     * @method $scope.loadPdfByLien
     */
    $scope.loadPdfByLien = function(url) {
        $scope.loaderProgress = 0;
        $scope.showLoader('Traitement de votre document en cours');
        var contains = (url.indexOf('https') > -1); // true
        if (contains === false) {
            $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
        } else {
            $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
        }
        $http.post($scope.serviceNode, {
            lien : url,
            id : localStorage.getItem('compteId')
        }).success(function(data) {
            // Clear editor content
            CKEDITOR.instances.editorAdd.setData('');
            var pdfbinary = $scope.base64ToUint8Array(data);
            PDFJS.getDocument(pdfbinary).then(function(pdf) {
                $scope.loadPdfPage(pdf, 1);
            });
        }).error(function() {
            $scope.hideLoader();
            $('#myModalWorkSpace').modal('show');
            $scope.pdferrLien = true;
        });
        $scope.clearUploadFile();
    };

    /**
     * Convertion du base64 en en Uint8Array
     * 
     * @param base64
     *            le binaire à convertir
     * @method $scope.base64ToUint8Array
     */
    $scope.base64ToUint8Array = function(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    };

    /**
     * Charge le pdf local dans l'editeur
     * 
     * @method $scope.loadPdf
     */
    $scope.loadPdf = function() {
        $scope.loaderProgress = 0;
        $scope.showLoader('Traitement de votre document en cours');

        // Step 1: Get the file from the input element
        var file = $rootScope.uploadDoc.uploadPdf[0];

        // Step 2: Read the file using file reader
        var fileReader = new FileReader();

        fileReader.onload = function() {
            // Step 4:turn array buffer into typed array
            var typedarray = new Uint8Array(this.result);

            // clear ckeditor
            CKEDITOR.instances.editorAdd.setData('');

            // if (!$rootScope.isAppOnline) PDFJS.disableWorker = true;
            // Step 5:PDFJS should be able to read this
            PDFJS.getDocument(typedarray).then(function(pdf) {
                $scope.loadPdfPage(pdf, 1);
            });
        };

        // Step 3:Read the file as ArrayBuffer
        fileReader.readAsArrayBuffer(file);
    };

    /**
     * Charge les pages du pdf en tant qu'image dans l'éditeur
     * 
     * @param pdf
     *            le le pdf à charger
     * @param le
     *            numéro de la page à partir de laquelle charger le pdf
     * @method $scope.loadPdfPage
     */
    $scope.loadPdfPage = function(pdf, pageNumber) {
        return pdf.getPage(pageNumber).then(function(page) {
            $('#canvas').remove();
            $('body').append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');
            var canvas = document.getElementById('canvas');
            var context = canvas.getContext('2d');
            var viewport = page.getViewport(canvas.width / page.getViewport(1.0).width); // page.getViewport(1.5);
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            var renderContext = {
                canvasContext : context,
                viewport : viewport
            };

            page.render(renderContext).then(function(error) {
                if (error) {
                    $scope.hideLoader();
                    $scope.$apply();
                    console.log(error);
                } else {
                    new Promise(function(resolve) {
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
     * Insère un saut de page dans l'éditeur
     * 
     * @method $scope.insertPageBreak
     */
    $scope.insertPageBreak = function() {
        CKEDITOR.instances.editorAdd.insertHtml($scope.pageBreakElement);
    };

    /**
     * Gestion de l'ajout d'un fichier via 'parcourir'
     * 
     * @method $scope.setFiles
     */
    $scope.setFiles = function(element) {
        $scope.files = [];
        var field_txt = '';
        $scope.$apply(function() {
            for (var i = 0; i < element.files.length; i++) {
                var filename = '';
                if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
                    if (element.files[i].type === '' && element.files[i].name.indexOf('.epub') > -1) {
                        filename = element.files[i].name;
                        $scope.doc = {};
                        $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
                        $scope.files.push(element.files[i]);
                        field_txt += ' ' + element.files[i].name;
                        $scope.msgErrorModal = '';
                        $scope.errorMsg = false;
                        $('#filename_show').val(field_txt);
                    } else if (element.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.files[i].type === 'application/msword' || element.files[i].type === 'application/vnd.oasis.opendocument.text' || element.files[i].type === 'text/plain') {
                        $scope.msgErrorModal = 'Les documents de ce type doivent être insérés en effectuant un copier/coller du contenu.';
                        $scope.errorMsg = true;
                        $scope.files = [];
                        break;
                    } else {
                        $scope.msgErrorModal = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
                        $scope.errorMsg = true;
                        $scope.files = [];
                        break;
                    }
                } else {
                    filename = element.files[i].name;
                    $scope.doc = {};
                    $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
                    if (element.files[i].type === 'image/jpeg' || element.files[i].type === 'image/png' || element.files[i].type === 'image/jpg') {
                        $rootScope.imgFile = true;
                    } else {
                        $rootScope.imgFile = false;
                    }
                    $scope.files.push(element.files[i]);
                    field_txt += ' ' + element.files[i].name;
                    $scope.msgErrorModal = '';
                    $scope.errorMsg = false;
                    $('#filename_show').val(field_txt);
                }
            }
        });
    };

    /**
     * Réinitialise le champ parcourir
     */
    $scope.clearUploadFile = function() {
        $scope.files = [];
        $('#docUploadPdf').val('');
        $('#filename_show').val('');
    };

    /**
     * Réinitialise le champ lien
     * 
     * @method $scope.clearLien
     */
    $scope.clearLien = function() {
        $scope.lien = '';
    };

    /**
     * Traitement suite à l'upload des fichiers sur le serveur
     * 
     * @method $scope.uploadComplete
     * @param evt
     *            l'evenement d'upload
     */
    $scope.uploadComplete = function(evt) {
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
                tmp.then(function(loacalSign) {
                    if (loacalSign.erreurIntern) {
                        $('#myModalWorkSpace').modal('show');
                    } else {
                        $scope.filePreview = loacalSign.sign;
                        if ($scope.serviceUpload !== '/fileupload') {
                            var epubContent = angular.fromJson(evt.target.responseText);
                            if (epubContent.html.length > 1) {

                                // Fonction récursive pour concaténer les
                                // différentes pages HTML
                                var tabHtml = [];
                                var makeHtml = function(i, length) {
                                    if (i !== length) {
                                        var pageHtml = atob(epubContent.html[i].dataHtml);
                                        var resultHtml = {
                                            documentHtml : pageHtml
                                        };
                                        var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                                        promiseClean.then(function(resultClean) {
                                            for ( var j in epubContent.img) {
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
                                htmlEpubTool.cleanHTML(resultHtml).then(function(resultClean) {
                                    for ( var j in epubContent.img) {
                                        if (resultClean.indexOf(epubContent.img[j].link)) {
                                            resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                                        }
                                    }
                                    CKEDITOR.instances.editorAdd.setData(resultClean);
                                }, function() {
                                    $scope.msgErrorModal = 'Erreur lors du téléchargement de votre epub. TEST';
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
     * Traitement suite à une erreur lors de l'upload des fichiers
     * 
     * @method $scope.uploadFailed
     */
    $scope.uploadFailed = function() {
        $scope.hideLoader();
    };

    $scope.uploadProgress = function(evt) {
        if (evt.lengthComputable) {
            // evt.loaded the bytes browser receive
            // evt.total the total bytes seted by the header
            $scope.loaderProgress = (evt.loaded / evt.total) * 100;
        }
    };

    /**
     * Traitement suite à l'envoi du formulaire d'upload
     * 
     * @method $scope.uploadFile
     */
    $scope.uploadFile = function() {
        if ($scope.files.length > 0) {
            $scope.loaderProgress = 10;
            var fd = new FormData();
            for ( var i in $scope.files) {
                fd.append('uploadedFile', $scope.files[i]);
                if ($scope.files[i].type === 'application/epub+zip') {
                    $scope.serviceUpload = '/epubUpload';
                    $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                } else {
                    if ($scope.files[i].type === '' && $scope.files[i].name.indexOf('.epub')) {
                        $scope.serviceUpload = '/epubUpload';
                        $scope.showLoader('L\'application analyse votre fichier afin de s\'assurer qu\'il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ');
                    } else if ($scope.files[i].type.indexOf('image/') > -1) {
                        // appel du service de conversion image -> base64
                        $scope.serviceUpload = '/fileupload';
                        $scope.showLoader('Chargement de votre/vos image(s) en cours. Veuillez patienter ');
                    } else {
                        // appel du service de conversion pdf -> base64
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
                htmlEpubTool.convertToHtml($scope.files).then(function(data) {
                    $scope.epubDataToEditor(data);
                });
            }
        } else {
            $scope.msgErrorModal = 'Vous devez choisir un fichier.';
            $scope.errorMsg = true;
        }

    };

    /**
     * Ouverture de l'apercu
     * 
     * @method $scope.openApercu
     */
    $scope.openApercu = function() {
        fileStorageService.saveTempFile($scope.currentData).then(function() {
            $window.open('#/apercu?tmp=true');
        });
    };

    /**
     * Met à jour les formats disponibles dans l'éditeur
     * 
     * @method $scope.updateFormats
     */
    $scope.updateFormats = function() {
        var formatsArray = [];
        var ckConfig = {};
        tagsService.getTags(localStorage.getItem('compteId')).then(function(data) {
            for (var i = 0; i < data.length; i++) {
                var balise = data[i].balise;
                if (balise === 'div') {
                    var classes = removeStringsUppercaseSpaces(data[i].libelle);
                    ckConfig['format_' + classes] = {
                        element : balise,
                        attributes : {
                            'class' : classes
                        }
                    };
                    formatsArray.push(classes);
                } else if (balise === 'blockquote') {
                    // FIX on CKEDITOR which does not support blockquote in
                    // format list by default
                    formatsArray.push(data[i].balise);
                    ckConfig.format_blockquote = {
                        element : 'blockquote'
                    };
                    // format non presents dans la liste
                } else if (balise !== 'li' && balise !== 'ol' && balise !== 'ul') {
                    formatsArray.push(data[i].balise);
                }
            }
            var formats = formatsArray.join(';');
            ckConfig.format_tags = formats;
            // suppression du title
            ckConfig.title = false;
            $scope.createCKEditor(ckConfig, data);
        });
    };

    /**
     * Charge le document a éditer.
     * 
     * @method $scope.editExistingDocument
     */
    $scope.editExistingDocument = function() {
        $scope.pageTitre = 'Editer le document';
        fileStorageService.searchFiles($rootScope.isAppOnline, $scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function(files) {
            $scope.existingFile = files[0];
            $scope.docTitre = $scope.idDocument;
            $scope.loaderProgress = 27;
            fileStorageService.getFile($rootScope.isAppOnline, $scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function(filecontent) {
                if (filecontent === null) {
                    $scope.hideLoader();
                    $scope.affichageInfoDeconnecte();
                } else {
                    CKEDITOR.instances.editorAdd.setData(filecontent, {
                        callback : $scope.resetDirtyCKEditor
                    });
                    $scope.hideLoader();
                }
            });
        });
    };

    /**
     * Création de l'éditeur avec les formats récupérés précédemment et en
     * ajustant les libellés affichés
     * 
     * @param ckConfig
     *            la configuration de ckEditor à appliquer
     * @param formatTags
     *            les formats disponibles dans l'éditeur
     * @method $scope.createCKEditor
     */
    $scope.createCKEditor = function(ckConfig, listTags) {
        // Creation de l'editeur inline
        for ( var name in CKEDITOR.instances) {
            if (CKEDITOR.instances[name].destroy) {
                CKEDITOR.instances[name].destroy(true);
            }
        }

        ckConfig.on = {
            instanceReady : function() {
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
                }
                if ($scope.idDocument) {
                    $scope.$apply(function() {
                        $scope.editExistingDocument();
                    });
                }
            },
            change : function() {
                $timeout(function() {
                    $scope.getText();
                });
            },
            afterPaste : function(evt) {
                $scope.applyStyles();
            }

        };

        $scope.editor = CKEDITOR.inline('editorAdd', ckConfig);

        // Ajustement de la taille de l'éditeur à la taille de la fenêtre moins
        // les menus
        $('#editorAdd').css('min-height', $(window).height() - 380 + 'px');
    };

    /**
     * Désactivation de la création automatique des editeurs inline
     * 
     * @method $scope.disableAutoInline
     */
    $scope.disableAutoInline = function() {
        CKEDITOR.disableAutoInline = true;
    };

    /**
     * Affiche la barre de chargement et change le titre de la page si le
     * parametre idDocument est present.
     */
    $scope.initLoadExistingDocument = function() {
        if ($scope.idDocument) {
            $scope.loaderProgress = 10;
            $scope.pageTitre = 'Editer le document';
            $scope.showLoader('Chargement de votre document en cours');
        }
    };

    $scope.resetDirtyCKEditor = function() {
        CKEDITOR.instances.editorAdd.resetDirty();
    };

    $rootScope.$on('profilChanged', function() {
        $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
    });

    // réduit ou agrandit l'éditeur de texte
    $scope.resizeEditor = function() {

        if ($scope.resizeDocEditor === 'Agrandir') {
            $scope.resizeDocEditor = 'Réduire';
            $('.header_zone').slideUp(300, function() {
            });

        } else {
            $scope.resizeDocEditor = 'Agrandir';
            $('.header_zone').slideDown(300, function() {
            });
        }
    };

    /**
     * Ouvre une modal permettant de signaler à l'utilisateur que l'affichage du
     * document est indisponible en mode déconnecté
     * 
     * @method $partageInfoDeconnecte
     */
    $scope.affichageInfoDeconnecte = function() {
        var modalInstance = $modal.open({
            templateUrl : 'views/common/informationModal.html',
            controller : 'InformationModalCtrl',
            size : 'sm',
            resolve : {
                title : function() {
                    return 'Pas d\'accès internet';
                },
                content : function() {
                    return 'L\'affichage de ce document nécessite au moins un affichage préalable via internet.';
                },
                reason : function() {
                    return '/listDocument';
                }
            }
        });
    };
    // Désactive la creation automatique des editeurs inline
    $scope.disableAutoInline();

    // Récupère la liste des formats disponibles
    $scope.updateFormats();

    $scope.initLoadExistingDocument();

    $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');

});
