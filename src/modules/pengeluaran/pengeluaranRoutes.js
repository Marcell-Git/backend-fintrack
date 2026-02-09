const express = require("express");
const router = express.Router();
const pengeluaranController = require("./pengeluaranController");
const authMiddleware = require("../../shared/middlewares/authMiddleware");

router.use(authMiddleware);

router.post("/", pengeluaranController.createPengeluaran);
router.get("/user/:userId", pengeluaranController.getPengeluaranByUser);
router.get("/user/:userId/month/:month", pengeluaranController.getPengeluaranUserByMonth);

module.exports = router;
