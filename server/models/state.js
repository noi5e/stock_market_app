var mongoose = require('mongoose');

var StateSchema = mongoose.Schema({
	name: {
		type: String
	},
	stockList: [
		{ name: String, values: Array, color: String }
	]
});

var State = module.exports = mongoose.model('State', StateSchema);