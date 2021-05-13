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

  test("create a user", async function () {
    const returnedUser = await stadiumsService.createUser(newUser);
    assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser");
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function () {
    const u1 = await stadiumsService.createUser(newUser);
    const u2 = await stadiumsService.getUser(u1._id);
    assert.deepEqual(u1, u2);
  });

  test("get invalid user", async function () {
    const u1 = await stadiumsService.getUser("1234");
    assert.isNull(u1);
    const u2 = await stadiumsService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  test("delete a user", async function () {
    let u = await stadiumsService.createUser(newUser);
    assert(u._id != null);
    await stadiumsService.deleteOneUser(u._id);
    u = await stadiumsService.getUser(u._id);
    assert(u == null);
  });

  test("get all users", async function () {
    for (let u of users) {
      await stadiumsService.createUser(u);
    }

    const allUsers = await stadiumsService.getUsers();
    assert.equal(allUsers.length, users.length);
  });

  test("get users detail", async function () {
    for (let u of users) {
      await stadiumsService.createUser(u);
    }

    const allUsers = await stadiumsService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }
  });

  test("get all users empty", async function () {
    const allUsers = await stadiumsService.getUsers();
    assert.equal(allUsers.length, 0);
  });
});
