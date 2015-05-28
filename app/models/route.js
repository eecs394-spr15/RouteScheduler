var mongoose = require('mongoose');

var routesSchema = new mongoose.Schema({
  employee: { type: Schema.ObjectID, 'default': null, ref: 'Employee' },
  appointmentList: [{ type: Number }], // this is the appointment ID as given from the uploaded .csv
  team: {type: String},
  routeDate: { type: Date }  
});

module.exports = mongoose.model('Appointment', appointmentSchema);