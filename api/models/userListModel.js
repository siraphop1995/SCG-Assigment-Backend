const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  lineId: {
    type: String,
    unique: true,
    Required: true
  },
  name: {
    type: String
  },
  balance: {
    type: Number
  }
});

module.exports = mongoose.model('Users', UserSchema);
