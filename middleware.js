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
