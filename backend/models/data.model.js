const mongoose = require('mongoose');

const data_save = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  urls: [
    {
      type: String,
      required: true
    }
  ],
  title: {
    type: String,
    required: true
  },
  Sub_title: {
    type: String,
    required: true
  },
  City: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Url = mongoose.model('Url', data_save);
module.exports = Url;
