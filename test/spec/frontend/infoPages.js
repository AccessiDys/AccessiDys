/* File: infoPages.js
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

describe('Controller: infoPagesCtrl', function() {

  // load the controller's module
  beforeEach(module('cnedApp'));

  var infoPagesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope) {
    scope = $rootScope.$new();
    infoPagesCtrl = $controller('infoPagesCtrl', {
      $scope: scope
    });

  }));

  it('should redirect to mentions Page ', function() {
    scope.showMentions();
    expect(scope.showMentions).toBeDefined();
  });

  it('should redirect to about Page ', function() {
    scope.showAbout();
    expect(scope.showAbout).toBeDefined();
  });

  it('should redirect to contribute info Page ', function() {
    scope.showContribute();
    expect(scope.showContribute).toBeDefined();
  });

  it('mentionsCtrl : Open User Guide ', function () {
    scope.openUserGuide();
    expect(scope.openUserGuide).toBeDefined();
  });

});
