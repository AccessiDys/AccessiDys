/* File: print.js
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

/*jshint loopfunc:true*/
/*global
    $:false, angular
 */

'use strict';

angular.module('cnedApp').controller('PrintCtrl', function ($scope, $rootScope, $http, $window, $location, $routeParams, $q, $log, $timeout, configuration, dropbox, removeHtmlTags, workspaceService,
  serviceCheck,
  fileStorageService) {

  $scope.loader = false;
  $('#main_header').hide();
  $scope.notes = [];

  var offset = 0,
    summaryOffset = 0;

  /**
   * styling
   */
  var floatLeftStyle = {
    'width': '700px',
    'float': 'left',
    'margin-left': '40px',
    'margin-top': '40px',
    'border-right': '1px solid grey'
  };

  var centeredStyle = {
    'width': '700px',
    'margin-left': 'auto',
    'margin-right': 'auto'
  };

  /*
   * Dessiner les lignes de toutes les annotations.
   */
  $scope.drawLine = function () {
    return $timeout(function () {

      var MAGIC_X = 45,
        MAGIC_Y = 32;
      angular.forEach($scope.notes,
        function (note) {

          //notes coordinates adjustments
          note.yLink -= MAGIC_Y;
          note.x -= angular.element('#adapt-content-' + note.idInPrint).width() + MAGIC_X;
          note.xLink -= angular.element('#adapt-content-' + note.idInPrint).width() + MAGIC_X;

          note.position = 'relative';
          note.linkPosition = 'relative';
          note.xLinkLine = angular.element('#adapt-content-' + note.idInPrint).width() + note.xLink + MAGIC_X;
          note.yLinkLine = note.yLink + 58;
          note.xLine = angular.element('#note-container-' + note.idInPrint).offset().left + note.x - 170;
          note.yLine = note.y + 12;

          //adjusting the note containers
          var noteContainer = angular.element('#note-container-' + note.idInPrint);
          noteContainer.css({
            height: angular.element('#adapt-content-' + note.idInPrint).height()
          });

          //adjusting the linecanvas div
          var lineCanvas = angular.element('#line-canvas-' + note.idInPrint);
          lineCanvas.css({
            position: 'absolute',
            width: angular.element('#adapt-content-' + note.idInPrint).width() + $('#note_container').width(),
            height: angular.element('#adapt-content-' + note.idInPrint).height(),
            'margin-left': angular.element('#adapt-content-' + note.idInPrint).css('margin-left')

          });
        });
      //draw
      if ($scope.notes.length > 0) {
        angular.forEach($scope.notes, function (note) {
          var lineCanvas = $('#line-canvas-' + note.idInPrint);
          lineCanvas.line(note.xLinkLine, note.yLinkLine, note.xLine, note.yLine, {
            color: '#747474',
            stroke: 1,
            zindex: 10
          });

        });
      }
    });
  };

  $scope.editNote = function () {
    //filler
  };

  /**
   * Afficher le titre du document.
   */
  function showTitleDoc(title) {
    $scope.docName = title;
    $scope.docSignature = title;
    $('#titreDocumentApercu').show();
  }

  /**
   * Affiche la popup de chargement.
   */
  $scope.showLoader = function (msg) {
    $scope.loader = true;
    $scope.loaderMsg = msg;
    $('.loader_cover').show();
  };

  /**
   * Génère le document en fonction de l'url ou de l'id du doc
   * @method $scope.init
   */
  $scope.init = function () {
    $scope.showLoader('Récupération du document en cours.');
    $scope.listTagsByProfil = localStorage.getItem('listTagsByProfil');
    $scope.currentPage = 0;
    $scope.content = [];

    var plan = {
        ENABLED: 1
      },
      modes = {
        EVERY_PAGES: 0,
        CURRENT_PAGE: 1,
        MULTIPAGE: 2
      },
      notes = [];

    showTitleDoc($routeParams.documentId);
    fileStorageService.getTempFileForPrint().then(function (data) {
      $scope.content = data;
      //delete the plan if it is disabled
      if (parseInt($routeParams.plan) === plan.ENABLED) {
        summaryOffset = 1;
      } else {
        summaryOffset = 0;
      }

      var mode = parseInt($routeParams.mode);
      switch (mode) {

      case modes.CURRENT_PAGE:

        var page = parseInt($routeParams.page);
        offset = parseInt(page);
        notes.push(parseInt($routeParams.page));

        //it means we have plan == 1;
        if (summaryOffset === 1 && parseInt(page) !== 0) {
          $scope.currentContent = [];
          $scope.currentContent.push($scope.content[0]);
          $scope.currentContent.push($scope.content[page]);
          //it means we don't want the plan and the current page is the plan
        } else if (summaryOffset === 0 && page === 0) {
          $log.info('Showing plan without the plan');
          $scope.currentContent = [];
        } else if (summaryOffset === 1 && page === 0) {
          //showing plan, current page is plan
          $scope.currentContent = [];
          $scope.currentContent.push($scope.content[0]);
        } else {
          //array resize when splicing
          $scope.currentContent = [];
          $scope.currentContent.push($scope.content[page - summaryOffset]);
        }
        break;


      case modes.EVERY_PAGES:
        for (var i = 1; i < $scope.content.length; i++) {
          notes.push(i);
        }

        // no plan
        if (summaryOffset === 0) {
          $scope.currentContent = [];
          for (i = 1; i < $scope.content.length; i++) {
            $scope.currentContent.push($scope.content[i]);
          }
        } else {
          $scope.currentContent = $scope.content;
        }

        break;

      case modes.MULTIPAGE:
        var pageFrom = parseInt($routeParams.pageDe),
          pageTo = parseInt($routeParams.pageA),
          currentContent = [];
        offset = pageFrom;


        //adds the plan
        if (summaryOffset === 1) {
          currentContent.push($scope.content[0]);
        }
        //push the content of 'pageFrom' to 'pageTo'
        for (var iPage = pageFrom; iPage <= pageTo; iPage++) {
          notes.push(iPage);
          currentContent.push($scope.content[iPage]);
        }
        $scope.currentContent = currentContent;

        break;

      default:
        $scope.currentContent = [];
        break;
      }

      $scope.loader = false;
      if (summaryOffset === 0 && page === 0) return;

      var restoredNotes = workspaceService.getTempNotesForPrint();
      $scope.notes = [];

      // put in the scope only needed notes
      for (i = 0; i < notes.length; i++) {
        angular.forEach(restoredNotes, function (note) {
          if (parseInt(note.idPage) === notes[i]) {
            note.idInPrint = i + summaryOffset;
            $scope.notes.push(note);
          }
        });
      }

      $scope.currentStyle = $scope.notes.length > 0 ? floatLeftStyle : centeredStyle;
      $scope.drawLine().then(function () {
        //wait for DOM to be rendered
        return $timeout(function () {
          correctImg();
        });
      }).then(function () {
        $timeout(function () {
          $window.print();
        }, 2000);
      });
    });
  };
  $scope.init();

  //fix for printing images
  function correctImg() {
    var links = angular.element('a');
    angular.forEach(links, function (a) {
      var linkEl = angular.element(a);
      linkEl.replaceWith('<span>' + linkEl.html() + '</span>');
    });
  }

});
