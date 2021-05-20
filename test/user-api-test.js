"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const utils = require("../app/api/utils.js");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  suiteSetup(async function () {
    await stadiumsService.deleteAllUsers();
    const returnedUser = await stadiumsService.createUser(newUser);
    const response = await stadiumsService.authenticate(newUser);
  });

  suiteTeardown(async function () {
    await stadiumsService.deleteAllUsers();
    stadiumsService.clearAuth();
  });

  setup(async function () {
    await stadiumsService.deleteAllUsers();
  });

  teardown(async function () {
    await stadiumsService.deleteAllUsers();
  });

  test("Find one user", async function () {
    let response = await stadiumsService.createUser(newUser);
    let u1 = response.user;
    let u2 = await stadiumsService.findOneUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("Find all users", async function () {
    for (let u of users) {
      await stadiumsService.createUser(u);
    }
    const allUsers = await stadiumsService.findAllUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("Login a user", async function () {
    let response = await stadiumsService.createUser(newUser);
    let returnedUser = response.user;
    const authResponse = await stadiumsService.authenticate(returnedUser);
    assert(authResponse.success);
    assert.isDefined(authResponse.token);
  });

  test("Sign up a user", async function () {
    const response = await stadiumsService.createUser(newUser);
    let returnedUser = response.user;
    assert(returnedUser.firstName, newUser.firstName), "returnedUser firstName must match newUser firstName";
    assert(returnedUser.lastName, newUser.lastName), "returnedUser lastName must match newUser lastName";
    assert(returnedUser.email, newUser.email), "returnedUser email must match newUser email";
    assert(returnedUser.admin, newUser.admin), "returnedUser admin must match newUser admin";
    assert.isDefined(returnedUser._id);
  });

  test("Edit a user", async function () {
    let response = await stadiumsService.createUser(newUser);
    let returnedUser = response.user;
    assert(returnedUser._id != null);
    await stadiumsService.editUser(returnedUser._id, users[0]);
    let editedUser = await stadiumsService.findOneUser(returnedUser._id);
    assert(editedUser.firstName == users[0].firstName);
  });

  test("Delete a user", async function () {
    let response = await stadiumsService.createUser(newUser);
    let returnedUser = response.user;
    assert(returnedUser._id != null);
    await stadiumsService.deleteOneUser(returnedUser._id);
    returnedUser = await stadiumsService.findOneUser(returnedUser._id);
    assert(returnedUser == null);
  });
});
