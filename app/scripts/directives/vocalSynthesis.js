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
/*global cnedApp */
cnedApp.directive('vocalSynthesis',

    function (keyboardSelectionService, speechService, serviceCheck, $log, $timeout, $window, UtilsService, CacheProvider, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, elm) {

                /**
                 * Get the text selected
                 * @returns {string}
                 */
                function getSelectedText() {
                    var text = '';
                    if ($window.getSelection) {
                        text = $window.getSelection().toString();
                    } else if (document.selection && document.selection.type !== 'Control') {
                        text = document.selection.createRange().text;
                    }
                    return text;
                }

                /**
                 * Check if the browser is supported by vocal synthesis
                 * @returns {*|true}
                 */
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

                /**
                 * Launch the vocal synthesis with the selected text
                 */
                function speak() {

                    if (!scope.isEnableNoteAdd) {
                        $log.debug('$scope.speak');
                        speechService.stopSpeech();
                        $timeout(function () {
                            var text = getSelectedText();
                            $log.debug('$scope.getSelectedText()', text);
                            if (text && !/^\s*$/.test(text)) {

                                if (checkBrowserSupported()) {
                                    var artyom = new Artyom();
                                    var vocalSettings = {
                                        rate: 1,
                                        volume: 1,
                                        pitch: 1,
                                        voice: 'fr'
                                    };

                                    if ($rootScope.currentProfile && $rootScope.currentProfile.data && $rootScope.currentProfile.data.vocalSettings) {
                                        vocalSettings = $rootScope.currentProfile.data.vocalSettings;
                                    }

                                    var language = '';

                                    if (vocalSettings.voice === 'fr') {
                                        language = 'fr-FR';
                                    } else if (vocalSettings.voice === 'en') {
                                        language = 'en-US';
                                    } else if (vocalSettings.voice === 'es') {
                                        language = 'es-ES';
                                    } else if (vocalSettings.voice === 'de') {
                                        language = 'de-DE';
                                    }

                                    artyom.initialize({
                                        lang:language,
                                        continuous:false,
                                        debug:true,
                                        listen:false,
                                        volume: vocalSettings.volume,
                                        speed: vocalSettings.rate
                                    });

                                    artyom.say(text);

                                } else {
                                    CacheProvider.getItem('vocalSynthesisTipsShowed').then(function (isShowed) {
                                        if (!isShowed) {
                                            UtilsService.showInformationModal('label.information',
                                                'vocalsynthesis.message.info.notsupported', null, false, true)
                                                .then(function (result) {
                                                    if (result) {
                                                        CacheProvider.setItem(result.notShowAgain, 'vocalSynthesisTipsShowed');
                                                    }
                                                });
                                        }

                                    });

                                }
                            }
                        }, 10);
                    }


                }


                function speakOnKeyboard(event) {
                    if (!scope.isEnableNoteAdd && keyboardSelectionService.isSelectionCombination(event)) {
                        speak();
                    }
                }

                elm.bind('mouseup', speak);
                elm.bind('touchend', speak);
                elm.bind('keyup', speakOnKeyboard);

            }
        };
    });
