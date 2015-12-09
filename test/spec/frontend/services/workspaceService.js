/* File: workspaceService.js
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
        'Service: workspaceService',
        function() {
            beforeEach(module('cnedApp'));

            beforeEach(inject(function() {
            }));

            it('workspaceService:splitPages', inject(function(workspaceService) {
                var htmlToSplit = '<h1>test</h1><div style="page-break-after: always"><span style="display: none;">&nbsp;</span></div><h2>test</h2>';
                var result = workspaceService.splitPages(htmlToSplit);
                expect(result.length).toBe(2);
                expect(result[0]).toEqual('<h1>test</h1>');
                expect(result[1]).toEqual('<h2>test</h2>');
            }));

            it('workspaceService:cleanString', inject(function(workspaceService) {
                var textToClean = 'ABC def';
                var result = workspaceService.cleanString(textToClean);
                expect(result).toEqual('abcdef');
            }));

            it('workspaceService:cleanAccent', inject(function(workspaceService) {
                var textToClean = 'é';
                var result = workspaceService.cleanAccent(textToClean);
                expect(result).toEqual('e');
            }));

            it('workspaceService:saveTempNotesForPrint ', inject(function(workspaceService) {
                var notes = { id: '1'};
                workspaceService.saveTempNotesForPrint(notes);
                var result = localStorage.getItem('tempNotes');
                expect(result).toEqual(angular.toJson({'id':'1'}));
            }));

            it('workspaceService:getTempNotesForPrint ', inject(function(workspaceService) {
                var notes = { id: '1'};
                localStorage.setItem('tempNotes','{"id":"1"}');
                var notesForPrint = workspaceService.getTempNotesForPrint();
                expect(notesForPrint).toEqual(notes);

                localStorage.removeItem('tempNotes');
                notesForPrint = workspaceService.getTempNotesForPrint();
                expect(notesForPrint.length).toBe(0);
            }));

            it('workspaceService:restoreNotesStorage ', inject(function(workspaceService) {
                var notesDoc = {
                        'idNote' : '1401965900625976',
                        'idInPage' : 1,
                        'idDoc' : '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232',
                        'idPage' : 1,
                        'texte' : 'Note 1',
                        'x' : 750,
                        'y' : 194,
                        'xLink' : 382,
                        'yLink' : 194,
                        'styleNote' : '<p data-font=\'opendyslexicregular\' data-size=\'14\' data-lineheight=\'18\' data-weight=\'Normal\' data-coloration=\'Surligner les lignes\' > Note 1 </p>'
                    };
                var notes =  { '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232' : [notesDoc] };

                localStorage.setItem('notes', JSON.stringify(angular.toJson(notes)));
                var notesStorage = workspaceService.restoreNotesStorage('3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232');
                expect(notesStorage.length).toBe(1);
                expect(notesStorage[0]).toEqual(notesDoc);

                notesStorage = workspaceService.restoreNotesStorage('fauxDocument');
                expect(notesStorage.length).toBe(0);

                localStorage.removeItem('notes');
                notesStorage = workspaceService.restoreNotesStorage('pasDeNotes');
                expect(notesStorage.length).toBe(0);
            }));

            it('workspaceService:parcourirHtml ', inject(function(workspaceService, configuration) {
                var data = '<h1><p>test</p><a href="/test">premier lien</a><a href="http://wikipedia.org/test">second lien</a><img src="/img.jpg"/><img src="http://wikipedia.org/img2.jpg"/><a href="#1">hash1</a><a href="'+configuration.URL_REQUEST+'">lien3</a><img src="'+configuration.URL_REQUEST+'/img3"/></h1>';
                var tag = {
                    balise : 'h1',
                    niveau : 1
                };
                localStorage.setItem('listTags', JSON.stringify([tag]));
                var result = workspaceService.parcourirHtml(data, 'localhost', '443');
                expect(result[0]).toEqual('<h1>Sommaire</h1><br /><p style="margin-left:0px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,0)">testpremier liensecond lienhash1lien3</p>');
                expect(result[1]).toEqual('<h1 id="0"><p>test</p><a href="'+configuration.URL_REQUEST+'/#/apercu?url=http:%2F%2Flocalhost:9080%2Ftest">premier lien</a><a href="'+configuration.URL_REQUEST+'/#/apercu?url=http:%2F%2Fwikipedia.org%2Ftest">second lien</a><img src="/img.jpg"><img src="http://wikipedia.org/img2.jpg">hash1<a href="'+configuration.URL_REQUEST+'/#/apercu?url=https:%2F%2Flocalhost%2F">lien3</a><img src="https://localhost/img3"></h1>');

                data = '<h1>titre1</h1><h2>titre2</h2><h3>titre3</h3><h4>titre4</h4><h5>titre5</h5><h6>titre6</h6><p>paragraphe</p>';
                var tags = [{
                    balise : 'h1',
                    niveau : 0
                },
                {
                    balise : 'h2',
                    niveau : 1
                },
                {
                    balise : 'h3',
                    niveau : 2
                },
                {
                    balise : 'h4',
                    niveau : 3
                },
                {
                    balise : 'h5',
                    niveau : 4
                },
                {
                    balise : 'h6',
                    niveau : 5
                },
                {
                    balise : 'p',
                    niveau : 5
                }
                ];
                localStorage.setItem('listTags', JSON.stringify(tags));
                result = workspaceService.parcourirHtml(data, 'localhost', '443');
                expect(result[0]).toEqual('<h1>Sommaire</h1><br /><p style="margin-left:180px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,0)">titre1</p><p style="margin-left:0px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,1)">titre2</p><p style="margin-left:30px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,2)">titre3</p><p style="margin-left:60px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,3)">titre4</p><p style="margin-left:90px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,4)">titre5</p><p style="margin-left:120px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,1,5)">titre6</p>');
                expect(result[1]).toEqual('<h1 id="0">titre1</h1><h2 id="1">titre2</h2><h3 id="2">titre3</h3><h4 id="3">titre4</h4><h5 id="4">titre5</h5><h6 id="5">titre6</h6><p id="6">paragraphe</p>');
            }));
        });
