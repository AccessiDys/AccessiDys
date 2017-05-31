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

    function (UtilsService, $timeout, _) {
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
                var windowWidth = window.innerWidth;
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
                                if (child.offsetTop < ((windowScroll + windowWidth) * 2)) {
                                    var profileTag = _.find(profile.profileTags, function (_profileTag) {
                                        return _profileTag.tagDetail.balise === child.tagName.toLowerCase();
                                    });

                                    if (child.tagName !== prevTag) {
                                        line = 0;
                                    }

                                    //child.setAttribute("prevtop", prevTop);
                                    //child.setAttribute("currenttop", child.offsetTop);

                                    if (profileTag) {

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
                                        if (coloration === 'Colorer les lignes RBV'
                                            || coloration === 'Colorer les lignes RVJ'
                                            || coloration === 'Surligner les lignes RVJ'
                                            || coloration === 'Surligner les lignes RBV'
                                            || coloration === 'Colorer les lignes RBVJ'
                                            || coloration === 'Surligner les lignes RBVJ') {

                                            textTransform = UtilsService.splitOnWordWithSpace(textTransform);
                                        } else if (coloration === 'Colorer les mots'
                                            || coloration === 'Surligner les mots') {

                                            textTransform = UtilsService.splitOnWordWithOutSpace(textTransform);

                                        } else if (coloration === 'Colorer les syllabes') {
                                            textTransform = UtilsService.splitOnSyllable(textTransform);
                                        }


                                        if (textTransform.trim() === '') {
                                            textTransform = '<br>';
                                        }

                                        // Restore images
                                        for (var v = 0; v < imgList.length; v++) {
                                            textTransform = textTransform.replace(new RegExp(imgList[v].marker, 'gi'), imgList[v].img);
                                        }

                                        child.innerHTML = textTransform;

                                        if (coloration === 'Colorer les lignes RBV'
                                            || coloration === 'Colorer les lignes RVJ'
                                            || coloration === 'Surligner les lignes RBV'
                                            || coloration === 'Surligner les lignes RVJ') {

                                            var res = UtilsService.colorLines(child, 3, prevTop, line);
                                            line = res.line;
                                            prevTop = res.prevTop;

                                            var parent = child.parentNode;
                                            var nextElement = child.nextSibling;
                                            parent.removeChild(child);
                                            parent.insertBefore(res.documentFragment, nextElement);
                                        } else if (
                                            coloration === 'Colorer les lignes RBVJ'
                                            || coloration === 'Surligner les lignes RBVJ') {

                                            var res = UtilsService.colorLines(child, 4, prevTop, line);

                                            line = res.line;
                                            prevTop = res.prevTop;

                                            var parent = child.parentNode;
                                            var nextElement = child.nextSibling;
                                            parent.removeChild(child);
                                            parent.insertBefore(res.documentFragment, nextElement);
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
                            console.log('change text', $scope.text);
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