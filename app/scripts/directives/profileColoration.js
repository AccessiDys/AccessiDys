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

                    var spanFound = ref.querySelectorAll('span');

                    for (var i = 0; i < spanFound.length; i++) {
                        var word = spanFound[i];

                        if (!word.id) {

                            console.log('word.offsetTop', word.offsetTop);
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


                    console.log('scope.text', scope.text);
                    element[0].innerHTML = UtilsService.removeSpan(scope.text);


                    $timeout(function () {
                        if (scope.profile && scope.profile.data && scope.text) {

                            var profile = scope.profile.data;

                            console.log('element[0]', element[0].children.length);

                            var documentFragment = document.createDocumentFragment();
                            documentFragment.appendChild(element[0].cloneNode(true));

                            console.time('adaptation');

                            var splitOnWordWithSpace = UtilsService.splitOnWordWithSpace;
                            var splitOnWordWithOutSpace = UtilsService.splitOnWordWithOutSpace;
                            var splitOnSyllable = UtilsService.splitOnSyllable;

                            console.log('profilsTags', profile.profileTags);

                            for (var i = 0; i < profile.profileTags.length; i++) {

                                var coloration = profile.profileTags[i].coloration;
                                var balise = profile.profileTags[i].tagDetail.balise;
                                var regexp = new RegExp('</' + balise + '>', 'gi');

                                if (regexp.test(scope.text)) {

                                    var tagsFound = documentFragment.querySelectorAll(balise);


                                    for (var j = 0; j < 100; j++) {

                                        var elem = tagsFound[j];
                                        var textTransform = elem.innerHTML;

                                        // Split Text
                                        if (coloration === 'Colorer les lignes RBV'
                                            || coloration === 'Colorer les lignes RVJ'
                                            || coloration === 'Surligner les lignes RVJ'
                                            || coloration === 'Surligner les lignes RBV'
                                            || coloration === 'Colorer les lignes RBVJ'
                                            || coloration === 'Surligner les lignes RBVJ') {

                                            textTransform = splitOnWordWithSpace(textTransform);
                                        } else if (coloration === 'Colorer les mots'
                                            || coloration === 'Surligner les mots') {

                                            //console.log('textTransform', textTransform);
                                            //console.time('mots');
                                            textTransform = splitOnWordWithOutSpace(textTransform);
                                            //console.timeEnd('mots');

                                        } else if (coloration === 'Colorer les syllabes') {

                                            textTransform = splitOnSyllable(textTransform);
                                        }

                                        elem.innerHTML = textTransform;

                                        if (coloration === 'Colorer les lignes RBV'
                                            || coloration === 'Colorer les lignes RVJ'
                                            || coloration === 'Surligner les lignes RBV'
                                            || coloration === 'Surligner les lignes RVJ') {

                                            colorLines(elem, 3);

                                        } else if (
                                            coloration === 'Colorer les lignes RBVJ'
                                            || coloration === 'Surligner les lignes RBVJ') {

                                            colorLines(elem, 4);
                                        }
                                    }
                                }
                            }

                            console.timeEnd('adaptation');

                            var parent = element[0].parentNode;
                            parent.removeChild(element[0]);
                            parent.appendChild(documentFragment);

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