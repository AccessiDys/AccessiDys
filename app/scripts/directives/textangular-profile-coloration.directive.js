/* File: textangular-profile-coloration.directive.js
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

/*global rangy */
'use strict';

/**
 * Directive to set coloration with TextAngular
 */
angular.module('cnedApp').directive('textAngularProfileColoration',

    function (UtilsService, $timeout, $rootScope, $log, _) {
        return {
            restrict: 'A',
            link: function ($scope, $element) {

                var htmlWatcher = null;
                var windowScroll = 0;
                var prevScroll = -1;
                var windowWidth = window.innerWidth;
                var adaptIndex = 0;

                /**
                 * Bind the watcher to detect change in the editor
                 */
                var bindHtmlWatcher = function () {
                    if (!htmlWatcher) {
                        htmlWatcher = $scope.$watch(function () {
                            return $element[0].innerHTML.length;
                        }, function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                console.log('html watcher generateColoration');
                                generateColoration($element[0]);
                            }
                        });
                    }
                };

                var generateColoration = function (element) {

                    if (htmlWatcher) {
                        htmlWatcher();
                        htmlWatcher = null;
                    }

                    console.log('generateColoration');

                    $timeout(function () {

                        var profile = $rootScope.currentProfile.data;
                        var text = element.innerHTML;



                        console.log('end generation');


                        bindHtmlWatcher();

                    }, 200);
                };


                var splitElement = function (element, coloration) {

                    var documentFragment = document.createDocumentFragment();
                    documentFragment.appendChild(element.cloneNode(true));
                    documentFragment.children[0].innerHTML = '';

                    console.log(element.children);

                    if (element.children.length > 0) {
                        for (var i = 0; i < element.children.length; i++) {

                            var child = element.children[i];
                            var clone = child.cloneNode(true);

                            if (clone.hasChildNodes()) {
                                clone = splitElement(child, coloration);
                            } else {
                                clone.innerHTML = splitText(clone.innerHTML, coloration);
                            }
                            documentFragment.children[0].appendChild(clone);
                        }
                    } else {
                        documentFragment.children[0].innerHTML = splitText(element.innerHTML, coloration);
                    }

                    console.log('documentFragment.children[0]', documentFragment.children[0].innerHTML);

                    return documentFragment;
                };

                var splitText = function(text, coloration){

                    var textTransform = text;
                    // Split Text
                    if (coloration === 'Colorer les lignes RBV'
                        || coloration === 'Colorer les lignes RVJ'
                        || coloration === 'Surligner les lignes RVJ'
                        || coloration === 'Surligner les lignes RBV'
                        || coloration === 'Colorer les lignes RBVJ'
                        || coloration === 'Surligner les lignes RBVJ') {

                        textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                        textTransform = textTransform.replace(/\s<span>%%NB%%\s<\/span>\s/gi, '&nbsp;');
                    } else if (coloration === 'Colorer les mots'
                        || coloration === 'Surligner les mots') {

                        textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);
                        textTransform = textTransform.replace(/\s\s<span>%%NB%%<\/span>\s\s/gi, '&nbsp;');

                    } else if (coloration === 'Colorer les syllabes') {

                        textTransform = UtilsService.splitOnSyllable(textTransform);
                        textTransform = textTransform.replace(/\s%%<span>NB<\/span>%%\s/gi, '&nbsp;');
                    } else {
                        textTransform = textTransform.replace(/\s%%NB%%\s/gi, '&nbsp;');
                    }

                    return textTransform;
                };

                /**
                 * Watcher for the current profile
                 */
                $rootScope.$watch('currentProfile', function (newvalue) {
                    $log.debug('change current profile');

                    if (newvalue) {
                        generateColoration($element[0]);
                        console.log('html watcher currentProfile');
                    }

                }, true);
            }
        };


    });