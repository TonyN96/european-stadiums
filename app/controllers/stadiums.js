"use strict";

const Joi = require("@hapi/joi");
const Stadium = require("../models/stadium");
const User = require("../models/user");
const Review = require("../models/review");
const ImageStore = require("../utils/image-store");
const Sanitizer = require("../utils/sanitizer");
const UtilityFunctions = require("../utils/utility-functions");
const env = require("dotenv");
//Configure environment variables
env.config();

const Stadiums = {
  // Method for displaying the home page
  index: {
    handler: async function (request, h) {
      try {
        //Get all stadiums
        const stadiums = await Stadium.find().populate("addedBy").lean();
        // Get all users
        const users = await User.find().lean();
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId);
        const username = user.firstName + " " + user.lastName;
        // Categorising stadiums using utility function
        const categorisedStadiums = UtilityFunctions.categoriseStadiums(stadiums);
        // For loop for populating stadium reviews, formatting review dates and calculating ratings
        for (let x = 0; x < stadiums.length; x++) {
          stadiums[x].reviews = await Review.find({ stadium: stadiums[x]._id })
            .populate("stadium")
            .populate("reviewedBy")
            .lean();
          let totalRatings = 0;
          for (let z = 0; z < stadiums[x].reviews.length; z++) {
            totalRatings += stadiums[x].reviews[z].rating;
            let reviewDate = new Date(stadiums[x].reviews[z].date);
            stadiums[x].reviews[z].date = UtilityFunctions.dateFormatter(reviewDate);
          }
          if (totalRatings != 0) {
            stadiums[x].rating = (totalRatings / stadiums[x].reviews.length) * 20;
          } else {
            stadiums[x].rating = null;
          }
        }
        // Rendering home page with the object containing required view data
        return h.view("home", {
          title: "European Stadiums | Home",
          username: username,
          mapsKey: process.env.mapsKey,
          usersCount: users.length,
          stadiumsCount: stadiums.length,
          allStadiums: stadiums,
          categorisedStadiums: categorisedStadiums,
        });
      } catch (err) {
        return h.view("home", { errors: [{ message: err }] });
      }
    },
  },

  // Method for displaying the add stadium view
  addStadiumView: {
    handler: async function (request, h) {
      const userId = request.auth.credentials.id;
      const user = await User.findById(userId);
      const username = user.firstName + " " + user.lastName;
      return h.view("add-stadium", { title: "European Stadiums | Add Stadium", username: username });
    },
  },

  // Method for adding a new stadium
  addStadium: {
    validate: {
      payload: {
        // Joi validation for the stadium details entered
        name: Joi.string().required(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        capacity: Joi.number().integer().required(),
        built: Joi.number().integer().min(1800).max(2021).required(),
        club: Joi.string().required(),
        xcoord: Joi.string().required(),
        ycoord: Joi.string().required(),
        imagefile: Joi.any().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("add-stadium", {
            title: "European Stadiums | Error adding stadium..",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        // Get current user from cookie
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        const data = request.payload;
        // Upload image to cloudinary db through ImageStore
        const result = await ImageStore.uploadImage(data.imagefile);
        // Save the URL of the cloudinary image upload
        const imageUrl = result.url;
        // Save stadium coordinates to coords variable
        let coords = [Sanitizer.sanitizeContent(data.xcoord), Sanitizer.sanitizeContent(data.ycoord)];
        // Create new Stadium object using relevant data
        const newStadium = new Stadium({
          name: Sanitizer.sanitizeContent(data.name),
          country: Sanitizer.sanitizeContent(data.country),
          city: Sanitizer.sanitizeContent(data.city),
          capacity: Sanitizer.sanitizeContent(data.capacity),
          built: Sanitizer.sanitizeContent(data.built),
          club: Sanitizer.sanitizeContent(data.club),
          coords: coords,
          addedBy: user._id,
          imageUrl: imageUrl,
        });
        await newStadium.save();
        return h.redirect("/home");
      } catch (err) {
        return h.view("add-stadium", {
          title: "European Stadiums | Error adding stadium..",
          errors: [{ message: err.message }],
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  // Method for deleting a stadium
  deleteStadium: {
    handler: async function (request, h) {
      try {
        // Get stadium to be removed uisng id parameter
        const stadiumId = request.params.id;
        const stadium = Stadium.findById(stadiumId);
        // Delete stadium
        await Stadium.deleteOne(stadium);
        return h.redirect("/home");
      } catch (err) {
        return h.view("home", {
          title: "European Stadiums | Error deleting stadium..",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for displaying the edit stadium view
  editStadiumView: {
    handler: async function (request, h) {
      const stadiumId = request.params.id;
      const userId = request.auth.credentials.id;
      const user = await User.findById(userId);
      const username = user.firstName + " " + user.lastName;
      // The relevant stadium is passed into the view
      const stadium = await Stadium.findById(stadiumId).lean();
      return h.view("edit-stadium", {
        title: "European Stadiums | Edit Stadium",
        username: username,
        stadium: stadium,
      });
    },
  },
  editStadium: {
    validate: {
      payload: {
        // Joi validation for the updated stadium details
        name: Joi.string().required(),
        country: Joi.string().required(),
        city: Joi.string().required(),
        capacity: Joi.number().integer().required(),
        built: Joi.number().integer().min(1850).max(2021).required(),
        club: Joi.string().required(),
        xcoord: Joi.string().required(),
        ycoord: Joi.string().required(),
        imagefile: Joi.any().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: async function (request, h, error) {
        // Should an error occur, page is refreshed using original stadium details
        const stadiumId = request.params.id;
        const stadium = await Stadium.findById(stadiumId).lean();
        return h
          .view("edit-stadium", {
            stadium: stadium,
            title: "European Stadiums | Error editing stadium..",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId);
        const stadiumId = request.params.id;
        const data = request.payload;
        // Image uploaded to cloudinary using ImageStore
        const result = await ImageStore.uploadImage(data.imagefile);
        // Uploaded image URL saved
        const imageUrl = result.url;
        // Coordinates of stadium assigned to coords variable
        let coords = [Sanitizer.sanitizeContent(data.xcoord), Sanitizer.sanitizeContent(data.ycoord)];
        // Updating stadium using relevant details
        await Stadium.updateOne(
          { _id: stadiumId },
          {
            name: Sanitizer.sanitizeContent(data.name),
            country: Sanitizer.sanitizeContent(data.country),
            city: Sanitizer.sanitizeContent(data.city),
            capacity: Sanitizer.sanitizeContent(data.capacity),
            built: Sanitizer.sanitizeContent(data.built),
            club: Sanitizer.sanitizeContent(data.club),
            coords: coords,
            addedBy: user._id,
            imageUrl: imageUrl,
          }
        );
        return h.redirect("/home");
      } catch (err) {
        const stadiumId = request.params.id;
        const stadium = await Stadium.findById(stadiumId).lean();
        return h.view("edit-stadium", {
          title: "European Stadiums | Error editing stadium..",
          stadium: stadium,
          errors: [{ message: err.message }],
        });
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  addReview: {
    handler: async function (request, h) {
      try {
        const userId = request.auth.credentials.id;
        const stadiumId = request.params.id;
        const data = request.payload;
        let sanitizedRating = Sanitizer.sanitizeContent(data.rating);
        sanitizedRating = parseInt(sanitizedRating);
        const newReview = new Review({
          title: Sanitizer.sanitizeContent(data.title),
          review: Sanitizer.sanitizeContent(data.review),
          rating: sanitizedRating,
          stadium: stadiumId,
          reviewedBy: userId,
          date: Date.now(),
        });
        await newReview.save();
        return h.redirect("/home");
      } catch (err) {
        return h.view("add-stadium", {
          title: "European Stadiums | Error adding stadium..",
          errors: [{ message: err.message }],
        });
      }
    },
  },
};

module.exports = Stadiums;
