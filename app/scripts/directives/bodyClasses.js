/* File: bodyClasses.js
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
/* global cnedApp, $:false */
/* jshint unused: false, undef:false */

/*
 * Directive to manage Drag and Drop annotations.
 */

cnedApp.directive('draggableNote',

    function ($document, $timeout, $log, $rootScope, $window) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY, tagID, type, lineCanvas, lineCanvasHtml, container;

                lineCanvasHtml = '<div id="line-canvas-' + scope.note.idNote + '"></div>';
                type = attrs.type;
                container = angular.element('#' + attrs.container);

                if (type === 'content') {
                    elm.css({
                        position: 'absolute',
                        left: scope.note.x + '%',
                        top: scope.note.y + '%'
                    });

                } else if (type === 'link') {
                    elm.css({
                        position: 'absolute',
                        left: scope.note.xLink + '%',
                        top: scope.note.yLink + '%'
                    });
                }


                $timeout(function () {
                    drawLine();
                }, 300);


                /* If the mouse button is pressed */
                elm.bind('mousedown', function ($event) {
                    tagID = $event.target.id;

                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;

                    // click on new editable text
                    if (tagID.indexOf('note-id-') > -1 || tagID.indexOf('link-id-') > -1) {
                        $document.bind('mousemove', mousemove);
                        $document.bind('mouseup', mouseup);

                        return true;
                    }
                });

                /* If the mouse cursor moves to the document */

                function mousemove($event) {
                    $event.preventDefault();

                    tagID = $event.target.id;

                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;

                    elm.css({
                        top: startY + dy + 'px',
                        left: startX + dx + 'px'
                    });

                    drawLine();

                    return false;
                }

                /* If the mouse button is released */

                function mouseup($event) {
                    tagID = $event.target.id;


                    /* If I move the contents of the note in the permitted area */
                    if (tagID.indexOf('note-id-') > -1) {

                        var x = (elm.offset().left - 15 - container.offset().left) / container.width() * 100;
                        var y = (elm.offset().top - container.offset().top) / container.height() * 100;

                        elm.css({
                            top: y + '%',
                            left: x + '%'
                        });

                        scope.note.y = y;
                        scope.note.x = x;
                        /* If I move the arrow annotation */
                    } else if (tagID.indexOf('link-id-') > -1) {

                        var x = (elm.offset().left + 7 - container.offset().left) / container.width() * 100;
                        var y = (elm.offset().top - container.offset().top) / container.height() * 100;

                        elm.css({
                            top: y + '%',
                            left: x + '%'
                        });

                        scope.note.yLink = y;
                        scope.note.xLink = x;
                    }


                    /* If I move the arrow and the contents of the note */
                    if (tagID.indexOf('note-id-') > -1 || tagID.indexOf('link-id-') > -1) {
                        scope.editNote(scope.note);
                    }


                    if (type === 'content') {
                        $document.unbind('mousemove', mousemove);
                        $document.unbind('mouseup', mouseup);

                    } else if (type === 'link') {
                        $document.unbind('mousemove', mousemove);
                        $document.unbind('mouseup', mouseup);
                    }


                }

                function drawLine() {
                    var x, y, xLink, yLink;


                    if(angular.element( '#line-canvas-' + scope.note.idNote ).length < 1){
                        angular.element('#canvas-container-' + scope.note.idPage).append(lineCanvasHtml);
                    }

                    lineCanvas = angular.element('#line-canvas-' + scope.note.idNote);
                    if (type === 'content') {
                        // set the line canvas to the width and height of the carousel
                        var carousel = angular.element('#carouselid');

                        lineCanvas.css({
                            position: 'absolute',
                            width: carousel.width(),
                            height: carousel.height()
                        });
                    }

                    lineCanvas.find('div').remove();


                    var contentElm = angular.element('#zone-id-' + scope.note.idNote);
                    var linkElm = angular.element('#link-id-' + scope.note.idNote);

                    if(linkElm.length > 0 && contentElm.length > 0){
                        // invariant whatever the method of consultation.
                        xLink = linkElm.offset().left - container.offset().left + 60;
                        x = contentElm.offset().left - container.offset().left + 40;
                        yLink = linkElm.offset().top - container.offset().top + 25;
                        y = contentElm.offset().top - container.offset().top + 20;

                        // déssiner
                        lineCanvas.line(xLink, yLink, x, y, {
                            color: '#747474',
                            stroke: 1,
                            zindex: 9
                        });
                    }
                }

                $rootScope.$on('redrawLines', function () {
                    $log.debug('redrawLines');
                    drawLine();
                });

                angular.element($window).bind('resize', function() {
                    drawLine();
                });
            }
        };
    });

/*
 * Directive to detect the end of a ng-repeat in Overview
 */
cnedApp.directive('onFinishApercu', ['$timeout',

    function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinishedApercu');
                    });
                }
            }
        };
    }]);

/*
 * Directive to detect the end of a ng-repeat in Print
 */
cnedApp.directive('onFinishRender', ['$timeout',

    function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }]);

/*
 * Directive to limit the number of characters to be entered.
 */
cnedApp.directive('maxLength', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
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
