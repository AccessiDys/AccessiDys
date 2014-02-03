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