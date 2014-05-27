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

cnedApp.directive('draggable', ['$document', '$rootScope',
    function($document, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, elm, attrs) {
                var startX, startY, initialMouseX, initialMouseY;
                // var defaultY = $('#noteBlock2').offset().top,
                //     defaultX = $('#noteBlock2').offset().left,
                //     defaultW = defaultX + $('#noteBlock2').width(),
                //     defaultH = defaultY + $('#noteBlock2').height();

                console.log('notes OKI');
                console.log(scope.note);

                elm.css({
                    position: 'absolute'
                });

                elm.bind('mousedown', function($event) {
                    console.log('mousedown 1');
                    startX = elm.prop('offsetLeft');
                    startY = elm.prop('offsetTop');
                    initialMouseX = $event.clientX;
                    initialMouseY = $event.clientY;
                    $document.bind('mousemove', mousemove);
                    $document.bind('mouseup', mouseup);
                    return true;
                });

                // $(elm).find('.annotation_area').on('keyup', function(ev) {
                //     console.log('clicked... ');
                //     console.log($(this).html());
                //     scope.note.texte = $(this).html();

                // });
                // $(elm).find('.annotation_area').on('focusout', function(ev) {
                //     $(this).html(scope.note.texte);
                //     scope.editNote(scope.note);
                // });

                function mousemove($event) {
                    console.log('mousemove 2');
                    var dx = $event.clientX - initialMouseX;
                    var dy = $event.clientY - initialMouseY;

                    //if ((startY + dy > defaultY) && (startY + dy < defaultH) && (startX + dx > defaultX) && (startX + dx < defaultW)) {

                    var tagID = $event.target.id;
                    console.log('target ID ===>');
                    console.log(tagID);
                    var defaultX = $('.carousel-caption').width() + 85;
                    console.log('defaultX');
                    console.log(defaultX);
                    console.log('startX + dx');
                    console.log(startX + dx);

                    if ((tagID === 'noteID') && ((startX + dx) > defaultX)) {
                        elm.css({
                            top: startY + dy + 'px',
                            left: startX + dx + 'px'
                        });
                        scope.note.y = startY + dy;
                        scope.note.x = startX + dx;
                        scope.drawLine();
                        console.log('noteID');
                    } else if (tagID === 'linkID') {
                        elm.css({
                            top: startY + dy + 'px',
                            left: startX + dx + 'px'
                        });
                        scope.note.yLink = startY + dy;
                        scope.note.xLink = startX + dx;
                        scope.drawLine();
                        console.log('linkID');
                        //console.log(tagName);
                    }
                    //}
                    return false;
                }

                function mouseup($event) {
                    console.log('mouseup 3');
                    var tagID = $event.target.id;
                    if (tagID === 'noteID' || tagID === 'linkID') {
                        scope.editNote(scope.note);
                    }
                    $document.unbind('mousemove', mousemove);
                    $document.unbind('mouseup', mouseup);
                }
            }
        };
    }
]);

cnedApp.directive('onFinishRender', ['$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function(scope) {
                if (scope.$last === true) {
                    $timeout(function() {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        };
    }
]);

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