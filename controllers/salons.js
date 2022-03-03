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
  if (salon.salonImage === "" || salon.salonImage === undefined) {
    let lat = location[1];
    let long = location[0];
    fetch(
      `https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${lat},${long}&\
      fov=80&heading=70&pitch=0&amp;key=${process.env.STREET_VIEW_API_KEY}&amp;signature=${process.env.STREET_VIEW_API_SIGNATURE}`
    )
      .then((res) => res.json())
      .then((data) => console.log(data));
  }
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
