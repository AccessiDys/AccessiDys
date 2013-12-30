var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var docStructureSchema = new Schema({
	titre: {
		type: String
	},
	url: {
		type: String
	},
	image: {
		type: String
	},
	text: {
		type: String
	},
	children: [docStructureSchema]
});

/**
 * Statics
 */
docStructureSchema.statics = {
	load: function(id, cb) {
		this.findOne({
			_id: id
		}).exec(cb);
	}
};

var DocStructure = mongoose.model('DocStructure', docStructureSchema);