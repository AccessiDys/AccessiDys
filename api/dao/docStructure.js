/*jshint loopfunc:true*/

'use strict';

/**
 * Module dependences.
 */
var mongoose = require('mongoose'),
    DocStructure = mongoose.model('DocStructure');

var fs = require('fs');

/**
 * Creer un document structure
 */

function imageToBase64(url) {
    var bitmap = fs.readFileSync(url);
    return new Buffer(bitmap).toString('base64');
}

function treeRecursion(obj) {
    for (var key in obj) {
        if (typeof(obj[key]) === 'object') {
            obj[key].image = imageToBase64(obj[key].source);
            obj[key]._id = mongoose.Types.ObjectId();
            treeRecursion(obj[key].children);
        }
    }
}

exports.createDocuments = function(req, res) {

    var documentArray = req.body;
    var i = 0;

    // mettre les images de tous les noeuds sous format Base64
    treeRecursion(documentArray);
    var idDocuments = [];
    var callIndex = 0;
    while (i < documentArray.length) {
        var doc = new DocStructure(documentArray[i]);

        doc.save(function(err, saved) {
            if (err) {
                console.log(err);
            } else {
                idDocuments.push(saved._id);
                callIndex += 1;
                if (documentArray.length === callIndex) {
                    res.jsonp(idDocuments);
                }
            }
        });

        i++;
    }

};

/**
 * Liste des Documents
 */
exports.all = function(req, res) {
    DocStructure.find().exec(function(err, documents) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(documents);
        }
    });
};

/**
 * Find document by id
 */
exports.getDocument = function(req, res) {
    var id = req.body.idDoc;
    DocStructure.load(id, function(err, document) {
        if (err) {
            res.jsonp('error');
        } else {
            res.jsonp(200, document);
        }
    });
};