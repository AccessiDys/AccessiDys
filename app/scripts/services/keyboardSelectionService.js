/*File: keyboardSelectionService.js
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
'use strict';

var cnedApp = cnedApp;

cnedApp.service('keyboardSelectionService', function() {

    this.startSelection = false;

    /**
     * Indique si la combinaison de touche correspond à la fin d'une sélection
     * 
     * @method isSelectionCombination
     * @param keyupEvent
     *            l'évènement
     * @param selectedText
     *            le texte actuellement sélectionné
     * @return true si c'est une fin de sélection, false sinon
     */
    this.isSelectionCombination = function(keyupEvent) {
        if (this.eachChangeCombination(keyupEvent)) {
            this.startSelection = true;
            return false;
        } else if (this.endSelection(keyupEvent)) {
            if (this.startSelection) {
                this.startSelection = false;
                return true;
            } else {
                return false;
            }
        } else {
            this.startSelection = false;
            return false;
        }

    };

    /**
     * Indique si la combinaison de touche correspond à une combinaison de
     * sélection
     * 
     * @method isSelectionCombination
     * @param keyupEvent
     *            l'évènement
     * @return true si c'est une combinaison de sélection, false sinon
     */
    this.eachChangeCombination = function(keyupEvent) {
        var isSelection = false;

        // shift+left
        if (keyupEvent.keyCode === 37 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        // shift+up
        else if (keyupEvent.keyCode === 38 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        // shift+right
        else if (keyupEvent.keyCode === 39 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        // shift+down
        else if (keyupEvent.keyCode === 40 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        // shift+pageup
        else if (keyupEvent.keyCode === 33 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        // shift+pagedown
        else if (keyupEvent.keyCode === 34 && keyupEvent.shiftKey) {
            isSelection = true;
        }

        else {
            // commande spéciale mac OS
            if (navigator.userAgent.indexOf('Mac OS X') !== -1) {
                // cmd+left
                if (keyupEvent.keyCode === 37 && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+right
                else if (keyupEvent.keyCode === 39 && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // alt+shift+left
                else if (keyupEvent.keyCode === 37 && keyupEvent.shiftKey && keyupEvent.altKey) {
                    isSelection = true;
                }

                // alt+shift+right
                else if (keyupEvent.keyCode === 39 && keyupEvent.shiftKey && keyupEvent.altKey) {
                    isSelection = true;
                }

                // cmd+shift+left
                else if (keyupEvent.keyCode === 37 && keyupEvent.shiftKey && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+shift+right
                else if (keyupEvent.keyCode === 39 && keyupEvent.shiftKey && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+shift+up
                else if (keyupEvent.keyCode === 38 && keyupEvent.shiftKey && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+shift+down
                else if (keyupEvent.keyCode === 40 && keyupEvent.shiftKey && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+a
                else if (keyupEvent.keyCode === 65 && keyupEvent.metaKey) {
                    isSelection = true;
                }

            } else {
                // commandes pc

                // ctrl+shift+left
                if (keyupEvent.keyCode === 37 && keyupEvent.shiftKey && keyupEvent.ctrlKey) {
                    isSelection = true;
                }

                // ctrl+shift+right
                else if (keyupEvent.keyCode === 39 && keyupEvent.shiftKey && keyupEvent.ctrlKey) {
                    isSelection = true;
                }

                // ctrl+shift+home
                else if (keyupEvent.keyCode === 36 && keyupEvent.shiftKey && keyupEvent.ctrlKey) {
                    isSelection = true;
                }

                // ctrl+shift+end
                else if (keyupEvent.keyCode === 35 && keyupEvent.shiftKey && keyupEvent.ctrlKey) {
                    isSelection = true;
                }

                // shift+home
                else if (keyupEvent.keyCode === 36 && keyupEvent.shiftKey) {
                    isSelection = true;
                }

                // shift+end
                else if (keyupEvent.keyCode === 35 && keyupEvent.shiftKey) {
                    isSelection = true;
                }

                // ctrl+a
                else if (keyupEvent.keyCode === 65 && keyupEvent.ctrlKey) {
                    isSelection = true;
                }

            }
        }
        return isSelection;
    };

    this.endSelection = function(keyupEvent) {
        // shift ou ctrl ou windows et cmd
        return keyupEvent.keyCode === 16 || keyupEvent.keyCode === 17 || keyupEvent.keyCode === 91 || keyupEvent.keyCode === 92;
    };
});