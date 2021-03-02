"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const stadiumSchema = new Schema({
  name: String,
  location: String,
  capacity: Number,
  built: Number,
  teams: Array,
  addedBy: String
});

module.exports = Mongoose.model("Stadium", stadiumSchema);