const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  lineId: {
    type: String,
    unique: true,
    Required: true
  },
  username: {
    type: String,
    Required: true
  },
  balance: {
    type: Number,
    Required: true
  },
  earning: {
    type: Number,
    Required: true
  }
});

module.exports = mongoose.model('Users', UserSchema);
