const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const Salon = require("../models/salon");
const Review = require("../models/review");
const { salonValidatorSchema } = require("../schemas");
const ExpressError = require("../utilities/ExpressError");

const validateSalon = (req, res, next) => {
  const { error } = salonValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/new", (req, res) => {
  res.render("salons/new");
});

router.get(
  "/",
  catchAsync(async (req, res) => {
    const salons = await Salon.find({});
    res.render("salons/index", { salons });
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

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id).populate("salonReviews");
    console.log(salon);
    res.render("salons/show", { salon });
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

router.get(
  "/:id/edit",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id);
    res.render("salons/edit", { salon });
  })
);

module.exports = router;
