var mongoose = require('mongoose');

var geoSchema = new mongoose.Schema({
		address: {type: String },
	  coord:{lat :{ type: Number}, lon :{ type: Number}}
});

module.exports = mongoose.model('geoCodingResult', geoSchema);