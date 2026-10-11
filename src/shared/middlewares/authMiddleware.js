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

    let authId;
    try {
      const { jwtVerify } = await getJose();
      const { payload } = await jwtVerify(token, await getJwks());
      authId = payload.sub;
    } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
    }

    const user = await prisma.user.findUnique({
      where: { auth_id: authId },
      select: {
        id: true,
        email: true,
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
      email: user.email,
      auth_id: authId,
    };
    next();
  } catch (error) {
    // Error database/JWKS bukan berarti token tidak valid — jangan bikin user ter-logout
    console.error("Auth middleware error:", error);
    return res.status(503).json({ message: "Service temporarily unavailable." });
  }
};

module.exports = verifyToken;
