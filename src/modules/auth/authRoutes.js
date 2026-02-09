const express = require("express");
const router = express.Router();
const authController = require("./authController");

router.get("/register", (req, res) => {
  res
    .status(405)
    .json({ message: "Method Not Allowed. Use POST to register." });
});
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
