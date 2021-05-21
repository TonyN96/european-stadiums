"use strict";

const Joi = require("@hapi/joi");
const Stadium = require("../models/stadium");
const User = require("../models/user");
const Review = require("../models/review");
const ImageStore = require("../utils/image-store");
const Sanitizer = require("../utils/sanitizer");
const env = require("dotenv");
const { updateOne } = require("../models/stadium");
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
        // Google Maps API key for displaying the stadium map lightbox
        const mapsKey = process.env.mapsKey;
        const stadiumsCount = stadiums.length;
        const usersCount = users.length;
        // Arrays for categorising each stadiums based on country
        let spainStadiums = [];
        let germanyStadiums = [];
        let italyStadiums = [];
        let englandStadiums = [];
        let franceStadiums = [];
        // Array which puts stadium in respective array based on country
        for (let x = 0; x < stadiums.length; x++) {
          stadiums[x].reviews = await Review.find({ stadium: stadiums[x]._id })
            .populate("stadium")
            .populate("reviewedBy")
            .lean();
          let totalRatings = 0;
          for (let z = 0; z < stadiums[x].reviews.length; z++) {
            totalRatings += stadiums[x].reviews[z].rating;
            let reviewDate = new Date(stadiums[x].reviews[z].date);
            let reviewDateStr =
              ("0" + reviewDate.getDate()).slice(-2) +
              "-" +
              ("0" + (reviewDate.getMonth() + 1)).slice(-2) +
              "-" +
              reviewDate.getFullYear();
            stadiums[x].reviews[z].date = reviewDateStr;
          }
          if (totalRatings != 0) {
            let newRating = totalRatings / stadiums[x].reviews.length;
            stadiums[x].rating = newRating.toFixed(2);
          } else {
            stadiums[x].rating = null;
          }
          if (stadiums[x].country == "England") {
            englandStadiums.push(stadiums[x]);
          } else if (stadiums[x].country == "France") {
            franceStadiums.push(stadiums[x]);
          } else if (stadiums[x].country == "Germany") {
            germanyStadiums.push(stadiums[x]);
          } else if (stadiums[x].country == "Italy") {
            italyStadiums.push(stadiums[x]);
          } else if (stadiums[x].country == "Spain") {
            spainStadiums.push(stadiums[x]);
          }
        }
        // Rendering home page with the object containing required view data
        return h.view("home", {
          title: "European Stadiums | Home",
          mapsKey: mapsKey,
          usersCount: usersCount,
          stadiumsCount: stadiumsCount,
          spainStadiums: spainStadiums,
          germanyStadiums: germanyStadiums,
          italyStadiums: italyStadiums,
          englandStadiums: englandStadiums,
          franceStadiums: franceStadiums,
        });
      } catch (err) {
        return h.view("home", { errors: [{ message: err }] });
      }
    },
  },

  // Method for displaying the add stadium view
  addStadiumView: {
    handler: function (request, h) {
      return h.view("add-stadium", { title: "European Stadiums | Add Stadium" });
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
      // The relevant stadium is passed into the view
      const stadium = await Stadium.findById(stadiumId).lean();
      return h.view("edit-stadium", {
        title: "European Stadiums | Edit Stadium",
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
        await Stadium.updateOne({ _id: stadiumId }, { $push: { rating: sanitizedRating } });
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
