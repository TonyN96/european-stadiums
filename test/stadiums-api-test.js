"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const env = require("dotenv");
env.config();

suite("Stadium API tests", function () {
  let stadiums = fixtures.stadiums;
  let newStadium = fixtures.newStadium;
  let newUser = fixtures.newUser;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  suiteSetup(async function () {
    await stadiumsService.deleteAllUsers();
    const returnedUser = await stadiumsService.createUser(newUser);
    const response = await stadiumsService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await stadiumsService.deleteAllUsers();
    await stadiumsService.clearAuth();
  });

  setup(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  teardown(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  test("Find one stadium", async function () {
    let user = await stadiumsService.createUser(newUser);
    newStadium.addedBy = user;
    let stadium1 = await stadiumsService.addStadium(newStadium);
    assert(stadium1 != null);
    const oneStadium = await stadiumsService.findOneStadium(stadium1._id);
    assert.deepEqual(stadium1, oneStadium);
  });

  test("Find all stadiums", async function () {
    for (let x of stadiums) {
      await stadiumsService.addStadium(x);
    }
    const allStadiums = await stadiumsService.findAllStadiums();
    assert.equal(allStadiums.length, stadiums.length);
  });

  test("Find stadium by country", async function () {
    let user = await stadiumsService.createUser(newUser);
    newStadium.addedBy = user;
    let stadium = await stadiumsService.addStadium(newStadium);
    let country = stadium.country;
    let stadiums = await stadiumsService.findStadiumByCountry(country);
    assert.equal(stadium.country, stadiums[0].country);
  });

  test("Add a stadium", async function () {
    let user = await stadiumsService.createUser(newUser);
    newStadium.addedBy = user;
    let stadium = await stadiumsService.addStadium(newStadium);
    assert(stadium != null);
    const oneStadium = await stadiumsService.findOneStadium(stadium._id);
    assert(oneStadium._id != null);
    assert(_.some([oneStadium], stadium), "returnedStadium must be a superset of stadium[0]");
  });

  test("Edit a stadium", async function () {
    let user = await stadiumsService.createUser(newUser);
    newStadium.addedBy = user;
    let stadium = await stadiumsService.addStadium(newStadium);
    assert(stadium._id != null);
    await stadiumsService.editStadium(stadium._id, stadiums[0]);
    let editedStadium = await stadiumsService.findOneStadium(stadium._id);
    assert.equal(editedStadium.name, stadiums[0].name);
    assert.equal(editedStadium._id, stadium._id);
  });

  test("Delete one stadium", async function () {
    let stadium = await stadiumsService.addStadium(stadiums[0]);
    assert(stadium._id != null);
    await stadiumsService.deleteOneStadium(stadium._id);
    stadium = await stadiumsService.findOneStadium(stadium._id);
    assert(stadium == null);
  });

  test("Delete all stadiums", async function () {
    for (var i = 0; i < stadiums.length; i++) {
      await stadiumsService.addStadium(stadiums[i]);
    }
    const d1 = await stadiumsService.findAllStadiums();
    assert.equal(d1.length, stadiums.length);
    await stadiumsService.deleteAllStadiums();
    const d2 = await stadiumsService.findAllStadiums();
    assert.equal(d2.length, 0);
  });

  test("Get mapsKey", async function () {
    let mapsKey = await stadiumsService.getMapsKey();
    assert.isDefined(mapsKey);
  });
});
