/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Profil = mongoose.model('Profil'),
    _ = require('underscore');


/**
 * Add a profile
 */
exports.createProfile = function(req, res) {
    var profile = new Profil(req.body);
    console.log("create");
    profile.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                profile: profile
            });
        } else {
            res.jsonp(profile);
        }
    });
};

/**
 * List of Profiles
 */
exports.all = function(req, res) {
    Profil.find().exec(function(err, profils) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            console.log(profils);
            res.jsonp(profils);
        }
    });
};

/**
 * Update Profiles
 */

exports.update = function(req, res){
    var profil = new Profil(req.body);
    Profil.findById(profil._id, function  (err, item) {
    if (err){
        res.send({'result':'error'});
    }
    else {
           item.photo = profil.photo;
           item.nom = profil.nom;
           item.type = profil.type;
           item.descriptif = profil.descriptif;
           item.save(item, function (err) {
               res.send({'result':'error'});
          });
    }
  });
}


/**
 * Delete Profiles
  */

exports.supprimer = function(req, res){
     var profil = new Profil(req.body);
     Profil.findById(profil._id, function  (err, item) {
     if (err){
            res.send({'result':'error'});
     }
     else {
           Profil.remove(item, function (err) {
               res.send({'result':'error'});
           });
     }
   });
}
