const Users = require("./app/api/users");
const Stadiums = require("./app/api/stadiums");
const Reviews = require("./app/api/reviews");

module.exports = [
  /* User API routes */
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "GET", path: "/api/users", config: Users.findAll },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
  { method: "POST", path: "/api/users/{id}", config: Users.edit },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  /* Stadium API routes */
  { method: "GET", path: "/api/stadiums/{id}", config: Stadiums.findOne },
  { method: "GET", path: "/api/stadiums", config: Stadiums.findAll },
  { method: "POST", path: "/api/stadiums", config: Stadiums.add },
  { method: "POST", path: "/api/stadiums/{id}", config: Stadiums.edit },
  { method: "DELETE", path: "/api/stadiums/{id}", config: Stadiums.deleteOne },
  { method: "DELETE", path: "/api/stadiums", config: Stadiums.deleteAll },

  /* Reviews API routes */
  { method: "GET", path: "/api/reviews/{id}", config: Reviews.findByStadium },
  { method: "GET", path: "/api/reviews", config: Reviews.findAll },
  { method: "POST", path: "/api/reviews", config: Reviews.add },
  { method: "DELETE", path: "/api/reviews", config: Reviews.deleteAll },
];
