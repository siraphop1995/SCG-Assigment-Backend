const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
  owner: {
    type: String,
    Required: true
  },
  type: {
    type: String,
    Required: true
  },
  value: {
    type: Number,
    Required: true
  },
  expense: {
    type: Boolean,
    Required: true
  },
  createdDate: {
    type: Date
  }
});

module.exports = mongoose.model('History', HistorySchema);
