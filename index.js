const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
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

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/salons", async (req, res) => {
  const salons = await Salon.find({});
  res.render("salons/index", { salons });
});

app.get("/salons/new", async (req, res) => {
  res.render("salons/new");
});

app.get("/salons/:id", async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  res.render("salons/show", { salon });
});

app.get("/salons/:id/edit", async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  res.render("salons/edit", { salon });
});

app.post("/salons", async (req, res) => {
  const salon = new Salon(req.body.salon);
  await salon.save();
  res.redirect(`/salons/${salon._id}`);
});

app.put("/salons/:id", async (req, res) => {
  const { id } = req.params;
  const salon = await Salon.findByIdAndUpdate(id, { ...req.body.salon });
  res.redirect(`/salons/${salon._id}`);
});

app.delete("/salons/:id", async (req, res) => {
  const { id } = req.params;
  await Salon.findByIdAndDelete(id);
  res.redirect("/salons");
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
