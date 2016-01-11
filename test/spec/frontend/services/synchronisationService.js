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

            var q, deferred, deferred2, localForage, profilsService, fileStorageService, profilWithRecentDate = {
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
            } ], documentWithOldDate = {
                dateModification : 1452186766000,
                filename : 'FIRST DOCUMENT',
                filepath : '/2016-1-7_FIRST DOCUMENT_c7015c8cffbd20c77a4a056af651df1c.html',
            }, documentWithRecentDate = {
                dateModification : 1452186766001,
                filename : 'UPDATED JUST NOW',
                filepath : '/2016-1-7_UPDATED JUST NOW_d41d8cd98f00b204e9800998ecf8427e.html'
            };

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
                    },
                    lookForExistingProfile : function() {

                    }
                };

                fileStorageService = {
                    searchFiles : function() {

                    },
                    saveFile : function() {

                    },
                    deleteFile : function() {

                    },
                    renameFile : function() {

                    },
                };

                spyOn(localForage, 'getItem').andCallThrough();
                spyOn(localForage, 'setItem').andCallThrough();
                spyOn(localForage, 'removeItem').andCallThrough();
                spyOn(profilsService, 'addProfil').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(profilsService, 'updateProfil').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(profilsService, 'deleteProfil').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(profilsService, 'lookForExistingProfile').andCallFake(function() {
                    return deferred2.promise;
                });
                spyOn(profilsService, 'updateProfilTags').andCallThrough();

                spyOn(fileStorageService, 'saveFile').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(fileStorageService, 'deleteFile').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(fileStorageService, 'renameFile').andCallFake(function() {
                    return deferred.promise;
                });
                spyOn(fileStorageService, 'searchFiles').andCallFake(function() {
                    return deferred2.promise;
                });

                module(function($provide) {
                    $provide.value('$localForage', localForage);
                    $provide.value('profilsService', profilsService);
                    $provide.value('fileStorageService', fileStorageService);
                });
            });

            it('synchronisationService:syncProfil', inject(function(synchronisationService, $rootScope, $q) {
                q = $q;
                // test avec un profil à créer sans conflit
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve(profilWithOldDate);
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

                // test avec un profil à créer avec conflit
                deferred = q.defer();
                // Place the fake return object here
                deferred.reject({
                    error : 'une erreur est survenue'
                });
                operations = [];
                rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                expect(operations.length).toBe(1);
                $rootScope.$apply();
                expect(profilsService.addProfil).toHaveBeenCalledWith(true, profilToCreate, profileTag);
                expect(rejectedItems.length).toBe(1);

                // test avec un profil à mettre à jour sans conflit
                deferred = q.defer();
                deferred2 = q.defer();
                // Place the fake return object here
                deferred.resolve(profilWithOldDate);
                deferred2.resolve({
                    data : profilWithOldDate
                });
                profilItem = {
                    action : 'update',
                    profil : profilWithRecentDate,
                    profilTags : profileTag
                };
                operations = [];
                rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(profilsService.updateProfil).toHaveBeenCalledWith(true, profilWithRecentDate);
                expect(profilsService.updateProfilTags).toHaveBeenCalledWith(true, profilWithRecentDate, profileTag);
                expect(rejectedItems.length).toBe(0);

                // test avec un profil à mettre à jour avec conflit d'existance
                // de profile avec le même nom et plus récent
                deferred = q.defer();
                deferred2 = q.defer();
                // Place the fake return object here
                deferred.resolve(profilWithRecentDate);
                deferred2.resolve({
                    data : profilWithRecentDate
                });
                profilItem = {
                    action : 'update',
                    profil : profilWithOldDate,
                    profilTags : profileTag
                };
                operations = [];
                rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(localForage.setItem).toHaveBeenCalled();

                // test avec un profil à mettre à jour avec conflit lié à une
                // erreur dans la MAJ côté serveur
                deferred = q.defer();
                deferred2 = q.defer();
                // Place the fake return object here
                deferred.reject({
                    error : 'une erreur est survenue'
                });
                deferred2.resolve({
                    data : profilWithOldDate
                });
                profilItem = {
                    action : 'update',
                    profil : profilWithRecentDate,
                    profilTags : profileTag
                };
                operations = [];
                rejectedItems = [];
                synchronisationService.syncProfil(profilItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);

                // test avec un profil à supprimer sans conflit serveur
                deferred = q.defer();
                // Place the fake return object here
                deferred.resolve('200');
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

                // test avec un profil à supprimer avec conflit serveur
                deferred = q.defer();
                // Place the fake return object here
                deferred.reject({
                    error : 'une erreur est survenue'
                });
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
                expect(rejectedItems.length).toBe(1);
            }));

            it('synchronisationService:syncDocument', inject(function(synchronisationService, $rootScope, $q) {
                q = $q;
                var docItem = {
                    action : 'update',
                    docName : 'file1',
                    content : 'content1',
                    dateModification : '12232434343434'
                };
                var operations = [];
                var rejectedItems = [];
                var token = 'token';

                // test avec un document à créer ou mettre à jour avec conflit
                // de date du document
                docItem = {
                    action : 'update',
                    docName : 'file1',
                    content : 'content1',
                    dateModification : documentWithOldDate.dateModification
                };
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve([ documentWithRecentDate ]);
                deferred.resolve(documentWithOldDate);

                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.saveFile).not.toHaveBeenCalled();

                // test avec un document à créer ou mettre à jour avec conflit
                // côté serveur
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve(null);
                deferred.reject(null);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);
                expect(fileStorageService.saveFile).toHaveBeenCalledWith(true, docItem.docName, docItem.content, token);

                // test avec un document à créer ou mettre à jour sans conflit
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve(null);
                deferred.resolve(documentWithOldDate);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.saveFile).toHaveBeenCalledWith(true, docItem.docName, docItem.content, token);

                // test avec un document à renomer avec conflit de date du
                // document
                docItem = {
                    action : 'rename',
                    oldDocName : 'file1',
                    newDocName : 'file2',
                    docName : 'file2',
                    content : 'content1',
                    dateModification : documentWithOldDate.dateModification
                };
                operations = [];
                rejectedItems = [];
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve([ documentWithRecentDate ]);
                deferred.resolve(documentWithOldDate);

                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.renameFile).not.toHaveBeenCalled();

                // test avec un document à renomer avec conflit côté serveur
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve(null);
                deferred.reject(null);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);
                expect(fileStorageService.renameFile).toHaveBeenCalledWith(true, docItem.oldDocName, docItem.newDocName, token);

                // test avec un document à renomer sans conflit
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve(null);
                deferred.resolve(documentWithOldDate);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.renameFile).toHaveBeenCalledWith(true, docItem.oldDocName, docItem.newDocName, token);

                // test avec un document à supprimer avec conflit  côté serveur
                docItem = {
                    action : 'delete',
                    docName : 'file1',
                    content : 'content1',
                    dateModification : documentWithOldDate.dateModification
                };
                deferred = q.defer();
                deferred.reject(null);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);
                expect(fileStorageService.deleteFile).toHaveBeenCalledWith(true, docItem.docName, token);

                // test avec un document à  supprimer sans conflit 
                deferred = q.defer();
                deferred.resolve(documentWithOldDate);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.deleteFile).toHaveBeenCalledWith(true, docItem.docName, token);
                
                //test avec un document à creer/maj puis renomer sans conflit
                deferred = q.defer();
                deferred.resolve(documentWithOldDate);
                operations = [];
                rejectedItems = [];
                docItem = {
                        action : 'update_rename',
                        docName : 'before rename',
                        content : 'content1',
                        oldDocName : 'before rename',
                        newDocName : 'renamed',
                        dateModification : documentWithOldDate.dateModification
                 };
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(0);
                expect(fileStorageService.saveFile).toHaveBeenCalledWith(true, docItem.docName, docItem.content, token);
                expect(fileStorageService.renameFile).toHaveBeenCalledWith(true, docItem.oldDocName, docItem.newDocName, token);
                
                //test avec un document à creer/maj puis renomer avec conflit serveur
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve(null);
                deferred.reject(null);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);
                expect(fileStorageService.saveFile).toHaveBeenCalledWith(true, docItem.docName, docItem.content, token);
                
                //test avec un document à creer/maj puis renomer avec conflit d'existance du fichier et conflit serveur pour le renomage qui est tenté
                deferred = q.defer();
                deferred2 = q.defer();
                deferred2.resolve([ documentWithRecentDate]);
                deferred.reject(null);
                operations = [];
                rejectedItems = [];
                synchronisationService.syncDocument(token, docItem, operations, rejectedItems);
                $rootScope.$apply();
                expect(operations.length).toBe(1);
                expect(rejectedItems.length).toBe(1);
                expect(fileStorageService.renameFile).toHaveBeenCalledWith(true, docItem.oldDocName, docItem.newDocName, token);
                expect(docItem.action).toEqual('rename');
            }));

        });
