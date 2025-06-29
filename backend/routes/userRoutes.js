const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateUser } = require("../utils/authMiddleware");

// Public routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Protected routes
router.get("/profile", userController.getProfile);
router.delete("/profile", userController.deleteProfile);

module.exports = router;
