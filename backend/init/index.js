const mongoose = require("mongoose");
const Product = require("../models/listings.js");
const data = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/E-Commerce";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}

const initDB = async () => {
  try {
    await Product.deleteMany({});

    await Product.insertMany(data);
    console.log("Data initialized and inserted successfully");
  } catch (error) {
    console.error("Error during DB initialization:", error);
  }
};

main();
