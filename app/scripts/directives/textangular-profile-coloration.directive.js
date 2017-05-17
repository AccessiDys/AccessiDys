/* File: profileColoration.js
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

/*global cnedApp,Hyphenator, $:false */
'use strict';

/**
 * Directive to set coloration with TextAngular
 */
cnedApp.directive('textAngularProfileColoration',

    function (UtilsService, $timeout, $compile, $rootScope, $log) {
        return {
            restrict: 'A',
            link: function (scope, element) {

                var htmlWatcher = null;

                /**
                 * Bind the watcher to detect change in the editor
                 */
                var bindHtmlWatcher = function () {
                    if (!htmlWatcher) {
                        $log.debug('bind html watcher');
                        htmlWatcher = $rootScope.$watch(function () {
                            return element.html().length;
                        }, function (newvalue, oldValue) {


                            if (newvalue != oldValue) {
                                generateColoration();
                            }

                        });
                    }
                };


                /**
                 * Color lines
                 * @param ref
                 * @param maxLines
                 */
                var colorLines = function (ref, maxLines) {
                    var prevTop = -9999;
                    var line = 0;
                    angular.forEach(ref.find('span'), function (word) {
                        var wordRef = angular.element(word);

                        if (!wordRef[0].id) {
                            var top = wordRef[0].offsetTop;

                            if (top > prevTop) {
                                if (line >= maxLines) {
                                    line = 1;
                                } else {
                                    line++;
                                }
                            }

                            wordRef.addClass('line' + line);

                            prevTop = top;
                        }

                    });
                };

                var generateColoration = function () {

                    if (htmlWatcher) {
                        htmlWatcher();
                        htmlWatcher = null;

                        $log.debug('destroy html watcher', htmlWatcher);
                    }

                    $timeout(function () {

                        var profile = $rootScope.currentProfile.data;
                        var text = element.html();

                        if (profile && text) {


                            for (var i = 0; i < profile.profileTags.length; i++) {

                                var coloration = profile.profileTags[i].coloration;

                                angular.forEach(element.find(profile.profileTags[i].tagDetail.balise), function (elem) {

                                    var savedSel = rangy.saveSelection();

                                    var ref = angular.element(elem);
                                    var textTransform = ref.html();

                                    $log.debug('html span', textTransform);

                                    var rangyCursorPattern = /((&nbsp;)*<span id(.*?)\/span>)/gi;

                                    // Save rangy cursor


                                    var rangyCursorResult = textTransform.match(rangyCursorPattern);
                                    var rangyCursors = [];

                                    if (rangyCursorResult && rangyCursorResult.length > 0) {
                                        for (var i = 0; i < rangyCursorResult.length; i++) {
                                            var marker = '';

                                            if (coloration === 'Colorer les syllabes') {
                                                marker = '%%<span>RG' + i + '</span>%%';
                                            } else {
                                                marker = '%%RG' + i + '%%';
                                            }

                                            rangyCursors.push({
                                                marker: marker,
                                                cursor: rangyCursorResult[i]
                                            });

                                            textTransform = textTransform.replace(rangyCursorResult[i], '%%RG' + i + '%%');
                                        }
                                    }
                                    textTransform = textTransform.replace(/&nbsp;/gi, ' %%NB%% ');
                                    textTransform = UtilsService.removeSpan(textTransform);

                                    $log.debug('remove span ', textTransform);

                                    // Split Text
                                    switch (coloration) {
                                        case 'Colorer les lignes RBV':
                                        case 'Colorer les lignes RVJ':
                                        case 'Surligner les lignes RBV':
                                        case 'Surligner les lignes RVJ':
                                        case 'Colorer les lignes RBVJ':
                                        case 'Surligner les lignes RBVJ':

                                            textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%\s<\/span>\s/gi, '&nbsp;');
                                            break;
                                        case 'Colorer les mots':
                                        case 'Surligner les mots':

                                            textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);
                                            textTransform = textTransform.replace(/\s\s<span>%%NB%%<\/span>\s\s/gi, '&nbsp;');
                                            break;
                                        case 'Colorer les syllabes':

                                            textTransform = UtilsService.splitOnSyllable(textTransform);
                                            textTransform = textTransform.replace(/\s%%<span>NB<\/span>%%\s/gi, '&nbsp;');
                                            break;
                                        default:
                                            textTransform = textTransform.replace(/\s%%NB%%\s/gi, '&nbsp;');
                                            break;
                                    }

                                    $log.debug('split ', textTransform);


                                    // Restore rangy cursor
                                    for (var i = 0; i < rangyCursors.length; i++) {
                                        textTransform = textTransform.replace(new RegExp(rangyCursors[i].marker, 'gi'), rangyCursors[i].cursor);
                                    }

                                    $log.debug('replace nbsp ', textTransform);

                                    ref.html(textTransform);

                                    switch (coloration) {
                                        case 'Colorer les lignes RBV':
                                        case 'Colorer les lignes RVJ':
                                        case 'Surligner les lignes RBV':
                                        case 'Surligner les lignes RVJ':
                                            colorLines(ref, 3);
                                            break;
                                        case 'Colorer les lignes RBVJ':
                                        case 'Surligner les lignes RBVJ':
                                            colorLines(ref, 4);
                                            break;
                                    }

                                    rangy.restoreSelection(savedSel);


                                });


                            }


                        }
                        bindHtmlWatcher();

                    }, 200);
                };

                /**
                 * Watcher for the current profile
                 */
                $rootScope.$watch('currentProfile', function (newvalue) {

                    $log.debug('change current profile');

                    if (newvalue) {
                        generateColoration();
                    }

                }, true);
            }
        };


    });