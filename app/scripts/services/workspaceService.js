/*jslint browser: true, plusplus: true*/
/*global angular*/
(function () {
	'use strict';

	function workspaceService($log, configuration) {
		var retContent = [],
			urlHost,
			urlPort;

		/**
		 * Découpage d'un doc multi-pages
		 * @function splitPages
		 * @param {String} html
		 * @return {String} html
		 */
		function splitPages(html) {
			return html.split('<div style="page-break-after: always"><span style="display: none;">&nbsp;</span></div>');
		}


		/**
		 * Effectue le traitement sur un élement
		 * Génération de la ligne du plan
		 * Attribution d'un Id
		 * Insertion de l'element dans la structure du document
		 * @param element
		 * @param tag
		 * @param page
		 * @param block
		 * @return block + 1
		 * @method $scope.processElement
		 */
		function processElement(element, tag, page, block) {
			page++;
			generatePlan(element, tag, page, block);
			element.id = block;
			if (!retContent[page]) {
				retContent[page] = '';
			}
			processChildNode(element);
			retContent[page] += element.outerHTML;
			return (block + 1);
		}
		/**
		 * Génére la ligne html du plan correspondant à l'elt
		 * @param element
		 *  @param tag
		 * @method  $scope.generatePlan
		 */
		function generatePlan(element, tag, page, block) {

			var balise = tag.balise;
			if (balise === 'h1' || balise === 'h2' || balise === 'h3' || balise === 'h4' || balise === 'h5' || balise === 'h6') {
				var margin = 180;
				if (tag.niveau !== 0) {
					margin = (tag.niveau - 1) * 30;
				}
				var libelle = tag.libelle;
				var name = element.innerHTML;
				var reg = new RegExp('<.[^<>]*>', 'gi');
				name = name.replace(reg, '');
				retContent[0] += '<p style="margin-left:' + margin + 'px; text-decoration: underline; text-overflow:ellipsis; overflow:hidden; cursor: pointer;" ng-click="setActive($event,' + page + ',' +
					block + ')">' + libelle + ' : ' + name + '</p>';
			}

		}
		/**
		 * [cleanString description]
		 * @param  {String} param
		 * @return {String}        'Cleaned string'
		 */
		function cleanString(string) {
			// apply toLowerCase() function
			string = string.toLowerCase();
			string = cleanAccent(string);
			string = string.replace(/ /g, '');
			// return clean string
			return string;
		}

		/**
		 * Supprime les accents
		 * @param string
		 * @method  $scope.cleanAccent
		 */
		function cleanAccent(string) {

			// specified letters for replace
			var from = 'àáäâèéëêěìíïîòóöôùúüûñçčřšýžďťÀÁÄÂÈÉËÊĚÌÍÏÎÒÓÖÔÙÚÜÛÑÇČŘŠÝŽĎŤ';
			var to = 'aaaaeeeeeiiiioooouuuunccrsyzdtAAAAEEEEEIIIIOOOOUUUUNCCRSYZDT';
			// replace each special letter
			for (var i = 0; i < from.length; i++) {
				string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
			}
			// return clean string
			return string;
		}

		/**
		 * Traite les liens récursivement (pour les listes notamment)
		 * @param element
		 * @method  $scope.processChildNode
		 */
		function processChildNode(element) {

			for (var i = 0; i < element.childNodes.length; i++) {
				var child = element.childNodes[i];
				if (child.localName === 'a') {
					if (child.hash) {
						var text = document.createTextNode(child.innerHTML);
						element.replaceChild(text, child);
					} else {
						if (configuration.URL_REQUEST.indexOf(child.host) > -1) {
							child.hostname = urlHost;
							child.port = urlPort;
						}
						child.href = cleanAccent(configuration.URL_REQUEST + '/#/apercu?url=' + child.href);
						child.setAttribute('ng-click', 'goToLien(\'' + child.href + '\')');
					}
				}
				if (child.localName === 'img') {
					if (child.src.indexOf(configuration.URL_REQUEST) > -1) {
						child.src = child.src.replace(configuration.URL_REQUEST, 'https://' + urlHost);
					}
				}
				if (child.childNodes.length > 0) {
					processChildNode(child);
				}
			}
		}


		return {
			restoreNotesStorage: function (docSignature) {
				var mapNotes,
					notes,
					retNotes = [],
					i;
				if (localStorage.getItem('notes')) {
					mapNotes = JSON.parse(angular.fromJson(localStorage.getItem('notes')));
					notes = [];

					if (mapNotes.hasOwnProperty(docSignature)) {
						notes = mapNotes[docSignature];
					}
					for (i = 0; i < notes.length; i++) {
						//if (notes[i].idPage === idx) {
						//notes[i].styleNote = notes[i].texte;
						retNotes.push(notes[i]);
						//}
					}
				}
				return retNotes;
			},

			/*
			 * Récuperer la liste des annotations de localStorage et les afficher dans l'apercu.
			 */
			parcourirHtml: function (data, host, port) {
				urlHost = host;
				urlPort = port;
				retContent = [];
				retContent[0] = '<h1>Sommaire</h1><br />';
				var pages = splitPages(data);

				for (var page = 0; page < pages.length; page++) {
					var block = 0;
					var element = angular.element(pages[page]);
					var tags = JSON.parse(localStorage.getItem('listTags'));
					element.each(function (index, element) {

						tags.forEach(function (tag) {
							if (element.localName === tag.balise) {
								if (tag.balise === 'div') {
									if (cleanString(element.className) === cleanString(tag.libelle)) {
										block = processElement(element, tag, page, block);
									}
								} else {
									block = processElement(element, tag, page, block);
								}
							}
						});
					});
				}

				return retContent;
			},
			cleanAccent: function (string) {
				return cleanAccent(string);
			},
			cleanString: function (el) {
				return cleanString(el);
			},
			processElement: function (element, tag, page, block) {
				return processElement(element, tag, page, block);
			},
			splitPage: function (html) {
				return splitPages(html);
			}
		};
	}
	angular.module('cnedApp').service('workspaceService', workspaceService);

}());
