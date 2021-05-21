"use strict";

const env = require("dotenv");
env.config();

const Mongoose = require("mongoose");

Mongoose.set("useNewUrlParser", true);
Mongoose.set("useUnifiedTopology", true);

// Connecting to database using URL from db environment variable
Mongoose.connect(process.env.db);
const db = Mongoose.connection;

// Seeding the database using mais-mongoose-seeder module
async function seed() {
  var seeder = require("mais-mongoose-seeder")(Mongoose);
  const data = require("./seed-data.json");
  const Stadium = require("./stadium");
  const User = require("./user");
  const Review = require("./review");
  const dbData = await seeder.seed(data, { dropDatabase: false, dropCollections: true });
}

db.on("error", function (err) {
  console.log(`database connection error: ${err}`);
});

db.on("disconnected", function () {
  console.log("database disconnected");
});

db.once("open", function () {
  console.log(`database connected to ${this.name} on ${this.host}`);
  seed();
});
