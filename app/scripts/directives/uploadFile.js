/* File: uploadFile.js
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

/*This directive is created because, hence the debug data is disabled (in ckeditor directive) for performance propose, the expression 
 * angular.element(this).scope() returns undefined. It's then impossible to get the scope of an DOM element through the expression  angular.element(this).scope().
 * File upload became impossible by calling the function angular.element(this).scope().setFiles(this)*/
'use strict';
/*global cnedApp */
cnedApp.directive('uploadFile', function ($rootScope, ToasterService, $timeout) {
    return {
        restrict: 'AE',
        link: function ($scope, element) {

            $scope.form.files = [];

            element.bind('change', function (changeElement) {
                var element = changeElement.target;
                var field_txt = '';

                $timeout(function () {
                    for (var i = 0; i < element.files.length; i++) {
                        var filename = '';

                        console.log('element.files[i].type', element.files[i].type);

                        if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip' && element.files[i].type !== 'application/msword' && element.files[i].type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                            if (element.files[i].type === '' && element.files[i].name.indexOf('.epub') > -1) {
                                filename = element.files[i].name;

                                $scope.form.title = filename.substring(0, filename.lastIndexOf('.'));
                                $scope.form.files.push(element.files[i]);
                                field_txt += ' ' + element.files[i].name;
                                angular.element('#filename_show').val(field_txt);
                            } else if (element.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.files[i].type === 'application/msword' || element.files[i].type === 'application/vnd.oasis.opendocument.text' || element.files[i].type === 'text/plain') {
                                $scope.form.files = [];
                                ToasterService.showToaster('#open-document-modal-error-toaster', 'document.message.save.ko.file.copypaste');
                                break;
                            } else {
                                ToasterService.showToaster('#open-document-modal-error-toaster', 'document.message.save.ko.file.type');
                                $scope.form.files = [];
                                break;
                            }
                        } else {
                            filename = element.files[i].name;
                            $scope.form.title = filename.substring(0, filename.lastIndexOf('.'));
                            $scope.form.files.push(element.files[i]);
                            field_txt += ' ' + element.files[i].name;
                            angular.element(document.querySelector('#filename_show')).val(field_txt);
                        }
                    }
                }, 0);
            });
        }
    };
});