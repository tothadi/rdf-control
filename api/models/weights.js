var mongoose = require('mongoose');

var weightSchema = new mongoose.Schema({
  id: String,
  weight: Number,
  date: Date,
  pics: Array
});

mongoose.model('Weight', weightSchema);
