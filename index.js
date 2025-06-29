const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const productRoutes = require("./backend/routes/productRoutes");
const reviewRoutes = require("./backend/routes/reviewRoutes");
const userRoutes = require("./backend/routes/userRoutes");
const ExpressError = require("./backend/utils/ExpressError");

const app = express();
const port = 3000;
const MONGO_URL = "mongodb://localhost:27017/E-Commerce";

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname,'frontend', "views"));


mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(productRoutes);
app.use(reviewRoutes);
app.use(userRoutes);

app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")));
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).render("listings/error", {
    message: err.message || "Something went wrong.",
  });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

app.get('/test-error', (req, res) => {
  res.render('listings/error.ejs', { message: "Test Error View" });
});
