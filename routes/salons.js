const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const Salon = require("../models/salon");
const Review = require("../models/review");
const { salonValidatorSchema, reviewValidatorSchema } = require("../schemas");

const validateSalon = (req, res, next) => {
  const { error } = salonValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const salons = await Salon.find({});
    res.render("salons/index", { salons });
  })
);

router.get("/new", (req, res) => {
  res.render("salons/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id).populate("salonReviews");
    console.log(salon);
    res.render("salons/show", { salon });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id);
    res.render("salons/edit", { salon });
  })
);

router.post(
  "/",
  validateSalon,
  catchAsync(async (req, res, next) => {
    const salon = new Salon(req.body.salon);
    await salon.save();
    res.redirect(`/salons/${salon._id}`);
  })
);

router.post(
  "/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const salon = await Salon.findById(req.params.id);
    const review = new Review(req.body.review);
    salon.salonReviews.push(review);
    await review.save();
    await salon.save();
    res.redirect(`/salons/${salon._id}`);
  })
);

router.put(
  "/:id",
  validateSalon,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const salon = await Salon.findByIdAndUpdate(id, { ...req.body.salon });
    res.redirect(`/salons/${salon._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Salon.findByIdAndDelete(id);
    res.redirect("/salons");
  })
);

router.delete(
  "/:id/reviews/:reviewId",
  catchAsync(async (req, res, next) => {
    const { id, reviewId } = req.params;
    const salon = await Salon.findByIdAndUpdate(id, {
      $pull: { salonReviews: reviewId },
    });
    const review = await Review.findByIdAndDelete(reviewId);
    res.redirect(`/salons/${id}`);
  })
);

module.exports = router;
