import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.js";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({
      success: false,
      message: "Authorization header missing",
    });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      success: false,
      message: "Token missing",
    });

  try {
    const decoded = jwt.verify(token, jwtConfig.accessSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
