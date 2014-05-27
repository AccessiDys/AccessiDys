/* File: documentMethodes.js
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

            if (attrs && attrs.id === 'imagePage') {
                $rootScope.showWorkspaceAction = true;

                // $(document).ready(function() {
                $('body').addClass('remove-scroll');
                var body_height = $(window).outerHeight();

                var header_height = $('#main_header').outerHeight();

                var dif_heights = body_height - header_height;
                dif_heights = dif_heights - 127;

                $('#global_container').css('height', dif_heights);
                $('.submit_document').show();

            } else if (attrs && attrs.id === 'printPage') {
                // Remove Header and Footer
                $('#main_header').hide();
                $('.footer').hide();
                $('#titreDocumentApercu').hide();
            } else {
                $('body').removeClass('remove-scroll');
                $('.submit_document').hide();
            }

            /*Detection du click sur le document pour l'affichage du Menu*/
            $(document).click(function(ev) {
                if ($(ev.target).closest('.actions_menu').length === 0) {
                    $rootScope.$emit('setHideMenu');
                }
                if (!$(ev.target).hasClass('action_btn')) {
                    $('.action_list').hide();
                    $('.action_btn').attr('data-shown', false);
                }
            });

            if ($(element).hasClass('doc-apercu')) {
                console.log('inside doc Apercu ... ');
                $('#masterContainer').addClass('apercu_page');
            }
            if ($(element).hasClass('doc-print')) {
                $('#masterContainer').addClass('print_page');
            }
        }
    };
}]);