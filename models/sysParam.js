/**
 * Created by root on 20/11/13.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sysParamSchema = new Schema({
	appVersion: {
		type: Number,
		default: 0
	},
	hardUpdate: {
		type: Boolean,
		default: false
	},
	dateVersion: String
});

/**
 * Statics
 */
var sysParam = mongoose.model('sysParam', sysParamSchema);