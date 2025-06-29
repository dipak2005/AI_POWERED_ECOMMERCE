const Product = require("../models/listings");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).render("listings/error.ejs", {
        message: "Product not found.",
      });
    }

    const newReview = new Review({
      rating: req.body.review.rating,
      comment: req.body.review.comment,
    });

    product.reviews.push(newReview);

    await newReview.save();
    await product.save();

    res.redirect(`/listing/product/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render("listings/error.ejs", {
      message: "Something went wrong while saving the review.",
    });
  }
};

module.exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).render("listings/error.ejs", {
        message: "Product not found.",
      });
    }

    // Find the review to delete
    const review = await Review.findById(reviewId);
    // if (!review) {
    //   return res.status(404).render("listings/error", {
    //     message: "Review not found.",
    //   });
    // }

    // Remove the review from the product's reviews array
    product.reviews = product.reviews.filter(
      (review) => review._id.toString() !== reviewId
    );

    // Save the updated product
    await product.save();

    // Delete the review from the database
    await Review.findByIdAndDelete(reviewId);

    // Redirect to the product page after deletion
    res.status(200).json({ message: "review deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).render("listings/error.ejs", {
      message: error.message,
    });
  }
};
