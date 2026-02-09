const db = require("../../config/database");

const getAllUsers = async () => {
  const result = await db.query("SELECT id, username, created_at FROM users");
  return result.rows;
};

const createUser = async (username, password) => {
  const result = await db.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username, created_at",
    [username, password],
  );
  return result.rows[0];
};

const getUserById = async (id) => {
  const result = await db.query(
    "SELECT id, username, created_at FROM users WHERE id = $1",
    [id],
  );
  return result.rows[0];
};

const getUserByUsername = async (username) => {
  const result = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByUsername,
};
