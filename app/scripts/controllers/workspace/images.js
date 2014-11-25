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
/* global PDFJS ,Promise, CKEDITOR  */
/*jshint unused: false, undef:false */

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location, $compile, _, removeAccents, removeHtmlTags, $window, configuration, $sce, generateUniqueId, serviceCheck, dropbox, htmlEpubTool) {

    $rootScope.Document = true;
    // Zones a découper
    $scope.zones = [];
    // Loader afficher/enlever manipulation
    $scope.loader = true;
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
    $scope.showLoaderOcr = false;
    $scope.testEnv = false;
    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').show();
    $('#titreAdmin').hide();
    $('#titreListDocument').hide();
    $('#detailProfil').hide();
    $('#titreDocumentApercu').hide();
    $('#titreTag').hide();

    $scope.requestToSend = {};
    if (localStorage.getItem('compteId')) {
        $scope.requestToSend = {
            id: localStorage.getItem('compteId')
        };
    }
    $scope.skipCheking = false;

    $rootScope.$on('showFileDownloadLoader', function(event) {
        $('.loader_cover').show();
        $scope.showloaderProgress = true;
    });

    $scope.initImage = function() {
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

    $scope.resiseWorkspace = function($event) {
        if (angular.element($event.currentTarget).hasClass('active')) {
            angular.element($event.currentTarget).removeClass('active');
            $('.header_zone').slideDown(300, function() {
                var body_height = $(window).outerHeight();
                var header_height = $('#main_header').outerHeight();
                var dif_heights = body_height - header_height;
                dif_heights = dif_heights - 127;
                $('.container').height(dif_heights);
            });
        } else {
            $('.header_zone').slideUp(300, function() {
                var body_height = $(window).outerHeight();
                var header_height = $('#main_header').outerHeight();
                var dif_heights = body_height + header_height;
                dif_heights = dif_heights - 164;
                $('.container').height(dif_heights);
            });
            angular.element($event.currentTarget).addClass('active');
        }
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

    $scope.remove2 = function() {
        $scope.remove($scope.currentImage);
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
        $scope.showLoaderOcr = true;
        $scope.loaderMessage = 'Océrisation en cours';

        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            initialiseZones();
            // $scope.loader = true;
            $http.post(configuration.URL_REQUEST + '/oceriser', {
                id: localStorage.getItem('compteId'),
                encodedImg: $scope.currentImage.originalSource
            }).success(function(data) {

                $scope.showLoaderOcr = false;
                var textOcerided = angular.fromJson(data);
                textOcerided = textOcerided.replace(/\n/g, '');
                textOcerided = textOcerided.replace(/</g, '&lt;');
                textOcerided = textOcerided.replace(/>/g, '&gt;');

                // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
                $scope.textes = {
                    source: $scope.currentImage.source,
                    text: textOcerided
                };

                $scope.currentImage.text = textOcerided;

                // Affichage de l'éditeur
                $scope.showEditor = true;
                $scope.loader = false;
                $scope.msg = 'ok';
            }).error(function() {
                $scope.showLoaderOcr = false;
                $scope.msg = 'ko';
            });
        } else {
            alert('Vous devez selectionner un block ... ');
        }

    };

    $scope.afficherTexte = function() {

        if ($scope.currentImage.text.indexOf('data-font') >= 0) {
            var tmpText = $scope.currentImage.text;
            tmpText = tmpText.substring(tmpText.indexOf('>') + 1, tmpText.lastIndexOf('</p>'));
            $scope.currentImage.text = tmpText;
        }

        $scope.textes = {
            text: $scope.currentImage.text
        };
        $scope.showEditor = true;
    };

    $scope.getPictoTag = function(block) {
        var pictoTag = '';
        if (block.tag) {
            var tagToFind = _.findWhere($scope.listTags, {
                _id: block.tag
            });
            if (tagToFind) {
                pictoTag = tagToFind.picto;
            }
        }
        return pictoTag;
    };

    $scope.modifierTexte = function() {
        if ($scope.currentImage.ocrOk || !$scope.currentImage.source) {

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

    /* Debut Dupliquer un block dans le meme niveau */
    /*
     * Ajouter child dans l'indice position des childrens de parent.
     */
    $scope.addParent = function(parent, child, position) {
        var newChild = {
            id: generateUniqueId(),
            tag: child.tag,
            text: child.text,
            level: child.level,
            children: []
        };
        parent.children.splice(position + 1, 0, newChild);
    };

    /*
     * Chercher l'indice de child1 dans les childrens d'obj.
     */

    function checkChild(obj, child1) {
        for (var i = 0; i < obj.children.length; i++) {
            if (obj.children[i] === child1) {
                return i;
            }
        }
        return -1;
    }

    /*
     * Parcourir le parent.
     */

    function parcourirParent(obj, child) {
        var i = checkChild(obj, child);
        if (i !== -1) {
            $scope.addParent(obj, child, i);
        }
        return i;
    }

    /*
     * Parcourir les fils du parent.
     */

    function parcourirChild(obj, child) {
        for (var key in obj) {
            if (typeof(obj[key]) === 'object') {
                var i = checkChild(obj[key], child);
                if (i !== -1) {
                    $scope.addParent(obj[key], child, i);
                    break;
                }
                if (obj[key].children.length > 0) {
                    parcourirChild(obj[key].children, child);
                }
            }
        }
    }

    /*
     * Dupliquer un block à partir de TreeView.
     */
    $scope.duplicateBlock = function(child) {
        if (parcourirParent($scope.blocks, child) === -1) {
            parcourirChild($scope.blocks.children, child);
        }
    };

    /*
     * Dupliquer un block à partir de l'espace de structuration.
     */
    $scope.duplicateBlock2 = function() {
        if (parcourirParent($scope.blocks, $scope.currentImage) === -1) {
            parcourirChild($scope.blocks.children, $scope.currentImage);
        }
    };
    /* Fin Dupliquer un block dans le meme niveau */

    $scope.textToSpeech = function() {
        // $('.workspace_tools').hide();
        // $('.audio_reader').fadeIn();
        $scope.showSynthese = true;
        $scope.showLoaderOcr = true;
        $scope.loaderMessage = 'Génération de la synthèse vocale cours veuillez patienter ';

        var ocrText = removeAccents(removeHtmlTags($scope.currentImage.text));
        $scope.currentImage.text = ocrText;
        if ($scope.currentImage.text) {
            $scope.loader = true;
            if ($scope.currentImage.text.length > 0) {
                $http.post(configuration.URL_REQUEST + '/texttospeech', {
                    text: ocrText,
                    id: localStorage.getItem('compteId')
                }).success(function(data) {
                    $scope.currentImage.synthese = 'data:audio/mpeg;base64,' + angular.fromJson(data);
                    traverseOcrSpeech($scope.blocks);
                    // $scope.loader = false;
                    $scope.showLoaderOcr = false;
                    return false;
                }).error(function() {
                    $scope.showLoaderOcr = false;
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
        $scope.currentImage.text = $rootScope.ckEditorValue;
        traverseOcrSpeech($scope.blocks);
    };

    /* change CKEDITOR */
    $scope.initCkEditorChange = function() {
        CKEDITOR.instances.editorOcr.on('change', function() {
            $scope.getOcrText();
        });
    };

    // Export Image to workspace
    $scope.workspace = function(image, $event) {
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

        $('.tree-images .ui-sortable li .layer_container').removeClass('active');
        if ($scope.testEnv) {
            angular.element($event.target).parents('.layer_container').addClass('active');
        }
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
        localStorage.setItem('lockOperationDropBox', true);
        $('.loader_cover').show();
        $scope.showloaderProgress = true;
        $scope.loaderMessage = 'Enregistrement du document dans votre compte DropBox en cours. Veuillez patienter ';
        $scope.loaderProgress = 30;
        $scope.msgErrorModal = '';
        var url = configuration.URL_REQUEST + '/index.html';
        var errorMsg2 = 'Erreur lors de l\'enregistrement dans Dropbox';

        if ($rootScope.currentUser.dropbox.accessToken) {
            var token = $rootScope.currentUser.dropbox.accessToken;

            var apercuName = encodeURIComponent($rootScope.docTitre) + '.html';
            var manifestName = encodeURIComponent($rootScope.docTitre) + '.appcache';
            var listDocumentDropbox = configuration.CATALOGUE_NAME;
            var listDocumentManifest = 'listDocument.appcache';

            var data = {
                id: $rootScope.currentUser.local.token
            };

            var savedSign = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0], '');
            var originalName = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
            var ladate = new Date();
            var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();


            var updatedApercuName = tmpDate + '_' + originalName + '_' + savedSign + '.html';
            var updatedManifestName = tmpDate + '_' + originalName + '_' + savedSign + '.appcache';

            if (updatedApercuName == decodeURIComponent(apercuName) && updatedManifestName == decodeURIComponent(manifestName)) { // jshint ignore:line
                $http.post(configuration.URL_REQUEST + '/allVersion', data)
                    .success(function(dataRecu) {
                        var sysVersion = dataRecu[0].appVersion;
                        $http.get(url).then(function(response) {
                            response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                            if (response.data.length > 0) {
                                $scope.loaderProgress = 40;
                                var downloadManifest = dropbox.download(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                downloadManifest.then(function(result) {

                                    var newVersion = parseInt(result.charAt(result.indexOf(':v') + 2)) + 1;
                                    result = result.replace(':v' + result.charAt(result.indexOf(':v') + 2), ':v' + newVersion);
                                    var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), result, token, configuration.DROPBOX_TYPE);
                                    uploadManifest.then(function(result) {
                                        $scope.loaderProgress = 50;

                                        if (result) {
                                            var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                            shareManifest.then(function(result) {
                                                response.data = response.data.replace("var Appversion=''", "var Appversion='" + sysVersion + "'"); // jshint ignore:line
                                                response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                                response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                                if (result) {
                                                    var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), response.data, token, configuration.DROPBOX_TYPE);
                                                    uploadApercu.then(function(result) {
                                                        if (result) {
                                                            var newlistDocument = result;
                                                            var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                            shareApercu.then(function(result) {
                                                                if (result) {
                                                                    $scope.docTitre = '';
                                                                    var urlDropbox = result.url + '#/apercu';
                                                                    newlistDocument.lienApercu = result.url + '#/apercu';
                                                                    $scope.loaderProgress = 70;
                                                                    localStorage.setItem('reloadRequired', true);
                                                                    if (result) {
                                                                        localStorage.setItem('lockOperationDropBox', false);
                                                                        if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                            urlDropbox += '?key=' + $rootScope.currentUser._id;
                                                                        }
                                                                        $window.location.href = urlDropbox;
                                                                    }
                                                                    $scope.loader = false;

                                                                } else {
                                                                    localStorage.setItem('lockOperationDropBox', false);
                                                                    $scope.loader = false;
                                                                    $scope.msgErrorModal = errorMsg2;
                                                                    $('#actions-workspace').modal('show');
                                                                }
                                                            });
                                                        } else {
                                                            localStorage.setItem('lockOperationDropBox', false);
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
                    });

            } else {
                $http.post(configuration.URL_REQUEST + '/allVersion', data)
                    .success(function(dataRecu) {
                        var sysVersion = dataRecu[0].appVersion;
                        $http.get(url).then(function(response) {
                            response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                            if (response.data.length > 0) {
                                $scope.loaderProgress = 40;
                                var downloadManifest = dropbox.download(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                downloadManifest.then(function(result) {

                                    var newVersion = parseInt(result.charAt(result.indexOf(':v') + 2)) + 1;
                                    result = result.replace(':v' + result.charAt(result.indexOf(':v') + 2), ':v' + newVersion);

                                    // var newVersion = parseInt(result.charAt(29)) + 1;
                                    // result = result.replace(':v' + result.charAt(29), ':v' + newVersion);

                                    var uploadManifest = dropbox.upload(updatedManifestName, result, token, configuration.DROPBOX_TYPE);
                                    uploadManifest.then(function(result) {
                                        $scope.loaderProgress = 50;

                                        if (result) {
                                            var shareManifest = dropbox.shareLink(updatedManifestName, token, configuration.DROPBOX_TYPE);
                                            shareManifest.then(function(result) {
                                                response.data = response.data.replace("var Appversion=''", "var Appversion='" + sysVersion + "'"); // jshint ignore:line
                                                response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                                response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                                if (result) {
                                                    var uploadApercu = dropbox.upload(updatedApercuName, response.data, token, configuration.DROPBOX_TYPE);
                                                    uploadApercu.then(function(result) {
                                                        if (result) {
                                                            var newlistDocument = result;
                                                            var shareApercu = dropbox.shareLink(updatedApercuName, token, configuration.DROPBOX_TYPE);
                                                            shareApercu.then(function(result) {
                                                                if (result) {
                                                                    $scope.docTitre = '';
                                                                    var urlDropbox = result.url + '#/apercu';
                                                                    newlistDocument.lienApercu = result.url + '#/apercu';
                                                                    $scope.loaderProgress = 70;

                                                                    var tmp2 = dropbox.delete('/' + apercuName, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                                    tmp2.then(function() {
                                                                        var tmp12 = dropbox.delete('/' + manifestName, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                                        tmp12.then(function(deleteResult) {
                                                                            var jsonLink;
                                                                            if ($scope.testEnv === false) {
                                                                                jsonLink = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(apercuName))[0]; // jshint ignore:line
                                                                            } else {
                                                                                jsonLink = apercuName;
                                                                            }
                                                                            var searchApercu = dropbox.search(jsonLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                                            searchApercu.then(function(result) {
                                                                                var foundDoc = false;
                                                                                for (var i = 0; i < result.length; i++) {
                                                                                    if (result[i].path.indexOf('.json') > 0 && result[i].path.indexOf(jsonLink)) {
                                                                                        foundDoc = true;
                                                                                        break;
                                                                                    }
                                                                                }
                                                                                if (foundDoc) {
                                                                                    var tmp2 = dropbox.delete('/' + apercuName.replace('.html', '.json'), $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                                                                    tmp2.then(function() {
                                                                                        localStorage.setItem('reloadRequired', true);
                                                                                        localStorage.setItem('lockOperationDropBox', false);
                                                                                        if (result) {
                                                                                            if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                                                urlDropbox += '?key=' + $rootScope.currentUser._id;
                                                                                            }
                                                                                            $window.location.href = urlDropbox;
                                                                                        }
                                                                                        $scope.loader = false;
                                                                                    });
                                                                                } else {
                                                                                    localStorage.setItem('reloadRequired', true);
                                                                                    localStorage.setItem('lockOperationDropBox', false);
                                                                                    if (result) {
                                                                                        if (window.location.href.indexOf('dl.dropboxusercontent.com/') === -1) {
                                                                                            urlDropbox += '?key=' + $rootScope.currentUser._id;
                                                                                        }
                                                                                        $window.location.href = urlDropbox;
                                                                                    }
                                                                                    $scope.loader = false;
                                                                                }
                                                                            });
                                                                        });

                                                                    });
                                                                } else {
                                                                    localStorage.setItem('lockOperationDropBox', false);
                                                                    $scope.loader = false;
                                                                    $scope.msgErrorModal = errorMsg2;
                                                                    $('#actions-workspace').modal('show');
                                                                }
                                                            });
                                                        } else {
                                                            localStorage.setItem('lockOperationDropBox', false);
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
                    });
            }


        } else {
            localStorage.setItem('lockOperationDropBox', false);
        }
    };

    $scope.showlocks = function() {

        var apercuName;
        var manifestName;
        $scope.errorMsg = false;

        $scope.msgErrorModal = '';
        var url = configuration.URL_REQUEST + '/index.html';
        var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer sur Dropbox';
        var errorMsg2 = 'Erreur lors de l\'enregistrement dans Dropbox';
        var errorMsg3 = 'Erreur lors du partage dans Dropbox';
        var errorMsg4 = 'Le document existe déja dans Dropbox';
        //var confirmMsg = 'Fichier enregistré dans Dropbox avec succès';
        if (!$scope.docTitre || $scope.docTitre.length <= 0) {
            $scope.msgErrorModal = 'Le titre est obligatoire !';
            $scope.errorMsg = true;
            return;
        } else {
            if ($scope.docTitre.length > 32) {
                $scope.msgErrorModal = 'Le titre est trop long !';
                $scope.errorMsg = true;
                return;
            } else if (!serviceCheck.checkName($scope.docTitre)) {
                $scope.msgErrorModal = 'Veuillez ne pas utiliser les caractères spéciaux.';
                $scope.errorMsg = true;
                return;
            }
        }
        $('#actions-workspace').modal('hide');

        $('.loader_cover').show();
        $scope.showloaderProgress = true;
        $scope.loaderMessage = 'Enregistrement du document dans votre DropBox en cours veuillez patienter ';
        $scope.loaderProgress = 20;
        localStorage.setItem('lockOperationDropBox', true);
        if ($rootScope.currentUser.dropbox.accessToken) {
            var token = $rootScope.currentUser.dropbox.accessToken;
            apercuName = $scope.docTitre + '.html';
            manifestName = $scope.docTitre + '.appcache';
            var listDocumentDropbox = configuration.CATALOGUE_NAME;
            var listDocumentManifest = 'listDocument.appcache';

            $http.post(configuration.URL_REQUEST + '/allVersion', {
                id: $rootScope.currentUser.local.token
            }).success(function(dataRecu) {
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
                    $('#actions-workspace').modal('show');
                } else {
                    var ladate = new Date();
                    var tmpDate = ladate.getFullYear() + '-' + (ladate.getMonth() + 1) + '-' + ladate.getDate();
                    //$scope.filePreview = $scope.filePreview.replace(/\/+/g, '');
                    var apercuName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.html';
                    var manifestName = tmpDate + '_' + encodeURIComponent($scope.docTitre) + '_' + $scope.filePreview + '.appcache';

                    $scope.loaderProgress = 30;
                    $http.get(url).then(function(response) {
                        response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                        if (response.data.length > 0) {
                            $scope.loaderProgress = 35;
                            $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function(manifestContent) {
                                $scope.loaderProgress = 40;
                                var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), manifestContent.data, token, configuration.DROPBOX_TYPE);
                                uploadManifest.then(function(result) {
                                    if (result) {
                                        $scope.loaderProgress = 45;
                                        var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                        shareManifest.then(function(result) {
                                            response.data = response.data.replace("var Appversion=''", "var Appversion='" + sysVersion + "'"); // jshint ignore:line
                                            response.data = response.data.replace('manifest=""', 'manifest="' + result.url + '"');
                                            response.data = response.data.replace('ownerId = null', 'ownerId = \'' + $rootScope.currentUser._id + '\'');
                                            if (result) {
                                                $scope.loaderProgress = 60;
                                                var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), response.data, token, configuration.DROPBOX_TYPE);
                                                uploadApercu.then(function(result) {
                                                    if (result) {
                                                        var listDocument = result;
                                                        $scope.loaderProgress = 70;
                                                        var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                        shareApercu.then(function(result) {
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
                                                                    $window.location.href = urlDropbox;
                                                                }
                                                                $scope.loader = false;
                                                            } else {
                                                                $scope.loader = false;
                                                                $scope.msgErrorModal = errorMsg2;
                                                                $('#actions-workspace').modal('show');
                                                            }
                                                        });
                                                    } else {
                                                        localStorage.setItem('lockOperationDropBox', false);
                                                        $scope.loader = false;
                                                        $scope.msgErrorModal = errorMsg2;
                                                        $('#actions-workspace').modal('show');
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        localStorage.setItem('lockOperationDropBox', false);
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
            localStorage.setItem('lockOperationDropBox', false);
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
                $scope.showPdfCanvas = true;

                var pdf = $scope.base64ToUint8Array(data);
                $scope.flagUint8Array = true;
                $scope.loaderMessage = 'Traitement de votre Document PDF en cours veuillez patienter ';
                $scope.loaderProgress = 100;
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

    $scope.recurcive = function(i) {
        $('.loader_cover').hide();
        $scope.showloaderProgress = false;
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
                                $scope.recurcive(i);
                            } else {
                                $scope.$apply();
                            }
                            resolve('Ces trucs ont marché !');
                        }
                    });
                }
            };
        });
    };
    $scope.addSide = function() {
        var i = 1;
        $scope.recurcive(i);
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
                    if (element.files[i].type === '' && element.files[i].name.indexOf('.epub')) {
                        $scope.files.push(element.files[i]);
                    } else {
                        alert('Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.');
                    }
                } else {

                    $scope.files.push(element.files[i]);
                }
            }
            // $scope.progressVisible = false;
        });
    };

    $scope.uploadFile = function() {
        if ($scope.files.length > 0) {
            $('.loader_cover').show();
            $scope.showloaderProgress = true;
            $scope.loaderProgress = 0;
            var fd = new FormData();
            for (var i in $scope.files) {
                // $scope.files[i].id = localStorage.getItem('compteId');
                fd.append('uploadedFile', $scope.files[i]);
                if ($scope.files[i].type === 'application/epub+zip') {
                    $scope.serviceUpload = '/epubUpload';
                    $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
                } else {
                    if ($scope.files[i].type === '' && $scope.files[i].name.indexOf('.epub')) {
                        $scope.serviceUpload = '/epubUpload';
                        $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
                    } else {
                        $scope.serviceUpload = '/fileupload';
                        $scope.loaderMessage = 'Chargement de votre document PDF en cours. Veuillez patienter ';
                    }
                }
            }
            var xhr = new XMLHttpRequest();
            // xhr.upload.addEventListener("progress", uploadProgress, false);
            if ($scope.skipCheking) {
                xhr.addEventListener('load', $scope.uploadNewDoc, false);
            } else {
                xhr.addEventListener('load', $scope.uploadComplete, false);

            }
            xhr.addEventListener('error', $scope.uploadFailed, false);
            xhr.addEventListener('progress', $scope.updateProgress, false);
            // xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open('POST', configuration.URL_REQUEST + $scope.serviceUpload + '?id=' + localStorage.getItem('compteId'));
            $scope.progressVisible = true;
            xhr.send(fd);
            $scope.loader = true;
        } else {
            alert('Vous devez choisir un fichier');
        }

    };

    $scope.updateProgress = function(oEvent) {
        if (oEvent.lengthComputable) {
            var percentComplete = oEvent.loaded / oEvent.total;
            if ($scope.serviceUpload === '/epubUpload') {
                $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
            } else {
                $scope.loaderMessage = 'Chargement de votre document PDF en cours. Veuillez patienter ';
            }

            $scope.loaderProgress = percentComplete * 100;
            $scope.$digest();
        } else {
            console.log('progress non calculable');
        }
    };
    $scope.uploadNewDoc = function(evt) {
        $scope.files = [];
        $('.loader_cover').hide();
        $scope.showloaderProgress = false;
        var fileChunck = evt.target.responseText.substring(0, 50000).replace('"', '');
        var tmp = serviceCheck.getSign(fileChunck);
        tmp.then(function(loacalSign) {
            if (loacalSign.erreurIntern) {
                $('#myModalWorkSpace').modal('show');
            } else {
                $scope.filePreview = loacalSign.sign;
                if ($scope.serviceUpload === '/fileupload') {
                    var pdf = $scope.base64ToUint8Array(angular.fromJson(evt.target.responseText));
                    PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
                        $scope.pdfDoc = _pdfDoc;
                        $scope.loader = false;
                        $scope.pdflinkTaped = '';
                        $scope.addSide();
                    });
                } else {
                    var epubContent = angular.fromJson(evt.target.responseText);
                    $scope.blocks = {
                        children: []
                    };
                    var block = [];
                    for (var i = 0; i < epubContent.html.length; i++) {
                        var promiseConvert = htmlEpubTool.convertToCnedObject(epubContent.html[i].dataHtml, 'Page ' + (i + 1));
                        /* jshint ignore:start */
                        promiseConvert.then(function(resultConverted) {
                            resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                            block.push(resultConverted);
                            if (/\s+\S*$/g.exec(resultConverted.text)[0] === ' ' + (epubContent.html.length)) {
                                $scope.blocks = {
                                    children: block
                                };
                                $scope.loader = false;
                                $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, epubContent.img);
                            }
                        });
                        /* jshint ignore:end */

                    }
                }
            }

        });



    };
    $scope.uploadComplete = function(evt) {
        var serverResp = angular.fromJson(evt.target.responseText);

        $scope.files = [];
        $scope.loaderProgress = 100;
        if (serverResp.tooManyHtml) {
            $('#myModalWorkSpaceTooMany').modal('show');
        } else if (serverResp.oversized) {
            $('#myModalWorkSpaceBig').modal('show');
        } else if (serverResp.oversizedIMG) {
            $('#myModalWorkSpaceBig').modal('show');
        } else {
            var fileChunck = evt.target.responseText.substring(0, 50000).replace('"', '');
            var tmp = serviceCheck.getSign(fileChunck);
            tmp.then(function(loacalSign) {
                if (loacalSign.erreurIntern) {
                    $('#myModalWorkSpace').modal('show');
                } else {
                    $scope.filePreview = loacalSign.sign;
                    var tmpa = dropbox.search($scope.filePreview, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    tmpa.then(function(result) {
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
                            // $('#documentExist').modal('show');
                            $scope.openApercu();
                        } else {
                            if ($scope.serviceUpload === '/fileupload') {
                                var pdf = $scope.base64ToUint8Array(angular.fromJson(evt.target.responseText));
                                PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
                                    $scope.pdfDoc = _pdfDoc;
                                    $scope.loader = false;
                                    $scope.pdflinkTaped = '';
                                    $scope.addSide();
                                });
                            } else {
                                $('.loader_cover').hide();
                                $scope.showloaderProgress = false;
                                var epubContent = angular.fromJson(evt.target.responseText);
                                $scope.blocks = {
                                    children: []
                                };
                                var block = [];
                                for (i = 0; i < epubContent.html.length; i++) {
                                    var promiseConvert = htmlEpubTool.convertToCnedObject(epubContent.html[i].dataHtml, 'Page ' + (i + 1));
                                    /* jshint ignore:start */

                                    promiseConvert.then(function(resultConverted) {
                                        resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                                        block.push(resultConverted);
                                        if (/\s+\S*$/g.exec(resultConverted.text)[0] === ' ' + (epubContent.html.length)) {
                                            $scope.blocks = {
                                                children: block
                                            };
                                            $scope.loader = false;
                                            // ajouter les images dans l'espace de structuration

                                            $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, epubContent.img);
                                        }
                                    });
                                    /* jshint ignore:end */

                                }
                            }
                        }
                    });
                }
            });
        }

    };


    $scope.modalError = function(id) {
        $('#' + id).modal('hide');
        if ($scope.testEnv === false) {
            setTimeout(function() {
                window.location.href = $location.absUrl().substring(0, $location.absUrl().indexOf('#/') + 2) + 'listDocument';
            }, 1000);
        }
    };

    $scope.resumeWorking = function() {
        $('.loader_cover').show();
        $scope.showloaderProgress = true;
        $scope.loaderMessage = 'Chargement de votre document en cours. Veuillez patienter ';
        $scope.loaderProgress = 20;
        if ($rootScope.currentUser && $rootScope.currentUser.dropbox.accessToken) {
            for (var i = 0; i < $scope.fichierSimilaire.length; i++) {
                if ($scope.fichierSimilaire[i].path.indexOf('.html') > 0) {
                    $scope.apercuName = $scope.fichierSimilaire[i].path;
                    break;
                }
            }
            var downloadApercu = dropbox.download($scope.apercuName, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
            downloadApercu.then(function(result) {
                $scope.loaderProgress = 60;
                var arraylistBlock = {
                    children: []
                };
                if (result.indexOf('var blocks = null') < 0) {
                    var debut = result.indexOf('var blocks = ') + 13;
                    var fin = result.indexOf('};', debut) + 1;
                    arraylistBlock = angular.fromJson(result.substring(debut, fin));
                }
                $rootScope.restructedBlocks = arraylistBlock;
                $rootScope.docTitre = $scope.apercuName.substring(0, $scope.apercuName.lastIndexOf('.html'));
                $scope.loaderMessage = 'Chargement de votre document en cours. Veuillez patienter ';
                $scope.loaderProgress = 100;
                $('.loader_cover').hide();
                $scope.showloaderProgress = false;
                $scope.blocks = $rootScope.restructedBlocks;
                $scope.docTitre = $rootScope.docTitre;
                if ($scope.testEnv === false) {
                    $scope.docTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
                }
                $scope.editBlocks = true;
            });
        }
    };

    $scope.openApercu = function() {
        if ($scope.fichierSimilaire && $scope.fichierSimilaire.length > 0) {
            if ($rootScope.currentUser && $rootScope.currentUser.dropbox.accessToken) {
                var i = 0;
                while ($scope.fichierSimilaire[i].path.indexOf('.html') < 0) {
                    i++;
                }
                var previewDocument = dropbox.shareLink($scope.fichierSimilaire[i].path, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);

                previewDocument.then(function(data) {
                    window.location.href = data.url + '#/apercu';
                });
            }
        }

    };

    $scope.epubLink = function(epubLink) {

        if (epubLink.indexOf('https://www.dropbox.com') > -1) {
            epubLink = epubLink.replace('https://www.dropbox.com/', 'https://dl.dropboxusercontent.com/');
        }
        $http.post(configuration.URL_REQUEST + '/externalEpub', {
            id: $rootScope.currentUser.local.token,
            lien: epubLink
        }).success(function(data) {
            var epubContent = angular.fromJson(data);
            $scope.blocks = {
                children: []
            };
            var block = [];
            for (var i = 0; i < epubContent.html.length; i++) {
                var promiseConvert = htmlEpubTool.convertToCnedObject(epubContent.html[i].dataHtml, 'Page ' + (i + 1));
                /* jshint ignore:start */

                promiseConvert.then(function(resultConverted) {
                    resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                    block.push(resultConverted);
                    if (/\s+\S*$/g.exec(resultConverted.text)[0] === ' ' + (epubContent.html.length)) {
                        $scope.blocks = {
                            children: block
                        };
                        $scope.loader = false;
                        $scope.showloaderProgress = false;
                        $('.loader_cover').hide();
                        $scope.showloaderProgress = false;
                        $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, epubContent.img);
                    }
                });
                /* jshint ignore:end */

            }
        }).error(function() {
            console.log('erreur lors du telechargement de votre epub');
        });
    };

    $scope.createNew = function() {
        if ($rootScope.uploadDoc.lienPdf && $rootScope.uploadDoc.lienPdf.indexOf('.epub') > -1) {
            $scope.epubLink($rootScope.uploadDoc.lienPdf);
        } else if ($rootScope.uploadDoc.lienPdf && $rootScope.uploadDoc.lienPdf.indexOf('.pdf') > -1) {
            $scope.pdflinkTaped = $rootScope.uploadDoc.lienPdf;
            $scope.loadPdfLink();
        } else if ($rootScope.uploadDoc.uploadPdf) {
            $scope.skipCheking = true;
            $scope.files = $rootScope.uploadDoc.uploadPdf;
            $scope.uploadFile();
        } else {
            $('.loader_cover').show();
            $scope.showloaderProgress = true;
            $scope.loaderProgress = 0;
            $scope.loaderMessage = 'Chargement et structuration de votre page HTML en cours. Veuillez patienter ';
            var promiseHtml = serviceCheck.htmlPreview($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
            promiseHtml.then(function(resultHtml) {
                var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                promiseClean.then(function(resultClean) {
                    // console.info(resultClean);
                    var promiseImg = serviceCheck.htmlImage($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                    promiseImg.then(function(resultImg) {
                        $scope.Imgs = resultImg.htmlImages;
                        // TODO : call set Img
                        $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, $scope.Imgs);
                    });
                    var promiseConvert = htmlEpubTool.convertToCnedObject(resultClean, 'Page HTML', $rootScope.uploadDoc.lienPdf);
                    promiseConvert.then(function(resultConverted) {
                        resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                        var blocks = {
                            children: [resultConverted]
                        };
                        // TODO : call set Img
                        $scope.blocks = htmlEpubTool.setImgsIntoCnedObject(blocks, $scope.Imgs);
                        $scope.loader = false;
                    });

                });
            });
        }



    };

    $scope.uploadFailed = function(evt) {
        console.log('Erreure survenue lors de l\'pload du fichier ');
        console.log(evt);
    };

    if (!localStorage.getItem('compteId') && ($rootScope.loged == false || typeof $rootScope.loged == 'undefined')) {
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
        $scope.blocks = {
            children: []
        };
        $scope.docTitre = $rootScope.uploadDoc.titre;
        $scope.RestructurerName = /((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.uploadDoc.titre));

        var gettingUser = serviceCheck.getData();
        gettingUser.then(function(result) {
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
                    tmpa.then(function(result) {
                        if (result.erreurIntern) {
                            $('#myModalWorkSpace').modal('show');
                        } else {
                            if (result.existeDeja) {
                                $scope.documentSignature = result.documentSignature;
                                $scope.fichierSimilaire = result.found;
                                // here user choices
                                // $('#documentExist').modal('show');

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
                    tmpa.then(function(result) {
                        if (result.erreurIntern) {
                            $('#myModalWorkSpace').modal('show');
                        } else {
                            if (result.existeDeja) {
                                $scope.documentSignature = result.documentSignature;
                                $scope.fichierSimilaire = result.found;
                                $scope.loaderProgress = 30;
                                // here user choices
                                //$('#documentExist').modal('show');

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
                    promiseHtml.then(function(resultHtml) {
                        var promiseClean = htmlEpubTool.cleanHTML(resultHtml);
                        promiseClean.then(function(resultClean) {
                            // console.info(resultClean);
                            $scope.fichierSimilaire = [];

                            var htmlsign = serviceCheck.htmlReelPreview($rootScope.uploadDoc.lienPdf);
                            htmlsign.then(function(htmlplPreview) {
                                if (htmlplPreview.sign) {
                                    $scope.filePreview = htmlplPreview.sign;
                                    var tmpa = dropbox.search($scope.filePreview, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                                    tmpa.then(function(result) {
                                        var foundDoc = false;
                                        for (var i = 0; i < result.length; i++) {
                                            if (result[i].path.indexOf('.html') && result[i].path.indexOf($scope.filePreview)) {
                                                $scope.fichierSimilaire.push(result[i]);
                                                foundDoc = true;
                                            }
                                        }
                                        if (foundDoc) {
                                            //show popup for action
                                            //$('#documentExist').modal('show');

                                            $scope.openApercu();
                                        } else {
                                            $scope.loaderMessage = 'Chargement et structuration de votre page HTML en cours. Veuillez patienter ';
                                            var promiseImg = serviceCheck.htmlImage($rootScope.uploadDoc.lienPdf, $rootScope.currentUser.dropbox.accessToken);
                                            promiseImg.then(function(resultImg) {
                                                if (resultImg.htmlImages && resultImg.htmlImages.length > 0) {
                                                    $scope.Imgs = resultImg.htmlImages;
                                                    // TODO : call set Img
                                                    $scope.blocks = htmlEpubTool.setImgsIntoCnedObject($scope.blocks, $scope.Imgs);
                                                } else {
                                                    $('.loader_cover').hide();
                                                    $scope.showloaderProgress = false;
                                                }
                                            });
                                            var promiseConvert = htmlEpubTool.convertToCnedObject(resultClean, 'Page HTML', $rootScope.uploadDoc.lienPdf);
                                            promiseConvert.then(function(resultConverted) {
                                                resultConverted = htmlEpubTool.setIdToCnedObject(resultConverted);
                                                var blocks = {
                                                    children: [resultConverted]
                                                };
                                                // TODO : call set Img
                                                $scope.blocks = htmlEpubTool.setImgsIntoCnedObject(blocks, $scope.Imgs);
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

    if ($rootScope.restructedBlocks) {
        $scope.blocks = $rootScope.restructedBlocks;
        $scope.docTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent($rootScope.docTitre))[0].replace('_', '').replace('_', ''));
        $scope.editBlocks = true;
        $scope.loader = false;
    }
    $scope.htmlProgressMethode = function(data) {
        $scope.loaderProgress = data.fileProgress;
        $scope.loaderMessage = 'Chargement et structuration de votre page HTML en cours. Veuillez patienter ';
        if (data.fileProgress === 100) {
            $('.loader_cover').hide();
            $scope.showloaderProgress = false;
        }
        if (!$scope.$$phase) {
            $scope.$digest();
        } // jshint ignore:line
    };

    $scope.epubProgressMethode = function(data) {
        $scope.loaderProgress = data.fileProgress;
        $scope.loaderMessage = ' L’application analyse votre fichier afin de s’assurer qu’il pourra être traité de façon optimale. Veuillez patienter cette analyse peut prendre quelques instants ';
        if (data.fileProgress === 100) {
            $('.loader_cover').hide();
            $scope.showloaderProgress = false;
        }
        $scope.$digest();
    };
    if ($rootScope.socket) {
        $rootScope.socket.on('pdfProgress', function(data) {
            if ($rootScope.indexLoader) {
                $('.loader_cover').hide();
                $scope.showloaderProgress = false;
            } else {
                $('.loader_cover').show();
                $scope.showloaderProgress = true;
            }
            $scope.loaderProgress = data.fileProgress;
            $scope.loaderMessage = 'Chargement de votre document PDF veuillez patienter ';
            if (data.fileProgress === 100) {
                console.log('pdf dowload finished');
                // $('.loader_cover').hide();
                // $scope.showloaderProgress = false;
            }
            $scope.$digest();
        });

        $rootScope.socket.on('htmlProgress', function(data) {
            $scope.htmlProgressMethode(data);
        });
        // $rootScope.socket.on('epubProgress', $scope.epubProgressMethode(data));

        $rootScope.socket.on('epubProgress', function(data) {
            $scope.epubProgressMethode(data);
        });
    }

});