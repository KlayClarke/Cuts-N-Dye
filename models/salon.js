const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SalonSchema = new Schema({
  salonName: String,
  salonType: String,
  salonAveragePrice: Number,
  salonImage: String,
  salonStreetAddress: String,
  salonCity: String,
  salonState: String,
  salonZipCode: String,
  salonReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

module.exports = mongoose.model("Salon", SalonSchema);
