const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const SalonSchema = new Schema({
  salonName: String,
  salonType: String,
  salonAveragePrice: Number,
  salonImage: String,
  salonStreetAddress: String,
  salonCity: String,
  salonState: String,
  salonZipCode: String,
  salonAuthor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  salonReviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

SalonSchema.post("findOneAndDelete", async function (salon) {
  if (salon) {
    await Review.deleteMany({
      _id: {
        $in: salon.salonReviews,
      },
    });
  }
});

module.exports = mongoose.model("Salon", SalonSchema);
