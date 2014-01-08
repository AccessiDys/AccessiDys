/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    ProfilTag = mongoose.model('ProfilTag'),
    _ = require('underscore');



/**
 * Create ProfileTag
 */

exports.createProfilTag = function(req, res) {
    var profilTag = new ProfilTag(req.body);
    console.log("create");
    profilTag.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                profilTag: profilTag
            });
        } else {
            res.jsonp(profilTag);
        }
    });
};