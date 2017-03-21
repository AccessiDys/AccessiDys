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
/* global PDFJS ,Promise, CKEDITOR, gapi  */
/*jshint unused: false, undef:false */
/* global
 FB
 */
'use strict';

angular.module('cnedApp')
    .controller('ApercuCtrl', function ($scope, $rootScope, $http, $window, $location,
                                        $log, $q, $anchorScroll, serviceCheck, configuration, dropbox,
                                        verifyEmail, generateUniqueId, storageService, htmlEpubTool, $routeParams,
                                        fileStorageService, workspaceService, $timeout, speechService,
                                        keyboardSelectionService, $uibModal, canvasToImage, tagsService, documentService,
                                        gettextCatalog, $localForage, UtilsService, LoaderService,Analytics, ToasterService) {

        $scope.idDocument = $routeParams.idDocument;
        $scope.tmp = $routeParams.tmp;
        $scope.url = $routeParams.url;
        $scope.urlTitle = $routeParams.title; // Web adapt case
        $scope.annotationURL = $routeParams.annotation;
        $scope.isEnableNoteAdd = false;
        $scope.showDuplDocModal = false;
        $scope.showDestination = false;
        $scope.showEmail = false;
        $scope.emailMsgSuccess = '';
        $scope.emailMsgError = '';
        $scope.showPartagerModal = true;
        $scope.printPlan = true;

        $scope.pageBreakElement = '<div style="page-break-after: always"><span style="display: none;">&nbsp;</span></div>';
        $scope.content = [];
        $scope.currentContent = '';
        $scope.currentPage = 1;
        $scope.loader = false;
        $scope.isSummaryActive = false;
        /*
         * display information for the availability of voice synthesis.
         */
        $scope.neverShowBrowserNotSupported = false;
        $scope.neverShowNoAudioRights = false;
        $scope.neverShowOfflineSynthesisTips = false;
        $scope.resizeDocApercu = 'Agrandir';
        $scope.forceApplyRules = true;
        if (!$routeParams.mode || $routeParams.mode === 'lecture') {
            $scope.modeImpression = true;
        } else if ($routeParams.mode === 'page') {
            $scope.modeImpression = false;
        }
        $scope.numeroPageRechercher = 0;
        $scope.applyRulesAfterRender = false;
        $scope.listTagsByProfil = JSON.parse(localStorage.getItem('listTagsByProfil'));

        $scope.originalHtml = '';

        /**
         * ---------- Functions -----------
         */

        /**
         * Force the colorations of the application .
         */
        $scope.forceRulesApply = function (popup) {
            $scope.forceApplyRules = false;
            $timeout(function () {
                $scope.forceApplyRules = true;
            });
        };

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

        /**
         * Show loading popup.
         */
        $scope.showAdaptationLoader = function () {
            LoaderService.showLoader('document.message.info.adapt.inprogress', false);
        };

        /**
         * Show loading popup.
         */
        $scope.hideAdaptationLoader = function () {
            LoaderService.hideLoader();
        };

        /**
         * Show loading popup.
         */
        $scope.showAdaptationLoaderFromLoop = function (indexLoop) {
            if (indexLoop <= 0) {
                $scope.showAdaptationLoader();
            }
        };

        /**
         * Hide Adaptation popup.
         */
        $scope.hideAdaptationLoaderFromLoop = function (indexLoop, max) {
            if (indexLoop >= (max - 1)) {
                LoaderService.hideLoader();
            }
        };

        /*
         * Make / Scroll the menu while scrolling.
         */
        $(window).scroll(function () {
            var dif_scroll = 0;
            if (angular.element('#page-content').offset()) {
                if ($(window).scrollTop() >= angular.element('#page-content').offset().top) {
                    if (!$scope.modeImpression) {
                        dif_scroll = $(window).scrollTop() - 120;
                    } else {
                        dif_scroll = $(window).scrollTop() - 70;
                    }

                    $('.fixed_menu').css('top', dif_scroll + 'px');
                } else {
                    $('.fixed_menu').css('top', 0);
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
        };

        $scope.applySharedAnnotation = function () {
            if ($scope.annotationURL) {
                $http.get($scope.annotationURL).success(function (data) {
                    var annotationKey = $scope.annotationDummy;
                    var noteList = {};

                    annotationKey = decodeURIComponent(/(((\d+)(-)(\d+)(-)(\d+))(_+)([A-Za-z0-9_%]*)(_)([A-Za-z0-9_%]*))/i.exec($scope.annotationURL)[0]);
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

        /* The beginning of the management of notes in the overview */
        $scope.notes = [];

        /*
         * Get the list of the notes of localStorage
         * and show them in the overview.
         */
        $scope.restoreNotesStorage = function (/* idx */) {
            $scope.notes = workspaceService.restoreNotesStorage($scope.docSignature);
        };

        /*
         * Add a note in the position (x, y, xLink, yLink).
         */
        $scope.addNote = function (x, y, xLink, yLink) {
            var idNote = generateUniqueId();

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
            var element = [];
            element.push({
                name: 'notes',
                value: JSON.stringify(angular.toJson(mapNotes))
            });
            var t = storageService.writeService(element, 0);
            t.then(function (data) {
            });
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
            angular.element('#line-canvas-' + $scope.notes[index].idNote).remove();
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

        $scope.styleDefault = 'data-font="" data-size="" data-lineheight="" data-weight="" data-coloration=""';

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
            angular.element('.canvas-container').find('div').find('div').remove();
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
                $scope.forceRulesApply();
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

        $scope.openPrintModal = function(){
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
         * Convert base64 in Uint8Array
         *
         * @param base64
         *            The binary to be converted
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
                                    // Flattening the DOM via CKeditor
                                    var ckConfig = {};
                                    ckConfig.on = {
                                        instanceReady: function () {
                                            var editor = CKEDITOR.instances.virtualEditor;
                                            editor.setData(resultClean);
                                            var html = editor.getData();
                                            $scope.$apply(function () {
                                                $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                                                $scope.setPage($scope.currentPage);
                                            });
                                        }
                                    };
                                    $timeout($scope.destroyCkeditor());
                                    CKEDITOR.inline('virtualEditor', ckConfig);
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
                $scope.serviceNode = configuration.URL_REQUEST + '/sendPdf';
            } else {
                $scope.serviceNode = configuration.URL_REQUEST + '/sendPdfHTTPS';
            }
            $http.post($scope.serviceNode, {
                lien: url,
                id: localStorage.getItem('compteId')
            }).success(function (data) {
                var pdfbinary = $scope.base64ToUint8Array(data);
                PDFJS.getDocument(pdfbinary).then(function (pdf) {
                    $scope.pdfTohtml = [];
                    $scope.loadPdfPage(pdf, 1);
                });
            }).error(function () {
                LoaderService.hideLoader();
            });
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

                if (htmlFile && htmlFile.documentHtml && htmlFile.documentHtml.indexOf("<title>") > -1) {
                    $scope.urlTitle = htmlFile.documentHtml.substring(htmlFile.documentHtml.indexOf("<title>") + 7, htmlFile.documentHtml.indexOf("</title>"));
                } else {
                    $scope.urlTitle = url;
                }

                return htmlEpubTool.cleanHTML(htmlFile);

            }).then(function (resultClean) {
                // Flattening the DOM via CKeditor
                var ckConfig = {};
                ckConfig.on = {
                    instanceReady: function () {
                        var editor = CKEDITOR.instances.virtualEditor;
                        editor.setData(resultClean);
                        var html = editor.getData();
                        $scope.$apply(function () {

                            $scope.originalHtml = html;

                            // if is guest then load admin profiles
                            if ($rootScope.isGuest) {
                                $http.post(configuration.URL_REQUEST + '/findAdmin').then(function (result) {
                                    localStorage.setItem('compteId', result.data._id);
                                    return tagsService.getTags().then(function (resultTags) {
                                        localStorage.setItem('listTags', JSON.stringify(resultTags));
                                        $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                                        $scope.setPage($scope.currentPage);
                                    });
                                });
                            } else {
                                $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                                $scope.setPage($scope.currentPage);
                            }

                        });

                    }
                };
                $timeout($scope.destroyCkeditor());
                CKEDITOR.inline('virtualEditor', ckConfig);
            }, function (err) {
                UtilsService.showInformationModal('Erreur technique', 'L\'import du document a échoué. Une erreur technique est survenue.', null, true);
            });
        };

        /**
         * Recover the html contents of a doc
         *
         * @method $scope.getDocContent
         * @param {String}
         *            idDocument
         * @return Promise
         */
        $scope.getDocContent = function (idDocument) {
            var deferred = $q.defer();
            serviceCheck.getData().then(function (result) {
                var token = '';
                if (result.user && result.user.dropbox) {
                    token = result.user.dropbox.accessToken;
                }
                return fileStorageService.getFile($rootScope.isAppOnline, idDocument, token);
            }).then(function (data) {
                if (data === null) {
                    deferred.reject();
                } else {
                    var content = workspaceService.parcourirHtml(data);

                    deferred.resolve(content);
                }
            });

            return deferred.promise;
        };

        /**
         * Recover the tmp html content from the localStorage
         *
         * @method $scope.getTmpContent
         * @return Promise
         */
        $scope.getTmpContent = function () {
            return fileStorageService.getTempFile().then(function (data) {
                $scope.content = workspaceService.parcourirHtml(data);
                $scope.forceRulesApply();
            });
        };

        /**
         * open the document in the editor
         *
         * @method $scope.editer
         */
        $scope.editer = function () {
            $window.location.href = configuration.URL_REQUEST + '/#/addDocument?idDocument=' + $scope.idDocument;
        };

        /**
         * This function loads  an image by the bookmarklet
         */
        $scope.loadPictureByLink = function (url) {
            var resultClean = '<img src="' + url + '">';
            //  Flattening the DOM via CKeditor
            var ckConfig = {};
            ckConfig.on = {
                instanceReady: function () {
                    var editor = CKEDITOR.instances.virtualEditor;
                    editor.setData(resultClean);
                    var html = editor.getData();
                    $scope.$apply(function () {
                        $scope.content = workspaceService.parcourirHtml(html, $scope.urlHost, $scope.urlPort);
                        $scope.setPage($scope.currentPage);
                    });

                }
            };
            $timeout($scope.destroyCkeditor());
            CKEDITOR.inline('virtualEditor', ckConfig);
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

            // Recovery of the display choice of the installation trick
            // of the voices in offline mode
            $scope.neverShowOfflineSynthesisTips = localStorage.getItem('neverShowOfflineSynthesisTips') === 'true';

            // Delete editor
            $scope.destroyCkeditor();

            $scope.listTagsByProfil = JSON.parse(localStorage.getItem('listTagsByProfil'));

            // disables the automatic creation of inline editors
            $scope.disableAutoInline();

            $scope.currentPage = 1;

            if ($rootScope.isGuest || !$rootScope.loged) {
                //if not connected : Load of admin profils as default profils
                $rootScope.defaultProfilList = true;
            }

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
                var contentGet = $scope.getDocContent($scope.idDocument);
                contentGet.then(function (data) {

                    $log.debug('get content data', data);

                    $scope.content = data;
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

            // Temporary overview.
            if ($scope.tmp) {
                $scope.getTmpContent().then(function () {
                    $scope.showTitleDoc('Aperçu Temporaire');
                    $scope.setPage($scope.currentPage);
                    LoaderService.hideLoader();
                }, function () {
                    LoaderService.hideLoader();
                });
            }
        };

        /**
         * Reading of the selected text.
         *
         * @method $scope.speak
         */
        $scope.speak = function () {
            speechService.stopSpeech();
            $timeout(function () {
                var text = $scope.getSelectedText();
                if (text && !/^\s*$/.test(text)) {
                    $scope.checkAudioRights().then(function (audioRights) {
                        if (audioRights && $scope.checkBrowserSupported()) {
                            serviceCheck.isOnline().then(function () {
                                $scope.displayOfflineSynthesisTips = false;
                                speechService.speech(text, true);
                                window.document.addEventListener('click', $scope.stopSpeech, false);
                            }, function () {
                                $scope.displayOfflineSynthesisTips = !$scope.neverShowOfflineSynthesisTips;
                                speechService.speech(text, false);
                            });
                        }
                    });
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
            return browserSupported;
        };

        /**
         * Check that the user has the right to use the speech synthesis.
         *
         * @method $scope.checkAudioRights
         */
        $scope.checkAudioRights = function () {
            return serviceCheck.getData().then(function (statusInformation) {
                if (statusInformation.user && statusInformation.user.local && statusInformation.user.local.authorisations) {
                    $scope.displayNoAudioRights = !statusInformation.user.local.authorisations.audio && !$scope.neverShowNoAudioRights;
                    return statusInformation.user.local.authorisations.audio;
                } else {
                    $scope.displayNoAudioRights = false;
                    return true;
                }
            }, function () {
                $scope.displayNoAudioRights = false;
                return true;
            });
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

        /**
         * Disabling automatic creation of inline editors
         *
         * @method $scope.disableAutoInline
         */
        $scope.disableAutoInline = function () {
            CKEDITOR.disableAutoInline = true;
        };

        /**
         * Delete the instance of ckeditor used to format HTML
         *
         * @method $scope.destroyCkeditor
         */
        $scope.destroyCkeditor = function () {
            for (var name in CKEDITOR.instances) {
                if (CKEDITOR.instances[name]) {
                    if (CKEDITOR.instances[name].filter) {
                        CKEDITOR.instances[name].destroy(true);
                    } else {
                        CKEDITOR.remove(CKEDITOR.instances[name]);
                    }
                    delete CKEDITOR.instances[name];
                }
            }
        };

        /**
         * Checks whether the user is authenticated (logged in or in
         * Offline mode) before generating the overview
         *
         * @method $scope.getUserAndInitApercu
         */

        $scope.getUserAndInitApercu = function () {
            var url = $routeParams.url;
            // ex: sharing document ref: CNED-383
            if (url && url.indexOf('dropboxusercontent') > -1) {
                $scope.init();
            } else {
                serviceCheck.getData().then(function () {
                    if ($rootScope.loged === true) {
                        $scope.init();
                    }
                });
            }
        };

        $rootScope.$on('profilChanged', function () {
            $scope.listTagsByProfil = JSON.parse(localStorage.getItem('listTagsByProfil'));
        });

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
                $routeParams.mode = 'lecture';
                refresh += '&mode=lecture';
                $scope.modeImpression = true;
            } else {
                $routeParams.mode = 'page';
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

            fileStorageService.saveTempFile({
                url: $scope.url,
                html: $scope.originalHtml
            }).then(function () {
                $location.path('/addDocument').search({
                    title: $rootScope.titreDoc
                });
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

            var doc = processLink($scope.originalHtml);


            documentService.save({
                title: $rootScope.titreDoc,
                data: doc
            }, 'create').then(function (data) {
                $rootScope.titreDoc = data.filename;
                $scope.idDocument = data.filename;
                $scope.showSave = false;
                $scope.showEditer = true;

                $scope.showToaster('#overview-success-toaster', 'document.message.save.ok');

            }, function () {
                $scope.showToaster('#overview-error-toaster', 'document.message.save.ko');
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

                fileStorageService.searchFilesInDropbox('_' + $scope.idDocument + '_', $rootScope.currentUser.dropbox.accessToken).then(function (files) {
                    var file = null;

                    if (files && files.matches.length > 0) {

                        for (var i = 0; i < files.matches.length; i++) {
                            if (files.matches[i].metadata.name.indexOf('_' + $scope.idDocument + '_') > -1) {
                                file = files.matches[i].metadata
                            }
                        }

                    }

                    if(file){
                        var document = fileStorageService.transformDropboxFileToStorageFile(file);

                        var itemToShare = {
                            linkToShare: '',
                            name: document.filename,
                            annotationsToShare: []
                        };

                        if (localStorage.getItem('notes') !== null) {
                            var noteList = JSON.parse(localStorage.getItem('notes'));

                            if (noteList.hasOwnProperty(document.filename)) {
                                itemToShare.annotationsToShare = noteList[document.filename];
                            }
                        }

                        fileStorageService.shareFile(document.filepath, $rootScope.currentUser.dropbox.accessToken)
                            .then(function (shareLink) {
                                itemToShare.linkToShare = configuration.URL_REQUEST + '/#/apercu?url=' + encodeURIComponent(shareLink);

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


                });


            }

        };



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
            $timeout(function () {
                angular.element(id).fadeIn('fast').delay(10000).fadeOut('fast');
                $scope.forceToasterApdapt = false;
            }, 0);
        };

        $scope.getUserAndInitApercu();
    });