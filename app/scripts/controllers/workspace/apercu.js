/* File: apercu.js
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

/*jshint loopfunc:true*/
/*global $:false, blocks, ownerId */
/* global PDFJS ,Promise, gapi  */
/*jshint unused: false, undef:false */
/* global
 FB
 */
'use strict';

angular.module('cnedApp')
    .controller('ApercuCtrl', function ($scope, $rootScope, $http, $window, $location,
                                        $log, $q, serviceCheck,
                                        htmlEpubTool, $stateParams,
                                        fileStorageService, workspaceService, $timeout, speechService,
                                        keyboardSelectionService, $uibModal, canvasToImage, tagsService, documentService,
                                        gettextCatalog, $localForage, UtilsService, LoaderService, Analytics, ToasterService, $state) {

        $scope.idDocument = $stateParams.idDocument;
        $scope.tmp = $stateParams.tmp;
        $scope.url = $stateParams.url;
        $scope.urlTitle = $stateParams.title; // Web adapt case
        $scope.annotationURL = $stateParams.annotation;
        $scope.isEnableNoteAdd = false;
        $scope.showPartagerModal = true;
        $scope.printPlan = true;

        $scope.pageBreakElement = '<hr/>';
        $scope.content = [];
        $scope.currentContent = '';
        $scope.currentPage = 1;
        $scope.isSummaryActive = false;
        /*
         * display information for the availability of voice synthesis.
         */
        $scope.neverShowBrowserNotSupported = false;
        $scope.neverShowNoAudioRights = false;
        $scope.neverShowOfflineSynthesisTips = false;
        $scope.resizeDocApercu = 'Agrandir';

        if (!$stateParams.mode || $stateParams.mode === 'lecture') {
            $scope.modeImpression = true;
        } else if ($stateParams.mode === 'page') {
            $scope.modeImpression = false;
        }
        $scope.numeroPageRechercher = 0;
        $scope.applyRulesAfterRender = false;

        $scope.originalHtml = '';

        $scope.document = null;

        /**
         * ---------- Functions -----------
         */

        /*
         * Display the title of the document
         */

        $scope.showTitleDoc = function (title) {
            $log.debug('showTitleDoc - param.title', title);
            // extract document's title from URl, the tile is between '_'
            $rootScope.titreDoc = title.substring(title.indexOf('_') + 1, title.lastIndexOf('_'));
            $scope.docName = title;
            $scope.docSignature = title;

            if (!$rootScope.titreDoc) {
                $rootScope.titreDoc = $scope.docName;
            }
        };

        /*
         * Make / Scroll the menu while scrolling.
         */
        jQuery(window).scroll(function () {
            var dif_scroll = 0;
            if (angular.element(document.querySelector('#page-content'))[0]) {
                if ($(window).scrollTop() >= angular.element(document.querySelector('#page-content'))[0].offsetTop) {
                    if (!$scope.modeImpression) {
                        dif_scroll = jQuery(window).scrollTop() - 120;
                    } else {
                        dif_scroll = jQuery(window).scrollTop() - 70;
                    }

                    jQuery('.fixed_menu').css('top', dif_scroll + 'px');
                } else {
                    jQuery('.fixed_menu').css('top', 0);
                }
            }

        });


        /**
         * ---------- Process Annotation -----------
         */

        $scope.checkAnnotations = function () {
            if ($scope.annotationURL) {
                $http.get($scope.annotationURL).success(function (data) {
                    var noteList = {};
                    $scope.docSignature = $scope.urlTitle;
                    if (localStorage.getItem('notes') !== null) {
                        noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                        noteList[$scope.urlTitle] = data;
                        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                    } else {
                        noteList = {};
                        noteList[$scope.urlTitle] = data;
                        localStorage.setItem('notes', JSON.stringify(angular.toJson(noteList)));
                    }
                    $scope.restoreNotesStorage();
                });

            }
        };

        /* The beginning of the management of notes in the overview */
        $scope.notes = [];

        /*
         * Get the list of the notes of localStorage
         * and show them in the overview.
         */
        $scope.restoreNotesStorage = function (/* idx */) {
            $log.debug('$scope.docSignature', $scope.docSignature);
            $scope.notes = workspaceService.restoreNotesStorage($scope.docSignature);
        };

        /*
         * Add a note in the position (x, y, xLink, yLink).
         */
        $scope.addNote = function (x, y, xLink, yLink) {
            var idNote = UtilsService.generateUniqueId();

            var newNote = {
                idNote: idNote,
                idDoc: $scope.docSignature,
                idPage: $scope.currentPage,
                texte: 'Note',
                x: x,
                y: y,
                xLink: xLink,
                yLink: yLink
            };

            $scope.notes.push(newNote);

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

            localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
        };

        /*
         * Delete the note of localStorage.
         */
        $scope.removeNote = function (note) {
            var index;
            for (var y = 0; y < $scope.notes.length; y++) {
                if ($scope.notes[y].idNote === note.idNote && $scope.notes[y].idInPage === note.idInPage && $scope.notes[y].idPage === note.idPage) {
                    index = y;
                    break;
                }
            }
            angular.element(document.querySelector('#line-canvas-' + $scope.notes[index].idNote)).remove();
            $scope.notes.splice(index, 1);

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


        /*
         * Function activated during the collage of the text in the note.
         */
        $scope.setPasteNote = function ($event) {
            /* The recovered text from the clipboard is a plain text. */
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
            currentAnnotation.removeClass('edit_status');
            currentAnnotation.addClass('save_status');
        };

        $scope.autoSaveNote = function (note, $event) {
            var currentAnnotation = angular.element($event.target);
            note.texte = currentAnnotation.html();
            $scope.editNote(note);
        };

        /*
         * Modify a note
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
                    if ($scope.modeImpression) {
                        notes[i].texte = note.texte;
                        // Amend also the list of note already preloaded through
                        // restoreNote.
                        $scope.notes[i].texte = note.texte;
                    } else {
                        notes[i] = note;
                        $scope.notes[i] = note;
                    }
                    mapNotes[$scope.docSignature] = notes;
                    localStorage.setItem('notes', JSON.stringify(angular.toJson(mapNotes)));
                    break;
                }
            }
        };

        /*
         * Allow to add a note.
         */
        $scope.enableNoteAdd = function () {
            $scope.isEnableNoteAdd = true;
        };

        /*
         * Disable note mode.
         */
        $scope.disableNoteAdd = function () {
            $scope.isEnableNoteAdd = false;

            $log.debug('$scope.isEnableNoteAdd', $scope.isEnableNoteAdd);
        };

        /*
         * add a note in the overview at the click in consultation mode.
         */
        $scope.addNoteOnClick = function (event, index) {

            if ($scope.isEnableNoteAdd) {
                if ($('.open_menu').hasClass('shown')) {
                    $('.open_menu').removeClass('shown');
                    $('.open_menu').parent('.menu_wrapper').animate({
                        'left': '160px'
                    }, 100);
                    $('.open_menu').parent('.menu_wrapper').parent('.fixed_menu').css({
                        'z-index': '7'
                    });
                }

                if ($scope.modeImpression) {
                    $scope.currentPage = index;
                }

                var parentOffset = $(event.currentTarget).offset();

                var xLink = (event.pageX - 21 - parentOffset.left) / $(event.currentTarget).width() * 100;
                var yLink = (event.pageY - 32 - parentOffset.top) / $(event.currentTarget).height() * 100;

                var x = 101;
                var y = yLink;

                $scope.addNote(x, y, xLink, yLink);
            }
        };

        /*
         * Reduce / enlarge a note.
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

        /**
         * ---------- Process Navigation OK -----------
         */


        /*
         * Show / Hide the retractable menu.
         */
        $scope.afficherMenu = function () {
            if ($('.open_menu').hasClass('shown')) {
                $('.open_menu').removeClass('shown');
                $('.open_menu').parent('.menu_wrapper').animate({
                    'left': '160px'
                }, 100);
                $('.open_menu').parent('.menu_wrapper').parent('.fixed_menu').css({
                    'z-index': '7'
                });

            } else {
                $('.open_menu').addClass('shown');
                $('.open_menu').parent('.menu_wrapper').animate({
                    'left': '0'
                }, 100);
                $('.open_menu').parent('.menu_wrapper').parent('.fixed_menu').css({
                    'z-index': '9'
                });
            }
        };

        $scope.resetLines = function () {
            angular.element(document.getElementsByClassName("canvas-container")).find('div').find('div').remove();
            $scope.$emit('redrawLines');
        };

        /**
         * Go to the page pageIndex
         */
        $scope.setPage = function (pageIndex) {

            $scope.resetLines();

            if (pageIndex >= 0 && pageIndex < $scope.content.length) {
                $scope.currentPage = pageIndex;
                $scope.currentContent = $scope.content[$scope.currentPage];
                $scope.numeroPageRechercher = pageIndex;
                window.scroll(0, 0);
            }

            if (pageIndex > 0) {
                $scope.isSummaryActive = false;
            }
        };

        /**
         * Go to previous page
         */
        $scope.precedent = function () {
            if ($scope.currentPage > 1) {
                $scope.setPage($scope.currentPage - 1);
            }
        };

        /**
         * Go to the next page.
         */
        $scope.suivant = function () {
            if ($scope.currentPage < ($scope.content.length - 1)) {
                $scope.setPage($scope.currentPage + 1);
            }
        };

        /**
         * Go to the last page.
         */
        $scope.dernier = function () {
            if ($scope.currentPage < ($scope.content.length - 1)) {
                $scope.setPage($scope.content.length - 1);
            }
        };

        /*
         * Go to the first page.
         */
        $scope.premier = function () {
            if ($scope.currentPage > 1) {
                $scope.setPage(1);
            }
        };


        /**
         *Go to the plan.
         */
        $scope.plan = function () {

            $scope.isSummaryActive = !$scope.isSummaryActive;

            if ($scope.isSummaryActive) {
                $scope.setPage(0);
            } else {
                $scope.setPage(1);
            }
        };

        /**
         * ---------- Process Print -----------
         */

        $scope.openPrintModal = function () {
            $uibModal.open({
                templateUrl: 'views/workspace/print.modal.html',
                controller: 'PrintModalCtrl',
                size: 'md',
                resolve: {
                    content: function () {
                        return $scope.content;
                    },
                    docSignature: function () {
                        return $scope.docSignature;
                    },
                    notes: function () {
                        return $scope.notes;
                    }
                }
            });
        };


        /**
         * ---------- Process of generation of the document -----------
         */

        /**
         * ---------- Process of populating -----------
         */

        /**
         * Load the npages of the pdf as a image in the editor
         *
         * @param pdf
         *            the pdf to load
         * @param le
         *           the page number from which to load the pdf
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
                        LoaderService.hideLoader();
                        $scope.$apply();
                        console.log(error);
                    } else {
                        new Promise(function (resolve) {
                            var dataURL = canvasToImage(canvas, context, '#FFFFFF');
                            if (dataURL) {
                                $scope.pdfTohtml.push('<img src="' + dataURL + '" />');
                                pageNumber++;
                                if (pageNumber <= pdf.numPages) {
                                    $scope.pdfTohtml.push($scope.pageBreakElement);
                                    $scope.loadPdfPage(pdf, pageNumber);
                                } else {
                                    var resultClean = $scope.pdfTohtml.filter(function (element) {
                                        return !!element;
                                    });
                                    resultClean = resultClean.join(' ');
                                    window.scrollTo(0, 0);
                                    LoaderService.hideLoader();
                                    $scope.showTitleDoc($scope.urlTitle);
                                    $scope.restoreNotesStorage();
                                    $scope.checkAnnotations();
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
         * This function allows to handle a pdf by the bookmarklet.
         */
        $scope.loadPdfByLien = function (url) {
            var contains = (url.indexOf('https') > -1); // true
            if (contains === false) {
                $scope.serviceNode = '/sendPdf';
            } else {
                $scope.serviceNode = '/sendPdfHTTPS';
            }
            $http.post($scope.serviceNode, {
                lien: url,
                id: localStorage.getItem('compteId')
            }).success(function (data) {
                var pdfbinary = UtilsService.base64ToUint8Array(data);
                PDFJS.getDocument(pdfbinary).then(function (pdf) {
                    $scope.pdfTohtml = [];
                    $scope.loadPdfPage(pdf, 1);
                });
            }).error(function () {
                LoaderService.hideLoader();
            });
        };


        var test = function (htmlContent) {

            $log.debug('test flattenng web page', htmlContent);


            var root = angular.element('<div>' + htmlContent + '</div>');


            var test = htmlContent;

            test = test.replace(/(<div(?:.*?)>)/gi, '');
            test = test.replace(/(<\/div>)/gi, '');


            $log.debug('DOM element AFTER', test);

        };


        /**
         * Recover the html contents of a page
         *
         * @method $scope.getHTMLContent
         * @param {String}
         *            url
         * @return Promise
         */
        $scope.getHTMLContent = function (url) {
            $scope.initDone = false;
            // Encoding of the URL before the sending otherwise the service does not accept
            // accents
            return serviceCheck.htmlPreview(encodeURI(url)).then(function (htmlFile) {


                if (htmlFile && htmlFile.documentHtml && htmlFile.documentHtml.indexOf('<title>') > -1) {
                    $scope.urlTitle = UtilsService.cleanUpSpecialChars(htmlFile.documentHtml.substring(htmlFile.documentHtml.indexOf('<title>') + 7, htmlFile.documentHtml.indexOf('</title>')));
                    htmlFile.documentHtml = processLink(htmlFile.documentHtml);
                } else if (!$scope.urlTitle) {
                    $scope.urlTitle = UtilsService.cleanUpSpecialChars(url);
                }

                return htmlEpubTool.cleanHTML(htmlFile);

            }).then(function (resultClean) {

                $scope.originalHtml = resultClean;

                $scope.content = workspaceService.parcourirHtml(resultClean, $scope.urlHost, $scope.urlPort);
                $scope.setPage($scope.currentPage);
            }, function (err) {
                $log.error('err transform html', err);
                UtilsService.showInformationModal('Erreur technique', 'L\'import du document a échoué. Une erreur technique est survenue.', null, true);
            });
        };

        /**
         * open the document in the editor
         *
         * @method $scope.editer
         */
        $scope.editer = function () {
            $window.location.href = '/#/addDocument?idDocument=' + $scope.idDocument;
        };

        /**
         * This function loads  an image by the bookmarklet
         */
        $scope.loadPictureByLink = function (url) {
            var resultClean = '<img src="' + url + '">';

            $scope.content = workspaceService.parcourirHtml(resultClean, $scope.urlHost, $scope.urlPort);
            $scope.setPage($scope.currentPage);
            LoaderService.hideLoader();
            $scope.showTitleDoc($scope.urlTitle);
            $scope.restoreNotesStorage();
            $scope.checkAnnotations();
        };

        /**
         * Generate the document according to the url or the id of the doc
         *
         * @method $scope.init
         */
        $scope.init = function () {
            LoaderService.showLoader('document.message.info.load', false);

            $scope.originalHtml = '';
            $scope.isSummaryActive = false;

            if ($scope.urlTitle) {
                $scope.urlTitle = UtilsService.cleanUpSpecialChars($scope.urlTitle);
            }

            if ($rootScope.isFullsize) {
                $scope.resizeDocApercu = 'Agrandir';
            } else {
                $scope.resizeDocApercu = 'Réduire';
            }

            // Recovery of the display choice of the installation trick
            // of the voices in offline mode
            $scope.neverShowOfflineSynthesisTips = localStorage.getItem('neverShowOfflineSynthesisTips') === 'true';

            $scope.currentPage = 1;

            $localForage.getItem('vocalHelpShowed').then(function (result) {
                if (!result) {
                    $scope.openVocalHelpModal();
                }
            });

            // Overview of Url.
            if ($scope.url) {
                $scope.showSave = true;
                var parser = document.createElement('a');
                parser.href = decodeURIComponent($scope.url);
                $scope.urlHost = parser.hostname;
                if ($scope.urlHost && parser.href.indexOf('https') > -1) {
                    $scope.urlPort = 443;
                } else {
                    $scope.urlPort = 80;
                }
                $scope.url = decodeURIComponent($scope.url);

                // In the case of an url of access to a pdf.
                if ($scope.url.indexOf('.pdf') > 0) {
                    $scope.loadPdfByLien($scope.url);
                } else if ($scope.url.indexOf('.png') > 0 || $scope.url.indexOf('.jpg') > 0 || $scope.url.indexOf('.jpeg') > 0) {
                    $scope.loadPictureByLink($scope.url);
                } else {

                    $scope.getHTMLContent($scope.url).then(function () {
                        LoaderService.hideLoader();
                        $scope.showTitleDoc($scope.urlTitle);
                        $scope.restoreNotesStorage();
                        $scope.checkAnnotations();
                    }, function () {
                        LoaderService.hideLoader();
                    });
                }
            }

            // View from a document
            if ($scope.idDocument) {
                fileStorageService.get($scope.idDocument, 'document').then(function (file) {

                    $scope.document = file;
                    $scope.content = workspaceService.parcourirHtml(file.data);

                    $scope.showTitleDoc($scope.idDocument);
                    $scope.showEditer = true;
                    $scope.setPage($scope.currentPage);
                    LoaderService.hideLoader();
                    $scope.restoreNotesStorage();
                }, function () {
                    LoaderService.hideLoader();
                    UtilsService.showInformationModal('label.offline', 'document.message.info.display.offline', '/listDocument');
                });
            }
        };

        /**
         * Reading of the selected text.
         *
         * @method $scope.speak
         */
        $scope.speak = function () {
            $log.debug('$scope.speak');
            speechService.stopSpeech();
            $timeout(function () {
                var text = $scope.getSelectedText();
                $log.debug('$scope.getSelectedText()', text);
                if (text && !/^\s*$/.test(text)) {

                    if ($scope.checkBrowserSupported()) {
                        serviceCheck.isOnline().then(function () {
                            $scope.displayOfflineSynthesisTips = false;
                            speechService.speech(text, true);
                            window.document.addEventListener('click', $scope.stopSpeech, false);
                        }, function () {
                            $scope.displayOfflineSynthesisTips = !$scope.neverShowOfflineSynthesisTips;
                            speechService.speech(text, false);
                        });
                    }
                }
            }, 10);
        };

        $scope.stopSpeech = function (e) {
            speechService.stopSpeech();
            window.document.removeEventListener('click', $scope.stopSpeech, false);
        };

        /**
         * Reading of the text selected by the keyboard.
         *
         * @method $scope.speakspeakOnKeyboard
         */
        $scope.speakOnKeyboard = function (event) {
            if (keyboardSelectionService.isSelectionCombination(event)) {
                $scope.speak();
            }
        };

        /**
         * verifies that the browser supports voice synthesis.
         * If it does not support it , then a message is displayed to the user.
         *
         * @method $scope.checkBrowserSupported
         */
        $scope.checkBrowserSupported = function () {
            var browserSupported = speechService.isBrowserSupported();
            if (!browserSupported && !$scope.neverShowBrowserNotSupported) {
                $scope.displayBrowserNotSupported = true;
            } else {
                $scope.displayBrowserNotSupported = false;
            }

            $log.debug('$scope.checkBrowserSupported()', browserSupported);
            return browserSupported;
        };

        /**
         * Close the message indicating that the browser is not supported.
         *
         * @method $scope.closeBrowserNotSupported
         */
        $scope.closeBrowserNotSupported = function () {
            $scope.displayBrowserNotSupported = false;
        };

        /**
         * Close the message indicating that the user has no rights for the Speech synthesis
         *
         * @method $scope.closeNoAudioRights()
         */
        $scope.closeNoAudioRights = function () {
            $scope.displayNoAudioRights = false;
        };

        /**
         * Close the trick for the installation of voice in disconnected mode.
         *
         * @method $scope.closeOfflineSynthesisTips
         */
        $scope.closeOfflineSynthesisTips = function () {
            $scope.displayOfflineSynthesisTips = false;
            localStorage.setItem('neverShowOfflineSynthesisTips', $scope.neverShowOfflineSynthesisTips);
        };

        /**
         * Verify during a click on a link that the user is in connected mode.
         * If it is in mode disconnected then a pop-up is displayed indicating the user
         * that the appropriate browsing is not available.
         *
         * @method $scope.checkLinkOffline
         * @param event
         *            The event of the click
         */
        $scope.checkLinkOffline = function (event) {

            if (event.target && event.target.nodeName === 'A' && !$rootScope.isAppOnline) {

                UtilsService.showInformationModal('label.offline', 'webadapt.message.info.offline');

                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        /**
         *Recovery of the selected text.
         *
         * @method $scope.getSelectedText
         */
        $scope.getSelectedText = function () {
            var text = '';
            if ($window.getSelection) {
                text = $window.getSelection().toString();
            } else if (document.selection && document.selection.type !== 'Control') {
                text = document.selection.createRange().text;
            }
            return text;
        };

        // reduces or enlarges the overview page of the document
        $scope.resizeApercu = function () {
            if ($scope.resizeDocApercu === 'Agrandir') {
                $scope.resizeDocApercu = 'Réduire';
                $rootScope.isFullsize = false;
                $('.navbar-fixed-top').slideUp(200, function () {
                });

            } else {
                $scope.resizeDocApercu = 'Agrandir';
                $rootScope.isFullsize = true;
                $('.navbar-fixed-top').slideDown(200, function () {
                });
            }
        };

        $scope.openDocumentListModal = function () {
            $uibModal.open({
                templateUrl: 'views/listDocument/listDocumentModal.html',
                controller: 'listDocumentModalCtrl',
                size: 'lg'
            });
        };

        $scope.switchModeAffichage = function () {
            $scope.resetLines();
            $scope.isSummaryActive = false;
            var tmp = $location.url().indexOf('&mode');
            var refresh;
            if (tmp !== -1) {
                refresh = $location.url().substring(0, tmp);
            } else {
                refresh = $location.url();
            }
            if (!$scope.modeImpression) {
                $stateParams.mode = 'lecture';
                refresh += '&mode=lecture';
                $scope.modeImpression = true;
            } else {
                $stateParams.mode = 'page';
                refresh += '&mode=page';
                $scope.modeImpression = false;
            }
            if (!$scope.testEnv) {
                $location.url(refresh);
            }
        };

        $scope.fermerApercu = function () {
            if (!$scope.tmp) {
                $location.path('/listDocument');
            } else {
                UtilsService.showInformationModal('label.close', 'document-overview.message.info.close');
            }
        };

        /**
         * Open the document editor
         */
        $scope.openEditDocument = function () {

            $state.go('app.edit-document', {
                file: {
                    filename: $rootScope.titreDoc,
                    data: $scope.originalHtml
                }
            });

        };

        var processLink = function (doc) {

            var parser = document.createElement('a');
            parser.href = $scope.url;
            doc = doc.replace(new RegExp('href="\/(?!\/)', 'g'), 'href="https://' + parser.hostname + '/');
            doc = doc.replace(new RegExp('src="\/(?!\/)', 'g'), 'src="https://' + parser.hostname + '/');


            return doc;
        };

        /**
         * Save the web document
         */
        $scope.saveWebDocument = function () {

            documentService.save({
                title: $rootScope.titreDoc,
                data: $scope.originalHtml
            }, 'create').then(function (data) {
                $rootScope.titreDoc = data.filename;
                $scope.idDocument = data.filename;
                $scope.showSave = false;
                $scope.showEditer = true;

                if (!UserService.getData().token) {
                    ToasterService.showToaster('#overview-success-toaster', 'document.message.save.cache.ok');
                } else {
                    ToasterService.showToaster('#overview-success-toaster', 'document.message.save.storage.ok');
                }

            }, function () {
                ToasterService.showToaster('#overview-error-toaster', 'document.message.save.ko');
            });

        };

        /**
         * Share a document
         * @param document The document to share
         */
        $scope.shareDocument = function () {
            if (!$rootScope.isAppOnline) {
                UtilsService.showInformationModal('label.offline', 'document.message.info.share.offline');
            } else {


                var itemToShare = {
                    linkToShare: '',
                    name: $scope.document.filename,
                    annotationsToShare: []
                };

                if (localStorage.getItem('notes') !== null) {
                    var noteList = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
                    if (noteList.hasOwnProperty(document.filename)) {
                        itemToShare.annotationsToShare = noteList[document.filename];
                    }
                }

                fileStorageService.shareFile($scope.document.filepath)
                    .then(function (shareLink) {
                        itemToShare.linkToShare = 'https://' + window.location.host + '/#/apercu?title=' + encodeURIComponent($scope.document.filename) + '&url=' + encodeURIComponent(shareLink);

                        //$scope.encodedLinkFb = $scope.docApartager.lienApercu.replace('#', '%23');
                        UtilsService.openSocialShareModal('document', itemToShare)
                            .then(function () {
                                // Modal close
                                ToasterService.showToaster('#overview-success-toaster', 'mail.send.ok');
                            }, function () {
                                // Modal dismiss
                            });

                    });

                // angular-google-analytics tracking pages
                Analytics.trackPage('/document/share.html');


            }

        };

        $scope.init();
    });