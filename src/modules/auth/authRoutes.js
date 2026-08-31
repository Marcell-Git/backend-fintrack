const express = require("express");
const router = express.Router();
const authController = require("./authController");
const verifyToken = require("../../shared/middlewares/authMiddleware");

router.post("/register", authController.register);
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
