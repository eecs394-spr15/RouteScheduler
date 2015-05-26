var mongoose = require('mongoose');

var appointmentSchema = new mongoose.Schema({
  name: { type: String },
  address: {type: String },
  type: { type: Number },
  time: { type: Number }
});

module.exports = mongoose.model('Appointment', appointmentSchema);