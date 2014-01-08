var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var profilTagSchema = new Schema({
	profil: {type: String},
	tag: {type: String},
	texte: {	type: String}

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