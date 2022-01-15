const express = require("express");
const router = express.Router();
const catchAsync = require("../utilities/CatchAsync");
const User = require("../models/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Cuts-N-Dye");
        const redirectUrl = req.session.returnTo || "/salons";
        delete req.session.returnTo;
        res.redirect(redirectUrl);
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    req.flash("success", `Welcome back, ${req.body.username}`);
    const returnTo = req.session.returnTo;
    if (returnTo.slice(returnTo.length - 7) === "reviews") {
      // fix bug that attempts to bring user to route for individual review (we have no such routes) after login following review attempt
      // bring user to salon show page where user attempted to create review prior to login
      req.session.returnTo = returnTo.slice(0, -7);
    }
    const redirectUrl = req.session.returnTo || "/salons";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.flash("success", "Successfully Logged Out");
  res.redirect("/salons");
});

module.exports = router;
