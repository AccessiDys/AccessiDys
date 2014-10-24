/* File: images.js
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

/*jshint unused: true */
/*exported utils */

var utils = require('./utils'),
	request = require('supertest'),
	express = require('express'),
	imageService = require('../../../api/services/images'),
	app = express();

describe('Service:Image', function() {
	this.timeout(10000);
	/*it('Service:Image:CropImage', function(done) {
		app.post('/images', function(req, res) {
			req.body = {
				DataCrop: {
					srcImg: 'files/cours.png',
					w: 596,
					h: 83,
					x: 96,
					y: 6
				}
			};
			imageService.cropImage(req, res);
		});
		request(app).post('/images').expect(200, done);
	});*/

	var imageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAApwAAAAoCAYAAABTjyrvAAAV40lEQVR4Xu2dBbAcRReFOzjBgjskuLu7uxfu7u7w0ODB3d1dggUI7u7uVri7/T9fV92t+zozs7P7Nm93H+dWUSTZnpbTPdOnr3Wv//0rQSIEhIAQEAJCQAgIASEgBIYSAr1qIZxffPHFUOqGqhUCQkAICAEhIASEgBBoRQTGG2+8LnerNOGEbE444YRhnHHG6XKjqkAICAEhIASEgBAQAkKg9RH4+eefw3777Rc6Ojq61NmaCOfMM88cPv/88y41qIeFgBAQAkJACAgBISAE2gOBAw88MIw00kginO0xXeqlEBACQkAICAEhIATaDwERzvabM/VYCAgBISAEhIAQEAJthYAIZ1tNlzorBISAEBACQkAICIH2Q0CEs/3mTD0WAkJACAgBISAEhEBbISDC2VbTpc4KASEgBISAEBACQqD9EGgpwvnZZ5+F22+/Pdxyyy3h5ptvjmjOMsssYd555w0rr7xyWHLJJUPv3r0LUf7111/DbbfdFi655JIwcODAStm11147LL/88mHFFVcM4447btWZeuihh+LzgwcPDs8++2wsv/TSS4ellloq9mX66aevWocv8NJLL4WrrroqDDfccGH77bcP448/fk3PZxW+9dZbw4ABAwJ9RRgbbYw66qhdrruogieffDIMGjQoRpuVlZ9++ilsttlmoW/fvmUfKV2O/tx0002hX79+Ycsttwy9evWqPPvXX3+F33//PYwyyiil6+upBb/99tsw5phjNmR4rD3ei8knnzxssskmDakzr5Jmz+GPP/4YRh555PjuSoSAEBACQqA+BFqGcEISV1pppcJRkDD0/vvvzyV7jzzySFhjjTVCtcTyRx99dNhzzz3DsMMOO0R7P/zwQ1hhhRUCdRUJwB1yyCFhmGGGKYX8FVdcETbYYINY9tFHHw3zzz9/qefyCkHMIZheFl544XDfffdljqtLjSUP+7HUUm8jxp3VnvUHPDio2LxC8tddd92w+eabhz322KOWrvaoshDuc845Jxx++OHh9ddfbwjp3GKLLcIFF1wQ16DHvNHANXsO77jjjvg94FAz99xzN3p4qk8ICAEh8J9BoCUIJ+RuoYUWqoDOh50NDU3kG2+8Efbff//Kb5DOJ554YghN2WWXXRY22mijTuVIMDrV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';
	it('Service:Image:download htmlPage', function(done) {
		app.post('/htmlPage', function(req, res) {
			req.body = {
				lien: 'http://gruntjs.com'
			};
			imageService.htmlPage(req, res);
		});
		request(app).post('/htmlPage').expect(200, done);
	});
	it('Service:Image:Oceriser', function(done) {
		app.post('/oceriser', function(req, res) {
			req.body = {
				encodedImg: imageBase64
			};
			imageService.oceriser(req, res);
		});
		request(app).post('/oceriser').expect(200, done);
	});

	/*it('Service:Image:ConvertsPdfToPng', function(done) {
		app.post('/pdfimage', function(req, res) {
			req.body = {
				pdfData: {
					source: 'test/spec/backend/files/grammaire.pdf',
					page: 0
				}
			};
			imageService.convertsPdfToPng(req, res);
		});
		request(app).post('/pdfimage').expect(200, done);
	});*/

	it('Service:Image:UploadFiles', function(done) {
		app.post('/fileupload', function(req, res) {
			req.files = {
				uploadedFile: [{
					fieldName: 'uploadedFile',
					originalFilename: 'grammaire.pdf',
					path: './test/spec/backend/files/grammaire.pdf',
					headers: {
						'content-disposition': 'form-data; name="uploadedFile"; filename="grammaire.pdf"',
						'content-type': 'application/pdf'
					},
					size: 89386,
					name: 'grammaire.pdf',
					type: 'application/pdf'
				}]
			};
			imageService.uploadFiles(req, res);
		});
		request(app).post('/fileupload').expect(200, done);
	});

	it('Service:Image:TextToSpeech', function(done) {
		app.post('/texttospeech', function(req, res) {
			req.body = {
				text: 'test'
			};
			imageService.textToSpeech(req, res);
		});
		request(app).post('/texttospeech').expect(200, done);
	});

	it('Service:Image:download pdfHTTP', function(done) {
		app.post('/sendPdf', function(req, res) {
			req.body = {
				lien: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.pdf'
			};
			imageService.sendPdf(req, res);
		});
		request(app).post('/sendPdf').expect(200, done);
	});

	it('Service:Image:download pdfHTTPS', function(done) {
		app.post('/sendPdfHTTPS', function(req, res) {
			req.body = {
				lien: 'https://bitcoin.org/bitcoin.pdf'
			};
			imageService.sendPdfHTTPS(req, res);
		});
		request(app).post('/sendPdfHTTPS').expect(200, done);
	});



	it('Service:Image:download previewpdfHTTP', function(done) {
		app.post('/previewPdf', function(req, res) {
			req.body = {
				lien: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.pdf'
			};
			imageService.previewPdf(req, res);
		});
		request(app).post('/previewPdf').expect(200, done);
	});


	it('Service:Image:download previewPdfHTTPS', function(done) {


		app.post('/previewPdfHTTPS', function(req, res) {
			req.body = {
				lien: 'https://bitcoin.org/bitcoin.pdf'
			};
			imageService.previewPdfHTTPS(req, res);
		});
		request(app).post('/previewPdfHTTPS').expect(200, done);
	});



	it('Service:Image:download htmlImage', function(done) {
		app.post('/htmlImage', function(req, res) {
			req.body = {
				lien: 'http://gruntjs.com'
			};
			imageService.htmlImage(req, res);
		});
		request(app).post('/htmlImage').expect(200, done);
	});

	it('Service:Image:epubUpload', function(done) {
		app.post('/epubUpload', function(req, res) {
			req.files = {
				uploadedFile: [{
					fieldName: 'uploadedFile',
					originalFilename: 'aaaa.epub',
					path: 'test/spec/backend/files/aaaa.epub',
					headers: {
						'content-disposition': 'form-data; name="uploadedFile"; filename="aaaa.epub"',
						'content-type': 'application/epub+zip'
					},
					size: 179151,
					name: 'aaaa.epub',
					type: 'application/epub+zip'
				}]
			};
			imageService.epubUpload(req, res);
		});
		request(app).post('/epubUpload').expect(200, done);
	});

	it('Service:Image:download externalEpub', function(done) {
		app.post('/externalEpub', function(req, res) {
			req.body = {
				lien: 'http://sql.sh/ressources/Cours_SQL.epub'
			};
			imageService.externalEpub(req, res);
		});
		request(app).post('/externalEpub').expect(200, done);
	});

	it('Service:Image:download externalEpubPreview', function(done) {
		app.post('/externalEpubPreview', function(req, res) {
			req.body = {
				lien: 'http://sql.sh/ressources/Cours_SQL.epub'
			};
			imageService.externalEpubPreview(req, res);
		});
		request(app).post('/externalEpubPreview').expect(200, done);
	});
});