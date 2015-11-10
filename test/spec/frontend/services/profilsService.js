/* File: profilsService.js
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
/* global spyOn:false, BlobBuilder:true */

'use strict';

/** XBrowser blob creation **/
var NewBlob = function(data, datatype) {
    var out;

    try {
        out = new Blob([data], {type: datatype});
        console.debug('case 1');
    }
    catch (e) {
        window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;

        if (e.name === 'TypeError' && window.BlobBuilder) {
            var bb = new BlobBuilder();
            bb.append(data);
            out = bb.getBlob(datatype);
        }
        else if (e.name === 'InvalidStateError') {
            // InvalidStateError (tested on FF13 WinXP)
            out = new Blob([data], {type: datatype});
        }
        else {
            // We're screwed, blob constructor unsupported entirely   
            console.debug('Error');
        }
    }
    return out;
};

describe(
        'Service: profilsService',
        function() {
            var compteId, profil, profilEchec, fileStorageService, q, deferred;
            
            beforeEach(module('cnedApp'));
            
            beforeEach(function(){
                compteId = 'compteId';
                
                profil = { _id:'testProfil'};
                profilEchec = {_id:'testKO'};
                
                fileStorageService = {
                        saveCSSInStorage : function() {
                            deferred = q.defer();
                            deferred.resolve({});
                            return deferred.promise;
                        },
                        getCSSInStorage : function() {
                            deferred = q.defer();
                            // Place the fake return object here
                            deferred.resolve({});
                            return deferred.promise;
                        }
                    };
                spyOn(fileStorageService, 'saveCSSInStorage').andCallThrough();
                spyOn(fileStorageService, 'getCSSInStorage').andCallThrough();
                
                module(function($provide) {
                    $provide.value('fileStorageService', fileStorageService);
                });
            });

            beforeEach(inject(function($httpBackend, $q) {
                q=$q;
                
                $httpBackend.whenGET(/^\/cssProfil\/testProfil\?id=compteId/).respond(new NewBlob('h1 {font-family: Arial}', 'text/css'));
                $httpBackend.whenGET(/^\/cssProfil\/testKO\?id=compteId/).respond(500, 'Internal Server Error');
            }));
            
            it('profilsService:getUrl', inject(function(profilsService, $httpBackend) {
                localStorage.setItem('compteId', compteId);
                localStorage.setItem('profilActuel', JSON.stringify(profil));
                profilsService.getUrl();
                $httpBackend.expectGET(/\/cssProfil\/testProfil\?id=compteId.*/);
                $httpBackend.flush();
                expect(fileStorageService.saveCSSInStorage).toHaveBeenCalled();
                expect(fileStorageService.getCSSInStorage).toHaveBeenCalled();
                
                
                localStorage.setItem('profilActuel', JSON.stringify(profilEchec));
                profilsService.getUrl();
                $httpBackend.expectGET(/\/cssProfil\/testKO\?id=compteId.*/);
                $httpBackend.flush();
                expect(fileStorageService.getCSSInStorage).toHaveBeenCalled();
                
                
            }));
        });