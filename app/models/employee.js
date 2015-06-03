var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
  name: { type: String},
  address: {type: String},
  city: {type: String},
  state: {type: String},
  zip: {type: Number},
  team: {type: String},
  type: {type: String},
  coord:{lat :{ type: Number}, lon :{ type: Number}}
});

module.exports = mongoose.model('Employee', employeeSchema);