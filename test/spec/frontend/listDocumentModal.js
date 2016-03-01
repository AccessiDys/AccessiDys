/*
 * File: listDocumentModal.js
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

describe('Controller: listDocumentModalCtrl', function() {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, modalInstance, contenu = 'TEST', raison = '/', titre = 'INFO', location, forcerFermeture = null;
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        modalInstance = {
            close : function() {
                return;
            },
            dismiss: function() {
                return;
            }
        };
        location = {
            path : function() {
                return '/';
            }
        };
        $scope = $rootScope.$new();
        $controller('listDocumentModalCtrl', {
            $scope : $scope,
            $modalInstance : modalInstance,
            content : contenu,
            reason : raison,
            title : titre,
            forceClose : forcerFermeture,
            $location : location
        });
    }));

    it('listDocumentModalCtrl:closeModal()', inject(function() {
        spyOn(modalInstance, 'dismiss');
        $scope.closeModal();
        expect(modalInstance.dismiss).toHaveBeenCalled();
    }));
    
    it('listDocumentModalCtrl:specificFilterForModal()', inject(function() {
        $scope.listDocument = [{
            'filename': 'Erreur'
        },{
            'filename': 'Test'
        }];
        spyOn($scope, 'specificFilterForModal').andCallThrough();
        $scope.searchQuery = {};
        $scope.searchQuery.query = 'Erreur';
        $scope.specificFilterForModal();
        expect($scope.specificFilterForModal).toHaveBeenCalled();
        expect($scope.listDocument[0].showed).toEqual(true);
    }));

});