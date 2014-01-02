var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profilSchema = new Schema({
	photo: {type: String},
	nom: {type: String},
	type: {	type: String},
	descriptif: {type: String},
	action: {type: String}
});

/**
 * Statics
 */
profilSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	}
};

var Profil = mongoose.model('Profil', profilSchema);