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

    function (UtilsService, $timeout, _, $rootScope) {
        return {
            restrict: 'A',
            scope: {
                profile: '=',
                text: '=',
                preview: '@'
            },
            link: function ($scope, $element) {

                var profileWatcher = null;
                var textWatcher = null;
                var windowScroll = 0;
                var prevScroll = -1;
                var windowHeight = window.innerHeight;
                var adaptIndex = 0;

                if (!$scope.preview) {
                    window.addEventListener('scroll', function () {
                        windowScroll = window.pageYOffset;

                        if (windowScroll >= prevScroll) {
                            prevScroll = windowScroll;
                            generateColoration($element[0]);
                        }
                    });
                }

                $rootScope.$on('window-resize', function () {
                    windowHeight = window.innerHeight;
                    adaptIndex = 0;
                    $element[0].innerHTML = UtilsService.removeSpan(UtilsService.decodeHtmlEntities($scope.text));
                    generateColoration($element[0]);
                });

                var generateColoration = function (element) {

                    $timeout(function () {
                        if ($scope.profile && $scope.profile.data && $scope.text) {

                            var profile = $scope.profile.data;

                            var line = 0;
                            var prevTop = -9999;
                            var prevTag = '';


                            for (adaptIndex; adaptIndex < element.children.length; adaptIndex++) {
                                var child = element.children[adaptIndex];
                                // Adapt child which are displayed on the screen
                                windowScroll = window.pageYOffset;
                                if (child.offsetTop < ((windowScroll + windowHeight) * 2)) {

                                    var profileTag = _.find(profile.profileTags, function (_profileTag) {
                                        return _profileTag.tagDetail.balise === child.tagName.toLowerCase();
                                    });

                                    if (child.tagName !== prevTag) {
                                        line = 0;
                                    }

                                    if (profileTag) {

                                        UtilsService.verifyColorsList(profileTag);

                                        var coloration = profileTag.coloration;
                                        var textTransform = child.innerHTML;

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
                                        if (coloration.indexOf('lignes') > 0) {
                                            textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                                        } else if (coloration.indexOf('mots') > 0) {
                                            textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);
                                        } else if (coloration.indexOf('syllabes') > 0) {
                                            textTransform = UtilsService.splitOnSyllable(textTransform);
                                        } else if (coloration.indexOf('[Maj. - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithPoint(textTransform);
                                        } else if (coloration.indexOf('[Maj. - \',\' - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithComma(textTransform);
                                        } else if (coloration.indexOf('[Maj. - \';\' - \'.\']') > 0) {
                                            textTransform = UtilsService.splitOnSentenceWithSemicolon(textTransform);
                                        }

                                        if (textTransform.trim() === '') {
                                            textTransform = '<br>';
                                        }

                                        // Restore images
                                        for (var v = 0; v < imgList.length; v++) {
                                            textTransform = textTransform.replace(new RegExp(imgList[v].marker, 'gi'), imgList[v].img);
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

                                    } else {
                                        continue;
                                    }
                                } else {
                                    break;
                                }
                            }

                        }
                    }, 200);
                };

                $element[0].innerHTML = UtilsService.removeSpan(UtilsService.decodeHtmlEntities($scope.text));
                generateColoration($element[0]);

                if (!textWatcher) {
                    textWatcher = $scope.$watch('text', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            adaptIndex = 0;
                            $element[0].innerHTML = UtilsService.removeSpan(UtilsService.decodeHtmlEntities($scope.text));
                            generateColoration($element[0]);
                        }
                    }, true);
                }

                if (!profileWatcher) {
                    profileWatcher = $scope.$watch('profile.data', function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            adaptIndex = 0;
                            $element[0].innerHTML = UtilsService.removeSpan(UtilsService.decodeHtmlEntities($scope.text));
                            generateColoration($element[0]);
                        }
                    }, true);
                }


            }
        };

    });