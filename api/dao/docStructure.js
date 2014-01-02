/**
 * Module dependences.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    DocStructure = mongoose.model('DocStructure'),
    _ = require('underscore');

var fs = require('fs');
/**
 * Creer un document structure
 */
exports.createDocuments = function(req, res) {

    // console.log(req.body.blocks);
    // return res.jsonp("c bon");

    var documentArray = req.body.blocks;
    var i = 0;
    //console.log(documentArray);
    // mettre les images de tous les noeuds sous format Base64
    console.log("call recursive ");
    treeRecursion(documentArray);
    console.log("initialise id documents");
    var idDocuments = [];
    var callIndex = 0;
    while (i < documentArray.length) {
        var doc = new DocStructure(documentArray[i]);
        console.log("ID created is ==> " + doc._id);

        doc.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("not error saving doc => ");
                console.log(doc._id);
                idDocuments.push(doc._id);
                callIndex += 1;
                if (documentArray.length == callIndex) {
                    console.log("exiting while ... ");
                    console.log(idDocuments);
                    res.jsonp(idDocuments);
                }
            }
        });

        console.log("\n");
        i++;
    }

};


function imageToBase64(url) {
    console.log("in base64 ==> ");
    var bitmap = fs.readFileSync(url);
    return new Buffer(bitmap).toString('base64');
}

// function treeRecursion(obj) {
//     for (var key in obj) {
//         if (typeof(obj[key]) == "object") {
//             obj[key].image = imageToBase64(obj[key].image, fs);
//             obj[key]._id = mongoose.Types.ObjectId();
//             //console.log(obj[key]);
//             treeRecursion(obj[key].children);
//         }
//     }
// }

function treeRecursion(obj) {
    console.log(" in call recursive ");
    for (var key in obj) {
        if (typeof(obj[key]) == "object") {
            obj[key].image = imageToBase64(obj[key].source);
            obj[key]._id = mongoose.Types.ObjectId();
            // console.log(obj[key]);
            treeRecursion(obj[key].children);
        }
    }
}



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
            console.log("all documents");
        }
    });
};

/**
 * Find document by id
 */
exports.getDocument = function(req, res) {

    console.log("the id is ==> ");
    console.log(req.body.idDoc);
    var id = req.body.idDoc;

    DocStructure.load(id, function(err, document) {
        // if (err) {
        //     return next(err);
        // }
        // if (!document) {
        //     return next(new Error('Failed to load document ' + idDoc));
        // }
        // req.document = document;
        // next();

        if (err) {
            res.jsonp("error");
        } else {
            res.jsonp(document);
        }
    });
};

/**
 * Show a document
 */
exports.show = function(req, res) {
    res.jsonp(req.document);
};