/**
 * Created by mandouprog on 29/11/2013.
 */

/*
	index Action
 */
exports.index = function(req, res) {
	console.log("initialised ... ");
};


/**
 * Crop Image
 */
exports.cropImage = function(req, res) {
	console.log("create");

	var filesPath = './app/files/';
	var gd = require('node-gd');
	var fs = require('fs');
	var path = require('path');
	var source = filesPath + req.body.DataCrop.srcImg;
	var targetImage = 'decoup.thumb_' + Math.random() + '.png';
	var target = filesPath + targetImage;

	console.log("the path ==> ");
	fs.exists(source, function(exists) {
		console.log((exists ? "File is there" : "File is not there"));
		return "error";
	});

	//# Create blank new image in memory
	output_img = gd.create(req.body.DataCrop.w, req.body.DataCrop.h);

	//# Load existing image file on disk into memory
	gd.openPng(source, function(err, input_img) {

		//# Render input over the top of output
		//input_img.copyResampled output_img, dstX, dstY, srcX, srcY, dstW, dstH, srcW, srcH
		input_img.copyResampled(
		output_img,
		0 /*dstX*/ ,
		0 /*dstY*/ ,
		req.body.DataCrop.x /*srcX*/ ,
		req.body.DataCrop.y /*srcY*/ ,
		req.body.DataCrop.w /*dstW*/ ,
		req.body.DataCrop.h /*dstH*/ ,
		req.body.DataCrop.w /*srcW*/ ,
		req.body.DataCrop.h /*srcH*/ );

		//# Write image buffer to disk
		output_img.savePng(target, 0, function(err) {
			return res.jsonp(targetImage);
		});
	});

};

/* Convert PDF to PNG */
exports.convertsPdfToPng = function(req, res) {
	var exec = require('child_process').exec;
	var fs = require('fs');
	var util = require('util');
	var http = require('http');
	var url = require('url');

	var filename = './app/files/texte';

	// Render PNG with GhostScript
	exec("/usr/local/bin/gs -dQUIET -dPARANOIDSAFER -dBATCH -dNOPAUSE -dNOPROMPT -sDEVICE=png16m -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -r72 -dFirstPage=1 -dLastPage=1 -sOutputFile=" + filename + ".png " + filename + ".pdf", function(error, stdout, stderr) {

		if (error !== null) {
			console.log(error);
		} else {
			var img = fs.readFileSync(filename + '.png');
			res.writeHead(200, {
				'Content-Type': 'image/png'
			});
			res.end(img, 'binary');
			console.log('Created PNG: ' + filename + '.png');
		}
	});
}


/* Based on node-teseract module*/
exports.oceriser = function(req, res) {

	var exec = require('child_process').exec;
	fs = require('fs');
	crypto = require('crypto');

	var image = './app/files/' + req.body.sourceImage;
	var date = new Date().getTime();
	var output = crypto.createHash('md5').update(image + date).digest("hex") + '.tif';

	//console.log("convert " + image + " -type Grayscale " + output);
	exec("convert " + image + " -type Grayscale " + output, function(err, stdout, stderr) {
		//if(err) throw err;
		//console.log("tesseract " + output + " " + output + " -psm 047"); tesseract image.png out -l fra
		exec("tesseract " + output + " " + output + " -l fra", function(err, stdout, stderr) {
			if (err) throw err;
			fs.readFile(output + '.txt', function(err, data) {
				if (err) throw err;
				// text = data.toString('utf8').replace(/\W/g, ' ');
				text = data.toString('utf8');
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