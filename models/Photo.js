const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

module.exports = mongoose.model("Photo", PhotoSchema);
