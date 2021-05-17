"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const stadiumsService = new StadiumsService(fixtures.stadiumsApp);

  setup(async function () {
    await stadiumsService.deleteAllUsers();
  });

  teardown(async function () {
    await stadiumsService.deleteAllUsers();
  });

  test("Find one user", async function () {
    const u1 = await stadiumsService.signupUser(newUser);
    const u2 = await stadiumsService.findOneUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("Find all users", async function () {
    for (let u of users) {
      await stadiumsService.signupUser(u);
    }
    const allUsers = await stadiumsService.findAllUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("Sign up a user", async function () {
    const returnedUser = await stadiumsService.signupUser(newUser);
    assert(returnedUser.firstName, newUser.firstName), "returnedUser firstName must match newUser firstName";
    assert(returnedUser.lastName, newUser.lastName), "returnedUser lastName must match newUser lastName";
    assert(returnedUser.email, newUser.email), "returnedUser email must match newUser email";
    assert.isDefined(returnedUser._id);
  });

  test("Login a user", async function () {
    let user = await stadiumsService.signupUser(newUser);
    assert(user._id != null);
    const returnedUser = await stadiumsService.loginUser(user.email, user.password);
    assert.isDefined(returnedUser);
  });

  test("Edit a user", async function () {
    let user1 = await stadiumsService.signupUser(newUser);
    assert(user1._id != null);
    await stadiumsService.editUser(user1._id, users[0]);
    let editedUser = await stadiumsService.findOneUser(user1._id);
    assert(editedUser.firstName == users[0].firstName);
  });

  test("Delete a user", async function () {
    let u = await stadiumsService.signupUser(newUser);
    assert(u._id != null);
    await stadiumsService.deleteOneUser(u._id);
    u = await stadiumsService.findOneUser(u._id);
    assert(u == null);
  });

  test("Delete all users", async function () {});
});
