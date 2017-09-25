/* File: tagsService.js
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
/* global spyOn:false */

describe('Service: tagsService', function () {

    var q, deferred, localForage, tags;

    beforeEach(module('cnedApp'));

    beforeEach(function () {
        tags = [{
            'tag': '52ea43f3791a003f09fd751a',
            'texte': '<p data-font=\'opendyslexicregular\' data-size=\'18\' data-lineheight=\'22\' data-weight=\'Gras\' data-coloration=\'Pas de coloration\'> </p>',
            'profil': '53ba8c260bfd0b4e7a567e96',
            'tagName': 'Titre 2',
            'police': 'opendyslexicregular',
            'taille': '18',
            'interligne': '22',
            'styleValue': 'Gras',
            'coloration': 'Pas de coloration',
            '_id': '53ba8c270bfd0b4e7a567e98',
            '__v': 0
        }];
        localForage = {
            getItem: function () {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve(tags);
                return deferred.promise;
            },
            setItem: function () {
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve();
                return deferred.promise;
            }
        };
        spyOn(localForage, 'setItem').and.callThrough();
        spyOn(localForage, 'getItem').and.callThrough();

        module(function ($provide) {
            $provide.value('$localForage', localForage);
        });
    });

    beforeEach(inject(function ($httpBackend, $q) {
        q = $q;
        $httpBackend.whenGET(/.*readTags.*id=token.*/).respond(tags);
        $httpBackend.whenGET(/.*readTags.*id=error.*/).respond(500, 'erreur');
        $httpBackend.whenGET(/.*readTags.*t=.*/).respond(tags);
    }));

    it('tagsService:getTags', inject(function (tagsService, $rootScope, $httpBackend) {
        var result;
        tagsService.getTags('token').then(function (data) {
            result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        expect(result).toEqual(tags);

        tagsService.getTags('error').then(function (data) {
            result = data;
        });
        $httpBackend.flush();
        $rootScope.$apply();
        expect(result).toEqual(tags);
    }));

});