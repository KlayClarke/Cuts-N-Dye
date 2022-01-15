const Salon = require("./models/salon");
const ExpressError = require("../utilities/ExpressError");
const { salonValidatorSchema } = require("../schemas");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Must Be Signed In");
    return res.redirect("back");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const salon = await Salon.findById(id);
  if (!salon.salonAuthor.equals(req.user._id)) {
    req.flash("error", "You do not have permission to access this route.");
    return res.redirect(`/salons/${salon._id}`);
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
