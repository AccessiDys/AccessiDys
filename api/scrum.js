/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Scrum = mongoose.model('Scrum'),
    _ = require('underscore');

/**
 * Find client by id
 */
exports.client = function(req, res, next, id) {
    Scrum.load(id, function(err, client) {
        if (err) return next(err);
        if (!client) return next(new Error('Failed to load client ' + id));
        req.client = client;
        next();
    });
};


/**
 * Show a client
 */
exports.show = function(req, res) {
    res.jsonp(req.client);
};

/**
 * List of Clients
 */
exports.all = function(req, res) {
    Scrum.find().exec(function(err, clients) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(clients);
        }
    });
};


/**
 * Create a client
 */
exports.createClient = function(req, res) {
    var client = new Scrum(req.body);
    console.log("create");
    client.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                client: client
            });
        } else {
            res.jsonp(client);
        }
    });
};


exports.manipPDF = function(reg, res) {
    return res.jsonp("pdf manipulaton ... ");
}