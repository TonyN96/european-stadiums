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

  test("add a stadium", async function () {
    await stadiumsService.addStadium(stadiums[0]);
    const returnedStadiums = await stadiumsService.getStadiums();
    assert.equal(returnedStadiums.length, 1);
    assert(_.some([returnedStadiums[0]], stadiums[0]), "returned stadium must be a superset of stadium");
  });

  test("add multiple stadiums", async function () {
    for (var i = 0; i < stadiums.length; i++) {
      await stadiumsService.addStadium(stadiums[i]);
    }
    const returnedStadiums = await stadiumsService.getStadiums();
    assert.equal(returnedStadiums.length, stadiums.length);
    for (var i = 0; i < stadiums.length; i++) {
      assert(_.some([returnedStadiums[i]], stadiums[i]), "returned stadium must be a superset of stadium");
    }
  });

  test("delete all stadiums", async function () {
    for (var i = 0; i < stadiums.length; i++) {
      await stadiumsService.addStadium(stadiums[i]);
    }
    const d1 = await stadiumsService.getStadiums();
    assert.equal(d1.length, stadiums.length);
    await stadiumsService.deleteAllStadiums();
    const d2 = await stadiumsService.getStadiums();
    assert.equal(d2.length, 0);
  });
});
