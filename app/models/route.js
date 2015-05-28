var mongoose = require('mongoose');

var routesSchema = new mongoose.Schema({
  employee: {
    name: { type: String},
    address: {type: String},
    type: {type: String}
  },
  appointmentList: [{   
    'Appt Id': { type: Number},
    'Start Time': { type: String},
    'End Time': { type: String},
    'Opportunity #': { type: String},
    'Customer Name': { type: String},
    'Job Site': { type: String}
   }], // this is the appointment ID as given from the uploaded .csv
  routeDate: { type: Date }
});

module.exports = mongoose.model('Appointment', appointmentSchema);