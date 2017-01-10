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
cnedApp.directive('uploadFile', function($rootScope) {
	  return {
	    restrict: 'AE',
	    link: function ($scope, element, attrs) {
	      var onChangeHandler = $scope.$parent.$eval(attrs.customOnChange);
    	  $scope.files = [];
          
	      element.bind('change', function(changeElement){
	    	  var element = changeElement.target;
	    	  $scope.$apply(function() {
	    		  var field_txt = '';
                  for (var i = 0; i < element.files.length; i++) {
                      var filename = '';
                      if (element.files[i].type !== 'image/jpeg' && element.files[i].type !== 'image/png' && element.files[i].type !== 'application/pdf' && element.files[i].type !== 'application/epub+zip') {
                    	  if (element.files[i].type === '' && element.files[i].name.indexOf('.epub') > -1) {
                              filename = element.files[i].name;
                              $scope.doc = {};
                              $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
                              $scope.files.push(element.files[i]);
                              field_txt += ' ' + element.files[i].name;
                              $scope.msgErrorModal = '';
                              $scope.errorMsg = false;
                              $('#filename_show').val(field_txt);
                          } else if (element.files[i].type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || element.files[i].type === 'application/msword' || element.files[i].type === 'application/vnd.oasis.opendocument.text' || element.files[i].type === 'text/plain') {
                        	  $scope.msgErrorModal = 'Les documents de ce type doivent être insérés en effectuant un copier/coller du contenu.';
                              $scope.errorMsg = true;
                              $scope.files = [];
                              break;
                          } else {
                        	  $scope.msgErrorModal = 'Le type de fichier rattaché est non autorisé. Merci de rattacher que des fichiers PDF ou des images.';
                              $scope.errorMsg = true;
                              $scope.files = [];
                              break;
                          }
                      } else {
                          filename = element.files[i].name;
                          $scope.doc = {};
                          $scope.doc.titre = filename.substring(0, filename.lastIndexOf('.'));
                          if (element.files[i].type === 'image/jpeg' || element.files[i].type === 'image/png' || element.files[i].type === 'image/jpg') {
                        	  $rootScope.imgFile = true;
                          } else {
                        	  $rootScope.imgFile = false;
                          }
                          
                          $scope.files.push(element.files[i]);
                          field_txt += ' ' + element.files[i].name;
                          $scope.msgErrorModal = '';
                          $scope.errorMsg = false;
                          $('#filename_show').val(field_txt);
                      }
                  }
              });
	    	  
	    	  
	      });
	    }
	  };
	});