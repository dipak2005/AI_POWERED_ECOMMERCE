const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/listings");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://localhost:27017/E-Commerce";

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// EJS setup
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", async (req, res) => {
  try {
    const listings = await Product.find({});
    res.render("listings/show", { listings });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .render("listings/error", { message: "Error retrieving data." });
  }
});

app.get("/listing/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Product.findById(id).populate("reviews");
    if (!listing) throw new ExpressError(404, "Product not found");
    res.render("listings/specific", { listing });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).render("listings/error", {
      message: error.message || "Something went wrong.",
    });
  }
});

app.post("/listing/review/:id", async (req, res) => {
  try {
    // Find the product by its ID
    const product = await Product.findById(req.params.id);

    // If the product doesn't exist, throw an error
    if (!product) {
      return res.status(404).render("listings/error", {
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
    res.status(500).render("listings/error", {
      message: "Something went wrong while saving the review.",
    });
  }
});

// Error handler for 404 and other errors
app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render("listings/error", {
    message: err.message || "Something went wrong.",
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
