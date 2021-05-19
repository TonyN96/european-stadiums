"use strict";

const User = require("../models/user");
const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
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
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        // If the email entered is not registered, inform the user of this with a Boom message
        if (!user) {
          throw Boom.unauthorized("Email address is not registered");
        }
        // Ensure the password entered matches the password in the db
        let passwordResult = await user.comparePassword(password);
        if (!passwordResult) {
          throw Boom.unauthorized("Password mismatch");
        }
        // Set the user's id as the cookie
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/home");
      } catch (err) {
        return h.view("login", {
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
        return h.view("settings", {
          title: "European Stadiums | Settings",
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
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
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
        // Hashing password using bcrypt module
        const hash = await bcrypt.hash(payload.password, saltRounds);
        // Update the currents users details with the new details entered
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = hash;
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
        return h.view("admin-dashboard", {
          title: "European Stadiums | Admin Dashboard",
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
