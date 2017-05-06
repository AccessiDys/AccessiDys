/* File: regleStyle.js
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

/*global cnedApp,Hyphenator, $:false */
'use strict';

/*
 * Directive to apply a rule of style to a paragraph.
 */
cnedApp.directive('profileStyle',

    function (UtilsService) {
        return {
            restrict: 'A',
            scope: {
                profile: '=profile'
            },
            link: function (scope, element) {

                var generateProfileStyle = function(){

                    if (scope.profile) {

                        var profile = scope.profile.data;
                        var className = '.' + profile.className;
                        var profileStyle = '';

                        for (var i = 0; i < profile.profileTags.length; i++) {
                            profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' {';
                            profileStyle += 'font-family: ' + profile.profileTags[i].police + ' !important;';
                            profileStyle += 'font-size: ' + (profile.profileTags[i].taille / 12) + 'em !important;';
                            profileStyle += 'line-height: ' + (1.286 + (profile.profileTags[i].interligne - 1) * 0.18) + 'em !important;';
                            profileStyle += 'word-spacing: ' + (0 + (profile.profileTags[i].spaceSelected - 1) * 0.18) + 'em !important;';
                            profileStyle += 'letter-spacing: ' + (0 + (profile.profileTags[i].spaceCharSelected - 1) * 0.12) + 'em !important;';
                            profileStyle += 'font-weight: ' + profile.profileTags[i].styleValue + ';';
                            profileStyle += '}';

                            profileStyle += className + '.preview ' + profile.profileTags[i].tagDetail.balise + ' {';
                            if (profile.profileTags[i].tagDetail.balise === 'p') {
                                profileStyle += 'height: ' + ((1.286 + (profile.profileTags[i].interligne - 1) * 0.18) * 4) + 'em' + ';';
                            } else {
                                profileStyle += 'height: ' + (1.286 + (profile.profileTags[i].interligne - 1) * 0.18) + 'em' + ';';
                            }
                            profileStyle += 'overflow: hidden;';
                            profileStyle += '}';

                            switch (profile.profileTags[i].coloration) {
                                case 'Colorer les lignes RBV':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #066ED9;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #4BD906;';
                                    profileStyle += '}';

                                    break;
                                case 'Colorer les lignes RVJ':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #4BD906;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #ECE20F;';
                                    profileStyle += '}';

                                    break;

                                case 'Colorer les lignes RBVJ':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #066ED9;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #4BD906;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                    profileStyle += 'color: #ECE20F;';
                                    profileStyle += '}';
                                    break;

                                case 'Colorer les mots':
                                case 'Colorer les syllabes':
                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(2n) {';
                                    profileStyle += 'color: #066ED9;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n) {';
                                    profileStyle += 'color: #4BD906;';
                                    profileStyle += '}';


                                    break;

                                case 'Surligner les mots':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(1n) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #fffd01;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + 'span:nth-child(2n) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #04ff04;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' span:nth-child(3n) {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #04ffff;';
                                    profileStyle += '}';


                                    break;

                                case 'Surligner les lignes RBV':


                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #066ED9;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #4BD906;';
                                    profileStyle += '}';

                                    break;
                                case 'Surligner les lignes RVJ':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #4BD906;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #ECE20F;';
                                    profileStyle += '}';

                                    break;
                                case 'Surligner les lignes RBVJ':

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line1 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #D90629;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line2 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #066ED9;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line3 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #4BD906;';
                                    profileStyle += '}';

                                    profileStyle += className + ' ' + profile.profileTags[i].tagDetail.balise + ' .line4 {';
                                    profileStyle += 'color: #000;';
                                    profileStyle += 'background-color: #ECE20F;';
                                    profileStyle += '}';

                                    break;

                            }

                        }

                        element.html(profileStyle);

                    }

                };

                scope.$watch('profile', function(){
                    generateProfileStyle();
                }, true);

            }
        };


    });