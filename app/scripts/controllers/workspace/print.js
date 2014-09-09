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
	$scope.blocksAlternative = [];
	$scope.plans = [];
	$scope.showApercu = 'hidden';
	$scope.showPlan = 'visible';
	$scope.counterElements = 0;
	$scope.styleParagraphe = '';
	$scope.loader = false;
	var numNiveau = 0;
	$scope.showPlan = true;
	$scope.isPagePlan = false;
	$('#main_header').hide();

	/*
	 * Mette à jour le dernier document affiché.
	 */
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

	/*
	 * Initialiser le style de la règle NORMAL.
	 */
	function initStyleNormal() {
		for (var profiltag in $scope.profiltags) {
			var style = $scope.profiltags[profiltag].texte;
			var currentTag = getTagById($scope.profiltags[profiltag].tag);
			if (currentTag && currentTag.libelle.toUpperCase().match('^Paragraphe')) {
				$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
				break;
			}
		}
	}

	/*
	 * Préparer les données à afficher dans l'apercu.
	 */
	$scope.populateApercu = function() {
		if (blocks && blocks.children.length > 0) {
			/* Selection des tags par profil de localStorage */
			$scope.profiltags = JSON.parse(localStorage.getItem('listTagsByProfil'));
			/* Selection des tags de localStorage */
			$scope.tags = JSON.parse(localStorage.getItem('listTags'));
			/* Selection des blocks de la page applicative */
			var blocksArray = angular.fromJson(blocks);
			$scope.blocksPlan = [];
			$scope.blocksPlan[0] = [];
			$scope.blocksPlan[0][0] = [];
			$scope.idx2 = [];

			/* Initialiser le style des annotations */
			initStyleAnnotation();

			for (var i = 0; i < blocksArray.children.length; i++) {
				$scope.blocksPlan[i + 1] = [];
				$scope.idx2[i + 1] = 0;
				blocksArray.children[i].root = true;
				/* Parcourir chaque Root */
				traverseRoot(blocksArray.children[i], i);
				/* Parcourir les Childrens de chaque Root */
				traverseLeaf(blocksArray.children[i].children, i);
			}

			/* Cas du style de la règle NORMAL non traitée */
			if ($scope.styleParagraphe.length <= 0) {
				initStyleNormal();
			}

			/* Affecter le style de la règle NORMAL aux lignes du plan */
			$scope.plans.forEach(function(entry) {
				entry.style = '<p ' + $scope.styleParagraphe + '> ' + entry.libelle + ' </p>';
			});

			var mode = parseInt($location.search().mode);
			var printPlan = parseInt($location.search().plan);
			$scope.pageTraites = [];
			if (mode === 1 || mode === 2) {
				/* mode = 1 : imprimer la page actuelle */
				/* mode = 2 : imprimer les pages compris entre une page de début et une page de fin */
				var pageDe = parseInt($location.search().de);
				var pageA = parseInt($location.search().a);
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
					/* imprimer toutes les pages */
					printPlan = 1;
					$scope.isPagePlan = true;
					$scope.blocksPlan = [];
					$scope.blocksPlan[0] = [];
					$scope.blocksPlan[0][0] = [];
				}
			}

			/* Ne pas imprimer le plan */
			if (printPlan === 0) {
				$scope.showPlan = false;
				$scope.plans = [];
			}

			$scope.loader = false;
		}
	};

	/* listTagsByProfil et listTags se trouvent dans localStorage */
	if (localStorage.getItem('listTagsByProfil') && localStorage.getItem('listTags')) {
		$scope.populateApercu();
	}

	/*
	 * Chercher le tag dans la liste des tags par idTag.
	 */
	function getTagById(idTag) {
		for (var i = 0; i < $scope.tags.length; i++) {
			if (idTag === $scope.tags[i]._id) {
				return $scope.tags[i];
			}
		}
	}

	/*
	 * Limiter le nombre des caractères affichés à 80.
	 */
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

	/*
	 * Initialiser le style de la règle ANNOTATION.
	 */
	function initStyleAnnotation() {
		for (var profiltag in $scope.profiltags) {
			var style = $scope.profiltags[profiltag].texte;
			var currentTag = getTagById($scope.profiltags[profiltag].tag);
			if (currentTag && currentTag.libelle.toUpperCase().match('^ANNOTATION')) {
				$scope.styleAnnotation = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
				break;
			}
		}
	}

	/*
	 * Appliquer au block la règle de style correspondante.
	 */
	function applyRegleStyle(block, idx1) {
		var counterElement = $scope.counterElements;
		var debutStyle = '<p id="' + counterElement + '">';
		var finStyle = '</p>';
		var tagExist = false;
		var libelle = '';
		var numNiveauTmp = numNiveau;
		var isTitre = false;

		for (var profiltag in $scope.profiltags) {
			var style = $scope.profiltags[profiltag].texte;
			var currentTag = getTagById($scope.profiltags[profiltag].tag);
			if (currentTag) {
				libelle = currentTag.libelle; //$scope.profiltags[profiltag].tagName;
			} else {
				libelle = '';
			}

			/* Cas de la règle NORMAL */
			if (libelle.match('^Paragraphe')) {
				$scope.styleParagraphe = style.substring(style.indexOf('<p') + 2, style.indexOf('>'));
			}

			if (block.tag === $scope.profiltags[profiltag].tag) {
				debutStyle = style.substring(style.indexOf('<p'), style.indexOf('>')) + 'id="' + counterElement + '" regle-style="" >';
				/* Construire le décalage des lignes du plan */
				if (currentTag && parseInt(currentTag.niveau) > 0) {
					numNiveau = parseInt(currentTag.niveau);
					numNiveauTmp = numNiveau;
					numNiveau++;
				}
				/* Cas de la règle TITRE */
				if (libelle.match('^Titre')) {
					libelle = block.text;
					isTitre = true;
				}
				tagExist = true;
				break;
			}
		}

		/* Selectionner le Tag s'il n'existe pas dans les profilsTags */
		if (!tagExist) {
			for (var i = 0; i < $scope.tags.length; i++) {
				if (block.tag === $scope.tags[i]._id) {
					libelle = $scope.tags[i].libelle;
					/* Construire le décalage des lignes du plan */
					if (parseInt($scope.tags[i].niveau) > 0) {
						numNiveau = parseInt($scope.tags[i].niveau);
						numNiveauTmp = numNiveau;
						numNiveau++;
					}
					if (libelle.match('^Titre')) {
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

		/* Construire les lignes du plan */
		if (block.tag && block.tag.length > 0) {
			$scope.plans.push({
				libelle: libelle,
				block: block.id,
				position: idx1,
				numNiveau: numNiveauTmp
			});
		}

		block.text = debutStyle + block.text + finStyle;

		return block;
	}

	/*
	 * Parcourir les fils des blocks du document d'une facon recursive.
	 */
	function traverseLeaf(obj, idx1) {
		for (var key in obj) {
			if (typeof(obj[key]) === 'object') {
				if (obj[key].text && obj[key].text.length > 0) {
					$scope.counterElements += 1;
					obj[key] = applyRegleStyle(obj[key], idx1);
				}

				$scope.idx2[idx1 + 1] = $scope.idx2[idx1 + 1] + 1;
				$scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj[key];

				/* Parcourir recursivement si le block a des childrens */
				if (obj[key].children && obj[key].children.length > 0) {
					traverseLeaf(obj[key].children, idx1);
				} else {
					obj[key].leaf = true;
				}
			}
		}
	}

	/*
	 * Parcourir la racine des blocks du document d'une facon recursive.
	 */
	function traverseRoot(obj, idx1) {
		if (obj.text && obj.text.length > 0 && obj.children.length <= 0) {
			$scope.counterElements += 1;
			obj = applyRegleStyle(obj, idx1);
		}
		$scope.blocksPlan[idx1 + 1][$scope.idx2[idx1 + 1]] = obj;
	}

	/*
	 * Calculer le niveau de décalage des lignes du plan.
	 */
	$scope.calculateNiveauPlan = function(nNiv) {
		var marginLeft = 0;
		if (parseInt(nNiv) > 1) {
			marginLeft = (parseInt(nNiv) - 1) * 30;
		}
		return marginLeft;
	};

	/*
	 * Afficher le titre du document.
	 */
	$scope.showTitleDoc = function() {
		var docUrl = decodeURI($location.absUrl());
		docUrl = docUrl.replace('#/print', '');
		var docName = decodeURI(docUrl.substring(docUrl.lastIndexOf('/') + 1, docUrl.lastIndexOf('.html')));
		$scope.docSignature = decodeURIComponent(/((\d+)(-)(\d+)(-)(\d+)(_+)([A-Za-z0-9_%]*)(_+)([A-Za-z0-9_%]*))/i.exec(encodeURIComponent(docName))[0]);
	};
	$scope.showTitleDoc();

	$scope.notes = [];

	/*
	 * Dessiner les lignes de toutes les annotations.
	 */
	$scope.drawLine = function() {
		$('#noteBlock1 div').remove();
		if ($scope.notes.length > 0) {
			for (var i = 0; i < $scope.notes.length; i++) {
				$('#noteBlock1').line($scope.notes[i].xLink + 65, $scope.notes[i].yLink + 25, $scope.notes[i].x, $scope.notes[i].y + 20, {
					color: '#747474',
					stroke: 1,
					zindex: 10
				});
			}
		}

		// Lancer l'impression après l'afficahge des blocks
		window.print();
	};

	/*
	 * Si l'apercu est completement chargé.
	 */
	$scope.$on('ngRepeatFinished', function() {
		$scope.restoreNotesStorage();
	});

	/*
	 * Récuperer la liste des annotations de localStorage et les afficher dans l'apercu.
	 */
	$scope.restoreNotesStorage = function() {
		$scope.notes = [];
		if (!$scope.isPagePlan && localStorage.getItem('notes')) {
			var mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
			var notes = [];
			if (mapNotes.hasOwnProperty($scope.docSignature)) {
				notes = mapNotes[$scope.docSignature];
			}
			var defY = 65;
			var defTmp = 0;
			for (var i = 0; i < notes.length; i++) {
				if ($scope.pageTraites.length <= 0 || $scope.pageTraites.indexOf(notes[i].idPage) !== -1) {
					defTmp = $('#noPlanPrint' + notes[i].idPage).offset().top + defY;
					notes[i].yLink += defTmp;
					notes[i].y += defTmp;
					notes[i].styleNote = '<p ' + $scope.styleAnnotation + '> ' + notes[i].texte + ' </p>';
					//pour régler un peu le décalage sur les côtés
					notes[i].xLink = notes[i].xLink -10;
					$scope.notes.push(notes[i]);
				}
			}
		}

		console.log('restoreNotesStorage finished ==> ');

		$scope.drawLine();
	};

});