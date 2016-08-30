/*File: speechService.js
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
/* global SpeechSynthesisUtterance:false */
'use strict';

var cnedApp = cnedApp;

cnedApp.service('speechService', function($window) {
    var self = this;

    /**
     * Stops the speech.
     * @method stopSpeech
     */
    this.stopSpeech = function() {
        if ($window.speechSynthesis) {
            $window.speechSynthesis.cancel();
        }
    };

    /**
     * Checks whether the browser supports vocal synthesis 
     * and that the voices are available.
     * 
     * @method isBrowserSupported
     * @return true if the browser supports the vocal synthesis and that the voice are available ,
     * false otherwise
     */
    this.isBrowserSupported = function() {
        return $window.SpeechSynthesisUtterance && $window.speechSynthesis.getVoices().length !== 0;
    };

    /** 
     * Returns voice to be used
     * @method getVoice
     * @param connected : connected mode or not
     * @return if the mode is connected then returns the first French voice found. Otherwise returns the native voice.
     * */
    this.getVoice = function(connected) {
        if ($window.speechSynthesis) {
            var voicesAvailable = $window.speechSynthesis.getVoices();
            for (var i = 0; i < voicesAvailable.length; i++) {
                if (connected) {
                    if (voicesAvailable[i].lang === 'fr-FR') {
                        return voicesAvailable[i];
                    }
                } else {
                    if (voicesAvailable[i].name === 'native') {
                        return voicesAvailable[i];
                    }
                }
            }
        }
    };

    /**
     * Split the text if its size is larger than 200 characters.
     * @method splitText
     */
    this.splitText = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            return self.splitTextPriority1(text);
        }
    };

    /**
     * Split the text if it contains a line break,'.', '!', '?'.
     * Calls on other split functions if this is not enough.
     * 
     * @method splitTextPriority1
     * @param text The text to be split.
     */
    this.splitTextPriority1 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/[\n.!\?]/);
            if (textSplitted.length > 1) {
                for (var i = 0; i < textSplitted.length; i++) {
                    var textSplittedSplitted = self.splitText(textSplitted[i]);
                    textSplitted.splice.apply(textSplitted, [ i, 1 ].concat(textSplittedSplitted));
                }
            } else {
                textSplitted = self.splitTextPriority2(text);
            }
            return textSplitted;
        }
    };

    /**
     * Split the text if it contains a ':', ';'. 
     * Calls on other split functions if this is not enough.
     * 
     * @method splitTextPriority2
     * @param text The text to be split.
     */
    this.splitTextPriority2 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/[:;]/);
            if (textSplitted.length > 1) {
                for (var i = 0; i < textSplitted.length; i++) {
                    var textSplittedSplitted = self.splitText(textSplitted[i]);
                    textSplitted.splice.apply(textSplitted, [ i, 1 ].concat(textSplittedSplitted));
                }
            } else {
                textSplitted = self.splitTextPriority3(text);
            }
            return textSplitted;
        }
    };

    /**
     * Split the text if it contains a ',', ')', ']', '}'.
     * Calls on other split functions if this is not enough.
     * 
     * @method splitTextPriority3
     * @param text The text to be split.
     */
    this.splitTextPriority3 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/[,)\]}]/);
            if (textSplitted.length > 1) {
                for (var i = 0; i < textSplitted.length; i++) {
                    var textSplittedSplitted = self.splitText(textSplitted[i]);
                    textSplitted.splice.apply(textSplitted, [ i, 1 ].concat(textSplittedSplitted));
                }
            } else {
                textSplitted = self.splitTextPriority4(text);
            }
            return textSplitted;
        }
    };

    /**
     * Split the text if it contains a '(', '{', '['. 
     * Calls on other split functions if this is not enough.
     * 
     * @method splitTextPriority4
     * @param text The text to be split.
     */
    this.splitTextPriority4 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/[\[\({]/);
            if (textSplitted.length > 1) {
                for (var i = 0; i < textSplitted.length; i++) {
                    var textSplittedSplitted = self.splitText(textSplitted[i]);
                    textSplitted.splice.apply(textSplitted, [ i, 1 ].concat(textSplittedSplitted));
                }
            } else {
                textSplitted = self.splitTextPriority5(text);
            }
            return textSplitted;
        }
    };

    /**
     * Split the text if it contains a  ' ' .
     * Split the text in block of 200 characters if it is not sufficient.
     * 
     * @method splitTextPriority5
     * @param text The text to be split.
     */
    this.splitTextPriority5 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/ /);
            if (textSplitted.length > 1) {
                for (var i = 0; i < textSplitted.length; i++) {
                    var textSplittedSplitted = self.splitText(textSplitted[i]);
                    textSplitted.splice.apply(textSplitted, [ i, 1 ].concat(textSplittedSplitted));
                }
            } else {
                textSplitted.splice.apply(textSplitted, [ 0, 1 ].concat(textSplitted[0].match(/.{1,200}/g)));
            }
            return textSplitted;
        }
    };

    /**
     * Reads the given text after the split and
     * with the accessible voice according to the  mode.
     * (connected/disconnected)
     * 
     * @method speech
     */
    this.speech = function(text, connected) {
        if (text && !/^\s*$/.test(text)) {
            $window.speechSynthesis.cancel();
            var voice = self.getVoice(connected);
            if (voice) {
                var textArray = self.splitText(text);
                for (var i = 0; i < textArray.length; i++) {
                    if (textArray[i] && !/^\s*$/.test(textArray[i])) {
                        var utterance = new SpeechSynthesisUtterance();
                        utterance.lang = voice.lang;
                        utterance.rate = 1;
                        utterance.pitch = 1;
                        utterance.volume = 1;
                        utterance.voice = voice;
                        utterance.text = textArray[i];
                        $window.speechSynthesis.speak(utterance);
                    }
                }
            }
        }
    };

    // 1st call to initialize the voice (chrome bug)
    self.getVoice(true);

});