/* File: image-menu.directive.js
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

/*global rangy */
'use strict';

/**
 * Directive to set coloration with TextAngular
 */
angular.module('cnedApp').directive('imageMenuContainer',

    function ($log, $compile) {
        return {
            restrict: 'A',
            link: function ($scope, element) {

                var renderMenu = function (image) {


                    var html =
                        '<div class="popover fade bottom in" style="max-width: 350px;">'
                        + '<div class="arrow" style="margin-left: -87px;"></div>'
                        + '<div class="popover-content" style="line-height: 28px;">'
                        + '<div class="btn-group" role="group" aria-label="...">'
                        + '<button type="button" class="btn btn-default" data-ng-click="resize(25)">25%</button>'
                        + '<button type="button" class="btn btn-default" data-ng-click="resize(50)">50%</button>'
                        + '<button type="button" class="btn btn-default" data-ng-click="resize(75)">75%</button>'
                        + '<button type="button" class="btn btn-default" data-ng-click="resize(100)">100%</button>'
                        + '<button type="button" class="btn btn-default" data-ng-click="reset()" title="Réinitialiser"><i class="fa fa-times" aria-hidden="true"></i></button>'
                        + '</div>'
                        + '<div class="btn-group mt-10" role="group" aria-label="...">'
                        + '<button type="button" class="btn btn-default" ng-click="openOcrModal()">{{"label.ocr"| translate}}</button>'
                        + '</div>'
                        + '</div>'
                        + '</div>';


                    var $template = $compile(html)($scope);

                    $template.attr('id', 'image-menu');
                    $template.css({
                        'position': 'absolute',
                        'top': (image.offsetTop + 20) + 'px',
                        'left': image.offsetLeft + 'px',
                        'display': 'block'
                    });

                    $scope.image = image;

                    var container = document.getElementsByClassName('ta-scroll-window');
                    if (container) {
                        container[0].appendChild($template[0]);
                    }
                };

                var removeMenu = function () {
                    var menu = document.getElementById('image-menu');
                    if (menu) {
                        menu.parentNode.removeChild(menu);
                    }
                };

                element.bind('click', function (event) {
                    if (event.target.tagName === 'IMG') {
                        removeMenu();
                        renderMenu(event.target);
                    } else if (event.target.className.indexOf('popover') > -1) {
                        // Do Nothing
                    } else {
                        removeMenu();
                    }
                });


            },
            controller: function ($scope, $uibModal) {
                $scope.openOcrModal = function () {
                    $uibModal.open({
                        templateUrl: 'views/ocr/ocr.modal.html',
                        controller: 'OcrModalCtrl',
                        size: 'lg',
                        resolve: {
                            image: function () {
                                return $scope.image;
                            }
                        }
                    }).result.then(function (params) {
                        // close
                        if (params.result) {
                            var p = document.createElement('p');
                            p.textContent = params.result;
                            $scope.image.parentNode.insertBefore(p, $scope.image);
                        }

                    });
                };

                $scope.reset = function () {
                    $scope.image.style['width'] = '';
                };

                $scope.resize = function (size) {

                    $scope.image.style['width'] = size + '%';

                }
            }

        };


    });