var mongoose = require('mongoose');

var techApptsSchema = new mongoose.Schema({
	Appointments: [{	  
	  Appt. Id: { type: Number},	 
	  Opportunity #: { type: String},
	  Customer Name: { type: String},
	  Job Site: { type: String}
	 }],
	ApptDate: { type: Date}
});

module.exports = mongoose.model('technicianAppointments', techApptsSchema);