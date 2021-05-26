"use strict";

const Boom = require("@hapi/boom");
const Review = require("../models/review");

const Reviews = {
  add: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const data = request.payload;
      const newReview = new Review({
        title: data.title,
        stadium: data.stadium,
        reviewedBy: data.reviewedBy,
        review: data.review,
        rating: data.rating,
        date: data.date
      })
      const review = await newReview.save();
      if (review) {
        return h.response(review).code(201);
      }
      return Boom.badImplementation("Error adding review");
    },
  },

  findByStadium: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      let stadiumId = request.params.id;
      let reviews = Review.find({ stadium: stadiumId }).populate("stadium").populate("reviewedBy").lean();
      return reviews;
    },
  },

  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      let reviews = Review.find().populate("stadium").populate("reviewedBy").lean();
      return reviews;
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Review.deleteMany({});
      return { success: true };
    },
  }
};

module.exports = Reviews;
