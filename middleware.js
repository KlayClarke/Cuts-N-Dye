const Salon = require("./models/salon");
const Review = require("./models/review");
const ExpressError = require("./utilities/ExpressError");
const { salonValidatorSchema, reviewValidatorSchema } = require("./schemas");

module.exports.logUrl = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  next();
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    const redirectUrl = req.session.returnTo;
    if (
      req.session.returnTo &&
      redirectUrl.slice(redirectUrl.length - 4) === "edit"
    ) {
      const newRedirectUrl = redirectUrl.slice(0, -4);
      req.flash("error", "Must Be Signed In");
      return res.redirect(newRedirectUrl);
    }
    req.flash("error", "Must Be Signed In");
    return res.redirect(redirectUrl);
  }
  next();
};

module.exports.isSalonAuthor = async (req, res, next) => {
  const { id } = req.params;
  const salon = await Salon.findById(id);
  if (!salon.salonAuthor.equals(req.user._id)) {
    req.flash("error", "You do not have permission to access this route.");
    return res.redirect("/salons");
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    console
      .log("attempting but failing to delete review that is not mine")
      .toUpperCase();
    req.flash("error", "You do not have permission to delete this review");
    return res.redirect("/salons");
  }
  next();
};

module.exports.validateSalon = (req, res, next) => {
  const { error } = salonValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
