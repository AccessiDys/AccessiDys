/* File: imgCropped.js
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

/*global cnedApp, $:false */
'use strict';

cnedApp.directive('imgCropped', [ '$rootScope', function($rootScope) {
  return {
    restrict: 'EA',
    replace: true,
    require: '?ngModel',
    scope: {
      src: '@',
      selected: '&'
    },
    link: function($scope, element) {
      var myImg;

      var clear = function() {
        if (myImg) {
          myImg.next().remove();
          myImg.remove();
          myImg = undefined;
        }
      };
      $scope.$watch('src', function(nv) {
        clear();
        if (nv) {
          element.after('<img />');
          myImg = element.next();
          myImg.attr('src', nv);
          $(myImg).Jcrop({
            trackDocument: true,
            // boxWidth: 791,
            onSelect: function(x) {
              $scope.$apply(function() {
                $scope.selected({
                  cords: x
                });
              });
            }
          });
        }
      });

      $scope.$on('$destroy', clear);

      $rootScope.$on('releaseCrop', function() {
        myImg.data('Jcrop').release();
      });

      $rootScope.$on('distroyJcrop', function() {
        if (myImg) {
          myImg.data('Jcrop').destroy();
        }
      });
    }
  };
}]);