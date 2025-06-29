const express = require("express");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.post("/listing/review/:id", reviewController.createReview);
router.delete(
  "/listing/review/:productId/:reviewId",
  reviewController.deleteReview
);

module.exports = router;
