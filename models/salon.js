const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const opts = { toJSON: { virtuals: true } };

const SalonSchema = new Schema(
  {
    salonName: String,
    salonType: String,
    salonAveragePrice: Number,
    salonImage: String,
    salonStreetAddress: String,
    salonCity: String,
    salonState: String,
    salonZipCode: String,
    geometry: {
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
  },
  opts
);

SalonSchema.virtual("properties.mapPopupHTML").get(function () {
  return `<h6><a href="/salons/${this._id}" class="remove-underline">${this.salonName}</a> ${this.salonCity}, ${this.salonState}</h6>`;
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
