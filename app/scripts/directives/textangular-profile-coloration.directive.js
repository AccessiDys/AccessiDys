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
                var windowHeight = window.innerHeight;

                var tags = {};


                window.addEventListener('scroll', _.debounce(function () {
                    windowScroll = window.pageYOffset;
                    generateColoration($element[0]);
                }, 100));

                /**
                 * Bind the watcher to detect change in the editor
                 */
                var bindHtmlWatcher = function () {
                    if (!htmlWatcher) {
                        htmlWatcher = $scope.$watch(function () {
                            return $element[0].innerHTML.length;
                        }, _.debounce(function (newValue, oldValue) {
                            if (newValue !== oldValue) {
                                //console.log(' html watcher newValue = ' + newValue + ' - oldValue = ' + oldValue, $element[0].innerHTML);
                                generateColoration($element[0]);
                            }
                        }, 200));
                    }
                };

                function generateColoration(element) {
                    if (htmlWatcher) {
                        htmlWatcher();
                        htmlWatcher = undefined;
                    }

                    $timeout(function () {


                        if ($rootScope.currentProfile) {

                            var line = 0;
                            var prevTop = -9999;
                            var prevTag = '';

                            var savedSel = rangy.saveSelection();

                            _.each(element.children, function (child) {


                                var clone = child.cloneNode(true);

                                // Adapt child which are displayed on the screen
                                windowScroll = window.pageYOffset;
                                if (child.offsetTop > windowScroll && child.offsetTop < (windowScroll + windowHeight)) {

                                    if (child.tagName !== prevTag) {
                                        line = 0;
                                    }

                                    var profileTag = tags[child.tagName.toLowerCase()]; // get tag settings

                                    if (profileTag) {
                                        var coloration = profileTag.coloration;
                                        var textTransform = child.innerHTML.replace(/(<!--.*?-->)/gi, '');

                                        // Save rangy cursor
                                        var rangyCursorPattern = /((&nbsp;)*<span id(.*?)\/span>)/gi;
                                        var rangyCursorResult = textTransform.match(rangyCursorPattern);
                                        var rangyCursors = [];

                                        if (rangyCursorResult && rangyCursorResult.length > 0) {

                                            _.each(rangyCursorResult, function (result, index) {
                                                var marker = '%%RG' + index + '%%';

                                                rangyCursors.push({
                                                    marker: marker,
                                                    cursor: result
                                                });

                                                textTransform = textTransform.replace(result, marker);
                                            });
                                        }
                                        textTransform = textTransform.replace(/&nbsp;/gi, ' %%NB%% ');
                                        textTransform = UtilsService.removeSpan(textTransform);

                                        // Handle img
                                        var imgPattern = /<img.*>/gi;
                                        var imgResult = textTransform.match(imgPattern);
                                        var imgList = [];

                                        if (imgResult && imgResult.length > 0) {
                                            for (var v = 0; v < imgResult.length; v++) {
                                                var marker = '%%IMG' + v + '%%';

                                                imgList.push({
                                                    marker: marker,
                                                    img: imgResult[v]
                                                });

                                                textTransform = textTransform.replace(imgResult[v], marker);
                                            }
                                        }

                                        // Split Text
                                        if (coloration.indexOf('lignes') > 0) /* === 'Colorer les lignes RBV'
                                            || coloration === 'Colorer les lignes RVJ'
                                            || coloration === 'Surligner les lignes RVJ'
                                            || coloration === 'Surligner les lignes RBV'
                                            || coloration === 'Colorer les lignes RBVJ'
                                            || coloration === 'Surligner les lignes RBVJ') */{
                                            textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%\s<\/span>\s/gi, '&nbsp;');
                                        } else if ( coloration.indexOf('mots') > 0) {
                                            textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);
                                            textTransform = textTransform.replace(/\s\s<span>%%NB%%<\/span>\s\s/gi, '&nbsp;');
                                        } else if (coloration.indexOf('syllabes') > 0) {
                                            textTransform = UtilsService.splitOnSyllable(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%<\/span>\s/gi, '&nbsp;');
                                        } else if(coloration.indexOf('[Maj. - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithPoint(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%\s<\/span>\s/gi, '&nbsp;');
                                        } else if (coloration.indexOf('[Maj. - \',\' - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithComma(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%\s<\/span>\s/gi, '&nbsp;');
                                        } else if (coloration.indexOf('[Maj. - \';\' - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithSemicolon(textTransform);
                                            textTransform = textTransform.replace(/\s<span>%%NB%%<\/span>\s/gi, '&nbsp;');
                                        } else {
                                            textTransform = textTransform.replace(/\s%%NB%%\s/gi, '&nbsp;');
                                        }


                                        textTransform = textTransform.replace(/%%NB%%/gi, ' ');

                                        // Restore images
                                        for (var v = 0; v < imgList.length; v++) {
                                            textTransform = textTransform.replace(new RegExp(imgList[v].marker, 'gi'), imgList[v].img);
                                        }

                                        // Restore rangy cursor
                                        for (var v = 0; v < rangyCursors.length; v++) {
                                            textTransform = textTransform.replace(new RegExp(rangyCursors[v].marker, 'gi'), rangyCursors[v].cursor);
                                        }


                                        child.innerHTML = textTransform;


                                        if ( coloration.indexOf('lignes') > 0) {

                                            var res = UtilsService.colorLines(child, profileTag.colorsList.length, prevTop, line);
                                            line = res.line;
                                            prevTop = res.prevTop;

                                            var parent = child.parentNode;
                                            var nextElement = child.nextSibling;
                                            parent.removeChild(child);
                                            parent.insertBefore(res.documentFragment, nextElement);

                                        }

                                        if (prevTop > child.offsetTop) {
                                            prevTop = child.offsetTop;
                                        }

                                        prevTag = child.tagName;


                                    }
                                }

                            });


                            rangy.restoreSelection(savedSel);
                        }


                        $timeout(function () {
                            bindHtmlWatcher();
                        }, 110);


                    }, 200);


                }

                $element.bind('keyup', function (e) {

                    //console.log(e.currentTarget);
                    //generateColoration($element[0]);
                });


                /**
                 * Watcher for the current profile
                 */
                $rootScope.$watch('currentProfile', function (newvalue) {
                    if (newvalue) {

                        _.each($rootScope.currentProfile.data.profileTags, function (item) {
                            tags[item.tagDetail.balise] = item;
                        });

                        generateColoration($element[0]);
                    }
                }, true);
            }
        };


    });