const Users = require("./app/api/users");
const Stadiums = require("./app/api/stadiums");
const Reviews = require("./app/api/reviews");

module.exports = [
  /* User API routes */
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "GET", path: "/api/users", config: Users.findAll },
  { method: "GET", path: "/api/users/name/{id}", config: Users.findNameById },
  { method: "POST", path: "/api/users", config: Users.create },
  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
  { method: "POST", path: "/api/users/{id}", config: Users.edit },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  /* Stadium API routes */
  { method: "GET", path: "/api/stadiums/{id}", config: Stadiums.findOne },
  { method: "GET", path: "/api/stadiums", config: Stadiums.findAll },
  { method: "GET", path: "/api/stadiums/country/{country}", config: Stadiums.findByCountry },
  { method: "GET", path: "/api/stadiums/rating/{id}", config: Stadiums.getStadiumRating },
  { method: "GET", path: "/api/stadiums/mapsKey", config: Stadiums.getMapsKey },
  { method: "POST", path: "/api/stadiums", config: Stadiums.add },
  { method: "POST", path: "/api/stadiums/{id}", config: Stadiums.edit },
  { method: "DELETE", path: "/api/stadiums/{id}", config: Stadiums.deleteOne },
  { method: "DELETE", path: "/api/stadiums", config: Stadiums.deleteAll },

  /* Reviews API routes */
  { method: "GET", path: "/api/reviews", config: Reviews.findAll },
  { method: "GET", path: "/api/reviews/{id}", config: Reviews.findByStadium },
  { method: "POST", path: "/api/reviews", config: Reviews.addReview },
  { method: "DELETE", path: "/api/reviews", config: Reviews.deleteAll },
];
