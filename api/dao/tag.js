/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    async = require('async'),
    Tag = mongoose.model('Tag'),
    _ = require('underscore');

/**
 * Create a tag
 */
exports.create = function(req, res) {
    var tag = new Tag(req.body);
    
    tag.save(function(err) {
        if (err) {
        	res.send({'result':'error'});
        } else {
            res.jsonp(tag);
            console.log("tag crée");
        }
    });
};

exports.remove = function(req, res){
	     var tag = new Tag(req.body);
	     Tag.findById(tag._id, function  (err, item) {
         if (err){
        	 	res.send({'result':'error'});
         }
         else {
               Tag.remove(item, function (err) {
            	   res.send({'result':'error'});
               });
         }
       });
}

exports.update = function(req, res){
    var tag = new Tag(req.body);
    Tag.findById(tag._id, function  (err, item) {
    if (err){
   	 	res.send({'result':'error'});
    }
    else {
    	   item.libelle = tag.libelle;
           item.save(item, function (err) {
        	   res.send({'result':'error'});
          });
    }
  });
}

/**
 * List of Tags
 */
exports.all = function(req, res) {
    Tag.find().exec(function(err, tags) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
        	res.jsonp(tags);
            console.log("all tags");
        }
    });
};

/**
 * Find tag by id
 */
exports.tag = function(req, res, next, id) {
    Tag.load(id, function(err, tag) {
        if (err) return next(err);
        if (!tag) return next(new Error('Failed to load tag ' + id));
        req.tag = tag;
        next();
    });
};

