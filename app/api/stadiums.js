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
        const stadium = await stadium.findOne({ _id: request.params.id });
        if (!stadium) {
          return Boom.notFound("No stadium with this id");
        }
        return stadium;
      } catch (err) {
        return Boom.notFound("No stadium with this id");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const newstadium = new stadium(request.payload);
      const stadium = await newstadium.save();
      if (stadium) {
        return h.response(stadium).code(201);
      }
      return Boom.badImplementation("error creating stadium");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await stadium.remove({});
      return { success: true };
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const stadium = await stadium.remove({ _id: request.params.id });
      if (stadium) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },
};

module.exports = Stadiums;
