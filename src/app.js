const express = require("express");
require('dotenv/config');
const cors = require("cors");

const app = express();

const configureApp = () => {
  
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  
  const multer = require("multer");
  const upload = multer();
  app.use(upload.none());

  
  app.get("/", (req, res) => {
    res.json({
      message: "FinTrack API is running 🚀",
      version: "1.0.0",
    });
  });

  
  app.use("/api/auth", require("./modules/auth/authRoutes"));
  app.use("/api/users", require("./modules/users/userRoutes"));
  app.use(
    "/api/pengeluaran",
    require("./modules/pengeluaran/pengeluaranRoutes"),
  );
  app.use("/api/categories", require("./modules/categories/categoryRoutes"));

  return app;
};

module.exports = configureApp;
