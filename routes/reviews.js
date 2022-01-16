const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const Salon = require("../models/salon");
const Review = require("../models/review");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(async (req, res) => {
    const salon = await Salon.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    salon.salonReviews.push(review);
    await review.save();
    await salon.save();
    req.flash("success", "Successfully added salon review!");
    res.redirect(`/salons/${salon._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const salon = await Salon.findByIdAndUpdate(id, {
      $pull: { salonReviews: reviewId },
    });
    const review = await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted salon review!");
    res.redirect(`/salons/${id}`);
  })
);

module.exports = router;
