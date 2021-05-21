"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const reviewSchema = new Schema({
  title: String,
  stadium: {
    type: Schema.Types.ObjectId,
    ref: "Stadium",
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  rating: Number,
  review: String,
  date: Date,
});

module.exports = Mongoose.model("Review", reviewSchema);
