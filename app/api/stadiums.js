"use strict";

const Stadium = require("../models/stadium");
const Boom = require("@hapi/boom");

const Stadiums = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const stadiums = await Stadium.find();
      return stadiums;
    },
  },

  findOne: {
    auth: false,
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

  add: {
    auth: false,
    handler: async function (request, h) {
      const newStadium = new Stadium(request.payload);
      const stadium = await newStadium.save();
      if (stadium) {
        return h.response(stadium).code(201);
      }
      return Boom.badImplementation("Error adding stadium");
    },
  },

  edit: {
    auth: false,
    handler: async function (request, h) {
      const stadiumId = request.params.id;
      const data = request.payload;
      const coords = [data.xcoord, data.ycoord];
      const stadium = await Stadium.updateOne(
        { _id: stadiumId },
        {
          name: data.name,
          country: data.country,
          city: data.city,
          capacity: data.capacity,
          built: data.built,
          club: data.club,
          coords: coords,
        }
      );
      if (stadium) {
        return h.response(stadium).code(201);
      }
      return Boom.badImplementation("Error editing stadium");
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const stadium = await Stadium.deleteOne({ _id: request.params.id });
      if (stadium) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await Stadium.deleteMany({});
      return { success: true };
    },
  },

  getLocation: {
    auth: false,
    handler: async function (request, h) {
      const stadium = await Stadium.findOne({ _id: request.params.id });
      return stadium.coords;
    },
  },
};

module.exports = Stadiums;
