/* File: docStructure.js
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