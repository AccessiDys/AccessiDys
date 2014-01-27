'use strict';

// Require helpers
var helper = require('../helpers/helpers');

// 
// var docStructureDao = require('../dao/docStructure');

var numberCalls = 0;
var sourcesUpload = [];
var counter = 0;

/**
 * Crop Image
 */
exports.cropImage = function(req, res) {

	var extension = helper.getFileExtension(req.body.DataCrop.srcImg);
	var source = req.body.DataCrop.srcImg;
	var targetImage = 'files/decoup.thumb_' + Math.random() + extension;

	/* Crop image with ImageMagick */
	var exec = require('child_process').exec;
	exec('convert ' + source + ' -crop ' + req.body.DataCrop.w + 'x' + req.body.DataCrop.h + '+' + req.body.DataCrop.x + '+' + req.body.DataCrop.y + ' ' + targetImage, function(err, stdout, stderr) {
		console.log(stderr);
		console.log(stdout);
		if (err) {
			throw err;
		} else {
			return res.jsonp({source:targetImage,order:req.body.DataCrop.order});
		}
	});
};


/* Based on node-teseract module*/
exports.oceriser = function(req, res) {

	var exec = require('child_process').exec;
	var fs = require('fs');
	var crypto = require('crypto');

	var image = './' + req.body.sourceImage;
	var date = new Date().getTime();
	var output = crypto.createHash('md5').update(image + date).digest('hex') + '.tif';

	// console.log("convert " + image + " -type Grayscale " + output);
	exec('convert ' + image + ' -type Grayscale ' + output, function(err) {

		fs.exists(output, function(exists) {
			console.log((exists ? 'File is there' : 'File is not there'));
			return 'error';
		});

		if (err) throw err;
		//console.log("tesseract " + output + " " + output + " -psm 047"); tesseract image.png out -l fra
		exec('tesseract ' + output + ' ' + output + ' -l fra', function(errTess) {
			if (errTess) throw errTess;
			fs.readFile(output + '.txt', function(err, data) {
				if (err) throw err;
				// text = data.toString('utf8').replace(/\W/g, ' ');
				var text = data.toString('utf8');
				console.log('text oceriser ==> ' + text);
				res.jsonp(text);
				fs.unlink(output + '.txt', function(err) {
					if (err) throw err;
					fs.unlink(output, function(err) {
						if (err) {
							throw err;
						}
					});
				});
			});
		});
	});

};

/* Upload Files */
exports.uploadFiles = function(req, res) {

	var fs = require('fs');
	var filesToUpload = [];
	sourcesUpload = [];
	counter = 0;

	if (!req.files.uploadedFile.length) {
		filesToUpload.push(req.files.uploadedFile);
		numberCalls = 1;
	} else {
		for (var i = 0; i < req.files.uploadedFile.length; i++) {
			filesToUpload.push(req.files.uploadedFile[i]);
		}
		numberCalls = filesToUpload.length;
	}

	console.log('filesToUpload ==> ');
	console.log(filesToUpload.length);

	// parcourir la liste des fichiers a uploader
	for (var i = 0; i < filesToUpload.length; i++) {

		var currentFile = filesToUpload[i];
		// Detect file type
		var extension = helper.getFileExtension(filesToUpload[i].originalFilename);

		var newPath = './files/' + currentFile.originalFilename;

		// Ouvrir et ecrire les fichier uploadés de meniere synchronous
		var fileReaded = fs.readFileSync(filesToUpload[i].path);
		var fileWrited = fs.writeFileSync(newPath, fileReaded);
		if (extension === '.pdf') {
			// (if PDF convert to JPEGs)
			exports.convertsPdfToPng(newPath, res);
		} else if (extension === '.jpg' || extension === '.jpeg') {
			// (if PDF convert to JPEGs)
			exports.convertsJpegToPng(newPath, res);
		} else {
			sourcesUpload.push(newPath);
			counter += 1;
			if (numberCalls === counter) {
				return res.jsonp(sourcesUpload);
			}
		}
	}
};


/* Convert PDF to JPEG */
exports.convertsPdfToPng = function(source, res) {

	var exec = require('child_process').exec;
	var imageFileName = source.substr(0, source.lastIndexOf('.')) + Math.random();

	// Render image with imagemagick
	exec('convert -geometry 595x842 -density 450 ' + source + ' -background white -alpha remove -alpha off ' + imageFileName + '.png', function(error) {
		if (error !== null) {
			console.log(error);
			return 'error';
		} else {
			// console.log('[Done] Conversion from PDF to JPEG image' + imageFileName + '.jpg');

			// Get converted files by Command
			exec('ls files | grep  ' + imageFileName.substr(8, imageFileName.length), function(errorls, stdoutls) {

				if (errorls !== null) {
					console.log(errorls);
					return 'error';
				}

				var files = stdoutls.replace(/\n/g, ' ').split(' ');
				for (var i = 0; i < files.length; i++) {
					if (files[i] !== '') {
						sourcesUpload.push('./files/' + files[i]);
					}
				}
				counter += 1;
				console.log('counter ==> ' + counter);
				console.log('numberCalls ==> ' + numberCalls);
				if (numberCalls === counter) {
					console.log('condition OK ');
					return res.jsonp(sourcesUpload);
				}

			});
		}
	});
};

exports.convertsJpegToPng = function(source, res) {

	var exec = require('child_process').exec;
	var imageFileName = source.substr(0, source.lastIndexOf('.')) + Math.random();

	// Render image with imagemagick
	exec('convert ' + source + ' ' + imageFileName + '.png', function(error) {
		if (error !== null) {
			console.log(error);
			return 'error';
		} else {
			// console.log('[Done] Conversion from PDF to JPEG image' + imageFileName + '.jpg');
			// 
			sourcesUpload.push(imageFileName + '.png');
			counter += 1;
			if (numberCalls === counter) {
				return res.jsonp(sourcesUpload);
			}
		}
	});
};

/*Text to speech*/
exports.textToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var fileName = './files/audio/mp3/audio_' + Math.random() + '.mp3';

	var tmpStr = req.body.text;

	// text to speech using espeak API 
	exec('espeak -v mb/mb-fr1 -s 110 \'' + tmpStr + '\' && espeak -v mb/mb-fr1 -s 110 \'' + tmpStr + '\' --stdout | lame - ' + fileName, function(error) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] textToSpeech & mp3+wav generation');
			res.jsonp(fileName);
		}

	});
};

/*Festival Demo Text to speech*/
exports.festivalTextToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var tmpStr = req.body.texte;

	exec('echo \'' + tmpStr + '\'  | festival --tts ', function(error) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] festival');
		}

	});
};

/*Espeak Demo Text to speech*/
exports.espeakTextToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var tmpStr = req.body.text;

	// text to speech using espeak API 
	exec('espeak -v french \'' + tmpStr + '\' ', function(error) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] espeak');
		}

	});
};