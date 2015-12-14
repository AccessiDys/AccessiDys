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

describe('Service: synchronisationService', function() {

    var q, deferred, localForage, profilsService;

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

    it('synchronisationService:syncProfil', inject(function(synchronisationService, $rootScope, $q) {
        q = $q;
        // test avec un profil à créer sans conflit
        var profilItem = {
            action : 'create',
            profil : {
                nom : 'nom'
            },
            profilTags : {
                tagId : '1'
            }
        };
        var operations = [];
        var rejectedItems = [];
        synchronisationService.syncProfil(profilItem, operations, rejectedItems);
        expect(operations.length).toBe(1);
        $rootScope.$apply();
        expect(profilsService.addProfil).toHaveBeenCalledWith({
            nom : 'nom'
        },{
            tagId : '1'
        });
        expect(rejectedItems.length).toBe(0);

        // test avec un profil à mettre à jour sans conflit
        profilItem = {
            action : 'update',
            profil : {
                _id : 'prof1',
                nom : 'nom'
            },
            profilTags : {
                tagId : '1'
            }
        };
        operations = [];
        rejectedItems = [];
        synchronisationService.syncProfil(profilItem, operations, rejectedItems);
        expect(operations.length).toBe(1);
        $rootScope.$apply();
        expect(profilsService.updateProfil).toHaveBeenCalledWith({
            _id : 'prof1',
            nom : 'nom'
        });
        expect(profilsService.updateProfilTags).toHaveBeenCalledWith('prof1', {
            tagId : '1'
        });
        expect(rejectedItems.length).toBe(0);
        
        // test avec un profil à supprimer
        profilItem = {
            action : 'delete',
            profil : {
                _id : 'prof1',
                nom : 'nom'
            },
            profilTags : {
                tagId : '1'
            }
        };
        operations = [];
        rejectedItems = [];
        localStorage.setItem('compteId','1');
        synchronisationService.syncProfil(profilItem, operations, rejectedItems);
        expect(operations.length).toBe(1);
        $rootScope.$apply();
        expect(profilsService.deleteProfil).toHaveBeenCalledWith('1', 'prof1');
        expect(rejectedItems.length).toBe(0);
    }));

});
