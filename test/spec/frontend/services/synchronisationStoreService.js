/* File: synchronisationStoreService.js
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

describe('Service: synchronisationStoreService', function() {

    var q, deferred, localForage, docToSyncArray, profilesToSyncArray, profilToUpdateOrDelete = {
        _id : '568a7ea78ee196ac3673e19a',
        descriptif : 'Plus recente',
        nom : 'MODIF',
        owner : '566ae2e346d31efc2b12d128',
        photo : '/test.img',
        state : 'mine',
        type : 'profile',
        updated : '2016-01-05T08:49:05.770Z'
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
        docToSyncArray = undefined;
        profilesToSyncArray = undefined;
        localForage = {
            getItem : function(item) {
                deferred = q.defer();
                if (item === 'docToSync') {
                    deferred.resolve(docToSyncArray);
                } else if (item === 'profilesToSync') {
                    deferred.resolve(profilesToSyncArray);
                } else {
                    deferred.reject();
                }
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
        spyOn(localForage, 'getItem').andCallThrough();
        spyOn(localForage, 'setItem').andCallThrough();
        spyOn(localForage, 'removeItem').andCallThrough();

        module(function($provide) {
            $provide.value('$localForage', localForage);
        });
    });

    it('synchronisationStoreService:storeDocumentToSynchronize', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;
        // test avec une liste de document à synchroniser vide au départ
        synchronisationStoreService.storeDocumentToSynchronize({
            docName : 'doc'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            docName : 'doc'
        } ]);

        // test avec une liste de document à synchroniser contenant déjà
        // un
        // document
        docToSyncArray = [ {
            docName : 'doc1'
        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            docName : 'doc'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            docName : 'doc1'
        }, {
            docName : 'doc'
        } ]);
    }));

    it('synchronisationStoreService:storeProfilToSynchronize', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;

        synchronisationStoreService.storeProfilToSynchronize({
            profil : 'prof1'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('profilesToSync', [ {
            profil : 'prof1'
        } ]);

        profilesToSyncArray = [ {
            profil : 'prof0'
        } ];
        synchronisationStoreService.storeProfilToSynchronize({
            profil : 'prof1'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('profilesToSync', [ {
            profil : 'prof0'
        }, {
            profil : 'prof1'
        } ]);
    }));

    it('synchronisationStoreService:storeTagToSynchronize ', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;
        var profilesToSyncArray1 = {
            profil : profilToUpdateOrDelete,
            profilTags : null
        };
        var profilesToSyncArray2 = {
            profil : profilToUpdateOrDelete,
            profilTags : profileTag
        };
        // no list of profile to sync
        synchronisationStoreService.storeTagToSynchronize(profilesToSyncArray1);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('profilesToSync', [ profilesToSyncArray1 ]);

        // a list with a profil, without tag, update the tag
        profilesToSyncArray = [ profilesToSyncArray1 ];
        synchronisationStoreService.storeTagToSynchronize(profilesToSyncArray2);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('profilesToSync', [ profilesToSyncArray2 ]);

    }));

});
