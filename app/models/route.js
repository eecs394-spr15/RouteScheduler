var mongoose = require('mongoose');

var routesSchema = new mongoose.Schema({
  employee: { type: Schema.ObjectID, 'default': null, ref: 'Employee' },
  appointment: { type: Number },
  : { type: Number },
  time: { type: Number }
});

module.exports = mongoose.model('Appointment', appointmentSchema);