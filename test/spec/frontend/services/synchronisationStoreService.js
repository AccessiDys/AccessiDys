/* File: synchronisationStoreService.js
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
        spyOn(localForage, 'getItem').and.callThrough();
        spyOn(localForage, 'setItem').and.callThrough();
        spyOn(localForage, 'removeItem').and.callThrough();

        module(function($provide) {
            $provide.value('$localForage', localForage);
        });
    });

    it('synchronisationStoreService:storeDocumentToSynchronize', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;

        // test avec une liste de document à synchroniser vide au départ
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc',
            action : 'delete'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc',
            action : 'delete'
        } ]);

        // test avec une liste de document à synchroniser contenant déjà
        // un
        // document à synchroniser différent du document à synchroniser actuel
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'doc1',
            oldDocName : 'doc1',
            newDocName : 'doc2',

        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc',
            action : 'rename',
            oldDocName : 'doc',
            newDocName : 'doc3',
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'rename',
            oldDocName : 'doc1',
            newDocName : 'doc2',
        }, {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc',
            action : 'rename',
            oldDocName : 'doc',
            newDocName : 'doc3',
        } ]);

        // test avec un delete sur un document déjà à synchroniser et existant
        // sur le serveur
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'doc1',
            oldDocName : 'doc1',
            newDocName : 'doc2',
        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc2',
            action : 'delete'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'delete',
            oldDocName : 'doc1',
            newDocName : 'doc2',
        } ]);

        // test avec un delete sur un document à synchroniser et pas encore
        // créee sur le serveur
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'doc1',
            creation : true
        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'delete'
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', []);

        // test avec un update sur un document à synchroniser
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'doc1',
            creation : true,
            content : 'tes1',
            dateModification : 0
        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'update',
            content : 'tes2',
            dateModification : 1
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'update',
            creation : true,
            content : 'tes2',
            dateModification : 1
        } ]);

        // test avec un rename sur un document à synchroniser
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'doc1',
            content : 'tes1',
            dateModification : 0
        } ];
        synchronisationStoreService.storeDocumentToSynchronize({
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'rename',
            newDocName : 'tes2',
            oldDocName : 'doc1',
            dateModification : 1
        });
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalledWith('docToSync', [ {
            owner : 'yoniphilippe@gmail.com',
            docName : 'doc1',
            action : 'update_rename',
            content : 'tes1',
            newDocName : 'tes2',
            oldDocName : 'doc1',
            dateModification : 1
        } ]);

    }));

    it('synchronisationStoreService:mergeDocumentForDeleteAction ', inject(function(synchronisationStoreService, $rootScope) {
        // Cas d'un merge delete sur une action à synchroniser existante de type
        // rename ou update_rename
        var existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename'
        };
        var newItem = {
            action : 'delete',
        };

        synchronisationStoreService.mergeDocumentForDeleteAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.docName).toEqual('before rename');

        // Cas d'un merge delete sur une action à synchroniser existante de type
        // update ou delete
        existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            oldDocName : 'before rename'
        };
        newItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'delete',
        };

        synchronisationStoreService.mergeDocumentForDeleteAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.docName).toEqual('name to rename');
    }));

    it('synchronisationStoreService:mergeDocumentForRenameAction ', inject(function(synchronisationStoreService, $rootScope) {
        // Cas d'un merge rename sur une action à synchroniser existante de type
        // update
        var existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
        };
        var newItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 2
        };

        synchronisationStoreService.mergeDocumentForRenameAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.action).toEqual('update_rename');
        expect(existing.oldDocName).toEqual('before rename');
        expect(existing.newDocName).toEqual('to rename');
        expect(existing.dateModification).toBe(2);

        // Cas d'un merge rename sur une action à synchroniser existante de type
        // rename

        existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'old name',
            oldDocName : 'old name',
            newDocName : 'new name',
            dateModification : 1
        };
        newItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 2
        };

        synchronisationStoreService.mergeDocumentForRenameAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.action).toEqual('rename');
        expect(existing.oldDocName).toEqual('old name');
        expect(existing.newDocName).toEqual('to rename');
        expect(existing.dateModification).toBe(2);
    }));

    it('synchronisationStoreService:mergeDocumentForUpdateAction ', inject(function(synchronisationStoreService, $rootScope) {
        // merge an update action on an existing rename action
        var existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 1
        };
        var newItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            content : 'new content',
            dateModification : 2
        };

        synchronisationStoreService.mergeDocumentForUpdateAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.action).toEqual('update_rename');
        expect(existing.content).toEqual('new content');
        expect(existing.dateModification).toBe(2);

        // merge an update action on an existing update or update_rename action
        existing = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 1
        };
        newItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            content : 'new content',
            dateModification : 2
        };

        synchronisationStoreService.mergeDocumentForUpdateAction(existing, newItem);
        $rootScope.$apply();
        expect(existing.action).toEqual('update');
        expect(existing.content).toEqual('new content');
        expect(existing.dateModification).toBe(2);

    }));

    it('synchronisationStoreService:existingDocumentAction ', inject(function(synchronisationStoreService, $rootScope) {
        // case of an existing update action
        var docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename 3',
            content : 'new content',
            dateModification : 1
        }, {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            content : 'new content',
            dateModification : 1
        } ];
        var documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            content : 'new content',
            dateModification : 2
        };
        var i = synchronisationStoreService.existingDocumentAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(1);

        // case of an existing rename action
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 1
        }, ];

        documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'delete',
            docName : 'to rename',
            dateModification : 2
        };
        i = synchronisationStoreService.existingDocumentAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(0);

        // case of an existing update_rename action
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update_rename',
            docName : 'name to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 1
        }, ];

        documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'to rename',
            content : 'new content',
            dateModification : 2
        };
        i = synchronisationStoreService.existingDocumentAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(0);

    }));

    it('synchronisationStoreService:existingDocumentForRenameAction ', inject(function(synchronisationStoreService, $rootScope) {
        // case of an existing update action
        var docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename 3',
            content : 'new content',
            dateModification : 1
        }, {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            docName : 'name to rename',
            content : 'new content',
            dateModification : 1
        } ];
        var documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'name to rename',
            newDocName : 'to rename',
            dateModification : 2
        };
        var i = synchronisationStoreService.existingDocumentForRenameAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(1);

        // case of an existing rename action
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'rename',
            docName : 'name to rename',
            oldDocName : 'to rename',
            newDocName : 'before rename',
            dateModification : 1
        }, ];

        documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'delete',
            docName : 'to rename',
            oldDocName : 'before rename',
            newDocName : 'to rename',
            dateModification : 2
        };
        i = synchronisationStoreService.existingDocumentForRenameAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(0);

        // case of an existing update_rename action
        docToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update_rename',
            docName : 'name to rename',
            oldDocName : 'to rename',
            newDocName : 'before rename',
            dateModification : 1
        }, ];

        documentToSynchronize = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update_rename',
            docName : 'to rename',
            content : 'new content',
            oldDocName : 'before rename',
            newDocName : 'to rename 3',
            dateModification : 2
        };
        i = synchronisationStoreService.existingDocumentForRenameAction(docToSyncArray, documentToSynchronize);
        $rootScope.$apply();
        expect(i).toBe(0);
    }));
    it('synchronisationStoreService:storeProfilToSynchronize', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;
        // cas d'une création à synchroniser
        var profilItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'create',
            profil : {
                nom : 'prof1'
            }
        };
        synchronisationStoreService.storeProfilToSynchronize(profilItem);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalled();

        // cas d'une action create sur un élément créer et pas encore
        // synchroniser
        profilesToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'create',
            profil : {
                _id : 'encoreAcreer',
                nom : 'nouveauNom',
                updated : 4
            },
            profilTags : null
        } ];

        profilItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            profil : {
                _id : 'encoreAcreer',
                nom : 'NomMaj',
                updated : 6
            },
            profilTags : null
        };
        synchronisationStoreService.storeProfilToSynchronize(profilItem);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalled();

        // cas d'une action delete sur un élément créer et pas encore
        // synchroniser
        profilesToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'create',
            profil : {
                _id : 'encoreAcreer',
                nom : 'nouveauNom',
                updated : 4
            },
            profilTags : null
        } ];
        profilItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'delete',
            profil : {
                _id : 'encoreAcreer',
            },
            profilTags : null
        };

        synchronisationStoreService.storeProfilToSynchronize(profilItem);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalled();

        // cas d'une action delete sur un élément update déjà sur le serveur
        profilesToSyncArray = [ {
            owner : 'yoniphilippe@gmail.com',
            action : 'update',
            profil : {
                _id : 'dejaSurLeServeur',
                nom : 'MAJnom',
                updated : 4
            },
            profilTags : null
        } ];

        profilItem = {
            owner : 'yoniphilippe@gmail.com',
            action : 'delete',
            profil : {
                _id : 'dejaSurLeServeur',
            },
            profilTags : null
        };

        synchronisationStoreService.storeProfilToSynchronize(profilItem);
        $rootScope.$apply();
        expect(localForage.setItem).toHaveBeenCalled();
    }));

    it('synchronisationStoreService:storeTagToSynchronize ', inject(function(synchronisationStoreService, $rootScope, $q) {
        q = $q;
        var profilesToSyncArray1 = {
            owner : 'yoniphilippe@gmail.com',
            profil : profilToUpdateOrDelete,
            profilTags : null
        };
        var profilesToSyncArray2 = {
            owner : 'yoniphilippe@gmail.com',
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
