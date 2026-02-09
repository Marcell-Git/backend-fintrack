const express = require("express");
const cors = require("cors");

const app = express();

const configureApp = () => {
  // Global Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Support for multipart/form-data (for text fields)
  const multer = require("multer");
  const upload = multer();
  app.use(upload.none());

  // Root Route
  app.get("/", (req, res) => {
    res.json({
      message: "FinTrack API is running 🚀",
      version: "1.0.0",
    });
  });

  // Modules Routes
  app.use("/api/auth", require("./modules/auth/authRoutes"));
  app.use("/api/users", require("./modules/users/userRoutes"));
  app.use(
    "/api/pengeluaran",
    require("./modules/pengeluaran/pengeluaranRoutes"),
  );

  return app;
};

module.exports = configureApp;
