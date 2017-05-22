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

'use strict';

/*
 * Directive to apply a rule of style to a paragraph.
 */
angular.module('cnedApp').directive('profileColoration',

    function (UtilsService, $timeout, $compile, $log) {
        return {
            restrict: 'A',
            scope: {
                profile: '=',
                text: '='
            },
            link: function (scope, element) {

                var profileWatcher = null;
                var textWatcher = null;


                /**
                 * Color lines
                 * @param ref
                 * @param maxLines
                 */
                var colorLines = function (ref, maxLines) {
                    var prevTop = -9999;
                    var line = 0;

                    var spanFound = ref.find('span');

                    for (var i = 0; i < spanFound.length; i++) {
                        var word = spanFound[i];

                        if (!word.id) {
                            var top = word.offsetTop;

                            if (top > prevTop) {
                                if (line >= maxLines) {
                                    line = 1;
                                } else {
                                    line++;
                                }
                            }
                            word.className = 'line' + line;
                            prevTop = top;
                        }
                    }
                };

                var generateColoration = function () {


                    element[0].innerHTML = UtilsService.removeSpan(scope.text);

                    $timeout(function () {
                        if (scope.profile && scope.profile.data && scope.text) {

                            var profile = scope.profile.data;

                            for (var i = 0; i < profile.profileTags.length; i++) {

                                var coloration = profile.profileTags[i].coloration;
                                var balise = profile.profileTags[i].tagDetail.balise;
                                var regexp = new RegExp('</' + balise + '>', 'gi');

                                if (regexp.test(scope.text)) {

                                    var tagsFound = element.find(balise);

                                    for (var j = 0; j < tagsFound.length; j++) {

                                        var elem = tagsFound[j];
                                        var textTransform = elem.innerHTML;

                                        // Split Text
                                        switch (coloration) {
                                            case 'Colorer les lignes RBV':
                                            case 'Colorer les lignes RVJ':
                                            case 'Colorer les lignes RBVJ':
                                            case 'Surligner les lignes RBV':
                                            case 'Surligner les lignes RVJ':
                                            case 'Surligner les lignes RBVJ':

                                                textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                                                break;
                                            case 'Colorer les mots':
                                            case 'Surligner les mots':

                                                textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);
                                                break;
                                            case 'Colorer les syllabes':

                                                textTransform = UtilsService.splitOnSyllable(textTransform);
                                                break;
                                        }

                                        elem.innerHTML = textTransform;


                                        switch (coloration) {
                                            case 'Colorer les lignes RBV':
                                            case 'Colorer les lignes RVJ':
                                            case 'Surligner les lignes RBV':
                                            case 'Surligner les lignes RVJ':
                                                colorLines(angular.element(elem), 3);
                                                break;
                                            case 'Colorer les lignes RBVJ':
                                            case 'Surligner les lignes RBVJ':
                                                colorLines(angular.element(elem), 4);
                                                break;
                                        }
                                    }
                                }
                            }


                        }

                        if (!textWatcher) {
                            textWatcher = scope.$watch('text', function (newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    generateColoration();
                                }
                            }, true);
                        }

                        if (!profileWatcher) {
                            profileWatcher = scope.$watch('profile.data', function (newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    generateColoration();
                                }
                            }, true);
                        }
                    }, 100);


                };

                generateColoration();


            }
        };


    });