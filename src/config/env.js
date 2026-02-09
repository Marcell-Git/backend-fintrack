require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  db: {
    connectionString: process.env.DATABASE_URL,
  },
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
};
