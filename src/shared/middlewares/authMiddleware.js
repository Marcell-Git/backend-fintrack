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

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const { jwtVerify } = await getJose();
    const { payload } = await jwtVerify(token, await getJwks());
    const authId = payload.sub;

    const user = await prisma.user.findUnique({
      where: { auth_id: authId },
      select: {
        id: true,
        username: true,
        auth_id: true,
      },
    });

    if (!user) {
      return res.status(403).json({
        message: "User not registered. Please sign up first.",
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      auth_id: authId,
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
