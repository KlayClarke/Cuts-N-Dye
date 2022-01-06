const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const { salonValidatorSchema } = require("./schemas");
const catchAsync = require("./utilities/CatchAsync");
const ExpressError = require("./utilities/ExpressError");
const Salon = require("./models/salon");

mongoose.connect("mongodb://localhost:27017/cuts-n-dye");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateSalon = (req, res, next) => {
  const { error } = salonValidatorSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/salons",
  catchAsync(async (req, res) => {
    const salons = await Salon.find({});
    res.render("salons/index", { salons });
  })
);

app.get("/salons/new", (req, res) => {
  res.render("salons/new");
});

app.get(
  "/salons/:id",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id);
    res.render("salons/show", { salon });
  })
);

app.get(
  "/salons/:id/edit",
  catchAsync(async (req, res, next) => {
    const salon = await Salon.findById(req.params.id);
    res.render("salons/edit", { salon });
  })
);

app.post(
  "/salons",
  validateSalon,
  catchAsync(async (req, res, next) => {
    const salon = new Salon(req.body.salon);
    await salon.save();
    res.redirect(`/salons/${salon._id}`);
  })
);

app.put(
  "/salons/:id",
  validateSalon,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const salon = await Salon.findByIdAndUpdate(id, { ...req.body.salon });
    res.redirect(`/salons/${salon._id}`);
  })
);

app.delete(
  "/salons/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Salon.findByIdAndDelete(id);
    res.redirect("/salons");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
  res.send("Oh boy, something went wrong");
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
