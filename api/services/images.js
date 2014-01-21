// Require helpers
var helper = require('../helpers/helpers');

// 
var docStructureDao = require('../dao/docStructure');

var numberCalls = 0;
var sourcesUpload = [];
var counter = 0;

/*
 * index Action
 */
exports.index = function(req, res) {
	console.log("initialised ... ");
};


/**
 * Crop Image
 */
exports.cropImage = function(req, res) {
	// console.log("create");
	// console.log(req.body.DataCrop);

	var gd = require('node-gd');
	// var fs = require('fs');
	var path = require('path');
	var filesPath = './';

	var extension = helper.getFileExtension(req.body.DataCrop.srcImg);

	var source = req.body.DataCrop.srcImg;
	var targetImage = 'files/decoup.thumb_' + Math.random() + extension;
	var target = filesPath + targetImage;


	if (extension == ".png") {
		// Load existing image file on disk into memory
		gd.openPng(source, function(err, input_img) {

			// Create blank new image in memory
			output_img = gd.createTrueColor(Math.floor(req.body.DataCrop.w), Math.floor(req.body.DataCrop.h));

			// Render input over the top of output
			// input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH
			input_img.copyResampled(
			output_img,
			0 /*dstX*/ ,
			0 /*dstY*/ ,
			Math.floor(req.body.DataCrop.x) /*srcX*/ ,
			Math.floor(req.body.DataCrop.y) /*srcY*/ ,
			Math.floor(req.body.DataCrop.w) /*dstW*/ ,
			Math.floor(req.body.DataCrop.h) /*dstH*/ ,
			Math.floor(req.body.DataCrop.w) /*srcW*/ ,
			Math.floor(req.body.DataCrop.h) /*srcH*/ );

			//# Write image buffer to disk
			output_img.savePng(target, 0, function(err) {
				return res.jsonp(targetImage);
			});
		});
	} else if (extension == ".jpg") {
		// Load existing image file on disk into memory
		gd.openJpeg(source, function(err, input_img) {

			// Create blank new image in memory
			output_img = gd.createTrueColor(Math.floor(req.body.DataCrop.w), Math.floor(req.body.DataCrop.h));

			// Render input over the top of output
			//input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH
			input_img.copyResampled(
			output_img,
			0 /*dstX*/ ,
			0 /*dstY*/ ,
			Math.floor(req.body.DataCrop.x) /*srcX*/ ,
			Math.floor(req.body.DataCrop.y) /*srcY*/ ,
			Math.floor(req.body.DataCrop.w) /*dstW*/ ,
			Math.floor(req.body.DataCrop.h) /*dstH*/ ,
			Math.floor(req.body.DataCrop.w) /*srcW*/ ,
			Math.floor(req.body.DataCrop.h) /*srcH*/ );

			//# Write image buffer to disk
			output_img.saveJpeg(target, 0, function(err) {
				return res.jsonp(targetImage);
			});
		});
	}


};


/* Based on node-teseract module*/
exports.oceriser = function(req, res) {

	var exec = require('child_process').exec;
	fs = require('fs');
	crypto = require('crypto');

	var image = './' + req.body.sourceImage;
	var date = new Date().getTime();
	var output = crypto.createHash('md5').update(image + date).digest("hex") + '.tif';

	// console.log("convert " + image + " -type Grayscale " + output);
	exec("convert " + image + " -type Grayscale " + output, function(err, stdout, stderr) {

		fs.exists(output, function(exists) {
			console.log((exists ? "File is there" : "File is not there"));
			return "error";
		});

		//if(err) throw err;
		//console.log("tesseract " + output + " " + output + " -psm 047"); tesseract image.png out -l fra
		exec("tesseract " + output + " " + output + " -l fra", function(err, stdout, stderr) {
			if (err) throw err;
			fs.readFile(output + '.txt', function(err, data) {
				if (err) throw err;
				// text = data.toString('utf8').replace(/\W/g, ' ');
				text = data.toString('utf8');
				console.log("text oceriser ==> " + text);
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

}

/* Upload Files */
exports.uploadFiles = function(req, res) {

	fs = require('fs');
	var filesToUpload = [];
	sourcesUpload = [];
	counter = 0;

	if (!req.files.uploadedFile.length) {
		filesToUpload.push(req.files.uploadedFile);
	} else {
		for (var i = 0; i < req.files.uploadedFile.length; i++) {
			filesToUpload.push(req.files.uploadedFile[i]);
		};
	}
	numberCalls = filesToUpload.length;

	// parcourir la liste des fichiers a uploader
	for (var i = 0; i < filesToUpload.length; i++) {

		var currentFile = filesToUpload[i];
		// Detect file type
		var extension = helper.getFileExtension(filesToUpload[i].originalFilename);

		var newPath = "./files/" + currentFile.originalFilename;

		// Ouvrir et ecrire les fichier uploadés de meniere synchronous
		var fileReaded = fs.readFileSync(filesToUpload[i].path);
		var fileWrited = fs.writeFileSync(newPath, fileReaded);
		if (extension == '.pdf') {
			// (if PDF convert to JPEGs)
			exports.convertsPdfToPng(newPath, res);
		} else if (extension == '.jpg' || extension == '.jpeg') {
			// (if PDF convert to JPEGs)
			exports.convertsJpegToPng(newPath, res);
		} else {
			sourcesUpload.push(newPath);
			counter += 1;
			if (numberCalls == counter) {
				return res.jsonp(sourcesUpload);
			}
		}
	};
}


/* Convert PDF to JPEG */
exports.convertsPdfToPng = function(source, res) {

	var fs = require('fs');
	var sys = require('sys');
	var exec = require('child_process').exec;
	var imageFileName = source.substr(0, source.lastIndexOf('.')) + Math.random();

	// Render image with imagemagick
	exec("convert " + source + " -background white -alpha off " + imageFileName + ".png", function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
			return "error";
		} else {
			// console.log('[Done] Conversion from PDF to JPEG image' + imageFileName + '.jpg');

			// Get converted files by Command
			exec("ls files | grep  " + imageFileName.substr(8, imageFileName.length), function(errorls, stdoutls, stderrls) {

				if (errorls !== null) {
					console.log(errorls);
					return "error";
				}

				var files = stdoutls.replace(/\n/g, " ").split(" ");
				for (var i = 0; i < files.length; i++) {
					if (files[i] != '') {
						sourcesUpload.push("./files/" + files[i]);
					}
				};
				counter += 1;
				if (numberCalls == counter) {
					return res.jsonp(sourcesUpload);
				}

			});
		}
	});
}

exports.convertsJpegToPng = function(source, res) {

	var fs = require('fs');
	var sys = require('sys');
	var exec = require('child_process').exec;
	var imageFileName = source.substr(0, source.lastIndexOf('.')) + Math.random();

	// Render image with imagemagick
	exec("convert " + source + " " + imageFileName + ".png", function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
			return "error";
		} else {
			// console.log('[Done] Conversion from PDF to JPEG image' + imageFileName + '.jpg');
			// 
			sourcesUpload.push(imageFileName + ".png");
			counter += 1;
			if (numberCalls == counter) {
				return res.jsonp(sourcesUpload);
			}

			// Get converted files by Command
			// exec("ls files | grep  " + imageFileName.substr(8, imageFileName.length), function(errorls, stdoutls, stderrls) {

			// 	if (errorls !== null) {
			// 		console.log(errorls);
			// 		return "error";
			// 	}

			// 	var files = stdoutls.replace(/\n/g, " ").split(" ");
			// 	for (var i = 0; i < files.length; i++) {
			// 		if (files[i] != '') {
			// 			sourcesUpload.push("./files/" + files[i]);
			// 		}
			// 	};
			// 	counter += 1;
			// 	if (numberCalls == counter) {
			// 		return res.jsonp(sourcesUpload);
			// 	}

			// });
		}
	});
}

/*Text to speech*/
exports.textToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var fileName = './files/audio/mp3/audio_' + Math.random() + ".mp3";

	var tmpStr = req.body.text;

	// text to speech using espeak API 
	exec("espeak -v mb/mb-fr1 -s 110 '" + tmpStr + "' && espeak -v mb/mb-fr1 -s 110 '" + tmpStr + "' --stdout | lame - " + fileName, function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] textToSpeech & mp3+wav generation');
			res.jsonp(fileName);
		}

	});
}

/*Festival Demo Text to speech*/
exports.festivalTextToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var tmpStr = req.body.texte;

	exec("echo '" + tmpStr + "'  | festival --tts ", function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] festival');
		}

	});
}

/*Espeak Demo Text to speech*/
exports.espeakTextToSpeech = function(req, res) {
	var exec = require('child_process').exec;

	var tmpStr = req.body.text;

	// text to speech using espeak API 
	exec("espeak -v french '" + tmpStr + "' ", function(error, stdout, stderr) {
		if (error !== null) {
			console.log(error);
		} else {
			console.log('[Done] espeak');
		}

	});
}