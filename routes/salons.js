const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const Salon = require("../models/salon");
const Review = require("../models/review");
const { salonValidatorSchema } = require("../schemas");
const ExpressError = require("../utilities/ExpressError");
const { isLoggedIn, isAuthor } = require("../middleware");

const validateSalon = (req, res, next) => {
  const { error } = salonValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get("/new", isLoggedIn, (req, res) => {
  res.render("salons/new");
});

router.get(
  "/",
  catchAsync(async (req, res) => {
    const salons = await Salon.find({}).populate("salonAuthor");
    res.render("salons/index", { salons });
  })
);

router.post(
  "/",
  isLoggedIn,
  validateSalon,
  catchAsync(async (req, res, next) => {
    const salon = new Salon(req.body.salon);
    salon.salonAuthor = req.user._id;
    await salon.save();
    req.flash("success", "Successfully added new salon!");
    res.redirect(`/salons/${salon._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id)
      .populate("salonReviews")
      .populate("salonAuthor");
    if (!salon) {
      req.flash("error", "Salon not found");
      res.redirect("/salons/index");
    } else {
      res.render("salons/show", { salon });
    }
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const salon = await Salon.findById(id);
    if (!salon) {
      req.flash("error", "Salon not found");
      return res.redirect("/salons/index");
    }
    res.render("salons/edit", { salon });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateSalon,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const salon = await Salon.findById(id);
    const salonToUpdate = await Salon.findByIdAndUpdate(id, {
      ...req.body.salon,
    });
    req.flash("success", "Successfully edited salon info!");
    res.redirect(`/salons/${salonToUpdate._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const salon = await Salon.findById(id);
    if (!salon) {
      req.flash("error", "Salon not found");
      return res.redirect("/salons/index");
    }
    await Salon.findByIdAndDelete(id);
    req.flash("success", "Successfully delete salon!");
    res.redirect("/salons/index");
  })
);

module.exports = router;
