const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const users = require("../controllers/users");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router.get("/register", users.userRegistrationForm);

router.post("/register", catchAsync(users.registerUser));

router.get("/login", users.userLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginUser
);

router.get("/logout", isLoggedIn, users.logoutUser);

module.exports = router;
