const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const Salon = require("../models/salon");
const Review = require("../models/review");
const { reviewValidatorSchema } = require("../schemas");
const ExpressError = require("../utilities/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const salon = await Salon.findById(req.params.id);
    const review = new Review(req.body.review);
    salon.salonReviews.push(review);
    await review.save();
    await salon.save();
    req.flash("success", "Successfully added salon review!");
    res.redirect(`/salons/${salon._id}`);
  })
);

router.delete(
  "/:reviewId",
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
