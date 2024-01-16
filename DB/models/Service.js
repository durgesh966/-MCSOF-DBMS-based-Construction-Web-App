const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  titlename: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model("Service", serviceSchema);
