"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const utils = require("./utils.js");

const Users = {
  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    },
  },

  findAll: {
    auth: false,
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },

  findNameById: {
    auth: false,
    handler: async function (request, h) {
      const user = await User.findById(request.params.id);
      let userFullName = user.firstName + " " + user.lastName;
      return userFullName;
    },
  },

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (user.comparePassword(request.payload.password) == null) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        const hash = await bcrypt.hash(payload.password, saltRounds);
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          admin: payload.admin,
        });
        const savedUser = await newUser.save();
        if (savedUser) {
          return h.response(savedUser).code(201);
        }
        return Boom.badImplementation("Error creating user");
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  edit: {
    auth: false,
    handler: async function (request, h) {
      try {
        const userId = request.params.id;
        const data = request.payload;
        const hash = await bcrypt.hash(data.password, saltRounds);
        const user = await User.findById(userId);
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.password = hash;
        user.admin = data.admin;
        const result = await user.save();
        if (result) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("Error editing user");
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const user = await User.deleteOne({ _id: request.params.id });
      if (user) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await User.deleteMany({});
      return { success: true };
    },
  },
};

module.exports = Users;
