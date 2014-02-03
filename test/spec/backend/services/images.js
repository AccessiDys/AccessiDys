'use strict';

/*jshint unused: true */
/*exported utils */

var utils = require('./../utils'),
	request = require('supertest'),
	express = require('express'),
	imageService = require('../../../../api/services/images'),
	app = express();

describe('Service:Image', function() {

	it('Service:Image:CropImage', function(done) {
		app.post('/images', function(req, res) {
			req.body = {
				DataCrop: {
					srcImg: 'test/spec/backend/files/cours.png',
					w: 596,
					h: 83,
					x: 96,
					y: 6
				}
			};
			imageService.cropImage(req, res);
		});
		request(app).post('/images').expect(200, done);
	});

	it('Service:Image:Oceriser', function(done) {
		app.post('/oceriser', function(req, res) {
			req.body = {
				sourceImage: 'test/spec/backend/files/image_a_oceriser.png'
			};
			imageService.oceriser(req, res);
		});
		request(app).post('/oceriser').expect(200, done);
	});

	it('Service:Image:UploadFiles', function(done) {
		app.post('/fileupload', function(req, res) {
			req.files = {
				uploadedFile: [{
						fieldName: 'uploadedFile',
						originalFilename: 'cours.png',
						path: 'test/spec/backend/files/cours.png',
						headers: {
							'content-disposition': 'form-data; name="uploadedFile"; filename="cours.png"',
							'content-type': 'image/png'
						},
						size: 179151,
						name: 'cours.png',
						type: 'image/png'
					}, {
						fieldName: 'uploadedFile',
						originalFilename: 'exercice.jpg',
						path: 'test/spec/backend/files/exercice.jpg',
						headers: {
							'content-disposition': 'form-data; name="uploadedFile"; filename="exercice.jpg"',
							'content-type': 'image/jpg'
						},
						size: 179151,
						name: 'exercice.jpg',
						type: 'image/jpg'
					}, {
						fieldName: 'uploadedFile',
						originalFilename: 'grammaire.pdf',
						path: 'test/spec/backend/files/grammaire.pdf',
						headers: {
							'content-disposition': 'form-data; name="uploadedFile"; filename="grammaire.pdf"',
							'content-type': 'application/pdf'
						},
						size: 89386,
						name: 'grammaire.pdf',
						type: 'application/pdf'
					}

				]
			};
			imageService.uploadFiles(req, res);
		});
		request(app).post('/fileupload').expect(200, done);
	});

	it('Service:Image:TextToSpeech', function(done) {
		app.post('/texttospeech', function(req, res) {
			req.body = {
				text: 'Un example de texte'
			};
			imageService.textToSpeech(req, res);
		});
		request(app).post('/texttospeech').expect(200, done);
	});

	it('Service:Image:EspeakTextToSpeech', function(done) {
		app.post('/espeaktexttospeechdemo', function(req, res) {
			req.body = {
				text: 'Un example de texte'
			};
			imageService.espeakTextToSpeech(req, res);
		});
		request(app).post('/espeaktexttospeechdemo').expect(200, done);
	});

});