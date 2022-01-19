const Salon = require("../models/salon");
const findLocation = require("../mapbox");

module.exports.index = async (req, res) => {
  const salons = await Salon.find({}).populate("salonAuthor");
  res.render("salons/", { salons });
};

module.exports.salonCreationForm = (req, res) => {
  res.render("salons/new");
};

module.exports.createNewSalon = async (req, res, next) => {
  const salon = new Salon(req.body.salon);
  const location = await findLocation(req, salon);
  salon.geometry = location;
  salon.salonAuthor = req.user._id;
  await salon.save();
  req.flash("success", "Successfully added new salon!");
  res.redirect(`/salons/${salon._id}`);
};

module.exports.getSalon = async (req, res, next) => {
  const salon = await Salon.findById(req.params.id)
    .populate({
      // nested populate to populate author of reviews that are populated from salon model
      path: "salonReviews",
      populate: {
        path: "author",
      },
    })
    .populate("salonAuthor");
  if (!salon) {
    req.flash("error", "Salon not found");
    res.redirect("/salons");
  } else {
    res.render("salons/show", { salon });
  }
};

module.exports.salonEditForm = async (req, res, next) => {
  const { id } = req.params;
  const salon = await Salon.findById(id);
  if (!salon) {
    req.flash("error", "Salon not found");
    return res.redirect("/salons");
  }
  res.render("salons/edit", { salon });
};

module.exports.editSalon = async (req, res, next) => {
  const { id } = req.params;
  const salon = await Salon.findById(id);
  const salonToUpdate = await Salon.findByIdAndUpdate(id, {
    ...req.body.salon,
  });
  req.flash("success", "Successfully edited salon info!");
  res.redirect(`/salons/${salonToUpdate._id}`);
};

module.exports.deleteSalon = async (req, res, next) => {
  const { id } = req.params;
  const salon = await Salon.findById(id);
  if (!salon) {
    req.flash("error", "Salon not found");
    return res.redirect("/salons");
  }
  await Salon.findByIdAndDelete(id);
  req.flash("success", "Successfully delete salon!");
  res.redirect("/salons");
};
