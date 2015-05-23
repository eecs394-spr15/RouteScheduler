var mongoose = require('mongoose');

var techApptsSchema = new mongoose.Schema({
	Appointments: [{	  
	  Appt. Id: { type: Number},	 
	  Opportunity #: { type: String},
	  Customer Name: { type: String},
	  Job Site: { type: String}
	 }]
});

module.exports = mongoose.model('technicianAppointments', techApptsSchema);