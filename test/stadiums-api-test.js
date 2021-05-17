"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("Stadium API tests", function () {
  let stadiums = fixtures.stadiums;
  let newStadium = fixtures.newStadium;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  setup(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  teardown(async function () {
    await stadiumsService.deleteAllStadiums();
  });

  test("Find one stadium", async function () {
    const stadium1 = await stadiumsService.addStadium(newStadium);
    assert(stadium1._id != null);
    const stadium2 = await stadiumsService.findOneStadium(stadium1._id);
    assert.deepEqual(stadium1, stadium2);
  });

  test("Find all stadiums", async function () {
    for (let x of stadiums) {
      await stadiumsService.addStadium(x);
    }
    const allStadiums = await stadiumsService.findAllStadiums();
    assert.equal(allStadiums.length, stadiums.length);
  });

  test("Find stadium by country", async function () {});

  test("Add a stadium", async function () {
    await stadiumsService.addStadium(newStadium);
    const returnedStadiums = await stadiumsService.findAllStadiums();
    assert.equal(returnedStadiums.length, 1);
    assert(_.some([returnedStadiums[0]], newStadium), "returnedStadium[0] must be a superset of stadium[0]");
  });

  test("Edit a stadium", async function () {
    let stadium = await stadiumsService.addStadium(newStadium);
    assert(stadium._id != null);
    await stadiumsService.editStadium(stadium._id, stadiums[0]);
    let editedStadium = await stadiumsService.findOneStadium(stadium._id);
    assert(editedStadium.name == stadiums[0].name);
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
});
