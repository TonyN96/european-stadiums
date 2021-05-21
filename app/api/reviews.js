"use strict";

const Review = require("../models/review");

const Reviews = {
  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const reviews = await Review.find();
      return reviews;
    },
  },

  findByStadium: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      let stadiumId = request.params.id;
      let reviews = Review.find({ stadium: stadiumId }).populate("reviewedBy");
      return reviews;
    },
  },
};

module.exports = Reviews;
