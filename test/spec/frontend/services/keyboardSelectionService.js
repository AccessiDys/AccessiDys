/* File: keyboardSelectionService.js
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

describe(
        'Service: keyboardSelectionService',
        function() {
            var window;
            
            beforeEach(module('cnedApp'));

            beforeEach(function() {
                window = {
                        navigator : {
                            userAgent : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36'
                        }
                };
                
                module(function($provide) {
                    $provide.value('$window', window);
                });
            });
            
            it('keyboardSelectionService:isSelectionCombination', inject(function(keyboardSelectionService) {
                var keyupEvent = {
                        keyCode : 37,
                        shiftKey : true
                };
                keyboardSelectionService.startSelection = false;
                expect(keyboardSelectionService.isSelectionCombination(keyupEvent)).toBe(false);
                expect(keyboardSelectionService.startSelection).toBe(true);
                
                keyboardSelectionService.startSelection = false;
                keyupEvent.keyCode = 16;
                expect(keyboardSelectionService.isSelectionCombination(keyupEvent)).toBe(false);
                expect(keyboardSelectionService.startSelection).toBe(false);
                
                keyboardSelectionService.startSelection = true;
                keyupEvent.keyCode = 16;
                expect(keyboardSelectionService.isSelectionCombination(keyupEvent)).toBe(true);
                expect(keyboardSelectionService.startSelection).toBe(false);
                
                keyboardSelectionService.startSelection = true;
                keyupEvent.keyCode = 80;
                expect(keyboardSelectionService.isSelectionCombination(keyupEvent)).toBe(false);
                expect(keyboardSelectionService.startSelection).toBe(false);
            }));

            it('keyboardSelectionService:endSelection', inject(function(keyboardSelectionService) {
                var keyupEvent = {
                        keyCode : 16
                };
                expect(keyboardSelectionService.endSelection(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 17;
                expect(keyboardSelectionService.endSelection(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 91;
                expect(keyboardSelectionService.endSelection(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 92;
                expect(keyboardSelectionService.endSelection(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 24;
                expect(keyboardSelectionService.endSelection(keyupEvent)).toBe(false);
            }));
            
            it('keyboardSelectionService:eachChangeCombination', inject(function(keyboardSelectionService) {
                // normal keys combination
                var keyupEvent = {
                        keyCode : 37,
                        shiftKey : true
                };
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 38;
                keyupEvent.shiftKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 39;
                keyupEvent.shiftKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 40;
                keyupEvent.shiftKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 33;
                keyupEvent.shiftKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 34;
                keyupEvent.shiftKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                
                // test on pc
                keyupEvent.keyCode = 37;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 39;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 36;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 35;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 36;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 35;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 65;
                keyupEvent.shiftKey = false;
                keyupEvent.ctrlKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                
                window.navigator.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
                keyupEvent.keyCode = 37;
                keyupEvent.shiftKey = false;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 39;
                keyupEvent.shiftKey = false;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 37;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = false;
                keyupEvent.altKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 39;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = false;
                keyupEvent.altKey = true;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 37;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 39;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 38;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 40;
                keyupEvent.shiftKey = true;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                keyupEvent.keyCode = 65;
                keyupEvent.shiftKey = false;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(true);
                
                // mauvaise combinaison
                keyupEvent.keyCode = 80;
                keyupEvent.shiftKey = false;
                keyupEvent.ctrlKey = false;
                keyupEvent.metaKey = true;
                keyupEvent.altKey = false;
                expect(keyboardSelectionService.eachChangeCombination(keyupEvent)).toBe(false);
                
            }));
        });