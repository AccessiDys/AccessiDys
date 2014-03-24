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
/* global PDFJS ,Promise, CKEDITOR */

angular.module('cnedApp').controller('ImagesCtrl', function($scope, $http, $rootScope, $location, $compile, _, removeAccents, removeHtmlTags, $window, configuration, $sce, generateUniqueId, serviceCheck) {

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

    $('#titreCompte').hide();
    $('#titreProfile').hide();
    $('#titreDocument').show();
    $('#titreAdmin').hide();

    $scope.initImage = function() {
        var tmp = serviceCheck.getData();
        tmp.then(function(result) { // this is only run after $http completes
            if (result.loged) {
                $('#imagePage').show();
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
                    $rootScope.apply; // jshint ignore:line
                }
            } else {
                if ($location.path() !== '/') {
                    $location.path('/');
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
    };

    $scope.removeZone = function(idZone) {
        for (var i = 0; i < $scope.zones.length; i++) {
            if ($scope.zones[i]._id === idZone) {
                $scope.zones.splice(i, 1);
            }
        }
    };

    /*Envoi des zones pour le découpage*/
    $scope.sendCrop = function() {

        if ($scope.zones.length < 1) {
            alert('Aucune zone n\'est encore sélectionnéz ... ');
        }

        // Initialiser la table des image découpés
        $scope.cropedImages = [];

        // afficher le loader
        $scope.loader = true;

        // Refactoring
        angular.forEach($scope.zones, function(zone) {

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

        });

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

        console.log('in controller ==> ');
        console.log($scope.currentImage);

        // Appel du websevice de l'ocerisation
        if ($scope.currentImage.source) {
            initialiseZones();
            $scope.loader = true;
            $http.post(configuration.URL_REQUEST + '/oceriser', {
                encodedImg: $scope.currentImage.originalSource
            }).success(function(data) {
                // Ajouter l'objet comportant le text et l'image pour l'affichage sur le workspace
                $scope.textes = {
                    source: $scope.currentImage.source,
                    text: angular.fromJson(data)
                };
                $scope.currentImage.text = angular.fromJson(data);

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

    $scope.modifierTexte = function() {
        if ($scope.currentImage.source) {
            $scope.textes = {
                text: $scope.currentImage.text
            };
            $scope.showEditor = true;
        } else {
            alert('Vous devez selectionner un block ... ');
        }
    };

    $scope.textToSpeech = function() {
        var ocrText = removeAccents(removeHtmlTags($scope.currentImage.text));
        $scope.currentImage.text = ocrText;
        if ($scope.currentImage.text) {
            $scope.loader = true;
            if ($scope.currentImage.text.length > 0) {
                $http.post(configuration.URL_REQUEST + '/texttospeech', {
                    text: $scope.currentImage.text
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
        if (param && param.length > 0 && $scope.flagOcr) {
            return true;
        } else {
            return false;
        }
    };

    $scope.vocalised = function(param) {
        if (param && param.length > 0) {
            console.log('inside vocalised true');
            return true;
        } else {
            return false;
        }
    };

    $scope.flagOcr = false;
    /* WYSIWYG Editor Methods */
    /* Get OCR and save it */
    $scope.getOcrText = function() {
        $rootScope.$emit('getCkEditorValue');
        $scope.currentImage.text = removeHtmlTags($rootScope.ckEditorValue);
        traverseOcrSpeech($scope.blocks);
        console.log($scope.textes);
        // $scope.textes = {};
        // Affichage de l'éditeur
        // $scope.showEditor = false;
        //This line is made to show ocr icon on the bloc
        $scope.flagOcr = true;
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

        $scope.currentImage.source = $sce.trustAsResourceUrl($scope.currentImage.source);
        initialiseZones();
        $scope.textes = {};
        $scope.showEditor = false;
        if (image.tag) {
            $scope.tagSelected = image.tag;
        } else {
            $scope.tagSelected = null;
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

    $scope.saveblocks = function() {
        // Selection des profils
        $http.get(configuration.URL_REQUEST + '/listerProfil')
            .success(function(data) {
                if (data !== 'err') {
                    $scope.listProfils = data;
                }
            });
    };

    $scope.showlocks = function() {
        console.log('show blocks clicked ... ');
        $scope.loader = true;
        var url = configuration.URL_REQUEST + '/index.html';
        var errorMsg1 = 'Veuillez-vous connecter pour pouvoir enregistrer sur Dropbox';
        var errorMsg2 = 'Erreur lors de l\'enregistrement dans Dropbox';
        var errorMsg3 = 'Erreur lors du partage dans Dropbox';
        var confirmMsg = 'Fichier enregistré dans Dropbox avec succès';

        $http.get(configuration.URL_REQUEST + '/profile')
            .success(function(data) {
                if (data.dropbox && data.dropbox.accessToken) {
                    var token = data.dropbox.accessToken;
                    $http.get(url).then(function(response) {
                        response.data = response.data.replace('profilId = null', 'profilId = \'' + $scope.profilSelected + '\'');
                        response.data = response.data.replace('blocks = []', 'blocks = ' + angular.toJson($scope.blocks));
                        if (response.data.length > 0) {
                            var generatedId = generateUniqueId();
                            var apercuName = 'K-L-' + generatedId + '.html';
                            $http({
                                method: 'PUT',
                                url: 'https://api-content.dropbox.com/1/files_put/sandbox/' + ($scope.apercuName || apercuName) + '?access_token=' + token,
                                data: response.data
                            }).success(function() {
                                $http.post('https://api.dropbox.com/1/shares/sandbox/' + ($scope.apercuName || apercuName) + '?short_url=false&access_token=' + token)
                                    .success(function(data) {
                                        var urlDropbox = data.url.replace('https://www.dropbox.com', 'http://dl.dropboxusercontent.com');
                                        urlDropbox += '#/apercu';
                                        console.log(urlDropbox);
                                        var manifestName = 'K-L-' + generatedId + '.manifest';
                                        $http({
                                            method: 'PUT',
                                            url: 'https://api-content.dropbox.com/1/files_put/sandbox/' + ($scope.manifestName || manifestName) + '?access_token=' + token,
                                            data: ''
                                        }).success(function() {
                                            console.log(manifestName + ' enregistré avec succès');
                                            $window.open(urlDropbox);
                                            $scope.loader = false;
                                            alert(confirmMsg);
                                        }).error(function() {
                                            console.log('erreur lors de l\'enregistrement de ' + manifestName);
                                            $scope.loader = false;
                                            alert(errorMsg3);
                                        });
                                    }).error(function() {
                                        $scope.loader = false;
                                        alert(errorMsg3);
                                    });
                            }).error(function() {
                                $scope.loader = false;
                                alert(errorMsg2);
                            });
                        }
                    });
                } else {
                    $scope.loader = false;
                    alert(errorMsg1);
                }
            }).error(function() {
                $scope.loader = false;
                alert(errorMsg1);
            });
    };

    // Selection des tags
    $scope.afficherTags = function() {
        $http.get(configuration.URL_REQUEST + '/readTags')
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
                lien: $scope.pdflink

            }).success(function(data) {
                $scope.showPdfCanvas = true;
                PDFJS.disableWorker = false;

                var pdf = $scope.base64ToUint8Array(data);
                $scope.flagUint8Array = true;
                PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
                    $scope.pdfDoc = _pdfDoc;
                    $scope.loader = false;
                    $scope.pdflinkTaped = '';
                    $scope.addSide();
                });
            }).error(function() {
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
                fd.append('uploadedFile', $scope.files[i]);
            }
            var xhr = new XMLHttpRequest();
            // xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener('load', $scope.uploadComplete, false);
            xhr.addEventListener('error', uploadFailed, false);
            // xhr.addEventListener("abort", uploadCanceled, false);
            xhr.open('POST', '/fileupload');
            $scope.progressVisible = true;
            xhr.send(fd);
            $scope.loader = true;
        } else {
            alert('Vous devez choisir un fichier');
        }

    };

    $scope.uploadComplete = function(evt) {
        $scope.files = [];
        console.log('upload complete');
        //console.log(angular.fromJson(evt.target.responseText));
        var pdf = $scope.base64ToUint8Array(angular.fromJson(evt.target.responseText));
        PDFJS.getDocument(pdf).then(function getPdfHelloWorld(_pdfDoc) {
            $scope.pdfDoc = _pdfDoc;
            $scope.loader = false;
            $scope.pdflinkTaped = '';
            $scope.addSide();
        });
    };

    function uploadFailed(evt) {
        console.log('Erreure survenue lors de l\'pload du fichier ');
        console.log(evt);
    }


});
