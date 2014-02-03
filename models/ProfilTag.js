var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profilTagSchema = new Schema({
	profil: {type: String},
	tag: {type: String},
	texte: {	type: String},
	tagName: {type: String},
	police: {type: String},
	taille: {type: String},
	interligne: {type: String},
	styleValue: {type: String},
	coloration: {type: String}

});

/**
 * Statics
 */
profilTagSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	}
};

var ProfilTag = mongoose.model('ProfilTag', profilTagSchema);