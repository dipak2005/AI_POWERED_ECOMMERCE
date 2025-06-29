const Product = require("../models/listings");
const ExpressError = require("../utils/ExpressError");

module.exports.showAllProducts = async (req, res) => {
  try {
    const listings = await Product.find({});
    res.render("listings/show.ejs", { listings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("listings/error.ejs", { message: "Error retrieving data." });
  }
};

module.exports.showProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Product.findById(id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Product not found");
    res.render("listings/err.ejs", { listing });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).render("listings/error", {
      message: error.message || "Something went wrong.",
    });
  }
};
