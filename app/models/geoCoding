var mongoose = require('mongoose');

var geoSchema = new mongoose.Schema({
	geoLocation: {	  
		address: {type: String },
	  	Coord:{lat :{ type: Number}, lon :{ type: Number}}
	 }
});

module.exports = mongoose.model('geoCodingResult', geoSchema);