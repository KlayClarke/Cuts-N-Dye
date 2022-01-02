const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Salon = require("./models/salon");

mongoose.connect("mongodb://localhost:27017/cuts-n-dye");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database Connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/addsalon", async (req, res) => {
//   const shop = new Salon({
//     title: "Better Cut",
//     description: "Stylish cuts and stimulating conversation",
//   });
//   await shop.save();
//   res.send(shop);
// });

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

app.post("/salons", async (req, res) => {
  const salon = new Salon(req.body.salon);
  await salon.save();
  res.redirect(`/salons/${salon._id}`);
});

app.listen(3000, () => {
  console.log("Serving on Port 3000");
});
