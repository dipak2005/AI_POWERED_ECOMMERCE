const express = require("express");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", productController.showAllProducts);
router.get("/listing/product/:id", productController.showProduct);

module.exports = router;
