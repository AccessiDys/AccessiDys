/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Document = mongoose.model('Document'),
    _ = require('underscore');

var fs = require('fs');
/**
 * Create a document
 */
exports.create = function(req, res) {
    var document = new Document(req.body);

    var bitmap = fs.readFileSync(document.url);
    document.image = new Buffer(bitmap).toString('base64');

    var documentFils1 = new Document({
        titre: 'fils 1',
        image: document.image,
        children: []
    });
    var documentFils2 = new Document({
        titre: 'fils 2',
        image: document.image,
        children: []
    });
    var documentFils3 = new Document({
        titre: 'fils 3',
        image: document.image,
        children: []
    });
    var documentFils4 = new Document({
        titre: 'fils 4',
        image: document.image,
        children: []
    });
    var documentFils5 = new Document({
        titre: 'fils 5',
        image: document.image,
        children: []
    });

    documentFils1.children.push(documentFils2);
    documentFils1.children.push(documentFils3);

    documentFils4.children.push(documentFils5);

    document.children.push(documentFils1);
    document.children.push(documentFils4);

    document.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                document: document
            });
        } else {
            res.jsonp(document);
            console.log("create document");
        }
    });
};

/**
 * Create a document
 */

function imageToBase64(url, fileS) {
    var bitmap = fileS.readFileSync(url);
    return new Buffer(bitmap).toString('base64');
}

function treeRecursion(obj) {
    for (var key in obj) {
        if (typeof(obj[key]) == "object") {
            obj[key].image = imageToBase64(obj[key].image, fs);
            //console.log(obj[key]);
            treeRecursion(obj[key].children);
        }
    }
}

exports.createDocuments = function(req, res) {

    var documentArray = req.body;
    var i = 0;
    //console.log(documentArray);
    // mettre les images de tous les noeuds sous format Base64
    treeRecursion(documentArray);
    while (i < documentArray.length) {
        var doc = new Document(documentArray[i]);

        doc.save(function(err) {
            if (err) {
                console.log(err);
            }
        });

        //console.log("i = " + doc._id);

        //console.log(doc.image);
        console.log("\n");
        i++;
    }
};


/**
 * List of Clients
 */
exports.all = function(req, res) {

    Document.find().exec(function(err, documents) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(documents);
            console.log("all documents");
        }
    });
};

/**
 * Find document by id
 */
exports.document = function(req, res, next, id) {
    Document.load(id, function(err, document) {
        if (err) return next(err);
        if (!document) return next(new Error('Failed to load document ' + id));
        req.document = document;
        next();
    });
};

/**
 * Show a document
 */
exports.show = function(req, res) {
    res.jsonp(req.document);
};