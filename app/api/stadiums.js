"use strict";

const Stadium = require("../models/stadium");
const Boom = require("@hapi/boom");
const User = require("../models/user");
const env = require("dotenv");
env.config();

const Stadiums = {
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const stadium = await Stadium.findOne({ _id: request.params.id });
        if (!stadium) {
          return Boom.notFound("No stadium with this id");
        }
        return stadium;
      } catch (err) {
        return Boom.notFound("No stadium with this id");
      }
    },
  },

  findAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const stadiums = await Stadium.find();
      return stadiums;
    },
  },

  findByCountry: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const allStadiums = await Stadium.find();
      const country = request.params.country;
      let stadiums = [];
      for (let x = 0; x < allStadiums.length; x++) {
        if (allStadiums[x].country == country) {
          stadiums.push(allStadiums[x]);
        }
      }
      return stadiums;
    },
  },

  add: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const data = request.payload;
      const newStadium = new Stadium({
        name: data.name,
        country: data.country,
        city: data.city,
        capacity: data.capacity,
        built: data.built,
        club: data.club,
        coords: data.coords,
        imageUrl: data.imageUrl,
        addedBy: data.addedBy,
      });
      const stadium = await newStadium.save();
      if (stadium) {
        return h.response(stadium).code(201);
      }
      return Boom.badImplementation("Error adding stadium");
    },
  },

  edit: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const stadiumId = request.params.id;
      const data = request.payload;
      const stadium = await Stadium.updateOne(
        { _id: stadiumId },
        {
          name: data.name,
          country: data.country,
          city: data.city,
          capacity: data.capacity,
          built: data.built,
          club: data.club,
          coords: data.coords,
        }
      );
      if (stadium) {
        return h.response(stadium).code(201);
      }
      return Boom.badImplementation("Error editing stadium");
    },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const stadium = await Stadium.deleteOne({ _id: request.params.id });
      if (stadium) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await Stadium.deleteMany({});
      return { success: true };
    },
  },

  getMapsKey: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      let mapsKey = process.env.mapsKey;
      return mapsKey;
    },
  },
};

module.exports = Stadiums;
