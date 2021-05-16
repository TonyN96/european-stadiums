"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const Users = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const users = await User.find();
      return users;
    },
  },

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

  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        // If the email entered is not registered, inform the user of this with a Boom message
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        // Ensure the password entered matches the password in the db
        user.comparePassword(request.payload.password);
        // Set the user's id as the cookie
        request.cookieAuth.set({ id: user.id });
        return user;
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  signup: {
    auth: false,
    handler: async function (request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        // If a user exists with email enter, inform the user of this with a Boom message
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }
        // Hashing password using bcrypt module
        const hash = await bcrypt.hash(payload.password, saltRounds);
        // Create new user with details entered
        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: hash,
          admin: false,
        });
        user = await newUser.save();
        // Set the new user's id as the cookie
        request.cookieAuth.set({ id: user.id });
        return user;
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  add: {
    auth: false,
    handler: async function (request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating user");
    },
  },

  edit: {
    auth: false,
    handler: async function (request, h) {
      const userId = request.params.id;
      const data = request.payload;
      const user = await User.updateOne(
        { _id: userId },
        {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          admin: data.admin,
        }
      );
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("Error editing user");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await User.deleteMany({});
      return { success: true };
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
};

module.exports = Users;
