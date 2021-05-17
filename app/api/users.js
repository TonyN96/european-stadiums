"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

  login: {
    auth: false,
    handler: async function (request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        // If the email entered is not registered, inform the user of this with a Boom message
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        // Ensure the password entered matches the password in the db
        user.comparePassword(password);
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
          admin: false,
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        if (user) {
          return h.response(user).code(201);
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
