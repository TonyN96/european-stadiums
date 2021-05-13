"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Stadium API tests", function () {
  let stadiums = fixtures.stadiums;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  setup(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  teardown(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  test("Get a stadium", async function () {
    const stadium1 = await stadiumsService.addStadium(stadiums[0]);
    const stadium2 = await stadiumsService.getStadium(stadium1._id);
    assert.deepEqual(stadium1, stadium2);
  });

  test("Get all stadiums", async function () {
    for (let x of stadiums) {
      await stadiumsService.addStadium(x);
    }
    const allStadiums = await stadiumsService.getAllStadiums();
    assert.equal(allStadiums.length, stadiums.length);
  });

  test("Add a stadium", async function () {
    await stadiumsService.addStadium(stadiums[0]);
    const returnedStadiums = await stadiumsService.getAllStadiums();
    assert.equal(returnedStadiums.length, 1);
    assert(_.some([returnedStadiums[0]], stadiums[0]), "returnedStadium[0] must be a superset of stadium[0]");
  });

  test("Add multiple stadiums", async function () {
    for (var i = 0; i < stadiums.length; i++) {
      await stadiumsService.addStadium(stadiums[i]);
    }
    const returnedStadiums = await stadiumsService.getAllStadiums();
    assert.equal(returnedStadiums.length, stadiums.length);
    for (var i = 0; i < stadiums.length; i++) {
      assert(_.some([returnedStadiums[i]], stadiums[i]), "returnedStadium[i] must be a superset of stadium[i]");
    }
  });

  test("Edit a stadium", async function () {
    let stadium = await stadiumsService.addStadium(stadiums[0]);
    assert(stadium._id != null);
    await stadiumsService.editStadium(stadium._id, stadiums[1]);
    let editedStadium = await stadiumsService.getStadium(stadium._id);
    assert(editedStadium.name == stadiums[1].name);
  });

  test("Delete one stadium", async function () {
    let stadium = await stadiumsService.addStadium(stadiums[0]);
    assert(stadium._id != null);
    await stadiumsService.deleteOneStadium(stadium._id);
    stadium = await stadiumsService.getStadium(stadium._id);
    assert(stadium == null);
  });

  test("Delete all stadiums", async function () {
    for (var i = 0; i < stadiums.length; i++) {
      await stadiumsService.addStadium(stadiums[i]);
    }
    const d1 = await stadiumsService.getAllStadiums();
    assert.equal(d1.length, stadiums.length);
    await stadiumsService.deleteAllStadiums();
    const d2 = await stadiumsService.getAllStadiums();
    assert.equal(d2.length, 0);
  });
});
