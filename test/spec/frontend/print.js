/* File: print.js
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

/* global spyOn:false */

'use strict';

describe('Controller:PrintCtrl', function () {
	var scope, controller, routeParams, fileStorageService, deferred, workspaceService;

	routeParams = {
        plan : 1,
        mode : 0
	};

	beforeEach(module('cnedApp'));

	beforeEach(inject(function ($controller, $rootScope, configuration, $q) {

        fileStorageService = {
                getTempFileForPrint : function() {
                    deferred = $q.defer();
                    // Place the fake return object here
                    deferred.resolve(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
                    return deferred.promise;
                }
            };

        workspaceService = {
            getTempNotesForPrint : function() {
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
                var notes =  { '3330b762b5a39aa67b75fc4cc666819c1aab71e2f7de1227b17df8dd73f95232' : notesDoc };
                    return notes;
                }
        };

        scope = $rootScope.$new();
        controller = $controller('PrintCtrl', {
            $scope: scope,
            $routeParams : routeParams,
            fileStorageService : fileStorageService,
            workspaceService : workspaceService
        });
    }));

    it('PrintCtrl:drawLine()', function () {
        expect(scope.loader).toBe(true);
    });
	
	it('PrintCtrl:init', inject(function($rootScope, $timeout) {
        // mock angular element (cause offset is not supported in tests)
        spyOn(angular, 'element').andReturn({
            offset : function() {
                return {left: 20};
            },
            width : function() {
                return 100;
            },
            height : function() {
                return 100;
            },
            css : function() {
                return;
            },
            html : function() {
                return 'test';
            },
            replaceWith : function() {
                return '<span>test</span>';
            }
        });

        routeParams.plan=1;
        routeParams.mode=0;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(3);
        expect(scope.currentContent[0]).toEqual('<h1>Sommaire</h1>');
        expect(scope.currentContent[1]).toEqual('<p>test</p>');
        expect(scope.currentContent[2]).toEqual('<p>page2</p>');
        $timeout.flush();
        
        routeParams.plan=0;
        routeParams.mode=0;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(2);
        expect(scope.currentContent[0]).toEqual('<p>test</p>');
        expect(scope.currentContent[1]).toEqual('<p>page2</p>');
        $timeout.flush();
        
        routeParams.plan=1;
        routeParams.mode=1;
        routeParams.page=1;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(2);
        expect(scope.currentContent[0]).toEqual('<h1>Sommaire</h1>');
        expect(scope.currentContent[1]).toEqual('<p>test</p>');
        $timeout.flush();
        
        routeParams.plan=1;
        routeParams.mode=1;
        routeParams.page=0;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(1);
        expect(scope.currentContent[0]).toEqual('<h1>Sommaire</h1>');
        
        routeParams.plan=0;
        routeParams.mode=1;
        routeParams.page=1;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(1);
        expect(scope.currentContent[0]).toEqual('<p>test</p>');
        $timeout.flush();
        
        routeParams.plan=0;
        routeParams.mode=1;
        routeParams.page=0;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(0);
        $timeout.flush();
        
        routeParams.plan=0;
        routeParams.mode=2;
        routeParams.pageDe=1;
        routeParams.pageA=1;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(1);
        expect(scope.currentContent[0]).toEqual('<p>test</p>');
        $timeout.flush();
        
        routeParams.plan=1;
        routeParams.mode=2;
        routeParams.pageDe=1;
        routeParams.pageA=1;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(2);
        expect(scope.currentContent[0]).toEqual('<h1>Sommaire</h1>');
        expect(scope.currentContent[1]).toEqual('<p>test</p>');
        $timeout.flush();
        
        routeParams.mode=25;
        scope.init();
        $rootScope.$apply();
        expect(scope.content).toEqual(['<h1>Sommaire</h1>', '<p>test</p>', '<p>page2</p>']);
        expect(scope.currentContent.length).toBe(0);
        $timeout.flush();
    }));

    it('PrintCtrl:hideLoader()', function () {
        scope.hideLoader();
    });
});
