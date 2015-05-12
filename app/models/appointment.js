var mongoose = require('mongoose');

var appointmentSchema = new mongoose.Schema({
  name: { type: String},
  address: {type: String},
  type: { type: String },
  time: { type: Date }
});

module.exports = mongoose.model('Appointment', appointmentSchema);