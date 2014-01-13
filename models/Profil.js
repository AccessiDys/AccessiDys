var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profilSchema = new Schema({
	photo: {type: String},
	nom: {type: String , required: true},
	type: {	type: String , required: true},
	descriptif: {type: String, required: true},
	niveauScolaire: {type: String , required: true},

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