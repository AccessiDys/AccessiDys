/* File: tag.js
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
/* global jasmine, spyOn:false */

describe('Controller:TagCtrl', function () {
    var $scope, controller;
    var tags = [{
        _id: '52c588a861485ed41c000001',
        libelle: 'Exercice',
        balise: 'H1'
	}, {
        _id: '52c588a861485ed41c000002',
        libelle: 'Cours',
        balise: 'p'
	}];
    var tag = {
        _id: '52c588a861485ed41c000003',
        libelle: 'TP',
        balise: 'div'
    };

    var tag1 = {
        _id: '52c588a861485ed41c44343',
        libelle: 'Exercice',
        balise: 'H1',
        niveau: 1
    };

    var compteId = 'hsqhbhjds3543skdksdsddsd';

    beforeEach(module('cnedApp'));

    beforeEach(inject(function ($controller, $rootScope, $httpBackend, configuration) {
        $scope = $rootScope.$new();
        controller = $controller('TagCtrl', {
            $scope: $scope
        });

        localStorage.setItem('compteId', compteId);
        $rootScope.testEnv = true;
        $httpBackend.whenGET(configuration.URL_REQUEST + '/readTags?id=' + $scope.requestToSend.id).respond(tags);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/addTag', $scope.requestToSend).respond(tag);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/deleteTag').respond(tag);
        $httpBackend.whenPOST(configuration.URL_REQUEST + '/updateTag').respond(tag);
    }));

    it('TagCtrl:showDefaultNiveau', function () {
        expect($scope.showDefaultNiveau).toBeDefined();
        $scope.showDefaultNiveau(tag);
        expect(tag.niveau).toBe(1);
    });

    it('TagCtrl:getLibelleNiveau', function () {
        expect($scope.getLibelleNiveau).toBeDefined();
        var libNiv = $scope.getLibelleNiveau(2);
        expect(libNiv).toBe('Niveau 2');
    });

    it('TagCtrl:clearTag', function () {
        expect($scope.clearTag).toBeDefined();
        $scope.clearTag();
        expect($scope.showNiveauTag).toBe(true);
    });

    it('TagCtrl:afficherTags', inject(function ($httpBackend) {
        expect($scope.afficherTags).toBeDefined();

        $scope.tag = tag;
        $scope.tag.libelle = '';

        $scope.afficherTags();
        $httpBackend.flush();
        expect($scope.listTags.length).toBe(2);
    }));

    it('TagCtrl:setFiles', function () {
        var elm = {
            files: [{
                'webkitRelativePath': '',
                'lastModifiedDate': '2014-06-12T10:12:18.000Z',
                'name': 'p4.pdf',
                'type': 'image/PDF',
                'size': 1208
			}]
        };
        $scope.setFiles(elm);
        expect($scope.files.length).toEqual(0);
    });


    it('TagCtrl:setFiles', function () {
        var elm2 = {
            files: [{
                'webkitRelativePath': '',
                'lastModifiedDate': '2014-06-12T10:12:18.000Z',
                'name': 'p4.png',
                'type': 'image/png',
                'size': 1208
			}]
        };
        $scope.setFiles(elm2);
        expect($scope.files.length).toEqual(1);
    });


    it('TagCtrl:ajouterTag', function () {
        expect($scope.ajouterTag).toBeDefined();
        expect($scope.preAjouterTag).toBeDefined();
        $scope.preAjouterTag();
        $scope.tag = tag;
        $scope.tag.libelle = '';
        $scope.ajouterTag();
        $scope.tag = tag;
        $scope.tag.libelle = 'Solution';
        $scope.ajouterTag();
        $scope.tag = tag;
        $scope.tag.libelle = 'Solution';
        $scope.showNiveauTag = false;
        $scope.tag.position = 1;
        $scope.tag.niveau = undefined;
        $scope.ajouterTag();
        $scope.tag.libelle = 'Solution';
        $scope.showNiveauTag = true;
        $scope.tag.position = 1;
        $scope.ajouterTag();
        $scope.tag = tag;
        $scope.tag.balise = undefined;
        $scope.ajouterTag();

        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.ajouterTag();


        $scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
        spyOn(window, 'XMLHttpRequest').andReturn($scope.xhrObj);
        $scope.files = undefined;
        $scope.ajouterTag();
        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.ajouterTag();
        expect($scope.xhrObj.addEventListener).toHaveBeenCalled();
        expect($scope.xhrObj.addEventListener.calls.length).toBe(2);
    });

    it('TagCtrl:supprimerTag', inject(function ($httpBackend) {
        expect($scope.preSupprimerTag).toBeDefined();
        expect($scope.supprimerTag).toBeDefined();
        $scope.requestToSend.deleteTag = tag;
        $scope.supprimerTag();
        $scope.preSupprimerTag(tag);

        tag.libelle = 'Titre 1';
        $scope.preSupprimerTag(tag);


        $httpBackend.flush();
        expect(tag).toEqual($scope.tagFlag);
    }));

    it('TagCtrl:modifierTag', function () {
        expect($scope.preModifierTag).toBeDefined();
        $scope.preModifierTag(tag1);
        expect($scope.showNiveauTag).toEqual(false);
        expect($scope.modifierTag).toBeDefined();
        $scope.fiche = tag1;
        $scope.fiche.libelle = '';
        $scope.modifierTag();
        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Solution';
        $scope.modifierTag();
        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Solution';
        $scope.showNiveauTag = false;
        $scope.fiche.position = 1;
        $scope.fiche.niveau = undefined;
        $scope.modifierTag();
        $scope.fiche.libelle = 'Solution';
        $scope.showNiveauTag = true;
        $scope.fiche.position = 1;
        $scope.modifierTag();
        $scope.fiche.balise = undefined;
        $scope.modifierTag();

        $scope.fiche = tag1;
        $scope.fiche.libelle = 'Titre 1';
        $scope.preModifierTag(tag1);

        $scope.xhrObj = jasmine.createSpyObj('xhrObj', ['addEventListener', 'open', 'send']);
        spyOn(window, 'XMLHttpRequest').andReturn($scope.xhrObj);
        $scope.files = [{
            'webkitRelativePath': '',
            'lastModifiedDate': '2014-06-12T10:12:18.000Z',
            'name': 'p4.png',
            'type': 'image/png',
            'size': 1208
		}];
        $scope.modifierTag();
        expect($scope.xhrObj.addEventListener).toHaveBeenCalled();
        expect($scope.xhrObj.addEventListener.calls.length).toBe(2);
    });

    it('TagCtrl:uploadComplete', function () {
        expect($scope.uploadComplete).toBeDefined();
        $scope.uploadComplete();
        expect($scope.showNiveauTag).toBe(true);
    });

});