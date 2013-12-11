/**
 * Created by root on 20/11/13.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ImageSchema = new Schema({
    ClientName: {type: String, required: true},
    Images: [{
        ImageName: {type: String, required: true}
    }]
});

/**
 * Statics
 */
ImageSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).exec(cb);
    }
};

var Images = mongoose.model('Images', ImageSchema);
