/* File: apercu.js
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

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId */
/* global PDFJS ,Promise, CKEDITOR  */
/*jshint unused: false, undef:false */
/*jslint plusplus: true */
(function () {
    'use strict';

    angular.module('cnedApp').controller('ApercuCtrl', function ($scope, $rootScope, $http, $window, $location, $log, $q, $compile, serviceCheck, configuration, dropbox, removeHtmlTags, verifyEmail,
                                                                 generateUniqueId, storageService, ngAudio, ngAudioGlobals, htmlEpubTool, $routeParams, fileStorageService, workspaceService, $anchorScroll) {

        var lineCanvas;

        $scope.player_icones = {
            "increase_volume": configuration.URL_REQUEST + '/styles/images/increase_volume.png',
            "decrease_volume": configuration.URL_REQUEST + '/styles/images/decrease_volume.png',
            "increase_speed": configuration.URL_REQUEST + '/styles/images/increase_speed.png',
            "decrease_speed": configuration.URL_REQUEST + '/styles/images/decrease_speed.png',
            "audio_generate": configuration.URL_REQUEST + '/styles/images/audio_generate.png',
            "stop_sound": configuration.URL_REQUEST + '/styles/images/stop_sound.png',
        };
        $scope.audio = null;
        $scope.audioSpeed = 0.5;
        $scope.currentAudioId = null;
        $scope.idDocument = $routeParams.idDocument;
        $scope.tmp = $routeParams.tmp;
        $scope.url = $routeParams.url;
        $scope.annotationURL = $routeParams.annotation;
        $scope.isEnableNoteAdd = false;
        $scope.showDuplDocModal = false;
        $scope.showRestDocModal = false;
        $scope.showDestination = false;
        $scope.showEmail = false;
        $scope.emailMsgSuccess = '';
        $scope.emailMsgError = '';
        $scope.escapeTest = true;
        $scope.showPartagerModal = true;
        // $scope.volume = 0.5;
        var numNiveau = 0;
        $scope.printPlan = true;

        $('#main_header').show();
        $('#titreDocument').hide();
        $('#detailProfil').hide();
        $('#titreTag').hide();

        $scope.content = [];
        $scope.currentContent = '';
        $scope.currentPage = 0;
        $scope.nbPages = 1;
        $scope.loader = false;

        /**
         *  ---------- Functions  -----------
         */

        $scope.attachFacebook = function () {
            console.log(decodeURIComponent($scope.encodeURI));
            $('.facebook-share .fb-share-button').remove();
            $('.facebook-share span').before('<div class="fb-share-button" data-href="' + decodeURIComponent($scope.encodeURI) + '" data-layout="button"></div>');
            try {
                FB.XFBML.parse();
            } catch (ex) {
                console.log('gotchaa ... ');
                console.log(ex);
            }
        };

        $scope.attachGoogle = function () {
            console.log('IN ==> ');
            var options = {
                contenturl: decodeURIComponent($scope.encodeURI),
                contentdeeplinkid: '/pages',
                clientid: '807929328516-g7k70elo10dpf4jt37uh705g70vhjsej.apps.googleusercontent.com',
                cookiepolicy: 'single_host_origin',
                prefilltext: '',
                calltoactionlabel: 'LEARN_MORE',
                calltoactionurl: decodeURIComponent($scope.encodeURI)
            };

            gapi.interactivepost.render('google-share', options);
        };

        /*
         * Afficher le titre du document.
         */
        $scope.showTitleDoc = function (title) {
            $rootScope.titreDoc = title;
            $scope.docName = title;
            $scope.docSignature = title;
            $('#titreDocumentApercu').show();
        };
        $scope.showTitleDoc();

        /**
         * Affiche la popup de chargement.
         */
        $scope.showLoader = function (msg) {
            $scope.loader = true;
            $scope.loaderMsg = msg;
            $('.loader_cover').show();
        };

        /**
         * Cache la popup de chargement.
         */
        $scope.hideLoader = function () {
            $scope.loader = false;
            $scope.loaderMsg = '';
            $('.loader_cover').hide();
        };

        /* Lire la source audio */
        $scope.playAudio = function (source, blockId) {
            if ($scope.currentAudioId == blockId) {
                $scope.audio.play();
            } else {
                $scope.currentAudioId = blockId;
                ngAudioGlobals.unlock = false;
                $scope.audio = ngAudio.load(source);
                $scope.audioSpeed = 0.5;
                $scope.audio.playbackRate = $scope.audioSpeed;
                $scope.audio.play();
            }
        };

        /* Augmenter le volume du son */
        $scope.increaseVolume = function () {
            if ($scope.audio.volume < 1) {
                $scope.audio.volume += 0.1;
            }
        };
        /* Diminuer le volume du son */
        $scope.decreaseVolume = function () {
            if ($scope.audio.volume > 0.1) {
                $scope.audio.volume -= 0.1;
            }
        };
        /* Augmenter la vitesse du son */
        $scope.increaseSpeed = function () {
            if ($scope.audioSpeed < 1.5) {
                $scope.audioSpeed += 0.1;
                $scope.audio.playbackRate = $scope.audioSpeed;
            }
        };
        /* Diminuer la vitesse du son */
        $scope.decreaseSpeed = function () {
            if ($scope.audioSpeed > 0.5) {
                $scope.audioSpeed -= 0.1;
                $scope.audio.playbackRate = $scope.audioSpeed;
            }
        };

        /*
         * Fixer/Défixer le menu lors du défilement.
         */
        $(window).scroll(function () {
            var dif_scroll = 0;
            if ($('.carousel-inner').offset()) {
                if ($(window).scrollTop() >= $('.carousel-inner').offset().top) {
                    dif_scroll = $(window).scrollTop() - 160;
                    $('.fixed_menu').css('top', dif_scroll + 'px');
                } else {
                    $('.fixed_menu').css('top', 0);
                }
            }


        });

        /*
         * Afficher la zone de saisie de l'email.
         */
        $scope.loadMail = function () {
            $scope.showDestination = true;
        };


        /**
         * Initialiser les paramètres du partage d'un document.
         */
        $scope.clearSocialShare = function () {
            $scope.confirme = false;
            $scope.showDestination = false;
            $scope.destinataire = '';
            $scope.addAnnotation = false;
            if (localStorage.getItem('notes') !== null && $scope.idDocument) {
                var noteList = JSON.parse(JSON.parse(localStorage.getItem('notes')));
                $scope.annotationToShare = [];

                if (noteList.hasOwnProperty($scope.idDocument)) {
                    $scope.addAnnotation = true;
                    $scope.annotationToShare = noteList[$scope.idDocument];
                } else {
                    $scope.addAnnotation = false;
                }
            } else {
                $scope.addAnnotation = false;
            }
        };

        /**
         * Partage du document
         */
        $scope.docPartage = function () {
            localStorage.setItem('lockOperationDropBox', true);
            fileStorageService.searchFiles($scope.idDocument, $rootScope.currentUser.dropbox.accessToken).then(function (filesFound) {
                if (filesFound && filesFound.length !== 0) {
                    $scope.docAPartager = filesFound[0];

                    $log.debug('docAPartager');
                    $log.debug($scope.docAPartager);

                    $scope.docFullName = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec(encodeURIComponent($scope.docAPartager.filepath.replace('/', '')))[0]);
                    fileStorageService.shareFile($scope.docAPartager.filepath, $rootScope.currentUser.dropbox.accessToken).then(function (shareLink) {
                        $scope.docAPartager.lienApercu = configuration.URL_REQUEST + '/#/apercu?url=' + shareLink;
                        $scope.encodeURI = encodeURIComponent($scope.docAPartager.lienApercu);
                        $scope.encodedLinkFb = $scope.docAPartager.lienApercu.replace('#', '%23');
                        localStorage.setItem('lockOperationDropBox', false);
                    });
                }
            });
        };

        /**
         * Partage des annotations pour le partage du document
         */
        $scope.processAnnotation = function () {
            localStorage.setItem('lockOperationDropBox', true);
            if ($scope.annotationOk && $scope.docAPartager && $scope.annotationToShare !== null) {
                var uploadAnnotationPromise = dropbox.upload($scope.docFullName + '.json', $scope.annotationToShare, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                uploadAnnotationPromise.then(function () {
                    var shareAnnotationsPromise = dropbox.shareLink($scope.docFullName + '.json', $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    shareAnnotationsPromise.then(function (result) {
                        $scope.docAPartager.lienApercu += '&annotation=' + result.url;
                        $scope.encodeURI = encodeURIComponent($scope.docAPartager.lienApercu);
                        $scope.attachFacebook();
                        $scope.attachGoogle();
                        localStorage.setItem('lockOperationDropBox', false);
                        $scope.confirme = true;
                    });
                });
            } else {
                localStorage.setItem('lockOperationDropBox', false);
                $scope.confirme = true;
            }
        };

        /*
         * Annuler l'envoi d'un email.
         */
        $scope.dismissConfirm = function () {
            $scope.destinataire = '';
        };

        /*
         * Envoyer l'email au destinataire.
         */
        $scope.sendMail = function () {
            $('#confirmModal').modal('hide');
            var docApartager = $scope.encodeURI;
            $scope.loader = true;
            if ($rootScope.currentUser.dropbox.accessToken && configuration.DROPBOX_TYPE && docApartager) {
                $scope.sharedDoc = $scope.docAPartager.filename;
                $scope.encodeURI = decodeURIComponent($scope.encodeURI);
                $scope.sendVar = {
                    to: $scope.destinataire,
                    content: ' a utilisé cnedAdapt pour partager un fichier avec vous !  ' + $scope.docAPartager.filename,
                    encoded: '<span> vient d\'utiliser CnedAdapt pour partager un fichier avec vous !   <a href=\'' + $scope.encodeURI + '\'>' + $scope.docAPartager.filename + '</a> </span>',
                    prenom: $rootScope.currentUser.local.prenom,
                    fullName: $rootScope.currentUser.local.prenom + ' ' + $rootScope.currentUser.local.nom,
                    doc: $scope.docAPartager.filename
                };
                $http.post(configuration.URL_REQUEST + '/sendMail', $scope.sendVar).then(function () {
                    $('#okEmail').fadeIn('fast').delay(5000).fadeOut('fast');
                    $scope.envoiMailOk = true;
                    $scope.destinataire = '';
                    $scope.loader = false;
                    $scope.showDestination = false;
                }, function () {
                    $scope.envoiMailOk = false;
                    $scope.loader = false;
                });
            }
        };

        /*
         * Partager un document.
         */
        $scope.socialShare = function () {
            $scope.emailMsgSuccess = '';
            $scope.emailMsgError = '';


            if (!$scope.destinataire || $scope.destinataire.length <= 0) {
                $scope.emailMsgError = 'L\'Email est obligatoire!';
                return;
            }
            if (!verifyEmail($scope.destinataire)) {
                $scope.emailMsgError = 'L\'Email est invalide!';
                return;
            }
            $('#confirmModal').modal('show');
            $('#shareModal').modal('hide');

        };

        /*
         * Initialiser les paramètres du duplication d'un document.
         */
        $scope.clearDupliquerDocument = function () {
            $scope.showMsgSuccess = false;
            $scope.showMsgError = false;
            $scope.msgSuccess = '';
            $scope.showMsgError = '';
            var docUrl = decodeURI($location.absUrl());
            docUrl = docUrl.replace('#/apercu', '');
            $scope.duplDocTitre = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
            $('#duplicateDocModal').modal('hide');
        };

        $scope.ete = function () {
            $scope.duplDocTitre = $('#duplDocTitre').val();
        };
        /*
         * Dupliquer un document.
         */
        $scope.dupliquerDocument = function () {



            if ($rootScope.currentUser) {
                console.log($scope.duplDocTitre);
                $('.loader_cover').show();
                $scope.loaderProgress = 10;
                $scope.showloaderProgress = true;
                $scope.loaderMessage = 'Copie du document en cours. Veuillez patienter ';

                var token = $rootScope.currentUser.dropbox.accessToken;
                var newOwnerId = $rootScope.currentUser._id;
                var url = $location.absUrl();
                url = url.replace('#/apercu', '');
                var filePreview = url.substring(url.lastIndexOf('_') + 1, url.lastIndexOf('.html'));
                var newDocName = $scope.duplDocTitre;

                var manifestName = newDocName + '_' + filePreview + '.appcache';
                var apercuName = newDocName + '_' + filePreview + '.html';
                console.log(apercuName);
                console.log(manifestName);
                // var listDocumentDropbox = configuration.CATALOGUE_NAME;
                // $scope.loader = true;
                var msg1 = 'Le document est copié avec succès !';
                var errorMsg1 = 'Le nom du document existe déja!';
                var errorMsg2 = 'Le titre est obligatoire !';
                $scope.msgErrorModal = '';
                $scope.msgSuccess = '';
                $scope.showMsgSuccess = false;
                $scope.showMsgError = false;
                $('#duplDocButton').attr('data-dismiss', 'modal');
                /* Si le titre du document est non renseigné */
                if (!$scope.duplDocTitre || $scope.duplDocTitre.length <= 0) {
                    $scope.msgErrorModal = errorMsg2;
                    $scope.showMsgError = true;
                    $scope.loader = false;
                    $scope.showloaderProgress = false;
                    $('#duplDocButton').attr('data-dismiss', '');
                    return;
                }

                if (!serviceCheck.checkName($scope.duplDocTitre)) {
                    $scope.msgErrorModal = 'Veuillez n\'utiliser que des lettres (de a à z) et des chiffres.';
                    $scope.loader = false;
                    $scope.showMsgError = true;
                    $scope.showloaderProgress = false;
                    $('#duplDocButton').attr('data-dismiss', '');
                    return;
                }
                localStorage.setItem('lockOperationDropBox', true);
                var foundDoc = false;
                var searchApercu = dropbox.search('_' + $scope.duplDocTitre + '_', token, configuration.DROPBOX_TYPE);
                searchApercu.then(function (result) {
                    $scope.loaderProgress = 30;
                    for (var i = 0; i < result.length; i++) {
                        if (result[i].path.indexOf('.html') > 0 && result[i].path.indexOf('_' + $scope.duplDocTitre + '_') > 0) {
                            foundDoc = true;
                            break;
                        }
                    }
                    if (foundDoc) {
                        /* Si le document existe déja dans votre Dropbox */
                        $scope.showMsgError = true;
                        $scope.msgErrorModal = errorMsg1;
                        $scope.showloaderProgress = false;
                        $scope.loaderProgress = 100;
                        $scope.loader = false;
                        $('#duplDocButton').attr('data-dismiss', '');
                        $('#duplicateDocModal').modal('show');
                        localStorage.setItem('lockOperationDropBox', false);
                        if ($rootScope.titreDoc === 'Apercu Temporaire') {
                            localStorage.setItem('lockOperationDropBox', true);
                        }
                    } else {
                        $scope.showloaderProgress = true;
                        $('.loader_cover').show();
                        console.log('i need to see loader');
                        //$scope.loader = true;
                        var dateDoc = new Date();
                        dateDoc = dateDoc.getFullYear() + '-' + (dateDoc.getMonth() + 1) + '-' + dateDoc.getDate();
                        apercuName = dateDoc + '_' + apercuName;
                        manifestName = dateDoc + '_' + manifestName;
                        $http.get(configuration.URL_REQUEST + '/listDocument.appcache').then(function (response) {
                            var uploadManifest = dropbox.upload(($scope.manifestName || manifestName), response.data, token, configuration.DROPBOX_TYPE);
                            uploadManifest.then(function (result) {
                                $scope.loaderProgress = 50;
                                if (result) {
                                    var shareManifest = dropbox.shareLink(($scope.manifestName || manifestName), token, configuration.DROPBOX_TYPE);
                                    shareManifest.then(function (result) {
                                        $scope.loaderProgress = 70;
                                        if (result) {
                                            var urlManifest = result.url;
                                            $http.get(($scope.url || url)).then(function (resDocDropbox) {
                                                $scope.loaderProgress = 80;
                                                var docDropbox = resDocDropbox.data;
                                                docDropbox = docDropbox.replace(docDropbox.substring(docDropbox.indexOf('manifest="'), docDropbox.indexOf('.appcache"') + 10), 'manifest="' + urlManifest + '"');
                                                docDropbox = docDropbox.replace('ownerId = \'' + ownerId + '\'', 'ownerId = \'' + newOwnerId + '\'');
                                                var uploadApercu = dropbox.upload(($scope.apercuName || apercuName), docDropbox, token, configuration.DROPBOX_TYPE);
                                                uploadApercu.then(function (result) {
                                                    $scope.loaderProgress = 85;
                                                    var listDocument = result;
                                                    var shareApercu = dropbox.shareLink(($scope.apercuName || apercuName), token, configuration.DROPBOX_TYPE);
                                                    shareApercu.then(function (result) {
                                                        $scope.loaderProgress = 90;
                                                        localStorage.setItem('lockOperationDropBox', false);
                                                        if ($rootScope.titreDoc === 'Apercu Temporaire') {
                                                            localStorage.setItem('lockOperationDropBox', true);
                                                        }
                                                        if (result) {
                                                            $scope.docTitre = '';
                                                            listDocument.lienApercu = result.url + '#/apercu';
                                                            $scope.loaderProgress = 100;
                                                            $scope.showloaderProgress = false;
                                                            $scope.loader = false;
                                                            $scope.showMsgSuccess = true;
                                                            $scope.msgSuccess = msg1;
                                                            $('#duplDocButton').attr('data-dismiss', '');
                                                            $('#duplicateDocModal').modal('show');
                                                        }
                                                    });
                                                });
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


        /**
         *  ---------- Process Annotation -----------
         */

        $scope.checkAnnotations = function () {
            if ($scope.annotationURL) {
                $http.get($scope.annotationURL).success(function (data) {
                    var noteList = {};
                    var annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($scope.annotationURL)[9]);
                    $scope.docSignature = annotationKey;
                    if (localStorage.getItem('notes') !== null) {
                        noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                        noteList[annotationKey] = data;
                        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                    } else {
                        noteList = {};
                        noteList[annotationKey] = data;
                        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                    }
                    $scope.restoreNotesStorage();
                });

            }
        }

        $scope.applySharedAnnotation = function () {
            if ($scope.annotationURL) {
                $http.get($scope.annotationURL)
                    .success(function (data) {
                        var annotationKey = $scope.annotationDummy;
                        var noteList = {};

                        if (!$scope.testEnv) {
                            annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($scope.annotationURL)[0]);
                        }
                        if (localStorage.getItem('notes') !== null) {
                            noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                            noteList[annotationKey] = data;
                            localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                        } else {
                            noteList = {};
                            noteList[annotationKey] = data;
                            localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                        }
                        $('#AnnotationModal').modal('hide');

                    });
            }
        };



        /* Debut Gestion des annotations dans l'apercu */
        $scope.notes = [];

        /*
         * Dessiner les lignes de toutes les annotations.
         */
        $scope.drawLine = function () {
            if (!lineCanvas) {
                // set the line canvas to the width and height of the carousel
                lineCanvas = $('#line-canvas');
                $('#line-canvas').css({
                    position: "absolute",
                    width: $('#carouselid').width(),
                    height: $('#carouselid').height()
                });
            }
            $('#line-canvas div').remove();
            if ($scope.notes.length > 0) {
                for (var i = 0; i < $scope.notes.length; i++) {
                    if ($scope.notes[i].idPage === $scope.currentPage) {
                        $('#line-canvas').line($scope.notes[i].xLink + 65, $scope.notes[i].yLink + 25, $scope.notes[i].x, $scope.notes[i].y + 20, {
                            color: '#747474',
                            stroke: 1,
                            zindex: 10
                        });
                    }
                }
            }
        };

        /*
         * Récuperer la liste des annotations de localStorage et les afficher dans l'apercu.
         */
        $scope.restoreNotesStorage = function ( /*idx*/ ) {
            $scope.notes = workspaceService.restoreNotesStorage($scope.docSignature);
            $scope.drawLine();
        };

        /*
         * Retourner le numero de l'annotation suivante.
         */

        function getNoteNextID() {
            if (!$scope.notes.length) {
                return (1);
            }
            var lastNote = $scope.notes[$scope.notes.length - 1];
            return (lastNote.idInPage + 1);
        }

        /*
         * Ajouter une annotation dans la position (x,y).
         */
        $scope.addNote = function (x, y) {
            var idNote = generateUniqueId();
            var idInPage = getNoteNextID();
            var defaultX = $('.adaptContent').width() + 50;
            //var defaultW = defaultX + $('#noteBlock2').width();
            var defaultY = y - 40;
            if (defaultY < 0) {
                defaultY = 0;
            }
            var newNote = {
                idNote: idNote,
                idInPage: idInPage,
                idDoc: $scope.docSignature,
                idPage: $scope.currentPage,
                texte: 'Note',
                x: defaultX,
                y: defaultY,
                xLink: x,
                yLink: y
            };

            //texte: 'Note ' + idInPage,
            //newNote.styleNote = '<p ' + $scope.styleAnnotation + '> ' + newNote.texte + ' </p>';

            $scope.notes.push(newNote);
            $scope.drawLine();

            var notes = [];
            var mapNotes = {};
            if (localStorage.getItem('notes')) {
                mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                if (mapNotes.hasOwnProperty($scope.docSignature)) {
                    notes = mapNotes[$scope.docSignature];
                }
            }
            notes.push(newNote);
            mapNotes[$scope.docSignature] = notes;
            var element = [];
            element.push({
                name: 'notes',
                value: JSON.stringify(angular.toJson(mapNotes))
            });
            var t = storageService.writeService(element, 0);
            t.then(function (data) {});
            //localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        };

        /*
         * Supprimer l'annotation de localStorage.
         */
        $scope.removeNote = function (note) {
            var index = $scope.notes.indexOf(note);
            $scope.notes.splice(index, 1);
            $scope.drawLine();

            var notes = [];
            var mapNotes = {};
            if (localStorage.getItem('notes')) {
                mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                notes = mapNotes[$scope.docSignature];
                var idx = -1;
                for (var i = 0; i < notes.length; i++) {
                    if (notes[i].idNote === note.idNote) {
                        idx = i;
                        break;
                    }
                }
                notes.splice(idx, 1);
                if (notes.length > 0) {
                    mapNotes[$scope.docSignature] = notes;
                } else {
                    delete mapNotes[$scope.docSignature];
                }
                localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
            }
        };

        $scope.styleDefault = 'data-font="" data-size="" data-lineheight="" data-weight="" data-coloration=""';

        /*
         * Fonction déclanchée lors du collage du texte dans l'annotation.
         */
        $scope.setPasteNote = function ($event) {
            /* Le texte recuperé du presse-papier est un texte brute */
            if ($scope.testEnv === false) {
                document.execCommand('insertText', false, $event.originalEvent.clipboardData.getData('text/plain'));
                $event.preventDefault();
            }
            $scope.pasteNote = true;
        };


        $scope.prepareNote = function (note, $event) {
            var currentAnnotation = $($event.target);
            currentAnnotation.attr('contenteditable', 'true');
            currentAnnotation.css('line-height', 'normal');
            currentAnnotation.css('font-family', 'helveticaCND, arial');

            /*
             var isPlaceHolder = note.texte.match(/Note/g);
             if (isPlaceHolder) {
             note.styleNote = '<p></p>';
             } else {
             note.styleNote = '<p>' + note.texte + '</p>';
             }
             */
            currentAnnotation.removeClass('edit_status');
            currentAnnotation.addClass('save_status');
        };

        $scope.autoSaveNote = function (note, $event) {
            var currentAnnotation = angular.element($event.target);
            note.texte = currentAnnotation.html();
            $scope.editNote(note);
        };

        /*
         * Modifier une annotation.
         */
        $scope.editNote = function (note) {
            var notes = [];
            var mapNotes = {};
            if (localStorage.getItem('notes')) {
                mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                notes = mapNotes[$scope.docSignature];
            }
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].idNote === note.idNote) {
                    notes[i] = note;
                    mapNotes[$scope.docSignature] = notes;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
                    break;
                }
            }
        };

        /*
         * Permettre d'ajouter une annotation.
         */
        $scope.enableNoteAdd = function () {
            $scope.isEnableNoteAdd = true;
        };

        /*
         * Ajouter une annotation dans l'apercu lors du click.
         */
        $scope.addNoteOnClick = function (event) {

            if ($scope.isEnableNoteAdd && $scope.currentPage && $scope.currentPage !== 0) {

                if ($('.open_menu').hasClass('shown')) {
                    $('.open_menu').removeClass('shown');
                    $('.open_menu').parent('.menu_wrapper').animate({
                        'margin-left': '160px'
                    }, 100);
                    $('.zoneID').css('z-index', '9');
                }

                var parentOffset = $(event.currentTarget).offset();
                var relX = event.pageX - parentOffset.left - 30;
                var relY = event.pageY - parentOffset.top - 40;
                $scope.addNote(relX, relY);
                $scope.isEnableNoteAdd = false;
            }
        };
        /*
         * Réduire/Agrandir une annotation.
         */
        $scope.collapse = function ($event) {
            if (angular.element($event.target).parent('td').prev('.annotation_area').hasClass('opened')) {
                angular.element($event.target).parent('td').prev('.annotation_area').removeClass('opened');
                angular.element($event.target).parent('td').prev('.annotation_area').addClass('closed');
                angular.element($event.target).parent('td').prev('.annotation_area').css('height', 36 + 'px');
            } else {
                angular.element($event.target).parent('td').prev('.annotation_area').removeClass('closed');
                angular.element($event.target).parent('td').prev('.annotation_area').addClass('opened');
                angular.element($event.target).parent('td').prev('.annotation_area').css('height', 'auto');
            }
        };



        $scope.supprimeDocument = function () {
            localStorage.setItem('lockOperationDropBox', true);

            if (localStorage.getItem('compteId')) {
                var tmp2 = dropbox.delete('/' + $scope.deleteLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                tmp2.then(function () {
                    var appcacheLink = $scope.deleteLink;
                    appcacheLink = appcacheLink.replace('.html', '.appcache');

                    var tmp12 = dropbox.delete('/' + appcacheLink, $rootScope.currentUser.dropbox.accessToken, configuration.DROPBOX_TYPE);
                    tmp12.then(function (deleteResult) {

                    });
                });

            }
        };



        /**
         *  ---------- Process Navigation OK -----------
         */


        /*
         * Aller au Slide de position id.
         */
        $scope.setActive = function (event, id, block) {

            if (id <= $scope.nbPages) {
                $scope.currentPage = id;
                $scope.currentContent = $scope.content[$scope.currentPage];
                $location.hash(block);
                //$anchorScroll();
            }
        };


        /*
         * Afficher/Masquer le menu escamotable.
         */
        $scope.afficherMenu = function () {
            if ($('.open_menu').hasClass('shown')) {
                $('.open_menu').removeClass('shown');
                $('.open_menu').parent('.menu_wrapper').animate({
                    'margin-left': '160px'
                }, 100);
                $('.zoneID').css('z-index', '9');


            } else {
                $('.open_menu').addClass('shown');
                $('.open_menu').parent('.menu_wrapper').animate({
                    'margin-left': '0'
                }, 100);
                $('.zoneID').css('z-index', '8');
            }
        };

        /*
         * Aller au precedent.
         */
        $scope.precedent = function () {
            if (($scope.currentPage - 1) >= 0) {
                $scope.currentPage--;
                $scope.currentContent = $scope.content[$scope.currentPage];
                $scope.drawLine();
            }
        };

        /*
         * Aller au suivant.
         */
        $scope.suivant = function () {
            if (($scope.currentPage + 1) < $scope.content.length) {
                $scope.currentPage++;
                $scope.currentContent = $scope.content[$scope.currentPage];
                $scope.drawLine();
            }
        };

        /*
         * Aller au dernier.
         */
        $scope.dernier = function () {
            $scope.currentPage = $scope.content.length - 1;
            $scope.currentContent = $scope.content[$scope.currentPage];
            $scope.drawLine();
        };

        /*
         * Aller au premier.
         */
        $scope.premier = function () {
            $scope.currentPage = 1;
            $scope.currentContent = $scope.content[$scope.currentPage];
            $scope.drawLine();
        };

        /*
         * Aller au plan.
         */
        $scope.plan = function () {
            $scope.currentPage = 0;
            $scope.currentContent = $scope.content[$scope.currentPage];
            $scope.drawLine();
        };



        /**
         *  ---------- Process Print -----------
         */


        /*
         * Initialiser les pages de début et fin lors de l'impression.
         */
        $scope.selectionnerMultiPage = function () {
            $scope.pageA = 1;
            $scope.pageDe = 1;
            $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text('1');
            $('select[data-ng-model="pageA"]').val(1);
            $('select[data-ng-model="pageDe"] + .customSelect .customSelectInner').text('1');
            $('select[data-ng-model="pageDe"]').val(1);
        };

        /*
         * Selectionner la page de début pour l'impression.
         */
        $scope.selectionnerPageDe = function () {

            $scope.pageDe = parseInt($('select[data-ng-model="pageDe"]').val());
            $scope.pageA = parseInt($('select[data-ng-model="pageA"]').val());


            if ($scope.pageDe > $scope.pageA) {
                $scope.pageA = $scope.pageDe;
                $('select[data-ng-model="pageA"] + .customSelect .customSelectInner').text($scope.pageA);
                $('select[data-ng-model="pageA"]').val($scope.pageA);
            }

            var pageDe = parseInt($scope.pageDe);
            $('select[data-ng-model="pageA"] option').prop('disabled', false);

            for (var i = 0; i <= pageDe - 1; i++) {
                $('select[data-ng-model="pageA"] option').eq(i).prop('disabled', true);
            }
        };

        var PRINTMODE = {
            EVERY_PAGES: 0,
            CURRENT_PAGE: 1,
            MULTIPAGE: 2
        };

        /*
         * Imprimer le document selon le mode choisi.
         */
        $scope.printByMode = function () {
            var printPlan = $scope.printPlan ? 1 : 0;

            var printURL = '#/print?documentId=' + $scope.docSignature + '&plan=' + printPlan + '&mode=' + $scope.printMode;
            if ($scope.printMode === PRINTMODE.CURRENT_PAGE) {
                printURL += ('&page=' + $scope.currentPage);
            } else if ($scope.printMode === PRINTMODE.MULTIPAGE) {
                printURL += ('&pageDe=' + $scope.pageDe + '&pageA=' + $scope.pageA);
            }
            $window.open(printURL);
        };


        /**
         *  ---------- Process Génération du document -----------
         */

        /**
         * Aller au lien
         * @param lien
         * @method  $scope.goToLien
         */
        $scope.goToLien = function (lien) {
            $window.location.href = lien;
            $window.location.reload();
        };

        /**
         *  ---------- Process Peuplement -----------
         */


        /**
         * Récupération du contenu html d'une page
         * @method $scope.getHTMLContent
         * @param {String} url
         * @return Promise
         */
        $scope.getHTMLContent = function (url) {
            $scope.initDone = false;
            return serviceCheck.htmlPreview(url).then(htmlEpubTool.cleanHTML).then(function (resultClean) {
                //Applatissement du DOM via CKeditor
                var ckConfig = {};
                ckConfig.on = {
                    instanceReady: function () {
                        var editor = CKEDITOR.instances.virtualEditor;
                        editor.setData(resultClean);
                        var html = editor.getData();
                        $scope.$apply(function () {
                            workspaceService.parcourirHtml(html);
                            $scope.currentContent = $scope.content[$scope.currentPage];
                        });

                    }
                };
                CKEDITOR.inline('virtualEditor', ckConfig);
            }, function () {
                $scope.currentContent = '<p>Le document n\'a pas pu être chargé.</p>';
            });
        };

        /**
         * Récupération du contenu html d'un doc
         * @method $scope.getDocContent
         * @param {String} idDocument
         * @return Promise
         */
        $scope.getDocContent = function (idDocument) {
            var deferred = $q.defer();
            serviceCheck.getData().then(function (result) {
                var token = '';
                if (result.user && result.user.dropbox) {
                    token = result.user.dropbox.accessToken;
                }
                return fileStorageService.getFile(idDocument, token);
            }).then(function (data) {
                var content = workspaceService.parcourirHtml(data, $scope.urlHost, $scope.urlPort);
                deferred.resolve(content);
            });


            return deferred.promise;
        };

        /**
         * Récupération du contenu html tmp depuis le localStorage
         * @method $scope.getTmpContent
         * @return Promise
         */
        $scope.getTmpContent = function () {
            return fileStorageService.getTempFile().then(function (data) {
                $scope.content = workspaceService.parcourirHtml(data);
            });
        };

        /**
         * Ouvre le document dans l'éditeur
         * @method $scope.editer
         */
        $scope.editer = function () {
            $window.location.href = configuration.URL_REQUEST + '/#/addDocument?idDocument=' + $scope.idDocument;
        };


        /**
         * Génère le document en fonction de l'url ou de l'id du doc
         * @method $scope.init
         */
        $scope.init = function () {
            $scope.showLoader('Chargement du document en cours.')

            // Supprime l'editeur
            $scope.destroyCkeditor();

            $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');

            // Désactive la creation automatique des editeurs inline
            $scope.disableAutoInline();

            $scope.currentPage = 0;

            //Apercu d'une Url
            if ($scope.url) {
                var parser = document.createElement('a');
                parser.href = $scope.url;
                $scope.urlHost = parser.hostname;
                $scope.urlPort = 443;
                $scope.url = decodeURIComponent($scope.url);
                $scope.url = workspaceService.cleanAccent($scope.url);
                $scope.getHTMLContent($scope.url).then(function () {
                    $scope.hideLoader();
                    $scope.showTitleDoc($scope.url);
                    $scope.restoreNotesStorage();
                    $scope.checkAnnotations();
                }, function () {
                    $scope.hideLoader();
                });
            }

            //Apercu depuis un doc
            if ($scope.idDocument) {
                var contentGet = $scope.getDocContent($scope.idDocument)
                contentGet.then(function (data) {
                    $scope.content = data;
                    $scope.currentContent = $scope.content[$scope.currentPage];
                    $scope.showTitleDoc($scope.idDocument);
                    $scope.showEditer = true;
                    $scope.hideLoader();
                    $scope.restoreNotesStorage();
                }, function () {
                    $scope.hideLoader();
                });
            }

            //Apercu temporaire
            if ($scope.tmp) {
                $scope.getTmpContent().then(function () {
                    $scope.currentContent = $scope.content[$scope.currentPage];
                    $scope.showTitleDoc('Aperçu Temporaire');
                    $scope.hideLoader();
                }, function () {
                    $scope.hideLoader();
                });
            }

        };


        /**
         * Desactivation de la creation automatique des editeurs inline
         * @method $scope.disableAutoInline
         */
        $scope.disableAutoInline = function () {
            CKEDITOR.disableAutoInline = true;
        };

        $scope.destroyCkeditor = function () {
            for (var name in CKEDITOR.instances) {
                CKEDITOR.instances[name].destroy();
            }
        };

        $rootScope.$on('profilChanged', function () {
            $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
        });

        $scope.init();

    });
}());
