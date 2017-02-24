'use strict';

angular.module('services.config', [])
	.constant('configuration', {
		URL_REQUEST: '.',
		CATALOGUE_NAME:'adaptation.html',
		DROPBOX_PATH: '/Applications/AccessiDys',
		HOMEPAGE_PATH: '#/listDocument',
		DEFAULT_PATH: '#/',
		DATE_PATTERN: 'dd/MM/yyyy'
	});
