/**
 * Created by abdelhaq on 25/12/13.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var tagSchema = new Schema({
	libelle : { type:String }
});

/**
 * Statics
 */
tagSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

var Tag = mongoose.model('Tag', tagSchema);
