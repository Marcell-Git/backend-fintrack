const config = require("../../config/env");
const prisma = require("../../config/database");
const {
  seedDefaultCategories,
} = require("../categories/defaultCategories");

let jose = null;
const getJose = async () => {
  if (!jose) jose = await import("jose");
  return jose;
};

let jwks = null;
const getJwks = async () => {
  if (!jwks) {
    const { createRemoteJWKSet } = await getJose();
    jwks = createRemoteJWKSet(new URL(config.supabase.jwksUrl));
  }
  return jwks;
};

const register = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided." });
    }

    try {
      const { jwtVerify } = await getJose();
      const { payload } = await jwtVerify(token, await getJwks());
      const authId = payload.sub;
      const email = payload.email || authId;

      const existingUser = await prisma.user.findUnique({
        where: { auth_id: authId },
        select: { id: true },
      });

      const newUser = await prisma.user.upsert({
        where: { auth_id: authId },
        update: {
          email,
          auth_id: authId,
        },
        create: {
          email,
          auth_id: authId,
        },
      });

      if (!existingUser) {
        await seedDefaultCategories(newUser.id, prisma);
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      });
    } catch (err) {
      console.error("[AUTH:REGISTER]", err?.message || err);
      res.status(400).json({ message: "Invalid token or registration failed." });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token or registration failed." });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        created_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  getMe,
};
