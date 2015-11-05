/*File: speechService.js
 *
 * Copyright (c) 2014
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

    this.stopSpeech = function() {
        if ($window.speechSynthesis) {
            $window.speechSynthesis.cancel();
        }
    };

    /**
     * Verifie si le navigateur supporte la synthèse vocale et que des voix sont
     * disponibles.
     */
    this.isBrowserSupported = function() {
        return $window.SpeechSynthesisUtterance && $window.speechSynthesis.getVoices().length !== 0;
    };

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
     * Découpe le texte si sa taille est supérieure à 200 caractères.
     * 
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
     * Découpe le texte si s'il contient un retour à la ligne, un '.', '!', '?'.
     * Appelle les autres fonctions de découpe si ce n'est pas suffisant.
     * 
     * @method splitTextPriority1
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
     * Découpe le texte si s'il contient un ':', ';'. Appelle les autres
     * fonctions de découpe si ce n'est pas suffisant.
     * 
     * @method splitTextPriority2
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
     * Découpe le texte si s'il contient un ',', ')', ']', '}'. Appelle les
     * autres fonctions de découpe si ce n'est pas suffisant.
     * 
     * @method splitTextPriority3
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
     * Découpe le texte si s'il contient un '(', '{'. Appelle les autres
     * fonctions de découpe si ce n'est pas suffisant.
     * 
     * @method splitTextPriority4
     */
    this.splitTextPriority4 = function(text) {
        if (text.length < 200) {
            return [ text ];
        } else {
            var textSplitted = text.split(/[\({]/);
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
     * Découpe le texte si s'il contient un ' ' Découpe le texte en bloc de 200
     * caractères si ce n'est pas suffisant.
     * 
     * @method splitTextPriority5
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
     * Lit le texte donné après découpe et avec la voix accessible selon le mode
     * (connecté/déconnecté)
     * 
     * @method splitTextPriority5
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

    // 1er appel pour initialiser les voix (bug chrome)
    self.getVoice(true);

});