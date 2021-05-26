"use strict";

const assert = require("chai").assert;
const StadiumsService = require("./stadiums-service");
const fixtures = require("./fixtures.json");

suite("Review API tests", function () {
    let stadiums = fixtures.stadiums;
    let reviews = fixtures.reviews;
    let newReview = fixtures.newReview;
    let newUser = fixtures.newUser;
  
    const stadiumsService = new StadiumsService(fixtures.stadiumsApp);
  
    suiteSetup(async function () {
      await stadiumsService.deleteAllUsers();
      await stadiumsService.createUser(newUser);
      await stadiumsService.authenticate(newUser);
    });
  
    suiteTeardown(async function () {
      await stadiumsService.deleteAllUsers();
      await stadiumsService.clearAuth();
    });
  
    setup(async function () {
      await stadiumsService.deleteAllReviews();
    });
  
    teardown(async function () {
      await stadiumsService.deleteAllReviews();
    });

    test("Find reviews by stadium", async function() {
      let user = await stadiumsService.createUser(newUser);
      newReview.reviewedBy = user;
      let stadium = await stadiumsService.addStadium(stadiums[0]);
      newReview.stadium = stadium;
      let review = await stadiumsService.addReview(newReview);
      assert.isDefined(review._id);
      const returnedReviews = await stadiumsService.findReviewsByStadium(stadium._id);
      assert(returnedReviews.length != 0);
    })

    test("Find all reviews", async function() {
      for (let x of reviews) {
        await stadiumsService.addReview(x);
      }
      const allReviews = await stadiumsService.findAllReviews();
      assert.equal(allReviews.length, reviews.length);
    });

    test("Add a review", async function() {
      let user = await stadiumsService.createUser(newUser);
      newReview.reviewedBy = user;
      let stadium = await stadiumsService.addStadium(stadiums[0]);
      newReview.stadium = stadium;
      let review = await stadiumsService.addReview(newReview);
      assert.isDefined(review._id);
    })

    test("Delete all reviews", async function() {
      for (var i = 0; i < reviews.length; i++) {
        await stadiumsService.addReview(reviews[i]);
      }
        const d1 = await stadiumsService.findAllReviews();
        assert.equal(d1.length, stadiums.length);
        await stadiumsService.deleteAllReviews();
        const d2 = await stadiumsService.findAllReviews();
        assert.equal(d2.length, 0);
      })
});