"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const utils = require("../app/api/utils.js");

suite("Authentication API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  setup(async function () {
    await stadiumsService.deleteAllUsers();
  });

  test("Authenticate", async function () {
    const returnedUser = await stadiumsService.createUser(newUser);
    const response = await stadiumsService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("Verify token", async function () {
    const returnedUser = await stadiumsService.createUser(newUser);
    const response = await stadiumsService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });
});
