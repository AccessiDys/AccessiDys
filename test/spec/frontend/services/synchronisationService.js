/* File: synchronisationService.js
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
/* global spyOn:false */

describe(
        'Service: synchronisationService',
        function() {

            var q, deferred, localForage, profilsService, profilWithRecentDate = {
                _id : '568a7ea78ee196ac3673e18a',
                descriptif : 'Plus ancienne',
                nom : 'MODIF',
                owner : '566ae2e346d31efc2b12d128',
                photo : '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCACYAUwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAQFBgEDAgf/xAAyEAEAAQQAAwQIBgMBAAAAAAAAAQIDBBEFIVESMUFhEyIyM1JicXIjNIGRobEUwdFD/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAeEQEBAAICAwEBAAAAAAAAAAAAAQIxAxEhQVESMv/aAAwDAQACEQMRAD8A/RAHpZgAAAAAAAAAAAAAAAAREzMRETMz3RCfj8Kv3dTcmLdPnzn9nLZNm0AX1rhONR7cVVz808kq3j2rUat26KfpCLyR38sx2K9biirXXTi84xdv27MRaiYon26o8PJRKxvcL4dAU4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPuxZrv3Yt243VP8PhecFsRRj+lmPWuT3+Scr1CTt74eFaxaY1Har8a570oGG2gADkxuNSqOI8M1E3caOXfVR/xcDstjljIup/F8aLN+LlEapuc9dJQG8vc7QAOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0nDfyNn7WbaXh/wCSs/ZDPk0rFIAZKAAAAVfHvdWp+af6Uy5497m193+lM2w/lF2ALcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlwPyVj7IZ/Ft03ci3brmYpqq1OmltW4tWqbdO9UxqNsuS+lYvsBmoAAABV8e9za+7/SmaHimPTexpqqqmPRxNUefJnm3HpGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0xauxk2qulcf21LItLw/I/wAnGprn2o5VfVlyT2rFJAZqAAAARuJVdnBvT8umbW/G8jlTjx46qqn+lQ2wnhGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtuBXI/FtzPPlVCpemNfqx71Nynw746wnKdwnhqR52LtN61TcondNUbh6MGgAACHxPJnHx/V9uv1Y8vMk7FLn3fTZdyuJ5b1H6PAHojMAdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvhYleXXVTTVFMUxuZlyi+4fHZwrMfJEpD4tUejt00fDEQ+3naAACq497uz90/0tUHimJVlWqexMRNG51Pi7jty6UA469CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEvH4dkX9T2exT1q5fw5bIIa94LZm3jzcn/wBJ5fSHcfhVi3zubuVefd+yfTTFMRFMRER3RDPPLvxFSOgM1AABIAzGZZmxk1258J3H0l4tPkYtnI97biZ8J8YVuRweY3OPXv5a/wDrXHOe0XFVD7vWLtirV2iafr3S+GjgAAAAAAAAAAAAAAAAAAAAAAAAOJmFgXMr1p9S38U+P0ctkESImqYiImZnwhPxuFXruqrs+jp6d8rfGxLONH4dHPxqnnMvdneT4qYo2Ng2MfU0Ubq+KrnKSDNQAAAAAAAAADlVNNcTFURMT4Sr8nhNm5ubUzbq6Rzj9liOy2aOmaycK/j866N0/FTzhGa7SDlcNs391Ux6OvrT3T+i5yfU3FQD0yMe5jXOxcjn4T4TDzaJAHQAAAAAAAAAAAAAAAAABIwLEZGTTRV7Mc6vo0dPZppiI1ERGoiAY57Vi7uOsG46wCVG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsACNn49OTj1U8u3HOmfNnAacaMgBo4AAAAAAAA/9k=',
                state : 'mine',
                type : 'profile',
                updated : '2017-01-05T08:49:05.770Z'
            }, profilWithOldDate = {
                _id : '568a7ea78ee196ac3673e19a',
                descriptif : 'Plus recente',
                nom : 'MODIF',
                owner : '566ae2e346d31efc2b12d128',
                photo : '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf/wAARCACYAUwDASIAAhEBAxEB/8QAGwABAAMBAQEBAAAAAAAAAAAAAAQFBgEDAgf/xAAyEAEAAQQAAwQIBgMBAAAAAAAAAQIDBBEFIVESMUFhEyIyM1JicXIjNIGRobEUwdFD/8QAGAEBAQEBAQAAAAAAAAAAAAAAAAIDAQT/xAAeEQEBAAICAwEBAAAAAAAAAAAAAQIxAxEhQVESMv/aAAwDAQACEQMRAD8A/RAHpZgAAAAAAAAAAAAAAAAREzMRETMz3RCfj8Kv3dTcmLdPnzn9nLZNm0AX1rhONR7cVVz808kq3j2rUat26KfpCLyR38sx2K9biirXXTi84xdv27MRaiYon26o8PJRKxvcL4dAU4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPuxZrv3Yt243VP8PhecFsRRj+lmPWuT3+Scr1CTt74eFaxaY1Har8a570oGG2gADkxuNSqOI8M1E3caOXfVR/xcDstjljIup/F8aLN+LlEapuc9dJQG8vc7QAOgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0nDfyNn7WbaXh/wCSs/ZDPk0rFIAZKAAAAVfHvdWp+af6Uy5497m193+lM2w/lF2ALcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlwPyVj7IZ/Ft03ci3brmYpqq1OmltW4tWqbdO9UxqNsuS+lYvsBmoAAABV8e9za+7/SmaHimPTexpqqqmPRxNUefJnm3HpGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD0xauxk2qulcf21LItLw/I/wAnGprn2o5VfVlyT2rFJAZqAAAARuJVdnBvT8umbW/G8jlTjx46qqn+lQ2wnhGWwBbgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtuBXI/FtzPPlVCpemNfqx71Nynw746wnKdwnhqR52LtN61TcondNUbh6MGgAACHxPJnHx/V9uv1Y8vMk7FLn3fTZdyuJ5b1H6PAHojMAdAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHvhYleXXVTTVFMUxuZlyi+4fHZwrMfJEpD4tUejt00fDEQ+3naAACq497uz90/0tUHimJVlWqexMRNG51Pi7jty6UA469CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEvH4dkX9T2exT1q5fw5bIIa94LZm3jzcn/wBJ5fSHcfhVi3zubuVefd+yfTTFMRFMRER3RDPPLvxFSOgM1AABIAzGZZmxk1258J3H0l4tPkYtnI97biZ8J8YVuRweY3OPXv5a/wDrXHOe0XFVD7vWLtirV2iafr3S+GjgAAAAAAAAAAAAAAAAAAAAAAAAOJmFgXMr1p9S38U+P0ctkESImqYiImZnwhPxuFXruqrs+jp6d8rfGxLONH4dHPxqnnMvdneT4qYo2Ng2MfU0Ubq+KrnKSDNQAAAAAAAAADlVNNcTFURMT4Sr8nhNm5ubUzbq6Rzj9liOy2aOmaycK/j866N0/FTzhGa7SDlcNs391Ux6OvrT3T+i5yfU3FQD0yMe5jXOxcjn4T4TDzaJAHQAAAAAAAAAAAAAAAAABIwLEZGTTRV7Mc6vo0dPZppiI1ERGoiAY57Vi7uOsG46wCVG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsABuOsG46wAG46wbjrAAbjrBuOsACNn49OTj1U8u3HOmfNnAacaMgBo4AAAAAAAA/9k=',
                state : 'mine',
                type : 'profile',
                updated : '2016-01-05T08:49:05.770Z'
            }, profilToCreate = {
                descriptif : 'MODIF',
                nom : 'MODIF',
                owner : '566ae2e346d31efc2b12d128',
                photo : '/img/defautlt.png',
                updated : new Date('2016-01-05T08:49:04.770Z')
            }, profilToCreate2 = {
                descriptif : 'MODIF2',
                nom : 'MODIF2',
                owner : '566ae2e346d31efc2b12d128',
                photo : '/img/defautlt.png',
                updated : null
            }, profileTag = [ {
                _id : '568a7f668ee196ac3673e1a0',
                coloration : 'Colorer les mots',
                interligne : '1',
                police : 'Arial',
                profil : '568a7f1b8ee196ac3673e19d',
                spaceCharSelected : 2,
                spaceSelected : 2,
                styleValue : 'Gras',
                tag : '539ec3ffb2f8051d03ec6917',
                taille : '1',
                texte : '<p data-font=\'Arial\' data-size=\'1\' data-lineheight=\'1.286\' data-weight=\'Bold\' data-coloration=\'Colorer les mots\' data-word-spacing=\'0.18\' data-letter-spacing=\'0.12\' > </p>'
            } ];

            beforeEach(module('cnedApp'));

            beforeEach(function() {
                localForage = {
                    getItem : function() {
                        deferred = q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    },
                    setItem : function() {
                        deferred = q.defer();
                        deferred.resolve();
                        return deferred.promise;
                    },
                    removeItem : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve();
                        return deferred.promise;
                    }
                };

                profilsService = {
                    addProfil : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve();
                        return deferred.promise;
                    },
                    updateProfil : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve();
                        return deferred.promise;
                    },
                    deleteProfil : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve({
                            data : {
                                _id : 'prof1'
                            }
                        });
                        return deferred.promise;
                    },
                    updateProfilTags : function() {
                        deferred = q.defer();
                        // Place the fake return object here
                        deferred.resolve();
                        return deferred.promise;
                    }
                };

                spyOn(localForage, 'getItem').andCallThrough();
                spyOn(localForage, 'setItem').andCallThrough();
                spyOn(localForage, 'removeItem').andCallThrough();
                spyOn(profilsService, 'addProfil').andCallThrough();
                spyOn(profilsService, 'updateProfil').andCallThrough();
                spyOn(profilsService, 'deleteProfil').andCallThrough();
                spyOn(profilsService, 'updateProfilTags').andCallThrough();

                module(function($provide) {
                    $provide.value('$localForage', localForage);
                    $provide.value('profilsService', profilsService);
                });
            });

            beforeEach(inject(function($httpBackend, $q, $rootScope, configuration) {
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilWithOldDate).respond(profilWithRecentDate);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilWithRecentDate).respond(profilWithOldDate);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToCreate).respond(profilWithRecentDate);
                $httpBackend.whenPOST(configuration.URL_REQUEST + '/existingProfil', profilToCreate2).respond(null);
            }));
            it('synchronisationService:syncProfil', inject(function(synchronisationService, $rootScope, $q,$httpBackend) {
                q = $q;
                // test avec un profil à créer sans conflit
                var profilItem = {
                    action : 'create',
                    profil : profilToCreate,
                    profilTags : profileTag
                };
                var operations = [];
                var rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                expect(operations.length).toBe(1);
                $rootScope.$apply();
                expect(profilsService.addProfil).toHaveBeenCalledWith(true, profilToCreate, profileTag);
                expect(rejectedItems.length).toBe(0);

                
                // test avec un profil à mettre à jour sans conflit
                profilItem = {
                    action : 'update',
                    profil : profilWithRecentDate,
                    profilTags : profileTag
                };
                operations = [];
                rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                $rootScope.$apply();
                $httpBackend.flush();
                expect(operations.length).toBe(1);
                expect(profilsService.updateProfil).toHaveBeenCalledWith(true, profilWithRecentDate);
                expect(profilsService.updateProfilTags).toHaveBeenCalledWith(true, profilWithRecentDate, profileTag);
                expect(rejectedItems.length).toBe(0);
                
                //test avec un profil à mettre à jour avec conflit
                profilItem = {
                        action : 'update',
                        profil : profilWithOldDate,
                        profilTags : profileTag
                    };
                    operations = [];
                    rejectedItems = [];
                    synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                    $rootScope.$apply();
                    $httpBackend.flush();
                    expect(localForage.setItem).toHaveBeenCalled();
                    
                // test avec un profil à supprimer
                profilItem = {
                    action : 'delete',
                    profil : profilWithOldDate,
                    profilTags : profileTag
                };
                operations = [];
                rejectedItems = [];
                localStorage.setItem('compteId', '1');
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                expect(operations.length).toBe(1);
                $rootScope.$apply();
                expect(profilsService.deleteProfil).toHaveBeenCalledWith(true, localStorage.getItem('compteId'), profilWithOldDate._id);
                expect(rejectedItems.length).toBe(0);
            }));
        });
