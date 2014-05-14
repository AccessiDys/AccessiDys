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
/*global $:false */
/* jshint undef: true, unused: true */
/* global PDFJS ,Promise, CKEDITOR ,CryptoJS  */

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location, $compile, _, removeAccents, removeHtmlTags, $window, configuration, $sce, generateUniqueId, serviceCheck, dropbox) {

    $rootScope.Document = true;
    // Zones a découper
    $scope.zones = [];
    // Loader afficher/enlever manipulation
    $scope.loader = false;
    // Image courante dans l'espace de travail
    $scope.currentImage = {};
    // Liste générale des blocks
    $scope.blocks = {
        children: []
    };
    // text océrisé
    $scope.textes = {};
    // paramétre d'affichage de l'éditor
    $scope.showEditor = false;
    // Liste des fichiers a uploader
    $scope.files = [];
    // Garder l'ID du docuument enregistre
    $rootScope.idDocument = [];
    // Liste des tags
    $scope.listTags = [];
    // Initialisation liste profils
    $scope.listProfils = [];

    $scope.flagUint8Array = false;

    $scope.docTitre = '';
    $scope.editBlocks = false;
    $scope.showSynthese = false;

    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').show();
    $('#titreAdmin').hide();
    $('#titreListDocument').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();

    $scope.requestToSend = {};
    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }

    $scope.initImage = function() {

        console.log('initImage ===>');
        var tmp = serviceCheck.getData();
        tmp.then(function(result) { // this is only run after $http completes
            if (result.loged) {
                $('#imagePageHidden').show();
                if (result.dropboxWarning === false) {
                    $rootScope.dropboxWarning = false;
                    $scope.missingDropbox = false;
                    $rootScope.loged = true;
                    $rootScope.admin = result.admin;
                    $rootScope.apply; // jshint ignore:line
                    if ($location.path() !== '/inscriptionContinue') {
                        $location.path('/inscriptionContinue');
                    }
                } else {
                    $rootScope.loged = true;
                    $rootScope.admin = result.admin;
                    $rootScope.currentUser = result.user;
                    $rootScope.apply; // jshint ignore:line
                }
            } else {
                var lien = window.location.href;
                // var verif = false;
                if ((lien.indexOf('https://dl.dropboxusercontent.com') > -1)) {
                    console.log('lien dropbox');
                } else {
                    if ($location.path() !== '/') {
                        $location.path('/');
                    }
                }

            }
        });
    };
    /* Ajout nouveaux blocks */
    $scope.toggleMinimized = function(child) {
        child.minimized = !child.minimized;
    };

    /* Mettre à jour la structure des Blocks apres un Drag && Drop */
    $scope.updateDragDrop = function(event, ui) {
        var root = event.target,
            item = ui.item,
            parent = item.parent(),
            target = (parent[0] === root) ? $scope.blocks : parent.scope().child,
            child = item.scope().child,
            index = item.index();

        if (!target.children) {
            target.children = [];
        }

        // target.children || (target.children = []);

        function walk(target, child) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {

                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i], child);
                    }
                }
            }
        }
        walk($scope.blocks, child);
        target.children.splice(index, 0, child);
    };

    $scope.remove = function(child) {
        function walk(target) {
            var children = target.children,
                i;
            if (children) {
                i = children.length;
                while (i--) {
                    if (children[i] === child) {
                        return children.splice(i, 1);
                    } else {
                        walk(children[i]);
                    }
                }
            }
        }
        walk($scope.blocks);
        $scope.textes = {};
        $scope.showEditor = false;
        $scope.currentImage = {};

        $('.workspace_tools').hide();
    };

    function traverse(obj, cropedImages) {
        for (var key in obj) {
            if (typeof(obj[key]) === 'object') {
                if ($scope.currentImage.source === obj[key].source) {
                    for (var j = 0; j < $scope.cropedImages.length; j++) {
                        obj[key].children.push({
                            id: cropedImages[j].id,
                            text: cropedImages[j].text,
                            source: cropedImages[j].source,
                            children: []
                        });
                    }
                }
                traverse(obj[key], cropedImages);
            }
        }
    }

    function traverseOcrSpeech(obj) {
        for (var key in obj) {
            if (typeof(obj[key]) === 'object') {
                if ($scope.currentImage.source === obj[key].source) {
                    obj[key].text = $scope.currentImage.text;
                    obj[key].synthese = $scope.currentImage.synthese;
                    obj[key].tag = $scope.currentImage.tag;
                    break;
                }
                traverseOcrSpeech(obj[key]);
            }
        }
    }

    $scope.selected = function(x) {
        // Ajouter les dimentions sélectionnés a la table des zones
        x._id = Math.random();
        $scope.zones.push(x);
        // Enlever la selection
        $rootScope.$emit('releaseCrop');
        $scope.sendCrop(x);
    };

    $scope.removeZone = function(idZone) {
        for (var i = 0; i < $scope.zones.length; i++) {
            if ($scope.zones[i]._id === idZone) {
                $scope.zones.splice(i, 1);
            }
        }
    };

    /*Envoi des zones pour le découpage*/
    $scope.sendCrop = function(zone) {

        if ($scope.zones.length < 1) {
            alert('Aucune zone n\'est encore sélectionnéz ... ');
        }

        // Initialiser la table des image découpés
        $scope.cropedImages = [];

        // afficher le loader
        $scope.loader = true;

        // Refactoring
        // angular.forEach($scope.zones, function(zone) {

        angular.element($('#canvas').remove());
        angular.element($('body').append('<canvas id="canvas" width="' + zone.w + '" height="' + zone.h + '"></canvas>'));
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        // draw cropped image
        var sourceX = zone.x;
        var sourceY = zone.y;
        var sourceWidth = zone.w;
        var sourceHeight = zone.h;
        var destWidth = sourceWidth;
        var destHeight = sourceHeight;
        var destX = 0;
        var destY = 0;

        var imageObj = new Image();
        imageObj.src = $scope.currentImage.originalSource;
        context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);

        var dataURL = canvas.toDataURL('image/png');

        var imageTreated = {};
        imageTreated.id = generateUniqueId();
        imageTreated.source = dataURL;
        imageTreated.text = '';
        imageTreated.level = Number($scope.currentImage.level + 1);
        imageTreated.children = [];
        $scope.cropedImages.push(imageTreated);

        // });

        // Enlever le loader
        $scope.loader = false;
        // Initialiser les zones
        initialiseZones();
        // Détecter le parent des blocks et ajouter les images découpés a ce block
        traverse($scope.blocks, $scope.cropedImages);

    };

    // Initialiser la liste des zones

    function initialiseZones() {
        $scope.zones = [];
    }


    // Appliquer l'océrisation
    $scope.oceriser = function() {

        $('.workspace_tools').hide();
        $('.audio_synth').fadeIn();
        $scope.showSynthese = false;

        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            initialiseZones();
            $scope.loader = true;
            $http.post(configuration.URL_REQUEST + '/oceriser', {
                id: localStorage.getItem('compteId'),
                encodedImg: $scope.currentImage.originalSource
            }).success(function(data) {

                var textOcerided = angular.fromJson(data);
                textOcerided = textOcerided.replace(/\n/g, '');
                textOcerided = textOcerided.replace(/</g, '&lt;');
                textOcerided = textOcerided.replace(/>/g, '&gt;');

                // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
                $scope.textes = {
                    source: $scope.currentImage.source,
                    text: textOcerided
                };

                console.log('images ====>');
                console.log(textOcerided);

                $scope.currentImage.text = textOcerided;

                // Affichage de l'éditeur
                $scope.showEditor = true;
                $scope.loader = false;
                $scope.msg = 'ok';
            }).error(function() {
                $scope.msg = 'ko';
            });
        } else {
            alert('Vous devez selectionner un block ... ');
        }

    };

    $scope.afficherTexte = function() {
        console.log('afficher texte ==>');
        console.log($scope.currentImage.text);

        if ($scope.currentImage.text.indexOf('data-font') >= 0) {
            var tmpText = $scope.currentImage.text;
            tmpText = tmpText.substring(tmpText.indexOf('>') + 1, tmpText.lastIndexOf('</p>'));
            console.log('OKII2 apres');
            console.log(tmpText);
            $scope.currentImage.text = tmpText;
        }

        $scope.textes = {
            text: $scope.currentImage.text
        };
        $scope.showEditor = true;
    };

    $scope.modifierTexte = function() {
        if ($scope.currentImage.ocrOk) {

            $scope.afficherTexte();
            $('.workspace_tools').hide();
            // $('.text_setting').fadeIn();
            $('.audio_synth').fadeIn();
            var tagToShow = _.where($scope.listTags, {
                _id: $scope.tagSelected
            });
            $('#select-tag + .customSelect .customSelectInner').text(tagToShow[0].libelle);

        } else {
            $scope.oceriser();
            if ($scope.currentImage.source) {

                $scope.afficherTexte();
                $scope.currentImage.ocrOk = true;
            } else {
                alert('Vous devez selectionner un block ... ');
            }

        }


    };

    $scope.textToSpeech = function() {
        // $('.workspace_tools').hide();
        // $('.audio_reader').fadeIn();
        $scope.showSynthese = true;

        var ocrText = removeAccents(removeHtmlTags($scope.currentImage.text));
        $scope.currentImage.text = ocrText;
        if ($scope.currentImage.text) {
            $scope.loader = true;
            if ($scope.currentImage.text.length > 0) {
                $http.post(configuration.URL_REQUEST + '/texttospeech', {
                    text: $scope.currentImage.text,
                    id: localStorage.getItem('compteId')
                }).success(function(data) {
                    $scope.currentImage.synthese = 'data:audio/mpeg;base64,' + angular.fromJson(data);
                    traverseOcrSpeech($scope.blocks);
                    $scope.loader = false;
                    return false;
                }).error(function() {
                    console.log('ko');
                });
            } else {
                alert('Pas de texte enregistré pour ce block');
            }
        } else {
            alert('Pas de texte enregistré pour ce block');
        }

    };

    $scope.ocerised = function(param) {
        if (param && param.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    $scope.vocalised = function(param) {
        if (param && param.length > 0) {
            return true;
        } else {
            return false;
        }
    };

    /* WYSIWYG Editor Methods */
    /* Get OCR and save it */
    $scope.getOcrText = function() {
        $rootScope.$emit('getCkEditorValue');
        $scope.currentImage.text = $rootScope.ckEditorValue; //removeHtmlTags($rootScope.ckEditorValue);
        // console.log('ckEditorValue ===>');
        // console.log($rootScope.ckEditorValue);
        traverseOcrSpeech($scope.blocks);
        // $scope.textes = {};
        // Affichage de l'éditeur
        // $scope.showEditor = false;
        //This line is made to show ocr icon on the bloc
    };

    /* change CKEDITOR */
    $scope.initCkEditorChange = function() {
        CKEDITOR.instances.editorOcr.on('change', function() {
            $scope.getOcrText();
        });
    };

    // Export Image to workspace
    $scope.workspace = function(image) {
        $scope.currentImage = image;
        if ($scope.currentImage.originalSource && $scope.currentImage.originalSource !== '') {
            $scope.currentImage.source = $scope.currentImage.originalSource;
        } else {
            $scope.currentImage.originalSource = $scope.currentImage.source;
        }
        $('.workspace_tools').hide();
        $('.text_setting').fadeIn();
        $scope.currentImage.source = $sce.trustAsResourceUrl($scope.currentImage.source);
        initialiseZones();
        $scope.textes = {};
        $scope.showEditor = false;
        $scope.showSynthese = false;
        if (image.tag) {
            $scope.tagSelected = image.tag;
        } else {
            $scope.tagSelected = null;
        }
        $('#select-tag + .customSelect .customSelectInner').text('');
        $('.parent-container-images').animate({
            scrollTop: 0
        }, 'slow');
    };

    $scope.permitSaveblocks = function() {
        if ($scope.blocks.children.length < 1) {
            // alert("il n y a pas encore de choses a enregistrer");
            return true;
        } else {
            return false;
        }
    };

    // $scope.saveblocks = function() {
    //     // Selection des profils
    //     $http.get(configuration.URL_REQUEST + '/listerProfil')
    //         .success(function(data) {
    //             if (data !== 'err') {
    //                 $scope.listProfils = data;
    //             }
    //         });
    // };

    $scope.saveRestBlocks = function() {
        $scope.loader = true;
        $scope.msgErrorModal = '';
        var url = configuration.URL_REQUEST + '/index.html';
        var errorMsg2 = 'Erreur lors de l\'enregistrement dans Dropbox';

        if ($rootScope.currentUser.dropbox.accessToken) {
            var token = $rootScope.currentUser.dropbox.accessToken;

            var apercuName = encodeURIComponent($rootScope.docTitre) + '.html';
            var manifestName = encodeURIComponent($rootScope.docTitre) + '.appcache';
            var listDocumentDropbox = configuration.CATALOGUE_NAME;
            var listDocumentManifest = 'listDocument.appcache';
            console.log('OKI access');

            $http.get(url).then(function(response) {
                response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                if (response.data.length > 0) {
                    console.log('OKI get index.html');

                    var downloadManifest = dropbox.download(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                    downloadManifest.then(function(result) {
                        var newVersion = parseInt(result.charAt(29)) + 1;
                        result = result.replace(':v' + result.charAt(29), ':v' + newVersion);
                        console.log('OKI download manifest');
                        console.log(result);
                        var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), result, token, configuration.DROPBOX_TYPE);
                        uploadManifest.then(function(result) {
                            if (result) {
                                console.log(manifestName + ' modifié avec succès');
                                var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                shareManifest.then(function(result) {
                                    response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                    response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                    if (result) {
                                        var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), response.data, token, configuration.DROPBOX_TYPE);
                                        uploadApercu.then(function(result) {
                                            if (result) {
                                                console.log('upload apercu OKI');
                                                var newlistDocument = result;
                                                var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                shareApercu.then(function(result) {
                                                    if (result) {
                                                        $scope.docTitre = '';
                                                        var urlDropbox = result.url + '#/apercu';
                                                        console.log(urlDropbox);
                                                        newlistDocument.lienApercu = result.url + '#/apercu';

                                                        var downloadDoc = dropbox.download(($scope.listDocumentDropbox || listDocumentDropbox), token, configuration.DROPBOX_TYPE);
                                                        downloadDoc.then(function(result) {
                                                            var debut = result.indexOf('var listDocument') + 18;
                                                            var fin = result.indexOf(']', debut) + 1;
                                                            var arraylistDocument = angular.fromJson(result.substring(debut, fin));

                                                            for (var i = 0; i < arraylistDocument.length; i++) {
                                                                if (arraylistDocument[i].path === ('/' + apercuName)) {
                                                                    arraylistDocument[i] = newlistDocument;
                                                                    arraylistDocument[i].lienApercu = urlDropbox;
                                                                    console.log(arraylistDocument[i]);
                                                                    break;
                                                                }
                                                            }

                                                            // if (arraylistDocument.length <= 0) {
                                                            //     arraylistDocument[0] = newlistDocument;
                                                            //     arraylistDocument[0].lienApercu = urlDropbox;
                                                            // }

                                                            result = result.replace(result.substring(debut, fin), '[]');
                                                            result = result.replace('listDocument= []', 'listDocument= ' + angular.toJson(arraylistDocument));
                                                            var uploadDoc = dropbox.upload(($scope.listDocumentDropbox || listDocumentDropbox), result, token, configuration.DROPBOX_TYPE);
                                                            uploadDoc.then(function() {
                                                                var downloadManifest = dropbox.download(($scope.listDocumentManifest || listDocumentManifest), token, configuration.DROPBOX_TYPE);
                                                                downloadManifest.then(function(dataFromDownload) {
                                                                    var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                                                    dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                                                    var uploadManifest = dropbox.upload(($scope.listDocumentManifest || listDocumentManifest), dataFromDownload, token, configuration.DROPBOX_TYPE);
                                                                    uploadManifest.then(function() {
                                                                        console.log('manifest mis à jour');
                                                                        if (result) {
                                                                            if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                                urlDropbox += '?key=' + $rootScope.currentUser._id;
                                                                            }
                                                                            $window.location.href = urlDropbox;
                                                                        }
                                                                        $scope.loader = false;
                                                                    });

                                                                });
                                                            });
                                                        });

                                                    } else {
                                                        $scope.loader = false;
                                                        $scope.msgErrorModal = errorMsg2;
                                                        $('#actions-workspace').modal('show');
                                                    }
                                                });
                                            } else {
                                                $scope.loader = false;
                                                $scope.msgErrorModal = errorMsg2;
                                                $('#actions-workspace').modal('show');
                                            }
                                        });
                                    }
                                });
                            }

                        });
                    });

                }
            });

        }
    };


    $scope.showlocks = function() {
        console.log('show blocks clicked ... ');
        $scope.loader = true;
        $scope.msgErrorModal = '';
        var url = configuration.URL_REQUEST + '/index.html';
        var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer sur Dropbox';
        var errorMsg2 = 'Erreur lors de l\'enregistrement dans Dropbox';
        var errorMsg3 = 'Erreur lors du partage dans Dropbox';
        var errorMsg4 = 'Le document existe déja dans Dropbox';
        //var confirmMsg = 'Fichier enregistré dans Dropbox avec succès';

        if ($rootScope.currentUser.dropbox.accessToken) {
            var token = $rootScope.currentUser.dropbox.accessToken;
            var apercuName = $scope.docTitre + '.html';
            var manifestName = $scope.docTitre + '.appcache';
            var listDocumentDropbox = configuration.CATALOGUE_NAME;
            var listDocumentManifest = 'listDocument.appcache';

            if (!serviceCheck.checkName($scope.docTitre)) {
                $scope.loader = false;
                $scope.msgErrorModal = 'Veuillez n\'utiliser que des lettres (de a à z) et des chiffres.';
                return;
            }

            $('#actions-workspace').modal('hide');
            var searchApercu = dropbox.search('_' + $scope.docTitre + '_', token, configuration.DROPBOX_TYPE);
            searchApercu.then(function(result) {
                if (result && result.length > 0) {
                    $scope.loader = false;
                    $scope.msgErrorModal = errorMsg4;
                    $('#actions-workspace').modal('show');
                } else {

                    var ladate = new Date();
                    var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
                    //$scope.filePreview = $scope.filePreview.replace(/\/+/g, '');
                    var apercuName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.html';
                    var manifestName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.appcache';
                    console.log(apercuName);
                    // alert(apercuName);
                    console.log(manifestName);
                    // alert(manifestName);
                    $http.get(url).then(function(response) {
                        response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                        if (response.data.length > 0) {

                            $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(manifestContent) {
                                var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), manifestContent.data, token, configuration.DROPBOX_TYPE);
                                uploadManifest.then(function(result) {
                                    if (result) {
                                        console.log(manifestName + ' enregistré avec succès');
                                        var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                        shareManifest.then(function(result) {
                                            response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                            response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                            if (result) {
                                                var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), response.data, token, configuration.DROPBOX_TYPE);
                                                uploadApercu.then(function(result) {
                                                    if (result) {
                                                        var listDocument = result;
                                                        var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                        shareApercu.then(function(result) {
                                                            if (result) {
                                                                $scope.docTitre = '';
                                                                var urlDropbox = result.url + '#/apercu';
                                                                console.log(urlDropbox);
                                                                listDocument.lienApercu = result.url + '#/apercu';
                                                                //$window.open(urlDropbox);
                                                                //$scope.loader = false;

                                                                var downloadDoc = dropbox.download(($scope.listDocumentDropbox || listDocumentDropbox), token, configuration.DROPBOX_TYPE);
                                                                downloadDoc.then(function(result) {
                                                                    var debut = result.indexOf('var listDocument') + 18;
                                                                    var fin = result.indexOf(']', debut) + 1;
                                                                    var curentListDocument = result.substring(debut + 1, fin - 1);
                                                                    if (curentListDocument.length > 0) {
                                                                        curentListDocument = curentListDocument + ',';
                                                                    }
                                                                    result = result.replace(result.substring(debut, fin), '[]');
                                                                    result = result.replace('listDocument= []', 'listDocument= [' + curentListDocument + angular.toJson(listDocument) + ']');

                                                                    var uploadDoc = dropbox.upload(($scope.listDocumentDropbox || listDocumentDropbox), result, token, configuration.DROPBOX_TYPE);
                                                                    uploadDoc.then(function() {
                                                                        var downloadManifest = dropbox.download(($scope.listDocumentManifest || listDocumentManifest), token, configuration.DROPBOX_TYPE);
                                                                        downloadManifest.then(function(dataFromDownload) {
                                                                            var newVersion = parseInt(dataFromDownload.charAt(29)) + 1;
                                                                            dataFromDownload = dataFromDownload.replace(':v' + dataFromDownload.charAt(29), ':v' + newVersion);
                                                                            var uploadManifest = dropbox.upload(($scope.listDocumentManifest || listDocumentManifest), dataFromDownload, token, configuration.DROPBOX_TYPE);
                                                                            uploadManifest.then(function() {
                                                                                console.log('manifest mis à jour');
                                                                                // var shareDoc = dropbox.shareLink(($scope.listDocumentDropbox || listDocumentDropbox), token, configuration.DROPBOX_TYPE);
                                                                                // shareDoc.then(function(result) {
                                                                                if (result) {

                                                                                    if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                                        urlDropbox += '?key=' + $rootScope.currentUser.local.token;
                                                                                    }
                                                                                    $window.location.href = urlDropbox;
                                                                                }
                                                                                $scope.loader = false;
                                                                                //  });
                                                                            });

                                                                        });
                                                                    });
                                                                });

                                                                //alert(confirmMsg);
                                                                //$window.location.href = '/#/listDocument';
                                                            } else {
                                                                $scope.loader = false;
                                                                $scope.msgErrorModal = errorMsg2;
                                                                $('#actions-workspace').modal('show');
                                                            }
                                                        });
                                                    } else {
                                                        $scope.loader = false;
                                                        $scope.msgErrorModal = errorMsg2;
                                                        $('#actions-workspace').modal('show');
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.log('erreur lors de l\'enregistrement de ' + manifestName);
                                        $scope.loader = false;
                                        $scope.msgErrorModal = errorMsg3;
                                        $('#actions-workspace').modal('show');
                                    }
                                });

                            });
                        }
                    });

                }
            });

        } else {
            $scope.loader = false;
            $scope.msgErrorModal = errorMsg1;
            $('#actions-workspace').modal('show');
        }
    };

    // Selection des tags
    $scope.afficherTags = function() {
        $http.get(configuration.URL_REQUEST + '/readTags', {
            params: $scope.requestToSend
        })
            .success(function(data) {
                if (data !== 'err') {
                    $scope.listTags = data;
                }
            });
    };

    $scope.afficherTags();

    $scope.updateBlockType = function() {
        $scope.currentImage.tag = $scope.tagSelected;
        traverseOcrSpeech($scope.blocks);
        // Parcour blocks and update with currentImage
    };

    $scope.playSong = function() {
        var audio = document.getElementById('player');
        audio.setAttribute('src', $scope.currentImage.synthese);
        audio.load();
        audio.play();
    };

    $scope.showPlaySong = function() {
        if ($scope.currentImage.synthese) {
            if ($scope.currentImage.synthese !== '') {
                return true;
            }
        }
        return false;
    };
    $scope.verifLink = function(link) {
        if (link) {
            if ((link.indexOf('https') > -1)) {
                if ((link.indexOf('.pdf') > -1)) {
                    return true;
                }
                $scope.messageErreur = ' Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
                return false;
            }
            if ((link.indexOf('http') > -1)) {
                if ((link.indexOf('.pdf') > -1)) {
                    return true;
                }
                $scope.messageErreur = ' Le lien saisi est invalide. Merci de respecter le format suivant : "http://www.example.com/chemin/NomFichier.pdf"';
                return false;
            }
        }
        $scope.messageErreur = ' Veillez indiquer un lien vers le fichier souhaité.';
        return false;
    };

    $('#myModalWorkSpace').on('hidden.bs.modal', function() {
        $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
    });
    $scope.loadPdfLink = function() {
        var lienTrouve = false;
        if (localStorage.getItem('pdfFound')) {
            if ($scope.verifLink(localStorage.getItem('pdfFound'))) {
                $scope.pdflink = localStorage.getItem('pdfFound');
                localStorage.removeItem('pdfFound');
                lienTrouve = true;
                $scope.pdferrLien = false;
            } else {
                $scope.pdferrLien = true;
            }
        } else {
            if ($scope.verifLink($scope.pdflinkTaped)) {
                var localfile = ($scope.pdflinkTaped.indexOf('https://www.dropbox.com') > -1);
                if (localfile === true) {
                    $scope.pdflink = $scope.pdflinkTaped.replace('https://www.dropbox.com/', 'https://dl.dropboxusercontent.com/');
                } else {
                    $scope.pdflink = $scope.pdflinkTaped;
                }
                lienTrouve = true;
                $scope.pdferrLien = false;
            }
        }
        if (lienTrouve) {
            $scope.pdfinfo = true;

            var contains = ($scope.pdflink.indexOf('https') > -1); //true
            if (contains === false) {
                $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
            } else {
                $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
            }
            $scope.showPdfCanvas = true;
            $scope.loader = true;
            $http.post($scope.serviceNode, {
                lien: $scope.pdflink,
                id: localStorage.getItem('compteId')
            }).success(function(data) {
                $scope.filePreview = CryptoJS.SHA256(data.substring(0, 100));
                console.log($scope.filePreview);
                $scope.showPdfCanvas = true;

                var pdf = $scope.base64ToUint8Array(data);
                $scope.flagUint8Array = true;
                // console.log('======>===>');
                // console.log(PDFJS.workerSrc);
                // PDFJS.disableWorker = false;
                // console.log(PDFJS.workerSrc);
                // console.log('======>===>');
                // PDFJS.workerSrc = 'https://localhost:3000/bower_components/pdfjs/pdf.worker.js';

                PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
                    // pdf=[];
                    $scope.pdfDoc = _pdfDoc;
                    $scope.loader = false;
                    $scope.pdflinkTaped = '';
                    $scope.addSide();
                });
            }).error(function() {
                $scope.loader = false;
                $('#myModalWorkSpace').modal('show');
                $scope.pdferrLien = true;
            });
        } else {
            $scope.pdferrLien = true;
        }

    };
    $scope.addSide = function() {
        var i = 1;

        function recurcive() {

            $scope.pdfDoc.getPage(i).then(function(page) {

                $('#canvas').remove();
                $('body').append('<canvas class="hidden" id="canvas" width="790px" height="830px"></canvas>');
                $scope.canvas = document.getElementById('canvas');
                $scope.context = $scope.canvas.getContext('2d');
                $scope.viewport = page.getViewport($scope.canvas.width / page.getViewport(1.0).width); //page.getViewport(1.5);
                $scope.canvas.height = $scope.viewport.height;
                $scope.canvas.width = $scope.viewport.width;
                var renderContext = {
                    canvasContext: $scope.context,
                    viewport: $scope.viewport
                };
                var pageRendering = page.render(renderContext);
                //var completeCallback = pageRendering.internalRenderTask.callback;
                pageRendering.internalRenderTask.callback = function(error) {
                    if (error) {
                        console.log(error);
                    } else {
                        new Promise(function(resolve) {
                            $scope.dataURL = $scope.canvasToImage('#FFFFFF');
                            if ($scope.dataURL) {
                                var imageTreated = {};
                                imageTreated.id = Math.random() * 1000;
                                imageTreated.originalSource = $scope.dataURL;
                                imageTreated.source = $sce.trustAsResourceUrl($scope.dataURL);
                                imageTreated.text = '';
                                imageTreated.level = 0;
                                imageTreated.children = [];
                                $scope.blocks.children.push(imageTreated);
                                $scope.$apply();
                                i++;
                                if (i <= $scope.pdfDoc.numPages) {
                                    recurcive();
                                } else {
                                    $scope.$apply();
                                    //vide variable pdf
                                    // $scope.pdfDoc=[];
                                    console.log('pdf loaded completly');
                                }
                                resolve('Ces trucs ont marché !');
                            }
                        });
                    }
                };
            });
        }
        recurcive();
    };

    $scope.base64ToUint8Array = function(base64) {
        var raw = atob(base64);
        var uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
        for (var i = 0; i < raw.length; i++) {
            uint8Array[i] = raw.charCodeAt(i);
        }
        return uint8Array;
    };

    $scope.canvasToImage = function(backgroundColor) {

        var w = $scope.canvas.width;
        var h = $scope.canvas.height;
        var data;
        var compositeOperation;

        if (backgroundColor) {
            data = $scope.context.getImageData(0, 0, w, h);
            compositeOperation = $scope.context.globalCompositeOperation;
            $scope.context.globalCompositeOperation = 'destination-over';
            $scope.context.fillStyle = backgroundColor;
            $scope.context.fillRect(0, 0, w, h);
        }

        var imageData = $scope.canvas.toDataURL('image/png');

        if (backgroundColor) {
            $scope.context.clearRect(0, 0, w, h);
            $scope.context.putImageData(data, 0, 0);
            $scope.context.globalCompositeOperation = compositeOperation;
        }

        return imageData;
    };

    $scope.setFiles = function(element) {
        $scope.$apply(function() {
            // Turn the FileList object into an Array
            for (var i = 0; i < element.files.length; i++) {
                if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf') {
                    alert('Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.');
                    console.log(+element.files[i]);
                } else {
                    $scope.files.push(element.files[i]);
                }
            }
            // $scope.progressVisible = false;
        });
    };

    $scope.uploadFile = function() {
        if ($scope.files.length > 0) {
            var fd = new FormData();
            for (var i in $scope.files) {
                // $scope.files[i].id = localStorage.getItem('compteId');
                fd.append('uploadedFile', $scope.files[i]);
            }
            var xhr = new XMLHttpRequest();
            // xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener('load', $scope.uploadComplete, false);
            xhr.addEventListener('error', uploadFailed, false);
            // xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open('POST', configuration.URL_REQUEST + '/fileupload?id=' + localStorage.getItem('compteId'));
            $scope.progressVisible = true;
            xhr.send(fd);
            $scope.loader = true;
        } else {
            alert('Vous devez choisir un fichier');
        }

    };

    $scope.uploadComplete = function(evt) {
        $scope.files = [];
        //console.log(angular.fromJson(evt.target.responseText));
        console.log(evt.target.responseText.substring(0, 65));
        $scope.filePreview = CryptoJS.SHA256(evt.target.responseText.substring(0, 100).replace('"', ''));

        var pdf = $scope.base64ToUint8Array(angular.fromJson(evt.target.responseText));
        // PDFJS.disableWorker = false;
        // PDFJS.workerSrc = 'https://localhost:3000/bower_components/pdfjs/pdf.worker.js';
        PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
            $scope.pdfDoc = _pdfDoc;
            $scope.loader = false;
            $scope.pdflinkTaped = '';
            $scope.addSide();
        });
    };

    $scope.resumeWorking = function() {
        if ($rootScope.currentUser && $rootScope.currentUser.dropbox.accessToken) {
            for (var i = 0; i < $scope.fichierSimilaire.length; i++) {
                if ($scope.fichierSimilaire[i].path.indexOf('.html') > 0) {
                    $scope.apercuName = $scope.fichierSimilaire[i].path;
                    break;
                }
            }
            console.log('======================>$scope.fichierSimilaire');
            console.log($scope.fichierSimilaire);
            console.log('=============++> $scope.apercuName');
            console.log($scope.apercuName);
            var downloadApercu = dropbox.download(($scope.apercuName), $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            downloadApercu.then(function(result) {

                var arraylistBlock = {
                    children: []
                };
                // console.log(result);
                if (result.indexOf('var blocks = null') < 0) {
                    var debut = result.indexOf('var blocks = ') + 13;
                    var fin = result.indexOf('};', debut) + 1;
                    arraylistBlock = angular.fromJson(result.substring(debut, fin));
                }
                $rootScope.restructedBlocks = arraylistBlock;
                $rootScope.docTitre = $scope.apercuName.substring(0, $scope.apercuName.lastIndexOf('.html'));
                console.log($rootScope.docTitre);
                $scope.loader = false;
                $scope.blocks = $rootScope.restructedBlocks;
                $scope.docTitre = $rootScope.docTitre;
                $scope.docTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
                $scope.editBlocks = true;
            });
        }
    };

    $scope.openApercu = function() {
        if ($scope.fichierSimilaire && $scope.fichierSimilaire.length > 0) {
            if ($rootScope.currentUser && $rootScope.currentUser.dropbox.accessToken) {
                var i = 0;
                while ($scope.fichierSimilaire[i].path.indexOf('html') < 0) {
                    i++;
                }
                var previewDocument = dropbox.shareLink($scope.fichierSimilaire[i].path, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);

                previewDocument.then(function(data) {
                    window.location.href = data.url + '#/apercu';
                });
            }
        }

    };

    $scope.createNew = function() {
        $scope.pdflinkTaped = $rootScope.uploadDoc.lienPdf;
        $scope.loadPdfLink();
    };

    function uploadFailed(evt) {
        console.log('Erreure survenue lors de l\'pload du fichier ');
        console.log(evt);
    }
    if ($rootScope.loged === false) {
        if ($location.absUrl().indexOf('pdfUrl=') > -1) {
            var tmp = '';
            tmp = $location.absUrl().substring($location.absUrl().indexOf('pdfUrl=') + 7, $location.absUrl().length);
            while (tmp.indexOf('%2F') > -1) {
                tmp = tmp.replace('%2F', '/');
                localStorage.setItem('bookmarkletDoc', tmp);
            }
            // $scope.loader = false;
            // alert('ooo');

            $('#myModalWorkSpaceRedirection').modal('show');
        }
    }
    $('#myModalWorkSpaceRedirection').on('hidden.bs.modal', function() {
        $window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/'));
    });
    // if (localStorage.getItem('bookmarkletDoc')) {
    //     $rootScope.uploadDoc.lienPdf = localStorage.getItem('bookmarkletDoc');
    // }

    if ($location.absUrl().indexOf('pdfUrl=') > -1) {
        $rootScope.uploadDoc = {};
        $rootScope.uploadDoc.lienPdf = $location.absUrl().substring($location.absUrl().indexOf('pdfUrl=') + 7, $location.absUrl().length);
        while ($rootScope.uploadDoc.lienPdf.indexOf('%2F') > -1) {
            $rootScope.uploadDoc.lienPdf = $rootScope.uploadDoc.lienPdf.replace('%2F', '/');
        }
    }

    if ($rootScope.uploadDoc && localStorage.getItem('compteId')) {
        console.log('=====================+>');
        console.log($rootScope.uploadDoc.lienPdf);
        $scope.blocks = {
            children: []
        };
        $scope.docTitre = $rootScope.uploadDoc.titre;
        $scope.RestructurerName = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.uploadDoc.titre));

        var gettingUser = serviceCheck.getData();
        gettingUser.then(function(result) {
            if (result.loged) {
                $rootScope.currentUser = result.user;
                if ($rootScope.uploadDoc.lienPdf && $rootScope.currentUser) {
                    var tmpa = serviceCheck.filePreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                    tmpa.then(function(result) {
                        console.log(result);
                        if (result.erreurIntern) {
                            $('#myModalWorkSpace').modal('show');
                        } else {
                            if (result.existeDeja) {
                                console.log('popup existe deja + lien apercu');
                                $scope.documentSignature = result.documentSignature;
                                $scope.fichierSimilaire = result.found;
                                $('#documentExist').modal('show');
                            } else {
                                $scope.pdflinkTaped = $rootScope.uploadDoc.lienPdf;
                                $scope.loadPdfLink();
                            }
                        }
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
            console.log('=====================+>');
            console.log($rootScope.uploadDoc.lienPdf);
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

    if ($rootScope.restructedBlocks) {
        $scope.blocks = $rootScope.restructedBlocks;
        $scope.docTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
        $scope.editBlocks = true;
    }

});