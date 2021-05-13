const Users = require("./app/api/users");
const Stadiums = require("./app/api/stadiums");

module.exports = [
  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "POST", path: "/api/users", config: Users.add },
  { method: "POST", path: "/api/users/{id}", config: Users.edit },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  { method: "GET", path: "/api/stadiums", config: Stadiums.find },
  { method: "GET", path: "/api/stadiums/{id}", config: Stadiums.findOne },
  { method: "POST", path: "/api/stadiums", config: Stadiums.add },
  { method: "POST", path: "/api/stadiums/{id}", config: Stadiums.edit },
  { method: "DELETE", path: "/api/stadiums/{id}", config: Stadiums.deleteOne },
  { method: "DELETE", path: "/api/stadiums", config: Stadiums.deleteAll },
];
