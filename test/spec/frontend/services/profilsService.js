/* File: profilsService.js
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
/* global spyOn:false, BlobBuilder:true, URL:true */
/* exported URL */

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

var URL = {
        createObjectURL : function() {
            return '';
        }
    };

describe(
        'Service: profilsService',
        function() {
            var compteId, profil, profilEchec, fileStorageService, q, deferred, existingProfilResponse, 
            profilToWithRecentDate={
                    _id: "568a7ea78ee196ac3673e19a",
                    descriptif: "Plus ancienne",
                    nom: "MODIF",
                    owner: "566ae2e346d31efc2b12d128",
                    photo: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCACYAUwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAQFBgEDAgf/xAAyEAEAAQQAAwQIBgMBAAAAAAAAAQIDBBEFIVESMUFhEyIyM1JicXIjNIGRobEUwdFD/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAeEQEBAAICAwEBAAAAAAAAAAAAAQIxAxEhQVESMv/aAAwDAQACEQMRAD8A/RAHpZgAAAAAAAAAAAAAAAAREzMRETMz3RCfj8Kv3dTcmLdPnzn9nLZNm0AX1rhONR7cVVz808kq3j2rUat26KfpCLyR38sx2K9biirXXTi84xdv27MRaiYon26o8PJRKxvcL4dAU4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPuxZrv3Yt243VP8PhecFsRRj+lmPWuT3+Scr1CTt74eFaxaY1Har8a570oGG2gADkxuNSqOI8M1E3caOXfVR/xcDstjljIup/F8aLN+LlEapuc9dJQG8vc7QAOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0nDfyNn7WbaXh/wCSs/ZDPk0rFIAZKAAAAVfHvdWp+af6Uy5497m193+lM2w/lF2ALcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlwPyVj7IZ/Ft03ci3brmYpqq1OmltW4tWqbdO9UxqNsuS+lYvsBmoAAABV8e9za+7/SmaHimPTexpqqqmPRxNUefJnm3HpGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0xauxk2qulcf21LItLw/I/wAnGprn2o5VfVlyT2rFJAZqAAAARuJVdnBvT8umbW/G8jlTjx46qqn+lQ2wnhGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtuBXI/FtzPPlVCpemNfqx71Nynw746wnKdwnhqR52LtN61TcondNUbh6MGgAACHxPJnHx/V9uv1Y8vMk7FLn3fTZdyuJ5b1H6PAHojMAdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvhYleXXVTTVFMUxuZlyi+4fHZwrMfJEpD4tUejt00fDEQ+3naAACq497uz90/0tUHimJVlWqexMRNG51Pi7jty6UA469CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEvH4dkX9T2exT1q5fw5bIIa94LZm3jzcn/wBJ5fSHcfhVi3zubuVefd+yfTTFMRFMRER3RDPPLvxFSOgM1AABIAzGZZmxk1258J3H0l4tPkYtnI97biZ8J8YVuRweY3OPXv5a/wDrXHOe0XFVD7vWLtirV2iafr3S+GjgAAAAAAAAAAAAAAAAAAAAAAAAOJmFgXMr1p9S38U+P0ctkESImqYiImZnwhPxuFXruqrs+jp6d8rfGxLONH4dHPxqnnMvdneT4qYo2Ng2MfU0Ubq+KrnKSDNQAAAAAAAAADlVNNcTFURMT4Sr8nhNm5ubUzbq6Rzj9liOy2aOmaycK/j866N0/FTzhGa7SDlcNs391Ux6OvrT3T+i5yfU3FQD0yMe5jXOxcjn4T4TDzaJAHQAAAAAAAAAAAAAAAAABIwLEZGTTRV7Mc6vo0dPZppiI1ERGoiAY57Vi7uOsG46wCVG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsACNn49OTj1U8u3HOmfNnAacaMgBo4AAAAAAAA/9k=",
                    state: "mine",
                    type: "profile",
                    updated: "2017-01-05T08:49:05.770Z"
            },
            profilToUpdateOrDelete={
                    _id: "568a7ea78ee196ac3673e19a",
                    descriptif: "Plus recente",
                    nom: "MODIF",
                    owner: "566ae2e346d31efc2b12d128",
                    photo: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCACYAUwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAQFBgEDAgf/xAAyEAEAAQQAAwQIBgMBAAAAAAAAAQIDBBEFIVESMUFhEyIyM1JicXIjNIGRobEUwdFD/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAeEQEBAAICAwEBAAAAAAAAAAAAAQIxAxEhQVESMv/aAAwDAQACEQMRAD8A/RAHpZgAAAAAAAAAAAAAAAAREzMRETMz3RCfj8Kv3dTcmLdPnzn9nLZNm0AX1rhONR7cVVz808kq3j2rUat26KfpCLyR38sx2K9biirXXTi84xdv27MRaiYon26o8PJRKxvcL4dAU4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPuxZrv3Yt243VP8PhecFsRRj+lmPWuT3+Scr1CTt74eFaxaY1Har8a570oGG2gADkxuNSqOI8M1E3caOXfVR/xcDstjljIup/F8aLN+LlEapuc9dJQG8vc7QAOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0nDfyNn7WbaXh/wCSs/ZDPk0rFIAZKAAAAVfHvdWp+af6Uy5497m193+lM2w/lF2ALcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlwPyVj7IZ/Ft03ci3brmYpqq1OmltW4tWqbdO9UxqNsuS+lYvsBmoAAABV8e9za+7/SmaHimPTexpqqqmPRxNUefJnm3HpGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0xauxk2qulcf21LItLw/I/wAnGprn2o5VfVlyT2rFJAZqAAAARuJVdnBvT8umbW/G8jlTjx46qqn+lQ2wnhGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtuBXI/FtzPPlVCpemNfqx71Nynw746wnKdwnhqR52LtN61TcondNUbh6MGgAACHxPJnHx/V9uv1Y8vMk7FLn3fTZdyuJ5b1H6PAHojMAdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvhYleXXVTTVFMUxuZlyi+4fHZwrMfJEpD4tUejt00fDEQ+3naAACq497uz90/0tUHimJVlWqexMRNG51Pi7jty6UA469CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEvH4dkX9T2exT1q5fw5bIIa94LZm3jzcn/wBJ5fSHcfhVi3zubuVefd+yfTTFMRFMRER3RDPPLvxFSOgM1AABIAzGZZmxk1258J3H0l4tPkYtnI97biZ8J8YVuRweY3OPXv5a/wDrXHOe0XFVD7vWLtirV2iafr3S+GjgAAAAAAAAAAAAAAAAAAAAAAAAOJmFgXMr1p9S38U+P0ctkESImqYiImZnwhPxuFXruqrs+jp6d8rfGxLONH4dHPxqnnMvdneT4qYo2Ng2MfU0Ubq+KrnKSDNQAAAAAAAAADlVNNcTFURMT4Sr8nhNm5ubUzbq6Rzj9liOy2aOmaycK/j866N0/FTzhGa7SDlcNs391Ux6OvrT3T+i5yfU3FQD0yMe5jXOxcjn4T4TDzaJAHQAAAAAAAAAAAAAAAAABIwLEZGTTRV7Mc6vo0dPZppiI1ERGoiAY57Vi7uOsG46wCVG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsACNn49OTj1U8u3HOmfNnAacaMgBo4AAAAAAAA/9k=",
                    state: "mine",
                    type: "profile",
                    updated: "2016-01-05T08:49:05.770Z"
            },
            profilToCreate={
                    descriptif: "MODIF",
                    nom: "MODIF",
                    owner: "566ae2e346d31efc2b12d128",
                    photo: '/img/defautlt.png',
                    updated: new Date("2016-01-05T08:49:04.770Z")
            },
            profilToCreate2={
                    descriptif: "MODIF2",
                    nom: "MODIF2",
                    owner: "566ae2e346d31efc2b12d128",
                    photo: '/img/defautlt.png',
                    updated: new Date("2016-01-05T08:49:04.770Z")
            },
            profileTag=[{
                    _id: "568a7f668ee196ac3673e1a0",
                    coloration: "Colorer les mots",
                    interligne: "1",
                    police: "Arial",
                    profil: "568a7f1b8ee196ac3673e19d",
                    spaceCharSelected: 2,
                    spaceSelected: 2,
                    styleValue: "Gras",
                    tag: "539ec3ffb2f8051d03ec6917",
                    taille: "1",
                    texte: "<p data-font='Arial' data-size='1' data-lineheight='1.286' data-weight='Bold' data-coloration='Colorer les mots' data-word-spacing='0.18' data-letter-spacing='0.12' > </p>"
            }];
            
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

            beforeEach(inject(function($httpBackend, $q, $rootScope, configuration) {
                q=$q;
                
                var responseBlob = new NewBlob('h1 {font-family: Arial}', 'text/css');
                localStorage.setItem('compteId', compteId);
                $httpBackend.whenGET(/\/cssProfil\/testProfil\?id=compteId.*/).respond(responseBlob);
                $httpBackend.whenGET(/\/cssProfil\/testKO\?id=compteId.*/).respond(500, 'Internal Server Error');
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/updateProfil').respond(profilToUpdateOrDelete);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/ajouterProfils').respond(profilToUpdateOrDelete);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/deleteProfil').respond("200");
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToUpdateOrDelete).respond(profilToWithRecentDate);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToWithRecentDate).respond(profilToUpdateOrDelete);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToCreate).respond(profilToWithRecentDate);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToCreate2).respond(null);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/setProfilTags').respond(profileTag);
//                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil').respond(function(method, url, data) {
//                        return existingProfilResponse;
//                      });
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/setProfilTags').respond(profileTag);
            }));
            
            it('profilsService:getUrl', inject(function(profilsService, $httpBackend) {
                localStorage.setItem('compteId', compteId);
                localStorage.setItem('profilActuel', JSON.stringify(profil));
                $httpBackend.expectGET(/\/cssProfil\/testProfil\?id=compteId.*/);
                profilsService.getUrl();
                $httpBackend.flush();
                expect(fileStorageService.saveCSSInStorage).toHaveBeenCalled();
                expect(fileStorageService.getCSSInStorage).toHaveBeenCalled();
                
                
                localStorage.setItem('profilActuel', JSON.stringify(profilEchec));
                $httpBackend.expectGET(/\/cssProfil\/testKO\?id=compteId.*/);
                profilsService.getUrl();
                $httpBackend.flush();
                expect(fileStorageService.getCSSInStorage).toHaveBeenCalled();
            }));
            
            it('profilsService:updateProfil', inject(function(profilsService, $httpBackend, $rootScope, configuration) {
                var returned;
              //for an existing profile and an online user
                
                existingProfilResponse=profilToWithRecentDate;
                profilsService.updateProfil(true,profilToUpdateOrDelete).then(function(data){
                    returned=data;
                    expect(returned.descriptif).toEqual("Plus ancienne");
                });
                $httpBackend.flush();
                $rootScope.$apply();
                
              //for an unexisting profile and an online user
                existingProfilResponse=profilToUpdateOrDelete;
                profilsService.updateProfil(true,profilToWithRecentDate).then(function(data){
                    returned=data;
                    expect(returned.descriptif).toEqual("Plus recente");
                });
                $httpBackend.flush(); 
                $rootScope.$apply();
                
              //for an offline user
                profilsService.updateProfil(false,profilToUpdateOrDelete).then(function(data){
                    returned=data;
                    expect(returned.updated).not.toEqual(profilToUpdateOrDelete.updated);
                }); 
                $rootScope.$apply();
                
            }));
            
            it('profilsService:deleteProfil', inject(function(profilsService, $httpBackend,$rootScope) {
                var result;
                profilsService.deleteProfil(true, profilToUpdateOrDelete.owner, profilToUpdateOrDelete._id).then(function(data){
                    result = data;
                    expect(result).toEqual('200');
                });
                $httpBackend.flush(); 
                $rootScope.$apply();
            }));
            
            it('profilsService:addProfil', inject(function(profilsService, $httpBackend,$rootScope, configuration) {
                var returned;
                //for an existing profile
                profilsService.addProfil(true, profilToCreate,profileTag).then(function(data){
                    returned = data;
                    expect(returned._id).toEqual(profilToWithRecentDate._id);
                });
                $httpBackend.flush(); 
                $rootScope.$apply();
                
              //for an unexisting profile
                profilsService.addProfil(true, profilToCreate2,profileTag).then(function(data){
                    returned = data;
                    expect(returned).toBe(null);
                });
                $httpBackend.flush(); 
                $rootScope.$apply();
                
              //for an offline user
                profilsService.addProfil(false,profilToCreate, profileTag).then(function(data){
                    returned=data;
                    expect(returned._id).not.toEqual(returned.nom);
                }); 
                $rootScope.$apply();
            }));
            
        });