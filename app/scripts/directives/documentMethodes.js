/* File: documentMethodes.js.js
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

cnedApp.directive('documentMethodes', ['$rootScope', function($rootScope) {
    return {
        link: function(scope, element, attrs) {

            console.log(attrs.id);
            if (attrs && attrs.id == 'imagePage') {
                console.log('documentMethodes');
                $rootScope.showWorkspaceAction = true;

                // $(document).ready(function() {
                $('body').addClass('remove-scroll');
                var body_height = $(window).outerHeight();
                console.log('body_height  ==>  ' + body_height);

                var header_height = $('#main_header').outerHeight();
                console.log('header_height  ==>  ' + header_height);

                var dif_heights = body_height - header_height;
                dif_heights = dif_heights - 127;
                console.log('dif_heights ==> ' + dif_heights);

                $('#global_container').css('height', dif_heights);
                console.log('global_container  ==>  ' + $('#global_container').css('height'));
            } else {
                $('body').removeClass('remove-scroll');
            }



            // setTimeout(function() {
            //     $('#global_container').css('height', dif_heights);
            // }, 3000)
            // });
        }
    };
}]);