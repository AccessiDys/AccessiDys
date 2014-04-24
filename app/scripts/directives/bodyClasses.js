/* File: bodyClasses.js
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

cnedApp.directive('bodyClasses', function() {
    return {
        link: function(scope, element) {
            var elementClasses = $(element).attr('class').split(' ');
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i] === 'doc-apercu') {
                    $('body').removeClass('modal-open');
                    $('body').find('.modal-backdrop').remove();
                }
            }
        }
    };
});

cnedApp.directive('maxLength', function() {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelCtrl) {
            var maxlength = Number(attrs.maxLength);

            function fromUser(text) {
                if (text && text.length > maxlength) {
                    var transformedInput = text.substring(0, maxlength);
                    ngModelCtrl.$setViewValue(transformedInput);
                    ngModelCtrl.$render();
                    return transformedInput;
                }
                return text;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});