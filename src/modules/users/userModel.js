const prisma = require("../../config/database");

const getAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });
};

const createUser = async (username, password) => {
  return await prisma.user.create({
    data: {
      username,
      password,
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });
};

const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: {
      id: parseInt(id),
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });
};

const getUserByUsername = async (username) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },
  });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  getUserByUsername,
};
