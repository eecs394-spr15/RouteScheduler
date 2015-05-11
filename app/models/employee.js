var mongoose = require('mongoose');

module.exports = mongoose.model('Employee', {
  name: { type: String},
  address: {type: String},
  type: {type: String}
});