var mongoose = require('mongoose');

var appointmentSchema = new mongoose.Schema({
  name: { type: String},
  address: {type: String},
  type: { type: Number},
  time: { type: Date }
});
//se.model('Appointment'
//module.exports = mongoo, appointmentSchema);