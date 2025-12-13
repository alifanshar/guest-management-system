import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import { jwtConfig } from "../config/jwt.js";

const prisma = new PrismaClient();

// POST: Register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// POST: Login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });

    const payload = { userId: user.id, role: user.role };

    return res.status(200).json({
      success: true,
      message: "Login success",
      data: {
        accessToken: generateAccessToken(payload),
        refreshToken: generateRefreshToken(payload),
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST: Refresh Token
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({
        success: false,
        message: "Refresh token required",
      });

    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);

    const payload = {
      userId: decoded.userId,
      role: decoded.role,
    };

    return res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken: generateAccessToken(payload),
      },
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

// GET: Pengguna saat ini
export const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};
