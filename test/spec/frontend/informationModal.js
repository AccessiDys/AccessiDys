/*
 * File: synchronisationModal.js
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

describe('Controller: InformationModalCtrl', function() {

    // load the controller's module
    beforeEach(module('cnedApp'));

    var $scope, controller, modalInstance, contenu = 'TEST', raison = '/', titre = 'INFO', location, forcerFermeture = null;
    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
        modalInstance = {
            close : function() {
                return;
            }
        };
        location = {
            path : function() {
                return '/';
            }
        };
        $scope = $rootScope.$new();

    }));

    it('InformationModalCtrl:closeModal()', inject(function($controller) {
        spyOn(modalInstance, 'close');
        spyOn(location, 'path');
        // if test
        controller = $controller('InformationModalCtrl', {
            $scope : $scope,
            $modalInstance : modalInstance,
            content : contenu,
            reason : raison,
            title : titre,
            forceClose : forcerFermeture,
            $location : location
        });
        $scope.closeModal();
        expect(modalInstance.close).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalled();

        // else test
        raison = '/listDocument';
        controller = $controller('InformationModalCtrl', {
            $scope : $scope,
            $modalInstance : modalInstance,
            content : contenu,
            reason : raison,
            title : titre,
            forceClose : forcerFermeture,
            $location : location
        });
        $scope.closeModal();
        expect(modalInstance.close).toHaveBeenCalled();
        expect(location.path).toHaveBeenCalled();
    }));

});