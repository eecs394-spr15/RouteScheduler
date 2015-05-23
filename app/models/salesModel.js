var mongoose = require('mongoose');

var salesApptsSchema = new mongoose.Schema({
	Appointments: [{	  
	  Appt. Id: { type: Number},
	  Start Time: { type: String},
	  End Time: { type: String},
	  Opportunity #: { type: String},
	  Customer Name: { type: String},
	  Job Site: { type: String}
	 }]
});

module.exports = mongoose.model('salesAppointments', salesApptsSchema);