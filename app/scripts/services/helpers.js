/* File: helpers.js
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

var cnedApp = cnedApp;

// include underscore
cnedApp.factory('_', function() {
	return window._; // assumes underscore has already been loaded on the page
});

// remplacer les codes HTML des accents
cnedApp.factory('removeAccents', function() {
	return function(value) {
		return value.replace(/&acirc;/g, 'â')
			.replace(/&Acirc;/g, 'Â')
			.replace(/&agrave/g, 'à')
			.replace(/&Agrave/g, 'À')
			.replace(/&eacute;/g, 'é')
			.replace(/&Eacute;/g, 'É')
			.replace(/&ecirc;/g, 'ê')
			.replace(/&Ecirc;/g, 'Ê')
			.replace(/&egrave;/g, 'è')
			.replace(/&Egrave;/g, 'È')
			.replace(/&euml;/g, 'ë')
			.replace(/&Euml;/g, 'Ë')
			.replace(/&icirc;/g, 'î')
			.replace(/&Icirc;/g, 'Î')
			.replace(/&iuml;/g, 'ï')
			.replace(/&Iuml;/g, 'Ï')
			.replace(/&ocirc;/g, 'ô')
			.replace(/&Ocirc;/g, 'Ô')
			.replace(/&oelig;/g, 'œ')
			.replace(/&Oelig;/g, 'Œ')
			.replace(/&ucirc;/g, 'û')
			.replace(/&Ucirc;/g, 'Û')
			.replace(/&ugrave;/g, 'ù')
			.replace(/&Ugrave;/g, 'Ù')
			.replace(/&uuml;/g, 'ü')
			.replace(/&Uuml;/g, 'Ü')
			.replace(/&ccedil;/g, 'ç')
			.replace(/&Ccedil;/g, 'Ç')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>');
	};
});

// nettoyer le texte des tags HTML
cnedApp.factory('removeHtmlTags', function() {
	// return value.replace(/['"]/g, "");
	return function(value) {
		return value.replace(/<\/?[^>]+(>|$)/g, '');
	};
});

/*Get Plain text without html tags*/
cnedApp.factory('htmlToPlaintext', function() {
	return function(text) {
		return String(text).replace(/<(?:.|\n)*?>/gm, '');
	};
});

/* Génerer une clef unique */
cnedApp.factory('generateUniqueId', function() {
	return function() {
		var d = new Date().getTime();
		d += (parseInt(Math.random() * 1000)).toString();
		return d;
	};
});

// Define a simple audio service 
/*cnedApp.factory('audio', function($document) {
	var audioElement = $document[0].createElement('audio'); // <-- Magic trick here
	return {
		audioElement: audioElement,

		play: function(filename) {
			audioElement.src = filename;
			audioElement.play(); //  <-- Thats all you need
		}
	};
});*/