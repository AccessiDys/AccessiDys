/* File: addDocument.js
 *
 * Copyright (c) 2015
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

/*global $:false */
/* jshint undef: true, unused: true */
/* global PDFJS ,Promise, CKEDITOR  */
/*jshint unused: false, undef:false */

angular.module('cnedApp').controller('AddDocumentCtrl', function ($scope, $rootScope, serviceCheck, $http, $location, dropbox, $window, configuration, htmlEpubTool, md5) {

        //Gestion du menu
        $('#titreCompte').hide();
        $('#titreProfile').hide();
        $('#titreDocument').hide();
        $('#titreAdmin').hide();
        $('#detailProfil').hide();
        $('#titreDocumentApercu').hide();
        $('#titreTag').hide();
        $('#titreListDocument').hide();

        //Paramètres à intialiser
        $scope.showloaderProgress = false;
        $scope.showloaderProgressScope = false;
        $scope.files = [];
        $scope.errorMsg = '';
        $scope.files = [];
        $scope.escapeTest = true;
        $scope.alertNew = '#addDocumentModal';
        $scope.currentData = '';

        //Initialise le veouillage du document (pour déclencher popup d'alerte si sortie de la page) à false
        localStorage.setItem('lockOperationDropBox', false);

        if ($rootScope.socket) {
            $rootScope.socket.on('notif', function () {
            });
        }

        /**
          * Return le modal à afficher lors du click sur ouvrir un doc
          * @method  $scope.returnAlertNew
          */
        $scope.returnAlertNew = function () {
            $($scope.alertNew).modal('show');
        };

        /**
          * Générer un identifiant MD5 à partir de l'html fourni
         * Utiliser pour la signature du document dans le titre lors de l'enregistrement
         * @param {String} html
          * @method  $scope.getText
          */
        $scope.generateFilePreview = function (html) {
            return md5.createHash(html);
        };

        /**
          * Stocke le contenu de l'éditeur dans $scope.currentData
         * Verouille la sortie de l'éditeur si du contenu est présent
          * @method  $scope.getText
          */
        $scope.getText = function () {
            $scope.currentData = CKEDITOR.instances.editorAdd.getData();
            //console.log($scope.currentData);
            if ($scope.currentData === '') {
                localStorage.setItem('lockOperationDropBox', false);
                $scope.alertNew = '#addDocumentModal';
            }
            else {
                localStorage.setItem('lockOperationDropBox', true);
                $scope.alertNew = '#save-new-modal';
            }
        };

        /**
          * Déclenche la récupération du contenu de l'éditeur à chaque changement
          * @method  $scope.initCkEditorChange
          */
        $scope.initCkEditorChange = function () {
            CKEDITOR.instances.editorAdd.on('change', function () {
                $scope.getText();
            });
        };

        /**
          * Sauvegarde exécutée suite à l'enregistrment dans la popup "Enregistrer"
          * @method  $scope.save
          */
        $scope.save = function (apercu) {

            if (apercu === true) {
                $scope.docTitreBefore = $scope.docTitre;
                $scope.docTitre = 'Apercu Temporaire';
            }

            $scope.errorMsg = false;

            $scope.msgErrorModal = '';
            var url = configuration.URL_REQUEST + '/index.html';
            var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer';
            var errorMsg2 = 'Erreur lors de l\'enregistrement';
            var errorMsg3 = 'Erreur lors du partage';
            var errorMsg4 = 'Le document existe déja';
            if (!$scope.docTitre || $scope.docTitre.length <= 0) {
                $scope.msgErrorModal = 'Le titre est obligatoire !';
                $scope.errorMsg = true;
                return;
            } else {
                if ($scope.docTitre.length > 201) {
                    $scope.msgErrorModal = 'Le titre est trop long !';
                    $scope.errorMsg = true;
                    return;
                } else if (!serviceCheck.checkName($scope.docTitre)) {
                    $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
                    $scope.errorMsg = true;
                    return;
                }
            }
            if ($scope.errorMsg === false) {
                $('#save-modal').modal('hide');
            }

            $('.loader_cover').show();
            $scope.showloaderProgress = true;
            $scope.loaderMessage = 'Enregistrement du document en cours veuillez patienter ';
            $scope.loaderProgress = 20;
            localStorage.setItem('lockOperationDropBox', true);
            if ($rootScope.currentUser.dropbox.accessToken) {
                var token = $rootScope.currentUser.dropbox.accessToken;

                $http.post(configuration.URL_REQUEST + '/allVersion', {
                    id: $rootScope.currentUser.local.token
                }).success(function (dataRecu) {
                    var sysVersion = dataRecu[0].appVersion;
                    $scope.loaderProgress = 25;
                    var documentExist = false;
                    $scope.listDocument = listDocument;
                    for (var i = 0; i < $scope.listDocument.length; i++) {
                        if ($scope.listDocument[i].path.indexOf('_' + $scope.nouveauTitre + '_') > -1) {
                            documentExist = true;
                            break;
                        }
                    }
                    if (documentExist) {
                        localStorage.setItem('lockOperationDropBox', false);
                        $scope.loader = false;
                        $scope.msgErrorModal = errorMsg4;
                        $scope.errorMsg = true;
                        $('#save-modal').modal('show');
                    } else {
                        var ladate = new Date();
                        var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
                        if (apercu === true) {

                            tmpDate = '0000-00-00';
                        }

                        $scope.filePreview = $scope.generateFilePreview($scope.currentData);
                        var apercuName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.html';
                        var manifestName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.appcache';


                        $scope.loaderProgress = 30;
                        $http.get(url).then(function (response) {
                            //Préparation du html pour envoi au service
                            var dataContent = '<body><div>' + $scope.currentData + '</div></body>';

                            //Initialisation de la variable blocks
                            $scope.blocks = {
                                children: []
                            };
                            var block = [];

                            //Envoi au servicce pour transformation en CnedObject
                            var promiseConvert = htmlEpubTool.convertToCnedObject(dataContent, 'Page ');
                            promiseConvert.then(function (resultConverted) {
                                resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                                block.push(resultConverted);
                                $scope.blocks = {
                                    children: block,
                                    img: []
                                };
                                $scope.loader = false;
                                $scope.showloaderProgress = false;
                                $('.loader_cover').hide();
                                $scope.showloaderProgress = false;
                                localStorage.setItem('lockOperationDropBox', true);

                                //Création du document à sauvegarder avec le CnedObject
                                response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                                if (response.data.length > 0) {
                                    $scope.loaderProgress = 35;
                                    $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function (manifestContent) {
                                        $scope.loaderProgress = 40;
                                        var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), manifestContent.data, token, configuration.DROPBOX_TYPE);
                                        uploadManifest.then(function (result) {
                                            if (result) {
                                                $scope.loaderProgress = 45;
                                                var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                                shareManifest.then(function (result) {
                                                    response.data = response.data.replace("var Appversion=''", "var Appversion='" + sysVersion + "'"); // jshint ignore:line
                                                    response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                                    response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                                    if (result) {
                                                        $scope.loaderProgress = 60;
                                                        var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), response.data, token, configuration.DROPBOX_TYPE);
                                                        uploadApercu.then(function (result) {
                                                            if (result) {
                                                                var listDocument = result;
                                                                $scope.loaderProgress = 70;
                                                                var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                                shareApercu.then(function (result) {
                                                                    localStorage.setItem('lockOperationDropBox', false);
                                                                    if (result) {
                                                                        $scope.docTitre = '';
                                                                        var urlDropbox = result.url + '#/apercu';
                                                                        listDocument.lienApercu = result.url + '#/apercu';
                                                                        $scope.loaderProgress = 75;
                                                                        if (result) {
                                                                            if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                                urlDropbox += '?key=' + $rootScope.currentUser.local.token;
                                                                            }

                                                                            if (apercu === true) {
                                                                                $window.open(urlDropbox);
                                                                                $scope.docTitre = $scope.docTitreBefore;
                                                                                localStorage.setItem('lockOperationDropBox', true);
                                                                            }
                                                                            else {
                                                                                $window.location.href = urlDropbox;
                                                                            }
                                                                        }
                                                                        $scope.loader = false;
                                                                    } else {
                                                                        $scope.loader = false;
                                                                        $scope.msgErrorModal = errorMsg2;
                                                                        $scope.errorMsg = true;
                                                                        $('#save-modal').modal('show');
                                                                    }
                                                                });
                                                            } else {
                                                                localStorage.setItem('lockOperationDropBox', false);
                                                                $scope.loader = false;
                                                                $scope.msgErrorModal = errorMsg2;
                                                                $scope.errorMsg = true;
                                                                $('#save-modal').modal('show');
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                localStorage.setItem('lockOperationDropBox', false);
                                                $scope.loader = false;
                                                $scope.msgErrorModal = errorMsg3;
                                                $scope.errorMsg = true;
                                                $('#save-modal').modal('show');
                                            }
                                        });

                                    });
                                }
                            });
                        });

                    }
                });


            } else {
                localStorage.setItem('lockOperationDropBox', false);
                if (apercu === true) {
                    localStorage.setItem('lockOperationDropBox', true);
                }
                $scope.loader = false;
                $scope.msgErrorModal = errorMsg1;
                $scope.errorMsg = true;
                $('#save-modal').modal('show');
            }
        };

        /**
          * Déclenche le modal d'ouverture de document
          * @method  $scopeouvrirDoc
          */
        $scope.ouvrirDoc = function () {
            $('#addDocumentModal').modal('show');
        };


        /**
          * Test la véracité d'un lien (en vérifiant la présence du protocole http dans la String)
          * @method  $scope.verifyLink
         * @param String link
         * @return Boolean
          */
        $scope.verifyLink = function (link) {
            if (link && ((link.indexOf('https') > -1) || (link.indexOf('http') > -1))) {
                return true;
            }
            return false;
        };

        /**
          * Vérification des données de la popup d'ouverture d'un document
         *     Gestion des messages d'erreurs à travers $scope.errorMsg
          * @method  $scope.ajouterDocument
          */
        $scope.ajouterDocument = function () {
            if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length <= 0) {
                $scope.errorMsg = 'Le titre est obligatoire !';
                return;
            }
            if (!$scope.doc || !$scope.doc.titre || $scope.doc.titre.length > 201) {
                $scope.errorMsg = 'Le titre est trop long !';
                return;
            }
            if (!serviceCheck.checkName($scope.doc.titre)) {
                $scope.errorMsg = 'Veuillez ne pas utiliser les caractères spéciaux.';
                return;
            }
            var foundDoc = false;
            var searchApercu = dropbox.search('_' + $scope.doc.titre + '_', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            searchApercu.then(function (result) {
                for (var i = 0; i < result.length; i++) {
                    if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.doc.titre + '_') > 0) {
                        foundDoc = true;
                        $scope.modalToWorkspace = false;
                        break;
                    }
                }
                if (foundDoc) {
                    $scope.errorMsg = 'Le document existe déja dans Dropbox';
                } else {
                    if ((!$scope.doc.lienPdf && $scope.files.length <= 0) || (($scope.doc.lienPdf && /\S/.test($scope.doc.lienPdf)) && $scope.files.length > 0)) {
                        $scope.errorMsg = 'Veuillez saisir un lien ou uploader un fichier !';
                        return;
                    }
                    if ($scope.doc.lienPdf && !$scope.verifyLink($scope.doc.lienPdf)) {
                        $scope.errorMsg = 'Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
                        return;
                    }
                    $scope.modalToWorkspace = true;
                    $('#addDocumentModal').modal('hide');
                }
            });
        };

        /**
          * Récupération du contenu html d'un epub
          * @method $scope.getEpub
          * @return {String} html
          */
        $scope.getEpubLink = function () {
            var epubLink = $rootScope.uploadDoc.lienPdf;
            if (epubLink.indexOf('https://www.dropbox.com') > -1) {
                epubLink = epubLink.replace('https://www.dropbox.com/', 'https://dl.dropboxusercontent.com/');
            }
            $http.post(configuration.URL_REQUEST + '/externalEpub', {
                id: $rootScope.currentUser.local.token,
                lien: epubLink
            }).success(function (data) {

                var epubContent = angular.fromJson(data);

                if (epubContent.html.length > 1) {

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
                            var html = tabHtml.join('');
                            CKEDITOR.instances.editorAdd.setData(html);
                        }
                    };

                    makeHtml(0, epubContent.html.length);
                }
                else {
                    var resultHtml = atob(epubContent.html[0].dataHtml);
                    var promiseClean = htmlEpubTool.cleanHTML(resultHtml);

                    promiseClean.then(function (resultClean) {
                        for (var j in epubContent.img) {
                            if (resultClean.indexOf(epubContent.img[j].link)) {
                                resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                            }
                        }
                        CKEDITOR.instances.editorAdd.setData(resultClean);
                    });
                }

                $('.loader_cover').hide();
                $scope.showloaderProgress = false;


            }).error(function () {
                $scope.errorMsg = 'Erreur lors du telechargement de votre epub.';
            });
        };

        /**
          * Déclenché lors de l'ouverture d'un document
         *     Débranche sur l'interface de structuration dans le cas d'un pdf ou d'une image
         *     Dans le cas d'un lien html, insère le contenu dans l'éditeur
          */
        $('#addDocumentModal').on('hidden.bs.modal', function () {
            if ($scope.modalToWorkspace) {

                $scope.docTitre = $scope.doc.titre;

                $rootScope.uploadDoc = $scope.doc;
                $scope.doc = {};

                //Présence d'un fichier avec parcourir
                if ($scope.files.length > 0) {
                    $rootScope.uploadDoc.uploadPdf = $scope.files;

                    if ($scope.escapeTest) {
                        if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/pdf' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/jpeg' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/png' || $rootScope.uploadDoc.uploadPdf[0].type === 'image/jpg') {
                            localStorage.setItem('lockOperationDropBox', false);
                            $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';
                        }
                        else if ($rootScope.uploadDoc.uploadPdf[0].type === 'application/epub+zip' || ($rootScope.uploadDoc.uploadPdf[0].type === '' && $rootScope.uploadDoc.uploadPdf[0].name.indexOf('.epub'))) {
                            $scope.uploadFile();
                        }
                        else {
                            $scope.errorMsg = 'Le type de fichier n\'est pas supporté. Merci de ne rattacher que des fichiers PDF, des ePub  ou des images.';
                        }
                    }
                }

                //Gestion d'un lien
                else {
                    if ($scope.escapeTest) {

                        if ($rootScope.uploadDoc.lienPdf.indexOf('.epub') > -1) {
                            $scope.getEpubLink();
                        }
                        if ($rootScope.uploadDoc.lienPdf.indexOf('.pdf') > -1) {
                            $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'workspace';

                        }
                        else {
                            //Récupération du contenu du body du lien par les services
                            var promiseHtml = serviceCheck.htmlPreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                            promiseHtml.then(function (resultHtml) {
                                var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                                promiseClean.then(function (resultClean) {

                                    //Insertion dans l'éditeur
                                    CKEDITOR.instances.editorAdd.setData(resultClean);

                                });
                            });
                        }
                    }

                }
            } else {
                $scope.doc = {};
                $scope.files = [];
                $('#docUploadPdf').val('');
                $scope.errorMsg = null;
            }
        });

        /**
          * Gestion de l'ajout d'un fichier via 'parcourir'
         * @method $scope.setFiles
          */
        $scope.setFiles = function (element) {
            $scope.files = [];
            var field_txt = '';
            $scope.$apply(function () {
                    for (var i = 0; i < element.files.length; i++) {
                        if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
                            if (element.files[i].type === '' && element.files[i].name.indexOf('.epub') > -1) {
                                $scope.files.push(element.files[i]);
                                field_txt += ' ' + element.files[i].name;
                                $scope.errorMsg = null;
                                $('#filename_show').val(field_txt);
                            } else if (element.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.files[i].type === 'application/msword' || element.files[i].type === 'application/vnd.oasis.opendocument.text' || element.files[i].type === 'text/plain') {
                                $scope.errorMsg = 'Les documents de ce type doivent être insérés en effectuant un copier/coller du contenu.';
                                $scope.files = [];
                                break;
                            } else {
                                $scope.errorMsg = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
                                $scope.files = [];
                                break;
                            }
                        } else {
                            if (element.files[i].type == 'image/jpeg' || element.files[i].type == 'image/png' || element.files[i].type == 'image/jpg') { // jshint ignore:line
                                $rootScope.imgFile = true;
                            } else {
                                $rootScope.imgFile = false;
                            }
                            $scope.files.push(element.files[i]);
                            field_txt += ' ' + element.files[i].name;
                            $scope.errorMsg = null;
                            $('#filename_show').val(field_txt);
                        }
                    }
                }
            )
            ;
        };


        /**
          * Réinitialise le champ parcourir
          */
        $scope.clearUploadPdf = function () {
            $scope.files = [];
            $('#docUploadPdf').val('');
            $('#filename_show').val('');
        };


        /**
          * Traitement suite à l'upload de l'epub par le serveur
          * @method $scope.uploadComplete
          * @param evt
          */
        $scope.uploadComplete = function (evt) {

            var serverResp = angular.fromJson(evt.target.responseText);

            $scope.files = [];
            $scope.loaderProgress = 100;
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
                        var tmpa = dropbox.search($scope.filePreview, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                        tmpa.then(function (result) {
                            var foundDoc = false;
                            $scope.fichierSimilaire = [];
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].path.indexOf('.html') && result[i].path.indexOf($scope.filePreview)) {
                                    $scope.fichierSimilaire.push(result[i]);
                                    foundDoc = true;
                                }
                            }
                            if (foundDoc) {
                                // here user choices
                                $scope.openApercu();
                            } else {
                                if ($scope.serviceUpload === '/fileupload') {
                                    if ($rootScope.imgFile) {
                                        var imgArray = JSON.parse(evt.target.responseText);
                                        if (imgArray.map) {
                                            $scope.recurciveIMG(imgArray, 0);
                                        } else {
                                            $scope.singleImg(evt.target.responseText);
                                        }
                                    } else {
                                        var pdf = $scope.base64ToUint8Array(angular.fromJson(evt.target.responseText));
                                        PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
                                            $scope.pdfDoc = _pdfDoc;
                                            $scope.loader = false;
                                            $scope.pdflinkTaped = '';
                                            $scope.addSide();
                                        });
                                    }
                                } else {
                                    var epubContent = angular.fromJson(evt.target.responseText);
                                    if (epubContent.html.length > 1) {

                                        //Fonction récursive pour concaténer les différentes pages HTML
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
                                                var html = tabHtml.join('');
                                                CKEDITOR.instances.editorAdd.setData(html);
                                            }
                                        };

                                        makeHtml(0, epubContent.html.length);
                                    }
                                    else {
                                        var resultHtml = atob(epubContent.html[0].dataHtml);
                                        var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                                        promiseClean.then(function (resultClean) {
                                            for (var j in epubContent.img) {
                                                if (resultClean.indexOf(epubContent.img[j].link)) {
                                                    resultClean = resultClean.replace(new RegExp('src=\"' + epubContent.img[j].link + '\"', 'g'), 'src=\"data:image/png;base64,' + epubContent.img[j].data + '\"');
                                                }
                                            }
                                            CKEDITOR.instances.editorAdd.setData(resultClean);
                                        });
                                    }

                                    $('.loader_cover').hide();
                                    $scope.showloaderProgress = false;
                                }
                            }
                        });
                    }
                });
            }

        };

        /**
          * Traitement suite à l'envoi du formulaire d'upload
          * @method $scope.uploadFile
          */
        $scope.uploadFile = function () {
            if ($scope.files.length > 0) {
                $('.loader_cover').show();
                $scope.showloaderProgress = true;
                $scope.loaderProgress = 0;
                var fd = new FormData();
                for (var i in $scope.files) {
                    fd.append('uploadedFile', $scope.files[i]);
                    if ($scope.files[i].type === 'application/epub+zip') {
                        $scope.serviceUpload = '/epubUpload';
                        $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
                    } else {
                        if ($scope.files[i].type === '' && $scope.files[i].name.indexOf('.epub')) {
                            $scope.serviceUpload = '/epubUpload';
                            $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
                        } else if ($scope.files[i].type.indexOf('image/') > -1) {
                            $scope.serviceUpload = '/fileupload';
                            $scope.loaderMessage = 'Chargement de votre/vos image(s) en cours. Veuillez patienter ';
                        } else {
                            $scope.serviceUpload = '/fileupload';
                            $scope.loaderMessage = 'Chargement de votre document PDF en cours. Veuillez patienter ';
                        }
                    }
                }
                var xhr = new XMLHttpRequest();
                if ($scope.skipCheking) {
                    xhr.addEventListener('load', $scope.uploadNewDoc, false);
                } else {
                    xhr.addEventListener('load', $scope.uploadComplete, false);

                }
                xhr.addEventListener('error', $scope.uploadFailed, false);
                xhr.addEventListener('progress', $scope.updateProgress, false);
                xhr.open('POST', configuration.URL_REQUEST + $scope.serviceUpload + '?id=' + localStorage.getItem('compteId'));
                $scope.progressVisible = true;
                xhr.send(fd);
                $scope.loader = true;
            } else {
                $scope.errorMsg = 'Vous devez choisir un fichier.';
            }

        };


        /**
          * Ouverture de l'apercu
         * Déclenché dans le cas de l'ouverture d'un document déjà existant
          * @method $scope.openApercu
          */
        $scope.openApercu = function () {
            if ($scope.fichierSimilaire && $scope.fichierSimilaire.length > 0 && $rootScope.currentUser && $rootScope.currentUser.dropbox.accessToken) {

                var i = 0;
                while ($scope.fichierSimilaire[i].path.indexOf('.html') < 0) {
                    i++;
                }
                if ($scope.fichierSimilaire[i].path.indexOf('.html') > -1) {
                    var previewDocument = dropbox.shareLink($scope.fichierSimilaire[i].path, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    previewDocument.then(function (data) {

                        localStorage.setItem('lockOperationDropBox', false);
                        window.location.href = data.url + '#/apercu';
                    });
                }

            }

        };


        /**
          * Gestion des loader et des vérifications
          */

        if ($location.absUrl().indexOf('pdfUrl=') > -1) {
            $rootScope.uploadDoc = {};
            $rootScope.uploadDoc.lienPdf = $location.absUrl().substring($location.absUrl().indexOf('pdfUrl=') + 7, $location.absUrl().length);
            while ($rootScope.uploadDoc.lienPdf.indexOf('%2F') > -1) {
                $rootScope.uploadDoc.lienPdf = $rootScope.uploadDoc.lienPdf.replace('%2F', '/');
            }
        }

        if ($rootScope.uploadDoc && localStorage.getItem('compteId')) {
            $scope.blocks = {
                children: []
            };
            $scope.docTitre = $rootScope.uploadDoc.titre;
            $scope.RestructurerName = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.uploadDoc.titre));

            var gettingUser = serviceCheck.getData();
            gettingUser.then(function (result) {
                if (result.loged) {
                    $rootScope.currentUser = result.user;
                    if ($rootScope.uploadDoc.lienPdf && $rootScope.currentUser && $rootScope.uploadDoc.lienPdf.indexOf('.pdf') > -1) {
                        if ($rootScope.indexLoader) {
                            $('.loader_cover').hide();
                            $scope.showloaderProgress = false;
                        } else {
                            $('.loader_cover').show();
                            $scope.showloaderProgress = true;
                        }
                        $scope.loaderMessage = 'Vérification si le document a déjà été structuré. Veuillez patienter ';
                        $scope.loaderProgress = 0;
                        var tmpa = serviceCheck.filePreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                        tmpa.then(function (result) {
                            if (result.erreurIntern) {
                                $('#myModalWorkSpace').modal('show');
                            } else {
                                if (result.existeDeja) {
                                    $scope.documentSignature = result.documentSignature;
                                    $scope.fichierSimilaire = result.found;
                                    $scope.openApercu();
                                } else {
                                    $scope.filePreview = result.documentSignature;
                                    $scope.pdflinkTaped = $rootScope.uploadDoc.lienPdf;
                                    $scope.loadPdfLink();
                                }
                            }
                        });

                    } else if ($rootScope.uploadDoc.lienPdf && $rootScope.currentUser && $rootScope.uploadDoc.lienPdf.indexOf('.epub') > -1) {
                        if ($rootScope.indexLoader) {
                            $('.loader_cover').hide();
                            $scope.showloaderProgress = false;
                        } else {
                            $('.loader_cover').show();
                            $scope.showloaderProgress = true;
                        }
                        $scope.loaderProgress = 0;
                        $scope.loaderMessage = 'Vérification si le document ePub a déjà été structuré. Veuillez patienter ';

                        var tmpa = serviceCheck.filePreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken); // jshint ignore:line
                        tmpa.then(function (result) {
                            if (result.erreurIntern) {
                                $('#myModalWorkSpace').modal('show');
                            } else {
                                if (result.existeDeja) {
                                    $scope.documentSignature = result.documentSignature;
                                    $scope.fichierSimilaire = result.found;
                                    $scope.loaderProgress = 30;

                                    $scope.openApercu();
                                } else {
                                    $scope.epubLink($rootScope.uploadDoc.lienPdf);
                                    $scope.documentSignature = result.cryptedSign;
                                    $scope.filePreview = result.cryptedSign;
                                }
                            }
                        });


                    } else if ($rootScope.uploadDoc && $rootScope.uploadDoc.lienPdf && $rootScope.uploadDoc.lienPdf.indexOf('.pdf') === -1) {
                        if ($rootScope.indexLoader) {
                            $('.loader_cover').hide();
                            $scope.showloaderProgress = false;
                        } else {
                            $('.loader_cover').show();
                            $scope.showloaderProgress = true;
                        }
                        $scope.loaderProgress = 0;
                        $scope.loaderMessage = 'Vérification si le document HTML a déjà été structuré. Veuillez patienter ';
                        var promiseHtml = serviceCheck.htmlPreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                        promiseHtml.then(function (resultHtml) {
                            var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                            promiseClean.then(function (resultClean) {
                                $scope.fichierSimilaire = [];

                                var htmlsign = serviceCheck.htmlReelPreview($rootScope.uploadDoc.lienPdf);
                                htmlsign.then(function (htmlplPreview) {
                                    if (htmlplPreview.sign) {
                                        $scope.filePreview = htmlplPreview.sign;
                                        var tmpa = dropbox.search($scope.filePreview, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                        tmpa.then(function (result) {
                                            var foundDoc = false;
                                            for (var i = 0; i < result.length; i++) {
                                                if (result[i].path.indexOf('.html') > -1 && result[i].path.indexOf($scope.filePreview)) {
                                                    $scope.fichierSimilaire.push(result[i]);
                                                    foundDoc = true;
                                                }
                                            }
                                            if (foundDoc) {
                                                $scope.openApercu();
                                            } else {
                                                $scope.loaderMessage = 'Chargement et structuration de votre page HTML en cours. Veuillez patienter ';
                                                var promiseImg = serviceCheck.htmlImage($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                                                promiseImg.then(function (resultImg) {
                                                    if (resultImg.htmlImages && resultImg.htmlImages.length > 0) {
                                                        $scope.Imgs = resultImg.htmlImages;
                                                        $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, $scope.Imgs);
                                                        localStorage.setItem('lockOperationDropBox', true);
                                                    } else {
                                                        $('.loader_cover').hide();
                                                        $scope.showloaderProgress = false;
                                                    }
                                                });
                                                var promiseConvert = htmlEpubTool.convertToCnedObject(resultClean, 'Page HTML', $rootScope.uploadDoc.lienPdf);
                                                promiseConvert.then(function (resultConverted) {
                                                    resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                                                    var blocks = {
                                                        children: [resultConverted]
                                                    };
                                                    $scope.blocks = htmlEpubTool.setImgsIntoCnedObject(blocks, $scope.Imgs);
                                                    localStorage.setItem('lockOperationDropBox', true);
                                                    $scope.loader = false;
                                                });
                                            }
                                        });
                                    } else if (htmlSignResult.erreurIntern) {
                                        $('#myModalWorkSpace').modal('show');
                                    }
                                });
                            });
                        });
                    } else if ($rootScope.uploadDoc.uploadPdf && $rootScope.uploadDoc.uploadPdf.length > 0) {
                        $scope.files = $rootScope.uploadDoc.uploadPdf;
                        $scope.uploadFile();
                    }
                }
            });
        } else {
            if (localStorage.getItem('bookmarkletDoc') && localStorage.getItem('compteId')) {
                $rootScope.uploadDoc = {};
                $rootScope.uploadDoc.lienPdf = localStorage.getItem('bookmarkletDoc');
                localStorage.removeItem('bookmarkletDoc');
                $scope.blocks = {
                    children: []
                };
                $scope.docTitre = $rootScope.uploadDoc.titre;
                $scope.docTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
                if ($rootScope.uploadDoc.lienPdf) {
                    $scope.pdflinkTaped = $rootScope.uploadDoc.lienPdf;
                    $scope.loadPdfLink();
                } else if ($rootScope.uploadDoc.uploadPdf && $rootScope.uploadDoc.uploadPdf.length > 0) {
                    $scope.files = $rootScope.uploadDoc.uploadPdf;
                    $scope.uploadFile();
                }
            }
        }


    }
)
;