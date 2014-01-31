// Gestion des libelles / internationnalisation
cnedApp.filter('htmlToPlaintext', function($rootScope) {
	return function(text) {
		return String(text).replace(/<(?:.|\n)*?>/gm, '');
	}
});