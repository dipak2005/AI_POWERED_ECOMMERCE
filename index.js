const express = require("express");
const mongoose = require("mongoose");
const Product = require("./models/listings.js");
const app = express();
const port = 3000;
const MONGO_URL = "mongodb://localhost:27017/E-Commerce";

app.set("view engine", "ejs");

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", async (req, res) => {
  try {
    const listings = await Product.find({});
    res.render("listings/show", { listings: listings });
  } catch (error) {
    res.status(500).send("Error retrieving data");
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
