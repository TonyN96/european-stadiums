"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const Sanitizer = require("../utils/sanitizer");

const Accounts = {
  // Method for displaying the inital index page
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", {
        title: "European Stadiums | Welcome",
      });
    },
  },

  // Method for displaying the signup page
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup", {
        title: "European Stadiums | Sign up",
      });
    },
  },

  // Method for signing up a new user
  signup: {
    validate: {
      payload: {
        //Joi validation for user details
        firstName: Joi.string()
          .required()
          .regex(/^[a-zA-Z][a-z]{2,}$/),
        lastName: Joi.string()
          .required()
          .regex(/^[a-zA-Z][a-zA-Z\s\']{2,}$/),
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .regex(/^[A-Za-z0-9]\w{8,}$/),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("signup", {
            title: "European Stadiums | Signup",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
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
        // Create new user with details entered
        const newUser = new User({
          firstName: Sanitizer.sanitizeContent(payload.firstName),
          lastName: Sanitizer.sanitizeContent(payload.lastName),
          email: Sanitizer.sanitizeContent(payload.email),
          password: Sanitizer.sanitizeContent(payload.password),
          admin: false,
        });
        user = await newUser.save();
        // Set the new user's id as the cookie
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("signup", {
          title: "European Stadiums | Signup",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for displaying the login page
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login", {
        title: "European Stadiums | Login",
      });
    },
  },

  // Method for logging in a user
  login: {
    auth: false,
    handler: async function (request, h) {
      // Get the email and password entered
      const email = Sanitizer.sanitizeContent(request.payload.email);
      const password = Sanitizer.sanitizeContent(request.payload.password);
      try {
        let user = await User.findByEmail(email);
        // If the email entered is not registered, inform the user of this with a Boom message
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        // Ensure the password entered matches the password in the db
        user.comparePassword(password);
        // Set the user's id as the cookie
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("login", {
          title: "European Stadiums | Login",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for logging a user out
  logout: {
    auth: false,
    handler: function (request, h) {
      // Clears the cookie
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  // Method for displaying the settings page
  showSettings: {
    handler: async function (request, h) {
      try {
        // Find the current user by the cookie and pass into the settings view
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();
        const username = user.firstName + " " + user.lastName;
        return h.view("settings", {
          title: "European Stadiums | Settings",
          username: username,
          user: user,
        });
      } catch (err) {
        return h.view("login", {
          title: "European Stadiums | Login",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for updating a users details
  updateSettings: {
    validate: {
      payload: {
        // Joi validation for new user details entered
        firstName: Joi.string()
          .required()
          .regex(/^[a-zA-Z][a-z]{2,}$/),
        lastName: Joi.string()
          .required()
          .regex(/^[a-zA-Z][a-zA-Z\s\']{2,}$/),
        email: Joi.string().email().required(),
        password: Joi.string()
          .required()
          .regex(/^[A-Za-z0-9]\w{8,}$/),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("settings", {
            title: "European Stadiums | Login",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function (request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        // Update the currents users details with the new details entered
        user.firstName = Sanitizer.sanitizeContent(userEdit.firstName);
        user.lastName = Sanitizer.sanitizeContent(userEdit.lastName);
        user.email = Sanitizer.sanitizeContent(userEdit.email);
        user.password = Sanitizer.sanitizeContent(userEdit.password);
        await user.save();
        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", {
          title: "European Stadiums | Welcome",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for deleting a user account
  deleteAccount: {
    handler: async function (request, h) {
      try {
        // Get the id of the user to be deleted
        const id = request.params.id;
        const user = await User.findById(id);
        // Get the id of the current user
        const currentUserId = request.auth.credentials.id;
        const currentUser = await User.findById(currentUserId);
        await user.remove();
        // If it is not a user deleting their own account (i.e. an admin), redirect to admin dashboard
        if (currentUser.admin && currentUserId != id) {
          return h.redirect("/admin-dashboard");
        } else {
          // Otherwise, redirect to index page
          return h.redirect("/");
        }
      } catch (err) {
        return h.view("main", {
          title: "European Stadiums | Welcome",
          errors: [{ message: err.message }],
        });
      }
    },
  },

  // Method for displaying the admin dashboard
  adminDashboard: {
    handler: async function (request, h) {
      try {
        // Get all users registered to the app and pass into view
        const users = await User.find().lean();
        const userId = request.auth.credentials.id;
        const user = await User.findById(userId);
        const username = user.firstName + " " + user.lastName;
        return h.view("admin-dashboard", {
          title: "European Stadiums | Admin Dashboard",
          username: username,
          users: users,
        });
      } catch (err) {
        return h.redirect("/home", {
          errors: [{ message: err.message }],
        });
      }
    },
  },
};

module.exports = Accounts;
