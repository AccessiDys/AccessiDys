/* File: HistoryBrowser.js
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


'use strict';
/*global cnedApp, $:false */
/*jshint unused: false, undef:false */

/* Directive pour la detection de l'actualisation du document */
cnedApp.directive('historyBrowser', function ($rootScope, configuration, ngDialog) {
  return {
    restrict: 'EA',
    link: function (scope, element) {
      console.log('in History directive ==> ');
      $(window).bind('beforeunload', function () {
        if (localStorage.getItem('lockOperationDropBox') === 'true') {
          return 'Vous risquez de perdre le document en cours d\'enregistrement, êtes vous sure de vouloir quitter cette page ?';
        }
      });
      $rootScope.$on('$locationChangeStart', function (event,next,current) {
        console.log(current);
        console.log(next);
        var goTo = next.substring(next.lastIndexOf('/'), next.length);
        if (localStorage.getItem('lockOperationDropBox') === 'true') {
          var modalTitle = 'INFORMATION';
          var modalMessage = 'Vous risquez de perdre le document en cours d\'enregistrement, êtes vous sure de vouloir quitter cette page ?';
          ngDialog.open({
            template: '<div class="modal fade" id="errModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static" data-keyboard="false" >'+
                        '<div class="modal-dialog" id="modalContent">'+
                          '<div class="modal-content">'+
                            '<div class="modal-header">'+
                              '<button type="button" class="close" data-ng-click="closeNgModal(\'errModal\')">&times;</button>'+
                              '<h4 class="modal-title" id="myModalLabel">' + modalTitle + '</h4>'+
                            '</div>'+
                            '<div class="modal-body">'+
                              '<p class="info_txt">' + modalMessage + '</p>'+
                              '<div class="centering">'+
                                '<button type="button" class="reset_btn  btn_simple" data-ng-click="closeNgModal(\'errModal\')" title="ANNULER">ANNULER</button>'+
                                '<a type="button" class="btn_simple light_blue" data-ng-click="continueLocationChange(\'errModal\',\'' + goTo + '\')" title="RETOUR À LA PAGE D\'ACCUEIL"> Je veux continuer</a>' +
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                      '</div>',
            plain: true
          });
          event.preventDefault();
        }
      });
    }
  };
});
