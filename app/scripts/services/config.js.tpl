'use strict';

angular.module('services.config', [])
	.constant('configuration', {
		URL_REQUEST: '<%= URL_REQUEST %>',
		DROPBOX_TYPE: '<%= [DROPBOX_TYPE] %>'
	});