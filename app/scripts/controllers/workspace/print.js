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
/*global $:false, blocks */

'use strict';

angular.module('cnedApp').controller('PrintCtrl', function($scope, $rootScope, $http, $window, $location, configuration, dropbox, removeHtmlTags) {

	$scope.data = [];
	// $scope.blocks = [];
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.styleParagraphe = '';
	/* activer le loader */
	$scope.loader = false;
	var numTitre = 0;
	$scope.showPlan = true;
	$scope.isPagePlan = false;

	/* Mette à jour dernier document affiché */
	if ($location.absUrl()) {
		localStorage.setItem('lastDocument', $location.absUrl());
		$scope.encodeURI = decodeURI($location.absUrl());
	}

	$scope.requestToSend = {};
	if (localStorage.getItem('compteId')) {
		$scope.requestToSend = {
			id: localStorage.getItem('compteId')
		};
	}

	$scope.showTitleDoc = function() {
		var docUrl = decodeURI($location.absUrl());
		docUrl = docUrl.replace('#/apercu', '');
		$rootScope.titreDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
		console.log('titre document ==> ');
		console.log($rootScope.titreDoc);
		$('#titreDocumentApercu').show();
	};
	$scope.showTitleDoc();

	$scope.populateApercu = function() {
		console.log('in populateApercu ==> ');
		console.log(blocks);
		// Selection des profils tags pour le style
		if (blocks && blocks.children.length > 0) {
			$scope.profiltags = JSON.parse(localStorage.getItem('listTagsByProfil'));
			//Selection des tags pour le plan
			$scope.tags = JSON.parse(localStorage.getItem('listTags'));
			var blocksArray = angular.fromJson(blocks);
			console.log(blocksArray);
			var j = 0;
			$scope.blocksPlan = [];
			$scope.blocksPlan[0] = [];
			$scope.blocksPlan[0][0] = [];

			for (var i = 0; i < blocksArray.children.length; i++) {
				$scope.blocksPlan[i + 1] = [];
				j = 0;
				blocksArray.children[i].root = true;
				traverseRoot(blocksArray.children[i], i, j);
				traverseLeaf(blocksArray.children[i].children, i, j);
			}

			$scope.plans.forEach(function(entry) {
				entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
			});

			var mode = parseInt($location.search().mode);
			var printPlan = parseInt($location.search().plan);
			$scope.pageTraites = [];
			if (mode === 1 || mode === 2) {
				var pageDe = parseInt($location.search().de);
				var pageA = parseInt($location.search().a);
				console.log('pageDe ===>' + pageDe);
				console.log('pageA ===>' + pageA);
				if (pageDe > 0 && pageA > 0 && pageDe <= pageA) {
					var blocksPlanTmp = $scope.blocksPlan.slice(pageDe, pageA + 1);
					console.log(blocksPlanTmp);
					$scope.blocksPlan = [];
					$scope.blocksPlan[0] = [];
					$scope.blocksPlan[0][0] = [];
					for (var j = 0; j < blocksPlanTmp.length; j++) {
						$scope.blocksPlan[j + 1] = blocksPlanTmp[j];
					}

					for (var k = pageDe; k <= pageA; k++) {
						$scope.pageTraites.push(k);
					}

				} else {
					printPlan = 1;
					$scope.isPagePlan = true;
					$scope.blocksPlan = [];
					$scope.blocksPlan[0] = [];
					$scope.blocksPlan[0][0] = [];
				}
			}

			if (printPlan === 0) {
				$scope.showPlan = false;
				$scope.plans = [];
			}

			$scope.loader = false;
		}
	};

	if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
		console.log('starting populate');
		$scope.populateApercu();
	}

	function getTitleIndex(titre) {
		return parseInt(titre.substring(titre.length - 1, titre.length));
	}

	function limitParagraphe(titre) {
		var taille = 0;
		var limite = 80;

		if (titre.length <= limite) {
			return titre;
		}

		for (var i = 0; i < titre.length; i++) {
			taille = taille + 1;
			if (taille >= limite) {
				break;
			}
		}
		return titre.substring(0, taille) + '...';
	}

	function applyRegleStyle(block, idx1) {
		var counterElement = $scope.counterElements;
		var debutStyle = '<p id="' + counterElement + '">';
		var finStyle = '</p>';
		var tagExist = false;
		var libelle = '';
		var numTitreTmp = numTitre;
		var isTitre = false;

		console.log('OKI 2');
		console.log(block.text);

		for (var profiltag in $scope.profiltags) {
			/* le cas d'un paragraphe */
			var style = $scope.profiltags[profiltag].texte;
			libelle = $scope.profiltags[profiltag].tagName;
			if (libelle.match('^Paragraphe')) {
				$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
			}

			if (block.tag === $scope.profiltags[profiltag].tag) {
				debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + counterElement + '" regle-style="" >';
				/* le cas d'un titre */
				if (libelle.match('^Titre')) {
					numTitre = getTitleIndex(libelle);
					numTitreTmp = numTitre;
					numTitre++;
					libelle = block.text;
					isTitre = true;
				}
				tagExist = true;
				break;
			}
		}

		// Selection du Tag si il n'existe pas sur les profilsTags
		if (!tagExist) {
			for (var i = 0; i < $scope.tags.length; i++) {
				if (block.tag === $scope.tags[i]._id) {
					libelle = $scope.tags[i].libelle;
					if (libelle.match('^Titre')) {
						numTitre = getTitleIndex(libelle);
						numTitreTmp = numTitre;
						numTitre++;
						libelle = block.text;
						isTitre = true;
					}
					break;
				}
			}
		}

		if (!isTitre) {
			libelle = removeHtmlTags(libelle) + ' : ' + limitParagraphe(removeHtmlTags(block.text)).replace(/\n/g, ' ');
		} else {
			libelle = removeHtmlTags(libelle);
		}

		if (block.tag && block.tag.length > 0) {
			$scope.plans.push({
				libelle: libelle,
				block: block.id,
				position: idx1,
				numTitre: numTitreTmp
			});
		}

		block.text = debutStyle + block.text + finStyle;

		return block;
	}

	/* Parcourir les blocks du document d'une facon recursive */

	function traverseLeaf(obj, idx1, idx2) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text && obj[key].text.length > 0) {
					$scope.counterElements += 1;
					obj[key] = applyRegleStyle(obj[key], idx1);
				}

				$scope.blocksPlan[idx1 + 1][++idx2] = obj[key];

				if (obj[key].children.length > 0) {
					traverseLeaf(obj[key].children, idx1, idx2);
				} else {
					obj[key].leaf = true;
				}
			}
		}
	}

	function traverseRoot(obj, idx1, idx2) {
		if (obj.text && obj.text.length > 0 && obj.children.length <= 0) {
			$scope.counterElements += 1;
			obj = applyRegleStyle(obj, idx1);
		}
		$scope.blocksPlan[idx1 + 1][idx2] = obj;
	}

	$scope.showTitleDoc = function() {
		var docUrl = decodeURI($location.absUrl());
		docUrl = docUrl.replace('#/print', '');
		// $rootScope.titreDoc = decodeURIComponent(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docUrl))[0].replace('_', '').replace('_', ''));
		var docName = decodeURI(docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.lastIndexOf('.html')));
		$scope.docSignature = /((_)([A-Za-z0-9_%]+))/i.exec(encodeURIComponent(docName))[0].replace(/((_+)([A-Za-z0-9_%]*)(_+))/i.exec(encodeURIComponent(docName))[0], '');
	};
	$scope.showTitleDoc();

	$scope.notes = [];
	$scope.drawLine = function() {
		$('#noteBlock1 div').remove();
		if ($scope.notes.length > 0) {
			for (var i = 0; i < $scope.notes.length; i++) {
				$('#noteBlock1').line($scope.notes[i].xLink + 55, $scope.notes[i].yLink + 12, $scope.notes[i].x - 9, $scope.notes[i].y + 20, {
					color: '#747474',
					stroke: 1,
					zindex: 10
				});
			}
		}
	};

	$scope.$on('ngRepeatFinished', function() {
		$scope.restoreNotesStorage();
		window.print();
	});

	$scope.restoreNotesStorage = function() {
		console.log('pageTraites ===>');
		console.log($scope.pageTraites);
		if (!$scope.isPagePlan && localStorage.getItem('notes')) {
			var notes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
			var defY = 65;
			var defTmp = 0;
			$scope.notes = [];
			for (var i = 0; i < notes.length; i++) {
				if (notes[i].idDoc === $scope.docSignature && ($scope.pageTraites.length <= 0 || $scope.pageTraites.indexOf(notes[i].idPage) !== -1)) {
					defTmp = $('#noPlanPrint' + notes[i].idPage).offset().top + defY;
					notes[i].yLink += defTmp;
					notes[i].y += defTmp;
					notes[i].styleNote = '<p ' + $scope.styleParagraphe + '> ' + notes[i].texte + ' </p>';
					$scope.notes.push(notes[i]);
				}
			}
		} else {
			$scope.notes = [];
		}
		$scope.drawLine();
	};

});