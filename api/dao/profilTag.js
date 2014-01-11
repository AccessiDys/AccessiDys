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


/**
 * Update ProfilTag
 */

exports.update = function(req, res){
    var profilTag = new ProfilTag(req.body);
    console.log(profilTag);
    ProfilTag.findById(profilTag._id, function  (err, item) {
    if (err){
        res.send({'result':'error'});
    }
    else {
           item.tag = profilTag.tag;
           
           item.save(item, function (err) {
               res.send({'result':'error'});
          });
    }
  });
}


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
}
