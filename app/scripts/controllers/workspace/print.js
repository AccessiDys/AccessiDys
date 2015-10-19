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
/*global $:false */
(function () {
	'use strict';

	angular.module('cnedApp').controller('PrintCtrl', function ($scope, $rootScope, $http, $window, $location, $routeParams, $q, $log, $timeout, configuration, dropbox, removeHtmlTags, workspaceService,
		serviceCheck,
		fileStorageService) {

		$scope.data = [];
		$scope.blocksAlternative = [];
		$scope.plans = [];
		$scope.showApercu = 'hidden';
		$scope.showPlan = 'visible';
		$scope.counterElements = 0;
		$scope.styleParagraphe = '';
		$scope.loader = false;
		$scope.showPlan = true;
		$scope.isPagePlan = false;
		$('#main_header').hide();
		$scope.notes = [];

		//var numNiveau = 0,
		var lineCanvas,
			offset = 0,
			summaryOffset = 0;


        $scope.floatLeftStyle = {
            'width': '700px',
            'float': 'left',
            'margin-left': '40px',
            'border-right': '1px solid grey'
        };

        $scope.centeredStyle = {
            'width': '700px',
            'margin-left': 'auto',
            'margin-right': 'auto'
        };

		/*
		 * Dessiner les lignes de toutes les annotations.
		 */
		$scope.drawLine = function () {
			return $timeout(function () {

				angular.forEach($scope.notes,
					function (note) {

						note.y += angular.element('#adaptContent-' + note.idInPrint).position().top || note.y;
						note.yLink += angular.element('#adaptContent-' + note.idInPrint).position().top || note.yLink;


					});


				if (!lineCanvas) {
					// set the line canvas to the width and height of the carousel

					var totalDivs = $scope.currentContent.length,
						totalHeight = 0;
					for (var i = 0; i < totalDivs; i++) {
						totalHeight += $('#adaptContent-' + i).height();
					}

					lineCanvas = $('#line-canvas');
					lineCanvas.css({
						position: 'absolute',
						width: $('#adaptContent-0').width() + $('#note_container').width(),
						height: totalHeight
					});
				}

				$('#line-canvas div').remove();
				if ($scope.notes.length > 0) {

					angular.forEach($scope.notes, function (note) {
						lineCanvas.line(note.xLink + 65, note.yLink - 25, note.x, note.y - 25, {
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

		/*
		 * Afficher le titre du document.
		 */
		function showTitleDoc(title) {
			$scope.docName = title;
			$scope.docSignature = title;
			$('#titreDocumentApercu').show();
		}

		/**
		 * Ouvre le document dans l'éditeur
		 * @method $scope.editer
		 */
		$scope.editer = function () {
			$window.location.href = configuration.URL_REQUEST + '/#/addDocument?idDocument=' + $scope.idDocument;
		};


		/**
		 * Affiche la popup de chargement.
		 */
		$scope.showLoader = function (msg) {
			$scope.loader = true;
			$scope.loaderMsg = msg;
			$('.loader_cover').show();
		};



		/**
		 * @method $scope.getDocContent
		 * @param  {String} idDocument [the document's name]
		 * @return {Promise}            [description]
		 */
		$scope.getDocContent = function (idDocument) {
			var deferred = $q.defer();

			serviceCheck.getData().then(function (result) {
				var token = '';
				if (result.user && result.user.dropbox) {
					token = result.user.dropbox.accessToken;
				}
				return fileStorageService.getFile(idDocument, token);
			}).then(function (data) {
				var content = workspaceService.parcourirHtml(data, $scope.urlHost, $scope.urlPort);
				deferred.resolve(content);
			});

			return deferred.promise;
		};
		/**
		 * Génère le document en fonction de l'url ou de l'id du doc
		 * @method $scope.init
		 */
		(function init() {
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
				contentGet,
				notes = [];

			showTitleDoc($routeParams.documentId);
			contentGet = $scope.getDocContent($routeParams.documentId);
			contentGet.then(function (data) {

				$scope.content = data;
				//delete the plan if it is disabled
				if (parseInt($routeParams.plan) === plan.ENABLED) {
					summaryOffset = 1;
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
					for (var i = 1; i < $scope.content.length - 1; i++) {
						notes.push(i);
					}
					// no plan
					if (summaryOffset === 0) {
						$scope.currentContent = [];
						for (var i = 1; i < $scope.content.length; i++) {
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
					break;
				}

				$scope.loader = false;
				if (summaryOffset === 0 && page === 0) return;

				var restoredNotes = workspaceService.restoreNotesStorage($routeParams.documentId);
				$scope.notes = [];

				// put in the scope only needed notes
				for (var i = 0; i < notes.length; i++) {
					angular.forEach(restoredNotes, function (note) {
						if (parseInt(note.idPage) === notes[i]) {
							note.idInPrint = i + summaryOffset;
							$scope.notes.push(note);
						}
					});
				}

				$scope.drawLine().then(function () {
					//wait for DOM to be rendered
					return $timeout(function () {});
				}).then(function () {
					$window.print();
				});
			});
		})();

	});
}());
