/*File: keyboardSelectionService.js
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

var cnedApp = cnedApp;

cnedApp.service('keyboardSelectionService', function($window) {

    this.startSelection = false;

    /**
     * Indicates whether the key combination is the end of a selection.
     * @method isSelectionCombination
     * @param keyupEvent
     *            The event
     * @param selectedText
     *            The currently selected text
     * @return true it is the end of selection, false otherwise 
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
     * Indicates whether the key combination is a combination of selection.
     * 
     * @method isSelectionCombination
     * @param keyupEvent
     *            The event
     * @return true if it is a combination of selection, false otherwise
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
            // special key for Mac OS
            if ($window.navigator.userAgent.indexOf('Mac OS X') !== -1) {
                // cmd+left
                if (keyupEvent.keyCode === 37 && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+right
                else if (keyupEvent.keyCode === 39 && keyupEvent.metaKey) {
                    isSelection = true;
                }

                // cmd+a
                else if (keyupEvent.keyCode === 65 && keyupEvent.metaKey) {
                    isSelection = true;
                }

            } else {
                // Key on the PC keyboard

                // ctrl+shift+home
                if (keyupEvent.keyCode === 36 && keyupEvent.shiftKey && keyupEvent.ctrlKey) {
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
        // shift or ctrl or windows and cmd
        return keyupEvent.keyCode === 16 || keyupEvent.keyCode === 17 || keyupEvent.keyCode === 91 || keyupEvent.keyCode === 92;
    };
});