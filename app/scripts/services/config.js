'use strict';

angular.module('services.config', [])
	.constant('configuration', {
		URL_REQUEST: 'https://localhost:3000',
		DROPBOX_TYPE: 'sandbox',
		CATALOGUE_NAME:'adaptation.html'
	});