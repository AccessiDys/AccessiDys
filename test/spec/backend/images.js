/* File: images.js
 *
 * Copyright (c) 2013-2016
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

describe('Service:Image', function () {
    this.timeout(0);

    it('Service:Image:download htmlPage', function (done) {
        app.post('/htmlPage', function (req, res) {
            req.body = {
                lien: 'http://gruntjs.com'
            };
            imageService.htmlPage(req, res);
        });
        request(app).post('/htmlPage').expect(200, done);
    });

    it('Service:Image:UploadFiles', function (done) {
        app.post('/fileupload', function (req, res) {
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

    it('Service:Image:download pdfHTTP', function (done) {
        app.post('/sendPdf', function (req, res) {
            req.body = {
                lien: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.pdf'
            };
            imageService.sendPdf(req, res);
        });
        request(app).post('/sendPdf').expect(200, done);
    });

    it('Service:Image:download pdfHTTPS', function (done) {
        app.post('/sendPdfHTTPS', function (req, res) {
            req.body = {
                lien: 'https://bitcoin.org/bitcoin.pdf'
            };
            imageService.sendPdfHTTPS(req, res);
        });
        request(app).post('/sendPdfHTTPS').expect(200, done);
    });

    it('Service:Image:generateSign', function (done) {
        app.post('/generateSign', function (req, res) {
            req.body = {
                filechunck: 'mojnlnbliuiunikynkuyvnkuyvnkuykuyvnkuyvnkuynvkuynbvyuknbyunbkuyn'
            };
            imageService.generateSign(req, res);
        });
        request(app).post('/generateSign').expect(200, done);
    });

    it('Service:Image:htmlPagePreview', function (done) {
        app.post('/htmlPagePreview', function (req, res) {
            req.body = {
                lien: 'http://fr.wikipedia.org/wiki/%C3%8Ele_Christmas_(Australie)',
            };
            imageService.htmlPagePreview(req, res);
        });
        request(app).post('/htmlPagePreview').expect(200, done);
    });

    it('Service:Image:download previewpdfHTTP', function (done) {
        app.post('/previewPdf', function (req, res) {
            req.body = {
                lien: 'http://www.ncu.edu.tw/~ncu25352/Uploads/201312311030531151830864.pdf'
            };
            imageService.previewPdf(req, res);
        });
        request(app).post('/previewPdf').expect(200, done);
    });


    it('Service:Image:download previewPdfHTTPS', function (done) {


        app.post('/previewPdfHTTPS', function (req, res) {
            req.body = {
                lien: 'https://bitcoin.org/bitcoin.pdf'
            };
            imageService.previewPdfHTTPS(req, res);
        });
        request(app).post('/previewPdfHTTPS').expect(200, done);
    });



    it('Service:Image:download htmlImage', function (done) {
        app.post('/htmlImage', function (req, res) {
            req.body = {
                lien: 'http://gruntjs.com'
            };
            imageService.htmlImage(req, res);
        });
        request(app).post('/htmlImage').expect(200, done);
    });

    it('Service:Image:epubUpload', function (done) {
        app.post('/epubUpload', function (req, res) {
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

    it('Service:Image:download externalEpub', function (done) {
        app.post('/externalEpub', function (req, res) {
            req.body = {
                lien: 'http://sql.sh/ressources/Cours_SQL.epub'
            };
            imageService.externalEpub(req, res);
        });
        request(app).post('/externalEpub').expect(200, done);
    });

    it('Service:Image:download externalEpubPreview', function (done) {
        app.post('/externalEpubPreview', function (req, res) {
            req.body = {
                lien: 'http://sql.sh/ressources/Cours_SQL.epub'
            };
            imageService.externalEpubPreview(req, res);
        });
        request(app).post('/externalEpubPreview').expect(200, done);
    });
});