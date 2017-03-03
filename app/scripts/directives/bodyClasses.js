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
 * Manage the display of the overview.
 */
cnedApp.directive('bodyClasses', function () {
    return {
        link: function (scope, element) {
            var elementClasses = $(element).attr('class').split(' ');
            for (var i = 0; i < elementClasses.length; i++) {
                if (elementClasses[i] === 'doc-apercu' || elementClasses[i] === 'doc-General') {
                    $('body').removeClass('modal-open');
                    $('body').find('.modal-backdrop').remove();
                    $('#bookmarkletGenerator').modal('hide');
                }
            }
        }
    };
});

/*
 * Directive to manage Drag and Drop annotations.
 */

cnedApp.directive('draggableNote',

    function ($document) {
        return {
            restrict: 'A',
            link: function (scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY, tagID, noteContainer, type, lineCanvas, lineCanvasHtml, yOffset;

                lineCanvasHtml = '<div id="line-canvas-' + scope.note.idNote + '"></div>';
                type = attrs.type;
                noteContainer = angular.element('#note_container-' + scope.note.idPage);

                if(scope.modeImpression) {
                    yOffset = (noteContainer.height() + 40 ) * scope.note.idPage;
                } else {
                    yOffset = 0;
                }

                if (type === 'content') {
                    elm.css({
                        position: 'absolute',
                        left: scope.note.x + 'px',
                        top: scope.note.y + yOffset + 'px'
                    });

                } else if (type === 'link') {
                    elm.css({
                        position: 'absolute',
                        left: scope.note.xLink + 'px',
                        top: scope.note.yLink + yOffset + 'px'
                    });
                }

                drawLine();


                /* If the mouse button is pressed */
                elm.bind('mousedown', function ($event) {
                    tagID = $event.target.id;

                    // click on new editable text
                    if (tagID === 'noteID'  || tagID === 'linkID')  {
                        startX = elm.prop('offsetLeft');
                        startY = elm.prop('offsetTop');
                        initialMouseX = $event.clientX;
                        initialMouseY = $event.clientY;


                        $document.bind('mousemove', mousemove);
                        $document.bind('mouseup', mouseup);

                        return true;
                    }
                });

                /* If the mouse cursor moves to the document */

                function mousemove($event) {
                    $event.preventDefault();
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;

                    /* If I move the contents of the note in the permitted area */
                    if (tagID === 'noteID') {

                        elm.css({
                            top: startY + dy + 'px',
                            left: startX + dx + 'px'
                        });
                        scope.note.y = startY + dy;
                        scope.note.x = startX + dx;
                        drawLine();
                        /* If I move the arrow annotation */
                    } else if (tagID === 'linkID' ) {
                        elm.css({
                            top: startY + dy + 'px',
                            left: startX + dx + 'px'
                        });
                        scope.note.yLink = startY + dy;
                        scope.note.xLink = startX + dx;
                        drawLine();
                    }

                    return false;
                }

                /* If the mouse button is released */

                function mouseup($event) {
                    // var tagID = $event.target.id;
                    /* If I move the arrow and the contents of the note */
                    if (tagID === 'noteID' || tagID === 'linkID') {
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

                    if (!lineCanvas) {
                        // set the line canvas to the width and height of the carousel
                        angular.element('#canvas-container').append(lineCanvasHtml);

                        var carousel = angular.element('#carouselid');

                        lineCanvas = angular.element('#line-canvas-' + scope.note.idNote);
                        lineCanvas.css({
                            position: 'absolute',
                            width: carousel.width(),
                            height: carousel.height()
                        });
                    }

                    lineCanvas.find('div').remove();

                    // invariant whatever the method of consultation.
                    xLink = scope.note.xLink + 65;
                    x = scope.note.x;
                    yLink = scope.note.yLink + yOffset + 25;
                    y = scope.note.y + yOffset + 20;
                    // déssiner
                    lineCanvas.line(xLink, yLink, x, y, {
                        color: '#747474',
                        stroke: 1,
                        zindex: 9
                    });
                }
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
