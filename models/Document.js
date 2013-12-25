/**
 * Created by root on 20/11/13.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var documentSchema = new Schema({
	titre : { type:String },
	url : { type:String },
	image : { type:String },
	children : [documentSchema]
});

/**
 * Statics
 */
documentSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

var Document = mongoose.model('Document', documentSchema);
