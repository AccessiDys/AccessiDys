'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ProfilTag = mongoose.model('ProfilTag');



/**
 * Create ProfileTag
 */
exports.createProfilTag = function(req, res) {
    var profilTag = new ProfilTag(req.body);
    console.log('create');
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


/**
 * Update ProfilTag
 */

exports.update = function(req, res){
    var profilTag = new ProfilTag(req.body);
    ProfilTag.findById(profilTag._id, function  (err, item) {
    if (err){
        res.send({'result':'error'});
    }
    else {
           item.tag = profilTag.tag;
           item.texte = profilTag.texte;
           item.tagName = profilTag.tagName;
           item.police = profilTag.police;
           item.taille = profilTag.taille;
           item.interligne = profilTag.interligne;
           item.styleValue = profilTag.styleValue;
           
           item.save(item, function () {
               res.send({'result':'error'});
          });
    }
  });
};


/**
 * Find profilTag by Profil
  */

exports.findTagsByProfil = function(req, res){
ProfilTag.find({profil:req.body.idProfil}, function  (err, tags) {
     if (err){
            res.send({'result':'error'});
     }
     else {
        res.jsonp(tags);
     }
   });
};


/**
 * Delete profilTag by ProfilID & TagID
  */

exports.supprimer = function(req, res){

     var profilTag = new ProfilTag(req.body);

     ProfilTag.findOne({ profil: profilTag.profil , tag: profilTag.tag }, function  (err, item) {
     if (err){
            res.send({'result':'error'});
     }
     else {
                console.log('suppression ==> ');
                console.log(item);

           ProfilTag.remove(item, function () {
               res.send({'result':'error'});
           });
     }
   });
};
