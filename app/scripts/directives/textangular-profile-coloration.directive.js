/* File: profileColoration.js
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

cnedApp.directive('textAngularProfileColoration',

    function (UtilsService, $timeout, $compile, $rootScope) {
        return {
            restrict: 'A',
            link: function (scope, element) {


                var splitByLines = function (balise, maxLines) {
                    angular.forEach(element.find(balise), function (elem) {

                        var ref = angular.element(elem);

                        var splitText = UtilsService.splitOnWordWithSpace(ref.html());
                        ref.html(splitText);

                        var prevTop = -9999;
                        var line = 0;
                        angular.forEach(element.find('span'), function (word) {

                            var wordRef = angular.element(word);

                            var top = wordRef[0].offsetTop;

                            if (top > prevTop) {
                                if (line >= maxLines) {
                                    line = 1;
                                } else {
                                    line++;
                                }
                            }

                            wordRef.addClass('line' + line);

                            prevTop = top;
                        });
                    });
                };

                var generateColoration = function () {
                    $timeout(function () {

                        var profile = $rootScope.currentProfile.data;
                        var text = element.html();

                        console.log('avant', text);

                        text = text.replace(/<span.*?>([\w,.':\?\-éèêàâôîïö\s]+)<\/span>/gi, '$1');

                        element.html(text);

                        console.log('profile', profile);
                        console.log('après', text);

                        if (profile && text) {

                            for (var i = 0; i < profile.profileTags.length; i++) {

                                switch (profile.profileTags[i].coloration) {

                                    case 'Colorer les lignes RBV':
                                    case 'Colorer les lignes RVJ':
                                    case 'Surligner les lignes RBV':
                                    case 'Surligner les lignes RVJ':
                                        splitByLines(profile.profileTags[i].tagDetail.balise, 3);
                                        break;
                                    case 'Colorer les lignes RBVJ':
                                    case 'Surligner les lignes RBVJ':
                                        splitByLines(profile.profileTags[i].tagDetail.balise, 4);
                                        break;

                                    case 'Colorer les mots':
                                    case 'Surligner les mots':
                                        angular.forEach(element.find(profile.profileTags[i].tagDetail.balise), function (elem) {
                                            var ref = angular.element(elem);
                                            var splitText = UtilsService.splitOnWordWithOutSpace(ref.html());
                                            ref.html(splitText);
                                        });
                                        break;
                                    case 'Colorer les syllabes':
                                        angular.forEach(element.find(profile.profileTags[i].tagDetail.balise), function (elem) {
                                            var ref = angular.element(elem);
                                            var splitText = UtilsService.splitOnSyllable(ref.html());
                                            ref.html(splitText);
                                        });
                                        break;

                                }
                            }
                        }
                    }, 100);
                };


                /*scope.$watch(function () {
                    return element.html().length;
                }, function (newValue, oldValue) {

                    console.log('newValue', newValue);
                    console.log('oldValue', oldValue);

                    if (newValue !== oldValue) {
                        generateColoration();
                    }
                });*/

                element.bind('keyup', function(event){
                    console.log('keyup', event.keyCode);
                    generateColoration();
                });
            }
        };


    });