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
/*jshint unused: false, undef:false */


var numberCalls = 0;
var sourcesUpload = [];
var counter = 0;
var helpers = require('../helpers/helpers');
var generalParams = require('../../env/generalParams.json');

/**
 * Ocerisation
 */

function imageToBase64(url) {
    var fs = require('fs');
    var bitmap = fs.readFileSync(url);
    return new Buffer(bitmap).toString('base64');
}


/* Based on node-teseract module*/
exports.oceriser = function(req, res) {
    var exec = require('child_process').exec;
    var spawn = require('child_process').spawn;
    var fs = require('fs');
    var crypto = require('crypto');
    var date = new Date().getTime();
    /*Replace encodedImg value by base64image*/
    var base64Str = req.body.encodedImg.replace('data:image/png;base64,', '');
    /*image with unique hashed name*/
    var createdImg = 'img_' + crypto.createHash('md5').update(base64Str + date).digest('hex');
    var fullImgPath = './files/' + createdImg + '.png';
    //create PNG image from base64 string
    fs.writeFileSync(fullImgPath, new Buffer(base64Str, 'base64'));
    //Output a JPEG image
    var output = './files/out_' + crypto.createHash('md5').update(base64Str + date).digest('hex') + '.jpg';
    // console.log('convert ' + fullImgPath + ' -geometry 4000x5000 -density 300x300 -quality 80 -units PixelsPerInch -depth 8 -background white -type truecolor -define jpeg:extent=1000kb ' + output);

    //convert created PNG image to high quality JPEG image
    // Create Spawn Convert Command
    helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Start Convertion ... ');
    var convert = spawn('/usr/local/bin/gm', ['convert', fullImgPath, '-geometry', '4000x5000', '-density', '300x300', '-quality', '80', '-units', 'PixelsPerInch', '-depth', '8', '-background', 'white', '-type', 'truecolor', '-define', 'jpeg:extent=1000kb', output]);
    // var convert = spawn('convert', [fullImgPath, output]);
    convert.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });

    convert.stderr.on('data', function(data) {
        throw data;
    });

    // Kill Process
    convert.on('SIGTERM', function() {
        console.log('Child SIGTERM detected convert');
        convert.exit();
    });

    convert.on('close', function(code) {
        console.log('child process convert exited with code ' + code);
        fs.exists(output, function(exists) {
            if (exists) {
                console.log('File is there');
                return 'File is there';
            } else {
                console.log('File is not there');
                return 'File is not there';
            }
            console.log('error');
            return 'error';
        });

        helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Finalisation Optimisation Image');

        //Run tesseract-ocr
        exec('tesseract ' + output + ' ' + output + ' -l fra', function(errTess) {
            if (errTess) {
                throw errTess;
            }
            fs.readFile(output + '.txt', function(err, data) {
                if (err) throw err;
                var text = data.toString('utf8');
                var trailer = '';
                if (text.length > 50) {
                    trailer = text.substring(0, 50);
                } else {
                    trailer = text;
                }
                helpers.journalisation(1, req.user, req._parsedUrl.pathname, 'Output-text:[' + trailer + ']');
                res.jsonp(text);
                //remove text file
                fs.unlink(output + '.txt', function(err) {
                    if (err) throw err;
                    //remove JPEG image
                    fs.unlink(output, function(err) {
                        if (err) {
                            throw err;
                        }
                        //remove PNG image
                        fs.unlink(fullImgPath, function(err) {
                            if (err) {
                                throw err;
                            }
                        });
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
    // console.log(req);
    if (!req.files.uploadedFile.length) {
        filesToUpload.push(req.files.uploadedFile);
        numberCalls = 1;
    } else {
        for (var i = 0; i < req.files.uploadedFile.length; i++) {
            filesToUpload.push(req.files.uploadedFile[i]);
        }
        numberCalls = filesToUpload.length;
    }
    // parcourir la liste des fichiers a uploader
    var fileReaded = null;
    var bufferedFile = null;
    if (filesToUpload.length > 1) {
        var listFiles = [];

        for (var i = 0; i < filesToUpload.length; i++) {
            fileReaded = fs.readFileSync(filesToUpload[i].path);
            bufferedFile = new Buffer(fileReaded).toString('base64');
            listFiles.push(bufferedFile);
            if (i == filesToUpload.length - 1) {
                return res.jsonp(listFiles);
            }
        }
    } else {
        fileReaded = fs.readFileSync(filesToUpload[0].path);
        bufferedFile = new Buffer(fileReaded).toString('base64');
        helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
        return res.jsonp(bufferedFile);
    }
};

/*Text to speech*/
exports.textToSpeech = function(req, res) {
    var exec = require('child_process').exec;
    var fileName = './files/audio/mp3/audio_' + Math.random() + '.mp3';
    var tmpStr = req.body.text;
    // text to speech using espeak API
    exec('espeak -v french -s 110 "' + tmpStr + '" && espeak -v french -s 110 "' + tmpStr + '" --stdout | lame - ' + fileName, function(error) {
        if (error !== null) {
            throw error;
        } else {
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, fileName);
            res.jsonp(imageToBase64(fileName));
        }
    });
};
var http = require('http');
exports.sendPdf = function(req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    http.get(url, function(res) {
        var chunks = [];
        if (res.statusCode !== 200) {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        }
        var len = parseInt(res.headers['content-length'], 10);
        var byteCounter = 0;

        res.on('data', function(chunk) {
            chunks.push(chunk);
            byteCounter = byteCounter + chunk.length;
            console.log((100.0 * byteCounter / len));
            global.io.sockets.emit('pdfProgress', {
                fileProgress: (100.0 * byteCounter / len)
            });
        });

        res.on('end', function() {
            var jsfile = new Buffer.concat(chunks).toString('base64');
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
            responce.send(200, jsfile);
        });
    }).on('error', function() {
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
        responce.jsonp(404, null);
    });
};
var https = require('https');
exports.sendPdfHTTPS = function(req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    https.get(url, function(res) {
        var chunks = [];
        if (res.statusCode !== 200) {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        }

        var len = parseInt(res.headers['content-length'], 10);
        var byteCounter = 0;

        res.on('data', function(chunk) {
            chunks.push(chunk);
            byteCounter = byteCounter + chunk.length;
            console.log((100.0 * byteCounter / len));
            global.io.sockets.emit('pdfProgress', {
                fileProgress: (100.0 * byteCounter / len)
            });
        });

        res.on('end', function() {
            var jsfile = new Buffer.concat(chunks).toString('base64');

            helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
            responce.send(jsfile);
        });
    }).on('error', function() {
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
        responce.jsonp(404, null);
    });
};
exports.previewPdf = function(req, responce) {
    var md5 = require('MD5');
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    console.log('url==========++>' + url);
    if (url.indexOf('.pdf') < 0) {
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, 'lurl entre nest pas celui dun fichier pdf');
        responce.jsonp(404, null);
    } else {

        http.get(url, function(res) {
            var chunks = [];
            if (res.statusCode !== 200) {
                helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                responce.jsonp(404, null);
            }

            res.on('data', function(chunk) {
                chunks.push(chunk);
                var jsfile = new Buffer.concat(chunks).toString('base64');
                if (jsfile.length > generalParams.FIRST_CHUNCK_SIZE + 10000) {
                    jsfile = jsfile.substring(0, generalParams.FIRST_CHUNCK_SIZE);
                    responce.send(200, md5(jsfile));
                    res.destroy();
                }
            });

            res.on('end', function() {
                var jsfile = new Buffer.concat(chunks).toString('base64');
                responce.send(200, md5(jsfile));
                res.destroy();
            });
        }).on('error', function() {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, 'erreur downloading');
            responce.jsonp(404, null);
        });
    }
};
exports.previewPdfHTTPS = function(req, responce) {
    var md5 = require('MD5');
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    if (url.indexOf('.pdf') < 0) {
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, 'lurl entre nest pas celui dun fichier pdf');
        responce.jsonp(404, null);
    } else {
        https.get(url, function(res) {
            var chunks = [];
            if (res.statusCode !== 200) {
                helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                responce.jsonp(404, null);
            }
            res.on('data', function(chunk) {
                chunks.push(chunk);
                var jsfile = new Buffer.concat(chunks).toString('base64');
                if (jsfile.length > generalParams.FIRST_CHUNCK_SIZE + 10000) {
                    jsfile = jsfile.substring(0, generalParams.FIRST_CHUNCK_SIZE);
                    responce.send(200, md5(jsfile));
                    res.destroy();
                }
            });
            res.on('end', function() {
                var jsfile = new Buffer.concat(chunks).toString('base64');
                responce.send(200, md5(jsfile));
                res.destroy();
            });
        }).on('error', function() {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        });
    }
};

exports.generateSign = function(req, res) {
    var md5 = require('MD5');
    if (req.body.filechunck) {
        res.send(200, {sign:md5(req.body.filechunck)});
    } else {
        res.send(400, null);
    }
};

function isUrl(s) {
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    return regexp.test(s);
}

// a mettre dans un fichier externe et inclure apres
var dictionnaireHtml = {
    id: ['ad_container', 'google_ads', 'google_flash_embed', 'adunit'],
    class: ['GoogleActiveViewClass'],
    tag: ['objet', 'object', 'script', 'link', 'meta', 'button', 'embed', 'form', 'frame', 'iframe']
};

var htmlparser = require('htmlparser2');
var util = require('util');

exports.htmlPagePreview = function(req, responce) {
    var md5 = require('MD5');
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    var protocole;
    if (url.indexOf('https') > -1) {
        protocole = https;
    } else {
        protocole = http;
    }
    protocole.get(url, function(res) {
        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('end', function() {
            var jsfile = new Buffer.concat(chunks);
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
            responce.send(md5(jsfile.toString('utf-8')));
        });
    });
};

var removeParent = function(domObject) {
    for (var i = 0; i < domObject.length; i++) {
        if (domObject[i].prev || domObject[i].parent) {
            console.log('delete prev');
            delete domObject[i].prev;
            delete domObject[i].parent;
        }
        if (domObject[i].children) {
            return removeParent(domObject[i].children);
        }
    }
    return domObject;
};

exports.htmlPage = function(req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    var protocole;
    if (url.indexOf('https') > -1) {
        protocole = https;
    } else {
        protocole = http;
    }
    protocole.get(url, function(res) {
        var chunks = [];
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });

        res.on('end', function() {
            var jsfile = new Buffer.concat(chunks);
            helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
            if (jsfile.length > 0) {
                responce.send(200, jsfile.toString('utf-8'));
            } else {
                console.log('e***************');
                console.log(jsfile);
                console.log(jsfile.length);
                responce.send(500);
            }
            //var handler = new htmlparser.DomHandler(function(error, dom) {
            //    if (error) {
            //        console.log('erreur parsing the dom');
            //        responce.send(500);
            //    } else {
            //        console.log('********');
            //        responce.jsonp(200, removeParent(dom));
            //    }
            //});
        });
    });
};



exports.htmlImage = function(req, responce) {
    var donneRecu = req.body;
    var url = donneRecu['lien']; // jshint ignore:line
    var protocole;
    var parentProtocole = '';
    if (url.indexOf('https') > -1) {
        protocole = https;
        parentProtocole = 'https:';
    } else {
        protocole = http;
        parentProtocole = 'http:';
    }
    protocole.get(url, function(res) {
        var chunks = [];
        if (res.statusCode !== 200) {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        }
        res.on('data', function(chunk) {
            chunks.push(chunk);
        });
        res.on('end', function() {
            var jsfile = new Buffer.concat(chunks);
            var imgArray = [];
            var nbImage = 0;
            var totalImag = 0;
            var finalResult = {};
            var parser = new htmlparser.Parser({
                onopentag: function(name, attribs) {
                    if (name === 'img') {
                        nbImage++;
                        totalImag++;
                        // console.log(nbImage);
                        var imgchunks = [];
                        var urlimg = attribs.src;
                        var originalLink = attribs.src;
                        // console.log(isUrl(urlimg));
                        if (!isUrl(urlimg)) {
                            // console.log('not a good url');
                            if (urlimg.indexOf('//') > -1) {
                                urlimg = parentProtocole + urlimg;
                            } else {
                                urlimg = url + urlimg;
                            }
                            // console.log(urlimg);
                        }
                        if (urlimg.indexOf('https') > -1) {
                            // console.log('in https');
                            https.get(urlimg, function(imageRes) {
                                imageRes.on('data', function(imgchunk) {
                                    imgchunks.push(imgchunk);
                                });
                                imageRes.on('end', function() {
                                    var imgBase64 = new Buffer.concat(imgchunks).toString('base64');
                                    // console.log(entities.encode(htmlText));
                                    var tmp = {
                                        'link': originalLink,
                                        'data': imgBase64
                                    };
                                    imgArray.push(tmp);
                                    nbImage--;
                                    var progress = (100 * (totalImag - nbImage)) / totalImag;
                                    global.io.sockets.emit('htmlProgress', {
                                        fileProgress: progress
                                    });
                                    if (nbImage === 0) {
                                        finalResult = {
                                            'img': imgArray
                                        };
                                        helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
                                        responce.send(200, finalResult);
                                    }
                                });
                            });
                        } else {
                            http.get(urlimg, function(imageRes) {
                                imageRes.on('data', function(imgchunk) {
                                    imgchunks.push(imgchunk);
                                });
                                imageRes.on('end', function() {
                                    var imgBase64 = new Buffer.concat(imgchunks).toString('base64');
                                    var tmp = {
                                        'link': originalLink,
                                        'data': imgBase64
                                    };
                                    imgArray.push(tmp);
                                    nbImage--;
                                    var progress = (100 * (totalImag - nbImage)) / totalImag;
                                    global.io.sockets.emit('htmlProgress', {
                                        fileProgress: progress
                                    });
                                    if (nbImage === 0) {
                                        finalResult = {
                                            'img': imgArray
                                        };
                                        helpers.journalisation(1, req.user, req._parsedUrl.pathname, '');
                                        responce.send(200, finalResult);
                                    }
                                });
                            });
                        }
                    }
                },
                onend: function() {
                    if (nbImage < 1) {
                        finalResult = {
                            'img': []
                        };
                        responce.jsonp(200, finalResult);
                    }
                }
            });
            parser.write(jsfile);
            parser.end();
        });
    }).on('error', function() {
        helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
        responce.jsonp(404, null);
    });
};

// var xml2js = require('xml2js');
// var jsonQuery = require('json-query');


function traverseEpub(obj, foundUrl) {
    for (var key in obj) {
        if (typeof(obj[key]) === 'object') {
            if (obj[key].content) {
                foundUrl.push(obj[key].content[0].$.src);
            }
            if (obj[key].navPoint && obj[key].navPoint.length > 0) {
                traverseEpub(obj[key].navPoint, foundUrl);
            }
        }
    }
}
var sizeOf = require('image-size');
var fs = require('fs');
var exec = require('child_process').exec;

function imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter) {
    var canvasWidth = generalParams.MAX_WIDTH;
    var dimensions;
    if (rawImageList[counter] && rawImageList[counter].length > 2) {

        try {
            dimensions = sizeOf(rawImageList[counter]);
        } catch (e) {
            dimensions = {
                width: 700
            };
        }

        if (dimensions && dimensions.width < generalParams.MAX_WIDTH + 1) {
            var fileReaded = fs.readFileSync(rawImageList[counter]);
            var newValue = rawImageList[counter].replace(tmpFolder, '');
            var folderName = /((\/+)([A-Za-z0-9_%]*)(\/+))/i.exec(newValue)[0];
            var imgRefLink = newValue.replace(folderName, '');
            imgArray.push({
                'link': imgRefLink,
                'data': new Buffer(fileReaded).toString('base64')
            });
            counter++;

            if (rawImageList[counter]) {
                imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
            } else {
                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});

                responce.send(200, {
                    'html': htmlArray,
                    'img': imgArray
                });
            }

        } else if (dimensions && dimensions.width > generalParams.MAX_WIDTH) {

            var extension = rawImageList[counter].lastIndexOf('.');
            var originalImageLink = rawImageList[counter].substring(0, extension);
            var resisedImg = originalImageLink + '2' + rawImageList[counter].substring(extension, rawImageList[counter].length);

            exec('/usr/local/bin/gm convert -size ' + canvasWidth + ' ' + rawImageList[counter].replace(/\s+/g, '\\ ') + ' -resize ' + canvasWidth + ' +profile "*" ' + resisedImg.replace(/\s+/g, '\\ '), function(error, htmlresult, stderr) {
                var fileReaded = fs.readFileSync(resisedImg);
                var newValue = rawImageList[counter].replace(tmpFolder, '');
                var folderName = /((\/+)([A-Za-z0-9_%]*)(\/+))/i.exec(newValue)[0];
                var imgRefLink = newValue.replace(folderName, '');

                imgArray.push({
                    'link': imgRefLink,
                    'data': new Buffer(fileReaded).toString('base64')
                });
                counter++;

                if (rawImageList[counter]) {
                    imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
                } else {
                    exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});
                    responce.send(200, {
                        'html': htmlArray,
                        'img': imgArray
                    });
                }
            });
        } else {
            if (rawImageList[counter]) {
                imageDownloader(rawImageList, htmlArray, tmpFolder, imgArray, responce, counter);
            } else {

                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});

                responce.send(200, {
                    'html': htmlArray,
                    'img': imgArray
                });
            }
        }


    }
}

exports.epubUpload = function(req, responce) {

    var xml2js = require('xml2js');
    var jsonQuery = require('json-query');
    var foundUrl = [];
    var filesToUpload = [];
    var htmlArray = [];
    var imgArray = [];
    var orderedHtmlFile = [];
    var counter;
    var i, y;
    var tmpFolder = '';
    var canvasWidth = generalParams.MAX_WIDTH;
    var exitHTML = false;
    var existantHtml;

    if (!req.files.uploadedFile.length) {
        filesToUpload.push(req.files.uploadedFile);
        numberCalls = 1;
    } else {
        for (i = 0; i < req.files.uploadedFile.length; i++) {
            filesToUpload.push(req.files.uploadedFile[i]);
        }
        numberCalls = filesToUpload.length;
    }
    exec('mktemp -d', function(error, tmpFolder, stderr) {
        console.log('________________________TMP_FOLDER____________________');
        console.log(tmpFolder);
        tmpFolder = tmpFolder.replace(/\s+/g, '');
        console.log(filesToUpload[0].path);
        exec('unzip ' + filesToUpload[0].path + ' -d ' + tmpFolder, function(error, stdout, stderr) {
            console.log('_____________________EXTRACT________________________');
            exec("find " + tmpFolder + " -type f -name '*.xhtml' -o -name '*.html' -o -name '*.htm' -o -name '*.xml'", function(error, sizesList, stderr) {
                existantHtml = sizesList;
                sizesList = sizesList.split('\n');
                var bigHtml = 0;
                var tooManyHtml = false;
                /*
                 * voire si le fichier ajouté contient un nombre d'element html inferieur a la limite fixé
                 */
                if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                    for (var i = 0; i < sizesList.length; i++) {
                        if (sizesList[i].length > 5) {
                            var stats = fs.statSync(sizesList[i]);
                            var fileSizeInBytes = stats['size'];
                            var fileSizeInKB = fileSizeInBytes / 1024;
                            if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                console.log(sizesList[i]);
                                console.log(fileSizeInKB);
                                bigHtml = true;
                            }
                        }
                    }
                } else {
                    tooManyHtml = true;
                    console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                }
                if (tooManyHtml) {
                    exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                    });
                    responce.send(200, {
                        'html': [],
                        'img': [],
                        'oversized': false,
                        'tooManyHtml': true,
                        'oversizedIMG': false
                    });
                } else if (bigHtml) {
                    console.log('this epub contains oversized html');
                    exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                    });
                    responce.send(200, {
                        'html': [],
                        'img': [],
                        'oversized': true,
                        'tooManyHtml': false,
                        'oversizedIMG': false
                    });
                } else {
                    exec('find ' + tmpFolder + ' -name *.ncx', function(error, ncx, stderr) {
                        console.log('__________________NCX______________________');
                        ncx = ncx.replace(/\s+/g, '');
                        fs.readFile(ncx, 'utf8', function(err, data) {
                            xml2js.parseString(data, function(err, result) {
                                console.log('xml parsed');
                                traverseEpub(result.ncx.navMap, foundUrl);
                                for (i = 0; i < foundUrl.length; i++) {
                                    if (foundUrl[i].indexOf('#') > 0) {
                                        foundUrl[i] = foundUrl[i].substring(0, foundUrl[i].indexOf('#'));
                                    }
                                }
                                for (i = 0; i < foundUrl.length; i++) {
                                    counter = false;
                                    for (y = 0; y < orderedHtmlFile.length; y++) {
                                        if (orderedHtmlFile[y] === foundUrl[i]) {
                                            counter = true;
                                            break;
                                        }
                                    }
                                    if (counter === false) {
                                        orderedHtmlFile.push(foundUrl[i]);
                                    }
                                }

                                exec("find " + tmpFolder + " -type f -name '*.xhtml' -o -name '*.html' -o -name '*.htm' -o -name '*.xml'", function(error, htmlresult, stderr) {
                                    console.log('__________________XHTML AND HTML______________________');
                                    var htmlFound = htmlresult.split('\n');
                                    for (i = 0; i < orderedHtmlFile.length; i++) {
                                        for (y = 0; y < htmlFound.length; y++) {
                                            if (htmlFound[y].indexOf(orderedHtmlFile[i]) > -1) {

                                                var fileReaded = fs.readFileSync(htmlFound[y], 'utf8');
                                                htmlArray.push({
                                                    'link': orderedHtmlFile[i],
                                                    'dataHtml': fileReaded
                                                });
                                                if (htmlArray.length >= orderedHtmlFile.length) {
                                                    console.log('html traitement finished going to images');
                                                    exitHTML = true;
                                                    break;
                                                } else {
                                                    break;
                                                }

                                            }
                                        }
                                        if (exitHTML) {
                                            break;
                                        }
                                    }
                                    if (exitHTML) {

                                        exec('du -hs ' + tmpFolder, function(error, dirSize, stderr) {
                                            exec('du -csh $(find ' + tmpFolder + ' -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" | xargs) | tail -n1', function(error, allImgSize, stderr) {
                                                if (allImgSize === 0 || dirSize === allImgSize) {
                                                    exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                                                    });

                                                    responce.send(200, {
                                                        'html': htmlArray,
                                                        'img': []
                                                    });
                                                } else {
                                                    if (allImgSize > generalParams.IMG_SIZE_LIMIT) {
                                                        exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                                                        });

                                                        responce.send(200, {
                                                            'html': [],
                                                            'img': [],
                                                            'oversized': false,
                                                            'tooManyHtml': false,
                                                            'oversizedIMG': true
                                                        });
                                                    } else {
                                                        console.log('Searching for images');
                                                        exec('find ' + tmpFolder + ' -name *.png -o -name *.jpg -o -name *.jpeg -o -name *.PNG -o -name *.JPG -o -name *.JPEG  ', function(error, imgFound, stderr) {
                                                            console.log('__________________IMG______________________');
                                                            imgFound = imgFound.split('\n');
                                                            if (imgFound.length > 1) {
                                                                imageDownloader(imgFound, htmlArray, tmpFolder, imgArray, responce, 0);
                                                            } else {
                                                                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                                                                });

                                                                responce.send(200, {
                                                                    'html': htmlArray,
                                                                    'img': []
                                                                });
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        });
                                    }


                                });
                            });
                        });
                    });
                }

            });

        });
    });
};

exports.externalEpub = function(req, responce) {
    var sizeOf = require('image-size');
    var fs = require('fs');
    var exec = require('child_process').exec;
    var xml2js = require('xml2js');
    var jsonQuery = require('json-query');
    var AdmZip = require('adm-zip');
    var url = req.body.lien;
    var protocole = null;
    var filesToUpload = [];
    var tmpFolder = '';
    var htmlArray = [];
    var imgArray = [];
    var orderedHtmlFile = [];
    var counter;
    var i, y;
    var tmpFolder = '';
    var foundUrl = [];
    var canvasWidth = generalParams.MAX_WIDTH;
    var exitHTML = false;
    var existantHtml;

    if (isUrl(url)) {
        if (url.indexOf('https') > -1) {
            protocole = https;
        } else {
            protocole = http;
        }

        protocole.get(url, function(res) {
            var data = [],
                dataLen = 0;
            var chunks = [];
            if (res.statusCode !== 200) {
                helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                responce.jsonp(404, null);
            }
            var len = parseInt(res.headers['content-length'], 10);
            var byteCounter = 0;
            res.on('data', function(chunk) {
                data.push(chunk);
                dataLen += chunk.length;

                chunks.push(chunk);
                byteCounter = byteCounter + chunk.length;

                global.io.sockets.emit('epubProgress', {
                    fileProgress: (100.0 * byteCounter / len)
                });
            });
            res.on('end', function() {
                var jsfile = new Buffer.concat(chunks);

                var buf = new Buffer(dataLen);

                for (var i = 0, len = data.length, pos = 0; i < len; i++) {
                    data[i].copy(buf, pos);
                    pos += data[i].length;
                }

                var zip = new AdmZip(buf);
                var zipEntries = zip.getEntries();


                exec('mktemp -d', function(error, tmpFolder, stderr) {
                    console.log('________________________TMP_FOLDER____________________');
                    console.log(tmpFolder);
                    tmpFolder = tmpFolder.replace(/\s+/g, '');
                    console.log('_____________________EXTRACT________________________');
                    zip.extractAllTo(tmpFolder, /*overwrite*/ true);

                    exec('find ' + tmpFolder + '-type f -name "*.xhtml" -o -name "*.html" -o -name "*.htm" -o -name "*.xml"', function(error, sizesList, stderr) {

                        existantHtml = sizesList;
                        sizesList = sizesList.split('\n');
                        var bigHtml = 0;
                        var tooManyHtml = false;

                        if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                            for (var i = 0; i < sizesList.length; i++) {

                                if (sizesList[i].length > 5) {
                                    var stats = fs.statSync(sizesList[i]);
                                    var fileSizeInBytes = stats['size'];
                                    var fileSizeInKB = fileSizeInBytes / 1024;
                                    // console.log(fileSizeInKB);
                                    if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                        bigHtml++;
                                    }
                                }
                            }
                        } else {
                            tooManyHtml = true;
                            console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                        }
                        if (tooManyHtml) {
                            exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                            });
                            responce.send(200, {
                                'html': [],
                                'img': [],
                                'oversized': false,
                                'tooManyHtml': true,
                                'oversizedIMG': false
                            });
                        } else if (bigHtml > 1) {
                            console.log('this epub contains oversized html');
                            exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                            });
                            responce.send(200, {
                                'html': [],
                                'img': [],
                                'oversized': true,
                                'tooManyHtml': false,
                                'oversizedIMG': false
                            });
                        } else {
                            exec('find ' + tmpFolder + ' -name *.ncx', function(error, ncx, stderr) {
                                console.log('__________________NCX______________________');
                                console.log(ncx);
                                console.log('my ncx');
                                ncx = ncx.replace(/\s+/g, '');

                                fs.readFile(ncx, 'utf8', function(err, data) {

                                    xml2js.parseString(data, function(err, result) {
                                        console.log('xml parsed');
                                        traverseEpub(result.ncx.navMap, foundUrl);
                                        for (i = 0; i < foundUrl.length; i++) {
                                            if (foundUrl[i].indexOf('#') > 0) {
                                                foundUrl[i] = foundUrl[i].substring(0, foundUrl[i].indexOf('#'));
                                            }
                                        }
                                        for (i = 0; i < foundUrl.length; i++) {
                                            counter = false;
                                            for (y = 0; y < orderedHtmlFile.length; y++) {
                                                if (orderedHtmlFile[y] === foundUrl[i]) {
                                                    counter = true;
                                                    break;
                                                }
                                            }
                                            if (counter === false) {
                                                orderedHtmlFile.push(foundUrl[i]);
                                            }
                                        }

                                        exec('find ' + tmpFolder + ' -type f -name "*.xhtml" -o -name "*.html" -o -name "*.htm" -o -name "*.xml"', function(error, htmlresult, stderr) {

                                            var sizesList = htmlresult.split('\n');
                                            var bigHtml = 0;
                                            var tooManyHtml = false;
                                            if (sizesList.length < generalParams.HTML_NUMBER_LIMIT) {
                                                for (var i = 0; i < sizesList.length; i++) {

                                                    if (sizesList[i].length > 5) {
                                                        var stats = fs.statSync(sizesList[i]);
                                                        var fileSizeInBytes = stats['size'];
                                                        var fileSizeInKB = fileSizeInBytes / 1024;
                                                        if (fileSizeInKB > generalParams.HTML_SINGLE_SIZE_LIMIT) {
                                                            bigHtml++;
                                                        }
                                                    }
                                                }
                                            } else {
                                                tooManyHtml = true;
                                                console.log('too many html files > ' + generalParams.HTML_NUMBER_LIMIT);
                                            }
                                            if (tooManyHtml) {
                                                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});
                                                responce.send(200, {
                                                    'html': [],
                                                    'img': [],
                                                    'oversized': false,
                                                    'tooManyHtml': true,
                                                    'oversizedIMG': false
                                                });
                                            } else if (bigHtml > 1) {
                                                console.log('this epub contains oversized html');
                                                exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {

                                                });
                                                responce.send(200, {
                                                    'html': [],
                                                    'img': [],
                                                    'oversized': true,
                                                    'tooManyHtml': false,
                                                    'oversizedIMG': false
                                                });
                                            } else {
                                                console.log('________HTML_______XHTML_________HTM_____XML______');
                                                // console.log(htmlFound);
                                                var htmlFound = htmlresult.split('\n');
                                                console.log('===HTML FOUND===>' + htmlFound.length);
                                                console.log('===ORDER HTML===>' + orderedHtmlFile.length);
                                                for (var z = 0; z < orderedHtmlFile.length; z++) {
                                                    for (y = 0; y < htmlFound.length; y++) {
                                                        if (htmlFound[y].indexOf(orderedHtmlFile[z]) > -1) {
                                                            var fileReaded = fs.readFileSync(htmlFound[y], 'utf8');
                                                            htmlArray.push({
                                                                'link': orderedHtmlFile[z],
                                                                'dataHtml': fileReaded
                                                            });
                                                            if (htmlArray.length >= orderedHtmlFile.length) {
                                                                exitHTML = true;
                                                            } else {
                                                                break;
                                                            }

                                                        }
                                                    }
                                                    if (exitHTML) {
                                                        break;
                                                    }
                                                }
                                                if (exitHTML) {
                                                    console.log('Searching for images');
                                                    exec('find ' + tmpFolder + ' -name *.png -o -name *.jpg -o -name *.jpeg -o -name *.PNG -o -name *.JPG -o -name *.JPEG  ', function(error, imgFound, stderr) {
                                                        console.log('__________________IMG______________________');
                                                        imgFound = imgFound.split('\n');
                                                        console.log('image Found ', imgFound.length);
                                                        if (imgFound.length > 1) {
                                                            imageDownloader(imgFound, htmlArray, tmpFolder, imgArray, responce, 0);
                                                        } else {
                                                            exec('rm -rf ' + tmpFolder, function(error, deleteResponce, stderr) {});
                                                            responce.send(200, {
                                                                'html': htmlArray,
                                                                'img': []
                                                            });
                                                        }
                                                    });
                                                }
                                            }


                                        });
                                    });
                                });
                            });
                        }
                    });

                });
            });

        }).on('error', function() {
            helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
            responce.jsonp(404, null);
        });

    } else {
        responce.send(400, {
            'code': -1,
            'message': 'le lien est pas correcte'
        });
    }
};

exports.externalEpubPreview = function(req, responce) {
    console.log('externalEpubPreview');
    var md5 = require('MD5');
    var url = req.body.lien;
    var protocole = null;
    if (isUrl(url)) {
        if (url.indexOf('https') > -1) {
            protocole = https;
            console.log('using protocole ====> https');
        } else {
            console.log('using protocole ====> http');
            protocole = http;
        }

        protocole.get(url, function(res) {
            var chunks = [];
            if (res.statusCode !== 200) {
                helpers.journalisation(-1, req.user, req._parsedUrl.pathname, '');
                responce.jsonp(404, null);
            }



            res.on('data', function(chunk) {
                chunks.push(chunk);
                var jsfile = new Buffer.concat(chunks).toString('base64');
                if (jsfile.length > generalParams.FIRST_CHUNCK_SIZE + 10000) {
                    jsfile = jsfile.substring(0, generalParams.FIRST_CHUNCK_SIZE);
                    responce.send(200, md5(jsfile));
                    res.destroy();
                }
            });

            res.on('end', function() {
                var jsfile = new Buffer.concat(chunks).toString('base64');
                responce.send(200, md5(jsfile));
                res.destroy();
            });
        });
    } else {
        responce.send(400, {
            'code': -1,
            'message': 'le lien est pas correcte'
        });
    }
};
