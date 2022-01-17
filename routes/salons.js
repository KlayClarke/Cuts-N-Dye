const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utilities/CatchAsync");
const salons = require("../controllers/salons");
const {
  isLoggedIn,
  isSalonAuthor,
  validateSalon,
  logUrl,
} = require("../middleware");

router.get("/", logUrl, catchAsync(salons.index));

router.get("/new", isLoggedIn, salons.salonCreationForm);

router.post(
  "/",
  logUrl,
  isLoggedIn,
  validateSalon,
  catchAsync(salons.createNewSalon)
);

router.get("/:id", logUrl, catchAsync(salons.getSalon));

router.get(
  "/:id/edit",
  logUrl,
  isLoggedIn,
  isSalonAuthor,
  catchAsync(salons.salonEditForm)
);

router.put(
  "/:id",
  logUrl,
  isLoggedIn,
  isSalonAuthor,
  validateSalon,
  catchAsync(salons.editSalon)
);

router.delete(
  "/:id",
  logUrl,
  isLoggedIn,
  isSalonAuthor,
  catchAsync(salons.deleteSalon)
);

module.exports = router;
