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
  salonLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
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
