const Stadiums = require("./app/api/stadiums");

module.exports = [
  { method: "GET", path: "/api/stadiums", config: Stadiums.find },
  { method: "GET", path: "/api/stadiums/{id}", config: Stadiums.findOne },
  { method: "POST", path: "/api/stadiums", config: Stadiums.create },
  { method: "DELETE", path: "/api/stadiums/{id}", config: Stadiums.deleteOne },
  { method: "DELETE", path: "/api/stadiums", config: Stadiums.deleteAll },
];
