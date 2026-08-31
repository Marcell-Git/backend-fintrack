const config = require("../../config/env");
const prisma = require("../../config/database");

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

    const { jwtVerify } = await getJose();
    const { payload } = await jwtVerify(token, await getJwks());
    const authId = payload.sub;
    const username = payload.email || authId;

    const newUser = await prisma.user.upsert({
      where: { auth_id: authId },
      update: {
        username,
        auth_id: authId,
      },
      create: {
        username,
        auth_id: authId,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    });
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
        username: true,
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
