const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const users = require("../controllers/users");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router
  .route("/register")
  .get(users.userRegistrationForm)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.userLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
