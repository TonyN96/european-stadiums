"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const stadiumSchema = new Schema({
  name: String,
  country: String,
  city: String,
  capacity: Number,
  built: Number,
  club: String,
  rating: Number,
  reviews: Array,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  imageUrl: String,
  coords: Array,
});

module.exports = Mongoose.model("Stadium", stadiumSchema);
