/* File: ckeditor.js
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

/*global cnedApp,CKEDITOR */
'use strict';

cnedApp.directive('ckEditor', ['$rootScope', function($rootScope) {
    return {
        require: '?ngModel',
        link: function($scope, elm, attr, ngModel) {
            var ck = CKEDITOR.replace(elm[0], {
                toolbar: attr.barre
            });

            ck.on('pasteState', function() {
                $scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function() {
                ck.setData(ngModel.$modelValue);
            };

            function updateModel() {
                $scope.$apply(function() {
                    ngModel.$setViewValue(ck.getData());
                });
            }

            ck.on('change', updateModel);
            ck.on('key', updateModel);
            ck.on('dataReady', updateModel);

            /* Get data of CKEDITOR */
            $rootScope.$on('getCkEditorValue', function() {
                $rootScope.ckEditorValue = CKEDITOR.instances.editorOcr.getData();
            });
        }
    };
}]);