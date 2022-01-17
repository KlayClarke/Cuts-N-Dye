const Review = require("../models/review");
const Salon = require("../models/salon");

module.exports.createReview = async (req, res) => {
  const salon = await Salon.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  salon.salonReviews.push(review);
  await review.save();
  await salon.save();
  req.flash("success", "Successfully added salon review!");
  res.redirect(`/salons/${salon._id}`);
};

module.exports.deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const salon = await Salon.findByIdAndUpdate(id, {
    $pull: { salonReviews: reviewId },
  });
  const review = await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted salon review!");
  res.redirect(`/salons/${id}`);
};
