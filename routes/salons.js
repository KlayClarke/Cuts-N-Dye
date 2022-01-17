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

router
  .route("/")
  .get(logUrl, catchAsync(salons.index))
  .post(logUrl, isLoggedIn, validateSalon, catchAsync(salons.createNewSalon));

router.get("/new", isLoggedIn, salons.salonCreationForm);

router
  .route("/:id")
  .get(logUrl, catchAsync(salons.getSalon))
  .put(
    logUrl,
    isLoggedIn,
    isSalonAuthor,
    validateSalon,
    catchAsync(salons.editSalon)
  )
  .delete(logUrl, isLoggedIn, isSalonAuthor, catchAsync(salons.deleteSalon));

router.get(
  "/:id/edit",
  logUrl,
  isLoggedIn,
  isSalonAuthor,
  catchAsync(salons.salonEditForm)
);

module.exports = router;
