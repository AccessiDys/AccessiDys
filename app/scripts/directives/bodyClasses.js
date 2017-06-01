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
                container = angular.element(document.querySelector('#' + attrs.container))[0];

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

                /* If the mouse cursor moves to the document */

                function drawLine() {
                    var x, y, xLink, yLink;


                    if(angular.element( document.querySelector('#line-canvas-' + scope.note.idNote) ).length < 1){
                        angular.element(document.querySelector('#canvas-container-' + scope.note.idPage)).append(lineCanvasHtml);
                    }

                    lineCanvas = angular.element(document.querySelector('#line-canvas-' + scope.note.idNote));
                    if (type === 'content') {
                        // set the line canvas to the width and height of the carousel
                        var carousel = angular.element(document.querySelector('#page-content'));


                        lineCanvas.css({
                            position: 'absolute',
                            width: carousel[0].clientWidth + 'px',
                            height: carousel[0].clientHeight + 'px'
                        });
                    }

                    lineCanvas.find('div').remove();


                    var contentElm = angular.element(document.querySelector('#zone-id-' + scope.note.idNote))[0];
                    var linkElm = angular.element(document.querySelector('#link-id-' + scope.note.idNote))[0];

                    if(linkElm  && contentElm ){
                        // invariant whatever the method of consultation.
                        xLink = linkElm.offsetLeft - container.offsetLeft + 60;
                        x = contentElm.offsetLeft - container.offsetLeft + 40;
                        yLink = linkElm.offsetTop - container.offsetTop + 25;
                        y = contentElm.offsetTop - container.offsetTop + 20;


                        // déssiner
                        jQuery('#line-canvas-' + scope.note.idNote).line(xLink, yLink, x, y, {
                            color: '#747474',
                            stroke: 1,
                            zindex: 9
                        });
                    }
                }

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


                    /* jshint ignore:start */
                    /* If I move the contents of the note in the permitted area */
                    if (tagID.indexOf('note-id-') > -1) {

                        var x = (elm[0].offsetLeft - 15 - container.offsetLeft) / container.clientWidth * 100;
                        var y = (elm[0].offsetTop - container.offsetTop) / container.clientHeight * 100;

                        elm.css({
                            top: y + '%',
                            left: x + '%'
                        });

                        scope.note.y = y;
                        scope.note.x = x;
                        /* If I move the arrow annotation */
                    } else if (tagID.indexOf('link-id-') > -1) {

                        var x = (elm[0].offsetLeft+ 7 - container.offsetLeft) / container.clientWidth * 100;
                        var y = (elm[0].offsetTop - container.offsetTop) / container.clientHeight * 100;

                        elm.css({
                            top: y + '%',
                            left: x + '%'
                        });

                        scope.note.yLink = y;
                        scope.note.xLink = x;
                    }
                    /* jshint ignore:end */


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
