/* File: vocalSynthesis.js
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

cnedApp.directive('vocalSynthesis',

    function (keyboardSelectionService, speechService, serviceCheck, $log, $timeout, $window) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {

                function speak() {
                    $log.debug('$scope.speak');
                    speechService.stopSpeech();
                    $timeout(function () {
                        var text = getSelectedText();
                        $log.debug('$scope.getSelectedText()', text);
                        if (text && !/^\s*$/.test(text)) {
                            checkAudioRights().then(function (audioRights) {
                                $log.debug('$scope.checkAudioRights()', audioRights);

                                if (audioRights && checkBrowserSupported()) {
                                    serviceCheck.isOnline().then(function () {
                                        scope.displayOfflineSynthesisTips = false;
                                        speechService.speech(text, true);
                                        window.document.addEventListener('click', $scope.stopSpeech, false);
                                    }, function () {
                                        scope.displayOfflineSynthesisTips = !scope.neverShowOfflineSynthesisTips;
                                        speechService.speech(text, false);
                                    });
                                }
                            });
                        }
                    }, 10);
                }

                function getSelectedText() {
                    var text = '';
                    if ($window.getSelection) {
                        text = $window.getSelection().toString();
                    } else if (document.selection && document.selection.type !== 'Control') {
                        text = document.selection.createRange().text;
                    }
                    return text;
                }

                function checkAudioRights() {
                    return serviceCheck.getData().then(function (statusInformation) {
                        if (statusInformation.user && statusInformation.user.local && statusInformation.user.local.authorisations) {
                            scope.displayNoAudioRights = !statusInformation.user.local.authorisations.audio && !scope.neverShowNoAudioRights;
                            return statusInformation.user.local.authorisations.audio;
                        } else {
                            scope.displayNoAudioRights = false;
                            return true;
                        }
                    }, function () {
                        scope.displayNoAudioRights = false;
                        return true;
                    });
                }

                function checkBrowserSupported() {
                    var browserSupported = speechService.isBrowserSupported();
                    if (!browserSupported && !scope.neverShowBrowserNotSupported) {
                        scope.displayBrowserNotSupported = true;
                    } else {
                        scope.displayBrowserNotSupported = false;
                    }

                    $log.debug('$scope.checkBrowserSupported()', browserSupported);
                    return browserSupported;
                }

                function speakOnKeyboard(event) {
                    if (keyboardSelectionService.isSelectionCombination(event)) {
                        $scope.speak();
                    }
                }

                elm.bind('dblclick', speak);
                elm.bind('mouseup', speak);
                elm.bind('keyup', speakOnKeyboard);

            }
        };
    });
